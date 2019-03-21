import resolve from 'rollup-plugin-node-resolve';
import babel from 'rollup-plugin-babel';
import { uglify } from 'rollup-plugin-uglify';
import filesize from 'rollup-plugin-filesize';
import copy from 'rollup-plugin-copy';


export default args => ({
  input: 'src/index.js',
  output: {
    file: 'dist/bundle.js',
    format: 'iife',
    sourcemap: true
  },
  plugins: [
    resolve(),
    babel(),
    uglify(),
    copy({
      'src/styles/styles.css': 'dist/styles.css'
    }),
    filesize()
  ]
});
