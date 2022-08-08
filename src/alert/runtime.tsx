import React, { useEffect, ReactNode } from 'react';
import { Alert } from 'antd';
import { CloseOutlined } from '@ant-design/icons';
import * as Icons from '@ant-design/icons';
import { Data, InputIds, SlotIds } from './constants';
import css from './runtime.less';

export default function (props: RuntimeParams<Data>) {
  const { env, inputs, data, logger, slots, style } = props;

  useEffect(() => {
    if (env.runtime) {
      // inputs 输入的参数 赋值
      inputs[InputIds.SetMsg]((val: string) => {
        if (typeof val === 'string') {
          data.message = val;
        } else {
          logger.error(`输入数据非法，输入数据必须是字符串`);
        }
      });
      inputs[InputIds.SetDesc]((val: string) => {
        if (typeof val === 'string') {
          data.showInfo = true;
          data.content = val;
        } else {
          logger.error(`输入数据非法，输入数据必须是字符串`);
        }
      });
    }
  }, []);

  //选择图标样式
  const chooseIcon = ({ icon }: { icon: ReactNode }) => {
    const Icon = Icons && Icons[icon as string]?.render();
    return <>{Icon}</>;
  };

  //改变选择图标的颜色
  const colorObj = {
    info: '#0075ff',
    success: '#27ad60',
    error: '#f93920',
    warning: '#fbbd1b'
  };

  // 关闭警告提示
  const onClose = () => {
    style.display = 'none';
  };

  const description = (
    <>
      <div
        style={{
          color: data.showInfo && data.isColor ? data.textColor : '#434343'
        }}
      >
        {data.showInfo && env.i18n(decodeURIComponent(data.content))}
        {data.useContentSlot && slots[SlotIds.DescSlot].render()}
      </div>
    </>
  );

  return (
    <div
      className={css.container}
      style={{
        width: data.openWidth ? data.width + 'px' : data.percentWidth + '%'
      }}
    >
      <Alert
        style={{
          color: colorObj[data.type]
        }}
        message={env.i18n(decodeURIComponent(data.message))}
        type={data.type}
        showIcon={data.showIcon}
        //void 0表示去除掉该配置项
        icon={
          data.isChoose && data.showIcon
            ? chooseIcon({ icon: data.icon })
            : void 0
        }
        action={
          <span
            style={{ display: data.closable ? '' : 'none' }}
            onClick={onClose}
          >
            <CloseOutlined />
          </span>
        }
        description={description}
        banner={data.banner}
      />
    </div>
  );
}
