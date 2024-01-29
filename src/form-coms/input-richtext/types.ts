export interface iconType {
  icon: string;
  name: string;
  height?: string;
  width?: string;
}

export interface Data {
  style: React.CSSProperties;
  displayEditbar?: boolean;
  toolbar: string[];
  disabled: boolean;
  customUpload: boolean;
  placeholder: string;
  value: any;
  rules: any[];
  statusbar: boolean;
  icons: Array<iconType>;
}
export const getBtnItemIndex = (icons: Array<iconType>, focusArea, datasetKey = 'btnIdx') => {
  const key = focusArea?.dataset?.[datasetKey];
  return icons.findIndex((icon) => key && icon.icon === key);
};
