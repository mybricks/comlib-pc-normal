import { Button, Upload, message, Image, UploadFile } from 'antd';
import { render, unmountComponentAtNode } from 'react-dom';
import * as Icons from '@ant-design/icons';
import React, { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { validateFormItem } from '../utils/validator';

import css from './runtime.less';
import { PlusOutlined, UploadOutlined } from '@ant-design/icons';
import { OutputIds } from '../types';

interface UploadConfig {
  buttonText: string;
  name: string;
  listType: string | undefined;
  fileType: string[];
  fileSize: number;
  fileCount: number;
  fileKey: string;
  usePreview?: boolean;
  multiple?: boolean;
  uploadStyle: React.CSSProperties;
  uploadIcon?: string;
  disabled: boolean;
  useCustomRemove: boolean;
}
interface UploadFileList {
  uid?: string;
  name: string;
  status?: string;
  url?: string;
  percent?: number;
  thumbUrl?: string;
}
export interface Data {
  rules: any[];
  config: UploadConfig;
}

export default function ({ env, data, inputs, outputs }: RuntimeParams<Data>) {
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const fileListRef = useRef<UploadFile[]>([]);
  const removeFileRef = useRef<UploadFile>();
  fileListRef.current = fileList;
  const uploadRef = useRef();
  const {
    fileKey,
    disabled,
    fileCount,
    uploadIcon = 'InboxOutlined',
    buttonText,
    uploadStyle,
    fileSize,
    fileType,
    listType,
    usePreview,
    multiple
  } = data.config;

  useLayoutEffect(() => {
    inputs['setValue']((val: UploadFile[]) => {
      setFileList(val);
    });
    inputs['setInitialValue'] &&
      inputs['setInitialValue']((val) => {
        setFileList(val);
        outputs[OutputIds.OnInitial](val);
      });
    inputs['validate']((val, outputRels) => {
      validateFormItem({
        value: fileListRef.current,
        env,
        rules: data.rules
      })
        .then((r) => {
          outputRels['returnValidate'](r);
        })
        .catch((e) => {
          outputRels['returnValidate'](e);
        });
    });
    inputs['getValue']((val, outputRels) => {
      outputRels['returnValue'](fileListRef.current);
    });

    inputs['resetValue'](() => {
      setFileList([]);
    });

    //设置禁用
    inputs['setDisabled'](() => {
      data.config.disabled = true;
    });
    //设置启用
    inputs['setEnabled'](() => {
      data.config.disabled = false;
    });
    inputs['uploadDone']((file: any) => {
      onUploadComplete(file);
    });
    inputs['remove']((file: any) => {
      onRemoveFile(typeof file === 'object' ? file : removeFileRef.current || {});
    });
  }, []);

  const onRemoveFile = useCallback((file) => {
    setFileList((list) => list.filter((item) => item.uid !== file.uid));
  }, []);

  const formatCompleteFile = (res: UploadFileList, tempList: UploadFileList[]) => {
    let isUpload = false;
    let newVal = tempList || [];
    newVal.forEach((item) => {
      if ((item.uid === res.uid || item.name === res.name) && item.status === 'uploading') {
        isUpload = true;
        Object.assign(item, {
          status: 'done',
          percent: 100,
          ...res
        });
      }
    });
    if (!isUpload) {
      newVal.forEach((item) => {
        if (!isUpload && item.status === 'uploading') {
          isUpload = true;
          Object.assign(item, {
            status: 'done',
            percent: 100,
            ...res
          });
        }
      });
    }
    if (!isUpload) {
      newVal.push({
        status: 'done',
        percent: 100,
        name: res.url,
        ...res
      });
    }

    return newVal;
  };
  const onUploadComplete = (res: UploadFileList | UploadFileList[]) => {
    const list = Array.isArray(res) ? res : [res];
    list.forEach((item) => {
      formatCompleteFile(item, fileListRef.current);
    });
    setFileList([...fileListRef.current]);
  };

  // 文件数据格式化
  const onFormatFileList = (fileList: UploadFile[]) => {
    let uploadedList = [...fileListRef.current];
    fileList.forEach((file) => {
      const { name } = file;
      const formItemResValue = {
        name,
        status: 'uploading',
        percent: 0
      };
      uploadedList.push(formItemResValue);
      if (fileCount && uploadedList.length > fileCount) {
        uploadedList.shift();
      }
    });
    return uploadedList;
  };
  // 文件上传输出
  const onCustomRequest = (fileList: UploadFile[]) => {
    const formData = new FormData();
    fileList.forEach((file) => {
      formData.append(fileKey, file);
    });
    fileListRef.current = onFormatFileList(fileList);
    outputs.upload(formData);
  };
  // 文件合法校验
  const beforeUpload = useCallback((file: File, fileList: File[]) => {
    const acceptTypesList = fileType || [];
    const isNotAccept = fileList.some((file) => {
      let isAcceptFileType = true;
      if (acceptTypesList.length) {
        isAcceptFileType = acceptTypesList.some((element) => {
          return element.split('.').some((extname) => extname && file.name.includes);
        });
      } else {
        isAcceptFileType = true;
      }

      if (!isAcceptFileType) {
        message.error('上传文件格式不正确!');
      }

      const acceptFileSize = +fileSize;

      let isAcceptFileSize = true;
      if (acceptFileSize) {
        isAcceptFileSize = file.size / 1024 / 1024 < acceptFileSize;
      }

      if (!isAcceptFileSize) {
        message.error(`上传文件大小不能超过${acceptFileSize}MB!`);
      }

      return !(isAcceptFileType && isAcceptFileSize);
    });

    if (!isNotAccept) {
      onCustomRequest(fileList);
    }
    return !isNotAccept;
  }, []);

  const onRemove = (file) => {
    if (!data.config.useCustomRemove) {
      setFileList((list) => list.filter(({ uid }) => file.uid !== uid));
      return true;
    }
    removeFileRef.current = file;
    outputs.remove(file);
    return false;
  };

  const ImgPreview = (props: any) => {
    const [visible, setVisible] = useState(true);
    const { src, onClose } = props;
    const onVisibleChange = (visible) => {
      if (!visible) {
        setVisible(visible);
        onClose();
      }
    };

    return (
      <Image
        width={0}
        height={0}
        src={src}
        preview={{
          src,
          visible,
          onVisibleChange
        }}
      />
    );
  };
  // 打开图片预览
  const onpenImgPreview = (src) => {
    let divEle = document.getElementById('img-preview');
    if (!divEle) {
      divEle = document.createElement('div');
      divEle.setAttribute('id', 'img-preview');
      document.body.appendChild(divEle);
    }
    const onClose = () => {
      unmountComponentAtNode(divEle as HTMLElement);
    };

    render(<ImgPreview src={src} onClose={onClose} />, divEle);
  };
  const UploadNode = listType === 'dragger' ? Upload.Dragger : Upload;
  // 上传按钮渲染
  const renderUploadText = () => {
    const pictureButton = (
      <div>
        <PlusOutlined />
        <div style={{ marginTop: 8 }}>{buttonText}</div>
      </div>
    );

    const normalButton = (
      <Button icon={<UploadOutlined />} disabled={disabled}>
        {buttonText}
      </Button>
    );

    const draggerButton = (
      <>
        <p className="ant-upload-drag-icon">{Icons && Icons[uploadIcon]?.render()}</p>
        <p className="ant-upload-text">{buttonText}</p>
      </>
    );

    const uploadButton = {
      text: normalButton,
      picture: normalButton,
      'picture-card': pictureButton,
      dragger: draggerButton
    };
    if (!fileCount || (Array.isArray(fileList) && fileList.length < fileCount)) {
      return uploadButton[listType];
    }
    return null;
  };

  const setUploadStyle = (node: HTMLElement) => {
    if (!node) {
      return;
    }
    const uploadSelectWrap = node.querySelector('.ant-upload-select');
    let fileListKey, uploadBtnKey;
    switch (listType) {
      case 'picture':
      case 'text':
        fileListKey = '.ant-upload-list-item';
        uploadBtnKey = '.ant-btn';
        break;
      case 'picture-card':
        fileListKey = '.ant-upload-list-picture-card-container';
        break;
      default:
        break;
    }

    const list = [
      uploadSelectWrap,
      ...(fileListKey ? Array.from(node.querySelectorAll(fileListKey)) : []),
      uploadBtnKey ? uploadSelectWrap?.querySelector(uploadBtnKey) : uploadSelectWrap
    ];
    if (listType === 'dragger') {
      list.push(node);
    }
    list.forEach((ele) => {
      Object.keys(uploadStyle || {}).forEach((key) => {
        if (ele) {
          ele.style[key] = uploadStyle[key] ? `${uploadStyle[key]}px` : '';
        }
      });
    });
  };

  useEffect(() => {
    setUploadStyle(uploadRef.current);
  }, [uploadRef.current, uploadStyle, listType, fileList]);

  const classnames = [css.uploadWrap];
  if (listType === 'dragger') {
    classnames.push(css.fullWidth);
    if (fileCount && Array.isArray(fileList) && fileList.length >= fileCount) {
      classnames.push(css.emptyDragger);
    }
  }

  return (
    <div ref={uploadRef} className={classnames.join(' ')}>
      <UploadNode
        name={fileKey}
        listType={listType}
        fileList={Array.isArray(fileList) ? fileList : void 0}
        accept={fileType.join()}
        customRequest={() => {}}
        beforeUpload={beforeUpload}
        onRemove={onRemove}
        onPreview={(file: UploadFile) => {
          if (usePreview) {
            onpenImgPreview(file.url);
          }
        }}
        disabled={disabled}
        multiple={multiple}
        maxCount={fileCount}
        showUploadList={{
          showPreviewIcon: usePreview
        }}
      >
        {renderUploadText()}
      </UploadNode>
    </div>
  );
}
