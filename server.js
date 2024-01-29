const corsUrlDev = 'http://127.0.0.1:5500';
const corsUrlLive = 'https://jefffroehlich.github.io';
let corsUrl = '';

if ((process.env.NODE_ENV || '').trim() !== 'production') {
  corsUrl = corsUrlDev;
} else {
  corsUrl = corsUrlLive;
}

console.log(corsUrl);

import { config } from 'dotenv';
config();

import { Configuration, OpenAIApi } from 'openai';
import readline from 'readline';

import express from 'express';
import cors from 'cors';

const app = express();
const port = process.env.PORT || 3000;
app.use(cors({ origin: corsUrl }));
app.use(express.json());
app.listen(port, () => console.log('Example app listening!'));

console.log(process.env.NODE_ENV);

app.get('/', (req, res) => {
  res.send('serving is running successfully');
});

app.post('/sendUserInput', async (req, res) => {
  const dataFromClientSide = req.body.message;

  let promptObj = {
    model: 'gpt-3.5-turbo',
    messages: [
      {
        role: 'system',
        content:
          'You are an assistant with very very brief replies. You specialize in brevity.',
      },
    ],
  };
  //loop pushes in prompt and response into the object being passed to openai
  for (let i = 0; i < dataFromClientSide.length; i++) {
    promptObj.messages.push(dataFromClientSide[i]);
  }

  const gptResponse = await talkToChatGPT(promptObj);
  res.status(200).send(JSON.stringify(gptResponse));
});

const openAi = new OpenAIApi(
  new Configuration({
    apiKey: process.env.OPEN_AI_API_KEY,
  })
);
async function talkToChatGPT(fullPrompt) {
  const response = await openAi.createChatCompletion(fullPrompt);
  return response.data.choices[0].message.content;
}
