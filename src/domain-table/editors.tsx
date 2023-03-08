import {Data, FieldBizType, FieldDBType} from './constants';
import {getEleIdx, updateIOSchema} from "../form-detail/editors/utils";

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
								data.entity = JSON.parse(JSON.stringify(entity || null));
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
	  }
  ],
	'.ant-form-item': ({ }: EditorResult<Data>, cate1, cate2, cate3) => {
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
	'th.ant-table-cell': ({ }: EditorResult<Data>, cate1, cate2, cate3) => {
		cate1.title = '常规';
		cate1.items = [
			{
				title: '列名',
				type: 'Text',
				value: {
					get({ data, focusArea }: EditorResult<Data>) {
						console.log('focusArea', focusArea);
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
		];
	}
};
