import { merge, mergeWith } from "lodash";
import { costumier } from '../utils';
export interface Data {
  operationType: 'setColumn' | 'addBeforeColumn' | 'addAfterColumn';
}

export interface column {
  title: string;
  dataIndex: string;
  width: number;
  visible: boolean;
}

export default ({ env, data, inputs, outputs, slots, onError }) => {
  const next = env.runtime;
  // 设置数据源
  inputs["setColumn"]((ds) => {
    if (next && ds) {
      const table = env.command.getCom({ sceneId: data.comDef.sceneId, comId: data.comDef.id })
      let columns = Array.isArray(ds) ? ds : ds.columns;
      if (Array.isArray(columns) && columns.length > 0) {
        columns = (columns || []).map((column) => {
          if (column.component) {
            //列插槽，需要slots添加插槽能力
          } else {
            column.contentType = "text";
          }

          if (column.visible === undefined) {
            column.visible = true;
          }
          return column;
        });

        if (data.operationType === "setColumn") {
          table.data = merge(table.data, { columns: columns });
        } else if (data.operationType === "addBeforeColumn") {
          let newColumns = [...columns, ...table.data.columns];
          table.data.columns = newColumns;
        } else if (data.operationType === "addAfterColumn") {
          table.data = merge(table.data, { columns: [...table.data.columns, ...columns] });
        }
      }

      if (ds.paginationConfig) {
        table.data = merge(table.data, { paginationConfig: ds.paginationConfig });
      }
      if (typeof ds.usePagination !== 'undefined') {
        table.data = merge(table.data, { usePagination: ds.usePagination });
      }
      outputs.onComplete();
    }
  })
}
