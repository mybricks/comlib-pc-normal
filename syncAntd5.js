/** 获取相对路径 */
const getRelativePath = (path1, path2) => {
  const relativePath = path.relative(path.dirname(path1), path.dirname(path2));
  if (relativePath === ".") {
    return path.basename(path2)
  }
  return path.join(relativePath, path.basename(path2));
}

/** 创建文件同时创建文件夹 */
function createFileWithDirs(filePath, fileContent = '') {
  // console.log("写文件: ", filePath);
  // 提取目录路径
  const dirPath = path.dirname(filePath);

  // 递归创建目录
  fs.mkdirSync(dirPath, { recursive: true });
  fs.writeFileSync(filePath, fileContent, "utf-8");
}

// 目标基准路径
const baseDir = 'antd5';

const fs = require("fs");
const path = require("path");

const antd5Path = path.resolve(__dirname, "./antd5");
console.log("antd5Path: ", antd5Path)

if (!fs.existsSync(antd5Path)) {
  fs.mkdirSync(antd5Path);
}

const json = require("./pub.mybricks.json");
const { comAry } = json;
const antd5ComAry = [];

const TraversalComAry = (comAry, antd5ComAry) => {
  comAry.forEach((com) => {
    if (typeof com === "string") {
      // 直接读
      antd5ComAry.push(path.join(baseDir, com))

      const jsonPath = path.resolve(__dirname, com);
      const antd5JsonPath = path.resolve(antd5Path, com);

      const json = require(jsonPath);
      const {
        namespace,
        target, // 废弃
        ...other
      } = json;
      const split = namespace.split(".");
      split.splice(split.length - 1, 0, "antd5");
      const antd5Json = {
        namespace: split.join(".")
        // namespace
      }
      const isUi = !json.rtType; // 没有rtType是ui组件;
      Object.entries(other).forEach(([key, value]) => {
        if (typeof value === "string") {
          try {
            const filePath = path.resolve(path.dirname(jsonPath), value)
            if (fs.existsSync(filePath)) {
              if (key === "runtime") {
                if (isUi) {
                  antd5Json[key] = "./runtime.tsx";
                  // createFileWithDirs(path.resolve(antd5JsonPath, "../runtime.tsx"), `
                  //   import React, { useRef } from "react";
                  //   import { StyleProvider } from "@ant-design/cssinjs";
                  //   import Runtime from "${getRelativePath(antd5JsonPath, filePath)}";

                  //   export default function (props) {
                  //     const container = useRef((props.env.edit || props.env.runtime.debug) ? document.querySelector("#_mybricks-geo-webview_")!.shadowRoot : null);
                  //     return (
                  //       <StyleProvider container={container.current!} hashPriority="high">
                  //         <Runtime {...props} />
                  //       </StyleProvider>
                  //     )
                  //   }
                  // `);
                  createFileWithDirs(path.resolve(antd5JsonPath, "../runtime.tsx"), `
                    import Runtime from "${getRelativePath(antd5JsonPath, filePath)}";

                    export default Runtime
                  `);
                } else {
                  antd5Json[key] = getRelativePath(antd5JsonPath, filePath);
                }
              } else {
                antd5Json[key] = getRelativePath(antd5JsonPath, filePath);
              }
            } else {
              antd5Json[key] = value;
            }
          } catch (e) {
            antd5Json[key] = value;
          }
        } else {
          antd5Json[key] = value
        }
      })

      createFileWithDirs(antd5JsonPath, JSON.stringify(antd5Json, null, 2));
    } else {
      const { title, comAry } = com;
      const next = [];
      TraversalComAry(comAry, next);

      antd5ComAry.push({
        title,
        comAry: next
      });
    }
  })
}

TraversalComAry(comAry, antd5ComAry);

// createFileWithDirs(path.resolve(__dirname, "pub.antd5.mybricks.json"), JSON.stringify({
//   "name": "通用PC组件库(antd5)",
//   "namespace": "mybricks.normal-pc.antd5",
//   "commitInfo": "update",
//   comAry: antd5ComAry,
//   "externals": [
//     {
//       "name": "@ant-design/cssinjs",
//       "library": "antdCssinjs",
//       "urls": [
//         "public/antd/cssinjs.min.js"
//       ]
//     },
//     {
//       "name": "dayjs",
//       "library": "dayjs",
//       "version": "1.11.13",
//       "urls": [
//         "public/dayjs/dayjs@1.11.13.min.js",
//         "public/dayjs/locale/zh-cn.min.js"
//       ]
//     },
//     {
//       "name": "@ant-design/icons",
//       "library": "icons",
//       "urls": [
//         "public/ant-design-icons@4.7.0.min.js"
//       ]
//     },
//     {
//       "name": "antd",
//       "library": "antd_5_21_4",
//       "version": "5.21.4",
//       "urls": [
//         "public/antd/antd@5.21.4.min.js",
//         "public/antd/locale/zh_CN.js"
//       ]
//     }
//   ],
//   "tags": "react",
//   "webpackConfig": "./webpack.config.antd5.js"
// }, null, 2));
