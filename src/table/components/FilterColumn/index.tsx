import React, { useEffect, useState } from 'react';
import { Tooltip, Dropdown, Menu, Checkbox, Button} from 'antd';
import { SettingOutlined } from '@ant-design/icons';

export default function FilterColumnRender ({
  data,
}) {
  //表格筛选栏渲染
  let [newColoumns, setNewColoumns] = useState([]);
  //let [type, setType] = useState(Array(data.columns.length).fill(true)); 这里的useState里的data.columns.length一直为 4
  //到100列都可以适用
  let [check, setCheck] = useState(Array(100).fill(true));
  let [checkAll, setCheckAll] = useState(true);
  const [indeterminate, setIndeterminate] = useState(false);

  for(let i=0;i<data.columns.length;i++){
    const onchange = function() {
      return function() {
        //设置单独每一项check值
        check[i] = !check[i];
        data.columns[i].visible = check[i];
        data.columns = data.columns;
        setCheck(check);
      }
    }
    newColoumns[i]={...data.columns[i], defaultChecked: true, fun: onchange(), checkFun: check[i]}
  } 

  //全选按钮与单个按钮的关系
  useEffect(() => {
    if(check.includes(false)){
      setCheckAll(false)
    }else{
      setCheckAll(true)
    }
  })
 
  //全选按钮的chekc变化
  const func = (e) => {
      if(check.includes(false)) {
        setCheckAll(true);
        setCheck(Array(100).fill(true));
        setIndeterminate(false);
        newColoumns.map((e) => {
          e.visible = true;
        })
        data.columns = data.columns
      } else {
        setCheckAll(false);
        setCheck(Array(100).fill(false));
        setIndeterminate(false);
        newColoumns.map((e) => {
          e.visible = false;
        })
        data.columns = data.columns
      }
  }
  
  //全选按钮中的样式控制
  useEffect(() => {
    let num=0;
    for(let i=0; i<data.columns.length; i++){
      if(check[i] === false){
        num++;
      }
    }
    if(check.includes(false) && num < data.columns.length){
      setIndeterminate(true);
    }else{
      setIndeterminate(false);
    }
  })
  
  useEffect(() => {
    data.columns = newColoumns;
  })
 
  const menu = () => {
    const genElements = (values) =>{
      if(!values){
        return null;
      }
      return values.map((ele) => {
      return addEle(ele.key, ele.title, ele.defaultChecked, ele.fun, ele.checkFun)
      })
    }
    
    const addEle = (key:any, val:any, defaultChecked:any, fun: any, checkFun: any) => {
      return (<Menu.Item key={key}>
                <Checkbox defaultChecked={defaultChecked} onChange={fun} checked={checkFun}>{val}</Checkbox>
              </Menu.Item>)
    }

    return (
      <Menu>
        <Menu.Item key="checked">
          <Checkbox defaultChecked={true} indeterminate={indeterminate} onChange={func} checked={checkAll}>列展示</Checkbox>
        </Menu.Item>
        <Menu.Divider/>
        {genElements(newColoumns)}
      </Menu>
    )
  };

  const [visibleChange, setVisibleChange] = useState({ visible: false }) 
  const handleVisibleChange = (flag) =>{
    setVisibleChange({ visible: flag })
  }
 
  const renderFilterColumn = () => {
    if (!data.useColumnSetting) {
      return null;
    }
    return (
      <div data-table-header-filter style={{ paddingLeft: '12px'}}>
        <Tooltip title="列设置">
          <Dropdown 
            overlay={menu} 
            placement="bottomRight" 
            arrow={true} 
            onVisibleChange={handleVisibleChange}
            visible={visibleChange.visible}
            trigger={['click']}
            >
            <Button icon={<SettingOutlined />}></Button>
          </Dropdown>
        </Tooltip>
      </div>
    )
  }

  return renderFilterColumn();
}

