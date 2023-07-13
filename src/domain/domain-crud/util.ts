import { message } from 'antd';
import { Data } from './type';
import { OutputIds, QueryMap } from './constants';

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
 * 更新io的schema
 * @param params 
 */
export const refreshSchema = (params) => {
	const { data, outputs, abilitySet } = params;

	const queryThenPin = outputs.get(OutputIds.QUERY.THEN);
	const insertThenPin = outputs.get(OutputIds.INSERT.THEN);
	const editThenPin = outputs.get(OutputIds.EDIT.THEN);
	const deleteThenPin = outputs.get(OutputIds.DELETE.THEN);
	const pageChangeThenPin = outputs.get(OutputIds.PAGE_CHANGE.THEN);

	const queryCatchPin = outputs.get(OutputIds.QUERY.CATCH);
	const insertCatchPin = outputs.get(OutputIds.INSERT.CATCH);
	const editCatchPin = outputs.get(OutputIds.EDIT.CATCH);
	const deleteCatchPin = outputs.get(OutputIds.DELETE.CATCH);
	const pageChangeCatchPin = outputs.get(OutputIds.PAGE_CHANGE.CATCH);

	const queryThenSchema = getSchema(data, [QueryMap.QUERY, OutputIds.QUERY.THEN], abilitySet.includes('PAGE')
		? {
			pageNum: {
				title: '页码',
				type: 'number'
			},
			total: {
				title: '数据总数',
				type: 'number'
			}
		}
		: {});
	const queryCatchSchema = getSchema(data, [QueryMap.QUERY, QueryMap.CATCH]);

	try {
		queryThenPin.setSchema(queryThenSchema);
		queryCatchPin.setSchema(queryCatchSchema);

		if (abilitySet.includes('INSERT')) {
			insertThenPin.setSchema(getSchema(data, [QueryMap.INSERT, QueryMap.THEN]));
			insertCatchPin.setSchema(getSchema(data, [QueryMap.INSERT, QueryMap.CATCH]));
		}

		if (abilitySet.includes('UPDATE')) {
			editThenPin.setSchema(getSchema(data, [QueryMap.EDIT, QueryMap.THEN]))
			editCatchPin.setSchema(getSchema(data, [QueryMap.EDIT, QueryMap.CATCH]))
		}

		if (abilitySet.includes('DELETE')) {
			deleteThenPin.setSchema(getSchema(data, [QueryMap.DELETE, QueryMap.THEN]));
			deleteCatchPin.setSchema(getSchema(data, [QueryMap.DELETE, QueryMap.CATCH]));
		}

		if (abilitySet.includes('PAGE')) {
			pageChangeThenPin.setSchema(queryThenSchema);
			pageChangeCatchPin.setSchema(queryCatchSchema);
		}
	} catch (e) {
		console.error(e);
	}
};

/**
 * 计算io的schema
 * @param data
 * @param type io类型
 * @param externalProperties 额外属性
 * @returns
 */
export const getSchema = (data: Data, type: [string, string], externalProperties?) => {
	const [operation, subType] = type;
	const outputSchema = data?.domainModel?.query?.[operation]?.outputSchema;
	const errorSchema = data?.domainModel?.query?.[operation]?.errorSchema;
	switch (subType) {
		case OutputIds.QUERY.THEN:
			return {
				type: 'object',
				properties: {
					dataSource: {
						title: '表格数据',
						...(outputSchema?.properties?.[QueryMap.THEN]?.properties?.dataSource || {
							type: 'array',
							items: {
								type: 'object',
							}
						})
					},
					...externalProperties
				}
			};
		case QueryMap.THEN:
			return outputSchema?.properties?.[subType] || {
				title: '数据响应值',
				type: 'any'
			};;
		case QueryMap.CATCH:
			return errorSchema?.properties?.[subType] || {
				title: '错误提示信息',
				type: 'string'
			};;

	}
};