import babel from 'rollup-plugin-babel'
import json from 'rollup-plugin-json'
import resolve from 'rollup-plugin-local-resolve'

export default {
  input: 'src/index.js',
  output: {
    file: 'dist/index.js',
    format: 'cjs'
  },
  plugins: [
    resolve(),
    json({
      exclude: 'node_modules/**'
    }),
    babel({
      babelrc: false,
      exclude: 'node_modules/**',
      presets: [
        '@babel/preset-flow',
        [ '@babel/preset-env', {
          forceAllTransforms: true,
          'modules': false,
          'useBuiltIns': 'entry'
        } ]
      ],
      plugins: [
        '@babel/plugin-external-helpers'
      ]
    })
  ]
}
