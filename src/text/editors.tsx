import { AlignType } from "./constants";
import { Data } from "./constants";

export default {
  "@init": ({ data }: EditorResult<Data>) => {
    data.style = {
      ...data.style,
      fontWeight: 400,
      fontSize: "14px",
      fontStyle: "normal",
      lineHeight: "14px",
      letterSpacing: "0px",
      color: "#000000",
    };
  },
  '@resize': {
    options: ['width'],
  },
  ":root": [
    {
      title: "文本样式",
      type: "Style",
      options: {
        plugins: ["font"],
        fontProps: {
          letterSpace: true,
        },
      },
      value: {
        get({ data }) {
          return data.style;
        },
        set({ data }, value) {
          data.style = {
            ...data.style,
            ...value,
          };
        },
      },
    },
    {
      title: "对齐方式",
      type: "iconradio",
      options: [
        {
          label: "左对齐",
          value: "left",
          url: "https://ali2.a.kwimgs.com/kos/nlav11092/left.d8013936e3ef47ea.png",
        },
        {
          label: "居中",
          value: "center",
          url: "https://ali2.a.kwimgs.com/kos/nlav11092/col-center.a994ba179331542e.png",
        },
        {
          label: "右对齐",
          value: "right",
          url: "https://ali2.a.kwimgs.com/kos/nlav11092/right.5f9b94f3690a5eaf.png",
        },
      ],
      value: {
        get({ data }: EditorResult<Data>) {
          return data.align;
        },
        set({ data }: EditorResult<Data>, value: AlignType) {
          data.align = value;
        },
      },
    },
    {
      title: "内容",
      type: "textarea",
      value: {
        get({ data }: EditorResult<Data>) {
          return data.content;
        },
        set({ data }: EditorResult<Data>, value: string) {
          data.content = value;
        },
      },
    },
    {
      title: "文本溢出",
      type: "switch",
      value: {
        get({ data }: EditorResult<Data>) {
          return data.isEllipsis;
        },
        set({ data }: EditorResult<Data>, value: boolean) {
          data.isEllipsis = value;
          if (value === true && !data.ellipsis) {
            data.ellipsis = { rows: 3 };
          }
        },
      },
    },
    {
      title: "显示行数",
      type: "InputNumber",
      options: [{ min: 1, width: '100%' }],
      ifVisible({ data }: EditorResult<Data>) {
        return data.isEllipsis;
      },
      value: {
        get({ data }: EditorResult<Data>) {
          return [data.ellipsis.rows];
        },
        set({ data }: EditorResult<Data>, value: number[]) {
          data.ellipsis = { rows: value[0] };
        },
      },
    },
    {
      title: "点击事件",
      type: "Switch",
      value: {
        get({ data }: EditorResult<Data>) {
          return data.click;
        },
        set({ data }: EditorResult<Data>, value: boolean) {
          data.click = value;
        },
      },
    },
    {
      title: "单击",
      type: '_Event',
      ifVisible({ data }: EditorResult<Data>) {
        return data.click;
      },
      options: () => {
        return {
          outputId: "click",
        };
      },
    },
    {
      title: "点击输出内容",
      type: "text",
      ifVisible({ data }: EditorResult<Data>) {
        return data.click;
      },
      value: {
        get({ data }: EditorResult<Data>) {
          return data.outputContent;
        },
        set({ data }: EditorResult<Data>, value: string) {
          data.outputContent = value;
        },
      },
    },
  ],
};
