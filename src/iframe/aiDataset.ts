
import { defineDataSet } from "ai-dataset";
export default defineDataSet((utils)  => {
  const result = {}
  const width = utils.number.int({ min: 0, max: 1000})
  const url = utils.internet.url()
  result['链接地址'] = {
    "Q": `将链接地址设置为${url}`,
    "A": {
      "data": {
        "url": url,
      }
    }
  }
  result['使用srcDoc'] = utils.options.switch().map(item => ({
    "Q": `将使用srcDoc设置为${item.label}`,
    "A": {
      "data": {
        "useSrcDoc": item.value,
      }
    }
  })) 

  const id = utils.string.alpha(5)
  result['ID'] = {
    "Q": `将ID设置为${id}`,
    "A": {
      "data": {
        "id": id,
      }
    }
  }

  return result
})
