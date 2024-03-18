import { dumpPreview, eventCheck, enhancedIt } from '@/../cypress/tools';
import poster from './case/video-poster.json';

describe('播放器', () => {
  enhancedIt('封面', () => {
    dumpPreview(poster, []);

    eventCheck([
      {
        id: 'poster',
        value: 'https://pngimg.com/uploads/mario/mario_PNG125.png'
      }
    ]);
  });
});
