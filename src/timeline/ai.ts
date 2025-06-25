
export default {
  ':root' ({ data }) {
    return {}
  },
  prompts: {
    summary: '时间轴',
    usage: `data数据模型
timelines: [
{
  id: string
  title: string
  subTitle: string
  description: string
}
]
reverse: boolean
mode: ['left', 'right', 'alternate']


styleAry声明
时间轴点: ul.ant-timeline > li.ant-timeline-item > div.ant-timeline-item-head
标题: ul.ant-timeline > li.ant-timeline-item > div.ant-timeline-item-content span[data-type="title"]
副标题: ul.ant-timeline > li.ant-timeline-item > div.ant-timeline-item-content span[data-type="subTitle"] 
描述: ul.ant-timeline > li.ant-timeline-item > div.ant-timeline-item-content div[data-type="desc"]
`
  }
};
