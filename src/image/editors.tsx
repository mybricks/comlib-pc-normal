/** @format */

import { uuid } from "../utils";
import { ImageItem, Data } from "./constants";
import { STYLE, DEFAULT_IMAGE } from "./utils";

interface Result {
  data: Data;
  input: any;
  output: any;
  focusArea?: any;
  style?: any;
}
const setImage = ({ data }: { data: Data }) => {
  const id = uuid();
  const title = "图片";
  const defaultImage: ImageItem = {
    id,
    title,
    src: data.dataSource === 1 ? DEFAULT_IMAGE : "",
    width: STYLE.WIDTH,
    height: STYLE.HEIGHT,
    alt: "",
    preview: false,
    margin: [0, 0, 0, 0],
    customBorderStyle: {},
  };
  data.image = defaultImage;
};

const getItemProp = ({ data, val }: { data: Data; val: string }) => {
  if (val === "obj") {
    return data.image;
  }
  return data.image[val];
};

export default {
  "@init": ({ data, style, output }: Result) => {
    style.width = data.config.width;
    style.height = data.config.height;
    setImage({ data });
  },
  '@resize': {
    options: ['height', 'width'],
  },
  ":root": [
    {
      title: "基本样式",
      items: [
        {
          title: "",
          type: "style",
          options: ["border"],
          value: {
            get({ data }) {
              return getItemProp({
                data,
                val: "customBorderStyle",
              });
            },
            set({ data }, theme: string) {
              const res = getItemProp({
                data,
                val: "obj",
              });
              res.customBorderStyle = theme;
            },
          },
        },
      ],
    },
    {
      title: "图片配置",
      items: [
        {
          title: "图片地址",
          type: "imageSelector",
          ifVisible({ data }: Result) {
            return data.dataSource === 1;
          },
          value: {
            get({ data }: Result) {
              return getItemProp({
                data,
                val: "src",
              });
            },
            set({ data }: Result, value: string) {
              const res = getItemProp({
                data,
                val: "obj",
              });
              res.src = value;
            },
          },
        },
      ],
    },
    {
      title: "自定义配置",
      items: [
        {
          title: "预览",
          description: "打开预览点击输出失效",
          type: "Switch",
          value: {
            get({ data }) {
              return getItemProp({
                data,
                val: "preview",
              });
            },
            set({ data }: Result, value: boolean) {
              const res = getItemProp({
                data,
                val: "obj",
              });
              res.preview = value;
            },
          },
        },
        {
          title: "预览图片地址",
          type: "Text",
          description: "默认为图片地址",
          ifVisible({ data }: Result) {
            return !!getItemProp({ data, val: "preview" });
          },
          value: {
            get({ data }) {
              const preview = getItemProp({ data, val: "preview" });
              if (typeof preview === "boolean") {
                return getItemProp({ data, val: "src" });
              }
              return preview.src;
            },
            set({ data, focusArea }: Result, value: boolean) {
              const res = getItemProp({
                data,
                val: "obj",
              });
              res.preview = {
                src: value,
              };
            },
          },
        },
        {
          title: "支持容错处理",
          type: "Switch",
          value: {
            get({ data, focusArea }) {
              return getItemProp({
                data,
                val: "supportFallback",
              });
            },
            set({ data, focusArea }: Result, value: boolean) {
              const res = getItemProp({
                data,
                val: "obj",
              });
              res.supportFallback = value;
            },
          },
        },
        {
          title: "容错图像占位符",
          type: "Text",
          description: "加载失败显示图像占位符",
          ifVisible({ data }: Result) {
            return !!getItemProp({
              data,
              val: "supportFallback",
            });
          },
          value: {
            get({ data }) {
              return getItemProp({
                data,
                val: "fallback",
              });
            },
            set({ data }: Result, value: boolean) {
              const res = getItemProp({
                data,
                val: "obj",
              });
              res.fallback = value;
            },
          },
        },
        // 点击事件
        {
          title: '点击事件',
          type: '_Event',
          ifVisible({ data }: EditorResult<Data>) {
            return !getItemProp({
              data,
              val: "preview",
            });
          },
          options() {
            return {
              outputId: 'click'
            };
          }
        }
      ],
    },
  ],
};
