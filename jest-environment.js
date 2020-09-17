const PuppeteerEnvironment = require('jest-environment-puppeteer');


class JestEnvironment extends PuppeteerEnvironment {

  async setup() {
    await super.setup()
    //to fix issue uncomment next two lines
    // const incognitoContext = await this.global.browser.createIncognitoBrowserContext()
    // this.global.page = await incognitoContext.newPage()

  }

  async teardown() {
    await super.teardown()
  }

}

module.exports = JestEnvironment;