import isObject from 'lodash/isObject';
import { getWindowVal } from '../utils/getWindowVal';
import { loadPkg } from '../utils/loadPkg';
import { Data, InputData, Sheet } from './types';

const XLSX_CDN = 'https://cdn.sheetjs.com/xlsx-latest/package/dist/xlsx.full.min.js';

const loadDependence = async () => {
  await loadPkg(XLSX_CDN, 'XLSX');
  return getWindowVal('XLSX');
};

export default function ({ data, inputs, outputs, logger, onError }: RuntimeParams<Data>) {
  let xlsx: any = null;
  const createWorkbook = (dataSource) => {
    let sheets: Array<Record<string, any>> = [];
    if (Array.isArray(dataSource)) {
      //muilt sheet
      sheets = dataSource.map((item, index) => createSheet(item, index));
    } else if (isObject(dataSource)) {
      //single sheet
      sheets = [createSheet(dataSource as Sheet)];
    }
    let Sheets = {},
      SheetNames: Array<string> = [];
    sheets.forEach((sheet) => {
      Sheets = { ...Sheets, ...sheet };
      SheetNames = SheetNames.concat(Object.keys(sheet));
    });
    return {
      Sheets,
      SheetNames
    };
  };

  const createSheet = (sheet: Sheet, index?: number) => {
    let extraOpt = {}
    // 描述信息，不在标题行，直接往data里追加数据
   if(sheet.additionalInfo?.data?.length && sheet.additionalInfo?.rowIndex) {
      // 描述信息行,插入位置大于1(不在标题行)处理
      let rowIndex = sheet.additionalInfo?.rowIndex
      const formattedAddedInfoData = {};
      sheet.header?.forEach((header, idx) => {
       formattedAddedInfoData[header] = sheet.additionalInfo?.data[idx]
      })
      if(rowIndex > 1) {
         sheet.data?.splice(rowIndex - 1, 0, formattedAddedInfoData)
      } else if(rowIndex === 1) {
        const formattedHeader = {};
         sheet.header?.forEach((header, idx) => {
          formattedHeader[header] = header
         })
        // 等于1时，标题行和附加行都放进data里面
        sheet.data?.unshift(formattedAddedInfoData, formattedHeader)
        extraOpt = { skipHeader: true }
      }
    } 
    const ws = xlsx?.utils.json_to_sheet(sheet.data, { header: sheet.header, ...extraOpt });

    if (sheet.columns) {
      if (!ws['!cols']) ws['!cols'] = [];
      for (let i = 0; i < sheet.columns.length; i++) {
        if (!ws['!cols'][i])
          ws['!cols'][i] = { wpx: sheet.columns[i]?.width, hidden: sheet.columns[i]?.hidden };
      }
    }
    if(sheet.additionalInfo?.data?.length && sheet.additionalInfo?.rowIndex) {
    }

    return {
      [sheet.name || `Untitled${index ?? ''}`]: ws
    };
  };
  inputs['input'](async (val: InputData) => {
    if (!xlsx) {
      xlsx = await loadDependence();
    }
    try {
      const workBook = createWorkbook(val.dataSource);
      const filename = `${val.filename ?? data.filename ?? 'data'}.xlsx`;
      xlsx?.writeFile(workBook, filename);
      outputs['exportComplete']();
    } catch (error: any) {
      onError?.(error);
      logger.error(`'[excel导出运行错误]'：${error}`);
    }
  });
}
