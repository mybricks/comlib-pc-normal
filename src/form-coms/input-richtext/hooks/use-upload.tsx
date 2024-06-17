import React, { useEffect, useRef } from 'react';

export interface UploadParams {
  file: File;
  file_name: string;
  file_type: 'image' | 'video' | string;
}

export interface UploadFn {
  (params: UploadParams): Promise<{ url: string }>;
}

export default function useUpload(inputs: any, outputs: any) {
  const uploadQueueRef = useRef<
    {
      params: UploadParams;
      res: (response: { url: string }) => void;
      rej: (errMsg: string) => void;
    }[]
  >([]);
  const runRef = useRef(false);

  const resolvedRef = useRef<any>(null);
  const rejectedRef = useRef<any>(null);

  const upload: UploadFn = async (params) => {
    return new Promise((res, rej) => {
      uploadQueueRef.current.push({ params, res, rej });
      if (!runRef.current) resolvingUploadQueue();
    });
  };

  const resolvingUploadQueue = async () => {
    runRef.current = true;
    while (uploadQueueRef.current.length > 0) {
      const { params, rej: reject, res: resolve } = uploadQueueRef.current.shift()!;
      const responsePromise = new Promise<{ url: string }>((res, rej) => {
        resolvedRef.current = (response: { url: string }) => {
          res(response);
          resolve(response);
        };
        rejectedRef.current = (errMsg: string) => {
          rej(errMsg);
          reject(errMsg);
        };
      });
      outputs['upload'](params);
      await responsePromise;
    }
    runRef.current = false;
  };

  useEffect(() => {
    inputs['uploadResponse']?.((response: { url: string }) => {
      resolvedRef.current && resolvedRef.current(response);
    });
    inputs['uploadReject']?.((errMsg: string) => {
      rejectedRef.current && rejectedRef.current(errMsg);
    });
  }, []);

  return { upload };
}
