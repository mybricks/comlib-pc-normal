import React, { FC, useCallback, useState } from 'react';
import { UploadOutlined } from '@ant-design/icons';
import { Button, Upload, UploadFile } from 'antd';
import { ajax } from '../../util';

import styles from './index.less';

interface UploadFileProps {
  value?: any;
  onChange?(value: any): void;
  maxCount?: number;
  disabled?: boolean;
}

const UploadFile: FC<UploadFileProps> = (props) => {
  const { value = [], onChange, maxCount = 1, disabled } = props;
  const [fileList, setFileList] = useState<UploadFile[]>(
    Array.isArray(value)
      ? value.map((item, index) => ({
          uid: String(Date.now()) + index,
          name: item?.name,
          status: 'done',
          url: item?.url
        }))
      : []
  );

  const handleChange = useCallback(({ fileList: newFileList }) => {
    setFileList(newFileList);
    onChange?.(
      newFileList
        .filter((file) => file.status === 'done')
        .map((file) => {
          return { name: file.name, url: file.response.url };
        })
    );
  }, []);

  const uploadRequestFile = useCallback((file) => {
    const formData = new FormData();
    formData.append('file', file.file);
    formData.append('folderPath', `/imgs/${Date.now()}`);
    ajax(formData as any, { url: '/paas/api/flow/saveFile', contentType: 'multipart/form-data' })
      .then((res) => {
        file.onSuccess(res);
      })
      .catch((error) => {
        file.onError(error);
      });
  }, []);

  return (
    <Upload
      className={styles.uploadFile}
      customRequest={uploadRequestFile}
      accept="*/*"
      fileList={fileList}
      maxCount={maxCount}
      onChange={handleChange}
      disabled={disabled}
    >
      {fileList.length >= maxCount ? null : (
        <Button className={fileList.length ? styles.button : ''} icon={<UploadOutlined />}>
          上传
        </Button>
      )}
    </Upload>
  );
};

export default UploadFile;
