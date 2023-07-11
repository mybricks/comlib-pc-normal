import { Data, findMenuItem, MenuItem, MenuTypeEnum } from './constants';
//一、唯一激活项，定位
export const findSelectkeys = (ds: MenuItem[]) => {
  //对整体数据做一个筛选，选出第一个defaultActive为true的key
  let keys: any = [];
  for (let i = 0; i < ds.length; i++) {
    //1.全是子菜单
    if (ds[i].menuType === MenuTypeEnum.Menu && ds[i].defaultActive === true) {
      keys.push(ds[i].key);
      //2. 父菜单
    } else if (ds[i].menuType === MenuTypeEnum.SubMenu && ds[i].children !== undefined) {
      for (let j = 0; j < ds[i].children?.length; j++) {
        let item = ds[i].children[j];
        //2（1）子菜单
        if (item.menuType === MenuTypeEnum.Menu && item.defaultActive === true) {
          keys.push(item.key);
          //2（1）分组菜单
        } else if (item.menuType === MenuTypeEnum.Group && item.children !== undefined) {
          for (let t = 0; t < item.children.length; t++) {
            if (
              item.children[t].menuType === MenuTypeEnum.Menu &&
              item.children[t].defaultActive === true
            ) {
              keys.push(item.children[t].key);
            }
          }
        }
      }
    }
  }
  return keys[0];
};

//二、数组扁平化
const flatten = (arr) => {
  let res: any[] = [];
  for (var i = 0; i < arr.length; i++) {
    if (Array.isArray(arr[i])) {
      res = res.concat(flatten(arr[i]));
    } else {
      res.push(arr[i]);
    }
  }
  return res;
};

//三、聚焦到整个菜单，删除菜单项处理
export function removeOutput(befVal: MenuItem[], nowVal: MenuItem[], output) {
  //减少子菜单、父菜单和分组菜单事件，diff
  //1）减少子菜单事件
  let befArr = befVal.map((item) => {
    return item._key;
  });
  let aftArr = [...nowVal].map((item) => {
    return item._key;
  });
  let list = befArr.filter((items) => {
    if (!aftArr.includes(items)) return items;
  });
  output.remove(list[0]);
  //2）减少父菜单和分组菜单事件
  // 1. 找出被删除的那一项
  const index = befArr.indexOf(list[0]);
  if (list.length !== 0) {
    //2.确认删除的那一项是父菜单和分组菜单
    if (befVal[index].menuType !== 'menu') {
      //3.确认子项有值
      if (befVal[index].children?.length !== 0) {
        //3.得出删除子项的所有key
        let deletArr: string[] | any = befVal[index].children?.map((item) => {
          if (item.menuType === 'group' && item.children !== undefined) {
            let groupArr;
            groupArr = item.children.map((x) => {
              return x._key;
            });
            return groupArr;
          } else {
            return item._key;
          }
        });
        deletArr = flatten(deletArr);
        for (let i = 0; i < deletArr?.length; i++) {
          //4.删除对应的output
          output.remove(deletArr[i]);
        }
      }
    }
  }
}

//四、聚焦到整个菜单，增加菜单项处理
export function addOutput(befVal: MenuItem[], nowVal: MenuItem[], output) {
  const schema = {
    type: 'any'
  };
  //增加子菜单点击事件
  for (let i = 0; i < [...nowVal].length; i++) {
    output.add([...nowVal][i]._key, `点击${[...nowVal][i].title}`, schema);
  }

  //如果从父菜单切换到子菜单，去除该项的点击事件
  for (let i = 0; i < befVal.length; i++) {
    if (befVal[i].menuType === MenuTypeEnum.SubMenu) {
      output.remove(befVal[i]._key);
    }
  }
}

//五、聚焦到整个菜单，唯一激活项处理,数据改写
export function dataHandle(befVal: MenuItem[], nowVal: MenuItem[]) {
  let newValues;
  let difIndex;
  let selectedKey;
  let befSelected = befVal.map((item) => {
    return {
      key: item.key,
      defaultActive: item.defaultActive || false
    };
  });

  let aftSelected = [...nowVal].map((item) => {
    return {
      key: item.key,
      defaultActive: item.defaultActive
    };
  });

  let befAct = befVal.map((item) => {
    return item.defaultActive || false;
  });
  let aftAct = [...nowVal].map((item) => {
    return item.defaultActive || false;
  });

  //在没有删除的情况下，去做比较
  if (befSelected.length === aftSelected.length) {
    for (let i = 0; i < befSelected.length; i++) {
      if (befAct[i] !== aftAct[i]) {
        difIndex = i;
      }
    }

    if (aftAct[difIndex] === true && befSelected[difIndex].key === aftSelected[difIndex].key) {
      selectedKey = aftSelected[difIndex].key;
      newValues = findActive([...nowVal], selectedKey);
      return [...newValues];
    } else {
      return [...nowVal];
    }
  } else {
    return [...nowVal];
  }
}

//六、菜单数据源更新
export function dataSourceHandle(befVal: MenuItem[], nowVal: MenuItem[], data) {
  let newValues;
  let difIndex;
  let selectedKey;
  let befSelected = befVal.map((item) => {
    return {
      key: item.key,
      defaultActive: item.defaultActive || false
    };
  });

  let aftSelected = [...nowVal].map((item) => {
    return {
      key: item.key,
      defaultActive: item.defaultActive
    };
  });

  let befAct = befVal.map((item) => {
    return item.defaultActive || false;
  });
  let aftAct = [...nowVal].map((item) => {
    return item.defaultActive || false;
  });

  //在没有删除的情况下，去做比较
  if (befSelected.length === aftSelected.length) {
    for (let i = 0; i < befSelected.length; i++) {
      if (befAct[i] !== aftAct[i]) {
        difIndex = i;
      }
    }
    if (aftAct[difIndex] === true && befSelected[difIndex].key === aftSelected[difIndex].key) {
      selectedKey = aftSelected[difIndex].key;
      newValues = findActive([...data], selectedKey);
      return newValues;
    } else {
      return [...data];
    }
  } else {
    return [...data];
  }
}

//七、聚焦到子项，唯一激活项处理
export function itemHandle(key, dataSource) {
  let newval = findActive(dataSource, key);
  return newval;
}

//八、聚焦到子项，父菜单切换到子菜单，去除对应的输出
export const removeKeys = (data, props) => {
  data.map((item) => {
    props.output.remove(item._key);
    if (item.children) {
      removeKeys(item.children, props);
    }
  });
};

//九、聚焦到子项，类型为父菜单，增加对应输出
export const addKeys = (data, props) => {
  props.output.add(data._key, `点击${data.title}`, { type: 'any' });
  if (data.children) {
    data.children.map((item) => {
      props.output.add(item._key, `点击${item.title}`, { type: 'any' });
      if (item.children) {
        addKeys(item.children, props);
      }
    });
  }
};

//十、激活项处理
function findActive(item, key) {
  let newData = [...item].map((x) => {
    if (x.key !== key) {
      x.defaultActive = false;
      if (x.children) {
        findActive(x.children, key);
      }
      return x;
    } else {
      x.defaultActive = true;
      return x;
    }
  });
  return newData;
}

//十一、对应项取值
export const getMenuItem = ({ data, focusArea }: EditorResult<Data>, path?: keyof MenuItem) => {
  if (!focusArea) return;
  const key = focusArea.dataset['menuItem'];
  const item = findMenuItem(data.dataSource, key, true);
  if (!path) {
    return item;
  }
  return item?.[path];
};

//十一、对应项赋值
export const setMenuItem = <T extends keyof MenuItem, P extends MenuItem[T]>(
  { data, focusArea }: EditorResult<Data>,
  path: T,
  value: P
) => {
  if (!focusArea) return;
  const key = focusArea.dataset['menuItem'];
  const item = findMenuItem(data.dataSource, key, true);
  if (item && path) {
    item[path] = value;
  }
  data.dataSource = [...data.dataSource];
};
