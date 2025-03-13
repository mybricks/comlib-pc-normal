/**
 * 更新节点数据
 */
export const setDataForLoadData = (data, curNode, dataSource, newNodeData: any[] = []) => {
    let newData: any[] = [];
    const trueValueFieldName = data.fieldNames.value || 'value';
    const trurChildrenFieldName = data.fieldNames.children || 'children';

    newData = dataSource.map((item) => {
      if (item[trueValueFieldName] === curNode[trueValueFieldName]) {
          item = {
              ...item,
              children: newNodeData
          };
      } else {
          if (Array.isArray(item[trurChildrenFieldName])) {
              item[trurChildrenFieldName] = setDataForLoadData(
                  data,
                  curNode,
                  item[trurChildrenFieldName],
                  newNodeData
              );
          }
      }
      return item;
    });

    return newData;
};