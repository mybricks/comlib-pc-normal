import { uuid } from '../../utils';

const version = ANTD_VERSION === 4 ? "" : "antd5."

export default {
  ':root' ({ data }) {
    return {}
  },
  prompts: {
    summary: `单选框列表 Radio，当需要从一组选项中选中一个时，需要使用该组件（例如：今日实时、近7天、近30天等等）
表单项组件，schema=form-item`,
    usage: `

schema声明
form-item

layout声明
width: 默认为100%
height: 默认为fit-content，不可配置
`
  },
}