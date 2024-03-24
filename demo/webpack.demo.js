import path from 'path';
import fs from 'fs';
import webpack from 'webpack';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import HtmlWebpackPlugin from 'html-webpack-plugin'

// import ForkTsCheckerWebpackPlugin from 'fork-ts-checker-webpack-plugin';


const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default {
  mode: 'development',
  entry: {
    'demo': path.resolve(__dirname),
  },

  resolve: {
    alias: {
      '@': path.resolve(__dirname, '../src/'),
    },
    mainFields: ['module', 'browser', 'main'],
    extensions: ['.webpack.js', '.web.js', '.ts', '.tsx', '.js'],
    modules: [path.resolve(__dirname, '../node_modules'), path.resolve(__dirname, '../src')],
  },

  output: {
    publicPath: 'https://localhost:9780/',
    filename: '[name].dev.js',
    crossOriginLoading: 'anonymous',
    devtoolModuleFilenameTemplate: 'demo://[namespace]/[resource-path]?[loaders]',
  },

  module: {
    rules: [
      {
        test: /\.[t|j]sx?$/,
        include: /(src|demo)\//,
        use: [
          { loader: 'ts-loader', options: { allowTsInNodeModules: true, transpileOnly: true } },
        ],
      },
    ],
  },

  optimization: {
    concatenateModules: true,
    usedExports: true,
  },

  plugins: [
    new webpack.ProvidePlugin({
      process: 'process/browser',
    }),
    new webpack.EnvironmentPlugin({
      NODE_ENV: 'development', // use 'development' unless process.env.NODE_ENV is defined
      COMPILE_TIME: `Compiled @ ${new Date().toTimeString().split(' ')[0]}`,
    }),
    new HtmlWebpackPlugin()
    // new ForkTsCheckerWebpackPlugin(),
  ],
  devtool: 'eval-source-map',
  target: 'web',
  profile: true,
  bail: true,
  devServer: {
    hot: false,
    liveReload: false,
    client: {
      logging: 'error',
    },
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': '*',
      'Access-Control-Allow-Methods': 'GET, POST',
    },
    server: {
      type: 'https',
      options: {
        cert: fs.readFileSync('../bordeaux/.certs/local.pem'),
        key: fs.readFileSync('../bordeaux/.certs/local.key'),
      },
    },
    historyApiFallback: true,
    allowedHosts: 'all',
    port: 9780,
    host: 'localhost',
  },
};
