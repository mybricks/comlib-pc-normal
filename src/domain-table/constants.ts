export type Data = any;

/** 字段类型 */
export enum FieldBizType {
	STRING = 'string',
	NUMBER = 'number',
	DATETIME = 'datetime',
	/** 超链接 */
	HREF = 'href',
	/** 电话 */
	PHONE = 'phone',
	/** 邮箱 */
	EMAIL = 'email',
	/** 图片 */
	IMAGE = 'image',
	/** 附件 */
	APPEND_FILE = 'appendFile',
	/** 单选 */
	RADIO = 'radio',
	/** 多选 */
	CHECKBOX = 'checkbox',
	/** 外键，关联其他表 */
	RELATION = 'relation',
	/** 映射其他表 */
	MAPPING = 'mapping',
	/** 系统表 */
	SYS_USER = 'SYS_USER',
	SYS_USER_CREATOR = 'SYS_USER.CREATOR',
	SYS_USER_UPDATER = 'SYS_USER.UPDATER',
	/** 前端需要，自定义 */
	FRONT_CUSTOM = 'FRONT_CUSTOM',
}

/** 数据库字段类型 */
export enum FieldDBType {
	VARCHAR = 'varchar',
	BIGINT = 'bigint',
	MEDIUMTEXT = 'mediumtext',
}

/** 默认值 */
export enum DefaultValueWhenCreate {
	/** 当前时间 */
	CURRENT_TIME = '$currentTime'
}

export enum ModalAction {
	CREATE = 'create',
	EDIT = 'edit',
}