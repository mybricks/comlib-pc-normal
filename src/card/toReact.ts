export default function ({ data, slots, style }) {
  const renderCard = (
    data,
    slots,
    style
  ) => {
    const slotBody = slots['body']?.render({});
    const slotExtra = slots['extra']?.render({});

    return `
    <div
      style={${JSON.stringify({  
        height: '100%'
      })}}
    >
      <Card
      title="${data.title}"
      size="${data.size}"
      bordered={${data.bordered}}
      style={${JSON.stringify({
        ...style,
        height: '100%',
        cursor: data.cursor ? 'pointer' : 'unset'
      })}}
      ${data.useExtra && slotExtra.length!==0 ? `extra={${slotExtra}}` : ''}
      hoverable={${data.hoverable}}
      >
        ${slotBody.length!==0 ? `<div
        style={${JSON.stringify({
          overflowY: style.height !== 'auto' ? 'auto' : void 0,
          overflowX: style.width !== 'auto' ? 'auto' : void 0,
          height:  data.title === '' ? "calc(~'100% - 57.14px')" : '100%',
          padding: '1px 0'
        })}}
        >`: ''}
          ${slotBody}
        ${slotBody.length!==0 ? `</div>` : ''}
      </Card>
    </div>`;
  };

  let str = renderCard(data,slots,style);

  return {
    imports: [
      {
        from: 'antd',
        coms: ['Card']
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