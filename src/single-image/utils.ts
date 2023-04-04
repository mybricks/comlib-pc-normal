import { message } from 'antd';

const LOCALSTORAGE_API_KE = `mybricks-openai-api-key`;

const enhancePrompt = async ({ prompt }) => {
  const data = await fetch(`https://api.openai.com/v1/chat/completions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${localStorage.getItem(LOCALSTORAGE_API_KE)?.trim()}`
    },
    body: JSON.stringify({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'user',
          content: `我希望你能成为ChatGPT的提示生成器，以创建图像。您的工作是提供详细和富有创意的描述，以启发chatgpt产生独特而有趣的图像。请尽情发挥想象力和描述能力。你提供的描述越详细和富有想象力，生成的图像就越有趣。请勿返回与图像无关的语句，并且应限制在150个字以下。这是你的第一个提示：: “${prompt}”`
        }
      ]
    })
  })
    .then((response) => response.json())
    .then((res) => {
      return res.choices[0]?.message?.content || prompt;
    });
  return data;
};

export function collectKey() {
  const key = prompt('请输入OpenAI的API Key');
  if (key) {
    localStorage.setItem(LOCALSTORAGE_API_KE, key);
  }
  return key;
}

export const generateImg = async ({ prompt, enhance }) => {
  if (!localStorage.getItem(LOCALSTORAGE_API_KE)?.trim()) {
    const key = collectKey();
    if (!key) {
      message.error('未检测到OPEN API Key');
      return;
    }
  }

  const hide = message.loading('正在生成图片', 10000);

  if (enhance) {
    prompt = await enhancePrompt({ prompt });
  }

  const data = await fetch(`https://api.openai.com/v1/images/generations`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${localStorage.getItem(LOCALSTORAGE_API_KE)?.trim()}`
    },
    body: JSON.stringify({
      prompt,
      n: 1,
      size: '512x512'
    })
  })
    .then((response) => response.json())
    .finally(hide);
  return data;
};
