import { App, LogLevel } from "@slack/bolt";
import askChatGPT from "./openai";
import { createChatGPTConversation } from "./utils";

const app = new App({
  token: process.env.SLACK_BOT_TOKEN,
  signingSecret: process.env.SLACK_CLIENT_SIGNING_SECRET,
  logLevel: process.env.ENV !== "production" ? LogLevel.DEBUG : undefined,
});

app.use(async ({ next }) => {
  await next();
});

app.event("app_mention", async ({ event, context, client, say }) => {
  try {
    const threads = await client.conversations.replies({
      channel: event.channel,
      ts: event.thread_ts || event.ts,
    });

    const text = await askChatGPT(createChatGPTConversation(threads.messages));

    await say({
      text,
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
