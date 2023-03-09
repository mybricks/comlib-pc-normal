import { getPropsFromObject } from '../utils/toReact';
import {
  AlignTypeEnum,
  CursorTypeEnum,
  Data,
  InputIds,
  OutputIds,
  WhiteSpaceEnum
} from './constants';

export default function ({ data }) {
  const style = { ...data.style };
  delete style.styleEditorUnfold;

  const propsStr = getPropsFromObject({
    style: {
      ...style,
      wordBreak: 'break-all',
      whiteSpace:
        (data.isEllipsis && data.ellipsis?.rows > 1) || !data.isEllipsis
          ? WhiteSpaceEnum.PreWrap
          : WhiteSpaceEnum.NoWrap,
      cursor: data.useClick ? CursorTypeEnum.Pointer : CursorTypeEnum.Default
    },
    ellipsis: data.ellipsis || {}
  });

  const component =
    data.isEllipsis && data.ellipsis?.rows > 1 ? 'Typography.Paragraph' : 'Typography.Text';

  const jsx = `<div
  ${getPropsFromObject({
    style: {
      textAlign: data.align || AlignTypeEnum.Left,
      lineHeight: 1
    }
  })}
>
<${component}
  ${propsStr}
>
  ${data.content || ''}
</${component}>
</div>
`;

  return {
    imports: [
      {
        from: 'antd',
        coms: ['Typography']
      },
      {
        from: 'antd/dist/antd.css',
        coms: []
      }
    ],
    jsx,
    style: '',
    js: ''
  };
}
