import { uuid } from '../../utils';
import { BLOCKS_KEY, TEMPLATE_RENDER_KEY } from '../constants';
import { Data, IColumn } from '../types';

function getScratchScript(blocksOri) {
  const reg = new RegExp(`input0\\(\\(input0,_output\\)=>{`);
  let script = blocksOri.script || '';

  // .replaceAll('\\n', '')
  script = script.trim().replace(reg, '').replace(/}\)$/, '');

  const evalScript = `
    (function(colData) {
      try {
        const ${BLOCKS_KEY} = []
        ${script}
        return ${BLOCKS_KEY}
      } catch(ex) {
        console.error(ex)
        // throw new Error('Scratch组件发生错误.')
      }
    })
  `;
  return evalScript;
}


const getPageInfo = (data: Data) => {
  if (data.hasPagination) {
    return {
      [data.pageNumber || 'current']: data.pagination.current,
      [data.pageSize || 'pageSize']: data.pagination.pageSize
    };
  }
};

//获取指定class的父节点
const getParentNodeByTag = (element: HTMLElement, tagName) => {
  const getParentNode = (element) => {
    if (!element || !element.tagName) {
      return;
    }
    if (element && element.tagName.toLowerCase() === tagName) {
      return element;
    } else {
      return getParentNode(element.parentElement);
    }
  };
  return getParentNode(element);
};

//拉平层级数组: tree to array
const flat = (data) => {
  const ret = [];
  let parent = null;
  const doFlat = (data, ret) => {
    if (Array.isArray(data)) {
      data.forEach(({ children, uuid, ...rest }) => {
        ret.push({ ...rest, parent, uuid });
        if (children?.length) {
          parent = uuid;
          doFlat(children, ret);
          parent = null;
        }
      });
    }
  };
  doFlat(data, ret);
  return ret;
};

//构建tree: array to tree
const unFlat = (data) => {
  const ret = [];
  const dirty = [];
  data.forEach((node) => {
    const { parent, ...rest } = node;
    if (!parent) {
      ret.push(rest);
    } else {
      const parentNode = ret.find(({ uuid }) => uuid === parent);
      if (!parentNode) {
        dirty.push(node);
      } else {
        if (!parentNode?.children) {
          parentNode.children = [];
        }
        parentNode.children.push(rest);
      }
    }
  });
  //拖拽出当前层级的脏数据默认插入到同层的最前面
  dirty?.forEach(({ parent, ...rest }) => {
    const parentNode = ret.find(({ uuid }) => uuid === parent);
    if (!parentNode?.children) {
      parentNode.children = [];
    }
    parentNode.children.unshift(rest);
  });
  return ret;
};

export {
  getScratchScript,
  getPageInfo,
  getParentNodeByTag,
  flat,
  unFlat
};

export const findColumnItemByKey = (columns, key) => {
  let res;
  if (Array.isArray(columns)) {
    columns.forEach((column, index) => {
      if (res) {
        return;
      }
      if (column.key === key) {
        res = {
          column,
          index,
          parent: columns
        };
        return;
      }
      if (column.children) {
        res = findColumnItemByKey(column.children, key);
      }
    });
  }
  return res;
};
export const getColumnItem = (data: Data, focusArea, datasetKey = 'tableThIdx'): IColumn => {
  const key = focusArea.dataset[datasetKey];
  return findColumnItemByKey(data.columns, key)?.column || {};
};
export const getColumnItemInfo = (
  data: Data,
  focusArea,
  datasetKey = 'tableThIdx'
): { column: IColumn; index?: number; parent: IColumn[] } => {
  const key = focusArea.dataset[datasetKey];
  const res = findColumnItemByKey(data.columns, key);
  return res || { column: {}, parent: [] };
};

export const getNewColumn = () => {
  const obj: IColumn = {
    title: '新增',
    dataIndex: `${uuid()}`,
    ellipsis: true,
    width: 140,
    key: uuid(),
    contentType: 'text',
    visible: true
  };
  return obj;
};
