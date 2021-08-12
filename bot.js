const { Telegraf } = require("telegraf");
const fetch = require("node-fetch");

const bot = new Telegraf(process.env.BOT_TOKEN);

bot.use(async (ctx, next) => {
  const start = new Date();
  await next();
  const ms = new Date() - start;
  console.log("Response time: %sms", ms);
});

const url = "https://api.covid19india.org/data.json";
const getData = async (url) => {
  try {
    const response = await fetch(url);
    if (response.ok) {
      return await response.json();
    }
  } catch (error) {
    console.error(error);
    return null;
  }
};

const getTodayDetails = (ctx) => {
  getData(url)
    .then((data) => {
      const total = data.statewise[0];
      ctx.replyWithMarkdown(
        "*Today's Covid19 India Totals*" +
          "\n*Total Confirmed cases: *" +
          total.confirmed +
          "\n*Total Active Cases: *" +
          total.active +
          "\n*Total Deaths: *" +
          total.deaths +
          "\n*Total Recovered: *" +
          total.recovered
      );
    })
    .catch((error) => {
      console.log(error);
      ctx.reply("Error occured!! Notify Maintainer")
    });
};

bot.start((ctx) => ctx.reply("Welcome to Covid 19 India Tracker Bot"));
bot.command("details", (ctx) => getTodayDetails(ctx));

bot.launch();
bot.startPolling();
