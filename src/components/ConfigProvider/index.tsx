import React, { useMemo } from 'react';
import { ConfigProvider } from 'antd';
const localeMap = window.antd.locale;
const LocaleProvider = ({
  locale = 'zh-cn',
  children,
  ...rest
}: {
  locale?: keyof typeof localeMap;
  children: React.ReactNode;
}) => {
  if (window.moment) {
    window.moment.locale(locale as string);
  }
  const antdLocaleKey = useMemo(() => {
    const localeArr = locale.split('-');
    const lang = localeArr.pop()?.toUpperCase();
    return localeArr.concat(['_', lang as string]).join('');
  }, [locale]);

  const localLib = localeMap?.[antdLocaleKey] || localeMap?.['zh_CN'];
  return (
    <ConfigProvider locale={localLib?.default} {...rest}>
      {children}
    </ConfigProvider>
  );
};

export default LocaleProvider;
