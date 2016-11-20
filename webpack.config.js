let webpack = require('webpack');

module.exports = (env={}) => {

    let config = {
        entry: {
            root: './components/root.jsx'
        },
        output: {
            path:     'static',
            filename: '[name].js',
        },
        module: {
            rules: [
                {
                    test: /\.jsx?$/,
                    use: [
                        {
                            loader: 'babel-loader',
                            options: {
                                presets: babelPresets = [
                                    ['es2015', { modules: false }],
                                    'react', 'stage-0'
                                ],
                                plugins: [
                                    'transform-decorators-legacy',
                                    'transform-class-properties'
                                ]
                            }
                        }
                    ]
                },
                {
                    test: /\.scss/,
                    use: [
                        { loader:'style-loader' },
                        { loader:'css-loader?modules&localIdentName=[hash:base64:5]' },
                        { loader:'sass-loader' }
                    ]
                },
                {
                    test: /\.svg$/,
                    use: [
                        { 
                            loader:'svg-url-loader',
                            options: {
                                noquotes: true
                            }
                        },
                        { loader:'svgo-loader' },
                    ]
                },
                {
                    test: /\.json$/,
                    use: [{ loader:'json-loader' }]
                }
            ]
        },
        plugins: [
            new webpack.DefinePlugin({
                __DEV__: env.dev
            }),
            new webpack.ProvidePlugin({
                React: 'react'
            }),
        ]
    }

    if (env.devServer) {
        config.output.path = '/';

        config.devServer = {
            contentBase: __dirname + '/templates'
        };
    }
    
    if (env.dev) {
        config.module.rules.push({
            test: /\.jsx?$/,
            enforce: 'pre',
            loader: 'eslint-loader',
            exclude: /lib/,
            options: {
                configFile: '.eslintrc',
                failOnWarning: false,
                failOnError: false,
                emitError: false,
                fix: true
            }
        })

        // config.devtool = 'source-map';
    }

    if (env.closure) {
        let ClosureCompiler = require('google-closure-compiler-js').webpack;
        config.plugins.push(new ClosureCompiler({
            options: {
                languageIn: 'ECMASCRIPT5',
                languageOut: 'ECMASCRIPT5',
                compilationLevel: 'ADVANCED',
                warningLevel: 'QUIET',
            },
        }));
    }

    return config;
};