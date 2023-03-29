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

export enum ComponentName {
	INPUT = 'Input',
	TEXTAREA = 'Textarea',
	INPUT_NUMBER = 'InputNumber',
	SELECT = 'Select',
	DATE_PICKER = 'DatePicker',
	UPLOAD = 'Upload',
	IMAGE_UPLOAD = 'ImageUpload',
	RADIO = 'Radio',
	CHECKBOX = 'Checkbox',
	DEBOUNCE_SELECT = 'DebounceSelect',
}

export const DefaultComponentNameMap = {
	[FieldBizType.STRING]: ComponentName.INPUT,
	[FieldBizType.NUMBER]: ComponentName.INPUT_NUMBER,
	[FieldBizType.DATETIME]: ComponentName.DATE_PICKER,
	[FieldBizType.HREF]: ComponentName.INPUT,
	[FieldBizType.PHONE]: ComponentName.INPUT,
	[FieldBizType.EMAIL]: ComponentName.INPUT,
	[FieldBizType.IMAGE]: ComponentName.IMAGE_UPLOAD,
	[FieldBizType.APPEND_FILE]: ComponentName.UPLOAD,
	[FieldBizType.RADIO]: ComponentName.RADIO,
	[FieldBizType.CHECKBOX]: ComponentName.CHECKBOX,
	[FieldBizType.RELATION]: ComponentName.DEBOUNCE_SELECT,
	[FieldBizType.MAPPING]: ComponentName.DEBOUNCE_SELECT,
	[FieldBizType.SYS_USER]: ComponentName.DEBOUNCE_SELECT,
	[FieldBizType.SYS_USER_CREATOR]: ComponentName.DEBOUNCE_SELECT,
	[FieldBizType.SYS_USER_UPDATER]: ComponentName.DEBOUNCE_SELECT,
};