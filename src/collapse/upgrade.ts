import { Data, OutputIds, InputIds, Schemas } from './constants';

export default function ({ 
  id,
  data,
  slot,
  output,
  input
}: UpgradeParams<Data>): boolean {
  //1.0.3 -> 1.0.4
  if(data.useDynamicTitle && !output.get("setTitleDone") && input.get(InputIds.Title)){
    output.add("setTitleDone", "设置标题完成", Schemas.Title);
    input.get(InputIds.Title).setRels(["setTitleDone"]);
  }

  if(data.useDynamicExpand){
    if(!output.get("seExpandedDone") && input.get(InputIds.Expanded)){
      output.add("seExpandedDone", "设置展开完成", Schemas.Expanded);
      input.get(InputIds.Expanded).setRels(["seExpandedDone"]);
    }
    if(!output.get("setFoldedDone") && input.get(InputIds.Folded)){
      output.add("setFoldedDone", "设置收起完成", Schemas.Folded);
      input.get(InputIds.Folded).setRels(["setFoldedDone"]);
    }
  }

  return true;
}