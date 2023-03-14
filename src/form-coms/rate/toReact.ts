import { RateProps } from 'antd';
import { getPropsFromObject, getObjectStr } from '../../utils/toReact';
import { Data } from './runtime';
import { ReactNode } from 'react';
import * as Icons from '@ant-design/icons';

export default function ({ data }: RuntimeParams<Data>) { 
  const btnItemR = ({ icon }: { icon: ReactNode }) => {
    const Icon = Icons && Icons[icon as string]?.render();
    return {Icon};
  };

  const iconStr = (()=>{
    let iconStr = '';
    let name = btnItemR({ icon: data.icon }).Icon.props.icon.name;
    let num = name.indexOf('-');
    if(num !== -1){
      let nameArr = name.split('-');
      name = nameArr[0].replace(nameArr[0][0], nameArr[0][0].toUpperCase()) + nameArr[1].replace(nameArr[1][0], nameArr[1][0].toUpperCase())
    }else{
      name = name.replace("-", "");
      name = name.replace(name[0], name[0].toUpperCase());
    }
    let theme = btnItemR({ icon: data.icon }).Icon.props.icon.theme;
    theme = theme.replace(theme[0], theme[0].toUpperCase());
    iconStr = `${name}${theme}`;
    return iconStr;
  })

    const rateCls = {
    };
    const rateCfg: RateProps = {
        // value,
        allowHalf: true,
        ...data.config,
        style: {
            color: data.color
        }
    };

    const str = ` <Rate
                  ${getPropsFromObject(rateCfg)}
                  ${data.isChoose && (data.choose === 'font' || 'icon')  ? 
                  data.choose === 'font'
                    ? `character={'${data.font}'}`
                    : `character={<${iconStr()} />}`
                  : ''}
                />`

    return {
        imports: [
            {
                from: 'antd',
                coms: ['Rate']
            },
            {
                from: 'antd/dist/antd.css',
                coms: []
            },
            {
              from: '@ant-design/icons',
              coms: [ iconStr() ]
            },
        ],
        jsx: str,
        style: '',
        js: ''
    }
}