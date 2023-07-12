import { OutputIds, QueryMap } from '../constants';
import { Data, Entity } from '../type';
import { getSchema, refreshSchema } from '../util';
// import { FieldBizType, DefaultComponentNameMap, ComponentName } from '../constants';
// import Refresh from './refresh';

export default {
  // '@init'({ data }) {
  // },
  '@childAdd'({ data, inputs, outputs, logs, slots }, child, curSlot) {
    const { data: childData, name } = child;

    if (curSlot.id === 'queryContent') {
      setFormDomainModel(data.domainModel, childData, true);

      childData.config.layout = 'inline';
      childData.formItemColumn = 3;
      childData.actions.visible = false;
      childData.actions.span = 8;
      childData.actions.items = [
        {
          title: '查询',
          type: 'primary',
          isDefault: true,
          visible: true,
          outputId: 'onClickSubmit',
          key: 'submit'
        },
        {
          title: '取消',
          isDefault: false,
          visible: false,
          outputId: 'onClickCancel',
          key: 'cancel'
        }
      ];
      childData.items.forEach((item) => {
        item.span = 8;
      });
      data?.childNames.queryContent.push(name);
    }

    // if (curSlot.id === 'createModalContent') {
    //   setFormDomainModel(data.domainModel, childData, false);

    //   childData.actions.visible = false;
    //   data?.childNames.createModalContent.push(name);
    // }

    // if (curSlot.id === 'editModalContent') {
    //   setFormDomainModel(data.domainModel, childData, false);

    //   childData.actions.visible = false;
    //   data?.childNames.editModalContent.push(name);
    // }

    if (curSlot.id === 'tableContent') {
      if (childData.domainModel) {
        childData.domainModel.entity = data.domainModel.query.entity;
      } else {
        childData.domainModel = {
          entity: data.domainModel.query.entity
        };
      }

      childData.usePagination = !!data.domainModel?.query?.abilitySet?.includes('PAGE');

      data?.childNames.tableContent.push(name);
      if (!childData.paginationConfig) {
        childData.paginationConfig = {};
      }
      childData.paginationConfig.pageSize = data.pageSize;
    }
  },
  '@childRemove'({ data, inputs, outputs, logs, slots }, child, curSlot) {
    const { name } = child;

    if (curSlot.id === 'queryContent') {
      data.childNames.queryContent = data.childNames.queryContent.filter(
        (comName) => comName !== name
      );
    }
    // if (curSlot.id === 'createModalContent') {
    //   data.childNames.createModalContent = data.childNames.createModalContent.filter(
    //     (comName) => comName !== name
    //   );
    // }

    // if (curSlot.id === 'editModalContent') {
    //   data.childNames.editModalContent = data.childNames.editModalContent.filter(
    //     (comName) => comName !== name
    //   );
    // }

    if (curSlot.id === 'tableContent') {
      data.childNames.tableContent = data.childNames.tableContent.filter(
        (comName) => comName !== name
      );
    }
  },
  '@domainModelUpdated'(params: EditorResult<Data>, value) {
    const { data, getChildByName, inputs, outputs } = params;
    data.domainModel = value.domainModel;
    const abilitySet = data.domainModel?.query?.abilitySet;

    refreshIO({
      data,
      abilitySet,
      inputs,
      outputs
    });
    refreshSchema({
      data,
      abilitySet,
      outputs
    });
    refreshChildComModel(data.childNames, getChildByName, data.domainModel);
  },
  '@domainModelRemoved'(params: EditorResult<Data>, value) {
    const { data, getChildByName } = params;
    // console.log(params, value)
    if (value.domainModel.id === data.domainModel.id) {
      // Todo 需要重置
      data.domainModel = undefined;
      refreshChildComModel(data.childNames, getChildByName, data.domainModel);
    }
  },
  '@slotInputConnected'({ data, inputs, outputs, slots }, fromPin, slotId, toPin) {
    console.log(toPin, slotId);
  },
  '@slotInputDisConnected'({ data, inputs, outputs, slots }, fromPin, slotId, toPin) {
    console.log(toPin, slotId);
  },
  ':root': ({ data }: EditorResult<Data>, cate1) => {
    cate1.title = '常规';
    cate1.items = [
      {
        title: '领域模型',
        items: [
          {
            title: '模型选择',
            type: '_domainModelSelect',
            value: {
              get({ data }: EditorResult<Data>) {
                return data.domainModel;
              },
              set({ data, getChildByName, inputs, outputs }: EditorResult<Data>, value) {
                data.domainModel = value;
                const abilitySet = data.domainModel?.query?.abilitySet;
                refreshIO({
                  data,
                  abilitySet,
                  inputs,
                  outputs
                });
                refreshSchema({
                  data,
                  abilitySet,
                  outputs
                });
                refreshChildComModel(data.childNames, getChildByName, data.domainModel);
                console.log(data, 'data');
              }
            }
          }
        ]
      },
      {
        title: '查询区',
        description: '可拖入表单容器组件，配置字段进行查询',
        type: 'Switch',
        ifVisible({ data }: EditorResult<Data>) {
          return data.domainModel?.query?.abilitySet?.includes('SELECT');
        },
        value: {
          get({ data }: EditorResult<Data>) {
            return typeof data?.queryContent?.visible === 'undefined'
              ? true
              : data.queryContent.visible;
          },
          set({ data, slots }: EditorResult<Data>, value: boolean) {
            if (typeof data.queryContent === 'undefined') {
              data.queryContent = {
                visible: true,
                slotId: 'queryContent'
              };
            }

            if (value) {
              const slotId = 'queryContent';
              slots.add({ id: slotId, title: '查询区', type: 'scope' });
            } else {
              if (slots.get(data.queryContent.slotId)) {
                slots.remove(data.queryContent.slotId);
              }
            }

            data.queryContent.visible = value;
          }
        }
      },
      {
        title: '自定义操作区',
        description: '默认操作不满足则可以开启操作区插槽，可拖入任意组件',
        type: 'Switch',
        ifVisible({ data }: EditorResult<Data>) {
          return !!data.domainModel;
        },
        value: {
          get({ data }: EditorResult<Data>) {
            return data.actions.useSlot;
          },
          set({ data }: EditorResult<Data>, value: boolean) {
            data.actions.useSlot = value;
          }
        }
      },
      {
        title: '每页显示条数',
        type: 'inputNumber',
        options: [{ min: 0, max: 1000, width: 100 }],
        ifVisible({ data }: EditorResult<Data>) {
          return !!data.domainModel?.query?.abilitySet?.includes('PAGE');
        },
        value: {
          get({ data }: EditorResult<Data>) {
            return [data.pageSize];
          },
          set({ data, getChildByName }: EditorResult<Data>, value: boolean) {
            data.pageSize = value[0];
            data.childNames?.tableContent?.forEach((name) => {
              const child = getChildByName(name);
              if (child.def.namespace === 'mybricks.normal-pc.table') {
                if (!child.data.paginationConfig) {
                  child.data.paginationConfig = {};
                }
                child.data.paginationConfig.pageSize = data.pageSize;
              }
            });
          }
        }
      },
      {
        title: '立即请求数据',
        description: '页面初始化时自动请求一次数据',
        type: 'Switch',
        value: {
          get({ data }: EditorResult<Data>) {
            return data.isImmediate;
          },
          set({ data }: EditorResult<Data>, value: boolean) {
            data.isImmediate = value;
          }
        }
      }
      // {
      //   title: '显示新建对话窗',
      //   type: 'Switch',
      //   ifVisible({ data }: EditorResult<Data>) {
      //     return data.domainModel?.query?.abilitySet?.includes('INSERT');
      //   },
      //   value: {
      //     get({ data }: EditorResult<Data>) {
      //       return data.createModalOpen;
      //     },
      //     set({ data }: EditorResult<Data>, value: boolean) {
      //       data.createModalOpen = value;
      //       data.editModalOpen = false;
      //     }
      //   }
      // },
      // {
      //   title: '显示编辑对话窗',
      //   type: 'Switch',
      //   ifVisible({ data }: EditorResult<Data>) {
      //     return data.domainModel?.query?.abilitySet?.includes('UPDATE');
      //   },
      //   value: {
      //     get({ data }: EditorResult<Data>) {
      //       return data.editModalOpen;
      //     },
      //     set({ data }: EditorResult<Data>, value: boolean) {
      //       data.editModalOpen = value;
      //       data.createModalOpen = false;
      //     }
      //   }
      // },
      // {
      //   title: '新建对话框事件',
      //   ifVisible({ data }: EditorResult<Data>) {
      //     return data.domainModel?.query?.abilitySet?.includes('INSERT');
      //   },
      //   items: [
      //     {
      //       title: '确认输出',
      //       type: '_Event',
      //       options: ({ data, focusArea }: EditorResult<Data>) => {
      //         return {
      //           outputId: 'onCreateConfirm',
      //           slotId: 'createModalContent'
      //         };
      //       }
      //     },
      //     {
      //       title: '取消输出',
      //       type: '_Event',
      //       options: ({ data, focusArea }: EditorResult<Data>) => {
      //         return {
      //           outputId: 'onCancelForCreateModal',
      //           slotId: 'createModalContent'
      //         };
      //       }
      //     }
      //   ]
      // },
      // {
      //   title: '编辑对话框事件',
      //   ifVisible({ data }: EditorResult<Data>) {
      //     return data.domainModel?.query?.abilitySet?.includes('UPDATE');
      //   },
      //   items: [
      //     {
      //       title: '确认输出',
      //       type: '_Event',
      //       options: ({ data, focusArea }: EditorResult<Data>) => {
      //         return {
      //           outputId: 'onEditConfirm',
      //           slotId: 'editModalContent'
      //         };
      //       }
      //     },
      //     {
      //       title: '取消输出',
      //       type: '_Event',
      //       options: ({ data, focusArea }: EditorResult<Data>) => {
      //         return {
      //           outputId: 'onCancelForEditModal',
      //           slotId: 'editModalContent'
      //         };
      //       }
      //     }
      //   ]
      // }
    ];
  },
  '[data-query-action]': ({ data, focusArea }: EditorResult<Data>, cate1) => {
    const dataSet = focusArea.dataset;
    const actionsId = dataSet.queryAction;

    const item = data.queryActions.items.find((item) => item.key === actionsId);

    cate1.title = '查询操作';
    cate1.items = [
      {
        title: '名称',
        type: 'Text',
        value: {
          get({ data }: EditorResult<Data>) {
            return item?.title;
          },
          set({ data }: EditorResult<Data>, value: string) {
            if (item) {
              item.title = value;
            } else {
              console.warn(`没有找到对应的查询操作: ${actionsId}`);
            }
          }
        }
      }
    ];

    return {
      title: '按钮'
    };
  }
  // '[data-actions-id]': ({ data, focusArea }: EditorResult<Data>, cate1) => {
  //   const dataSet = focusArea.dataset;
  //   const actionsId = dataSet.actionsId;

  //   const resultMap = {
  //     onOkForCreate: {
  //       title: '确认输出',
  //       outputId: 'onCreateConfirm',
  //       slotId: 'createModalContent'
  //     },
  //     onCancelForCreate: {
  //       title: '取消输出',
  //       outputId: 'onCancelForCreateModal',
  //       slotId: 'createModalContent'
  //     },
  //     onCancelForEdit: {
  //       title: '取消输出',
  //       outputId: 'onCancelForEditModal',
  //       slotId: 'editModalContent'
  //     },
  //     onOkForEdit: {
  //       title: '确认输出',
  //       outputId: 'onEditConfirm',
  //       slotId: 'editModalContent'
  //     }
  //   };

  //   cate1.title = '对话框操作';
  //   cate1.items = [
  //     {
  //       title: resultMap[actionsId].title,
  //       type: '_Event',
  //       options: ({ data, focusArea }: EditorResult<Data>) => {
  //         return {
  //           outputId: resultMap[actionsId].outputId,
  //           slotId: resultMap[actionsId].slotId
  //         };
  //       }
  //     }
  //   ];
  // }
};

const refreshChildComModel = (childNames, getChildByName, domainModel) => {
  const curEntity = JSON.parse(JSON.stringify(domainModel.query.entity || null));

  childNames.queryContent.forEach((comName) => {
    const child = getChildByName(comName);

    if (child.def.namespace === 'mybricks.normal-pc.form-container') {
      child.data.domainModel.entity = curEntity;
      child.data.domainModel.type = domainModel.type;
    }
  });

  // childNames.createModalContent.forEach((comName) => {
  //   const child = getChildByName(comName);

  //   if (child.def.namespace === 'mybricks.normal-pc.form-container') {
  //     child.data.domainModel.entity = curEntity;
  //     child.data.domainModel.type = domainModel.type;
  //   }
  // });

  // childNames.editModalContent.forEach((comName) => {
  //   const child = getChildByName(comName);

  //   if (child.def.namespace === 'mybricks.normal-pc.form-container') {
  //     child.data.domainModel.entity = curEntity;
  //     child.data.domainModel.type = domainModel.type;
  //   }
  // });

  childNames.tableContent.forEach((comName) => {
    const child = getChildByName(comName);

    if (child.def.namespace === 'mybricks.normal-pc.table') {
      child.data.domainModel.entity = curEntity;
      child.data.usePagination = domainModel?.query?.abilitySet?.includes('PAGE');
    }
  });
};

const refreshIO = (params) => {
  const { data, inputs, outputs, abilitySet } = params;

  const insertPin = inputs.get('create');
  const editPin = inputs.get('editById');
  const deletePin = inputs.get('deleteById');
  const pageChangePin = inputs.get('pageChange');

  const insertThenPin = outputs.get(OutputIds.INSERT.THEN);
  const editThenPin = outputs.get(OutputIds.EDIT.THEN);
  const deleteThenPin = outputs.get(OutputIds.DELETE.THEN);
  const pageChangeThenPin = outputs.get(OutputIds.PAGE_CHANGE.THEN);

  const insertCatchPin = outputs.get(OutputIds.INSERT.CATCH);
  const editCatchPin = outputs.get(OutputIds.EDIT.CATCH);
  const deleteCatchPin = outputs.get(OutputIds.DELETE.CATCH);
  const pageChangeCatchPin = outputs.get(OutputIds.PAGE_CHANGE.CATCH);

  if (abilitySet.includes('INSERT')) {
    // 'create', '新建记录', { type: 'object', properties: {} }
    if (!insertThenPin) {
      outputs.add({
        id: OutputIds.INSERT.THEN,
        title: '成功',
        schema: getSchema(data, [QueryMap.INSERT, QueryMap.THEN])
      });
    }
    if (!insertCatchPin) {
      outputs.add({
        id: OutputIds.INSERT.CATCH,
        title: '失败',
        schema: getSchema(data, [QueryMap.INSERT, QueryMap.CATCH])
      });
    }
    if (!insertPin) {
      inputs.add({
        id: 'create',
        title: '新增记录',
        schema: { type: 'object', properties: {} },
        desc: '新建一条记录'
      });
    }
    inputs.get('create').setRels([OutputIds.INSERT.THEN, OutputIds.INSERT.CATCH]);
  } else {
    if (insertPin) {
      inputs.remove('create');
    }
    if (insertThenPin) {
      outputs.remove(OutputIds.INSERT.THEN);
    }
    if (insertCatchPin) {
      outputs.remove(OutputIds.INSERT.CATCH);
    }
  }

  if (abilitySet.includes('UPDATE')) {
    if (!editThenPin) {
      outputs.add({
        id: OutputIds.EDIT.THEN,
        title: '成功',
        schema: getSchema(data, [QueryMap.EDIT, QueryMap.THEN])
      });
    }
    if (!editCatchPin) {
      outputs.add({
        id: OutputIds.EDIT.CATCH,
        title: '失败',
        schema: getSchema(data, [QueryMap.EDIT, QueryMap.CATCH])
      });
    }
    if (!editPin) {
      // inputs.add('editById', '编辑记录', { type: 'object', properties: {} });
      inputs.add({
        id: 'editById',
        title: '编辑记录',
        schema: { type: 'object', properties: {} },
        desc: '根据 ID（主键） 编辑当前行记录'
      });
    }
    inputs.get('editById').setRels([OutputIds.EDIT.THEN, OutputIds.EDIT.CATCH]);
  } else {
    if (editPin) {
      inputs.remove('editById');
    }
    if (editThenPin) {
      outputs.remove(OutputIds.EDIT.THEN);
    }
    if (editCatchPin) {
      outputs.remove(OutputIds.EDIT.CATCH);
    }
  }

  if (abilitySet.includes('DELETE')) {
    if (!deleteThenPin) {
      outputs.add({
        id: OutputIds.DELETE.THEN,
        title: '成功',
        schema: getSchema(data, [QueryMap.DELETE, QueryMap.THEN])
      });
    }
    if (!deleteCatchPin) {
      outputs.add({
        id: OutputIds.DELETE.CATCH,
        title: '失败',
        schema: getSchema(data, [QueryMap.DELETE, QueryMap.CATCH])
      });
    }
    if (!deletePin) {
      // inputs.add('deleteById', '删除记录', { type: 'object', properties: {} });
      inputs.add({
        id: 'deleteById',
        title: '删除记录',
        schema: { type: 'object', properties: {} },
        desc: '根据 ID（主键） 删除当前行记录'
      });
    }
    inputs.get('deleteById').setRels([OutputIds.DELETE.THEN, OutputIds.DELETE.CATCH]);
  } else {
    if (deletePin) {
      inputs.remove('deleteById');
    }
    if (deleteThenPin) {
      outputs.remove(OutputIds.DELETE.THEN);
    }
    if (deleteCatchPin) {
      outputs.remove(OutputIds.DELETE.CATCH);
    }
  }

  if (abilitySet.includes('PAGE')) {
    if (!pageChangeThenPin) {
      outputs.add({
        id: OutputIds.PAGE_CHANGE.THEN,
        title: '成功',
        schema: getSchema(data, [QueryMap.QUERY, OutputIds.QUERY.THEN], {
          pageNum: {
            title: '页码',
            type: 'number'
          },
          total: {
            title: '数据总数',
            type: 'number'
          }
        })
      });
    }
    if (!pageChangeCatchPin) {
      outputs.add({
        id: OutputIds.PAGE_CHANGE.CATCH,
        title: '失败',
        schema: getSchema(data, [QueryMap.QUERY, QueryMap.CATCH])
      });
    }
    if (!pageChangePin) {
      // inputs.add('pageChange', '分页变化', {
      //   type: 'object',
      //   properties: {
      //     pageNum: {
      //       title: '页码',
      //       type: 'number'
      //     },
      //     pageSize: {
      //       title: '每页条数',
      //       type: 'number'
      //     }
      //   }
      // });
      inputs.add({
        id: 'pageChange',
        title: '分页变化',
        schema: {
          type: 'object',
          properties: {
            pageNum: {
              title: '页码',
              type: 'number'
            },
            pageSize: {
              title: '每页条数',
              type: 'number'
            }
          }
        },
        desc: '触发分页变化'
      });
    }
    inputs.get('pageChange').setRels([OutputIds.PAGE_CHANGE.THEN, OutputIds.PAGE_CHANGE.CATCH]);
  } else {
    if (pageChangePin) {
      inputs.remove('pageChange');
    }
    if (pageChangeThenPin) {
      outputs.remove(OutputIds.PAGE_CHANGE.THEN);
    }
    if (pageChangeCatchPin) {
      outputs.remove(OutputIds.PAGE_CHANGE.CATCH);
    }
  }
};

/**
 * 扁平化实体数据，抽取字段名
 * @param entity
 */
export const flatterEntityField = (
  entity: Entity,
  parentField: string = '',
  parsedEntityIds: string[] = []
) => {
  if (!Array.isArray(entity?.fieldAry) || parsedEntityIds.includes(entity.id)) {
    return [];
  }
  parsedEntityIds.push(entity.id);
  const fieldRecord: { label: string; value: string }[] = [];

  entity.fieldAry
    .filter((item) => !item.isPrivate)
    .forEach((field) => {
      if (!['relation', 'mapping'].includes(field.bizType)) {
        fieldRecord.push({
          value: field.id,
          label: parentField ? `${parentField}.${field.name}` : field.name
        });
      } else {
        //@ts-ignore
        const relationField = flatterEntityField(
          field.mapping?.entity,
          field.name,
          parsedEntityIds
        );
        fieldRecord.push(...relationField);
      }
    });

  return fieldRecord;
};

const setFormDomainModel = (domainModel, childData, isQuery) => {
  if (domainModel) {
    if (childData.domainModel) {
      childData.domainModel.entity = domainModel.query.entity;
      childData.domainModel.isQuery = isQuery;
      childData.domainModel.type = domainModel.type;
    } else {
      childData.domainModel = {
        entity: domainModel.query.entity,
        isQuery: isQuery,
        type: domainModel.type
      };
    }
  }
};
