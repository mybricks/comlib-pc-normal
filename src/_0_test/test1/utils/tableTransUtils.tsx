import { comsArrFun } from "./basicUtils";

export const columnTrans = (columns)=>{
  let valArr:any[] = [];
  let newColumns;
  columns.forEach(column => {
    valArr.push({
      "type": "component",
      "value": {
        "id": column.key,
        "type": "@es/tianhe-basic-materials::TableColumn",
        "name": "表格列",
        "props": {
          "title": column.title,
          "dataIndex": column.dataIndex,
          "render": {
            "type": "array",
            "value": [
              {
                "type": "render-fn",
                "value": column.contentType === "slotItem" ? comsArrFun(column.slots) : [
                  {
                    "id": column._id,
                    "name": "文本",
                    "type": "@es/tianhe-basic-materials::Text",
                    "props": {
                      "label": column.title
                    }
                  }
                ]
              }
            ]
          },
          ...!column.visible && {"__$condition$__": {
            "type": "static",
            "value": {
              "enabled": true,
              "visible": false,
              "render": false
            }
          }
        }
        }
      }
    })
  })

  newColumns = {
    type: "array",
    value: valArr
  }
  return newColumns;
}

export const tablePropsTrans = (item)=>{
  let newProps = {
    dataSource: [
      {},
      {},
      {}
    ],
    columns: columnTrans(item.props.columns),
    pagination: {
      "type": "static",
      "value": {
        "enabled": item.props?.usePagination,
        "pageSize": item.props?.paginationConfig?.defaultPageSize,
        "current": item.props?.paginationConfig?.current,
        "total": item.props?.paginationConfig?.total,
        "size": item.props?.paginationConfig?.size,
        "showTotal": item.props?.paginationConfig?.text ? true : false
      }
    }
  }
  return newProps
}