// rollup.config.js
import { uglify } from 'rollup-plugin-uglify';
import babel from 'rollup-plugin-babel';

const config = {
  input: './src/index.js',
  external: ['react'],
  output: {
    file: 'dist/react-smart-menu.js',
    format: 'umd',
    name: 'react-smart-menu',
    globals: {
      react: 'React',
    },
  },
  plugins: [
    babel({
      exclude: 'node_modules/**',
    }),
    uglify(),
  ],
};

export default config;
