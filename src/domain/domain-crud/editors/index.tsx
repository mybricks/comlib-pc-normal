import { ajax } from '../util';
import { Data } from '../type';
import { FieldBizType, DefaultComponentNameMap, ComponentName } from '../constants';

export default {
  '@init'({ data }) {
    const id =
      location.search
        .split('?')
        .pop()
        ?.split('&')
        .find((key) => key.startsWith('id='))
        ?.replace('id=', '') ?? '';

    id &&
      ajax({ fileId: id }, { url: '/api/system/domain/entity/list' }).then(
        (res) => (data.domainAry = res || [])
      );
  },
  '@childAdd'({ data, inputs, outputs, logs, slots }, child, curSlot) {
    const { data: childData } = child;

    if (curSlot.id === 'queryContent') {
      childData.domainModel.entity = data.entity;
    }

    if (curSlot.id === 'createModalContent') {
      childData.domainModel.entity = data.entity;
    }

    if (curSlot.id === 'editModalContent') {
      childData.domainModel.entity = data.entity;
    }

    if (curSlot.id === 'tableContent') {
      childData.domainData = data;
    }
  },
  '@childRemove'({ data, inputs, outputs, logs, slots }, child) {},
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
        title: '模型选择',
        items: [
          {
            title: '实体',
            type: 'Select',
            options(props) {
              return {
                get options() {
                  const entityList: Array<{ label: string; value: string }> = [];
                  console.log(props.data.domainAry);
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
                }
              };
            },
            value: {
              get({ data }: EditorResult<Data>) {
                return data.domainFileId ? `${data.domainFileId}.${data.entityId}` : undefined;
              },
              set({ data, output, input }: EditorResult<Data>, value: string = '') {
                const [domainFileId, entityId] = value.split('.');

                if (data.domainFileId !== Number(domainFileId) || data.entityId !== entityId) {
                  // data.fieldAry = [];
                  // data.formFieldAry = [];
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

                    data.entity = curEntity;
                  }
                }
              }
            }
          }
        ]
      },
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
