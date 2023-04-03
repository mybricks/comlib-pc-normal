import { message } from 'antd';

const LOCALSTORAGE_API_KE = `mybricks-openai-api-key`;

export function collectKey() {
  const key = prompt('请输入OpenAI的API Key');
  if (key) {
    localStorage.setItem(LOCALSTORAGE_API_KE, key);
  }
  return key;
}

export const generateImg = async ({ prompt }) => {
  if (!localStorage.getItem(LOCALSTORAGE_API_KE)?.trim()) {
    const key = collectKey();
    if (!key) {
      message.error('未检测到OPEN API Key');
      return;
    }
  }

  const hide = message.loading('正在生成图片');

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
