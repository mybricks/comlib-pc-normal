import React, { useEffect } from "react";
import { Typography } from "antd";
import { Data } from "./constants";

const { Text, Paragraph } = Typography;

export default function ({ data, inputs, outputs }: RuntimeParams<Data>) {
  const { style } = data;

  const onClick = () => {
    if (data.click) {
      outputs["click"](data.outputContent || data.content || "");
    }
  };

  useEffect(() => {
    inputs["content"]((value: string) => {
      data.content = value;
    });
  }, []);

  return (
    <div
      style={{
        height: "fit-content",
        maxWidth: "100%",
        textAlign: data.align || "left",
      }}
    >
      {data.isEllipsis ? (
        <Paragraph
          style={{
            ...style,
            whiteSpace: "pre-wrap",
            cursor: data.click ? "pointer" : "default",
          }}
          type={data.textType}
          onClick={onClick}
          ellipsis={data.ellipsis || {}}
        >
          {data.content || ""}
        </Paragraph>
      ) : (
        <Text
          style={{
            ...style,
            whiteSpace: "pre-wrap",
            cursor: data.click ? "pointer" : "default",
          }}
          type={data.textType}
          onClick={onClick}
        >
          {data.content || ""}
        </Text>
      )}
    </div>
  );
}
