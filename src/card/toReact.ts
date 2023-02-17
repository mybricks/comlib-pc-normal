export default function ({ data, slots, style }) {
  const renderCard = (
    data,
    slots,
    style
  ) => {
    const slotBody = slots['body']?.render({});
    const slotExtra = slots['extra']?.render({});

    return `
    <div>
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
        ${slotBody}
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