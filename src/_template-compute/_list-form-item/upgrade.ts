export default function ({ input, output, data, setDeclaredStyle, id }: UpgradeParams<any>): boolean {

  data.formItemList = data.formItemList.filter(item => item !== "mybricks.normal-h5.form-container");

  return true;
}