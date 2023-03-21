import {FieldBizType, FieldDBType} from "./constants";
import {Field} from "./type";
import {defaultValidatorExample} from "../form-coms/utils/validator";
import {runJs} from "../../package/com-utils";

export enum RuleKeys {
	REQUIRED = 'required',
	MIN = 'min',
	MAX = 'max',
	MIN_LENGTH = 'minLength',
	MAX_LENGTH = 'maxLength',
	REG_EXP = 'regExp',
	CODE_VALIDATOR = 'codeValidator',
	EMAIL_VALIDATOR = 'emailValidator',
	PHONE_NUMBER_VALIDATOR = 'phoneNumberValidator',
	HREF_VALIDATOR = 'hrefValidator',
}

export const RuleMap = {
	[RuleKeys.REQUIRED]: (field: Field, rule: RuleItemType) => {
		return () => ({
			validator(_, value) {
				if ((field.dbType === FieldDBType.BIGINT && typeof value === 'number') || !!value) {
					return Promise.resolve();
				}
				return Promise.reject(new Error(rule.message));
			},
		});
	},
	[RuleKeys.EMAIL_VALIDATOR] : (field: Field, rule: RuleItemType) => {
		return () => ({
			validator(_, value) {
				const reg = new RegExp("^[A-Za-z0-9\u4e00-\u9fa5]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$");
				if (!reg.test(value)) {
					return Promise.reject(new Error(rule.message));
				}
				return Promise.resolve();
			},
		});
	},
	[RuleKeys.HREF_VALIDATOR] : (field: Field, rule: RuleItemType) => {
		return () => ({
			validator(_, value) {
				if (!/^(https?:\/\/)|(www\.)/gi.test(value)) {
					return Promise.reject(new Error(rule.message));
				}
				return Promise.resolve();
			},
		});
	},
	[RuleKeys.PHONE_NUMBER_VALIDATOR] : (field: Field, rule: RuleItemType) => {
		return () => ({
			validator(_, value) {
				const reg = new RegExp("^1\\d{10}$");
				if (!reg.test(value)) {
					return Promise.reject(new Error(rule.message));
				}
				return Promise.resolve();
			},
		});
	},
	[RuleKeys.CODE_VALIDATOR] : (field: Field, rule: RuleItemType) => {
		return () => ({
			validator(_, value) {
				return new Promise((resolve, reject) => {
					const env = { failed: reject, successed: resolve };
					runJs(rule.validateCode, [value, env], { env });
				});
			},
		});
	},
};

type RuleItemType = {
	key: RuleKeys;
	status: boolean;
	visible: boolean;
	title: string;
	message: string;
	validateCode?: string;
}

export const RuleMapByBizType = {
	[FieldBizType.STRING]: [
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
	],
	[FieldBizType.NUMBER]: [
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
	],
	[FieldBizType.DATETIME]: [
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
	],
	[FieldBizType.HREF]: [
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
		},
		{
			key: RuleKeys.HREF_VALIDATOR,
			status: true,
			visible: false,
			title: '超链接校验',
			message: '超链接不符合格式要求'
		}
	],
	[FieldBizType.PHONE]: [
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
		},
		{
			key: RuleKeys.PHONE_NUMBER_VALIDATOR,
			status: true,
			visible: false,
			title: '手机号码校验',
			message: '手机号码不符合格式要求'
		}
	],
	[FieldBizType.EMAIL]: [
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
		},
		{
			key: RuleKeys.EMAIL_VALIDATOR,
			status: true,
			visible: false,
			title: '邮箱校验',
			message: '邮箱不符合格式要求'
		}
	],
	[FieldBizType.IMAGE]: [
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
	],
	[FieldBizType.APPEND_FILE]: [
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
	],
	[FieldBizType.RADIO]: [
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
	],
	[FieldBizType.CHECKBOX]: [
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
	],
	[FieldBizType.RELATION]: [
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
	],
	[FieldBizType.SYS_USER]: [
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
	],
	[FieldBizType.SYS_USER_CREATOR]: [
		{
			key: RuleKeys.REQUIRED,
			status: true,
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
	],
	[FieldBizType.SYS_USER_UPDATER]: [
		{
			key: RuleKeys.REQUIRED,
			status: true,
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
};