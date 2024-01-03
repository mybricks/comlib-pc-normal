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
  const resolvedRef = useRef<any>(null);

  const upload: UploadFn = async (params) => {
    const responsePromise = new Promise<{ url: string }>((res) => {
      resolvedRef.current = res;
    });
    outputs['upload'](params);
    return await responsePromise;
  };

  useEffect(() => {
    inputs['uploadResponse']?.((response: { url: string }) => {
      resolvedRef.current && resolvedRef.current(response);
    });
  }, []);

  return { upload };
}
