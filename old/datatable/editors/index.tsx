import columns from "./columns";
import blocks from "./blocks";
import {NAME_DATASOURCE, SET_DS_ID} from "../constants";

export default Object.assign({
  ':root': [
    {
      title: '添加列',
      type: 'button',
      value: {
        set({data}) {
          const nowNo = ++data.colCounter
          data.columns.push({
            "title": `列${nowNo}`,
            "dataIndex": `col${nowNo}`,
            "type": 'normal'
          })
        }
      }
    },
    {
      title: '数据源',
      items: [
        {
          title: '通过输入项获取数据',
          type: 'switch',
          value: {
            get({data}) {
              return data.useDSInput
            }, set({data}, f) {
              data.useDSInput = f
            }
          }
        }, {
          title: '编辑',
          type: 'scratch',
          options({data, input, output, title}) {
            return {
              title:title+' - 数据源',
              blocks: blocks({id:NAME_DATASOURCE})
            }
          },
          ifVisible({data}) {
            return !data.useDSInput
          },
          value: {
            get({data, input, output}) {
              let fns = []
              if (data.fns) {
                fns = data.fns
              }else{
                fns = [{
                  id: SET_DS_ID,
                  title: '获取数据',
                  vars: void 0,
                  xml: void 0,
                  script: void 0,
                }]
              }

              return fns
            },
            set({data, input}, fns) {
              data.fns = fns
            }
          }
        },
      ]
    }
  ]
}, columns)