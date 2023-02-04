// import commonjs from 'rollup-plugin-commonjs'

export default {
  input: './es6/maia-gui.js',
  output: {
    file: './maia-gui.js',
    format: 'iife',
    name: 'mg'
  }
  // ,plugins :[ commonjs() ]
}
