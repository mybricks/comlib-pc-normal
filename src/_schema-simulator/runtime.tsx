import { Data } from './constants';

//随机生成字符串
function randomString(e) {
  e = e || 32;
  var t = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678',
    a = t.length,
    n = '';
  for (let i = 0; i < e; i++) n += t.charAt(Math.floor(Math.random() * a));
  return n;
}
//生成随机数
function GetRandomNum(Min, Max) {
  var Range = Max - Min;
  var Rand = Math.random();
  return Min + Math.round(Rand * Range);
}

//生成随机布尔值
function GetRandomBoolean() {
  const bool = GetRandomNum(0, 1);
  if (bool === 0) {
    return false;
  } else {
    return true;
  }
}

//递归计算最小单元schema
const minCulation = (schema) => {
  //如果不是数组和对象，是最小单元了，就可以生成最小模块了
  //考虑了schema.type写错或者不存在的情况，返回空对象
  if (
    schema.type === 'string' ||
    schema.type === 'number' ||
    schema.type === 'boolean' ||
    schema.type === 'any' ||
    schema.type === undefined
  ) {
    switch (schema.type) {
      case 'string':
        return randomString(6);
      case 'number':
        return GetRandomNum(10000, 999999);
      case 'boolean':
        return GetRandomBoolean();
      case 'any':
        return 'any';
      case undefined:
        return {};
    }
  } else if (schema.type === 'object' || schema.type === 'array') {
    if (schema.type === 'object') {
      //考虑对象中的properties写错或者不存在的情况，返回空对象
      if (schema.properties === undefined) {
        return {};
      } else {
        const keys = Object.keys(schema.properties);
        const vals = keys.map((e) => {
          return minCulation(schema.properties[e]);
        });
        const newObj = {};
        for (let i = 0; i < keys.length; i++) {
          newObj[keys[i]] = vals[i];
        }
        return newObj;
      }
    } else if (schema.type === 'array') {
      //考虑对象中的items写错或者不存在的情况，返回空数组
      if (schema.items === undefined) {
        return [];
      } else {
        const newArr: any[] = [];
        const items = schema.items;
        for (let i = 0; i < 10; i++) {
          newArr.push(minCulation(items));
        }
        return newArr;
      }
    }
  }
};

export default function ({ env, inputs, outputs }: RuntimeParams<Data>) {
  const { runtime } = env;
  if (runtime) {
    if (inputs['inputSchema']) {
      inputs['inputSchema']((val: any) => {
        outputs['outputData'](minCulation(val));
      });
    }
  }
}
