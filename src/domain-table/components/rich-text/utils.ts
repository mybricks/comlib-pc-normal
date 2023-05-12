interface InitProps {
  readonly?: boolean;
  isFS: boolean;
  selector: string;
  customIconsId: string;
  height: number | string;
  toolbar: string;
  target: any;
  setUp: (...angs: any) => void;
  initCB: (...angs: any) => void;
  placeholder: string;
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
  initCB
}: InitProps) {
  const tinyMCE = getWindowVal('tinyMCE');
  if (!tinyMCE) return;
	
  const plugins: string[] = [
    'table',
    'link',
    'paste',
    'fullpage',
    'nonbreaking',
    'lists',
    'wordcount'
  ];

  tinyMCE.init({
    selector,
    target,
    height,
    menubar: false,
    branding: false,
    statusbar: false,
    icons: (window as any).tinyMCE?.IconManager.has(customIconsId)
      ? customIconsId
      : '',
    plugins,
    toolbar,
    fontsize_formats: '12px 14px 16px 18px 20px 24px 36px 48px 56px 72px',
    fullpage_default_font_size: '12px',
    nonbreaking_force_tab: true,
    skin: `oxide`,
    theme: 'silver',
    setup: setUp,
    init_instance_callback: function (editor) {
      initCB && initCB(editor);
    },
    readonly,
    content_style: readonly
      ? `p {margin: 0px; border:0px ; padding: 0px;} .mce-content-readonly {margin: 0px;}`
      : `p {margin: 0px; border:0px ; padding: 0px;}`,
    placeholder
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
