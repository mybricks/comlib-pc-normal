const version = ANTD_VERSION === 4 ? "" : "antd5."

export default {
  ':root' ({ data }) {
    return {}
  },
  prompts: {
    summary: '轮播图',
    usage: `data声明
items: any = [
  {
    "url": "",
    "slotId": "slot1",
    "bgSize": "contain"
  },
  {
    "url": "",
    "slotId": "slot2",
    "bgSize": "contain"
  }
]
autoplay: boolean = false
autoplaySpeed: number = 3000
dotPosition: 'top' | 'bottom' | 'left' | 'right' = "bottom"
dotsStyle: {
  height: string;
  background: string;
} = {
  "height": "2px",
  "background": "#ffffff"
}
slideIndex: number = 0

slots插槽
data.items[0].slotId: 轮播项1内容
data.items[1].slotId: 轮播项2内容

styleAry声明
无

使用案例
\`\`\`dsl file="page.dsl"
<mybricks.normal-pc.${version}carousel
title="轮播图"
layout={{ width: '100%', height: 'fit-content' }}
data={{
    items: [
    {
      url: 'https://ai.mybricks.world/image-search?term=business%20banner&w=1024&h=550'  //注意：轮播图的图片尽量不同，否则会出现轮播图重复的问题
    },
    {
      url: 'https://ai.mybricks.world/image-search?term=business%20banner&w=1024&h=550'
    }
    ],
    autoplay: true,
    autoplaySpeed: 3000,
    dotPosition: "bottom",
    dotsStyle: {
      height: "2px",
      background: "#ffffff"
    }
}}
>    // 注意: 插槽的数量要和items的数量保持一致
    <slots.content title="轮播图内容" layout={{ width: '100%' }}>  //插槽内留空就可以
    </slots.content>
    <slots.content title="轮播图内容" layout={{ width: '100%' }}>  //插槽内留空就可以
    </slots.content>
</mybricks.normal-pc.${version}carousel>
`
  },
  modifyTptJson: (component) => {
    if (!component?.data) {
      component.data = {}
    }
    component.data = {
      ...component.data,
      catelogDot: "默认",
      slideIndex: 0,
      useSlots: false
    }
    component.data.items.forEach((item, index) => {
      item.slotId = `slot${index + 1}`
      item.bgSize = "contain"
    })
  }
}