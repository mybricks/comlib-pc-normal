import RichText from './src/richtext'
import Button from './src/button'
import Toolbar from './src/toolbar'
import LayoutGrid from './src/layout-grid'
import Form from './src/form'
import DataTable from './src/datatable'
import ifCom from './src/if'

export default {
  title: 'PC通用组件库',
  author: 'CheMingjun',
  icon: '',
  version: '1.0.1',
  comAray: [
    RichText,
    Button,
    Toolbar,
    LayoutGrid,
    Form,
    DataTable,
    ifCom
  ].map(b => {
    const rtn = Object.assign({rtType: 'react'}, b.json, b)
    delete rtn.json
    return rtn
  })
}