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
    
    const sass = require('sass');
    const fs = require('fs');
    const upath = require('upath');

    const results = sass.compile(
    upath.resolve(__dirname, '../src/scss/styles.scss'), // path to entry SCSS
    {
        loadPaths: [
        upath.resolve(__dirname, '../node_modules') // includePaths replacement
        ],
        quietDeps: true // hide warnings from node_modules
    }
    );

    fs.writeFileSync(
    upath.resolve(__dirname, '../css/styles.css'),
    results.css
    );

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
@use "${stylesPath}"
`