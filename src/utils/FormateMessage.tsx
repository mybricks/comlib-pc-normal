import React, { ReactElement, ReactNode } from "react"

export type TFormatProps = {
  message: string,
  replaceMap: Record<string, ReactElement>
}

export default function FormatMessage({ message, replaceMap }: TFormatProps): ReactElement {
  // Split the message into parts using a more flexible regex
  const parts = message.split(/(\{\s*[^{}]+\s*\})/g);

  // Map each part to either a string or a replaced ReactNode
  return parts.map((part, index) => {
    // Use a more flexible regex to match keys with potential spaces
    const match = part.match(/^\{\s*([^{}]+)\s*\}$/);
    if (match) {
      const key = match[1].trim();
      return React.createElement(React.Fragment, { key: index }, replaceMap[key] || part);
    }
    return part;
  });
}
