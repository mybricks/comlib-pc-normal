import { basicComPropsTrans } from "./basicUtils";

export const alertPropsTrans = (item) => {
  let alertProps = {
    props: {
      ...basicComPropsTrans(item),
      ...((item.props.content && item.props.showInfo) && {
        description: decodeURIComponent(item.props.content)
      })
    },
    ...( item.props.message && {
      children: [
        {
          "id": "comp_" + item.id + 'text',
          "type": "@es/tianhe-basic-materials::Text",
          "name": "文本",
          "children": [],
          "props": {
            "label": decodeURIComponent(item.props.message),
            "contentType": "text"
          }
        }
      ]
    })
  }
  return alertProps
}