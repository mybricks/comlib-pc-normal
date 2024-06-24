import { Btn } from '../constants';

export function getButton(buttons: Btn[], buttonType: string) {
  return buttons.find((item) => item.value === buttonType);
}
