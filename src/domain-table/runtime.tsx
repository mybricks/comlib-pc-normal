import React, {useCallback, useEffect, useMemo, useState} from 'react';
import { Data } from './constants';
import {Form, Input, Table} from "antd";
import {ColumnsType} from "antd/es/table";

export default function ({ env, data, outputs, inputs }: RuntimeParams<Data>) {
	const [dataSource, setDataSource] = useState([]);
	const [form] = Form.useForm();
	
	const columns: ColumnsType<any> = useMemo(() => {
		return data.fieldAry?.map(field => {
			return {
				title: field.name,
				dataIndex: field.name,
				key: field.name,
				width: '100px'
			};
		}) || [];
	}, [data.fieldAry]);
	
	useEffect(() => {
		if (!data.entity || !data.fieldAry?.length) {
			return;
		}
		fetch('/api/system/domain/run', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			credentials: undefined,
			body: JSON.stringify({
				params: {
					fields: data.fieldAry.map(f => ({ name: f.name })),
					action: 'SELECT'
				},
				serviceId: 'D_129_E_7ZHXX',
				fileId: 129
			})
		})
		.then(res => res.json())
		.then(data => {
			if (data.code === 1) {
				setDataSource(data.data);
			}
		});
	}, [data.entity, data.fieldAry]);
	
	const formNode = useMemo(() => {
		if (data.formFieldAry?.length) {
			return (
				<Form form={form}>
					{data.formFieldAry.map(field => {
						return (
							<Form.Item name={field.name} label={field.name}><Input /></Form.Item>
						);
					})}
				</Form>
			);
		}
		
		return null;
	}, [data.formFieldAry]);
	
  return (
    <div style={{ minWidth: '600px' }}>
	    {formNode}
	    <Table columns={columns} dataSource={dataSource} pagination={false}></Table>
    </div>
  );
}
