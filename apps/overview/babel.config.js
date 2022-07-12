module.exports = {
  babelrcRoots: ['.'],
  presets: [
    [
      '@babel/preset-env',
      {
        corejs: '3.8.3',
        useBuiltIns: 'usage'
      }
    ]
  ],
}
