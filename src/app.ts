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

// Listens to incoming messages that contain "hello"
app.message("hello", async ({ message, say }) => {
  console.log(message);
  // Filter out message events with subtypes (see https://api.slack.com/events/message)
  if (message.subtype === undefined || message.subtype === "bot_message") {
    // say() sends a message to the channel where the event was triggered
    say(`Hey there <@${message.user}>!`);
    // await say({
    //   blocks: [
    //     {
    //       type: "section",
    //       text: {
    //         type: "mrkdwn",
    //         text: `Hey there <@${message.user}>!`,
    //       },
    //       accessory: {
    //         type: "button",
    //         text: {
    //           type: "plain_text",
    //           text: "Click Me",
    //         },
    //         action_id: "button_click",
    //       },
    //     },
    //   ],
    //   text: `Hey there <@${message.user}>!`,
    // });
  }
});

app.action("button_click", async ({ body, ack, say }) => {
  // Acknowledge the action
  await ack();
  await say(`<@${body.user.id}> clicked the button`);
});

app.event("app_mention", async ({ event, context, client, say }) => {
  console.log(event);
  try {
    await say({
      blocks: [
        {
          type: "section",
          text: {
            type: "mrkdwn",
            text: `Thanks for the mention <@${event.user}>! Here's a button`,
          },
          accessory: {
            type: "button",
            text: {
              type: "plain_text",
              text: "Button",
              emoji: true,
            },
            value: "click_me_123",
            action_id: "first_button",
          },
        },
      ],
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
