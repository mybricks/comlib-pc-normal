import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {Data, FieldBizType} from './constants';
import {Button, Col, DatePicker, Form, Input, InputNumber, message, Modal, Row, Table} from 'antd';
import {ColumnsType} from 'antd/es/table';

import styles from './runtime.less';
import DebounceSelect from "./ccomponents/debouce-select";
enum ModalAction {
	CREATE = 'create',
	EDIT = 'edit',
}

export default function ({ env, data, outputs, inputs, createPortal }: RuntimeParams<Data>) {
	const { edit, runtime } = env;
	const debug = !!(runtime && runtime.debug);
	// const currentCreatePortal = edit || debug ? createPortal : (a => a);
	const [dataSource, setDataSource] = useState([]);
	const [loading, setLoading] = useState(false);
	const [showModalAction, setShowModalAction] = useState('');
	const [createLoading, setCreateLoading] = useState(false);
	const [form] = Form.useForm();
	const [createForm] = Form.useForm();
	const currentData = useRef<Record<string, unknown>>({});
	const containerRef = useRef(null);
	const baseFetchParams = useMemo(() => {
		return {
			serviceId: data.entity.id,
			fileId: 318,
			// projectId: 317,
			isOnline: true
		};
	}, [data.entity]);
	
	const handleData = useCallback((query = {}) => {
		setLoading(true);
		fetch('/api/system/domain/run', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			credentials: undefined,
			body: JSON.stringify({
				params: {
					query,
					fields: [{ name: 'id' }, ...data.fieldAry.map(f => ({ name: f.name }))],
					action: 'SELECT'
				},
				...baseFetchParams
			})
		} as RequestInit)
		.then(res => res.json())
		.then(data => {
			if (data.code === 1) {
				setDataSource(data.data);
			}
		})
		.finally(() => setLoading(false));
	}, [data.fieldAry, data.entity, baseFetchParams]);
	
	const onDelete = useCallback((id: number) => {
		fetch('/api/system/domain/run', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			credentials: undefined,
			body: JSON.stringify({
				params: {
					query: { id },
					action: 'DELETE'
				},
				...baseFetchParams
			})
		} as RequestInit)
		.then(res => res.json())
		.then(data => {
			if (data.code === 1) {
				message.success('删除成功');
				form.resetFields();
				handleData();
			} else {
				message.error('删除失败');
			}
		})
		.catch(() => message.error('删除失败'));
	}, [handleData, baseFetchParams]);
	const onEdit = useCallback((item: Record<string, unknown>) => {
		setShowModalAction(ModalAction.EDIT);
		currentData.current = item;
		const value = {};
		if (data.entity) {
			data.entity.fieldAry
				.filter(field => field.bizType !== FieldBizType.MAPPING && !field.isPrimaryKey && !field.isPrivate && !field.defaultValueWhenCreate)
				.forEach(field => {
					if (field.mapping?.entity || (field.bizType === FieldBizType.DATETIME && field.showFormat)) {
						value[field.name] = item['_' + field.name];
					} else {
						value[field.name] = item[field.name];
					}
				});
			
			createForm.setFieldsValue(value);
		}
	}, [data.entity]);
	
	const columns: ColumnsType<any> = useMemo(() => {
		return data.fieldAry ? [
			...data.fieldAry?.map(field => {
				const title = field.mappingField ? `${field.name}.${field.mappingField.name}` : field.name;
				return {
					title: title,
					dataIndex: field.mappingField ? [field.name, field.mappingField.name] : field.name,
					key: title,
					width: '100px'
				};
			}),
			{
				title: '操作',
				key: 'operate',
				width: '100px',
				render(_, data) {
					return (
						<>
							<Button style={{ marginRight: '12px' }} size="small" onClick={() => onEdit(data)}>编辑</Button>
							<Button danger type="primary" size="small" onClick={() => onDelete(data.id)}>删除</Button>
						</>
					);
				}
			}
		] : [];
	}, [data.fieldAry, onDelete, onEdit]);
	
	useEffect(() => {
		if (!data.entity || !data.fieldAry?.length) {
			return;
		}
		handleData();
	}, [data.entity, data.fieldAry, handleData]);
	
	const search = useCallback(() => {
		form.validateFields().then(value => {
			const curValue = {};
			
			Object.keys(value).forEach(key => {
				const filed = data.formFieldAry.find(field => field.name === key);
				let item: Record<string, unknown>= {
					operator: filed?.operator ?? '=',
					value: value[key]
				};
				try {
					if (item.isAfter) {
						item = { value: item.valueOf() };
					}
				} catch {}
				
				curValue[key] = item;
			});
			
			handleData(curValue);
		}).catch(_ => _);
	}, [handleData, data.formFieldAry]);
	
	const formNode = useMemo(() => {
		if (data.formFieldAry?.length) {
			return (
				<Form form={form} layout="inline" className={styles.form}>
					{data.formFieldAry.map(field => {
						let item = <Input placeholder={`可输入${field.name}检索`} />;
						
						if (field.bizType === FieldBizType.DATETIME) {
							item = <DatePicker showTime placeholder={`可选择${field.name}检索`} />;
						} else if (field.bizType === FieldBizType.NUMBER) {
							item = <InputNumber placeholder={`可输入${field.name}检索`} />
						} else if (field.mapping?.entity) {
							item = <DebounceSelect placeholder="可输入关键词检索" field={field} fetchParams={baseFetchParams}/>
						}
						
						return (
							<Form.Item style={{ width: '280px' }} key={field.id} name={field.name} label={field.label ?? field.name}>
								{item}
							</Form.Item>
						);
					})}
					<Button type="primary" onClick={search}>查询</Button>
				</Form>
			);
		}
		
		return null;
	}, [data.formFieldAry, search, baseFetchParams]);
	const openCreateModal = useCallback(() => setShowModalAction(ModalAction.CREATE), []);
	const closeCreateModal = useCallback(() => setShowModalAction(''), []);
	const handleCreate = useCallback(() => {
		if (!data.entity) {
			return;
		}
		setCreateLoading(true);
		createForm
			.validateFields()
			.then(value => {
				const curValue = {};
				
				Object.keys(value).forEach(key => {
					let item = value[key];
					try {
						if (item.isAfter) {
							item = (item as any).valueOf();
						}
					} catch {}
					
					curValue[key] = item;
				});
				
				if (showModalAction === ModalAction.EDIT) {
					curValue.id = currentData.current?.id;
				}
				
				fetch('/api/system/domain/run', {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json'
					},
					credentials: undefined,
					body: JSON.stringify({
						params: {
							fields:
								showModalAction === ModalAction.CREATE
									? undefined
									: data.entity.fieldAry
										.filter(field => field.bizType !== FieldBizType.MAPPING && !field.isPrimaryKey && !field.isPrivate && !field.defaultValueWhenCreate),
							query: curValue,
							action: showModalAction === ModalAction.CREATE ? 'INSERT' : 'UPDATE',
						},
						...baseFetchParams
					})
				} as RequestInit)
				.then(res => res.json())
				.then(data => {
					if (data.code === 1) {
						setShowModalAction('');
						form.resetFields();
						handleData();
					}
				})
			})
			.catch(_ => _)
			.finally(() => setCreateLoading(false));
	}, [showModalAction, data.fieldAry, data.entity, baseFetchParams]);
	const createFormNode = useMemo(() => {
		if (data.entity) {
			return (
				<Row gutter={24}>
					{
						data.entity.fieldAry
							.filter(field => field.bizType !== FieldBizType.MAPPING && !field.isPrimaryKey && !field.isPrivate && !field.defaultValueWhenCreate)
							.map(field => {
								let placeholder = `请输入${field.name}`;
								let item = <Input placeholder={placeholder} />;
								
								if (field.bizType === FieldBizType.DATETIME) {
									placeholder = `请选择${field.name}`;
									item = <DatePicker style={{ width: '100%' }} showTime placeholder={placeholder} />;
								} else if (field.bizType === FieldBizType.NUMBER) {
									item = <InputNumber placeholder={placeholder} />
								} else if (field.mapping?.entity) {
									item = <DebounceSelect placeholder="可输入关键词检索" field={field} fetchParams={baseFetchParams}/>
								}
								
								return (
									<Col span={12} key={field.id}>
										<Form.Item labelCol={{ span: 6 }} name={field.name} label={field.name} required rules={[{ required: true, message: placeholder }]}>
											{item}
										</Form.Item>
									</Col>
								);
							})
					}
				</Row>
			);
		}
		
		return null;
	}, [data.entity, showModalAction, baseFetchParams]);
	
  return (
    <>
	    <div className={styles.domainContainer}>
		    {formNode}
		    <div className={styles.operateRow}>
			    <Button type="primary" onClick={openCreateModal}>新增</Button>
		    </div>
		    <Table loading={loading} columns={columns} dataSource={dataSource} pagination={false}></Table>
	    </div>
	    {/*{currentCreatePortal(*/}
		  {/*  <div className={styles.container} ref={containerRef}>*/}
			{/*    <Modal*/}
			{/*	    destroyOnClose*/}
			{/*	    width={800}*/}
			{/*	    getContainer={containerRef.current && (edit || debug) ? containerRef.current : undefined}*/}
			{/*	    className={styles.createModal}*/}
			{/*	    visible={!!showModalAction}*/}
			{/*	    title={showModalAction === ModalAction.EDIT ? '编辑' : '新增'}*/}
			{/*	    maskClosable*/}
			{/*	    closable*/}
			{/*	    onCancel={closeCreateModal}*/}
			{/*	    onOk={handleCreate}*/}
			{/*	    centered*/}
			{/*	    okText="确定"*/}
			{/*	    cancelText="取消"*/}
			{/*	    confirmLoading={createLoading}*/}
			{/*	    okButtonProps={{ loading: createLoading }}*/}
			{/*    >*/}
			{/*	    <Form form={createForm}>*/}
			{/*		    {createFormNode}*/}
			{/*	    </Form>*/}
			{/*    </Modal>*/}
		  {/*  </div>*/}
	    {/*)}*/}
	    <div className={styles.container} ref={containerRef}>
		    <Modal
			    destroyOnClose
			    width={800}
			    getContainer={(edit || debug) ? document.querySelector('#_mybricks-geo-webview_').shadowRoot.querySelector('div > div') : undefined}
			    className={styles.createModal}
			    visible={!!showModalAction}
			    title={showModalAction === ModalAction.EDIT ? '编辑' : '新增'}
			    maskClosable
			    closable
			    onCancel={closeCreateModal}
			    onOk={handleCreate}
			    centered
			    okText="确定"
			    cancelText="取消"
			    confirmLoading={createLoading}
			    okButtonProps={{ loading: createLoading }}
		    >
			    <Form form={createForm}>
				    {createFormNode}
			    </Form>
		    </Modal>
	    </div>
    </>
  );
}
