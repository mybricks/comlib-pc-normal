import { Data, Children } from './constants';
export default function (props: RuntimeParams<Data>) {
  const str = getRenderStr(props);
  return {
    imports: [
      {
        from: 'antd',
        coms: ['Breadcrumb']
      },
      {
        from: 'antd/dist/antd.css',
        coms: []
      }
    ],
    jsx: str,
    style: '',
    js: ''
  };
}

const getRenderStr = (props: RuntimeParams<Data>) => {
  const { data } = props;
  return !!data.children.length
    ? `<div style={{ padding: ${data.padding} }}>${getItemsStr(
        data.children,
        data.separator,
        data.customSeparator
      )}</div>`
    : `<div />`;
};

const getItemsStr = (list: Children[], separator: string, customSeparator: string) =>
  `<Breadcrumb separator="">
    ${list
      .map((child, index) => {
        const { key, label, style } = child || {};
        return `<>
                  <Breadcrumb.Item
                    key={${JSON.stringify(key)}}
                  >
                    <a style={${JSON.stringify(style)}}>${label}</a>
                  </Breadcrumb.Item>
                ${
                  list.length - 1 !== index
                    ? `<Breadcrumb.Separator>
                    ${separator === 'custom' ? customSeparator : separator}
                  </Breadcrumb.Separator>`
                    : ''
                }
                </>`;
      })
      .join('\n')}
  </Breadcrumb>`;
