const { chromium } = require('playwright');
const cron = require('node-cron');
const config = require('./config.json');

(async () => {
  const context = await chromium.launchPersistentContext('./bot-profile', {
    headless: false,
    const browser = await chromium.launch({
 headless: true
});

  const page = context.pages()[0] || await context.newPage();

  console.log("Chrome profile open হচ্ছে...");
  await page.goto(config.groupUrl);
  await page.waitForTimeout(8000);

  console.log("Login Session Detected");
  console.log("Baby Bot Online");

  // ===============================
  // SEND MESSAGE
  // ===============================
  async function sendMessage(msg) {
    try {
      const box = page.locator('[role="textbox"]').last();

      await box.click();
      await page.waitForTimeout(300);

      await box.fill('');
      await box.type(msg, { delay: 25 });

      await page.keyboard.press('Enter');

      console.log("Message Sent:", msg);
    } catch (error) {
      console.log("Send Failed");
    }
  }

  // ===============================
  // AUTO MESSAGE
  // ===============================
  cron.schedule('0 7 * * *', async () => {
    await sendMessage("শুভ সকাল সবাই ☀️");
  });

  cron.schedule('0 17 * * *', async () => {
    await sendMessage("আড্ডার সময় 😎");
  });

  cron.schedule('0 23 * * *', async () => {
    await sendMessage("শুভ রাত্রি 🌙");
  });

  // ===============================
  // REPLY SYSTEM
  // ===============================
  let lastUserMessage = "";
  let busy = false;

  setInterval(async () => {
    if (busy) return;
    busy = true;

    try {
      const messages = await page.locator('[role="row"]').allInnerTexts();

      if (messages.length === 0) {
        busy = false;
        return;
      }

      let latest = messages[messages.length - 1]
        .toLowerCase()
        .trim();

      if (!latest) {
        busy = false;
        return;
      }

      // নিজের bot message ignore
      const botTexts = [
        "hello 👋",
        "hi 👋",
        "হেই 😍",
        "কি খবর বস 😎",
        "শুভ সকাল",
        "শুভ রাত্রি",
        "ওয়ালাইকুম আসসালাম",
        "আলহামদুলিল্লাহ ভালো আছি",
        "আমি baby bot",
        "জি বস আমি অন আছি",
        "আমিও আপনাকে ভালোবাসি",
        "স্বাগতম",
        "আল্লাহ হাফেজ",
        "মন খারাপ করবেন না",
        "না এখনো",
        "আপনাদের সাথে গল্প করি",
        "আপনাদের মাঝেই আছি",
        "জি বলুন"
      ];

      for (const text of botTexts) {
        if (latest.includes(text.toLowerCase())) {
          busy = false;
          return;
        }
      }

      // same user message skip
      if (latest === lastUserMessage) {
        busy = false;
        return;
      }

      lastUserMessage = latest;

      console.log("New Message:", latest);

      // ===============================
      // REPLY LOGIC
      // ===============================

      if (latest.includes("hi")) {
        await sendMessage("hello 👋");
      }

      else if (latest.includes("hello")) {
        await sendMessage("hi 👋");
      }

      else if (latest.includes("hey")) {
        await sendMessage("হেই 😍");
      }

      else if (latest.includes("yo")) {
        await sendMessage("কি খবর বস 😎");
      }

      else if (latest.includes("good morning")) {
        await sendMessage("শুভ সকাল ☀️");
      }

      else if (latest.includes("good night")) {
        await sendMessage("শুভ রাত্রি 🌙");
      }

      else if (
        latest.includes("আসসালামু আলাইকুম") ||
        latest.includes("assalamu alaikum")
      ) {
        await sendMessage("ওয়ালাইকুম আসসালাম 🤍 আপনি কেমন আছেন?");
      }

      else if (
        latest.includes("কেমন আছ") ||
        latest.includes("how are you")
      ) {
        await sendMessage("আলহামদুলিল্লাহ ভালো আছি 😍 আপনি?");
      }

      else if (
        latest.includes("কে তুমি") ||
        latest.includes("who are you")
      ) {
        await sendMessage("আমি Baby Bot 🤖");
      }

      else if (latest.includes("bot")) {
        await sendMessage("জি বস আমি অন আছি 😎");
      }

      else if (
        latest.includes("love you") ||
        latest.includes("ভালোবাসি")
      ) {
        await sendMessage("আমিও আপনাকে ভালোবাসি 💖");
      }

      else if (
        latest.includes("thanks") ||
        latest.includes("ধন্যবাদ")
      ) {
        await sendMessage("স্বাগতম 😍");
      }

      else if (
        latest.includes("bye") ||
        latest.includes("বিদায়")
      ) {
        await sendMessage("আল্লাহ হাফেজ 👋");
      }

      else if (latest.includes("মন খারাপ")) {
        await sendMessage("মন খারাপ করবেন না ❤️");
      }

      else if (latest.includes("খাইছো")) {
        await sendMessage("না এখনো 😄 আপনি?");
      }

      else if (latest.includes("কি করো")) {
        await sendMessage("আপনাদের সাথে গল্প করি 😎");
      }

      else if (latest.includes("কোথায়")) {
        await sendMessage("আপনাদের মাঝেই আছি 😍");
      }

    } catch (error) {
      console.log("Running...");
    }

    busy = false;

  }, 5000);

})();
