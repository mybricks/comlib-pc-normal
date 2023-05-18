import React, { useEffect, ReactNode, useState } from 'react';
import { Alert, Button, List, Select } from 'antd';
import { SelectRender } from './select';

export default function (props) {
  const { env, inputs, data, logger, slots, style } = props;

  const [dataSource, setDataSource] = useState([{ '_item-key': 'key1' }]);

  const onClick = () => {
    if (env.runtime) {
      setDataSource([
        {
          '_item-key': 'key1'
        },
        {
          '_item-key': 'key2'
        }
      ]);
    }
  };

  const ListItemRender = ({ '_item-key': key }) => {
    return (
      <List.Item key={key}>
        {/* 当前项数据和索引 */}
        {/* <Select 
        style={{width: '100%'}}
        options={[
          { value: 'jack', label: 'Jack' },
          { value: 'lucy', label: 'Lucy' },
          { value: 'Yiminghe', label: 'yiminghe' },
          { value: 'disabled', label: 'Disabled', disabled: true }
        ]}>
        </Select> */}
        <SelectRender />
      </List.Item>
    );
  };

  return (
    // <div
    //   className={css.container}
    //   style={{
    //     width: data.openWidth ? data.width + 'px' : data.percentWidth + '%'
    //   }}
    // >
    //   <Alert
    //     style={{
    //       color: colorObj[data.type]
    //     }}
    //     message={env.i18n(decodeURIComponent(data.message))}
    //     type={data.type}
    //     showIcon={data.showIcon}
    //     //void 0表示去除掉该配置项
    //     icon={
    //       data.isChoose && data.showIcon
    //         ? chooseIcon({ icon: data.icon })
    //         : void 0
    //     }
    //     action={
    //       <span
    //         style={{ display: data.closable ? '' : 'none' }}
    //         onClick={onClose}
    //       >
    //         <CloseOutlined />
    //       </span>
    //     }
    //     description={description}
    //     banner={data.banner}
    //   />
    // </div>

    <div>
      <List
        dataSource={dataSource}
        renderItem={ListItemRender}
        //rowKey={rowKey}
        // className={classnames(
        //   css.listWrap,
        //   dataSource.length === 0 && env.runtime && !loading && css.hideEmpty
        // )}
      />
      <Button onClick={onClick}>添加</Button>
    </div>
  );
}
