import React, { CSSProperties } from 'react';
import { useComputed, useObservable } from '@mybricks/rxui';
import RichText, { ModalCtx } from './richText';
/**
 * 数据源
 * @param content 富文本编辑器提供的内容
 */
export interface Data {
  style: CSSProperties;
  displayEditbar?: boolean;
  toolbar: string;
}

export default function ({
  env,
  data,
  inputs,
  outputs,
  logger,
}: RuntimeParams<Data>) {
  inputs['submit'](() => {
    outputs['submit'](modalCtx.content);
  });

  const modalCtx = useObservable(ModalCtx, (next) =>
    next({
      loading: true,
      imgUrl: void 0,
      editor: void 0,
      imgVisible: false,
      Uploadimage: void 0,
      tinymceFSVisble: false,
      content: '',
      modal: {}
    })
  );

  modalCtx.toolbar = data.toolbar;

  const editContent = useComputed(() => {
    return (
      <RichText
        readonly={false}
        data={data}
        modalCtx={modalCtx}
        outputs={outputs}
        inputs={inputs}
        logger={logger}
        env={env}
      />
    );
  });

  if (data.displayEditbar) {
    modalCtx.content = '';
    return editContent;
  }
  modalCtx.toolbar = []
  modalCtx.content = env.runtime ? '<div style="display: none;"/>' : `<p style="font-size: 16px"></p>`;

  return (
    <RichText
      readonly
      data={data}
      modalCtx={modalCtx}
      outputs={outputs}
      inputs={inputs}
      logger={logger}
      env={env}
    />
  );
}
