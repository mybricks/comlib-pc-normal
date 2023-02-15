import { Data, SlotIds } from './constants';
export default function (props: RuntimeParams<Data>) {
  const str = renderTab(props);
  const icons = props.data.tabList
    .map(({ icon, showIcon }) => (!!showIcon ? icon : void 0))
    .filter((item) => !!item);
  return {
    imports: [
      {
        form: 'antd',
        coms: ['Tabs', 'Tooltip']
      },
      {
        form: 'antd/dist/antd.css',
        coms: []
      },
      {
        form: '@ant-design/icons',
        coms: icons
      }
    ],
    jsx: str,
    style: '',
    js: ''
  };
}

const renderTab = (props: RuntimeParams<Data>) => {
  const { data, slots } = props;
  const tabBarExtraContent = {} as { left: any; right: any };
  if (data.useLeftExtra) {
    tabBarExtraContent.left = slots[SlotIds.LeftExtra].render();
  }
  if (data.useRigthExtra) {
    tabBarExtraContent.right = slots[SlotIds.RigthExtra].render();
  }
  const tabBarExtraContentStr = !!Object.keys(tabBarExtraContent).length
    ? `tabBarExtraContent={${tabBarExtraContent}}`
    : '';
  return `<Tabs
            activeKey={${data.defaultActiveKey?.toString()}}
            type={${data.type.toString()}}
            centered={${data.centered}}
            tabPosition={${data.tabPosition.toString()}}
            hideAdd={true}
            ${tabBarExtraContentStr}
        >
            ${renderItem(props)}
        </Tabs>`;
};

const renderItem = ({ data, slots }: RuntimeParams<Data>) =>
  data.tabList
    .map(
      (item) => `<Tabs.TabPane
                    tab={
                        <Tooltip title={${item.tooltipText?.toString()}}>
                            <span>
                            ${item.showIcon ? `<${item.icon} />` : null}
                            ${item.num === void 0 ? item.name : `${item.name} (${item.num})`}
                            </span>
                        </Tooltip>
                    }
                    closable={${!!item.closable}}
                    >
                    ${data.hideSlots ? null : `<div style={{minHeight: 100}}>${slots[item.id]?.render()}</div>`}
                    </Tabs.TabPane>`
    )
    .join('\n');
