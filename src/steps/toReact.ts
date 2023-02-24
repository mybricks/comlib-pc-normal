import { Data } from './constants';
export default function (props: RuntimeParams<Data>) {
  return {
    imports: [
      {
        from: 'antd',
        coms: ['Button', 'Steps']
      },
      {
        from: 'antd/dist/antd.css',
        coms: []
      }
    ],
    jsx: getJsx(props),
    style: '',
    js: ''
  };
}

const getJsx = (props: RuntimeParams<Data>) => {
  const { data } = props;
  let directionStyle;
  if (data.steps.direction === 'vertical') {
    directionStyle = `style={{ display: 'flex' }}`;
  }
  return `<div ${directionStyle}>
            ${renderSteps(props)}
            ${renderStepContent(props)}
            ${renderToolbar(props)}
        </div>`;
};

const renderSteps = (props: RuntimeParams<Data>) => {
  const { data } = props;
  const stepsStyle =
    data.steps.direction === 'horizontal'
      ? { display: 'flex', justifyContent: 'center' }
      : { width: 'fit-content', wordBreak: 'keep-all', justifyContent: 'flex-start' };
  return ` <Steps
    current={${data.current}}
    size={${JSON.stringify(data.steps.size)}}
    type={${JSON.stringify(data.steps.type)}}
    direction={${JSON.stringify(data.steps.direction || 'horizontal')}}
    style={${JSON.stringify(stepsStyle)}}
  >
  ${renderItem(props)}
  </Steps>`;
};

const renderItem = (props: RuntimeParams<Data>) => {
  const { data } = props;
  const stepAry = data.stepAry.filter((item) => !item.hide);
  const itemStyle =
    data.steps.direction === 'horizontal'
      ? { flex: 1, maxWidth: 258 }
      : { width: 'max-content', minHeight: 120 };
  return stepAry
    .map((item: any, index) => {
      const stepsProps: any = { key: item.id };
      if (data.steps.direction === 'vertical' && index === stepAry.length - 1) {
        itemStyle.minHeight = 'unset';
      }
      if (!!item.title) {
        stepsProps.title = item.title;
      }
      if (!!item.subTitle) {
        stepsProps.subTitle = item.subTitle;
      }
      if (!!item.description) {
        stepsProps.description = item.description;
      }
      return `<Steps.Step
      ${Object.keys(stepsProps)
        .map((key) => `${key}={${JSON.stringify(stepsProps[key])}}`)
        .join('\n')}
        style={${JSON.stringify(itemStyle)}}
        />`;
    })
    .join('\n');
};

const renderStepContent = (props: RuntimeParams<Data>) => {
  const { data } = props;
  const contentWrapStyle = {
    minHeight: 100,
    lineHeight: 100,
    display: 'flex',
    marginTop: 40,
    backgroundColor: 'rgba(253, 247, 166, 0.2)',
    outline: '1px dashed #d7d7d7'
  };
  const contentStyle = {
    flex: 1,
    width: '100%',
    minWidth: '0%'
  };
  return !data.hideSlots
    ? ` <div style={${JSON.stringify(contentWrapStyle)}}>
    <div style={${JSON.stringify(contentStyle)}}>{${renderSlots(props)}}</div>
  </div>`
    : '';
};

const renderSlots = (props: RuntimeParams<Data>) => {
  const { slots } = props;
  return Object.keys(slots)
    .map((id) => slots[id].render({ key: id }))
    .join('\n');
};

const renderToolbar = (props: RuntimeParams<Data>) => {
  const { data } = props;
  const stepAry = data.stepAry.filter((item) => !item.hide);
  const toolbarStyle = {
    width: '100%',
    display: 'flex',
    marginTop: 24,
    justifyContent: data.toolbar.actionAlign,
    position: data.toolbar.fixed ? 'fixed' : 'static',
    bottom: data.toolbar.bottom,
    gap: 2
  };
  const previousBtn =
    data.toolbar.btns.includes('previous') && data.current > 0
      ? ` <Button>
  {${data.toolbar.secondBtnText || '上一步'}}
</Button>`
      : '';

  const nextBtn = !(data.current === stepAry.length - 1 || !data.toolbar.btns.includes('next'))
    ? `<Button type="primary" >
      {${data.toolbar.primaryBtnText || '下一步'}}
    </Button>`
    : '';

  const submitBtn =
    data.current === stepAry.length - 1 && data.toolbar.btns.includes('submit')
      ? `<Button type="primary" onClick={submit} >
    {${data.toolbar.submitText || '提交'}}
  </Button>`
      : '';

  const extraBtn = data.toolbar.extraBtns?.length
    ? data.toolbar.extraBtns
        .map(
          ({ id, text, type }) =>
            `<Button key={${JSON.stringify(id)}} type={${
              JSON.stringify(type) || 'default'
            }}>{${text}}</Button>`
        )
        .join('\n')
    : '';

  return data.toolbar.showActions
    ? `<div
    style={${JSON.stringify(toolbarStyle)}}
  >
    {${previousBtn}}
    {${nextBtn}}
    {${submitBtn}}
    {${extraBtn}}
  </div>`
    : '';
};
