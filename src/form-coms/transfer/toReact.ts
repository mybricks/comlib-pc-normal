import { Data } from './types';

export default function ({ data }: RuntimeParams<Data>) {
  let renderStr = 'render={(item) => `${item.title}-${item.description}`}';
  const str = `<Transfer
                titles={['${data.titles?.[0]}', '${data.titles?.[1]}']}
                dataSource={[
                  {description: "description",
                  disabled: false,
                  title: "item"}]}
                showSearch={${data.showSearch || false}}
                showSelectAll
                oneWay={${data.oneWay || false}}
                disabled={${data.disabled || false}}
                ${data.showDesc ? renderStr : `render={(item) => item.title}`}
                ${data.showPagination ? `pagination={{ pageSize: ${data.pagination?.pageSize}}}` : ''}
                />`                  

    return {
        imports: [
            {
                from: 'antd',
                coms: ['Transfer']
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