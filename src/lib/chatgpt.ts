const OpenAI = require('openai');
const dotenv = require('dotenv');
const path = require('path');
dotenv.config({
  path: path.resolve(__dirname, '../../', '.env'),
});

const openai = new OpenAI();

async function main() {
  const completion = await openai.chat.completions.create({
    messages: [
      { role: 'system', content: 'You are a health content extract assistant' },
      { role: 'user', content: 'I was a severe headache' },
      {
        role: 'assistant',
        content: 'headache',
      },
      { role: 'user', content: 'Where was it played?' },
    ],
    model: 'gpt-3.5-turbo',
  });

  console.log(completion.choices[0]);
}
// main();

const textToSummarize = 'This is the text that I want to summarize.';

async function summarizeText() {
  try {
    const response = await openai.chat.createCompletion({
      model: 'text-davinci-003',
      prompt: `Please summarize this text:\n${textToSummarize}`,
      max_tokens: 100,
      temperature: 0.7,
    });
    console.log(response.data.choices[0].text);
  } catch (error) {
    console.error(error);
  }
}

summarizeText();
