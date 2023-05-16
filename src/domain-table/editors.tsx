import React from 'react';
import {
  ComponentName,
  Data,
  DefaultComponentNameMap,
  DefaultOperatorMap,
  DefaultValueWhenCreate,
  FieldBizType,
  FieldDBType,
  InputIds,
  ModalAction,
  TableRenderType
} from './constants';
import { uuid } from '../utils';
import { RuleKeys, RuleMapByBizType } from './rule';
import { ajax } from './util';
import Refresh from './editors/refresh';
import Delete from './editors/delete';

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
                        field.form.rules = RuleMapByBizType[field.bizType] || [];
                        field.form.required = true;
                      }
                    });
                    curEntity.fieldAry
                      .filter(
                        (field) =>
                          ![FieldBizType.MAPPING].includes(field.bizType) &&
                          !field.isPrimaryKey &&
                          !field.isPrivate
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
                            value: v,
                            checked: v === field.defaultValueWhenCreate
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
              render: Refresh,
              get domainFileId() {
                return data.domainFileId;
              },
              get entityId() {
                return data.entityId;
              },
              get entity() {
                return data.entity;
              }
            },
            ifVisible({ data }: EditorResult<Data>) {
              return !!data.entity;
            },
            value: {
              get({ data }) {
                return { domainFileId: data.domainFileId, entityId: data.entityId };
              },
              set({ data, setTitle, title, output, slot }, newEntity: any) {
                if (!newEntity) {
                  return;
                }
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
                      const hasChecked = field?.form?.options?.find((o) => o.checked);
                      newField.form.options = newField.enumValues.map((v) => {
                        const oldOption =
                          field.bizType === FieldBizType.ENUM
                            ? field?.form?.options?.find((o) => o.value === v)
                            : undefined;

                        return (
                          oldOption || {
                            label: v,
                            value: v,
                            checked: hasChecked ? false : v === newField.defaultValueWhenCreate
                          }
                        );
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
                  curFieldAry.push(handleCustomColumnSlot(data, slot));
                }
                handleTableColumnChange(curFieldAry, data.fieldAry, slot);
                data.fieldAry = curFieldAry;

                newEntity.fieldAry.forEach((newField) => {
                  newField.form = {};
                });

                newEntity.fieldAry
                  .filter((field) => !field.isPrimaryKey && !field.isPrivate)
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
                      initForm.rules = RuleMapByBizType[field.bizType] || [];
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
                      const hasChecked = field?.form?.options?.find((o) => o.checked);
                      newField.form.options = newField.enumValues.map((v) => {
                        const oldOption =
                          field.bizType === FieldBizType.ENUM
                            ? field?.form?.options?.find((o) => o.value === v)
                            : undefined;

                        return (
                          oldOption || {
                            label: v,
                            value: v,
                            checked: hasChecked ? false : v === newField.defaultValueWhenCreate
                          }
                        );
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
            title: '渲染方式',
            description: '渲染方式切换将重置表格渲染逻辑，不支持回退',
            type: 'Select',
            options: [
              { label: '内置表格', value: TableRenderType.NORMAL },
              { label: '自定义表格', value: TableRenderType.SLOT }
            ],
            value: {
              get({ data }: EditorResult<Data>) {
                return data.table?.renderType || TableRenderType.NORMAL;
              },
              set({ data, output, input, slot }: EditorResult<Data>, value: TableRenderType) {
                data.table.renderType = value;

                if (value === TableRenderType.SLOT) {
                  const slotId = 'table';
                  data.table.slotId = slotId;
                  slot.add({ id: slotId, title: `自定义表格`, type: 'scope' });
                  slot
                    .get(slotId)
                    .inputs.add(InputIds.DATA_SOURCE, '当前表格数据', { type: 'array' });

                  data.fieldAry.forEach((field) => {
                    handleColumnSlot(TableRenderType.NORMAL, { field, slot });
                  });
                } else {
                  slot.get(data.table.slotId) && slot.remove(data.table.slotId);
                  data.table.slotId = '';

                  data.fieldAry.forEach((field) => {
                    if (
                      field.tableInfo.renderType === TableRenderType.SLOT ||
                      field.bizType === FieldBizType.FRONT_CUSTOM
                    ) {
                      handleColumnSlot(TableRenderType.SLOT, { field, slot });
                    }
                  });
                }
              }
            }
          },
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
            ifVisible() {
              return data.table?.renderType !== TableRenderType.SLOT;
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
              set({ data, output, input, slot }: EditorResult<Data>, value: string[]) {
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
                  fieldAry.push(handleCustomColumnSlot(data, slot));
                }

                handleTableColumnChange(fieldAry, data.fieldAry, slot);
                data.fieldAry = fieldAry;
              }
            }
          },
          {
            type: 'array',
            ifVisible() {
              return !!data.fieldAry && data.table?.renderType !== TableRenderType.SLOT;
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
                  curFields.push(handleCustomColumnSlot(data, slot));
                }
                handleTableColumnChange(curFields, data.fieldAry, slot);
                data.fieldAry = curFields;
              }
            }
          },
          {
            title: '开启分页',
            type: 'Switch',
            ifVisible() {
              return data.table?.renderType !== TableRenderType.SLOT;
            },
            value: {
              get({ data }: EditorResult<Data>) {
                return data.pagination.show;
              },
              set({ data, output, input }: EditorResult<Data>, value: boolean) {
                data.pagination.show = value;
              }
            }
          },
          {
            title: '隐藏操作区',
            type: 'Switch',
            ifVisible() {
              return data.table?.renderType !== TableRenderType.SLOT;
            },
            value: {
              get({ data }: EditorResult<Data>) {
                return data.table?.operate?.disabled;
              },
              set({ data, output, input }: EditorResult<Data>, value: boolean) {
                if (!data.table) {
                  data.table = {};
                }
                if (!data.table.operate) {
                  data.table.operate = {};
                }
                data.table.operate.disabled = value;
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
        title: '新增操作',
        items: [
          {
            title: '隐藏新增操作',
            type: 'Switch',
            value: {
              get({ data }: EditorResult<Data>) {
                return data.operate?.create?.disabled;
              },
              set({ data, output, input }: EditorResult<Data>, value: boolean) {
                if (!data.operate) {
                  data.operate = {};
                }
                if (!data.operate.create) {
                  data.operate.create = {};
                }
                data.operate.create.disabled = value;
              }
            }
          },
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
          },
          {
            title: '弹框宽度',
            type: 'Text',
            options: {
              placeholder: '请输入弹框宽度，如：800或800px'
            },
            value: {
              get({}: EditorResult<Data>) {
                return data.widthForCreate;
              },
              set({ data, focusArea, input, output }: EditorResult<Data>, value: string) {
                data.widthForCreate = value;
              }
            }
          },
          {
            title: '新增表单字段',
            type: 'Select',
            ifVisible({ data }: EditorResult<Data>) {
              return data.showActionModalForEdit === ModalAction.CREATE;
            },
            options() {
              return {
                mode: 'tags',
                multiple: true,
                get options() {
                  return fieldAry
                    .filter(
                      (field) =>
                        ![FieldBizType.MAPPING].includes(field.bizType) &&
                        !field.isPrimaryKey &&
                        !field.isPrivate
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
                      ![FieldBizType.MAPPING].includes(field.bizType) &&
                      !field.isPrimaryKey &&
                      !field.isPrivate &&
                      !field.form.disabledForCreate
                  )
                  .map((field) => field.id);
              },
              set({ data, output, input }: EditorResult<Data>, value: string[]) {
                const fields = fieldAry.filter(
                  (field) =>
                    ![FieldBizType.MAPPING].includes(field.bizType) &&
                    !field.isPrimaryKey &&
                    !field.isPrivate
                );

                fields.forEach((field) => {
                  !field.form && (field.form = {});

                  !field.form.formItem &&
                    (field.form.formItem =
                      DefaultComponentNameMap[field.bizType] || ComponentName.INPUT);
                  field.form.disabledForCreate = !value.includes(field.id);
                });
              }
            }
          }
        ]
      },
      {
        title: '编辑操作',
        items: [
          {
            title: '隐藏编辑操作',
            type: 'Switch',
            value: {
              get({ data }: EditorResult<Data>) {
                return data.operate?.edit?.disabled;
              },
              set({ data, output, input }: EditorResult<Data>, value: boolean) {
                if (!data.operate) {
                  data.operate = {};
                }
                if (!data.operate.edit) {
                  data.operate.edit = {};
                }
                data.operate.edit.disabled = value;
              }
            }
          },
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
            title: '弹框宽度',
            type: 'Text',
            options: {
              placeholder: '请输入弹框宽度，如：800或800px'
            },
            value: {
              get({}: EditorResult<Data>) {
                return data.widthForEdit;
              },
              set({ data, focusArea, input, output }: EditorResult<Data>, value: string) {
                data.widthForEdit = value;
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
                        !field.isPrivate
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
                    !field.isPrivate
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
      },
      {
        title: '删除操作',
        items: [
          {
            title: '隐藏删除操作',
            type: 'Switch',
            value: {
              get({ data }: EditorResult<Data>) {
                return data.operate?.delete?.disabled;
              },
              set({ data, output, input }: EditorResult<Data>, value: boolean) {
                if (!data.operate) {
                  data.operate = {};
                }
                if (!data.operate.delete) {
                  data.operate.delete = {};
                }
                data.operate.delete.disabled = value;
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
        title: '图片数量',
        type: 'InputNumber',
        options: [{ title: '', min: 1, width: 100 }],
        ifVisible() {
          return field.form.formItem === ComponentName.IMAGE_UPLOAD;
        },
        value: {
          get() {
            return [field.form?.maxCount || 1];
          },
          set({ data, focusArea, input, output }: EditorResult<Data>, value: string) {
            field.form.maxCount = value[0] || 1;
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
        title: '禁用状态',
        type: 'switch',
        description: '是否禁用状态',
        value: {
          get() {
            return field.form.readonly;
          },
          set({ data }, val: boolean) {
            if (!field.form) {
              field.form = {};
            }

            field.form.readonly = val;
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
          { label: '富文本', value: ComponentName.RICH_TEXT },
          { label: '图片上传', value: ComponentName.IMAGE_UPLOAD },
          { label: '上传', value: ComponentName.UPLOAD }
        ],
        value: {
          get() {
            return field.form?.formItem ?? ComponentName.INPUT;
          },
          set({ data, focusArea, input, output }: EditorResult<Data>, value: string) {
            field.form.formItem = value;

            if (value === ComponentName.RICH_TEXT && !field.form.toolbar?.length) {
              field.form.toolbar = ['link'];
            }
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
        title: '图片数量',
        type: 'InputNumber',
        options: [{ title: '', min: 1, width: 100 }],
        ifVisible() {
          return field.form.formItem === ComponentName.IMAGE_UPLOAD;
        },
        value: {
          get() {
            return [field.form?.maxCount || 1];
          },
          set({ data, focusArea, input, output }: EditorResult<Data>, value: string) {
            field.form.maxCount = value[0] || 1;
          }
        }
      },
      {
        title: '附件数量',
        type: 'InputNumber',
        options: [{ title: '', min: 1, width: 100 }],
        ifVisible() {
          return field.form.formItem === ComponentName.UPLOAD;
        },
        value: {
          get() {
            return [field.form?.maxCount || 1];
          },
          set({ data, focusArea, input, output }: EditorResult<Data>, value: string) {
            field.form.maxCount = value[0] || 1;
          }
        }
      },
      {
        title: '插件选择',
        type: 'select',
        ifVisible() {
          return field.form.formItem === ComponentName.RICH_TEXT;
        },
        options() {
          return {
            options: [
              {
                label: '超链接',
                value: 'link'
              },
              {
                label: '表格',
                value: 'table'
              },
              // {
              //   label: '图片上传',
              //   value: 'uploadimage',
              // },
              // {
              //   label: '视频上传',
              //   value: 'uploadVideo',
              // },
              {
                label: '下划线',
                value: 'underline'
              },
              {
                label: '删除线',
                value: 'strikethrough'
              },
              {
                label: '加粗',
                value: 'bold'
              },
              {
                label: '左对齐',
                value: 'alignleft'
              },
              {
                label: '居中',
                value: 'aligncenter'
              },
              {
                label: '右对齐',
                value: 'alignright'
              },
              {
                label: '字体大小',
                value: 'fontsizeselect'
              },
              {
                label: '斜体',
                value: 'italic'
              },
              {
                label: '文本颜色',
                value: 'forecolor'
              },
              {
                label: '背景色',
                value: 'backcolor'
              }
            ],
            mode: 'multiple'
          };
        },
        value: {
          get() {
            return field.form.toolbar ?? [];
          },
          set({ data }, val: string[]) {
            field.form.toolbar = val;
          }
        }
      },
      {
        title: '富文本高度',
        type: 'Text',
        ifVisible() {
          return field.form.formItem === ComponentName.RICH_TEXT;
        },
        options: {
          placeholder: '请输入弹框宽度，如：200或200px'
        },
        value: {
          get({}: EditorResult<Data>) {
            return field.form.height;
          },
          set({ data, focusArea, input, output }: EditorResult<Data>, value: string) {
            field.form.height = value;
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
      },
      {
        title: '字段默认值',
        description: '实体中字段的默认值',
        type: 'editorRender',
        ifVisible() {
          return (
            field.defaultValueWhenCreate !== undefined && field.defaultValueWhenCreate !== null
          );
        },
        options: {
          render: () => {
            let defaultText = field.defaultValueWhenCreate;
            if (field.bizType === FieldBizType.DATETIME) {
              if (field.defaultValueWhenCreate === DefaultValueWhenCreate.CURRENT_TIME) {
                defaultText = '当数据创建时默认填充时间';
              } else {
                defaultText =
                  window.moment?.(field.defaultValueWhenCreate)?.format('yyyy-MM-DD HH:mm:ss') ||
                  defaultText;
              }
            } else if (
              (field.dbType === 'varchar' || field.dbType === 'mediumtext') &&
              field.defaultValueWhenCreate === ''
            ) {
              defaultText = '空字符串';
            }

            return (
              <div>
                {defaultText}
                <span style={{ color: '#AAA', fontStyle: 'italic' }}>
                  （提示：此数据值仅代表数据库中字段默认值）
                </span>
              </div>
            );
          }
        },
        value: {
          get({}: EditorResult<Data>) {
            return field.defaultValueWhenCreate;
          },
          set() {}
        }
      },
      {
        title: '事件',
        items: [
          {
            title: '值更新',
            type: '_event',
            ifVisible() {
              return [
                ComponentName.INPUT,
                ComponentName.TEXTAREA,
                ComponentName.INPUT_NUMBER,
                ComponentName.SELECT,
                ComponentName.DATE_PICKER,
                ComponentName.UPLOAD,
                ComponentName.IMAGE_UPLOAD,
                ComponentName.RADIO,
                ComponentName.CHECKBOX,
                ComponentName.RICH_TEXT,
                ComponentName.DEBOUNCE_SELECT
              ].includes(field.form?.formItem);
            },
            options: {
              outputId: 'onChange'
            }
          }
        ]
      },
      {
        title: '',
        items: [
          {
            title: '',
            type: 'editorRender',
            options: {
              render: Delete,
              get modalAction() {
                return data.showActionModalForEdit;
              }
            },
            value: {
              get({ data }: EditorResult<Data>) {
                return data.showActionModalForEdit;
              },
              set({}: EditorResult<Data>, value: ModalAction) {
                field.form[value === ModalAction.CREATE ? 'disabledForCreate' : 'disabledForEdit'] =
                  true;
              }
            }
          }
        ]
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
  '.domain-default-table th.ant-table-cell:not(:empty)': (
    { data, focusArea, ...args }: EditorResult<Data>,
    cate1
  ) => {
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
        title: '渲染方式',
        type: 'Select',
        options: [
          { label: '普通文字', value: TableRenderType.NORMAL },
          { label: '自定义插槽', value: TableRenderType.SLOT }
        ],
        ifVisible() {
          return field.bizType !== FieldBizType.FRONT_CUSTOM;
        },
        value: {
          get({}: EditorResult<Data>) {
            return field.tableInfo?.renderType || TableRenderType.NORMAL;
          },
          set({ data, output, input, slot }: EditorResult<Data>, value: TableRenderType) {
            if (!field.tableInfo) {
              field.tableInfo = {};
            }
            field.tableInfo.renderType = value;

            handleColumnSlot(value, { field, slot });
          }
        }
      },
      {
        title: '内容超出省略',
        type: 'Switch',
        ifVisible() {
          const tableInfo = field.tableInfo;

          return (
            field.bizType !== FieldBizType.FRONT_CUSTOM &&
            (!tableInfo?.renderType || tableInfo?.renderType === TableRenderType.NORMAL)
          );
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
  '[data-add-button]': ({ data }: EditorResult<Data>, cate1) => {
    cate1.title = '常规';
    cate1.items = [
      {
        title: '按钮文案',
        type: 'Text',
        value: {
          get({ data }: EditorResult<Data>) {
            return data.operate?.create?.title ?? '新增';
          },
          set({ data, focusArea, input, output }: EditorResult<Data>, value: string) {
            if (!data.operate) {
              data.operate = {};
            }
            if (!data.operate.create) {
              data.operate.create = {};
            }

            data.operate.create.title = value;
          }
        }
      },
      {
        title: '',
        items: [
          {
            title: '',
            type: 'editorRender',
            options: {
              render: Delete,
              get modalAction() {
                return data.showActionModalForEdit;
              }
            },
            value: {
              get() {
                return null;
              },
              set({ data }: EditorResult<Data>) {
                if (!data.operate) {
                  data.operate = {};
                }
                if (!data.operate.create) {
                  data.operate.create = {};
                }
                data.operate.create.disabled = true;
              }
            }
          }
        ]
      }
    ];
  },
  '[data-edit-button]': ({ data }: EditorResult<Data>, cate1) => {
    cate1.title = '常规';
    cate1.items = [
      {
        title: '按钮文案',
        type: 'Text',
        value: {
          get({ data }: EditorResult<Data>) {
            return data.operate?.edit?.title ?? '编辑';
          },
          set({ data, focusArea, input, output }: EditorResult<Data>, value: string) {
            if (!data.operate) {
              data.operate = {};
            }
            if (!data.operate.edit) {
              data.operate.edit = {};
            }

            data.operate.edit.title = value;
          }
        }
      },
      {
        title: '',
        items: [
          {
            title: '',
            type: 'editorRender',
            options: {
              render: Delete,
              get modalAction() {
                return data.showActionModalForEdit;
              }
            },
            value: {
              get() {
                return null;
              },
              set({ data }: EditorResult<Data>) {
                if (!data.operate) {
                  data.operate = {};
                }
                if (!data.operate.edit) {
                  data.operate.edit = {};
                }
                data.operate.edit.disabled = true;
              }
            }
          }
        ]
      }
    ];
  },
  '[data-delete-button]': ({ data }: EditorResult<Data>, cate1) => {
    cate1.title = '常规';
    cate1.items = [
      {
        title: '按钮文案',
        type: 'Text',
        value: {
          get({ data }: EditorResult<Data>) {
            return data.operate?.delete?.title ?? '删除';
          },
          set({ data, focusArea, input, output }: EditorResult<Data>, value: string) {
            if (!data.operate) {
              data.operate = {};
            }
            if (!data.operate.delete) {
              data.operate.delete = {};
            }

            data.operate.delete.title = value;
          }
        }
      },
      {
        title: '',
        items: [
          {
            title: '',
            type: 'editorRender',
            options: {
              render: Delete,
              get modalAction() {
                return data.showActionModalForEdit;
              }
            },
            value: {
              get() {
                return null;
              },
              set({ data }: EditorResult<Data>) {
                if (!data.operate) {
                  data.operate = {};
                }
                if (!data.operate.delete) {
                  data.operate.delete = {};
                }
                data.operate.delete.disabled = true;
              }
            }
          }
        ]
      }
    ];
  }
};

/** 列变更时删除不需要的插槽 */
const handleTableColumnChange = (newFields, originFields, slot) => {
  originFields.forEach((f) => {
    if (
      !newFields.find((nf) => nf.id === f.id || nf.name === f.name) &&
      slot.get(f.tableInfo.slotId)
    ) {
      slot.remove(f.tableInfo.slotId);
      f.tableInfo.slotId = '';
    }
  });
};

const handleCustomColumnSlot = (data, slot) => {
  let field = data.fieldAry.find((f) => f.bizType === FieldBizType.FRONT_CUSTOM);

  if (!field) {
    field = {
      name: '操作',
      tableInfo: { label: '操作', width: '124px', align: 'left' },
      bizType: FieldBizType.FRONT_CUSTOM,
      id: 'operate'
    };

    handleColumnSlot(TableRenderType.SLOT, { field, slot });
  } else if (!field.tableInfo.slotId || !slot.get(field.tableInfo.slotId)) {
    handleColumnSlot(TableRenderType.SLOT, { field, slot });
  }

  return field;
};

/** 处理列渲染 */
const handleColumnSlot = (renderType, params) => {
  const { field, slot } = params;

  if (renderType === TableRenderType.SLOT) {
    const slotId = uuid();
    field.tableInfo.slotId = slotId;
    slot.add({
      id: slotId,
      title: `自定义${
        field.tableInfo?.label ??
        `${field.name}${field.mappingField ? `.${field.mappingField.name}` : ''}`
      }列`,
      type: 'scope'
    });

    slot.get(slotId).inputs.add(InputIds.SLOT_ROW_RECORD, '当前行数据', { type: 'object' });
    slot.get(slotId).inputs.add(InputIds.INDEX, '当前行序号', { type: 'number' });
  } else {
    if (field.tableInfo.slotId) {
      slot.get(field.tableInfo.slotId) && slot.remove(field.tableInfo.slotId);
      field.tableInfo.slotId = '';
    }
  }
};
