export const getFilterSelector = (id: string) => `:not(#{id} *[data-isslot="1"] *)`;

export const getFilterSelectorWithId = (id: string) => `:not(#${id} *[data-isslot="1"] *)`;

export const getLegacyDeclaredStyle = (
  getDeclaredStyle: UpgradeParams<any>['getDeclaredStyle'],
  selectors: string[]
) => {
  const legacyStyles = selectors.map((selector) => getDeclaredStyle(selector));
  return legacyStyles.find((ret) => !!ret && !!ret.css);
};
