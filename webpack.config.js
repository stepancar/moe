
var webpack = require('webpack');
var path = require('path');
var configuration = getCLIParam("configuration", "Test");
console.log("webpack runned in " + configuration + " configuration");
module.exports = {
    context: __dirname,
    entry: './src/index.tsx',
    output: {
        path: path.resolve(__dirname, './public/'),
        filename: './out.js'
    },
    resolve: {
        extensions: ['', '.js', '.ts', '.tsx']
    },
    module: {
        loaders: [
            { test: /\.ts(x?)$/, loader: 'ts-loader' },
            {
                test: /\.scss$/,
                loader: 'style-loader!css-loader!autoprefixer-loader!sass-loader?outputStyle=expanded'
            },
            {
                test: /\.css$/,
                loader: 'style-loader!css-loader'
            },
            {
                test: /\.(png|jpg|jpeg|gif|svg|woff|woff2)$/,
                loader: require.resolve('url-loader') + '?limit=8192&name=Content/[name].[ext]'
            }
        ]
    },
    plugins: configuration === "Release" ? [
        new webpack.optimize.UglifyJsPlugin({ minimize: true }),
        new webpack.ContextReplacementPlugin(/moment[\/\\]locale$/, /ru/)
    ] : [],
    ts: {
        compilerOptions: {
            "noEmit": false
        }
    }
}
function isCLIParamExists(nameOfArgument) {
    return process.argv.indexOf(nameOfArgument) != -1;
}
function getCLIParam(cliParamName, defaultValue) {

    for (var i = 0; i < process.argv.length; i++) {
        if (process.argv[i].indexOf(cliParamName) != -1) {
            var configurationParamString = process.argv[i];
            return configurationParamString.slice(configurationParamString.indexOf('=') + 1);
        }
        else continue;
    }
    return defaultValue;
}
