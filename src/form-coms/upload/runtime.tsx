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
  isShowUploadList: boolean;
  isCustom: boolean;
  imageSize: number[];
  customUpload: boolean;
}

interface Window {
  Image: {
    prototype: HTMLImageElement;
    new (): HTMLImageElement;
  };
}

export default function ({ env, data, inputs, outputs, slots }: RuntimeParams<Data>) {
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const fileListRef = useRef<UploadFile[]>([]);
  const removeFileRef = useRef<UploadFile>();
  // fileListRef.current = fileList;
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
      fileListRef.current = val;
      setFileList(val);
    });
    inputs['setInitialValue'] &&
      inputs['setInitialValue']((val) => {
        setFileList(val);
        fileListRef.current = val;
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
    if (!data.customUpload) {
      if (typeof env.uploadFile !== 'function') {
        message.error(`应用的env中没有uploadFile方法`);
        return;
      }
      env
        .uploadFile(fileList)
        .then((res) => {
          onUploadComplete(res);
        })
        .catch(() => {
          setFileList([]);
        });
    } else {
      const formData = new FormData();
      fileList.forEach((file) => {
        formData.append(fileKey, file);
      });
      fileListRef.current = onFormatFileList(fileList);
      outputs.upload(formData);
    }
  };

  //上传图片尺寸限制
  //参数分别是上传的file，想要限制的宽，想要限制的高
  const checkWH = (file, width, height) => {
    return new Promise(function (resolve, reject) {
      let filereader = new FileReader();
      filereader.onload = (e: any) => {
        let src: any = e.target.result;
        const image = new window.Image();
        image.onload = function () {
          if (width && image.width != width) {
            message.error(`请上传宽为${width}(px)的图片`);
            //reject('error');
          } else if (height && image.height != width) {
            message.error(`请上传宽高为${height}}(px)的图片`);
            // reject('error');
          } else {
            resolve('success');
          }
        };
        image.onerror = reject;
        image.src = src;
      };
      filereader.readAsDataURL(file);
    });
  };

  // 文件合法校验
  const beforeUpload = useCallback((file: File, fileList: File[]) => {
    const acceptTypesList = fileType || [];
    const isNotAccept = fileList.some((file) => {
      let isImage = file.type.slice(0, 5) === 'image';
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
      return !(
        isAcceptFileType &&
        isAcceptFileSize &&
        (JSON.stringify(data.imageSize) === JSON.stringify([0, 0]) || !isImage
          ? true
          : !checkWH(file, data.imageSize[0], data.imageSize[1]))
      );
    });

    if (!isNotAccept) {
      onCustomRequest(fileList);
    }
    return !isNotAccept;
  }, []);

  const onRemove = (file) => {
    if (!data.config.useCustomRemove) {
      fileListRef.current = fileList.filter(({ uid }) => file.uid !== uid);
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
  if (
    (data.config.listType === 'text' && data.isCustom === true && env.edit) ||
    (data.config.listType === 'picture' && data.isCustom === true && env.edit)
  ) {
    classnames.push(css.custom);
  }

  //编辑态，自定义内容时不可编辑
  let condition =
    env.edit &&
    data.isCustom === true &&
    (data.config.listType === 'text' || data.config.listType === 'picture');

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
          if (usePreview && !/\.(jpg|jpeg|png|GIF|JPG|PNG)$/.test(file.name)) {
            onpenImgPreview(file.url);
          } else {
            window.open(file.url);
          }
        }}
        disabled={condition ? true : disabled}
        multiple={multiple}
        maxCount={fileCount}
        showUploadList={
          data.isShowUploadList === false && data.config.listType !== 'picture-card'
            ? false
            : { showPreviewIcon: usePreview }
        }
      >
        {/* 目前上传列表类型为文字列表和图片列表，支持自定义内容和是否展示文件列表 */}
        {(data.isCustom === true && data.config.listType === 'text') ||
        (data.isCustom === true && data.config.listType === 'picture') ? (
          <div>{slots['carrier'] && slots['carrier'].render()}</div>
        ) : (
          renderUploadText()
        )}
      </UploadNode>
    </div>
  );
}
