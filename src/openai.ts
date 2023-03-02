import { ChatCompletionRequestMessage, Configuration, OpenAIApi } from "openai";

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

export default async function ask(
  conversations: ChatCompletionRequestMessage[]
) {
  try {
    const result = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: conversations,
    });
    return result.data.choices[0].message?.content;
  } catch (err) {
    console.error(err);
  }
}
