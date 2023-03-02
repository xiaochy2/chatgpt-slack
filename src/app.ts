/* eslint-disable no-console */
/* eslint-disable import/no-internal-modules */
import "./utils/env";
import { App, LogLevel } from "@slack/bolt";

const app = new App({
  token: process.env.SLACK_BOT_TOKEN,
  signingSecret: process.env.SLACK_CLIENT_SIGNING_SECRET,
  logLevel: LogLevel.DEBUG,
});

app.use(async ({ next }) => {
  await next();
});

app.event("app_mention", async ({ event, context, client, say }) => {
  console.log(event);
  try {
    await say({
      text: "nihao你好",
      // blocks: [
      //   {
      //     type: "section",
      //     text: {
      //       type: "mrkdwn",
      //       text: `Thanks for the mention <@${event.user}>! Here's a button`,
      //     },
      //     accessory: {
      //       type: "button",
      //       text: {
      //         type: "plain_text",
      //         text: "Button",
      //         emoji: true,
      //       },
      //       value: "click_me_123",
      //       action_id: "first_button",
      //     },
      //   },
      // ],
      thread_ts: event.ts,
    });
  } catch (error) {
    console.error(error);
  }
});

(async () => {
  // Start your app
  await app.start(Number(process.env.PORT) || 3000);

  console.log("⚡️ Bolt app is running!");
})();
