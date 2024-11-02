import json from '@rollup/plugin-json'
import resolve from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import camelCase from 'lodash.camelcase'
import typescript from 'rollup-plugin-typescript2'

const libraryName = 'axios'

export default {
  input: `src/index.ts`,
  output: [
    { file: 'dist/axios.umd.js', name: camelCase(libraryName), format: 'umd', sourcemap: true, exports: 'named' },
    { file: 'dist/axios.es5.js', format: 'es', sourcemap: true, exports: 'named' },
  ],
  external: [],
  watch: {
    include: 'src/**',
  },
  plugins: [
    json(),
    typescript({ useTsconfigDeclarationDir: true }),
    commonjs(),
    resolve({
      extensions: ['.js', '.ts', '.json'],
    }),
  ],
}
