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
      extra={${data.useExtra ? slotExtra : undefined}}
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
        form: 'antd',
        coms: ['Card']
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