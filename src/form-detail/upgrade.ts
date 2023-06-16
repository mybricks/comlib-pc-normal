import { Data } from './constants';

export default function ({ data, input, output, setDeclaredStyle }: UpgradeParams<Data>): boolean {
  /**
    * @description v1.0.2 增加“设置数据源”和“设置标题”默认schema
  */

  const titleSchema = {
    "type": "string"
  }

  const dataSourceSchema = {
    "type": "object",
    "properties": {
      "field1": {
        "type": "string"
      }
    }
  }

  if (!input.get('setTitle')) {
    input.add('setTitle', '设置标题', titleSchema);
  }

  if (!output.get('setDataSource')) {
    output.add('setDataSource', '设置数据源', dataSourceSchema);
  }

  /**
    * @description v1.0.7 标签和内容字体style改造
  */
  data.items.map((item)=>{
    if( typeof item.labelStyle.lineHeight === 'number' && typeof item.labelStyle.fontSize === 'number' ){
      setDeclaredStyle(`.${item.id}-label`, {...item.labelStyle, fontSize: item.labelStyle.fontSize + 'px', lineHeight: item.labelStyle.fontSize * item.labelStyle.lineHeight + 'px'});
    }
    if(typeof item.contentStyle.lineHeight === 'number' && typeof item.contentStyle.fontSize === 'number'){
      setDeclaredStyle(`.${item.id}-content`, {...item.contentStyle, fontSize: item.contentStyle.fontSize + 'px' , lineHeight: item.contentStyle.fontSize * item.contentStyle.lineHeight +'px'});
    }
    setDeclaredStyle(`.${item.id}-item`, {paddingTop: item.padding?.[2] + 'px', paddingBottom: item.padding?.[3]+ 'px', paddingLeft: item.padding?.[0]+ 'px', paddingRight: item.padding?.[1]+ 'px'});
  })

  return true;
}