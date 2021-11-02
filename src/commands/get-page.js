import ora from 'ora';
import chalk from 'chalk';
import fs from 'fs';
import { exit } from 'process';
import puppeteer from 'puppeteer-extra';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';

function error(spinner, message, error, options) {
  spinner.fail(message)
   if (options != undefined) options.debug ?
    console.error(error) :
    console.error(`Try rerunning with --debug (or -d) to see error messages`)
  exit(1)
}

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
      error(pageGetSpinner, `Failed to get page: ${website}`, e, options)
    })
    pageGetSpinner.succeed(`Got Page: ${website}`)

    let screenshotSpinner = ora(`Taking screenshot`)
    screenshotSpinner.start()
    if (outpath != undefined && !fs.existsSync(outpath)) await fs.mkdir(outpath, { recursive: true }, e => {
      if (e) error(screenshotSpinner, 'Failed to create an output directory', e, options);
    })
    await page.screenshot({ path: `${outpath || "."}/screenshot.png`, fullPage: true }).catch(e => {
      error(screenshotSpinner, `Failed to Take Screenshot`, e, options);
    })
    screenshotSpinner.succeed(`Successfully Took a Screenshot`)

    let pageSourceSpinner = ora(`Getting Source`)
    pageSourceSpinner.start()
    try {
      fs.writeFileSync(`${outpath || "."}/source.html`, await page.content());
      pageSourceSpinner.succeed(`Successfully Saved Source Code`)
    } catch (e) {
      error(pageSourceSpinner, `Failed to save HTML source`, e, options)
    }
  
    if (options.silent != true) console.log(`All done, check the screenshot and source file. ✨`)
    await browser.close()
  }).catch(e => {
    error(browserLaunchSpinner, `${chalk.redBright('Operation Failed')}, Error message: ${e.message}`, e)
  })
}
