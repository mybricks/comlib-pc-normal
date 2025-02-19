export default function ({ input, output, data, setDeclaredStyle, id }: UpgradeParams<any>): boolean {

  data.formItemList = data.formItemList.filter(item => item !== "amc.normal-h5.form-container");

  return true;
}