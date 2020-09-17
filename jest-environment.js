const path = require('path');
const PuppeteerEnvironment = require('jest-environment-puppeteer');
require('jest-circus');


class JestEnvironment extends PuppeteerEnvironment {

  async setup() {
    await super.setup()
    //to fix issue uncomment next two lines
    // const incognitoContext = await this.global.browser.createIncognitoBrowserContext()
    // this.global.page = await incognitoContext.newPage()

  }

  async teardown() {
    // await new Promise(resolve => setTimeout(resolve, 1800)) - after updated of jest and Jest Circus timeout not needed
    await super.teardown()
  }

}

module.exports = JestEnvironment;