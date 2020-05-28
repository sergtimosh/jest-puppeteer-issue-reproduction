export const basicHelper = {

  //Actions
  async clickElementByTextContent(selector, text) {
    await this.isElementHasTextContent(selector, text)
    const elHandle = await page.evaluateHandle((selector, text) => {
      return [...(document.querySelectorAll(selector))]
        .filter(el => el.textContent.trim() === text)[0]
    }, selector, text)
    await elHandle.click()
  },

  async clickElementByInnerText(selector, text) {
    await this.isElementHasTextContent(selector, text)
    const elHandle = await page.evaluateHandle((selector, text) => {
      return [...(document.querySelectorAll(selector))]
        .filter(el => el.innerText.trim() === text)[0]
    }, selector, text)
    await elHandle.click()
  },

  async clickElementSkipChildrenText(selector, text) {
    await page.waitForSelector(selector, {
      timeout: 5000,
      visible: true
    })
      .catch(() => console.log(selector + 'Element not exist!'))
    await page.$$eval(selector, (el, text) => {
      el.filter(el => el.childNodes[0].nodeValue === text)[0]
        .click()
    }, text)
  },

  async clickElement(selector, timeout = 2000) {
    await page.waitForSelector(selector, { timeout: timeout })
    await page.evaluate((selector) => {
      document.querySelector(selector).click()
    }, selector)
  },

  async clear(selector) {
    await page.evaluate(selector => {
      document.querySelector(selector).value = "";
    }, selector);
  },

  async selectElementOption(css, text, i = 0) {
    await page.evaluate((css, text, i) => {
      let sel = [...document.querySelectorAll(css)][i]
      for (let option of [...document.querySelectorAll(css + ' option')]) {
        if (option.textContent === text) {
          sel.value = option.value
        }
      }
    }, css, text, i)
  },

  async selectOptionOfElementHandle(handle, text) {
    await page.evaluate((handle, text) => {
      for (let option of handle.options) {
        if (option.textContent === text) {
          handle.value = option.value
        }
      }
    }, handle, text)
  },

  async clickUntilInputNotReadOnly(selector, i = 0) {
    const inputHandle = await page.evaluateHandle((selector, i) => {
      return [...(document.querySelectorAll(selector))]
        .filter(el => el.offsetHeight !== 0)[i]
    }, selector, i)
    let startTime = Date.now()
    do {
      await inputHandle.click()
    } while (await this.isElementReadOnly(selector, i)
      && Date.now() - startTime < 3000)
  },

  async pressEnterUntilInputIsReadOnly(selector, inputHandle, i = 0) {
    let startTime = Date.now()
    let count = 0
    do {
      ++count
      await inputHandle.press('Enter')
    } while (
      !(await this.isElementReadOnly(selector, i))
      && Date.now() - startTime < 3000)
    console.log(selector + ' Enter pressed - ' + count + ' times')
  },

  async typeWord(word) {
    var splitWord = word.split('')
    splitWord.forEach(async key => {
      await page.keyboard.press(key)
    })
  },

  async clearTabs() {
    const tabs = await browser.pages()
    if (tabs.length > 2) {
      for (let i = 2; i < tabs.length; i++) {
        (await browser.pages())[i].close()
      }
    }
  },

  async selectLastTab() {
    const tabs = await browser.pages()
    const tabCount = tabs.length
    const newTab = tabs[tabCount - 1]
    return newTab

  },

  async sendTwoKeysKombo(key1, key2) {
    await page.keyboard.down(key1)
    await page.keyboard.press(key2)
    await page.keyboard.up(key1)
  },

  //Setters
  async setFormInputValue(selector, value, i) {
    const inputHandle = await page.evaluateHandle((selector, i) => {
      return [...(document.querySelectorAll(selector))]
        .filter(el => el.offsetHeight !== 0)[i]
    }, selector, i)
    await this.clickUntilInputNotReadOnly(selector, i)
    await page.evaluate((selector, i, value) => {
      [...document.querySelectorAll(selector)]
        .filter(el => el.offsetHeight !== 0)[i]
        .value = value
    }, selector, i, value)
    await this.clickUntilInputNotReadOnly(selector, i)
    await this.waitForInputNotEmpty(selector, i)
    await this.pressEnterUntilInputIsReadOnly(selector, inputHandle, i)
  },

  async setFormInputValueNotEnter(selector, value, i = 0) {
    const inputHandle = await page.evaluateHandle((selector, i) => {
      return [...(document.querySelectorAll(selector))]
        .filter(el => el.offsetHeight !== 0)[i]
    }, selector, i)
    await this.clickUntilInputNotReadOnly(selector, i)
    await page.evaluateHandle((input, value) => input.value = value, inputHandle, value)
  },

  async setFormInputValueByHandle(handle, value) {
    await page.evaluate((input, value) => input.value = value, handle, value)
    await handle.evaluate(el => el.dispatchEvent(new Event('change')))
  },

  async searchInFormInputValue(selector, value, i) {
    const inputHandle = await page.evaluateHandle((selector, i) => {
      return [...(document.querySelectorAll(selector))]
        .filter(el => el.offsetHeight !== 0)[i]
    }, selector, i)
    await this.clickUntilInputNotReadOnly(selector, i)
    await page.keyboard.press('F11')
    await this.waitForInputInQueryMode(selector)
    await page.evaluate((selector, i, value) => {
      [...document.querySelectorAll(selector)]
        .filter(el => el.offsetHeight !== 0)[i]
        .value = value
    }, selector, i, value)
    // await this.clickUntilInputNotReadOnly(selector, inputHandle, i)
    await this.waitForInputNotEmpty(selector, i)
    await this.pressEnterUntilInputIsReadOnly(selector, inputHandle, i)
  },

  async searchInFormReadOnlyInputValue(selector, value, i) {
    const inputHandle = await page.evaluateHandle((selector, i) => {
      return [...(document.querySelectorAll(selector))]
        .filter(el => el.offsetHeight !== 0)[i]
    }, selector, i)
    await page.keyboard.press('F11')
    await page.evaluate((selector, i, value) => {
      [...document.querySelectorAll(selector)]
        .filter(el => el.offsetHeight !== 0)[i]
        .value = value
    }, selector, i, value)
    // await this.clickUntilInputNotReadOnly(selector, inputHandle, i)
    await this.waitForInputNotEmpty(selector, i)
    await this.pressEnterUntilInputIsReadOnly(selector, inputHandle, i)
  },

  async setSingleInputValue(selector, val) {
    await page.evaluate((selector, val) => {
      document.querySelector(selector).value = val
    }, selector, val)
  },

  //Getters
  async getInputValue(selector, i = 0) {
    return await page.evaluate(async (selector, i) => {
      return [...(document.querySelectorAll(selector))]
        .filter(el => el.offsetHeight !== 0)[i]
        .value
    }, selector, i)
  },

  async getInputValueByHandle(handle) {
    return await page.evaluate(async (handle) => {
      return handle.value
    }, handle)
  },

  async getElementText(selector, i = 0, timeout = 5000) {
    await page.waitForSelector(selector, { visible: true, timeout: timeout })
    const el = (await page.$$(selector))[i]
    return await page.evaluate(el => el.textContent, el)
  },

  async getElementInnerText(selector, i = 0, timeout = 5000) {
    await page.waitForSelector(selector, { visible: true, timeout: timeout })
    const el = (await page.$$(selector))[i]
    return await page.evaluate(el => el.innerText, el)
  },

  async getElementsTextArray(selector, timeout = 5000) {
    await page.waitForSelector(selector, { timeout: timeout })
    return await page.evaluate((selector) => {
      return [...(document.querySelectorAll(selector))]
        .map(el => el.textContent.trim())
    }, selector)
  },

  //Timeouts
  async waitForInputNotEmpty(selector, i = 0, timeout = 2000) {
    let notEmpty = true
    await page.waitForFunction((selector, i) =>
      [...(document.querySelectorAll(selector))]
        .filter(el => el.offsetHeight !== 0)[i]
        .value
        .length > 0, { timeout: timeout }, selector, i).catch(() => {
          notEmpty = false
        })
    console.log(`${selector} input isn't empty - ${notEmpty}`)
    return notEmpty
  },

  async waitForInputEmpty(selector, i = 0) {
    let isEmpty = true
    await page.waitForFunction((selector, i) =>
      [...(document.querySelectorAll(selector))]
        .filter(el => el.offsetHeight !== 0)[i]
        .value
        .length === 0
      , { timeout: 3000 }, selector, i).catch((e) => {
        isEmpty = false
      })
    console.log(`Input field is empty: ${isEmpty}`)
    return isEmpty
  },

  async waitForInputNotValue(selector, value, i = 0) {
    let notValue = true
    await page.waitForFunction((selector, value, i) =>
      [...(document.querySelectorAll(selector))]
        .filter(el => el.offsetHeight !== 0)[i]
        .value !== value
      , { timeout: 3000 }, selector, value, i).catch(() => {
        notValue = false
      })
    console.log(`Input value isn't: "${value}" - ${notValue}`)
    return notValue
  },

  async waitForInputNotInQueryMode(selector, i = 0) {
    let notQuery = true
    await page.waitForFunction((selector, i) =>
      getComputedStyle([...(document.querySelectorAll(selector))]
        .filter(el => el.offsetHeight !== 0)[i])
        .backgroundColor !== 'rgb(201, 239, 172)'
      , { timeout: 3000 }, selector, i).catch(() => {
        notQuery = false
      })
    console.log(`Query mode is off - ${notQuery}`)
    return notQuery
  },

  async waitForInputInQueryMode(selector, i = 0) {
    let inQuery = true
    await page.waitForFunction((selector, i) =>
      getComputedStyle([...(document.querySelectorAll(selector))]
        .filter(el => el.offsetHeight !== 0)[i])
        .backgroundColor === 'rgb(201, 239, 172)'
      , { timeout: 3000 }, selector, i).catch(() => {
        inQuery = false
      })
    console.log(`Query mode is on - ${inQuery}`)
    return inQuery
  },

  async waitForInputNotZero(selector, i = 0) {
    let notZero = true
    await page.waitForFunction((selector, i) => {
      ([...(document.querySelectorAll(selector))]
        .filter(el => el.offsetHeight !== 0)[i]
        .value !== 0).toLocaleString('en-US', {
          minimumFractionDigits: 2
        })
    }, { timeout: 2000 }, selector, i).catch(() => {
      notZero = false
    })
    return notZero
  },

  async waitForElementGoneByText(selector, text, timeout = 3000) {
    let isGone = true
    await page.waitForFunction((selector, text) =>
      [...(document.querySelectorAll(selector))]
        .filter(el => el.textContent === text).length === 0
      , { timeout: timeout }, selector, text).catch(() => {
        isGone = false
      })
    console.log('selector ' + selector + ' with text ' + text + ' is present= ' + isGone)
    return isGone
  },

  async waitForElementGone(selector, timeout = 3000) {
    let isGone = true
    await page.waitForFunction((selector) =>
      [...(document.querySelectorAll(selector))]
        .length === 0
      , { timeout: timeout }, selector).catch(() => {
        isGone = false
      })
    console.log(`selector ${selector} is gone - ${isGone}`)
    return isGone
  },

  async waitForElementHasTextContent(selector, text, timeout = 5000) {
    let isPresent = true
    await page.waitForFunction((selector, text) =>
      [...(document.querySelectorAll(selector))]
        .filter(el => el.textContent.trim() === text).length === 1
      , { timeout: timeout }, selector, text)
      .catch(() => {
        isPresent = false
      })
    console.log('selector ' + selector + ' with text ' + text + ' is present= ' + isPresent)
    return isPresent
  },

  async waitForElementsTextContentNotEmpty(selector, timeout = 5000) {
    let isPresent = true
    await page.waitForFunction((selector) =>
      document.querySelector(selector)
        .textContent !== '', { timeout: timeout }, selector)
      .catch(() => {
        isPresent = false
      })
    return isPresent
  },

  async waitForElementSingle(selector, timeout = 5000) {
    let isSingle = true
    await page.waitForFunction(selector =>
      document.querySelectorAll(selector).length === 1, { timeout: timeout }, selector)
      .catch(() => {
        isSingle = false
      })
    return isSingle
  },

  async waitForElementsCount(selector, n, timeout = 5000) {
    let isCount = true
    await page.waitForFunction((selector, n) =>
      document.querySelectorAll(selector).length === n, { timeout: timeout }, selector, n)
      .catch(() => {
        isCount = false
      })
    console.log(`elements number is ${n} - ${isCount}`)
    return isCount
  },

  async waitForInputToHaveValueByClass(cssClass, val) {
    const className = cssClass.substr(1)
    await page.waitForFunction(`document.getElementsByClassName("${className}")[0].value == "${val}"`)
  },

  async waitForNetworkIdle(timeout, { maxInflightRequests = 0, optPage } = {}) {
    const page2 = optPage || page
    page2.on('request', onRequestStarted);
    page2.on('requestfinished', onRequestFinished);
    page2.on('requestfailed', onRequestFinished);

    let inflight = 0;
    let fulfill;
    let promise = new Promise(x => fulfill = x);
    let timeoutId = setTimeout(onTimeoutDone, timeout);
    return promise;

    function onTimeoutDone() {
      page2.removeListener('request', onRequestStarted);
      page2.removeListener('requestfinished', onRequestFinished);
      page2.removeListener('requestfailed', onRequestFinished);
      fulfill();
    }

    function onRequestStarted() {
      ++inflight;
      if (inflight > maxInflightRequests)
        clearTimeout(timeoutId);
    }

    function onRequestFinished() {
      if (inflight === 0)
        return;
      --inflight;
      if (inflight === maxInflightRequests)
        timeoutId = setTimeout(onTimeoutDone, timeout);
    }
  },

  async waitForFrame(frameUrl) {
    function waitForFrame(page) {
      let fulfill;
      const promise = new Promise(x => fulfill = x);
      checkFrame();
      return promise;

      function checkFrame() {
        const frame = page.frames().find(frame => {
          return frame.url().includes(partialUrl)
        });
        if (frame)
          fulfill(frame);
        else
          page.once('frameattached', checkFrame);
      }
    }
  },

  async waitForRequests(urlEnd, method, n) {
    for (let i = 0; i < n; i++) {
      await page.waitForRequest(request => request
        .url()
        .endsWith(urlEnd)
        && request.method() === method, { timeout: 2000 }, urlEnd, method)
        .catch(() => console.log('No more requests ended with ' + urlEnd + ' found'))
    }
  },

  async waitForElementVisibleByVisibilityStyle(selector, timeout = 5000) {
    let isVisible = true
    await page.waitForFunction(selector =>
      [...(document.querySelectorAll(selector))]
        .filter(el => el.style.visibility === 'visible').length > 0
      , { timeout: timeout }, selector)
      .catch(() => {
        isVisible = false
        console.log(`visibility style ${isVisible}`)
      })
    return isVisible
  },

  //Assertions
  async isElementVisible(css, timeout = 50) {
    let visibility = true
    await page
      .waitForSelector(css, { visible: true, timeout: timeout })
      .catch(() => {
        visibility = false;
      })
    return visibility
  },

  async isElementDisplayedByClass(css, timeout = 50) {
    let visibility = true
    await page
      .waitForSelector(css + '.displayNone', { timeout: timeout })
      .catch(() => {
        visibility = false;
      })
    return visibility
  },

  async isElementVisibleByWidth(css, timeout = 2000) {
    let visible = true
    await page.waitFor(css =>
      [...(document.querySelectorAll(css))]
        .filter(el => el.offsetHeight !== 0)
        .length !== 0
      , { timeout: timeout }, css).catch(() => {
        visible = false
      })
    return visible
  },

  async isElementHasTextContent(css, text) {
    const hasTextContent = await page.evaluate((css, text) => {
      return document.querySelector(css).textContent === text
    }, css, text)
    return hasTextContent
  },

  async isElementReadOnly(css, i) {
    const visible = await page.evaluate((css, i) => {
      return [...(document.querySelectorAll(css))]
        .filter(el => el.offsetHeight !== 0)[i].readOnly
    }, css, i)
    return visible
  },

  async isCheckBoxChecked(selector, i = 0) {
    await page.waitForSelector(selector, { timeout: 2000 })
    const elHandle = (await page.$$(selector))[i]
    return (await elHandle.getProperty('checked')).jsonValue()
  },

  async isCheckBoxCheckedByValue(selector, i = 0) {
    await page.waitForSelector(selector, { timeout: 2000 })
    const elHandle = (await page.$$(selector))[i]
    return (await elHandle.getProperty('value')).jsonValue()
  },

  async isResponse(urlEnd, timeout = 2000) {
    let isSent = true
    await page.waitForResponse(req => req.url().endsWith(urlEnd), { timeout: timeout })
      .catch(() => {
        isSent = false
      })
    return isSent
  },

  //Other
  async raceSelectors(selectors) {
    return Promise.race(
      selectors.map(async selector => {
        await page.waitForSelector(selector, { visible: true, timeout: 3000 });
        return selector;
      })
    )
  },

  parseStringSync(str) {
    var result
    new (require('xml2js').Parser)().parseString(str, (_e, r) => { result = r });
    return result
  },
}
