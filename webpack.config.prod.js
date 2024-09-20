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
      '@mybricks/rxui': {
        commonjs: '@mybricks/rxui',
        commonjs2: '@mybricks/rxui',
        amd: '@mybricks/rxui',
        root: 'rxui'
      },
      'element-plus': {
        commonjs: 'element-plus',
        commonjs2: 'element-plus',
        amd: 'element-plus',
        root: 'ElementPlus'
      },
      vue: {
        commonjs: 'vue',
        commonjs2: 'vue',
        amd: 'vue',
        root: 'Vue'
      },
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
      '@ks/yoda-js-sdk': {
        commonjs: '@ks/yoda-js-sdk',
        commonjs2: '@ks/yoda-js-sdk',
        amd: '@ks/yoda-js-sdk',
        root: 'Yoda'
      },
      moment: 'moment',
      'm-ui': 'm-ui',
      antd: 'antd',
      '@m-ui/icons': 'icons',
      '@ant-design/icons': 'icons',
      '@ant-design/charts': 'charts',
      '@es/code-editor': 'code-editor',
      '@formily/core': {
        commonjs: '@formily/core',
        commonjs2: '@formily/core',
        amd: '@formily/core',
        root: ['Formily', 'Core']
      },
      '@formily/react': {
        commonjs: '@formily/react',
        commonjs2: '@formily/react',
        amd: '@formily/react',
        root: ['Formily', 'React']
      },
      '@formily/reactive': {
        commonjs: '@formily/reactive',
        commonjs2: '@formily/reactive',
        amd: '@formily/reactive',
        root: ['Formily', 'Reactive']
      },
      '@formily/path': {
        commonjs: '@formily/path',
        commonjs2: '@formily/path',
        amd: '@formily/path',
        root: ['Formily', 'Path']
      },
      '@formily/shared': {
        commonjs: '@formily/shared',
        commonjs2: '@formily/shared',
        amd: '@formily/shared',
        root: ['Formily', 'Shared']
      },
      '@formily/reactive-react': {
        commonjs: '@formily/reactive-react',
        commonjs2: '@formily/reactive-react',
        amd: '@formily/reactive-react',
        root: ['Formily', 'ReactiveReact']
      },
      '@formily/json-schema': {
        commonjs: '@formily/json-schema',
        commonjs2: '@formily/json-schema',
        amd: '@formily/json-schema',
        root: ['Formily', 'JsonSchema']
      },
      '@formily/antd': {
        commonjs: '@formily/antd',
        commonjs2: '@formily/antd',
        amd: '@formily/antd',
        root: ['Formily', 'Antd']
      }
    }
  ]
}