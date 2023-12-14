import { typeCheck } from '../../utils';
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
  PHONE_NUMBER_VALIDATOR = 'phoneNumberValidator',
  CUSTOM_EVENT = 'customEvent'
}

export const defaultValidatorExample =
  encodeURIComponent(`export default async function (value, context) {
  if (!value && ![0, false].includes(value)) {
    context.failed(\`内容不能为空\`);
  } else {
    context.successed();
  }
}
`);

const REQUIRED_RULE = {
  key: RuleKeys.REQUIRED,
  status: false,
  visible: true,
  title: '必填',
  message: '内容不能为空'
};
const REG_EXP_RULE = {
  key: RuleKeys.REG_EXP,
  status: false,
  visible: true,
  title: '正则校验',
  message: '内容不能为空',
  regExr: `^(?!(null|undefined|)$).+`
};
const LENGTH_RULE = [
  {
    key: RuleKeys.MIN_LENGTH,
    status: false,
    visible: true,
    title: '最小长度校验',
    message: '内容长度不能小于指定值',
    limitMinLength: [2]
  },
  {
    key: RuleKeys.MAX_LENGTH,
    status: false,
    visible: true,
    title: '最大长度校验',
    message: '内容长度不能大于指定值',
    limitMaxLength: [1000]
  }
];
const VALUE_RULE = [
  {
    key: RuleKeys.MIN,
    status: false,
    visible: true,
    title: '最小值校验',
    message: '不能小于指定值',
    limitMinValue: [0]
  },
  {
    key: RuleKeys.MAX,
    status: false,
    visible: true,
    title: '最大值校验',
    message: '不能大于指定值',
    limitMaxValue: [10000]
  }
];
const CUSTOM_RULE = [
  {
    key: RuleKeys.CODE_VALIDATOR,
    status: false,
    visible: true,
    title: '代码校验',
    validateCode: defaultValidatorExample
  },
  {
    key: RuleKeys.CUSTOM_EVENT,
    status: false,
    visible: true,
    title: '自定义校验'
  }
];

export const defaultRules = [REQUIRED_RULE, ...CUSTOM_RULE];

export const ExpRules = [REQUIRED_RULE, REG_EXP_RULE, ...CUSTOM_RULE];

export const LengthRules = [REQUIRED_RULE, ...LENGTH_RULE, REG_EXP_RULE, ...CUSTOM_RULE];

export const ValueRules = [
  REQUIRED_RULE,
  ...LENGTH_RULE,
  ...VALUE_RULE,
  REG_EXP_RULE,
  ...CUSTOM_RULE
];

export const showMessage = (key: RuleKeys) =>
  [RuleKeys.REQUIRED, RuleKeys.REG_EXP, RuleKeys.MIN_LENGTH, RuleKeys.MAX_LENGTH].includes(key);

export const mergeRules = (newRules: any[], oldRules: any[]) => {
  if (!oldRules?.length || oldRules?.length < 1) {
    return newRules;
  }
  return [...newRules, ...oldRules].reduce((result, rule1) => {
    const existingRule = result.find((rule2) => rule2?.key === rule1?.key);

    if (existingRule) {
      // 如果找到相同 key 的规则，用当前规则替换掉已存在的规则
      result = result.map((rule) => (rule.key === rule1.key ? rule1 : rule));
    } else {
      // 如果找不到相同 key 的规则，将当前规则添加到结果中
      result.push({ _id: rule1.key, ...rule1 });
    }

    return result;
  }, []);
};

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
  [RuleKeys.REQUIRED]: ({ value, message, failed, successed, env }) => {
    if (!value && ![0, false].includes(value)) {
      return failed(env.i18n(message));
      // return messageFn(i18nString(message, env, { label, name, value }));
    }
    // hack
    if (Array.isArray(value) && value.length < 1) {
      return failed(env.i18n(message));
    }
    // if (Array.isArray(value) && ['treeSelect', 'cascader', 'tagsSelect', 'multipleSelect', 'checkbox'].includes(type) && value.length < 1) {
    //   return messageFn(i18nString(message, env, { label, name, value }));
    // }
    // if (['dateTimeRangePicker', 'timeRangePicker', 'rangePicker'].includes(type) && (value.some(def => def == null))) {
    //   return messageFn(i18nString(message, env, { label, name, value }));
    // }
    return successed();
  },
  [RuleKeys.MIN]: ({ value, message, failed, successed, env, limitMinValue }) => {
    if (typeCheck(value, 'NUMBER') && value < limitMinValue) {
      return failed(env.i18n(message));
    }
    return successed();
  },
  [RuleKeys.MAX]: ({ value, message, failed, successed, env, limitMaxValue }) => {
    if (typeCheck(value, 'NUMBER') && value > limitMaxValue) {
      return failed(env.i18n(message));
    }
    return successed();
  },
  [RuleKeys.MIN_LENGTH]: ({ value, message, failed, successed, env, limitMinLength }) => {
    if (value && value?.toString().length < limitMinLength) {
      return failed(env.i18n(message));
    }
    return successed();
  },
  [RuleKeys.MAX_LENGTH]: ({ value, message, failed, successed, env, limitMaxLength }) => {
    if (value && value?.toString().length > limitMaxLength) {
      return failed(env.i18n(message));
    }
    return successed();
  },
  [RuleKeys.REG_EXP]: ({ value, message, failed, successed, env, regExr }) => {
    if (!new RegExp(regExr).test(value)) {
      return failed(env.i18n(message));
    }
    return successed();
  },
  [RuleKeys.CODE_VALIDATOR]: ({ validateCode, args, env }) => {
    return runJs(validateCode, args, { env });
  },
  [RuleKeys.Email_VALIDATOR]: ({ value, message, failed, successed, env }) => {
    let reg = new RegExp(`^[A-Za-z0-9\u4e00-\u9fa5]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$`);
    if (value && !reg.test(value)) {
      return failed(env.i18n(message));
    }
    return successed();
  },
  [RuleKeys.PHONE_NUMBER_VALIDATOR]: ({ value, message, failed, successed, env }) => {
    let reg = new RegExp(`^1\\d{10}$`);
    if (value && !reg.test(value)) {
      return failed(env.i18n(message));
    }
    return successed();
  }
};

export function validateFormItem({ value, model, env, rules }) {
  const curRule = (rules || defaultRules).filter(
    (item) => item.status && item.key !== RuleKeys.CUSTOM_EVENT
  );

  return new Promise((resolve, reject) => {
    Promise.all(
      curRule.map((item) => {
        return new Promise((res, rej) => {
          const validateFn = {
            successed: () => res('success'),
            failed: (msg: string) => rej(msg)
          };

          ruleFnMap[item.key]({
            value,
            env,
            args: [
              value,
              {
                model,
                ...validateFn
              }
            ],
            validateCode: item.validateCode,
            message: item.message,
            regExr: item?.regExr,
            limitMinLength: item?.limitMinLength && item?.limitMinLength[0],
            limitMaxLength: item?.limitMaxLength && item?.limitMaxLength[0],
            limitMinValue: item?.limitMinValue && item?.limitMinValue[0],
            limitMaxValue: item?.limitMaxValue && item?.limitMaxValue[0],
            ...validateFn
          });
        });
      })
    )
      .then((r) => {
        resolve({
          validateStatus: 'success'
        });
      })
      .catch((e) => {
        reject({
          validateStatus: 'error',
          help: e
        });
      });
  });
}

export const getTitle = (item: any, index: number) => {
  const { key, title, limitMinLength, limitMaxLength, limitMinValue, limitMaxValue } = item;
  switch (key) {
    case RuleKeys.MIN_LENGTH:
      return `${title}-最小长度: ${limitMinLength}`;
    case RuleKeys.MAX_LENGTH:
      return `${title}-最大长度: ${limitMaxLength}`;
    case RuleKeys.MIN:
      return `${title}-最小值: ${limitMinValue}`;
    case RuleKeys.MAX:
      return `${title}-最大值: ${limitMaxValue}`;
    default:
      return title;
  }
};
