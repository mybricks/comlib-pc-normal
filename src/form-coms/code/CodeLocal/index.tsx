import React, { useCallback, useEffect, useRef, forwardRef, useImperativeHandle } from 'react';
import { EditorProps } from './types';
import './ace-pkg/ace';
import './ace-pkg/ext-language_tools';
import './ace-pkg/ext-beautify';
import './ace-pkg/webpack-resolver';
import './beautify/java-formatter.min.js';
import './beautify/sql-formatter.min.js';
import './ace-pkg/css/ace.css';
import css from './index.less';

const Formatter = {
  sql: {
    exportName: 'sqlFormatter',
    Fn: (val) => window['sqlFormatter']?.format?.(val) || val
  },
  json: {
    Fn: (val) => {
      try {
        const json = eval(`(${val})`);
        return JSON.stringify(json, null, 2);
      } catch (e) {}
      return val;
    }
  },
  java: {
    exportName: 'js_beautify',
    Fn: (val) => (window['js_beautify'] ? window['js_beautify'](val) : val)
  }
};

const CodeEditor = (
  { value, config, valueRef, readOnly, onChange = () => {}, onBlur = () => {} }: EditorProps,
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

  // 格式化代码逻辑
  const formatterCode = async (val) => {
    if (Formatter[language]) {
      const { Fn } = Formatter[language];
      editor.current?.setValue(Fn(val));
    } else {
      editor.current?.setValue(val);
      supportFormat && beautifyRef.current?.beautify?.(editor.current?.session);
    }
  };

  const createEditor = () => {
    if (!containerRef.current) return;
    const editor = window.ace.edit(containerRef.current, {
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
      enableSnippets: true,
      enableLiveAutocompletion: true,
      enableBasicAutocompletion: true,
      fontSize: fontSize || 14,
      theme: 'ace/theme/xcode'
    });
    editor.session.on('change', () => {
      onChange(editor.getValue());
    });
    editor.session.setUseWorker(false);
    beautifyRef.current = window.ace.require('ace/ext/beautify');
    editor.commands.addCommand({
      name: '代码格式化',
      bindKey: { win: 'Shift-Alt-F', mac: 'Shift-Alt-F' },
      exec: function () {
        formatterCode(valueRef.current);
      },
      readOnly
    });
    return editor;
  };

  useEffect(() => {
    editor.current = createEditor();
  }, []);

  // 点击事件
  const onClick = useCallback(() => {
    formatterCode(valueRef.current);
  }, [value]);

  // 粘贴事件
  const onPaste = useCallback(() => {
    // 自动格式化，让部分用户以为是bug
    // supportFormat && beautifyRef.current.beautify(editor.current.session);
  }, []);

  const _onBlur = () => {
    const value = editor.current.getValue();
    onBlur(value);
  };

  useEffect(() => {
    const { language, ...options } = config ?? {};
    editor.current?.setOptions({ ...options, readOnly });
  }, [config, readOnly]);

  useEffect(() => {
    editor.current?.setReadOnly(readOnly);
  }, [readOnly]);

  useEffect(() => {
    if (editor.current && valueRef.current !== editor.current.getValue()) {
      const val =
        'string' === typeof valueRef.current
          ? valueRef.current
          : valueRef.current === undefined || valueRef.current === null
          ? ''
          : JSON.stringify(valueRef.current);
      supportFormat && formatterCode(val);
      editor.current.clearSelection();
    }
  }, [value]);

  return (
    <div className={css.aceCodeEditor}>
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
    </div>
  );
};

export default forwardRef<any, EditorProps>(CodeEditor);

export type { AceConfig } from './types';
