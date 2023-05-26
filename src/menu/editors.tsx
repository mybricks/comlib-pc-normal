import {
  Data,
  findMenuItem,
  MenuItem,
  MenuTypeEnum,
  MenuModeEnum,
  OutputIds,
  uuid
} from './constants';

const getMenuItem = ({ data, focusArea }: EditorResult<Data>, path?: keyof MenuItem) => {
  if (!focusArea) return;
  const key = focusArea.dataset['menuItem'];
  const item = findMenuItem(data.dataSource, key, true);
  if (!path) {
    return item;
  }
  return item?.[path];
};

//数组扁平化
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

const setMenuItem = <T extends keyof MenuItem, P extends MenuItem[T]>(
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

//配置分组菜单的点击事件
const groupItemsOnClick = (props) => {
  let items: any = [];
  if (getMenuItem(props, 'children') !== undefined) {
    for (let i = 0; i < getMenuItem(props, 'children').length; i++) {
      if (
        getMenuItem(props, 'children')[i].menuType === 'group' &&
        getMenuItem(props, 'children')[i].children !== undefined
      ) {
        let groupItem = getMenuItem(props, 'children')[i].children;
        for (let j = 0; j < groupItem.length; j++) {
          items.push({
            title: `点击${groupItem[j].title}`,
            type: '_event',
            ifVisible(props: EditorResult<Data>) {
              //父菜单和分组菜单的点击事件
              return getMenuItem(props, 'children') !== undefined;
            },
            options: {
              outputId: groupItem[j].key
            }
          });
        }
      }
    }
  }
  return items;
};

//配置父菜单点击事件（包含子菜单和分组菜单中的子菜单）
const menuItemsOnClick = (props) => {
  let items: any = [];
  if (getMenuItem(props, 'children') !== undefined) {
    for (let i = 0; i < getMenuItem(props, 'children').length; i++) {
      if (getMenuItem(props, 'children')[i].menuType === 'menu') {
        items.push({
          title: `点击${getMenuItem(props, 'children')[i].title}`,
          type: '_Event',
          ifVisible(props: EditorResult<Data>) {
            //父菜单和分组菜单的点击事件
            return getMenuItem(props, 'children') !== undefined;
          },
          options: {
            outputId: getMenuItem(props, 'children')[i].key
          }
        });
      }
    }
  }
  return items;
};

const groupItemEditors = (props) => {
  let items: any = [];
  let groupItems: any = [];
  //前提条件是父菜单且子菜单项的类型是分组菜单
  if (getMenuItem(props).menuType === 'subMenu' && getMenuItem(props).children !== undefined) {
    for (let i = 0; i < getMenuItem(props).children.length; i++) {
      if (getMenuItem(props).children[i].menuType === 'group') {
        items.push(getMenuItem(props).children[i]);
      }
    }
    groupItems = items.map((e) => {
      return {
        title: `${e.title}子项配置`,
        type: 'Array',
        description: '这里可以配置子菜单和分组菜单',
        options: {
          getTitle: (item, index) => {
            if (!item.title) {
              item.title = `分组子菜单${index + 1}`;
            }
            if (!item.key) {
              item.key = uuid();
            }
            return item.title;
          },
          onAdd: () => {
            const key = uuid();
            return {
              key,
              _key: key,
              menuType: MenuTypeEnum.Menu
            };
          },
          items: [
            {
              title: '标题',
              type: 'TextArea',
              value: 'title',
              options: {
                autoSize: { maxRows: 1 }
              }
            },
            {
              title: '唯一标识',
              type: 'TextArea',
              value: '_key',
              options: {
                autoSize: { maxRows: 1 }
              }
            },
            {
              title: '默认激活',
              type: 'Switch',
              value: 'defaultActive'
            }
          ]
        },
        value: {
          get(props: EditorResult<Data>) {
            //取到遍历的当前项
            return e.children;
          },
          set(props: EditorResult<Data>, value: any[]) {
            let afArr = [...value].map((item) => {
              return item.key;
            });
            let beArr = [];
            if (e.children === undefined) {
              beArr = [];
            } else {
              beArr = e.children.map((item) => {
                return item.key;
              });
            }
            //获取减少的子菜单项子菜单内容
            let list = beArr.filter((items) => {
              if (!afArr.includes(items)) return items;
            });
            //对激活状态做处理
            let befSelected;
            let aftSelected;
            let befAct;
            let aftAct;
            let difIndex;
            let newVaules: any[] = [];

            if (e.children === undefined) {
              befSelected = [];
            } else {
              befSelected = e.children.map((item) => {
                return {
                  key: item.key,
                  defaultActive: item.defaultActive || false
                };
              });
            }

            aftSelected = [...value].map((item) => {
              return {
                key: item.key,
                defaultActive: item.defaultActive || false
              };
            });
            //对value进行处理
            if (befSelected.length === aftSelected.length) {
              befAct = befSelected.map((item) => {
                return item.defaultActive || false;
              });
              aftAct = aftSelected.map((item) => {
                return item.defaultActive || false;
              });
              for (let i = 0; i < befSelected.length; i++) {
                if (befAct[i] !== aftAct[i]) {
                  difIndex = i;
                }
              }

              if (
                aftAct[difIndex] === true &&
                befSelected[difIndex].key === aftSelected[difIndex].key
              ) {
                newVaules = [...value].map((item) => {
                  if (item.key !== aftSelected[difIndex].key) {
                    item.defaultActive = false;
                  } else {
                    item.defaultActive = true;
                  }
                  return item;
                });
              } else {
                newVaules = [...value];
              }
            } else {
              newVaules = [...value];
            }

            e.children = newVaules;

            //对dataSource处理
            let selectedKey;
            if (difIndex !== undefined) {
              selectedKey = aftSelected[difIndex].key;
              if (aftAct[difIndex] === true) {
                let newval = props.data.dataSource.map((item) => {
                  if (item.key !== selectedKey) {
                    item.defaultActive = false;
                  }
                  if (item.menuType !== MenuTypeEnum.Menu && item.children !== undefined) {
                    item.children = [...item.children].map((chil) => {
                      if (chil.menuType === MenuTypeEnum.Menu && chil.key !== selectedKey) {
                        chil.defaultActive = false;
                      } else if (
                        chil.menuType === MenuTypeEnum.Group &&
                        chil.children !== undefined
                      ) {
                        chil.children = [...chil.children].map((groupChil) => {
                          if (groupChil.key !== selectedKey) {
                            groupChil.defaultActive = false;
                          }
                          return groupChil;
                        });
                      }
                      return chil;
                    });
                  }
                  return item;
                });
                props.data.dataSource = newval;
              }
            }
            //减少分组菜单子菜单的点击事件
            props.output.remove(list[0]);
            const schema = {
              type: 'any'
            };
            // props.output.remove(list[0]);
            //增加分组菜单的点击事件
            for (let i = 0; i < [...value].length; i++) {
              props.output.add([...value][i].key, `点击${[...value][i].title}`, schema);
            }
          }
        }
      };
    });
  }
  return groupItems;
};

export default {
  '@init': ({ data, output }: EditorResult<Data>) => {
    data.dataSource = [
      {
        title: '菜单1',
        defaultActive: true,
        key: uuid(),
        _key: 'menu1',
        menuType: MenuTypeEnum.Menu
      }
    ];
    const schema = {
      type: 'any'
    };
    output.add(data.dataSource[0].key, `点击${data.dataSource[0].title}`, schema);
  },
  '@resize': {
    options: ['width']
  },
  ':root': [
    {
      title: '静态数据',
      type: 'Array',
      options: {
        getTitle: (item, index) => {
          if (!item.title) {
            item.title = `菜单${index + 1}`;
          }
          if (!item.key) {
            item.key = uuid();
          }
          return item.title;
        },
        onAdd: () => {
          const key = uuid();
          return {
            key,
            _key: key,
            menuType: MenuTypeEnum.Menu
          };
        },
        items: [
          {
            title: '标题',
            type: 'TextArea',
            value: 'title',
            options: {
              autoSize: { maxRows: 1 }
            }
          },
          {
            title: '唯一标识',
            type: 'TextArea',
            value: '_key',
            options: {
              autoSize: { maxRows: 1 }
            }
          },
          {
            title: '默认激活',
            type: 'Switch',
            ifVisible(item) {
              return item.menuType === MenuTypeEnum.Menu;
            },
            value: 'defaultActive'
          },
          {
            title: '类型',
            type: 'Select',
            options: [
              { label: '子菜单', value: MenuTypeEnum.Menu },
              { label: '父菜单', value: MenuTypeEnum.SubMenu }
            ],
            value: 'menuType'
          }
          // {
          //   title: '其他数据(Json)',
          //   type: 'Code',
          //   options: {
          //     title: '其他数据(Json)',
          //     language: 'json',
          //     width: 600,
          //     height: 100,
          //     minimap: {
          //       enabled: false
          //     }
          //   },
          //   value: 'value'
          // }
        ]
      },
      value: {
        get({ data }: EditorResult<Data>) {
          return data.dataSource;
        },
        set({ data, output }: EditorResult<Data>, val: any[]) {
          //如果从父菜单切换到子菜单，去除该项的点击事件
          //减少子菜单、父菜单和分组菜单事件，diff
          //1）减少子菜单事件
          let befArr = data.dataSource.map((item) => {
            return item.key;
          });
          let aftArr = [...val].map((item) => {
            return item.key;
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
            if (data.dataSource[index].menuType !== 'menu') {
              //3.确认子项有值
              if (data.dataSource[index].children?.length !== 0) {
                //3.得出删除子项的所有key
                let deletArr: string[] | any = data.dataSource[index].children?.map((item) => {
                  if (item.menuType === 'group' && item.children !== undefined) {
                    let groupArr;
                    groupArr = item.children.map((x) => {
                      return x.key;
                    });
                    return groupArr;
                  } else {
                    return item.key;
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
          //对默认选中情况的, 数据处理
          let newValues;
          let befAct;
          let aftAct;
          let difIndex;
          let selectedKey;
          let befSelected = data.dataSource.map((item) => {
            return {
              key: item.key,
              defaultActive: item.defaultActive || false
            };
          });

          let aftSelected = [...val].map((item) => {
            return {
              key: item.key,
              defaultActive: item.defaultActive
            };
          });

          //在没有删除的情况下，去做比较
          //1）更新value
          if (befSelected.length === aftSelected.length) {
            befAct = data.dataSource.map((item) => {
              return item.defaultActive || false;
            });
            aftAct = [...val].map((item) => {
              return item.defaultActive || false;
            });

            for (let i = 0; i < befSelected.length; i++) {
              if (befAct[i] !== aftAct[i]) {
                difIndex = i;
              }
            }

            if (
              aftAct[difIndex] === true &&
              befSelected[difIndex].key === aftSelected[difIndex].key
            ) {
              newValues = [...val].map((item) => {
                if (item.key !== aftSelected[difIndex].key) {
                  item.defaultActive = false;
                } else {
                  item.defaultActive = true;
                }
                return item;
              });
            }
          }

          if (newValues !== undefined) {
            newValues = [...newValues].map((item) => {
              //最外层改为父菜单后，将默认激活去除
              if (item.menuType === MenuTypeEnum.SubMenu) {
                item.defaultActive = false;
              }
              return item;
            });
          } else {
            newValues = [...val].map((item) => {
              //最外层改为父菜单后，将默认激活去除
              if (item.menuType === MenuTypeEnum.SubMenu) {
                item.defaultActive = false;
              }
              return item;
            });
          }
          data.dataSource = newValues;

          //2）更新dataSource
          if (aftAct[difIndex] === true) {
            selectedKey = aftSelected[difIndex].key;
            let newData = data.dataSource.map((item) => {
              if (item.key !== selectedKey) {
                item.defaultActive = false;
              }
              if (item.menuType !== MenuTypeEnum.Menu && item.children !== undefined) {
                item.children = [...item.children].map((chil) => {
                  if (chil.menuType === MenuTypeEnum.Menu && chil.key !== selectedKey) {
                    chil.defaultActive = false;
                  } else if (chil.menuType === MenuTypeEnum.Group && chil.children !== undefined) {
                    chil.children = [...chil.children].map((groupChil) => {
                      if (groupChil.key !== selectedKey) {
                        groupChil.defaultActive = false;
                      }
                      return groupChil;
                    });
                  }
                  return chil;
                });
              }
              return item;
            });
            data.dataSource = newData;
          }

          const schema = {
            type: 'any'
          };
          //增加子菜单点击事件
          for (let i = 0; i < [...val].length; i++) {
            output.add([...val][i].key, `点击${[...val][i].title}`, schema);
          }

          //如果从父菜单切换到子菜单，去除该项的点击事件
          for (let i = 0; i < data.dataSource.length; i++) {
            if (data.dataSource[i].menuType === MenuTypeEnum.SubMenu) {
              output.remove(data.dataSource[i].key);
            }
          }
        }
      }
    },
    {
      title: '样式',
      type: 'Select',
      options: [
        { label: '水平', value: MenuModeEnum.Horizontal },
        { label: '垂直', value: MenuModeEnum.Vertical },
        { label: '内联', value: MenuModeEnum.Inline }
      ],
      value: {
        get({ data }: EditorResult<Data>) {
          return data.mode;
        },
        set({ data }: EditorResult<Data>, val: MenuModeEnum) {
          data.mode = val;
        }
      }
    },
    {
      title: '点击',
      type: '_Event',
      options: {
        outputId: OutputIds.ClickMenu
      }
    }
  ],
  '[data-menu-item]': {
    title: '菜单项',
    items: (props: EditorResult<Data>, data, output: EditorResult<Data>, ...cateAry) => {
      (cateAry[0].title = '菜单项'),
        (cateAry[0].items = [
          {
            title: '标题',
            type: 'Text',
            value: {
              get(props: EditorResult<Data>) {
                return getMenuItem(props, 'title');
              },
              set(props: EditorResult<Data>, value: string) {
                setMenuItem(props, 'title', value);
              }
            }
          },
          {
            title: '唯一标识',
            type: 'Text',
            value: {
              get(props: EditorResult<Data>) {
                return getMenuItem(props, '_key');
              },
              set(props: EditorResult<Data>, value: string) {
                setMenuItem(props, '_key', value);
              }
            }
          },
          {
            title: '默认激活',
            type: 'Switch',
            ifVisible(props: EditorResult<Data>) {
              return getMenuItem(props, 'menuType') === MenuTypeEnum.Menu;
            },
            value: {
              get(props: EditorResult<Data>) {
                return getMenuItem(props, 'defaultActive');
              },
              set(props: EditorResult<Data>, value: boolean) {
                setMenuItem(props, 'defaultActive', value);

                //默认激活的互斥
                if (value === true) {
                  let selectedKey = getMenuItem(props, 'key');
                  let newval: any[] = [];
                  //对dataSource整体遍历
                  newval = props.data.dataSource.map((item) => {
                    if (item.key !== selectedKey) {
                      item.defaultActive = false;
                    }
                    if (item.menuType !== MenuTypeEnum.Menu && item.children !== undefined) {
                      item.children = [...item.children].map((chil) => {
                        if (chil.menuType === MenuTypeEnum.Menu && chil.key !== selectedKey) {
                          chil.defaultActive = false;
                        } else if (
                          chil.menuType === MenuTypeEnum.Group &&
                          chil.children !== undefined
                        ) {
                          chil.children = [...chil.children].map((groupChil) => {
                            if (groupChil.key !== selectedKey) {
                              groupChil.defaultActive = false;
                            }
                            return groupChil;
                          });
                        }
                        return chil;
                      });
                    }
                    return item;
                  });
                  props.data.dataSource = newval;
                }
              }
            }
          },
          {
            title: '类型',
            type: 'Select',
            options: [
              { label: '子菜单', value: MenuTypeEnum.Menu },
              { label: '父菜单', value: MenuTypeEnum.SubMenu }
            ],
            value: {
              get(props: EditorResult<Data>) {
                return getMenuItem(props, 'menuType');
              },
              set(props: EditorResult<Data>, value: MenuTypeEnum) {
                setMenuItem(props, 'menuType', value);
                //从子菜单，切换到父菜单，去除默认勾选状态，且去除其选中状态
                if (getMenuItem(props, 'menuType') === MenuTypeEnum.SubMenu) {
                  setMenuItem(props, 'defaultActive', false);
                  const childKey = uuid();
                  setMenuItem(props, 'children', [
                    { title: '子菜单1', key: childKey, _key: childKey, menuType: MenuTypeEnum.Menu }
                  ]);
                  props.output.add(childKey, `点击子菜单1`, { type: 'any' });
                  props.output.remove(getMenuItem(props).key);
                  //从父菜单，切换到子菜单，去除子项配置
                } else if (getMenuItem(props, 'menuType') === MenuTypeEnum.Menu) {
                  let removeKeys = [];
                  if (getMenuItem(props, 'children') !== undefined) {
                    let children = getMenuItem(props, 'children');
                    for (let i = 0; i < children.length; i++) {
                      if (children[i].menuType === MenuTypeEnum.Menu) {
                        removeKeys.push(children[i].key);
                      } else if (children[i].menuType === MenuTypeEnum.Group) {
                        let child = children[i].children;
                        if (child.children !== undefined) {
                          for (let j = 0; j < child.length; j++) {
                            removeKeys.push(child[j].key);
                          }
                        }
                      }
                    }
                  }
                  for (let i = 0; i < removeKeys.length; i++) {
                    props.output.remove(removeKeys[i]);
                  }
                  setMenuItem(props, 'children', undefined);
                }
              }
            }
          },
          {
            title: '子项配置',
            type: 'Array',
            description: '这里可以配置子菜单和分组菜单',
            ifVisible(props: EditorResult<Data>) {
              return getMenuItem(props, 'menuType') === MenuTypeEnum.SubMenu;
            },
            options: {
              getTitle: (item, index) => {
                //切换分组，菜单子项的标题暂时不进行改变
                if (!item.title) {
                  item.title = `子菜单${index + 1}`;
                }
                if (!item.key) {
                  item.key = uuid();
                }
                if (!item.menuType) {
                  item.menuType = MenuTypeEnum.Menu;
                }
                if (item.menuType === MenuTypeEnum.Group && item.title === `子菜单${index + 1}`) {
                  item.title = `分组菜单${index + 1}`;
                }
                return item.title;
              },
              onAdd: () => {
                const key = uuid();
                return {
                  key: key,
                  _key: key,
                  menuType: MenuTypeEnum.Menu
                };
              },
              items: [
                {
                  title: '类型',
                  type: 'Select',
                  options: [
                    { label: '子菜单', value: MenuTypeEnum.Menu },
                    { label: '分组', value: MenuTypeEnum.Group }
                  ],
                  value: 'menuType'
                },
                {
                  title: '标题',
                  type: 'TextArea',
                  value: 'title',
                  options: {
                    autoSize: { maxRows: 1 }
                  }
                },
                {
                  title: '唯一标识',
                  type: 'TextArea',
                  value: '_key',
                  options: {
                    autoSize: { maxRows: 1 }
                  }
                },
                {
                  title: '默认激活',
                  type: 'Switch',
                  ifVisible(item) {
                    return item.menuType === MenuTypeEnum.Menu;
                  },
                  value: 'defaultActive'
                }
              ]
            },
            value: {
              get(props: EditorResult<Data>) {
                return getMenuItem(props, 'children');
              },
              set(props: EditorResult<Data>, value: any[]) {
                const find = (item) => {
                  return item.map((e) => {
                    return e.key;
                  });
                };
                let afArr = [...value].map((item) => {
                  if (item.menuType === 'group' && item.children !== undefined) {
                    return find(item.children);
                  } else {
                    return item.key;
                  }
                });
                afArr = flatten(afArr);
                let beArr;
                if (getMenuItem(props, 'children') === undefined) {
                  beArr = [];
                } else {
                  beArr = getMenuItem(props, 'children').map((item) => {
                    if (item.menuType === 'group' && item.children !== undefined) {
                      return find(item.children);
                    } else {
                      return item.key;
                    }
                  });
                }
                beArr = flatten(beArr);
                //获取减少的子菜单项内容
                let list = beArr.filter((items) => {
                  if (!afArr.includes(items)) return items;
                });

                //对默认值进行互斥操作
                //1.改造value
                //2.改造data.dataSource
                let befSelected;
                let aftSelected;
                let befAct;
                let aftAct;
                let difIndex;
                let difKey;
                let newVaules: any[] = [];

                if (getMenuItem(props, 'children') === undefined) {
                  befSelected = [];
                } else {
                  befSelected = getMenuItem(props, 'children').map((item) => {
                    return {
                      key: item.key,
                      defaultActive: item.defaultActive || false,
                      menuType: item.menuType
                    };
                  });
                }

                aftSelected = [...value].map((item) => {
                  return {
                    key: item.key,
                    defaultActive: item.defaultActive || false,
                    menuType: item.menuType
                  };
                });

                if (befSelected.length === aftSelected.length) {
                  befAct = befSelected.map((item) => {
                    return item.defaultActive || false;
                  });
                  aftAct = aftSelected.map((item) => {
                    return item.defaultActive || false;
                  });

                  for (let i = 0; i < befSelected.length; i++) {
                    if (befAct[i] !== aftAct[i]) {
                      difIndex = i;
                    }
                  }

                  if (difIndex !== undefined) {
                    difKey = aftSelected[difIndex].key;
                  }

                  if (
                    aftAct[difIndex] === true &&
                    befSelected[difIndex].key === aftSelected[difIndex].key
                  ) {
                    newVaules = [...value].map((item) => {
                      if (item.key !== aftSelected[difIndex].key) {
                        item.defaultActive = false;
                      } else {
                        item.defaultActive = true;
                      }
                      return item;
                    });
                    setMenuItem(props, 'children', [...newVaules]);
                  } else {
                    setMenuItem(props, 'children', [...value]);
                  }

                  //对dataSource整体遍历
                  if (difKey !== undefined) {
                    let newval: any[] = [];
                    newval = props.data.dataSource.map((item) => {
                      if (item.key !== difKey) {
                        item.defaultActive = false;
                      }
                      if (item.menuType !== MenuTypeEnum.Menu && item.children !== undefined) {
                        item.children = [...item.children].map((chil) => {
                          if (chil.menuType === MenuTypeEnum.Menu && chil.key !== difKey) {
                            chil.defaultActive = false;
                          } else if (
                            chil.menuType === MenuTypeEnum.Group &&
                            chil.children !== undefined
                          ) {
                            chil.children = [...chil.children].map((groupChil) => {
                              if (groupChil.key !== difKey) {
                                groupChil.defaultActive = false;
                              }
                              return groupChil;
                            });
                          }
                          return chil;
                        });
                      }
                      return item;
                    });
                    props.data.dataSource = newval;
                  }
                } else {
                  setMenuItem(props, 'children', [...value]);
                }
                //减少父菜单和分组菜单的点击事件
                const schema = {
                  type: 'any'
                };
                for (let i = 0; i < list?.length; i++) {
                  props.output.remove(list[i]);
                }
                //增加父菜单和分组菜单的点击事件
                for (let i = 0; i < [...value].length; i++) {
                  props.output.add([...value][i].key, `点击${[...value][i].title}`, schema);
                }
              }
            }
          },
          ...groupItemEditors(props),
          ...menuItemsOnClick(props),
          ...groupItemsOnClick(props),
          {
            title: `点击${getMenuItem(props).title}`,
            type: '_Event',
            ifVisible(props: EditorResult<Data>) {
              return getMenuItem(props, 'menuType') === MenuTypeEnum.Menu;
            },
            options: (props: EditorResult<Data>) => {
              const menuItem = getMenuItem(props);
              return {
                outputId: menuItem.key
              };
            }
          },
          {
            title: '位置',
            items: [
              {
                title: '删除',
                type: 'Button',
                value: {
                  set(props: EditorResult<Data>) {
                    //1.删除项为子菜单项的key
                    props.output.remove(getMenuItem(props).key);
                    //2.删除项为父菜单和分组菜单的key
                    if (getMenuItem(props).menuType !== 'menu') {
                      if (getMenuItem(props).children?.length !== 0) {
                        //1).得出删除子项的所有key
                        const deletArr: string[] | any = getMenuItem(props).children?.map(
                          (item) => {
                            return item.key;
                          }
                        );
                        for (let i = 0; i < deletArr?.length; i++) {
                          //2).删除对应的output
                          props.output.remove(deletArr[i]);
                        }
                      }
                    }
                    let newval = props.data.dataSource.filter((item) => {
                      return item !== getMenuItem(props);
                    });
                    props.data.dataSource = newval;
                  }
                }
              }
            ]
          }
        ]);
    }
  }
};
