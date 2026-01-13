import { getFilterSelector } from '../utils/cssSelector';
import merge from "lodash/merge";
import mergeWith from "lodash/mergeWith";

const version = ANTD_VERSION === 4 ? "" : "antd5."

export default {
  ':root'({ data }) {
    return {}
  },
  prompts: {
    summary: '标签页Tabs，支持 line 和 editable-card 类型标签，对于 editable-card 类型，支持新增删除。',
    usage: `标签页Tabs，支持 line 和 editable-card 类型标签，对于 editable-card 类型，支持新增删除。

slots插槽
tab0: 标签页1（tabN 代表标签项 N+1）

styleAry声明
标签为内部高度为46px的组件，有#1677FF的高亮色，对标antd的Tabs组件。
  在默认状态下，由「标签」来控制字体颜色、背景
  在激活状态下，由「标签文本」「标签」「选中条」来控制激活状态下的样式，选中条则是下方的高亮横线，默认为height = 2px，backgroundColor: #1677FF

注意：
  - 「样式/默认/底部横线」为整体标签底部的贯穿横线，默认为borderBottom: 1px solid #F0F0F0，如需隐藏请配置为borderBottom: none；

关于插槽的使用
当需要插槽（隐藏插槽占位=false）时：
  尽量每个插槽下都要有内容，不同的标签页对应不同的插槽，往往展示不同的内容；
当不需要插槽（隐藏插槽占位=true）时：
  则隐藏插槽内容，高度只剩下标签高度，此时组件高度必须设置为height=46，不可修改；

使用步骤：
- 根据需要配置「常规/外观」，选择「带下划线的普通Tab」还是「卡片式的可编辑Tab」；
- 配置标签项数据
- 判断内容是否需要放置在插槽内
  - 如果需要放置插槽内，常用于标签项为静态数据的情况，需要将「隐藏插槽占位」关闭；
  - 如果无需放置插槽内，需要将「隐藏插槽占位」开启用于隐藏占位；
- 样式配置
  - 标签项的上下默认含12px的padding，所有菜单项都不允许配置padding!；
  - 因为没有继承效果，如果「样式/默认/标签」配置了样式，激活时的「标签文本」「标签」「选中条」也需要配置；
  - 如果默认标签有padding-left、padding-right，则选中的标签也必须有一样的padding-left、padding-right，不然会导致点击后跳动；
`,
  },
  editors: [
    '常规/外观',
    '常规/插槽布局',
    '常规/标签位置',
    '常规/标签居中',
    '常规/隐藏插槽占位',
    '常规/可新增',
    '常规/可删除',
    {
      title: '常规/标签项',
      description: `通过数组来配置所有标签
#示例数据
[
  {
    "name": "标签页1",
    "key": "tab0",
    "id": "tab0"
  }
]
`,
      type: 'array',
      value: {
        set: ({ data, slot, output }, value) => {
          value.forEach((item, index) => {
            item.infoType = 'text'
            item.size = "default"
            item.showZero = false

            slot.add({
              id: item.id,
              title: item.name
            });

            output.add(`${item.id}_into`, `${item.name}显示`, { type: 'any' });
            output.add(`${item.id}_leave`, `${item.name}隐藏`, { type: 'any' });
          })

          data.tabList = value

          data.prohibitClick = false
        }
      }
    },
    '样式/默认/标签',
    '样式/默认/标签头',
    '样式/默认/底部横线',
    '样式/Hover/标签',
    '样式/激活/标签文本',
    '样式/激活/标签',
    '样式/激活/选中条'
  ],
}