// import getColorEditor from "../../utils/editor/getColorEditor";
// import { Editor, EditorType, textCommonConfig } from "../../utils/editor";
export default {
  '@init'({ style }) {
    style.width = '100%';
    style.height = 400;
  },
  '@resize': {
    options: ['width', 'height']
  },
  ':root': [
    // Editor("主题", EditorType.Radio, "theme", {
    //   options: [
    //     {
    //       label: "暗黑",
    //       value: "dark",
    //     },
    //     {
    //       label: "明亮",
    //       value: "light",
    //     },
    //   ],
    // }),
    // Editor("地图来源", EditorType.Radio, "source", {
    //   options: [
    //     {
    //       label: "高德地图",
    //       value: "amap",
    //     },
    //     {
    //       label: "谷歌地图",
    //       value: "google",
    //     },
    //   ],
    // }),
    // Editor("语言类型", EditorType.Radio, "lang", {
    //   options: [
    //     {
    //       label: "中文",
    //       value: "zh",
    //     },
    //     {
    //       label: "英文",
    //       value: "en",
    //     },
    //   ],
    // }),
    // Editor("缩放层级", EditorType.Number, "zoom"),
  ]
};
