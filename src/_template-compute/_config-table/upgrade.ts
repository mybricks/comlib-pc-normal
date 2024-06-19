import { Data } from './index';

export default function ({ input, output, data }): boolean {
  /**
   * @description v1.0.1->1.0.2 , 增加配置列
   */
  if (typeof data.operationType === 'undefined') {
    data.operationType = 'setColumn';
  }

  // if (!input.get("setColumn")) {
  //   input.add("setColumn", "配置", {
  //     "type": "object",
  //     "properties": {
  //       "columns": {
  //         "type": "array",
  //         "description": "列配置,可以整体输入表格数据、列前添加、列后添加",
  //         "items": {
  //           "type": "object",
  //           "properties": {
  //             "title": {
  //               "type": "string",
  //               "description": "列标题，必填"
  //             },
  //             "dataIndex": {
  //               "type": "string",
  //               "description": "列字段，必填"
  //             },
  //             "width": {
  //               "type": "number",
  //               "description": "列宽度，可选"
  //             },
  //             "visible": {
  //               "type": "boolean",
  //               "description": "是否显示，可选"
  //             },
  //             "template": {
  //               "type": "string",
  //               "description": "指定模板列，可选"
  //             }
  //           }
  //         }
  //       },
  //       "paginationConfig": {
  //         "type": "object",
  //         "description": "分页配置，可选",
  //         "properties": {
  //           "disabled": {
  //             "type": "boolean",
  //             "description": "是否显示分页，可选"
  //           },
  //           "defaultPageSize": {
  //             "type": "number",
  //             "description": "默认每页显示条数，可选"
  //           },
  //           "showSizeChanger": {
  //             "type": "boolean",
  //             "description": "是否开启分页条数选择功能， 可选"
  //           }
  //         }
  //       }
  //     }
  //   });
  // }

  return true;
}
