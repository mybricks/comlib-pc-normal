import { Data, SlotIds } from './constants';
export default function (props: RuntimeParams<Data>) {
  const str = renderTab(props);
  const commonImports = [
    {
      from: 'antd',
      coms: ['Tabs', 'Tooltip']
    },
    {
      from: 'antd/dist/antd.css',
      coms: []
    }
  ];
  const icons = props.data.tabList
    .map(({ icon, showIcon }) => (!!showIcon ? icon : void 0))
    .filter((item) => !!item);
  if (!!icons.length) {
    commonImports.push({
      from: '@ant-design/icons',
      coms: icons as string[]
    });
  }
  return {
    imports: commonImports,
    jsx: str,
    style: '',
    js: ''
  };
}

const renderTab = (props: RuntimeParams<Data>) => {
  const { data, slots } = props;
  const tabBarExtraContentStr =
    data.useLeftExtra || data.useRigthExtra
      ? `tabBarExtraContent={{
      ${data.useLeftExtra ? `left: ${slots[SlotIds.LeftExtra].render({})},` : ''}
      ${data.useRigthExtra ? `right: ${slots[SlotIds.RigthExtra].render({})}` : ''}
    }}`
      : '';
  return `<Tabs
            defaultActiveKey={${JSON.stringify(data.defaultActiveKey)}}
            type={${JSON.stringify(data.type)}}
            centered={${data.centered}}
            tabPosition={${JSON.stringify(data.tabPosition)}}
            hideAdd={true}
            ${tabBarExtraContentStr}
        >
            ${renderItem(props)}
        </Tabs>`;
};

const renderItem = ({ data, slots }: RuntimeParams<Data>) =>
  data.tabList
    .map((item) => {
      const tabTitleContent = `<span>
                                ${item.showIcon ? `<${item.icon} />` : ''}
                                ${item.num === void 0 ? item.name : `${item.name} (${item.num})`}
                              </span>`;
      const tabTitle = !!item.tooltipText
        ? `<Tooltip title={${JSON.stringify(item.tooltipText)}}>
            ${tabTitleContent}
          </Tooltip>`
        : tabTitleContent;
      return `<Tabs.TabPane
        tab={
            ${tabTitle}
        }
        key={${JSON.stringify(item.key)}}
        closable={${!!item.closable}}
        >
        ${data.hideSlots ? '' : `<div style={{minHeight: 100}}>${slots[item.id]?.render({})}</div>`}
        </Tabs.TabPane>`;
    })
    .join('\n');
