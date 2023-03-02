import { ChatCompletionRequestMessage } from "openai";
import { CHATGPT_BOT_ID, CHATGPT_BOT_NAME } from "./enum";

export function createChatGPTConversation(
  slackThreadMessages: any[] | undefined
) {
  if (!slackThreadMessages) {
    return [];
  }
  const result: ChatCompletionRequestMessage[] = slackThreadMessages.map(
    (thread) => {
      return {
        content: thread.text,
        role: thread.user === CHATGPT_BOT_ID ? "assistant" : "user",
        name: thread.user === CHATGPT_BOT_ID ? CHATGPT_BOT_NAME : thread.user,
      };
    }
  );
  result.unshift({ role: "system", content: "You are a helpful assistant." });
  return result;
}
