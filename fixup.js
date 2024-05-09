import fs from 'node:fs';

const commonJS = '{\n    "type": "commonjs"\n}\n';
const esm = '{\n    "type": "module"\n}\n';

fs.writeFile('dist/cjs/package.json', commonJS, error => {
    if (error) {
        console.error(error);
    }
});

fs.writeFile('dist/mjs/package.json', esm, error => {
    if (error) {
        console.error(error);
    }
});
