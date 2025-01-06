import { comsArrFun, uuid } from './basicUtils'

export const gridPropsTrans = (item)=>{
  let childrenArr:any = [];
  item.props.rows.forEach(row => {
    childrenArr.push({
      "id": "comp_" + row.key + uuid(),
      "type": "@es/tianhe-basic-materials::Row",
      "name": "行布局",
      children: columnsTrans(row.columns),
      props: {
        justify: "space-around"
      }
    })
  });

  let gridProps = {
    children: childrenArr
  }
  return gridProps
}

const columnsTrans = (columns)=>{
  let columnsArr:any = []
  columns.forEach(column => {
    columnsArr.push({
      "id": "comp_" + columns.key + uuid(),
      "type": "@es/tianhe-basic-materials::Col",
      "name": "列布局",
      children: comsArrFun(column.slots)
    })
  })
  return columnsArr;
}

export const layoutPropsTrans = (item)=>{
  let childrenArr:any = [];
  item.props.rows.forEach(row => {
    childrenArr.push({
      "id": "comp_" + row.key + uuid(),
      "type": "@es/tianhe-basic-materials::Row",
      "name": "行布局",
      children: layoutColumnsTrans(row.cols),
      props: {
        justify: "space-around"
      }
    })
  });

  let gridProps = {
    children: childrenArr
  }
  return gridProps
}

const layoutColumnsTrans = (cols)=>{
  let colsArr:any = []
  cols.forEach(col => {
    colsArr.push({
      "id": "comp_" + col.key + uuid(),
      "type": "@es/tianhe-basic-materials::Col",
      "name": "列布局",
      children: comsArrFun(col.slots)
    })
  })
  return colsArr;
}

export const containerSlotsTrans = (item, comsObj, comsTrans, type) => {
  let {rows, ...props} = comsObj[item.id].model.data;
  let newProps = {};
  let slots = item.slots;
  if(type === "mybricks.normal-pc.grid"){
    newProps = {
      ...props,
      rows: rows.map(row => {
        return {
          ...row,
          columns: row.columns.map(column => {
            return {
              ...column,
              slots: comsTrans(slots[column.slot].comAry)
            }
          })
        }
      })
    }
  }
  
  if(type === "mybricks.basic-comlib.grid"){
    newProps = {
      ...props,
      rows: rows.map(row => {
        return {
          ...row,
          columns: row.cols.map(col => {
            return {
              ...col,
              slots: comsTrans(slots[col.key].comAry)
            }
          })
        }
      })
    }
  }

  if(type === "mybricks.basic-comlib.dragable-layout"){
    newProps = {
      ...props,
      rows: rows.map(row => {
        return {
          ...row,
          cols: row.cols.map(col => {
            return {
              ...col,
              slots: comsTrans(slots[col.key].comAry)
            }
          })
        }
      })
    }
  }

  if(type === "mybricks.normal-pc.tabs"){
    newProps = {
      ...props,
      tabList: props.tabList.map(tab => {
        return {
          ...tab,
          slots: comsTrans(slots[tab.id].comAry)
        }
      })
    }
  }

  if(type === "mybricks.normal-pc.table"){
    newProps = {
      ...props,
      columns: props.columns.map(col => {
        return {
          ...col,
          ...col.contentType === "slotItem" && 
          {
            slots: comsTrans(slots[col.slotId].comAry)
          }
        }
      })
    }
  }
  return newProps;
}