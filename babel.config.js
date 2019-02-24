module.exports = {
  presets: ['@babel/react', ['@babel/env', { loose: true }]],
  plugins: [['@babel/plugin-proposal-class-properties', { loose: true }]],
  comments: false,
};
