import merge from "lodash/merge";
import { WidthTypeEnum } from './types';
import { setDataSchema, Schemas } from './schema';
import { setColumns } from './utils';
import { InputIds, OutputIds } from './constants';
const version = ANTD_VERSION === 4 ? "" : "antd5."

const handleDataColumns = (params) => {
  const { data, val, slot } = params
  let newRowKey = data?.rowKey;
  for (let item of val) {
    if (item.dataIndex === '') {
      item.dataIndex = item.title;
    }

    // 保证每次只有一个isRowKey是true
    if (item?.isRowKey && data.rowKey !== item.dataIndex) {
      newRowKey = String(item.dataIndex);
    }
    // 开启唯一key之后不能取消
    else if (data.rowKey === item.dataIndex && !item?.isRowKey) {
      // @ts-ignore
      item._renderKey = uuid(); // 新增一个随机的值renderKey刷新防止不更新
    }
  }

  data.rowKey = newRowKey;

  const cols = val.map((item) => ({
    ...item,
    width: item.isAutoWidth ? WidthTypeEnum.Auto : Number(item.width) || 140,
    isAutoWidth: undefined,
    isRowKey: data?.rowKey && item?.dataIndex === data?.rowKey
  }));
  setColumns({ data, slot }, cols);
  setDataSchema(params);
}

export default {
  prompts: {
    summary: `数据表格 Table，表格中除了表格配置之外，还内置了分页器，可以通过配置项添加。`,
    forUpdate:`
<补充说明>
  # 插槽
  1. 当表格列设置为插槽时，插槽ID为该列的\`slotId属性值\`；
  2. 表格头部操作区的插槽ID为\`headerTitle\`，使用前必须确定已经开启了标题区插槽；

  # 功能
  1. 操作列插槽内建议使用\`mybricks.normal-pc.antd5.toolbar\`组件，通常为横向排布的按钮组；
  2. 对于表格列的配置，需要通过列区域功能配置；
  3. 所有分页相关配置的前提是开启了分页模式；
  </补充说明>
    `,
    usage: `数据表格 Table，表格中除了表格配置之外，还内置了分页器，可以通过配置项添加。

slots插槽
动态插槽，当cloumn的contentType为slotItem时，对应列的key

元素组成
  - 表格
  - 分页器：默认位于右下角区域，从左到右包含「总结条数」「分页器」「每页条数下拉选择」「跳页器」

常见使用思路
  1. 添加多个表格列：核心是通过配置表格列添加合适的列数，必须每一列进行考虑是否要调整，列的默认类型是「普通文字」；
    1.1 使用配置表格列配置合适的列数信息，同时配置每一列的contentType；
    1.2 通过 thead th 表格列来选中列，并对列进行配置：
      1.2.1 对于表格列的类型，默认为「普通文字」类型（颜色为黑灰色），仔细考虑列应该配置什么类型，找不到对应类型则通过「自定义插槽」添加子组件自定义UI；

  2. 表格使用分页配置
    开启后，默认在右下角展示分页器组件。
  `,
  },

  editors: [
    '常规/列/列宽分配',
    {
      title: '常规/表格列',
      description: '通过数组来配置所有列',
      type: 'array',
      value: {
        set: ({ data, slot, ...extra }) => {
          debugger
          console.log(extra)
        }
      }
    },
    '常规/分页模式',
    '高级/勾选',
    '高级/勾选配置/勾选类型',
    '样式/默认/表格容器',
    '样式/默认/表格',
    '样式/默认/单元格',
    '样式/默认/行'
  ],
}