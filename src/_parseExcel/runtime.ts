import isObject from 'lodash/isObject';
import { getWindowVal } from '../utils/getWindowVal';
import { loadPkg } from '../utils/loadPkg';
import { Data, InputData, ParseFileData, Sheet } from './types';

const XLSX_CDN = 'https://cdn.sheetjs.com/xlsx-latest/package/dist/xlsx.full.min.js';

const loadDependence = async () => {
  await loadPkg(XLSX_CDN, 'XLSX');
  return getWindowVal('XLSX');
};

function checkIsExcelFile(filename: string) {
  const regex = /\.(xlsx|xls|xlsm)$/i; // i 表示忽略大小写
  if (regex.test(filename)) {
    return true
  } else {
    return false
  }
}

export default function ({ data, inputs, outputs, logger, onError }: RuntimeParams<Data>) {
  let xlsx: any = null;

  inputs['input'](async (val: InputData, outputRels) => {
    if (!xlsx) {
      xlsx = await loadDependence();
    }
    const fileList = val.dataSource
    let result: any[] = []
    try {
      
    fileList.forEach(async (file: File | any, fIndex) => {
      let fileParseData = {} as ParseFileData
      fileParseData.filename = file.name
      if(checkIsExcelFile(file.name)) {
        //  是excel文件类型,就进行处理，不是不处理
        let sheetData: any[] = []
        // 将file对象转换为一个arrayBuffer
        const fileBuffer = await file.arrayBuffer()
        // 使用read函数解析为workbook对象
        const workbook = xlsx?.read(fileBuffer);
        // 获取到第一个worksheet
        for (let sheetName of workbook.SheetNames) {
          const first_sheet = workbook.Sheets[sheetName];
          // 将worksheet中的数据转换为json结构的数据
          const json =  xlsx?.utils.sheet_to_json(first_sheet, { header: 1, raw: true })
          const headers = data.titleIndex > 0 ? json[data.titleIndex -1] : []
          const fields = data.fieldIndex > 0 ? json[data.fieldIndex-1] : []
          let jsonData = json.filter((_item, index) => {
            // 判断是不是标题行/字段行，jsonData返回剔除这两行的数据，可以讨论是不是完全保留
            let equal = (index +1 === data.titleIndex) || (index+1 === data.fieldIndex)
            return !equal
          })
          sheetData.push({
            sheetName,
            headers: headers,
            fields,
            json: jsonData
          })
        }
        fileParseData.data = sheetData
        result.push(fileParseData)
      }
      if(fIndex === fileList.length-1) {
        outputRels['parseComplete'](result);
      } 
    })
    } catch (error) {
      outputRels['parseComplete'](result);
      logger.error(`'[excel解析运行错误]'：${error}`);
    }
  });
}
