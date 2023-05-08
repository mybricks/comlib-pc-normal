import { message } from 'antd';

export const ajax = (params: Record<string, unknown>, option: { successTip?: string; errorTip?: string; url?: string; method?: string } = {}) => {
	return fetch(option.url ?? (params.projectId ? '/runtime/api/domain/service/run' : '/api/system/domain/run'), {
		method: option.method || 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		credentials: undefined,
		body: option.method === 'get' ? undefined : JSON.stringify(params)
	} as RequestInit)
	.then(res => res.json())
	.then(res => {
		if (res.code === 1) {
			option.successTip && message.success(option.successTip);
			return res.data;
		} else {
			throw new Error(res.message);
		}
	})
	.catch(error => {
		option.errorTip && message.error(option.errorTip);
		return Promise.reject(error);
	})
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
