// Initial requires and args
var path    = require('path');
var webpack = require('webpack');
var args    = process.argv.slice(2);

// Webpack plugins
var CommonsChunkPlugin = webpack.optimize.CommonsChunkPlugin;
var HtmlWebpackPlugin  = require('html-webpack-plugin');
var ExtractTextPlugin  = require('extract-text-webpack-plugin');
var CopyWebpackPlugin  = require('copy-webpack-plugin');

module.exports = (function makeWebpackConfig() {
    /**
     * Environment type
     * BUILD is for generating minified builds
     */
    var BUILD = args.indexOf('--webpack-build') !== -1 || process.env['webpack-build'];

    /**
     * Config
     * Reference: http://webpack.github.io/docs/configuration.html
     * This is the object where all configuration gets set
     */
    var config = {};

    /**
     * Devtool
     * Reference: http://webpack.github.io/docs/configuration.html#devtool
     * Type of sourcemap to use per build type
     */
    if (BUILD) {
        config.devtool = 'source-map';
    } else {
        config.devtool = 'eval-source-map';
    }

    // add debug messages
    config.debug = !BUILD;

    /**
     * Entry
     * Reference: http://webpack.github.io/docs/configuration.html#entry
     */
    config.entry = {
        'vendor': './src/vendor.ts',
        'app': './src/bootstrap.ts'
    };

    /**
     * Output
     * Reference: http://webpack.github.io/docs/configuration.html#output
     */
    config.output = {
        path: root('dist'),
        //publicPath: '/',
        filename: 'js/[name].js',
        chunkFilename: BUILD ? '[id].chunk.js?[hash]' : '[id].chunk.js'
    };

    /**
     * Resolve
     * Reference: http://webpack.github.io/docs/configuration.html#resolve
     */
    config.resolve = {
        cache: true,
        root: root(),
        extensions: ['', '.ts', '.js', '.json', '.css', '.scss', '.html'],
        alias: {
            'app': 'src/app'
        }
    };

    /**
     * Loaders
     * Reference: http://webpack.github.io/docs/configuration.html#module-loaders
     * List: http://webpack.github.io/docs/list-of-loaders.html
     * This handles most of the magic responsible for converting modules
     */
    config.module = {
        preLoaders: [{test: /\.ts$/, loader: 'tslint'}],
        loaders: [
            // Support for .ts files.
            {
                test: /\.ts$/,
                loader: 'ts',
                query: {
                    'ignoreDiagnostics': [
                        2403, // 2403 -> Subsequent variable declarations
                        2300, // 2300 -> Duplicate identifier
                        2374, // 2374 -> Duplicate number index signature
                        2375  // 2375 -> Duplicate string index signature
                    ]
                },
                exclude: [/node_modules\/(?!(ng2-.+))/]
            },

            // copy those assets to output
            {test: /\.(png|jpe?g|gif|svg|woff|woff2|ttf|eot|ico)$/, loader: 'file?name=[path][name].[ext]?[hash]'},

            // Support for *.json files.
            {test: /\.json$/, loader: 'json'},

            // Support for CSS as raw text
            // all css in src/style will be bundled in an external css file
            {test: /\.css$/, exclude: root('src','app'), loader: ExtractTextPlugin.extract('style', 'css?sourceMap')},
            // all css required in src/app files will be merged in js files
            {test: /\.css$/, exclude: root('src', 'styles'), loader: 'raw'},

            // support for .scss files
            // all scss in src/style will be bundled in an external css file
            {test: /\.scss$/, exclude: root('src', 'app'), loader: ExtractTextPlugin.extract('style', 'css?sourceMap!sass?includePaths[]=' + path.resolve(__dirname, 'node_modules'))},
            // all scss required in src/app files will be merged in js files
            {test: /\.scss$/, exclude: root('src', 'styles'), loader: 'raw!sass?includePaths[]=' + path.resolve(__dirname, 'node_modules')},

            // support for .html as raw text
            // todo: change the loader to something that adds a hash to images
            {test: /\.html$/, loader: 'raw'}
        ],
        postLoaders: [],
        noParse: [/.+zone\.js\/dist\/.+/, /.+angular2\/bundles\/.+/, /angular2-polyfills\.js/]
    };

    /**
     * Plugins
     * Reference: http://webpack.github.io/docs/configuration.html#plugins
     * List: http://webpack.github.io/docs/list-of-plugins.html
     */
    config.plugins = [];

    config.plugins.push(
        // Generate common chunks if necessary
        // Reference: https://webpack.github.io/docs/code-splitting.html
        // Reference: https://webpack.github.io/docs/list-of-plugins.html#commonschunkplugin
        new CommonsChunkPlugin({
            name: 'vendor',
            filename: 'js/[name].js',
            minChunks: Infinity
        }),
        new CommonsChunkPlugin({
            name: 'common',
            filename: 'js/[name].js',
            minChunks: 2,
            chunks: ['app', 'vendor']
        }),

        // Inject paths into html files
        // Reference: https://github.com/ampedandwired/html-webpack-plugin
        new HtmlWebpackPlugin({
            template: './src/public/index.html',
            inject: 'body',
            hash: true, // inject ?hash at the end of the files
            chunksSortMode: function compare(a, b) {
                // common always first
                if(a.names[0] === 'common') {
                    return -1;
                }
                // app always last
                if(a.names[0] === 'app') {
                    return 1;
                }
                // vendor before app
                if(a.names[0] === 'vendor' && b.names[0] === 'app') {
                    return -1;
                } else {
                    return 1;
                }
                // a must be equal to b
                return 0;
            }
        }),

        // Extract css files
        // Reference: https://github.com/webpack/extract-text-webpack-plugin
        // Disabled when not in build mode
        new ExtractTextPlugin('css/[name].css', {disable: !BUILD })
    );
    
    // Add build specific plugins
    if(BUILD) {
        config.plugins.push(
            // Reference: http://webpack.github.io/docs/list-of-plugins.html#noerrorsplugin
            // Only emit files when there are no errors
            new webpack.NoErrorsPlugin(),

            // Reference: http://webpack.github.io/docs/list-of-plugins.html#dedupeplugin
            // Dedupe modules in the output
            new webpack.optimize.DedupePlugin(),

            // Reference: http://webpack.github.io/docs/list-of-plugins.html#occurenceorderplugin
            // Assign the module and chunk ids by occurrence count.
            new webpack.optimize.OccurenceOrderPlugin(),

            // Reference: http://webpack.github.io/docs/list-of-plugins.html#uglifyjsplugin
            // Minify all javascript, switch loaders to minimizing mode
            new webpack.optimize.UglifyJsPlugin({
                // disabled for beta.1 because it was breaking the build, todo: remove this once fixed
                // reference: https://github.com/angular/angular/issues/6366
                // reference: https://github.com/angular/angular/issues/6380
                mangle: false
            }),

            // Copy assets from the public folder
            // Reference: https://github.com/kevlened/copy-webpack-plugin
            new CopyWebpackPlugin([{
                from: root('src/public')
            }])
        );
    }

    /**
     * Sass
     * Reference: https://github.com/jtangelder/sass-loader
     * Transforms .scss files to .css
     */
    config.sassLoader = {
        //includePaths: [path.resolve(__dirname, "node_modules/foundation-sites/scss")]
    };

    /**
     * Dev server configuration
     * Reference: http://webpack.github.io/docs/configuration.html#devserver
     * Reference: http://webpack.github.io/docs/webpack-dev-server.html
     */
    config.devServer = {
        historyApiFallback: true,
        contentBase: './src/public'
    };

    return config;
})();

// Helper functions
function root(args) {
    args = Array.prototype.slice.call(arguments, 0);
    return path.join.apply(path, [__dirname].concat(args));
}

function rootNode(args) {
    args = Array.prototype.slice.call(arguments, 0);
    return root.apply(path, ['node_modules'].concat(args));
}
