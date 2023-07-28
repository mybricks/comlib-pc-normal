import { InputProps } from "antd";
import { getPropsFromObject } from "../../utils/toReact";
import { Data } from "./runtime";

export default function ({ data }: { data: Data }) {
  const { value } = data;
  const defaultInputProps: InputProps = {
    type: 'text',
    bordered: true,
    disabled: false,
    showCount: false,
    maxLength: -1,
    value: '',
    addonBefore: '',
    addonAfter: ''
  };
  const inputProps: InputProps = {
    type: "text",
    ...data.config,
    value,
    // onChange:changeValue,
    // onBlur,
    // onPressEnter,
  };


  let str = `<Input ${getPropsFromObject(inputProps, defaultInputProps)} />`

  return {
    imports: [
      {
        from: 'antd',
        coms: ['Input']
      },
      {
        from: 'antd/dist/antd.css',
        coms: []
      }
    ],
    jsx: str,
    style: '',
    js: ''
  }
}