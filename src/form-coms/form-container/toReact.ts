import { getLabelCol } from './utils';

export default function ({ data, slots }) {
  let fromItemsStr = slots['content'].render({
    itemWrap (com: { id; jsx }) {
      const item = data.items.find((item) => item.id === com.id);

      return `<Form.Item
                ${item?.label ? `label="${item.label}"` : '' }
                ${item?.name ? `name="${item.name}"` : `name="${item.label}"` }
                ${item?.required ? `required="${item.required}"` : '' }
                ${item?.validateStatus ? `validateStatus="${item.validateStatus}"` : '' }
                ${item?.help ? `help="${item.help}"` : '' }
                ${item?.tooltip ? `tooltip="${item.tooltip}"` : '' }>${com.jsx}</Form.Item>`
    },
    wrap (comAry) {
      const jsx = comAry?.map((com, idx) => {
        if (com) {
          let item = data.items.find((item) => item.id === com.id);
          if (!item) return;
          const { widthOption, span, width } = item;
          const flexBasis = widthOption === 'px' ? `${width}px` : `${(span * 100) / 24}%`;

          // if (typeof item?.visible !== 'undefined') {
          //   item.visible = com.style.display !== 'none';
          // } else {
          //   item['visible'] = true;
          // }

          return (
            item?.visible && (
              `<Col style={{ width: "${flexBasis}" }}>
                ${com.jsx}
              </Col>`
            )
          );
        }
        return `<div>组件错误</div>;`
      });

      return `<Row>${jsx.join('\n')}</Row>`
    }
  })

  let actionsStr = ''

  data.actions.items.forEach((item) => {
    if (typeof item.visible !== 'undefined' && !item.visible) {
      return
    }

    actionsStr += `
      <Button
        ${item.type ? `type="${item.type}"` : '' }
        ${item.loading ? `loading="${item.loading}"` : '' }
      >
        ${item.title}
      </Button>
    `
  })

  actionsStr = `<Space wrap>${actionsStr}</Space>`
  
  const labelCol = data.layout === 'horizontal' ? getLabelCol(data) : undefined

  const actionFlexBasis =
    data.actions.widthOption === 'px'
      ? `${data.actions.width}px`
      : `${(data.actions.span * 100) / 24}%`;

  const horizontalLayoutStr = `
    ${fromItemsStr}
    ${data.actions.visible && `<Col
        flex="0 0 ${actionFlexBasis}"
        style={{
          textAlign: "${data.actions.align}"
        }}
      >
        <Form.Item label=" " colon={false}>
          ${actionsStr}
        </Form.Item>
      </Col>`}
  `

  const str = `<Form layout="${data.layout}" ${labelCol ? `labelCol={${getObjectStr(labelCol)}}` : ''}>${horizontalLayoutStr}</Form>`

  return {
    imports: [
      {
        form: 'antd',
        coms: ['Form', 'Row', 'Col', 'Button', 'Space']
      },
      {
        form: 'antd/dist/antd.css',
        coms: []
      }
    ],
  	jsx: str,
    style: '',
    js: ''
  }
}

function getObjectStr (obj) {

  return JSON.stringify(obj)
}