const { setup: setupPuppeteer } = require('jest-environment-puppeteer');
// const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs');

// Connect to the browser created in jest-environment-puppeteer
// so we can perform browser actions once before all tests are run.
module.exports = async function globalSetup(globalConfig) {
    let OS = process.platform
    console.log(`\nOS: ${OS}`) //log operating system
    const screenshotDir = path.resolve(__dirname + '/reports/screenshots/')
    //clean up screenshot directory before test run
    fs.readdir(screenshotDir, (err, files) => {
        if (err) throw err;
        for (const file of files) {
            if (file.endsWith('.png')) {
                fs.unlink(path.join(screenshotDir, file), err => {
                    if (err) throw err
                })
            }
        }
    })

    await setupPuppeteer(globalConfig)
    //Here some pre all test actions can be performed

};