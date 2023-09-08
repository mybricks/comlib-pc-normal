import { Data } from "./types";

export const SelectOptionFilterPropsType = {
  Label: "label",
  Value: "value",
  Children: "children",
};

export const treeDataInDesign = (data: Data) => [
  {
    [data.valueFieldName || 'value']: '第一级 1',
    [data.labelFieldName || 'label']: '第一级 1',
    [data.childrenFieldName || 'children']: [
      {
        [data.valueFieldName || 'value']: '第二级 1-1',
        [data.labelFieldName || 'label']: '第二级 1-1',
        [data.childrenFieldName || 'children']: [
          {
            [data.valueFieldName || 'value']: '叶子 1-1-1',
            [data.labelFieldName || 'label']: '叶子 1-1-1',
          },
          {
            [data.valueFieldName || 'value']: '叶子 1-1-2',
            [data.labelFieldName || 'label']: '叶子 1-1-2',
          },
        ],
      },
      {
        [data.valueFieldName || 'value']: '第二级 1-2',
        [data.labelFieldName || 'label']: '第二级 1-2',
        [data.childrenFieldName || 'children']: [
          {
            [data.valueFieldName || 'value']: '叶子 1-2-1',
            [data.labelFieldName || 'label']: '叶子 1-2-1',
          },
        ],
      },
    ],
  },
];