import { defineDataSet } from "ai-dataset";

export default defineDataSet((utils) => {
  const layoutOptions = [
    { label: "左对齐", value: "left" },
    { label: "中对齐", value: "center" },
    { label: "右对齐", value: "right" },
  ]

  return layoutOptions.map((item) => {
    return {
      Q: `将文字对齐方向设置为${item.label}`,
      A: {
        textAlign: item.value,
      },
    };
  })
});
