
import { defineDataSet } from "ai-dataset";

export default defineDataSet((utils)  => { 
    const result = {}
    let content = utils.string.alpha(20)
    result['图片描述'] = {
      "Q": `将图片的图片描述设置为${content}`,
      "A": {
        "content": content,
      }
    }
    const url = utils.image.url({
      width: 50,
      height: 50
    })
    result['图片地址'] = {
      "Q": `将图片的图片地址设置为${url}`,
      "A": {
        "src": url,
      }
    }
    result['预览图片地址'] = {
      "Q": `将图片的预览图片地址设置为${url}`,
      "A": {
        "previewImgSrc": url,
      }
    }
    result['支持容错处理'] = [true, false].map(item => ({
      "Q": `将图片的支持容错处理设置为${item? '开启':'关闭'}`,
      "A": {
        "isUnuseFallbackity": item,
      }
    })) 

    const fallbackUrl = utils.image.url({
      width: 50,
      height: 50
    })
    result['容错图像占位符']= {
      "Q": `将图片的容错图像占位符设置为${fallbackUrl}`,
      "A": {
        "fallbackImgSrc": fallbackUrl,
      }
    }
    return result
  }
)
