import { getFilterSelector } from '../../../utils/cssSelector';
import { Data } from '../../types';

const rowExpandEditor = {
  '.ant-table-thead .ant-table-cell.ant-table-row-expand-icon-cell': {
    title: "展开栏",
    style: [
      {
        title: '展开框',
        catelog: '默认',
        options: [
          {
            type: 'border',
            config: {
              disableBorderWidth: true,
              disableBorderRadius: true
            }
          },
          {
            type: 'background',
            config: {
              disableBackgroundImage: true
            }
          }
        ],
        target: `.ant-table-row-expand-icon-cell .ant-table-row-expand-icon`
      },
      {
        title: '图标',
        catelog: '默认',
        options: [{
          type: 'font', config: {
            disableTextAlign: true,
            disableFontFamily: true,
            disableFontWeight: true,
            disableFontSize: true,
            disableLineHeight: true,
            disableLetterSpacing: true,
            disableWhiteSpace: true,
          }
        }],
        target: [
          `.ant-table-row-expand-icon-cell .ant-table-row-expand-icon:before`,
          `.ant-table-row-expand-icon-cell .ant-table-row-expand-icon:after`
        ],
        domTarget: `.ant-table-row-expand-icon-cell .ant-table-row-expand-icon`
      },
    ]
  }
}


export default rowExpandEditor;
