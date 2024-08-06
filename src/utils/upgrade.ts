// 用于使用在升级脚本中的函数

//
/**
 *
 * @description 添加输出项和并关联输入项
 * @param output
 * @param input
 * @param inputKey
 * @param outputInfo 新增的输出项信息 必需有id、title，description和schema（默认值any）可选
 */
const addOutputAndRel = (
  output: Record<string, any>,
  input: Record<string, any>,
  inputKey: string,
  outputInfo: {
    id: string;
    title: string;
    description?: string;
    schema?: Record<string, any>;
  }
) => {
  const outputKey = outputInfo?.id;
  if (!output.get(outputKey)) {
    const Input = input.get(inputKey);
    output.add({ ...outputInfo, schema: outputInfo?.schema || Input?.schema || { type: 'any' } });
    if (Input) {
      Input?.setRels([outputKey]);
    }
  }
};

export { addOutputAndRel };
