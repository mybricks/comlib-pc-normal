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
          "namespace": "mybricks.normal-pc.steps",
          "version": "1.0.23",
          "materialId": 47250
        },
        {
          "namespace": "mybricks.marketing-tools.json-schema-form-com",
          "version": "1.1.2",
          "materialId": 49094
        },
        {
          "namespace": "mybricks.normal-pc.single-image",
          "version": "1.0.15",
          "materialId": 47548
        },
        {
          "namespace": "mybricks.normal-pc.alert",
          "version": "1.0.7",
          "materialId": 47593
        },
        {
          "namespace": "mybricks.normal-pc.toolbar",
          "version": "1.0.20",
          "materialId": 47248
        },
        {
          "namespace": "mybricks.normal-pc.text",
          "version": "1.0.17",
          "materialId": 47511
        },
        {
          "namespace": "mybricks.basic-comlib._muilt-inputJs",
          "version": "1.0.2",
          "rtType": "js-autorun",
          "materialId": 46406
        },
        {
          "namespace": "mybricks.core-comlib.var",
          "version": "1.0.0",
          "rtType": "js"
        },
        {
          "namespace": "mybricks.normal-pc.custom-container",
          "version": "1.0.24",
          "materialId": 48068
        },
        {
          "namespace": "mybricks.normal-pc.service",
          "version": "1.0.8",
          "rtType": "js-autorun",
          "materialId": 38932
        },
        {
          "namespace": "mybricks.normal-pc.query",
          "version": "1.0.6",
          "rtType": "js-autorun",
          "materialId": 36498
        },
        {
          "namespace": "mybricks.normal-pc.message",
          "version": "1.0.4",
          "rtType": "js",
          "materialId": 44978
        },
        {
          "namespace": "mybricks.normal-pc.timer-loop",
          "version": "1.0.1",
          "rtType": "js",
          "materialId": 30013
        },
        {
          "namespace": "mybricks.normal-pc.grid",
          "version": "1.0.44",
          "materialId": 47857
        },
        {
          "namespace": "mybricks.normal-pc.page-router",
          "version": "1.0.5",
          "rtType": "js",
          "materialId": 41566
        },
        {
          "namespace": "mybricks.basic-comlib.dragable-layout",
          "version": "1.0.7",
          "materialId": 47988
        },
        {
          "namespace": "mybricks.normal-pc.tagList",
          "version": "1.0.12",
          "materialId": 47516
        },
        {
          "namespace": "mybricks.normal-pc.card",
          "version": "1.0.21",
          "materialId": 47249
        },
        {
          "namespace": "mybricks.core-comlib.fn",
          "version": "1.0.0",
          "rtType": "js"
        },
        {
          "namespace": "mybricks.normal-pc.link",
          "version": "1.0.5",
          "materialId": 47762
        }
      ],
      "coms": {
        "u_x5c3j": {
          "id": "u_x5c3j",
          "def": {
            "namespace": "mybricks.normal-pc.steps",
            "version": "1.0.23",
            "materialId": 47250
          },
          "title": "步骤条",
          "model": {
            "data": {
              "steps": {
                "size": "small",
                "type": "navigation",
                "direction": "horizontal",
                "showDesc": false,
                "useCustomDesc": false,
                "canClick": false
              },
              "stepAry": [
                {
                  "id": "step0",
                  "title": "STAGING测试",
                  "description": "",
                  "index": 0,
                  "connect": 0,
                  "subTitle": "",
                  "useCustomDesc": false
                },
                {
                  "id": "u_beaixt",
                  "title": "PRT测试",
                  "description": "",
                  "index": 1
                },
                {
                  "id": "u_wj2t2t",
                  "title": "审批",
                  "description": "",
                  "index": 2
                },
                {
                  "id": "u_jp25xy",
                  "title": "上线",
                  "description": "",
                  "index": 3
                },
                {
                  "id": "u_a50h1y",
                  "title": "完成",
                  "description": "新添加的步骤",
                  "index": 4
                }
              ],
              "current": 4,
              "toolbar": {
                "type": "default",
                "showActions": true,
                "submit": true,
                "actionAlign": "center",
                "primaryBtnText": "下一步",
                "secondBtnText": "上一步",
                "submitText": "提交",
                "btns": [
                  "previous",
                  "next",
                  "submit"
                ],
                "bottom": 24
              },
              "fullSubmit": false,
              "hideSlots": false
            },
            "inputAry": [],
            "outputAry": [
              "u_beaixt",
              "u_beaixt_into",
              "u_beaixt_leave",
              "u_beaixt_click",
              "u_wj2t2t",
              "u_wj2t2t_into",
              "u_wj2t2t_leave",
              "u_wj2t2t_click",
              "u_jp25xy",
              "u_jp25xy_into",
              "u_jp25xy_leave",
              "u_jp25xy_click",
              "u_xaw1ep_into",
              "u_xaw1ep_click",
              "u_a50h1y",
              "u_a50h1y_into",
              "u_a50h1y_leave",
              "u_a50h1y_click"
            ],
            "outputEvents": {
              "u_beaixt_click": [
                {
                  "type": "defined",
                  "options": {},
                  "active": true
                }
              ],
              "u_wj2t2t_click": [
                {
                  "type": "defined",
                  "options": {},
                  "active": true
                }
              ],
              "u_jp25xy_click": [
                {
                  "type": "defined",
                  "options": {},
                  "active": true
                }
              ],
              "submit": [
                {
                  "type": "defined",
                  "options": {},
                  "active": true
                }
              ],
              "step0_click": [
                {
                  "type": "defined",
                  "options": {},
                  "active": true
                }
              ]
            },
            "style": {
              "width": "100%",
              "position": "relative",
              "marginRight": 0,
              "marginTop": 0,
              "marginLeft": 0,
              "marginBottom": 0,
              "height": "fit-content",
              "_new": true
            }
          },
          "style": {
            "width": 1024,
            "height": 244
          },
          "configs": [],
          "_inputs": [],
          "inputs": [
            "nextStep",
            "prevStep",
            "jumpTo",
            "getIndex",
            "setHideSteps",
            "show",
            "hide",
            "showOrHide"
          ],
          "outputs": [
            "submit",
            "step0",
            "getIndex",
            "step0_into",
            "step0_leave",
            "step0_click",
            "u_beaixt",
            "u_beaixt_into",
            "u_beaixt_leave",
            "u_beaixt_click",
            "u_wj2t2t",
            "u_wj2t2t_into",
            "u_wj2t2t_leave",
            "u_wj2t2t_click",
            "u_jp25xy",
            "u_jp25xy_into",
            "u_jp25xy_leave",
            "u_jp25xy_click",
            "u_xaw1ep_into",
            "u_a50h1y",
            "u_a50h1y_into",
            "u_a50h1y_leave",
            "u_a50h1y_click"
          ]
        },
        "u_yVwNF": {
          "id": "u_yVwNF",
          "def": {
            "namespace": "mybricks.marketing-tools.json-schema-form-com",
            "version": "1.1.2",
            "materialId": 49094
          },
          "title": "DB-PRT表单",
          "model": {
            "data": {
              "content": {
                "jsonSchema": {},
                "uiSchema": {},
                "formData": {}
              }
            },
            "inputAry": [],
            "outputAry": [],
            "outputEvents": {
              "change": [
                {
                  "type": "defined",
                  "options": {
                    "id": "u_Bq2_R",
                    "title": "DB-STAGING表单 > 表单内容变化"
                  },
                  "active": true
                }
              ],
              "validated": [
                {
                  "type": "defined",
                  "options": {},
                  "active": true
                }
              ]
            },
            "style": {
              "width": "fit-content",
              "height": "fit-content",
              "marginRight": 20,
              "maxWidth": "fit-content",
              "_new": true
            }
          },
          "style": {
            "width": 0,
            "height": 0
          },
          "configs": [],
          "_inputs": [],
          "inputs": [
            "content",
            "show",
            "hide",
            "showOrHide"
          ],
          "outputs": [
            "change",
            "validated"
          ]
        },
        "u_0DxRU": {
          "id": "u_0DxRU",
          "def": {
            "namespace": "mybricks.marketing-tools.json-schema-form-com",
            "version": "1.1.2",
            "materialId": 49094
          },
          "title": "DB-PROD",
          "model": {
            "data": {
              "content": {
                "jsonSchema": {},
                "uiSchema": {},
                "formData": {}
              }
            },
            "inputAry": [],
            "outputAry": [],
            "outputEvents": {
              "change": [
                {
                  "type": "defined",
                  "options": {
                    "id": "u_Bq2_R",
                    "title": "DB-STAGING表单 > 表单内容变化"
                  },
                  "active": true
                }
              ],
              "validated": [
                {
                  "type": "defined",
                  "options": {},
                  "active": true
                }
              ]
            },
            "style": {
              "width": "fit-content",
              "height": "fit-content",
              "marginRight": 20,
              "maxWidth": "fit-content",
              "_new": true
            }
          },
          "style": {
            "width": 0,
            "height": 0
          },
          "configs": [],
          "_inputs": [],
          "inputs": [
            "content",
            "show",
            "hide",
            "showOrHide"
          ],
          "outputs": [
            "change",
            "validated"
          ]
        },
        "u_YaOIm": {
          "id": "u_YaOIm",
          "def": {
            "namespace": "mybricks.normal-pc.single-image",
            "version": "1.0.15",
            "materialId": 47548
          },
          "title": "测试图片- STAGING",
          "model": {
            "data": {
              "alt": "图片",
              "src": "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxMDI0IDEwMjQiIHZlcnNpb249IjEuMSIgd2lkdGg9IjIwMCIgaGVpZ2h0PSIyMDAiPjxwYXRoIGQ9Ik05NDIgOTE2LjZIODMuOWE3OS4xIDc5LjEgMCAwIDEtNzktNzlWMTg2YTc5LjEgNzkuMSAwIDAgMSA3OS03OUg5NDJhNzkuMSA3OS4xIDAgMCAxIDc5IDc5djY1MS42YTc5LjEgNzkuMSAwIDAgMS03OSA3OXpNODMuOSAxNjguNjVBMTcuNTcgMTcuNTcgMCAwIDAgNjYuNTYgMTg2djY1MS42YTE3LjU3IDE3LjU3IDAgMCAwIDE3LjM0IDE3LjMzSDk0MmExNy41NyAxNy41NyAwIDAgMCAxNy4zNC0xNy4zNFYxODZBMTcuNTcgMTcuNTcgMCAwIDAgOTQyIDE2OC42NXoiIGZpbGw9IiM1NTU1NTUiLz48cGF0aCBkPSJNMjEyLjcyIDQxMi43M2E5MiA5MiAwIDEgMSA5Mi05MiA5Mi4xIDkyLjEgMCAwIDEtOTIgOTJ6IG0wLTEyMGEyOCAyOCAwIDEgMCAyOCAyOCAyOCAyOCAwIDAgMC0yOC0yOHpNNDQuNjkgNzQxLjIzQTMyIDMyIDAgMCAxIDI1IDY4NGwyMzYuMjMtMTg0LjU5YzM0LjQ0LTI2LjkyIDg1Ljk0LTI0LjEgMTE3LjI0IDYuNDJMNTIwLjcgNjQ0LjUxYTMyIDMyIDAgMSAxLTQ0LjcgNDUuODJMMzMzLjc5IDU1MS42NmMtOC4yNi04LjA2LTI0LjA2LTguOTMtMzMuMTYtMS44Mkw2NC4zNyA3MzQuNDVhMzEuODQgMzEuODQgMCAwIDEtMTkuNjggNi43OHoiIGZpbGw9IiM1NTU1NTUiLz48cGF0aCBkPSJNOTg2LjMyIDgxMi4xMmEzMiAzMiAwIDAgMS0yOC40Ny0xNy4zNkw3ODIuNDEgNDU0LjE4bC0wLjE3LTAuMzZhMjIgMjIgMCAwIDAtMzQuMi03LjA3bC0yMjYuMjkgMjQyLjVBMzIgMzIgMCAxIDEgNDc1IDY0NS41OWwyMjcuOS0yNDQuMjcgMC44LTAuNzVhODYgODYgMCAwIDEgMTM1Ljk1IDI1bDE3NS4wOSAzMzkuOTJhMzIgMzIgMCAwIDEtMjguNDIgNDYuNjZ6IiBmaWxsPSIjNTU1NTU1Ii8+PC9zdmc+",
              "usePreview": false,
              "useFallback": false,
              "previewImgSrc": ""
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
              "width": "fit-content",
              "height": "fit-content",
              "maxWidth": "fit-content",
              "_new": true
            }
          },
          "style": {
            "width": 0,
            "height": 0
          },
          "configs": [],
          "_inputs": [],
          "inputs": [
            "setImgSrc",
            "show",
            "hide",
            "showOrHide"
          ],
          "outputs": [
            "click"
          ]
        },
        "u_8w32h": {
          "id": "u_8w32h",
          "def": {
            "namespace": "mybricks.marketing-tools.json-schema-form-com",
            "version": "1.1.2",
            "materialId": 49094
          },
          "title": "DB-STAGING表单",
          "model": {
            "data": {
              "content": {
                "jsonSchema": {},
                "uiSchema": {},
                "formData": {}
              }
            },
            "inputAry": [],
            "outputAry": [],
            "outputEvents": {
              "change": [
                {
                  "type": "defined",
                  "options": {
                    "id": "u_Bq2_R",
                    "title": "DB-STAGING表单 > 表单内容变化"
                  },
                  "active": true
                }
              ],
              "validated": [
                {
                  "type": "defined",
                  "options": {},
                  "active": true
                }
              ]
            },
            "style": {
              "width": "fit-content",
              "height": "fit-content",
              "marginRight": 20,
              "maxWidth": "fit-content",
              "_new": true
            }
          },
          "style": {
            "width": 0,
            "height": 0
          },
          "configs": [],
          "_inputs": [],
          "inputs": [
            "content",
            "show",
            "hide",
            "showOrHide"
          ],
          "outputs": [
            "change",
            "validated"
          ]
        },
        "u_L0XHo": {
          "id": "u_L0XHo",
          "def": {
            "namespace": "mybricks.normal-pc.alert",
            "version": "1.0.7",
            "materialId": 47593
          },
          "title": "警告提示",
          "model": {
            "data": {
              "type": "warning",
              "message": "%E6%B3%A8%E6%84%8F%EF%BC%9A%E5%AE%A1%E6%89%B9%E9%80%9A%E8%BF%87%E8%AF%B7%E6%89%8B%E5%8A%A8%E7%82%B9%E5%87%BB%E3%80%8C%E5%8F%91%E5%B8%83PROD%E3%80%8D%E5%8F%91%E5%B8%83%E4%B8%8A%E7%BA%BF",
              "content": "辅助性文字介绍",
              "isChoose": false,
              "closable": false,
              "showIcon": true,
              "icon": "HomeOutlined",
              "color": "#0075ff",
              "isColor": false,
              "textColor": "",
              "showInfo": false,
              "banner": true,
              "isClose": true,
              "openWidth": false,
              "percentWidth": 100,
              "width": 500,
              "size": "16px",
              "useContentSlot": false
            },
            "inputAry": [],
            "outputAry": [],
            "outputEvents": {},
            "style": {
              "width": "100%",
              "styleAry": [
                {
                  "selector": ".ant-alert-message",
                  "css": {
                    "textAlign": "center"
                  }
                }
              ],
              "themesId": "_defined",
              "height": "fit-content",
              "_new": true
            }
          },
          "style": {
            "width": 0,
            "height": 0
          },
          "configs": [],
          "_inputs": [],
          "inputs": [
            "inputInfo",
            "description",
            "show",
            "hide",
            "showOrHide"
          ],
          "outputs": []
        },
        "u_TGyzS": {
          "id": "u_TGyzS",
          "def": {
            "namespace": "mybricks.normal-pc.toolbar",
            "version": "1.0.20",
            "materialId": 47248
          },
          "title": "工具条",
          "model": {
            "data": {
              "btnList": [
                {
                  "key": "u_mbzp3y",
                  "text": "发布STAGING",
                  "showText": true,
                  "dataType": "number",
                  "outVal": 1,
                  "inVal": "",
                  "isCustom": false,
                  "src": "",
                  "contentSize": [
                    14,
                    14
                  ],
                  "iconDistance": 8,
                  "loading": false,
                  "useDynamicLoading": false,
                  "style": {
                    "height": "auto",
                    "width": "auto"
                  },
                  "useDynamicHidden": true
                },
                {
                  "key": "u_mem59p",
                  "text": "STAGING测试通过",
                  "showText": true,
                  "dataType": "number",
                  "outVal": 2,
                  "inVal": "",
                  "isCustom": false,
                  "src": "",
                  "contentSize": [
                    14,
                    14
                  ],
                  "iconDistance": 8,
                  "loading": false,
                  "useDynamicLoading": false,
                  "style": {
                    "height": "auto",
                    "width": "auto"
                  },
                  "useDynamicHidden": true
                },
                {
                  "key": "btn0",
                  "text": "发布PRT",
                  "showText": true,
                  "dataType": "number",
                  "outVal": 3,
                  "inVal": "",
                  "isCustom": false,
                  "contentSize": [
                    14,
                    14
                  ],
                  "iconDistance": 8,
                  "src": "",
                  "loading": false,
                  "useDynamicLoading": false,
                  "style": false,
                  "useDynamicHidden": true,
                  "permissionKey": "",
                  "type": "primary",
                  "iconLocation": "front",
                  "icon": "HomeOutlined",
                  "useIcon": false
                },
                {
                  "key": "u_s567wa",
                  "text": "PRT测试通过",
                  "showText": true,
                  "dataType": "number",
                  "outVal": 4,
                  "inVal": "",
                  "isCustom": false,
                  "src": "",
                  "contentSize": [
                    14,
                    14
                  ],
                  "iconDistance": 8,
                  "loading": false,
                  "useDynamicLoading": false,
                  "style": false,
                  "useDynamicHidden": true,
                  "type": "primary",
                  "size": "middle"
                },
                {
                  "key": "u_pt02kz",
                  "text": "撤销审批",
                  "showText": true,
                  "dataType": "number",
                  "outVal": 9,
                  "inVal": "",
                  "isCustom": false,
                  "src": "",
                  "contentSize": [
                    14,
                    14
                  ],
                  "iconDistance": 8,
                  "loading": false,
                  "useDynamicLoading": false,
                  "style": false,
                  "useDynamicHidden": true
                },
                {
                  "key": "u_ywhmdw",
                  "text": "发布PROD",
                  "showText": true,
                  "dataType": "number",
                  "outVal": 7,
                  "inVal": "",
                  "isCustom": false,
                  "src": "",
                  "contentSize": [
                    14,
                    14
                  ],
                  "iconDistance": 8,
                  "loading": false,
                  "useDynamicLoading": false,
                  "style": false,
                  "useDynamicHidden": true
                },
                {
                  "key": "u_d4jt2z",
                  "text": "线上回测通过",
                  "showText": true,
                  "dataType": "number",
                  "outVal": 8,
                  "inVal": "",
                  "isCustom": false,
                  "src": "",
                  "contentSize": [
                    14,
                    14
                  ],
                  "iconDistance": 8,
                  "loading": false,
                  "useDynamicLoading": false,
                  "style": false,
                  "useDynamicHidden": true,
                  "type": "primary"
                },
                {
                  "key": "u_saw3rc",
                  "text": "上一步",
                  "showText": true,
                  "dataType": "number",
                  "outVal": 12,
                  "inVal": "",
                  "isCustom": false,
                  "src": "",
                  "contentSize": [
                    14,
                    14
                  ],
                  "iconDistance": 8,
                  "loading": false,
                  "useDynamicLoading": false,
                  "style": {
                    "height": "auto",
                    "width": "auto"
                  },
                  "useDynamicHidden": true
                },
                {
                  "key": "u_caka31",
                  "text": "废弃",
                  "showText": true,
                  "dataType": "number",
                  "outVal": 10,
                  "inVal": "",
                  "isCustom": false,
                  "src": "",
                  "contentSize": [
                    14,
                    14
                  ],
                  "iconDistance": 8,
                  "loading": false,
                  "useDynamicLoading": false,
                  "style": false,
                  "useDynamicDisabled": false,
                  "useDynamicHidden": true,
                  "type": "danger"
                },
                {
                  "key": "u_nti0ax",
                  "text": "返回",
                  "showText": true,
                  "dataType": "number",
                  "outVal": 0,
                  "inVal": "",
                  "isCustom": false,
                  "src": "",
                  "contentSize": [
                    14,
                    14
                  ],
                  "iconDistance": 8,
                  "loading": false,
                  "useDynamicLoading": false,
                  "style": false
                }
              ],
              "layout": "center",
              "spaceSize": [
                20,
                10
              ],
              "useEllipses": false
            },
            "inputAry": [
              {
                "hostId": "setVisible_btn0",
                "title": "显示发布PRT",
                "schema": {
                  "type": "any"
                }
              },
              {
                "hostId": "setHidden_btn0",
                "title": "隐藏发布PRT",
                "schema": {
                  "type": "any"
                }
              },
              {
                "hostId": "setVisible_u_s567wa",
                "title": "显示PRT测试通过",
                "schema": {
                  "type": "any"
                }
              },
              {
                "hostId": "setHidden_u_s567wa",
                "title": "隐藏PRT测试通过",
                "schema": {
                  "type": "any"
                }
              },
              {
                "hostId": "setVisible_u_pt02kz",
                "title": "显示撤销审批",
                "schema": {
                  "type": "any"
                }
              },
              {
                "hostId": "setHidden_u_pt02kz",
                "title": "隐藏撤销审批",
                "schema": {
                  "type": "any"
                }
              },
              {
                "hostId": "setVisible_u_ywhmdw",
                "title": "显示发布PROD",
                "schema": {
                  "type": "any"
                }
              },
              {
                "hostId": "setHidden_u_ywhmdw",
                "title": "隐藏发布PROD",
                "schema": {
                  "type": "any"
                }
              },
              {
                "hostId": "setVisible_u_d4jt2z",
                "title": "显示线上回测通过",
                "schema": {
                  "type": "any"
                }
              },
              {
                "hostId": "setHidden_u_d4jt2z",
                "title": "隐藏线上回测通过",
                "schema": {
                  "type": "any"
                }
              },
              {
                "hostId": "setVisible_u_caka31",
                "title": "显示废弃",
                "schema": {
                  "type": "any"
                }
              },
              {
                "hostId": "setHidden_u_caka31",
                "title": "隐藏废弃",
                "schema": {
                  "type": "any"
                }
              },
              {
                "hostId": "setVisible_u_mbzp3y",
                "title": "显示发布STAGING",
                "schema": {
                  "type": "any"
                }
              },
              {
                "hostId": "setHidden_u_mbzp3y",
                "title": "隐藏发布STAGING",
                "schema": {
                  "type": "any"
                }
              },
              {
                "hostId": "setVisible_u_mem59p",
                "title": "显示STAGING测试通过",
                "schema": {
                  "type": "any"
                }
              },
              {
                "hostId": "setHidden_u_mem59p",
                "title": "隐藏STAGING测试通过",
                "schema": {
                  "type": "any"
                }
              },
              {
                "hostId": "setVisible_u_saw3rc",
                "title": "显示上一步",
                "schema": {
                  "type": "any"
                }
              },
              {
                "hostId": "setHidden_u_saw3rc",
                "title": "隐藏上一步",
                "schema": {
                  "type": "any"
                }
              }
            ],
            "outputAry": [
              "u_s567wa",
              "doubleClick_u_s567wa",
              "u_pt02kz",
              "doubleClick_u_pt02kz",
              "u_ywhmdw",
              "doubleClick_u_ywhmdw",
              "u_d4jt2z",
              "doubleClick_u_d4jt2z",
              "u_e1cmcb",
              "doubleClick_u_e1cmcb",
              "u_k22m5y",
              "doubleClick_u_k22m5y",
              "u_zm26ja",
              "doubleClick_u_zm26ja",
              "u_e2xa2s",
              "doubleClick_u_e2xa2s",
              "u_caka31",
              "doubleClick_u_caka31",
              "u_nti0ax",
              "doubleClick_u_nti0ax",
              "u_mbzp3y",
              "doubleClick_u_mbzp3y",
              "u_mem59p",
              "doubleClick_u_mem59p",
              "u_saw3rc",
              "doubleClick_u_saw3rc",
              "doubleClick_u_k5yh3i",
              "u_616jm8",
              "doubleClick_u_616jm8",
              "u_maf774",
              "doubleClick_u_maf774"
            ],
            "outputEvents": {
              "u_s567wa": [
                {
                  "type": "defined",
                  "options": {
                    "id": "u_CoQ2t",
                    "title": "工具条 > 单击PRT测试通过"
                  },
                  "active": true
                }
              ],
              "u_pt02kz": [
                {
                  "type": "defined",
                  "options": {
                    "id": "u_Qf0Sy",
                    "title": "工具条 > 单击撤销审批"
                  },
                  "active": true
                }
              ],
              "u_ywhmdw": [
                {
                  "type": "defined",
                  "options": {
                    "id": "u_BhU8t",
                    "title": "工具条 > 单击发布PROD"
                  },
                  "active": true
                }
              ],
              "u_d4jt2z": [
                {
                  "type": "defined",
                  "options": {
                    "id": "u_pBob0",
                    "title": "工具条 > 单击线上回测通过"
                  },
                  "active": true
                }
              ],
              "u_e1cmcb": [
                {
                  "type": "defined",
                  "options": {},
                  "active": true
                }
              ],
              "u_zm26ja": [
                {
                  "type": "defined",
                  "options": {},
                  "active": true
                }
              ],
              "u_k22m5y": [
                {
                  "type": "defined",
                  "options": {},
                  "active": true
                }
              ],
              "u_e2xa2s": [
                {
                  "type": "defined",
                  "options": {},
                  "active": true
                }
              ],
              "u_caka31": [
                {
                  "type": "defined",
                  "options": {
                    "id": "u_ZNJIS",
                    "title": "工具条 > 单击废弃"
                  },
                  "active": true
                }
              ],
              "u_nti0ax": [
                {
                  "type": "defined",
                  "options": {
                    "id": "u_mjOh9",
                    "title": "工具条 > 单击返回"
                  },
                  "active": true
                }
              ],
              "u_mbzp3y": [
                {
                  "type": "defined",
                  "options": {
                    "id": "u_doRHs",
                    "title": "工具条 > 单击发布STAGING"
                  },
                  "active": true
                }
              ],
              "u_mem59p": [
                {
                  "type": "defined",
                  "options": {
                    "id": "u_kDRb1",
                    "title": "工具条 > 单击STAGING测试通过"
                  },
                  "active": true
                }
              ],
              "u_saw3rc": [
                {
                  "type": "defined",
                  "options": {
                    "id": "u_gyPtG",
                    "title": "工具条 > 单击上一步"
                  },
                  "active": true
                }
              ],
              "u_k5yh3i": [
                {
                  "type": "defined",
                  "options": {},
                  "active": true
                }
              ],
              "u_616jm8": [
                {
                  "type": "defined",
                  "options": {
                    "id": "u_sBdgz",
                    "title": "工具条 > 单击按钮10"
                  },
                  "active": true
                }
              ],
              "u_maf774": [
                {
                  "type": "defined",
                  "options": {
                    "id": "u_tzR1B",
                    "title": "工具条 > 单击发布DB"
                  },
                  "active": true
                }
              ],
              "btn0": [
                {
                  "type": "defined",
                  "options": {
                    "id": "u_muTS7",
                    "title": "工具条 > 单击发布PRT"
                  },
                  "active": true
                }
              ],
              "doubleClick_btn0": [
                {
                  "type": "defined",
                  "options": {},
                  "active": true
                }
              ],
              "doubleClick_u_s567wa": [
                {
                  "type": "defined",
                  "options": {},
                  "active": true
                }
              ],
              "doubleClick_u_pt02kz": [
                {
                  "type": "defined",
                  "options": {},
                  "active": true
                }
              ],
              "doubleClick_u_ywhmdw": [
                {
                  "type": "defined",
                  "options": {},
                  "active": true
                }
              ],
              "doubleClick_u_d4jt2z": [
                {
                  "type": "defined",
                  "options": {},
                  "active": true
                }
              ],
              "doubleClick_u_e1cmcb": [
                {
                  "type": "defined",
                  "options": {},
                  "active": true
                }
              ],
              "doubleClick_u_zm26ja": [
                {
                  "type": "defined",
                  "options": {},
                  "active": true
                }
              ],
              "doubleClick_u_k22m5y": [
                {
                  "type": "defined",
                  "options": {},
                  "active": true
                }
              ],
              "doubleClick_u_e2xa2s": [
                {
                  "type": "defined",
                  "options": {},
                  "active": true
                }
              ],
              "doubleClick_u_caka31": [
                {
                  "type": "defined",
                  "options": {},
                  "active": true
                }
              ],
              "doubleClick_u_nti0ax": [
                {
                  "type": "defined",
                  "options": {},
                  "active": true
                }
              ],
              "doubleClick_u_mbzp3y": [
                {
                  "type": "defined",
                  "options": {},
                  "active": true
                }
              ],
              "doubleClick_u_mem59p": [
                {
                  "type": "defined",
                  "options": {},
                  "active": true
                }
              ],
              "doubleClick_u_saw3rc": [
                {
                  "type": "defined",
                  "options": {},
                  "active": true
                }
              ],
              "doubleClick_u_k5yh3i": [
                {
                  "type": "defined",
                  "options": {},
                  "active": true
                }
              ],
              "doubleClick_u_616jm8": [
                {
                  "type": "defined",
                  "options": {},
                  "active": true
                }
              ],
              "doubleClick_u_maf774": [
                {
                  "type": "defined",
                  "options": {},
                  "active": true
                }
              ]
            },
            "style": {
              "height": "fit-content",
              "width": "100%",
              "marginBottom": 100,
              "styleAry": [
                {
                  "selector": "div[data-btn-idx=\"btn0\"] > button",
                  "css": {
                    "fontWeight": "400"
                  }
                },
                {
                  "selector": "div[data-btn-idx=\"btn0\"]",
                  "css": {
                    "height": "auto",
                    "width": "auto"
                  }
                },
                {
                  "selector": "div[data-btn-idx=\"u_s567wa\"]",
                  "css": {
                    "height": "auto",
                    "width": "auto"
                  }
                },
                {
                  "selector": "div[data-btn-idx=\"u_pt02kz\"]",
                  "css": {
                    "height": "auto",
                    "width": "auto"
                  }
                },
                {
                  "selector": "div[data-btn-idx=\"u_ywhmdw\"]",
                  "css": {
                    "height": "auto",
                    "width": "auto"
                  }
                },
                {
                  "selector": "div[data-btn-idx=\"u_d4jt2z\"]",
                  "css": {
                    "height": "auto",
                    "width": "auto"
                  }
                },
                {
                  "selector": "div[data-btn-idx=\"u_caka31\"]",
                  "css": {
                    "height": "auto",
                    "width": "auto"
                  }
                },
                {
                  "selector": "div[data-btn-idx=\"u_nti0ax\"]",
                  "css": {
                    "height": "auto",
                    "width": "auto"
                  }
                },
                {
                  "selector": "div[data-btn-idx=\"u_mbzp3y\"] > button",
                  "css": {
                    "backgroundColor": "#326bfb",
                    "borderTopColor": "#326bfb",
                    "borderRightColor": "#326bfb",
                    "borderBottomColor": "#326bfb",
                    "borderLeftColor": "#326bfb",
                    "color": "#ffffff"
                  }
                },
                {
                  "selector": "div[data-btn-idx=\"u_mem59p\"] > button",
                  "css": {
                    "backgroundColor": "#326bfb",
                    "color": "#ffffff"
                  }
                },
                {
                  "selector": "div[data-btn-idx=\"u_saw3rc\"] > button",
                  "css": {
                    "backgroundColor": "#ffc53da4",
                    "color": "#000000"
                  }
                }
              ],
              "_new": true
            }
          },
          "style": {
            "width": 1024,
            "height": 74
          },
          "configs": [],
          "_inputs": [],
          "inputs": [
            "setVisible_btn0",
            "setHidden_btn0",
            "setVisible_u_s567wa",
            "setHidden_u_s567wa",
            "setVisible_u_pt02kz",
            "setHidden_u_pt02kz",
            "setVisible_u_ywhmdw",
            "setHidden_u_ywhmdw",
            "setVisible_u_d4jt2z",
            "setHidden_u_d4jt2z",
            "setVisible_u_caka31",
            "setHidden_u_caka31",
            "setVisible_u_mbzp3y",
            "setHidden_u_mbzp3y",
            "setVisible_u_mem59p",
            "setHidden_u_mem59p",
            "setVisible_u_saw3rc",
            "setHidden_u_saw3rc",
            "show",
            "hide",
            "showOrHide"
          ],
          "outputs": [
            "btn0",
            "doubleClick_btn0",
            "u_s567wa",
            "doubleClick_u_s567wa",
            "u_pt02kz",
            "doubleClick_u_pt02kz",
            "u_ywhmdw",
            "doubleClick_u_ywhmdw",
            "u_d4jt2z",
            "doubleClick_u_d4jt2z",
            "doubleClick_u_e1cmcb",
            "doubleClick_u_k22m5y",
            "doubleClick_u_zm26ja",
            "doubleClick_u_e2xa2s",
            "u_caka31",
            "doubleClick_u_caka31",
            "u_nti0ax",
            "doubleClick_u_nti0ax",
            "u_mbzp3y",
            "doubleClick_u_mbzp3y",
            "u_mem59p",
            "doubleClick_u_mem59p",
            "u_saw3rc",
            "doubleClick_u_saw3rc",
            "doubleClick_u_k5yh3i",
            "doubleClick_u_616jm8",
            "doubleClick_u_maf774"
          ]
        },
        "u_mGG_w": {
          "id": "u_mGG_w",
          "def": {
            "namespace": "mybricks.normal-pc.text",
            "version": "1.0.17",
            "materialId": 47511
          },
          "title": "审批人文本",
          "model": {
            "data": {
              "content": "",
              "outputContent": "",
              "align": "left",
              "isEllipsis": false,
              "ellipsis": {
                "rows": 3
              },
              "style": {},
              "useClick": false,
              "useDynamicStyle": false,
              "useHoverStyle": true,
              "legacyConfigStyle": {}
            },
            "inputAry": [],
            "outputAry": [],
            "outputEvents": {},
            "style": {
              "width": "fit-content",
              "styleAry": [
                {
                  "selector": "[data-item-type=\"root\"]",
                  "css": {
                    "color": "#000000",
                    "fontSize": "16px",
                    "lineHeight": "20px"
                  }
                },
                {
                  "selector": "[data-item-type=\"root\"]:hover",
                  "css": {
                    "color": "#000000",
                    "fontSize": "16px",
                    "lineHeight": "20px"
                  }
                }
              ],
              "marginTop": 0,
              "maxWidth": "fit-content",
              "height": "fit-content",
              "_new": true
            }
          },
          "style": {
            "width": 0,
            "height": 0
          },
          "configs": [
            "text",
            "style"
          ],
          "_inputs": [],
          "inputs": [
            "content",
            "show",
            "hide",
            "showOrHide"
          ],
          "outputs": []
        },
        "u_M8qnH": {
          "id": "u_M8qnH",
          "def": {
            "namespace": "mybricks.basic-comlib._muilt-inputJs",
            "version": "1.0.2",
            "rtType": "js-autorun",
            "materialId": 46406
          },
          "title": "JS计算",
          "model": {
            "data": {
              "fns": {
                "code": "(%7B%20outputs%2C%20inputs%20%7D)%20%3D%3E%20%7B%0A%20%20const%20%5BinputValue0%5D%20%3D%20inputs%3B%0A%20%20const%20%5B%0A%20%20%20%20output0%2C%0A%20%20%20%20output1%2C%0A%20%20%20%20output2%2C%0A%20%20%20%20output3%2C%0A%20%20%20%20output4%2C%0A%20%20%20%20output5%2C%0A%20%20%20%20output6%2C%0A%20%20%20%20output7%2C%0A%20%20%20%20output8%2C%0A%20%20%20%20output9%2C%0A%20%20%20%20output10%2C%0A%20%20%20%20output11%2C%0A%20%20%20%20output12%2C%0A%20%20%20%20output13%2C%0A%20%20%20%20output14%0A%20%20%5D%20%3D%20outputs%3B%0A%20%20const%20%7B%20result%2C%20error_msg%2C%20data%20%7D%20%3D%20inputValue0%3B%0A%20%20if%20(result%20%3D%3D%201)%20%7B%0A%20%20%20%20const%20%7B%20id%2C%20step%2C%20operateOptions%2C%20formContent%2C%20approveInfo%2C%20%0A%20%20%20%20statusDesc%2C%20pictureUrl%2C%20showStaging%2C%20changeControlInfo%2C%20dbFormContent%7D%20%3D%0A%20%20%20%20%20%20data%3B%0A%20%20%20%20const%20content%20%3D%20JSON.parse(formContent)%3B%0A%20%20%20%20output0(content)%3B%0A%20%20%20%20output4(content.formData)%3B%0A%20%20%20%20output1(JSON.parse(operateOptions))%3B%0A%20%20%20%20output2(step)%3B%0A%20%20%20%20output5(approveInfo)%3B%0A%20%20%20%20output8(id)%3B%0A%20%20%20%20output10(pictureUrl)%3B%0A%20%20%20%20output11(showStaging)%3B%0A%20%20%20%20const%20dbContent%20%3D%20JSON.parse(dbFormContent)%3B%0A%20%20%20%20output13(dbContent)%3B%0A%20%20%20%20output14(dbContent.formData)%3B%0A%20%20%20%20if(changeControlInfo)%7B%0A%20%20%20%20%20%20output12(changeControlInfo)%3B%0A%20%20%20%20%7D%0A%20%20%20%20if%20(step%20%3D%3D%202)%20%7B%0A%20%20%20%20%20%20%2F%2F%20%E5%AE%A1%E6%89%B9%E9%98%B6%E6%AE%B5%EF%BC%8C%E8%BD%AE%E8%AF%A2%E6%9F%A5%E8%AF%A2%0A%20%20%20%20%20%20output6(1)%3B%0A%20%20%20%20%7D%20else%20%7B%0A%20%20%20%20%20%20%2F%2F%20%E5%85%B6%E5%AE%83%E9%98%B6%E6%AE%B5%EF%BC%8C%E5%8F%96%E6%B6%88%E8%BD%AE%E8%AF%A2%0A%20%20%20%20%20%20output7(1)%3B%0A%20%20%20%20%7D%0A%20%20%20%20if%20(step%20%3D%3D%203)%20%7B%0A%20%20%20%20%20%20output9('%E5%8F%91%E5%B8%83%E5%8D%95%E7%BB%93%E6%9D%9F%EF%BC%9A'%20%2B%20statusDesc)%3B%0A%20%20%20%20%7D%0A%20%20%7D%20else%20%7B%0A%20%20%20%20output3(error_msg)%3B%0A%20%20%7D%0A%7D",
                "transformCode": "(function()%20%7B%20var%20_RTFN_%3B%20%0A%22use%20strict%22%3B%0A%0Afunction%20_slicedToArray(arr%2C%20i)%20%7B%20return%20_arrayWithHoles(arr)%20%7C%7C%20_iterableToArrayLimit(arr%2C%20i)%20%7C%7C%20_unsupportedIterableToArray(arr%2C%20i)%20%7C%7C%20_nonIterableRest()%3B%20%7D%0A%0Afunction%20_nonIterableRest()%20%7B%20throw%20new%20TypeError(%22Invalid%20attempt%20to%20destructure%20non-iterable%20instance.%5CnIn%20order%20to%20be%20iterable%2C%20non-array%20objects%20must%20have%20a%20%5BSymbol.iterator%5D()%20method.%22)%3B%20%7D%0A%0Afunction%20_unsupportedIterableToArray(o%2C%20minLen)%20%7B%20if%20(!o)%20return%3B%20if%20(typeof%20o%20%3D%3D%3D%20%22string%22)%20return%20_arrayLikeToArray(o%2C%20minLen)%3B%20var%20n%20%3D%20Object.prototype.toString.call(o).slice(8%2C%20-1)%3B%20if%20(n%20%3D%3D%3D%20%22Object%22%20%26%26%20o.constructor)%20n%20%3D%20o.constructor.name%3B%20if%20(n%20%3D%3D%3D%20%22Map%22%20%7C%7C%20n%20%3D%3D%3D%20%22Set%22)%20return%20Array.from(o)%3B%20if%20(n%20%3D%3D%3D%20%22Arguments%22%20%7C%7C%20%2F%5E(%3F%3AUi%7CI)nt(%3F%3A8%7C16%7C32)(%3F%3AClamped)%3FArray%24%2F.test(n))%20return%20_arrayLikeToArray(o%2C%20minLen)%3B%20%7D%0A%0Afunction%20_arrayLikeToArray(arr%2C%20len)%20%7B%20if%20(len%20%3D%3D%20null%20%7C%7C%20len%20%3E%20arr.length)%20len%20%3D%20arr.length%3B%20for%20(var%20i%20%3D%200%2C%20arr2%20%3D%20new%20Array(len)%3B%20i%20%3C%20len%3B%20i%2B%2B)%20%7B%20arr2%5Bi%5D%20%3D%20arr%5Bi%5D%3B%20%7D%20return%20arr2%3B%20%7D%0A%0Afunction%20_iterableToArrayLimit(arr%2C%20i)%20%7B%20var%20_i%20%3D%20arr%20%3D%3D%20null%20%3F%20null%20%3A%20typeof%20Symbol%20!%3D%3D%20%22undefined%22%20%26%26%20arr%5BSymbol.iterator%5D%20%7C%7C%20arr%5B%22%40%40iterator%22%5D%3B%20if%20(_i%20%3D%3D%20null)%20return%3B%20var%20_arr%20%3D%20%5B%5D%3B%20var%20_n%20%3D%20true%3B%20var%20_d%20%3D%20false%3B%20var%20_s%2C%20_e%3B%20try%20%7B%20for%20(_i%20%3D%20_i.call(arr)%3B%20!(_n%20%3D%20(_s%20%3D%20_i.next()).done)%3B%20_n%20%3D%20true)%20%7B%20_arr.push(_s.value)%3B%20if%20(i%20%26%26%20_arr.length%20%3D%3D%3D%20i)%20break%3B%20%7D%20%7D%20catch%20(err)%20%7B%20_d%20%3D%20true%3B%20_e%20%3D%20err%3B%20%7D%20finally%20%7B%20try%20%7B%20if%20(!_n%20%26%26%20_i%5B%22return%22%5D%20!%3D%20null)%20_i%5B%22return%22%5D()%3B%20%7D%20finally%20%7B%20if%20(_d)%20throw%20_e%3B%20%7D%20%7D%20return%20_arr%3B%20%7D%0A%0Afunction%20_arrayWithHoles(arr)%20%7B%20if%20(Array.isArray(arr))%20return%20arr%3B%20%7D%0A%0A_RTFN_%20%3D%20function%20_RTFN_(_ref)%20%7B%0A%20%20var%20outputs%20%3D%20_ref.outputs%2C%0A%20%20%20%20%20%20inputs%20%3D%20_ref.inputs%3B%0A%0A%20%20var%20_inputs%20%3D%20_slicedToArray(inputs%2C%201)%2C%0A%20%20%20%20%20%20inputValue0%20%3D%20_inputs%5B0%5D%3B%0A%0A%20%20var%20_outputs%20%3D%20_slicedToArray(outputs%2C%2015)%2C%0A%20%20%20%20%20%20output0%20%3D%20_outputs%5B0%5D%2C%0A%20%20%20%20%20%20output1%20%3D%20_outputs%5B1%5D%2C%0A%20%20%20%20%20%20output2%20%3D%20_outputs%5B2%5D%2C%0A%20%20%20%20%20%20output3%20%3D%20_outputs%5B3%5D%2C%0A%20%20%20%20%20%20output4%20%3D%20_outputs%5B4%5D%2C%0A%20%20%20%20%20%20output5%20%3D%20_outputs%5B5%5D%2C%0A%20%20%20%20%20%20output6%20%3D%20_outputs%5B6%5D%2C%0A%20%20%20%20%20%20output7%20%3D%20_outputs%5B7%5D%2C%0A%20%20%20%20%20%20output8%20%3D%20_outputs%5B8%5D%2C%0A%20%20%20%20%20%20output9%20%3D%20_outputs%5B9%5D%2C%0A%20%20%20%20%20%20output10%20%3D%20_outputs%5B10%5D%2C%0A%20%20%20%20%20%20output11%20%3D%20_outputs%5B11%5D%2C%0A%20%20%20%20%20%20output12%20%3D%20_outputs%5B12%5D%2C%0A%20%20%20%20%20%20output13%20%3D%20_outputs%5B13%5D%2C%0A%20%20%20%20%20%20output14%20%3D%20_outputs%5B14%5D%3B%0A%0A%20%20var%20result%20%3D%20inputValue0.result%2C%0A%20%20%20%20%20%20error_msg%20%3D%20inputValue0.error_msg%2C%0A%20%20%20%20%20%20data%20%3D%20inputValue0.data%3B%0A%0A%20%20if%20(result%20%3D%3D%201)%20%7B%0A%20%20%20%20var%20id%20%3D%20data.id%2C%0A%20%20%20%20%20%20%20%20step%20%3D%20data.step%2C%0A%20%20%20%20%20%20%20%20operateOptions%20%3D%20data.operateOptions%2C%0A%20%20%20%20%20%20%20%20formContent%20%3D%20data.formContent%2C%0A%20%20%20%20%20%20%20%20approveInfo%20%3D%20data.approveInfo%2C%0A%20%20%20%20%20%20%20%20statusDesc%20%3D%20data.statusDesc%2C%0A%20%20%20%20%20%20%20%20pictureUrl%20%3D%20data.pictureUrl%2C%0A%20%20%20%20%20%20%20%20showStaging%20%3D%20data.showStaging%2C%0A%20%20%20%20%20%20%20%20changeControlInfo%20%3D%20data.changeControlInfo%2C%0A%20%20%20%20%20%20%20%20dbFormContent%20%3D%20data.dbFormContent%3B%0A%20%20%20%20var%20content%20%3D%20JSON.parse(formContent)%3B%0A%20%20%20%20output0(content)%3B%0A%20%20%20%20output4(content.formData)%3B%0A%20%20%20%20output1(JSON.parse(operateOptions))%3B%0A%20%20%20%20output2(step)%3B%0A%20%20%20%20output5(approveInfo)%3B%0A%20%20%20%20output8(id)%3B%0A%20%20%20%20output10(pictureUrl)%3B%0A%20%20%20%20output11(showStaging)%3B%0A%20%20%20%20var%20dbContent%20%3D%20JSON.parse(dbFormContent)%3B%0A%20%20%20%20output13(dbContent)%3B%0A%20%20%20%20output14(dbContent.formData)%3B%0A%0A%20%20%20%20if%20(changeControlInfo)%20%7B%0A%20%20%20%20%20%20output12(changeControlInfo)%3B%0A%20%20%20%20%7D%0A%0A%20%20%20%20if%20(step%20%3D%3D%202)%20%7B%0A%20%20%20%20%20%20output6(1)%3B%0A%20%20%20%20%7D%20else%20%7B%0A%20%20%20%20%20%20output7(1)%3B%0A%20%20%20%20%7D%0A%0A%20%20%20%20if%20(step%20%3D%3D%203)%20%7B%0A%20%20%20%20%20%20output9('%E5%8F%91%E5%B8%83%E5%8D%95%E7%BB%93%E6%9D%9F%EF%BC%9A'%20%2B%20statusDesc)%3B%0A%20%20%20%20%7D%0A%20%20%7D%20else%20%7B%0A%20%20%20%20output3(error_msg)%3B%0A%20%20%7D%0A%7D%3B%0A%3B%20return%20_RTFN_%3B%20%7D)()"
              }
            },
            "inputAry": [],
            "outputAry": [
              "output1",
              "output2",
              "output3",
              "output4",
              "output5",
              "output6",
              "output7",
              "output8",
              "output9",
              "output10",
              "output11",
              "output12",
              "output13",
              "output14"
            ],
            "outputEvents": {},
            "style": {
              "display": "block"
            }
          },
          "style": {},
          "configs": [],
          "_inputs": [],
          "inputs": [
            "input.inputValue0"
          ],
          "outputs": [
            "output0",
            "output1",
            "output2",
            "output3",
            "output4",
            "output5",
            "output6",
            "output7",
            "output8",
            "output9",
            "output10",
            "output11",
            "output12",
            "output13",
            "output14"
          ]
        },
        "u_xe79v": {
          "id": "u_xe79v",
          "def": {
            "namespace": "mybricks.core-comlib.var",
            "version": "1.0.0",
            "rtType": "js"
          },
          "title": "表单内容",
          "model": {
            "data": {},
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
            "get",
            "set",
            "reset"
          ],
          "outputs": [
            "return",
            "changed"
          ]
        },
        "u_64wD1": {
          "id": "u_64wD1",
          "def": {
            "namespace": "mybricks.normal-pc.custom-container",
            "version": "1.0.24",
            "materialId": 48068
          },
          "title": "自定义容器",
          "model": {
            "data": {
              "style": {},
              "slotStyle": {
                "display": "flex",
                "position": "inherit",
                "flexDirection": "column",
                "alignItems": "center",
                "justifyContent": "center",
                "flexWrap": "nowrap",
                "rowGap": 0,
                "columnGap": 0
              },
              "legacyConfigStyle": {},
              "legacyStyle": {
                "maxHeight": ""
              }
            },
            "inputAry": [],
            "outputAry": [],
            "outputEvents": {
              "change": [
                {
                  "type": "defined",
                  "options": {},
                  "active": true
                }
              ]
            },
            "style": {
              "height": "100%",
              "width": "100%",
              "marginBottom": 0,
              "marginTop": 0,
              "flex": null,
              "_new": true
            }
          },
          "style": {
            "width": 0,
            "height": 0
          },
          "configs": [
            "style",
            "id"
          ],
          "_inputs": [],
          "inputs": [
            "show",
            "hide",
            "showOrHide"
          ],
          "outputs": []
        },
        "u_ESQks": {
          "id": "u_ESQks",
          "def": {
            "namespace": "mybricks.core-comlib.var",
            "version": "1.0.0",
            "rtType": "js"
          },
          "title": "工具条状态",
          "model": {
            "data": {},
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
            "get",
            "set",
            "reset"
          ],
          "outputs": [
            "return",
            "changed"
          ]
        },
        "u_uxT7z": {
          "id": "u_uxT7z",
          "def": {
            "namespace": "mybricks.basic-comlib._muilt-inputJs",
            "version": "1.0.2",
            "rtType": "js-autorun",
            "materialId": 46406
          },
          "title": "JS计算",
          "model": {
            "data": {
              "fns": {
                "code": "(%7B%20outputs%2C%20inputs%20%7D)%20%3D%3E%20%7B%0A%20%20const%20%5B%20inputValue0%20%5D%20%3D%20inputs%3B%0A%20%20const%20%5B%20output0%2C%20output1%20%5D%20%3D%20outputs%3B%0A%20%20if(inputValue0%5B'showPublishPRT'%5D%20%3D%3D%20true)%20%7B%0A%20%20%20%20%20%20output0(1)%3B%0A%20%20%7D%20else%20%7B%0A%20%20%20%20%20%20output1(1)%3B%0A%20%20%7D%0A%7D",
                "transformCode": "(function()%20%7B%20var%20_RTFN_%3B%20%0A%22use%20strict%22%3B%0A%0Afunction%20_slicedToArray(arr%2C%20i)%20%7B%20return%20_arrayWithHoles(arr)%20%7C%7C%20_iterableToArrayLimit(arr%2C%20i)%20%7C%7C%20_unsupportedIterableToArray(arr%2C%20i)%20%7C%7C%20_nonIterableRest()%3B%20%7D%0A%0Afunction%20_nonIterableRest()%20%7B%20throw%20new%20TypeError(%22Invalid%20attempt%20to%20destructure%20non-iterable%20instance.%5CnIn%20order%20to%20be%20iterable%2C%20non-array%20objects%20must%20have%20a%20%5BSymbol.iterator%5D()%20method.%22)%3B%20%7D%0A%0Afunction%20_unsupportedIterableToArray(o%2C%20minLen)%20%7B%20if%20(!o)%20return%3B%20if%20(typeof%20o%20%3D%3D%3D%20%22string%22)%20return%20_arrayLikeToArray(o%2C%20minLen)%3B%20var%20n%20%3D%20Object.prototype.toString.call(o).slice(8%2C%20-1)%3B%20if%20(n%20%3D%3D%3D%20%22Object%22%20%26%26%20o.constructor)%20n%20%3D%20o.constructor.name%3B%20if%20(n%20%3D%3D%3D%20%22Map%22%20%7C%7C%20n%20%3D%3D%3D%20%22Set%22)%20return%20Array.from(o)%3B%20if%20(n%20%3D%3D%3D%20%22Arguments%22%20%7C%7C%20%2F%5E(%3F%3AUi%7CI)nt(%3F%3A8%7C16%7C32)(%3F%3AClamped)%3FArray%24%2F.test(n))%20return%20_arrayLikeToArray(o%2C%20minLen)%3B%20%7D%0A%0Afunction%20_arrayLikeToArray(arr%2C%20len)%20%7B%20if%20(len%20%3D%3D%20null%20%7C%7C%20len%20%3E%20arr.length)%20len%20%3D%20arr.length%3B%20for%20(var%20i%20%3D%200%2C%20arr2%20%3D%20new%20Array(len)%3B%20i%20%3C%20len%3B%20i%2B%2B)%20%7B%20arr2%5Bi%5D%20%3D%20arr%5Bi%5D%3B%20%7D%20return%20arr2%3B%20%7D%0A%0Afunction%20_iterableToArrayLimit(arr%2C%20i)%20%7B%20var%20_i%20%3D%20arr%20%3D%3D%20null%20%3F%20null%20%3A%20typeof%20Symbol%20!%3D%3D%20%22undefined%22%20%26%26%20arr%5BSymbol.iterator%5D%20%7C%7C%20arr%5B%22%40%40iterator%22%5D%3B%20if%20(_i%20%3D%3D%20null)%20return%3B%20var%20_arr%20%3D%20%5B%5D%3B%20var%20_n%20%3D%20true%3B%20var%20_d%20%3D%20false%3B%20var%20_s%2C%20_e%3B%20try%20%7B%20for%20(_i%20%3D%20_i.call(arr)%3B%20!(_n%20%3D%20(_s%20%3D%20_i.next()).done)%3B%20_n%20%3D%20true)%20%7B%20_arr.push(_s.value)%3B%20if%20(i%20%26%26%20_arr.length%20%3D%3D%3D%20i)%20break%3B%20%7D%20%7D%20catch%20(err)%20%7B%20_d%20%3D%20true%3B%20_e%20%3D%20err%3B%20%7D%20finally%20%7B%20try%20%7B%20if%20(!_n%20%26%26%20_i%5B%22return%22%5D%20!%3D%20null)%20_i%5B%22return%22%5D()%3B%20%7D%20finally%20%7B%20if%20(_d)%20throw%20_e%3B%20%7D%20%7D%20return%20_arr%3B%20%7D%0A%0Afunction%20_arrayWithHoles(arr)%20%7B%20if%20(Array.isArray(arr))%20return%20arr%3B%20%7D%0A%0A_RTFN_%20%3D%20function%20_RTFN_(_ref)%20%7B%0A%20%20var%20outputs%20%3D%20_ref.outputs%2C%0A%20%20%20%20%20%20inputs%20%3D%20_ref.inputs%3B%0A%0A%20%20var%20_inputs%20%3D%20_slicedToArray(inputs%2C%201)%2C%0A%20%20%20%20%20%20inputValue0%20%3D%20_inputs%5B0%5D%3B%0A%0A%20%20var%20_outputs%20%3D%20_slicedToArray(outputs%2C%202)%2C%0A%20%20%20%20%20%20output0%20%3D%20_outputs%5B0%5D%2C%0A%20%20%20%20%20%20output1%20%3D%20_outputs%5B1%5D%3B%0A%0A%20%20if%20(inputValue0%5B'showPublishPRT'%5D%20%3D%3D%20true)%20%7B%0A%20%20%20%20output0(1)%3B%0A%20%20%7D%20else%20%7B%0A%20%20%20%20output1(1)%3B%0A%20%20%7D%0A%7D%3B%0A%3B%20return%20_RTFN_%3B%20%7D)()"
              }
            },
            "inputAry": [],
            "outputAry": [
              "output1"
            ],
            "outputEvents": {},
            "style": {
              "display": "block"
            }
          },
          "style": {},
          "configs": [],
          "_inputs": [],
          "inputs": [
            "input.inputValue0"
          ],
          "outputs": [
            "output0",
            "output1"
          ]
        },
        "u_J5IuF": {
          "id": "u_J5IuF",
          "def": {
            "namespace": "mybricks.basic-comlib._muilt-inputJs",
            "version": "1.0.2",
            "rtType": "js-autorun",
            "materialId": 46406
          },
          "title": "JS计算",
          "model": {
            "data": {
              "fns": {
                "code": "(%7B%20outputs%2C%20inputs%20%7D)%20%3D%3E%20%7B%0A%20%20const%20%5B%20inputValue0%20%5D%20%3D%20inputs%3B%0A%20%20const%20%5B%20output0%2C%20output1%20%5D%20%3D%20outputs%3B%0A%20%20if(inputValue0%5B'showPassPRT'%5D%20%3D%3D%20true)%20%7B%0A%20%20%20%20%20%20output0(1)%3B%0A%20%20%7D%20else%20%7B%0A%20%20%20%20%20%20output1(1)%3B%0A%20%20%7D%0A%7D",
                "transformCode": "(function()%20%7B%20var%20_RTFN_%3B%20%0A%22use%20strict%22%3B%0A%0Afunction%20_slicedToArray(arr%2C%20i)%20%7B%20return%20_arrayWithHoles(arr)%20%7C%7C%20_iterableToArrayLimit(arr%2C%20i)%20%7C%7C%20_unsupportedIterableToArray(arr%2C%20i)%20%7C%7C%20_nonIterableRest()%3B%20%7D%0A%0Afunction%20_nonIterableRest()%20%7B%20throw%20new%20TypeError(%22Invalid%20attempt%20to%20destructure%20non-iterable%20instance.%5CnIn%20order%20to%20be%20iterable%2C%20non-array%20objects%20must%20have%20a%20%5BSymbol.iterator%5D()%20method.%22)%3B%20%7D%0A%0Afunction%20_unsupportedIterableToArray(o%2C%20minLen)%20%7B%20if%20(!o)%20return%3B%20if%20(typeof%20o%20%3D%3D%3D%20%22string%22)%20return%20_arrayLikeToArray(o%2C%20minLen)%3B%20var%20n%20%3D%20Object.prototype.toString.call(o).slice(8%2C%20-1)%3B%20if%20(n%20%3D%3D%3D%20%22Object%22%20%26%26%20o.constructor)%20n%20%3D%20o.constructor.name%3B%20if%20(n%20%3D%3D%3D%20%22Map%22%20%7C%7C%20n%20%3D%3D%3D%20%22Set%22)%20return%20Array.from(o)%3B%20if%20(n%20%3D%3D%3D%20%22Arguments%22%20%7C%7C%20%2F%5E(%3F%3AUi%7CI)nt(%3F%3A8%7C16%7C32)(%3F%3AClamped)%3FArray%24%2F.test(n))%20return%20_arrayLikeToArray(o%2C%20minLen)%3B%20%7D%0A%0Afunction%20_arrayLikeToArray(arr%2C%20len)%20%7B%20if%20(len%20%3D%3D%20null%20%7C%7C%20len%20%3E%20arr.length)%20len%20%3D%20arr.length%3B%20for%20(var%20i%20%3D%200%2C%20arr2%20%3D%20new%20Array(len)%3B%20i%20%3C%20len%3B%20i%2B%2B)%20%7B%20arr2%5Bi%5D%20%3D%20arr%5Bi%5D%3B%20%7D%20return%20arr2%3B%20%7D%0A%0Afunction%20_iterableToArrayLimit(arr%2C%20i)%20%7B%20var%20_i%20%3D%20arr%20%3D%3D%20null%20%3F%20null%20%3A%20typeof%20Symbol%20!%3D%3D%20%22undefined%22%20%26%26%20arr%5BSymbol.iterator%5D%20%7C%7C%20arr%5B%22%40%40iterator%22%5D%3B%20if%20(_i%20%3D%3D%20null)%20return%3B%20var%20_arr%20%3D%20%5B%5D%3B%20var%20_n%20%3D%20true%3B%20var%20_d%20%3D%20false%3B%20var%20_s%2C%20_e%3B%20try%20%7B%20for%20(_i%20%3D%20_i.call(arr)%3B%20!(_n%20%3D%20(_s%20%3D%20_i.next()).done)%3B%20_n%20%3D%20true)%20%7B%20_arr.push(_s.value)%3B%20if%20(i%20%26%26%20_arr.length%20%3D%3D%3D%20i)%20break%3B%20%7D%20%7D%20catch%20(err)%20%7B%20_d%20%3D%20true%3B%20_e%20%3D%20err%3B%20%7D%20finally%20%7B%20try%20%7B%20if%20(!_n%20%26%26%20_i%5B%22return%22%5D%20!%3D%20null)%20_i%5B%22return%22%5D()%3B%20%7D%20finally%20%7B%20if%20(_d)%20throw%20_e%3B%20%7D%20%7D%20return%20_arr%3B%20%7D%0A%0Afunction%20_arrayWithHoles(arr)%20%7B%20if%20(Array.isArray(arr))%20return%20arr%3B%20%7D%0A%0A_RTFN_%20%3D%20function%20_RTFN_(_ref)%20%7B%0A%20%20var%20outputs%20%3D%20_ref.outputs%2C%0A%20%20%20%20%20%20inputs%20%3D%20_ref.inputs%3B%0A%0A%20%20var%20_inputs%20%3D%20_slicedToArray(inputs%2C%201)%2C%0A%20%20%20%20%20%20inputValue0%20%3D%20_inputs%5B0%5D%3B%0A%0A%20%20var%20_outputs%20%3D%20_slicedToArray(outputs%2C%202)%2C%0A%20%20%20%20%20%20output0%20%3D%20_outputs%5B0%5D%2C%0A%20%20%20%20%20%20output1%20%3D%20_outputs%5B1%5D%3B%0A%0A%20%20if%20(inputValue0%5B'showPassPRT'%5D%20%3D%3D%20true)%20%7B%0A%20%20%20%20output0(1)%3B%0A%20%20%7D%20else%20%7B%0A%20%20%20%20output1(1)%3B%0A%20%20%7D%0A%7D%3B%0A%3B%20return%20_RTFN_%3B%20%7D)()"
              }
            },
            "inputAry": [],
            "outputAry": [
              "output1"
            ],
            "outputEvents": {},
            "style": {
              "display": "block"
            }
          },
          "style": {},
          "configs": [],
          "_inputs": [],
          "inputs": [
            "input.inputValue0"
          ],
          "outputs": [
            "output0",
            "output1"
          ]
        },
        "u_ECdEA": {
          "id": "u_ECdEA",
          "def": {
            "namespace": "mybricks.basic-comlib._muilt-inputJs",
            "version": "1.0.2",
            "rtType": "js-autorun",
            "materialId": 46406
          },
          "title": "JS计算",
          "model": {
            "data": {
              "fns": {
                "code": "(%7B%20outputs%2C%20inputs%20%7D)%20%3D%3E%20%7B%0A%20%20const%20%5B%20inputValue0%20%5D%20%3D%20inputs%3B%0A%20%20const%20%5B%20output0%2C%20output1%20%5D%20%3D%20outputs%3B%0A%20%20if(inputValue0%5B'showWithdraw'%5D%20%3D%3D%20true)%20%7B%0A%20%20%20%20%20%20output0(1)%3B%0A%20%20%7D%20else%20%7B%0A%20%20%20%20%20%20output1(1)%3B%0A%20%20%7D%0A%7D",
                "transformCode": "(function()%20%7B%20var%20_RTFN_%3B%20%0A%22use%20strict%22%3B%0A%0Afunction%20_slicedToArray(arr%2C%20i)%20%7B%20return%20_arrayWithHoles(arr)%20%7C%7C%20_iterableToArrayLimit(arr%2C%20i)%20%7C%7C%20_unsupportedIterableToArray(arr%2C%20i)%20%7C%7C%20_nonIterableRest()%3B%20%7D%0A%0Afunction%20_nonIterableRest()%20%7B%20throw%20new%20TypeError(%22Invalid%20attempt%20to%20destructure%20non-iterable%20instance.%5CnIn%20order%20to%20be%20iterable%2C%20non-array%20objects%20must%20have%20a%20%5BSymbol.iterator%5D()%20method.%22)%3B%20%7D%0A%0Afunction%20_unsupportedIterableToArray(o%2C%20minLen)%20%7B%20if%20(!o)%20return%3B%20if%20(typeof%20o%20%3D%3D%3D%20%22string%22)%20return%20_arrayLikeToArray(o%2C%20minLen)%3B%20var%20n%20%3D%20Object.prototype.toString.call(o).slice(8%2C%20-1)%3B%20if%20(n%20%3D%3D%3D%20%22Object%22%20%26%26%20o.constructor)%20n%20%3D%20o.constructor.name%3B%20if%20(n%20%3D%3D%3D%20%22Map%22%20%7C%7C%20n%20%3D%3D%3D%20%22Set%22)%20return%20Array.from(o)%3B%20if%20(n%20%3D%3D%3D%20%22Arguments%22%20%7C%7C%20%2F%5E(%3F%3AUi%7CI)nt(%3F%3A8%7C16%7C32)(%3F%3AClamped)%3FArray%24%2F.test(n))%20return%20_arrayLikeToArray(o%2C%20minLen)%3B%20%7D%0A%0Afunction%20_arrayLikeToArray(arr%2C%20len)%20%7B%20if%20(len%20%3D%3D%20null%20%7C%7C%20len%20%3E%20arr.length)%20len%20%3D%20arr.length%3B%20for%20(var%20i%20%3D%200%2C%20arr2%20%3D%20new%20Array(len)%3B%20i%20%3C%20len%3B%20i%2B%2B)%20%7B%20arr2%5Bi%5D%20%3D%20arr%5Bi%5D%3B%20%7D%20return%20arr2%3B%20%7D%0A%0Afunction%20_iterableToArrayLimit(arr%2C%20i)%20%7B%20var%20_i%20%3D%20arr%20%3D%3D%20null%20%3F%20null%20%3A%20typeof%20Symbol%20!%3D%3D%20%22undefined%22%20%26%26%20arr%5BSymbol.iterator%5D%20%7C%7C%20arr%5B%22%40%40iterator%22%5D%3B%20if%20(_i%20%3D%3D%20null)%20return%3B%20var%20_arr%20%3D%20%5B%5D%3B%20var%20_n%20%3D%20true%3B%20var%20_d%20%3D%20false%3B%20var%20_s%2C%20_e%3B%20try%20%7B%20for%20(_i%20%3D%20_i.call(arr)%3B%20!(_n%20%3D%20(_s%20%3D%20_i.next()).done)%3B%20_n%20%3D%20true)%20%7B%20_arr.push(_s.value)%3B%20if%20(i%20%26%26%20_arr.length%20%3D%3D%3D%20i)%20break%3B%20%7D%20%7D%20catch%20(err)%20%7B%20_d%20%3D%20true%3B%20_e%20%3D%20err%3B%20%7D%20finally%20%7B%20try%20%7B%20if%20(!_n%20%26%26%20_i%5B%22return%22%5D%20!%3D%20null)%20_i%5B%22return%22%5D()%3B%20%7D%20finally%20%7B%20if%20(_d)%20throw%20_e%3B%20%7D%20%7D%20return%20_arr%3B%20%7D%0A%0Afunction%20_arrayWithHoles(arr)%20%7B%20if%20(Array.isArray(arr))%20return%20arr%3B%20%7D%0A%0A_RTFN_%20%3D%20function%20_RTFN_(_ref)%20%7B%0A%20%20var%20outputs%20%3D%20_ref.outputs%2C%0A%20%20%20%20%20%20inputs%20%3D%20_ref.inputs%3B%0A%0A%20%20var%20_inputs%20%3D%20_slicedToArray(inputs%2C%201)%2C%0A%20%20%20%20%20%20inputValue0%20%3D%20_inputs%5B0%5D%3B%0A%0A%20%20var%20_outputs%20%3D%20_slicedToArray(outputs%2C%202)%2C%0A%20%20%20%20%20%20output0%20%3D%20_outputs%5B0%5D%2C%0A%20%20%20%20%20%20output1%20%3D%20_outputs%5B1%5D%3B%0A%0A%20%20if%20(inputValue0%5B'showWithdraw'%5D%20%3D%3D%20true)%20%7B%0A%20%20%20%20output0(1)%3B%0A%20%20%7D%20else%20%7B%0A%20%20%20%20output1(1)%3B%0A%20%20%7D%0A%7D%3B%0A%3B%20return%20_RTFN_%3B%20%7D)()"
              }
            },
            "inputAry": [],
            "outputAry": [
              "output1"
            ],
            "outputEvents": {},
            "style": {
              "display": "block"
            }
          },
          "style": {},
          "configs": [],
          "_inputs": [],
          "inputs": [
            "input.inputValue0"
          ],
          "outputs": [
            "output0",
            "output1"
          ]
        },
        "u_NwTgv": {
          "id": "u_NwTgv",
          "def": {
            "namespace": "mybricks.basic-comlib._muilt-inputJs",
            "version": "1.0.2",
            "rtType": "js-autorun",
            "materialId": 46406
          },
          "title": "JS计算",
          "model": {
            "data": {
              "fns": {
                "code": "(%7B%20outputs%2C%20inputs%20%7D)%20%3D%3E%20%7B%0A%20%20const%20%5B%20inputValue0%20%5D%20%3D%20inputs%3B%0A%20%20const%20%5B%20output0%2C%20output1%20%5D%20%3D%20outputs%3B%0A%20%20if(inputValue0%5B'showPublishPROD'%5D%20%3D%3D%20true)%20%7B%0A%20%20%20%20%20%20output0(1)%3B%0A%20%20%7D%20else%20%7B%0A%20%20%20%20%20%20output1(1)%3B%0A%20%20%7D%0A%7D",
                "transformCode": "(function()%20%7B%20var%20_RTFN_%3B%20%0A%22use%20strict%22%3B%0A%0Afunction%20_slicedToArray(arr%2C%20i)%20%7B%20return%20_arrayWithHoles(arr)%20%7C%7C%20_iterableToArrayLimit(arr%2C%20i)%20%7C%7C%20_unsupportedIterableToArray(arr%2C%20i)%20%7C%7C%20_nonIterableRest()%3B%20%7D%0A%0Afunction%20_nonIterableRest()%20%7B%20throw%20new%20TypeError(%22Invalid%20attempt%20to%20destructure%20non-iterable%20instance.%5CnIn%20order%20to%20be%20iterable%2C%20non-array%20objects%20must%20have%20a%20%5BSymbol.iterator%5D()%20method.%22)%3B%20%7D%0A%0Afunction%20_unsupportedIterableToArray(o%2C%20minLen)%20%7B%20if%20(!o)%20return%3B%20if%20(typeof%20o%20%3D%3D%3D%20%22string%22)%20return%20_arrayLikeToArray(o%2C%20minLen)%3B%20var%20n%20%3D%20Object.prototype.toString.call(o).slice(8%2C%20-1)%3B%20if%20(n%20%3D%3D%3D%20%22Object%22%20%26%26%20o.constructor)%20n%20%3D%20o.constructor.name%3B%20if%20(n%20%3D%3D%3D%20%22Map%22%20%7C%7C%20n%20%3D%3D%3D%20%22Set%22)%20return%20Array.from(o)%3B%20if%20(n%20%3D%3D%3D%20%22Arguments%22%20%7C%7C%20%2F%5E(%3F%3AUi%7CI)nt(%3F%3A8%7C16%7C32)(%3F%3AClamped)%3FArray%24%2F.test(n))%20return%20_arrayLikeToArray(o%2C%20minLen)%3B%20%7D%0A%0Afunction%20_arrayLikeToArray(arr%2C%20len)%20%7B%20if%20(len%20%3D%3D%20null%20%7C%7C%20len%20%3E%20arr.length)%20len%20%3D%20arr.length%3B%20for%20(var%20i%20%3D%200%2C%20arr2%20%3D%20new%20Array(len)%3B%20i%20%3C%20len%3B%20i%2B%2B)%20%7B%20arr2%5Bi%5D%20%3D%20arr%5Bi%5D%3B%20%7D%20return%20arr2%3B%20%7D%0A%0Afunction%20_iterableToArrayLimit(arr%2C%20i)%20%7B%20var%20_i%20%3D%20arr%20%3D%3D%20null%20%3F%20null%20%3A%20typeof%20Symbol%20!%3D%3D%20%22undefined%22%20%26%26%20arr%5BSymbol.iterator%5D%20%7C%7C%20arr%5B%22%40%40iterator%22%5D%3B%20if%20(_i%20%3D%3D%20null)%20return%3B%20var%20_arr%20%3D%20%5B%5D%3B%20var%20_n%20%3D%20true%3B%20var%20_d%20%3D%20false%3B%20var%20_s%2C%20_e%3B%20try%20%7B%20for%20(_i%20%3D%20_i.call(arr)%3B%20!(_n%20%3D%20(_s%20%3D%20_i.next()).done)%3B%20_n%20%3D%20true)%20%7B%20_arr.push(_s.value)%3B%20if%20(i%20%26%26%20_arr.length%20%3D%3D%3D%20i)%20break%3B%20%7D%20%7D%20catch%20(err)%20%7B%20_d%20%3D%20true%3B%20_e%20%3D%20err%3B%20%7D%20finally%20%7B%20try%20%7B%20if%20(!_n%20%26%26%20_i%5B%22return%22%5D%20!%3D%20null)%20_i%5B%22return%22%5D()%3B%20%7D%20finally%20%7B%20if%20(_d)%20throw%20_e%3B%20%7D%20%7D%20return%20_arr%3B%20%7D%0A%0Afunction%20_arrayWithHoles(arr)%20%7B%20if%20(Array.isArray(arr))%20return%20arr%3B%20%7D%0A%0A_RTFN_%20%3D%20function%20_RTFN_(_ref)%20%7B%0A%20%20var%20outputs%20%3D%20_ref.outputs%2C%0A%20%20%20%20%20%20inputs%20%3D%20_ref.inputs%3B%0A%0A%20%20var%20_inputs%20%3D%20_slicedToArray(inputs%2C%201)%2C%0A%20%20%20%20%20%20inputValue0%20%3D%20_inputs%5B0%5D%3B%0A%0A%20%20var%20_outputs%20%3D%20_slicedToArray(outputs%2C%202)%2C%0A%20%20%20%20%20%20output0%20%3D%20_outputs%5B0%5D%2C%0A%20%20%20%20%20%20output1%20%3D%20_outputs%5B1%5D%3B%0A%0A%20%20if%20(inputValue0%5B'showPublishPROD'%5D%20%3D%3D%20true)%20%7B%0A%20%20%20%20output0(1)%3B%0A%20%20%7D%20else%20%7B%0A%20%20%20%20output1(1)%3B%0A%20%20%7D%0A%7D%3B%0A%3B%20return%20_RTFN_%3B%20%7D)()"
              }
            },
            "inputAry": [],
            "outputAry": [
              "output1"
            ],
            "outputEvents": {},
            "style": {
              "display": "block"
            }
          },
          "style": {},
          "configs": [],
          "_inputs": [],
          "inputs": [
            "input.inputValue0"
          ],
          "outputs": [
            "output0",
            "output1"
          ]
        },
        "u_pZ_Z0": {
          "id": "u_pZ_Z0",
          "def": {
            "namespace": "mybricks.basic-comlib._muilt-inputJs",
            "version": "1.0.2",
            "rtType": "js-autorun",
            "materialId": 46406
          },
          "title": "JS计算",
          "model": {
            "data": {
              "fns": {
                "code": "(%7B%20outputs%2C%20inputs%20%7D)%20%3D%3E%20%7B%0A%20%20const%20%5B%20inputValue0%20%5D%20%3D%20inputs%3B%0A%20%20const%20%5B%20output0%2C%20output1%20%5D%20%3D%20outputs%3B%0A%20%20if(inputValue0%5B'showPassPROD'%5D%20%3D%3D%20true)%20%7B%0A%20%20%20%20%20%20output0(1)%3B%0A%20%20%7D%20else%20%7B%0A%20%20%20%20%20%20output1(1)%3B%0A%20%20%7D%0A%7D",
                "transformCode": "(function()%20%7B%20var%20_RTFN_%3B%20%0A%22use%20strict%22%3B%0A%0Afunction%20_slicedToArray(arr%2C%20i)%20%7B%20return%20_arrayWithHoles(arr)%20%7C%7C%20_iterableToArrayLimit(arr%2C%20i)%20%7C%7C%20_unsupportedIterableToArray(arr%2C%20i)%20%7C%7C%20_nonIterableRest()%3B%20%7D%0A%0Afunction%20_nonIterableRest()%20%7B%20throw%20new%20TypeError(%22Invalid%20attempt%20to%20destructure%20non-iterable%20instance.%5CnIn%20order%20to%20be%20iterable%2C%20non-array%20objects%20must%20have%20a%20%5BSymbol.iterator%5D()%20method.%22)%3B%20%7D%0A%0Afunction%20_unsupportedIterableToArray(o%2C%20minLen)%20%7B%20if%20(!o)%20return%3B%20if%20(typeof%20o%20%3D%3D%3D%20%22string%22)%20return%20_arrayLikeToArray(o%2C%20minLen)%3B%20var%20n%20%3D%20Object.prototype.toString.call(o).slice(8%2C%20-1)%3B%20if%20(n%20%3D%3D%3D%20%22Object%22%20%26%26%20o.constructor)%20n%20%3D%20o.constructor.name%3B%20if%20(n%20%3D%3D%3D%20%22Map%22%20%7C%7C%20n%20%3D%3D%3D%20%22Set%22)%20return%20Array.from(o)%3B%20if%20(n%20%3D%3D%3D%20%22Arguments%22%20%7C%7C%20%2F%5E(%3F%3AUi%7CI)nt(%3F%3A8%7C16%7C32)(%3F%3AClamped)%3FArray%24%2F.test(n))%20return%20_arrayLikeToArray(o%2C%20minLen)%3B%20%7D%0A%0Afunction%20_arrayLikeToArray(arr%2C%20len)%20%7B%20if%20(len%20%3D%3D%20null%20%7C%7C%20len%20%3E%20arr.length)%20len%20%3D%20arr.length%3B%20for%20(var%20i%20%3D%200%2C%20arr2%20%3D%20new%20Array(len)%3B%20i%20%3C%20len%3B%20i%2B%2B)%20%7B%20arr2%5Bi%5D%20%3D%20arr%5Bi%5D%3B%20%7D%20return%20arr2%3B%20%7D%0A%0Afunction%20_iterableToArrayLimit(arr%2C%20i)%20%7B%20var%20_i%20%3D%20arr%20%3D%3D%20null%20%3F%20null%20%3A%20typeof%20Symbol%20!%3D%3D%20%22undefined%22%20%26%26%20arr%5BSymbol.iterator%5D%20%7C%7C%20arr%5B%22%40%40iterator%22%5D%3B%20if%20(_i%20%3D%3D%20null)%20return%3B%20var%20_arr%20%3D%20%5B%5D%3B%20var%20_n%20%3D%20true%3B%20var%20_d%20%3D%20false%3B%20var%20_s%2C%20_e%3B%20try%20%7B%20for%20(_i%20%3D%20_i.call(arr)%3B%20!(_n%20%3D%20(_s%20%3D%20_i.next()).done)%3B%20_n%20%3D%20true)%20%7B%20_arr.push(_s.value)%3B%20if%20(i%20%26%26%20_arr.length%20%3D%3D%3D%20i)%20break%3B%20%7D%20%7D%20catch%20(err)%20%7B%20_d%20%3D%20true%3B%20_e%20%3D%20err%3B%20%7D%20finally%20%7B%20try%20%7B%20if%20(!_n%20%26%26%20_i%5B%22return%22%5D%20!%3D%20null)%20_i%5B%22return%22%5D()%3B%20%7D%20finally%20%7B%20if%20(_d)%20throw%20_e%3B%20%7D%20%7D%20return%20_arr%3B%20%7D%0A%0Afunction%20_arrayWithHoles(arr)%20%7B%20if%20(Array.isArray(arr))%20return%20arr%3B%20%7D%0A%0A_RTFN_%20%3D%20function%20_RTFN_(_ref)%20%7B%0A%20%20var%20outputs%20%3D%20_ref.outputs%2C%0A%20%20%20%20%20%20inputs%20%3D%20_ref.inputs%3B%0A%0A%20%20var%20_inputs%20%3D%20_slicedToArray(inputs%2C%201)%2C%0A%20%20%20%20%20%20inputValue0%20%3D%20_inputs%5B0%5D%3B%0A%0A%20%20var%20_outputs%20%3D%20_slicedToArray(outputs%2C%202)%2C%0A%20%20%20%20%20%20output0%20%3D%20_outputs%5B0%5D%2C%0A%20%20%20%20%20%20output1%20%3D%20_outputs%5B1%5D%3B%0A%0A%20%20if%20(inputValue0%5B'showPassPROD'%5D%20%3D%3D%20true)%20%7B%0A%20%20%20%20output0(1)%3B%0A%20%20%7D%20else%20%7B%0A%20%20%20%20output1(1)%3B%0A%20%20%7D%0A%7D%3B%0A%3B%20return%20_RTFN_%3B%20%7D)()"
              }
            },
            "inputAry": [],
            "outputAry": [
              "output1"
            ],
            "outputEvents": {},
            "style": {
              "display": "block"
            }
          },
          "style": {},
          "configs": [],
          "_inputs": [],
          "inputs": [
            "input.inputValue0"
          ],
          "outputs": [
            "output0",
            "output1"
          ]
        },
        "u_bkgWF": {
          "id": "u_bkgWF",
          "def": {
            "namespace": "mybricks.basic-comlib._muilt-inputJs",
            "version": "1.0.2",
            "rtType": "js-autorun",
            "materialId": 46406
          },
          "title": "JS计算6",
          "model": {
            "data": {
              "fns": {
                "code": "(%7B%20outputs%2C%20inputs%20%7D)%20%3D%3E%20%7B%0A%20%20const%20%5BinputValue0%2C%20inputValue1%2C%20inputValue2%2C%20inputValue3%5D%20%3D%20inputs%3B%0A%20%20const%20%5Boutput0%2C%20output1%5D%20%3D%20outputs%3B%0A%20%20if%20(!inputValue3%20%26%26%20inputValue1%20%3E%3D%201%20%26%26%20inputValue1%20%3C%3D%208)%20%7B%0A%20%20%20%20output1('%E8%BE%93%E5%85%A5%E5%86%85%E5%AE%B9%E6%A0%A1%E9%AA%8C%E4%B8%8D%E9%80%9A%E8%BF%87%EF%BC%81')%3B%0A%20%20%20%20return%3B%0A%20%20%7D%0A%20%20output0(%7B%0A%20%20%20%20openConfigId%3A%20inputValue2%5B'openConfigId'%5D%2C%0A%20%20%20%20publishData%3A%20JSON.stringify(inputValue0)%2C%0A%20%20%20%20operateType%3A%20inputValue1%2C%0A%20%20%7D)%3B%0A%7D",
                "transformCode": "(function()%20%7B%20var%20_RTFN_%3B%20%0A%22use%20strict%22%3B%0A%0Afunction%20_slicedToArray(arr%2C%20i)%20%7B%20return%20_arrayWithHoles(arr)%20%7C%7C%20_iterableToArrayLimit(arr%2C%20i)%20%7C%7C%20_unsupportedIterableToArray(arr%2C%20i)%20%7C%7C%20_nonIterableRest()%3B%20%7D%0A%0Afunction%20_nonIterableRest()%20%7B%20throw%20new%20TypeError(%22Invalid%20attempt%20to%20destructure%20non-iterable%20instance.%5CnIn%20order%20to%20be%20iterable%2C%20non-array%20objects%20must%20have%20a%20%5BSymbol.iterator%5D()%20method.%22)%3B%20%7D%0A%0Afunction%20_unsupportedIterableToArray(o%2C%20minLen)%20%7B%20if%20(!o)%20return%3B%20if%20(typeof%20o%20%3D%3D%3D%20%22string%22)%20return%20_arrayLikeToArray(o%2C%20minLen)%3B%20var%20n%20%3D%20Object.prototype.toString.call(o).slice(8%2C%20-1)%3B%20if%20(n%20%3D%3D%3D%20%22Object%22%20%26%26%20o.constructor)%20n%20%3D%20o.constructor.name%3B%20if%20(n%20%3D%3D%3D%20%22Map%22%20%7C%7C%20n%20%3D%3D%3D%20%22Set%22)%20return%20Array.from(o)%3B%20if%20(n%20%3D%3D%3D%20%22Arguments%22%20%7C%7C%20%2F%5E(%3F%3AUi%7CI)nt(%3F%3A8%7C16%7C32)(%3F%3AClamped)%3FArray%24%2F.test(n))%20return%20_arrayLikeToArray(o%2C%20minLen)%3B%20%7D%0A%0Afunction%20_arrayLikeToArray(arr%2C%20len)%20%7B%20if%20(len%20%3D%3D%20null%20%7C%7C%20len%20%3E%20arr.length)%20len%20%3D%20arr.length%3B%20for%20(var%20i%20%3D%200%2C%20arr2%20%3D%20new%20Array(len)%3B%20i%20%3C%20len%3B%20i%2B%2B)%20%7B%20arr2%5Bi%5D%20%3D%20arr%5Bi%5D%3B%20%7D%20return%20arr2%3B%20%7D%0A%0Afunction%20_iterableToArrayLimit(arr%2C%20i)%20%7B%20var%20_i%20%3D%20arr%20%3D%3D%20null%20%3F%20null%20%3A%20typeof%20Symbol%20!%3D%3D%20%22undefined%22%20%26%26%20arr%5BSymbol.iterator%5D%20%7C%7C%20arr%5B%22%40%40iterator%22%5D%3B%20if%20(_i%20%3D%3D%20null)%20return%3B%20var%20_arr%20%3D%20%5B%5D%3B%20var%20_n%20%3D%20true%3B%20var%20_d%20%3D%20false%3B%20var%20_s%2C%20_e%3B%20try%20%7B%20for%20(_i%20%3D%20_i.call(arr)%3B%20!(_n%20%3D%20(_s%20%3D%20_i.next()).done)%3B%20_n%20%3D%20true)%20%7B%20_arr.push(_s.value)%3B%20if%20(i%20%26%26%20_arr.length%20%3D%3D%3D%20i)%20break%3B%20%7D%20%7D%20catch%20(err)%20%7B%20_d%20%3D%20true%3B%20_e%20%3D%20err%3B%20%7D%20finally%20%7B%20try%20%7B%20if%20(!_n%20%26%26%20_i%5B%22return%22%5D%20!%3D%20null)%20_i%5B%22return%22%5D()%3B%20%7D%20finally%20%7B%20if%20(_d)%20throw%20_e%3B%20%7D%20%7D%20return%20_arr%3B%20%7D%0A%0Afunction%20_arrayWithHoles(arr)%20%7B%20if%20(Array.isArray(arr))%20return%20arr%3B%20%7D%0A%0A_RTFN_%20%3D%20function%20_RTFN_(_ref)%20%7B%0A%20%20var%20outputs%20%3D%20_ref.outputs%2C%0A%20%20%20%20%20%20inputs%20%3D%20_ref.inputs%3B%0A%0A%20%20var%20_inputs%20%3D%20_slicedToArray(inputs%2C%204)%2C%0A%20%20%20%20%20%20inputValue0%20%3D%20_inputs%5B0%5D%2C%0A%20%20%20%20%20%20inputValue1%20%3D%20_inputs%5B1%5D%2C%0A%20%20%20%20%20%20inputValue2%20%3D%20_inputs%5B2%5D%2C%0A%20%20%20%20%20%20inputValue3%20%3D%20_inputs%5B3%5D%3B%0A%0A%20%20var%20_outputs%20%3D%20_slicedToArray(outputs%2C%202)%2C%0A%20%20%20%20%20%20output0%20%3D%20_outputs%5B0%5D%2C%0A%20%20%20%20%20%20output1%20%3D%20_outputs%5B1%5D%3B%0A%0A%20%20if%20(!inputValue3%20%26%26%20inputValue1%20%3E%3D%201%20%26%26%20inputValue1%20%3C%3D%208)%20%7B%0A%20%20%20%20output1('%E8%BE%93%E5%85%A5%E5%86%85%E5%AE%B9%E6%A0%A1%E9%AA%8C%E4%B8%8D%E9%80%9A%E8%BF%87%EF%BC%81')%3B%0A%20%20%20%20return%3B%0A%20%20%7D%0A%0A%20%20output0(%7B%0A%20%20%20%20openConfigId%3A%20inputValue2%5B'openConfigId'%5D%2C%0A%20%20%20%20publishData%3A%20JSON.stringify(inputValue0)%2C%0A%20%20%20%20operateType%3A%20inputValue1%0A%20%20%7D)%3B%0A%7D%3B%0A%3B%20return%20_RTFN_%3B%20%7D)()"
              }
            },
            "inputAry": [
              {
                "hostId": "input.inputValue1",
                "title": "参数1",
                "schema": {
                  "type": "follow"
                }
              },
              {
                "hostId": "input.inputValue2",
                "title": "参数2",
                "schema": {
                  "type": "follow"
                }
              },
              {
                "hostId": "input.inputValue3",
                "title": "参数3",
                "schema": {
                  "type": "follow"
                }
              }
            ],
            "outputAry": [
              "output1"
            ],
            "outputEvents": {},
            "style": {
              "display": "block"
            }
          },
          "style": {},
          "configs": [],
          "_inputs": [],
          "inputs": [
            "input.inputValue0",
            "input.inputValue1",
            "input.inputValue2",
            "input.inputValue3"
          ],
          "outputs": [
            "output0",
            "output1"
          ]
        },
        "u_p2Yel": {
          "id": "u_p2Yel",
          "def": {
            "namespace": "mybricks.normal-pc.service",
            "version": "1.0.8",
            "rtType": "js-autorun",
            "materialId": 38932
          },
          "title": "服务接口",
          "model": {
            "data": {
              "connectorConfig": {},
              "useExternalUrl": false,
              "connector": {
                "id": "u_ennask",
                "title": "查询发布单详情",
                "type": "http",
                "script": "function%20(e%2C%20%7B%0A%20%20%20%20%20%20%20%20%20%20%20%20then%3A%20t%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20onError%3A%20n%0A%20%20%20%20%20%20%20%20%20%20%7D%2C%20r)%20%7B%0A%20%20%20%20%20%20%20%20%20%20%20%20return%20function%20(e%2C%20r)%20%7B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20const%20o%20%3D%20%22GET%22%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20i%20%3D%20%5B%5D%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20a%20%3D%20%5B%5D%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20c%20%3D%20undefined%3B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20try%20%7B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20const%20l%20%3D%20%22%2Fgateway%2Fmarketing%2Ftools%2Fselfconfig%2Fpublish%2Fdetail%22%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20s%20%3D%20function%20_RT_(%7B%20params%2C%20data%2C%20headers%2C%20url%2C%20method%20%7D)%20%7B%0A%20%20%2F%2F%20%E8%AE%BE%E7%BD%AE%E8%AF%B7%E6%B1%82query%E3%80%81%E8%AF%B7%E6%B1%82%E4%BD%93%E3%80%81%E8%AF%B7%E6%B1%82%E5%A4%B4%0A%20%20return%20%7B%20params%2C%20data%2C%20headers%2C%20url%2C%20method%20%7D%3B%0A%20%7D%0A(o.startsWith(%22GET%22)%20%3F%20%7B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20params%3A%20e%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20url%3A%20l%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20method%3A%20o%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%7D%20%3A%20%7B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20data%3A%20e%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20url%3A%20l%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20method%3A%20o%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%7D)%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20u%20%3D%20true%3B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20s.url%20%3D%20s.url%20%7C%7C%20l%2C%20s.method%20%3D%20s.method%20%7C%7C%20o%3B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20const%20d%20%3D%20function%20_RT_(%7B%20params%2C%20data%2C%20headers%2C%20url%2C%20method%20%7D)%20%7B%0A%20%20%2F%2F%20%E8%AE%BE%E7%BD%AE%E8%AF%B7%E6%B1%82query%E3%80%81%E8%AF%B7%E6%B1%82%E4%BD%93%E3%80%81%E8%AF%B7%E6%B1%82%E5%A4%B4%0A%20%20return%20%7B%20params%2C%20data%2C%20headers%2C%20url%2C%20method%20%7D%3B%0A%20%7D%0A(s)%3B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20d.url%20%3D%20(d.url%20%7C%7C%20l).replace(%2F%7B(%5Cw%2B)%7D%2Fg%2C%20(t%2C%20n)%20%3D%3E%20%7B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20const%20r%20%3D%20e%5Bn%5D%20%7C%7C%20%22%22%3B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20return%20Reflect.deleteProperty(d.params%20%7C%7C%20%7B%7D%2C%20n)%2C%20r%3B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%7D)%2C%20d.method%20%3D%20d.method%20%7C%7C%20o%2C%20r.ajax(d).then(e%20%3D%3E%20u%20%3F%20function%20_RT_(%7B%20response%2C%20config%20%7D)%20%7B%0A%20%20%2F%2F%20if%20(response.data.code%20!%3D%3D%200)%20%7B%0A%20%20%2F%2F%20%20%20throw%20new%20Error(response.data.errMsg)%0A%20%20%2F%2F%20%7D%0A%20%20return%20response.data%0A%7D%0A(%7B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20response%3A%20e%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20config%3A%20d%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%7D%2C%20%7B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20throwStatusCodeError%3A%20e%20%3D%3E%20%7B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20n(e)%3B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%7D%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%7D)%20%3A%20e).then(e%20%3D%3E%20function%20_RT_(result%2C%20%7B%20method%2C%20url%2C%20params%2C%20data%2C%20headers%20%7D)%20%7B%0A%20%20%2F%2F%20return%20%7B%0A%20%20%2F%2F%20%20total%3A%20result.all%2C%0A%20%20%2F%2F%20%20dataSource%3A%20result.list.map(%7Bid%2C%20name%7D%20%3D%3E%20(%7B%0A%20%20%2F%2F%20%20%20%20%20value%3Aid%2C%20label%3A%20name%0A%20%20%2F%2F%20%20%7D))%0A%20%20%2F%2F%20%7D%0A%20%20return%20result%3B%0A%7D%0A(e%2C%20Object.assign(%7B%7D%2C%20d)%2C%20%7B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20throwStatusCodeError%3A%20e%20%3D%3E%20%7B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20n(e)%3B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%7D%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%7D)).then(e%20%3D%3E%20c%20%3F%20t(e)%20%3A%20(0%20%3D%3D%3D%20a.length%20%7C%7C%20a.forEach(t%20%3D%3E%20%7B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20const%20n%20%3D%20t.split(%22.%22)%3B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20!function%20(e%2C%20t)%20%7B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20const%20n%20%3D%20t.length%3B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20!function%20e(r%2C%20o)%20%7B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20if%20(!r%20%7C%7C%20o%20%3D%3D%3D%20n)%20return%3B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20const%20i%20%3D%20t%5Bo%5D%3B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20o%20%3D%3D%3D%20n%20-%201%20%26%26%20Reflect.deleteProperty(r%2C%20i)%2C%20Array.isArray(r)%20%3F%20r.forEach(t%20%3D%3E%20%7B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20e(t%2C%20o)%3B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%7D)%20%3A%20e(r%5Bi%5D%2C%20o%20%2B%201)%3B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%7D(e%2C%200)%3B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%7D(e%2C%20n)%3B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%7D)%2C%20e)).then(e%20%3D%3E%20%7B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20let%20n%20%3D%20Array.isArray(e)%20%3F%20%5B%5D%20%3A%20%7B%7D%3B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20if%20(void%200%20%3D%3D%3D%20i%20%7C%7C%200%20%3D%3D%3D%20i.length)%20n%20%3D%20e%3Belse%20if%20(i.forEach(t%20%3D%3E%20%7B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20!function%20(e%2C%20t%2C%20n)%20%7B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20const%20r%20%3D%20t.length%3B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20!function%20e(n%2C%20o%2C%20i)%20%7B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20if%20(!n%20%7C%7C%20o%20%3D%3D%3D%20r)%20return%20n%3B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20const%20a%20%3D%20t%5Bo%5D%3B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20return%20Array.isArray(n)%20%3F%20n.map((t%2C%20n)%20%3D%3E%20%7B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20const%20r%20%3D%20i%5Bn%5D%3B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20let%20a%3B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20return%20void%200%20%3D%3D%3D%20r%20%3F%20(a%20%3D%20%7B%7D%2C%20i.push(a))%20%3A%20a%20%3D%20r%2C%20e(t%2C%20o%2C%20a)%3B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%7D)%20%3A%20o%20%3D%3D%3D%20r%20-%201%20%3F%20(i%5Ba%5D%20%3D%20n%5Ba%5D%2C%20n%5Ba%5D)%20%3A%20(n%20%3D%20n%5Ba%5D%2C%20Array.isArray(n)%20%3F%20i%5Ba%5D%20%3D%20i%5Ba%5D%20%7C%7C%20%5B%5D%20%3A%20i%5Ba%5D%20%3D%20i%5Ba%5D%20%7C%7C%20%7B%7D%2C%20e(n%2C%20o%20%2B%201%2C%20Array.isArray(i)%20%3F%20i%20%3A%20i%5Ba%5D))%3B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%7D(e%2C%200%2C%20n)%3B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%7D(e%2C%20t.split(%22.%22)%2C%20n)%3B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%7D)%2C%20Array.isArray(i)%20%26%26%20i.length%20%26%26%20(i.length%20%3E%201%20%7C%7C%201%20!%3D%3D%20i.length%20%7C%7C%20%22%22%20!%3D%3D%20i%5B0%5D))%20try%20%7B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20let%20e%20%3D%20i.map(e%20%3D%3E%20e.split(%22.%22))%3B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20for%20(%3B%20%22%5Bobject%20Object%5D%22%20%3D%3D%3D%20Object.prototype.toString.call(n)%20%26%26%20e.every(e%20%3D%3E%20!!e.length)%20%26%26%201%20%3D%3D%3D%20Object.values(n).length%3B)%20n%20%3D%20Object.values(n)%5B0%5D%2C%20e.forEach(e%20%3D%3E%20e.shift())%3B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%7D%20catch%20(e)%20%7B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20console.log(%22connector%20format%20data%20error%22%2C%20e)%3B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%7D%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%22POST%22%20%3D%3D%3D%20d.method.toUpperCase()%20%26%26%20d.url.endsWith(%22%2Fdomain%2Frun%22)%20%26%26%20d.data%20%26%26%20d.data.fileId%20%26%26%20d.data.serviceId%20%26%26%20d.data.params%20%26%26%20d.data.params.showToplLog%20%3F%20t(%7B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20__ORIGIN_RESPONSE__%3A%20e%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20outputData%3A%20n%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%7D)%20%3A%20t(n)%3B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%7D).catch(e%20%3D%3E%20%7B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20n(e%20%26%26%20e.message%20%7C%7C%20e)%3B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%7D)%3B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%7D%20catch%20(e)%20%7B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20return%20n(e)%3B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%7D%0A%20%20%20%20%20%20%20%20%20%20%20%20%7D(e%2C%20r)%3B%0A%20%20%20%20%20%20%20%20%20%20%7D",
                "inputSchema": {
                  "type": "object",
                  "properties": {
                    "env": {
                      "type": "string"
                    },
                    "openConfigId": {
                      "type": "number"
                    }
                  }
                },
                "outputSchema": {
                  "type": "object",
                  "properties": {
                    "result": {
                      "type": "number"
                    },
                    "error_msg": {
                      "type": "string"
                    },
                    "data": {
                      "type": "object",
                      "properties": {
                        "id": {
                          "type": "string"
                        },
                        "formContent": {
                          "type": "string"
                        },
                        "approveInfo": {
                          "type": "object",
                          "properties": {
                            "approveLink": {
                              "type": "string"
                            },
                            "approveStatus": {
                              "type": "number"
                            },
                            "approveStatusDesc": {
                              "type": "string"
                            },
                            "approveRemark": {
                              "type": "string"
                            },
                            "approver": {
                              "type": "string"
                            },
                            "nextApprover": {
                              "type": "string"
                            }
                          }
                        },
                        "publisherName": {
                          "type": "string"
                        },
                        "step": {
                          "type": "number"
                        },
                        "operateOptions": {
                          "type": "string"
                        },
                        "status": {
                          "type": "number"
                        },
                        "statusDesc": {
                          "type": "string"
                        },
                        "pictureUrl": {
                          "type": "string"
                        },
                        "showStaging": {
                          "type": "boolean"
                        }
                      }
                    },
                    "requestId": {
                      "type": "string"
                    },
                    "debugInfo": {
                      "type": "string"
                    }
                  }
                }
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
            "call"
          ],
          "outputs": [
            "then",
            "catch"
          ]
        },
        "u_mJ9wi": {
          "id": "u_mJ9wi",
          "def": {
            "namespace": "mybricks.normal-pc.query",
            "version": "1.0.6",
            "rtType": "js-autorun",
            "materialId": 36498
          },
          "title": "路由参数",
          "model": {
            "data": {
              "runImmediate": false
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
            "getQuery"
          ],
          "outputs": [
            "queryData"
          ]
        },
        "u_ODJQ5": {
          "id": "u_ODJQ5",
          "def": {
            "namespace": "mybricks.normal-pc.service",
            "version": "1.0.8",
            "rtType": "js-autorun",
            "materialId": 38932
          },
          "title": "服务接口2",
          "model": {
            "data": {
              "connectorConfig": {},
              "connector": {
                "id": "u_kkaexs",
                "title": "更新发布单",
                "type": "http",
                "inputSchema": {
                  "type": "object",
                  "properties": {
                    "openConfigId": {
                      "type": "number"
                    },
                    "publishData": {
                      "type": "string"
                    },
                    "operateType": {
                      "type": "number"
                    }
                  }
                },
                "outputSchema": {
                  "type": "object",
                  "properties": {
                    "result": {
                      "type": "number"
                    },
                    "debug_info": {
                      "type": "string"
                    },
                    "error_msg": {
                      "type": "string"
                    },
                    "requestId": {
                      "type": "string"
                    }
                  }
                },
                "script": "function%20(e%2C%20%7B%0A%20%20%20%20%20%20%20%20%20%20%20%20then%3A%20t%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20onError%3A%20n%0A%20%20%20%20%20%20%20%20%20%20%7D%2C%20r)%20%7B%0A%20%20%20%20%20%20%20%20%20%20%20%20return%20function%20(e%2C%20r)%20%7B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20const%20o%20%3D%20%22POST%22%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20i%20%3D%20%5B%5D%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20a%20%3D%20%5B%5D%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20c%20%3D%20undefined%3B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20try%20%7B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20const%20l%20%3D%20%22%2Fgateway%2Fmarketing%2Ftools%2Fselfconfig%2Fpublish%2Fupdate%22%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20s%20%3D%20function%20_RT_(%7B%20params%2C%20data%2C%20headers%2C%20url%2C%20method%20%7D)%20%7B%0A%20%20%2F%2F%20%E8%AE%BE%E7%BD%AE%E8%AF%B7%E6%B1%82query%E3%80%81%E8%AF%B7%E6%B1%82%E4%BD%93%E3%80%81%E8%AF%B7%E6%B1%82%E5%A4%B4%0A%20%20return%20%7B%20params%2C%20data%2C%20headers%2C%20url%2C%20method%20%7D%3B%0A%20%7D%0A(o.startsWith(%22GET%22)%20%3F%20%7B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20params%3A%20e%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20url%3A%20l%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20method%3A%20o%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%7D%20%3A%20%7B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20data%3A%20e%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20url%3A%20l%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20method%3A%20o%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%7D)%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20u%20%3D%20true%3B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20s.url%20%3D%20s.url%20%7C%7C%20l%2C%20s.method%20%3D%20s.method%20%7C%7C%20o%3B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20const%20d%20%3D%20function%20_RT_(%7B%20params%2C%20data%2C%20headers%2C%20url%2C%20method%20%7D)%20%7B%0A%20%20%2F%2F%20%E8%AE%BE%E7%BD%AE%E8%AF%B7%E6%B1%82query%E3%80%81%E8%AF%B7%E6%B1%82%E4%BD%93%E3%80%81%E8%AF%B7%E6%B1%82%E5%A4%B4%0A%20%20return%20%7B%20params%2C%20data%2C%20headers%2C%20url%2C%20method%20%7D%3B%0A%20%7D%0A(s)%3B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20d.url%20%3D%20(d.url%20%7C%7C%20l).replace(%2F%7B(%5Cw%2B)%7D%2Fg%2C%20(t%2C%20n)%20%3D%3E%20%7B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20const%20r%20%3D%20e%5Bn%5D%20%7C%7C%20%22%22%3B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20return%20Reflect.deleteProperty(d.params%20%7C%7C%20%7B%7D%2C%20n)%2C%20r%3B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%7D)%2C%20d.method%20%3D%20d.method%20%7C%7C%20o%2C%20r.ajax(d).then(e%20%3D%3E%20u%20%3F%20function%20_RT_(%7B%20response%2C%20config%20%7D)%20%7B%0A%20%20%2F%2F%20if%20(response.data.code%20!%3D%3D%200)%20%7B%0A%20%20%2F%2F%20%20%20throw%20new%20Error(response.data.errMsg)%0A%20%20%2F%2F%20%7D%0A%20%20return%20response.data%0A%7D%0A(%7B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20response%3A%20e%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20config%3A%20d%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%7D%2C%20%7B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20throwStatusCodeError%3A%20e%20%3D%3E%20%7B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20n(e)%3B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%7D%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%7D)%20%3A%20e).then(e%20%3D%3E%20function%20_RT_(result%2C%20%7B%20method%2C%20url%2C%20params%2C%20data%2C%20headers%20%7D)%20%7B%0A%20%20%2F%2F%20return%20%7B%0A%20%20%2F%2F%20%20total%3A%20result.all%2C%0A%20%20%2F%2F%20%20dataSource%3A%20result.list.map(%7Bid%2C%20name%7D%20%3D%3E%20(%7B%0A%20%20%2F%2F%20%20%20%20%20value%3Aid%2C%20label%3A%20name%0A%20%20%2F%2F%20%20%7D))%0A%20%20%2F%2F%20%7D%0A%20%20return%20result%3B%0A%7D%0A(e%2C%20Object.assign(%7B%7D%2C%20d)%2C%20%7B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20throwStatusCodeError%3A%20e%20%3D%3E%20%7B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20n(e)%3B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%7D%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%7D)).then(e%20%3D%3E%20c%20%3F%20t(e)%20%3A%20(0%20%3D%3D%3D%20a.length%20%7C%7C%20a.forEach(t%20%3D%3E%20%7B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20const%20n%20%3D%20t.split(%22.%22)%3B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20!function%20(e%2C%20t)%20%7B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20const%20n%20%3D%20t.length%3B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20!function%20e(r%2C%20o)%20%7B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20if%20(!r%20%7C%7C%20o%20%3D%3D%3D%20n)%20return%3B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20const%20i%20%3D%20t%5Bo%5D%3B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20o%20%3D%3D%3D%20n%20-%201%20%26%26%20Reflect.deleteProperty(r%2C%20i)%2C%20Array.isArray(r)%20%3F%20r.forEach(t%20%3D%3E%20%7B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20e(t%2C%20o)%3B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%7D)%20%3A%20e(r%5Bi%5D%2C%20o%20%2B%201)%3B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%7D(e%2C%200)%3B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%7D(e%2C%20n)%3B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%7D)%2C%20e)).then(e%20%3D%3E%20%7B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20let%20n%20%3D%20Array.isArray(e)%20%3F%20%5B%5D%20%3A%20%7B%7D%3B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20if%20(void%200%20%3D%3D%3D%20i%20%7C%7C%200%20%3D%3D%3D%20i.length)%20n%20%3D%20e%3Belse%20if%20(i.forEach(t%20%3D%3E%20%7B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20!function%20(e%2C%20t%2C%20n)%20%7B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20const%20r%20%3D%20t.length%3B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20!function%20e(n%2C%20o%2C%20i)%20%7B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20if%20(!n%20%7C%7C%20o%20%3D%3D%3D%20r)%20return%20n%3B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20const%20a%20%3D%20t%5Bo%5D%3B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20return%20Array.isArray(n)%20%3F%20n.map((t%2C%20n)%20%3D%3E%20%7B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20const%20r%20%3D%20i%5Bn%5D%3B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20let%20a%3B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20return%20void%200%20%3D%3D%3D%20r%20%3F%20(a%20%3D%20%7B%7D%2C%20i.push(a))%20%3A%20a%20%3D%20r%2C%20e(t%2C%20o%2C%20a)%3B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%7D)%20%3A%20o%20%3D%3D%3D%20r%20-%201%20%3F%20(i%5Ba%5D%20%3D%20n%5Ba%5D%2C%20n%5Ba%5D)%20%3A%20(n%20%3D%20n%5Ba%5D%2C%20Array.isArray(n)%20%3F%20i%5Ba%5D%20%3D%20i%5Ba%5D%20%7C%7C%20%5B%5D%20%3A%20i%5Ba%5D%20%3D%20i%5Ba%5D%20%7C%7C%20%7B%7D%2C%20e(n%2C%20o%20%2B%201%2C%20Array.isArray(i)%20%3F%20i%20%3A%20i%5Ba%5D))%3B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%7D(e%2C%200%2C%20n)%3B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%7D(e%2C%20t.split(%22.%22)%2C%20n)%3B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%7D)%2C%20Array.isArray(i)%20%26%26%20i.length%20%26%26%20(i.length%20%3E%201%20%7C%7C%201%20!%3D%3D%20i.length%20%7C%7C%20%22%22%20!%3D%3D%20i%5B0%5D))%20try%20%7B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20let%20e%20%3D%20i.map(e%20%3D%3E%20e.split(%22.%22))%3B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20for%20(%3B%20%22%5Bobject%20Object%5D%22%20%3D%3D%3D%20Object.prototype.toString.call(n)%20%26%26%20e.every(e%20%3D%3E%20!!e.length)%20%26%26%201%20%3D%3D%3D%20Object.values(n).length%3B)%20n%20%3D%20Object.values(n)%5B0%5D%2C%20e.forEach(e%20%3D%3E%20e.shift())%3B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%7D%20catch%20(e)%20%7B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20console.log(%22connector%20format%20data%20error%22%2C%20e)%3B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%7D%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%22POST%22%20%3D%3D%3D%20d.method.toUpperCase()%20%26%26%20d.url.endsWith(%22%2Fdomain%2Frun%22)%20%26%26%20d.data%20%26%26%20d.data.fileId%20%26%26%20d.data.serviceId%20%26%26%20d.data.params%20%26%26%20d.data.params.showToplLog%20%3F%20t(%7B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20__ORIGIN_RESPONSE__%3A%20e%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20outputData%3A%20n%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%7D)%20%3A%20t(n)%3B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%7D).catch(e%20%3D%3E%20%7B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20n(e%20%26%26%20e.message%20%7C%7C%20e)%3B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%7D)%3B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%7D%20catch%20(e)%20%7B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20return%20n(e)%3B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%7D%0A%20%20%20%20%20%20%20%20%20%20%20%20%7D(e%2C%20r)%3B%0A%20%20%20%20%20%20%20%20%20%20%7D",
                "createTime": 1690867673324,
                "lastModifiedTime": 1690867875398
              },
              "useExternalUrl": false
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
            "call"
          ],
          "outputs": [
            "then",
            "catch"
          ]
        },
        "u_1HpqI": {
          "id": "u_1HpqI",
          "def": {
            "namespace": "mybricks.basic-comlib._muilt-inputJs",
            "version": "1.0.2",
            "rtType": "js-autorun",
            "materialId": 46406
          },
          "title": "JS计算7",
          "model": {
            "data": {
              "fns": {
                "code": "(%7B%20outputs%2C%20inputs%20%7D)%20%3D%3E%20%7B%0A%20%20const%20%5BinputValue0%5D%20%3D%20inputs%3B%0A%20%20const%20%5Boutput0%2C%20output1%2C%20output2%5D%20%3D%20outputs%3B%0A%20%20if%20(inputValue0.result%20%3D%3D%201)%20%7B%0A%20%20%20%20output0(1)%3B%0A%20%20%20%20output2(inputValue0)%3B%0A%20%20%7D%20else%20%7B%0A%20%20%20%20output1(inputValue0.error_msg)%3B%0A%20%20%7D%0A%7D",
                "transformCode": "(function()%20%7B%20var%20_RTFN_%3B%20%0A%22use%20strict%22%3B%0A%0Afunction%20_slicedToArray(arr%2C%20i)%20%7B%20return%20_arrayWithHoles(arr)%20%7C%7C%20_iterableToArrayLimit(arr%2C%20i)%20%7C%7C%20_unsupportedIterableToArray(arr%2C%20i)%20%7C%7C%20_nonIterableRest()%3B%20%7D%0A%0Afunction%20_nonIterableRest()%20%7B%20throw%20new%20TypeError(%22Invalid%20attempt%20to%20destructure%20non-iterable%20instance.%5CnIn%20order%20to%20be%20iterable%2C%20non-array%20objects%20must%20have%20a%20%5BSymbol.iterator%5D()%20method.%22)%3B%20%7D%0A%0Afunction%20_unsupportedIterableToArray(o%2C%20minLen)%20%7B%20if%20(!o)%20return%3B%20if%20(typeof%20o%20%3D%3D%3D%20%22string%22)%20return%20_arrayLikeToArray(o%2C%20minLen)%3B%20var%20n%20%3D%20Object.prototype.toString.call(o).slice(8%2C%20-1)%3B%20if%20(n%20%3D%3D%3D%20%22Object%22%20%26%26%20o.constructor)%20n%20%3D%20o.constructor.name%3B%20if%20(n%20%3D%3D%3D%20%22Map%22%20%7C%7C%20n%20%3D%3D%3D%20%22Set%22)%20return%20Array.from(o)%3B%20if%20(n%20%3D%3D%3D%20%22Arguments%22%20%7C%7C%20%2F%5E(%3F%3AUi%7CI)nt(%3F%3A8%7C16%7C32)(%3F%3AClamped)%3FArray%24%2F.test(n))%20return%20_arrayLikeToArray(o%2C%20minLen)%3B%20%7D%0A%0Afunction%20_arrayLikeToArray(arr%2C%20len)%20%7B%20if%20(len%20%3D%3D%20null%20%7C%7C%20len%20%3E%20arr.length)%20len%20%3D%20arr.length%3B%20for%20(var%20i%20%3D%200%2C%20arr2%20%3D%20new%20Array(len)%3B%20i%20%3C%20len%3B%20i%2B%2B)%20%7B%20arr2%5Bi%5D%20%3D%20arr%5Bi%5D%3B%20%7D%20return%20arr2%3B%20%7D%0A%0Afunction%20_iterableToArrayLimit(arr%2C%20i)%20%7B%20var%20_i%20%3D%20arr%20%3D%3D%20null%20%3F%20null%20%3A%20typeof%20Symbol%20!%3D%3D%20%22undefined%22%20%26%26%20arr%5BSymbol.iterator%5D%20%7C%7C%20arr%5B%22%40%40iterator%22%5D%3B%20if%20(_i%20%3D%3D%20null)%20return%3B%20var%20_arr%20%3D%20%5B%5D%3B%20var%20_n%20%3D%20true%3B%20var%20_d%20%3D%20false%3B%20var%20_s%2C%20_e%3B%20try%20%7B%20for%20(_i%20%3D%20_i.call(arr)%3B%20!(_n%20%3D%20(_s%20%3D%20_i.next()).done)%3B%20_n%20%3D%20true)%20%7B%20_arr.push(_s.value)%3B%20if%20(i%20%26%26%20_arr.length%20%3D%3D%3D%20i)%20break%3B%20%7D%20%7D%20catch%20(err)%20%7B%20_d%20%3D%20true%3B%20_e%20%3D%20err%3B%20%7D%20finally%20%7B%20try%20%7B%20if%20(!_n%20%26%26%20_i%5B%22return%22%5D%20!%3D%20null)%20_i%5B%22return%22%5D()%3B%20%7D%20finally%20%7B%20if%20(_d)%20throw%20_e%3B%20%7D%20%7D%20return%20_arr%3B%20%7D%0A%0Afunction%20_arrayWithHoles(arr)%20%7B%20if%20(Array.isArray(arr))%20return%20arr%3B%20%7D%0A%0A_RTFN_%20%3D%20function%20_RTFN_(_ref)%20%7B%0A%20%20var%20outputs%20%3D%20_ref.outputs%2C%0A%20%20%20%20%20%20inputs%20%3D%20_ref.inputs%3B%0A%0A%20%20var%20_inputs%20%3D%20_slicedToArray(inputs%2C%201)%2C%0A%20%20%20%20%20%20inputValue0%20%3D%20_inputs%5B0%5D%3B%0A%0A%20%20var%20_outputs%20%3D%20_slicedToArray(outputs%2C%203)%2C%0A%20%20%20%20%20%20output0%20%3D%20_outputs%5B0%5D%2C%0A%20%20%20%20%20%20output1%20%3D%20_outputs%5B1%5D%2C%0A%20%20%20%20%20%20output2%20%3D%20_outputs%5B2%5D%3B%0A%0A%20%20if%20(inputValue0.result%20%3D%3D%201)%20%7B%0A%20%20%20%20output0(1)%3B%0A%20%20%20%20output2(inputValue0)%3B%0A%20%20%7D%20else%20%7B%0A%20%20%20%20output1(inputValue0.error_msg)%3B%0A%20%20%7D%0A%7D%3B%0A%3B%20return%20_RTFN_%3B%20%7D)()"
              }
            },
            "inputAry": [],
            "outputAry": [
              "output1",
              "output2"
            ],
            "outputEvents": {},
            "style": {
              "display": "block"
            }
          },
          "style": {},
          "configs": [],
          "_inputs": [],
          "inputs": [
            "input.inputValue0"
          ],
          "outputs": [
            "output0",
            "output1",
            "output2"
          ]
        },
        "u_dCsjp": {
          "id": "u_dCsjp",
          "def": {
            "namespace": "mybricks.normal-pc.message",
            "version": "1.0.4",
            "rtType": "js",
            "materialId": 44978
          },
          "title": "操作失败消息提示",
          "model": {
            "data": {
              "title": "提示名称",
              "content": "弹出提示",
              "duration": 3,
              "type": "error",
              "isExternal": true,
              "isEnd": false
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
          "outputs": []
        },
        "u_hikTC": {
          "id": "u_hikTC",
          "def": {
            "namespace": "mybricks.normal-pc.message",
            "version": "1.0.4",
            "rtType": "js",
            "materialId": 44978
          },
          "title": "消息提示1",
          "model": {
            "data": {
              "title": "提示名称",
              "content": "操作失败",
              "duration": 3,
              "type": "error",
              "isExternal": true,
              "isEnd": false
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
          "outputs": []
        },
        "u_49N_u": {
          "id": "u_49N_u",
          "def": {
            "namespace": "mybricks.normal-pc.message",
            "version": "1.0.4",
            "rtType": "js",
            "materialId": 44978
          },
          "title": "消息提示2",
          "model": {
            "data": {
              "title": "提示名称",
              "content": "弹出提示",
              "duration": 3,
              "type": "error",
              "isExternal": true,
              "isEnd": false
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
          "outputs": []
        },
        "u_1SJCN": {
          "id": "u_1SJCN",
          "def": {
            "namespace": "mybricks.normal-pc.message",
            "version": "1.0.4",
            "rtType": "js",
            "materialId": 44978
          },
          "title": "消息提示3",
          "model": {
            "data": {
              "title": "提示名称",
              "content": "弹出提示",
              "duration": 3,
              "type": "error",
              "isExternal": true,
              "isEnd": false
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
          "outputs": []
        },
        "u_kim6d": {
          "id": "u_kim6d",
          "def": {
            "namespace": "mybricks.core-comlib.var",
            "version": "1.0.0",
            "rtType": "js"
          },
          "title": "路由参数",
          "model": {
            "data": {},
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
            "get",
            "set",
            "reset"
          ],
          "outputs": [
            "return",
            "changed"
          ]
        },
        "u_d4CXk": {
          "id": "u_d4CXk",
          "def": {
            "namespace": "mybricks.normal-pc.message",
            "version": "1.0.4",
            "rtType": "js",
            "materialId": 44978
          },
          "title": "操作成功消息提示",
          "model": {
            "data": {
              "title": "提示名称",
              "content": "操作成功",
              "duration": 3,
              "type": "success",
              "isExternal": false,
              "isEnd": false
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
          "outputs": []
        },
        "u_ZttzW": {
          "id": "u_ZttzW",
          "def": {
            "namespace": "mybricks.core-comlib.var",
            "version": "1.0.0",
            "rtType": "js"
          },
          "title": "执行操作",
          "model": {
            "data": {},
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
            "get",
            "set",
            "reset"
          ],
          "outputs": [
            "return",
            "changed"
          ]
        },
        "u_2gccB": {
          "id": "u_2gccB",
          "def": {
            "namespace": "mybricks.core-comlib.var",
            "version": "1.0.0",
            "rtType": "js"
          },
          "title": "发布单页面数据",
          "model": {
            "data": {},
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
            "get",
            "set",
            "reset"
          ],
          "outputs": [
            "return",
            "changed"
          ]
        },
        "u_oW5Hr": {
          "id": "u_oW5Hr",
          "def": {
            "namespace": "mybricks.basic-comlib._muilt-inputJs",
            "version": "1.0.2",
            "rtType": "js-autorun",
            "materialId": 46406
          },
          "title": "JS计算8",
          "model": {
            "data": {
              "fns": {
                "code": "(%7B%20outputs%2C%20inputs%20%7D)%20%3D%3E%20%7B%0A%20%20const%20%5B%20inputValue0%20%5D%20%3D%20inputs%3B%0A%20%20const%20%5B%20output0%2C%20output1%20%5D%20%3D%20outputs%3B%0A%20%20if(inputValue0%5B'showTerminate'%5D%20%3D%3D%20true)%20%7B%0A%20%20%20%20%20%20output0(1)%3B%0A%20%20%7D%20else%20%7B%0A%20%20%20%20%20%20output1(1)%3B%0A%20%20%7D%0A%7D",
                "transformCode": "(function()%20%7B%20var%20_RTFN_%3B%20%0A%22use%20strict%22%3B%0A%0Afunction%20_slicedToArray(arr%2C%20i)%20%7B%20return%20_arrayWithHoles(arr)%20%7C%7C%20_iterableToArrayLimit(arr%2C%20i)%20%7C%7C%20_unsupportedIterableToArray(arr%2C%20i)%20%7C%7C%20_nonIterableRest()%3B%20%7D%0A%0Afunction%20_nonIterableRest()%20%7B%20throw%20new%20TypeError(%22Invalid%20attempt%20to%20destructure%20non-iterable%20instance.%5CnIn%20order%20to%20be%20iterable%2C%20non-array%20objects%20must%20have%20a%20%5BSymbol.iterator%5D()%20method.%22)%3B%20%7D%0A%0Afunction%20_unsupportedIterableToArray(o%2C%20minLen)%20%7B%20if%20(!o)%20return%3B%20if%20(typeof%20o%20%3D%3D%3D%20%22string%22)%20return%20_arrayLikeToArray(o%2C%20minLen)%3B%20var%20n%20%3D%20Object.prototype.toString.call(o).slice(8%2C%20-1)%3B%20if%20(n%20%3D%3D%3D%20%22Object%22%20%26%26%20o.constructor)%20n%20%3D%20o.constructor.name%3B%20if%20(n%20%3D%3D%3D%20%22Map%22%20%7C%7C%20n%20%3D%3D%3D%20%22Set%22)%20return%20Array.from(o)%3B%20if%20(n%20%3D%3D%3D%20%22Arguments%22%20%7C%7C%20%2F%5E(%3F%3AUi%7CI)nt(%3F%3A8%7C16%7C32)(%3F%3AClamped)%3FArray%24%2F.test(n))%20return%20_arrayLikeToArray(o%2C%20minLen)%3B%20%7D%0A%0Afunction%20_arrayLikeToArray(arr%2C%20len)%20%7B%20if%20(len%20%3D%3D%20null%20%7C%7C%20len%20%3E%20arr.length)%20len%20%3D%20arr.length%3B%20for%20(var%20i%20%3D%200%2C%20arr2%20%3D%20new%20Array(len)%3B%20i%20%3C%20len%3B%20i%2B%2B)%20%7B%20arr2%5Bi%5D%20%3D%20arr%5Bi%5D%3B%20%7D%20return%20arr2%3B%20%7D%0A%0Afunction%20_iterableToArrayLimit(arr%2C%20i)%20%7B%20var%20_i%20%3D%20arr%20%3D%3D%20null%20%3F%20null%20%3A%20typeof%20Symbol%20!%3D%3D%20%22undefined%22%20%26%26%20arr%5BSymbol.iterator%5D%20%7C%7C%20arr%5B%22%40%40iterator%22%5D%3B%20if%20(_i%20%3D%3D%20null)%20return%3B%20var%20_arr%20%3D%20%5B%5D%3B%20var%20_n%20%3D%20true%3B%20var%20_d%20%3D%20false%3B%20var%20_s%2C%20_e%3B%20try%20%7B%20for%20(_i%20%3D%20_i.call(arr)%3B%20!(_n%20%3D%20(_s%20%3D%20_i.next()).done)%3B%20_n%20%3D%20true)%20%7B%20_arr.push(_s.value)%3B%20if%20(i%20%26%26%20_arr.length%20%3D%3D%3D%20i)%20break%3B%20%7D%20%7D%20catch%20(err)%20%7B%20_d%20%3D%20true%3B%20_e%20%3D%20err%3B%20%7D%20finally%20%7B%20try%20%7B%20if%20(!_n%20%26%26%20_i%5B%22return%22%5D%20!%3D%20null)%20_i%5B%22return%22%5D()%3B%20%7D%20finally%20%7B%20if%20(_d)%20throw%20_e%3B%20%7D%20%7D%20return%20_arr%3B%20%7D%0A%0Afunction%20_arrayWithHoles(arr)%20%7B%20if%20(Array.isArray(arr))%20return%20arr%3B%20%7D%0A%0A_RTFN_%20%3D%20function%20_RTFN_(_ref)%20%7B%0A%20%20var%20outputs%20%3D%20_ref.outputs%2C%0A%20%20%20%20%20%20inputs%20%3D%20_ref.inputs%3B%0A%0A%20%20var%20_inputs%20%3D%20_slicedToArray(inputs%2C%201)%2C%0A%20%20%20%20%20%20inputValue0%20%3D%20_inputs%5B0%5D%3B%0A%0A%20%20var%20_outputs%20%3D%20_slicedToArray(outputs%2C%202)%2C%0A%20%20%20%20%20%20output0%20%3D%20_outputs%5B0%5D%2C%0A%20%20%20%20%20%20output1%20%3D%20_outputs%5B1%5D%3B%0A%0A%20%20if%20(inputValue0%5B'showTerminate'%5D%20%3D%3D%20true)%20%7B%0A%20%20%20%20output0(1)%3B%0A%20%20%7D%20else%20%7B%0A%20%20%20%20output1(1)%3B%0A%20%20%7D%0A%7D%3B%0A%3B%20return%20_RTFN_%3B%20%7D)()"
              }
            },
            "inputAry": [],
            "outputAry": [
              "output1"
            ],
            "outputEvents": {},
            "style": {
              "display": "block"
            }
          },
          "style": {},
          "configs": [],
          "_inputs": [],
          "inputs": [
            "input.inputValue0"
          ],
          "outputs": [
            "output0",
            "output1"
          ]
        },
        "u_pqaQQ": {
          "id": "u_pqaQQ",
          "def": {
            "namespace": "mybricks.normal-pc.custom-container",
            "version": "1.0.24",
            "materialId": 48068
          },
          "title": "自定义容器1",
          "model": {
            "data": {
              "style": {},
              "slotStyle": {
                "display": "flex",
                "position": "inherit",
                "flexDirection": "column",
                "alignItems": "center",
                "justifyContent": "center",
                "flexWrap": "nowrap",
                "rowGap": 0,
                "columnGap": 0
              },
              "legacyConfigStyle": {},
              "legacyStyle": {}
            },
            "inputAry": [],
            "outputAry": [],
            "outputEvents": {},
            "style": {
              "height": "fit-content",
              "width": "100%",
              "_new": true
            }
          },
          "style": {
            "width": 1024,
            "height": 100
          },
          "configs": [
            "style",
            "id"
          ],
          "_inputs": [],
          "inputs": [
            "show",
            "hide",
            "showOrHide"
          ],
          "outputs": []
        },
        "u_6nkja": {
          "id": "u_6nkja",
          "def": {
            "namespace": "mybricks.normal-pc.text",
            "version": "1.0.17",
            "materialId": 47511
          },
          "title": "发布单结束文本",
          "model": {
            "data": {
              "content": "操作完成！",
              "outputContent": "",
              "align": "left",
              "isEllipsis": false,
              "ellipsis": {
                "rows": 3
              },
              "style": {},
              "useClick": false,
              "useDynamicStyle": false,
              "useHoverStyle": true,
              "legacyConfigStyle": {}
            },
            "inputAry": [],
            "outputAry": [],
            "outputEvents": {},
            "style": {
              "width": "fit-content",
              "styleAry": [
                {
                  "selector": "[data-item-type=\"root\"]",
                  "css": {
                    "color": "#3a9008",
                    "fontWeight": "900",
                    "fontSize": "24px",
                    "lineHeight": "100px"
                  }
                }
              ],
              "maxWidth": "fit-content",
              "height": "fit-content",
              "_new": true
            }
          },
          "style": {
            "width": 120,
            "height": 100
          },
          "configs": [
            "text",
            "style"
          ],
          "_inputs": [],
          "inputs": [
            "content",
            "show",
            "hide",
            "showOrHide"
          ],
          "outputs": []
        },
        "u_xfBaK": {
          "id": "u_xfBaK",
          "def": {
            "namespace": "mybricks.normal-pc.custom-container",
            "version": "1.0.24",
            "materialId": 48068
          },
          "title": "自定义容器2",
          "model": {
            "data": {
              "style": {},
              "slotStyle": {
                "display": "flex",
                "position": "inherit",
                "flexDirection": "column",
                "alignItems": "center",
                "justifyContent": "flex-start",
                "flexWrap": "nowrap",
                "rowGap": 0,
                "columnGap": 0
              },
              "legacyConfigStyle": {},
              "legacyStyle": {}
            },
            "inputAry": [],
            "outputAry": [],
            "outputEvents": {},
            "style": {
              "height": "fit-content",
              "width": "100%",
              "_new": true
            }
          },
          "style": {
            "width": 0,
            "height": 0
          },
          "configs": [
            "style",
            "id"
          ],
          "_inputs": [],
          "inputs": [
            "show",
            "hide",
            "showOrHide"
          ],
          "outputs": []
        },
        "u_wBfQx": {
          "id": "u_wBfQx",
          "def": {
            "namespace": "mybricks.basic-comlib._muilt-inputJs",
            "version": "1.0.2",
            "rtType": "js-autorun",
            "materialId": 46406
          },
          "title": "JS计算9",
          "model": {
            "data": {
              "fns": {
                "code": "(%7B%20outputs%2C%20inputs%20%7D)%20%3D%3E%20%7B%0A%20%20const%20%5BinputValue0%5D%20%3D%20inputs%3B%0A%20%20const%20%5Boutput0%2C%20output1%2C%20output2%5D%20%3D%20outputs%3B%0A%20%20if%20(inputValue0)%20%7B%0A%20%20%20%20const%20%7B%20approveLink%2C%20approveStatus%2C%20approveStatusDesc%2C%20approver%20%7D%20%3D%0A%20%20%20%20%20%20inputValue0%3B%0A%20%20%20%20if%20(approveStatusDesc)%20%7B%0A%20%20%20%20%20%20var%20color%20%3D%20'gray'%3B%0A%20%20%20%20%20%20if%20(approveStatus%20%3D%3D%201)%20%7B%0A%20%20%20%20%20%20%20%20color%20%3D%20'blue'%3B%0A%20%20%20%20%20%20%7D%20else%20if%20(approveStatus%20%3D%3D%202)%20%7B%0A%20%20%20%20%20%20%20%20color%20%3D%20'orange'%3B%0A%20%20%20%20%20%20%7D%20else%20if%20(approveStatus%20%3D%3D%203)%20%7B%0A%20%20%20%20%20%20%20%20color%20%3D%20'green'%3B%0A%20%20%20%20%20%20%7D%20else%20if%20(approveStatus%20%3E%3D%204)%20%7B%0A%20%20%20%20%20%20%20%20color%20%3D%20'red'%3B%0A%20%20%20%20%20%20%7D%0A%20%20%20%20%20%20output0(%5B%0A%20%20%20%20%20%20%20%20%7B%0A%20%20%20%20%20%20%20%20%20%20content%3A%20approveStatusDesc%2C%0A%20%20%20%20%20%20%20%20%20%20color%3A%20color%2C%0A%20%20%20%20%20%20%20%20%7D%2C%0A%20%20%20%20%20%20%5D)%3B%0A%20%20%20%20%7D%0A%20%20%20%20if%20(approveLink)%20%7B%0A%20%20%20%20%20%20output1(approveLink)%3B%0A%20%20%20%20%7D%0A%20%20%20%20if%20(approver)%20%7B%0A%20%20%20%20%20%20output2(approver)%3B%0A%20%20%20%20%7D%0A%20%20%7D%0A%7D",
                "transformCode": "(function()%20%7B%20var%20_RTFN_%3B%20%0A%22use%20strict%22%3B%0A%0Afunction%20_slicedToArray(arr%2C%20i)%20%7B%20return%20_arrayWithHoles(arr)%20%7C%7C%20_iterableToArrayLimit(arr%2C%20i)%20%7C%7C%20_unsupportedIterableToArray(arr%2C%20i)%20%7C%7C%20_nonIterableRest()%3B%20%7D%0A%0Afunction%20_nonIterableRest()%20%7B%20throw%20new%20TypeError(%22Invalid%20attempt%20to%20destructure%20non-iterable%20instance.%5CnIn%20order%20to%20be%20iterable%2C%20non-array%20objects%20must%20have%20a%20%5BSymbol.iterator%5D()%20method.%22)%3B%20%7D%0A%0Afunction%20_unsupportedIterableToArray(o%2C%20minLen)%20%7B%20if%20(!o)%20return%3B%20if%20(typeof%20o%20%3D%3D%3D%20%22string%22)%20return%20_arrayLikeToArray(o%2C%20minLen)%3B%20var%20n%20%3D%20Object.prototype.toString.call(o).slice(8%2C%20-1)%3B%20if%20(n%20%3D%3D%3D%20%22Object%22%20%26%26%20o.constructor)%20n%20%3D%20o.constructor.name%3B%20if%20(n%20%3D%3D%3D%20%22Map%22%20%7C%7C%20n%20%3D%3D%3D%20%22Set%22)%20return%20Array.from(o)%3B%20if%20(n%20%3D%3D%3D%20%22Arguments%22%20%7C%7C%20%2F%5E(%3F%3AUi%7CI)nt(%3F%3A8%7C16%7C32)(%3F%3AClamped)%3FArray%24%2F.test(n))%20return%20_arrayLikeToArray(o%2C%20minLen)%3B%20%7D%0A%0Afunction%20_arrayLikeToArray(arr%2C%20len)%20%7B%20if%20(len%20%3D%3D%20null%20%7C%7C%20len%20%3E%20arr.length)%20len%20%3D%20arr.length%3B%20for%20(var%20i%20%3D%200%2C%20arr2%20%3D%20new%20Array(len)%3B%20i%20%3C%20len%3B%20i%2B%2B)%20%7B%20arr2%5Bi%5D%20%3D%20arr%5Bi%5D%3B%20%7D%20return%20arr2%3B%20%7D%0A%0Afunction%20_iterableToArrayLimit(arr%2C%20i)%20%7B%20var%20_i%20%3D%20arr%20%3D%3D%20null%20%3F%20null%20%3A%20typeof%20Symbol%20!%3D%3D%20%22undefined%22%20%26%26%20arr%5BSymbol.iterator%5D%20%7C%7C%20arr%5B%22%40%40iterator%22%5D%3B%20if%20(_i%20%3D%3D%20null)%20return%3B%20var%20_arr%20%3D%20%5B%5D%3B%20var%20_n%20%3D%20true%3B%20var%20_d%20%3D%20false%3B%20var%20_s%2C%20_e%3B%20try%20%7B%20for%20(_i%20%3D%20_i.call(arr)%3B%20!(_n%20%3D%20(_s%20%3D%20_i.next()).done)%3B%20_n%20%3D%20true)%20%7B%20_arr.push(_s.value)%3B%20if%20(i%20%26%26%20_arr.length%20%3D%3D%3D%20i)%20break%3B%20%7D%20%7D%20catch%20(err)%20%7B%20_d%20%3D%20true%3B%20_e%20%3D%20err%3B%20%7D%20finally%20%7B%20try%20%7B%20if%20(!_n%20%26%26%20_i%5B%22return%22%5D%20!%3D%20null)%20_i%5B%22return%22%5D()%3B%20%7D%20finally%20%7B%20if%20(_d)%20throw%20_e%3B%20%7D%20%7D%20return%20_arr%3B%20%7D%0A%0Afunction%20_arrayWithHoles(arr)%20%7B%20if%20(Array.isArray(arr))%20return%20arr%3B%20%7D%0A%0A_RTFN_%20%3D%20function%20_RTFN_(_ref)%20%7B%0A%20%20var%20outputs%20%3D%20_ref.outputs%2C%0A%20%20%20%20%20%20inputs%20%3D%20_ref.inputs%3B%0A%0A%20%20var%20_inputs%20%3D%20_slicedToArray(inputs%2C%201)%2C%0A%20%20%20%20%20%20inputValue0%20%3D%20_inputs%5B0%5D%3B%0A%0A%20%20var%20_outputs%20%3D%20_slicedToArray(outputs%2C%203)%2C%0A%20%20%20%20%20%20output0%20%3D%20_outputs%5B0%5D%2C%0A%20%20%20%20%20%20output1%20%3D%20_outputs%5B1%5D%2C%0A%20%20%20%20%20%20output2%20%3D%20_outputs%5B2%5D%3B%0A%0A%20%20if%20(inputValue0)%20%7B%0A%20%20%20%20var%20approveLink%20%3D%20inputValue0.approveLink%2C%0A%20%20%20%20%20%20%20%20approveStatus%20%3D%20inputValue0.approveStatus%2C%0A%20%20%20%20%20%20%20%20approveStatusDesc%20%3D%20inputValue0.approveStatusDesc%2C%0A%20%20%20%20%20%20%20%20approver%20%3D%20inputValue0.approver%3B%0A%0A%20%20%20%20if%20(approveStatusDesc)%20%7B%0A%20%20%20%20%20%20var%20color%20%3D%20'gray'%3B%0A%0A%20%20%20%20%20%20if%20(approveStatus%20%3D%3D%201)%20%7B%0A%20%20%20%20%20%20%20%20color%20%3D%20'blue'%3B%0A%20%20%20%20%20%20%7D%20else%20if%20(approveStatus%20%3D%3D%202)%20%7B%0A%20%20%20%20%20%20%20%20color%20%3D%20'orange'%3B%0A%20%20%20%20%20%20%7D%20else%20if%20(approveStatus%20%3D%3D%203)%20%7B%0A%20%20%20%20%20%20%20%20color%20%3D%20'green'%3B%0A%20%20%20%20%20%20%7D%20else%20if%20(approveStatus%20%3E%3D%204)%20%7B%0A%20%20%20%20%20%20%20%20color%20%3D%20'red'%3B%0A%20%20%20%20%20%20%7D%0A%0A%20%20%20%20%20%20output0(%5B%7B%0A%20%20%20%20%20%20%20%20content%3A%20approveStatusDesc%2C%0A%20%20%20%20%20%20%20%20color%3A%20color%0A%20%20%20%20%20%20%7D%5D)%3B%0A%20%20%20%20%7D%0A%0A%20%20%20%20if%20(approveLink)%20%7B%0A%20%20%20%20%20%20output1(approveLink)%3B%0A%20%20%20%20%7D%0A%0A%20%20%20%20if%20(approver)%20%7B%0A%20%20%20%20%20%20output2(approver)%3B%0A%20%20%20%20%7D%0A%20%20%7D%0A%7D%3B%0A%3B%20return%20_RTFN_%3B%20%7D)()"
              }
            },
            "inputAry": [],
            "outputAry": [
              "output1",
              "output2"
            ],
            "outputEvents": {},
            "style": {
              "display": "block"
            }
          },
          "style": {},
          "configs": [],
          "_inputs": [],
          "inputs": [
            "input.inputValue0"
          ],
          "outputs": [
            "output0",
            "output1",
            "output2"
          ]
        },
        "u_Z_6cV": {
          "id": "u_Z_6cV",
          "def": {
            "namespace": "mybricks.normal-pc.timer-loop",
            "version": "1.0.1",
            "rtType": "js",
            "materialId": 30013
          },
          "title": "循环执行",
          "model": {
            "data": {
              "delay": 3000,
              "immediate": false,
              "id": "u_ic67s8",
              "useCancel": true
            },
            "inputAry": [
              {
                "hostId": "cancel",
                "title": "取消",
                "schema": {
                  "type": "any"
                }
              }
            ],
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
            "trigger",
            "cancel"
          ],
          "outputs": [
            "trigger"
          ]
        },
        "u_qz2XB": {
          "id": "u_qz2XB",
          "def": {
            "namespace": "mybricks.normal-pc.service",
            "version": "1.0.8",
            "rtType": "js-autorun",
            "materialId": 38932
          },
          "title": "服务接口2",
          "model": {
            "data": {
              "connectorConfig": {},
              "connector": {
                "id": "u_ennask",
                "title": "查询发布单详情",
                "type": "http",
                "script": "function%20(e%2C%20%7B%0A%20%20%20%20%20%20%20%20%20%20%20%20then%3A%20t%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20onError%3A%20n%0A%20%20%20%20%20%20%20%20%20%20%7D%2C%20r)%20%7B%0A%20%20%20%20%20%20%20%20%20%20%20%20return%20function%20(e%2C%20r)%20%7B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20const%20o%20%3D%20%22GET%22%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20i%20%3D%20%5B%5D%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20a%20%3D%20%5B%5D%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20c%20%3D%20undefined%3B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20try%20%7B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20const%20l%20%3D%20%22%2Fgateway%2Fmarketing%2Ftools%2Fselfconfig%2Fpublish%2Fdetail%22%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20s%20%3D%20function%20_RT_(%7B%20params%2C%20data%2C%20headers%2C%20url%2C%20method%20%7D)%20%7B%0A%20%20%2F%2F%20%E8%AE%BE%E7%BD%AE%E8%AF%B7%E6%B1%82query%E3%80%81%E8%AF%B7%E6%B1%82%E4%BD%93%E3%80%81%E8%AF%B7%E6%B1%82%E5%A4%B4%0A%20%20return%20%7B%20params%2C%20data%2C%20headers%2C%20url%2C%20method%20%7D%3B%0A%20%7D%0A(o.startsWith(%22GET%22)%20%3F%20%7B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20params%3A%20e%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20url%3A%20l%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20method%3A%20o%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%7D%20%3A%20%7B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20data%3A%20e%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20url%3A%20l%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20method%3A%20o%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%7D)%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20u%20%3D%20true%3B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20s.url%20%3D%20s.url%20%7C%7C%20l%2C%20s.method%20%3D%20s.method%20%7C%7C%20o%3B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20const%20d%20%3D%20function%20_RT_(%7B%20params%2C%20data%2C%20headers%2C%20url%2C%20method%20%7D)%20%7B%0A%20%20%2F%2F%20%E8%AE%BE%E7%BD%AE%E8%AF%B7%E6%B1%82query%E3%80%81%E8%AF%B7%E6%B1%82%E4%BD%93%E3%80%81%E8%AF%B7%E6%B1%82%E5%A4%B4%0A%20%20return%20%7B%20params%2C%20data%2C%20headers%2C%20url%2C%20method%20%7D%3B%0A%20%7D%0A(s)%3B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20d.url%20%3D%20(d.url%20%7C%7C%20l).replace(%2F%7B(%5Cw%2B)%7D%2Fg%2C%20(t%2C%20n)%20%3D%3E%20%7B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20const%20r%20%3D%20e%5Bn%5D%20%7C%7C%20%22%22%3B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20return%20Reflect.deleteProperty(d.params%20%7C%7C%20%7B%7D%2C%20n)%2C%20r%3B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%7D)%2C%20d.method%20%3D%20d.method%20%7C%7C%20o%2C%20r.ajax(d).then(e%20%3D%3E%20u%20%3F%20function%20_RT_(%7B%20response%2C%20config%20%7D)%20%7B%0A%20%20%2F%2F%20if%20(response.data.code%20!%3D%3D%200)%20%7B%0A%20%20%2F%2F%20%20%20throw%20new%20Error(response.data.errMsg)%0A%20%20%2F%2F%20%7D%0A%20%20return%20response.data%0A%7D%0A(%7B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20response%3A%20e%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20config%3A%20d%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%7D%2C%20%7B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20throwStatusCodeError%3A%20e%20%3D%3E%20%7B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20n(e)%3B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%7D%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%7D)%20%3A%20e).then(e%20%3D%3E%20function%20_RT_(result%2C%20%7B%20method%2C%20url%2C%20params%2C%20data%2C%20headers%20%7D)%20%7B%0A%20%20%2F%2F%20return%20%7B%0A%20%20%2F%2F%20%20total%3A%20result.all%2C%0A%20%20%2F%2F%20%20dataSource%3A%20result.list.map(%7Bid%2C%20name%7D%20%3D%3E%20(%7B%0A%20%20%2F%2F%20%20%20%20%20value%3Aid%2C%20label%3A%20name%0A%20%20%2F%2F%20%20%7D))%0A%20%20%2F%2F%20%7D%0A%20%20return%20result%3B%0A%7D%0A(e%2C%20Object.assign(%7B%7D%2C%20d)%2C%20%7B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20throwStatusCodeError%3A%20e%20%3D%3E%20%7B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20n(e)%3B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%7D%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%7D)).then(e%20%3D%3E%20c%20%3F%20t(e)%20%3A%20(0%20%3D%3D%3D%20a.length%20%7C%7C%20a.forEach(t%20%3D%3E%20%7B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20const%20n%20%3D%20t.split(%22.%22)%3B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20!function%20(e%2C%20t)%20%7B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20const%20n%20%3D%20t.length%3B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20!function%20e(r%2C%20o)%20%7B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20if%20(!r%20%7C%7C%20o%20%3D%3D%3D%20n)%20return%3B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20const%20i%20%3D%20t%5Bo%5D%3B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20o%20%3D%3D%3D%20n%20-%201%20%26%26%20Reflect.deleteProperty(r%2C%20i)%2C%20Array.isArray(r)%20%3F%20r.forEach(t%20%3D%3E%20%7B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20e(t%2C%20o)%3B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%7D)%20%3A%20e(r%5Bi%5D%2C%20o%20%2B%201)%3B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%7D(e%2C%200)%3B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%7D(e%2C%20n)%3B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%7D)%2C%20e)).then(e%20%3D%3E%20%7B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20let%20n%20%3D%20Array.isArray(e)%20%3F%20%5B%5D%20%3A%20%7B%7D%3B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20if%20(void%200%20%3D%3D%3D%20i%20%7C%7C%200%20%3D%3D%3D%20i.length)%20n%20%3D%20e%3Belse%20if%20(i.forEach(t%20%3D%3E%20%7B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20!function%20(e%2C%20t%2C%20n)%20%7B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20const%20r%20%3D%20t.length%3B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20!function%20e(n%2C%20o%2C%20i)%20%7B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20if%20(!n%20%7C%7C%20o%20%3D%3D%3D%20r)%20return%20n%3B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20const%20a%20%3D%20t%5Bo%5D%3B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20return%20Array.isArray(n)%20%3F%20n.map((t%2C%20n)%20%3D%3E%20%7B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20const%20r%20%3D%20i%5Bn%5D%3B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20let%20a%3B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20return%20void%200%20%3D%3D%3D%20r%20%3F%20(a%20%3D%20%7B%7D%2C%20i.push(a))%20%3A%20a%20%3D%20r%2C%20e(t%2C%20o%2C%20a)%3B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%7D)%20%3A%20o%20%3D%3D%3D%20r%20-%201%20%3F%20(i%5Ba%5D%20%3D%20n%5Ba%5D%2C%20n%5Ba%5D)%20%3A%20(n%20%3D%20n%5Ba%5D%2C%20Array.isArray(n)%20%3F%20i%5Ba%5D%20%3D%20i%5Ba%5D%20%7C%7C%20%5B%5D%20%3A%20i%5Ba%5D%20%3D%20i%5Ba%5D%20%7C%7C%20%7B%7D%2C%20e(n%2C%20o%20%2B%201%2C%20Array.isArray(i)%20%3F%20i%20%3A%20i%5Ba%5D))%3B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%7D(e%2C%200%2C%20n)%3B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%7D(e%2C%20t.split(%22.%22)%2C%20n)%3B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%7D)%2C%20Array.isArray(i)%20%26%26%20i.length%20%26%26%20(i.length%20%3E%201%20%7C%7C%201%20!%3D%3D%20i.length%20%7C%7C%20%22%22%20!%3D%3D%20i%5B0%5D))%20try%20%7B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20let%20e%20%3D%20i.map(e%20%3D%3E%20e.split(%22.%22))%3B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20for%20(%3B%20%22%5Bobject%20Object%5D%22%20%3D%3D%3D%20Object.prototype.toString.call(n)%20%26%26%20e.every(e%20%3D%3E%20!!e.length)%20%26%26%201%20%3D%3D%3D%20Object.values(n).length%3B)%20n%20%3D%20Object.values(n)%5B0%5D%2C%20e.forEach(e%20%3D%3E%20e.shift())%3B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%7D%20catch%20(e)%20%7B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20console.log(%22connector%20format%20data%20error%22%2C%20e)%3B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%7D%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%22POST%22%20%3D%3D%3D%20d.method.toUpperCase()%20%26%26%20d.url.endsWith(%22%2Fdomain%2Frun%22)%20%26%26%20d.data%20%26%26%20d.data.fileId%20%26%26%20d.data.serviceId%20%26%26%20d.data.params%20%26%26%20d.data.params.showToplLog%20%3F%20t(%7B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20__ORIGIN_RESPONSE__%3A%20e%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20outputData%3A%20n%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%7D)%20%3A%20t(n)%3B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%7D).catch(e%20%3D%3E%20%7B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20n(e%20%26%26%20e.message%20%7C%7C%20e)%3B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%7D)%3B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%7D%20catch%20(e)%20%7B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20return%20n(e)%3B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%7D%0A%20%20%20%20%20%20%20%20%20%20%20%20%7D(e%2C%20r)%3B%0A%20%20%20%20%20%20%20%20%20%20%7D",
                "inputSchema": {
                  "type": "object",
                  "properties": {
                    "env": {
                      "type": "string"
                    },
                    "openConfigId": {
                      "type": "number"
                    }
                  }
                },
                "outputSchema": {
                  "type": "object",
                  "properties": {
                    "result": {
                      "type": "number"
                    },
                    "error_msg": {
                      "type": "string"
                    },
                    "data": {
                      "type": "object",
                      "properties": {
                        "id": {
                          "type": "string"
                        },
                        "formContent": {
                          "type": "string"
                        },
                        "approveInfo": {
                          "type": "object",
                          "properties": {
                            "approveLink": {
                              "type": "string"
                            },
                            "approveStatus": {
                              "type": "number"
                            },
                            "approveStatusDesc": {
                              "type": "string"
                            },
                            "approveRemark": {
                              "type": "string"
                            },
                            "approver": {
                              "type": "string"
                            },
                            "nextApprover": {
                              "type": "string"
                            }
                          }
                        },
                        "publisherName": {
                          "type": "string"
                        },
                        "step": {
                          "type": "number"
                        },
                        "operateOptions": {
                          "type": "string"
                        },
                        "status": {
                          "type": "number"
                        },
                        "statusDesc": {
                          "type": "string"
                        },
                        "pictureUrl": {
                          "type": "string"
                        },
                        "showStaging": {
                          "type": "boolean"
                        }
                      }
                    },
                    "requestId": {
                      "type": "string"
                    },
                    "debugInfo": {
                      "type": "string"
                    }
                  }
                }
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
            "call"
          ],
          "outputs": [
            "then",
            "catch"
          ]
        },
        "u__1_Ux": {
          "id": "u__1_Ux",
          "def": {
            "namespace": "mybricks.core-comlib.var",
            "version": "1.0.0",
            "rtType": "js"
          },
          "title": "发布单id",
          "model": {
            "data": {},
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
            "get",
            "set",
            "reset"
          ],
          "outputs": [
            "return",
            "changed"
          ]
        },
        "u_iOQkV": {
          "id": "u_iOQkV",
          "def": {
            "namespace": "mybricks.basic-comlib._muilt-inputJs",
            "version": "1.0.2",
            "rtType": "js-autorun",
            "materialId": 46406
          },
          "title": "JS计算10",
          "model": {
            "data": {
              "fns": {
                "code": "(%7B%20outputs%2C%20inputs%20%7D)%20%3D%3E%20%7B%0A%20%20const%20%5BinputValue0%2C%20inputValue1%5D%20%3D%20inputs%3B%0A%20%20const%20%5Boutput0%5D%20%3D%20outputs%3B%0A%20%20if%20(inputValue0%20%26%26%20inputValue0%5B'openConfigId'%5D%20%26%26%20inputValue1)%20%7B%0A%20%20%20%20console.log('openCofigId%3A%20'%20%2B%20inputValue0%5B'openConfigId'%5D)%3B%0A%20%20%20%20console.log('id%3A%20'%20%2B%20inputValue1)%3B%0A%20%20%20%20output0(%7B%0A%20%20%20%20%20%20openConfigId%3A%20inputValue0%5B'openConfigId'%5D%2C%0A%20%20%20%20%20%20id%3A%20inputValue1%2C%0A%20%20%20%20%7D)%3B%0A%20%20%7D%0A%7D",
                "transformCode": "(function()%20%7B%20var%20_RTFN_%3B%20%0A%22use%20strict%22%3B%0A%0Afunction%20_slicedToArray(arr%2C%20i)%20%7B%20return%20_arrayWithHoles(arr)%20%7C%7C%20_iterableToArrayLimit(arr%2C%20i)%20%7C%7C%20_unsupportedIterableToArray(arr%2C%20i)%20%7C%7C%20_nonIterableRest()%3B%20%7D%0A%0Afunction%20_nonIterableRest()%20%7B%20throw%20new%20TypeError(%22Invalid%20attempt%20to%20destructure%20non-iterable%20instance.%5CnIn%20order%20to%20be%20iterable%2C%20non-array%20objects%20must%20have%20a%20%5BSymbol.iterator%5D()%20method.%22)%3B%20%7D%0A%0Afunction%20_unsupportedIterableToArray(o%2C%20minLen)%20%7B%20if%20(!o)%20return%3B%20if%20(typeof%20o%20%3D%3D%3D%20%22string%22)%20return%20_arrayLikeToArray(o%2C%20minLen)%3B%20var%20n%20%3D%20Object.prototype.toString.call(o).slice(8%2C%20-1)%3B%20if%20(n%20%3D%3D%3D%20%22Object%22%20%26%26%20o.constructor)%20n%20%3D%20o.constructor.name%3B%20if%20(n%20%3D%3D%3D%20%22Map%22%20%7C%7C%20n%20%3D%3D%3D%20%22Set%22)%20return%20Array.from(o)%3B%20if%20(n%20%3D%3D%3D%20%22Arguments%22%20%7C%7C%20%2F%5E(%3F%3AUi%7CI)nt(%3F%3A8%7C16%7C32)(%3F%3AClamped)%3FArray%24%2F.test(n))%20return%20_arrayLikeToArray(o%2C%20minLen)%3B%20%7D%0A%0Afunction%20_arrayLikeToArray(arr%2C%20len)%20%7B%20if%20(len%20%3D%3D%20null%20%7C%7C%20len%20%3E%20arr.length)%20len%20%3D%20arr.length%3B%20for%20(var%20i%20%3D%200%2C%20arr2%20%3D%20new%20Array(len)%3B%20i%20%3C%20len%3B%20i%2B%2B)%20%7B%20arr2%5Bi%5D%20%3D%20arr%5Bi%5D%3B%20%7D%20return%20arr2%3B%20%7D%0A%0Afunction%20_iterableToArrayLimit(arr%2C%20i)%20%7B%20var%20_i%20%3D%20arr%20%3D%3D%20null%20%3F%20null%20%3A%20typeof%20Symbol%20!%3D%3D%20%22undefined%22%20%26%26%20arr%5BSymbol.iterator%5D%20%7C%7C%20arr%5B%22%40%40iterator%22%5D%3B%20if%20(_i%20%3D%3D%20null)%20return%3B%20var%20_arr%20%3D%20%5B%5D%3B%20var%20_n%20%3D%20true%3B%20var%20_d%20%3D%20false%3B%20var%20_s%2C%20_e%3B%20try%20%7B%20for%20(_i%20%3D%20_i.call(arr)%3B%20!(_n%20%3D%20(_s%20%3D%20_i.next()).done)%3B%20_n%20%3D%20true)%20%7B%20_arr.push(_s.value)%3B%20if%20(i%20%26%26%20_arr.length%20%3D%3D%3D%20i)%20break%3B%20%7D%20%7D%20catch%20(err)%20%7B%20_d%20%3D%20true%3B%20_e%20%3D%20err%3B%20%7D%20finally%20%7B%20try%20%7B%20if%20(!_n%20%26%26%20_i%5B%22return%22%5D%20!%3D%20null)%20_i%5B%22return%22%5D()%3B%20%7D%20finally%20%7B%20if%20(_d)%20throw%20_e%3B%20%7D%20%7D%20return%20_arr%3B%20%7D%0A%0Afunction%20_arrayWithHoles(arr)%20%7B%20if%20(Array.isArray(arr))%20return%20arr%3B%20%7D%0A%0A_RTFN_%20%3D%20function%20_RTFN_(_ref)%20%7B%0A%20%20var%20outputs%20%3D%20_ref.outputs%2C%0A%20%20%20%20%20%20inputs%20%3D%20_ref.inputs%3B%0A%0A%20%20var%20_inputs%20%3D%20_slicedToArray(inputs%2C%202)%2C%0A%20%20%20%20%20%20inputValue0%20%3D%20_inputs%5B0%5D%2C%0A%20%20%20%20%20%20inputValue1%20%3D%20_inputs%5B1%5D%3B%0A%0A%20%20var%20_outputs%20%3D%20_slicedToArray(outputs%2C%201)%2C%0A%20%20%20%20%20%20output0%20%3D%20_outputs%5B0%5D%3B%0A%0A%20%20if%20(inputValue0%20%26%26%20inputValue0%5B'openConfigId'%5D%20%26%26%20inputValue1)%20%7B%0A%20%20%20%20console.log('openCofigId%3A%20'%20%2B%20inputValue0%5B'openConfigId'%5D)%3B%0A%20%20%20%20console.log('id%3A%20'%20%2B%20inputValue1)%3B%0A%20%20%20%20output0(%7B%0A%20%20%20%20%20%20openConfigId%3A%20inputValue0%5B'openConfigId'%5D%2C%0A%20%20%20%20%20%20id%3A%20inputValue1%0A%20%20%20%20%7D)%3B%0A%20%20%7D%0A%7D%3B%0A%3B%20return%20_RTFN_%3B%20%7D)()"
              }
            },
            "inputAry": [
              {
                "hostId": "input.inputValue1",
                "title": "参数1",
                "schema": {
                  "type": "follow"
                }
              }
            ],
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
            "input.inputValue0",
            "input.inputValue1"
          ],
          "outputs": [
            "output0"
          ]
        },
        "u_STGPs": {
          "id": "u_STGPs",
          "def": {
            "namespace": "mybricks.normal-pc.message",
            "version": "1.0.4",
            "rtType": "js",
            "materialId": 44978
          },
          "title": "消息提示5",
          "model": {
            "data": {
              "title": "提示名称",
              "content": "弹出提示",
              "duration": 3,
              "type": "error",
              "isExternal": true,
              "isEnd": false
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
          "outputs": []
        },
        "u_s89rA": {
          "id": "u_s89rA",
          "def": {
            "namespace": "mybricks.normal-pc.grid",
            "version": "1.0.44",
            "materialId": 47857
          },
          "title": "栅格布局",
          "model": {
            "data": {
              "rows": [
                {
                  "key": "row_0",
                  "justify": "start",
                  "align": "stretch",
                  "gutter": [
                    0,
                    0
                  ],
                  "wrap": true,
                  "columns": [
                    {
                      "span": 12,
                      "key": "column_0",
                      "slot": "slot_0",
                      "widthOption": "span",
                      "width": 300,
                      "flex": 1,
                      "legacyStyle": {
                        "overflowX": "hidden",
                        "overflowY": "hidden"
                      },
                      "slotStyle": {
                        "display": "flex",
                        "position": "inherit",
                        "flexDirection": "column",
                        "alignItems": "flex-end",
                        "justifyContent": "center",
                        "flexWrap": "nowrap",
                        "rowGap": 0,
                        "columnGap": 0
                      }
                    },
                    {
                      "span": 8,
                      "key": "column_1",
                      "slot": "slot_1",
                      "widthOption": "auto",
                      "width": 300,
                      "flex": 1,
                      "legacyStyle": {
                        "overflowX": "hidden",
                        "overflowY": "hidden"
                      },
                      "slotStyle": {
                        "display": "flex",
                        "position": "inherit",
                        "flexDirection": "column",
                        "alignItems": "center",
                        "justifyContent": "flex-start",
                        "flexWrap": "nowrap",
                        "rowGap": 0,
                        "columnGap": 0
                      }
                    }
                  ]
                }
              ],
              "style": {},
              "widthUnit": "%"
            },
            "inputAry": [],
            "outputAry": [],
            "outputEvents": {},
            "style": {
              "width": "100%",
              "height": "fit-content",
              "_new": true
            }
          },
          "style": {
            "width": 0,
            "height": 0
          },
          "configs": [],
          "_inputs": [],
          "inputs": [
            "show",
            "hide",
            "showOrHide"
          ],
          "outputs": []
        },
        "u_aIWUY": {
          "id": "u_aIWUY",
          "def": {
            "namespace": "mybricks.normal-pc.single-image",
            "version": "1.0.15",
            "materialId": 47548
          },
          "title": "测试图片- PRT",
          "model": {
            "data": {
              "alt": "图片",
              "src": "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxMDI0IDEwMjQiIHZlcnNpb249IjEuMSIgd2lkdGg9IjIwMCIgaGVpZ2h0PSIyMDAiPjxwYXRoIGQ9Ik05NDIgOTE2LjZIODMuOWE3OS4xIDc5LjEgMCAwIDEtNzktNzlWMTg2YTc5LjEgNzkuMSAwIDAgMSA3OS03OUg5NDJhNzkuMSA3OS4xIDAgMCAxIDc5IDc5djY1MS42YTc5LjEgNzkuMSAwIDAgMS03OSA3OXpNODMuOSAxNjguNjVBMTcuNTcgMTcuNTcgMCAwIDAgNjYuNTYgMTg2djY1MS42YTE3LjU3IDE3LjU3IDAgMCAwIDE3LjM0IDE3LjMzSDk0MmExNy41NyAxNy41NyAwIDAgMCAxNy4zNC0xNy4zNFYxODZBMTcuNTcgMTcuNTcgMCAwIDAgOTQyIDE2OC42NXoiIGZpbGw9IiM1NTU1NTUiLz48cGF0aCBkPSJNMjEyLjcyIDQxMi43M2E5MiA5MiAwIDEgMSA5Mi05MiA5Mi4xIDkyLjEgMCAwIDEtOTIgOTJ6IG0wLTEyMGEyOCAyOCAwIDEgMCAyOCAyOCAyOCAyOCAwIDAgMC0yOC0yOHpNNDQuNjkgNzQxLjIzQTMyIDMyIDAgMCAxIDI1IDY4NGwyMzYuMjMtMTg0LjU5YzM0LjQ0LTI2LjkyIDg1Ljk0LTI0LjEgMTE3LjI0IDYuNDJMNTIwLjcgNjQ0LjUxYTMyIDMyIDAgMSAxLTQ0LjcgNDUuODJMMzMzLjc5IDU1MS42NmMtOC4yNi04LjA2LTI0LjA2LTguOTMtMzMuMTYtMS44Mkw2NC4zNyA3MzQuNDVhMzEuODQgMzEuODQgMCAwIDEtMTkuNjggNi43OHoiIGZpbGw9IiM1NTU1NTUiLz48cGF0aCBkPSJNOTg2LjMyIDgxMi4xMmEzMiAzMiAwIDAgMS0yOC40Ny0xNy4zNkw3ODIuNDEgNDU0LjE4bC0wLjE3LTAuMzZhMjIgMjIgMCAwIDAtMzQuMi03LjA3bC0yMjYuMjkgMjQyLjVBMzIgMzIgMCAxIDEgNDc1IDY0NS41OWwyMjcuOS0yNDQuMjcgMC44LTAuNzVhODYgODYgMCAwIDEgMTM1Ljk1IDI1bDE3NS4wOSAzMzkuOTJhMzIgMzIgMCAwIDEtMjguNDIgNDYuNjZ6IiBmaWxsPSIjNTU1NTU1Ii8+PC9zdmc+",
              "usePreview": false,
              "useFallback": false,
              "previewImgSrc": ""
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
              "width": "fit-content",
              "height": "fit-content",
              "maxWidth": "fit-content",
              "_new": true
            }
          },
          "style": {
            "width": 0,
            "height": 0
          },
          "configs": [],
          "_inputs": [],
          "inputs": [
            "setImgSrc",
            "show",
            "hide",
            "showOrHide"
          ],
          "outputs": [
            "click"
          ]
        },
        "u_HLBsc": {
          "id": "u_HLBsc",
          "def": {
            "namespace": "mybricks.normal-pc.grid",
            "version": "1.0.44",
            "materialId": 47857
          },
          "title": "栅格布局1",
          "model": {
            "data": {
              "rows": [
                {
                  "key": "row_0",
                  "justify": "start",
                  "align": "stretch",
                  "gutter": [
                    0,
                    0
                  ],
                  "wrap": true,
                  "columns": [
                    {
                      "span": 12,
                      "key": "column_0",
                      "slot": "slot_0",
                      "widthOption": "span",
                      "width": 300,
                      "flex": 1,
                      "legacyStyle": {
                        "overflowX": "hidden",
                        "overflowY": "hidden"
                      },
                      "slotStyle": {
                        "display": "flex",
                        "position": "inherit",
                        "flexDirection": "column",
                        "alignItems": "flex-end",
                        "justifyContent": "center",
                        "flexWrap": "nowrap",
                        "rowGap": 0,
                        "columnGap": 0
                      }
                    },
                    {
                      "span": 8,
                      "key": "column_1",
                      "slot": "slot_1",
                      "widthOption": "auto",
                      "width": 300,
                      "flex": 1,
                      "legacyStyle": {
                        "overflowX": "hidden",
                        "overflowY": "hidden"
                      },
                      "slotStyle": {
                        "display": "flex",
                        "position": "inherit",
                        "flexDirection": "column",
                        "alignItems": "center",
                        "justifyContent": "flex-start",
                        "flexWrap": "nowrap",
                        "rowGap": 0,
                        "columnGap": 0
                      }
                    }
                  ]
                }
              ],
              "style": {},
              "widthUnit": "%"
            },
            "inputAry": [],
            "outputAry": [],
            "outputEvents": {},
            "style": {
              "width": "100%",
              "height": "fit-content",
              "_new": true
            }
          },
          "style": {
            "width": 0,
            "height": 0
          },
          "configs": [],
          "_inputs": [],
          "inputs": [
            "show",
            "hide",
            "showOrHide"
          ],
          "outputs": []
        },
        "u_odZh7": {
          "id": "u_odZh7",
          "def": {
            "namespace": "mybricks.normal-pc.single-image",
            "version": "1.0.15",
            "materialId": 47548
          },
          "title": "上线图片- PROD",
          "model": {
            "data": {
              "alt": "图片",
              "src": "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxMDI0IDEwMjQiIHZlcnNpb249IjEuMSIgd2lkdGg9IjIwMCIgaGVpZ2h0PSIyMDAiPjxwYXRoIGQ9Ik05NDIgOTE2LjZIODMuOWE3OS4xIDc5LjEgMCAwIDEtNzktNzlWMTg2YTc5LjEgNzkuMSAwIDAgMSA3OS03OUg5NDJhNzkuMSA3OS4xIDAgMCAxIDc5IDc5djY1MS42YTc5LjEgNzkuMSAwIDAgMS03OSA3OXpNODMuOSAxNjguNjVBMTcuNTcgMTcuNTcgMCAwIDAgNjYuNTYgMTg2djY1MS42YTE3LjU3IDE3LjU3IDAgMCAwIDE3LjM0IDE3LjMzSDk0MmExNy41NyAxNy41NyAwIDAgMCAxNy4zNC0xNy4zNFYxODZBMTcuNTcgMTcuNTcgMCAwIDAgOTQyIDE2OC42NXoiIGZpbGw9IiM1NTU1NTUiLz48cGF0aCBkPSJNMjEyLjcyIDQxMi43M2E5MiA5MiAwIDEgMSA5Mi05MiA5Mi4xIDkyLjEgMCAwIDEtOTIgOTJ6IG0wLTEyMGEyOCAyOCAwIDEgMCAyOCAyOCAyOCAyOCAwIDAgMC0yOC0yOHpNNDQuNjkgNzQxLjIzQTMyIDMyIDAgMCAxIDI1IDY4NGwyMzYuMjMtMTg0LjU5YzM0LjQ0LTI2LjkyIDg1Ljk0LTI0LjEgMTE3LjI0IDYuNDJMNTIwLjcgNjQ0LjUxYTMyIDMyIDAgMSAxLTQ0LjcgNDUuODJMMzMzLjc5IDU1MS42NmMtOC4yNi04LjA2LTI0LjA2LTguOTMtMzMuMTYtMS44Mkw2NC4zNyA3MzQuNDVhMzEuODQgMzEuODQgMCAwIDEtMTkuNjggNi43OHoiIGZpbGw9IiM1NTU1NTUiLz48cGF0aCBkPSJNOTg2LjMyIDgxMi4xMmEzMiAzMiAwIDAgMS0yOC40Ny0xNy4zNkw3ODIuNDEgNDU0LjE4bC0wLjE3LTAuMzZhMjIgMjIgMCAwIDAtMzQuMi03LjA3bC0yMjYuMjkgMjQyLjVBMzIgMzIgMCAxIDEgNDc1IDY0NS41OWwyMjcuOS0yNDQuMjcgMC44LTAuNzVhODYgODYgMCAwIDEgMTM1Ljk1IDI1bDE3NS4wOSAzMzkuOTJhMzIgMzIgMCAwIDEtMjguNDIgNDYuNjZ6IiBmaWxsPSIjNTU1NTU1Ii8+PC9zdmc+"
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
              "width": "fit-content",
              "height": "fit-content",
              "maxWidth": "fit-content",
              "_new": true
            }
          },
          "style": {
            "width": 0,
            "height": 0
          },
          "configs": [],
          "_inputs": [],
          "inputs": [
            "setImgSrc",
            "show",
            "hide",
            "showOrHide"
          ],
          "outputs": [
            "click"
          ]
        },
        "u_5zPNj": {
          "id": "u_5zPNj",
          "def": {
            "namespace": "mybricks.normal-pc.page-router",
            "version": "1.0.5",
            "rtType": "js",
            "materialId": 41566
          },
          "title": "跳转到...",
          "model": {
            "data": {
              "type": "pushState",
              "url": "/page/fangzhou/selfconfig/op/list",
              "useDynamic": true
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
            "routerAction"
          ],
          "outputs": []
        },
        "u_B7Y2_": {
          "id": "u_B7Y2_",
          "def": {
            "namespace": "mybricks.basic-comlib.dragable-layout",
            "version": "1.0.7",
            "materialId": 47988
          },
          "title": "Halo审批布局",
          "model": {
            "data": {
              "style": {},
              "rows": [
                {
                  "key": "u_6m56hd",
                  "height": "auto",
                  "heightMode": "px",
                  "style": {
                    "flexDirection": "row",
                    "display": "block",
                    "flexWrap": "wrap",
                    "position": "absolute",
                    "justifyContent": "center",
                    "alignItems": "center",
                    "rowGap": 0,
                    "columnGap": 0
                  },
                  "cols": [
                    {
                      "key": "u_363bkt",
                      "width": 300,
                      "widthMode": "%",
                      "span": 5,
                      "slotStyle": {
                        "display": "flex",
                        "position": "inherit",
                        "flexDirection": "column",
                        "alignItems": "flex-start",
                        "justifyContent": "flex-start",
                        "flexWrap": "nowrap"
                      }
                    },
                    {
                      "key": "u_dxekhy",
                      "width": 300,
                      "widthMode": "%",
                      "span": 14,
                      "slotStyle": {
                        "display": "flex",
                        "position": "inherit",
                        "flexDirection": "column",
                        "alignItems": "center",
                        "justifyContent": "center",
                        "flexWrap": "nowrap",
                        "rowGap": 0,
                        "columnGap": 0
                      },
                      "isDragging": false
                    },
                    {
                      "key": "u_4n7k68",
                      "width": 300,
                      "widthMode": "%",
                      "span": 5,
                      "slotStyle": {
                        "display": "flex",
                        "position": "inherit",
                        "flexDirection": "column",
                        "alignItems": "flex-start",
                        "justifyContent": "flex-start",
                        "flexWrap": "nowrap"
                      }
                    }
                  ]
                },
                {
                  "key": "u_3rstaz",
                  "height": "auto",
                  "heightMode": "px",
                  "style": {
                    "flexDirection": "row",
                    "display": "flex",
                    "flexWrap": "wrap",
                    "position": "relative",
                    "justifyContent": "flex-start",
                    "alignItems": "center",
                    "rowGap": 0,
                    "columnGap": 0
                  },
                  "cols": [
                    {
                      "key": "u_n36mz8",
                      "width": 300,
                      "widthMode": "auto",
                      "span": 12,
                      "slotStyle": {
                        "display": "flex",
                        "position": "inherit",
                        "flexDirection": "column",
                        "alignItems": "flex-end",
                        "justifyContent": "center",
                        "flexWrap": "nowrap",
                        "rowGap": 0,
                        "columnGap": 0
                      }
                    },
                    {
                      "key": "u_ftfzk3",
                      "width": 300,
                      "widthMode": "auto",
                      "span": 12,
                      "slotStyle": {
                        "display": "flex",
                        "position": "inherit",
                        "flexDirection": "column",
                        "alignItems": "flex-start",
                        "justifyContent": "flex-start",
                        "flexWrap": "nowrap"
                      }
                    }
                  ]
                },
                {
                  "key": "u_ykb403",
                  "height": "auto",
                  "heightMode": "px",
                  "style": {
                    "flexDirection": "row",
                    "display": "flex",
                    "flexWrap": "wrap",
                    "position": "relative",
                    "justifyContent": "flex-start",
                    "alignItems": "center",
                    "rowGap": 0,
                    "columnGap": 0
                  },
                  "cols": [
                    {
                      "key": "u_y8rcf5",
                      "width": 300,
                      "widthMode": "auto",
                      "span": 12,
                      "slotStyle": {
                        "display": "flex",
                        "position": "inherit",
                        "flexDirection": "column",
                        "alignItems": "flex-end",
                        "justifyContent": "center",
                        "flexWrap": "nowrap",
                        "rowGap": 0,
                        "columnGap": 0
                      }
                    },
                    {
                      "key": "u_b8bee4",
                      "width": 300,
                      "widthMode": "auto",
                      "span": 12,
                      "slotStyle": {
                        "display": "flex",
                        "position": "inherit",
                        "flexDirection": "column",
                        "alignItems": "flex-start",
                        "justifyContent": "center",
                        "flexWrap": "nowrap",
                        "rowGap": 0,
                        "columnGap": 0
                      }
                    }
                  ]
                },
                {
                  "key": "u_kj2hrb",
                  "height": "auto",
                  "heightMode": "px",
                  "style": {
                    "flexDirection": "row",
                    "display": "flex",
                    "flexWrap": "wrap",
                    "position": "relative",
                    "justifyContent": "flex-start",
                    "alignItems": "center",
                    "rowGap": 0,
                    "columnGap": 0
                  },
                  "cols": [
                    {
                      "key": "u_dtbd0r",
                      "width": 300,
                      "widthMode": "auto",
                      "span": 12,
                      "slotStyle": {
                        "display": "flex",
                        "position": "inherit",
                        "flexDirection": "column",
                        "alignItems": "flex-end",
                        "justifyContent": "center",
                        "flexWrap": "nowrap",
                        "rowGap": 0,
                        "columnGap": 0
                      }
                    },
                    {
                      "key": "u_sfkzfh",
                      "width": 300,
                      "widthMode": "auto",
                      "span": 12,
                      "slotStyle": {
                        "display": "flex",
                        "position": "inherit",
                        "flexDirection": "column",
                        "alignItems": "flex-start",
                        "justifyContent": "center",
                        "flexWrap": "nowrap",
                        "rowGap": 0,
                        "columnGap": 0
                      }
                    }
                  ]
                },
                {
                  "key": "u_7wp6w9",
                  "height": "auto",
                  "heightMode": "px",
                  "style": {
                    "flexDirection": "row",
                    "display": "flex",
                    "flexWrap": "wrap",
                    "position": "relative",
                    "justifyContent": "center",
                    "alignItems": "center",
                    "rowGap": 0,
                    "columnGap": 0
                  },
                  "cols": []
                },
                {
                  "key": "u_has6yt",
                  "height": "auto",
                  "heightMode": "auto",
                  "style": {
                    "flexDirection": "row",
                    "display": "flex",
                    "flexWrap": "wrap",
                    "position": "relative",
                    "justifyContent": "center",
                    "alignItems": "center",
                    "rowGap": 0,
                    "columnGap": 0
                  },
                  "cols": [
                    {
                      "key": "u_cmij0r",
                      "width": 300,
                      "widthMode": "auto",
                      "span": 12,
                      "slotStyle": {
                        "display": "flex",
                        "position": "inherit",
                        "flexDirection": "column",
                        "alignItems": "flex-start",
                        "justifyContent": "center",
                        "flexWrap": "nowrap",
                        "rowGap": 0,
                        "columnGap": 0
                      }
                    }
                  ]
                }
              ]
            },
            "inputAry": [],
            "outputAry": [
              "u_tj20k8",
              "u_cmij0r",
              "u_d5cncb",
              "u_piemtz",
              "u_n36mz8",
              "u_ftfzk3",
              "u_y8rcf5",
              "u_b8bee4",
              "u_dtbd0r",
              "u_sfkzfh",
              "u_363bkt",
              "u_dxekhy",
              "u_4n7k68",
              "u_5sz6mm",
              "u_xb8adj",
              "u_3bakeh"
            ],
            "outputEvents": {
              "u_d5cncb": [
                {
                  "type": "defined",
                  "options": {},
                  "active": true
                }
              ],
              "u_cmij0r": [
                {
                  "type": "defined",
                  "options": {},
                  "active": true
                }
              ],
              "u_piemtz": [
                {
                  "type": "defined",
                  "options": {},
                  "active": true
                }
              ],
              "u_tj20k8": [
                {
                  "type": "defined",
                  "options": {},
                  "active": true
                }
              ],
              "u_y8rcf5": [
                {
                  "type": "defined",
                  "options": {},
                  "active": true
                }
              ],
              "u_n36mz8": [
                {
                  "type": "defined",
                  "options": {},
                  "active": true
                }
              ],
              "u_dtbd0r": [
                {
                  "type": "defined",
                  "options": {},
                  "active": true
                }
              ],
              "u_b8bee4": [
                {
                  "type": "defined",
                  "options": {},
                  "active": true
                }
              ],
              "u_ftfzk3": [
                {
                  "type": "defined",
                  "options": {},
                  "active": true
                }
              ],
              "u_sfkzfh": [
                {
                  "type": "defined",
                  "options": {},
                  "active": true
                }
              ],
              "u_363bkt": [
                {
                  "type": "defined",
                  "options": {},
                  "active": true
                }
              ],
              "u_dxekhy": [
                {
                  "type": "defined",
                  "options": {},
                  "active": true
                }
              ],
              "u_5sz6mm": [
                {
                  "type": "defined",
                  "options": {},
                  "active": true
                }
              ],
              "u_3bakeh": [
                {
                  "type": "defined",
                  "options": {},
                  "active": true
                }
              ],
              "u_xb8adj": [
                {
                  "type": "defined",
                  "options": {},
                  "active": true
                }
              ],
              "u_4n7k68": [
                {
                  "type": "defined",
                  "options": {},
                  "active": true
                }
              ],
              "col1": [
                {
                  "type": "defined",
                  "options": {},
                  "active": true
                }
              ],
              "col0": [
                {
                  "type": "defined",
                  "options": {},
                  "active": true
                }
              ]
            },
            "style": {
              "width": "100%",
              "styleAry": [
                {
                  "selector": ".mybricks-layout div[data-layout-col-key=\"row0,col0\"]:not(#u_B7Y2_ *[data-isslot=\"1\"] *)",
                  "css": {
                    "paddingTop": "0px",
                    "paddingRight": "0px",
                    "paddingBottom": "0px",
                    "paddingLeft": "0px"
                  }
                },
                {
                  "selector": ".mybricks-layout div[data-layout-col-key=\"u_7wp6w9,u_d5cncb\"]:not(#u_B7Y2_ *[data-isslot=\"1\"] *)",
                  "css": {
                    "paddingTop": "0px",
                    "paddingRight": "0px",
                    "paddingBottom": "0px",
                    "paddingLeft": "0px"
                  }
                },
                {
                  "selector": ".mybricks-layout div[data-layout-col-key=\"u_has6yt,u_tj20k8\"]:not(#u_B7Y2_ *[data-isslot=\"1\"] *)",
                  "css": {
                    "paddingTop": "0px",
                    "paddingRight": "0px",
                    "paddingBottom": "0px",
                    "paddingLeft": "0px"
                  }
                },
                {
                  "selector": ".mybricks-layout div[data-layout-col-key=\"row0,col1\"]:not(#u_B7Y2_ *[data-isslot=\"1\"] *)",
                  "css": {
                    "paddingTop": "0px",
                    "paddingRight": "0px",
                    "paddingBottom": "0px",
                    "paddingLeft": "0px"
                  }
                },
                {
                  "selector": ".mybricks-layout div[data-layout-col-key=\"u_7wp6w9,u_piemtz\"]:not(#u_B7Y2_ *[data-isslot=\"1\"] *)",
                  "css": {
                    "paddingTop": "0px",
                    "paddingRight": "0px",
                    "paddingBottom": "0px",
                    "paddingLeft": "0px"
                  }
                },
                {
                  "selector": ".mybricks-layout div[data-layout-col-key=\"u_has6yt,u_cmij0r\"]:not(#u_B7Y2_ *[data-isslot=\"1\"] *)",
                  "css": {
                    "paddingTop": "0px",
                    "paddingRight": "0px",
                    "paddingBottom": "0px",
                    "paddingLeft": "0px"
                  }
                }
              ],
              "marginBottom": 0,
              "marginTop": 0,
              "height": "fit-content",
              "_new": true
            }
          },
          "style": {
            "width": 0,
            "height": 0
          },
          "configs": [],
          "_inputs": [],
          "inputs": [
            "setWidth",
            "show",
            "hide",
            "showOrHide"
          ],
          "outputs": [
            "col0",
            "col1",
            "u_cmij0r",
            "u_n36mz8",
            "u_ftfzk3",
            "u_y8rcf5",
            "u_b8bee4",
            "u_dtbd0r",
            "u_sfkzfh",
            "u_363bkt",
            "u_dxekhy",
            "u_4n7k68"
          ]
        },
        "u_Asd5z": {
          "id": "u_Asd5z",
          "def": {
            "namespace": "mybricks.normal-pc.tagList",
            "version": "1.0.12",
            "materialId": 47516
          },
          "title": "审批状态标签",
          "model": {
            "data": {
              "align": "start",
              "direction": "horizontal",
              "wrap": true,
              "type": "default",
              "tags": [
                {
                  "key": "tag1",
                  "content": "审批状态：",
                  "color": "default",
                  "icon": "ClockCircleOutlined"
                }
              ],
              "tagSize": "small-tag",
              "dynamic": false,
              "appendBtn": {
                "text": "新增",
                "icon": "PlusOutlined"
              }
            },
            "inputAry": [],
            "outputAry": [],
            "outputEvents": {},
            "style": {
              "width": "fit-content",
              "styleAry": [
                {
                  "selector": "div[data-root=\"root\"] span[data-item-tag=\"tag\"]",
                  "css": {
                    "letterSpacing": "normal",
                    "textAlign": "right"
                  }
                },
                {
                  "selector": "div[data-root] span[data-index=\"0\"]",
                  "css": {
                    "color": "#2f54eb",
                    "fontSize": "18px",
                    "lineHeight": "18px",
                    "textAlign": "right",
                    "borderTopColor": "#ffffff00",
                    "borderRightColor": "#ffffff00",
                    "borderBottomColor": "#ffffff00",
                    "borderLeftColor": "#ffffff00",
                    "backgroundColor": "#ffffff",
                    "letterSpacing": "normal",
                    "borderTopWidth": "10px",
                    "borderRightWidth": "10px",
                    "borderBottomWidth": "10px",
                    "borderLeftWidth": "10px",
                    "borderTopStyle": "solid",
                    "borderRightStyle": "solid",
                    "borderBottomStyle": "solid",
                    "borderLeftStyle": "solid"
                  }
                }
              ],
              "marginLeft": 0,
              "maxWidth": "fit-content",
              "height": "fit-content",
              "_new": true
            }
          },
          "style": {
            "width": 0,
            "height": 0
          },
          "configs": [],
          "_inputs": [],
          "inputs": [
            "show",
            "hide",
            "showOrHide"
          ],
          "outputs": []
        },
        "u_YQV_d": {
          "id": "u_YQV_d",
          "def": {
            "namespace": "mybricks.basic-comlib._muilt-inputJs",
            "version": "1.0.2",
            "rtType": "js-autorun",
            "materialId": 46406
          },
          "title": "JS计算15",
          "model": {
            "data": {
              "fns": {
                "code": "(%7B%20outputs%2C%20inputs%20%7D)%20%3D%3E%20%7B%0A%20%20const%20%5B%20inputValue0%20%5D%20%3D%20inputs%3B%0A%20%20const%20%5B%20output0%2C%20output1%20%5D%20%3D%20outputs%3B%0A%20%20if(inputValue0%5B'showPublishSTAGING'%5D%20%3D%3D%20true)%20%7B%0A%20%20%20%20%20%20output0(1)%3B%0A%20%20%7D%20else%20%7B%0A%20%20%20%20%20%20output1(1)%3B%0A%20%20%7D%0A%7D",
                "transformCode": "(function()%20%7B%20var%20_RTFN_%3B%20%0A%22use%20strict%22%3B%0A%0Afunction%20_slicedToArray(arr%2C%20i)%20%7B%20return%20_arrayWithHoles(arr)%20%7C%7C%20_iterableToArrayLimit(arr%2C%20i)%20%7C%7C%20_unsupportedIterableToArray(arr%2C%20i)%20%7C%7C%20_nonIterableRest()%3B%20%7D%0A%0Afunction%20_nonIterableRest()%20%7B%20throw%20new%20TypeError(%22Invalid%20attempt%20to%20destructure%20non-iterable%20instance.%5CnIn%20order%20to%20be%20iterable%2C%20non-array%20objects%20must%20have%20a%20%5BSymbol.iterator%5D()%20method.%22)%3B%20%7D%0A%0Afunction%20_unsupportedIterableToArray(o%2C%20minLen)%20%7B%20if%20(!o)%20return%3B%20if%20(typeof%20o%20%3D%3D%3D%20%22string%22)%20return%20_arrayLikeToArray(o%2C%20minLen)%3B%20var%20n%20%3D%20Object.prototype.toString.call(o).slice(8%2C%20-1)%3B%20if%20(n%20%3D%3D%3D%20%22Object%22%20%26%26%20o.constructor)%20n%20%3D%20o.constructor.name%3B%20if%20(n%20%3D%3D%3D%20%22Map%22%20%7C%7C%20n%20%3D%3D%3D%20%22Set%22)%20return%20Array.from(o)%3B%20if%20(n%20%3D%3D%3D%20%22Arguments%22%20%7C%7C%20%2F%5E(%3F%3AUi%7CI)nt(%3F%3A8%7C16%7C32)(%3F%3AClamped)%3FArray%24%2F.test(n))%20return%20_arrayLikeToArray(o%2C%20minLen)%3B%20%7D%0A%0Afunction%20_arrayLikeToArray(arr%2C%20len)%20%7B%20if%20(len%20%3D%3D%20null%20%7C%7C%20len%20%3E%20arr.length)%20len%20%3D%20arr.length%3B%20for%20(var%20i%20%3D%200%2C%20arr2%20%3D%20new%20Array(len)%3B%20i%20%3C%20len%3B%20i%2B%2B)%20%7B%20arr2%5Bi%5D%20%3D%20arr%5Bi%5D%3B%20%7D%20return%20arr2%3B%20%7D%0A%0Afunction%20_iterableToArrayLimit(arr%2C%20i)%20%7B%20var%20_i%20%3D%20arr%20%3D%3D%20null%20%3F%20null%20%3A%20typeof%20Symbol%20!%3D%3D%20%22undefined%22%20%26%26%20arr%5BSymbol.iterator%5D%20%7C%7C%20arr%5B%22%40%40iterator%22%5D%3B%20if%20(_i%20%3D%3D%20null)%20return%3B%20var%20_arr%20%3D%20%5B%5D%3B%20var%20_n%20%3D%20true%3B%20var%20_d%20%3D%20false%3B%20var%20_s%2C%20_e%3B%20try%20%7B%20for%20(_i%20%3D%20_i.call(arr)%3B%20!(_n%20%3D%20(_s%20%3D%20_i.next()).done)%3B%20_n%20%3D%20true)%20%7B%20_arr.push(_s.value)%3B%20if%20(i%20%26%26%20_arr.length%20%3D%3D%3D%20i)%20break%3B%20%7D%20%7D%20catch%20(err)%20%7B%20_d%20%3D%20true%3B%20_e%20%3D%20err%3B%20%7D%20finally%20%7B%20try%20%7B%20if%20(!_n%20%26%26%20_i%5B%22return%22%5D%20!%3D%20null)%20_i%5B%22return%22%5D()%3B%20%7D%20finally%20%7B%20if%20(_d)%20throw%20_e%3B%20%7D%20%7D%20return%20_arr%3B%20%7D%0A%0Afunction%20_arrayWithHoles(arr)%20%7B%20if%20(Array.isArray(arr))%20return%20arr%3B%20%7D%0A%0A_RTFN_%20%3D%20function%20_RTFN_(_ref)%20%7B%0A%20%20var%20outputs%20%3D%20_ref.outputs%2C%0A%20%20%20%20%20%20inputs%20%3D%20_ref.inputs%3B%0A%0A%20%20var%20_inputs%20%3D%20_slicedToArray(inputs%2C%201)%2C%0A%20%20%20%20%20%20inputValue0%20%3D%20_inputs%5B0%5D%3B%0A%0A%20%20var%20_outputs%20%3D%20_slicedToArray(outputs%2C%202)%2C%0A%20%20%20%20%20%20output0%20%3D%20_outputs%5B0%5D%2C%0A%20%20%20%20%20%20output1%20%3D%20_outputs%5B1%5D%3B%0A%0A%20%20if%20(inputValue0%5B'showPublishSTAGING'%5D%20%3D%3D%20true)%20%7B%0A%20%20%20%20output0(1)%3B%0A%20%20%7D%20else%20%7B%0A%20%20%20%20output1(1)%3B%0A%20%20%7D%0A%7D%3B%0A%3B%20return%20_RTFN_%3B%20%7D)()"
              }
            },
            "inputAry": [],
            "outputAry": [
              "output1"
            ],
            "outputEvents": {},
            "style": {
              "display": "block"
            }
          },
          "style": {},
          "configs": [],
          "_inputs": [],
          "inputs": [
            "input.inputValue0"
          ],
          "outputs": [
            "output0",
            "output1"
          ]
        },
        "u_jaWWl": {
          "id": "u_jaWWl",
          "def": {
            "namespace": "mybricks.normal-pc.grid",
            "version": "1.0.44",
            "materialId": 47857
          },
          "title": "栅格布局",
          "model": {
            "data": {
              "rows": [
                {
                  "key": "row_0",
                  "justify": "start",
                  "align": "stretch",
                  "gutter": [
                    0,
                    0
                  ],
                  "wrap": true,
                  "columns": [
                    {
                      "span": 12,
                      "key": "column_0",
                      "slot": "slot_0",
                      "widthOption": "span",
                      "width": 300,
                      "flex": 1,
                      "legacyStyle": {
                        "overflowX": "hidden",
                        "overflowY": "hidden"
                      },
                      "slotStyle": {
                        "display": "flex",
                        "position": "inherit",
                        "flexDirection": "column",
                        "alignItems": "flex-end",
                        "justifyContent": "center",
                        "flexWrap": "nowrap",
                        "rowGap": 0,
                        "columnGap": 0
                      }
                    },
                    {
                      "span": 8,
                      "key": "column_1",
                      "slot": "slot_1",
                      "widthOption": "auto",
                      "width": 300,
                      "flex": 1,
                      "legacyStyle": {
                        "overflowX": "hidden",
                        "overflowY": "hidden"
                      },
                      "slotStyle": {
                        "display": "flex",
                        "position": "inherit",
                        "flexDirection": "column",
                        "alignItems": "center",
                        "justifyContent": "flex-start",
                        "flexWrap": "nowrap",
                        "rowGap": 0,
                        "columnGap": 0
                      }
                    }
                  ]
                }
              ],
              "style": {},
              "widthUnit": "%"
            },
            "inputAry": [],
            "outputAry": [],
            "outputEvents": {},
            "style": {
              "width": "100%",
              "height": "fit-content",
              "_new": true
            }
          },
          "style": {
            "width": 0,
            "height": 0
          },
          "configs": [],
          "_inputs": [],
          "inputs": [
            "show",
            "hide",
            "showOrHide"
          ],
          "outputs": []
        },
        "u_idZyY": {
          "id": "u_idZyY",
          "def": {
            "namespace": "mybricks.normal-pc.custom-container",
            "version": "1.0.24",
            "materialId": 48068
          },
          "title": "自定义容器",
          "model": {
            "data": {
              "style": {},
              "slotStyle": {
                "display": "flex",
                "position": "inherit",
                "flexDirection": "column",
                "alignItems": "center",
                "justifyContent": "center",
                "flexWrap": "nowrap",
                "rowGap": 0,
                "columnGap": 0
              },
              "legacyConfigStyle": {},
              "legacyStyle": {
                "maxHeight": ""
              }
            },
            "inputAry": [],
            "outputAry": [],
            "outputEvents": {
              "change": [
                {
                  "type": "defined",
                  "options": {},
                  "active": true
                }
              ]
            },
            "style": {
              "height": "100%",
              "width": "100%",
              "marginBottom": 0,
              "marginTop": 0,
              "flex": null,
              "_new": true
            }
          },
          "style": {
            "width": 0,
            "height": 0
          },
          "configs": [
            "style",
            "id"
          ],
          "_inputs": [],
          "inputs": [
            "show",
            "hide",
            "showOrHide"
          ],
          "outputs": []
        },
        "u_KdPEy": {
          "id": "u_KdPEy",
          "def": {
            "namespace": "mybricks.basic-comlib._muilt-inputJs",
            "version": "1.0.2",
            "rtType": "js-autorun",
            "materialId": 46406
          },
          "title": "JS计算15",
          "model": {
            "data": {
              "fns": {
                "code": "(%7B%20outputs%2C%20inputs%20%7D)%20%3D%3E%20%7B%0A%20%20const%20%5B%20inputValue0%20%5D%20%3D%20inputs%3B%0A%20%20const%20%5B%20output0%2C%20output1%20%5D%20%3D%20outputs%3B%0A%20%20if(inputValue0%5B'showPassSTAGING'%5D%20%3D%3D%20true)%20%7B%0A%20%20%20%20%20%20output0(1)%3B%0A%20%20%7D%20else%20%7B%0A%20%20%20%20%20%20output1(1)%3B%0A%20%20%7D%0A%7D",
                "transformCode": "(function()%20%7B%20var%20_RTFN_%3B%20%0A%22use%20strict%22%3B%0A%0Afunction%20_slicedToArray(arr%2C%20i)%20%7B%20return%20_arrayWithHoles(arr)%20%7C%7C%20_iterableToArrayLimit(arr%2C%20i)%20%7C%7C%20_unsupportedIterableToArray(arr%2C%20i)%20%7C%7C%20_nonIterableRest()%3B%20%7D%0A%0Afunction%20_nonIterableRest()%20%7B%20throw%20new%20TypeError(%22Invalid%20attempt%20to%20destructure%20non-iterable%20instance.%5CnIn%20order%20to%20be%20iterable%2C%20non-array%20objects%20must%20have%20a%20%5BSymbol.iterator%5D()%20method.%22)%3B%20%7D%0A%0Afunction%20_unsupportedIterableToArray(o%2C%20minLen)%20%7B%20if%20(!o)%20return%3B%20if%20(typeof%20o%20%3D%3D%3D%20%22string%22)%20return%20_arrayLikeToArray(o%2C%20minLen)%3B%20var%20n%20%3D%20Object.prototype.toString.call(o).slice(8%2C%20-1)%3B%20if%20(n%20%3D%3D%3D%20%22Object%22%20%26%26%20o.constructor)%20n%20%3D%20o.constructor.name%3B%20if%20(n%20%3D%3D%3D%20%22Map%22%20%7C%7C%20n%20%3D%3D%3D%20%22Set%22)%20return%20Array.from(o)%3B%20if%20(n%20%3D%3D%3D%20%22Arguments%22%20%7C%7C%20%2F%5E(%3F%3AUi%7CI)nt(%3F%3A8%7C16%7C32)(%3F%3AClamped)%3FArray%24%2F.test(n))%20return%20_arrayLikeToArray(o%2C%20minLen)%3B%20%7D%0A%0Afunction%20_arrayLikeToArray(arr%2C%20len)%20%7B%20if%20(len%20%3D%3D%20null%20%7C%7C%20len%20%3E%20arr.length)%20len%20%3D%20arr.length%3B%20for%20(var%20i%20%3D%200%2C%20arr2%20%3D%20new%20Array(len)%3B%20i%20%3C%20len%3B%20i%2B%2B)%20%7B%20arr2%5Bi%5D%20%3D%20arr%5Bi%5D%3B%20%7D%20return%20arr2%3B%20%7D%0A%0Afunction%20_iterableToArrayLimit(arr%2C%20i)%20%7B%20var%20_i%20%3D%20arr%20%3D%3D%20null%20%3F%20null%20%3A%20typeof%20Symbol%20!%3D%3D%20%22undefined%22%20%26%26%20arr%5BSymbol.iterator%5D%20%7C%7C%20arr%5B%22%40%40iterator%22%5D%3B%20if%20(_i%20%3D%3D%20null)%20return%3B%20var%20_arr%20%3D%20%5B%5D%3B%20var%20_n%20%3D%20true%3B%20var%20_d%20%3D%20false%3B%20var%20_s%2C%20_e%3B%20try%20%7B%20for%20(_i%20%3D%20_i.call(arr)%3B%20!(_n%20%3D%20(_s%20%3D%20_i.next()).done)%3B%20_n%20%3D%20true)%20%7B%20_arr.push(_s.value)%3B%20if%20(i%20%26%26%20_arr.length%20%3D%3D%3D%20i)%20break%3B%20%7D%20%7D%20catch%20(err)%20%7B%20_d%20%3D%20true%3B%20_e%20%3D%20err%3B%20%7D%20finally%20%7B%20try%20%7B%20if%20(!_n%20%26%26%20_i%5B%22return%22%5D%20!%3D%20null)%20_i%5B%22return%22%5D()%3B%20%7D%20finally%20%7B%20if%20(_d)%20throw%20_e%3B%20%7D%20%7D%20return%20_arr%3B%20%7D%0A%0Afunction%20_arrayWithHoles(arr)%20%7B%20if%20(Array.isArray(arr))%20return%20arr%3B%20%7D%0A%0A_RTFN_%20%3D%20function%20_RTFN_(_ref)%20%7B%0A%20%20var%20outputs%20%3D%20_ref.outputs%2C%0A%20%20%20%20%20%20inputs%20%3D%20_ref.inputs%3B%0A%0A%20%20var%20_inputs%20%3D%20_slicedToArray(inputs%2C%201)%2C%0A%20%20%20%20%20%20inputValue0%20%3D%20_inputs%5B0%5D%3B%0A%0A%20%20var%20_outputs%20%3D%20_slicedToArray(outputs%2C%202)%2C%0A%20%20%20%20%20%20output0%20%3D%20_outputs%5B0%5D%2C%0A%20%20%20%20%20%20output1%20%3D%20_outputs%5B1%5D%3B%0A%0A%20%20if%20(inputValue0%5B'showPassSTAGING'%5D%20%3D%3D%20true)%20%7B%0A%20%20%20%20output0(1)%3B%0A%20%20%7D%20else%20%7B%0A%20%20%20%20output1(1)%3B%0A%20%20%7D%0A%7D%3B%0A%3B%20return%20_RTFN_%3B%20%7D)()"
              }
            },
            "inputAry": [],
            "outputAry": [
              "output1"
            ],
            "outputEvents": {},
            "style": {
              "display": "block"
            }
          },
          "style": {},
          "configs": [],
          "_inputs": [],
          "inputs": [
            "input.inputValue0"
          ],
          "outputs": [
            "output0",
            "output1"
          ]
        },
        "u_dfyy8": {
          "id": "u_dfyy8",
          "def": {
            "namespace": "mybricks.basic-comlib._muilt-inputJs",
            "version": "1.0.2",
            "rtType": "js-autorun",
            "materialId": 46406
          },
          "title": "JS计算",
          "model": {
            "data": {
              "fns": {
                "code": "(%7B%20outputs%2C%20inputs%20%7D)%20%3D%3E%20%7B%0A%20%20const%20%5B%20inputValue0%20%5D%20%3D%20inputs%3B%0A%20%20const%20%5B%20output0%2C%20output1%20%5D%20%3D%20outputs%3B%0A%20%20if(inputValue0%5B'showPrevStep'%5D%20%3D%3D%20true)%20%7B%0A%20%20%20%20%20%20output0(1)%3B%0A%20%20%7D%20else%20%7B%0A%20%20%20%20%20%20output1(1)%3B%0A%20%20%7D%0A%7D",
                "transformCode": "(function()%20%7B%20var%20_RTFN_%3B%20%0A%22use%20strict%22%3B%0A%0Afunction%20_slicedToArray(arr%2C%20i)%20%7B%20return%20_arrayWithHoles(arr)%20%7C%7C%20_iterableToArrayLimit(arr%2C%20i)%20%7C%7C%20_unsupportedIterableToArray(arr%2C%20i)%20%7C%7C%20_nonIterableRest()%3B%20%7D%0A%0Afunction%20_nonIterableRest()%20%7B%20throw%20new%20TypeError(%22Invalid%20attempt%20to%20destructure%20non-iterable%20instance.%5CnIn%20order%20to%20be%20iterable%2C%20non-array%20objects%20must%20have%20a%20%5BSymbol.iterator%5D()%20method.%22)%3B%20%7D%0A%0Afunction%20_unsupportedIterableToArray(o%2C%20minLen)%20%7B%20if%20(!o)%20return%3B%20if%20(typeof%20o%20%3D%3D%3D%20%22string%22)%20return%20_arrayLikeToArray(o%2C%20minLen)%3B%20var%20n%20%3D%20Object.prototype.toString.call(o).slice(8%2C%20-1)%3B%20if%20(n%20%3D%3D%3D%20%22Object%22%20%26%26%20o.constructor)%20n%20%3D%20o.constructor.name%3B%20if%20(n%20%3D%3D%3D%20%22Map%22%20%7C%7C%20n%20%3D%3D%3D%20%22Set%22)%20return%20Array.from(o)%3B%20if%20(n%20%3D%3D%3D%20%22Arguments%22%20%7C%7C%20%2F%5E(%3F%3AUi%7CI)nt(%3F%3A8%7C16%7C32)(%3F%3AClamped)%3FArray%24%2F.test(n))%20return%20_arrayLikeToArray(o%2C%20minLen)%3B%20%7D%0A%0Afunction%20_arrayLikeToArray(arr%2C%20len)%20%7B%20if%20(len%20%3D%3D%20null%20%7C%7C%20len%20%3E%20arr.length)%20len%20%3D%20arr.length%3B%20for%20(var%20i%20%3D%200%2C%20arr2%20%3D%20new%20Array(len)%3B%20i%20%3C%20len%3B%20i%2B%2B)%20%7B%20arr2%5Bi%5D%20%3D%20arr%5Bi%5D%3B%20%7D%20return%20arr2%3B%20%7D%0A%0Afunction%20_iterableToArrayLimit(arr%2C%20i)%20%7B%20var%20_i%20%3D%20arr%20%3D%3D%20null%20%3F%20null%20%3A%20typeof%20Symbol%20!%3D%3D%20%22undefined%22%20%26%26%20arr%5BSymbol.iterator%5D%20%7C%7C%20arr%5B%22%40%40iterator%22%5D%3B%20if%20(_i%20%3D%3D%20null)%20return%3B%20var%20_arr%20%3D%20%5B%5D%3B%20var%20_n%20%3D%20true%3B%20var%20_d%20%3D%20false%3B%20var%20_s%2C%20_e%3B%20try%20%7B%20for%20(_i%20%3D%20_i.call(arr)%3B%20!(_n%20%3D%20(_s%20%3D%20_i.next()).done)%3B%20_n%20%3D%20true)%20%7B%20_arr.push(_s.value)%3B%20if%20(i%20%26%26%20_arr.length%20%3D%3D%3D%20i)%20break%3B%20%7D%20%7D%20catch%20(err)%20%7B%20_d%20%3D%20true%3B%20_e%20%3D%20err%3B%20%7D%20finally%20%7B%20try%20%7B%20if%20(!_n%20%26%26%20_i%5B%22return%22%5D%20!%3D%20null)%20_i%5B%22return%22%5D()%3B%20%7D%20finally%20%7B%20if%20(_d)%20throw%20_e%3B%20%7D%20%7D%20return%20_arr%3B%20%7D%0A%0Afunction%20_arrayWithHoles(arr)%20%7B%20if%20(Array.isArray(arr))%20return%20arr%3B%20%7D%0A%0A_RTFN_%20%3D%20function%20_RTFN_(_ref)%20%7B%0A%20%20var%20outputs%20%3D%20_ref.outputs%2C%0A%20%20%20%20%20%20inputs%20%3D%20_ref.inputs%3B%0A%0A%20%20var%20_inputs%20%3D%20_slicedToArray(inputs%2C%201)%2C%0A%20%20%20%20%20%20inputValue0%20%3D%20_inputs%5B0%5D%3B%0A%0A%20%20var%20_outputs%20%3D%20_slicedToArray(outputs%2C%202)%2C%0A%20%20%20%20%20%20output0%20%3D%20_outputs%5B0%5D%2C%0A%20%20%20%20%20%20output1%20%3D%20_outputs%5B1%5D%3B%0A%0A%20%20if%20(inputValue0%5B'showPrevStep'%5D%20%3D%3D%20true)%20%7B%0A%20%20%20%20output0(1)%3B%0A%20%20%7D%20else%20%7B%0A%20%20%20%20output1(1)%3B%0A%20%20%7D%0A%7D%3B%0A%3B%20return%20_RTFN_%3B%20%7D)()"
              }
            },
            "inputAry": [],
            "outputAry": [
              "output1"
            ],
            "outputEvents": {},
            "style": {
              "display": "block"
            }
          },
          "style": {},
          "configs": [],
          "_inputs": [],
          "inputs": [
            "input.inputValue0"
          ],
          "outputs": [
            "output0",
            "output1"
          ]
        },
        "u_oKSic": {
          "id": "u_oKSic",
          "def": {
            "namespace": "mybricks.basic-comlib._muilt-inputJs",
            "version": "1.0.2",
            "rtType": "js-autorun",
            "materialId": 46406
          },
          "title": "JS计算14",
          "model": {
            "data": {
              "fns": {
                "code": "(%7B%20outputs%2C%20inputs%20%7D)%20%3D%3E%20%7B%0A%20%20const%20%5B%20inputValue0%20%5D%20%3D%20inputs%3B%0A%20%20const%20%5B%20output0%20%5D%20%3D%20outputs%3B%0A%20%20if%20(inputValue0%20%3D%3D%20false)%20%7B%0A%20%20%20%20output0(%5B0%5D)%3B%0A%20%20%7D%20else%20%7B%0A%20%20%20%20output0(%5B%5D)%0A%20%20%7D%0A%7D",
                "transformCode": "(function()%20%7B%20var%20_RTFN_%3B%20%0A%22use%20strict%22%3B%0A%0Afunction%20_slicedToArray(arr%2C%20i)%20%7B%20return%20_arrayWithHoles(arr)%20%7C%7C%20_iterableToArrayLimit(arr%2C%20i)%20%7C%7C%20_unsupportedIterableToArray(arr%2C%20i)%20%7C%7C%20_nonIterableRest()%3B%20%7D%0A%0Afunction%20_nonIterableRest()%20%7B%20throw%20new%20TypeError(%22Invalid%20attempt%20to%20destructure%20non-iterable%20instance.%5CnIn%20order%20to%20be%20iterable%2C%20non-array%20objects%20must%20have%20a%20%5BSymbol.iterator%5D()%20method.%22)%3B%20%7D%0A%0Afunction%20_unsupportedIterableToArray(o%2C%20minLen)%20%7B%20if%20(!o)%20return%3B%20if%20(typeof%20o%20%3D%3D%3D%20%22string%22)%20return%20_arrayLikeToArray(o%2C%20minLen)%3B%20var%20n%20%3D%20Object.prototype.toString.call(o).slice(8%2C%20-1)%3B%20if%20(n%20%3D%3D%3D%20%22Object%22%20%26%26%20o.constructor)%20n%20%3D%20o.constructor.name%3B%20if%20(n%20%3D%3D%3D%20%22Map%22%20%7C%7C%20n%20%3D%3D%3D%20%22Set%22)%20return%20Array.from(o)%3B%20if%20(n%20%3D%3D%3D%20%22Arguments%22%20%7C%7C%20%2F%5E(%3F%3AUi%7CI)nt(%3F%3A8%7C16%7C32)(%3F%3AClamped)%3FArray%24%2F.test(n))%20return%20_arrayLikeToArray(o%2C%20minLen)%3B%20%7D%0A%0Afunction%20_arrayLikeToArray(arr%2C%20len)%20%7B%20if%20(len%20%3D%3D%20null%20%7C%7C%20len%20%3E%20arr.length)%20len%20%3D%20arr.length%3B%20for%20(var%20i%20%3D%200%2C%20arr2%20%3D%20new%20Array(len)%3B%20i%20%3C%20len%3B%20i%2B%2B)%20%7B%20arr2%5Bi%5D%20%3D%20arr%5Bi%5D%3B%20%7D%20return%20arr2%3B%20%7D%0A%0Afunction%20_iterableToArrayLimit(arr%2C%20i)%20%7B%20var%20_i%20%3D%20arr%20%3D%3D%20null%20%3F%20null%20%3A%20typeof%20Symbol%20!%3D%3D%20%22undefined%22%20%26%26%20arr%5BSymbol.iterator%5D%20%7C%7C%20arr%5B%22%40%40iterator%22%5D%3B%20if%20(_i%20%3D%3D%20null)%20return%3B%20var%20_arr%20%3D%20%5B%5D%3B%20var%20_n%20%3D%20true%3B%20var%20_d%20%3D%20false%3B%20var%20_s%2C%20_e%3B%20try%20%7B%20for%20(_i%20%3D%20_i.call(arr)%3B%20!(_n%20%3D%20(_s%20%3D%20_i.next()).done)%3B%20_n%20%3D%20true)%20%7B%20_arr.push(_s.value)%3B%20if%20(i%20%26%26%20_arr.length%20%3D%3D%3D%20i)%20break%3B%20%7D%20%7D%20catch%20(err)%20%7B%20_d%20%3D%20true%3B%20_e%20%3D%20err%3B%20%7D%20finally%20%7B%20try%20%7B%20if%20(!_n%20%26%26%20_i%5B%22return%22%5D%20!%3D%20null)%20_i%5B%22return%22%5D()%3B%20%7D%20finally%20%7B%20if%20(_d)%20throw%20_e%3B%20%7D%20%7D%20return%20_arr%3B%20%7D%0A%0Afunction%20_arrayWithHoles(arr)%20%7B%20if%20(Array.isArray(arr))%20return%20arr%3B%20%7D%0A%0A_RTFN_%20%3D%20function%20_RTFN_(_ref)%20%7B%0A%20%20var%20outputs%20%3D%20_ref.outputs%2C%0A%20%20%20%20%20%20inputs%20%3D%20_ref.inputs%3B%0A%0A%20%20var%20_inputs%20%3D%20_slicedToArray(inputs%2C%201)%2C%0A%20%20%20%20%20%20inputValue0%20%3D%20_inputs%5B0%5D%3B%0A%0A%20%20var%20_outputs%20%3D%20_slicedToArray(outputs%2C%201)%2C%0A%20%20%20%20%20%20output0%20%3D%20_outputs%5B0%5D%3B%0A%0A%20%20if%20(inputValue0%20%3D%3D%20false)%20%7B%0A%20%20%20%20output0(%5B0%5D)%3B%0A%20%20%7D%20else%20%7B%0A%20%20%20%20output0(%5B%5D)%3B%0A%20%20%7D%0A%7D%3B%0A%3B%20return%20_RTFN_%3B%20%7D)()"
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
            "input.inputValue0"
          ],
          "outputs": [
            "output0"
          ]
        },
        "u_9LWxV": {
          "id": "u_9LWxV",
          "def": {
            "namespace": "mybricks.basic-comlib._muilt-inputJs",
            "version": "1.0.2",
            "rtType": "js-autorun",
            "materialId": 46406
          },
          "title": "JS计算15",
          "model": {
            "data": {
              "fns": {
                "code": "(%7B%20outputs%2C%20inputs%20%7D)%20%3D%3E%20%7B%0A%20%20const%20%5B%20inputValue0%2C%20inputValue1%20%5D%20%3D%20inputs%3B%0A%20%20const%20%5B%20output0%20%5D%20%3D%20outputs%3B%0A%20%20if%20(inputValue1%20%3D%3D%20false)%20%7B%0A%20%20%20%20output0(inputValue0%20-%201)%3B%0A%20%20%7D%20else%20%7B%0A%20%20%20%20output0(inputValue0)%3B%0A%20%20%7D%0A%7D",
                "transformCode": "(function()%20%7B%20var%20_RTFN_%3B%20%0A%22use%20strict%22%3B%0A%0Afunction%20_slicedToArray(arr%2C%20i)%20%7B%20return%20_arrayWithHoles(arr)%20%7C%7C%20_iterableToArrayLimit(arr%2C%20i)%20%7C%7C%20_unsupportedIterableToArray(arr%2C%20i)%20%7C%7C%20_nonIterableRest()%3B%20%7D%0A%0Afunction%20_nonIterableRest()%20%7B%20throw%20new%20TypeError(%22Invalid%20attempt%20to%20destructure%20non-iterable%20instance.%5CnIn%20order%20to%20be%20iterable%2C%20non-array%20objects%20must%20have%20a%20%5BSymbol.iterator%5D()%20method.%22)%3B%20%7D%0A%0Afunction%20_unsupportedIterableToArray(o%2C%20minLen)%20%7B%20if%20(!o)%20return%3B%20if%20(typeof%20o%20%3D%3D%3D%20%22string%22)%20return%20_arrayLikeToArray(o%2C%20minLen)%3B%20var%20n%20%3D%20Object.prototype.toString.call(o).slice(8%2C%20-1)%3B%20if%20(n%20%3D%3D%3D%20%22Object%22%20%26%26%20o.constructor)%20n%20%3D%20o.constructor.name%3B%20if%20(n%20%3D%3D%3D%20%22Map%22%20%7C%7C%20n%20%3D%3D%3D%20%22Set%22)%20return%20Array.from(o)%3B%20if%20(n%20%3D%3D%3D%20%22Arguments%22%20%7C%7C%20%2F%5E(%3F%3AUi%7CI)nt(%3F%3A8%7C16%7C32)(%3F%3AClamped)%3FArray%24%2F.test(n))%20return%20_arrayLikeToArray(o%2C%20minLen)%3B%20%7D%0A%0Afunction%20_arrayLikeToArray(arr%2C%20len)%20%7B%20if%20(len%20%3D%3D%20null%20%7C%7C%20len%20%3E%20arr.length)%20len%20%3D%20arr.length%3B%20for%20(var%20i%20%3D%200%2C%20arr2%20%3D%20new%20Array(len)%3B%20i%20%3C%20len%3B%20i%2B%2B)%20%7B%20arr2%5Bi%5D%20%3D%20arr%5Bi%5D%3B%20%7D%20return%20arr2%3B%20%7D%0A%0Afunction%20_iterableToArrayLimit(arr%2C%20i)%20%7B%20var%20_i%20%3D%20arr%20%3D%3D%20null%20%3F%20null%20%3A%20typeof%20Symbol%20!%3D%3D%20%22undefined%22%20%26%26%20arr%5BSymbol.iterator%5D%20%7C%7C%20arr%5B%22%40%40iterator%22%5D%3B%20if%20(_i%20%3D%3D%20null)%20return%3B%20var%20_arr%20%3D%20%5B%5D%3B%20var%20_n%20%3D%20true%3B%20var%20_d%20%3D%20false%3B%20var%20_s%2C%20_e%3B%20try%20%7B%20for%20(_i%20%3D%20_i.call(arr)%3B%20!(_n%20%3D%20(_s%20%3D%20_i.next()).done)%3B%20_n%20%3D%20true)%20%7B%20_arr.push(_s.value)%3B%20if%20(i%20%26%26%20_arr.length%20%3D%3D%3D%20i)%20break%3B%20%7D%20%7D%20catch%20(err)%20%7B%20_d%20%3D%20true%3B%20_e%20%3D%20err%3B%20%7D%20finally%20%7B%20try%20%7B%20if%20(!_n%20%26%26%20_i%5B%22return%22%5D%20!%3D%20null)%20_i%5B%22return%22%5D()%3B%20%7D%20finally%20%7B%20if%20(_d)%20throw%20_e%3B%20%7D%20%7D%20return%20_arr%3B%20%7D%0A%0Afunction%20_arrayWithHoles(arr)%20%7B%20if%20(Array.isArray(arr))%20return%20arr%3B%20%7D%0A%0A_RTFN_%20%3D%20function%20_RTFN_(_ref)%20%7B%0A%20%20var%20outputs%20%3D%20_ref.outputs%2C%0A%20%20%20%20%20%20inputs%20%3D%20_ref.inputs%3B%0A%0A%20%20var%20_inputs%20%3D%20_slicedToArray(inputs%2C%202)%2C%0A%20%20%20%20%20%20inputValue0%20%3D%20_inputs%5B0%5D%2C%0A%20%20%20%20%20%20inputValue1%20%3D%20_inputs%5B1%5D%3B%0A%0A%20%20var%20_outputs%20%3D%20_slicedToArray(outputs%2C%201)%2C%0A%20%20%20%20%20%20output0%20%3D%20_outputs%5B0%5D%3B%0A%0A%20%20if%20(inputValue1%20%3D%3D%20false)%20%7B%0A%20%20%20%20output0(inputValue0%20-%201)%3B%0A%20%20%7D%20else%20%7B%0A%20%20%20%20output0(inputValue0)%3B%0A%20%20%7D%0A%7D%3B%0A%3B%20return%20_RTFN_%3B%20%7D)()"
              }
            },
            "inputAry": [
              {
                "hostId": "input.inputValue1",
                "title": "参数1",
                "schema": {
                  "type": "follow"
                }
              }
            ],
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
            "input.inputValue0",
            "input.inputValue1"
          ],
          "outputs": [
            "output0"
          ]
        },
        "u__dDQ1": {
          "id": "u__dDQ1",
          "def": {
            "namespace": "mybricks.core-comlib.var",
            "version": "1.0.0",
            "rtType": "js"
          },
          "title": "表单校验结果",
          "model": {
            "data": {
              "initValue": true
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
            "get",
            "set",
            "reset"
          ],
          "outputs": [
            "return",
            "changed"
          ]
        },
        "u_s28XG": {
          "id": "u_s28XG",
          "def": {
            "namespace": "mybricks.normal-pc.message",
            "version": "1.0.4",
            "rtType": "js",
            "materialId": 44978
          },
          "title": "消息提示6",
          "model": {
            "data": {
              "title": "提示名称",
              "content": "弹出提示",
              "duration": 3,
              "type": "warning",
              "isExternal": true,
              "isEnd": false
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
          "outputs": []
        },
        "u_Yi2PA": {
          "id": "u_Yi2PA",
          "def": {
            "namespace": "mybricks.marketing-tools.json-schema-form-com",
            "version": "1.1.2",
            "materialId": 49094
          },
          "title": "PRT表单",
          "model": {
            "data": {
              "content": {
                "jsonSchema": {},
                "uiSchema": {},
                "formData": {}
              }
            },
            "inputAry": [],
            "outputAry": [],
            "outputEvents": {
              "change": [
                {
                  "type": "defined",
                  "options": {
                    "id": "u__Rfox",
                    "title": "rjsf表单 > 表单内容变化"
                  },
                  "active": true
                }
              ],
              "validated": [
                {
                  "type": "defined",
                  "options": {
                    "id": "u_RPuDJ",
                    "title": "rjsf表单 > 表单校验完成"
                  },
                  "active": true
                }
              ]
            },
            "style": {
              "width": "fit-content",
              "height": "fit-content",
              "marginRight": 20,
              "maxWidth": "fit-content",
              "_new": true
            }
          },
          "style": {
            "width": 0,
            "height": 0
          },
          "configs": [],
          "_inputs": [],
          "inputs": [
            "content",
            "show",
            "hide",
            "showOrHide"
          ],
          "outputs": [
            "change",
            "validated"
          ]
        },
        "u_HlA1y": {
          "id": "u_HlA1y",
          "def": {
            "namespace": "mybricks.marketing-tools.json-schema-form-com",
            "version": "1.1.2",
            "materialId": 49094
          },
          "title": "STAGING表单",
          "model": {
            "data": {
              "content": {
                "jsonSchema": {},
                "uiSchema": {},
                "formData": {}
              }
            },
            "inputAry": [],
            "outputAry": [],
            "outputEvents": {
              "change": [
                {
                  "type": "defined",
                  "options": {
                    "id": "u_81_Jm",
                    "title": "rjsf表单1 > 表单内容变化"
                  },
                  "active": true
                }
              ],
              "validated": [
                {
                  "type": "defined",
                  "options": {
                    "id": "u_veLVZ",
                    "title": "rjsf表单1 > 表单校验完成"
                  },
                  "active": true
                }
              ]
            },
            "style": {
              "width": "fit-content",
              "height": "fit-content",
              "marginRight": 20,
              "maxWidth": "fit-content",
              "_new": true
            }
          },
          "style": {
            "width": 0,
            "height": 0
          },
          "configs": [],
          "_inputs": [],
          "inputs": [
            "content",
            "show",
            "hide",
            "showOrHide"
          ],
          "outputs": [
            "change",
            "validated"
          ]
        },
        "u_VSeRY": {
          "id": "u_VSeRY",
          "def": {
            "namespace": "mybricks.marketing-tools.json-schema-form-com",
            "version": "1.1.2",
            "materialId": 49094
          },
          "title": "PROD表单",
          "model": {
            "data": {
              "content": {
                "jsonSchema": {},
                "uiSchema": {},
                "formData": {}
              }
            },
            "inputAry": [],
            "outputAry": [],
            "outputEvents": {
              "change": [
                {
                  "type": "defined",
                  "options": {},
                  "active": true
                }
              ],
              "validated": [
                {
                  "type": "defined",
                  "options": {},
                  "active": true
                }
              ]
            },
            "style": {
              "width": "fit-content",
              "marginRight": 20,
              "height": "fit-content",
              "maxWidth": "fit-content",
              "_new": true
            }
          },
          "style": {
            "width": 0,
            "height": 0
          },
          "configs": [],
          "_inputs": [],
          "inputs": [
            "content",
            "show",
            "hide",
            "showOrHide"
          ],
          "outputs": [
            "change",
            "validated"
          ]
        },
        "u_OnAoP": {
          "id": "u_OnAoP",
          "def": {
            "namespace": "mybricks.normal-pc.alert",
            "version": "1.0.7",
            "materialId": 47593
          },
          "title": "警告提示1",
          "model": {
            "data": {
              "type": "warning",
              "message": "%E6%9C%AC%E6%AC%A1%E4%BF%AE%E6%94%B9%E5%B7%B2%E5%8F%91%E5%B8%83%E4%B8%8A%E7%BA%BF%EF%BC%8C%E8%AF%B7%E5%8F%8A%E6%97%B6%E9%AA%8C%E6%94%B6%E7%BA%BF%E4%B8%8A%E6%95%88%E6%9E%9C%EF%BC%8C%E9%AA%8C%E8%AF%81%E9%80%9A%E8%BF%87%E5%90%8E%EF%BC%8C%E7%82%B9%E5%87%BB%E2%80%9C%E7%BA%BF%E4%B8%8A%E5%9B%9E%E6%B5%8B%E9%80%9A%E8%BF%87%E2%80%9D%E5%AE%8C%E6%88%90%E6%9C%AC%E6%AC%A1%E5%8F%91%E5%B8%83%E3%80%82",
              "content": "辅助性文字介绍",
              "isChoose": false,
              "closable": false,
              "showIcon": true,
              "icon": "HomeOutlined",
              "color": "#0075ff",
              "isColor": false,
              "textColor": "",
              "showInfo": false,
              "banner": true,
              "isClose": true,
              "openWidth": false,
              "percentWidth": "100",
              "width": "800",
              "size": "16px"
            },
            "inputAry": [],
            "outputAry": [],
            "outputEvents": {},
            "style": {
              "width": "100%",
              "styleAry": [
                {
                  "selector": ".ant-alert-info",
                  "css": {
                    "backgroundColor": "#ffffff00"
                  }
                },
                {
                  "selector": ".ant-alert-message",
                  "css": {
                    "textAlign": "center",
                    "fontSize": "14px"
                  }
                }
              ],
              "themesId": "_defined",
              "height": "fit-content",
              "_new": true
            }
          },
          "style": {
            "width": 0,
            "height": 0
          },
          "configs": [],
          "_inputs": [],
          "inputs": [
            "inputInfo",
            "description",
            "show",
            "hide",
            "showOrHide"
          ],
          "outputs": []
        },
        "u_w6gVj": {
          "id": "u_w6gVj",
          "def": {
            "namespace": "mybricks.normal-pc.card",
            "version": "1.0.21",
            "materialId": 47249
          },
          "title": "卡片",
          "model": {
            "data": {
              "title": "功能示意图",
              "useExtra": false,
              "bordered": true,
              "hoverable": false,
              "cursor": false,
              "size": "default",
              "style": {},
              "bodyStyle": {},
              "outputContent": 0,
              "dataType": "number",
              "borderStyle": {
                "borderRadius": "4px 4px 4px 4px",
                "borderColor": "#F0F0F0 #F0F0F0 #F0F0F0 #F0F0F0",
                "borderWidth": "1px 1px 1px 1px",
                "borderStyle": "solid solid solid solid"
              },
              "isAction": false,
              "items": [
                {
                  "key": "key1",
                  "name": "操作项1"
                }
              ],
              "padding": "24px"
            },
            "inputAry": [],
            "outputAry": [],
            "outputEvents": {},
            "style": {
              "height": "fit-content",
              "width": "100%",
              "_new": true
            }
          },
          "style": {
            "width": 0,
            "height": 0
          },
          "configs": [
            "hoverable"
          ],
          "_inputs": [],
          "inputs": [
            "title",
            "show",
            "hide",
            "showOrHide"
          ],
          "outputs": []
        },
        "u_DgQGD": {
          "id": "u_DgQGD",
          "def": {
            "namespace": "mybricks.normal-pc.card",
            "version": "1.0.21",
            "materialId": 47249
          },
          "title": "功能示意图卡片",
          "model": {
            "data": {
              "title": "功能示意图",
              "useExtra": false,
              "bordered": true,
              "hoverable": false,
              "cursor": false,
              "size": "default",
              "style": {},
              "bodyStyle": {},
              "outputContent": 0,
              "dataType": "number",
              "borderStyle": {
                "borderRadius": "4px 4px 4px 4px",
                "borderColor": "#F0F0F0 #F0F0F0 #F0F0F0 #F0F0F0",
                "borderWidth": "1px 1px 1px 1px",
                "borderStyle": "solid solid solid solid"
              },
              "isAction": false,
              "items": [
                {
                  "key": "key1",
                  "name": "操作项1"
                }
              ],
              "padding": "24px"
            },
            "inputAry": [],
            "outputAry": [],
            "outputEvents": {},
            "style": {
              "height": "fit-content",
              "width": "100%",
              "_new": true
            }
          },
          "style": {
            "width": 0,
            "height": 0
          },
          "configs": [
            "hoverable"
          ],
          "_inputs": [],
          "inputs": [
            "title",
            "show",
            "hide",
            "showOrHide"
          ],
          "outputs": []
        },
        "u_uNOkF": {
          "id": "u_uNOkF",
          "def": {
            "namespace": "mybricks.normal-pc.card",
            "version": "1.0.21",
            "materialId": 47249
          },
          "title": "功能示意图卡片",
          "model": {
            "data": {
              "title": "功能示意图",
              "useExtra": false,
              "bordered": true,
              "hoverable": false,
              "cursor": false,
              "size": "default",
              "style": {},
              "bodyStyle": {},
              "outputContent": 0,
              "dataType": "number",
              "borderStyle": {
                "borderRadius": "4px 4px 4px 4px",
                "borderColor": "#F0F0F0 #F0F0F0 #F0F0F0 #F0F0F0",
                "borderWidth": "1px 1px 1px 1px",
                "borderStyle": "solid solid solid solid"
              },
              "isAction": false,
              "items": [
                {
                  "key": "key1",
                  "name": "操作项1"
                }
              ],
              "padding": "24px"
            },
            "inputAry": [],
            "outputAry": [],
            "outputEvents": {},
            "style": {
              "height": "fit-content",
              "width": "100%",
              "_new": true
            }
          },
          "style": {
            "width": 0,
            "height": 0
          },
          "configs": [
            "hoverable"
          ],
          "_inputs": [],
          "inputs": [
            "title",
            "show",
            "hide",
            "showOrHide"
          ],
          "outputs": []
        },
        "u_QxeA5": {
          "id": "u_QxeA5",
          "def": {
            "namespace": "mybricks.core-comlib.fn",
            "version": "1.0.0",
            "rtType": "js"
          },
          "title": "主场景的Fx卡片0",
          "model": {
            "data": {},
            "inputAry": [
              {
                "hostId": "param0",
                "title": "输入项",
                "schema": {
                  "type": "unknown"
                }
              }
            ],
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
            "param0"
          ],
          "outputs": []
        },
        "u_q3dd7": {
          "id": "u_q3dd7",
          "def": {
            "namespace": "mybricks.core-comlib.fn",
            "version": "1.0.0",
            "rtType": "js"
          },
          "title": "主场景的Fx卡片0",
          "model": {
            "data": {},
            "inputAry": [
              {
                "hostId": "param0",
                "title": "输入项",
                "schema": {
                  "type": "unknown"
                }
              }
            ],
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
            "param0"
          ],
          "outputs": []
        },
        "u_EpT3d": {
          "id": "u_EpT3d",
          "def": {
            "namespace": "mybricks.core-comlib.fn",
            "version": "1.0.0",
            "rtType": "js"
          },
          "title": "执行操作",
          "model": {
            "data": {},
            "inputAry": [
              {
                "hostId": "param0",
                "title": "输入项",
                "schema": {
                  "type": "unknown"
                }
              }
            ],
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
            "param0"
          ],
          "outputs": []
        },
        "u_z64Io": {
          "id": "u_z64Io",
          "def": {
            "namespace": "mybricks.core-comlib.fn",
            "version": "1.0.0",
            "rtType": "js"
          },
          "title": "执行操作",
          "model": {
            "data": {},
            "inputAry": [
              {
                "hostId": "param0",
                "title": "输入项",
                "schema": {
                  "type": "unknown"
                }
              }
            ],
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
            "param0"
          ],
          "outputs": []
        },
        "u_SAuUF": {
          "id": "u_SAuUF",
          "def": {
            "namespace": "mybricks.core-comlib.fn",
            "version": "1.0.0",
            "rtType": "js"
          },
          "title": "执行操作",
          "model": {
            "data": {},
            "inputAry": [
              {
                "hostId": "param0",
                "title": "输入项",
                "schema": {
                  "type": "unknown"
                }
              }
            ],
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
            "param0"
          ],
          "outputs": []
        },
        "u_opw7D": {
          "id": "u_opw7D",
          "def": {
            "namespace": "mybricks.core-comlib.fn",
            "version": "1.0.0",
            "rtType": "js"
          },
          "title": "执行操作",
          "model": {
            "data": {},
            "inputAry": [
              {
                "hostId": "param0",
                "title": "输入项",
                "schema": {
                  "type": "unknown"
                }
              }
            ],
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
            "param0"
          ],
          "outputs": []
        },
        "u_5uZS5": {
          "id": "u_5uZS5",
          "def": {
            "namespace": "mybricks.core-comlib.fn",
            "version": "1.0.0",
            "rtType": "js"
          },
          "title": "执行操作",
          "model": {
            "data": {},
            "inputAry": [
              {
                "hostId": "param0",
                "title": "输入项",
                "schema": {
                  "type": "unknown"
                }
              }
            ],
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
            "param0"
          ],
          "outputs": []
        },
        "u_xpR1B": {
          "id": "u_xpR1B",
          "def": {
            "namespace": "mybricks.core-comlib.fn",
            "version": "1.0.0",
            "rtType": "js"
          },
          "title": "执行操作",
          "model": {
            "data": {},
            "inputAry": [
              {
                "hostId": "param0",
                "title": "输入项",
                "schema": {
                  "type": "unknown"
                }
              }
            ],
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
            "param0"
          ],
          "outputs": []
        },
        "u_IeTcO": {
          "id": "u_IeTcO",
          "def": {
            "namespace": "mybricks.core-comlib.fn",
            "version": "1.0.0",
            "rtType": "js"
          },
          "title": "执行操作",
          "model": {
            "data": {},
            "inputAry": [
              {
                "hostId": "param0",
                "title": "输入项",
                "schema": {
                  "type": "unknown"
                }
              }
            ],
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
            "param0"
          ],
          "outputs": []
        },
        "u_TpVsg": {
          "id": "u_TpVsg",
          "def": {
            "namespace": "mybricks.normal-pc.tagList",
            "version": "1.0.12",
            "materialId": 47516
          },
          "title": "审批链接标签",
          "model": {
            "data": {
              "align": "start",
              "direction": "horizontal",
              "wrap": true,
              "type": "default",
              "tags": [
                {
                  "key": "tag1",
                  "content": "审批链接：",
                  "color": "default",
                  "icon": "CompassOutlined"
                }
              ],
              "tagSize": "small-tag",
              "dynamic": false,
              "appendBtn": {
                "text": "新增",
                "icon": "PlusOutlined"
              }
            },
            "inputAry": [],
            "outputAry": [],
            "outputEvents": {},
            "style": {
              "width": "fit-content",
              "styleAry": [
                {
                  "selector": "div[data-root=\"root\"] span[data-item-tag=\"tag\"]",
                  "css": {
                    "letterSpacing": "normal",
                    "textAlign": "right"
                  }
                },
                {
                  "selector": "div[data-root] span[data-index=\"0\"]",
                  "css": {
                    "color": "#2f54eb",
                    "fontSize": "18px",
                    "lineHeight": "18px",
                    "textAlign": "right",
                    "borderTopColor": "#ffffff00",
                    "borderRightColor": "#ffffff00",
                    "borderBottomColor": "#ffffff00",
                    "borderLeftColor": "#ffffff00",
                    "backgroundColor": "#ffffff",
                    "letterSpacing": "normal",
                    "borderTopWidth": "10px",
                    "borderRightWidth": "10px",
                    "borderBottomWidth": "10px",
                    "borderLeftWidth": "10px",
                    "borderTopStyle": "solid",
                    "borderRightStyle": "solid",
                    "borderBottomStyle": "solid",
                    "borderLeftStyle": "solid"
                  }
                }
              ],
              "marginLeft": 0,
              "maxWidth": "fit-content",
              "height": "fit-content",
              "_new": true
            }
          },
          "style": {
            "width": 0,
            "height": 0
          },
          "configs": [],
          "_inputs": [],
          "inputs": [
            "show",
            "hide",
            "showOrHide"
          ],
          "outputs": []
        },
        "u_6rCBO": {
          "id": "u_6rCBO",
          "def": {
            "namespace": "mybricks.normal-pc.tagList",
            "version": "1.0.12",
            "materialId": 47516
          },
          "title": "审批人标签",
          "model": {
            "data": {
              "align": "start",
              "direction": "horizontal",
              "wrap": true,
              "type": "default",
              "tags": [
                {
                  "key": "tag1",
                  "content": "最终审批人：",
                  "color": "default",
                  "icon": "UserOutlined"
                }
              ],
              "tagSize": "small-tag",
              "dynamic": false,
              "appendBtn": {
                "text": "新增",
                "icon": "PlusOutlined"
              }
            },
            "inputAry": [],
            "outputAry": [],
            "outputEvents": {},
            "style": {
              "width": "fit-content",
              "styleAry": [
                {
                  "selector": "div[data-root] span[data-index=\"0\"]",
                  "css": {
                    "color": "#2f54eb",
                    "fontSize": "18px",
                    "lineHeight": "18px",
                    "textAlign": "right",
                    "borderTopColor": "#ffffff00",
                    "borderRightColor": "#ffffff00",
                    "borderBottomColor": "#ffffff00",
                    "borderLeftColor": "#ffffff00",
                    "backgroundColor": "#ffffff",
                    "letterSpacing": "normal",
                    "borderTopWidth": "10px",
                    "borderRightWidth": "10px",
                    "borderBottomWidth": "10px",
                    "borderLeftWidth": "10px",
                    "borderTopStyle": "solid",
                    "borderRightStyle": "solid",
                    "borderBottomStyle": "solid",
                    "borderLeftStyle": "solid"
                  }
                },
                {
                  "selector": "div[data-root=\"root\"] span[data-item-tag=\"tag\"]",
                  "css": {
                    "letterSpacing": "normal",
                    "textAlign": "right",
                    "fontSize": "18px",
                    "lineHeight": "18px",
                    "color": "#2f54eb"
                  }
                }
              ],
              "marginLeft": 0,
              "themesId": "_defined",
              "maxWidth": "fit-content",
              "height": "fit-content",
              "_new": true
            }
          },
          "style": {
            "width": 0,
            "height": 0
          },
          "configs": [],
          "_inputs": [],
          "inputs": [
            "show",
            "hide",
            "showOrHide"
          ],
          "outputs": []
        },
        "u_sEU53": {
          "id": "u_sEU53",
          "def": {
            "namespace": "mybricks.normal-pc.tagList",
            "version": "1.0.12",
            "materialId": 47516
          },
          "title": "halo审批状态值标签",
          "model": {
            "data": {
              "align": "start",
              "direction": "horizontal",
              "wrap": true,
              "type": "default",
              "tags": [
                {
                  "key": "tag1",
                  "content": "tag",
                  "color": "default"
                }
              ],
              "tagSize": "small-tag",
              "dynamic": true,
              "appendBtn": {
                "text": "新增",
                "icon": "PlusOutlined"
              }
            },
            "inputAry": [
              {
                "hostId": "dynamicTags",
                "title": "输入动态标签列表",
                "schema": {
                  "type": "array",
                  "items": {
                    "type": "object",
                    "properties": {
                      "icon": {
                        "title": "图标",
                        "type": "string"
                      },
                      "content": {
                        "title": "标签内容",
                        "type": "string"
                      },
                      "color": {
                        "title": "背景颜色",
                        "type": "string"
                      },
                      "closable": {
                        "title": "是否可关闭",
                        "type": "boolean"
                      }
                    }
                  }
                }
              }
            ],
            "outputAry": [],
            "outputEvents": {},
            "style": {
              "width": "fit-content",
              "styleAry": [
                {
                  "selector": "div[data-root=\"root\"] span[data-item-tag=\"tag\"]",
                  "css": {
                    "fontSize": "18px"
                  }
                },
                {
                  "selector": "div[data-root] span[data-index=\"0\"]",
                  "css": {
                    "borderTopWidth": "0px",
                    "borderRightWidth": "0px",
                    "borderBottomWidth": "0px",
                    "borderLeftWidth": "0px",
                    "borderTopStyle": "solid",
                    "borderRightStyle": "solid",
                    "borderBottomStyle": "solid",
                    "borderLeftStyle": "solid",
                    "fontSize": "16px"
                  }
                }
              ],
              "maxWidth": "fit-content",
              "height": "fit-content",
              "_new": true
            }
          },
          "style": {
            "width": 0,
            "height": 0
          },
          "configs": [],
          "_inputs": [],
          "inputs": [
            "dynamicTags",
            "show",
            "hide",
            "showOrHide"
          ],
          "outputs": []
        },
        "u_QLFEc": {
          "id": "u_QLFEc",
          "def": {
            "namespace": "mybricks.normal-pc.link",
            "version": "1.0.5",
            "materialId": 47762
          },
          "title": "halo链接",
          "model": {
            "data": {
              "content": "去提交审批",
              "url": "",
              "isChoose": true,
              "icon": "LinkOutlined",
              "location": "front",
              "style": {},
              "routeType": "openTab"
            },
            "inputAry": [],
            "outputAry": [],
            "outputEvents": {},
            "style": {
              "styleAry": [
                {
                  "selector": ".linkWrapperHover:hover",
                  "css": {
                    "color": "#1890ff",
                    "textAlign": "center"
                  }
                },
                {
                  "selector": ".linkWrapper",
                  "css": {
                    "color": "#1890ff",
                    "fontWeight": "400",
                    "fontSize": "16px",
                    "lineHeight": "20px",
                    "letterSpacing": "0px",
                    "textAlign": "center",
                    "borderTopLeftRadius": "0px",
                    "borderBottomLeftRadius": "0px",
                    "borderBottomRightRadius": "0px",
                    "borderTopRightRadius": "0px",
                    "borderTopColor": "#2f54eb",
                    "borderRightColor": "#2f54eb",
                    "borderBottomColor": "#2f54eb",
                    "borderLeftColor": "#2f54eb"
                  }
                }
              ],
              "width": "fit-content",
              "marginTop": 0,
              "marginBottom": 0,
              "maxWidth": "fit-content",
              "height": "fit-content",
              "_new": true
            }
          },
          "style": {
            "width": 0,
            "height": 0
          },
          "configs": [],
          "_inputs": [],
          "inputs": [
            "content",
            "url",
            "show",
            "hide",
            "showOrHide"
          ],
          "outputs": []
        },
        "u_v8NEV": {
          "id": "u_v8NEV",
          "def": {
            "namespace": "mybricks.basic-comlib._muilt-inputJs",
            "version": "1.0.2",
            "rtType": "js-autorun",
            "materialId": 46406
          },
          "title": "JS计算18",
          "model": {
            "data": {
              "fns": {
                "code": "(%7B%20outputs%2C%20inputs%20%7D)%20%3D%3E%20%7B%0A%20%20const%20%5BinputValue0%5D%20%3D%20inputs%3B%0A%20%20const%20%5Boutput0%2C%20output1%2C%20output2%2C%20output3%2C%20output4%2C%20output5%5D%20%3D%20outputs%3B%0A%20%20if%20(inputValue0)%20%7B%0A%20%20%20%20const%20%7B%0A%20%20%20%20%20%20flowId%2C%0A%20%20%20%20%20%20flowStatus%2C%0A%20%20%20%20%20%20flowStatusDesc%2C%0A%20%20%20%20%20%20flowUrl%2C%0A%20%20%20%20%20%20finalOperator%2C%0A%20%20%20%20%20%20strategyTypeName%2C%0A%20%20%20%20%7D%20%3D%20inputValue0%3B%0A%20%20%20%20if%20(flowStatusDesc%20%26%26%20flowStatusDesc%20!%3D%20'')%20%7B%0A%20%20%20%20%20%20var%20color%20%3D%20'gray'%3B%0A%20%20%20%20%20%20var%20linkText%20%3D%20''%3B%0A%20%20%20%20%20%20if%20(flowStatus%20%3D%3D%20'')%20%7B%0A%20%20%20%20%20%20%20%20color%20%3D%20'gray'%3B%0A%20%20%20%20%20%20%7D%20else%20if%20(flowStatus%20%3D%3D%20'submitted')%20%7B%0A%20%20%20%20%20%20%20%20color%20%3D%20'blue'%3B%0A%20%20%20%20%20%20%20%20linkText%20%3D%20'%E6%9F%A5%E7%9C%8B%E5%AE%A1%E6%89%B9%E8%BF%9B%E5%BA%A6'%3B%0A%20%20%20%20%20%20%7D%20else%20if%20(flowStatus%20%3D%3D%20'uncommitted')%20%7B%0A%20%20%20%20%20%20%20%20color%20%3D%20'orange'%3B%0A%20%20%20%20%20%20%20%20linkText%20%3D%20'%E5%8E%BB%E6%8F%90%E4%BA%A4%E5%AE%A1%E6%89%B9'%3B%0A%20%20%20%20%20%20%7D%20else%20if%20(flowStatus%20%3D%3D%20'approved')%20%7B%0A%20%20%20%20%20%20%20%20color%20%3D%20'green'%3B%0A%20%20%20%20%20%20%20%20linkText%20%3D%20'%E6%9F%A5%E7%9C%8B%E5%AE%A1%E6%89%B9%E5%8D%95'%3B%0A%20%20%20%20%20%20%7D%20else%20%7B%0A%20%20%20%20%20%20%20%20color%20%3D%20'red'%3B%0A%20%20%20%20%20%20%20%20linkText%20%3D%20'%E6%9F%A5%E7%9C%8B%E5%AE%A1%E6%89%B9%E5%8D%95'%3B%0A%20%20%20%20%20%20%7D%0A%0A%20%20%20%20%20%20output0(%5B%0A%20%20%20%20%20%20%20%20%7B%0A%20%20%20%20%20%20%20%20%20%20content%3A%20flowStatusDesc%2C%0A%20%20%20%20%20%20%20%20%20%20color%3A%20color%2C%0A%20%20%20%20%20%20%20%20%7D%2C%0A%20%20%20%20%20%20%5D)%3B%0A%0A%20%20%20%20%20%20if%20(flowUrl)%20%7B%0A%20%20%20%20%20%20%20%20output1(flowUrl)%3B%0A%20%20%20%20%20%20%7D%0A%20%20%20%20%20%20if%20(finalOperator)%20%7B%0A%20%20%20%20%20%20%20%20output2(finalOperator)%3B%0A%20%20%20%20%20%20%7D%0A%20%20%20%20%20%20if%20(strategyTypeName)%20%7B%0A%20%20%20%20%20%20%20%20output3(strategyTypeName)%3B%0A%20%20%20%20%20%20%7D%0A%20%20%20%20%20%20output4(true)%3B%0A%20%20%20%20%20%20output5(linkText)%3B%0A%20%20%20%20%7D%20else%20%7B%0A%20%20%20%20%20%20output4(false)%3B%0A%20%20%20%20%7D%0A%20%20%7D%0A%7D",
                "transformCode": "(function()%20%7B%20var%20_RTFN_%3B%20%0A%22use%20strict%22%3B%0A%0Afunction%20_slicedToArray(arr%2C%20i)%20%7B%20return%20_arrayWithHoles(arr)%20%7C%7C%20_iterableToArrayLimit(arr%2C%20i)%20%7C%7C%20_unsupportedIterableToArray(arr%2C%20i)%20%7C%7C%20_nonIterableRest()%3B%20%7D%0A%0Afunction%20_nonIterableRest()%20%7B%20throw%20new%20TypeError(%22Invalid%20attempt%20to%20destructure%20non-iterable%20instance.%5CnIn%20order%20to%20be%20iterable%2C%20non-array%20objects%20must%20have%20a%20%5BSymbol.iterator%5D()%20method.%22)%3B%20%7D%0A%0Afunction%20_unsupportedIterableToArray(o%2C%20minLen)%20%7B%20if%20(!o)%20return%3B%20if%20(typeof%20o%20%3D%3D%3D%20%22string%22)%20return%20_arrayLikeToArray(o%2C%20minLen)%3B%20var%20n%20%3D%20Object.prototype.toString.call(o).slice(8%2C%20-1)%3B%20if%20(n%20%3D%3D%3D%20%22Object%22%20%26%26%20o.constructor)%20n%20%3D%20o.constructor.name%3B%20if%20(n%20%3D%3D%3D%20%22Map%22%20%7C%7C%20n%20%3D%3D%3D%20%22Set%22)%20return%20Array.from(o)%3B%20if%20(n%20%3D%3D%3D%20%22Arguments%22%20%7C%7C%20%2F%5E(%3F%3AUi%7CI)nt(%3F%3A8%7C16%7C32)(%3F%3AClamped)%3FArray%24%2F.test(n))%20return%20_arrayLikeToArray(o%2C%20minLen)%3B%20%7D%0A%0Afunction%20_arrayLikeToArray(arr%2C%20len)%20%7B%20if%20(len%20%3D%3D%20null%20%7C%7C%20len%20%3E%20arr.length)%20len%20%3D%20arr.length%3B%20for%20(var%20i%20%3D%200%2C%20arr2%20%3D%20new%20Array(len)%3B%20i%20%3C%20len%3B%20i%2B%2B)%20%7B%20arr2%5Bi%5D%20%3D%20arr%5Bi%5D%3B%20%7D%20return%20arr2%3B%20%7D%0A%0Afunction%20_iterableToArrayLimit(arr%2C%20i)%20%7B%20var%20_i%20%3D%20arr%20%3D%3D%20null%20%3F%20null%20%3A%20typeof%20Symbol%20!%3D%3D%20%22undefined%22%20%26%26%20arr%5BSymbol.iterator%5D%20%7C%7C%20arr%5B%22%40%40iterator%22%5D%3B%20if%20(_i%20%3D%3D%20null)%20return%3B%20var%20_arr%20%3D%20%5B%5D%3B%20var%20_n%20%3D%20true%3B%20var%20_d%20%3D%20false%3B%20var%20_s%2C%20_e%3B%20try%20%7B%20for%20(_i%20%3D%20_i.call(arr)%3B%20!(_n%20%3D%20(_s%20%3D%20_i.next()).done)%3B%20_n%20%3D%20true)%20%7B%20_arr.push(_s.value)%3B%20if%20(i%20%26%26%20_arr.length%20%3D%3D%3D%20i)%20break%3B%20%7D%20%7D%20catch%20(err)%20%7B%20_d%20%3D%20true%3B%20_e%20%3D%20err%3B%20%7D%20finally%20%7B%20try%20%7B%20if%20(!_n%20%26%26%20_i%5B%22return%22%5D%20!%3D%20null)%20_i%5B%22return%22%5D()%3B%20%7D%20finally%20%7B%20if%20(_d)%20throw%20_e%3B%20%7D%20%7D%20return%20_arr%3B%20%7D%0A%0Afunction%20_arrayWithHoles(arr)%20%7B%20if%20(Array.isArray(arr))%20return%20arr%3B%20%7D%0A%0A_RTFN_%20%3D%20function%20_RTFN_(_ref)%20%7B%0A%20%20var%20outputs%20%3D%20_ref.outputs%2C%0A%20%20%20%20%20%20inputs%20%3D%20_ref.inputs%3B%0A%0A%20%20var%20_inputs%20%3D%20_slicedToArray(inputs%2C%201)%2C%0A%20%20%20%20%20%20inputValue0%20%3D%20_inputs%5B0%5D%3B%0A%0A%20%20var%20_outputs%20%3D%20_slicedToArray(outputs%2C%206)%2C%0A%20%20%20%20%20%20output0%20%3D%20_outputs%5B0%5D%2C%0A%20%20%20%20%20%20output1%20%3D%20_outputs%5B1%5D%2C%0A%20%20%20%20%20%20output2%20%3D%20_outputs%5B2%5D%2C%0A%20%20%20%20%20%20output3%20%3D%20_outputs%5B3%5D%2C%0A%20%20%20%20%20%20output4%20%3D%20_outputs%5B4%5D%2C%0A%20%20%20%20%20%20output5%20%3D%20_outputs%5B5%5D%3B%0A%0A%20%20if%20(inputValue0)%20%7B%0A%20%20%20%20var%20flowId%20%3D%20inputValue0.flowId%2C%0A%20%20%20%20%20%20%20%20flowStatus%20%3D%20inputValue0.flowStatus%2C%0A%20%20%20%20%20%20%20%20flowStatusDesc%20%3D%20inputValue0.flowStatusDesc%2C%0A%20%20%20%20%20%20%20%20flowUrl%20%3D%20inputValue0.flowUrl%2C%0A%20%20%20%20%20%20%20%20finalOperator%20%3D%20inputValue0.finalOperator%2C%0A%20%20%20%20%20%20%20%20strategyTypeName%20%3D%20inputValue0.strategyTypeName%3B%0A%0A%20%20%20%20if%20(flowStatusDesc%20%26%26%20flowStatusDesc%20!%3D%20'')%20%7B%0A%20%20%20%20%20%20var%20color%20%3D%20'gray'%3B%0A%20%20%20%20%20%20var%20linkText%20%3D%20''%3B%0A%0A%20%20%20%20%20%20if%20(flowStatus%20%3D%3D%20'')%20%7B%0A%20%20%20%20%20%20%20%20color%20%3D%20'gray'%3B%0A%20%20%20%20%20%20%7D%20else%20if%20(flowStatus%20%3D%3D%20'submitted')%20%7B%0A%20%20%20%20%20%20%20%20color%20%3D%20'blue'%3B%0A%20%20%20%20%20%20%20%20linkText%20%3D%20'%E6%9F%A5%E7%9C%8B%E5%AE%A1%E6%89%B9%E8%BF%9B%E5%BA%A6'%3B%0A%20%20%20%20%20%20%7D%20else%20if%20(flowStatus%20%3D%3D%20'uncommitted')%20%7B%0A%20%20%20%20%20%20%20%20color%20%3D%20'orange'%3B%0A%20%20%20%20%20%20%20%20linkText%20%3D%20'%E5%8E%BB%E6%8F%90%E4%BA%A4%E5%AE%A1%E6%89%B9'%3B%0A%20%20%20%20%20%20%7D%20else%20if%20(flowStatus%20%3D%3D%20'approved')%20%7B%0A%20%20%20%20%20%20%20%20color%20%3D%20'green'%3B%0A%20%20%20%20%20%20%20%20linkText%20%3D%20'%E6%9F%A5%E7%9C%8B%E5%AE%A1%E6%89%B9%E5%8D%95'%3B%0A%20%20%20%20%20%20%7D%20else%20%7B%0A%20%20%20%20%20%20%20%20color%20%3D%20'red'%3B%0A%20%20%20%20%20%20%20%20linkText%20%3D%20'%E6%9F%A5%E7%9C%8B%E5%AE%A1%E6%89%B9%E5%8D%95'%3B%0A%20%20%20%20%20%20%7D%0A%0A%20%20%20%20%20%20output0(%5B%7B%0A%20%20%20%20%20%20%20%20content%3A%20flowStatusDesc%2C%0A%20%20%20%20%20%20%20%20color%3A%20color%0A%20%20%20%20%20%20%7D%5D)%3B%0A%0A%20%20%20%20%20%20if%20(flowUrl)%20%7B%0A%20%20%20%20%20%20%20%20output1(flowUrl)%3B%0A%20%20%20%20%20%20%7D%0A%0A%20%20%20%20%20%20if%20(finalOperator)%20%7B%0A%20%20%20%20%20%20%20%20output2(finalOperator)%3B%0A%20%20%20%20%20%20%7D%0A%0A%20%20%20%20%20%20if%20(strategyTypeName)%20%7B%0A%20%20%20%20%20%20%20%20output3(strategyTypeName)%3B%0A%20%20%20%20%20%20%7D%0A%0A%20%20%20%20%20%20output4(true)%3B%0A%20%20%20%20%20%20output5(linkText)%3B%0A%20%20%20%20%7D%20else%20%7B%0A%20%20%20%20%20%20output4(false)%3B%0A%20%20%20%20%7D%0A%20%20%7D%0A%7D%3B%0A%3B%20return%20_RTFN_%3B%20%7D)()"
              }
            },
            "inputAry": [],
            "outputAry": [
              "output1",
              "output2",
              "output3",
              "output4",
              "output5"
            ],
            "outputEvents": {},
            "style": {
              "display": "block"
            }
          },
          "style": {},
          "configs": [],
          "_inputs": [],
          "inputs": [
            "input.inputValue0"
          ],
          "outputs": [
            "output0",
            "output1",
            "output2",
            "output3",
            "output4",
            "output5"
          ]
        },
        "u_XxZNy": {
          "id": "u_XxZNy",
          "def": {
            "namespace": "mybricks.normal-pc.text",
            "version": "1.0.17",
            "materialId": 47511
          },
          "title": "halo审批人",
          "model": {
            "data": {
              "content": "",
              "outputContent": "",
              "align": "left",
              "isEllipsis": false,
              "ellipsis": {
                "rows": 3
              },
              "style": {},
              "useClick": false,
              "useDynamicStyle": false,
              "useHoverStyle": true,
              "legacyConfigStyle": {}
            },
            "inputAry": [],
            "outputAry": [],
            "outputEvents": {},
            "style": {
              "width": "100%",
              "styleAry": [
                {
                  "selector": "[data-item-type=\"root\"]",
                  "css": {
                    "fontSize": "16px",
                    "lineHeight": "16px"
                  }
                }
              ],
              "themesId": "_defined",
              "height": "fit-content",
              "_new": true
            }
          },
          "style": {
            "width": 0,
            "height": 0
          },
          "configs": [
            "text",
            "style"
          ],
          "_inputs": [],
          "inputs": [
            "content",
            "show",
            "hide",
            "showOrHide"
          ],
          "outputs": []
        },
        "u_Mf187": {
          "id": "u_Mf187",
          "def": {
            "namespace": "mybricks.normal-pc.text",
            "version": "1.0.17",
            "materialId": 47511
          },
          "title": "策略名称文本",
          "model": {
            "data": {
              "content": "",
              "outputContent": "",
              "align": "left",
              "isEllipsis": false,
              "ellipsis": {
                "rows": 3
              },
              "style": {},
              "useClick": false,
              "useDynamicStyle": false,
              "useHoverStyle": true,
              "legacyConfigStyle": {}
            },
            "inputAry": [],
            "outputAry": [],
            "outputEvents": {},
            "style": {
              "width": "100%",
              "styleAry": [
                {
                  "selector": "[data-item-type=\"root\"]",
                  "css": {
                    "color": "#f5222d",
                    "fontWeight": "700",
                    "fontSize": "24px",
                    "lineHeight": "30px",
                    "textAlign": "center"
                  }
                }
              ],
              "themesId": "_defined",
              "marginBottom": 20,
              "marginTop": 20,
              "height": "fit-content",
              "_new": true
            }
          },
          "style": {
            "width": 0,
            "height": 0
          },
          "configs": [
            "text",
            "style"
          ],
          "_inputs": [],
          "inputs": [
            "content",
            "show",
            "hide",
            "showOrHide"
          ],
          "outputs": []
        },
        "u_9U4wn": {
          "id": "u_9U4wn",
          "def": {
            "namespace": "mybricks.normal-pc.custom-container",
            "version": "1.0.24",
            "materialId": 48068
          },
          "title": "自定义容器4",
          "model": {
            "data": {
              "style": {},
              "slotStyle": {
                "display": "flex",
                "position": "inherit",
                "flexDirection": "column",
                "alignItems": "flex-start",
                "justifyContent": "flex-start",
                "flexWrap": "nowrap"
              },
              "legacyConfigStyle": {},
              "legacyStyle": {}
            },
            "inputAry": [],
            "outputAry": [],
            "outputEvents": {},
            "style": {
              "height": "fit-content",
              "width": "100%",
              "marginBottom": 0,
              "_new": true
            }
          },
          "style": {
            "width": 0,
            "height": 0
          },
          "configs": [
            "style",
            "id"
          ],
          "_inputs": [],
          "inputs": [
            "show",
            "hide",
            "showOrHide"
          ],
          "outputs": []
        },
        "u_Hc43v": {
          "id": "u_Hc43v",
          "def": {
            "namespace": "mybricks.normal-pc.custom-container",
            "version": "1.0.24",
            "materialId": 48068
          },
          "title": "自定义容器6",
          "model": {
            "data": {
              "style": {},
              "slotStyle": {
                "display": "flex",
                "position": "inherit",
                "flexDirection": "column",
                "alignItems": "flex-start",
                "justifyContent": "flex-start",
                "flexWrap": "nowrap"
              },
              "legacyConfigStyle": {},
              "legacyStyle": {}
            },
            "inputAry": [],
            "outputAry": [],
            "outputEvents": {},
            "style": {
              "height": "fit-content",
              "width": "100%",
              "marginBottom": 50,
              "_new": true
            }
          },
          "style": {
            "width": 0,
            "height": 0
          },
          "configs": [
            "style",
            "id"
          ],
          "_inputs": [],
          "inputs": [
            "show",
            "hide",
            "showOrHide"
          ],
          "outputs": []
        },
        "u_aWqQs": {
          "id": "u_aWqQs",
          "def": {
            "namespace": "mybricks.core-comlib.var",
            "version": "1.0.0",
            "rtType": "js"
          },
          "title": "DB表单内容",
          "model": {
            "data": {},
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
            "get",
            "set",
            "reset"
          ],
          "outputs": [
            "return",
            "changed"
          ]
        },
        "u_Hluf_": {
          "id": "u_Hluf_",
          "def": {
            "namespace": "mybricks.basic-comlib._muilt-inputJs",
            "version": "1.0.2",
            "rtType": "js-autorun",
            "materialId": 46406
          },
          "title": "JS计算19",
          "model": {
            "data": {
              "fns": {
                "code": "(%7B%20outputs%2C%20inputs%20%7D)%20%3D%3E%20%7B%0A%20%20const%20%5B%20inputValue0%20%5D%20%3D%20inputs%3B%0A%20%20const%20%5B%20output0%20%5D%20%3D%20outputs%3B%0A%20%20const%20openConfigId%20%3D%20inputValue0%5B'openConfigId'%5D%3B%0A%20%20output0(%0A%20%20%20%20%60%2Fpage%2Ffangzhou%2Fselfconfig%2Fdb%2Flist%3FopenConfigId%3D%24%7BopenConfigId%7D%26datasourceType%3Ddb%60%0A%20%20)%3B%0A%7D",
                "transformCode": "(function()%20%7B%20var%20_RTFN_%3B%20%0A%22use%20strict%22%3B%0A%0Afunction%20_slicedToArray(arr%2C%20i)%20%7B%20return%20_arrayWithHoles(arr)%20%7C%7C%20_iterableToArrayLimit(arr%2C%20i)%20%7C%7C%20_unsupportedIterableToArray(arr%2C%20i)%20%7C%7C%20_nonIterableRest()%3B%20%7D%0A%0Afunction%20_nonIterableRest()%20%7B%20throw%20new%20TypeError(%22Invalid%20attempt%20to%20destructure%20non-iterable%20instance.%5CnIn%20order%20to%20be%20iterable%2C%20non-array%20objects%20must%20have%20a%20%5BSymbol.iterator%5D()%20method.%22)%3B%20%7D%0A%0Afunction%20_unsupportedIterableToArray(o%2C%20minLen)%20%7B%20if%20(!o)%20return%3B%20if%20(typeof%20o%20%3D%3D%3D%20%22string%22)%20return%20_arrayLikeToArray(o%2C%20minLen)%3B%20var%20n%20%3D%20Object.prototype.toString.call(o).slice(8%2C%20-1)%3B%20if%20(n%20%3D%3D%3D%20%22Object%22%20%26%26%20o.constructor)%20n%20%3D%20o.constructor.name%3B%20if%20(n%20%3D%3D%3D%20%22Map%22%20%7C%7C%20n%20%3D%3D%3D%20%22Set%22)%20return%20Array.from(o)%3B%20if%20(n%20%3D%3D%3D%20%22Arguments%22%20%7C%7C%20%2F%5E(%3F%3AUi%7CI)nt(%3F%3A8%7C16%7C32)(%3F%3AClamped)%3FArray%24%2F.test(n))%20return%20_arrayLikeToArray(o%2C%20minLen)%3B%20%7D%0A%0Afunction%20_arrayLikeToArray(arr%2C%20len)%20%7B%20if%20(len%20%3D%3D%20null%20%7C%7C%20len%20%3E%20arr.length)%20len%20%3D%20arr.length%3B%20for%20(var%20i%20%3D%200%2C%20arr2%20%3D%20new%20Array(len)%3B%20i%20%3C%20len%3B%20i%2B%2B)%20%7B%20arr2%5Bi%5D%20%3D%20arr%5Bi%5D%3B%20%7D%20return%20arr2%3B%20%7D%0A%0Afunction%20_iterableToArrayLimit(arr%2C%20i)%20%7B%20var%20_i%20%3D%20arr%20%3D%3D%20null%20%3F%20null%20%3A%20typeof%20Symbol%20!%3D%3D%20%22undefined%22%20%26%26%20arr%5BSymbol.iterator%5D%20%7C%7C%20arr%5B%22%40%40iterator%22%5D%3B%20if%20(_i%20%3D%3D%20null)%20return%3B%20var%20_arr%20%3D%20%5B%5D%3B%20var%20_n%20%3D%20true%3B%20var%20_d%20%3D%20false%3B%20var%20_s%2C%20_e%3B%20try%20%7B%20for%20(_i%20%3D%20_i.call(arr)%3B%20!(_n%20%3D%20(_s%20%3D%20_i.next()).done)%3B%20_n%20%3D%20true)%20%7B%20_arr.push(_s.value)%3B%20if%20(i%20%26%26%20_arr.length%20%3D%3D%3D%20i)%20break%3B%20%7D%20%7D%20catch%20(err)%20%7B%20_d%20%3D%20true%3B%20_e%20%3D%20err%3B%20%7D%20finally%20%7B%20try%20%7B%20if%20(!_n%20%26%26%20_i%5B%22return%22%5D%20!%3D%20null)%20_i%5B%22return%22%5D()%3B%20%7D%20finally%20%7B%20if%20(_d)%20throw%20_e%3B%20%7D%20%7D%20return%20_arr%3B%20%7D%0A%0Afunction%20_arrayWithHoles(arr)%20%7B%20if%20(Array.isArray(arr))%20return%20arr%3B%20%7D%0A%0A_RTFN_%20%3D%20function%20_RTFN_(_ref)%20%7B%0A%20%20var%20outputs%20%3D%20_ref.outputs%2C%0A%20%20%20%20%20%20inputs%20%3D%20_ref.inputs%3B%0A%0A%20%20var%20_inputs%20%3D%20_slicedToArray(inputs%2C%201)%2C%0A%20%20%20%20%20%20inputValue0%20%3D%20_inputs%5B0%5D%3B%0A%0A%20%20var%20_outputs%20%3D%20_slicedToArray(outputs%2C%201)%2C%0A%20%20%20%20%20%20output0%20%3D%20_outputs%5B0%5D%3B%0A%0A%20%20var%20openConfigId%20%3D%20inputValue0%5B'openConfigId'%5D%3B%0A%20%20output0(%22%2Fpage%2Ffangzhou%2Fselfconfig%2Fdb%2Flist%3FopenConfigId%3D%22.concat(openConfigId%2C%20%22%26datasourceType%3Ddb%22))%3B%0A%7D%3B%0A%3B%20return%20_RTFN_%3B%20%7D)()"
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
            "input.inputValue0"
          ],
          "outputs": [
            "output0"
          ]
        },
        "u_R0B_k": {
          "id": "u_R0B_k",
          "def": {
            "namespace": "mybricks.basic-comlib._muilt-inputJs",
            "version": "1.0.2",
            "rtType": "js-autorun",
            "materialId": 46406
          },
          "frameId": "u_txdqD",
          "title": "JS计算",
          "model": {
            "data": {
              "fns": {
                "code": "(%7B%20outputs%2C%20inputs%20%7D)%20%3D%3E%20%7B%0A%20%20const%20%5BinputValue0%2C%20inputValue1%2C%20inputValue2%2C%20inputValue3%2C%20inputValue4%2C%20inputValue5%5D%20%3D%20inputs%3B%0A%20%20const%20%5Boutput0%2C%20output1%5D%20%3D%20outputs%3B%0A%20%20if%20(!inputValue3%20%26%26%20inputValue1%20%3E%3D%201%20%26%26%20inputValue1%20%3C%3D%208)%20%7B%0A%20%20%20%20output1('%E8%BE%93%E5%85%A5%E5%86%85%E5%AE%B9%E6%A0%A1%E9%AA%8C%E4%B8%8D%E9%80%9A%E8%BF%87%EF%BC%81')%3B%0A%20%20%20%20return%3B%0A%20%20%7D%0A%20%20const%20publishData%20%3D%20JSON.stringify(%7B%0A%20%20%20%20%22content%22%3A%20JSON.stringify(inputValue0)%2C%0A%20%20%20%20%22baseCol%22%3A%20JSON.stringify(inputValue4)%0A%20%20%7D)%3B%0A%20%20output0(%7B%0A%20%20%20%20openConfigId%3A%20inputValue2%5B'openConfigId'%5D%2C%0A%20%20%20%20publishData%3A%20publishData%2C%0A%20%20%20%20operateType%3A%20inputValue1%2C%0A%20%20%20%20configItemDbId%3A%20inputValue2%5B'configItemDbId'%5D%2C%0A%20%20%20%20datasourceType%3A%20%22db%22%2C%0A%20%20%20%20publishRecordId%3A%20inputValue5%0A%20%20%7D)%3B%0A%7D",
                "transformCode": "(function()%20%7B%20var%20_RTFN_%3B%20%0A%22use%20strict%22%3B%0A%0Afunction%20_slicedToArray(arr%2C%20i)%20%7B%20return%20_arrayWithHoles(arr)%20%7C%7C%20_iterableToArrayLimit(arr%2C%20i)%20%7C%7C%20_unsupportedIterableToArray(arr%2C%20i)%20%7C%7C%20_nonIterableRest()%3B%20%7D%0A%0Afunction%20_nonIterableRest()%20%7B%20throw%20new%20TypeError(%22Invalid%20attempt%20to%20destructure%20non-iterable%20instance.%5CnIn%20order%20to%20be%20iterable%2C%20non-array%20objects%20must%20have%20a%20%5BSymbol.iterator%5D()%20method.%22)%3B%20%7D%0A%0Afunction%20_unsupportedIterableToArray(o%2C%20minLen)%20%7B%20if%20(!o)%20return%3B%20if%20(typeof%20o%20%3D%3D%3D%20%22string%22)%20return%20_arrayLikeToArray(o%2C%20minLen)%3B%20var%20n%20%3D%20Object.prototype.toString.call(o).slice(8%2C%20-1)%3B%20if%20(n%20%3D%3D%3D%20%22Object%22%20%26%26%20o.constructor)%20n%20%3D%20o.constructor.name%3B%20if%20(n%20%3D%3D%3D%20%22Map%22%20%7C%7C%20n%20%3D%3D%3D%20%22Set%22)%20return%20Array.from(o)%3B%20if%20(n%20%3D%3D%3D%20%22Arguments%22%20%7C%7C%20%2F%5E(%3F%3AUi%7CI)nt(%3F%3A8%7C16%7C32)(%3F%3AClamped)%3FArray%24%2F.test(n))%20return%20_arrayLikeToArray(o%2C%20minLen)%3B%20%7D%0A%0Afunction%20_arrayLikeToArray(arr%2C%20len)%20%7B%20if%20(len%20%3D%3D%20null%20%7C%7C%20len%20%3E%20arr.length)%20len%20%3D%20arr.length%3B%20for%20(var%20i%20%3D%200%2C%20arr2%20%3D%20new%20Array(len)%3B%20i%20%3C%20len%3B%20i%2B%2B)%20%7B%20arr2%5Bi%5D%20%3D%20arr%5Bi%5D%3B%20%7D%20return%20arr2%3B%20%7D%0A%0Afunction%20_iterableToArrayLimit(arr%2C%20i)%20%7B%20var%20_i%20%3D%20arr%20%3D%3D%20null%20%3F%20null%20%3A%20typeof%20Symbol%20!%3D%3D%20%22undefined%22%20%26%26%20arr%5BSymbol.iterator%5D%20%7C%7C%20arr%5B%22%40%40iterator%22%5D%3B%20if%20(_i%20%3D%3D%20null)%20return%3B%20var%20_arr%20%3D%20%5B%5D%3B%20var%20_n%20%3D%20true%3B%20var%20_d%20%3D%20false%3B%20var%20_s%2C%20_e%3B%20try%20%7B%20for%20(_i%20%3D%20_i.call(arr)%3B%20!(_n%20%3D%20(_s%20%3D%20_i.next()).done)%3B%20_n%20%3D%20true)%20%7B%20_arr.push(_s.value)%3B%20if%20(i%20%26%26%20_arr.length%20%3D%3D%3D%20i)%20break%3B%20%7D%20%7D%20catch%20(err)%20%7B%20_d%20%3D%20true%3B%20_e%20%3D%20err%3B%20%7D%20finally%20%7B%20try%20%7B%20if%20(!_n%20%26%26%20_i%5B%22return%22%5D%20!%3D%20null)%20_i%5B%22return%22%5D()%3B%20%7D%20finally%20%7B%20if%20(_d)%20throw%20_e%3B%20%7D%20%7D%20return%20_arr%3B%20%7D%0A%0Afunction%20_arrayWithHoles(arr)%20%7B%20if%20(Array.isArray(arr))%20return%20arr%3B%20%7D%0A%0A_RTFN_%20%3D%20function%20_RTFN_(_ref)%20%7B%0A%20%20var%20outputs%20%3D%20_ref.outputs%2C%0A%20%20%20%20%20%20inputs%20%3D%20_ref.inputs%3B%0A%0A%20%20var%20_inputs%20%3D%20_slicedToArray(inputs%2C%206)%2C%0A%20%20%20%20%20%20inputValue0%20%3D%20_inputs%5B0%5D%2C%0A%20%20%20%20%20%20inputValue1%20%3D%20_inputs%5B1%5D%2C%0A%20%20%20%20%20%20inputValue2%20%3D%20_inputs%5B2%5D%2C%0A%20%20%20%20%20%20inputValue3%20%3D%20_inputs%5B3%5D%2C%0A%20%20%20%20%20%20inputValue4%20%3D%20_inputs%5B4%5D%2C%0A%20%20%20%20%20%20inputValue5%20%3D%20_inputs%5B5%5D%3B%0A%0A%20%20var%20_outputs%20%3D%20_slicedToArray(outputs%2C%202)%2C%0A%20%20%20%20%20%20output0%20%3D%20_outputs%5B0%5D%2C%0A%20%20%20%20%20%20output1%20%3D%20_outputs%5B1%5D%3B%0A%0A%20%20if%20(!inputValue3%20%26%26%20inputValue1%20%3E%3D%201%20%26%26%20inputValue1%20%3C%3D%208)%20%7B%0A%20%20%20%20output1('%E8%BE%93%E5%85%A5%E5%86%85%E5%AE%B9%E6%A0%A1%E9%AA%8C%E4%B8%8D%E9%80%9A%E8%BF%87%EF%BC%81')%3B%0A%20%20%20%20return%3B%0A%20%20%7D%0A%0A%20%20var%20publishData%20%3D%20JSON.stringify(%7B%0A%20%20%20%20%22content%22%3A%20JSON.stringify(inputValue0)%2C%0A%20%20%20%20%22baseCol%22%3A%20JSON.stringify(inputValue4)%0A%20%20%7D)%3B%0A%20%20output0(%7B%0A%20%20%20%20openConfigId%3A%20inputValue2%5B'openConfigId'%5D%2C%0A%20%20%20%20publishData%3A%20publishData%2C%0A%20%20%20%20operateType%3A%20inputValue1%2C%0A%20%20%20%20configItemDbId%3A%20inputValue2%5B'configItemDbId'%5D%2C%0A%20%20%20%20datasourceType%3A%20%22db%22%2C%0A%20%20%20%20publishRecordId%3A%20inputValue5%0A%20%20%7D)%3B%0A%7D%3B%0A%3B%20return%20_RTFN_%3B%20%7D)()"
              }
            },
            "inputAry": [
              {
                "hostId": "input.inputValue1",
                "title": "参数1",
                "schema": {
                  "type": "follow"
                }
              },
              {
                "hostId": "input.inputValue2",
                "title": "参数2",
                "schema": {
                  "type": "follow"
                }
              },
              {
                "hostId": "input.inputValue3",
                "title": "参数3",
                "schema": {
                  "type": "follow"
                }
              },
              {
                "hostId": "input.inputValue4",
                "title": "参数4",
                "schema": {
                  "type": "follow"
                }
              },
              {
                "hostId": "input.inputValue5",
                "title": "参数5",
                "schema": {
                  "type": "follow"
                }
              }
            ],
            "outputAry": [
              "output1"
            ],
            "outputEvents": {},
            "style": {
              "display": "block"
            }
          },
          "style": {},
          "configs": [],
          "_inputs": [],
          "inputs": [
            "input.inputValue0",
            "input.inputValue1",
            "input.inputValue2",
            "input.inputValue3",
            "input.inputValue4",
            "input.inputValue5"
          ],
          "outputs": [
            "output0",
            "output1"
          ]
        },
        "u_7YAd9": {
          "id": "u_7YAd9",
          "def": {
            "namespace": "mybricks.normal-pc.message",
            "version": "1.0.4",
            "rtType": "js",
            "materialId": 44978
          },
          "frameId": "u_txdqD",
          "title": "消息提示",
          "model": {
            "data": {
              "title": "提示名称",
              "content": "弹出提示",
              "duration": 3,
              "type": "warning",
              "isExternal": true,
              "isEnd": false
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
          "outputs": []
        },
        "u_GL02f": {
          "id": "u_GL02f",
          "def": {
            "namespace": "mybricks.normal-pc.service",
            "version": "1.0.8",
            "rtType": "js-autorun",
            "materialId": 38932
          },
          "frameId": "u_txdqD",
          "title": "服务接口",
          "model": {
            "data": {
              "connectorConfig": {},
              "connector": {
                "id": "u_kkaexs",
                "title": "更新发布单",
                "type": "http",
                "inputSchema": {
                  "type": "object",
                  "properties": {
                    "openConfigId": {
                      "type": "number"
                    },
                    "publishData": {
                      "type": "string"
                    },
                    "operateType": {
                      "type": "number"
                    }
                  }
                },
                "outputSchema": {
                  "type": "object",
                  "properties": {
                    "result": {
                      "type": "number"
                    },
                    "debug_info": {
                      "type": "string"
                    },
                    "error_msg": {
                      "type": "string"
                    },
                    "requestId": {
                      "type": "string"
                    }
                  }
                },
                "script": "function%20(e%2C%20%7B%0A%20%20%20%20%20%20%20%20%20%20%20%20then%3A%20t%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20onError%3A%20n%0A%20%20%20%20%20%20%20%20%20%20%7D%2C%20r)%20%7B%0A%20%20%20%20%20%20%20%20%20%20%20%20return%20function%20(e%2C%20r)%20%7B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20const%20o%20%3D%20%22POST%22%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20i%20%3D%20%5B%5D%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20a%20%3D%20%5B%5D%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20c%20%3D%20undefined%3B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20try%20%7B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20const%20l%20%3D%20%22%2Fgateway%2Fmarketing%2Ftools%2Fselfconfig%2Fpublish%2Fupdate%22%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20s%20%3D%20function%20_RT_(%7B%20params%2C%20data%2C%20headers%2C%20url%2C%20method%20%7D)%20%7B%0A%20%20%2F%2F%20%E8%AE%BE%E7%BD%AE%E8%AF%B7%E6%B1%82query%E3%80%81%E8%AF%B7%E6%B1%82%E4%BD%93%E3%80%81%E8%AF%B7%E6%B1%82%E5%A4%B4%0A%20%20return%20%7B%20params%2C%20data%2C%20headers%2C%20url%2C%20method%20%7D%3B%0A%20%7D%0A(o.startsWith(%22GET%22)%20%3F%20%7B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20params%3A%20e%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20url%3A%20l%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20method%3A%20o%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%7D%20%3A%20%7B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20data%3A%20e%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20url%3A%20l%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20method%3A%20o%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%7D)%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20u%20%3D%20true%3B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20s.url%20%3D%20s.url%20%7C%7C%20l%2C%20s.method%20%3D%20s.method%20%7C%7C%20o%3B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20const%20d%20%3D%20function%20_RT_(%7B%20params%2C%20data%2C%20headers%2C%20url%2C%20method%20%7D)%20%7B%0A%20%20%2F%2F%20%E8%AE%BE%E7%BD%AE%E8%AF%B7%E6%B1%82query%E3%80%81%E8%AF%B7%E6%B1%82%E4%BD%93%E3%80%81%E8%AF%B7%E6%B1%82%E5%A4%B4%0A%20%20return%20%7B%20params%2C%20data%2C%20headers%2C%20url%2C%20method%20%7D%3B%0A%20%7D%0A(s)%3B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20d.url%20%3D%20(d.url%20%7C%7C%20l).replace(%2F%7B(%5Cw%2B)%7D%2Fg%2C%20(t%2C%20n)%20%3D%3E%20%7B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20const%20r%20%3D%20e%5Bn%5D%20%7C%7C%20%22%22%3B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20return%20Reflect.deleteProperty(d.params%20%7C%7C%20%7B%7D%2C%20n)%2C%20r%3B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%7D)%2C%20d.method%20%3D%20d.method%20%7C%7C%20o%2C%20r.ajax(d).then(e%20%3D%3E%20u%20%3F%20function%20_RT_(%7B%20response%2C%20config%20%7D)%20%7B%0A%20%20%2F%2F%20if%20(response.data.code%20!%3D%3D%200)%20%7B%0A%20%20%2F%2F%20%20%20throw%20new%20Error(response.data.errMsg)%0A%20%20%2F%2F%20%7D%0A%20%20return%20response.data%0A%7D%0A(%7B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20response%3A%20e%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20config%3A%20d%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%7D%2C%20%7B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20throwStatusCodeError%3A%20e%20%3D%3E%20%7B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20n(e)%3B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%7D%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%7D)%20%3A%20e).then(e%20%3D%3E%20function%20_RT_(result%2C%20%7B%20method%2C%20url%2C%20params%2C%20data%2C%20headers%20%7D)%20%7B%0A%20%20%2F%2F%20return%20%7B%0A%20%20%2F%2F%20%20total%3A%20result.all%2C%0A%20%20%2F%2F%20%20dataSource%3A%20result.list.map(%7Bid%2C%20name%7D%20%3D%3E%20(%7B%0A%20%20%2F%2F%20%20%20%20%20value%3Aid%2C%20label%3A%20name%0A%20%20%2F%2F%20%20%7D))%0A%20%20%2F%2F%20%7D%0A%20%20return%20result%3B%0A%7D%0A(e%2C%20Object.assign(%7B%7D%2C%20d)%2C%20%7B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20throwStatusCodeError%3A%20e%20%3D%3E%20%7B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20n(e)%3B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%7D%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%7D)).then(e%20%3D%3E%20c%20%3F%20t(e)%20%3A%20(0%20%3D%3D%3D%20a.length%20%7C%7C%20a.forEach(t%20%3D%3E%20%7B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20const%20n%20%3D%20t.split(%22.%22)%3B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20!function%20(e%2C%20t)%20%7B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20const%20n%20%3D%20t.length%3B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20!function%20e(r%2C%20o)%20%7B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20if%20(!r%20%7C%7C%20o%20%3D%3D%3D%20n)%20return%3B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20const%20i%20%3D%20t%5Bo%5D%3B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20o%20%3D%3D%3D%20n%20-%201%20%26%26%20Reflect.deleteProperty(r%2C%20i)%2C%20Array.isArray(r)%20%3F%20r.forEach(t%20%3D%3E%20%7B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20e(t%2C%20o)%3B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%7D)%20%3A%20e(r%5Bi%5D%2C%20o%20%2B%201)%3B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%7D(e%2C%200)%3B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%7D(e%2C%20n)%3B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%7D)%2C%20e)).then(e%20%3D%3E%20%7B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20let%20n%20%3D%20Array.isArray(e)%20%3F%20%5B%5D%20%3A%20%7B%7D%3B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20if%20(void%200%20%3D%3D%3D%20i%20%7C%7C%200%20%3D%3D%3D%20i.length)%20n%20%3D%20e%3Belse%20if%20(i.forEach(t%20%3D%3E%20%7B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20!function%20(e%2C%20t%2C%20n)%20%7B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20const%20r%20%3D%20t.length%3B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20!function%20e(n%2C%20o%2C%20i)%20%7B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20if%20(!n%20%7C%7C%20o%20%3D%3D%3D%20r)%20return%20n%3B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20const%20a%20%3D%20t%5Bo%5D%3B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20return%20Array.isArray(n)%20%3F%20n.map((t%2C%20n)%20%3D%3E%20%7B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20const%20r%20%3D%20i%5Bn%5D%3B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20let%20a%3B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20return%20void%200%20%3D%3D%3D%20r%20%3F%20(a%20%3D%20%7B%7D%2C%20i.push(a))%20%3A%20a%20%3D%20r%2C%20e(t%2C%20o%2C%20a)%3B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%7D)%20%3A%20o%20%3D%3D%3D%20r%20-%201%20%3F%20(i%5Ba%5D%20%3D%20n%5Ba%5D%2C%20n%5Ba%5D)%20%3A%20(n%20%3D%20n%5Ba%5D%2C%20Array.isArray(n)%20%3F%20i%5Ba%5D%20%3D%20i%5Ba%5D%20%7C%7C%20%5B%5D%20%3A%20i%5Ba%5D%20%3D%20i%5Ba%5D%20%7C%7C%20%7B%7D%2C%20e(n%2C%20o%20%2B%201%2C%20Array.isArray(i)%20%3F%20i%20%3A%20i%5Ba%5D))%3B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%7D(e%2C%200%2C%20n)%3B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%7D(e%2C%20t.split(%22.%22)%2C%20n)%3B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%7D)%2C%20Array.isArray(i)%20%26%26%20i.length%20%26%26%20(i.length%20%3E%201%20%7C%7C%201%20!%3D%3D%20i.length%20%7C%7C%20%22%22%20!%3D%3D%20i%5B0%5D))%20try%20%7B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20let%20e%20%3D%20i.map(e%20%3D%3E%20e.split(%22.%22))%3B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20for%20(%3B%20%22%5Bobject%20Object%5D%22%20%3D%3D%3D%20Object.prototype.toString.call(n)%20%26%26%20e.every(e%20%3D%3E%20!!e.length)%20%26%26%201%20%3D%3D%3D%20Object.values(n).length%3B)%20n%20%3D%20Object.values(n)%5B0%5D%2C%20e.forEach(e%20%3D%3E%20e.shift())%3B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%7D%20catch%20(e)%20%7B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20console.log(%22connector%20format%20data%20error%22%2C%20e)%3B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%7D%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%22POST%22%20%3D%3D%3D%20d.method.toUpperCase()%20%26%26%20d.url.endsWith(%22%2Fdomain%2Frun%22)%20%26%26%20d.data%20%26%26%20d.data.fileId%20%26%26%20d.data.serviceId%20%26%26%20d.data.params%20%26%26%20d.data.params.showToplLog%20%3F%20t(%7B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20__ORIGIN_RESPONSE__%3A%20e%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20outputData%3A%20n%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%7D)%20%3A%20t(n)%3B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%7D).catch(e%20%3D%3E%20%7B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20n(e%20%26%26%20e.message%20%7C%7C%20e)%3B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%7D)%3B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%7D%20catch%20(e)%20%7B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20return%20n(e)%3B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%7D%0A%20%20%20%20%20%20%20%20%20%20%20%20%7D(e%2C%20r)%3B%0A%20%20%20%20%20%20%20%20%20%20%7D",
                "createTime": 1690867673324,
                "lastModifiedTime": 1690867875398
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
            "call"
          ],
          "outputs": [
            "then",
            "catch"
          ]
        },
        "u__H8qn": {
          "id": "u__H8qn",
          "def": {
            "namespace": "mybricks.normal-pc.message",
            "version": "1.0.4",
            "rtType": "js",
            "materialId": 44978
          },
          "frameId": "u_txdqD",
          "title": "消息提示1",
          "model": {
            "data": {
              "title": "提示名称",
              "content": "弹出提示",
              "duration": 3,
              "type": "error",
              "isExternal": true,
              "isEnd": false
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
          "outputs": []
        },
        "u_KqMH9": {
          "id": "u_KqMH9",
          "def": {
            "namespace": "mybricks.basic-comlib._muilt-inputJs",
            "version": "1.0.2",
            "rtType": "js-autorun",
            "materialId": 46406
          },
          "frameId": "u_txdqD",
          "title": "JS计算1",
          "model": {
            "data": {
              "fns": {
                "code": "(%7B%20outputs%2C%20inputs%20%7D)%20%3D%3E%20%7B%0A%20%20const%20%5BinputValue0%5D%20%3D%20inputs%3B%0A%20%20const%20%5Boutput0%2C%20output1%2C%20output2%5D%20%3D%20outputs%3B%0A%20%20if%20(inputValue0.result%20%3D%3D%201)%20%7B%0A%20%20%20%20output0(1)%3B%0A%20%20%20%20output2(inputValue0)%3B%0A%20%20%7D%20else%20%7B%0A%20%20%20%20output1(inputValue0.error_msg)%3B%0A%20%20%7D%0A%7D",
                "transformCode": "(function()%20%7B%20var%20_RTFN_%3B%20%0A%22use%20strict%22%3B%0A%0Afunction%20_slicedToArray(arr%2C%20i)%20%7B%20return%20_arrayWithHoles(arr)%20%7C%7C%20_iterableToArrayLimit(arr%2C%20i)%20%7C%7C%20_unsupportedIterableToArray(arr%2C%20i)%20%7C%7C%20_nonIterableRest()%3B%20%7D%0A%0Afunction%20_nonIterableRest()%20%7B%20throw%20new%20TypeError(%22Invalid%20attempt%20to%20destructure%20non-iterable%20instance.%5CnIn%20order%20to%20be%20iterable%2C%20non-array%20objects%20must%20have%20a%20%5BSymbol.iterator%5D()%20method.%22)%3B%20%7D%0A%0Afunction%20_unsupportedIterableToArray(o%2C%20minLen)%20%7B%20if%20(!o)%20return%3B%20if%20(typeof%20o%20%3D%3D%3D%20%22string%22)%20return%20_arrayLikeToArray(o%2C%20minLen)%3B%20var%20n%20%3D%20Object.prototype.toString.call(o).slice(8%2C%20-1)%3B%20if%20(n%20%3D%3D%3D%20%22Object%22%20%26%26%20o.constructor)%20n%20%3D%20o.constructor.name%3B%20if%20(n%20%3D%3D%3D%20%22Map%22%20%7C%7C%20n%20%3D%3D%3D%20%22Set%22)%20return%20Array.from(o)%3B%20if%20(n%20%3D%3D%3D%20%22Arguments%22%20%7C%7C%20%2F%5E(%3F%3AUi%7CI)nt(%3F%3A8%7C16%7C32)(%3F%3AClamped)%3FArray%24%2F.test(n))%20return%20_arrayLikeToArray(o%2C%20minLen)%3B%20%7D%0A%0Afunction%20_arrayLikeToArray(arr%2C%20len)%20%7B%20if%20(len%20%3D%3D%20null%20%7C%7C%20len%20%3E%20arr.length)%20len%20%3D%20arr.length%3B%20for%20(var%20i%20%3D%200%2C%20arr2%20%3D%20new%20Array(len)%3B%20i%20%3C%20len%3B%20i%2B%2B)%20%7B%20arr2%5Bi%5D%20%3D%20arr%5Bi%5D%3B%20%7D%20return%20arr2%3B%20%7D%0A%0Afunction%20_iterableToArrayLimit(arr%2C%20i)%20%7B%20var%20_i%20%3D%20arr%20%3D%3D%20null%20%3F%20null%20%3A%20typeof%20Symbol%20!%3D%3D%20%22undefined%22%20%26%26%20arr%5BSymbol.iterator%5D%20%7C%7C%20arr%5B%22%40%40iterator%22%5D%3B%20if%20(_i%20%3D%3D%20null)%20return%3B%20var%20_arr%20%3D%20%5B%5D%3B%20var%20_n%20%3D%20true%3B%20var%20_d%20%3D%20false%3B%20var%20_s%2C%20_e%3B%20try%20%7B%20for%20(_i%20%3D%20_i.call(arr)%3B%20!(_n%20%3D%20(_s%20%3D%20_i.next()).done)%3B%20_n%20%3D%20true)%20%7B%20_arr.push(_s.value)%3B%20if%20(i%20%26%26%20_arr.length%20%3D%3D%3D%20i)%20break%3B%20%7D%20%7D%20catch%20(err)%20%7B%20_d%20%3D%20true%3B%20_e%20%3D%20err%3B%20%7D%20finally%20%7B%20try%20%7B%20if%20(!_n%20%26%26%20_i%5B%22return%22%5D%20!%3D%20null)%20_i%5B%22return%22%5D()%3B%20%7D%20finally%20%7B%20if%20(_d)%20throw%20_e%3B%20%7D%20%7D%20return%20_arr%3B%20%7D%0A%0Afunction%20_arrayWithHoles(arr)%20%7B%20if%20(Array.isArray(arr))%20return%20arr%3B%20%7D%0A%0A_RTFN_%20%3D%20function%20_RTFN_(_ref)%20%7B%0A%20%20var%20outputs%20%3D%20_ref.outputs%2C%0A%20%20%20%20%20%20inputs%20%3D%20_ref.inputs%3B%0A%0A%20%20var%20_inputs%20%3D%20_slicedToArray(inputs%2C%201)%2C%0A%20%20%20%20%20%20inputValue0%20%3D%20_inputs%5B0%5D%3B%0A%0A%20%20var%20_outputs%20%3D%20_slicedToArray(outputs%2C%203)%2C%0A%20%20%20%20%20%20output0%20%3D%20_outputs%5B0%5D%2C%0A%20%20%20%20%20%20output1%20%3D%20_outputs%5B1%5D%2C%0A%20%20%20%20%20%20output2%20%3D%20_outputs%5B2%5D%3B%0A%0A%20%20if%20(inputValue0.result%20%3D%3D%201)%20%7B%0A%20%20%20%20output0(1)%3B%0A%20%20%20%20output2(inputValue0)%3B%0A%20%20%7D%20else%20%7B%0A%20%20%20%20output1(inputValue0.error_msg)%3B%0A%20%20%7D%0A%7D%3B%0A%3B%20return%20_RTFN_%3B%20%7D)()"
              }
            },
            "inputAry": [],
            "outputAry": [
              "output1",
              "output2"
            ],
            "outputEvents": {},
            "style": {
              "display": "block"
            }
          },
          "style": {},
          "configs": [],
          "_inputs": [],
          "inputs": [
            "input.inputValue0"
          ],
          "outputs": [
            "output0",
            "output1",
            "output2"
          ]
        },
        "u_stXp0": {
          "id": "u_stXp0",
          "def": {
            "namespace": "mybricks.normal-pc.message",
            "version": "1.0.4",
            "rtType": "js",
            "materialId": 44978
          },
          "frameId": "u_txdqD",
          "title": "操作成功消息提示",
          "model": {
            "data": {
              "title": "提示名称",
              "content": "操作成功",
              "duration": 3,
              "type": "success",
              "isExternal": false,
              "isEnd": false
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
          "outputs": []
        },
        "u_VmMVB": {
          "id": "u_VmMVB",
          "def": {
            "namespace": "mybricks.normal-pc.message",
            "version": "1.0.4",
            "rtType": "js",
            "materialId": 44978
          },
          "frameId": "u_txdqD",
          "title": "消息提示3",
          "model": {
            "data": {
              "title": "提示名称",
              "content": "弹出提示",
              "duration": 3,
              "type": "error",
              "isExternal": true,
              "isEnd": false
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
          "outputs": []
        }
      },
      "id": "u_Un4sN",
      "title": "主场景",
      "comsAutoRun": {},
      "_inputs": [],
      "_outputs": [],
      "inputs": [
        {
          "id": "open",
          "title": "打开",
          "type": "normal",
          "schema": {
            "type": "any"
          }
        }
      ],
      "outputs": [
        {
          "id": "click",
          "title": "点击",
          "type": "event",
          "schema": {
            "type": "any"
          }
        },
        {
          "id": "scroll",
          "title": "滚动",
          "type": "event",
          "schema": {
            "type": "object",
            "properties": {
              "scrollTop": {
                "type": "number"
              },
              "scrollLeft": {
                "type": "number"
              }
            }
          }
        },
        {
          "id": "load",
          "title": "加载完成",
          "type": "event",
          "schema": {
            "type": "any"
          }
        },
        {
          "id": "unload",
          "title": "卸载",
          "type": "event",
          "schema": {
            "type": "any"
          }
        }
      ],
      "cons": {
        "_rootFrame_-open": [
          {
            "id": "u_Ea_vm",
            "type": "com",
            "frameKey": "_rootFrame_",
            "targetFrameKey": "_rootFrame_",
            "comId": "u_mJ9wi",
            "def": {
              "namespace": "mybricks.normal-pc.query",
              "version": "1.0.6",
              "rtType": "js-autorun",
              "materialId": 36498
            },
            "pinId": "getQuery",
            "pinType": "normal",
            "direction": "input"
          }
        ],
        "u_yVwNF-change": [
          {
            "id": "u_82yd6",
            "type": "com",
            "frameKey": "_rootFrame_",
            "targetFrameKey": "_rootFrame_",
            "startPinParentKey": "u_5xhdM",
            "finishPinParentKey": "u_WhbbA",
            "comId": "u_aWqQs",
            "def": {
              "namespace": "mybricks.core-comlib.var",
              "version": "1.0.0",
              "rtType": "js"
            },
            "pinId": "set",
            "pinType": "normal",
            "direction": "input"
          }
        ],
        "u_0DxRU-change": [
          {
            "id": "u_Vbj8Q",
            "type": "com",
            "frameKey": "_rootFrame_",
            "targetFrameKey": "_rootFrame_",
            "startPinParentKey": "u_p_rZz",
            "finishPinParentKey": "u_LaNXp",
            "comId": "u_aWqQs",
            "def": {
              "namespace": "mybricks.core-comlib.var",
              "version": "1.0.0",
              "rtType": "js"
            },
            "pinId": "set",
            "pinType": "normal",
            "direction": "input"
          }
        ],
        "u_8w32h-change": [
          {
            "id": "u_qHRel",
            "type": "com",
            "frameKey": "_rootFrame_",
            "targetFrameKey": "_rootFrame_",
            "startPinParentKey": "u_eMlab",
            "finishPinParentKey": "u_6KZhF",
            "comId": "u_aWqQs",
            "def": {
              "namespace": "mybricks.core-comlib.var",
              "version": "1.0.0",
              "rtType": "js"
            },
            "pinId": "set",
            "pinType": "normal",
            "direction": "input"
          }
        ],
        "u_TGyzS-btn0": [
          {
            "id": "u_ptjmN",
            "type": "com",
            "frameKey": "_rootFrame_",
            "targetFrameKey": "_rootFrame_",
            "startPinParentKey": "u_Unv6n",
            "finishPinParentKey": "u_3QV7k",
            "comId": "u_ZttzW",
            "def": {
              "namespace": "mybricks.core-comlib.var",
              "version": "1.0.0",
              "rtType": "js"
            },
            "pinId": "set",
            "pinType": "normal",
            "direction": "input"
          }
        ],
        "u_TGyzS-u_s567wa": [
          {
            "id": "u_ibGTq",
            "type": "com",
            "frameKey": "_rootFrame_",
            "targetFrameKey": "_rootFrame_",
            "startPinParentKey": "u_yC39Q",
            "finishPinParentKey": "u_BG9h6",
            "comId": "u_ZttzW",
            "def": {
              "namespace": "mybricks.core-comlib.var",
              "version": "1.0.0",
              "rtType": "js"
            },
            "pinId": "set",
            "pinType": "normal",
            "direction": "input"
          }
        ],
        "u_TGyzS-u_pt02kz": [
          {
            "id": "u_OO6vo",
            "type": "com",
            "frameKey": "_rootFrame_",
            "targetFrameKey": "_rootFrame_",
            "startPinParentKey": "u_FqfCK",
            "finishPinParentKey": "u_ccVkH",
            "comId": "u_ZttzW",
            "def": {
              "namespace": "mybricks.core-comlib.var",
              "version": "1.0.0",
              "rtType": "js"
            },
            "pinId": "set",
            "pinType": "normal",
            "direction": "input"
          }
        ],
        "u_TGyzS-u_ywhmdw": [
          {
            "id": "u_TdJ5G",
            "type": "com",
            "frameKey": "_rootFrame_",
            "targetFrameKey": "_rootFrame_",
            "startPinParentKey": "u_DrBHb",
            "finishPinParentKey": "u_JiFY8",
            "comId": "u_ZttzW",
            "def": {
              "namespace": "mybricks.core-comlib.var",
              "version": "1.0.0",
              "rtType": "js"
            },
            "pinId": "set",
            "pinType": "normal",
            "direction": "input"
          }
        ],
        "u_TGyzS-u_d4jt2z": [
          {
            "id": "u_CbGsH",
            "type": "com",
            "frameKey": "_rootFrame_",
            "targetFrameKey": "_rootFrame_",
            "startPinParentKey": "u_X0_e4",
            "finishPinParentKey": "u_P5D3o",
            "comId": "u_ZttzW",
            "def": {
              "namespace": "mybricks.core-comlib.var",
              "version": "1.0.0",
              "rtType": "js"
            },
            "pinId": "set",
            "pinType": "normal",
            "direction": "input"
          }
        ],
        "u_TGyzS-u_caka31": [
          {
            "id": "u_WDNoy",
            "type": "com",
            "frameKey": "_rootFrame_",
            "targetFrameKey": "_rootFrame_",
            "startPinParentKey": "u_wvJ_k",
            "finishPinParentKey": "u_fc4Lh",
            "comId": "u_ZttzW",
            "def": {
              "namespace": "mybricks.core-comlib.var",
              "version": "1.0.0",
              "rtType": "js"
            },
            "pinId": "set",
            "pinType": "normal",
            "direction": "input"
          }
        ],
        "u_TGyzS-u_nti0ax": [
          {
            "id": "u_O5Cvg",
            "type": "com",
            "frameKey": "_rootFrame_",
            "targetFrameKey": "_rootFrame_",
            "finishPinParentKey": "u_JVn__",
            "comId": "u_kim6d",
            "def": {
              "namespace": "mybricks.core-comlib.var",
              "version": "1.0.0",
              "rtType": "js"
            },
            "pinId": "get",
            "pinType": "normal",
            "direction": "input"
          }
        ],
        "u_TGyzS-u_mbzp3y": [
          {
            "id": "u_5bR_a",
            "type": "com",
            "frameKey": "_rootFrame_",
            "targetFrameKey": "_rootFrame_",
            "startPinParentKey": "u_OW1O9",
            "finishPinParentKey": "u_H3MgS",
            "comId": "u_ZttzW",
            "def": {
              "namespace": "mybricks.core-comlib.var",
              "version": "1.0.0",
              "rtType": "js"
            },
            "pinId": "set",
            "pinType": "normal",
            "direction": "input"
          }
        ],
        "u_TGyzS-u_mem59p": [
          {
            "id": "u_VSH__",
            "type": "com",
            "frameKey": "_rootFrame_",
            "targetFrameKey": "_rootFrame_",
            "startPinParentKey": "u_ewqn0",
            "finishPinParentKey": "u_fphiB",
            "comId": "u_ZttzW",
            "def": {
              "namespace": "mybricks.core-comlib.var",
              "version": "1.0.0",
              "rtType": "js"
            },
            "pinId": "set",
            "pinType": "normal",
            "direction": "input"
          }
        ],
        "u_TGyzS-u_saw3rc": [
          {
            "id": "u_m1Lwx",
            "type": "com",
            "frameKey": "_rootFrame_",
            "targetFrameKey": "_rootFrame_",
            "startPinParentKey": "u_bYUHm",
            "finishPinParentKey": "u_Mj5AD",
            "comId": "u_ZttzW",
            "def": {
              "namespace": "mybricks.core-comlib.var",
              "version": "1.0.0",
              "rtType": "js"
            },
            "pinId": "set",
            "pinType": "normal",
            "direction": "input"
          }
        ],
        "u_M8qnH-output0": [
          {
            "id": "u_y9pEc",
            "type": "com",
            "frameKey": "_rootFrame_",
            "targetFrameKey": "_rootFrame_",
            "finishPinParentKey": "u_t_Ilm",
            "comId": "u_Yi2PA",
            "def": {
              "namespace": "mybricks.marketing-tools.json-schema-form-com",
              "version": "1.1.2",
              "materialId": 49094
            },
            "pinId": "content",
            "pinType": "normal",
            "direction": "input"
          },
          {
            "id": "u_lb1ve",
            "type": "com",
            "frameKey": "_rootFrame_",
            "targetFrameKey": "_rootFrame_",
            "finishPinParentKey": "u_3Q8p_",
            "comId": "u_VSeRY",
            "def": {
              "namespace": "mybricks.marketing-tools.json-schema-form-com",
              "version": "1.1.2",
              "materialId": 49094
            },
            "pinId": "content",
            "pinType": "normal",
            "direction": "input"
          },
          {
            "id": "u_zdCDI",
            "type": "com",
            "frameKey": "_rootFrame_",
            "targetFrameKey": "_rootFrame_",
            "finishPinParentKey": "u_ooZwn",
            "comId": "u_HlA1y",
            "def": {
              "namespace": "mybricks.marketing-tools.json-schema-form-com",
              "version": "1.1.2",
              "materialId": 49094
            },
            "pinId": "content",
            "pinType": "normal",
            "direction": "input"
          }
        ],
        "u_M8qnH-output1": [
          {
            "id": "u_p6Q6w",
            "type": "com",
            "frameKey": "_rootFrame_",
            "targetFrameKey": "_rootFrame_",
            "comId": "u_ECdEA",
            "def": {
              "namespace": "mybricks.basic-comlib._muilt-inputJs",
              "version": "1.0.2",
              "rtType": "js-autorun",
              "materialId": 46406
            },
            "pinId": "input.inputValue0",
            "pinType": "param",
            "direction": "input"
          },
          {
            "id": "u_G2wSO",
            "type": "com",
            "frameKey": "_rootFrame_",
            "targetFrameKey": "_rootFrame_",
            "comId": "u_uxT7z",
            "def": {
              "namespace": "mybricks.basic-comlib._muilt-inputJs",
              "version": "1.0.2",
              "rtType": "js-autorun",
              "materialId": 46406
            },
            "pinId": "input.inputValue0",
            "pinType": "param",
            "direction": "input"
          },
          {
            "id": "u_hxRaP",
            "type": "com",
            "frameKey": "_rootFrame_",
            "targetFrameKey": "_rootFrame_",
            "comId": "u_J5IuF",
            "def": {
              "namespace": "mybricks.basic-comlib._muilt-inputJs",
              "version": "1.0.2",
              "rtType": "js-autorun",
              "materialId": 46406
            },
            "pinId": "input.inputValue0",
            "pinType": "param",
            "direction": "input"
          },
          {
            "id": "u_XpqM_",
            "type": "com",
            "frameKey": "_rootFrame_",
            "targetFrameKey": "_rootFrame_",
            "comId": "u_NwTgv",
            "def": {
              "namespace": "mybricks.basic-comlib._muilt-inputJs",
              "version": "1.0.2",
              "rtType": "js-autorun",
              "materialId": 46406
            },
            "pinId": "input.inputValue0",
            "pinType": "param",
            "direction": "input"
          },
          {
            "id": "u_Tc0jL",
            "type": "com",
            "frameKey": "_rootFrame_",
            "targetFrameKey": "_rootFrame_",
            "comId": "u_pZ_Z0",
            "def": {
              "namespace": "mybricks.basic-comlib._muilt-inputJs",
              "version": "1.0.2",
              "rtType": "js-autorun",
              "materialId": 46406
            },
            "pinId": "input.inputValue0",
            "pinType": "param",
            "direction": "input"
          },
          {
            "id": "u_HgmUx",
            "type": "com",
            "frameKey": "_rootFrame_",
            "targetFrameKey": "_rootFrame_",
            "comId": "u_oW5Hr",
            "def": {
              "namespace": "mybricks.basic-comlib._muilt-inputJs",
              "version": "1.0.2",
              "rtType": "js-autorun",
              "materialId": 46406
            },
            "pinId": "input.inputValue0",
            "pinType": "param",
            "direction": "input"
          },
          {
            "id": "u_HpFz0",
            "type": "com",
            "frameKey": "_rootFrame_",
            "targetFrameKey": "_rootFrame_",
            "comId": "u_YQV_d",
            "def": {
              "namespace": "mybricks.basic-comlib._muilt-inputJs",
              "version": "1.0.2",
              "rtType": "js-autorun",
              "materialId": 46406
            },
            "pinId": "input.inputValue0",
            "pinType": "param",
            "direction": "input"
          },
          {
            "id": "u_4vn4r",
            "type": "com",
            "frameKey": "_rootFrame_",
            "targetFrameKey": "_rootFrame_",
            "comId": "u_KdPEy",
            "def": {
              "namespace": "mybricks.basic-comlib._muilt-inputJs",
              "version": "1.0.2",
              "rtType": "js-autorun",
              "materialId": 46406
            },
            "pinId": "input.inputValue0",
            "pinType": "param",
            "direction": "input"
          },
          {
            "id": "u_955_D",
            "type": "com",
            "frameKey": "_rootFrame_",
            "targetFrameKey": "_rootFrame_",
            "comId": "u_dfyy8",
            "def": {
              "namespace": "mybricks.basic-comlib._muilt-inputJs",
              "version": "1.0.2",
              "rtType": "js-autorun",
              "materialId": 46406
            },
            "pinId": "input.inputValue0",
            "pinType": "param",
            "direction": "input"
          }
        ],
        "u_M8qnH-output2": [
          {
            "id": "u_7Cdar",
            "type": "com",
            "frameKey": "_rootFrame_",
            "targetFrameKey": "_rootFrame_",
            "comId": "u_9LWxV",
            "def": {
              "namespace": "mybricks.basic-comlib._muilt-inputJs",
              "version": "1.0.2",
              "rtType": "js-autorun",
              "materialId": 46406
            },
            "pinId": "input.inputValue0",
            "pinType": "param",
            "direction": "input"
          }
        ],
        "u_M8qnH-output3": [
          {
            "id": "u_RR7mV",
            "type": "com",
            "frameKey": "_rootFrame_",
            "targetFrameKey": "_rootFrame_",
            "comId": "u_1SJCN",
            "def": {
              "namespace": "mybricks.normal-pc.message",
              "version": "1.0.4",
              "rtType": "js",
              "materialId": 44978
            },
            "pinId": "showMsg",
            "pinType": "normal",
            "direction": "input"
          }
        ],
        "u_M8qnH-output4": [
          {
            "id": "u_b9wUn",
            "type": "com",
            "frameKey": "_rootFrame_",
            "targetFrameKey": "_rootFrame_",
            "finishPinParentKey": "u_U_sCh",
            "comId": "u_xe79v",
            "def": {
              "namespace": "mybricks.core-comlib.var",
              "version": "1.0.0",
              "rtType": "js"
            },
            "pinId": "set",
            "pinType": "normal",
            "direction": "input"
          }
        ],
        "u_M8qnH-output5": [
          {
            "id": "u_MvT9P",
            "type": "com",
            "frameKey": "_rootFrame_",
            "targetFrameKey": "_rootFrame_",
            "comId": "u_wBfQx",
            "def": {
              "namespace": "mybricks.basic-comlib._muilt-inputJs",
              "version": "1.0.2",
              "rtType": "js-autorun",
              "materialId": 46406
            },
            "pinId": "input.inputValue0",
            "pinType": "param",
            "direction": "input"
          }
        ],
        "u_M8qnH-output6": [
          {
            "id": "u_qilkY",
            "type": "com",
            "frameKey": "_rootFrame_",
            "targetFrameKey": "_rootFrame_",
            "comId": "u_Z_6cV",
            "def": {
              "namespace": "mybricks.normal-pc.timer-loop",
              "version": "1.0.1",
              "rtType": "js",
              "materialId": 30013
            },
            "pinId": "trigger",
            "pinType": "normal",
            "direction": "input"
          }
        ],
        "u_M8qnH-output7": [
          {
            "id": "u_UnT1J",
            "type": "com",
            "frameKey": "_rootFrame_",
            "targetFrameKey": "_rootFrame_",
            "comId": "u_Z_6cV",
            "def": {
              "namespace": "mybricks.normal-pc.timer-loop",
              "version": "1.0.1",
              "rtType": "js",
              "materialId": 30013
            },
            "pinId": "cancel",
            "pinType": "normal",
            "direction": "input"
          }
        ],
        "u_M8qnH-output8": [
          {
            "id": "u_FWpS2",
            "type": "com",
            "frameKey": "_rootFrame_",
            "targetFrameKey": "_rootFrame_",
            "finishPinParentKey": "u_dSdBj",
            "comId": "u__1_Ux",
            "def": {
              "namespace": "mybricks.core-comlib.var",
              "version": "1.0.0",
              "rtType": "js"
            },
            "pinId": "set",
            "pinType": "normal",
            "direction": "input"
          }
        ],
        "u_M8qnH-output9": [
          {
            "id": "u__t3c4",
            "type": "com",
            "frameKey": "_rootFrame_",
            "targetFrameKey": "_rootFrame_",
            "finishPinParentKey": "u_MOMko",
            "comId": "u_6nkja",
            "def": {
              "namespace": "mybricks.normal-pc.text",
              "version": "1.0.17",
              "materialId": 47511
            },
            "pinId": "content",
            "pinType": "normal",
            "direction": "input"
          }
        ],
        "u_M8qnH-output10": [
          {
            "id": "u_n8Thj",
            "type": "com",
            "frameKey": "_rootFrame_",
            "targetFrameKey": "_rootFrame_",
            "finishPinParentKey": "u_SOS_4",
            "comId": "u_aIWUY",
            "def": {
              "namespace": "mybricks.normal-pc.single-image",
              "version": "1.0.15",
              "materialId": 47548
            },
            "pinId": "setImgSrc",
            "pinType": "normal",
            "direction": "input"
          },
          {
            "id": "u_JIGBR",
            "type": "com",
            "frameKey": "_rootFrame_",
            "targetFrameKey": "_rootFrame_",
            "finishPinParentKey": "u_FYM7P",
            "comId": "u_odZh7",
            "def": {
              "namespace": "mybricks.normal-pc.single-image",
              "version": "1.0.15",
              "materialId": 47548
            },
            "pinId": "setImgSrc",
            "pinType": "normal",
            "direction": "input"
          },
          {
            "id": "u_CmVca",
            "type": "com",
            "frameKey": "_rootFrame_",
            "targetFrameKey": "_rootFrame_",
            "finishPinParentKey": "u_iB2iA",
            "comId": "u_YaOIm",
            "def": {
              "namespace": "mybricks.normal-pc.single-image",
              "version": "1.0.15",
              "materialId": 47548
            },
            "pinId": "setImgSrc",
            "pinType": "normal",
            "direction": "input"
          }
        ],
        "u_M8qnH-output11": [
          {
            "id": "u__kVh_",
            "type": "com",
            "frameKey": "_rootFrame_",
            "targetFrameKey": "_rootFrame_",
            "comId": "u_oKSic",
            "def": {
              "namespace": "mybricks.basic-comlib._muilt-inputJs",
              "version": "1.0.2",
              "rtType": "js-autorun",
              "materialId": 46406
            },
            "pinId": "input.inputValue0",
            "pinType": "param",
            "direction": "input"
          },
          {
            "id": "u_0SG6j",
            "type": "com",
            "frameKey": "_rootFrame_",
            "targetFrameKey": "_rootFrame_",
            "comId": "u_9LWxV",
            "def": {
              "namespace": "mybricks.basic-comlib._muilt-inputJs",
              "version": "1.0.2",
              "rtType": "js-autorun",
              "materialId": 46406
            },
            "pinId": "input.inputValue1",
            "pinType": "normal",
            "direction": "input"
          }
        ],
        "u_M8qnH-output12": [
          {
            "id": "u_6hwp6",
            "type": "com",
            "frameKey": "_rootFrame_",
            "targetFrameKey": "_rootFrame_",
            "comId": "u_v8NEV",
            "def": {
              "namespace": "mybricks.basic-comlib._muilt-inputJs",
              "version": "1.0.2",
              "rtType": "js-autorun",
              "materialId": 46406
            },
            "pinId": "input.inputValue0",
            "pinType": "param",
            "direction": "input"
          }
        ],
        "u_M8qnH-output13": [
          {
            "id": "u_h2lxJ",
            "type": "com",
            "frameKey": "_rootFrame_",
            "targetFrameKey": "_rootFrame_",
            "finishPinParentKey": "u_b03gr",
            "comId": "u_8w32h",
            "def": {
              "namespace": "mybricks.marketing-tools.json-schema-form-com",
              "version": "1.1.2",
              "materialId": 49094
            },
            "pinId": "content",
            "pinType": "normal",
            "direction": "input"
          },
          {
            "id": "u_XgQgB",
            "type": "com",
            "frameKey": "_rootFrame_",
            "targetFrameKey": "_rootFrame_",
            "finishPinParentKey": "u_1TjoW",
            "comId": "u_yVwNF",
            "def": {
              "namespace": "mybricks.marketing-tools.json-schema-form-com",
              "version": "1.1.2",
              "materialId": 49094
            },
            "pinId": "content",
            "pinType": "normal",
            "direction": "input"
          },
          {
            "id": "u_SCwKb",
            "type": "com",
            "frameKey": "_rootFrame_",
            "targetFrameKey": "_rootFrame_",
            "finishPinParentKey": "u_uaa8j",
            "comId": "u_0DxRU",
            "def": {
              "namespace": "mybricks.marketing-tools.json-schema-form-com",
              "version": "1.1.2",
              "materialId": 49094
            },
            "pinId": "content",
            "pinType": "normal",
            "direction": "input"
          }
        ],
        "u_M8qnH-output14": [
          {
            "id": "u_P2xNB",
            "type": "com",
            "frameKey": "_rootFrame_",
            "targetFrameKey": "_rootFrame_",
            "finishPinParentKey": "u_xTHXZ",
            "comId": "u_aWqQs",
            "def": {
              "namespace": "mybricks.core-comlib.var",
              "version": "1.0.0",
              "rtType": "js"
            },
            "pinId": "set",
            "pinType": "normal",
            "direction": "input"
          }
        ],
        "u_xe79v-return": [
          {
            "id": "u_zBb0C",
            "type": "com",
            "frameKey": "_rootFrame_",
            "targetFrameKey": "_rootFrame_",
            "startPinParentKey": "u_fTwdP",
            "comId": "u_bkgWF",
            "def": {
              "namespace": "mybricks.basic-comlib._muilt-inputJs",
              "version": "1.0.2",
              "rtType": "js-autorun",
              "materialId": 46406
            },
            "pinId": "input.inputValue0",
            "pinType": "param",
            "direction": "input"
          },
          {
            "id": "u_mmuzb",
            "type": "com",
            "frameKey": "u_txdqD",
            "targetFrameKey": "u_txdqD",
            "startPinParentKey": "u_wLJXp",
            "comId": "u_R0B_k",
            "def": {
              "namespace": "mybricks.basic-comlib._muilt-inputJs",
              "version": "1.0.2",
              "rtType": "js-autorun",
              "materialId": 46406
            },
            "pinId": "input.inputValue0",
            "pinType": "param",
            "direction": "input"
          }
        ],
        "u_uxT7z-output0": [
          {
            "id": "u_UqHT5",
            "type": "com",
            "frameKey": "_rootFrame_",
            "targetFrameKey": "_rootFrame_",
            "finishPinParentKey": "u_1qqXo",
            "comId": "u_TGyzS",
            "def": {
              "namespace": "mybricks.normal-pc.toolbar",
              "version": "1.0.20",
              "materialId": 47248
            },
            "pinId": "setVisible_btn0",
            "pinType": "normal",
            "direction": "input"
          }
        ],
        "u_uxT7z-output1": [
          {
            "id": "u_MgODC",
            "type": "com",
            "frameKey": "_rootFrame_",
            "targetFrameKey": "_rootFrame_",
            "finishPinParentKey": "u_7_gj3",
            "comId": "u_TGyzS",
            "def": {
              "namespace": "mybricks.normal-pc.toolbar",
              "version": "1.0.20",
              "materialId": 47248
            },
            "pinId": "setHidden_btn0",
            "pinType": "normal",
            "direction": "input"
          }
        ],
        "u_J5IuF-output0": [
          {
            "id": "u_6rUYq",
            "type": "com",
            "frameKey": "_rootFrame_",
            "targetFrameKey": "_rootFrame_",
            "finishPinParentKey": "u_yPF6s",
            "comId": "u_TGyzS",
            "def": {
              "namespace": "mybricks.normal-pc.toolbar",
              "version": "1.0.20",
              "materialId": 47248
            },
            "pinId": "setVisible_u_s567wa",
            "pinType": "normal",
            "direction": "input"
          }
        ],
        "u_J5IuF-output1": [
          {
            "id": "u_HXhv3",
            "type": "com",
            "frameKey": "_rootFrame_",
            "targetFrameKey": "_rootFrame_",
            "finishPinParentKey": "u_Cqhop",
            "comId": "u_TGyzS",
            "def": {
              "namespace": "mybricks.normal-pc.toolbar",
              "version": "1.0.20",
              "materialId": 47248
            },
            "pinId": "setHidden_u_s567wa",
            "pinType": "normal",
            "direction": "input"
          }
        ],
        "u_ECdEA-output0": [
          {
            "id": "u_GCOrA",
            "type": "com",
            "frameKey": "_rootFrame_",
            "targetFrameKey": "_rootFrame_",
            "finishPinParentKey": "u_viC4e",
            "comId": "u_TGyzS",
            "def": {
              "namespace": "mybricks.normal-pc.toolbar",
              "version": "1.0.20",
              "materialId": 47248
            },
            "pinId": "setVisible_u_pt02kz",
            "pinType": "normal",
            "direction": "input"
          }
        ],
        "u_ECdEA-output1": [
          {
            "id": "u_q_BqX",
            "type": "com",
            "frameKey": "_rootFrame_",
            "targetFrameKey": "_rootFrame_",
            "finishPinParentKey": "u_06eM1",
            "comId": "u_TGyzS",
            "def": {
              "namespace": "mybricks.normal-pc.toolbar",
              "version": "1.0.20",
              "materialId": 47248
            },
            "pinId": "setHidden_u_pt02kz",
            "pinType": "normal",
            "direction": "input"
          }
        ],
        "u_NwTgv-output0": [
          {
            "id": "u_bzbeH",
            "type": "com",
            "frameKey": "_rootFrame_",
            "targetFrameKey": "_rootFrame_",
            "finishPinParentKey": "u_QeqFZ",
            "comId": "u_TGyzS",
            "def": {
              "namespace": "mybricks.normal-pc.toolbar",
              "version": "1.0.20",
              "materialId": 47248
            },
            "pinId": "setVisible_u_ywhmdw",
            "pinType": "normal",
            "direction": "input"
          }
        ],
        "u_NwTgv-output1": [
          {
            "id": "u_XcYB7",
            "type": "com",
            "frameKey": "_rootFrame_",
            "targetFrameKey": "_rootFrame_",
            "finishPinParentKey": "u_3l4rs",
            "comId": "u_TGyzS",
            "def": {
              "namespace": "mybricks.normal-pc.toolbar",
              "version": "1.0.20",
              "materialId": 47248
            },
            "pinId": "setHidden_u_ywhmdw",
            "pinType": "normal",
            "direction": "input"
          }
        ],
        "u_pZ_Z0-output0": [
          {
            "id": "u_C9ru5",
            "type": "com",
            "frameKey": "_rootFrame_",
            "targetFrameKey": "_rootFrame_",
            "finishPinParentKey": "u_z_9M3",
            "comId": "u_TGyzS",
            "def": {
              "namespace": "mybricks.normal-pc.toolbar",
              "version": "1.0.20",
              "materialId": 47248
            },
            "pinId": "setVisible_u_d4jt2z",
            "pinType": "normal",
            "direction": "input"
          }
        ],
        "u_pZ_Z0-output1": [
          {
            "id": "u_GfCWm",
            "type": "com",
            "frameKey": "_rootFrame_",
            "targetFrameKey": "_rootFrame_",
            "finishPinParentKey": "u_ZLofy",
            "comId": "u_TGyzS",
            "def": {
              "namespace": "mybricks.normal-pc.toolbar",
              "version": "1.0.20",
              "materialId": 47248
            },
            "pinId": "setHidden_u_d4jt2z",
            "pinType": "normal",
            "direction": "input"
          }
        ],
        "u_bkgWF-output0": [
          {
            "id": "u_XfCcF",
            "type": "com",
            "frameKey": "_rootFrame_",
            "targetFrameKey": "_rootFrame_",
            "comId": "u_ODJQ5",
            "def": {
              "namespace": "mybricks.normal-pc.service",
              "version": "1.0.8",
              "rtType": "js-autorun",
              "materialId": 38932
            },
            "pinId": "call",
            "pinType": "normal",
            "direction": "input"
          }
        ],
        "u_bkgWF-output1": [
          {
            "id": "u_yOxTa",
            "type": "com",
            "frameKey": "_rootFrame_",
            "targetFrameKey": "_rootFrame_",
            "comId": "u_s28XG",
            "def": {
              "namespace": "mybricks.normal-pc.message",
              "version": "1.0.4",
              "rtType": "js",
              "materialId": 44978
            },
            "pinId": "showMsg",
            "pinType": "normal",
            "direction": "input"
          }
        ],
        "u_p2Yel-then": [
          {
            "id": "u_I_xzZ",
            "type": "com",
            "frameKey": "_rootFrame_",
            "targetFrameKey": "_rootFrame_",
            "finishPinParentKey": "u_8e_fj",
            "comId": "u_2gccB",
            "def": {
              "namespace": "mybricks.core-comlib.var",
              "version": "1.0.0",
              "rtType": "js"
            },
            "pinId": "set",
            "pinType": "normal",
            "direction": "input"
          }
        ],
        "u_p2Yel-catch": [
          {
            "id": "u_aSng8",
            "type": "com",
            "frameKey": "_rootFrame_",
            "targetFrameKey": "_rootFrame_",
            "comId": "u_49N_u",
            "def": {
              "namespace": "mybricks.normal-pc.message",
              "version": "1.0.4",
              "rtType": "js",
              "materialId": 44978
            },
            "pinId": "showMsg",
            "pinType": "normal",
            "direction": "input"
          }
        ],
        "u_mJ9wi-queryData": [
          {
            "id": "u_aHpgO",
            "type": "com",
            "frameKey": "_rootFrame_",
            "targetFrameKey": "_rootFrame_",
            "comId": "u_p2Yel",
            "def": {
              "namespace": "mybricks.normal-pc.service",
              "version": "1.0.8",
              "rtType": "js-autorun",
              "materialId": 38932
            },
            "pinId": "call",
            "pinType": "normal",
            "direction": "input"
          },
          {
            "id": "u_iJiya",
            "type": "com",
            "frameKey": "_rootFrame_",
            "targetFrameKey": "_rootFrame_",
            "finishPinParentKey": "u_Fw05f",
            "comId": "u_kim6d",
            "def": {
              "namespace": "mybricks.core-comlib.var",
              "version": "1.0.0",
              "rtType": "js"
            },
            "pinId": "set",
            "pinType": "normal",
            "direction": "input"
          }
        ],
        "u_ODJQ5-then": [
          {
            "id": "u_OW03p",
            "type": "com",
            "frameKey": "_rootFrame_",
            "targetFrameKey": "_rootFrame_",
            "comId": "u_1HpqI",
            "def": {
              "namespace": "mybricks.basic-comlib._muilt-inputJs",
              "version": "1.0.2",
              "rtType": "js-autorun",
              "materialId": 46406
            },
            "pinId": "input.inputValue0",
            "pinType": "param",
            "direction": "input"
          }
        ],
        "u_ODJQ5-catch": [
          {
            "id": "u_lfhO_",
            "type": "com",
            "frameKey": "_rootFrame_",
            "targetFrameKey": "_rootFrame_",
            "comId": "u_hikTC",
            "def": {
              "namespace": "mybricks.normal-pc.message",
              "version": "1.0.4",
              "rtType": "js",
              "materialId": 44978
            },
            "pinId": "showMsg",
            "pinType": "normal",
            "direction": "input"
          }
        ],
        "u_1HpqI-output0": [
          {
            "id": "u_KTClw",
            "type": "com",
            "frameKey": "_rootFrame_",
            "targetFrameKey": "_rootFrame_",
            "comId": "u_d4CXk",
            "def": {
              "namespace": "mybricks.normal-pc.message",
              "version": "1.0.4",
              "rtType": "js",
              "materialId": 44978
            },
            "pinId": "showMsg",
            "pinType": "normal",
            "direction": "input"
          }
        ],
        "u_1HpqI-output1": [
          {
            "id": "u_iVTu_",
            "type": "com",
            "frameKey": "_rootFrame_",
            "targetFrameKey": "_rootFrame_",
            "comId": "u_dCsjp",
            "def": {
              "namespace": "mybricks.normal-pc.message",
              "version": "1.0.4",
              "rtType": "js",
              "materialId": 44978
            },
            "pinId": "showMsg",
            "pinType": "normal",
            "direction": "input"
          }
        ],
        "u_1HpqI-output2": [
          {
            "id": "u_Ffku7",
            "type": "com",
            "frameKey": "_rootFrame_",
            "targetFrameKey": "_rootFrame_",
            "finishPinParentKey": "u_D3v65",
            "comId": "u_2gccB",
            "def": {
              "namespace": "mybricks.core-comlib.var",
              "version": "1.0.0",
              "rtType": "js"
            },
            "pinId": "set",
            "pinType": "normal",
            "direction": "input"
          }
        ],
        "u_kim6d-return": [
          {
            "id": "u_gC23n",
            "type": "com",
            "frameKey": "_rootFrame_",
            "targetFrameKey": "_rootFrame_",
            "startPinParentKey": "u_2wu_q",
            "comId": "u_bkgWF",
            "def": {
              "namespace": "mybricks.basic-comlib._muilt-inputJs",
              "version": "1.0.2",
              "rtType": "js-autorun",
              "materialId": 46406
            },
            "pinId": "input.inputValue2",
            "pinType": "normal",
            "direction": "input"
          },
          {
            "id": "u_nbQOS",
            "type": "com",
            "frameKey": "_rootFrame_",
            "targetFrameKey": "_rootFrame_",
            "startPinParentKey": "u_yn6Mu",
            "comId": "u_iOQkV",
            "def": {
              "namespace": "mybricks.basic-comlib._muilt-inputJs",
              "version": "1.0.2",
              "rtType": "js-autorun",
              "materialId": 46406
            },
            "pinId": "input.inputValue0",
            "pinType": "param",
            "direction": "input"
          },
          {
            "id": "u_JUiFT",
            "type": "com",
            "frameKey": "u_txdqD",
            "targetFrameKey": "u_txdqD",
            "startPinParentKey": "u_dUnSM",
            "comId": "u_R0B_k",
            "def": {
              "namespace": "mybricks.basic-comlib._muilt-inputJs",
              "version": "1.0.2",
              "rtType": "js-autorun",
              "materialId": 46406
            },
            "pinId": "input.inputValue2",
            "pinType": "normal",
            "direction": "input"
          },
          {
            "id": "u_RxURN",
            "type": "com",
            "frameKey": "_rootFrame_",
            "targetFrameKey": "_rootFrame_",
            "startPinParentKey": "u_JVn__",
            "comId": "u_Hluf_",
            "def": {
              "namespace": "mybricks.basic-comlib._muilt-inputJs",
              "version": "1.0.2",
              "rtType": "js-autorun",
              "materialId": 46406
            },
            "pinId": "input.inputValue0",
            "pinType": "param",
            "direction": "input"
          }
        ],
        "u_ZttzW-return": [
          {
            "id": "u__pHAv",
            "type": "com",
            "frameKey": "_rootFrame_",
            "targetFrameKey": "_rootFrame_",
            "startPinParentKey": "u_3QV7k",
            "comId": "u_QxeA5",
            "def": {
              "namespace": "mybricks.core-comlib.fn",
              "version": "1.0.0",
              "rtType": "js"
            },
            "pinId": "param0",
            "pinType": "normal",
            "direction": "input"
          },
          {
            "id": "u_yW9Bi",
            "type": "com",
            "frameKey": "_rootFrame_",
            "targetFrameKey": "_rootFrame_",
            "startPinParentKey": "u_H3MgS",
            "comId": "u_q3dd7",
            "def": {
              "namespace": "mybricks.core-comlib.fn",
              "version": "1.0.0",
              "rtType": "js"
            },
            "pinId": "param0",
            "pinType": "normal",
            "direction": "input"
          },
          {
            "id": "u_COnAr",
            "type": "com",
            "frameKey": "_rootFrame_",
            "targetFrameKey": "_rootFrame_",
            "startPinParentKey": "u_BG9h6",
            "comId": "u_EpT3d",
            "def": {
              "namespace": "mybricks.core-comlib.fn",
              "version": "1.0.0",
              "rtType": "js"
            },
            "pinId": "param0",
            "pinType": "normal",
            "direction": "input"
          },
          {
            "id": "u_frQpE",
            "type": "com",
            "frameKey": "_rootFrame_",
            "targetFrameKey": "_rootFrame_",
            "startPinParentKey": "u_ccVkH",
            "comId": "u_z64Io",
            "def": {
              "namespace": "mybricks.core-comlib.fn",
              "version": "1.0.0",
              "rtType": "js"
            },
            "pinId": "param0",
            "pinType": "normal",
            "direction": "input"
          },
          {
            "id": "u_WARQH",
            "type": "com",
            "frameKey": "_rootFrame_",
            "targetFrameKey": "_rootFrame_",
            "startPinParentKey": "u_JiFY8",
            "comId": "u_SAuUF",
            "def": {
              "namespace": "mybricks.core-comlib.fn",
              "version": "1.0.0",
              "rtType": "js"
            },
            "pinId": "param0",
            "pinType": "normal",
            "direction": "input"
          },
          {
            "id": "u_nppLV",
            "type": "com",
            "frameKey": "_rootFrame_",
            "targetFrameKey": "_rootFrame_",
            "startPinParentKey": "u_P5D3o",
            "comId": "u_opw7D",
            "def": {
              "namespace": "mybricks.core-comlib.fn",
              "version": "1.0.0",
              "rtType": "js"
            },
            "pinId": "param0",
            "pinType": "normal",
            "direction": "input"
          },
          {
            "id": "u_lRI2z",
            "type": "com",
            "frameKey": "_rootFrame_",
            "targetFrameKey": "_rootFrame_",
            "startPinParentKey": "u_fc4Lh",
            "comId": "u_5uZS5",
            "def": {
              "namespace": "mybricks.core-comlib.fn",
              "version": "1.0.0",
              "rtType": "js"
            },
            "pinId": "param0",
            "pinType": "normal",
            "direction": "input"
          },
          {
            "id": "u_HqRoO",
            "type": "com",
            "frameKey": "_rootFrame_",
            "targetFrameKey": "_rootFrame_",
            "startPinParentKey": "u_fphiB",
            "comId": "u_xpR1B",
            "def": {
              "namespace": "mybricks.core-comlib.fn",
              "version": "1.0.0",
              "rtType": "js"
            },
            "pinId": "param0",
            "pinType": "normal",
            "direction": "input"
          },
          {
            "id": "u_lFJJC",
            "type": "com",
            "frameKey": "_rootFrame_",
            "targetFrameKey": "_rootFrame_",
            "startPinParentKey": "u_Mj5AD",
            "comId": "u_IeTcO",
            "def": {
              "namespace": "mybricks.core-comlib.fn",
              "version": "1.0.0",
              "rtType": "js"
            },
            "pinId": "param0",
            "pinType": "normal",
            "direction": "input"
          }
        ],
        "u_2gccB-changed": [
          {
            "id": "u_7QOGI",
            "type": "com",
            "frameKey": "_rootFrame_",
            "targetFrameKey": "_rootFrame_",
            "startPinParentKey": "u_t_x8V",
            "comId": "u_M8qnH",
            "def": {
              "namespace": "mybricks.basic-comlib._muilt-inputJs",
              "version": "1.0.2",
              "rtType": "js-autorun",
              "materialId": 46406
            },
            "pinId": "input.inputValue0",
            "pinType": "param",
            "direction": "input"
          }
        ],
        "u_oW5Hr-output0": [
          {
            "id": "u_G46qM",
            "type": "com",
            "frameKey": "_rootFrame_",
            "targetFrameKey": "_rootFrame_",
            "finishPinParentKey": "u_1ENyc",
            "comId": "u_TGyzS",
            "def": {
              "namespace": "mybricks.normal-pc.toolbar",
              "version": "1.0.20",
              "materialId": 47248
            },
            "pinId": "setVisible_u_caka31",
            "pinType": "normal",
            "direction": "input"
          }
        ],
        "u_oW5Hr-output1": [
          {
            "id": "u_gABDo",
            "type": "com",
            "frameKey": "_rootFrame_",
            "targetFrameKey": "_rootFrame_",
            "finishPinParentKey": "u_HHzgm",
            "comId": "u_TGyzS",
            "def": {
              "namespace": "mybricks.normal-pc.toolbar",
              "version": "1.0.20",
              "materialId": 47248
            },
            "pinId": "setHidden_u_caka31",
            "pinType": "normal",
            "direction": "input"
          }
        ],
        "u_Z_6cV-trigger": [
          {
            "id": "u__jLDM",
            "type": "com",
            "frameKey": "_rootFrame_",
            "targetFrameKey": "_rootFrame_",
            "finishPinParentKey": "u_yn6Mu",
            "comId": "u_kim6d",
            "def": {
              "namespace": "mybricks.core-comlib.var",
              "version": "1.0.0",
              "rtType": "js"
            },
            "pinId": "get",
            "pinType": "normal",
            "direction": "input"
          },
          {
            "id": "u_jZ1rb",
            "type": "com",
            "frameKey": "_rootFrame_",
            "targetFrameKey": "_rootFrame_",
            "finishPinParentKey": "u_Q_L31",
            "comId": "u__1_Ux",
            "def": {
              "namespace": "mybricks.core-comlib.var",
              "version": "1.0.0",
              "rtType": "js"
            },
            "pinId": "get",
            "pinType": "normal",
            "direction": "input"
          }
        ],
        "u_qz2XB-then": [
          {
            "id": "u_ypReJ",
            "type": "com",
            "frameKey": "_rootFrame_",
            "targetFrameKey": "_rootFrame_",
            "finishPinParentKey": "u_9ojJP",
            "comId": "u_2gccB",
            "def": {
              "namespace": "mybricks.core-comlib.var",
              "version": "1.0.0",
              "rtType": "js"
            },
            "pinId": "set",
            "pinType": "normal",
            "direction": "input"
          }
        ],
        "u_qz2XB-catch": [
          {
            "id": "u__fJ_X",
            "type": "com",
            "frameKey": "_rootFrame_",
            "targetFrameKey": "_rootFrame_",
            "comId": "u_STGPs",
            "def": {
              "namespace": "mybricks.normal-pc.message",
              "version": "1.0.4",
              "rtType": "js",
              "materialId": 44978
            },
            "pinId": "showMsg",
            "pinType": "normal",
            "direction": "input"
          }
        ],
        "u__1_Ux-return": [
          {
            "id": "u_hsTl9",
            "type": "com",
            "frameKey": "_rootFrame_",
            "targetFrameKey": "_rootFrame_",
            "startPinParentKey": "u_Q_L31",
            "comId": "u_iOQkV",
            "def": {
              "namespace": "mybricks.basic-comlib._muilt-inputJs",
              "version": "1.0.2",
              "rtType": "js-autorun",
              "materialId": 46406
            },
            "pinId": "input.inputValue1",
            "pinType": "normal",
            "direction": "input"
          },
          {
            "id": "u_zSpqW",
            "type": "com",
            "frameKey": "u_txdqD",
            "targetFrameKey": "u_txdqD",
            "startPinParentKey": "u_15bCY",
            "comId": "u_R0B_k",
            "def": {
              "namespace": "mybricks.basic-comlib._muilt-inputJs",
              "version": "1.0.2",
              "rtType": "js-autorun",
              "materialId": 46406
            },
            "pinId": "input.inputValue5",
            "pinType": "normal",
            "direction": "input"
          }
        ],
        "u_iOQkV-output0": [
          {
            "id": "u_QoW0L",
            "type": "com",
            "frameKey": "_rootFrame_",
            "targetFrameKey": "_rootFrame_",
            "comId": "u_qz2XB",
            "def": {
              "namespace": "mybricks.normal-pc.service",
              "version": "1.0.8",
              "rtType": "js-autorun",
              "materialId": 38932
            },
            "pinId": "call",
            "pinType": "normal",
            "direction": "input"
          }
        ],
        "u_YQV_d-output0": [
          {
            "id": "u__UDu6",
            "type": "com",
            "frameKey": "_rootFrame_",
            "targetFrameKey": "_rootFrame_",
            "finishPinParentKey": "u_Yz8iH",
            "comId": "u_TGyzS",
            "def": {
              "namespace": "mybricks.normal-pc.toolbar",
              "version": "1.0.20",
              "materialId": 47248
            },
            "pinId": "setVisible_u_mbzp3y",
            "pinType": "normal",
            "direction": "input"
          }
        ],
        "u_YQV_d-output1": [
          {
            "id": "u_hPqxw",
            "type": "com",
            "frameKey": "_rootFrame_",
            "targetFrameKey": "_rootFrame_",
            "finishPinParentKey": "u_RVnj_",
            "comId": "u_TGyzS",
            "def": {
              "namespace": "mybricks.normal-pc.toolbar",
              "version": "1.0.20",
              "materialId": 47248
            },
            "pinId": "setHidden_u_mbzp3y",
            "pinType": "normal",
            "direction": "input"
          }
        ],
        "u_KdPEy-output0": [
          {
            "id": "u_q9hd4",
            "type": "com",
            "frameKey": "_rootFrame_",
            "targetFrameKey": "_rootFrame_",
            "finishPinParentKey": "u_FWCjk",
            "comId": "u_TGyzS",
            "def": {
              "namespace": "mybricks.normal-pc.toolbar",
              "version": "1.0.20",
              "materialId": 47248
            },
            "pinId": "setVisible_u_mem59p",
            "pinType": "normal",
            "direction": "input"
          }
        ],
        "u_KdPEy-output1": [
          {
            "id": "u_htvMJ",
            "type": "com",
            "frameKey": "_rootFrame_",
            "targetFrameKey": "_rootFrame_",
            "finishPinParentKey": "u_4aSax",
            "comId": "u_TGyzS",
            "def": {
              "namespace": "mybricks.normal-pc.toolbar",
              "version": "1.0.20",
              "materialId": 47248
            },
            "pinId": "setHidden_u_mem59p",
            "pinType": "normal",
            "direction": "input"
          }
        ],
        "u_dfyy8-output0": [
          {
            "id": "u_r_oMZ",
            "type": "com",
            "frameKey": "_rootFrame_",
            "targetFrameKey": "_rootFrame_",
            "finishPinParentKey": "u_5efNf",
            "comId": "u_TGyzS",
            "def": {
              "namespace": "mybricks.normal-pc.toolbar",
              "version": "1.0.20",
              "materialId": 47248
            },
            "pinId": "setVisible_u_saw3rc",
            "pinType": "normal",
            "direction": "input"
          }
        ],
        "u_dfyy8-output1": [
          {
            "id": "u_JVrkf",
            "type": "com",
            "frameKey": "_rootFrame_",
            "targetFrameKey": "_rootFrame_",
            "finishPinParentKey": "u_5Mc86",
            "comId": "u_TGyzS",
            "def": {
              "namespace": "mybricks.normal-pc.toolbar",
              "version": "1.0.20",
              "materialId": 47248
            },
            "pinId": "setHidden_u_saw3rc",
            "pinType": "normal",
            "direction": "input"
          }
        ],
        "u_oKSic-output0": [
          {
            "id": "u_jNkgv",
            "type": "com",
            "frameKey": "_rootFrame_",
            "targetFrameKey": "_rootFrame_",
            "finishPinParentKey": "u__fA2O",
            "comId": "u_x5c3j",
            "def": {
              "namespace": "mybricks.normal-pc.steps",
              "version": "1.0.23",
              "materialId": 47250
            },
            "pinId": "setHideSteps",
            "pinType": "normal",
            "direction": "input"
          }
        ],
        "u_9LWxV-output0": [
          {
            "id": "u_XVenX",
            "type": "com",
            "frameKey": "_rootFrame_",
            "targetFrameKey": "_rootFrame_",
            "finishPinParentKey": "u_BEOEt",
            "comId": "u_x5c3j",
            "def": {
              "namespace": "mybricks.normal-pc.steps",
              "version": "1.0.23",
              "materialId": 47250
            },
            "pinId": "jumpTo",
            "pinType": "normal",
            "direction": "input"
          }
        ],
        "u__dDQ1-return": [
          {
            "id": "u_vJuXg",
            "type": "com",
            "frameKey": "_rootFrame_",
            "targetFrameKey": "_rootFrame_",
            "startPinParentKey": "u_kdPy2",
            "comId": "u_bkgWF",
            "def": {
              "namespace": "mybricks.basic-comlib._muilt-inputJs",
              "version": "1.0.2",
              "rtType": "js-autorun",
              "materialId": 46406
            },
            "pinId": "input.inputValue3",
            "pinType": "normal",
            "direction": "input"
          },
          {
            "id": "u_VNZCb",
            "type": "com",
            "frameKey": "u_txdqD",
            "targetFrameKey": "u_txdqD",
            "startPinParentKey": "u_lpr0K",
            "comId": "u_R0B_k",
            "def": {
              "namespace": "mybricks.basic-comlib._muilt-inputJs",
              "version": "1.0.2",
              "rtType": "js-autorun",
              "materialId": 46406
            },
            "pinId": "input.inputValue3",
            "pinType": "normal",
            "direction": "input"
          }
        ],
        "u_Yi2PA-change": [
          {
            "id": "u_O3Yxp",
            "type": "com",
            "frameKey": "_rootFrame_",
            "targetFrameKey": "_rootFrame_",
            "startPinParentKey": "u_yFKRF",
            "finishPinParentKey": "u_d4MN2",
            "comId": "u_xe79v",
            "def": {
              "namespace": "mybricks.core-comlib.var",
              "version": "1.0.0",
              "rtType": "js"
            },
            "pinId": "set",
            "pinType": "normal",
            "direction": "input"
          }
        ],
        "u_Yi2PA-validated": [
          {
            "id": "u_avLxE",
            "type": "com",
            "frameKey": "_rootFrame_",
            "targetFrameKey": "_rootFrame_",
            "startPinParentKey": "u_Fz6xO",
            "finishPinParentKey": "u__z33Q",
            "comId": "u__dDQ1",
            "def": {
              "namespace": "mybricks.core-comlib.var",
              "version": "1.0.0",
              "rtType": "js"
            },
            "pinId": "set",
            "pinType": "normal",
            "direction": "input"
          }
        ],
        "u_HlA1y-change": [
          {
            "id": "u_xWtao",
            "type": "com",
            "frameKey": "_rootFrame_",
            "targetFrameKey": "_rootFrame_",
            "startPinParentKey": "u_yjKpn",
            "finishPinParentKey": "u_LrmhG",
            "comId": "u_xe79v",
            "def": {
              "namespace": "mybricks.core-comlib.var",
              "version": "1.0.0",
              "rtType": "js"
            },
            "pinId": "set",
            "pinType": "normal",
            "direction": "input"
          }
        ],
        "u_HlA1y-validated": [
          {
            "id": "u_e75B4",
            "type": "com",
            "frameKey": "_rootFrame_",
            "targetFrameKey": "_rootFrame_",
            "startPinParentKey": "u_CQVL0",
            "finishPinParentKey": "u_mzqoI",
            "comId": "u__dDQ1",
            "def": {
              "namespace": "mybricks.core-comlib.var",
              "version": "1.0.0",
              "rtType": "js"
            },
            "pinId": "set",
            "pinType": "normal",
            "direction": "input"
          }
        ],
        "u_v8NEV-output0": [
          {
            "id": "u_pmmlx",
            "type": "com",
            "frameKey": "_rootFrame_",
            "targetFrameKey": "_rootFrame_",
            "finishPinParentKey": "u_3Fq6O",
            "comId": "u_sEU53",
            "def": {
              "namespace": "mybricks.normal-pc.tagList",
              "version": "1.0.12",
              "materialId": 47516
            },
            "pinId": "dynamicTags",
            "pinType": "normal",
            "direction": "input"
          }
        ],
        "u_v8NEV-output1": [
          {
            "id": "u_8IWaE",
            "type": "com",
            "frameKey": "_rootFrame_",
            "targetFrameKey": "_rootFrame_",
            "finishPinParentKey": "u_D1sB8",
            "comId": "u_QLFEc",
            "def": {
              "namespace": "mybricks.normal-pc.link",
              "version": "1.0.5",
              "materialId": 47762
            },
            "pinId": "url",
            "pinType": "normal",
            "direction": "input"
          }
        ],
        "u_v8NEV-output2": [
          {
            "id": "u_ArlTd",
            "type": "com",
            "frameKey": "_rootFrame_",
            "targetFrameKey": "_rootFrame_",
            "finishPinParentKey": "u_i5DDd",
            "comId": "u_XxZNy",
            "def": {
              "namespace": "mybricks.normal-pc.text",
              "version": "1.0.17",
              "materialId": 47511
            },
            "pinId": "content",
            "pinType": "normal",
            "direction": "input"
          }
        ],
        "u_v8NEV-output3": [
          {
            "id": "u_Qx0Tx",
            "type": "com",
            "frameKey": "_rootFrame_",
            "targetFrameKey": "_rootFrame_",
            "finishPinParentKey": "u_5UA1A",
            "comId": "u_Mf187",
            "def": {
              "namespace": "mybricks.normal-pc.text",
              "version": "1.0.17",
              "materialId": 47511
            },
            "pinId": "content",
            "pinType": "normal",
            "direction": "input"
          }
        ],
        "u_v8NEV-output4": [
          {
            "id": "u_UhNJz",
            "type": "com",
            "frameKey": "_rootFrame_",
            "targetFrameKey": "_rootFrame_",
            "finishPinParentKey": "u_a8AsY",
            "comId": "u_9U4wn",
            "def": {
              "namespace": "mybricks.normal-pc.custom-container",
              "version": "1.0.24",
              "materialId": 48068
            },
            "pinId": "showOrHide",
            "pinType": "ext",
            "direction": "input"
          }
        ],
        "u_v8NEV-output5": [
          {
            "id": "u_CDzvs",
            "type": "com",
            "frameKey": "_rootFrame_",
            "targetFrameKey": "_rootFrame_",
            "finishPinParentKey": "u_33bgZ",
            "comId": "u_QLFEc",
            "def": {
              "namespace": "mybricks.normal-pc.link",
              "version": "1.0.5",
              "materialId": 47762
            },
            "pinId": "content",
            "pinType": "normal",
            "direction": "input"
          }
        ],
        "u_aWqQs-return": [
          {
            "id": "u_CG_g9",
            "type": "com",
            "frameKey": "u_txdqD",
            "targetFrameKey": "u_txdqD",
            "startPinParentKey": "u_FoRLM",
            "comId": "u_R0B_k",
            "def": {
              "namespace": "mybricks.basic-comlib._muilt-inputJs",
              "version": "1.0.2",
              "rtType": "js-autorun",
              "materialId": 46406
            },
            "pinId": "input.inputValue4",
            "pinType": "normal",
            "direction": "input"
          }
        ],
        "u_Hluf_-output0": [
          {
            "id": "u_EVomk",
            "type": "com",
            "frameKey": "_rootFrame_",
            "targetFrameKey": "_rootFrame_",
            "comId": "u_5zPNj",
            "def": {
              "namespace": "mybricks.normal-pc.page-router",
              "version": "1.0.5",
              "rtType": "js",
              "materialId": 41566
            },
            "pinId": "routerAction",
            "pinType": "normal",
            "direction": "input"
          }
        ],
        "u_txdqD-param0": [
          {
            "id": "u_7Twel",
            "type": "com",
            "frameKey": "u_txdqD",
            "targetFrameKey": "u_txdqD",
            "finishPinParentKey": "u_wLJXp",
            "comId": "u_xe79v",
            "def": {
              "namespace": "mybricks.core-comlib.var",
              "version": "1.0.0",
              "rtType": "js"
            },
            "pinId": "get",
            "pinType": "normal",
            "direction": "input"
          },
          {
            "id": "u_frzRS",
            "type": "com",
            "frameKey": "u_txdqD",
            "targetFrameKey": "u_txdqD",
            "finishPinParentKey": "u_dUnSM",
            "comId": "u_kim6d",
            "def": {
              "namespace": "mybricks.core-comlib.var",
              "version": "1.0.0",
              "rtType": "js"
            },
            "pinId": "get",
            "pinType": "normal",
            "direction": "input"
          },
          {
            "id": "u_UiaNV",
            "type": "com",
            "frameKey": "u_txdqD",
            "targetFrameKey": "u_txdqD",
            "finishPinParentKey": "u_lpr0K",
            "comId": "u__dDQ1",
            "def": {
              "namespace": "mybricks.core-comlib.var",
              "version": "1.0.0",
              "rtType": "js"
            },
            "pinId": "get",
            "pinType": "normal",
            "direction": "input"
          },
          {
            "id": "u_LMlLo",
            "type": "com",
            "frameKey": "u_txdqD",
            "targetFrameKey": "u_txdqD",
            "comId": "u_R0B_k",
            "def": {
              "namespace": "mybricks.basic-comlib._muilt-inputJs",
              "version": "1.0.2",
              "rtType": "js-autorun",
              "materialId": 46406
            },
            "pinId": "input.inputValue1",
            "pinType": "normal",
            "direction": "input"
          },
          {
            "id": "u_iuNRa",
            "type": "com",
            "frameKey": "u_txdqD",
            "targetFrameKey": "u_txdqD",
            "finishPinParentKey": "u_FoRLM",
            "comId": "u_aWqQs",
            "def": {
              "namespace": "mybricks.core-comlib.var",
              "version": "1.0.0",
              "rtType": "js"
            },
            "pinId": "get",
            "pinType": "normal",
            "direction": "input"
          },
          {
            "id": "u_S3IbQ",
            "type": "com",
            "frameKey": "u_txdqD",
            "targetFrameKey": "u_txdqD",
            "finishPinParentKey": "u_15bCY",
            "comId": "u__1_Ux",
            "def": {
              "namespace": "mybricks.core-comlib.var",
              "version": "1.0.0",
              "rtType": "js"
            },
            "pinId": "get",
            "pinType": "normal",
            "direction": "input"
          }
        ],
        "u_R0B_k-output0": [
          {
            "id": "u_9Gzg2",
            "type": "com",
            "frameKey": "u_txdqD",
            "targetFrameKey": "u_txdqD",
            "comId": "u_GL02f",
            "def": {
              "namespace": "mybricks.normal-pc.service",
              "version": "1.0.8",
              "rtType": "js-autorun",
              "materialId": 38932
            },
            "pinId": "call",
            "pinType": "normal",
            "direction": "input"
          }
        ],
        "u_R0B_k-output1": [
          {
            "id": "u_1TPk7",
            "type": "com",
            "frameKey": "u_txdqD",
            "targetFrameKey": "u_txdqD",
            "comId": "u_7YAd9",
            "def": {
              "namespace": "mybricks.normal-pc.message",
              "version": "1.0.4",
              "rtType": "js",
              "materialId": 44978
            },
            "pinId": "showMsg",
            "pinType": "normal",
            "direction": "input"
          }
        ],
        "u_GL02f-then": [
          {
            "id": "u_L03w2",
            "type": "com",
            "frameKey": "u_txdqD",
            "targetFrameKey": "u_txdqD",
            "comId": "u_KqMH9",
            "def": {
              "namespace": "mybricks.basic-comlib._muilt-inputJs",
              "version": "1.0.2",
              "rtType": "js-autorun",
              "materialId": 46406
            },
            "pinId": "input.inputValue0",
            "pinType": "param",
            "direction": "input"
          }
        ],
        "u_GL02f-catch": [
          {
            "id": "u_kQb3C",
            "type": "com",
            "frameKey": "u_txdqD",
            "targetFrameKey": "u_txdqD",
            "comId": "u__H8qn",
            "def": {
              "namespace": "mybricks.normal-pc.message",
              "version": "1.0.4",
              "rtType": "js",
              "materialId": 44978
            },
            "pinId": "showMsg",
            "pinType": "normal",
            "direction": "input"
          }
        ],
        "u_KqMH9-output0": [
          {
            "id": "u_Domex",
            "type": "com",
            "frameKey": "u_txdqD",
            "targetFrameKey": "u_txdqD",
            "comId": "u_stXp0",
            "def": {
              "namespace": "mybricks.normal-pc.message",
              "version": "1.0.4",
              "rtType": "js",
              "materialId": 44978
            },
            "pinId": "showMsg",
            "pinType": "normal",
            "direction": "input"
          }
        ],
        "u_KqMH9-output1": [
          {
            "id": "u_h8h_z",
            "type": "com",
            "frameKey": "u_txdqD",
            "targetFrameKey": "u_txdqD",
            "comId": "u_VmMVB",
            "def": {
              "namespace": "mybricks.normal-pc.message",
              "version": "1.0.4",
              "rtType": "js",
              "materialId": 44978
            },
            "pinId": "showMsg",
            "pinType": "normal",
            "direction": "input"
          }
        ],
        "u_KqMH9-output2": [
          {
            "id": "u_Fu4Pz",
            "type": "com",
            "frameKey": "u_txdqD",
            "targetFrameKey": "u_txdqD",
            "finishPinParentKey": "u_R2ovs",
            "comId": "u_2gccB",
            "def": {
              "namespace": "mybricks.core-comlib.var",
              "version": "1.0.0",
              "rtType": "js"
            },
            "pinId": "set",
            "pinType": "normal",
            "direction": "input"
          }
        ]
      },
      "pinRels": {
        "u_x5c3j-getIndex": [
          "getIndex"
        ],
        "u_xe79v-get": [
          "return"
        ],
        "u_xe79v-set": [
          "return"
        ],
        "u_ESQks-get": [
          "return"
        ],
        "u_ESQks-set": [
          "return"
        ],
        "u_p2Yel-call": [
          "then",
          "catch"
        ],
        "u_mJ9wi-getQuery": [
          "queryData"
        ],
        "u_ODJQ5-call": [
          "then",
          "catch"
        ],
        "u_kim6d-get": [
          "return"
        ],
        "u_kim6d-set": [
          "return"
        ],
        "u_ZttzW-get": [
          "return"
        ],
        "u_ZttzW-set": [
          "return"
        ],
        "u_2gccB-get": [
          "return"
        ],
        "u_2gccB-set": [
          "return"
        ],
        "u_qz2XB-call": [
          "then",
          "catch"
        ],
        "u__1_Ux-get": [
          "return"
        ],
        "u__1_Ux-set": [
          "return"
        ],
        "u__dDQ1-get": [
          "return"
        ],
        "u__dDQ1-set": [
          "return"
        ],
        "u_aWqQs-get": [
          "return"
        ],
        "u_aWqQs-set": [
          "return"
        ],
        "u_GL02f-call": [
          "then",
          "catch"
        ]
      },
      "pinProxies": {
        "u_QxeA5-param0": {
          "type": "frame",
          "frameId": "u_txdqD",
          "pinId": "param0"
        },
        "u_q3dd7-param0": {
          "type": "frame",
          "frameId": "u_txdqD",
          "pinId": "param0"
        },
        "u_EpT3d-param0": {
          "type": "frame",
          "frameId": "u_txdqD",
          "pinId": "param0"
        },
        "u_z64Io-param0": {
          "type": "frame",
          "frameId": "u_txdqD",
          "pinId": "param0"
        },
        "u_SAuUF-param0": {
          "type": "frame",
          "frameId": "u_txdqD",
          "pinId": "param0"
        },
        "u_opw7D-param0": {
          "type": "frame",
          "frameId": "u_txdqD",
          "pinId": "param0"
        },
        "u_5uZS5-param0": {
          "type": "frame",
          "frameId": "u_txdqD",
          "pinId": "param0"
        },
        "u_xpR1B-param0": {
          "type": "frame",
          "frameId": "u_txdqD",
          "pinId": "param0"
        },
        "u_IeTcO-param0": {
          "type": "frame",
          "frameId": "u_txdqD",
          "pinId": "param0"
        }
      },
      "pinValueProxies": {},
      "slot": {
        "id": "u_Un4sN",
        "title": "主场景",
        "comAry": [
          {
            "id": "u_x5c3j",
            "name": "u_35Txa",
            "def": {
              "namespace": "mybricks.normal-pc.steps",
              "version": "1.0.23",
              "materialId": 47250
            },
            "slots": {
              "step0": {
                "id": "step0",
                "title": "步骤1",
                "comAry": [
                  {
                    "id": "u_idZyY",
                    "name": "u_kvdJL",
                    "def": {
                      "namespace": "mybricks.normal-pc.custom-container",
                      "version": "1.0.24",
                      "materialId": 48068
                    },
                    "slots": {
                      "content": {
                        "id": "content",
                        "title": "内容",
                        "comAry": [
                          {
                            "id": "u_jaWWl",
                            "name": "u_ya_eZ",
                            "def": {
                              "namespace": "mybricks.normal-pc.grid",
                              "version": "1.0.44",
                              "materialId": 47857
                            },
                            "slots": {
                              "slot_0": {
                                "id": "slot_0",
                                "title": "col-12",
                                "comAry": [
                                  {
                                    "id": "u_8w32h",
                                    "name": "u_TDfWR",
                                    "def": {
                                      "namespace": "mybricks.marketing-tools.json-schema-form-com",
                                      "version": "1.1.2",
                                      "materialId": 49094
                                    },
                                    "slots": {
                                      "content": {
                                        "id": "content",
                                        "title": "表单内容",
                                        "comAry": [],
                                        "style": {
                                          "layout": "flex-column",
                                          "justifyContent": "flex-start",
                                          "alignItems": "flex-start"
                                        }
                                      }
                                    }
                                  },
                                  {
                                    "id": "u_HlA1y",
                                    "name": "u_KRRai",
                                    "def": {
                                      "namespace": "mybricks.marketing-tools.json-schema-form-com",
                                      "version": "1.1.2",
                                      "materialId": 49094
                                    },
                                    "slots": {
                                      "content": {
                                        "id": "content",
                                        "title": "表单内容",
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
                                  "alignItems": "flex-start"
                                }
                              },
                              "slot_1": {
                                "id": "slot_1",
                                "title": "自适应",
                                "comAry": [
                                  {
                                    "id": "u_DgQGD",
                                    "name": "u_sKu4N",
                                    "def": {
                                      "namespace": "mybricks.normal-pc.card",
                                      "version": "1.0.21",
                                      "materialId": 47249
                                    },
                                    "slots": {
                                      "body": {
                                        "id": "body",
                                        "title": "卡片内容容器",
                                        "comAry": [
                                          {
                                            "id": "u_YaOIm",
                                            "name": "u_yHYhS",
                                            "def": {
                                              "namespace": "mybricks.normal-pc.single-image",
                                              "version": "1.0.15",
                                              "materialId": 47548
                                            }
                                          }
                                        ],
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
                                  "alignItems": "flex-start"
                                }
                              }
                            }
                          }
                        ],
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
                  "alignItems": "flex-start"
                }
              },
              "step0_customDescSlot": {
                "id": "step0_customDescSlot",
                "title": "自定义描述",
                "comAry": [],
                "style": {
                  "layout": "flex-column",
                  "justifyContent": "flex-start",
                  "alignItems": "flex-start"
                }
              },
              "u_beaixt": {
                "id": "u_beaixt",
                "title": "步骤2",
                "comAry": [
                  {
                    "id": "u_64wD1",
                    "name": "u_3muXG",
                    "def": {
                      "namespace": "mybricks.normal-pc.custom-container",
                      "version": "1.0.24",
                      "materialId": 48068
                    },
                    "slots": {
                      "content": {
                        "id": "content",
                        "title": "内容",
                        "comAry": [
                          {
                            "id": "u_s89rA",
                            "name": "u_ya_eZ",
                            "def": {
                              "namespace": "mybricks.normal-pc.grid",
                              "version": "1.0.44",
                              "materialId": 47857
                            },
                            "slots": {
                              "slot_0": {
                                "id": "slot_0",
                                "title": "col-12",
                                "comAry": [
                                  {
                                    "id": "u_yVwNF",
                                    "name": "u_XbmtM",
                                    "def": {
                                      "namespace": "mybricks.marketing-tools.json-schema-form-com",
                                      "version": "1.1.2",
                                      "materialId": 49094
                                    },
                                    "slots": {
                                      "content": {
                                        "id": "content",
                                        "title": "表单内容",
                                        "comAry": [],
                                        "style": {
                                          "layout": "flex-column",
                                          "justifyContent": "flex-start",
                                          "alignItems": "flex-start"
                                        }
                                      }
                                    }
                                  },
                                  {
                                    "id": "u_Yi2PA",
                                    "name": "u_doEbZ",
                                    "def": {
                                      "namespace": "mybricks.marketing-tools.json-schema-form-com",
                                      "version": "1.1.2",
                                      "materialId": 49094
                                    },
                                    "slots": {
                                      "content": {
                                        "id": "content",
                                        "title": "表单内容",
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
                                  "alignItems": "flex-start"
                                }
                              },
                              "slot_1": {
                                "id": "slot_1",
                                "title": "自适应",
                                "comAry": [
                                  {
                                    "id": "u_uNOkF",
                                    "name": "u_UD_32",
                                    "def": {
                                      "namespace": "mybricks.normal-pc.card",
                                      "version": "1.0.21",
                                      "materialId": 47249
                                    },
                                    "slots": {
                                      "body": {
                                        "id": "body",
                                        "title": "卡片内容容器",
                                        "comAry": [
                                          {
                                            "id": "u_aIWUY",
                                            "name": "u_yHYhS",
                                            "def": {
                                              "namespace": "mybricks.normal-pc.single-image",
                                              "version": "1.0.15",
                                              "materialId": 47548
                                            }
                                          }
                                        ],
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
                                  "alignItems": "flex-start"
                                }
                              }
                            }
                          }
                        ],
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
                  "alignItems": "flex-start"
                }
              },
              "u_wj2t2t": {
                "id": "u_wj2t2t",
                "title": "步骤3",
                "comAry": [
                  {
                    "id": "u_L0XHo",
                    "name": "u_S0gsr",
                    "def": {
                      "namespace": "mybricks.normal-pc.alert",
                      "version": "1.0.7",
                      "materialId": 47593
                    },
                    "slots": {}
                  },
                  {
                    "id": "u_Hc43v",
                    "name": "u_GHXcS",
                    "def": {
                      "namespace": "mybricks.normal-pc.custom-container",
                      "version": "1.0.24",
                      "materialId": 48068
                    },
                    "slots": {
                      "content": {
                        "id": "content",
                        "title": "内容",
                        "comAry": [],
                        "style": {
                          "layout": "flex-column",
                          "justifyContent": "flex-start",
                          "alignItems": "flex-start"
                        }
                      }
                    }
                  },
                  {
                    "id": "u_9U4wn",
                    "name": "u_yu22m",
                    "def": {
                      "namespace": "mybricks.normal-pc.custom-container",
                      "version": "1.0.24",
                      "materialId": 48068
                    },
                    "slots": {
                      "content": {
                        "id": "content",
                        "title": "内容",
                        "comAry": [
                          {
                            "id": "u_B7Y2_",
                            "name": "u_DwnGZ",
                            "def": {
                              "namespace": "mybricks.basic-comlib.dragable-layout",
                              "version": "1.0.7",
                              "materialId": 47988
                            },
                            "slots": {
                              "u_cmij0r": {
                                "id": "u_cmij0r",
                                "title": "列（竖向排列）",
                                "comAry": [
                                  {
                                    "id": "u_mGG_w",
                                    "name": "u_W3zJz",
                                    "def": {
                                      "namespace": "mybricks.normal-pc.text",
                                      "version": "1.0.17",
                                      "materialId": 47511
                                    }
                                  }
                                ],
                                "style": {
                                  "layout": "flex-column",
                                  "justifyContent": "flex-start",
                                  "alignItems": "flex-start"
                                }
                              },
                              "u_n36mz8": {
                                "id": "u_n36mz8",
                                "title": "列（竖向排列）",
                                "comAry": [
                                  {
                                    "id": "u_Asd5z",
                                    "name": "u_ILOOg",
                                    "def": {
                                      "namespace": "mybricks.normal-pc.tagList",
                                      "version": "1.0.12",
                                      "materialId": 47516
                                    }
                                  }
                                ],
                                "style": {
                                  "layout": "flex-column",
                                  "justifyContent": "flex-start",
                                  "alignItems": "flex-start"
                                }
                              },
                              "u_ftfzk3": {
                                "id": "u_ftfzk3",
                                "title": "列（竖向排列）",
                                "comAry": [
                                  {
                                    "id": "u_sEU53",
                                    "name": "u_GqdFI",
                                    "def": {
                                      "namespace": "mybricks.normal-pc.tagList",
                                      "version": "1.0.12",
                                      "materialId": 47516
                                    }
                                  }
                                ],
                                "style": {
                                  "layout": "flex-column",
                                  "justifyContent": "flex-start",
                                  "alignItems": "flex-start"
                                }
                              },
                              "u_y8rcf5": {
                                "id": "u_y8rcf5",
                                "title": "列（竖向排列）",
                                "comAry": [
                                  {
                                    "id": "u_TpVsg",
                                    "name": "u_AA7hh",
                                    "def": {
                                      "namespace": "mybricks.normal-pc.tagList",
                                      "version": "1.0.12",
                                      "materialId": 47516
                                    }
                                  }
                                ],
                                "style": {
                                  "layout": "flex-column",
                                  "justifyContent": "flex-start",
                                  "alignItems": "flex-start"
                                }
                              },
                              "u_b8bee4": {
                                "id": "u_b8bee4",
                                "title": "列（竖向排列）",
                                "comAry": [
                                  {
                                    "id": "u_QLFEc",
                                    "name": "u_zYPyw",
                                    "def": {
                                      "namespace": "mybricks.normal-pc.link",
                                      "version": "1.0.5",
                                      "materialId": 47762
                                    }
                                  }
                                ],
                                "style": {
                                  "layout": "flex-column",
                                  "justifyContent": "flex-start",
                                  "alignItems": "flex-start"
                                }
                              },
                              "u_dtbd0r": {
                                "id": "u_dtbd0r",
                                "title": "列（竖向排列）",
                                "comAry": [
                                  {
                                    "id": "u_6rCBO",
                                    "name": "u_JD_g5",
                                    "def": {
                                      "namespace": "mybricks.normal-pc.tagList",
                                      "version": "1.0.12",
                                      "materialId": 47516
                                    }
                                  }
                                ],
                                "style": {
                                  "layout": "flex-column",
                                  "justifyContent": "flex-start",
                                  "alignItems": "flex-start"
                                }
                              },
                              "u_sfkzfh": {
                                "id": "u_sfkzfh",
                                "title": "列（竖向排列）",
                                "comAry": [
                                  {
                                    "id": "u_XxZNy",
                                    "name": "u_5wasu",
                                    "def": {
                                      "namespace": "mybricks.normal-pc.text",
                                      "version": "1.0.17",
                                      "materialId": 47511
                                    }
                                  }
                                ],
                                "style": {
                                  "layout": "flex-column",
                                  "justifyContent": "flex-start",
                                  "alignItems": "flex-start"
                                }
                              },
                              "u_363bkt": {
                                "id": "u_363bkt",
                                "title": "列（竖向排列）",
                                "comAry": [],
                                "style": {
                                  "layout": "flex-column",
                                  "justifyContent": "flex-start",
                                  "alignItems": "flex-start"
                                }
                              },
                              "u_dxekhy": {
                                "id": "u_dxekhy",
                                "title": "列（竖向排列）",
                                "comAry": [
                                  {
                                    "id": "u_Mf187",
                                    "name": "u_qoRxV",
                                    "def": {
                                      "namespace": "mybricks.normal-pc.text",
                                      "version": "1.0.17",
                                      "materialId": 47511
                                    }
                                  }
                                ],
                                "style": {
                                  "layout": "flex-column",
                                  "justifyContent": "flex-start",
                                  "alignItems": "flex-start"
                                }
                              },
                              "u_4n7k68": {
                                "id": "u_4n7k68",
                                "title": "列（竖向排列）",
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
                          "alignItems": "flex-start"
                        }
                      }
                    }
                  }
                ],
                "style": {
                  "layout": "flex-column",
                  "justifyContent": "flex-start",
                  "alignItems": "flex-start"
                }
              },
              "u_jp25xy": {
                "id": "u_jp25xy",
                "title": "步骤4",
                "comAry": [
                  {
                    "id": "u_OnAoP",
                    "name": "u__c4Q2",
                    "def": {
                      "namespace": "mybricks.normal-pc.alert",
                      "version": "1.0.7",
                      "materialId": 47593
                    }
                  },
                  {
                    "id": "u_xfBaK",
                    "name": "u_hTCgv",
                    "def": {
                      "namespace": "mybricks.normal-pc.custom-container",
                      "version": "1.0.24",
                      "materialId": 48068
                    },
                    "slots": {
                      "content": {
                        "id": "content",
                        "title": "内容",
                        "comAry": [
                          {
                            "id": "u_HLBsc",
                            "name": "u_nUhes",
                            "def": {
                              "namespace": "mybricks.normal-pc.grid",
                              "version": "1.0.44",
                              "materialId": 47857
                            },
                            "slots": {
                              "slot_0": {
                                "id": "slot_0",
                                "title": "col-12",
                                "comAry": [
                                  {
                                    "id": "u_0DxRU",
                                    "name": "u_6gDcS",
                                    "def": {
                                      "namespace": "mybricks.marketing-tools.json-schema-form-com",
                                      "version": "1.1.2",
                                      "materialId": 49094
                                    },
                                    "slots": {
                                      "content": {
                                        "id": "content",
                                        "title": "表单内容",
                                        "comAry": [],
                                        "style": {
                                          "layout": "flex-column",
                                          "justifyContent": "flex-start",
                                          "alignItems": "flex-start"
                                        }
                                      }
                                    }
                                  },
                                  {
                                    "id": "u_VSeRY",
                                    "name": "u_Knz2p",
                                    "def": {
                                      "namespace": "mybricks.marketing-tools.json-schema-form-com",
                                      "version": "1.1.2",
                                      "materialId": 49094
                                    },
                                    "slots": {
                                      "content": {
                                        "id": "content",
                                        "title": "表单内容",
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
                                  "alignItems": "flex-start"
                                }
                              },
                              "slot_1": {
                                "id": "slot_1",
                                "title": "自适应",
                                "comAry": [
                                  {
                                    "id": "u_w6gVj",
                                    "name": "u_97Wqz",
                                    "def": {
                                      "namespace": "mybricks.normal-pc.card",
                                      "version": "1.0.21",
                                      "materialId": 47249
                                    },
                                    "slots": {
                                      "body": {
                                        "id": "body",
                                        "title": "卡片内容容器",
                                        "comAry": [
                                          {
                                            "id": "u_odZh7",
                                            "name": "u_2TCDY",
                                            "def": {
                                              "namespace": "mybricks.normal-pc.single-image",
                                              "version": "1.0.15",
                                              "materialId": 47548
                                            }
                                          }
                                        ],
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
                                  "alignItems": "flex-start"
                                }
                              }
                            }
                          }
                        ],
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
                  "alignItems": "flex-start"
                }
              },
              "u_a50h1y": {
                "id": "u_a50h1y",
                "title": "步骤5",
                "comAry": [
                  {
                    "id": "u_pqaQQ",
                    "name": "u_JNROn",
                    "def": {
                      "namespace": "mybricks.normal-pc.custom-container",
                      "version": "1.0.24",
                      "materialId": 48068
                    },
                    "slots": {
                      "content": {
                        "id": "content",
                        "title": "内容",
                        "comAry": [
                          {
                            "id": "u_6nkja",
                            "name": "u_sl09_",
                            "def": {
                              "namespace": "mybricks.normal-pc.text",
                              "version": "1.0.17",
                              "materialId": 47511
                            }
                          }
                        ],
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
                  "alignItems": "flex-start"
                }
              }
            }
          },
          {
            "id": "u_TGyzS",
            "name": "u_orSZX",
            "def": {
              "namespace": "mybricks.normal-pc.toolbar",
              "version": "1.0.20",
              "materialId": 47248
            }
          }
        ],
        "style": {
          "layout": "flex-column",
          "justifyContent": "flex-start",
          "alignItems": "flex-start",
          "width": 1024
        }
      }
    }
  ],
  "plugins": {
    "@mybricks/plugins/service": [
      {
        "id": "u_ennask",
        "type": "http",
        "title": "查询发布单详情",
        "script": "function%20(t%2C%20%7B%0A%20%20%20%20%20%20%20%20%20%20%20%20then%3A%20e%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20onError%3A%20n%0A%20%20%20%20%20%20%20%20%20%20%7D%2C%20r)%20%7B%0A%20%20%20%20%20%20%20%20%20%20%20%20return%20function%20(t%2C%20r)%20%7B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20const%20o%20%3D%20%22GET%22%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20i%20%3D%20%5B%5D%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20a%20%3D%20%5B%5D%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20l%20%3D%20false%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20c%20%3D%20function%20_RT_(%7B%20error%2C%20response%2C%20config%20%7D%2C%20%7B%20throwError%20%7D)%20%7B%0A%20%20%2F%2F%20%E9%94%99%E8%AF%AF%E6%8A%9B%E5%87%BA%E6%97%B6%E9%A2%84%E5%A4%84%E7%90%86%E6%95%B0%E6%8D%AE%EF%BC%8C%E8%AF%B7%E6%B3%A8%E6%84%8F%EF%BC%9A%E5%BF%85%E9%A1%BB%E8%B0%83%E7%94%A8%20throwError%20%E6%8A%9B%E5%87%BA%E9%94%99%E8%AF%AF%3B%0A%20%20%2F%2F%20config%EF%BC%9A%E8%AF%B7%E6%B1%82%E5%85%A5%E5%8F%82%EF%BC%9Berror%EF%BC%9A%E9%94%99%E8%AF%AF%E5%AF%B9%E8%B1%A1%EF%BC%9Bresponse%EF%BC%9A%E5%93%8D%E5%BA%94%E5%8E%9F%E5%A7%8B%E5%AF%B9%E8%B1%A1%EF%BC%9Bresponse.status%EF%BC%9A%E8%8E%B7%E5%8F%96%20HTTP%20%E7%8A%B6%E6%80%81%E7%A0%81%EF%BC%8Cresponse.data%EF%BC%9A%E8%8E%B7%E5%8F%96%E6%8E%A5%E5%8F%A3%E8%BF%94%E5%9B%9E%E5%80%BC%0A%20%20throwError(response.data.message%20%7C%7C%20error)%3B%0A%7D%0A%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20u%20%3D%20%5B%7B%22title%22%3A%22%E9%BB%98%E8%AE%A4%22%2C%22id%22%3A%22default%22%2C%22predicate%22%3A%7B%7D%2C%22outputKeys%22%3A%5B%5D%2C%22excludeKeys%22%3A%5B%5D%7D%5D%3B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20u.length%20%7C%7C%20u.push(%7B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20title%3A%20%22%E9%BB%98%E8%AE%A4%22%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20id%3A%20%22default%22%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20predicate%3A%20%7B%7D%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20outputKeys%3A%20i%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20excludeKeys%3A%20a%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%7D)%3B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20try%20%7B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20const%20i%20%3D%20%22%2Fgateway%2Fmarketing%2Ftools%2Fselfconfig%2Fpublish%2Fdetail%22%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20a%20%3D%20function%20_RT_(%7B%20params%2C%20data%2C%20headers%2C%20url%2C%20method%20%7D)%20%7B%0A%20%20%2F%2F%20%E8%AE%BE%E7%BD%AE%E8%AF%B7%E6%B1%82query%E3%80%81%E8%AF%B7%E6%B1%82%E4%BD%93%E3%80%81%E8%AF%B7%E6%B1%82%E5%A4%B4%0A%20%20return%20%7B%20params%2C%20data%2C%20headers%2C%20url%2C%20method%20%7D%3B%0A%20%7D%0A(%5B%22GET%22%2C%20%22DELETE%22%5D.includes(o)%20%3F%20%7B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20params%3A%20t%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20data%3A%20%7B%7D%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20header%3A%20%7B%7D%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20url%3A%20i%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20method%3A%20o%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%7D%20%3A%20%7B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20params%3A%20%7B%7D%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20data%3A%20t%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20header%3A%20%7B%7D%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20url%3A%20i%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20method%3A%20o%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%7D)%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20s%20%3D%20true%3B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20a.url%20%3D%20a.url%20%7C%7C%20i%2C%20a.method%20%3D%20a.method%20%7C%7C%20o%3B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20const%20p%20%3D%20function%20_RT_(%7B%20params%2C%20data%2C%20headers%2C%20url%2C%20method%20%7D)%20%7B%0A%20%20%2F%2F%20%E8%AE%BE%E7%BD%AE%E8%AF%B7%E6%B1%82query%E3%80%81%E8%AF%B7%E6%B1%82%E4%BD%93%E3%80%81%E8%AF%B7%E6%B1%82%E5%A4%B4%0A%20%20return%20%7B%20params%2C%20data%2C%20headers%2C%20url%2C%20method%20%7D%3B%0A%20%7D%0A(a)%3B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20if%20(%22object%22%20%3D%3D%20typeof%20(p.params%20%7C%7C%20p.data))%20%7B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20const%20t%20%3D%20(p.params%20%7C%7C%20p.data)%20instanceof%20FormData%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20e%20%3D%20%5B%5D%3B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20p.url%20%3D%20(p.url%20%7C%7C%20i).replace(%2F%7B(%5B%5E%7D%5D%2B)%7D%2Fg%2C%20(t%2C%20r)%20%3D%3E%20%7B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20const%20o%20%3D%20r%20%3F%20r.split(%22.%22)%20%3A%20%5B%5D%3B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20let%20i%20%3D%20p.params%20%7C%7C%20p.data%3B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20o.length%20%7C%7C%20n(%22%E8%AF%B7%E6%B1%82%E8%B7%AF%E5%BE%84%E4%B8%AD%E6%A8%A1%E6%9D%BF%E5%AD%97%E7%AC%A6%E4%B8%B2%E9%94%99%E8%AF%AF%22)%3B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20let%20a%20%3D%200%3B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20for%20(e.push(o%5B0%5D)%3B%20o.length%3B)%20%7B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20const%20t%20%3D%20o.shift()%3B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20if%20(!i)%20return%20void%20n(%60%E8%AF%B7%E6%B1%82%E8%B7%AF%E5%BE%84%E4%B8%AD%E6%A8%A1%E6%9D%BF%E5%AD%97%E7%AC%A6%E4%B8%B2%E7%9A%84%E5%8F%82%E6%95%B0(%24%7Br%7D)%E7%BC%BA%E5%A4%B1%60)%3B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20let%20e%20%3D%20i%5Bt%5D%3B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20if%20(i%20instanceof%20FormData%20%26%26%20(e%20%3D%20i.get(t)%2C%200%20%3D%3D%3D%20a%20%26%26%20o.length))%20try%20%7B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20e%20%3D%20JSON.parse(e)%3B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%7D%20catch%20(t)%20%7B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20return%20void%20n(%60%E8%AF%B7%E6%B1%82%E8%B7%AF%E5%BE%84%E4%B8%AD%E6%A8%A1%E6%9D%BF%E5%AD%97%E7%AC%A6%E4%B8%B2%E7%9A%84%E5%8F%82%E6%95%B0(%24%7Br%7D)%E7%BC%BA%E5%A4%B1%60)%3B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%7D%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20null%20%3D%3D%20e%20%26%26%20n(%60%E8%AF%B7%E6%B1%82%E8%B7%AF%E5%BE%84%E4%B8%AD%E6%A8%A1%E6%9D%BF%E5%AD%97%E7%AC%A6%E4%B8%B2%E7%9A%84%E5%8F%82%E6%95%B0(%24%7Br%7D)%E7%BC%BA%E5%A4%B1%60)%2C%20a%2B%2B%2C%20i%20%3D%20e%3B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%7D%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20return%20i%3B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%7D)%2C%20t%20%3F%20(e.forEach(t%20%3D%3E%20%7B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20(p.params%20%7C%7C%20p.data).delete(t)%3B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%7D)%2C%20(p.params%20%7C%7C%20p.data).delete(%22MYBRICKS_HOST%22))%20%3A%20(e.forEach(t%20%3D%3E%20%7B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20Reflect.deleteProperty(p.params%20%7C%7C%20p.data%20%7C%7C%20%7B%7D%2C%20t)%3B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%7D)%2C%20Reflect.deleteProperty(p.params%20%7C%7C%20p.data%20%7C%7C%20%7B%7D%2C%20%22MYBRICKS_HOST%22))%3B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%7D%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20p.method%20%3D%20p.method%20%7C%7C%20o%3B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20let%20d%20%3D%20!1%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20f%20%3D%20%5B%5D%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20h%20%3D%20%5B%5D%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20g%20%3D%20%22then%22%3B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20r.ajax(p).catch(t%20%3D%3E%20%7B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20if%20(c%20%26%26%20(t.response%20%7C%7C%20%22AxiosError%22%20%3D%3D%3D%20t.name))%20%7B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20const%20e%20%3D%20t.response%20%7C%7C%20%7B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20data%3A%20%7B%7D%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%7D%3B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20!e.data%20%26%26%20(e.data%20%3D%20%7B%7D)%2C%20c(%7B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20error%3A%20t%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20response%3A%20e%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20config%3A%20p%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%7D%2C%20%7B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20throwError%3A%20(...t)%20%3D%3E%20%7B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20d%20%3D%20!0%2C%20n(...t)%3B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%7D%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%7D)%3B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%7D%20else%20n(t)%3B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20throw%20Error(%22HTTP_FETCH_ERROR%22)%3B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%7D).then(t%20%3D%3E%20s%20%3F%20function%20_RT_(%7B%20response%2C%20config%20%7D)%20%7B%0A%20%20%2F%2F%20if%20(response.data.code%20!%3D%3D%200)%20%7B%0A%20%20%2F%2F%20%20%20throw%20new%20Error(response.data.errMsg)%0A%20%20%2F%2F%20%7D%0A%20%20return%20response.data%0A%7D%0A(%7B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20response%3A%20t%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20config%3A%20p%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%7D%2C%20%7B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20throwError%3A%20n%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%7D)%20%3A%20t).then(t%20%3D%3E%20%7B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20const%20e%20%3D%20function%20_RT_(result%2C%20%7B%20method%2C%20url%2C%20params%2C%20data%2C%20headers%20%7D)%20%7B%0A%20%20%2F%2F%20return%20%7B%0A%20%20%2F%2F%20%20total%3A%20result.all%2C%0A%20%20%2F%2F%20%20dataSource%3A%20result.list.map(%7Bid%2C%20name%7D%20%3D%3E%20(%7B%0A%20%20%2F%2F%20%20%20%20%20value%3Aid%2C%20label%3A%20name%0A%20%20%2F%2F%20%20%7D))%0A%20%20%2F%2F%20%7D%0A%20%20return%20result%3B%0A%7D%0A(t%2C%20Object.assign(%7B%7D%2C%20p)%2C%20%7B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20throwError%3A%20n%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%7D)%3B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20for%20(let%20t%20%3D%200%3B%20t%20%3C%20u.length%3B%20t%2B%2B)%20%7B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20const%20%7B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20id%3A%20n%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20predicate%3A%20r%20%3D%20%7B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20key%3A%20%22%22%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20value%3A%20void%200%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%7D%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20excludeKeys%3A%20o%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20outputKeys%3A%20i%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%7D%20%3D%20u%5Bt%5D%3B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20if%20(!r%20%7C%7C%20!r.key%20%7C%7C%20void%200%20%3D%3D%3D%20r.value)%20%7B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20f%20%3D%20i%2C%20h%20%3D%20o%2C%20g%20%3D%20%22default%22%20%3D%3D%3D%20n%20%3F%20%22then%22%20%3A%20n%3B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20break%3B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%7D%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20let%20a%20%3D%20e%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20l%20%3D%20r.key.split(%22.%22)%3B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20for%20(%3B%20a%20%26%26%20l.length%3B)%20a%20%3D%20a%5Bl.shift()%5D%3B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20if%20(!l.length%20%26%26%20(%22%3D%22%20%3D%3D%3D%20r.operator%20%3F%20a%20%3D%3D%3D%20r.value%20%3A%20a%20!%3D%3D%20r.value))%20%7B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20f%20%3D%20i%2C%20h%20%3D%20o%2C%20g%20%3D%20%22default%22%20%3D%3D%3D%20n%20%3F%20%22then%22%20%3A%20n%3B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20break%3B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%7D%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%7D%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20return%20e%3B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%7D).then(t%20%3D%3E%20%7B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20if%20(!l)%20return%200%20%3D%3D%3D%20h.length%20%7C%7C%20h.forEach(e%20%3D%3E%20function%20(t%2C%20e)%20%7B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20const%20n%20%3D%20e.length%3B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20!function%20t(r%2C%20o)%20%7B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20if%20(!r%20%7C%7C%20o%20%3D%3D%3D%20n)%20return%3B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20const%20i%20%3D%20e%5Bo%5D%3B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20o%20%3D%3D%3D%20n%20-%201%20%26%26%20Reflect.deleteProperty(r%2C%20i)%2C%20Array.isArray(r)%20%3F%20r.forEach(e%20%3D%3E%20%7B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20t(e%2C%20o)%3B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%7D)%20%3A%20t(r%5Bi%5D%2C%20o%20%2B%201)%3B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%7D(t%2C%200)%3B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%7D(t%2C%20e.split(%22.%22)))%2C%20t%3B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20e(t)%3B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%7D).then(t%20%3D%3E%20%7B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20let%20n%20%3D%20Array.isArray(t)%20%3F%20%5B%5D%20%3A%20%7B%7D%3B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20if%20(void%200%20%3D%3D%3D%20f%20%7C%7C%200%20%3D%3D%3D%20f.length)%20n%20%3D%20t%3Belse%20if%20(f.forEach(e%20%3D%3E%20%7B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20!function%20(t%2C%20e%2C%20n)%20%7B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20const%20r%20%3D%20e.length%3B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20!function%20t(n%2C%20o%2C%20i)%20%7B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20if%20(!n%20%7C%7C%20o%20%3D%3D%3D%20r)%20return%20n%3B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20const%20a%20%3D%20e%5Bo%5D%3B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20return%20Array.isArray(n)%20%3F%20n.map((e%2C%20n)%20%3D%3E%20%7B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20const%20r%20%3D%20i%5Bn%5D%3B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20let%20a%3B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20return%20void%200%20%3D%3D%3D%20r%20%3F%20(a%20%3D%20%7B%7D%2C%20i.push(a))%20%3A%20a%20%3D%20r%2C%20t(e%2C%20o%2C%20a)%3B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%7D)%20%3A%20o%20%3D%3D%3D%20r%20-%201%20%3F%20(i%5Ba%5D%20%3D%20n%5Ba%5D%2C%20n%5Ba%5D)%20%3A%20(n%20%3D%20n%5Ba%5D%2C%20Array.isArray(n)%20%3F%20i%5Ba%5D%20%3D%20i%5Ba%5D%20%7C%7C%20%5B%5D%20%3A%20i%5Ba%5D%20%3D%20i%5Ba%5D%20%7C%7C%20%7B%7D%2C%20t(n%2C%20o%20%2B%201%2C%20Array.isArray(i)%20%3F%20i%20%3A%20i%5Ba%5D))%3B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%7D(t%2C%200%2C%20n)%3B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%7D(t%2C%20e.split(%22.%22)%2C%20n)%3B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%7D)%2C%20Array.isArray(f)%20%26%26%20f.length%20%26%26%20(f.length%20%3E%201%20%7C%7C%201%20!%3D%3D%20f.length%20%7C%7C%20%22%22%20!%3D%3D%20f%5B0%5D))%20try%20%7B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20let%20t%20%3D%20f.map(t%20%3D%3E%20t.split(%22.%22))%3B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20for%20(%3B%20%22%5Bobject%20Object%5D%22%20%3D%3D%3D%20Object.prototype.toString.call(n)%20%26%26%20t.every(t%20%3D%3E%20!!t.length)%20%26%26%201%20%3D%3D%3D%20Object.values(n).length%3B)%20n%20%3D%20Object.values(n)%5B0%5D%2C%20t.forEach(t%20%3D%3E%20t.shift())%3B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%7D%20catch%20(t)%20%7B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20console.log(%22%E8%BF%9E%E6%8E%A5%E5%99%A8%E5%86%85%E7%BD%AE%E6%95%B0%E6%8D%AE%E8%BD%AC%E6%8D%A2%E5%A4%B1%E8%B4%A5%EF%BC%8C%E9%94%99%E8%AF%AF%E6%98%AF%EF%BC%9A%22%2C%20t)%3B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%7D%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20e(r.isMultipleOutputs%20%3F%20%7B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20__OUTPUT_ID__%3A%20g%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20__ORIGIN_RESPONSE__%3A%20n%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%7D%20%3A%20n)%3B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%7D).catch(t%20%3D%3E%20%7B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20t%20%26%26%20%22HTTP_FETCH_ERROR%22%20%3D%3D%3D%20t.message%20%3F%20c%20%26%26%20!d%20%26%26%20n(%22%E5%85%A8%E5%B1%80%E6%8B%A6%E6%88%AA%E5%93%8D%E5%BA%94%E9%94%99%E8%AF%AF%E5%87%BD%E6%95%B0%E4%B8%AD%E5%BF%85%E9%A1%BB%E8%B0%83%E7%94%A8%20throwError%20%E6%96%B9%E6%B3%95%EF%BC%8C%E8%AF%B7%E5%89%8D%E5%BE%80%E4%BF%AE%E6%94%B9%22)%20%3A%20n(t%20%26%26%20t.message%20%7C%7C%20t)%3B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%7D)%3B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%7D%20catch%20(t)%20%7B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20return%20n(t)%3B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%7D%0A%20%20%20%20%20%20%20%20%20%20%20%20%7D(t%2C%20r)%3B%0A%20%20%20%20%20%20%20%20%20%20%7D"
      },
      {
        "id": "u_kkaexs",
        "type": "http",
        "title": "更新发布单",
        "script": "function%20(t%2C%20%7B%0A%20%20%20%20%20%20%20%20%20%20%20%20then%3A%20e%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20onError%3A%20n%0A%20%20%20%20%20%20%20%20%20%20%7D%2C%20r)%20%7B%0A%20%20%20%20%20%20%20%20%20%20%20%20return%20function%20(t%2C%20r)%20%7B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20const%20o%20%3D%20%22POST%22%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20i%20%3D%20%5B%5D%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20a%20%3D%20%5B%5D%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20l%20%3D%20false%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20c%20%3D%20function%20_RT_(%7B%20error%2C%20response%2C%20config%20%7D%2C%20%7B%20throwError%20%7D)%20%7B%0A%20%20%2F%2F%20%E9%94%99%E8%AF%AF%E6%8A%9B%E5%87%BA%E6%97%B6%E9%A2%84%E5%A4%84%E7%90%86%E6%95%B0%E6%8D%AE%EF%BC%8C%E8%AF%B7%E6%B3%A8%E6%84%8F%EF%BC%9A%E5%BF%85%E9%A1%BB%E8%B0%83%E7%94%A8%20throwError%20%E6%8A%9B%E5%87%BA%E9%94%99%E8%AF%AF%3B%0A%20%20%2F%2F%20config%EF%BC%9A%E8%AF%B7%E6%B1%82%E5%85%A5%E5%8F%82%EF%BC%9Berror%EF%BC%9A%E9%94%99%E8%AF%AF%E5%AF%B9%E8%B1%A1%EF%BC%9Bresponse%EF%BC%9A%E5%93%8D%E5%BA%94%E5%8E%9F%E5%A7%8B%E5%AF%B9%E8%B1%A1%EF%BC%9Bresponse.status%EF%BC%9A%E8%8E%B7%E5%8F%96%20HTTP%20%E7%8A%B6%E6%80%81%E7%A0%81%EF%BC%8Cresponse.data%EF%BC%9A%E8%8E%B7%E5%8F%96%E6%8E%A5%E5%8F%A3%E8%BF%94%E5%9B%9E%E5%80%BC%0A%20%20throwError(response.data.message%20%7C%7C%20error)%3B%0A%7D%0A%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20u%20%3D%20%5B%7B%22title%22%3A%22%E9%BB%98%E8%AE%A4%22%2C%22id%22%3A%22default%22%2C%22predicate%22%3A%7B%7D%2C%22outputKeys%22%3A%5B%5D%2C%22excludeKeys%22%3A%5B%5D%7D%5D%3B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20u.length%20%7C%7C%20u.push(%7B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20title%3A%20%22%E9%BB%98%E8%AE%A4%22%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20id%3A%20%22default%22%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20predicate%3A%20%7B%7D%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20outputKeys%3A%20i%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20excludeKeys%3A%20a%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%7D)%3B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20try%20%7B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20const%20i%20%3D%20%22%2Fgateway%2Fmarketing%2Ftools%2Fselfconfig%2Fpublish%2Fupdate%22%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20a%20%3D%20function%20_RT_(%7B%20params%2C%20data%2C%20headers%2C%20url%2C%20method%20%7D)%20%7B%0A%20%20%2F%2F%20%E8%AE%BE%E7%BD%AE%E8%AF%B7%E6%B1%82query%E3%80%81%E8%AF%B7%E6%B1%82%E4%BD%93%E3%80%81%E8%AF%B7%E6%B1%82%E5%A4%B4%0A%20%20return%20%7B%20params%2C%20data%2C%20headers%2C%20url%2C%20method%20%7D%3B%0A%20%7D%0A(%5B%22GET%22%2C%20%22DELETE%22%5D.includes(o)%20%3F%20%7B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20params%3A%20t%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20data%3A%20%7B%7D%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20header%3A%20%7B%7D%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20url%3A%20i%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20method%3A%20o%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%7D%20%3A%20%7B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20params%3A%20%7B%7D%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20data%3A%20t%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20header%3A%20%7B%7D%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20url%3A%20i%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20method%3A%20o%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%7D)%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20s%20%3D%20true%3B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20a.url%20%3D%20a.url%20%7C%7C%20i%2C%20a.method%20%3D%20a.method%20%7C%7C%20o%3B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20const%20p%20%3D%20function%20_RT_(%7B%20params%2C%20data%2C%20headers%2C%20url%2C%20method%20%7D)%20%7B%0A%20%20%2F%2F%20%E8%AE%BE%E7%BD%AE%E8%AF%B7%E6%B1%82query%E3%80%81%E8%AF%B7%E6%B1%82%E4%BD%93%E3%80%81%E8%AF%B7%E6%B1%82%E5%A4%B4%0A%20%20return%20%7B%20params%2C%20data%2C%20headers%2C%20url%2C%20method%20%7D%3B%0A%20%7D%0A(a)%3B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20if%20(%22object%22%20%3D%3D%20typeof%20(p.params%20%7C%7C%20p.data))%20%7B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20const%20t%20%3D%20(p.params%20%7C%7C%20p.data)%20instanceof%20FormData%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20e%20%3D%20%5B%5D%3B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20p.url%20%3D%20(p.url%20%7C%7C%20i).replace(%2F%7B(%5B%5E%7D%5D%2B)%7D%2Fg%2C%20(t%2C%20r)%20%3D%3E%20%7B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20const%20o%20%3D%20r%20%3F%20r.split(%22.%22)%20%3A%20%5B%5D%3B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20let%20i%20%3D%20p.params%20%7C%7C%20p.data%3B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20o.length%20%7C%7C%20n(%22%E8%AF%B7%E6%B1%82%E8%B7%AF%E5%BE%84%E4%B8%AD%E6%A8%A1%E6%9D%BF%E5%AD%97%E7%AC%A6%E4%B8%B2%E9%94%99%E8%AF%AF%22)%3B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20let%20a%20%3D%200%3B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20for%20(e.push(o%5B0%5D)%3B%20o.length%3B)%20%7B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20const%20t%20%3D%20o.shift()%3B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20if%20(!i)%20return%20void%20n(%60%E8%AF%B7%E6%B1%82%E8%B7%AF%E5%BE%84%E4%B8%AD%E6%A8%A1%E6%9D%BF%E5%AD%97%E7%AC%A6%E4%B8%B2%E7%9A%84%E5%8F%82%E6%95%B0(%24%7Br%7D)%E7%BC%BA%E5%A4%B1%60)%3B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20let%20e%20%3D%20i%5Bt%5D%3B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20if%20(i%20instanceof%20FormData%20%26%26%20(e%20%3D%20i.get(t)%2C%200%20%3D%3D%3D%20a%20%26%26%20o.length))%20try%20%7B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20e%20%3D%20JSON.parse(e)%3B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%7D%20catch%20(t)%20%7B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20return%20void%20n(%60%E8%AF%B7%E6%B1%82%E8%B7%AF%E5%BE%84%E4%B8%AD%E6%A8%A1%E6%9D%BF%E5%AD%97%E7%AC%A6%E4%B8%B2%E7%9A%84%E5%8F%82%E6%95%B0(%24%7Br%7D)%E7%BC%BA%E5%A4%B1%60)%3B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%7D%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20null%20%3D%3D%20e%20%26%26%20n(%60%E8%AF%B7%E6%B1%82%E8%B7%AF%E5%BE%84%E4%B8%AD%E6%A8%A1%E6%9D%BF%E5%AD%97%E7%AC%A6%E4%B8%B2%E7%9A%84%E5%8F%82%E6%95%B0(%24%7Br%7D)%E7%BC%BA%E5%A4%B1%60)%2C%20a%2B%2B%2C%20i%20%3D%20e%3B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%7D%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20return%20i%3B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%7D)%2C%20t%20%3F%20(e.forEach(t%20%3D%3E%20%7B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20(p.params%20%7C%7C%20p.data).delete(t)%3B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%7D)%2C%20(p.params%20%7C%7C%20p.data).delete(%22MYBRICKS_HOST%22))%20%3A%20(e.forEach(t%20%3D%3E%20%7B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20Reflect.deleteProperty(p.params%20%7C%7C%20p.data%20%7C%7C%20%7B%7D%2C%20t)%3B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%7D)%2C%20Reflect.deleteProperty(p.params%20%7C%7C%20p.data%20%7C%7C%20%7B%7D%2C%20%22MYBRICKS_HOST%22))%3B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%7D%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20p.method%20%3D%20p.method%20%7C%7C%20o%3B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20let%20d%20%3D%20!1%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20f%20%3D%20%5B%5D%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20h%20%3D%20%5B%5D%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20g%20%3D%20%22then%22%3B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20r.ajax(p).catch(t%20%3D%3E%20%7B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20if%20(c%20%26%26%20(t.response%20%7C%7C%20%22AxiosError%22%20%3D%3D%3D%20t.name))%20%7B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20const%20e%20%3D%20t.response%20%7C%7C%20%7B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20data%3A%20%7B%7D%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%7D%3B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20!e.data%20%26%26%20(e.data%20%3D%20%7B%7D)%2C%20c(%7B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20error%3A%20t%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20response%3A%20e%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20config%3A%20p%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%7D%2C%20%7B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20throwError%3A%20(...t)%20%3D%3E%20%7B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20d%20%3D%20!0%2C%20n(...t)%3B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%7D%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%7D)%3B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%7D%20else%20n(t)%3B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20throw%20Error(%22HTTP_FETCH_ERROR%22)%3B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%7D).then(t%20%3D%3E%20s%20%3F%20function%20_RT_(%7B%20response%2C%20config%20%7D)%20%7B%0A%20%20%2F%2F%20if%20(response.data.code%20!%3D%3D%200)%20%7B%0A%20%20%2F%2F%20%20%20throw%20new%20Error(response.data.errMsg)%0A%20%20%2F%2F%20%7D%0A%20%20return%20response.data%0A%7D%0A(%7B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20response%3A%20t%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20config%3A%20p%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%7D%2C%20%7B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20throwError%3A%20n%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%7D)%20%3A%20t).then(t%20%3D%3E%20%7B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20const%20e%20%3D%20function%20_RT_(result%2C%20%7B%20method%2C%20url%2C%20params%2C%20data%2C%20headers%20%7D)%20%7B%0A%20%20%2F%2F%20return%20%7B%0A%20%20%2F%2F%20%20total%3A%20result.all%2C%0A%20%20%2F%2F%20%20dataSource%3A%20result.list.map(%7Bid%2C%20name%7D%20%3D%3E%20(%7B%0A%20%20%2F%2F%20%20%20%20%20value%3Aid%2C%20label%3A%20name%0A%20%20%2F%2F%20%20%7D))%0A%20%20%2F%2F%20%7D%0A%20%20return%20result%3B%0A%7D%0A(t%2C%20Object.assign(%7B%7D%2C%20p)%2C%20%7B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20throwError%3A%20n%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%7D)%3B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20for%20(let%20t%20%3D%200%3B%20t%20%3C%20u.length%3B%20t%2B%2B)%20%7B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20const%20%7B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20id%3A%20n%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20predicate%3A%20r%20%3D%20%7B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20key%3A%20%22%22%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20value%3A%20void%200%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%7D%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20excludeKeys%3A%20o%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20outputKeys%3A%20i%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%7D%20%3D%20u%5Bt%5D%3B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20if%20(!r%20%7C%7C%20!r.key%20%7C%7C%20void%200%20%3D%3D%3D%20r.value)%20%7B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20f%20%3D%20i%2C%20h%20%3D%20o%2C%20g%20%3D%20%22default%22%20%3D%3D%3D%20n%20%3F%20%22then%22%20%3A%20n%3B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20break%3B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%7D%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20let%20a%20%3D%20e%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20l%20%3D%20r.key.split(%22.%22)%3B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20for%20(%3B%20a%20%26%26%20l.length%3B)%20a%20%3D%20a%5Bl.shift()%5D%3B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20if%20(!l.length%20%26%26%20(%22%3D%22%20%3D%3D%3D%20r.operator%20%3F%20a%20%3D%3D%3D%20r.value%20%3A%20a%20!%3D%3D%20r.value))%20%7B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20f%20%3D%20i%2C%20h%20%3D%20o%2C%20g%20%3D%20%22default%22%20%3D%3D%3D%20n%20%3F%20%22then%22%20%3A%20n%3B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20break%3B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%7D%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%7D%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20return%20e%3B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%7D).then(t%20%3D%3E%20%7B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20if%20(!l)%20return%200%20%3D%3D%3D%20h.length%20%7C%7C%20h.forEach(e%20%3D%3E%20function%20(t%2C%20e)%20%7B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20const%20n%20%3D%20e.length%3B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20!function%20t(r%2C%20o)%20%7B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20if%20(!r%20%7C%7C%20o%20%3D%3D%3D%20n)%20return%3B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20const%20i%20%3D%20e%5Bo%5D%3B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20o%20%3D%3D%3D%20n%20-%201%20%26%26%20Reflect.deleteProperty(r%2C%20i)%2C%20Array.isArray(r)%20%3F%20r.forEach(e%20%3D%3E%20%7B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20t(e%2C%20o)%3B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%7D)%20%3A%20t(r%5Bi%5D%2C%20o%20%2B%201)%3B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%7D(t%2C%200)%3B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%7D(t%2C%20e.split(%22.%22)))%2C%20t%3B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20e(t)%3B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%7D).then(t%20%3D%3E%20%7B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20let%20n%20%3D%20Array.isArray(t)%20%3F%20%5B%5D%20%3A%20%7B%7D%3B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20if%20(void%200%20%3D%3D%3D%20f%20%7C%7C%200%20%3D%3D%3D%20f.length)%20n%20%3D%20t%3Belse%20if%20(f.forEach(e%20%3D%3E%20%7B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20!function%20(t%2C%20e%2C%20n)%20%7B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20const%20r%20%3D%20e.length%3B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20!function%20t(n%2C%20o%2C%20i)%20%7B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20if%20(!n%20%7C%7C%20o%20%3D%3D%3D%20r)%20return%20n%3B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20const%20a%20%3D%20e%5Bo%5D%3B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20return%20Array.isArray(n)%20%3F%20n.map((e%2C%20n)%20%3D%3E%20%7B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20const%20r%20%3D%20i%5Bn%5D%3B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20let%20a%3B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20return%20void%200%20%3D%3D%3D%20r%20%3F%20(a%20%3D%20%7B%7D%2C%20i.push(a))%20%3A%20a%20%3D%20r%2C%20t(e%2C%20o%2C%20a)%3B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%7D)%20%3A%20o%20%3D%3D%3D%20r%20-%201%20%3F%20(i%5Ba%5D%20%3D%20n%5Ba%5D%2C%20n%5Ba%5D)%20%3A%20(n%20%3D%20n%5Ba%5D%2C%20Array.isArray(n)%20%3F%20i%5Ba%5D%20%3D%20i%5Ba%5D%20%7C%7C%20%5B%5D%20%3A%20i%5Ba%5D%20%3D%20i%5Ba%5D%20%7C%7C%20%7B%7D%2C%20t(n%2C%20o%20%2B%201%2C%20Array.isArray(i)%20%3F%20i%20%3A%20i%5Ba%5D))%3B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%7D(t%2C%200%2C%20n)%3B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%7D(t%2C%20e.split(%22.%22)%2C%20n)%3B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%7D)%2C%20Array.isArray(f)%20%26%26%20f.length%20%26%26%20(f.length%20%3E%201%20%7C%7C%201%20!%3D%3D%20f.length%20%7C%7C%20%22%22%20!%3D%3D%20f%5B0%5D))%20try%20%7B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20let%20t%20%3D%20f.map(t%20%3D%3E%20t.split(%22.%22))%3B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20for%20(%3B%20%22%5Bobject%20Object%5D%22%20%3D%3D%3D%20Object.prototype.toString.call(n)%20%26%26%20t.every(t%20%3D%3E%20!!t.length)%20%26%26%201%20%3D%3D%3D%20Object.values(n).length%3B)%20n%20%3D%20Object.values(n)%5B0%5D%2C%20t.forEach(t%20%3D%3E%20t.shift())%3B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%7D%20catch%20(t)%20%7B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20console.log(%22%E8%BF%9E%E6%8E%A5%E5%99%A8%E5%86%85%E7%BD%AE%E6%95%B0%E6%8D%AE%E8%BD%AC%E6%8D%A2%E5%A4%B1%E8%B4%A5%EF%BC%8C%E9%94%99%E8%AF%AF%E6%98%AF%EF%BC%9A%22%2C%20t)%3B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%7D%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20e(r.isMultipleOutputs%20%3F%20%7B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20__OUTPUT_ID__%3A%20g%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20__ORIGIN_RESPONSE__%3A%20n%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%7D%20%3A%20n)%3B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%7D).catch(t%20%3D%3E%20%7B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20t%20%26%26%20%22HTTP_FETCH_ERROR%22%20%3D%3D%3D%20t.message%20%3F%20c%20%26%26%20!d%20%26%26%20n(%22%E5%85%A8%E5%B1%80%E6%8B%A6%E6%88%AA%E5%93%8D%E5%BA%94%E9%94%99%E8%AF%AF%E5%87%BD%E6%95%B0%E4%B8%AD%E5%BF%85%E9%A1%BB%E8%B0%83%E7%94%A8%20throwError%20%E6%96%B9%E6%B3%95%EF%BC%8C%E8%AF%B7%E5%89%8D%E5%BE%80%E4%BF%AE%E6%94%B9%22)%20%3A%20n(t%20%26%26%20t.message%20%7C%7C%20t)%3B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%7D)%3B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%7D%20catch%20(t)%20%7B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20return%20n(t)%3B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%7D%0A%20%20%20%20%20%20%20%20%20%20%20%20%7D(t%2C%20r)%3B%0A%20%20%20%20%20%20%20%20%20%20%7D"
      }
    ],
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