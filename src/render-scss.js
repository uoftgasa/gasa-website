'use strict';
const autoprefixer = require('autoprefixer')
const fs = require('fs');
const packageJSON = require('../package.json');
const upath = require('upath');
const postcss = require('postcss')
const sass = require('sass');
const sh = require('shelljs');

const stylesPath = '../src/scss/styles.scss';
const destPath = upath.resolve(upath.dirname(__filename), '../css/styles.css');

module.exports = function renderSCSS() {
    
    // Use the modern Dart Sass JS API and compile the real stylesheet file so
    // `@use` module resolution (including packages like "bootstrap") works.
    const entryFile = upath.resolve(upath.dirname(__filename), stylesPath);
    const results = sass.compile(entryFile, {
        loadPaths: [
            upath.resolve(upath.dirname(__filename), '../node_modules')
        ],
        style: 'expanded',
        quietDeps: true,
    });

    const destPathDirname = upath.dirname(destPath);
    if (!sh.test('-e', destPathDirname)) {
        sh.mkdir('-p', destPathDirname);
    }

    // sass.compile returns an object with .css string. Prepend the banner
    // comment to match previous behavior.
    const banner = `/*!
* Start Bootstrap - ${packageJSON.title} v${packageJSON.version} (${packageJSON.homepage})
* Copyright 2013-${new Date().getFullYear()} ${packageJSON.author}
* Licensed under ${packageJSON.license} (https://github.com/StartBootstrap/${packageJSON.name}/blob/master/LICENSE)
*/\n`;
    const cssOutput = banner + results.css;
    postcss([ autoprefixer ]).process(cssOutput, {from: 'styles.css', to: 'styles.css'}).then(result => {
        result.warnings().forEach(warn => {
            console.warn(warn.toString())
        })
        fs.writeFileSync(destPath, result.css.toString());
    })

};

const entryPoint = `/*!
* Start Bootstrap - ${packageJSON.title} v${packageJSON.version} (${packageJSON.homepage})
* Copyright 2013-${new Date().getFullYear()} ${packageJSON.author}
* Licensed under ${packageJSON.license} (https://github.com/StartBootstrap/${packageJSON.name}/blob/master/LICENSE)
*/
@import "${stylesPath}"
`