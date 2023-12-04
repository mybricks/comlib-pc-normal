import { InputIds, OutputIds, Data } from './constants';

export default function ({ output, input }: UpgradeParams<Data>): boolean {
  const setRels = (
    InputId: any,
    OutputId: any,
    OutputTitle: any,
    Schema: any = {
      type: 'any'
    }
  ) => {
    const Input = input.get(InputId);
    const OutPut = output.get(OutputId);
    if (Input) {
      if (!OutPut) {
        output.add(OutputId, OutputTitle, Schema);
      }
      if (!Input.rels) {
        Input.setRels([OutputId]);
      }
    }
  };
  setRels(InputIds.Trigger, OutputIds.Finish, '完成', {
    type: 'follow'
  });
  return true;
}
