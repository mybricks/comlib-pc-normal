import { Btn } from '../constants';

export function getButton(buttons: Btn[], ButtonType: string) {
  return buttons.find((item) => item.value === ButtonType);
}
