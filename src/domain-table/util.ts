import {message} from "antd";

let isProd = false;
export const setIsProd = (value: boolean) => (isProd = value);
export const ajax = (params: Record<string, unknown>, option: { successTip?: string; errorTip?: string; url?: string } = {}) => {
	return fetch(option.url ?? (isProd ? '/runtime/api/domain/service/run' : '/api/system/domain/run'), {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		credentials: undefined,
		body: JSON.stringify(params)
	} as RequestInit)
	.then(res => res.json())
	.then(res => {
		if (res.code === 1) {
			option.successTip && message.success(option.successTip);
			return res.data;
		} else {
			return new Error(res.message);
		}
	})
	.catch(error => {
		option.errorTip && message.error(option.errorTip);
		return Promise.reject(error);
	})
}