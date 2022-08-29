export default {
  '@parentUpdated'({id, data, parent}, {schema}) {
    if (schema === 'mybricks.normal-pc.form-container/form-item') {
      parent['@_setFormItem']({id, schema: {type: 'string'}})
    }
    // if (schema === 'mybricks.normal-pc.form-container/form-item') {//in form container
    //   data.type = 'formItem'
    //
    //   parent['@_setFormItem']({id, name: data.name, schema: {type: 'string'}})//use parents API
    // } else {
    //   data.type = 'normal'
    // }
  },
  ':root'({data}: EditorResult<{ type }>, ...catalog) {
    catalog[0].title = '常规';

    catalog[0].items = [
      {
        title: '提示内容',
        type: 'Text',
        description: '该提示内容会在值为空时显示',
        value: {
          get({data}) {
            return data.config.placeholder
          },
          set({data}, value: string) {
            data.config.placeholder = value
          },
        },
      },
      {
        title: '显示清除图标',
        type: 'switch',
        description: '可以点击清除图标删除内容',
        value: {
          get({data}) {
            return data.config.allowClear
          },
          set({data}, value: boolean) {
            data.config.allowClear = value
          },
        },
      },
      // {
      //   title: '显示前置文本',
      //   type: 'switch',
      //   description: '带标签的 input，设置前置标签',
      //   value: {
      //     get({data}) {
      //       return data.addonBefore
      //     },
      //     set({data}, value: boolean) {
      //       data.addonBefore = value
      //     },
      //   },
      // },
      {
        title: '前置标签',
        type: 'text',
        description: '带标签的 input，设置前置标签',
        value: {
          get({data}) {
            return data.config.addonBefore
          },
          set({data}, value: string) {
            data.config.addonBefore = value
          },
        },
      },
      {
        title: '后置标签',
        type: 'text',
        description: '带标签的 input，设置后置标签',
        value: {
          get({data}) {
            return data.config.addonAfter
          },
          set({data}, value: string) {
            data.config.addonAfter = value
          },
        },
      },
      {
        title: '禁用状态',
        type: 'switch',
        description: '是否禁用状态',
        value: {
          get({data}) {
            return data.config.disabled
          },
          set({data}, value: boolean) {
            data.config.disabled = value
          },
        },
      },
      // {
      //   title: '校验规则',
      //   description: '提供快捷校验配置',
      //   type: 'ArrayCheckbox',
      //   options: {
      //     checkField: 'status',
      //     visibleField: 'visible',
      //     getTitle
      //   },
      //   value: {
      //     get({data}) {
      //       return [
      //         {
      //           key: 'required',
      //           // status: !!item.rules?.includes(RuleKeys.REQUIRED),
      //           visible: true,
      //           title: '必填',
      //           message: '${label}不能为空',
      //         },
      //       ]
      //     },
      //     set({data}, value: any) {
      //     },
      //   }
      // },
      {
        title: '事件',
        items: [
          {
            title: '值发生改变',
            type: '_event',
            options: {
              outputId: 'onChange'
            }
          }
        ]
      },
    ]
  }
}

const getTitle = (item: any, index: number) => {
  const { key, title, numericalLimit, regExr } = item;
  // let detail;
  // if (key === RuleKeys.REG_EXP) {
  //   detail = regExpressions.find(({ value }) => value === regExr)?.label;
  // } else if ([RuleKeys.MIN, RuleKeys.MAX, RuleKeys.MIN_LENGTH, RuleKeys.MAX_LENGTH].includes(key)) {
  //   detail = Array.isArray(numericalLimit) ? numericalLimit[0] || '0' : '0';
  // }
  return title;
};