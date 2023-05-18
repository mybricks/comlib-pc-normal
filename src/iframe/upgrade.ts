export default function ({ input, output, slot, data }): boolean {
  /**
   * @description v1.0.1 , 新增id
  */
  if (typeof data.id === "undefined") {
    data.id = "iframe";
  };
  
  return true;
}