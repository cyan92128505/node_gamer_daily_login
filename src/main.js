const puppeteer = require("puppeteer");
const dotenv = require("dotenv");
dotenv.config();

async function main() {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  const delayTime = +process.env.DELAY_TIME || 300;

  await page.goto(process.env.HOME_URL);

  await page.waitForSelector(`a[href="${process.env.LOGIN_URL}"]`);
  await page.click(`a[href="${process.env.LOGIN_URL}"]`, {
    delay: delayTime,
  });

  await page.waitForSelector(`input[name="userid"]`);
  page.addScriptTag({
    content: `var env = {"username": "${process.env.USERNAME}", "password": "${process.env.PASSWORD}"};`,
  });

  await page.$eval('input[name="userid"]', (el) => (el.value = env.username));
  await page.$eval('input[name="password"]', (el) => (el.value = env.password));
  await page.click('[id="btn-login"]', { delay: delayTime });

  await page.waitForSelector(`[id="signin-btn"]`);
  await page.click('[id="signin-btn"]', { delay: delayTime });
  await page.screenshot({
    path: `screenshots/github-profile-${new Date().toUTCString()}.jpeg`,
  });

  await browser.close();
}

main();
