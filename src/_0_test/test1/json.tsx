export const toJSON = {
  "themes": {
    "comThemes": {}
  },
  "global": {
    "comsReg": {},
    "consReg": {},
    "pinRels": {},
    "pinProxies": {},
    "fxFrames": []
  },
  "scenes": [
    {
      "-v": "1.0.19",
      "deps": [
        {
          "namespace": "fangzhou.normal-pc.custom-button",
          "version": "1.0.2"
        },
        {
          "namespace": "fangzhou.normal-pc.drawer",
          "version": "1.0.7",
          "materialId": 25365
        },
        {
          "namespace": "fangzhou.normal-pc.form-blocks",
          "version": "1.2.79",
          "materialId": 27839
        },
        {
          "namespace": "fangzhou.normal-pc.code.segment",
          "version": "1.1.2",
          "rtType": "js-autorun",
          "materialId": 27685
        },
        {
          "namespace": "fangzhou.normal-pc.service",
          "version": "1.0.9",
          "rtType": "js-autorun",
          "materialId": 25416
        },
        {
          "namespace": "fangzhou.normal-pc.message",
          "version": "1.0.11",
          "rtType": "js",
          "materialId": 25468
        }
      ],
      "coms": {
        "u_eDNcd": {
          "id": "u_eDNcd",
          "def": {
            "namespace": "fangzhou.normal-pc.custom-button",
            "version": "1.0.2"
          },
          "title": "按钮",
          "model": {
            "data": {
              "asMapArea": false,
              "style": {
                "borderColor": "#AAA",
                "borderWidth": "1px",
                "borderStyle": "solid",
                "borderRadius": "10px",
                "backgroundColor": "#FFF"
              },
              "text": "按钮1234567"
            },
            "inputAry": [],
            "outputAry": [],
            "outputEvents": {
              "click": [
                {
                  "type": "defined",
                  "options": {},
                  "active": true
                }
              ]
            },
            "style": {
              "width": 80,
              "height": 50,
              "_new": true
            }
          },
          "style": {
            "width": 80,
            "height": 50
          },
          "configs": [],
          "_inputs": [],
          "inputs": [
            "show",
            "hide",
            "showOrHide"
          ],
          "outputs": [
            "click"
          ]
        },
        "u_pWIP-": {
          "id": "u_pWIP-",
          "def": {
            "namespace": "fangzhou.normal-pc.drawer",
            "version": "1.0.7",
            "materialId": 25365
          },
          "title": "抽屉",
          "model": {
            "data": {
              "title": "提报重点招商商家",
              "position": "right",
              "showMask": true,
              "visible": false,
              "width": "600px",
              "height": 200,
              "useFooter": false,
              "footerAlign": "right",
              "showFull": false,
              "bodyStyle": {
                "backgroundColor": ""
              }
            },
            "inputAry": [],
            "outputAry": [],
            "outputEvents": {
              "cancel": [
                {
                  "type": "defined",
                  "options": {},
                  "active": true
                }
              ]
            },
            "style": {
              "left": 0,
              "top": 0,
              "position": "fixed",
              "height": "100%",
              "width": "100%",
              "_new": true,
              "flex": null
            }
          },
          "style": {},
          "configs": [],
          "_inputs": [],
          "inputs": [
            "close",
            "open",
            "title",
            "inputData",
            "show",
            "hide"
          ],
          "outputs": [
            "cancel"
          ]
        },
        "u_ST_e0": {
          "id": "u_ST_e0",
          "def": {
            "namespace": "fangzhou.normal-pc.form-blocks",
            "version": "1.2.79",
            "materialId": 27839
          },
          "title": "提报表单",
          "model": {
            "data": {
              "formItems": [
                {
                  "key": "u_x68w8j",
                  "label": "商家ID",
                  "name": "userId",
                  "size": "small",
                  "type": "inputText",
                  "disabled": false,
                  "placeholder": "请输入商家id，英文逗号隔开",
                  "validator": "\nexport default async function (model, context) {\n  const item = model.curFormItem;\n  if (!model.curValue && ![0, false].includes(model.curValue)) {\n    context.failed(`${item.label}不能为空`)\n  } else {\n    context.success();\n  }\n}\n",
                  "validateCode": "\nexport default function (value) {\n  return true\n}\n",
                  "blocksValidator": {},
                  "options": [],
                  "fieldsFormItems": [],
                  "rules": [
                    "required"
                  ],
                  "presetRules": [
                    {
                      "_id": "0-arrayCheckbox-item",
                      "key": "required",
                      "status": true,
                      "title": "必填",
                      "visible": true,
                      "message": "${label}不能为空"
                    },
                    {
                      "_id": "1-arrayCheckbox-item",
                      "key": "minLength",
                      "visible": true,
                      "status": false,
                      "title": "最小字数限制",
                      "message": "${label}的长度不能小于${limit}",
                      "numericalLimit": [
                        null
                      ]
                    },
                    {
                      "_id": "2-arrayCheckbox-item",
                      "key": "maxLength",
                      "visible": true,
                      "status": false,
                      "title": "最大字数限制",
                      "message": "${label}的长度不能大于${limit}",
                      "numericalLimit": [
                        null
                      ]
                    },
                    {
                      "_id": "3-arrayCheckbox-item",
                      "key": "min",
                      "visible": false,
                      "status": false,
                      "title": "最小值",
                      "message": "${label}不能小于${limit}",
                      "numericalLimit": [
                        0
                      ]
                    },
                    {
                      "_id": "4-arrayCheckbox-item",
                      "key": "max",
                      "visible": false,
                      "status": false,
                      "title": "最大值",
                      "message": "${label}不能大于${limit}",
                      "numericalLimit": [
                        0
                      ]
                    },
                    {
                      "_id": "5-arrayCheckbox-item",
                      "key": "regExp",
                      "visible": true,
                      "status": false,
                      "title": "正则校验",
                      "message": "${label}不满足校验规则",
                      "regExr": "%5E%5BA-Za-z0-9%5D%2B%24",
                      "customRegExr": ""
                    },
                    {
                      "_id": "6-arrayCheckbox-item",
                      "key": "codeValidator",
                      "visible": true,
                      "status": false,
                      "title": "代码校验",
                      "validateCode": "\nexport default async function (model, context) {\n  const item = model.curFormItem;\n  if (!model.curValue && ![0, false].includes(model.curValue)) {\n    context.failed(`${item.label}不能为空`)\n  } else {\n    context.success();\n  }\n}\n"
                    }
                  ]
                },
                {
                  "key": "u_462c4h",
                  "label": "所属行业",
                  "name": "industry",
                  "size": "small",
                  "type": "select",
                  "disabled": true,
                  "placeholder": "您无权限操作",
                  "validator": "\nexport default async function (model, context) {\n  const item = model.curFormItem;\n  if (!model.curValue && ![0, false].includes(model.curValue)) {\n    context.failed(`${item.label}不能为空`)\n  } else {\n    context.success();\n  }\n}\n",
                  "blocksValidator": {},
                  "options": [],
                  "fieldsFormItems": [],
                  "compositionItems": [],
                  "visible": true,
                  "useCodeValidator": false,
                  "presetRules": [
                    {
                      "_id": "0-arrayCheckbox-item",
                      "key": "required",
                      "status": true,
                      "title": "必填",
                      "visible": true,
                      "message": "${label}不能为空"
                    },
                    {
                      "_id": "1-arrayCheckbox-item",
                      "key": "minLength",
                      "visible": false,
                      "status": false,
                      "title": "最小字数限制",
                      "message": "${label}的长度不能小于${limit}",
                      "numericalLimit": [
                        null
                      ]
                    },
                    {
                      "_id": "2-arrayCheckbox-item",
                      "key": "maxLength",
                      "visible": false,
                      "status": false,
                      "title": "最大字数限制",
                      "message": "${label}的长度不能大于${limit}",
                      "numericalLimit": [
                        null
                      ]
                    },
                    {
                      "_id": "3-arrayCheckbox-item",
                      "key": "min",
                      "visible": false,
                      "status": false,
                      "title": "最小值",
                      "message": "${label}不能小于${limit}",
                      "numericalLimit": [
                        0
                      ]
                    },
                    {
                      "_id": "4-arrayCheckbox-item",
                      "key": "max",
                      "visible": false,
                      "status": false,
                      "title": "最大值",
                      "message": "${label}不能大于${limit}",
                      "numericalLimit": [
                        0
                      ]
                    },
                    {
                      "_id": "5-arrayCheckbox-item",
                      "key": "regExp",
                      "visible": false,
                      "status": false,
                      "title": "正则校验",
                      "message": "${label}不满足校验规则",
                      "regExr": "%5E%5BA-Za-z0-9%5D%2B%24",
                      "customRegExr": ""
                    },
                    {
                      "_id": "6-arrayCheckbox-item",
                      "key": "codeValidator",
                      "visible": true,
                      "status": false,
                      "title": "代码校验",
                      "validateCode": "\nexport default async function (model, context) {\n  const item = model.curFormItem;\n  if (!model.curValue && ![0, false].includes(model.curValue)) {\n    context.failed(`${item.label}不能为空`)\n  } else {\n    context.success();\n  }\n}\n"
                    }
                  ],
                  "rules": [
                    "required"
                  ],
                  "dropdownMatchSelectWidth": true,
                  "dropdownShowArrow": true,
                  "useInitialValue": false,
                  "labelInValue": false
                },
                {
                  "key": "u_cwr4r8",
                  "label": "提报活动",
                  "name": "reportActivity",
                  "size": "small",
                  "type": "select",
                  "disabled": true,
                  "placeholder": "您无权限操作",
                  "validator": "\nexport default async function (model, context) {\n  const item = model.curFormItem;\n  if (!model.curValue && ![0, false].includes(model.curValue)) {\n    context.failed(`${item.label}不能为空`)\n  } else {\n    context.success();\n  }\n}\n",
                  "blocksValidator": {},
                  "options": [],
                  "fieldsFormItems": [],
                  "compositionItems": [],
                  "visible": true,
                  "useCodeValidator": false,
                  "presetRules": [
                    {
                      "_id": "0-arrayCheckbox-item",
                      "key": "required",
                      "status": true,
                      "title": "必填",
                      "visible": true,
                      "message": "${label}不能为空"
                    },
                    {
                      "_id": "1-arrayCheckbox-item",
                      "key": "minLength",
                      "visible": false,
                      "status": false,
                      "title": "最小字数限制",
                      "message": "${label}的长度不能小于${limit}",
                      "numericalLimit": [
                        null
                      ]
                    },
                    {
                      "_id": "2-arrayCheckbox-item",
                      "key": "maxLength",
                      "visible": false,
                      "status": false,
                      "title": "最大字数限制",
                      "message": "${label}的长度不能大于${limit}",
                      "numericalLimit": [
                        null
                      ]
                    },
                    {
                      "_id": "3-arrayCheckbox-item",
                      "key": "min",
                      "visible": false,
                      "status": false,
                      "title": "最小值",
                      "message": "${label}不能小于${limit}",
                      "numericalLimit": [
                        0
                      ]
                    },
                    {
                      "_id": "4-arrayCheckbox-item",
                      "key": "max",
                      "visible": false,
                      "status": false,
                      "title": "最大值",
                      "message": "${label}不能大于${limit}",
                      "numericalLimit": [
                        0
                      ]
                    },
                    {
                      "_id": "5-arrayCheckbox-item",
                      "key": "regExp",
                      "visible": false,
                      "status": false,
                      "title": "正则校验",
                      "message": "${label}不满足校验规则",
                      "regExr": "%5E%5BA-Za-z0-9%5D%2B%24",
                      "customRegExr": ""
                    },
                    {
                      "_id": "6-arrayCheckbox-item",
                      "key": "codeValidator",
                      "visible": true,
                      "status": false,
                      "title": "代码校验",
                      "validateCode": "\nexport default async function (model, context) {\n  const item = model.curFormItem;\n  if (!model.curValue && ![0, false].includes(model.curValue)) {\n    context.failed(`${item.label}不能为空`)\n  } else {\n    context.success();\n  }\n}\n"
                    }
                  ],
                  "rules": [
                    "required"
                  ],
                  "dropdownMatchSelectWidth": true,
                  "dropdownShowArrow": true,
                  "useInitialValue": false,
                  "labelInValue": false
                },
                {
                  "key": "u_79s2p4",
                  "label": "开始时间",
                  "name": "startTime",
                  "size": "small",
                  "type": "datePicker",
                  "disabled": false,
                  "placeholder": "请选择日期",
                  "validator": "\nexport default async function (model, context) {\n  const item = model.curFormItem;\n  if (!model.curValue && ![0, false].includes(model.curValue)) {\n    context.failed(`${item.label}不能为空`)\n  } else {\n    context.success();\n  }\n}\n",
                  "blocksValidator": {},
                  "options": [],
                  "fieldsFormItems": [],
                  "compositionItems": [],
                  "visible": true,
                  "useCodeValidator": false,
                  "presetRules": [
                    {
                      "_id": "0-arrayCheckbox-item",
                      "key": "required",
                      "status": true,
                      "title": "必填",
                      "visible": true,
                      "message": "${label}不能为空"
                    },
                    {
                      "_id": "1-arrayCheckbox-item",
                      "key": "minLength",
                      "visible": false,
                      "status": false,
                      "title": "最小字数限制",
                      "message": "${label}的长度不能小于${limit}",
                      "numericalLimit": [
                        null
                      ]
                    },
                    {
                      "_id": "2-arrayCheckbox-item",
                      "key": "maxLength",
                      "visible": false,
                      "status": false,
                      "title": "最大字数限制",
                      "message": "${label}的长度不能大于${limit}",
                      "numericalLimit": [
                        null
                      ]
                    },
                    {
                      "_id": "3-arrayCheckbox-item",
                      "key": "min",
                      "visible": false,
                      "status": false,
                      "title": "最小值",
                      "message": "${label}不能小于${limit}",
                      "numericalLimit": [
                        0
                      ]
                    },
                    {
                      "_id": "4-arrayCheckbox-item",
                      "key": "max",
                      "visible": false,
                      "status": false,
                      "title": "最大值",
                      "message": "${label}不能大于${limit}",
                      "numericalLimit": [
                        0
                      ]
                    },
                    {
                      "_id": "5-arrayCheckbox-item",
                      "key": "regExp",
                      "visible": false,
                      "status": false,
                      "title": "正则校验",
                      "message": "${label}不满足校验规则",
                      "regExr": "%5E%5BA-Za-z0-9%5D%2B%24",
                      "customRegExr": ""
                    },
                    {
                      "_id": "6-arrayCheckbox-item",
                      "key": "codeValidator",
                      "visible": true,
                      "status": false,
                      "title": "代码校验",
                      "validateCode": "\nexport default async function (model, context) {\n  const item = model.curFormItem;\n  if (!model.curValue && ![0, false].includes(model.curValue)) {\n    context.failed(`${item.label}不能为空`)\n  } else {\n    context.success();\n  }\n}\n"
                    }
                  ],
                  "rules": [
                    "required"
                  ],
                  "picker": "date",
                  "useInitialValue": false,
                  "showTime": false
                }
              ],
              "layout": "horizontal",
              "size": "default",
              "labelAlign": "right",
              "labelWidthType": "default",
              "wrapperCol": 24,
              "intervalMargin": 24,
              "columnCount": 1,
              "primaryBtnText": "提交",
              "showSecondBtn": true,
              "secondBtnText": "取消",
              "actionAlign": "end",
              "isFollow": false,
              "matchMap": {},
              "actionPosition": "right-bottom",
              "params": {},
              "immediate": false,
              "fieldsValue": "{}",
              "showActions": true,
              "initialValues": {},
              "submitActions": [],
              "layoutModel": "row",
              "showLabel": true,
              "colon": true,
              "resetBtn": {
                "text": "重置",
                "isVisible": false
              },
              "defaultInitialFormItemDesc": true,
              "useSubmitBtnLoading": false,
              "submitDebounce": {
                "enable": false,
                "wait": 300
              },
              "actionsConfig": {
                "useLabelWidth": true
              },
              "useInitialOutput": false,
              "useInitialDescOutput": false,
              "formRef": {
                "current": {
                  "_init": true,
                  "__INTERNAL__": {}
                }
              },
              "useCode": true,
              "formJS": {
                "code": "export%20default%20async%20function%20(model%2C%20context)%20%7B%0A%20%20const%20industry%20%3D%20model.formItems%5B'industry'%5D%3B%0A%20%20const%20reportActivity%20%3D%20model.formItems%5B'reportActivity'%5D%3B%0A%20%20%2F%2F%20%E5%85%B3%E8%81%94%E5%BA%94%E7%94%A8%E6%9F%A5%E8%AF%A2RPC%0A%20%20const%20serviceId%20%3D%20'u_gWCdu'%3B%0A%20%20const%20data%20%3D%20await%20context.callService(serviceId%2C%20%7B%0A%20%20%7D)%3B%0A%20%20%2F%2F%20%E5%85%B3%E8%81%94%E5%BA%94%E7%94%A8%0A%20%20industry.value%20%3D%20data.data.industry%3B%0A%20%20reportActivity.value%20%3D%20data.data.activityName%3B%0A%7D",
                "transformCode": "(function()%20%7B%20var%20_RTFN_%3B%20%0A%22use%20strict%22%3B%0A%0Afunction%20_typeof(obj)%20%7B%20%22%40babel%2Fhelpers%20-%20typeof%22%3B%20return%20_typeof%20%3D%20%22function%22%20%3D%3D%20typeof%20Symbol%20%26%26%20%22symbol%22%20%3D%3D%20typeof%20Symbol.iterator%20%3F%20function%20(obj)%20%7B%20return%20typeof%20obj%3B%20%7D%20%3A%20function%20(obj)%20%7B%20return%20obj%20%26%26%20%22function%22%20%3D%3D%20typeof%20Symbol%20%26%26%20obj.constructor%20%3D%3D%3D%20Symbol%20%26%26%20obj%20!%3D%3D%20Symbol.prototype%20%3F%20%22symbol%22%20%3A%20typeof%20obj%3B%20%7D%2C%20_typeof(obj)%3B%20%7D%0A%0Afunction%20_regeneratorRuntime()%20%7B%20%22use%20strict%22%3B%20_regeneratorRuntime%20%3D%20function%20_regeneratorRuntime()%20%7B%20return%20exports%3B%20%7D%3B%20var%20exports%20%3D%20%7B%7D%2C%20Op%20%3D%20Object.prototype%2C%20hasOwn%20%3D%20Op.hasOwnProperty%2C%20%24Symbol%20%3D%20%22function%22%20%3D%3D%20typeof%20Symbol%20%3F%20Symbol%20%3A%20%7B%7D%2C%20iteratorSymbol%20%3D%20%24Symbol.iterator%20%7C%7C%20%22%40%40iterator%22%2C%20asyncIteratorSymbol%20%3D%20%24Symbol.asyncIterator%20%7C%7C%20%22%40%40asyncIterator%22%2C%20toStringTagSymbol%20%3D%20%24Symbol.toStringTag%20%7C%7C%20%22%40%40toStringTag%22%3B%20function%20define(obj%2C%20key%2C%20value)%20%7B%20return%20Object.defineProperty(obj%2C%20key%2C%20%7B%20value%3A%20value%2C%20enumerable%3A%20!0%2C%20configurable%3A%20!0%2C%20writable%3A%20!0%20%7D)%2C%20obj%5Bkey%5D%3B%20%7D%20try%20%7B%20define(%7B%7D%2C%20%22%22)%3B%20%7D%20catch%20(err)%20%7B%20define%20%3D%20function%20define(obj%2C%20key%2C%20value)%20%7B%20return%20obj%5Bkey%5D%20%3D%20value%3B%20%7D%3B%20%7D%20function%20wrap(innerFn%2C%20outerFn%2C%20self%2C%20tryLocsList)%20%7B%20var%20protoGenerator%20%3D%20outerFn%20%26%26%20outerFn.prototype%20instanceof%20Generator%20%3F%20outerFn%20%3A%20Generator%2C%20generator%20%3D%20Object.create(protoGenerator.prototype)%2C%20context%20%3D%20new%20Context(tryLocsList%20%7C%7C%20%5B%5D)%3B%20return%20generator._invoke%20%3D%20function%20(innerFn%2C%20self%2C%20context)%20%7B%20var%20state%20%3D%20%22suspendedStart%22%3B%20return%20function%20(method%2C%20arg)%20%7B%20if%20(%22executing%22%20%3D%3D%3D%20state)%20throw%20new%20Error(%22Generator%20is%20already%20running%22)%3B%20if%20(%22completed%22%20%3D%3D%3D%20state)%20%7B%20if%20(%22throw%22%20%3D%3D%3D%20method)%20throw%20arg%3B%20return%20doneResult()%3B%20%7D%20for%20(context.method%20%3D%20method%2C%20context.arg%20%3D%20arg%3B%3B)%20%7B%20var%20delegate%20%3D%20context.delegate%3B%20if%20(delegate)%20%7B%20var%20delegateResult%20%3D%20maybeInvokeDelegate(delegate%2C%20context)%3B%20if%20(delegateResult)%20%7B%20if%20(delegateResult%20%3D%3D%3D%20ContinueSentinel)%20continue%3B%20return%20delegateResult%3B%20%7D%20%7D%20if%20(%22next%22%20%3D%3D%3D%20context.method)%20context.sent%20%3D%20context._sent%20%3D%20context.arg%3Belse%20if%20(%22throw%22%20%3D%3D%3D%20context.method)%20%7B%20if%20(%22suspendedStart%22%20%3D%3D%3D%20state)%20throw%20state%20%3D%20%22completed%22%2C%20context.arg%3B%20context.dispatchException(context.arg)%3B%20%7D%20else%20%22return%22%20%3D%3D%3D%20context.method%20%26%26%20context.abrupt(%22return%22%2C%20context.arg)%3B%20state%20%3D%20%22executing%22%3B%20var%20record%20%3D%20tryCatch(innerFn%2C%20self%2C%20context)%3B%20if%20(%22normal%22%20%3D%3D%3D%20record.type)%20%7B%20if%20(state%20%3D%20context.done%20%3F%20%22completed%22%20%3A%20%22suspendedYield%22%2C%20record.arg%20%3D%3D%3D%20ContinueSentinel)%20continue%3B%20return%20%7B%20value%3A%20record.arg%2C%20done%3A%20context.done%20%7D%3B%20%7D%20%22throw%22%20%3D%3D%3D%20record.type%20%26%26%20(state%20%3D%20%22completed%22%2C%20context.method%20%3D%20%22throw%22%2C%20context.arg%20%3D%20record.arg)%3B%20%7D%20%7D%3B%20%7D(innerFn%2C%20self%2C%20context)%2C%20generator%3B%20%7D%20function%20tryCatch(fn%2C%20obj%2C%20arg)%20%7B%20try%20%7B%20return%20%7B%20type%3A%20%22normal%22%2C%20arg%3A%20fn.call(obj%2C%20arg)%20%7D%3B%20%7D%20catch%20(err)%20%7B%20return%20%7B%20type%3A%20%22throw%22%2C%20arg%3A%20err%20%7D%3B%20%7D%20%7D%20exports.wrap%20%3D%20wrap%3B%20var%20ContinueSentinel%20%3D%20%7B%7D%3B%20function%20Generator()%20%7B%7D%20function%20GeneratorFunction()%20%7B%7D%20function%20GeneratorFunctionPrototype()%20%7B%7D%20var%20IteratorPrototype%20%3D%20%7B%7D%3B%20define(IteratorPrototype%2C%20iteratorSymbol%2C%20function%20()%20%7B%20return%20this%3B%20%7D)%3B%20var%20getProto%20%3D%20Object.getPrototypeOf%2C%20NativeIteratorPrototype%20%3D%20getProto%20%26%26%20getProto(getProto(values(%5B%5D)))%3B%20NativeIteratorPrototype%20%26%26%20NativeIteratorPrototype%20!%3D%3D%20Op%20%26%26%20hasOwn.call(NativeIteratorPrototype%2C%20iteratorSymbol)%20%26%26%20(IteratorPrototype%20%3D%20NativeIteratorPrototype)%3B%20var%20Gp%20%3D%20GeneratorFunctionPrototype.prototype%20%3D%20Generator.prototype%20%3D%20Object.create(IteratorPrototype)%3B%20function%20defineIteratorMethods(prototype)%20%7B%20%5B%22next%22%2C%20%22throw%22%2C%20%22return%22%5D.forEach(function%20(method)%20%7B%20define(prototype%2C%20method%2C%20function%20(arg)%20%7B%20return%20this._invoke(method%2C%20arg)%3B%20%7D)%3B%20%7D)%3B%20%7D%20function%20AsyncIterator(generator%2C%20PromiseImpl)%20%7B%20function%20invoke(method%2C%20arg%2C%20resolve%2C%20reject)%20%7B%20var%20record%20%3D%20tryCatch(generator%5Bmethod%5D%2C%20generator%2C%20arg)%3B%20if%20(%22throw%22%20!%3D%3D%20record.type)%20%7B%20var%20result%20%3D%20record.arg%2C%20value%20%3D%20result.value%3B%20return%20value%20%26%26%20%22object%22%20%3D%3D%20_typeof(value)%20%26%26%20hasOwn.call(value%2C%20%22__await%22)%20%3F%20PromiseImpl.resolve(value.__await).then(function%20(value)%20%7B%20invoke(%22next%22%2C%20value%2C%20resolve%2C%20reject)%3B%20%7D%2C%20function%20(err)%20%7B%20invoke(%22throw%22%2C%20err%2C%20resolve%2C%20reject)%3B%20%7D)%20%3A%20PromiseImpl.resolve(value).then(function%20(unwrapped)%20%7B%20result.value%20%3D%20unwrapped%2C%20resolve(result)%3B%20%7D%2C%20function%20(error)%20%7B%20return%20invoke(%22throw%22%2C%20error%2C%20resolve%2C%20reject)%3B%20%7D)%3B%20%7D%20reject(record.arg)%3B%20%7D%20var%20previousPromise%3B%20this._invoke%20%3D%20function%20(method%2C%20arg)%20%7B%20function%20callInvokeWithMethodAndArg()%20%7B%20return%20new%20PromiseImpl(function%20(resolve%2C%20reject)%20%7B%20invoke(method%2C%20arg%2C%20resolve%2C%20reject)%3B%20%7D)%3B%20%7D%20return%20previousPromise%20%3D%20previousPromise%20%3F%20previousPromise.then(callInvokeWithMethodAndArg%2C%20callInvokeWithMethodAndArg)%20%3A%20callInvokeWithMethodAndArg()%3B%20%7D%3B%20%7D%20function%20maybeInvokeDelegate(delegate%2C%20context)%20%7B%20var%20method%20%3D%20delegate.iterator%5Bcontext.method%5D%3B%20if%20(undefined%20%3D%3D%3D%20method)%20%7B%20if%20(context.delegate%20%3D%20null%2C%20%22throw%22%20%3D%3D%3D%20context.method)%20%7B%20if%20(delegate.iterator%5B%22return%22%5D%20%26%26%20(context.method%20%3D%20%22return%22%2C%20context.arg%20%3D%20undefined%2C%20maybeInvokeDelegate(delegate%2C%20context)%2C%20%22throw%22%20%3D%3D%3D%20context.method))%20return%20ContinueSentinel%3B%20context.method%20%3D%20%22throw%22%2C%20context.arg%20%3D%20new%20TypeError(%22The%20iterator%20does%20not%20provide%20a%20'throw'%20method%22)%3B%20%7D%20return%20ContinueSentinel%3B%20%7D%20var%20record%20%3D%20tryCatch(method%2C%20delegate.iterator%2C%20context.arg)%3B%20if%20(%22throw%22%20%3D%3D%3D%20record.type)%20return%20context.method%20%3D%20%22throw%22%2C%20context.arg%20%3D%20record.arg%2C%20context.delegate%20%3D%20null%2C%20ContinueSentinel%3B%20var%20info%20%3D%20record.arg%3B%20return%20info%20%3F%20info.done%20%3F%20(context%5Bdelegate.resultName%5D%20%3D%20info.value%2C%20context.next%20%3D%20delegate.nextLoc%2C%20%22return%22%20!%3D%3D%20context.method%20%26%26%20(context.method%20%3D%20%22next%22%2C%20context.arg%20%3D%20undefined)%2C%20context.delegate%20%3D%20null%2C%20ContinueSentinel)%20%3A%20info%20%3A%20(context.method%20%3D%20%22throw%22%2C%20context.arg%20%3D%20new%20TypeError(%22iterator%20result%20is%20not%20an%20object%22)%2C%20context.delegate%20%3D%20null%2C%20ContinueSentinel)%3B%20%7D%20function%20pushTryEntry(locs)%20%7B%20var%20entry%20%3D%20%7B%20tryLoc%3A%20locs%5B0%5D%20%7D%3B%201%20in%20locs%20%26%26%20(entry.catchLoc%20%3D%20locs%5B1%5D)%2C%202%20in%20locs%20%26%26%20(entry.finallyLoc%20%3D%20locs%5B2%5D%2C%20entry.afterLoc%20%3D%20locs%5B3%5D)%2C%20this.tryEntries.push(entry)%3B%20%7D%20function%20resetTryEntry(entry)%20%7B%20var%20record%20%3D%20entry.completion%20%7C%7C%20%7B%7D%3B%20record.type%20%3D%20%22normal%22%2C%20delete%20record.arg%2C%20entry.completion%20%3D%20record%3B%20%7D%20function%20Context(tryLocsList)%20%7B%20this.tryEntries%20%3D%20%5B%7B%20tryLoc%3A%20%22root%22%20%7D%5D%2C%20tryLocsList.forEach(pushTryEntry%2C%20this)%2C%20this.reset(!0)%3B%20%7D%20function%20values(iterable)%20%7B%20if%20(iterable)%20%7B%20var%20iteratorMethod%20%3D%20iterable%5BiteratorSymbol%5D%3B%20if%20(iteratorMethod)%20return%20iteratorMethod.call(iterable)%3B%20if%20(%22function%22%20%3D%3D%20typeof%20iterable.next)%20return%20iterable%3B%20if%20(!isNaN(iterable.length))%20%7B%20var%20i%20%3D%20-1%2C%20next%20%3D%20function%20next()%20%7B%20for%20(%3B%20%2B%2Bi%20%3C%20iterable.length%3B)%20%7B%20if%20(hasOwn.call(iterable%2C%20i))%20return%20next.value%20%3D%20iterable%5Bi%5D%2C%20next.done%20%3D%20!1%2C%20next%3B%20%7D%20return%20next.value%20%3D%20undefined%2C%20next.done%20%3D%20!0%2C%20next%3B%20%7D%3B%20return%20next.next%20%3D%20next%3B%20%7D%20%7D%20return%20%7B%20next%3A%20doneResult%20%7D%3B%20%7D%20function%20doneResult()%20%7B%20return%20%7B%20value%3A%20undefined%2C%20done%3A%20!0%20%7D%3B%20%7D%20return%20GeneratorFunction.prototype%20%3D%20GeneratorFunctionPrototype%2C%20define(Gp%2C%20%22constructor%22%2C%20GeneratorFunctionPrototype)%2C%20define(GeneratorFunctionPrototype%2C%20%22constructor%22%2C%20GeneratorFunction)%2C%20GeneratorFunction.displayName%20%3D%20define(GeneratorFunctionPrototype%2C%20toStringTagSymbol%2C%20%22GeneratorFunction%22)%2C%20exports.isGeneratorFunction%20%3D%20function%20(genFun)%20%7B%20var%20ctor%20%3D%20%22function%22%20%3D%3D%20typeof%20genFun%20%26%26%20genFun.constructor%3B%20return%20!!ctor%20%26%26%20(ctor%20%3D%3D%3D%20GeneratorFunction%20%7C%7C%20%22GeneratorFunction%22%20%3D%3D%3D%20(ctor.displayName%20%7C%7C%20ctor.name))%3B%20%7D%2C%20exports.mark%20%3D%20function%20(genFun)%20%7B%20return%20Object.setPrototypeOf%20%3F%20Object.setPrototypeOf(genFun%2C%20GeneratorFunctionPrototype)%20%3A%20(genFun.__proto__%20%3D%20GeneratorFunctionPrototype%2C%20define(genFun%2C%20toStringTagSymbol%2C%20%22GeneratorFunction%22))%2C%20genFun.prototype%20%3D%20Object.create(Gp)%2C%20genFun%3B%20%7D%2C%20exports.awrap%20%3D%20function%20(arg)%20%7B%20return%20%7B%20__await%3A%20arg%20%7D%3B%20%7D%2C%20defineIteratorMethods(AsyncIterator.prototype)%2C%20define(AsyncIterator.prototype%2C%20asyncIteratorSymbol%2C%20function%20()%20%7B%20return%20this%3B%20%7D)%2C%20exports.AsyncIterator%20%3D%20AsyncIterator%2C%20exports.async%20%3D%20function%20(innerFn%2C%20outerFn%2C%20self%2C%20tryLocsList%2C%20PromiseImpl)%20%7B%20void%200%20%3D%3D%3D%20PromiseImpl%20%26%26%20(PromiseImpl%20%3D%20Promise)%3B%20var%20iter%20%3D%20new%20AsyncIterator(wrap(innerFn%2C%20outerFn%2C%20self%2C%20tryLocsList)%2C%20PromiseImpl)%3B%20return%20exports.isGeneratorFunction(outerFn)%20%3F%20iter%20%3A%20iter.next().then(function%20(result)%20%7B%20return%20result.done%20%3F%20result.value%20%3A%20iter.next()%3B%20%7D)%3B%20%7D%2C%20defineIteratorMethods(Gp)%2C%20define(Gp%2C%20toStringTagSymbol%2C%20%22Generator%22)%2C%20define(Gp%2C%20iteratorSymbol%2C%20function%20()%20%7B%20return%20this%3B%20%7D)%2C%20define(Gp%2C%20%22toString%22%2C%20function%20()%20%7B%20return%20%22%5Bobject%20Generator%5D%22%3B%20%7D)%2C%20exports.keys%20%3D%20function%20(object)%20%7B%20var%20keys%20%3D%20%5B%5D%3B%20for%20(var%20key%20in%20object)%20%7B%20keys.push(key)%3B%20%7D%20return%20keys.reverse()%2C%20function%20next()%20%7B%20for%20(%3B%20keys.length%3B)%20%7B%20var%20key%20%3D%20keys.pop()%3B%20if%20(key%20in%20object)%20return%20next.value%20%3D%20key%2C%20next.done%20%3D%20!1%2C%20next%3B%20%7D%20return%20next.done%20%3D%20!0%2C%20next%3B%20%7D%3B%20%7D%2C%20exports.values%20%3D%20values%2C%20Context.prototype%20%3D%20%7B%20constructor%3A%20Context%2C%20reset%3A%20function%20reset(skipTempReset)%20%7B%20if%20(this.prev%20%3D%200%2C%20this.next%20%3D%200%2C%20this.sent%20%3D%20this._sent%20%3D%20undefined%2C%20this.done%20%3D%20!1%2C%20this.delegate%20%3D%20null%2C%20this.method%20%3D%20%22next%22%2C%20this.arg%20%3D%20undefined%2C%20this.tryEntries.forEach(resetTryEntry)%2C%20!skipTempReset)%20for%20(var%20name%20in%20this)%20%7B%20%22t%22%20%3D%3D%3D%20name.charAt(0)%20%26%26%20hasOwn.call(this%2C%20name)%20%26%26%20!isNaN(%2Bname.slice(1))%20%26%26%20(this%5Bname%5D%20%3D%20undefined)%3B%20%7D%20%7D%2C%20stop%3A%20function%20stop()%20%7B%20this.done%20%3D%20!0%3B%20var%20rootRecord%20%3D%20this.tryEntries%5B0%5D.completion%3B%20if%20(%22throw%22%20%3D%3D%3D%20rootRecord.type)%20throw%20rootRecord.arg%3B%20return%20this.rval%3B%20%7D%2C%20dispatchException%3A%20function%20dispatchException(exception)%20%7B%20if%20(this.done)%20throw%20exception%3B%20var%20context%20%3D%20this%3B%20function%20handle(loc%2C%20caught)%20%7B%20return%20record.type%20%3D%20%22throw%22%2C%20record.arg%20%3D%20exception%2C%20context.next%20%3D%20loc%2C%20caught%20%26%26%20(context.method%20%3D%20%22next%22%2C%20context.arg%20%3D%20undefined)%2C%20!!caught%3B%20%7D%20for%20(var%20i%20%3D%20this.tryEntries.length%20-%201%3B%20i%20%3E%3D%200%3B%20--i)%20%7B%20var%20entry%20%3D%20this.tryEntries%5Bi%5D%2C%20record%20%3D%20entry.completion%3B%20if%20(%22root%22%20%3D%3D%3D%20entry.tryLoc)%20return%20handle(%22end%22)%3B%20if%20(entry.tryLoc%20%3C%3D%20this.prev)%20%7B%20var%20hasCatch%20%3D%20hasOwn.call(entry%2C%20%22catchLoc%22)%2C%20hasFinally%20%3D%20hasOwn.call(entry%2C%20%22finallyLoc%22)%3B%20if%20(hasCatch%20%26%26%20hasFinally)%20%7B%20if%20(this.prev%20%3C%20entry.catchLoc)%20return%20handle(entry.catchLoc%2C%20!0)%3B%20if%20(this.prev%20%3C%20entry.finallyLoc)%20return%20handle(entry.finallyLoc)%3B%20%7D%20else%20if%20(hasCatch)%20%7B%20if%20(this.prev%20%3C%20entry.catchLoc)%20return%20handle(entry.catchLoc%2C%20!0)%3B%20%7D%20else%20%7B%20if%20(!hasFinally)%20throw%20new%20Error(%22try%20statement%20without%20catch%20or%20finally%22)%3B%20if%20(this.prev%20%3C%20entry.finallyLoc)%20return%20handle(entry.finallyLoc)%3B%20%7D%20%7D%20%7D%20%7D%2C%20abrupt%3A%20function%20abrupt(type%2C%20arg)%20%7B%20for%20(var%20i%20%3D%20this.tryEntries.length%20-%201%3B%20i%20%3E%3D%200%3B%20--i)%20%7B%20var%20entry%20%3D%20this.tryEntries%5Bi%5D%3B%20if%20(entry.tryLoc%20%3C%3D%20this.prev%20%26%26%20hasOwn.call(entry%2C%20%22finallyLoc%22)%20%26%26%20this.prev%20%3C%20entry.finallyLoc)%20%7B%20var%20finallyEntry%20%3D%20entry%3B%20break%3B%20%7D%20%7D%20finallyEntry%20%26%26%20(%22break%22%20%3D%3D%3D%20type%20%7C%7C%20%22continue%22%20%3D%3D%3D%20type)%20%26%26%20finallyEntry.tryLoc%20%3C%3D%20arg%20%26%26%20arg%20%3C%3D%20finallyEntry.finallyLoc%20%26%26%20(finallyEntry%20%3D%20null)%3B%20var%20record%20%3D%20finallyEntry%20%3F%20finallyEntry.completion%20%3A%20%7B%7D%3B%20return%20record.type%20%3D%20type%2C%20record.arg%20%3D%20arg%2C%20finallyEntry%20%3F%20(this.method%20%3D%20%22next%22%2C%20this.next%20%3D%20finallyEntry.finallyLoc%2C%20ContinueSentinel)%20%3A%20this.complete(record)%3B%20%7D%2C%20complete%3A%20function%20complete(record%2C%20afterLoc)%20%7B%20if%20(%22throw%22%20%3D%3D%3D%20record.type)%20throw%20record.arg%3B%20return%20%22break%22%20%3D%3D%3D%20record.type%20%7C%7C%20%22continue%22%20%3D%3D%3D%20record.type%20%3F%20this.next%20%3D%20record.arg%20%3A%20%22return%22%20%3D%3D%3D%20record.type%20%3F%20(this.rval%20%3D%20this.arg%20%3D%20record.arg%2C%20this.method%20%3D%20%22return%22%2C%20this.next%20%3D%20%22end%22)%20%3A%20%22normal%22%20%3D%3D%3D%20record.type%20%26%26%20afterLoc%20%26%26%20(this.next%20%3D%20afterLoc)%2C%20ContinueSentinel%3B%20%7D%2C%20finish%3A%20function%20finish(finallyLoc)%20%7B%20for%20(var%20i%20%3D%20this.tryEntries.length%20-%201%3B%20i%20%3E%3D%200%3B%20--i)%20%7B%20var%20entry%20%3D%20this.tryEntries%5Bi%5D%3B%20if%20(entry.finallyLoc%20%3D%3D%3D%20finallyLoc)%20return%20this.complete(entry.completion%2C%20entry.afterLoc)%2C%20resetTryEntry(entry)%2C%20ContinueSentinel%3B%20%7D%20%7D%2C%20%22catch%22%3A%20function%20_catch(tryLoc)%20%7B%20for%20(var%20i%20%3D%20this.tryEntries.length%20-%201%3B%20i%20%3E%3D%200%3B%20--i)%20%7B%20var%20entry%20%3D%20this.tryEntries%5Bi%5D%3B%20if%20(entry.tryLoc%20%3D%3D%3D%20tryLoc)%20%7B%20var%20record%20%3D%20entry.completion%3B%20if%20(%22throw%22%20%3D%3D%3D%20record.type)%20%7B%20var%20thrown%20%3D%20record.arg%3B%20resetTryEntry(entry)%3B%20%7D%20return%20thrown%3B%20%7D%20%7D%20throw%20new%20Error(%22illegal%20catch%20attempt%22)%3B%20%7D%2C%20delegateYield%3A%20function%20delegateYield(iterable%2C%20resultName%2C%20nextLoc)%20%7B%20return%20this.delegate%20%3D%20%7B%20iterator%3A%20values(iterable)%2C%20resultName%3A%20resultName%2C%20nextLoc%3A%20nextLoc%20%7D%2C%20%22next%22%20%3D%3D%3D%20this.method%20%26%26%20(this.arg%20%3D%20undefined)%2C%20ContinueSentinel%3B%20%7D%20%7D%2C%20exports%3B%20%7D%0A%0Afunction%20asyncGeneratorStep(gen%2C%20resolve%2C%20reject%2C%20_next%2C%20_throw%2C%20key%2C%20arg)%20%7B%20try%20%7B%20var%20info%20%3D%20gen%5Bkey%5D(arg)%3B%20var%20value%20%3D%20info.value%3B%20%7D%20catch%20(error)%20%7B%20reject(error)%3B%20return%3B%20%7D%20if%20(info.done)%20%7B%20resolve(value)%3B%20%7D%20else%20%7B%20Promise.resolve(value).then(_next%2C%20_throw)%3B%20%7D%20%7D%0A%0Afunction%20_asyncToGenerator(fn)%20%7B%20return%20function%20()%20%7B%20var%20self%20%3D%20this%2C%20args%20%3D%20arguments%3B%20return%20new%20Promise(function%20(resolve%2C%20reject)%20%7B%20var%20gen%20%3D%20fn.apply(self%2C%20args)%3B%20function%20_next(value)%20%7B%20asyncGeneratorStep(gen%2C%20resolve%2C%20reject%2C%20_next%2C%20_throw%2C%20%22next%22%2C%20value)%3B%20%7D%20function%20_throw(err)%20%7B%20asyncGeneratorStep(gen%2C%20resolve%2C%20reject%2C%20_next%2C%20_throw%2C%20%22throw%22%2C%20err)%3B%20%7D%20_next(undefined)%3B%20%7D)%3B%20%7D%3B%20%7D%0A%0A_RTFN_%20%3D%20function%20()%20%7B%0A%20%20var%20_RT_2%20%3D%20_asyncToGenerator(_regeneratorRuntime().mark(function%20_callee(model%2C%20context)%20%7B%0A%20%20%20%20var%20industry%2C%20reportActivity%2C%20serviceId%2C%20data%3B%0A%20%20%20%20return%20_regeneratorRuntime().wrap(function%20_callee%24(_context)%20%7B%0A%20%20%20%20%20%20while%20(1)%20%7B%0A%20%20%20%20%20%20%20%20switch%20(_context.prev%20%3D%20_context.next)%20%7B%0A%20%20%20%20%20%20%20%20%20%20case%200%3A%0A%20%20%20%20%20%20%20%20%20%20%20%20industry%20%3D%20model.formItems%5B'industry'%5D%3B%0A%20%20%20%20%20%20%20%20%20%20%20%20reportActivity%20%3D%20model.formItems%5B'reportActivity'%5D%3B%0A%20%20%20%20%20%20%20%20%20%20%20%20serviceId%20%3D%20'u_gWCdu'%3B%0A%20%20%20%20%20%20%20%20%20%20%20%20_context.next%20%3D%205%3B%0A%20%20%20%20%20%20%20%20%20%20%20%20return%20context.callService(serviceId%2C%20%7B%7D)%3B%0A%0A%20%20%20%20%20%20%20%20%20%20case%205%3A%0A%20%20%20%20%20%20%20%20%20%20%20%20data%20%3D%20_context.sent%3B%0A%20%20%20%20%20%20%20%20%20%20%20%20industry.value%20%3D%20data.data.industry%3B%0A%20%20%20%20%20%20%20%20%20%20%20%20reportActivity.value%20%3D%20data.data.activityName%3B%0A%0A%20%20%20%20%20%20%20%20%20%20case%208%3A%0A%20%20%20%20%20%20%20%20%20%20case%20%22end%22%3A%0A%20%20%20%20%20%20%20%20%20%20%20%20return%20_context.stop()%3B%0A%20%20%20%20%20%20%20%20%7D%0A%20%20%20%20%20%20%7D%0A%20%20%20%20%7D%2C%20_callee)%3B%0A%20%20%7D))%3B%0A%0A%20%20function%20_RT_(_x%2C%20_x2)%20%7B%0A%20%20%20%20return%20_RT_2.apply(this%2C%20arguments)%3B%0A%20%20%7D%0A%0A%20%20return%20_RT_%3B%0A%7D()%3B%0A%3B%20return%20_RTFN_%3B%20%7D)()"
              }
            },
            "inputAry": [],
            "outputAry": [
              "cancel",
              "cancel",
              "cancel",
              "afterReset",
              "cancel",
              "initial"
            ],
            "outputEvents": {
              "submit": [
                {
                  "type": "defined",
                  "options": {
                    "id": "u_JLCyg",
                    "title": "提报表单 > 提交"
                  },
                  "active": true
                }
              ],
              "afterReset": [
                {
                  "type": "defined",
                  "options": {},
                  "active": true
                }
              ],
              "cancel": [
                {
                  "type": "defined",
                  "options": {
                    "id": "u_1806z",
                    "title": "提报表单 > 取消"
                  },
                  "active": true
                }
              ]
            },
            "style": {
              "width": "100%",
              "_new": true
            }
          },
          "style": {
            "width": 552,
            "height": 280
          },
          "configs": [],
          "_inputs": [],
          "inputs": [
            "relSubmit",
            "initial",
            "initialDesc",
            "reset",
            "stopLoading",
            "getFormValue",
            "show",
            "hide"
          ],
          "outputs": [
            "submit",
            "relSubmit",
            "reset",
            "getFormValue",
            "cancel"
          ]
        },
        "u_kAHxx": {
          "id": "u_kAHxx",
          "def": {
            "namespace": "fangzhou.normal-pc.code.segment",
            "version": "1.1.2",
            "rtType": "js-autorun",
            "materialId": 27685
          },
          "title": "JS计算1",
          "model": {
            "data": {
              "fns": {
                "code": "export%20default%20function%20(%7B%20inputValue%2C%20outputs%20%7D%2C%20context)%20%7B%0A%20%20inputValue.userId%20%3D%20inputValue.userId.split('%2C')%3B%0A%20%20inputValue.startTime%20%3D%20context.utils.moment(inputValue.startTime).format('YYYY-MM-DD%2000%3A00%3A00')%3B%0A%20%20inputValue.startTime%20%3D%20context.utils.moment(inputValue.startTime).valueOf()%3B%0A%20%20outputs%5B'output0'%5D(inputValue)%3B%0A%7D",
                "transformCode": "(function()%20%7B%20var%20_RTFN_%3B%20%0A%22use%20strict%22%3B%0A%0A_RTFN_%20%3D%20function%20_RT_(_ref%2C%20context)%20%7B%0A%20%20var%20inputValue%20%3D%20_ref.inputValue%2C%0A%20%20%20%20%20%20outputs%20%3D%20_ref.outputs%3B%0A%20%20inputValue.userId%20%3D%20inputValue.userId.split('%2C')%3B%0A%20%20inputValue.startTime%20%3D%20context.utils.moment(inputValue.startTime).format('YYYY-MM-DD%2000%3A00%3A00')%3B%0A%20%20inputValue.startTime%20%3D%20context.utils.moment(inputValue.startTime).valueOf()%3B%0A%20%20outputs%5B'output0'%5D(inputValue)%3B%0A%7D%3B%0A%3B%20return%20_RTFN_%3B%20%7D)()"
              }
            },
            "inputAry": [],
            "outputAry": [],
            "outputEvents": {},
            "style": {
              "display": "block"
            }
          },
          "style": {},
          "configs": [],
          "_inputs": [],
          "inputs": [
            "input0"
          ],
          "outputs": [
            "output0"
          ]
        },
        "u_na1_J": {
          "id": "u_na1_J",
          "def": {
            "namespace": "fangzhou.normal-pc.service",
            "version": "1.0.9",
            "rtType": "js-autorun",
            "materialId": 25416
          },
          "title": "服务接口1",
          "model": {
            "data": {
              "immediate": false,
              "isMock": false,
              "serviceContent": {},
              "serviceType": "inside",
              "insideServiceContent": {
                "id": "u_W06r9",
                "title": "提报重点招商用户"
              },
              "connectorId": "u_W06r9"
            },
            "inputAry": [],
            "outputAry": [],
            "outputEvents": {},
            "style": {
              "display": "block"
            }
          },
          "style": {},
          "configs": [],
          "_inputs": [],
          "inputs": [
            "params"
          ],
          "outputs": [
            "res",
            "error"
          ]
        },
        "u_7gG-c": {
          "id": "u_7gG-c",
          "def": {
            "namespace": "fangzhou.normal-pc.message",
            "version": "1.0.11",
            "rtType": "js",
            "materialId": 25468
          },
          "title": "消息提示1",
          "model": {
            "data": {
              "title": "提示名称",
              "content": "提示内容",
              "duration": 3,
              "type": "error",
              "isExternal": true
            },
            "inputAry": [],
            "outputAry": [],
            "outputEvents": {},
            "style": {
              "display": "block"
            }
          },
          "style": {},
          "configs": [],
          "_inputs": [],
          "inputs": [
            "showMsg"
          ],
          "outputs": [
            "closeMsg"
          ]
        },
        "u__tS8D": {
          "id": "u__tS8D",
          "def": {
            "namespace": "fangzhou.normal-pc.message",
            "version": "1.0.11",
            "rtType": "js",
            "materialId": 25468
          },
          "title": "消息提示2",
          "model": {
            "data": {
              "title": "提示名称",
              "content": "提报成功",
              "duration": 3,
              "type": "success",
              "isExternal": false
            },
            "inputAry": [],
            "outputAry": [],
            "outputEvents": {},
            "style": {
              "display": "block"
            }
          },
          "style": {},
          "configs": [],
          "_inputs": [],
          "inputs": [
            "showMsg"
          ],
          "outputs": [
            "closeMsg"
          ]
        }
      },
      "id": "u_cM-KR",
      "title": "主页面",
      "comsAutoRun": {},
      "_inputs": [],
      "_outputs": [],
      "inputs": [],
      "outputs": [],
      "cons": {
        "u_ST_e0-submit": [
          {
            "id": "u_w0q1T",
            "type": "com",
            "frameKey": "_rootFrame_",
            "targetFrameKey": "_rootFrame_",
            "startPinParentKey": "u_3FeSM",
            "comId": "u_kAHxx",
            "def": {
              "namespace": "fangzhou.normal-pc.code.segment",
              "version": "1.1.2",
              "rtType": "js-autorun",
              "materialId": 27685
            },
            "pinId": "input0",
            "pinType": "normal",
            "direction": "input"
          }
        ],
        "u_ST_e0-cancel": [
          {
            "id": "u_ACjLb",
            "type": "com",
            "frameKey": "_rootFrame_",
            "targetFrameKey": "_rootFrame_",
            "startPinParentKey": "u_cmwOD",
            "finishPinParentKey": "u_S1AQI",
            "comId": "u_pWIP-",
            "def": {
              "namespace": "fangzhou.normal-pc.drawer",
              "version": "1.0.7",
              "materialId": 25365
            },
            "pinId": "close",
            "pinType": "normal",
            "direction": "input"
          }
        ],
        "u_kAHxx-output0": [
          {
            "id": "u_QsU44",
            "type": "com",
            "frameKey": "_rootFrame_",
            "targetFrameKey": "_rootFrame_",
            "comId": "u_na1_J",
            "def": {
              "namespace": "fangzhou.normal-pc.service",
              "version": "1.0.9",
              "rtType": "js-autorun",
              "materialId": 25416
            },
            "pinId": "params",
            "pinType": "normal",
            "direction": "input"
          }
        ],
        "u_na1_J-res": [
          {
            "id": "u_k0Q5a",
            "type": "com",
            "frameKey": "_rootFrame_",
            "targetFrameKey": "_rootFrame_",
            "finishPinParentKey": "u_e-YP_",
            "comId": "u_pWIP-",
            "def": {
              "namespace": "fangzhou.normal-pc.drawer",
              "version": "1.0.7",
              "materialId": 25365
            },
            "pinId": "close",
            "pinType": "normal",
            "direction": "input"
          },
          {
            "id": "u_v8dEv",
            "type": "com",
            "frameKey": "_rootFrame_",
            "targetFrameKey": "_rootFrame_",
            "comId": "u__tS8D",
            "def": {
              "namespace": "fangzhou.normal-pc.message",
              "version": "1.0.11",
              "rtType": "js",
              "materialId": 25468
            },
            "pinId": "showMsg",
            "pinType": "normal",
            "direction": "input"
          }
        ],
        "u_na1_J-error": [
          {
            "id": "u_Uvl2v",
            "type": "com",
            "frameKey": "_rootFrame_",
            "targetFrameKey": "_rootFrame_",
            "comId": "u_7gG-c",
            "def": {
              "namespace": "fangzhou.normal-pc.message",
              "version": "1.0.11",
              "rtType": "js",
              "materialId": 25468
            },
            "pinId": "showMsg",
            "pinType": "normal",
            "direction": "input"
          }
        ]
      },
      "pinRels": {
        "u_ST_e0-relSubmit": [
          "relSubmit"
        ],
        "u_ST_e0-initial": [],
        "u_ST_e0-reset": [
          "reset"
        ],
        "u_ST_e0-getFormValue": [
          "getFormValue"
        ],
        "u_7gG-c-showMsg": [
          "closeMsg"
        ],
        "u__tS8D-showMsg": [
          "closeMsg"
        ]
      },
      "pinProxies": {},
      "pinValueProxies": {},
      "slot": {
        "id": "u_cM-KR",
        "title": "主页面",
        "comAry": [
          {
            "id": "u_pWIP-",
            "name": "u__MWFk",
            "def": {
              "namespace": "fangzhou.normal-pc.drawer",
              "version": "1.0.7",
              "materialId": 25365
            },
            "slots": {
              "content": {
                "id": "content",
                "title": "抽屉内容",
                "comAry": [
                  {
                    "id": "u_eDNcd",
                    "name": "u_DgWcg",
                    "def": {
                      "namespace": "fangzhou.normal-pc.custom-button",
                      "version": "1.0.2"
                    }
                  },
                  {
                    "id": "u_ST_e0",
                    "name": "u_Wl8yW",
                    "def": {
                      "namespace": "fangzhou.normal-pc.form-blocks",
                      "version": "1.2.79",
                      "materialId": 27839
                    }
                  }
                ],
                "style": {
                  "layout": "flex-column",
                  "justifyContent": "flex-start",
                  "alignItems": "flex-start"
                }
              },
              "footer": {
                "id": "footer",
                "title": "抽屉页脚",
                "comAry": [],
                "style": {
                  "layout": "flex-column",
                  "justifyContent": "flex-start",
                  "alignItems": "flex-start"
                }
              }
            }
          }
        ],
        "style": {
          "layout": "flex-column",
          "justifyContent": "flex-start",
          "alignItems": "flex-start",
          "width": 1280,
          "left": 2014,
          "top": 800
        }
      }
    }
  ],
  "plugins": {
    "@mybricks/plugins/service": [],
    "@fangzhou/plugin-theme": {
      "themeId": "eshop",
      "themeConfig": {
        "--ant-primary-color": "#326bfb",
        "--ant-primary-color-hover": "#5c8fff",
        "--ant-primary-color-active": "#204dd4",
        "--ant-primary-color-outline": "rgba(50, 107, 251, 0.2)",
        "--ant-primary-1": "#f0f7ff",
        "--ant-primary-2": "#d6e7ff",
        "--ant-primary-3": "#adcdff",
        "--ant-primary-4": "#85afff",
        "--ant-primary-5": "#5c8fff",
        "--ant-primary-6": "#326bfb",
        "--ant-primary-7": "#204dd4",
        "--ant-primary-color-deprecated-pure": "",
        "--ant-primary-color-deprecated-l-35": "#e1e9fe",
        "--ant-primary-color-deprecated-l-20": "#96b3fd",
        "--ant-primary-color-deprecated-t-20": "#46a6ff",
        "--ant-primary-color-deprecated-t-50": "#8cc8ff",
        "--ant-primary-color-deprecated-f-12": "rgba(50, 107, 251, 0.12)",
        "--ant-primary-color-active-deprecated-f-30": "rgba(240, 247, 255, 0.3)",
        "--ant-primary-color-active-deprecated-d-02": "#dcf4ff",
        "--ant-success-color": "#30c453",
        "--ant-success-color-hover": "#54d16d",
        "--ant-success-color-active": "#1e9e40",
        "--ant-success-color-outline": "rgba(48, 196, 83, 0.2)",
        "--ant-success-color-deprecated-bg": "#f0fff1",
        "--ant-success-color-deprecated-border": "#a9ebb2",
        "--ant-error-color": "#fa4e3e",
        "--ant-error-color-hover": "#ff7a69",
        "--ant-error-color-active": "#d4332a",
        "--ant-error-color-outline": "rgba(250, 78, 62, 0.2)",
        "--ant-error-color-deprecated-bg": "#fff4f0",
        "--ant-error-color-deprecated-border": "#ffc7ba",
        "--ant-warning-color": "#ffaa00",
        "--ant-warning-color-hover": "#ffbf29",
        "--ant-warning-color-active": "#d98900",
        "--ant-warning-color-outline": "rgba(255, 170, 0, 0.2)",
        "--ant-warning-color-deprecated-bg": "#fffbe6",
        "--ant-warning-color-deprecated-border": "#ffe07a",
        "--ant-info-color": "#326bfb",
        "--ant-info-color-deprecated-bg": "#f0f7ff",
        "--ant-info-color-deprecated-border": "#adcdff"
      }
    }
  }
}