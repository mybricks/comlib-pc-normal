export interface Data {
  style: React.CSSProperties;
  displayEditbar?: boolean;
  toolbar: string[];
  disabled: boolean;
  placeholder: string;
  value: any;
  rules: any[];
}

export type UploadFn = (
  contents: { file: any; file_type: 'image' | 'video'; file_name: string }[]
) => Promise<
  | {
      url: string;
    }[]
  | null
>;
