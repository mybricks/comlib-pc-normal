import { getLabelCol } from './utils';
import { unitConversion } from '../../utils';
import { getPropsFromObject } from '../../utils/toReact';

export default function ({ data, slots }) {
  let content = ''
  const layout = data.config?.layout || data.layout;

  const fromItemsStr = slots['content'].render({
    itemWrap(com: { id; jsx }) {
      const item = data.items.find((item) => item.id === com.id);
      const style: React.CSSProperties = {
        margin: item.inlineMargin?.map(String).map(unitConversion).join(' ')
      };
      const colon = item?.colon === 'default' ? (data.config?.colon || data.colon) : item.colon;
      const whiteSpace =
        item?.labelAutoWrap === 'default'
          ? void 0
          : (item.labelAutoWrap ? 'pre-wrap' : 'nowrap');

      const { styleEditorUnfold, fontFamily, letterSpacing, fontWeight: labelFontWeight, ...labelStyle } = item?.labelStyle;
      const { styleEditorUnfold: temp, fontFamily: temp1, letterSpacing: temp2, whiteSpace: temp3, fontWeight: desFontWeight, ...descriptionStyle } = item?.descriptionStyle;

      const defaultLabelProps = {
        style: {
          lineHeight: "14px",
          fontSize: "14px",
          color: "rgba(0, 0, 0, 0.85)",
          fontStyle: "normal",
          fontWeight: 400,
        }
      };
      const labelProps = {
        style: {
          ...labelStyle,
          fontWeight: parseInt(labelFontWeight),
          whiteSpace,
        }
      };
      const defaultDescriptionProps = {
        style: {
          lineHeight: '22px',
          fontSize: '14px',
          fontWeight: 400,
          color: 'rgba(0, 0, 0, 0.88)',
          fontStyle: 'normal',
        }
      }
      const descriptionProps = {
        style: {
          ...descriptionStyle,
          fontWeight: parseInt(desFontWeight)
        }
      }

      return `<Form.Item
                ${item?.label ? `label={<label ${getPropsFromObject(labelProps, defaultLabelProps)}>${item.label}</label>}` : ''}
                ${item?.name ? `name="${item.name}"` : `name="${item.label}"`}
                ${item?.required ? `required="${item.required}"` : ''}
                ${item?.validateStatus ? `validateStatus="${item.validateStatus}"` : ''}
                ${item?.help ? `help="${item.help}"` : ''}
                ${item?.tooltip ? `tooltip="${item.tooltip}"` : ''}
                ${layout !== 'horizontal' ? `style={${getObjectStr(style)}}` : ''}
                ${item?.labelAlign === 'default' ? '' : `labelAlign="${item.labelAlign}"`}
                colon={${!!item?.label && colon}}>
                  ${com.jsx}${item.description ? `<div style={{marginTop: '6px'}}>
                      <Form.Item noStyle>
                        <span ${getPropsFromObject(descriptionProps, defaultDescriptionProps)}>${item.description}</span>
                      </Form.Item>
                    </div>`: ''}
                </Form.Item>`
    },
    wrap(comAry) {
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

      return `${jsx.join('\n')}`
    }
  })

  const actionsStr = getActionsStr(data.actions)

  const labelCol = layout === 'horizontal' ? getLabelCol(data) : undefined

  if (layout === 'horizontal') {
    content = getHorizontalLayoutStr({ actions: data.actions, fromItemsStr, actionsStr })
  } else if (layout === 'inline') {
    content = getInlineLayoutStr({ actions: data.actions, fromItemsStr, actionsStr })
  } else if (layout === 'vertical') {
    content = getVerticalLayoutStr({ actions: data.actions, fromItemsStr, actionsStr })
  }

  const formProps = {
    ...data.config,
    labelCol,
  }
  const defaultFormProps = {
    labelWrap: false,
    labelAlign: 'right',
    layout: "horizontal",
    disabled: false,
    colon: true
  }
  const str = `<Form ${getPropsFromObject(formProps, defaultFormProps)}>${content}</Form>`

  return {
    imports: [
      {
        from: 'antd',
        coms: ['Form', 'Row', 'Col', 'Button', 'Space']
      },
      {
        from: 'antd/dist/antd.css',
        coms: []
      }
    ],
    jsx: str,
    style: '',
    js: ''
  }
}

function getHorizontalLayoutStr({ actions, fromItemsStr, actionsStr }) {
  const actionFlexBasis =
    actions.widthOption === 'px'
      ? `${actions.width}px`
      : `${(actions.span * 100) / 24}%`;

  const horizontalLayoutStr = `<Row>
    ${fromItemsStr}
    ${actions.visible ? `<Col
        flex="0 0 ${actionFlexBasis}"
        style={{
          textAlign: "${actions.align}"
        }}
      >
        <Form.Item label=" " colon={false}>
          ${actionsStr}
        </Form.Item>
      </Col>
      `: ''}
    </Row>`

  return horizontalLayoutStr
}

function getInlineLayoutStr({ actions, fromItemsStr, actionsStr }) {
  const actionStyle: React.CSSProperties = {
    textAlign: actions.align,
    padding: actions.inlinePadding?.map(String).map(unitConversion).join(' ')
  };
  const actionFlexBasis = actions.widthOption === 'px' ? `${actions.width}px` : `${(actions.span * 100) / 24}%`;

  const slotInlineWrapperStyle = {
    display: 'flex',
    flexWrap: 'wrap',
    width: '100%'
  };

  return `<Row style={{ width: "100%" }}>
    <div style={${getObjectStr(slotInlineWrapperStyle)}}>
      ${fromItemsStr}
      ${actions.visible ? `<Col flex="0 0 ${actionFlexBasis}" style={${getObjectStr(actionStyle)}}>
        <Form.Item style={{ marginRight: 0 }}>${actionsStr}</Form.Item>
      </Col>
      `: ''}
    </div>
  </Row>`
}

function getVerticalLayoutStr({ actions, fromItemsStr, actionsStr }) {

  const actionFlexBasis =
    actions.widthOption === 'px'
      ? `${actions.width}px`
      : `${(actions.span * 100) / 24}%`;

  return `<Row>
    ${fromItemsStr}
    ${actions.visible ? `<Col
      flex="0 0 ${actionFlexBasis}"
      style={{
        textAlign: "${actions.align}"
      }}
    >
      <Form.Item label=" " colon={false}>
        ${actionsStr}
      </Form.Item>
    </Col>`: ''}
  </Row>`

}

function getActionsStr(actions) {
  let actionsStr = ''

  actions.items.forEach((item) => {
    if (typeof item.visible !== 'undefined' && !item.visible) {
      return
    }

    actionsStr += `<Button
        ${item.type ? `type="${item.type}"` : ''}
        ${item.loading ? `loading="${item.loading}"` : ''}
      >
        ${item.title}
      </Button>
    `
  })

  actionsStr = `<Space wrap>${actionsStr}</Space>`

  return actionsStr
}

function getObjectStr(obj) {

  return JSON.stringify(obj)
}