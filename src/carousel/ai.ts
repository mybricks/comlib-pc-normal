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
slot1: 轮播项1内容
slot2: 轮播项2内容
关于插槽的使用，不需要在插槽下有任何内容

styleAry声明
无

使用案例
轮播图组件需要设置合适的固定高度
\`\`\`dsl file="page.dsl"
<mybricks.normal-pc.${version}carousel
title="轮播图"
layout={{ width: '100%', height: 500 }}
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
    <slots.slot1 title="轮播图内容" layout={{ width: '100%', height: '100%' }}>  //插槽内留空就可以
    </slots.slot1>
    <slots.slot2 title="轮播图内容" layout={{ width: '100%', height: '100%' }}>  //插槽内留空就可以
    </slots.slot2>
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
      item.bgSize = "cover"
    })
  }
}