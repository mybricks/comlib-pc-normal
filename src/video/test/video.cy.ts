import { dumpPreview, eventCheck, enhancedIt } from '@/../cypress/tools';
import poster from './case/video-poster.json';

describe('播放器', () => {
  enhancedIt('封面', () => {
    dumpPreview(poster, [{
      type: 'get',
      selector: '#u_hn_7G > div.video-wrap-bda34'
    }]);

    // 等待视频元素加载
    cy.get('video').should('be.visible');

    // 断言视频加载完成，并等待前窗隐藏
    cy.get('video').should('have.prop', 'readyState', 4).wait(1000)

    eventCheck([
      {
        id: 'poster',
        value: 'https://pngimg.com/uploads/mario/mario_PNG125.png'
      }
    ]);

    cy.compareSnapshot('播放器_封面')
  });
});
