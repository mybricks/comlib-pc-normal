export interface Data {
  staticTime: number;
  immediate: boolean;
  isFormat: boolean;
  format: string;
  customFormat: string;
  useStop: boolean;
}

export enum InputIds {
  StartCountdown = 'startCountdown',
  StopCountdown = 'stopCountdown'
}

export enum OutputIds {
  ResidualTime = 'residualTime',
  CountdownOut = 'countdownOut'
}
