const OUTPUT_ID_RES = 'res';
const OUTPUT_ID_ERROR = 'error';
const INPUT_ID_PARAMS = 'params';

export { OUTPUT_ID_RES, OUTPUT_ID_ERROR, INPUT_ID_PARAMS };

// 请求方法枚举
export enum Method {
  GET = 'get',
  POST = 'post'
}

export interface IService {
  id: string | number;
  title: string;
  [key: string]: any;
}

/**
 * 数据源
 * @param url 请求地址
 * @param method 请求方法
 * @param query 请求query参数
 * @param queryKeys 请求query key列表
 * @param body 请求body参数
 * @param isMock 是否mock
 * @param immediate 是否立即请求
 * @param content 接口内容
 */
export interface Data {
  immediate: boolean;
  isMock: boolean;
  serviceContent: any;
  insideServiceContent: IService;
  serviceType: string;
  connectorId: number | string;
  inputSchema: any;
  outputSchema: any;
}
