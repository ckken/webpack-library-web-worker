const TerserPlugin = require('terser-webpack-plugin')
const HTMLPlugin = require('html-webpack-plugin')
const webpack = require('webpack')
const pkg = require('./package.json')
const path = require('path')
const src = path.resolve(__dirname, 'src')
const dist = path.resolve(__dirname, 'dist')
module.exports = (e, {mode}) => {
  return {
    mode,
    resolve: {
      modules: [path.resolve(__dirname, 'node_modules'), path.resolve(__dirname, 'src'), 'node_modules'],
      alias: {
        src,
      },
      extensions: ['.js', '.jsx', '.ts', '.tsx'],
    },
    entry: {
      'main': path.resolve(src, 'index.js'),
    },
    output: {
      clean:true,
      publicPath: '/',
      path: dist,
      filename: 'index.js',
      // library: {
      //   name: 'lib',
      //   type: 'umd',
      // },
      environment: {
        arrowFunction: false,
        bigIntLiteral: false,
        const: false,
        destructuring: false,
        forOf: false,
        dynamicImport: false,
        module: false,
      },
    },
    module: {
      rules: [
        {
          test: /\.(js|jsx|ts|tsx)$/,
          use: [
            {
              loader: require.resolve('babel-loader'),
              options: {
                presets: [
                  [
                    require.resolve('@babel/preset-env'),
                    {
                      useBuiltIns: 'entry',
                      // debug: true,
                      corejs: 3,
                      loose: true,
                    },
                  ],
                  require.resolve('@babel/preset-typescript'),
                ],
                plugins: [
                  [
                    require.resolve('@babel/plugin-transform-runtime'),
                    {
                      corejs: false,
                      helpers: true,
                      version: require('@babel/runtime/package.json').version,
                      regenerator: true,
                      useESModules: false,
                      absoluteRuntime: true,
                    },
                  ],
                  [require.resolve('@babel/plugin-proposal-decorators'), {legacy: true}],
                  [require.resolve('@babel/plugin-proposal-class-properties'), {loose: true}],
                ],
              },
            },
          ],
        },
      ],
    },
    optimization: {
      // chunkIds: 'named',
      minimize: true,
      minimizer: [
        new TerserPlugin({
          terserOptions: {
            format: {
              comments: false,
            },
          },
          extractComments: false,
        }),
      ],
    },
    plugins: [
      new webpack.DefinePlugin({
        'import.meta.env.MODE': JSON.stringify(mode),
        'import.meta.env.PACKAGE_VERSION': JSON.stringify(pkg.version),
      }),
      new HTMLPlugin({
        template:path.resolve(__dirname,'template/index.html'),
        files:{
          js: [],
          css: []
        }
      })
    ],
    devServer: {
      magicHtml:true,
      static: {
        directory: path.join(__dirname, 'public'),
      },
      compress: true,
      port: 9000,
    },
  }
}
