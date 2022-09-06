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

export const defaultValidatorExample = `export default async function (value, context) {
  if (!value && ![0, false].includes(value)) {
    context.failed(\`内容不能为空\`);
  } else {
    context.successed();
  }
}
`

export const defaultRules = [
  {
    key: RuleKeys.REQUIRED,
    status: false,
    visible: true,
    title: '必填',
    message: '内容不能为空',
  },
  {
    key: RuleKeys.CODE_VALIDATOR,
    status: false,
    visible: true,
    title: '代码校验',
    validateCode: defaultValidatorExample
  }
]

// function i18nString(s: string, env: Env, params?) {
//   if (params) {
//     Object.keys(params).forEach(param => {
//       params[param] = i18nString(params[param], env);
//     });
//     return env.i18n({
//       text: s,
//       params
//     })
//   }
//   return env.i18n(s);
// }

export const ruleFnMap = {
  [RuleKeys.REQUIRED]: ({ value, message, failed, successed }) => {
    if (!value && ![0, false].includes(value)) {
      return failed(message)
      // return messageFn(i18nString(message, env, { label, name, value }));
    }
    // if (Array.isArray(value) && ['treeSelect', 'cascader', 'tagsSelect', 'multipleSelect', 'checkbox'].includes(type) && value.length < 1) {
    //   return messageFn(i18nString(message, env, { label, name, value }));
    // }
    // if (['dateTimeRangePicker', 'timeRangePicker', 'rangePicker'].includes(type) && (value.some(def => def == null))) {
    //   return messageFn(i18nString(message, env, { label, name, value }));
    // }
    return successed()
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

export function validateFormItem ({ value, env, rules }) {
  const curRule = rules.filter(item => item.status) 

  return new Promise((resolve, reject) => {
    Promise.all(curRule.map(item => {
      return new Promise((res, rej) => {
        const validateFn = {
          successed: () => res('success'),
          failed: (msg: string) => rej(msg)
        }

        ruleFnMap[item.key]({
          value,
          env,
          args: [
            value, 
            {
              ...env,
              ...validateFn
            }
          ],
          validateCode: item.validateCode,
          message: item.message,
          ...validateFn
        })
      })
    })).then(r => {
      resolve({
        validateStatus: 'success'
      })
    }).catch(e => {
      reject({
        validateStatus: 'error',
        help: e
      })
    })
  })
}