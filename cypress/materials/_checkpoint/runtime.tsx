export interface IData {
  id: string;
}

// 运行时执行
export default function ({ data, inputs, outputs, env }: RuntimeParams<IData>) {
  if (env.runtime) {
    inputs['check'](() => {
      if (!data.id) return;
      window.checklist = [...(window.checklist || []), data.id];
      console.log(`window.checklist: `, window.checklist);
    });
  }
}
