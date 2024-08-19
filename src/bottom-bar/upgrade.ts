import { Data } from "./runtime";

export default function ({ data, input, output }: UpgradeParams<Data>): boolean {
  data.tools?.forEach((tool) => {
    if (input.get(`display${tool.id}`) && !output.get(`${`display${tool.id}`}Done`)) {
      output.add(`${`display${tool.id}`}Done`, '完成', { type: 'any' });
      input.get(`display${tool.id}`).setRels([`${`display${tool.id}`}Done`]);
    }
    if (input.get(`disable${tool.id}`) && !output.get(`${`disable${tool.id}`}Done`)) {
      output.add(`${`disable${tool.id}`}Done`, '完成', { type: 'any' });
      input.get(`disable${tool.id}`).setRels([`${`disable${tool.id}`}Done`]);
    }
    if (input.get(`hidden${tool.id}`) && !output.get(`${`hidden${tool.id}`}Done`)) {
      output.add(`${`hidden${tool.id}`}Done`, '完成', { type: 'any' });
      input.get(`hidden${tool.id}`).setRels([`${`hidden${tool.id}`}Done`]);
    }
  });
  // -------------------- 1.0.7 end --------------------

  return true;
}