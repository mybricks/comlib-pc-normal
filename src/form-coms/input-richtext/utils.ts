import contentMinCss from './tinymce/skins/ui/oxide/content.min.css';
import defalutContentMinCss from './tinymce/skins/content/default/content.min.css';
// 作用于iframe,所以使用该方式引入 因为skin,theme会按相对路径寻找,为本地化就关闭,再直接引入skin和theme
interface InitProps {
  readonly?: boolean;
  isFS: boolean;
  selector?: string;
  customIconsId: string;
  height: number | string;
  toolbar: string;
  target: any;
  setUp: (...angs: any) => void;
  initCB: (...angs: any) => void;
  placeholder: string;
  statusbar?: boolean; // 下方状态栏是否显示
  attachment_upload_handler?: (
    file: File,
    successCallback: (arg0: string) => void,
    failureCallback: (arg0: string) => void,
    progressCallback: (arg0: string) => void
  ) => void; // 附件上传方法
}
export function Init({
  selector,
  height,
  target,
  isFS,
  readonly = false,
  customIconsId,
  toolbar,
  placeholder,
  setUp,
  initCB,
  ...others
}: InitProps) {
  const tinyMCE = getWindowVal('myTinyMce');
  if (!tinyMCE) return;

  const plugins: string[] = [
    'table',
    // 'uploadimage',
    'link',
    'paste',
    'fullpage',
    // 'customfullscreen',
    // 'customfullscreenexit',
    'nonbreaking',
    'lists',
    'wordcount',
    'help',
    'fullscreen',
    'emoticons',
    'textpattern',
    'advlist',
    'code',
    'codesample',
    'letterspacing',
    'attachment'
  ];

  tinyMCE.init({
    selector,
    target,
    height,
    menubar: false,
    branding: false,
    icons: window.myTinymce?.IconManager.has(customIconsId) ? customIconsId : '',
    plugins,
    toolbar,
    language: 'zh_CN',
    fontsize_formats: '12px 14px 16px 18px 20px 24px 36px 48px 56px 72px',
    font_formats: `系统字体=sans-serif;微软雅黑=Microsoft YaHei,Helvetica Neue,PingFang SC,sans-serif;黑体=SimHei,sans-serif;黑体-简=Heiti SC,sans-serif;宋体=Simsun,serif;仿宋体=FangSong,serif;楷体=KaiTi;苹果苹方=PingFang SC,Microsoft YaHei,sans-serif;Arial=arial,helvetica,sans-serif;Arial Black=arial black,avant garde;Book Antiqua=book antiqua,palatino;`,
    fullpage_default_font_size: '12px',
    nonbreaking_force_tab: true,
    letterspacing_formats: `0 0.5pt 1pt 1.5pt 2pt 3pt`,
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
    ],
    paste_data_images: true, // 粘贴data格式的图像 转成base64
    paste_as_text: true, // 默认粘贴为文本
    convert_urls: false, //url不转换
    relative_urls: false, //转换为相对地址
    // skin: `oxide`,
    skin: false,
    // theme: 'silver',
    setup: setUp,
    init_instance_callback: function (editor) {
      initCB && initCB(editor);
    },
    readonly,
    content_css: '',
    content_style:
      contentMinCss +
      defalutContentMinCss +
      (readonly
        ? `p {margin: 0px; border:0px ; padding: 0px;} .mce-content-readonly {margin: 0px;}`
        : `p {margin: 0px; border:0px ; padding: 0px;}`),
    placeholder,
    ...(others || {})
  });
}

export function getWindowVal(key: string) {
  return (window as any)[key];
}

export function getText(str: string) {
  return str
    .replace(/^<p>/i, '')
    .replace(/<\/p>$/i, '')
    .replace(/&nbsp;/gi, '');
}

const optionMappings = [
  // 文本编辑相关
  ['加粗', 'bold'],
  ['斜体', 'italic'],
  ['下划线', 'underline'],
  ['删除线', 'strikethrough'],
  ['上标', 'superscript'],
  ['下标', 'subscript'],
  ['字体', 'fontselect'],
  ['字体大小', 'fontsizeselect'],
  ['行高', 'lineheight'],
  ['字间距', 'letterspacing'],
  ['文本颜色', 'forecolor'],
  ['背景色', 'backcolor'],
  ['清除格式', 'removeformat'],
  ['符号列表', 'bullist'],
  ['数字列表', 'numlist'],

  // 对齐相关
  ['左对齐', 'alignleft'],
  ['居中', 'aligncenter'],
  ['右对齐', 'alignright'],
  ['两端对齐', 'alignjustify'],

  // 缩进相关
  ['增加缩进', 'indent'],
  ['减少缩进', 'outdent'],

  // 媒体相关
  ['图片上传', 'uploadimage'],
  ['视频上传', 'uploadVideo'],
  ['附件', 'attachment'],
  ['表格', 'table'],
  ['超链接', 'link'],
  ['解除链接', 'unlink'],
  ['打开链接', 'openlink'],
  ['代码块', 'codesample'],
  ['表情', 'emoticons'],

  // 其他
  ['撤销', 'undo'],
  ['重做', 'redo'],
  ['格式选择', 'styleselect'],
  ['编辑源码', 'code'],
  ['全屏', 'fullscreen'],
  ['帮助', 'help'],
  ['剪切', 'cut'],
  ['复制', 'copy'],
  ['全选', 'selectall'],
  ['统计', 'wordcount']
];

export const toolbarOptions = optionMappings.map(([label, value]) => ({ label, value }));

export const BtnItemDataSetKey = 'data-btn-idx';
