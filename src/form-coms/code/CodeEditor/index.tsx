import React, {
  useCallback,
  useEffect,
  useRef,
  useState,
  forwardRef,
  useImperativeHandle,
  useMemo
} from 'react';
import { Spin } from 'antd';
import { getWindowVal } from '../../../utils/getWindowVal';
import { loadPkg, loadStylesheet } from '../../../utils/loadPkg';
import { EditorProps } from './types';
import { baseUrl } from './assets';
import css from './index.less';

const Formatter = {
  sql: {
    cdn: `${baseUrl}/sql-formatter/7.0.2/sql-formatter.min.js`,
    exportName: 'sqlFormatter',
    Fn: (val) => window['sqlFormatter']?.format?.(val) || val
  },
  json: {
    Fn: (val) => {
      try {
        const temp = JSON.parse(val);
        return JSON.stringify(temp, null, '\t');
      } catch (e) {}
      return val;
    }
  },
  java: {
    cdn: `${baseUrl}/ace/beautify/js-beautify/1.14.4/beautify.min.js`,
    exportName: 'js_beautify',
    Fn: (val) => (window['js_beautify'] ? window['js_beautify'](val) : val)
  }
};

const getAssetsCDN = (language: string) => {
  const aceEditorCDN = `${baseUrl}/ace/1.4.12/ace.min.js`;
  const languageToolsCDN = `${baseUrl}/ace/1.4.12/ext-language_tools.js`;
  const aceLanguageCDN = `${baseUrl}/ace/1.4.12/mode-${language}.js`;
  const extBeautifyCDN = `${baseUrl}/ace/1.4.12/ext-beautify.js`;
  const styleSheetCDN = `https://f2.beckwai.com/udata/pkg/eshop/fangzhou/pub/pkg/ace/ace-builds/1.4.13/ace.min.css`;
  return {
    aceEditorCDN,
    languageToolsCDN,
    aceLanguageCDN,
    extBeautifyCDN,
    styleSheetCDN
  };
};

const CodeEditor = (
  { value, config, readOnly, onChange = () => {}, onBlur = () => {} }: EditorProps,
  ref: any
) => {
  const {
    placeholder = '请输入代码',
    maxLines = 6,
    minLines = 3,
    wrap = true,
    showPrintMargin = false,
    indentedSoftWrap = false,
    firstLineNumber = 0,
    language = 'text',
    fontSize
  } = config || {};

  const containerRef = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState(false);
  const editor = useRef<any>(null);
  const beautifyRef = useRef<any>();
  const supportFormat = ['html', 'javascript', 'css', 'json', 'sql', 'java'].includes(language);

  useImperativeHandle(
    ref,
    () => ({
      editor: editor.current
    }),
    []
  );

  const { aceEditorCDN, languageToolsCDN, aceLanguageCDN, extBeautifyCDN, styleSheetCDN } = useMemo(
    () => getAssetsCDN(language),
    [language]
  );

  // 格式化代码逻辑
  const formatterCode = async () => {
    if (Formatter[language]) {
      const { cdn, exportName, Fn } = Formatter[language];
      if (cdn) {
        await loadPkg(cdn, exportName);
      }
      editor.current?.setValue(Fn(editor.current?.getValue()));
    } else {
      supportFormat && beautifyRef.current?.beautify?.(editor.current?.session);
    }
  };

  const codeEditorInit = () => {
    const ace = getWindowVal('ace');
    if (!ace) return;
    ace.config.set('basePath', `${baseUrl}/ace/1.4.12`);
    editor.current = ace.edit(containerRef.current, {
      placeholder,
      readOnly,
      autoScrollEditorIntoView: false,
      showPrintMargin,
      maxLines,
      minLines,
      indentedSoftWrap,
      showLineNumbers: true,
      firstLineNumber,
      wrap,
      mode: `ace/mode/${language}`,
      enableBasicAutoCompletion: true,
      enableLiveAutocompletion: true,
      fontSize: fontSize || 14
    });

    editor.current.session?.setUseWorker(false);

    editor.current.session?.on('change', function () {
      onChange(editor.current.getValue());
    });

    beautifyRef.current = ace.require('ace/ext/beautify');
    // 自定义格式化快捷键
    editor.current.commands.addCommand({
      name: '代码格式化',
      bindKey: { win: 'Shift-Alt-F', mac: 'Shift-Alt-F' },
      exec: function () {
        formatterCode();
      },
      readOnly: false
    });
  };

  // 点击事件
  const onClick = useCallback(() => {
    formatterCode();
  }, []);

  // 粘贴事件
  const onPaste = useCallback(() => {
    // 自动格式化，让部分用户以为是bug
    // supportFormat && beautifyRef.current.beautify(editor.current.session);
  }, []);

  const _onBlur = () => {
    const value = editor.current.getValue();
    onBlur(value);
  };

  const Load = useCallback(async () => {
    const shadowRoot = document.getElementById('_mybricks-geo-webview_')?.shadowRoot;
    setLoading(true);
    await loadStylesheet(styleSheetCDN, shadowRoot);
    await loadPkg(aceEditorCDN, 'ace');
    if (language !== 'text') {
      await loadPkg(aceLanguageCDN, 'aceLanguage');
      await loadPkg(languageToolsCDN, 'aceLanguageTools');
    }
    if (supportFormat) {
      await loadPkg(extBeautifyCDN, 'extBeautify');
    }
    codeEditorInit();
    setLoading(false);
  }, []);

  useEffect(() => {
    Load();
  }, []);

  useEffect(() => {
    editor.current?.setOptions(config);
  }, [config]);

  useEffect(() => {
    editor.current?.setReadOnly(readOnly);
  }, [readOnly]);

  useEffect(() => {
    if (editor.current && value !== editor.current.getValue() && !loading) {
      const val =
        'string' === typeof value
          ? value
          : value === undefined || value === null
          ? ''
          : JSON.stringify(value);
      editor.current.setValue(val);
      editor.current.clearSelection();
      supportFormat && beautifyRef.current.beautify(editor.current.session);
    }
  }, [loading, value]);

  return (
    <Spin spinning={loading} wrapperClassName={css.aceCodeEditor}>
      <div ref={containerRef} id="form-code-editor" onPaste={onPaste} onBlur={_onBlur} />
      {supportFormat && value && (
        <div className={css.formatIcon} title="点击格式化" onClick={onClick}>
          <svg
            viewBox="0 0 1024 1024"
            version="1.1"
            xmlns="http://www.w3.org/2000/svg"
            p-id="3767"
            width="100%"
            height="100%"
          >
            <defs>
              <style type="text/css"></style>
            </defs>
            <path
              fill="#555555"
              d="M607.456 302.88c13.024 8.672 18.24 21.44 13.696 33.44l-156.288 410.56c-4.576 12-18.208 21.44-35.808 24.768-17.6 3.328-36.416 0-49.44-8.64-13.024-8.704-18.24-21.44-13.696-33.472l156.288-410.56c4.576-12.032 18.24-21.44 35.808-24.8 17.6-3.296 36.448 0 49.44 8.704z m103.52-33.312a45.92 45.92 0 0 1 65.824 0.704l201.504 209.248c8.736 8.96 13.664 21.248 13.696 34.08 0 12.864-4.864 25.152-13.504 34.112l-201.6 210.88c-18.144 18.752-47.2 19.168-65.792 0.896a48.96 48.96 0 0 1-14.496-34.304 49.056 49.056 0 0 1 13.504-34.688l168.896-176.704-168.704-175.168a48.768 48.768 0 0 1-13.344-28.224l-0.32-6.464a48.96 48.96 0 0 1 14.336-34.368z m-463.808 0.704a45.888 45.888 0 0 1 65.856-0.704c9.024 8.928 14.24 21.312 14.368 34.368 0.128 13.056-4.832 25.6-13.664 34.624L144.96 513.792l168.896 176.704c7.36 7.616 11.936 17.6 13.184 28.256l0.32 6.464a48.96 48.96 0 0 1-14.464 34.272 45.92 45.92 0 0 1-65.856-0.96l-201.44-210.784A49.056 49.056 0 0 1 32 513.6c0-12.832 4.96-25.12 13.632-34.048z"
              p-id="3768"
            ></path>
          </svg>
        </div>
      )}
    </Spin>
  );
};

export default forwardRef<any, EditorProps>(CodeEditor);

export type { AceConfig } from './types';
