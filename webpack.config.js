const path              = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
  context: path.resolve(__dirname, 'src/js'),

  entry: {
    basic:    './basic.js',
    implicit: './implicit.js',
    mobile:   './mobile.js',
    register: './register.js'
  },

  output: {
    path:           path.resolve(__dirname, 'dist/js'),
    filename:       '[name].bundle.js',
    library:        'Page',
    libraryTarget:  'var'
  },

  plugins: [
    new CopyWebpackPlugin([
      {
        context: path.resolve(__dirname, 'src/content'),
        from:    '**/*',
        to:      path.resolve(__dirname, 'dist')
      },
      {
        context: path.resolve(__dirname, 'src'),
        from:    'css/**/*',
        to:      path.resolve(__dirname, 'dist')
      }
    ])
  ]
};
