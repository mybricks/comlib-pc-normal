import { getLabelCol } from './utils';
import { unitConversion } from '../../utils';

export default function ({ data, slots }) {
  let content = ''
  const fromItemsStr = slots['content'].render({
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

  const actionsStr = getActionsStr(data.actions)
  
  const labelCol = data.layout === 'horizontal' ? getLabelCol(data) : undefined

  if (data.layout === 'horizontal') {
    content = getHorizontalLayoutStr({ actions: data.actions, fromItemsStr, actionsStr })
  } else if (data.layout === 'inline') {
    content = getInlineLayoutStr({ actions: data.actions, fromItemsStr, actionsStr })
  } else if (data.layout === 'vertical') {
    content = getVerticalLayoutStr({ actions: data.actions, fromItemsStr, actionsStr })
  }


  const str = `<Form layout="${data.layout}" ${labelCol ? `labelCol={${getObjectStr(labelCol)}}` : ''}>${content}</Form>`

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

function getHorizontalLayoutStr ({ actions, fromItemsStr, actionsStr }) {
  const actionFlexBasis =
    actions.widthOption === 'px'
      ? `${actions.width}px`
      : `${(actions.span * 100) / 24}%`;

  const horizontalLayoutStr = `
    ${fromItemsStr}
    ${actions.visible && `<Col
        flex="0 0 ${actionFlexBasis}"
        style={{
          textAlign: "${actions.align}"
        }}
      >
        <Form.Item label=" " colon={false}>
          ${actionsStr}
        </Form.Item>
      </Col>`}
  `

  return horizontalLayoutStr
}

function getInlineLayoutStr ({ actions, fromItemsStr, actionsStr }) {
  const actionStyle: React.CSSProperties = {
    textAlign: actions.align,
    padding: actions.inlinePadding?.map(String).map(unitConversion).join(' ')
  };
  const actionFlexBasis = actions.widthOption === 'px' ? `${actions.width}px` : `${(actions.span * 100) / 24}%`;

  return `<div className={styles.slotInlineWrapper}>
    ${fromItemsStr}
    ${actions.visible && `<Col flex="0 0 ${actionFlexBasis}" style={${getObjectStr(actionStyle)}}>
      <Form.Item style={{ marginRight: 0 }}>${actionsStr}</Form.Item>
    </Col>
    `}
  </div>
  `
}

function getVerticalLayoutStr ({ actions, fromItemsStr, actionsStr }) {

  const actionFlexBasis =
    actions.widthOption === 'px'
      ? `${actions.width}px`
      : `${(actions.span * 100) / 24}%`;

  return ` <>
    ${fromItemsStr}
    ${actions.visible && `<Col
      flex="0 0 ${actionFlexBasis}"
      style={{
        textAlign: "${actions.align}"
      }}
    >
      <Form.Item label=" " colon={false}>
        ${actionsStr}
      </Form.Item>
    </Col>`}
  </>`

}

function getActionsStr (actions) {
  let actionsStr = ''

  actions.items.forEach((item) => {
    if (typeof item.visible !== 'undefined' && !item.visible) {
      return
    }

    actionsStr += `<Button
        ${item.type ? `type="${item.type}"` : '' }
        ${item.loading ? `loading="${item.loading}"` : '' }
      >
        ${item.title}
      </Button>
    `
  })

  actionsStr = `<Space wrap>${actionsStr}</Space>`

  return actionsStr
}

function getObjectStr (obj) {

  return JSON.stringify(obj)
}