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
        'flow',
        [ 'env', {
          forceAllTransforms: true,
          'modules': false,
          'useBuiltIns': 'entry'
        } ]
      ],
      plugins: [
        'external-helpers',
        'transform-object-rest-spread'
      ]
    })
  ]
}
