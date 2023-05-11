import { getPropsFromObject, getObjectStr } from '../utils/toReact';
import { AlignEnum, Data, Location, SlotIds } from './constants';
import { ReactNode } from 'react';
import * as Icons from '@ant-design/icons';

export default function ({ data, slots }) {
  let defaultDeps: { from: string, coms: string[] }[] = [];
  const btnItemR = ({ icon }: { icon: ReactNode }) => {
    const Icon = Icons && Icons[icon as string]?.render();
    return { Icon };
  };

  const createIconStr = (icon) => {
    if (!icon) return '';
    let iconStr = '';
    let name = btnItemR({ icon }).Icon.props.icon.name;
    let num = name.indexOf('-');
    if (num !== -1) {
      let nameArr = name.split('-');
      name =
        nameArr[0].replace(nameArr[0][0], nameArr[0][0].toUpperCase()) +
        nameArr[1].replace(nameArr[1][0], nameArr[1][0].toUpperCase());
    } else {
      name = name.replace('-', '');
      name = name.replace(name[0], name[0].toUpperCase());
    }
    let theme = btnItemR({ icon }).Icon.props.icon.theme;
    theme = theme.replace(theme[0], theme[0].toUpperCase());
    iconStr = `${name}${theme}`;
    return iconStr;
  };

  const iconsSet = new Set<string>();

  const btns = (data.footerBtns || []).map((item) => {
    const {
      id,
      icon,
      location = Location.FRONT,
      showText,
      title,
      type,
      useBtnLoading,
      useIcon,
      disabled,
      hidden
    } = item;
    const props = {
      hidden,
      disabled,
      type,
      loading: useBtnLoading ? true : undefined,
      key: id
    };
    const iconName = createIconStr(icon);
    // 收集使用到的图标
    if (useIcon) {
      iconsSet.add(iconName);
    }
    const iconStr = useIcon && Icons ? `<${iconName}/>` : '';

    return `<Button ${getPropsFromObject(props)}>
${useIcon && location === Location.FRONT ? iconStr : ''}
${showText ? title : ''}
${useIcon && location === Location.BACK ? iconStr : ''}
</Button>`;
  });

  const footerStr = `<div
  style={{ footerLayout: "${data.footerLayout ?? AlignEnum.FlexEnd}"}}
>
  ${btns.join('')}
</div>`;

  const props = {
    visible: false,
    width: data.width,
    keyboard: false,
    maskClosable: false,
    title: data.hideTitle ? undefined : data.title,
    //okText: data.okText,
    closable: data.closable,
    centerd: data.centerd,
    //cancelText: data.cancelText,
    bodyStyle: data.bodyStyle
  };

  const jsx = `<Modal ${getPropsFromObject(props)} ${data.useFooter ? `footer={${footerStr}}` : 'footer={null}'} >
  ${slots[SlotIds.Container].render({})}
</Modal>`;

if(!data.useFooter){
  defaultDeps = [{
    from: 'antd',
    coms: ['Modal']
  }]
}else{
  defaultDeps = [{
    from: 'antd',
    coms: ['Modal', 'Button']
  }]
}
  const importsList = [
    ...defaultDeps,
    {
      from: 'antd/dist/antd.css',
      coms: []
    }
  ];

  if (iconsSet.size > 0) {
    let icons: string[] = [];
    iconsSet.forEach((icon) => icons.push(icon));
    importsList.push({
      from: '@ant-design/icons',
      coms: icons
    });
  }
  return {
    imports: importsList,
    jsx,
    style: '',
    js: ''
  };
}
