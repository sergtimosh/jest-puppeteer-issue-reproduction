const path = require('path');
const PuppeteerEnvironment = require('jest-environment-puppeteer');
require('jest-circus');


class JestEnvironment extends PuppeteerEnvironment {

  async setup() {
    await super.setup()
    //https://stackoverflow.com/questions/49934994/parallel-support-using-jest-with-puppeteer
    //https://stackoverflow.com/questions/48317725/is-it-safe-to-run-multiple-instances-of-puppeteer-at-the-same-time
    const incognitoContext = await this.global.browser.createIncognitoBrowserContext()
    this.global.page = await incognitoContext.newPage()
    // await this.global.page._client.send('Network.clearBrowserCookies'); // clears cookies before test
    this.global.page.setDefaultTimeout(10000) //default timeout for waitForSelector() and etc.
    this.global.page.bringToFront()
  }

  async teardown() {
    // await new Promise(resolve => setTimeout(resolve, 1800)) - after updated of jest and Jest Circus timeout not needed
    await super.teardown()
  }

  async handleTestEvent(event, state) {
    //test failure
    if (event.name === 'test_fn_failure') {
      if (state.currentlyRunningTest.invocations > 0) {
        const testName = state.currentlyRunningTest.name;
        const screenshotsFolder = path.resolve(__dirname + '/reports/screenshots/');
        const toFilename = s => s.replace(/[^a-z0-9.-]+/gi, '_');
        const tzoffset = (new Date()).getTimezoneOffset() * 60000
        const localISOTime = (new Date(Date.now() - tzoffset)).toISOString()
        const filePath = path.join(screenshotsFolder,
          toFilename(`${localISOTime}_${testName}.png`))

        try {
          await this.global.page.screenshot({ path: filePath })
        } catch (e) {
          console.log(e)
        }
      }
    }
    //hook failure
    if (event.name === 'hook_failure') {
      const testName = 'hook_failure';
      const screenshotsFolder = path.resolve(__dirname + '/reports/screenshots/');
      const toFilename = s => s.replace(/[^a-z0-9.-]+/gi, '_');
      const tzoffset = (new Date()).getTimezoneOffset() * 60000
      const localISOTime = (new Date(Date.now() - tzoffset)).toISOString()
      const filePath = path.join(screenshotsFolder,
        toFilename(`${localISOTime}_${testName}.png`))

      try {
        await this.global.page.screenshot({ path: filePath })
      } catch (e) {
        console.log(e)
      }
    }

  }
}

module.exports = JestEnvironment;