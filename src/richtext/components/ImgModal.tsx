import React, { useCallback, useRef } from 'react';

import { Modal, message, Spin, Input } from 'antd';
import { ModalCtx } from '../richText';
import { useObservable, useComputed } from '@mybricks/rxui';
// import { uploadFilesToCDN } from '../../utils/uploadFilesToCDN';

import css from '../richText.less';

const disabledStyle = {
  color: 'rgba(0,0,0,.25)',
  background: '#f5f5f5',
  borderColor: '#d9d9d9',
  cursor: 'not-allowed',
} as {
  color: string;
  background: string;
  borderColor: string;
  cursor: string;
};

interface Props {
  update: any;
  modalCtx: ModalCtx;
  env: any;
}

class Ctx {
  container?: any;
}

const getMIMEType = (type: string) => {
  switch (type) {
    case 'image':
      return 'image/*';

    case 'video':
      return 'video/*';
  }
};

const renderPreview = ({ type, url }) => {
  switch (type) {
    case 'image':
      return (
        <div
          className={css['editor-rich-text__modal-placeholder-img']}
          style={{ backgroundImage: `url(${url})` }}
        />
      );

    case 'video':
      return (
        <div>
          <video controls width='100%' height={200} src={url} />
        </div>
      );
  }
};
export default function ImgModal({ update, modalCtx, env }: Props) {
  const ref = useRef();
  const ctx: Ctx = useObservable(Ctx, (next) => {
    next({
      container: void 0,
    });
  });

  const Close = useCallback(() => {
    modalCtx.modal = {};
    modalCtx.modalVisible = false;
  }, []);

  const modalJSX = useComputed(() => (
    <div ref={ref}>
      <input
        style={{ display: 'none' }}
        type='file'
        accept={getMIMEType(modalCtx.modal.type)}
        ref={(node) => (ctx.container = node)}
        className={css['editor-upload__input']}
        onChange={(evt) => {
          const file: any =
            (evt.target && evt.target.files && evt.target.files[0]) || null;
          if (file) {
            modalCtx.modal.uploading = true;
            upload(file, (url) => {
              modalCtx.modal.uploading = false;
              modalCtx.modal.url = url;
            });
            evt.target.value = '';
          }
        }}
      />
      <Modal
        title={modalCtx.modal.title}
        visible={modalCtx?.modalVisible}
        width={520}
        bodyStyle={{
          padding: '8px 24px',
        }}
        maskClosable={false}
        footer={[
          <div className={css['editor-rich-text__footBtn']} key='button'>
            <div
              className={`${css['editor-rich-text__modalbtn']} ${css['editor-rich-text__footBtn-determine']}`}
              style={modalCtx?.modal.url?.length ? {} : disabledStyle}
              onClick={() => {
                if (!modalCtx?.modal.url?.length) return;
                modalCtx.Uploadimage.setUrl(modalCtx.modal, modalCtx.editor);
                Close();
                update();
              }}
            >
              确定
            </div>
          </div>,
        ]}
        onCancel={() => {
          Close();
        }}
        getContainer={() => ref.current}
        zIndex={1002}
      >
        <div
          className={css['editor-rich-text__modalbtn']}
          onClick={() => {
            ctx.container?.click();
          }}
        >
          文件选择
        </div>
        <Input
          value={modalCtx.modal.url}
          placeholder='文件地址'
          onChange={(e) => {
            modalCtx.modal.url = e.target.value;
          }}
        />
        <div className={css['editor-rich-text__modal']}>
          {modalCtx?.modal.url ? null : (
            <textarea
              onPaste={(e) => {
                // modalCtx.modal.uploading = true;
                // paste(e, (url) => {
                //   modalCtx.modal.uploading = false;
                //   modalCtx.modal.url = url;
                // });
              }}
              className={css['editor-rich-text__modal-text']}
              ref={(e) => {
                if (modalCtx.modalVisible) {
                  e?.focus();
                } else if (e) {
                  resetTextArea(e);
                }
              }}
            />
          )}
          <div className={css['editor-rich-text__modal-placeholder']}>
            <Spin spinning={modalCtx.modal.uploading === true}>
              {!modalCtx?.modal.url?.length ? (
                <div
                  className={css['editor-rich-text__modal-placeholder-text']}
                >
                  <div>可直接粘贴文件</div>
                </div>
              ) : (
                renderPreview(modalCtx?.modal)
              )}
            </Spin>
          </div>
        </div>
      </Modal>
    </div>
  ));

  return modalJSX;
}

// function paste(e: any, set: (url: string) => void) {
//   const cbd = e.clipboardData;

//   if (!(e.clipboardData && e.clipboardData.items)) return;
//   if (
//     cbd.items &&
//     cbd.items.length === 2 &&
//     cbd.items[0].kind === 'string' &&
//     cbd.items[1].kind === 'file' &&
//     cbd.types &&
//     cbd.types.length === 2 &&
//     cbd.types[0] === 'text/plain' &&
//     cbd.types[1] === 'Files'
//   )
//     return;

//   for (let i = 0; i < cbd.items.length; i++) {
//     const item = cbd.items[i];

//     if (item.kind == 'file') {
//       const file = item.getAsFile();
//       file.uploadName = `${Date.now()}-${file.name}`;
//       if (file?.size === 0) return;
//       upload(file, set);
//       e.target.value = '';
//     }
//   }
// }

function resetTextArea(e: any) {
  e.value = '';
}

// function upload(file: any, set: (url: string) => void) {
//   uploadFilesToCDN([file]).then((res: any) => {
//     if (res && res.result === 1 && res.data.success) {
//       const data = res.data.fileResults || [];
//       const url = data[0]?.cdnUrl;

//       if (url.length) {
//         set(url);
//         message.success('上传成功');
//       } else {
//         message.error(`上传失败，请稍后重试！${res.statusText}`);
//       }
//     } else {
//       message.error(`上传失败，请稍后重试！${res.statusText}`);
//     }
//   });
// }
