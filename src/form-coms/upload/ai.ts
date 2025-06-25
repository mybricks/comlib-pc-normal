export default {
  ':root' ({ data }) {
    return {}
  },
  prompts: {
    summary: '上传',
    usage: `data数据模型
rules: array则
config: {
fileKey: string
buttonText: string
name: string
listType: ['text', 'picture', 'picture-card', 'dragger']
fileType: array
fileSize: number
fileCount: number
uploadStyle: object
}
isShowUploadList: boolean
imageSize: number[]
buttonSize: ['small', 'middle', 'large']
fileClick: boolean
hideIcon: boolean
isEditable: boolean

schema声明
form-item

styleAry声明
背景: .ant-upload
图标: .ant-btn .anticon
文案: .text
拖拽区图标: .ant-upload-drag p.ant-upload-drag-icon .anticon
拖拽区文案: .ant-upload-drag p.ant-upload-text`
  }
}