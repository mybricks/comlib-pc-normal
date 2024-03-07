import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { onChange as onChangeForFc } from '../form-container/models/onChange';
import useFormItemInputs from '../form-container/models/FormItem';
import { outputIds } from '../form-container/constants';
import { RuleKeys, defaultRules, validateFormItem } from '../utils/validator';
import ImgModal from './components/ImgModal';
import uploadimage from './plugins/uploadimage';
import { Init, getWindowVal } from './utils';
import { uuid } from '../../utils';
// import { loadPkg } from '../../utils/loadPkg';
import { validateTrigger } from '../form-container/models/validate';
import { EnvContext } from './context';
import { Data, iconType } from './types';

import { Spin, message } from 'antd';
import { renderIconDefinitionToSVGElement } from '@ant-design/icons-svg/es/helpers';
import * as iconsSvg from '@ant-design/icons-svg';

import css from './richText.less';
import { InputIds, OutputIds } from '../types';
import useUpload from './hooks/use-upload';

import './tinymceImports';

// 自定义icon_id
const customIconsId: string = '_pcEditor_customIcons_' + uuid();
const videoIconId: string = '_pcEditor_videoIcon_' + uuid();

const tinymceCDN: string =
  'https://f2.eckwai.com/udata/pkg/eshop/fangzhou/pub/pkg/tinymce/5.7.1/tinymce.min.js';

class Ctx {
  tinymceId!: string;
  tinymceFSId!: string;
}

interface RichTextProps extends RuntimeParams<Data> {
  readonly?: boolean;
}

export default function ({
  data,
  outputs,
  inputs,
  env,
  readonly,
  parentSlot,
  id,
  name,
  logger
}: RichTextProps): JSX.Element {
  const tinymceId = useMemo(() => '_pceditor_tinymce_' + uuid(), []);
  const tinymceFSId = useMemo(() => '_pceditor_tinymceFS_' + uuid(), []);
  const valueRef = useRef('');
  const uploadCb = useRef<any>();
  const validateRelOutputRef = useRef<any>(null);

  const [modalVisible, setModalVisible] = useState(false);
  const [tinymceFSVisble, setTinymceFSVisble] = useState(false);
  const [loading, setLoading] = useState(true);
  const [uploadModel, setUploadModel] = useState<any>({
    title: '上传图片',
    type: 'image',
    url: ''
  });
  const [value, setValue] = useState<any>();

  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const { upload } = useUpload(inputs, outputs);

  useFormItemInputs(
    {
      id: id,
      name: name,
      inputs,
      outputs,
      configs: {
        setValue(val) {
          changeValue(val);
        },
        setInitialValue(val) {
          changeValue(val);
        },
        returnValue(output) {
          output(valueRef.current);
        },
        resetValue() {
          changeValue(void 0);
        },
        setDisabled() {
          data.disabled = true;
        },
        setEnabled() {
          data.disabled = false;
        },
        setIsEnabled(val) {
          if (val === true) {
            data.disabled = false;
          } else if (val === false) {
            data.disabled = true;
          }
        },
        validate(model, outputRels) {
          validateFormItem({
            value: valueRef.current,
            env,
            model,
            rules: data.rules
          })
            .then((r) => {
              const customRule = (data.rules || defaultRules).find(
                (i) => i.key === RuleKeys.CUSTOM_EVENT
              );
              if (customRule?.status) {
                validateRelOutputRef.current = outputRels;
                outputs[outputIds.ON_VALIDATE] && outputs[outputIds.ON_VALIDATE](valueRef.current);
              } else {
                outputRels(r);
              }
            })
            .catch((e) => {
              outputRels(e);
            });
        }
      }
    },
    [value]
  );

  const Load: () => void = useCallback(async () => {
    // 不再使用CDN
    // await loadPkg(tinymceCDN, 'tinyMCE');
    createSvgString(data?.icons || []);
    TinymceInit({
      target: textareaRef.current,
      height: data.style.height!,
      toolbar: data.toolbar?.join(' '),
      isFS: false,
      placeholder: env.i18n(data.placeholder),
      statusbar: data.statusbar
    });
  }, []);

  const attachment_upload_handler = useCallback(
    async (file: File, successCallback, failureCallback, progressCallback) => {
      // TODO progressCallback返回进度函数,需配合后端
      const fileData = {
        file,
        file_name: file.name,
        file_type: file.type
      };

      const uploadFile = async () => {
        if (data.customUpload) {
          return upload(fileData);
        } else if (env?.uploadFile) {
          return env.uploadFile(fileData);
        } else {
          console.error('env.uploadFile未实现');
          throw new Error('无有效的上传方法');
        }
      };

      try {
        const res = await uploadFile().catch((error) => {
          throw new Error(`附件上传失败: ${error.message}`);
        });

        const url = res?.url;
        if (!url) {
          throw new Error('附件上传返回为空');
        }

        successCallback(url);
      } catch (error: any) {
        failureCallback(error.message);
      }
    },
    []
  );

  const TinymceInit: (cfg: {
    selector?: string;
    height: string | number;
    isFS: boolean;
    toolbar: any;
    target: any;
    placeholder: string;
    statusbar: boolean;
  }) => void = useCallback(({ selector, height, isFS, target, statusbar }) => {
    Init({
      readonly,
      target,
      toolbar: data.toolbar?.join(' '),
      selector,
      statusbar,
      height: data.style.height!,
      isFS,
      placeholder: env.i18n(data.placeholder),
      customIconsId,
      setUp: (editor: any) => {
        if (data.toolbar.includes('uploadimage')) {
          uploadCb.current = uploadimage({
            click: (type: string) => {
              switch (type) {
                case 'uploadimage':
                  if (!env.uploadFile && !data.customUpload) {
                    const log = '【富文本输入】： 环境变量 env.uploadFile 方法未实现';
                    message.error(log);
                    logger.error(log);
                    return;
                  }
                  if (env.runtime?.debug) {
                    message.info('请到预览或发布后页面调试效果');
                  } else setModalVisible(true);
                  setUploadModel({
                    title: '上传图片',
                    type: 'image',
                    url: ''
                  });
                  break;
                case 'uploadVideo':
                  if (!env.uploadFile && !data.customUpload) {
                    const log = '【富文本输入】： 环境变量 env.uploadFile 方法未实现';
                    message.error(log);
                    logger.error(log);
                    return;
                  }
                  if (env.runtime?.debug) {
                    message.info('请到预览或发布后页面调试效果');
                  } else setModalVisible(true);
                  setUploadModel({
                    title: '上传视频',
                    type: 'video',
                    url: ''
                  });
                  break;
                case 'customfullscreen':
                  setTinymceFSVisble(true);
                  break;
                case 'customfullscreenexit':
                  setTinymceFSVisble(false);
                  break;
                default:
                  break;
              }
            },
            editor
          });
        }

        editor.on('blur', () => {
          update(false);
        });

        editor.on('input', (e) => {
          change(false);
        });
      },
      initCB: (editor) => {
        //1、设置值
        inputs['setValue']((val, relOutputs) => {
          changeValue(val);
          editor.setContent(valueRef.current || '');
          if (relOutputs['setValueDone']) {
            relOutputs['setValueDone'](val);
          }
          outputs['onChange'](val);
        });
        //2、设置初始值
        inputs['setInitialValue']((val: any, relOutputs) => {
          changeValue(val);
          editor.setContent(valueRef.current || '');
          if (relOutputs['setInitialValueDone']) {
            relOutputs['setInitialValueDone'](val);
          }
          outputs['onInitial'](val);
        });
        //5. 重置值
        inputs['resetValue']((_, relOutputs) => {
          editor.setContent('');
          changeValue(void 0);
          relOutputs['resetValueDone']();
        });
        editor.setContent(valueRef.current || '');
        if (loading) {
          setTimeout(() => {
            setLoading(false);
          }, 50);
        }
      },
      attachment_upload_handler
    });
  }, []);

  const onValidateTrigger = () => {
    validateTrigger(parentSlot, { id: id, name: name });
  };
  //失去焦点
  const update = useCallback((bool) => {
    const tinyMCE = getWindowVal('myTinyMce');
    if (!tinyMCE) return;

    const tinymceInstance =
      tinymceFSVisble || bool ? tinyMCE.editors[tinymceFSId] : tinyMCE.editors[tinymceId];

    const content = tinymceInstance?.getContent({ format: 't' });

    changeValue(content.trim() || '');

    onValidateTrigger();
    outputs['onBlur'](valueRef.current);
  }, []);

  // 值变化
  const changeValue = useCallback((content) => {
    if (content !== undefined && content !== null) {
      setValue(content?.trim());
    }
    valueRef.current = content;
    onChangeForFc(parentSlot, { id: id, name: name, value: content?.trim() });
  }, []);

  //值变化
  const change = useCallback((bool) => {
    const tinyMCE = getWindowVal('myTinyMce');
    if (!tinyMCE) return;

    const tinymceInstance =
      tinymceFSVisble || bool ? tinyMCE.editors[tinymceFSId] : tinyMCE.editors[tinymceId];

    const content = tinymceInstance?.getContent({ format: 't' });

    changeValue(content.trim() || '');

    outputs['onChange'](valueRef.current);
  }, []);

  useEffect(() => {
    Load();
    return () => {
      const tinyMCE = getWindowVal('myTinyMce');
      tinyMCE &&
        [tinymceId, tinymceFSId].forEach((id) => {
          tinyMCE.editors[id]?.remove();
        });
    };
  }, [data.toolbar.join(' '), data.placeholder, data.style, data.icons, data.statusbar]);

  useEffect(() => {
    if (readonly) {
      const isRuntime = !!(env.runtime && !env.runtime.debug);
      const body = isRuntime ? document : document.querySelector('iframe')?.contentDocument;
      const container = body?.getElementById(`p${tinymceId}`);
      const iframeEle = container?.querySelector('iframe');
      const editorEle = container?.querySelector('.tox-editor-container') as HTMLElement;
      if (iframeEle && editorEle) {
        editorEle.style.height = iframeEle.contentDocument?.documentElement.offsetHeight + 'px';
      }
    }
  }, [readonly]);

  useEffect(() => {
    const iframeEl = textareaRef.current?.nextElementSibling?.querySelector(
      'iframe'
    ) as HTMLIFrameElement;
    if (!iframeEl) return;
    const body = iframeEl.contentDocument?.querySelector('body');
    if (!body) return;

    if (data.disabled) {
      body.contentEditable = 'false';
    } else {
      body.contentEditable = 'true';
    }
  }, [data.disabled]);

  const createSvgString = useCallback((Icons: Array<iconType> = []) => {
    const Svg = {};
    if (Icons?.length && Icons?.length > 0) {
      Icons.map(({ icon, name, height, width }) => {
        if (icon && iconsSvg[icon]) {
          Svg[name] =
            renderIconDefinitionToSVGElement(iconsSvg[icon], {
              extraSVGAttrs: {
                width: height || '24',
                height: width || '24',
                fill: 'currentColor'
              }
            }) || '';
        }
      });
    }
    addCustomIcons(Svg);
  }, []);

  const RenderTextArea: JSX.Element = useMemo(() => {
    return (
      <Spin spinning={loading} tip="编辑器加载中...">
        <textarea ref={textareaRef} id={tinymceId} hidden={!loading} />
      </Spin>
    );
  }, [loading]);

  const onModalClose = useCallback(() => {
    setModalVisible(false);
    setUploadModel({});
  }, []);

  const onModalChange = useCallback((params) => {
    setUploadModel((val: any) => ({ ...val, ...params }));
  }, []);

  const onModalOk = useCallback(() => {
    onModalClose();
    uploadCb.current?.setUrl(uploadModel);
  }, [uploadModel]);

  const RenderImgModal: JSX.Element | undefined = useMemo(() => {
    return (
      <ImgModal
        onChange={onModalChange}
        onOk={onModalOk}
        update={update}
        uploadModel={uploadModel}
        onClose={onModalClose}
        visible={modalVisible}
        upload={upload}
        customUpload={data.customUpload}
      />
    );
  }, [modalVisible, uploadModel]);

  const RenderFSTinyMCE: JSX.Element | null = useMemo(() => {
    return tinymceFSVisble ? (
      <div>
        <textarea
          ref={(node) => {
            const tinyMCE = getWindowVal('myTinyMce');
            if (!tinyMCE) return;

            if (!tinyMCE.editors[tinymceFSId]) {
              TinymceInit({
                target: node,
                height: data.style.height!,
                toolbar: data.toolbar.join(' '),
                isFS: true,
                placeholder: env.i18n(data.placeholder),
                statusbar: data.statusbar
              });
            }
          }}
          id={tinymceFSId}
          hidden
          readOnly
          style={data.style}
        />
      </div>
    ) : null;
  }, [tinymceFSVisble]);

  useEffect(() => {
    //3.校验
    inputs['validate']((model, outputRels) => {
      validateFormItem({
        value: valueRef.current,
        env,
        model,
        rules: data.rules
      })
        .then((r) => {
          const customRule = (data.rules || defaultRules).find(
            (i) => i.key === RuleKeys.CUSTOM_EVENT
          );
          if (customRule?.status) {
            validateRelOutputRef.current = outputRels['returnValidate'];
            outputs[OutputIds.OnValidate](valueRef.current);
          } else {
            outputRels['returnValidate'](r);
          }
        })
        .catch((e) => {
          outputRels['returnValidate'](e);
        });
    });

    //4. 获取值
    inputs['getValue']((val, outputRels) => {
      outputRels['returnValue'](valueRef.current);
    });

    //6. 设置禁用
    inputs['setDisabled']((_, relOutputs) => {
      data.disabled = true;
      if (relOutputs['setDisabledDone']) {
        relOutputs['setDisabledDone']();
      }
    });
    //7. 设置启用
    inputs['setEnabled']((_, relOutputs) => {
      data.disabled = false;
      if (relOutputs['setEnabledDone']) {
        relOutputs['setEnabledDone']();
      }
    });

    //设置启用/禁用
    inputs['isEnable']((val, relOutputs) => {
      if (val === true) {
        data.disabled = false;
        if (relOutputs['isEnableDone']) {
          relOutputs['isEnableDone']();
        }
      } else {
        data.disabled = true;
        if (relOutputs['isEnableDone']) {
          relOutputs['isEnableDone']();
        }
      }
    });

    // 设置校验状态
    inputs[InputIds.SetValidateInfo]((info: object, relOutputs) => {
      if (validateRelOutputRef.current) {
        validateRelOutputRef.current(info);
        relOutputs['setValidateInfoDone'](info);
      }
    });
  }, [value]);

  return (
    <EnvContext.Provider value={{ env }}>
      <div
        className={`${css['editor-rich-text']} ${
          readonly ? css['editor-rich-text__readonly'] : ''
        } ${data.disabled ? css['editor-rich-text__disabled'] : ''}`}
        style={data.style}
        id={`p${tinymceId}`}
      >
        {RenderTextArea}
        {RenderImgModal}
        {RenderFSTinyMCE}
      </div>
    </EnvContext.Provider>
  );
}

function addCustomIcons(icons: Record<string, string> = {}): void {
  const tinyMCE = getWindowVal('myTinyMce');
  if (!tinyMCE) return;
  const { IconManager } = tinyMCE;

  IconManager.add(customIconsId, {
    icons: {
      customvideo:
        '<svg t="1651135949047" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2273" width="24" height="24" fill="currentColor"><path d="M912 302.3L784 376V224c0-35.3-28.7-64-64-64H128c-35.3 0-64 28.7-64 64v576c0 35.3 28.7 64 64 64h592c35.3 0 64-28.7 64-64V648l128 73.7c21.3 12.3 48-3.1 48-27.6V330c0-24.6-26.7-40-48-27.7zM712 792H136V232h576v560z m176-167l-104-59.8V458.9L888 399v226z" p-id="2274"></path><path d="M208 360h112c4.4 0 8-3.6 8-8v-48c0-4.4-3.6-8-8-8H208c-4.4 0-8 3.6-8 8v48c0 4.4 3.6 8 8 8z" p-id="2275"></path></svg>',
      fullscreenexit:
        '<svg t="1626167157970" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="85763" width="20" height="20" fill="currentColor"><path d="M400.595 345.365l-0.948-245.022c-0.42-18.881-16.018-30.215-34.956-30.637h-25.406c-18.88-0.42-33.874 16.018-33.457 34.881l1.061 133.251L138.772 72.417c-18.274-18.311-47.844-18.311-66.119 0-18.218 18.314-18.218 47.907 0 66.236l166.575 164.885-127.697 0.512c-18.88-0.477-36.394 12.606-39.26 34.899v24.08c0.477 18.917 16.077 34.558 34.957 34.972l243.826-1.438c0.362 0.035 0.608 0.171 0.928 0.171l17.1 0.378c9.441 0.226 17.9-3.467 23.923-9.593 6.124-6.083 8.382-14.58 8.131-24.078l-1.821-17.138c0.001-0.335 1.27-0.562 1.27-0.945zM766.211 701.451l127.524-0.512c18.88 0.421 36.357-11.183 39.26-33.474v-24.077c-0.478-18.922-16.134-34.558-34.957-35.037l-240.702 1.458c-0.378 0-0.605-0.151-0.967-0.151l-17.062-0.42c-9.441-0.226-17.95 3.469-23.98 9.611-6.159 6.03-8.361 14.559-8.173 24.057l1.881 17.1c0.033 0.42-1.234 0.661-1.234 0.986l0.986 241.248c0.477 18.863 16.078 30.162 34.957 30.576l24.017 0.037c18.827 0.433 33.874-16.055 33.403-34.941l-1.062-130.388 168.117 166.502c18.276 18.314 47.809 18.314 66.085 0 18.255-18.31 18.255-47.906 0-66.218L766.209 701.442zM392.992 618.855c-6.028-6.14-14.541-9.834-23.923-9.61l-17.104 0.42c-0.346 0-0.566 0.151-0.948 0.151l-243.81-1.458c-18.881 0.478-34.503 16.112-34.956 35.034v24.078c2.843 22.292 20.357 33.892 39.206 33.474l129.158 0.42-167.983 166.37c-18.234 18.255-18.234 47.906 0 66.218 18.256 18.314 47.845 18.314 66.102 0l168.137-165.418-1.079 131.185c-0.42 18.922 14.579 35.413 33.424 34.938h25.406c18.937-0.477 34.54-11.713 34.956-30.637l0.987-243.05c0-0.346-1.267-0.571-1.267-0.949l1.821-17.104c0.206-9.495-1.993-18.025-8.116-24.053zM615.434 387.559c6.03 6.123 14.541 9.819 23.965 9.553l17.06-0.378c0.378 0 0.608-0.132 0.986-0.19l244.19 1.457c18.88-0.434 34.482-16.078 34.956-34.994l0.058-24.078c-2.898-22.331-20.439-35.355-39.26-34.939l-129.573-0.511 166.483-164.893c18.31-18.235 18.31-47.83 0.054-66.143-18.276-18.311-47.809-18.311-66.084 0L700.152 238.89l1.079-134.276c0.454-18.863-14.598-35.355-33.424-34.939H643.79c-18.881 0.477-34.484 11.773-34.957 30.637l-0.967 245.075c0 0.378 1.251 0.608 1.251 0.948l-1.859 17.138c-0.192 9.499 2.007 17.991 8.173 24.078z" p-id="85764"></path></svg>', // letterspacing:
      ...(icons || {})
    }
  });
}
