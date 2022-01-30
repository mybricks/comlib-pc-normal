import React from "react";
import { getDefaultGroupStyle } from "../utils";

export default function NormalItem({ formItem, index }) {
  const customMargin = formItem.cusMargin;
  const marginTop = customMargin ? customMargin[0] : 0;
  const marginBottom = customMargin ? customMargin[1] : 24;
  const marginLeft = customMargin ? customMargin[2] : 16;
  const marginRight = customMargin ? customMargin[3] : 0;
  const defaultStyle = getDefaultGroupStyle();

  return (
    <div
      style={{
        marginTop,
        marginBottom,
        marginLeft,
        marginRight,
        flex: "1 0 100%",
      }}
    >
      <span style={{ ...defaultStyle, ...formItem.titleStyle }}>
        {formItem.label}
      </span>
    </div>
  );
}
