import { ChatCompletionRequestMessage } from "openai";
import { CHATGPT_BOT_NAME } from "./enum";
import { WebClient, ConversationsRepliesResponse } from "@slack/web-api";

export function createChatGPTConversation(
  slackThreadMessages: ConversationsRepliesResponse["messages"],
  botId: string
) {
  if (!slackThreadMessages) {
    return [];
  }
  const result: ChatCompletionRequestMessage[] = slackThreadMessages.map(
    (thread) => {
      return {
        content: thread.text || "",
        role: thread.user === botId ? "assistant" : "user",
        name: thread.user === botId ? CHATGPT_BOT_NAME : thread.user,
      };
    }
  );
  result.unshift({ role: "system", content: "You are a helpful assistant." });
  return result;
}

export async function getBotId(client: WebClient) {
  try {
    const result = await client.auth.test({
      token: process.env.SLACK_BOT_TOKEN,
    });
    return result.user_id || "";
  } catch (error) {
    console.error(error);
    return "";
  }
}
