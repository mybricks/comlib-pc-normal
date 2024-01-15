
import { defineDataSet } from "ai-dataset";
export default defineDataSet((utils) => {
  const result = {}

  const ts1 = utils.lorem.word({ length: { min: 0, max: 10 } })
  result['上传文件Key'] = [{
    "Q": `将上传组件的上传文件key设置为“${ts1}”`,
    "A": {
      data: {
        config: {
          fileKey: ts1
        }
      }
    }
  }]

  const ts2 = utils.lorem.word({ length: { min: 0, max: 10 } })
  result['上传按钮文案'] = [{
    "Q": `将上传组件的上传按钮文案设置为“${ts2}”`,
    "A": {
      data: {
        config: {
          buttonText: ts2
        }
      }
    }
  }]

  result['上传文件限制类型'] = [
    { label: 'Word文档', value: '.doc,.docx' },
    { label: 'Excel电子表格', value: '.xlsx,.xls,.xlsm' },
    { label: 'PowerPoint演示文稿', value: '.pptx,.ppt' },
    { label: 'PDF文档', value: '.pdf' },
    { label: 'HTML网页文件', value: '.html' },
    { label: 'CSS样式表文件', value: '.css' },
    { label: 'Less样式表文件', value: '.less' },
    { label: 'JS脚本文件', value: '.js' },
    { label: 'XML数据文件', value: '.xml' },
    { label: 'JSON文件', value: '.json' },
    { label: 'Markdown文件', value: '.md' },
    { label: 'SQL数据库文件', value: '.sql' },
    { label: 'MDB数据库文件', value: '.mdb' },
    { label: 'zip压缩文件', value: '.zip' },
    { label: 'rar压缩文件', value: '.rar' },
    { label: 'Mp3音频文件', value: '.mp3' },
    { label: 'Mp4视频文件', value: '.mp4' },
    { label: 'Avi视频文件', value: '.avi' },
    { label: 'Mov视频文件', value: '.mov' },
    { label: 'JPG图片', value: '.jpg,.jpeg' },
    { label: 'PNG图片', value: '.png' },
    { label: 'SVG图片', value: '.svg' },
    { label: 'GIF图片', value: '.gif' },
    { label: 'Tiff图片', value: '.tiff' }
  ].map((item) => {
    return {
      "Q": `将上传组件允许上传的文件类型设置为${item.label}`,
      "A": {
        data: {
          config: {
            fileType: [item.value]
          }
        }
      }
    }
  })

  result['上传文件限制大小'] = [{
    "Q": `将上传组件允许上传的文件大小设置为10M`,
    "A": {
      data: {
        config: {
          fileSize: 10
        }
      }
    }
  }]

  result['上传文件限制个数'] = [{
    "Q": `将上传组件允许上传的文件个数设置为5个`,
    "A": {
      data: {
        config: {
          fileCount: 5
        }
      }
    }
  }]

  result['自定义内容'] = [{
    "Q": `开启上传组件的自定义内容功能`,
    "A": {
      data: {
        config: {
          listType: 'text',
        },
        isCustom: true
      }
    }
  }]

  result['展示文件列表'] = [{
    "Q": `开启上传组件的展示文件列表功能`,
    "A": {
      data: {
        config: {
          listType: 'text',
        },
        isShowUploadList: true
      }
    }
  }]

  result['开启自定义删除'] = [{
    "Q": `开启上传组件的自定义删除功能`,
    "A": {
      data: {
        config: {
          useCustomRemove: true,
        },
      }
    }
  }]

  result['开启多选'] = [{
    "Q": `开启上传组件的多选功能`,
    "A": {
      data: {
        config: {
          multiple: true,
        },
      }
    }
  }]

  result['图片配置'] = [{
    "Q": `开启上传组件的图片配置功能`,
    "A": {
      data: {
        config: {
          usePreview: true,
        },
      }
    }
  },
  {
    "Q": `开启上传组件的图片配置功能, 并限制上传的图片宽高必须为设置为100*100`,
    "A": {
      data: {
        config: {
          usePreview: true,
        },
        imageSize: [100, 100]
      }
    }
  }]


  return result
})
