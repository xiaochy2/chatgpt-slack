/* eslint-disable no-console */
/* eslint-disable import/no-internal-modules */
import "./utils/env";
import { App, LogLevel } from "@slack/bolt";
import ask from "./openai";
import { ChatCompletionRequestMessage } from "openai";

const app = new App({
  token: process.env.SLACK_BOT_TOKEN,
  signingSecret: process.env.SLACK_CLIENT_SIGNING_SECRET,
  logLevel: LogLevel.DEBUG,
});

const botId = "U04RB48FUNA";

app.use(async ({ next }) => {
  await next();
});

app.event("app_mention", async ({ event, context, client, say }) => {
  const threads = await client.conversations.replies({
    channel: event.channel,
    ts: event.thread_ts || event.ts,
  });
  const text = await ask(createChatGPTConversation(threads.messages));

  try {
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

function createChatGPTConversation(slackThreadMessages: any[] | undefined) {
  if (!slackThreadMessages) {
    return [];
  }
  const result: ChatCompletionRequestMessage[] = slackThreadMessages.map(
    (thread) => {
      return {
        content: thread.text,
        role: thread.user === botId ? "assistant" : "user",
        name: thread.user,
      };
    }
  );
  result.unshift({ role: "system", content: "You are a helpful assistant." });
  console.log("chatgpt conversation", result);
  return result;
}
