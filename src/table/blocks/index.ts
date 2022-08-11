// import blocksLibScratch from 'lib-scratch'
import button from './button'
import getRowInput from './getRowInput'
import getRowInput2 from './getRowInput2'
import plainButton from './plainButton'
import text from './text'
import tag from './tag'
import colInit from './colInit'
import expandableInit  from './expandableInit'
import arrow from './arrow'
import wrap from './wrap'

// const {
//   deb,
//   text: defaultText,
//   fetch,
//   list_map,
//   list_push,
//   text_join,
//   def_object,
//   create_list,
//   list_filter,
//   math_number,
//   logic_ifelse,
//   get_listitem,
//   logic_ternary,
//   regex_replace,
//   logic_includes,
//   global_variable,
//   traverse_object,
//   get_object_value,
//   delete_object_value
// } = blocksLibScratch

const actionBlocks = [
  {
    name: '表格',
    blockAry: [
      colInit,
      getRowInput2,
      button,
      plainButton,
      text,
      tag,
      arrow,
      wrap
    ]
  },
  {
    blockAry: [
      getRowInput,
    ]
  }
]

const expandableBlocks = [
  {
    name: '表格行展开',
    blockAry: [
      expandableInit,
      getRowInput2,
      button,
      plainButton,
      text,
      tag,
      wrap
    ]
  },
  {
    blockAry: [
      getRowInput,
    ]
  }
]

// const blocks = [
//   {
//     name: '常量',
//     blockAry: [
//       deb,
//       'logic_boolean',
//       math_number,
//       'math_arithmetic',
//       defaultText,
//       text_join,
//       def_object,
//       get_object_value,
//       global_variable,
//       delete_object_value
//     ]
//   },
//   {
//     name: '正则',
//     blockAry: [regex_replace]
//   },
//   {
//     name: '服务调用',
//     blockAry: [fetch]
//   },
//   {
//     name: '逻辑判断', blockAry: [
//       logic_ifelse,
//       'logic_compare',
//       'logic_operation',
//       logic_ternary,
//       logic_includes
//     ]
//   },
//   {
//     name: '列表', blockAry: [
//       create_list,
//       traverse_object,
//       'lists_split',
//       get_listitem,
//       list_push,
//       list_map,
//       list_filter,
//     ]
//   }
// ]

export {
  // blocks,
  actionBlocks,
  expandableBlocks
}