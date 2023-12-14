export interface IData {
  id: string;
}

// 运行时执行
export default function ({ data, inputs, outputs, env }: RuntimeParams<IData>) {
  if (env.runtime) {
    inputs['check']((value) => {
      if (!data.id) return;
      window.checklist = [
        ...(window.checklist || []),
        {
          id: data.id,
          value
        }
      ];
      console.log(`window.checklist: `, window.checklist);

      outputs['export'](value);
    });
  }
}
