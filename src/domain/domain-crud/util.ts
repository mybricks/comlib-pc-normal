import { message } from 'antd';
import { Data } from './type';
import { OutputIds } from './constants';

export const ajax = (
	params: Record<string, unknown>,
	option: {
		successTip?: string;
		errorTip?: string;
		needErrorTip?: boolean;
		url?: string;
		method?: string;
		contentType?: string;
	} = {}
): Promise<any> => {
	return new Promise((resolve, reject) => {
		const xhr = new XMLHttpRequest();
		xhr.open(option.method || 'POST', option.url ?? (params.projectId ? '/runtime/api/domain/service/run' : '/api/system/domain/run'), true);
		option.contentType !== 'multipart/form-data' && xhr.setRequestHeader('Content-type', option.contentType || 'application/json');

		let data: any = params;
		if (option.method?.toUpperCase() === 'GET') {
			data = undefined;
		} else if (!option.contentType || option.contentType === 'application/json') {
			data = JSON.stringify(params);
		}
		xhr.onreadystatechange = function () {
			if (xhr.readyState == 4) {
				if (xhr.status == 200 || xhr.status == 201) {
					const data = safeParse(xhr.responseText, {});

					if (data.code === 1) {
						option.successTip && message.success(option.successTip);
						resolve(data.data);
					} else {
						(option.needErrorTip || option.errorTip) && message.error(option.errorTip || data.msg || '请求错误，请稍候再试~');
						reject(data.msg || '请求错误，请稍候再试~');
					}
				} else {
					(option.needErrorTip || option.errorTip) && message.error(option.errorTip || '请求错误，请稍候再试~');
					reject(option.errorTip || '请求错误，请稍候再试~');
				}
			}
		};

		xhr.onerror = function () {
			(option.needErrorTip || option.errorTip) && message.error(option.errorTip || '请求错误，请稍候再试~');
			reject('请求错误，请稍候再试~');
		};
		xhr.send(data);
	});
}

/** parse JSON string，同时 catch 错误 */
export const safeParse = (content: string, defaultValue = {}) => {
	try {
		return JSON.parse(content);
	} catch {
		return defaultValue;
	}
};

/** stringify JSON string，同时 catch 错误 */
export const safeStringify = (content: any) => {
	try {
		return JSON.stringify(content);
	} catch {
		return ''
	}
};

/** 编码 */
export const safeEncodeURIComponent = (content: string) => {
	try {
		return encodeURIComponent(content);
	} catch {
		return content ?? '';
	}
};

/** 解码 */
export const safeDecodeURIComponent = (content: string) => {
	try {
		return decodeURIComponent(content);
	} catch {
		return content ?? '';
	}
};

/**
 * 计算io的schema
 * @param data
 * @param type io类型
 * @param externalProperties 额外属性
 * @returns
 */
export const getSchema = (data: Data, type?, externalProperties?) => {
	switch (type) {
		case 'catch':
			return {
				title: '错误提示信息',
				type: 'string'
			};
		case OutputIds.QUERY.THEN:
			const fields = data.domainModel?.query?.entity?.fieldAry.filter((item) => !item.isPrivate);
			const properties = {};
			fields.forEach((field) => {
				const { name, bizType } = field;
				properties[name] = {
					type: bizType
				};
			});
			return {
				type: 'object',
				properties: {
					dataSource: {
						title: '表格数据',
						type: 'array',
						items: {
							type: 'object',
							properties
						}
					},
					...externalProperties
				}
			};
		default:
			return {
				title: '数据响应值',
				type: 'object',
				properties: {}
			};
	}
};