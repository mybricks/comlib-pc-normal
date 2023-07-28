import {DefaultValueWhenCreate, FieldBizType, FieldDBType} from './constants';

export interface Entity {
	/** 表 ID，在前端编辑页使用 */
	id: string;
	/** 表名 */
	name: string;
	/** 表备注 */
	desc: string;
	fieldAry: Field[];
	
	/** 是否是系统表 */
	isSystem?: boolean;
	/** 系统表基于对应实体去实现 */
	implementEntityId?: string;
	/** 前端编辑器使用，判断实体是否被选中，例如：服务接口中的查询组件，编辑其选中哪个实体 */
	selected: boolean;
	/** 是否开启领域服务，开启意味着会自动生成服务接口 */
	isOpen: boolean;
}

export interface Field {
	/** 表字段 ID，真实数据库字段 */
	id: string;
	/** 字段名 */
	name: string;
	/** 字段类型 */
	bizType: FieldBizType;
	dbType: FieldDBType;
	typeLabel: string;
	desc?: string;
	/** 关联的实体表 ID */
	relationEntityId?: string;
	/** 是否为主键 */
	isPrimaryKey?: boolean;
	/** 私有字段 */
	isPrivate?: boolean;
	/** 系统表基于对应字段实现 */
	implementFieldId?: string;
	/** 是否被选中 */
	selected?: boolean;
	/** 映射 */
	mapping?: {
		condition: string;
		fieldJoiner: string;
		entity?: Entity;
		type?: string;
		sql: string;
		desc: string;
	};
	/** 是否带初始值，初始值生成类型 */
	defaultValueWhenCreate?: DefaultValueWhenCreate;
	/** 查询数据时格式化类型 */
	showFormat: string;
	form: any;
}