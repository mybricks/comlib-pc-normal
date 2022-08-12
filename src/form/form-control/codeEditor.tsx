import { Spin } from 'antd';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { loadScript, hasScripts } from '../../utils';
import css from '../runtime.less';

const aceEditorCDN =
  'https://ali-ec.static.yximgs.com/udata/pkg/eshop/fangzhou/pub/pkg/ace/1.4.12/ace.min.js';

interface Props {
  config: any;
  value?: any | null | undefined;
  onChange?: (value: any | null | undefined) => void;
}
const CodeEditor = ({ value, onChange, config = {} }: Props) => {
  const {
    maxLines = 6,
    minLines = 3,
    wrap = true,
    showPrintMargin = false,
    indentedSoftWrap = false,
    firstLineNumber = 1,
    readOnly
  } = config as any;
  const ref = useRef();
  const [loading, setLoading] = useState(false);
  const editor = useRef(null);
  const codeEditorInit = () => {
    const ace = getWindowVal('ace');
    if (!ace) return;
    editor.current = ace.edit(ref.current, {
      readOnly,
      autoScrollEditorIntoView: false,
      showPrintMargin,
      maxLines,
      minLines,
      indentedSoftWrap,
      showLineNumbers: true,
      firstLineNumber,
      wrap
    });
    editor.current.session?.on('change', function () {
      onChange(editor.current.getValue());
    });
  };

  const Load = useCallback(async () => {
    if (!hasScripts(aceEditorCDN)) {
      setLoading(true);
      await loadScript(aceEditorCDN, 'aceEditor');
    }
    codeEditorInit();
    setLoading(false);
  }, []);

  useEffect(() => {
    Load();
  }, []);

  useEffect(() => {
    if (editor.current && value !== editor.current.getValue()) {
      editor.current.setValue(value || '');
      editor.current.clearSelection();
    }
  }, [loading, value]);

  return (
    <Spin spinning={loading} wrapperClassName={css.aceCodeEditor}>
      <div
        ref={ref}
        id="form-code-editor"
        style={{ position: 'relative', width: '100%', height: '200px' }}
      />
    </Spin>
  );
};

function getWindowVal(key: string) {
  return (window as any)[key]
}

export default CodeEditor;
