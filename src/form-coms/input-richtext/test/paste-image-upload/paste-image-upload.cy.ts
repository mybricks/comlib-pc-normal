import dump from './dump.json';
import { dumpPreview, eventCheck, enhancedIt } from '@/../cypress/tools';

describe('富文本输入', () => {
  enhancedIt('粘贴图片自动上传', () => {
    // 加载测试页面
    dumpPreview(dump, [{ selector: 'div', text: '正文' }]);

    cy.fixture('./paste-image.jpg', 'base64').then((imageBase64) => {
      const mimeType = 'image/jpeg';

      // 创建粘贴事件
      const pasteEvent = new ClipboardEvent('paste', {
        bubbles: true,
        cancelable: true,
        clipboardData: new DataTransfer()
      });

      // 添加图片到粘贴板
      pasteEvent.clipboardData!.items.add(
        new File([Cypress.Blob.base64StringToBlob(imageBase64, mimeType)], 'sample-image.jpg', { type: mimeType })
      );

      // 获取 iframe 的内容并触发粘贴事件到编辑器的 body 上
      cy.getIframeBody('iframe[id^="_pceditor_tinymce"]') // 替换为实际的 iframe 选择器
        .then((iframeBody) => {
          iframeBody[0].dispatchEvent(pasteEvent);
        });

      eventCheck([
        {
          "id": "upload",
          "value": { "file_type": "image" }
        }
      ])
    });
  })
})
