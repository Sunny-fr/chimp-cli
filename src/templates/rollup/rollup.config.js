import babel from 'rollup-plugin-babel';
import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import postcss from 'rollup-plugin-postcss';
import peerDepsExternal from 'rollup-plugin-peer-deps-external';
import {terser} from 'rollup-plugin-terser'

export default {
    input: './src/index.js',

    output: [
        {
            name: 'comlib',
            sourcemap: false,
            file: './build/bundle.js',
            format: 'umd',
            globals: { react: 'React' },
        },
    ],

    plugins: [
        peerDepsExternal(),
        postcss({
            output: './build/bundle.css',
            extract: true,
            modules: true,
            use: ['sass'],
            minimize: true
        }),
        babel({ exclude: 'node_modules/**' }),
        resolve(),
        commonjs(),
        terser()
    ],

    external: ['react', 'react-dom'],
};