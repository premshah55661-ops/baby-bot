const { chromium } = require('playwright');
const cron = require('node-cron');
const config = require('./config.json');

(async () => {
  const context = await chromium.launchPersistentContext('./bot-profile', {
    headless: true,
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage'
    ]
  });

  const page = context.pages()[0] || await context.newPage();

  await page.goto(config.groupUrl);
  console.log("Baby Bot Online");
})();
