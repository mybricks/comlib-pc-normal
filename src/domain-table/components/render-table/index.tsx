import React, { FC } from 'react';
import { Table } from 'antd';
import { ColumnsType } from 'antd/es/table';
import { FieldBizType, InputIds, TableRenderType } from '../../constants';
import RenderOperate from '../render-column/render-operate';
import RenderColumn from '../render-column';

interface RenderTableProps {
  data: any;
  env: any;
  slots: any;
  loading: boolean;
  dataSource: any[];
  total: number;
  pageNum: number;
  pageSize: number;
  onPageChange(pageNum: number, pageSize: number): void;
  onEdit(item: any): void;
  onDelete(id: number): void;
}

const INIT_PAGE_SIZE = 20;
const RenderTable: FC<RenderTableProps> = (props) => {
  const {
    data,
    env,
    slots,
    loading,
    dataSource,
    total,
    onPageChange,
    onEdit,
    onDelete,
    pageNum,
    pageSize
  } = props;

  let scrollXWidth = 0;
  const columnWidthMap = {};
  const renderColumns: ColumnsType<any> = (
    data.fieldAry
      ? data.fieldAry?.map((field) => {
          /** 提前读取值，防止不响应 */
          field.tableInfo?.ellipsis;

          const title =
            field.tableInfo?.label ||
            (field.mappingField ? `${field.name}.${field.mappingField.name}` : field.name);
          let parseWidth = parseInt(field.tableInfo?.width || '124px');
          if (Object.is(parseWidth, NaN) || parseWidth <= 0) {
            parseWidth = 124;
          }
          scrollXWidth += parseWidth;
          const editTitle = data.operate?.edit?.title;
          const editDisabled = data.operate?.edit?.disabled;
          const deleteTitle = data.operate?.delete?.title;
          const deleteDisabled = data.operate?.delete?.disabled;

          return field.bizType === FieldBizType.FRONT_CUSTOM
            ? data.table?.operate?.disabled
              ? null
              : {
                  title: field.tableInfo?.label || field.name,
                  key: field.id,
                  align: field.tableInfo?.align || 'left',
                  width: `${parseWidth}px`,
                  render(_, data, index) {
                    return (
                      <RenderOperate
                        field={field}
                        item={data}
                        editTitle={editTitle}
                        editDisabled={editDisabled}
                        deleteTitle={deleteTitle}
                        deleteDisabled={deleteDisabled}
                        colIndex={index}
                        slots={slots}
                        onEdit={env.edit ? undefined : () => onEdit(data)}
                        onDelete={env.edit ? undefined : () => onDelete(data.id)}
                        isEdit={!!env.edit}
                      />
                    );
                  }
                }
            : {
                title: title,
                dataIndex: field.mappingField ? [field.name, field.mappingField.name] : field.name,
                key: title,
                align: field.tableInfo?.align || 'left',
                width: `${parseWidth}px`,
                render(value, data, index) {
                  return (
                    <RenderColumn
                      columnKey={title}
                      columnWidthMap={columnWidthMap}
                      value={value}
                      item={data}
                      field={field}
                      colIndex={index}
                      slots={slots}
                      ellipsis={field.tableInfo?.ellipsis}
                      columnWidth={columnWidthMap[title]}
                    />
                  );
                },
                sorter: field.tableInfo?.sort
              };
        })
      : []
  ).filter(Boolean);

  /** 排序 */
  const onTableChange = (_, __, sorter) => {
    if (env.edit) {
      return;
    }
    const fieldNames = Array.isArray(sorter.field) ? sorter.field : [sorter.field];
    let field = data.fieldAry.find(
      (f) =>
        f.name === fieldNames[0] && (fieldNames[1] ? f.mappingField.name === fieldNames[1] : true)
    );
    const orderMap = { ascend: 'ASC', descend: 'DESC' };

    if (field) {
      data.fieldAry.forEach((f) => {
        f.sorter = undefined;
      });
      field.sorter = sorter.order
        ? {
            entityId: fieldNames.length > 1 ? field.mappingField.relationEntityId : data.entity.id,
            fieldId: fieldNames.length > 1 ? field.mappingField.id : field.id,
            order: orderMap[sorter.order]
          }
        : undefined;

      onPageChange(1, data.pagination?.pageSize || INIT_PAGE_SIZE);
    }
  };

  if (data.table.renderType === TableRenderType.SLOT) {
    const slotId = data.table.slotId;
    if (!slotId || !slots[slotId]?.render) {
      return null;
    } else {
      return slots[slotId]?.render({
        inputValues: {
          [InputIds.DATA_SOURCE]: dataSource
        },
        key: `${InputIds.DATA_SOURCE}-${slotId}`
      });
    }
  }

  return (
    <Table
      key={env.edit ? String(scrollXWidth) : undefined}
      size={data.table?.size || 'middle'}
      loading={loading}
      columns={renderColumns}
      dataSource={dataSource}
      onChange={onTableChange}
      className="domain-default-table"
      scroll={{ x: scrollXWidth }}
      pagination={
        data.pagination?.show
          ? {
              showSizeChanger: true,
              total,
              current: pageNum,
              pageSize,
              onChange: onPageChange
            }
          : false
      }
    />
  );
};

export default RenderTable;
