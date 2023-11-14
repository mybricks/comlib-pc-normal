import React, { useRef, useState, useContext } from 'react';

import { Modal, Spin, Input } from 'antd';
// import { uploadFilesToCDN } from '../../utils/uploadFilesToCDN';
import { EnvContext } from '../context';

import css from '../richText.less';
import { UploadFn } from '../types';

const disabledStyle = {
  color: 'rgba(0,0,0,.25)',
  background: '#f5f5f5',
  borderColor: '#d9d9d9',
  cursor: 'not-allowed'
} as {
  color: string;
  background: string;
  borderColor: string;
  cursor: string;
};

interface Props {
  update: any;
  upload: UploadFn;
  onClose: any;
  visible: boolean;
  uploadModel: any;
  onOk: () => void;
  onChange: (params: any) => void;
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
          <video controls width="100%" height={200} src={url} />
        </div>
      );
  }
};
export default function ImgModal({ onOk, onChange, visible, onClose, uploadModel, upload }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const [uploading, setUploading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <div ref={ref}>
      <input
        style={{ display: 'none' }}
        type="file"
        accept={getMIMEType(uploadModel.type)}
        ref={inputRef}
        className={css['editor-upload__input']}
        onChange={(evt) => {
          const file = (evt.target && evt.target.files && evt.target.files[0]) || null;
          if (file) {
            setUploading(true);
            upload([
              {
                file: file,
                file_name: file.name,
                file_type: uploadModel.type
              }
            ]).then((urlList) => {
              const url = urlList?.[0]?.url;
              if (url) {
                uploadModel.url = url;
              }
              setUploading(false);
            });
          }
        }}
      />
      <Modal
        title={uploadModel.title}
        visible={visible}
        width={520}
        bodyStyle={{
          padding: '8px 24px'
        }}
        maskClosable={false}
        footer={[
          <div className={css['editor-rich-text__footBtn']} key="button">
            <div
              className={`${css['editor-rich-text__modalbtn']} ${css['editor-rich-text__footBtn-determine']}`}
              style={uploadModel.url?.length ? {} : disabledStyle}
              onClick={onOk}
            >
              确定
            </div>
          </div>
        ]}
        onCancel={onClose}
        getContainer={() => ref.current as HTMLDivElement}
        zIndex={1002}
      >
        <div
          className={css['editor-rich-text__modalbtn']}
          onClick={() => {
            inputRef.current?.click();
          }}
        >
          文件选择
        </div>
        <Input
          value={uploadModel.url}
          placeholder="文件地址"
          onChange={(e) => {
            onChange({ url: e.target.value });
          }}
        />
        <div className={css['editor-rich-text__modal']}>
          {uploadModel.url ? null : (
            <textarea
              onPaste={(e) => {
                paste(e, upload, uploadModel.type).then((url) => {
                  uploadModel.url = url;
                  setUploading(false);
                });
              }}
              className={css['editor-rich-text__modal-text']}
              ref={(e) => {
                if (visible) {
                  e?.focus();
                } else if (e) {
                  resetTextArea(e);
                }
              }}
            />
          )}
          <div className={css['editor-rich-text__modal-placeholder']}>
            <Spin spinning={uploading === true}>
              {!uploadModel.url?.length ? (
                <div className={css['editor-rich-text__modal-placeholder-text']}>
                  <div>可直接粘贴文件</div>
                </div>
              ) : (
                renderPreview(uploadModel)
              )}
            </Spin>
          </div>
        </div>
      </Modal>
    </div>
  );
}

async function paste(e: any, upload: UploadFn, type: string) {
  const cbd = e.clipboardData;

  if (!(e.clipboardData && e.clipboardData.items)) return;
  if (
    cbd.items &&
    cbd.items.length === 2 &&
    cbd.items[0].kind === 'string' &&
    cbd.items[1].kind === 'file' &&
    cbd.types &&
    cbd.types.length === 2 &&
    cbd.types[0] === 'text/plain' &&
    cbd.types[1] === 'Files'
  )
    return;

  const files: Array<File> = [];

  for (let i = 0; i < cbd.items.length; i++) {
    const item = cbd.items[i];

    if (item.kind == 'file') {
      const file = item.getAsFile();
      file.uploadName = `${Date.now()}-${file.name}`;
      if (file?.size === 0) return;
      files.push(file);
    }
  }
  const ret = await upload(
    files.map((file) => ({
      file,
      file_name: file.name,
      file_type: type as 'video' | 'image'
    }))
  );
  e.target.value = ret?.[0].url;
  return ret?.[0].url;
}

function resetTextArea(e: any) {
  e.value = '';
}
