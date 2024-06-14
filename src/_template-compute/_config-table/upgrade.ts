import { Data } from './index';

export default function ({ input, output, data }): boolean {
  /**
   * @description v1.0.1->1.0.2 , 增加配置列
   */
  if (typeof data.operationType === 'undefined') {
    data.operationType = 'setColumn';
  }

  if (!input.get("setColumn")) {
    input.add("setColumn", "列配置", {
      type: "array",
      description: "列配置,可以整体输入表格数据、列前添加、列后添加",
      items: {
        type: "object",
        properties: {
          title: {
            type: "string",
            description: "标题"
          },
          dataIndex: {
            type: "string",
            description: "字段"
          },
          width: {
            type: "number",
            description: "组件namespace"
          },
          visible: {
            type: "boolean",
            description: "是否显示"
          }
        }
      }
    });
  }

  /**
   * @description v1.0.1->1.0.3 , 增加分页配置
   */
  if (typeof data.isPagination === 'undefined') {
    data.isPagination = false;
  }
  
  return true;
}
