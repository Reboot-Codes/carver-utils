import ora from 'ora';
import chalk from 'chalk';
import fs from 'fs';
import { exit } from 'process';
import puppeteer from 'puppeteer-extra';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';

export default function getPage (website, outpath, options) {
  puppeteer.use(StealthPlugin())

  const browserLaunchSpinner = ora(`Launching Headless Browser`)
  browserLaunchSpinner.start()
  puppeteer.launch({ headless: true }).then(async browser => {
    const page = await browser.newPage()
    await page.setViewport({ width: 1920, height: 1080 })
    browserLaunchSpinner.succeed(`Started Headless Browser Instance`)
  
    let pageGetSpinner = ora(`Getting Page`)
    pageGetSpinner.start()
    await page.goto(website, { waitUntil: 'networkidle2' }).catch(e => {
      pageGetSpinner.fail(`Failed to get page: ${website}`)
      console.error(`Try rerunning with --debug (or -d) to see error messages`)
      if (options.debug == true) console.error(e)
      exit(1)
    })
    pageGetSpinner.succeed(`Got Page: ${website}`)

    let screenshotSpinner = ora(`Taking screenshot`)
    screenshotSpinner.start()
    await page.screenshot({ path: `${outpath || "."}/screenshot.png`, fullPage: true }).catch(e => {
      screenshotSpinner.fail(`Failed to Take Screenshot`)
      console.error(`Try rerunning with --debug (or -d) to see error messages`)
      if (options.debug == true) console.error(e)
      exit(1)
    })
    screenshotSpinner.succeed(`Successfully Took a Screenshot`)

    let pageSourceSpinner = ora(`Getting Source`)
    pageSourceSpinner.start()
    try {
      fs.writeFileSync(`${outpath || "."}/source.html`, await page.content());
      pageSourceSpinner.succeed(`Successfully Saved Source Code`)
    } catch (e) {
      pageSourceSpinner.fail(`Failed to save HTML source`)
      console.error(`Try rerunning with --debug (or -d) to see error messages`)
      if (options.debug == true) console.error(e)
      exit(1)
    }
  
    if (options.silent != true) console.log(`All done, check the screenshot and source file. ✨`)
    await browser.close()
  }).catch(e => {
    browserLaunchSpinner.fail(`Operation Failed, Error message: ${e.message}`)
    console.error(`Try rerunning with --debug (or -d) to see error messages`)
    if (options.debug == true) console.error(e)
    exit(1)
  })
}
