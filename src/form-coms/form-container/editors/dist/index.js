'use strict';
var __rest =
  (this && this.__rest) ||
  function (s, e) {
    var t = {};
    for (var p in s)
      if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0) t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === 'function')
      for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
        if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
          t[p[i]] = s[p[i]];
      }
    return t;
  };
var __spreadArrays =
  (this && this.__spreadArrays) ||
  function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
      for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++) r[k] = a[j];
    return r;
  };
exports.__esModule = true;
var antd_1 = require('antd');
var actions_1 = require('./actions');
var constants_1 = require('../constants');
var schema_1 = require('../schema');
var utils_1 = require('../../../utils');
function fieldNameCheck(data, name) {
  var fieldNameList = data.items.map(function (item) {
    return item.name;
  });
  if (fieldNameList.includes(name)) {
    return true;
  } else {
    return false;
  }
}
function getFormItemProp(_a, name) {
  var data = _a.data,
    id = _a.id;
  try {
    var item = data.items.find(function (item) {
      return item.id === id;
    });
    return item === null || item === void 0 ? void 0 : item[name];
  } catch (e) {
    console.error(e);
  }
}
function setFormItemProps(_a, name, value) {
  var data = _a.data,
    id = _a.id;
  try {
    var item =
      data.items.find(function (item) {
        return item.id === id;
      }) || {};
    item[name] = value;
  } catch (e) {
    console.error(e);
  }
}
exports['default'] = {
  '@inputConnected': function (_a, fromPin, toPin) {
    var data = _a.data,
      outputs = _a.outputs;
    if (toPin.id === constants_1.inputIds.SUBMIT_AND_MERGE) {
      if (fromPin.schema.type === 'object') {
        data.paramsSchema = fromPin.schema;
      } else {
        data.paramsSchema = {};
      }
      schema_1.refreshParamsSchema(data, outputs);
    }
  },
  '@inputDisConnected': function (_a, fromPin, toPin) {
    var data = _a.data,
      outputs = _a.outputs;
    if (toPin.id === constants_1.inputIds.SUBMIT_AND_MERGE) {
      data.paramsSchema = {};
      schema_1.refreshParamsSchema(data, outputs);
    }
  },
  '@childAdd': function (_a, child, curSlot) {
    var data = _a.data,
      inputs = _a.inputs,
      outputs = _a.outputs,
      logs = _a.logs,
      slots = _a.slots;
    // console.log(child, curSlot)
    if (curSlot.id === 'content') {
      var id_1 = child.id,
        inputDefs = child.inputDefs,
        outputDefs = child.outputDefs;
      var item = data.items.find(function (item) {
        return item.id === id_1;
      });
      var com = outputDefs.find(function (item) {
        return item.id === 'returnValue';
      });
      if (item) {
        item.schema = com.schema;
      } else {
        var nowC = data.nameCount++;
        data.items.push({
          id: id_1,
          schema: com.schema,
          name: '',
          label: '\u8868\u5355\u9879' + nowC,
          widthOption: 'span',
          span: 24 / data.formItemColumn,
          colon: 'default',
          labelAlign: 'default',
          labelAutoWrap: 'default',
          hiddenLabel: false,
          descriptionStyle: {
            whiteSpace: 'pre-wrap',
            lineHeight: '12px',
            letterSpacing: '0px',
            fontSize: '12px',
            fontWeight: 400,
            color: 'rgba(0, 0, 0, 0.45)',
            fontStyle: 'normal'
          },
          labelStyle: {
            lineHeight: '14px',
            letterSpacing: '0px',
            fontSize: '14px',
            fontWeight: 400,
            color: 'rgba(0, 0, 0, 0.85)',
            fontStyle: 'normal'
          },
          inlineMargin: [0, 16, 24, 0],
          visible: true
        });
      }
      schema_1.refreshSchema({ data: data, inputs: inputs, outputs: outputs, slots: slots });
    }
  },
  '@childRemove': function (_a, _b) {
    var data = _a.data,
      inputs = _a.inputs,
      outputs = _a.outputs,
      logs = _a.logs,
      slots = _a.slots;
    var id = _b.id,
      title = _b.title;
    data.items = data.items.filter(function (item) {
      return item.id !== id;
    });
    schema_1.refreshSchema({ data: data, inputs: inputs, outputs: outputs, slots: slots });
  },
  // '@_setFormItem'({data, inputs, outputs, children, logs, slots}, {id, schema}) {//As schema
  //   const item = data.items.find(item => item.id === id)
  //   // console.log('_setFormItem', id)
  //   if (item) {
  //     // console.log('_setFormItem item')
  //     item.schema = schema
  //   } else {
  //     const nowC = data.nameCount++
  //     data.items.push({
  //       id,
  //       schema,
  //       name: `item${nowC}`,
  //       label: `表单项${nowC}`,
  //       span: 24,
  //       visible: true,
  //     })
  //   }
  //   refreshSchema({data, inputs, outputs, slots})
  // },
  '@parentUpdated': function (_a, _b) {
    var id = _a.id,
      data = _a.data,
      parent = _a.parent;
    var schema = _b.schema;
    if (schema === 'mybricks.normal-pc.form-container/form-item') {
      // parent['@_setFormItem']({id, schema: { type: 'object', properties: {} }})
      data.isFormItem = true;
      data.actions.visible = false;
    } else {
      data.isFormItem = false;
    }
  },
  // '@init': ({ data, setDesc, setAutoRun, isAutoRun, slot }) => {
  //   console.log('@init', slot.get('content'))
  // },
  ':root': function (_a, cate1, cate2) {
    var data = _a.data,
      output = _a.output;
    cate1.items = [
      {
        title: '布局',
        items: [
          {
            title: '类型',
            type: 'Select',
            options: [
              { label: '水平', value: 'horizontal' },
              { label: '垂直', value: 'vertical' },
              { label: '内联', value: 'inline' }
            ],
            value: {
              get: function (_a) {
                var _b;
                var data = _a.data;
                return (
                  ((_b = data.config) === null || _b === void 0 ? void 0 : _b.layout) || data.layout
                );
              },
              set: function (_a, value) {
                var data = _a.data,
                  inputs = _a.inputs;
                data.config.layout = value;
                // refreshFormItemPropsSchema({ data, inputs });
              }
            }
          },
          {
            title: '每行列数',
            type: 'Slider',
            description:
              '每行的表单项个数，可以实现平均分布各表单项及操作项，仅对“宽度配置”为“24栅格”的表单项及操作项生效',
            options: [{ max: 6, min: 1, steps: 1, formatter: '个/行' }],
            value: {
              get: function (_a) {
                var data = _a.data;
                return data.formItemColumn;
              },
              set: function (_a, value) {
                var data = _a.data;
                data.formItemColumn = value;
                data.actions.span = 24 / value;
                data.items.forEach(function (item) {
                  item.span = 24 / value;
                });
              }
            }
          }
        ]
      },
      {
        title: '添加表单项',
        type: 'comSelector',
        options: {
          schema: 'mybricks.normal-pc.form-container/*',
          type: 'add'
        },
        value: {
          set: function (_a, namespace) {
            var data = _a.data,
              slot = _a.slot;
            slot.get('content').addCom(namespace, false, { deletable: true, movable: true });
          }
        }
      },
      {
        title: '提交隐藏表单项',
        type: 'Switch',
        description: '提交时收集被隐藏的表单项字段并进行校验',
        value: {
          get: function (_a) {
            var data = _a.data;
            return data.submitHiddenFields;
          },
          set: function (_a, val) {
            var data = _a.data;
            data.submitHiddenFields = val;
          }
        }
      },
      {
        title: '标题',
        ifVisible: function (_a) {
          var _b;
          var data = _a.data;
          return (
            (((_b = data.config) === null || _b === void 0 ? void 0 : _b.layout) || data.layout) ===
            'horizontal'
          );
        },
        items: [
          {
            title: '宽度类型',
            type: 'Select',
            options: [
              { label: '固定像素', value: 'px' },
              { label: '24 栅格', value: 'span' }
            ],
            value: {
              get: function (_a) {
                var data = _a.data;
                return data.labelWidthType;
              },
              set: function (_a, value) {
                var data = _a.data;
                data.labelWidthType = value;
              }
            }
          },
          {
            title: '标题宽度(px)',
            type: 'inputNumber',
            options: [{ min: 1 }],
            ifVisible: function (_a) {
              var data = _a.data;
              return data.labelWidthType === 'px';
            },
            value: {
              get: function (_a) {
                var data = _a.data;
                return [data.labelWidth];
              },
              set: function (_a, value) {
                var data = _a.data;
                data.labelWidth = value[0];
              }
            }
          },
          {
            title: '标题宽度(栅格)',
            type: 'Slider',
            options: [{ max: 24, min: 1, steps: 1, formatter: '格' }],
            ifVisible: function (_a) {
              var data = _a.data;
              return data.labelWidthType === 'span';
            },
            value: {
              get: function (_a) {
                var data = _a.data;
                return data.labelCol;
              },
              set: function (_a, value) {
                var data = _a.data;
                data.labelCol = value;
              }
            }
          },
          {
            title: '显示冒号',
            type: 'Switch',
            value: {
              get: function (_a) {
                var _b;
                var data = _a.data;
                return (
                  ((_b = data.config) === null || _b === void 0 ? void 0 : _b.colon) || data.colon
                );
              },
              set: function (_a, value) {
                var data = _a.data;
                data.config.colon = value;
              }
            }
          },
          {
            title: '自动换行',
            type: 'Switch',
            value: {
              get: function (_a) {
                var _b;
                var data = _a.data;
                return (_b = data.config) === null || _b === void 0 ? void 0 : _b.labelWrap;
              },
              set: function (_a, value) {
                var data = _a.data;
                data.config.labelWrap = value;
              }
            }
          },
          {
            title: '对齐方式',
            type: 'Radio',
            options: [
              { label: '左对齐', value: 'left' },
              { label: '右对齐', value: 'right' }
            ],
            value: {
              get: function (_a) {
                var _b;
                var data = _a.data;
                return (_b = data.config) === null || _b === void 0 ? void 0 : _b.labelAlign;
              },
              set: function (_a, value) {
                var data = _a.data;
                data.config.labelAlign = value;
              }
            }
          }
        ]
      },
      // {
      //   title: '禁用状态',
      //   type: 'Switch',
      //   description: '开启后，所以表单项和操作项都会被禁用',
      //   value: {
      //     get({ data }: EditorResult<Data>) {
      //       return data.config.disabled
      //     },
      //     set({ data }: EditorResult<Data>, val: boolean) {
      //       data.config.disabled = val
      //     }
      //   }
      // },
      {
        title: '事件',
        items: [
          {
            title: '字段值更新',
            type: '_event',
            options: function (_a) {
              var data = _a.data;
              return {
                outputId: constants_1.outputIds.ON_VALUES_CHANGE
              };
            }
          }
        ]
      }
    ];
    if (!data.isFormItem) {
      cate2.title = '操作区';
      cate2.items = actions_1.actionsEditor(data, output).items;
    }
  },
  ':child(mybricks.normal-pc.form-container/form-item)': {
    title: '表单项',
    items: [
      {
        title: '显示标题',
        type: 'Switch',
        value: {
          get: function (_a) {
            var id = _a.id,
              data = _a.data;
            return !getFormItemProp({ data: data, id: id }, 'hiddenLabel');
          },
          set: function (_a, val) {
            var id = _a.id,
              data = _a.data;
            setFormItemProps({ data: data, id: id }, 'hiddenLabel', !val);
          }
        }
      },
      {
        title: '标题',
        type: 'text',
        ifVisible: function (_a) {
          var id = _a.id,
            data = _a.data;
          return !getFormItemProp({ data: data, id: id }, 'hiddenLabel');
        },
        value: {
          get: function (_a) {
            var id = _a.id,
              data = _a.data;
            return getFormItemProp({ data: data, id: id }, 'label');
          },
          set: function (_a, val) {
            var id = _a.id,
              data = _a.data,
              slot = _a.slot;
            var item = data.items.find(function (item) {
              return item.id === id;
            });
            if (item) {
              if (item === null || item === void 0 ? void 0 : item.slotAfter) {
                slot.setTitle(
                  item === null || item === void 0 ? void 0 : item.slotAfter,
                  getSlotAfterTitle(val)
                );
              }
              item['label'] = val;
              // setFormItemProps({ data, id }, 'label', val);
            }
          }
        }
      },
      {
        title: '字段',
        type: 'text',
        value: {
          get: function (_a) {
            var id = _a.id,
              data = _a.data,
              focusArea = _a.focusArea;
            var item = data.items.find(function (item) {
              return item.id === id;
            });
            return (
              (item === null || item === void 0 ? void 0 : item.name) ||
              (item === null || item === void 0 ? void 0 : item.label)
            );
          },
          set: function (_a, val) {
            var id = _a.id,
              data = _a.data,
              focusArea = _a.focusArea,
              input = _a.input,
              output = _a.output,
              slots = _a.slots;
            val = val.trim();
            if (!val) {
              return antd_1.message.warn('字段名不能为空');
            }
            var item = data.items.find(function (item) {
              return item.id === id;
            });
            if (item && item.name !== val) {
              if (fieldNameCheck(data, val)) {
                return antd_1.message.warn('字段名不能重复');
              }
              item.name = val;
              schema_1.refreshSchema({ data: data, inputs: input, outputs: output, slots: slots });
            }
          }
        }
      },
      {
        title: '标题提示',
        type: 'Text',
        ifVisible: function (_a) {
          var id = _a.id,
            data = _a.data;
          return !getFormItemProp({ data: data, id: id }, 'hiddenLabel');
        },
        description: '展示在标题后面的悬浮提示内容',
        value: {
          get: function (_a) {
            var id = _a.id,
              data = _a.data;
            return getFormItemProp({ data: data, id: id }, 'tooltip');
          },
          set: function (_a, value) {
            var id = _a.id,
              data = _a.data;
            setFormItemProps({ data: data, id: id }, 'tooltip', value);
          }
        }
      },
      {
        title: '提示语',
        type: 'Text',
        description: '展示在表单项下方的提示内容',
        value: {
          get: function (_a) {
            var id = _a.id,
              data = _a.data;
            return getFormItemProp({ data: data, id: id }, 'description');
          },
          set: function (_a, value) {
            var id = _a.id,
              data = _a.data;
            setFormItemProps({ data: data, id: id }, 'description', value);
          }
        }
      },
      {
        title: '后置插槽',
        type: 'Switch',
        value: {
          get: function (_a) {
            var id = _a.id,
              data = _a.data;
            return getFormItemProp({ data: data, id: id }, 'slotAfter');
          },
          set: function (_a, value) {
            var id = _a.id,
              data = _a.data,
              slot = _a.slot;
            var item = data.items.find(function (item) {
              return item.id === id;
            });
            if (value && item) {
              var slotId = utils_1.uuid();
              item['slotAfter'] = slotId;
              // setFormItemProps({ data, id }, 'slotAfter', slotId);
              slot.add({
                id: slotId,
                title: getSlotAfterTitle(item === null || item === void 0 ? void 0 : item.label)
              });
            } else {
              var slotAfter = getFormItemProp({ data: data, id: id }, 'slotAfter');
              if (slot.get(slotAfter)) {
                slot.remove(slotAfter);
                setFormItemProps({ data: data, id: id }, 'slotAfter', '');
              }
            }
          }
        }
      },
      {
        title: '样式',
        items: [
          {
            title: '宽度模式',
            type: 'Select',
            options: [
              {
                label: '24栅格',
                value: 'span'
              },
              {
                label: '固定宽度(px)',
                value: 'px'
              }
            ],
            value: {
              get: function (_a) {
                var data = _a.data,
                  id = _a.id;
                return getFormItemProp({ data: data, id: id }, 'widthOption');
              },
              set: function (_a, value) {
                var data = _a.data,
                  id = _a.id,
                  inputs = _a.inputs;
                setFormItemProps({ data: data, id: id }, 'widthOption', value);
                schema_1.refreshFormItemPropsSchema({ data: data, inputs: inputs });
              }
            }
          },
          {
            title: '宽度配置(共24格)',
            type: 'Slider',
            options: [
              {
                max: 24,
                min: 1,
                step: 1,
                formatter: '/24'
              }
            ],
            ifVisible: function (_a) {
              var data = _a.data,
                id = _a.id;
              var item = data.items.find(function (item) {
                return item.id === id;
              });
              return (item === null || item === void 0 ? void 0 : item.widthOption) !== 'px';
            },
            value: {
              get: function (_a) {
                var data = _a.data,
                  id = _a.id;
                return getFormItemProp({ data: data, id: id }, 'span');
              },
              set: function (_a, value) {
                var data = _a.data,
                  id = _a.id;
                setFormItemProps({ data: data, id: id }, 'span', value);
              }
            }
          },
          {
            title: '宽度配置(px)',
            type: 'text',
            options: {
              type: 'number'
            },
            ifVisible: function (_a) {
              var data = _a.data,
                id = _a.id;
              var item = data.items.find(function (item) {
                return item.id === id;
              });
              return (item === null || item === void 0 ? void 0 : item.widthOption) === 'px';
            },
            value: {
              get: function (_a) {
                var data = _a.data,
                  id = _a.id;
                return getFormItemProp({ data: data, id: id }, 'width');
              },
              set: function (_a, value) {
                var data = _a.data,
                  id = _a.id;
                setFormItemProps({ data: data, id: id }, 'width', value);
              }
            }
          },
          {
            title: '边距',
            type: 'inputNumber',
            options: [
              { min: 0, title: '上' },
              { min: 0, title: '右' },
              { min: 0, title: '下' },
              { min: 0, title: '左' }
            ],
            ifVisible: function (_a) {
              var _b;
              var data = _a.data;
              return (
                (((_b = data.config) === null || _b === void 0 ? void 0 : _b.layout) ||
                  data.layout) !== 'horizontal'
              );
            },
            value: {
              get: function (_a) {
                var id = _a.id,
                  data = _a.data;
                return getFormItemProp({ data: data, id: id }, 'inlineMargin');
              },
              set: function (_a, value) {
                var id = _a.id,
                  data = _a.data;
                setFormItemProps({ data: data, id: id }, 'inlineMargin', value);
              }
            }
          },
          {
            title: '边距应用其它表单项及操作项',
            type: 'Button',
            ifVisible: function (_a) {
              var _b;
              var data = _a.data;
              return (
                (((_b = data.config) === null || _b === void 0 ? void 0 : _b.layout) ||
                  data.layout) !== 'horizontal'
              );
            },
            value: {
              set: function (_a) {
                var id = _a.id,
                  data = _a.data;
                var curItem = data.items.find(function (item) {
                  return item.id === id;
                });
                var margin = (curItem === null || curItem === void 0
                  ? void 0
                  : curItem.inlineMargin) || [0, 16, 24, 0];
                data.items.forEach(function (item) {
                  return (item.inlineMargin = __spreadArrays(margin));
                });
                data.actions.inlinePadding = __spreadArrays(margin);
              }
            }
          },
          {
            title: '标题自动换行',
            type: 'Radio',
            ifVisible: function (_a) {
              var id = _a.id,
                data = _a.data;
              return !getFormItemProp({ data: data, id: id }, 'hiddenLabel');
            },
            options: [
              { label: '是', value: true },
              { label: '否', value: false },
              { label: '跟随容器配置', value: 'default' }
            ],
            value: {
              get: function (_a) {
                var id = _a.id,
                  data = _a.data;
                return getFormItemProp({ data: data, id: id }, 'labelAutoWrap');
              },
              set: function (_a, value) {
                var id = _a.id,
                  data = _a.data;
                setFormItemProps({ data: data, id: id }, 'labelAutoWrap', value);
              }
            }
          },
          {
            title: '标题对齐方式',
            type: 'Radio',
            ifVisible: function (_a) {
              var id = _a.id,
                data = _a.data;
              return !getFormItemProp({ data: data, id: id }, 'hiddenLabel');
            },
            options: [
              { label: '左对齐', value: 'left' },
              { label: '右对齐', value: 'right' },
              { label: '跟随容器配置', value: 'default' }
            ],
            value: {
              get: function (_a) {
                var id = _a.id,
                  data = _a.data;
                return getFormItemProp({ data: data, id: id }, 'labelAlign');
              },
              set: function (_a, value) {
                var id = _a.id,
                  data = _a.data;
                setFormItemProps({ data: data, id: id }, 'labelAlign', value);
              }
            }
          },
          {
            title: '标题冒号',
            type: 'Radio',
            ifVisible: function (_a) {
              var id = _a.id,
                data = _a.data;
              return !getFormItemProp({ data: data, id: id }, 'hiddenLabel');
            },
            description: '当标题配置为空时，始终不展示冒号',
            options: [
              { label: '显示', value: true },
              { label: '隐藏', value: false },
              { label: '跟随容器配置', value: 'default' }
            ],
            value: {
              get: function (_a) {
                var id = _a.id,
                  data = _a.data;
                return getFormItemProp({ data: data, id: id }, 'colon');
              },
              set: function (_a, value) {
                var id = _a.id,
                  data = _a.data;
                setFormItemProps({ data: data, id: id }, 'colon', value);
              }
            }
          },
          {
            title: '标题样式',
            type: 'Style',
            options: {
              plugins: ['Font'],
              fontProps: {
                fontFamily: false,
                verticalAlign: false
              }
            },
            ifVisible: function (_a) {
              var id = _a.id,
                data = _a.data;
              return !getFormItemProp({ data: data, id: id }, 'hiddenLabel');
            },
            description: '表单项标题的字体样式',
            value: {
              get: function (_a) {
                var id = _a.id,
                  data = _a.data;
                var item = data.items.find(function (item) {
                  return item.id === id;
                });
                if (!(item === null || item === void 0 ? void 0 : item.labelStyle)) {
                  setFormItemProps({ data: data, id: id }, 'labelStyle', {
                    lineHeight: '14px',
                    letterSpacing: '0px',
                    fontSize: '14px',
                    fontWeight: 400,
                    color: 'rgba(0, 0, 0, 0.85)',
                    fontStyle: 'normal'
                  });
                }
                return item === null || item === void 0 ? void 0 : item.labelStyle;
              },
              set: function (_a, value) {
                var id = _a.id,
                  data = _a.data;
                var styleEditorUnfold = value.styleEditorUnfold,
                  style = __rest(value, ['styleEditorUnfold']);
                setFormItemProps({ data: data, id: id }, 'labelStyle', style);
              }
            }
          },
          {
            title: '标题样式应用所有表单项',
            type: 'Button',
            ifVisible: function (_a) {
              var id = _a.id,
                data = _a.data;
              return !getFormItemProp({ data: data, id: id }, 'hiddenLabel');
            },
            value: {
              set: function (_a, value) {
                var id = _a.id,
                  data = _a.data;
                var item = data.items.find(function (item) {
                  return item.id === id;
                });
                var labelStyle = (item === null || item === void 0 ? void 0 : item.labelStyle) || {
                  lineHeight: '14px',
                  letterSpacing: '0px',
                  fontSize: '14px',
                  fontWeight: 400,
                  color: 'rgba(0, 0, 0, 0.85)',
                  fontStyle: 'normal'
                };
                data.items.forEach(function (item) {
                  return (item.labelStyle = labelStyle);
                });
              }
            }
          },
          {
            title: '提示语样式',
            type: 'Style',
            options: {
              plugins: ['Font'],
              fontProps: {
                fontFamily: false,
                verticalAlign: false
              }
            },
            description: '表单项提示语的字体样式',
            value: {
              get: function (_a) {
                var id = _a.id,
                  data = _a.data;
                var item = data.items.find(function (item) {
                  return item.id === id;
                });
                if (!(item === null || item === void 0 ? void 0 : item.descriptionStyle)) {
                  setFormItemProps({ data: data, id: id }, 'descriptionStyle', {
                    whiteSpace: 'pre-wrap',
                    lineHeight: '12px',
                    letterSpacing: '0px',
                    fontSize: '12px',
                    fontWeight: 400,
                    color: 'rgba(0, 0, 0, 0.45)',
                    fontStyle: 'normal'
                  });
                }
                return item === null || item === void 0 ? void 0 : item.descriptionStyle;
              },
              set: function (_a, value) {
                var id = _a.id,
                  data = _a.data;
                var styleEditorUnfold = value.styleEditorUnfold,
                  style = __rest(value, ['styleEditorUnfold']);
                setFormItemProps({ data: data, id: id }, 'descriptionStyle', style);
              }
            }
          },
          {
            title: '提示语样式应用所有表单项',
            type: 'Button',
            value: {
              set: function (_a) {
                var id = _a.id,
                  data = _a.data;
                var item = data.items.find(function (item) {
                  return item.id === id;
                });
                var descriptionStyle = (item === null || item === void 0
                  ? void 0
                  : item.descriptionStyle) || {
                  whiteSpace: 'pre-wrap',
                  lineHeight: '12px',
                  letterSpacing: '0px',
                  fontSize: '12px',
                  fontWeight: 400,
                  color: 'rgba(0, 0, 0, 0.45)',
                  fontStyle: 'normal'
                };
                data.items.forEach(function (item) {
                  return (item.descriptionStyle = descriptionStyle);
                });
              }
            }
          },
          {
            title: '必填样式',
            type: 'Switch',
            value: {
              get: function (_a) {
                var id = _a.id,
                  data = _a.data;
                return getFormItemProp({ data: data, id: id }, 'required');
              },
              set: function (_a, value) {
                var id = _a.id,
                  data = _a.data;
                setFormItemProps({ data: data, id: id }, 'required', value);
              }
            }
          }
        ]
      }
    ]
  },
  '[data-form-actions]': function (_a, cate1) {
    var data = _a.data,
      output = _a.output;
    cate1.items = [actions_1.actionsEditor(data, output)];
  },
  '[data-form-actions-item]': {
    title: '操作',
    items: [
      {
        title: '显示',
        type: 'Switch',
        value: {
          get: function (_a) {
            var _b;
            var data = _a.data,
              focusArea = _a.focusArea;
            var comId = focusArea.dataset.formActionsItem;
            return (_b = data.actions.items.find(function (item) {
              return item.key === comId;
            })) === null || _b === void 0
              ? void 0
              : _b.visible;
          },
          set: function (_a, val) {
            var data = _a.data,
              focusArea = _a.focusArea,
              output = _a.output;
            var comId = focusArea.dataset['formActionsItem'];
            var item = data.actions.items.find(function (item) {
              return item.key === comId;
            });
            if (item) {
              item.visible = val;
            }
          }
        }
      },
      {
        title: '标题',
        type: 'text',
        value: {
          get: function (_a) {
            var _b;
            var data = _a.data,
              focusArea = _a.focusArea;
            var comId = focusArea.dataset.formActionsItem;
            return (
              comId &&
              ((_b = data.actions.items.find(function (item) {
                return item.key === comId;
              })) === null || _b === void 0
                ? void 0
                : _b.title)
            );
          },
          set: function (_a, val) {
            var data = _a.data,
              focusArea = _a.focusArea,
              output = _a.output;
            if (!val) {
              return antd_1.message.warn('操作标题不能为空');
            }
            var comId = focusArea.dataset['formActionsItem'];
            var item = data.actions.items.find(function (item) {
              return item.key === comId;
            });
            if (item) {
              item.title = val;
              output.setTitle(item.outputId, '\u70B9\u51FB' + item.title);
            }
          }
        }
      },
      {
        title: '风格',
        type: 'Select',
        options: function () {
          return [
            { value: 'primary', label: '主按钮' },
            { value: 'default', label: '次按钮' },
            { value: 'dashed', label: '虚线按钮' },
            { value: 'link', label: '链接按钮' },
            { value: 'text', label: '文字按钮' }
          ];
        },
        value: {
          get: function (_a) {
            var _b;
            var data = _a.data,
              focusArea = _a.focusArea;
            var comId = focusArea.dataset.formActionsItem;
            return (
              ((_b = data.actions.items.find(function (item) {
                return item.key === comId;
              })) === null || _b === void 0
                ? void 0
                : _b.type) || 'default'
            );
          },
          set: function (_a, value) {
            var data = _a.data,
              focusArea = _a.focusArea;
            var comId = focusArea.dataset['formActionsItem'];
            var item = data.actions.items.find(function (item) {
              return item.key === comId;
            });
            if (item) {
              item.type = value;
            }
          }
        }
      },
      {
        title: '危险按钮',
        type: 'Switch',
        value: {
          get: function (_a) {
            var _b;
            var data = _a.data,
              focusArea = _a.focusArea;
            var comId = focusArea.dataset.formActionsItem;
            return (_b = data.actions.items.find(function (item) {
              return item.key === comId;
            })) === null || _b === void 0
              ? void 0
              : _b.danger;
          },
          set: function (_a, value) {
            var data = _a.data,
              focusArea = _a.focusArea;
            var comId = focusArea.dataset['formActionsItem'];
            var item = data.actions.items.find(function (item) {
              return item.key === comId;
            });
            if (item) {
              item.danger = value;
            }
          }
        }
      },
      {
        title: '事件',
        items: [
          {
            title: '点击',
            type: '_event',
            options: function (_a) {
              var data = _a.data,
                focusArea = _a.focusArea;
              var comId = focusArea.dataset['formActionsItem'];
              var item = data.actions.items.find(function (item) {
                return item.key === comId;
              });
              if (!item) return;
              return {
                outputId: item.outputId
              };
            }
          }
        ]
      },
      {
        title: '删除',
        type: 'Button',
        ifVisible: function (_a) {
          var data = _a.data,
            focusArea = _a.focusArea;
          var actions = data.actions.items;
          var itemId = focusArea.dataset['formActionsItem'];
          var item = actions.find(function (item) {
            return item.key === itemId;
          });
          return item && !(item === null || item === void 0 ? void 0 : item.isDefault);
        },
        value: {
          set: function (_a) {
            var data = _a.data,
              output = _a.output,
              focusArea = _a.focusArea;
            var actions = data.actions.items;
            var itemId = focusArea.dataset['formActionsItem'];
            var index = actions.findIndex(function (item) {
              return item.key === itemId;
            });
            var item = data.actions.items[index];
            output.remove(item.outputId);
            actions.splice(index, 1);
          }
        }
      }
    ]
  }
};
var getSlotAfterTitle = function (label) {
  return label + '\u540E\u7F6E\u5185\u5BB9\u533A';
};
