import {FieldDBType} from "./constants";
import {Field} from "./type";

enum RuleKeys {
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

export const RuleMap = {
	[RuleKeys.REQUIRED]: (field: Field) => {
		return () => ({
			validator(_, value) {
				if ((field.dbType === FieldDBType.BIGINT && typeof value === 'number') || !!value) {
					return Promise.resolve();
				}
				return Promise.reject(new Error('内容不能为空'));
			},
		});
	},
	[RuleKeys.Email_VALIDATOR] : () => {
		return () => ({
			validator(_, value) {
				const reg = new RegExp("^[A-Za-z0-9\u4e00-\u9fa5]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$");
				if (!reg.test(value)) {
					return Promise.reject(new Error('邮箱不符合格式要求'));
				}
				return Promise.resolve();
			},
		});
	},
	[RuleKeys.PHONE_NUMBER_VALIDATOR] : () => {
		return () => ({
			validator(_, value) {
				const reg = new RegExp("^1\\d{10}$");
				if (!reg.test(value)) {
					return Promise.reject(new Error('手机号不符合格式要求'));
				}
				return Promise.resolve();
			},
		});
	},
};