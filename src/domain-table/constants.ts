export type Data = any;

export const MOCK_ENTITY_LIST = [
	{
		"id": "SYS_USER",
		"isSystem": true,
		"implementEntityId": "E_7ZHXX",
		"name": "系统用户",
		"desc": "",
		"fieldAry": [
			{
				"id": "F_MG5P_",
				"isPrimaryKey": true,
				"name": "id",
				"desc": "主键",
				"dbType": "bigint",
				"bizType": "number",
				"typeLabel": "数字"
			},
			{
				"id": "F_M_VEN",
				"isPrivate": true,
				"name": "_STATUS_DELETED",
				"desc": "是否已删除",
				"dbType": "int",
				"bizType": "number",
				"typeLabel": "数字"
			},
			{
				"id": "F_O_AOL",
				"isPrivate": true,
				"name": "_CREATE_USER_ID",
				"desc": "创建者ID",
				"dbType": "varchar",
				"bizType": "string",
				"typeLabel": "字符"
			},
			{
				"id": "F_M8X59",
				"isPrivate": true,
				"name": "_CREATE_TIME",
				"desc": "创建时间",
				"dbType": "bigint",
				"bizType": "datetime",
				"typeLabel": "日期时间"
			},
			{
				"id": "F_VSLKK",
				"isPrivate": true,
				"name": "_UPDATE_USER_ID",
				"desc": "更新者ID",
				"dbType": "varchar",
				"bizType": "int",
				"typeLabel": "数字"
			},
			{
				"id": "F_7WC5G",
				"isPrivate": true,
				"name": "_UPDATE_TIME",
				"desc": "最后更新时间",
				"dbType": "bigint",
				"bizType": "datetime",
				"typeLabel": "日期时间"
			},
			{
				"id": "F__0M4G",
				"name": "名称",
				"dbType": "varchar",
				"bizType": "string",
				"typeLabel": "字符",
				"implementFieldId": "F_CI5WI"
			}
		]
	},
	{
		"id": "E_7ZHXX",
		"isOpen": true,
		"name": "会员表",
		"desc": "青橙会会员",
		"fieldAry": [
			{
				"id": "F__INXW",
				"isPrimaryKey": true,
				"name": "id",
				"desc": "主键",
				"dbType": "bigint",
				"bizType": "number",
				"typeLabel": "数字"
			},
			{
				"id": "F_QAHYB",
				"isPrivate": true,
				"name": "_STATUS_DELETED",
				"desc": "是否已删除",
				"dbType": "int",
				"bizType": "number",
				"typeLabel": "数字"
			},
			{
				"id": "F_OLUXT",
				"isPrivate": true,
				"name": "_CREATE_USER_ID",
				"desc": "创建者ID",
				"dbType": "varchar",
				"bizType": "string",
				"typeLabel": "字符"
			},
			{
				"id": "F_QRLBX",
				"isPrivate": true,
				"name": "_CREATE_TIME",
				"desc": "创建时间",
				"dbType": "bigint",
				"bizType": "datetime",
				"typeLabel": "日期时间"
			},
			{
				"id": "F_J3ADX",
				"isPrivate": true,
				"name": "_UPDATE_USER_ID",
				"desc": "更新者ID",
				"dbType": "varchar",
				"bizType": "int",
				"typeLabel": "数字"
			},
			{
				"id": "F_OV_9Z",
				"isPrivate": true,
				"name": "_UPDATE_TIME",
				"desc": "最后更新时间",
				"dbType": "bigint",
				"bizType": "datetime",
				"typeLabel": "日期时间"
			},
			{
				"id": "F_CI5WI",
				"name": "姓名",
				"dbType": "varchar",
				"bizType": "string",
				"typeLabel": "字符"
			},
			{
				"id": "F_WAFPL",
				"name": "性别",
				"dbType": "varchar",
				"bizType": "string",
				"typeLabel": "字符"
			},
			{
				"id": "F_KWPFP",
				"name": "花名",
				"dbType": "varchar",
				"bizType": "string",
				"typeLabel": "字符"
			},
			{
				"id": "F_LJUB1",
				"name": "阿里工号",
				"dbType": "varchar",
				"bizType": "string",
				"typeLabel": "字符"
			},
			{
				"id": "F_GLRWE",
				"name": "阿里部门",
				"dbType": "varchar",
				"bizType": "string",
				"typeLabel": "字符",
				"relationEntityId": "E_UJATP"
			},
			{
				"id": "F_LWSJ6",
				"name": "入职时间",
				"dbType": "bigint",
				"bizType": "datetime",
				"typeLabel": "日期时间",
				"showFormat": "yyyy-MM-DD HH:mm:ss"
			},
			{
				"id": "F_FB_HZ",
				"name": "离职时间",
				"dbType": "bigint",
				"bizType": "datetime",
				"typeLabel": "日期时间",
				"showFormat": "yyyy-MM-DD HH:mm:ss"
			},
			{
				"id": "F_EV5SJ",
				"name": "手机号码",
				"dbType": "varchar",
				"bizType": "string",
				"typeLabel": "字符"
			},
			{
				"id": "F_7CKW_",
				"name": "邮箱",
				"dbType": "varchar",
				"bizType": "string",
				"typeLabel": "字符"
			},
			{
				"id": "F_STQR7",
				"name": "微信号",
				"dbType": "varchar",
				"bizType": "string",
				"typeLabel": "字符"
			},
			{
				"id": "F_QH4AS",
				"name": "常用住址",
				"dbType": "varchar",
				"bizType": "string",
				"typeLabel": "字符"
			},
			{
				"id": "F_L8WYS",
				"name": "公司",
				"dbType": "varchar",
				"bizType": "string",
				"typeLabel": "字符",
				"relationEntityId": "E_U5QR_"
			},
			{
				"id": "F_DVTLC",
				"name": "组织",
				"dbType": "bigint",
				"bizType": "relation",
				"typeLabel": "关联",
				"relationEntityId": "E_VR54U",
				"mapping": {
					"condition": "-1",
					"fieldJoiner": ",",
					"entity": {
						"id": "E_VR54U",
						"name": "组织表",
						"desc": "描述各类机构、组织、公益团体等",
						"field": {
							"id": "F_6H9ZF",
							"isPrimaryKey": true,
							"name": "id",
							"desc": "主键",
							"dbType": "bigint",
							"bizType": "number",
							"typeLabel": "数字"
						},
						"fieldAry": [
							{
								"id": "F_6H9ZF",
								"isPrimaryKey": true,
								"name": "id",
								"desc": "主键",
								"dbType": "bigint",
								"bizType": "number",
								"typeLabel": "数字"
							},
							{
								"id": "F_XJ5O7",
								"name": "组织名称",
								"dbType": "varchar",
								"bizType": "string",
								"typeLabel": "字符"
							},
							{
								"id": "F_HDU_R",
								"name": "类型",
								"dbType": "varchar",
								"bizType": "string",
								"typeLabel": "字符"
							},
							{
								"id": "F_RGBF6",
								"name": "负责人",
								"dbType": "varchar",
								"bizType": "SYS_USER",
								"typeLabel": "系统用户",
								"relationEntityId": "SYS_USER",
								"mapping": {
									"condition": "-1",
									"fieldJoiner": ",",
									"entity": {
										"id": "SYS_USER",
										"isSystem": true,
										"name": "系统用户",
										"field": {
											"id": "F_MG5P_",
											"isPrimaryKey": true,
											"name": "id",
											"desc": "主键",
											"dbType": "bigint",
											"bizType": "number",
											"typeLabel": "数字"
										},
										"fieldAry": [
											{
												"id": "F_MG5P_",
												"isPrimaryKey": true,
												"name": "id",
												"desc": "主键",
												"dbType": "bigint",
												"bizType": "number",
												"typeLabel": "数字"
											},
											{
												"id": "F__0M4G",
												"name": "名称",
												"dbType": "varchar",
												"bizType": "string",
												"typeLabel": "字符"
											}
										]
									},
									"type": "primary",
									"desc": "系统用户 的 id,名称"
								}
							}
						]
					},
					"type": "primary",
					"desc": "组织表 的 id,组织名称,类型,负责人"
				}
			},
			{
				"id": "F_SZQFO",
				"name": "注册时间",
				"dbType": "bigint",
				"bizType": "datetime",
				"typeLabel": "日期时间",
				"showFormat": "yyyy-MM-DD HH:mm:ss",
				"defaultValueWhenCreate": "$currentTime"
			},
			{
				"id": "F_HP5QS",
				"name": "个人简介",
				"desc": "文字介绍",
				"dbType": "mediumtext",
				"bizType": "string",
				"typeLabel": "长文本"
			},
			{
				"id": "F_S6MPS",
				"name": "标签",
				"dbType": "bigint",
				"bizType": "relation",
				"typeLabel": "关联",
				"relationEntityId": "E_1EQZX",
				"mapping": {
					"condition": "-1",
					"fieldJoiner": ",",
					"entity": {
						"id": "E_1EQZX",
						"name": "会员标签表",
						"desc": "会员标签化",
						"field": {
							"id": "F_FD4KP",
							"isPrimaryKey": true,
							"name": "id",
							"desc": "主键",
							"dbType": "bigint",
							"bizType": "number",
							"typeLabel": "数字"
						},
						"fieldAry": [
							{
								"id": "F_FD4KP",
								"isPrimaryKey": true,
								"name": "id",
								"desc": "主键",
								"dbType": "bigint",
								"bizType": "number",
								"typeLabel": "数字"
							},
							{
								"id": "F_HGXF6",
								"name": "标签名称",
								"dbType": "varchar",
								"bizType": "string",
								"typeLabel": "字符"
							},
							{
								"id": "F_IXEWY",
								"name": "说明",
								"dbType": "varchar",
								"bizType": "string",
								"typeLabel": "字符"
							}
						]
					},
					"type": "primary",
					"desc": "会员标签表 的 id,标签名称,说明"
				}
			},
			{
				"id": "F_Z0QC2",
				"name": "等级",
				"dbType": "bigint",
				"bizType": "relation",
				"typeLabel": "关联",
				"relationEntityId": "E_KUXFQ",
				"mapping": {
					"condition": "-1",
					"fieldJoiner": ",",
					"entity": {
						"id": "E_KUXFQ",
						"name": "会员等级表",
						"desc": "会员等级化",
						"field": {
							"id": "F_VTXRI",
							"isPrimaryKey": true,
							"name": "id",
							"desc": "主键",
							"dbType": "bigint",
							"bizType": "number",
							"typeLabel": "数字"
						},
						"fieldAry": [
							{
								"id": "F_VTXRI",
								"isPrimaryKey": true,
								"name": "id",
								"desc": "主键",
								"dbType": "bigint",
								"bizType": "number",
								"typeLabel": "数字"
							},
							{
								"id": "F_KCSJ6",
								"name": "等级名称",
								"dbType": "varchar",
								"bizType": "string",
								"typeLabel": "字符"
							},
							{
								"id": "F_SNREP",
								"name": "说明",
								"dbType": "varchar",
								"bizType": "string",
								"typeLabel": "字符"
							}
						]
					},
					"type": "primary",
					"desc": "会员等级表 的 id,等级名称,说明"
				}
			},
			{
				"id": "F_NZTL4",
				"name": "密码",
				"dbType": "varchar",
				"bizType": "string",
				"typeLabel": "字符"
			}
		]
	},
	{
		"id": "E_KUXFQ",
		"name": "会员等级表",
		"desc": "会员等级化",
		"fieldAry": [
			{
				"id": "F_VTXRI",
				"isPrimaryKey": true,
				"name": "id",
				"desc": "主键",
				"dbType": "bigint",
				"bizType": "number",
				"typeLabel": "数字"
			},
			{
				"id": "F_N_OD0",
				"isPrivate": true,
				"name": "_STATUS_DELETED",
				"desc": "是否已删除",
				"dbType": "int",
				"bizType": "number",
				"typeLabel": "数字"
			},
			{
				"id": "F_91PQV",
				"isPrivate": true,
				"name": "_CREATE_USER_ID",
				"desc": "创建者ID",
				"dbType": "varchar",
				"bizType": "string",
				"typeLabel": "字符"
			},
			{
				"id": "F_IXHFK",
				"isPrivate": true,
				"name": "_CREATE_TIME",
				"desc": "创建时间",
				"dbType": "bigint",
				"bizType": "datetime",
				"typeLabel": "日期时间"
			},
			{
				"id": "F__CNON",
				"isPrivate": true,
				"name": "_UPDATE_USER_ID",
				"desc": "更新者ID",
				"dbType": "varchar",
				"bizType": "int",
				"typeLabel": "数字"
			},
			{
				"id": "F_3Z0MI",
				"isPrivate": true,
				"name": "_UPDATE_TIME",
				"desc": "最后更新时间",
				"dbType": "bigint",
				"bizType": "datetime",
				"typeLabel": "日期时间"
			},
			{
				"id": "F_KCSJ6",
				"name": "等级名称",
				"dbType": "varchar",
				"bizType": "string",
				"typeLabel": "字符"
			},
			{
				"id": "F_SNREP",
				"name": "说明",
				"dbType": "varchar",
				"bizType": "string",
				"typeLabel": "字符"
			},
			{
				"id": "F_6_F3D",
				"name": "发布者",
				"dbType": "varchar",
				"bizType": "SYS_USER",
				"typeLabel": "系统用户",
				"relationEntityId": "SYS_USER",
				"mapping": {
					"condition": "-1",
					"fieldJoiner": ",",
					"entity": {
						"id": "SYS_USER",
						"isSystem": true,
						"name": "系统用户",
						"field": {
							"id": "F_MG5P_",
							"isPrimaryKey": true,
							"name": "id",
							"desc": "主键",
							"dbType": "bigint",
							"bizType": "number",
							"typeLabel": "数字"
						},
						"fieldAry": [
							{
								"id": "F_MG5P_",
								"isPrimaryKey": true,
								"name": "id",
								"desc": "主键",
								"dbType": "bigint",
								"bizType": "number",
								"typeLabel": "数字"
							},
							{
								"id": "F__0M4G",
								"name": "名称",
								"dbType": "varchar",
								"bizType": "string",
								"typeLabel": "字符"
							}
						]
					},
					"type": "primary",
					"desc": "系统用户 的 id,名称"
				}
			},
			{
				"id": "F_VJIR9",
				"name": "发布时间",
				"dbType": "bigint",
				"bizType": "datetime",
				"typeLabel": "日期时间"
			}
		]
	},
	{
		"id": "E_1EQZX",
		"name": "会员标签表",
		"desc": "会员标签化",
		"fieldAry": [
			{
				"id": "F_FD4KP",
				"isPrimaryKey": true,
				"name": "id",
				"desc": "主键",
				"dbType": "bigint",
				"bizType": "number",
				"typeLabel": "数字"
			},
			{
				"id": "F_7GJXE",
				"isPrivate": true,
				"name": "_STATUS_DELETED",
				"desc": "是否已删除",
				"dbType": "int",
				"bizType": "number",
				"typeLabel": "数字"
			},
			{
				"id": "F_6ELCJ",
				"isPrivate": true,
				"name": "_CREATE_USER_ID",
				"desc": "创建者ID",
				"dbType": "varchar",
				"bizType": "string",
				"typeLabel": "字符"
			},
			{
				"id": "F_OLCNQ",
				"isPrivate": true,
				"name": "_CREATE_TIME",
				"desc": "创建时间",
				"dbType": "bigint",
				"bizType": "datetime",
				"typeLabel": "日期时间"
			},
			{
				"id": "F_V0U8G",
				"isPrivate": true,
				"name": "_UPDATE_USER_ID",
				"desc": "更新者ID",
				"dbType": "varchar",
				"bizType": "int",
				"typeLabel": "数字"
			},
			{
				"id": "F_QEOBF",
				"isPrivate": true,
				"name": "_UPDATE_TIME",
				"desc": "最后更新时间",
				"dbType": "bigint",
				"bizType": "datetime",
				"typeLabel": "日期时间"
			},
			{
				"id": "F_HGXF6",
				"name": "标签名称",
				"dbType": "varchar",
				"bizType": "string",
				"typeLabel": "字符"
			},
			{
				"id": "F_IXEWY",
				"name": "说明",
				"dbType": "varchar",
				"bizType": "string",
				"typeLabel": "字符"
			},
			{
				"id": "F_VOAGR",
				"name": "发布者",
				"dbType": "varchar",
				"bizType": "SYS_USER",
				"typeLabel": "系统用户",
				"relationEntityId": "SYS_USER",
				"mapping": {
					"condition": "-1",
					"fieldJoiner": ",",
					"entity": {
						"id": "SYS_USER",
						"isSystem": true,
						"name": "系统用户",
						"field": {
							"id": "F_MG5P_",
							"isPrimaryKey": true,
							"name": "id",
							"desc": "主键",
							"dbType": "bigint",
							"bizType": "number",
							"typeLabel": "数字"
						},
						"fieldAry": [
							{
								"id": "F_MG5P_",
								"isPrimaryKey": true,
								"name": "id",
								"desc": "主键",
								"dbType": "bigint",
								"bizType": "number",
								"typeLabel": "数字"
							},
							{
								"id": "F__0M4G",
								"name": "名称",
								"dbType": "varchar",
								"bizType": "string",
								"typeLabel": "字符"
							}
						]
					},
					"type": "primary",
					"desc": "系统用户 的 id,名称"
				}
			},
			{
				"id": "F_TER_W",
				"name": "发布时间",
				"dbType": "bigint",
				"bizType": "datetime",
				"typeLabel": "日期时间"
			}
		]
	},
	{
		"id": "E_OMDG9",
		"name": "会员认证表",
		"desc": "会员认证信息",
		"fieldAry": [
			{
				"id": "F_XZ5WH",
				"isPrimaryKey": true,
				"name": "id",
				"desc": "主键",
				"dbType": "bigint",
				"bizType": "number",
				"typeLabel": "数字"
			},
			{
				"id": "F_6MUFF",
				"isPrivate": true,
				"name": "_STATUS_DELETED",
				"desc": "是否已删除",
				"dbType": "int",
				"bizType": "number",
				"typeLabel": "数字"
			},
			{
				"id": "F_IZMVS",
				"isPrivate": true,
				"name": "_CREATE_USER_ID",
				"desc": "创建者ID",
				"dbType": "varchar",
				"bizType": "string",
				"typeLabel": "字符"
			},
			{
				"id": "F_5Y6PL",
				"isPrivate": true,
				"name": "_CREATE_TIME",
				"desc": "创建时间",
				"dbType": "bigint",
				"bizType": "datetime",
				"typeLabel": "日期时间"
			},
			{
				"id": "F_3C4LJ",
				"isPrivate": true,
				"name": "_UPDATE_USER_ID",
				"desc": "更新者ID",
				"dbType": "varchar",
				"bizType": "int",
				"typeLabel": "数字"
			},
			{
				"id": "F_PVOGD",
				"isPrivate": true,
				"name": "_UPDATE_TIME",
				"desc": "最后更新时间",
				"dbType": "bigint",
				"bizType": "datetime",
				"typeLabel": "日期时间"
			},
			{
				"id": "F_FTM95",
				"name": "认证名称",
				"dbType": "varchar",
				"bizType": "string",
				"typeLabel": "字符"
			},
			{
				"id": "F_DIX_I",
				"name": "说明",
				"dbType": "varchar",
				"bizType": "string",
				"typeLabel": "字符"
			},
			{
				"id": "F_AIJNB",
				"name": "发布者",
				"dbType": "bigint",
				"bizType": "SYS_USER.CREATOR",
				"typeLabel": "创建者",
				"relationEntityId": "SYS_USER"
			},
			{
				"id": "F_KL1SW",
				"name": "发布时间",
				"dbType": "bigint",
				"bizType": "datetime",
				"typeLabel": "日期时间"
			}
		]
	},
	{
		"id": "E_U5QR_",
		"name": "公司表",
		"desc": "商业公司信息",
		"fieldAry": [
			{
				"id": "F_OSUSL",
				"isPrimaryKey": true,
				"name": "id",
				"desc": "主键",
				"dbType": "bigint",
				"bizType": "number",
				"typeLabel": "数字"
			},
			{
				"id": "F_P2IQO",
				"isPrivate": true,
				"name": "_STATUS_DELETED",
				"desc": "是否已删除",
				"dbType": "int",
				"bizType": "number",
				"typeLabel": "数字"
			},
			{
				"id": "F_4FS2E",
				"isPrivate": true,
				"name": "_CREATE_USER_ID",
				"desc": "创建者ID",
				"dbType": "varchar",
				"bizType": "string",
				"typeLabel": "字符"
			},
			{
				"id": "F_HBUL8",
				"isPrivate": true,
				"name": "_CREATE_TIME",
				"desc": "创建时间",
				"dbType": "bigint",
				"bizType": "datetime",
				"typeLabel": "日期时间"
			},
			{
				"id": "F_XBH4S",
				"isPrivate": true,
				"name": "_UPDATE_USER_ID",
				"desc": "更新者ID",
				"dbType": "varchar",
				"bizType": "int",
				"typeLabel": "数字"
			},
			{
				"id": "F_5VHS_",
				"isPrivate": true,
				"name": "_UPDATE_TIME",
				"desc": "最后更新时间",
				"dbType": "bigint",
				"bizType": "datetime",
				"typeLabel": "日期时间"
			},
			{
				"id": "F_QCPY_",
				"name": "组织名称",
				"dbType": "varchar",
				"bizType": "string",
				"typeLabel": "字符"
			},
			{
				"id": "F_K_JVX",
				"name": "类型",
				"dbType": "varchar",
				"bizType": "string",
				"typeLabel": "字符"
			},
			{
				"id": "F_1VEGN",
				"name": "法人",
				"dbType": "varchar",
				"bizType": "string",
				"typeLabel": "字符"
			},
			{
				"id": "F_CXJNU",
				"name": "信用代码",
				"dbType": "varchar",
				"bizType": "string",
				"typeLabel": "字符"
			},
			{
				"id": "F_FBVO6",
				"name": "注册地址",
				"dbType": "varchar",
				"bizType": "string",
				"typeLabel": "字符"
			},
			{
				"id": "F_VHDPG",
				"name": "业务类型",
				"dbType": "varchar",
				"bizType": "string",
				"typeLabel": "字符"
			},
			{
				"id": "F_2BVFG",
				"name": "发布者",
				"dbType": "bigint",
				"bizType": "SYS_USER.UPDATER",
				"typeLabel": "修改者",
				"relationEntityId": "SYS_USER"
			},
			{
				"id": "F_TP2CC",
				"name": "发布时间",
				"dbType": "bigint",
				"bizType": "datetime",
				"typeLabel": "日期时间"
			}
		]
	},
	{
		"id": "E_VR54U",
		"name": "组织表",
		"desc": "描述各类机构、组织、公益团体等",
		"fieldAry": [
			{
				"id": "F_6H9ZF",
				"isPrimaryKey": true,
				"name": "id",
				"desc": "主键",
				"dbType": "bigint",
				"bizType": "number",
				"typeLabel": "数字"
			},
			{
				"id": "F_NNZXP",
				"isPrivate": true,
				"name": "_STATUS_DELETED",
				"desc": "是否已删除",
				"dbType": "int",
				"bizType": "number",
				"typeLabel": "数字"
			},
			{
				"id": "F_CMSVZ",
				"isPrivate": true,
				"name": "_CREATE_USER_ID",
				"desc": "创建者ID",
				"dbType": "varchar",
				"bizType": "string",
				"typeLabel": "字符"
			},
			{
				"id": "F_I7UYX",
				"isPrivate": true,
				"name": "_CREATE_TIME",
				"desc": "创建时间",
				"dbType": "bigint",
				"bizType": "datetime",
				"typeLabel": "日期时间"
			},
			{
				"id": "F_W3HQH",
				"isPrivate": true,
				"name": "_UPDATE_USER_ID",
				"desc": "更新者ID",
				"dbType": "varchar",
				"bizType": "int",
				"typeLabel": "数字"
			},
			{
				"id": "F_ZBYYT",
				"isPrivate": true,
				"name": "_UPDATE_TIME",
				"desc": "最后更新时间",
				"dbType": "bigint",
				"bizType": "datetime",
				"typeLabel": "日期时间"
			},
			{
				"id": "F_XJ5O7",
				"name": "组织名称",
				"dbType": "varchar",
				"bizType": "string",
				"typeLabel": "字符"
			},
			{
				"id": "F_HDU_R",
				"name": "类型",
				"dbType": "varchar",
				"bizType": "string",
				"typeLabel": "字符"
			},
			{
				"id": "F_RGBF6",
				"name": "负责人",
				"dbType": "varchar",
				"bizType": "SYS_USER",
				"typeLabel": "系统用户",
				"relationEntityId": "SYS_USER",
				"mapping": {
					"condition": "-1",
					"fieldJoiner": ",",
					"entity": {
						"id": "SYS_USER",
						"isSystem": true,
						"name": "系统用户",
						"field": {
							"id": "F_MG5P_",
							"isPrimaryKey": true,
							"name": "id",
							"desc": "主键",
							"dbType": "bigint",
							"bizType": "number",
							"typeLabel": "数字"
						},
						"fieldAry": [
							{
								"id": "F_MG5P_",
								"isPrimaryKey": true,
								"name": "id",
								"desc": "主键",
								"dbType": "bigint",
								"bizType": "number",
								"typeLabel": "数字"
							},
							{
								"id": "F__0M4G",
								"name": "名称",
								"dbType": "varchar",
								"bizType": "string",
								"typeLabel": "字符"
							}
						]
					},
					"type": "primary",
					"desc": "系统用户 的 id,名称"
				}
			},
			{
				"id": "F_OMZFZ",
				"name": "发布者",
				"dbType": "varchar",
				"bizType": "SYS_USER",
				"typeLabel": "系统用户",
				"relationEntityId": "SYS_USER",
				"mapping": {
					"condition": "-1",
					"fieldJoiner": ",",
					"entity": {
						"id": "SYS_USER",
						"isSystem": true,
						"name": "系统用户",
						"field": {
							"id": "F_MG5P_",
							"isPrimaryKey": true,
							"name": "id",
							"desc": "主键",
							"dbType": "bigint",
							"bizType": "number",
							"typeLabel": "数字"
						},
						"fieldAry": [
							{
								"id": "F_MG5P_",
								"isPrimaryKey": true,
								"name": "id",
								"desc": "主键",
								"dbType": "bigint",
								"bizType": "number",
								"typeLabel": "数字"
							},
							{
								"id": "F__0M4G",
								"name": "名称",
								"dbType": "varchar",
								"bizType": "string",
								"typeLabel": "字符"
							}
						]
					},
					"type": "primary",
					"desc": "系统用户 的 id,名称"
				}
			},
			{
				"id": "F_7GJQV",
				"name": "发布时间",
				"dbType": "varchar",
				"bizType": "string",
				"typeLabel": "字符"
			}
		]
	},
	{
		"id": "E_UJATP",
		"name": "阿里巴巴部门",
		"desc": "阿里巴巴组织架构",
		"fieldAry": [
			{
				"id": "F_4UH7T",
				"isPrimaryKey": true,
				"name": "id",
				"desc": "主键",
				"dbType": "bigint",
				"bizType": "number",
				"typeLabel": "数字"
			},
			{
				"id": "F_TE8VU",
				"isPrivate": true,
				"name": "_STATUS_DELETED",
				"desc": "是否已删除",
				"dbType": "int",
				"bizType": "number",
				"typeLabel": "数字"
			},
			{
				"id": "F_C1LST",
				"isPrivate": true,
				"name": "_CREATE_USER_ID",
				"desc": "创建者ID",
				"dbType": "varchar",
				"bizType": "string",
				"typeLabel": "字符"
			},
			{
				"id": "F_CQCHP",
				"isPrivate": true,
				"name": "_CREATE_TIME",
				"desc": "创建时间",
				"dbType": "bigint",
				"bizType": "datetime",
				"typeLabel": "日期时间"
			},
			{
				"id": "F_HVSKO",
				"isPrivate": true,
				"name": "_UPDATE_USER_ID",
				"desc": "更新者ID",
				"dbType": "varchar",
				"bizType": "int",
				"typeLabel": "数字"
			},
			{
				"id": "F_R_WBY",
				"isPrivate": true,
				"name": "_UPDATE_TIME",
				"desc": "最后更新时间",
				"dbType": "bigint",
				"bizType": "datetime",
				"typeLabel": "日期时间"
			},
			{
				"id": "F_NVW9C",
				"name": "部门名称",
				"dbType": "varchar",
				"bizType": "string",
				"typeLabel": "字符"
			},
			{
				"id": "F_JKXOM",
				"name": "部门说明",
				"dbType": "varchar",
				"bizType": "string",
				"typeLabel": "字符"
			},
			{
				"id": "F_SFKPA",
				"name": "发布者",
				"dbType": "varchar",
				"bizType": "SYS_USER",
				"typeLabel": "系统用户",
				"relationEntityId": "SYS_USER",
				"mapping": {
					"condition": "-1",
					"fieldJoiner": ",",
					"entity": {
						"id": "SYS_USER",
						"isSystem": true,
						"name": "系统用户",
						"field": {
							"id": "F_MG5P_",
							"isPrimaryKey": true,
							"name": "id",
							"desc": "主键",
							"dbType": "bigint",
							"bizType": "number",
							"typeLabel": "数字"
						},
						"fieldAry": [
							{
								"id": "F_MG5P_",
								"isPrimaryKey": true,
								"name": "id",
								"desc": "主键",
								"dbType": "bigint",
								"bizType": "number",
								"typeLabel": "数字"
							},
							{
								"id": "F__0M4G",
								"name": "名称",
								"dbType": "varchar",
								"bizType": "string",
								"typeLabel": "字符"
							}
						]
					},
					"type": "primary",
					"desc": "系统用户 的 id,名称"
				}
			},
			{
				"id": "F_A9ZHY",
				"name": "发布时间",
				"dbType": "bigint",
				"bizType": "datetime",
				"typeLabel": "日期时间"
			}
		]
	},
	{
		"id": "E_SKMDR",
		"name": "测试表",
		"fieldAry": [
			{
				"id": "F_CSZNM",
				"isPrimaryKey": true,
				"name": "id",
				"desc": "主键",
				"dbType": "bigint",
				"bizType": "number",
				"typeLabel": "数字"
			},
			{
				"id": "F_SX7LI",
				"isPrivate": true,
				"name": "_STATUS_DELETED",
				"desc": "是否已删除",
				"dbType": "int",
				"bizType": "number",
				"typeLabel": "数字"
			},
			{
				"id": "F_WXCSQ",
				"isPrivate": true,
				"name": "_CREATE_USER_ID",
				"desc": "创建者ID",
				"dbType": "varchar",
				"bizType": "string",
				"typeLabel": "字符"
			},
			{
				"id": "F_MJSEG",
				"isPrivate": true,
				"name": "_CREATE_TIME",
				"desc": "创建时间",
				"dbType": "bigint",
				"bizType": "datetime",
				"typeLabel": "日期时间"
			},
			{
				"id": "F_TLNU9",
				"isPrivate": true,
				"name": "_UPDATE_USER_ID",
				"desc": "更新者ID",
				"dbType": "varchar",
				"bizType": "int",
				"typeLabel": "数字"
			},
			{
				"id": "F_MHNS_",
				"isPrivate": true,
				"name": "_UPDATE_TIME",
				"desc": "最后更新时间",
				"dbType": "bigint",
				"bizType": "datetime",
				"typeLabel": "日期时间"
			}
		]
	}
];