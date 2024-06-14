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
  //const next = true;
  // inputs.creator((value) => {
  //   const { sceneId, tableData } = value;
  //   if (!sceneId) {
  //     onError("没有场景id");
  //     return;
  //   }
  //   if (next && tableData) {
  //     const table = env.canvas.getCom({ sceneId, comId: data.table.id });
  //     let { columns } = tableData;
  //     columns = (columns || []).map((column) => {
  //       if (column.component) {
  //         //列插槽，需要slots添加插槽能力
  //       } else {
  //         column.contentType = "text";
  //       }
  //       return column;
  //     });
  //     table.data = mergeWith(table.data, { ...tableData, columns }, costumier);
  //     outputs.onComplete(sceneId);
  //   }
  // });

  // 设置数据源
  inputs["setColumn"]((ds) => {
    if (next && ds) {
      const table = env.command.getCom({ sceneId: data.comDef.sceneId, comId: data.comDef.id })
      let columns = ds;
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
        outputs.onComplete();
      } else if (data.operationType === "addBeforeColumn") {
        let newColumns = [...columns, ...table.data.columns];
        table.data.columns = newColumns;
        outputs.onComplete();
      } else if (data.operationType === "addAfterColumn") {
        table.data = merge(table.data, { columns: [...table.data.columns, ...columns] });
        outputs.onComplete();
      }
    }
  })

  //设置分页配置
  inputs["setPagination"]((ds) => {
    if (next && ds && data.isPagination) {
      const table = env.command.getCom({ sceneId: data.comDef.sceneId, comId: data.comDef.id });
      table.data = merge(table.data, { usePagination: true, paginationConfig: ds });
      outputs.onComplete();
    }
  })
}
