import { runJs } from '../../../package/com-utils';

export enum RuleKeys {
  REQUIRED = 'required',
  MIN = 'min',
  MAX = 'max',
  MIN_LENGTH = 'minLength',
  MAX_LENGTH = 'maxLength',
  REG_EXP = 'regExp',
  CODE_VALIDATOR = 'codeValidator',
  Email_VALIDATOR = 'emailValidator',
  PHONE_NUMBER_VALIDATOR = 'phoneNumberValidator'
}

export const defaultValidatorExample = encodeURIComponent(`export default async function (value, context) {
  if (!value && ![0, false].includes(value)) {
    context.failed(\`内容不能为空\`);
  } else {
    context.successed();
  }
}
`)

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
    // hack
    if (Array.isArray(value) && value.length < 1) {
      return failed(message)
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
  [RuleKeys.Email_VALIDATOR]: ({ value, message, failed, successed }) => {
    let reg = new RegExp("^[A-Za-z0-9\u4e00-\u9fa5]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$");
    if (!reg.test(value)) {
      return failed(message)
    }
    return successed()
  },
  [RuleKeys.PHONE_NUMBER_VALIDATOR]: ({ value, message, failed, successed }) => {
    let reg = new RegExp("^1\\d{10}$");
    if (!reg.test(value)) {
      return failed(message)
    }
    return successed()
  },
};

export function validateFormItem({ value, env, rules }) {
  const curRule = (rules || defaultRules).filter(item => item.status)

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

export const getTitle = (item: any, index: number) => {
  const { key, title, numericalLimit, regExr } = item;
  return title;
};