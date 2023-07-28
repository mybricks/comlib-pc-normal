export default function ({ data }) {
  let str = data.config.range ?
            `<Slider 
              disabled={${data.config.disabled}}
              range={${data.config.range || true}} 
              >` : !data.useInput ? (
                `<Slider 
                disabled={${data.config.disabled}}
                />`
              ):(
                `<Row>
                  <Col span={${data.sliderSpan}}>
                    <Slider 
                    disabled={${data.config.disabled}}
                    />
                  </Col>
                  <Col span={${data.inputSpan}} 
                  >
                    <InputNumber disabled={${data.config.disabled}} />
                  </Col>
                </Row>`
              )

  return {
    imports: [
      {
        from: 'antd',
        coms: ['InputNumber', 'Slider', 'Row', 'Col']
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