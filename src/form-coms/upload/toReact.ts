import { Data } from './runtime';
import * as Icons from '@ant-design/icons';
import { ReactNode } from 'react';

export default function ({ data }: RuntimeParams<Data>) {

const UploadNode = data.config.listType === 'dragger' ? `Upload.Dragger` : `Upload`;

const btnItemR = ({ icon }: { icon: ReactNode }) => {
  const Icon = Icons && Icons[icon as string]?.render();
  return {Icon};
};

const iconStr = (()=>{
  let iconStr = '';
  let name = btnItemR({ icon: data.config.uploadIcon || 'InboxOutlined'}).Icon.props.icon.name;
  let num = name.indexOf('-');
  if(num !== -1){
    let nameArr = name.split('-');
    name = nameArr[0].replace(nameArr[0][0], nameArr[0][0].toUpperCase()) + nameArr[1].replace(nameArr[1][0], nameArr[1][0].toUpperCase())
  }else{
    name = name.replace("-", "");
    name = name.replace(name[0], name[0].toUpperCase());
  }
  let theme = btnItemR({ icon: data.config.uploadIcon || 'InboxOutlined' }).Icon.props.icon.theme;
  theme = theme.replace(theme[0], theme[0].toUpperCase());
  iconStr = `${name}${theme}`;
  return iconStr || 'InboxOutlined';
})

const renderUploadText = (data)=>{
  switch (data.config.listType)
    {
      case 'text' || 'picture':
        return `<Button icon={<UploadOutlined />} disabled={${data.config.disabled}}>
                  ${data.config.buttonText}
                </Button>`
      case 'picture-card':
        return `<div>
                  <PlusOutlined />
                  <div style={{ marginTop: 8 }}>
                  ${data.config.buttonText}
                  </div>
                </div>`
      case 'dragger':
        return `<>
                  <p><${iconStr()} /></p>
                  <p>${data.config.buttonText}</p>
                </>`
    }
}

    const str = `<${UploadNode}
                  name={'${data.config.fileKey}'}
                  ${data.config.listType !== 'dragger' ? `listType={'${data.config.listType}'}` : ''}
                  ${data.config.fileType.length !== 0 ? `accept={'${data.config.fileType.join()}'}` : '' }
                  customRequest={() => {}}
                  disabled={${data.config.disabled || false}}
                  multiple={${data.config.multiple || false}}
                  maxCount={${data.config.fileCount}}
                  showUploadList={{
                  showPreviewIcon: ${data.config.usePreview || false}
                  }}
                  >
                    ${renderUploadText(data)}
                </${UploadNode}>`
                   

    return {
        imports: [
            {
                from: 'antd',
                coms: ['Button', 'Upload']
            },
            {
                from: '@ant-design/icons',
                coms: ['PlusOutlined', 'UploadOutlined', iconStr()]
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