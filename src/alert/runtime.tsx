import React, { useEffect, ReactNode, useMemo } from 'react';
import { Alert } from 'antd';
import {
  CloseOutlined,
  InfoCircleOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  ExclamationCircleOutlined,
  InfoCircleFilled,
  CheckCircleFilled,
  CloseCircleFilled,
  ExclamationCircleFilled
} from '@ant-design/icons';
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

  let iconMap;

  //m-ui和antd图标区别
  if (data.pubType === 'external') {
    iconMap = {
      info: <InfoCircleOutlined />,
      success: <CheckCircleOutlined />,
      error: <CloseCircleOutlined />,
      warning: <ExclamationCircleOutlined />
    };
  } else {
    iconMap = {
      info: <InfoCircleFilled />,
      success: <CheckCircleFilled />,
      error: <CloseCircleFilled />,
      warning: <ExclamationCircleFilled />
    };
  }

  //选择图标样式
  const chooseIcon = ({ icon }: { icon: ReactNode }) => {
    const Icon = Icons && Icons[icon as string]?.render();
    return (
      <div
        style={{
          fontSize: data.isCustom ? data.titleStyle.fontSize : '16px',
          marginRight: '0px'
        }}
      >
        {data.isChoose ? Icon : iconMap[data.type]}
      </div>
    );
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

  let descriptionStyle = useMemo(() => {
    return {
      color: data.showInfo && data.isCustom ? data.descriptionStyle.color : '#434343',
      fontSize: data.showInfo && data.isCustom ? data.descriptionStyle.fontSize : '14px',
      lineHeight: data.showInfo && data.isCustom ? data.descriptionStyle.lineHeight : '22px',
      fontWeight: data.showInfo && data.isCustom ? data.descriptionStyle.fontWeight : 400,
      fontStyle: data.showInfo && data.isCustom ? data.descriptionStyle.fontStyle : 'normal',
      textDecoration:
        data.showInfo && data.isCustom ? data.descriptionStyle.textDecoration : 'normal'
    };
  }, [data.descriptionStyle, data.isCustom]);

  //辅助介绍
  const description = (
    <>
      <div style={descriptionStyle}>
        {data.showInfo && env.i18n(decodeURIComponent(data.content))}
        {data.useContentSlot && slots[SlotIds.DescSlot].render()}
      </div>
    </>
  );

  let messageStyle = useMemo(() => {
    return {
      color: data.isCustom ? data.titleStyle.color : 'rgba(0,0,0,0.85))',
      fontSize: data.isCustom ? data.titleStyle.fontSize : '16px',
      lineHeight: data.isCustom ? data.titleStyle.lineHeight : '25.144px',
      fontWeight: data.isCustom ? data.titleStyle.fontWeight : 400,
      fontStyle: data.isCustom ? data.titleStyle.fontStyle : 'normal',
      textDecoration: data.isCustom ? data.titleStyle.textDecoration : 'normal'
    };
  }, [data.titleStyle, data.isCustom]);

  //标题
  const message = <div style={messageStyle}>{env.i18n(decodeURIComponent(data.message))}</div>;

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
        message={message}
        type={data.type}
        showIcon={data.showIcon}
        //void 0表示去除掉该配置项
        icon={data.showIcon ? chooseIcon({ icon: data.icon }) : void 0}
        action={
          <span style={{ display: data.closable ? '' : 'none' }} onClick={onClose}>
            <CloseOutlined />
          </span>
        }
        description={description}
        banner={data.banner}
      />
    </div>
  );
}
