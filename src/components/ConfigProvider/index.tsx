import React from 'react';
import { ConfigProvider } from 'antd';
import enUS from 'antd/es/locale/en_US';
import zhCN from 'antd/es/locale/zh_CN';
import 'moment/locale/zh-cn';
const LocaleMap = {
  'en-us': enUS,
  'zh-cn': zhCN
};
const LocaleProvider = ({
  locale = 'zh-cn',
  children
}: {
  locale?: keyof typeof LocaleMap;
  children: React.ReactNode;
}) => {
  if (window.moment) {
    window.moment.locale(locale);
  }
  return <ConfigProvider locale={LocaleMap[locale]}>{children}</ConfigProvider>;
};

export default LocaleProvider;
