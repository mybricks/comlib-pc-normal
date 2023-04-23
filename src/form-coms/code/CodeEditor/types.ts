export type AceConfig = Partial<{
  placeholder: string;
  minLines: number;
  maxLines: number;
  wrap: boolean;
  fontSize: number;
  language: string;
  showPrintMargin: boolean;
  indentedSoftWrap: boolean;
  firstLineNumber: number;
}>;

export interface EditorProps {
  value: string | undefined;
  onChange: (val: string) => void;
  onBlur?: (val: string) => void;
  readOnly?: boolean
  config?: AceConfig;
}
