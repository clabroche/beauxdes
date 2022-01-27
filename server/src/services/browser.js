const puppeteer = require('puppeteer')
const pathfs = require('path')
const browsers = {}
module.exports = {
  async requestABrowser(token = process.env.EMAIL, email = process.env.EMAIL, password = process.env.PASSWORD) {
    if (browsers[email]) await browsers[email].close() 
    const browser = await puppeteer.launch({
      headless: true,
      executablePath: '/usr/bin/chromium-browser',
      userDataDir: pathfs.resolve(__dirname, '..', '..', 'puppeteer-cache', email),
      args: ['--no-sandbox']
    }).catch(() => {
      return puppeteer.launch({
        headless: true,
        userDataDir: pathfs.resolve(__dirname, '..', '..', 'puppeteer-cache', email),
        args: ['--no-sandbox']
      })
    })    
    browsers[email] = browser
    browser.on('disconnected', () => {
      delete browsers[email]
    })
    const page = await browser.newPage()
    await page.goto("https://welcoop.bodet-software.com/")
    await page.waitForSelector('#userNameInput')
    await page.type('#userNameInput', email)
    await page.type('#passwordInput', password)
    await page.click('#submitButton')
    await page.waitForNavigation()
    return { browser, page, token }
  }
}