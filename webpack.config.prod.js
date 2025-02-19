// const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
const webpack = require('webpack');
const commonCfg = require('./webpack.common');

module.exports = Object.assign(
  {
    externals: [
      {
        react: {
          commonjs: 'react',
          commonjs2: 'react',
          amd: 'react',
          root: 'React'
        },
        'react-dom': {
          commonjs: 'react-dom',
          commonjs2: 'react-dom',
          amd: 'react-dom',
          root: 'ReactDOM'
        },
        moment: 'moment',
        antd: 'antd',
        '@ant-design/icons': 'icons'
      }
    ],
    plugins: [
      new webpack.DefinePlugin({
        'ANTD_VERSION': JSON.stringify(4),
      }),
    ]
  },
  commonCfg
);
