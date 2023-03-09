import React from "react";
import {Data, FieldBizType, FieldDBType} from './constants';
import {uuid} from "../utils";
import {RuleKeys, RuleMapByBizType} from "./rule";

export default {
  '@init'({ style, data }) {
	  fetch('/api/system/domain/entity/list', {
		  method: 'POST',
		  headers: {
			  'Content-Type': 'application/json'
		  },
		  credentials: undefined,
		  body: JSON.stringify({
			  fileId: 344
		  })
	  } as RequestInit)
	  .then(res => res.json())
	  .then(res => {
			  if (res.code === 1) {
					data.domainAry = res.data || [];
			  }
	  })
  },
  '@resize': {
    options: ['width', 'height']
  },
  ':root': [
    {
      title: '模型选择',
      items: [
        {
          title: '实体',
          type: 'Select',
	        options (props) {
		        return {
			        get options() {
								const entityList = [];
				        props.data.domainAry.forEach(domain => {
									domain.entityList
										.filter(entity => !entity.isSystem)
										.forEach(entity => {
											entityList.push({ label: `${domain.fileName}.${entity.name}`, value: `${domain.fileId}.${entity.id}` })
										})
				        });
								
				        return entityList;
			        },
		        }
	        },
          value: {
            get({ data, output }: EditorResult<Data>) {
              return data.domainFileId ? `${data.domainFileId}.${data.entityId}` : undefined;
            },
            set({ data, output, input }: EditorResult<Data>, value: string = '') {
							const [domainFileId, entityId] = value.split('.');
							if (data.domainFileId !== domainFileId || data.entityId !== entityId) {
								data.fieldAry = [];
								data.fieldAry = [];
								data.formFieldAry = [];
								data.domainFileId = Number(domainFileId);
								data.entityId = entityId;
								
								const entity = data.domainAry.find(d => d.fileId === Number(domainFileId))?.entityList.find(entity => entity.id === entityId);
								const curEntity = JSON.parse(JSON.stringify(entity || null));
								
								if (curEntity) {
									curEntity.fieldAry.forEach(field => {
										field.form = {};
										
										if ([FieldBizType.SYS_USER_UPDATER, FieldBizType.SYS_USER_CREATOR].includes(field.bizType)) {
											field.form.required = true;
										}
									});
									data.entity = curEntity;
								}
							}
            }
          }
        }
      ]
    },
	  {
		  title: '表单字段选择',
		  items: [
			  {
				  title: '字段',
				  type: 'Select',
				  ifVisible({ data }: EditorResult<Data>) {
					  return !!data.entity;
				  },
				  options (props) {
					  return {
							mode: 'tags',
						  multiple: true,
						  get options() {
								return props.data.entity?.fieldAry?.filter(field => !field.isPrimaryKey && !field.isPrivate).map(field => ({ label: field.name, value: field.id }));
						  },
					  }
				  },
				  value: {
					  get({ data, output }: EditorResult<Data>) {
						  return data.formFieldAry?.map(field => field.id) || [];
					  },
					  set({ data, output, input }: EditorResult<Data>, value: string[]) {
						  data.formFieldAry = value.map(id => data.entity.fieldAry.find(entity => entity.id === id)).filter(Boolean);
					  }
				  }
			  }
		  ]
	  },
	  {
		  title: '表格字段选择',
		  items: [
			  {
				  title: '字段',
				  type: 'Select',
				  ifVisible({ data }: EditorResult<Data>) {
					  return !!data.entity;
				  },
				  options (props) {
					  return {
							mode: 'tags',
						  multiple: true,
						  get options() {
								const options = [];
							  props.data.entity?.fieldAry?.forEach(field => {
									if (field.mapping?.entity) {
										field.mapping?.entity.fieldAry.forEach(f => {
											options.push({ label: `${field.name}.${f.name}`, value: `${field.id}.${f.id}` });
										});
									} else if (!field.isPrimaryKey && !field.isPrivate) {
										options.push({ label: field.name, value: field.id });
									}
							  })
								return options;
						  },
					  }
				  },
				  value: {
					  get({ data, output }: EditorResult<Data>) {
						  return data.fieldAry.filter(field => field.bizType !== FieldBizType.FRONT_CUSTOM)?.map(field => field.mappingField ? `${field.id}.${field.mappingField.id}` : field.id) || [];
					  },
					  set({ data, output, input }: EditorResult<Data>, value: string[]) {
						  const fieldAry = value
						  .map(id => {
							  const ids = id.split('.');
							  const item = data.entity.fieldAry.find(field => field.id === ids[0]);
							  if (!item) {
								  return;
							  }
							
							  if (ids.length > 1) {
								  const mappingField = item.mapping?.entity.fieldAry.find(field => field.id === ids[1]);
								
								  return mappingField ? { ...item, mappingField } : undefined;
							  } else {
								  return item;
							  }
						  })
						  .filter(Boolean);
							
							if (fieldAry.length > 0) {
								fieldAry.push({ name: '操作', label: '操作', bizType: FieldBizType.FRONT_CUSTOM, id: 'operate' });
							}
						  data.fieldAry = fieldAry;
					  }
				  }
			  }
		  ]
	  },
	  {
		  title: '编辑新增弹框',
		  items: [
			  {
				  title: '编辑弹框',
				  type: 'Switch',
				  value: {
					  get({ data, output }: EditorResult<Data>) {
						  return data.showActionModalForEdit;
					  },
					  set({ data, output, input }: EditorResult<Data>, value: boolean) {
						  data.showActionModalForEdit = value;
					  }
				  }
			  }
		  ]
	  },
  ],
	'.search-form .ant-form-item': ({ }: EditorResult<Data>, cate1, cate2, cate3) => {
		cate1.title = '常规';
		cate1.items = [
			{
				title: '标签名称',
				type: 'Text',
				value: {
					get({ data, focusArea }: EditorResult<Data>) {
						if (!focusArea) return;
						return data.formFieldAry[focusArea.index]?.label ?? data.formFieldAry[focusArea.index]?.name;
					},
					set({ data, focusArea, input, output }: EditorResult<Data>, value: string) {
						if (!focusArea) return;
						const item = data.formFieldAry[focusArea.index];
						item.label = value;
					}
				}
			},
			{
				title: '检索规则',
				type: 'Select',
				options (props) {
					return {
						get options() {
							const field = props.data.formFieldAry[props.focusArea.index];
							switch (field?.dbType) {
								case FieldDBType.VARCHAR: {
									return [
										{ label: '等于(=)', value: '=' },
										{ label: '不等于(<>)', value: '<>' },
										{ label: '匹配(LIKE)', value: 'LIKE' },
										{ label: '不匹配(NOT LIKE)', value: 'NOT LIKE' },
										{ label: '包含(IN)', value: 'IN' },
										{ label: '不包含(NOT IN)', value: 'NOT IN' },
									];
								}
								case FieldDBType.BIGINT: {
									return [
										{ label: '等于(=)', value: '=' },
										{ label: '不等于(<>)', value: '<>' },
										{ label: '大于等于(>=)', value: '>=' },
										{ label: '小于等于(<=)', value: '<=' },
										{ label: '包含(IN)', value: 'IN' },
										{ label: '不包含(NOT IN)', value: 'NOT IN' },
									];
								}
								case FieldDBType.MEDIUMTEXT: {
									return [
										{ label: '等于(=)', value: '=' },
										{ label: '不等于(<>)', value: '<>' },
										{ label: '匹配(LIKE)', value: 'LIKE' },
										{ label: '不匹配(NOT LIKE)', value: 'NOT LIKE' },
										{ label: '包含(IN)', value: 'IN' },
										{ label: '不包含(NOT IN)', value: 'NOT IN' },
									];
								}
								default: return [];
							}
						},
					}
				},
				value: {
					get({ data, focusArea }: EditorResult<Data>) {
						if (!focusArea) return;
						return data.formFieldAry[focusArea.index]?.operator ?? '=';
					},
					set({ data, focusArea, input, output }: EditorResult<Data>, value: string) {
						if (!focusArea) return;
						const item = data.formFieldAry[focusArea.index];
						item.operator = value;
					}
				}
			},
		];
	},
	'.ant-form-item-area': ({ focusArea, data }: EditorResult<Data>, cate1, cate2, cate3) => {
		const field = data.entity.fieldAry.find(f => f.id === focusArea.dataset.fieldId);
		
		if (!field) {
			return;
		}
		
		cate1.title = '常规';
		cate1.items = [
			{
				title: '表单项属性',
				items: [
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
					[FieldBizType.RADIO, FieldBizType.CHECKBOX].includes(field.bizType) ? {
						title: '下拉选项列表',
						description: '可设置表单项下拉选项',
						type: 'array',
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
					} : undefined,
					{
						title: '校验规则',
						description: '提供快捷校验配置',
						type: 'ArrayCheckbox',
						options: {
							checkField: 'status',
							visibleField: 'visible',
							getTitle: item => item.title,
							items: [
								{
									title: '提示文字',
									type: 'Text',
									value: 'message',
									ifVisible(item: any, index: number) {
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
									ifVisible(item: any, index: number) {
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
				].filter(Boolean),
			},
		];
	},
	'th.ant-table-cell': ({ }: EditorResult<Data>, cate1, cate2, cate3) => {
		cate1.title = '常规';
		cate1.items = [
			{
				title: '列名',
				type: 'Text',
				value: {
					get({ data, focusArea }: EditorResult<Data>) {
						const field = data.fieldAry[focusArea?.index];
						if (!focusArea || !field) return;
						
						return field.label ?? `${field.name}${field.mappingField ? `.${field.mappingField.name}` : ''}`;
					},
					set({ data, focusArea, input, output }: EditorResult<Data>, value: string) {
						const field = data.fieldAry[focusArea?.index];
						if (!focusArea || !field) return;
						
						field.label = value;
					}
				}
			},
			{
				title: '列宽',
				type: 'Text',
				value: {
					get({ data, focusArea }: EditorResult<Data>) {
						const field = data.fieldAry[focusArea?.index];
						if (!focusArea || !field) return;
						
						return field.width ?? '100px';
					},
					set({ data, focusArea, input, output }: EditorResult<Data>, value: string) {
						const field = data.fieldAry[focusArea?.index];
						if (!focusArea || !field) return;
						
						field.width = value;
					}
				}
			},
			{
				title: '对齐方式',
				type: 'Select',
				options: [
					{ label: "左对齐", value: "left" },
					{ label: "居中", value: "center" },
					{ label: "右对齐", value: "right" }
				],
				value: {
					get({ data, focusArea }: EditorResult<Data>) {
						const field = data.fieldAry[focusArea?.index];
						if (!focusArea || !field) return;
						
						return field.align ?? 'left';
					},
					set({ data, focusArea, input, output }: EditorResult<Data>, value: string) {
						const field = data.fieldAry[focusArea?.index];
						if (!focusArea || !field) return;
						
						field.align = value;
					}
				}
			},
		];
	}
};
