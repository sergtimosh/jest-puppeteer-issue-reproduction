import { ENV_CONFIG } from './support/data/env_config.js';
import { utils } from './utils.js';
const { setup: setupPuppeteer } = require('jest-environment-puppeteer');
const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs');

const userName = ENV_CONFIG.USERS.USER_1.NAME
const password = ENV_CONFIG.USERS.USER_1.PASSWORD
const companyName = ENV_CONFIG.COMPANY_NAME

// Connect to the browser created in jest-environment-puppeteer
// so we can perform browser actions once before all tests are run.
module.exports = async function globalSetup() {

    const screenshotDir = path.resolve(__dirname + '/reports/screenshots/')
    //clean up screenshot directory
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

    await setupPuppeteer()

    // connect to puppeteer
    let browser = await puppeteer.connect({
        browserWSEndpoint: process.env.PUPPETEER_WS_ENDPOINT,
    });

    // Open a new page
    let page = await browser.newPage()

    // Log in a user
    try {
        await utils.firstLogin(page, ENV_CONFIG.URL, userName, password)
        await utils.selectCompany(page, companyName)
        await utils.isSelectedCompanyInPopup(page, companyName)
        await utils.submitCompanyPopup(page)
        await utils.isSelectedCompany(page, companyName)
        await page.close()
    } catch (e) {
        const tzoffset = (new Date()).getTimezoneOffset() * 60000
        const localISOTime = (new Date(Date.now() - tzoffset)).toISOString()
        const toFilename = s => s.replace(/[^a-z0-9.\[\]-]+/gi, '_')
        for (let i = 0; i < (await browser.pages()).length; i++) {
            let filePath = path.join(screenshotDir,
                toFilename(`global_setup_select_company_failed_[${i}]_${localISOTime}.png`))
            await ((await browser.pages())[i]).screenshot({
                path: filePath
            })
        }
        console.log('Global setup failed: ' + e)
        return await browser.close()
    }

};