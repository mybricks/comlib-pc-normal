import React, { useEffect, useRef } from 'react';

export interface UploadParams {
  file: File;
  file_name: string;
  file_type: 'image' | 'video';
}

export interface UploadFn {
  (params: UploadParams): Promise<{ url: string }>;
}

export default function useUpload(inputs: any, outputs: any) {
  const resolvedRef = useRef<any>(null);

  const upload: UploadFn = async (params) => {
    outputs['upload'](params);
    return await new Promise((res) => {
      resolvedRef.current = res;
    });
  };

  useEffect(() => {
    inputs['uploadResponse']((response: { url: string }) => {
      resolvedRef.current && resolvedRef.current(response);
    });
  }, []);

  return { upload };
}
