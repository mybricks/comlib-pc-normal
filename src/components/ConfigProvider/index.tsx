import React, { ReactNode, useMemo } from 'react';
import { ConfigProvider } from 'antd';
const localeMap = window.antd.locale;
const LocaleProvider = ({
  locale = 'zh-cn',
  children,
  ...rest
}: {
  locale?: keyof typeof localeMap;
  children: React.ReactNode;
  renderEmpty?: (componentName?: string | undefined) => ReactNode;
}) => {
  if (window.moment) {
    window.moment.locale(locale as string);
  }
  const antdLocaleKey = useMemo(() => {
    const localeArr = locale.split('-');
    if (localeArr.length <= 1) {
      return locale;
    }
    const lang = localeArr.pop()?.toUpperCase();
    return localeArr.concat(['_', lang as string]).join('');
  }, [locale]);

  // 如果是英文，传入undefined，使用antd默认的英文包
  const localLib = [`'en_US'`, `en`].includes(antdLocaleKey)
    ? undefined
    : localeMap?.[antdLocaleKey] || localeMap?.['zh_CN'];
  return (
    <ConfigProvider locale={localLib?.default} {...rest}>
      {children}
    </ConfigProvider>
  );
};

export default LocaleProvider;
