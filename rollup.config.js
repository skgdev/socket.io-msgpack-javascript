import babel from '@rollup/plugin-babel';
import commonjs from '@rollup/plugin-commonjs';
import resolve from '@rollup/plugin-node-resolve';

import pkg from './package.json';

export default {
    input: './index.js',
    output: [
        {
            file: pkg.main,
            format: 'cjs',
            sourcemap: true,
        },
        {
            file: pkg.module,
            format: 'es',
            sourcemap: true,
        },
    ],
    plugins: [
        resolve({
            mainFields: ['module'],
            extensions: ['.js'],
        }),
        commonjs(),
        babel({
            exclude: 'node_modules/**',
        }),
    ],
};
