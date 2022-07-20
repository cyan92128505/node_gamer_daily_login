const puppeteer = require("puppeteer");

class ScrapeFlow {
  browser;
  page;
  delayTime = +process.env.DELAY_TIME || 300;
  loginPageEntryKey = `a[href="${process.env.LOGIN_URL}"]`;
  userInputKey = `input[name="userid"]`;
  passwordInputKey = `input[name="password"]`;
  submitLoginButtonKey = `[id="btn-login"]`;
  checkLoginButtonKey = `[id="signin-btn"]`;
  envScriptContent = `var env = {"username": "${process.env.USERNAME}", "password": "${process.env.PASSWORD}"};`;
  screenshotPath = `screenshots/github-profile-${new Date().toUTCString()}.jpeg`;

  _init = async () => {
    this.browser = await puppeteer.launch();
    this.page = await this.browser.newPage();
  };

  _entryHomePage = async () => {
    await this.page.goto(process.env.HOME_URL);
    await this.page.waitForSelector(this.loginPageEntryKey);
    await this.page.click(this.loginPageEntryKey, {
      delay: this.delayTime,
    });
  };

  _entryLoginPage = async () => {
    await this.page.waitForSelector(this.userInputKey);
    await this.page.waitForSelector(this.passwordInputKey);
    await this.page.addScriptTag({
      content: this.envScriptContent,
    });
    await this.page.$eval(this.userInputKey, (el) => (el.value = env.username));
    await this.page.$eval(
      this.passwordInputKey,
      (el) => (el.value = env.password)
    );
    await this.page.click(this.submitLoginButtonKey, { delay: this.delayTime });
  };

  _checkLoginStatus = async () => {
    await this.page.waitForSelector(this.checkLoginButtonKey);
    await this.page.click(this.checkLoginButtonKey, { delay: this.delayTime });
    await this.page.screenshot({
      path: this.screenshotPath,
    });
  };

  _close = async () => {
    await this.browser.close();
  };

  exec = async () => {
    await this._init();
    await this._entryHomePage();
    await this._entryLoginPage();
    await this._checkLoginStatus();
    await this._close();
  };
}

module.exports = ScrapeFlow;
