import React, { FC } from 'react';
import { Button } from 'antd';
import { Field } from '../../type';
import { InputIds } from '../../constants';

interface RenderOperateProps {
  field: Field;
  editDisabled?: boolean;
  editTitle?: string;
  deleteDisabled?: boolean;
  deleteTitle?: string;
  item: any;
  slots: any;
  colIndex: number;
  isEdit: boolean;
  onEdit?(item: any): void;
  onDelete?(item: any): void;
}

const RenderOperate: FC<RenderOperateProps> = (props) => {
  const {
    isEdit,
    editTitle,
    editDisabled,
    deleteDisabled,
    deleteTitle,
    colIndex,
    item,
    field,
    onEdit,
    onDelete,
    slots
  } = props;

  const renderSlot = () => {
    const slotId = field.tableInfo?.slotId;
    if (!slotId || !slots[slotId]?.render) {
      return null;
    } else {
      return slots[slotId]?.render({
        inputValues: {
          [InputIds.SLOT_ROW_RECORD]: { ...item },
          [InputIds.INDEX]: colIndex
        },
        key: `${InputIds.SLOT_ROW_RECORD}-${colIndex}-${field.id}`
      });
    }
  };

  return (
    <>
      {editDisabled ? null : (
        <Button data-edit-button="1" style={{ marginRight: '12px' }} size="small" onClick={onEdit}>
          {editTitle || '编辑'}
        </Button>
      )}
      {deleteDisabled ? null : (
        <Button danger data-delete-button="1" type="primary" size="small" onClick={onDelete}>
          {deleteTitle || '删除'}
        </Button>
      )}
      <div style={{ display: 'inline-flex', width: isEdit ? '100%' : undefined }}>
        {renderSlot()}
      </div>
    </>
  );
};

export default RenderOperate;
