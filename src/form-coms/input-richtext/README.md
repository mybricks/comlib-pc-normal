# README

## 说明

### 本地化

1. 由于富文本编辑器和富文本输入框之前的冲突,将原 5.7.1 版本修改
   实例名: tinymce/tinyMce => myTinymce/myTinyMce
2. 取消原本默认样式主题(会按照相对路径引入 bug), 直接打入

## 配置说明

```javascript
{
  width: '100%', //  设置富文本编辑器宽度
  height: '100%', //  设置富文本编辑器高度
  menubar: false, // 设置富文本编辑器菜单, 默认true
  branding: false, // 关闭底部官网提示 默认true
  statusbar: true, // 显示底部状态栏 默认true
  readonly: false, // 设置只读属性 默认 false
  resize: false, // 调节编辑器大小 默认 true
  autosave_ask_before_unload: true, // 阻止有内容时浏览器阻塞行为, 默认 true  需引入插件autosave
  autosave_interval: '3s', // 设置自动保存为草稿时间 单位只能为s 需引入插件autosave
  autosave_prefix: `editor_${_this.$route.path}`, // 设置自动保存为草稿时前缀 本地localStorage中存储  需引入插件autosave
  autosave_retention: '300m', // 自动草稿的有效期 单位只能为m  需引入插件autosave
  contextmenu: 'copy paste cut link', // 上下文菜单 默认 false
  draggable_modal: true, // 模态框拖动 默认false
  placeholder: '开始编写吧', // 占位符
  theme: 'silver', // 主题
  skin_url: '/tinymce/skins/ui/oxide', // 主题路径
  icons: 'custom', // 自定义图标名称
  icons_url: '/tinymce/icons/icons.js', // 自定义图标路径
  language_url: '/tinymce/langs/zh_CN.js', // 中文化 默认为英文
  language: 'zh_CN', // 设置富文本编辑器语言
  content_css: `/tinymce/skins/content/default`, // 富文本编辑器内容区域样式
  content_style: 'body, p{font-size: 12px}', // 为内容区编辑自定义css样式
  fontsize_formats: '12px 14px 16px 18px 20px 22px 24px 26px 36px 48px 56px', // 工具栏自定义字体大小选项
  font_formats:
    "微软雅黑='微软雅黑'; 宋体='宋体'; 黑体='黑体'; 仿宋='仿宋'; 楷体='楷体'; 隶书='隶书'; 幼圆='幼圆'; 方正舒体='方正舒体'; 方正姚体='方正姚体'; 等线='等线'; 华文彩云='华文彩云'; 华文仿宋='华文仿宋'; 华文行楷='华文行楷'; 华文楷体='华文楷体'; 华文隶书='华文隶书'; Andale Mono=andale mono,times; Arial=arial; Arial Black=arial black;avant garde; Book Antiqua=book antiqua;palatino; Comic Sans MS=comic sans ms; Courier New=courier new;courier; Georgia=georgia; Helvetica=helvetica; Impact=impact;chicago; Symbol=symbol; Tahoma=tahoma;arial; sans-serif; Terminal=terminal,monaco; Times New Roman=times new roman,times; Trebuchet MS=trebuchet ms; Verdana=verdana;geneva; Webdings=webdings; Wingdings=wingdings", // 工具栏自定义字体选项
  toolbar_sticky: true, // 粘性工具栏 默认false (在向下滚动网页直到不再可见编辑器时，将工具栏和菜单停靠在屏幕顶部)
  toolbar_mode: 'sliding', // sliding生效条件toolbar必须为字符串,且有'|'区分,不能为数组
  plugins: ['autosave help textpattern lineheight'], // 插件配置
  toolbar:
    'fontselect styleselect fontsizeselect restoredraft undo redo | bold italic underline strikethrough subscript superscript removeformat forecolor backcolor lineheight align outdent indent help', // 工具栏配置
  images_upload_handler: (blobInfo, success, failure) => {
    // 发送请求, 获取图片路径后, 将路径传给success
    success('http://pic.sc.chinaz.com/files/pic/pic9/202005/apic25209.jpg');
  }, // 图片上传函数 需引入插件image
  image_advtab: true, // 为上传图片窗口添加高级属性 需引入插件image
  paste_data_images: true, // 粘贴data格式的图像 需引入插件paste 谷歌浏览器无法粘贴
  paste_as_text: true, // 默认粘贴为文本 需引入插件paste 谷歌浏览器无法粘贴
  templates: [{ title: '标题', description: '描述', content: '内容' }], // 内容模板 需引入插件templates
  visual: false, // 颜色辅助
  quickbars_selection_toolbar: 'bold italic underline strikethrough | link h2 h3 h4 blockquote', // 设置 快速选择 触发提供的工具栏 需引入插件  默认 'alignleft aligncenter alignright' 设置为false禁用
  quickbars_insert_toolbar: 'quickimage quicktable', // 设置 快速插入 触发提供的工具栏 需引入插件quickbars 默认 quickimage quicktable 设置为false禁用
  textpattern_patterns: [
    { start: '*', end: '*', format: 'italic' },
    { start: '**', end: '**', format: 'bold' },
    { start: '#', format: 'h1' },
    { start: '##', format: 'h2' },
    { start: '###', format: 'h3' },
    { start: '####', format: 'h4' },
    { start: '#####', format: 'h5' },
    { start: '######', format: 'h6' },
    { start: '1. ', cmd: 'InsertOrderedList' },
    { start: '* ', cmd: 'InsertUnorderedList' },
    { start: '- ', cmd: 'InsertUnorderedList' }
  ], // 快速排版  类似于markdown 需引入插件textpattern
  init_instance_callback: (editor) => {
    // 初始化结束后执行, 里面实现双向数据绑定功能
    if (_this.value) {
      editor.setContent(_this.value);
    }
    _this.hasInit = true;
    editor.on('Input undo redo Change execCommand SetContent', (e) => {
      _this.hasChange = true;
      // editor.getContent({ format: ''text }) // 获取纯文本
      _this.$emit('change', editor.getContent());
    });
  },
  setup: (editor) => {
    // 初始化前执行
    // 监听鼠标按下事件
    editor.on('keydown', (e) => {
      if (e.keyCode === 9) {
        if (e.shiftKey) {
          editor.execCommand('Outdent');
        } else {
          editor.execCommand('Indent');
        }
        e.preventDefault();
        e.stopPropagation();
      }
    });
    // 注册自定义上传按钮
    editor.ui.registry.addButton('upload', {
      text: `<i class="el-icon-upload" style="font-size: 24px"></i>`,
      tooltip: '自定义上传',
      onAction: () => {
        _this.config.show = true;
      }
    });
    // 注册获取内容按钮
    editor.ui.registry.addButton('submit', {
      text: `<i class="el-icon-position" style="font-size: 18px"></i>`,
      tooltip: '获取内容',
      onAction: () => {
        console.log(editor.getContent());
      }
    });
    // 注册清空内容按钮
    editor.ui.registry.addButton('empty', {
      text: `<i class="el-icon-close" style="font-size: 18px"></i>`,
      tooltip: '清空内容',
      onAction: () => {
        _this.content = '';
        editor.setContent('');
      }
    });
  }
};
```

---

toolbar 配置 功能 所需插件
restoredraft 恢复上次的草稿 无需引入插件
undo 撤销 无需引入插件
redo 恢复 无需引入插件
fontselect 字体选择 无需引入插件
styleselect 格式选择 无需引入插件
fontsizeselect 字号选择 无需引入插件
cut 剪切 无需引入插件
copy 复制 无需引入插件
selectall 全选 无需引入插件
bold 粗体 无需引入插件
italic 斜体 无需引入插件
underline 下划线 无需引入插件
strikethrough 删除线 无需引入插件
subscript 下标 无需引入插件
superscript 上标 无需引入插件
removeformat 清除格式 无需引入插件
forecolor 文字颜色 无需引入插件
backcolor 背景颜色 无需引入插件
align 对齐方式 无需引入插件
outdent 增加缩进 无需引入插件
indent 减少缩进 无需引入插件
paste 粘贴 paste
ltr 文字方向从左向右 directionality
rtl 文字方向从右向左 directionality
anchor 锚点 anchor
lineheight 行高 lineheight
bullist 符号列表 advlist,lists(advlist 依赖于 lists)
numlist 数字列表 advlist,lists(advlist 依赖于 lists)
insertdatetime 插入时间/日期 insertdatetime
table 表格 table
tabledelete 删除表格 table
tableprops 表格属性 table
tablerowprops 行属性 table
tablecellprops 单元格属性 table
tableinsertrowbefore 在上方插入 table
tableinsertrowafter 在下方插入 table
tabledeleterow 删除行 table
tableinsertcolbefore 在左侧插入 table
tableinsertcolafter 在右侧插入 table
tabledeletecol 删除列 table
hr 水平分割线 hr
nonbreaking 插入不间断空格 nonbreaking
pagebreak 分页符 pagebreak
template 内容模板 template
charmap 特殊字符 charmap
emoticons 表情插件 emoticons
image 插入编辑图片 image
quickimage 快捷插入图片 image
media 插入/编辑媒体资源 media
link 超链接 link
toc 目录生成器 toc
code 编辑源码 code
quickbars 快速工具栏 quickbars
codesample 代码示例 codesample
fullpage 文档属性 fullpage
print 打印 print
searchreplace 查找替换 searchreplace
preview 预览 preview
fullscreen 全屏 fullscreen
wordcount 字数统计 wordcount
visualblocks 显示区块边框 visualblocks
visualchars 显示不可见字符 visualchars
help 帮助 help
————————————————
--
