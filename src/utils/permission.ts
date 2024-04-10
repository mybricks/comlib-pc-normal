

/**
 * 获取没有权限时组件要做的操作
 * 返回值如下：
 *  1. hide: 隐藏
 *  2. disable: 禁用
 *  3. none: 什么都不用做
 * @param id 权限ID
 * @returns 没有权限时需要做的事情吗，如果有权限返回 none
 */
export const getWhatToDoWithoutPermission = (configPermission: ConfigPermission | undefined, env: Env): {
  type: 'none' | 'hide' | 'hintLink',
  hintLinkUrl?: string;
  hintLinkTitle?: string
} => {
  if (!configPermission) return { type: 'none' };

  if (!env.runtime || !configPermission?.id) return { type: 'none' };
  const res = env?.hasPermission(configPermission?.id) ?? true;
  if (res === true) return { type: 'none' };

  const dynamicPermission = (() => {
    // 到这步为止，将所有 bool 类型的 hasPermission 返回值处理干净
    if (res === false) {
      return {
        permission: false,
        type: configPermission.registerData?.noPrivilege,
        hintLinkUrl: configPermission.hintLink,
        hintLinkTitle: configPermission.registerData?.title
      } as DynamicPermission;
    }
    return res as DynamicPermission;
  })();

  if (dynamicPermission.permission) return { type: 'none' };

  if (dynamicPermission.type === 'hide') return { type: 'hide' };

  if (dynamicPermission.type === 'hintLink') {
    return {
      type: 'hintLink',
      hintLinkUrl: dynamicPermission.hintLinkUrl || configPermission.hintLink,
      hintLinkTitle: dynamicPermission.hintLinkTitle || configPermission.registerData?.title,
    }
  }

  return { type: 'hide' };
};
