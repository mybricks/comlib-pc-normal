import { isObject } from 'lodash';
import { getWindowVal } from '../utils/getWindowVal';
import { loadPkg } from '../utils/loadPkg';
import { Data, Sheet } from './types';

const XLSX_CDN = 'https://cdn.sheetjs.com/xlsx-latest/package/dist/xlsx.full.min.js';

const loadDependence = async () => {
  await loadPkg(XLSX_CDN, 'XLSX');
  return getWindowVal('XLSX');
};

export default async function ({ data, inputs, logger, onError }: RuntimeParams<Data>) {
  const xlsx = await loadDependence();
  const createWorkbook = (dataSource) => {
    let sheets: Array<Record<string, any>> = [];
    if (Array.isArray(dataSource)) {
      //muilt sheet
      sheets = dataSource.map((item) => createSheet(item));
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

  const createSheet = (sheet: Sheet) => {
    const titleRow = Object.keys(sheet.data[0]);
    const dataRow = (sheet.data || []).map((item) => {
      return Object.keys(item).reduce((pre, cur) => {
        return [...pre, item[cur]];
      }, [] as any);
    });
    const sheetData = [titleRow, ...dataRow];

    return {
      [sheet.name || 'Untitled']: xlsx.utils.json_to_sheet(sheetData, { skipHeader: true })
    };
  };
  inputs.dataSource((dataSource, relOutputs) => {
    try {
      const workBook = createWorkbook(dataSource);
      const filename = `${data.filename ?? 'data'}.xlsx`;
      xlsx.writeFile(workBook, filename);
      relOutputs['exportComplete']()
    } catch (error: any) {
      onError?.(error);
      logger.error(`'[excel导出运行错误]'：${error}`);
    }
  });
}
