import {Data, MOCK_ENTITY_LIST} from './constants';

export default {
  '@init'({ style }) {
  },
  '@resize': {
    options: ['width', 'height']
  },
  ':root': [
    {
      title: '模型选择',
      items: [
        {
          title: '类型',
          type: 'Select',
	        options: MOCK_ENTITY_LIST.map(entity => ({ label: entity.name, value: entity.id })),
          value: {
            get({ data, output }: EditorResult<Data>) {
              return data.entityId;
            },
            set({ data, output, input }: EditorResult<Data>, value: string) {
							data.entityId = value;
							data.entity = JSON.parse(JSON.stringify(MOCK_ENTITY_LIST.find(entity => entity.id === value) || null));
            }
          }
        }
      ]
    },
	  {
		  title: '表单字段选择',
		  items: [
			  {
				  title: '类型',
				  type: 'Select',
				  ifVisible({ data }: EditorResult<Data>) {
					  return !!data.entity;
				  },
				  options (props) {
					  return {
							mode: 'tags',
						  multiple: true,
						  get options() {
								return props.data.entity?.fieldAry?.map(field => ({ label: field.name, value: field.id }));
						  },
					  }
				  },
				  value: {
					  get({ data, output }: EditorResult<Data>) {
						  return data.formFieldAry.map(field => field.id) || [];
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
				  title: '类型',
				  type: 'Select',
				  ifVisible({ data }: EditorResult<Data>) {
					  return !!data.entity;
				  },
				  options (props) {
					  return {
							mode: 'tags',
						  multiple: true,
						  get options() {
								return props.data.entity?.fieldAry?.map(field => ({ label: field.name, value: field.id }));
						  },
					  }
				  },
				  value: {
					  get({ data, output }: EditorResult<Data>) {
						  return data.fieldAry.map(field => field.id) || [];
					  },
					  set({ data, output, input }: EditorResult<Data>, value: string[]) {
						  data.fieldAry = value.map(id => data.entity.fieldAry.find(entity => entity.id === id)).filter(Boolean);
					  }
				  }
			  }
		  ]
	  }
  ]
};
