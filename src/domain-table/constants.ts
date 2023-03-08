export type Data = any;

/** 字段类型 */
export enum FieldBizType {
	STRING = 'string',
	NUMBER = 'number',
	DATETIME = 'datetime',
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