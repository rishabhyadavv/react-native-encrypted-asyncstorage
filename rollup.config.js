import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import peerDepsExternal from 'rollup-plugin-peer-deps-external';
import { terser } from 'rollup-plugin-terser';
import babel from '@rollup/plugin-babel';
import typescript from '@rollup/plugin-typescript';

export default {
  input: 'src/index.ts',
  output: [
    {
      file: 'dist/index.js',
      format: 'cjs',
      sourcemap: true,
    },
    {
      file: 'dist/index.es.js',
      format: 'es',
      sourcemap: true,
    },
  ],
  external: [
    'react-native', 'rn-encryption' // Explicitly exclude react-native from bundling
  ],
  plugins: [
    peerDepsExternal(),
    resolve({
      extensions: ['.js', '.ts', '.tsx'],
    }),
    commonjs({
      include: /node_modules/,
      exclude: ['react-native'], // Exclude react-native
    }),
    babel({
      exclude: 'node_modules/**',
      presets: ['@babel/preset-env', '@babel/preset-react'],
      babelHelpers: 'bundled',
    }),
    typescript({
      declaration: true,
      declarationDir: 'dist',
    }),
    terser(),
  ],
};
