import { INTO, LEAVE, CLICK } from '../constants';

export const addSlot = (slots, id, title) => {
  slots.add({
    id,
    title
  });
};

export const addEventIO = (output, id, title) => {
  output.add(`${id}${INTO}`, `${title}显示`, { type: 'any' });
  output.add(`${id}${LEAVE}`, `${title}隐藏`, { type: 'any' });
  output.add(`${id}${CLICK}`, `${title}点击时`, { type: 'any' });
};

export const removeEventIO = (output, id) => {
  output.remove(`${id}${INTO}`);
  output.remove(`${id}${LEAVE}`);
};


export const updateIOTitle = (output, id, title) => {
  output.setTitle(`${id}${INTO}`, `${title}显示`);
  output.setTitle(`${id}${LEAVE}`, `${title}隐藏`);
};

export const updateNextIOTitle = () => {};
