import { ajax } from '../util';
import { Data, Entity } from '../type';
import { FieldBizType, DefaultComponentNameMap, ComponentName } from '../constants';
import Refresh from './refresh';

const fileId =
  location.search
    .split('?')
    .pop()
    ?.split('&')
    .find((key) => key.startsWith('id='))
    ?.replace('id=', '') ?? '';

export default {
  // '@init'({ data }) {
  //   if (fileId) {
  //     ajax({ fileId }, { url: '/api/system/domain/entity/list' }).then(
  //       (res) => (data.domainAry = res || [])
  //     );
  //   }
  // },
  '@childAdd'({ data, inputs, outputs, logs, slots }, child, curSlot) {
    const { data: childData, name } = child;

    if (curSlot.id === 'queryContent') {
      childData.domainModel.entity = data.entity;
      childData.domainModel.isQuery = true;
      data?.childNames.queryContent.push(name);
    }

    if (curSlot.id === 'createModalContent') {
      childData.domainModel.entity = data.entity;
      childData.domainModel.isQuery = false;
      data?.childNames.createModalContent.push(name);
    }

    if (curSlot.id === 'editModalContent') {
      childData.domainModel.entity = data.entity;
      childData.domainModel.isQuery = false;
      data?.childNames.editModalContent.push(name);
    }

    if (curSlot.id === 'tableContent') {
      childData.domainModel.entity = data.entity;
      data?.childNames.tableContent.push(name);
    }
  },
  '@childRemove'({ data, inputs, outputs, logs, slots }, child, curSlot) {
    const { name } = child;

    if (curSlot.id === 'queryContent') {
      data.childNames.queryContent = data.childNames.queryContent.filter(
        (comName) => comName !== name
      );
    }
    if (curSlot.id === 'createModalContent') {
      data.childNames.createModalContent = data.childNames.createModalContent.filter(
        (comName) => comName !== name
      );
    }

    if (curSlot.id === 'editModalContent') {
      data.childNames.editModalContent = data.childNames.editModalContent.filter(
        (comName) => comName !== name
      );
    }

    if (curSlot.id === 'tableContent') {
      data.childNames.tableContent = data.childNames.tableContent.filter(
        (comName) => comName !== name
      );
    }
  },
  '@slotInputConnected'({ data, inputs, outputs, slots }, fromPin, slotId, toPin) {
    console.log(toPin, slotId);
  },
  '@slotInputDisConnected'({ data, inputs, outputs, slots }, fromPin, slotId, toPin) {
    console.log(toPin, slotId);
  },
  ':root': ({ data }: EditorResult<Data>, cate1) => {
    if (fileId) {
      ajax({ fileId }, { url: '/api/system/domain/entity/list' }).then((r) => {
        data.domainAry = r || [];
      });
    }

    cate1.title = '常规';
    cate1.items = [
      {
        title: '模型选择',
        items: [
          {
            title: '实体',
            type: 'Select',
            options(props) {
              return {
                get options() {
                  const entityList: Array<{ label: string; value: string }> = [];
                  props.data.domainAry?.forEach((domain) => {
                    domain.entityList
                      .filter((entity) => !entity.isSystem && entity.isOpen)
                      .forEach((entity) => {
                        entityList.push({
                          label: `${domain.fileName}.${entity.name}`,
                          value: `${domain.fileId}.${entity.id}`
                        });
                      });
                  });

                  return entityList;
                },
                disabled: !!props.data.domainFileId,
                placeholder: '请选择实体'
              };
            },
            value: {
              get({ data }: EditorResult<Data>) {
                return data.domainFileId ? `${data.domainFileId}.${data.entityId}` : undefined;
              },
              set({ data, output, input, getChildByName }: EditorResult<Data>, value: string = '') {
                const [domainFileId, entityId] = value.split('.');

                if (data.domainFileId !== Number(domainFileId) || data.entityId !== entityId) {
                  data.domainFileId = Number(domainFileId);
                  data.entityId = entityId;

                  const entity = data.domainAry
                    .find((d) => d.fileId === Number(domainFileId))
                    ?.entityList.find((entity) => entity.id === entityId);

                  const curEntity = JSON.parse(JSON.stringify(entity || null));

                  if (curEntity) {
                    curEntity.fieldAry.filter(
                      (field) =>
                        ![FieldBizType.MAPPING].includes(field.bizType) &&
                        !field.isPrimaryKey &&
                        !field.isPrivate
                    );

                    refreshChildComModel(data.childNames, getChildByName, curEntity);

                    data.entity = curEntity;
                  }

                  // 清空当前已选的返回字段
                  data.fieldAry = [];
                }
              }
            }
          },
          {
            title: '刷新模型实体信息',
            type: 'editorRender',
            ifVisible(props: EditorResult<Data>) {
              return !!props.data.domainFileId;
            },
            options: {
              render: Refresh,
              get domainFileId() {
                return data.domainFileId;
              },
              get entityId() {
                return data.entityId;
              },
              get entity() {
                return data.entity;
              }
            },
            value: {
              get({ data }) {
                return { domainFileId: data.domainFileId, entityId: data.entityId };
              },
              set({ data, setTitle, title, output, slot, getChildByName }, newEntity: any) {
                if (!newEntity) {
                  return;
                }

                refreshChildComModel(data.childNames, getChildByName, newEntity);
                data.entity = newEntity;
              }
            }
          }
        ]
      },
      {
        title: '立刻请求数据',
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
      },
      // {
      //   title: '返回字段',
      //   type: 'Select',
      //   options(props) {
      //     return {
      //       mode: 'tags',
      //       multiple: true,
      //       filterOption: (inputValue, opiton) => {
      //         console.log('options', opiton)
      //         return opiton.includes(inputValue)
      //       },
      //       get options() {
      //         const options = flatterEntityField(props?.data.entity)
      //         return options
      //       }
      //     };
      //   },
      //   value: {
      //     get({ data }: EditorResult<Data>) {
      //       return data.fieldAry || []
      //     },
      //     set({ data, output, input, slot }: EditorResult<Data>, value: string[]) {
      //       data.fieldAry = value
      //     }
      //   }
      // },
      // {
      //   type: 'array',
      //   // ifVisible() {
      //   //   return !!data.fieldAry && data.table?.renderType !== TableRenderType.SLOT;
      //   // },
      //   options: {
      //     editable: false,
      //     addable: false,
      //     getTitle: ({ name, mappingField }) => {
      //       return `${name}${mappingField ? '.' + mappingField.name : ''}`;
      //     },
      //     onRemove: (index: number) => {
      //       // data.fieldAry.splice(index, 1);
      //     }
      //   },
      //   value: {
      //     get({}: EditorResult<Data>) {
      //       // return (
      //       //   data.fieldAry.filter((field) => field.bizType !== FieldBizType.FRONT_CUSTOM) ?? []
      //       // );
      //     },
      //     set({ data, output, input, slot, ...res }: EditorResult<Data>, val: any[]) {
      //       // const curFields = val;
      //       // if (curFields.length > 0) {
      //       //   curFields.push(handleCustomColumnSlot(data, slot));
      //       // }
      //       // handleTableColumnChange(curFields, data.fieldAry, slot);
      //       // data.fieldAry = curFields;
      //     }
      //   }
      // },
      {
        title: '显示新增弹窗',
        type: 'Switch',
        value: {
          get({ data }: EditorResult<Data>) {
            return data.createModalOpen;
          },
          set({ data }: EditorResult<Data>, value: boolean) {
            data.createModalOpen = value;
          }
        }
      },
      {
        title: '显示编辑弹窗',
        type: 'Switch',
        value: {
          get({ data }: EditorResult<Data>) {
            return data.editModalOpen;
          },
          set({ data }: EditorResult<Data>, value: boolean) {
            data.editModalOpen = value;
          }
        }
      },
      {
        title: '事件',
        items: [
          {
            title: '新建对话框确认输出',
            type: '_Event',
            options: ({ data, focusArea }: EditorResult<Data>) => {
              return {
                outputId: 'onCreateConfirm',
                slotId: 'createModalContent'
              };
            }
          },
          {
            title: '新建对话框取消输出',
            type: '_Event',
            options: ({ data, focusArea }: EditorResult<Data>) => {
              return {
                outputId: 'onCancelForCreateModal',
                slotId: 'createModalContent'
              };
            }
          },
          {
            title: '编辑对话框确认输出',
            type: '_Event',
            options: ({ data, focusArea }: EditorResult<Data>) => {
              return {
                outputId: 'onEditConfirm',
                slotId: 'editModalContent'
              };
            }
          },
          {
            title: '编辑对话框取消输出',
            type: '_Event',
            options: ({ data, focusArea }: EditorResult<Data>) => {
              return {
                outputId: 'onCancelForEditModal',
                slotId: 'editModalContent'
              };
            }
          }
        ]
      }
    ];
  }
};

const refreshChildComModel = (childNames, getChildByName, curEntity) => {
  childNames.queryContent.forEach((comName) => {
    const child = getChildByName(comName);

    if (child.def.namespace === 'mybricks.normal-pc.form-container') {
      child.data.domainModel.entity = curEntity;
    }
  });

  childNames.createModalContent.forEach((comName) => {
    const child = getChildByName(comName);

    if (child.def.namespace === 'mybricks.normal-pc.form-container') {
      child.data.domainModel.entity = curEntity;
    }
  });

  childNames.editModalContent.forEach((comName) => {
    const child = getChildByName(comName);

    if (child.def.namespace === 'mybricks.normal-pc.form-container') {
      child.data.domainModel.entity = curEntity;
    }
  });

  childNames.tableContent.forEach((comName) => {
    const child = getChildByName(comName);

    if (child.def.namespace === 'mybricks.normal-pc.table') {
      child.data.domainModel.entity = curEntity;
    }
  });
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
