export default function ({ input, output, data, setDeclaredStyle, id }: UpgradeParams<any>): boolean {

  data.formItemList = data.formItemList.filter(item => item !== "mybricks.normal-pc.form-container");

  return true;
}