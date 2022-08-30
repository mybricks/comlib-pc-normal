import { runJs, utils } from '@fangzhou/com-utils';

export enum RuleKeys {
  REQUIRED = 'required',
  MIN = 'min',
  MAX = 'max',
  MIN_LENGTH = 'minLength',
  MAX_LENGTH = 'maxLength',
  REG_EXP = 'regExp',
  CODE_VALIDATOR = 'codeValidator'
}

export const defaultValidatorExample = `export default async function (model, context) {
  const item = model.curFormItem;
  if (!model.curValue && ![0, false].includes(model.curValue)) {
    context.failed(\`\${item.label}不能为空\`)
  } else {
    context.success();
  }
}
`

function i18nString(s: string, env: Env, params?) {
  if (params) {
    Object.keys(params).forEach(param => {
      params[param] = i18nString(params[param], env);
    });
    return env.i18n({
      text: s,
      params
    })
  }
  return env.i18n(s);
}

export const ruleFnMap = {
  [RuleKeys.REQUIRED]: ({ type, label, name, value, messageFn, env, message }) => {
    if (!value && ![0, false].includes(value)) {
      return messageFn(i18nString(message, env, { label, name, value }));
    }
    // if (Array.isArray(value) && ['treeSelect', 'cascader', 'tagsSelect', 'multipleSelect', 'checkbox'].includes(type) && value.length < 1) {
    //   return messageFn(i18nString(message, env, { label, name, value }));
    // }
    // if (['dateTimeRangePicker', 'timeRangePicker', 'rangePicker'].includes(type) && (value.some(def => def == null))) {
    //   return messageFn(i18nString(message, env, { label, name, value }));
    // }
    return 'success';
  },
  // [RuleKeys.MIN]: ({ label, name, value, limit, messageFn, success, env, message }) => {
  //   if (typeCheck(value, 'NUMBER') && value < limit) {
  //     return messageFn(i18nString(message, env, { label, limit, name, value }));
  //   }
  //   return 'success';
  // },
  // [RuleKeys.MAX]: ({ label, name, value, limit, messageFn, success, env, message }) => {
  //   if (typeCheck(value, 'NUMBER') && value > limit) {
  //     return messageFn(i18nString(message, env, { label, limit, name, value }));
  //   }
  //   return 'success';
  // },
  // [RuleKeys.MIN_LENGTH]: ({ label, name, value, limit, messageFn, success, env, message }) => {
  //   if (value && value.length < limit) {
  //     return messageFn(i18nString(message, env, { label, limit, name, value }));
  //   }
  //   return 'success';
  // },
  // [RuleKeys.MAX_LENGTH]: ({ label, name, value, limit, messageFn, success, env, message }) => {
  //   if (value && value.length > limit) {
  //     return messageFn(i18nString(message, env, { label, limit, name, value }));
  //   }
  //   return 'success';
  // },
  // [RuleKeys.REG_EXP]: ({ label, name, value, regExr, messageFn, success, env, message }) => {
  //   if ((value || [0, false].includes(value)) && !new RegExp(regExr).test(value)) {
  //     return messageFn(i18nString(message, env, { label, name, value }));
  //   }
  //   return 'success';
  // },
  [RuleKeys.CODE_VALIDATOR]: ({ validateCode, args, env }) => {
    return runJs(validateCode, args, { env });
  },
};