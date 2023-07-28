import React from 'react';
import {
  DefaultComponentNameMap,
  Data,
  FieldBizType,
  FieldDBType,
  ModalAction,
  ComponentName
} from './constants';
import { uuid } from '../utils';
import { RuleKeys, RuleMapByBizType } from './rule';
import { ajax } from './util';

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
                      });

                    data.entity = curEntity;
                  }
                }
              }
            }
          }
        ]
      }
    ];
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
          set({ data, input, output }: EditorResult<Data>, value: string) {
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
  }
};
