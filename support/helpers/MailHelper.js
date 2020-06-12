import { check_inbox, get_messages } from "gmail-tester";
import { resolve } from "path";
const cheerio = require('cheerio')

export const mailHelper = {

  async inboxChecker({ to, subject, from } = {}) {
    const email = await check_inbox(
      resolve("support/gmail-tester-data/credentials.json"),
      resolve("support/gmail-tester-data/gmail_token.json"),
      {
        subject: subject,
        from: from,
        to: to,
        wait_time_sec: 8,       // Poll interval (in seconds)
        max_wait_time_sec: 32,   // Maximum poll interval (in seconds). If reached, return null, indicating the completion of the task().
        include_body: true
      }
    )
    return email
  },

  async messageChecker({ from, to, subject } = {}) {
    const date = Date(Date.now()) - 20000
    const email = await get_messages(
      resolve("support/gmail-tester-data/credentials.json"),
      resolve("support/gmail-tester-data/gmail_token.json"),
      {
        from: from,
        to: to,
        subject: subject,
        include_body: true,
        after: new Date(Date.now() - 60000)
      }
    )
    return email
  },

  async createRandomEmail(randomNum) {
    return `gmail-tester+${randomNum}@titanium-labs.com`
  },

  getBodyText(html) {
    const $ = cheerio.load(html)
    $('body').find('br').replaceWith(' ')
    return $('body').text()
  },

  getConfirmationLink(html) {
    let $ = cheerio.load(html)
    return $('a').attr().href
  }
} 
