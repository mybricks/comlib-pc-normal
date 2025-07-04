
export default {
  ignore: true,
  ':root' ({ data }) {
    return {}
  },
  prompts: {
    summary: '置底工具栏',
    usage: `data声明
interface Tool {
  id: string;
  title: string;
  outVal: any;
  margin: number[];
  btns?: Tool[];
  style?: string;
  color?: string;
  focusId?: string;
  dataType?: string;
  showText?: boolean;
  inputContent?: any;
  shape: 'circle' | 'round' | undefined;
  size: 'small' | 'middle' | 'large' | any;
  type: 'default' | 'primary' | 'ghost' | 'dashed' | 'link' | 'text' | any;
  hidden?: boolean;
  dynamicDisplay?: boolean;
  dynamicDisabled?: boolean;
  disabled?: boolean;
}
tools: Tool[] = []
layout: string = "center"
height: number = 64
width?: string | number = "100%"

slots插槽
无

styleAry声明
无`
  }
};
