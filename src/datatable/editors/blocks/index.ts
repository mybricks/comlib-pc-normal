import fetch from './http/fetch'
import get_object_value from './object/get_object_value'
import def_object from './object/def_object'
import list_map from './list/list_map'
import create_list from './list/create_list'
import logic_ifelse from './logic/logic_ifelse'
import global_variable from './variable/global_variable'
import text_join from './text/text_join'
import math_number from './math/math_number'
import text from './text/text'
import logic_includes from './logic/logic_includes'
// import logic_confirm from './logic/logic_confirm'
import logic_ternary from './logic/logic_ternary'
import list_filter from './list/list_filter'
import list_push from './list/list_push'
import traverse_object from './list/traverse_object'
import get_listitem from './list/get_listitem'
import delete_object_value from './object/delete_object_value'
import deb from './debugger/debugger'
import returnOutputs from './return'

export default function (output) {
  return [
    {
      name: '输出',
      blockAry: returnOutputs(output)
    },
    {
      name: '服务调用',
      blockAry: [fetch]
    },
    {
      name: '常量',//Catelog title
      blockAry: [
        deb,
        'logic_boolean',
        math_number,
        'math_arithmetic',
        text,
        text_join,
        def_object,
        get_object_value,
        global_variable,
        delete_object_value
      ]
    },
    {
      name: '逻辑判断', blockAry: [
        // logic_confirm,          // 确认提示
        logic_ifelse,
        'logic_compare',        // 比较
        'logic_operation',      // 并且 或者
        logic_ternary,
        logic_includes
      ]
    },
    {
      name: '列表', blockAry: [
        create_list,
        traverse_object,
        'lists_split',
        get_listitem,
        list_push,
        list_map,
        list_filter,
      ]
    }
  ]
}