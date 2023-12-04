module.exports = {
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        use: [
          {
            loader: 'babel-loader',
            options: {
              presets: ['@babel/preset-env', '@babel/preset-react'],
              plugins: [
                ['@babel/plugin-proposal-class-properties', { loose: true }],
                ['@babel/plugin-proposal-private-methods', { loose: true }],
                [
                  '@babel/plugin-proposal-private-property-in-object',
                  { loose: true }
                ]
              ],
              cacheDirectory: true
            }
          }
        ]
      },
      {
        test: /\.tsx?$/,
        use: [
          {
            loader: 'babel-loader',
            options: {
              presets: [
                '@babel/preset-env',
                '@babel/preset-react'
              ],
              plugins: [
                ['@babel/plugin-proposal-class-properties', { 'loose': true }],
                ['@babel/plugin-proposal-private-methods', { 'loose': true }],
                ["@babel/plugin-proposal-private-property-in-object", { "loose": true }]
              ],
              cacheDirectory: true
            }
          },
          {
            loader: 'ts-loader',
            options: {
              silent: true,
              transpileOnly: true,
              compilerOptions: {
                sourceMap: true,
                module: 'es2015',
                target: 'es5',
                lib: ['dom', 'es2016', 'dom.iterable', 'esnext'],
                noImplicitAny: false,
                allowJs: true,
                skipLibCheck: true,
                esModuleInterop: true,
                experimentalDecorators: true,
                emitDecoratorMetadata: true,
                allowSyntheticDefaultImports: true,
                strict: true,
                forceConsistentCasingInFileNames: true,
                moduleResolution: 'node',
                resolveJsonModule: true,
                isolatedModules: true,
                noEmit: true,
                jsx: 'react'
              }
            }
          }
        ]
      }
    ]
  },
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
      '@ant-design/icons': 'icons',
      '@ant-design/charts': 'charts',
    }
  ]
}