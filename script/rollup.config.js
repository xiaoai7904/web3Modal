const rollup = require('rollup');
const resolve = require('rollup-plugin-node-resolve');
const json = require('rollup-plugin-json');
const babel = require('rollup-plugin-babel');
const uglify = require('uglify-js');
const fs = require('fs');
const path = require('path');

const builds = [
  {
    outputOptions: {
      file: './dist/web3Modal.min.js',
      format: 'umd',
      name: 'web3Modal.min'
    },
    inputOptions: {
      input: './src/index.js',
      plugins: [
        resolve(),
        json(),
        babel({
          exclude: 'node_modules/**'
        })
      ]
    }
  },
  {
    outputOptions: {
      file: './dist/web3Modal.js',
      format: 'umd',
      name: 'web3Modal'
    },
    inputOptions: {
      input: './src/index.js',
      plugins: [resolve(), json()]
    }
  },
  {
    outputOptions: {
      file: './dist/web3Modal.es5.js',
      format: 'umd',
      name: 'web3Modal.es5'
    },
    inputOptions: {
      input: './src/index.js',
      plugins: [
        resolve(),
        json(),
        babel({
          exclude: 'node_modules/**'
        })
      ]
    }
  }
];
async function build(builds) {
  for (let i = 0, len = builds.length; i < len; i++) {
    // create a bundle
    const bundle = await rollup.rollup(builds[i].inputOptions);

    // generate code and a sourcemap
    const { code, map } = await bundle.generate(builds[i].outputOptions);
    let _codes = code;
    if (builds[i].outputOptions.name.indexOf('.min') > -1) {
      _codes = uglify.minify(code).code;
    }
    fs.writeFile(path.resolve(__dirname, '../', `dist/${builds[i].outputOptions.name}.js`), _codes, err => {
      if (err) {
        console.log(err);
      }
    });
  }
}

build(builds);