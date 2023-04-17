import React from 'react';
import {
  DefaultComponentNameMap,
  Data,
  FieldBizType,
  FieldDBType,
  ModalAction,
  ComponentName,
  DefaultOperatorMap
} from './constants';
import { uuid } from '../utils';
import { RuleKeys, RuleMapByBizType } from './rule';
import { ajax } from './util';
import Refresh from './editors/refresh';

enum SizeEnum {
  DEFAULT = 'default',
  MIDDLE = 'middle',
  SMALL = 'small'
}

export default {
  '@init'({ data }) {
    const id =
      location.search
        .split('?')
        .pop()
        ?.split('&')
        .find((key) => key.startsWith('id='))
        ?.replace('id=', '') ?? '';
    id &&
      ajax({ fileId: id }, { url: '/api/system/domain/entity/list' }).then(
        (res) => (data.domainAry = res || [])
      );
  },
  ':root': ({ data, focusArea }: EditorResult<Data>, cate1, cate2, cate3) => {
    const fieldAry = data.entity?.fieldAry ?? [];

    cate1.title = '常规';
    cate1.items = [
      {
        title: '模型选择',
        items: [
          {
            title: '实体',
            type: 'Select',
            options(props) {
              return {
                get options() {
                  const entityList: Array<{ label: string; value: string }> = [];
                  props.data.domainAry?.forEach((domain) => {
                    domain.entityList
                      .filter((entity) => !entity.isSystem && entity.isOpen)
                      .forEach((entity) => {
                        entityList.push({
                          label: `${domain.fileName}.${entity.name}`,
                          value: `${domain.fileId}.${entity.id}`
                        });
                      });
                  });

                  return entityList;
                }
              };
            },
            value: {
              get({ data }: EditorResult<Data>) {
                return data.domainFileId ? `${data.domainFileId}.${data.entityId}` : undefined;
              },
              set({ data, output, input }: EditorResult<Data>, value: string = '') {
                const [domainFileId, entityId] = value.split('.');
                if (data.domainFileId !== domainFileId || data.entityId !== entityId) {
                  data.fieldAry = [];
                  data.formFieldAry = [];
                  data.domainFileId = Number(domainFileId);
                  data.entityId = entityId;

                  const entity = data.domainAry
                    .find((d) => d.fileId === Number(domainFileId))
                    ?.entityList.find((entity) => entity.id === entityId);
                  const curEntity = JSON.parse(JSON.stringify(entity || null));

                  if (curEntity) {
                    curEntity.fieldAry.forEach((field) => {
                      field.form = {};

                      if (
                        [FieldBizType.SYS_USER_UPDATER, FieldBizType.SYS_USER_CREATOR].includes(
                          field.bizType
                        )
                      ) {
                        field.form.required = true;
                      }
                    });
                    curEntity.fieldAry
                      .filter(
                        (field) =>
                          ![FieldBizType.MAPPING].includes(field.bizType) &&
                          !field.isPrimaryKey &&
                          !field.isPrivate &&
                          !field.defaultValueWhenCreate
                      )
                      .forEach((field) => {
                        field.form.formItem =
                          DefaultComponentNameMap[field.bizType] || ComponentName.INPUT;

                        if (
                          field.bizType === FieldBizType.ENUM &&
                          Array.isArray(field.enumValues)
                        ) {
                          field.form.options = field.enumValues.map((v) => ({
                            label: v,
                            value: v
                          }));
                        }
                      });

                    data.entity = curEntity;
                  }
                }
              }
            }
          },
          {
            title: '刷新模型实体信息',
            type: 'editorRender',
            options: {
              render: Refresh
            },
            ifVisible({ data }: EditorResult<Data>) {
              return !!data.entity;
            },
            value: {
              get({ data }) {
                return { domainFileId: data.domainFileId, entityId: data.entityId };
              },
              set({ data, setTitle, title, output }, newEntity: any) {
                data.formFieldAry = data.formFieldAry
                  .map((field) => {
                    let newField = newEntity.fieldAry.find(
                      (f) => f.id === field.id || f.name === field.name
                    );

                    if (!newField) {
                      return;
                    }
                    newField = JSON.parse(JSON.stringify(newField));
                    newField.form = field.form;

                    const newFormItem =
                      DefaultComponentNameMap[newField.bizType] || ComponentName.INPUT;
                    const oldFormItem =
                      DefaultComponentNameMap[field.bizType] || ComponentName.INPUT;

                    if (oldFormItem === field.form.formItem) {
                      newField.form.formItem = newFormItem;
                    }

                    if (
                      newField.bizType === FieldBizType.ENUM &&
                      Array.isArray(newField.enumValues)
                    ) {
                      newField.form.options = newField.enumValues.map((v) => {
                        const oldOption =
                          field.bizType === FieldBizType.ENUM
                            ? field.form.options.find((o) => o.value === v)
                            : undefined;

                        return oldOption || { label: v, value: v };
                      });
                    }

                    return newField;
                  })
                  .filter(Boolean);

                const curFieldAry = data.fieldAry
                  .filter((f) => f.bizType !== FieldBizType.FRONT_CUSTOM)
                  .map((field) => {
                    let newField = newEntity.fieldAry.find(
                      (f) => f.id === field.id || f.name === field.name
                    );

                    if (!newField) {
                      return;
                    }
                    newField = JSON.parse(JSON.stringify(newField));
                    newField.tableInfo = field.tableInfo;

                    if (!field.mappingField && newField.mapping?.entity) {
                      return;
                    } else if (field.mappingField && newField.mapping?.entity) {
                      const mappingField = newField.mapping?.entity.fieldAry.find(
                        (f) => f.id === field.mappingField.id || f.name === field.mappingField.name
                      );

                      if (mappingField) {
                        newField.mappingField = {
                          ...mappingField,
                          relationEntityId: newField.mapping?.entity.id
                        };
                      }
                    }

                    return newField;
                  })
                  .filter(Boolean);

                if (curFieldAry.length > 0) {
                  curFieldAry.push({
                    name: '操作',
                    tableInfo: { label: '操作', width: '124px', align: 'left' },
                    bizType: FieldBizType.FRONT_CUSTOM,
                    id: 'operate'
                  });

                  data.fieldAry = curFieldAry;
                } else {
                  data.fieldAry = [];
                }

                newEntity.fieldAry.forEach((newField) => {
                  newField.form = {};
                });

                newEntity.fieldAry
                  .filter(
                    (field) =>
                      !field.isPrimaryKey && !field.isPrivate && !field.defaultValueWhenCreate
                  )
                  .forEach((newField) => {
                    const field = data.entity?.fieldAry.find(
                      (f) => f.id === newField.id || f.name === newField.name
                    );

                    const newFormItem =
                      DefaultComponentNameMap[newField.bizType] || ComponentName.INPUT;
                    const initForm: Record<string, unknown> = { formItem: newFormItem };
                    if (
                      [FieldBizType.SYS_USER_UPDATER, FieldBizType.SYS_USER_CREATOR].includes(
                        newField.bizType
                      )
                    ) {
                      initForm.required = true;
                    }

                    if (field) {
                      newField.form = field.form || initForm;
                      const oldFormItem =
                        DefaultComponentNameMap[field.bizType] || ComponentName.INPUT;

                      /** 老的表单项类型未变更过 */
                      if (
                        oldFormItem === field.form.formItem ||
                        ([FieldBizType.SYS_USER_UPDATER, FieldBizType.SYS_USER_CREATOR].includes(
                          newField.bizType
                        ) &&
                          ![FieldBizType.SYS_USER_UPDATER, FieldBizType.SYS_USER_CREATOR].includes(
                            field.bizType
                          ))
                      ) {
                        newField.form = { ...newField.form, ...initForm };
                      }
                    } else {
                      newField.form = initForm;
                    }

                    if (
                      newField.bizType === FieldBizType.ENUM &&
                      Array.isArray(newField.enumValues)
                    ) {
                      newField.form.options = newField.enumValues.map((v) => {
                        const oldOption =
                          field.bizType === FieldBizType.ENUM
                            ? field.form.options.find((o) => o.value === v)
                            : undefined;

                        return oldOption || { label: v, value: v };
                      });
                    }
                  });

                data.entity = newEntity;
              }
            }
          }
        ]
      },
      {
        title: '检索表单',
        ifVisible({ data }: EditorResult<Data>) {
          return !!data.entity;
        },
        items: [
          {
            title: '表单项',
            type: 'Select',
            options(props) {
              return {
                mode: 'tags',
                multiple: true,
                get options() {
                  return props.data.entity?.fieldAry
                    ?.filter((field) => !field.isPrimaryKey && !field.isPrivate)
                    .map((field) => ({ label: field.name, value: field.id }));
                }
              };
            },
            value: {
              get({ data }: EditorResult<Data>) {
                return data.formFieldAry?.map((field) => field.id) || [];
              },
              set({ data, output, input }: EditorResult<Data>, value: string[]) {
                data.formFieldAry = value
                  .map((id) => data.entity.fieldAry.find((field) => field.id === id))
                  .filter(Boolean)
                  .map((field) => JSON.parse(JSON.stringify(field)));
              }
            }
          },
          {
            type: 'array',
            ifVisible() {
              return !!data.formFieldAry;
            },
            options: {
              editable: false,
              addable: false,
              getTitle: ({ name }) => name,
              onRemove: (index: number) => {
                data.formFieldAry.splice(index, 1);
              }
            },
            value: {
              get({ data }: EditorResult<Data>) {
                return data.formFieldAry ?? [];
              },
              set({ data, output, input, slot, ...res }: EditorResult<Data>, val: any[]) {
                data.formFieldAry = val;
              }
            }
          }
        ]
      },
      {
        title: '数据表格',
        ifVisible({ data }: EditorResult<Data>) {
          return !!data.entity;
        },
        items: [
          {
            title: '表格列',
            type: 'Select',
            options(props) {
              return {
                mode: 'tags',
                multiple: true,
                get options() {
                  const options: Array<{ label: string; value: string }> = [];
                  props.data.entity?.fieldAry?.forEach((field) => {
                    if (field.mapping?.entity) {
                      field.mapping?.entity.fieldAry.forEach((f) => {
                        options.push({
                          label: `${field.name}.${f.name}`,
                          value: `${field.id}.${f.id}`
                        });
                      });
                    } else if (!field.isPrimaryKey && !field.isPrivate) {
                      options.push({ label: field.name, value: field.id });
                    }
                  });
                  return options;
                }
              };
            },
            value: {
              get({ data }: EditorResult<Data>) {
                return (
                  data.fieldAry
                    .filter((field) => field.bizType !== FieldBizType.FRONT_CUSTOM)
                    ?.map((field) =>
                      field.mappingField ? `${field.id}.${field.mappingField.id}` : field.id
                    ) || []
                );
              },
              set({ data, output, input }: EditorResult<Data>, value: string[]) {
                const fieldAry = value
                  .map((id) => {
                    const ids = id.split('.');
                    let item = data.entity.fieldAry.find((field) => field.id === ids[0]);
                    if (!item) {
                      return;
                    }

                    item = JSON.parse(JSON.stringify(item));
                    item.tableInfo = { label: item.name, width: '124px', align: 'left' };
                    if (ids.length > 1) {
                      const mappingField = item.mapping?.entity.fieldAry.find(
                        (field) => field.id === ids[1]
                      );
                      item.tableInfo.label = `${item.name}.${mappingField?.name}`;

                      return mappingField
                        ? {
                            ...item,
                            mappingField: {
                              ...mappingField,
                              relationEntityId: item.mapping?.entity.id
                            }
                          }
                        : undefined;
                    } else {
                      return item;
                    }
                  })
                  .filter(Boolean);

                if (fieldAry.length > 0) {
                  fieldAry.push({
                    name: '操作',
                    tableInfo: { label: '操作', width: '124px', align: 'left' },
                    bizType: FieldBizType.FRONT_CUSTOM,
                    id: 'operate'
                  });
                }
                data.fieldAry = fieldAry;
              }
            }
          },
          {
            type: 'array',
            ifVisible() {
              return !!data.fieldAry;
            },
            options: {
              editable: false,
              addable: false,
              getTitle: ({ name, mappingField }) => {
                return `${name}${mappingField ? '.' + mappingField.name : ''}`;
              },
              onRemove: (index: number) => {
                data.fieldAry.splice(index, 1);
              }
            },
            value: {
              get({}: EditorResult<Data>) {
                return (
                  data.fieldAry.filter((field) => field.bizType !== FieldBizType.FRONT_CUSTOM) ?? []
                );
              },
              set({ data, output, input, slot, ...res }: EditorResult<Data>, val: any[]) {
                const curFields = val;
                if (curFields.length > 0) {
                  curFields.push({
                    name: '操作',
                    tableInfo: { label: '操作', width: '124px', align: 'left' },
                    bizType: FieldBizType.FRONT_CUSTOM,
                    id: 'operate'
                  });
                }
                data.fieldAry = curFields;
              }
            }
          },
          {
            title: '开启分页',
            type: 'Switch',
            value: {
              get({ data }: EditorResult<Data>) {
                return data.pagination.show;
              },
              set({ data, output, input }: EditorResult<Data>, value: boolean) {
                data.pagination.show = value;
              }
            }
          }
        ]
      }
    ];

    cate2.title = '样式';
    cate2.items = [
      {
        title: '表格布局风格',
        type: 'Select',
        options: [
          { value: SizeEnum.DEFAULT, label: '默认' },
          { value: SizeEnum.MIDDLE, label: '适中布局' },
          { value: SizeEnum.SMALL, label: '紧凑布局' }
        ],
        value: {
          get({ data }: EditorResult<Data>) {
            return data.table?.size || SizeEnum.MIDDLE;
          },
          set({ data }: EditorResult<Data>, value: SizeEnum) {
            !data.table && (data.table = {});
            data.table.size = value;
          }
        }
      }
    ];

    cate3.title = '高级';
    cate3.items = [
      {
        title: '新增弹框',
        items: [
          {
            title: '打开新增弹框',
            type: 'Switch',
            value: {
              get({ data }: EditorResult<Data>) {
                return data.showActionModalForEdit === ModalAction.CREATE;
              },
              set({ data, output, input }: EditorResult<Data>, value: boolean) {
                data.showActionModalForEdit = value ? ModalAction.CREATE : '';
              }
            }
          }
        ]
      },
      {
        title: '编辑弹框',
        items: [
          {
            title: '打开编辑弹框',
            type: 'Switch',
            value: {
              get({ data }: EditorResult<Data>) {
                return data.showActionModalForEdit === ModalAction.EDIT;
              },
              set({ data, output, input }: EditorResult<Data>, value: boolean) {
                data.showActionModalForEdit = value ? ModalAction.EDIT : '';
              }
            }
          },
          {
            title: '编辑表单字段',
            type: 'Select',
            ifVisible({ data }: EditorResult<Data>) {
              return data.showActionModalForEdit === ModalAction.EDIT;
            },
            options() {
              return {
                mode: 'tags',
                multiple: true,
                get options() {
                  return fieldAry
                    .filter(
                      (field) =>
                        ![FieldBizType.MAPPING, FieldBizType.SYS_USER_CREATOR].includes(
                          field.bizType
                        ) &&
                        !field.isPrimaryKey &&
                        !field.isPrivate &&
                        !field.defaultValueWhenCreate
                    )
                    .map((field) => ({ label: field.name, value: field.id }));
                }
              };
            },
            value: {
              get() {
                return fieldAry
                  .filter(
                    (field) =>
                      ![FieldBizType.MAPPING, FieldBizType.SYS_USER_CREATOR].includes(
                        field.bizType
                      ) &&
                      !field.isPrimaryKey &&
                      !field.isPrivate &&
                      !field.defaultValueWhenCreate &&
                      !field.form.disabledForEdit
                  )
                  .map((field) => field.id);
              },
              set({ data, output, input }: EditorResult<Data>, value: string[]) {
                const fields = fieldAry.filter(
                  (field) =>
                    ![FieldBizType.MAPPING, FieldBizType.SYS_USER_CREATOR].includes(
                      field.bizType
                    ) &&
                    !field.isPrimaryKey &&
                    !field.isPrivate &&
                    !field.defaultValueWhenCreate
                );

                fields.forEach((field) => {
                  !field.form && (field.form = {});

                  !field.form.formItem &&
                    (field.form.formItem =
                      DefaultComponentNameMap[field.bizType] || ComponentName.INPUT);
                  field.form.disabledForEdit = !value.includes(field.id);
                });
              }
            }
          }
        ]
      }
    ];
  },
  '.ant-form-item-search': ({ data, focusArea }: EditorResult<Data>, cate1, cate2) => {
    const field = data.formFieldAry.find((f) => f.id === focusArea.dataset.fieldId);

    if (!field) {
      return;
    }

    cate1.title = '常规';
    cate1.items = [
      {
        title: '标签名称',
        type: 'Text',
        value: {
          get() {
            return field.form?.label ?? field?.name;
          },
          set({ data, focusArea, input, output }: EditorResult<Data>, value: string) {
            if (!field.form) {
              field.form = {};
            }
            field.form.label = value;
          }
        }
      },
      {
        title: '表单项类型',
        type: 'Select',
        options: [
          { label: '输入框', value: ComponentName.INPUT },
          { label: '数字输入框', value: ComponentName.INPUT_NUMBER },
          { label: '下拉框', value: ComponentName.SELECT },
          { label: '时间选择器', value: ComponentName.DATE_PICKER },
          { label: '文本域', value: ComponentName.TEXTAREA },
          { label: '单选', value: ComponentName.RADIO },
          { label: '复选框', value: ComponentName.CHECKBOX },
          { label: '下拉搜索框', value: ComponentName.DEBOUNCE_SELECT },
          { label: '图片上传', value: ComponentName.IMAGE_UPLOAD },
          { label: '上传', value: ComponentName.UPLOAD }
        ],
        value: {
          get() {
            return field.form?.formItem ?? ComponentName.INPUT;
          },
          set({ data, focusArea, input, output }: EditorResult<Data>, value: string) {
            field.form.formItem = value;
          }
        }
      },
      {
        title: '默认行数',
        type: 'InputNumber',
        options: [{ title: '', min: 1, width: 100 }],
        ifVisible() {
          return field.form.formItem === ComponentName.TEXTAREA;
        },
        value: {
          get() {
            return [field.form?.rows || 2];
          },
          set({ data, focusArea, input, output }: EditorResult<Data>, value: string) {
            field.form.rows = value[0] || 2;
          }
        }
      },
      {
        title: '下拉选项列表',
        description: '可设置表单项下拉选项',
        type: 'array',
        ifVisible() {
          return [ComponentName.RADIO, ComponentName.CHECKBOX, ComponentName.SELECT].includes(
            field.form.formItem
          );
        },
        options: {
          addText: '添加选项',
          editable: true,
          getTitle: ({ label, checked }) => {
            return `${label}${checked ? ': 默认值' : ''}`;
          },
          onRemove: (index: number) => {
            field.form.options.splice(index, 1);
          },
          onAdd: () => {
            return {
              label: '选项' + ((field?.form?.options?.length || 0) + 1),
              value: '选项' + ((field?.form?.options?.length || 0) + 1),
              key: uuid()
            };
          },
          items: [
            {
              title: '默认选中',
              type: 'switch',
              value: 'checked'
            },
            {
              title: '禁用',
              type: 'switch',
              value: 'disabled'
            },
            {
              title: '选项标签',
              type: 'textarea',
              value: 'label'
            },
            {
              title: '选项值',
              type: 'valueSelect',
              options: ['text', 'number', 'boolean'],
              description: '选项的唯一标识，可以修改为有意义的值',
              value: 'value'
            }
          ]
        },
        value: {
          get({}: EditorResult<Data>) {
            return field.form?.options ?? [];
          },
          set({ data, output, input, slot, ...res }: EditorResult<Data>, val: any[]) {
            if (!field.form) {
              field.form = {};
            }
            field.form.options = val;
          }
        }
      },
      {
        title: '检索规则',
        type: 'Select',
        options() {
          return {
            get options() {
              switch (field?.dbType) {
                case FieldDBType.VARCHAR: {
                  return [
                    { label: '等于(=)', value: '=' },
                    { label: '不等于(<>)', value: '<>' },
                    { label: '匹配(LIKE)', value: 'LIKE' },
                    { label: '不匹配(NOT LIKE)', value: 'NOT LIKE' },
                    { label: '包含(IN)', value: 'IN' },
                    { label: '不包含(NOT IN)', value: 'NOT IN' }
                  ];
                }
                case FieldDBType.BIGINT: {
                  return [
                    { label: '等于(=)', value: '=' },
                    { label: '不等于(<>)', value: '<>' },
                    { label: '大于等于(>=)', value: '>=' },
                    { label: '小于等于(<=)', value: '<=' },
                    { label: '包含(IN)', value: 'IN' },
                    { label: '不包含(NOT IN)', value: 'NOT IN' }
                  ];
                }
                case FieldDBType.MEDIUMTEXT: {
                  return [
                    { label: '等于(=)', value: '=' },
                    { label: '不等于(<>)', value: '<>' },
                    { label: '匹配(LIKE)', value: 'LIKE' },
                    { label: '不匹配(NOT LIKE)', value: 'NOT LIKE' },
                    { label: '包含(IN)', value: 'IN' },
                    { label: '不包含(NOT IN)', value: 'NOT IN' }
                  ];
                }
                default:
                  return [];
              }
            }
          };
        },
        value: {
          get() {
            return field.form.operator ?? DefaultOperatorMap[field.form.formItem] ?? '=';
          },
          set({ data, focusArea, input, output }: EditorResult<Data>, value: string) {
            if (!field.form) {
              field.form = {};
            }
            field.form.operator = value;
          }
        }
      }
    ].filter(Boolean);

    if (field.form?.formItem === ComponentName.DEBOUNCE_SELECT) {
      cate2.title = '高级';
      cate2.items = [
        {
          title: '选项名称',
          description: '选择下拉选项显示的标签名称所对应的字段',
          type: 'Select',
          options() {
            return {
              get options() {
                return [
                  { label: '无', value: '' },
                  ...(field.mapping?.entity?.fieldAry.map((f) => ({
                    label: f.name,
                    value: f.name
                  })) ?? [])
                ];
              }
            };
          },
          value: {
            get() {
              return field.form?.mapping?.optionLabel ?? '';
            },
            set({ data, focusArea, input, output }: EditorResult<Data>, value: string) {
              if (!field.form) {
                field.form = {};
              }
              if (!field.form.mapping) {
                field.form.mapping = {};
              }
              field.form.mapping.optionLabel = value;
            }
          }
        }
      ];
    }
  },
  '.ant-form-item-area': ({ focusArea, data }: EditorResult<Data>, cate1, cate2) => {
    const field = data.entity.fieldAry.find((f) => f.id === focusArea.dataset.fieldId);

    if (!field) {
      return;
    }

    cate1.title = '常规';
    cate1.items = [
      {
        title: '表单项名称',
        type: 'Text',
        value: {
          get({}: EditorResult<Data>) {
            return field.form?.label || field.name;
          },
          set({}: EditorResult<Data>, value: string) {
            if (!field.form) {
              field.form = {};
            }

            field.form.label = value;
          }
        }
      },
      {
        title: '显示必填样式',
        type: 'Switch',
        value: {
          get({}: EditorResult<Data>) {
            return field.form?.required;
          },
          set({ data, input, output }: EditorResult<Data>, value: boolean) {
            if (!field.form) {
              field.form = {};
            }

            field.form.required = value;
          }
        }
      },
      {
        title: '表单项类型',
        type: 'Select',
        options: [
          { label: '输入框', value: ComponentName.INPUT },
          { label: '数字输入框', value: ComponentName.INPUT_NUMBER },
          { label: '下拉框', value: ComponentName.SELECT },
          { label: '时间选择器', value: ComponentName.DATE_PICKER },
          { label: '文本域', value: ComponentName.TEXTAREA },
          { label: '单选', value: ComponentName.RADIO },
          { label: '复选框', value: ComponentName.CHECKBOX },
          { label: '下拉搜索框', value: ComponentName.DEBOUNCE_SELECT },
          { label: '图片上传', value: ComponentName.IMAGE_UPLOAD },
          { label: '上传', value: ComponentName.UPLOAD }
        ],
        value: {
          get() {
            return field.form?.formItem ?? ComponentName.INPUT;
          },
          set({ data, focusArea, input, output }: EditorResult<Data>, value: string) {
            field.form.formItem = value;
          }
        }
      },
      {
        title: '默认行数',
        type: 'InputNumber',
        options: [{ title: '', min: 1, width: 100 }],
        ifVisible() {
          return field.form.formItem === ComponentName.TEXTAREA;
        },
        value: {
          get() {
            return [field.form?.rows || 2];
          },
          set({ data, focusArea, input, output }: EditorResult<Data>, value: string) {
            field.form.rows = value[0] || 2;
          }
        }
      },
      {
        title: '下拉选项列表',
        description: '可设置表单项下拉选项',
        type: 'array',
        ifVisible() {
          return [ComponentName.RADIO, ComponentName.CHECKBOX, ComponentName.SELECT].includes(
            field.form.formItem
          );
        },
        options: {
          addText: '添加选项',
          editable: true,
          getTitle: ({ label, checked }) => {
            return `${label}${checked ? ': 默认值' : ''}`;
          },
          onRemove: (index: number) => {
            field.form.options.splice(index, 1);
          },
          onAdd: () => {
            return {
              label: '选项' + ((field?.form?.options?.length || 0) + 1),
              value: '选项' + ((field?.form?.options?.length || 0) + 1),
              key: uuid()
            };
          },
          items: [
            {
              title: '默认选中',
              type: 'switch',
              value: 'checked'
            },
            {
              title: '禁用',
              type: 'switch',
              value: 'disabled'
            },
            {
              title: '选项标签',
              type: 'textarea',
              value: 'label'
            },
            {
              title: '选项值',
              type: 'valueSelect',
              options: ['text', 'number', 'boolean'],
              description: '选项的唯一标识，可以修改为有意义的值',
              value: 'value'
            }
          ]
        },
        value: {
          get({}: EditorResult<Data>) {
            return field.form?.options ?? [];
          },
          set({ data, output, input, slot, ...res }: EditorResult<Data>, val: any[]) {
            if (!field.form) {
              field.form = {};
            }
            field.form.options = val;
          }
        }
      },
      {
        title: '校验规则',
        description: '提供快捷校验配置',
        type: 'ArrayCheckbox',
        options: {
          checkField: 'status',
          visibleField: 'visible',
          getTitle: (item) => item.title,
          items: [
            {
              title: '提示文字',
              type: 'Text',
              value: 'message',
              ifVisible(item: any) {
                return item.key === RuleKeys.REQUIRED;
              }
            },
            {
              title: '编辑校验规则',
              type: 'code',
              options: {
                language: 'javascript',
                enableFullscreen: false,
                title: '编辑校验规则',
                width: 600,
                minimap: {
                  enabled: false
                },
                babel: true,
                eslint: {
                  parserOptions: {
                    ecmaVersion: '2020',
                    sourceType: 'module'
                  }
                }
              },
              ifVisible(item: any) {
                return item.key === RuleKeys.CODE_VALIDATOR;
              },
              value: 'validateCode'
            }
          ]
        },
        value: {
          get() {
            if (!field.form?.rules?.length) {
              if (!field.form) {
                field.form = {};
              }
              field.form.rules = RuleMapByBizType[field.bizType] || [];
            }

            return field.form.rules;
          },
          set({ data }, value: any) {
            field.form.rules = value;
          }
        }
      },
      {
        title: '运行时隐藏',
        description: '运行时是否隐藏对应表单项',
        type: 'Switch',
        value: {
          get({}: EditorResult<Data>) {
            return data.showActionModalForEdit === ModalAction.CREATE
              ? field.form?.hiddenForCreate
              : field.form?.hiddenForEdit;
          },
          set({ data, input, output }: EditorResult<Data>, value: boolean) {
            if (data.showActionModalForEdit === ModalAction.CREATE) {
              field.form.hiddenForCreate = value;
            } else {
              field.form.hiddenForEdit = value;
            }
          }
        }
      }
    ].filter(Boolean);

    if (field.form?.formItem === ComponentName.DEBOUNCE_SELECT) {
      cate2.title = '高级';
      cate2.items = [
        {
          title: '选项名称',
          description: '选择下拉选项显示的标签名称所对应的字段',
          type: 'Select',
          options() {
            return {
              get options() {
                return [
                  { label: '无', value: '' },
                  ...(field.mapping?.entity?.fieldAry.map((f) => ({
                    label: f.name,
                    value: f.name
                  })) ?? [])
                ];
              }
            };
          },
          value: {
            get() {
              return field.form?.mapping?.optionLabel ?? '';
            },
            set({ data, focusArea, input, output }: EditorResult<Data>, value: string) {
              if (!field.form) {
                field.form = {};
              }
              if (!field.form.mapping) {
                field.form.mapping = {};
              }
              field.form.mapping.optionLabel = value;
            }
          }
        }
      ];
    }
  },
  'th.ant-table-cell:not(:empty)': ({ data, focusArea }: EditorResult<Data>, cate1) => {
    if (!data.fieldAry?.length) {
      return;
    }
    const field = data.fieldAry[focusArea?.index];
    if (!focusArea || !field) return;
    cate1.title = '常规';
    cate1.items = [
      {
        title: '列名',
        type: 'Text',
        value: {
          get({}: EditorResult<Data>) {
            return (
              field.tableInfo?.label ??
              `${field.name}${field.mappingField ? `.${field.mappingField.name}` : ''}`
            );
          },
          set({ data, focusArea, input, output }: EditorResult<Data>, value: string) {
            if (!field.tableInfo) {
              field.tableInfo = {};
            }
            field.tableInfo.label = value;
          }
        }
      },
      {
        title: '列宽',
        type: 'Text',
        value: {
          get({}: EditorResult<Data>) {
            return field.tableInfo?.width ?? '124px';
          },
          set({ data, focusArea, input, output }: EditorResult<Data>, value: string) {
            if (!field.tableInfo) {
              field.tableInfo = {};
            }
            field.tableInfo.width = value;
          }
        }
      },
      {
        title: '对齐方式',
        type: 'Select',
        options: [
          { label: '左对齐', value: 'left' },
          { label: '居中', value: 'center' },
          { label: '右对齐', value: 'right' }
        ],
        value: {
          get({}: EditorResult<Data>) {
            return field.tableInfo?.align ?? 'left';
          },
          set({ data, focusArea, input, output }: EditorResult<Data>, value: string) {
            if (!field.tableInfo) {
              field.tableInfo = {};
            }
            field.tableInfo.align = value;
          }
        }
      },
      {
        title: '内容超出省略',
        type: 'Switch',
        ifVisible() {
          return field.bizType !== FieldBizType.FRONT_CUSTOM;
        },
        value: {
          get({}: EditorResult<Data>) {
            return field.tableInfo?.ellipsis;
          },
          set({ data, output, input }: EditorResult<Data>, value: boolean) {
            if (!field.tableInfo) {
              field.tableInfo = {};
            }
            field.tableInfo.ellipsis = value;
          }
        }
      },
      {
        title: '开启排序',
        type: 'Switch',
        ifVisible() {
          return field.bizType !== FieldBizType.FRONT_CUSTOM;
        },
        value: {
          get({}: EditorResult<Data>) {
            return field.tableInfo?.sort;
          },
          set({ data, output, input }: EditorResult<Data>, value: boolean) {
            if (!field.tableInfo) {
              field.tableInfo = {};
            }
            field.tableInfo.sort = value;
          }
        }
      }
    ];
  },
  '[data-add-button]': ({}: EditorResult<Data>, cate1) => {
    cate1.title = '常规';
    cate1.items = [
      {
        title: '按钮文案',
        type: 'Text',
        value: {
          get({ data }: EditorResult<Data>) {
            return data.addBtn?.title ?? '新增';
          },
          set({ data, focusArea, input, output }: EditorResult<Data>, value: string) {
            if (!data.addBtn) {
              data.addBtn = {};
            }

            data.addBtn.title = value;
          }
        }
      }
    ];
  }
};
