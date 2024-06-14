import { merge } from "lodash";
export default ({ env, data, inputs, outputs, onError }) => {
  const next = !env.runtime.debug;
  inputs.creator((value) => {
    const { sceneId, formData } = value;
    if (!sceneId) {
      onError("没有场景id");
      return;
    }
    if (next && formData) {
      const formSlotId = "content";
      let { items } = formData;
      const form = env.canvas.getCom({ sceneId, comId: data.form.id });
      const { slots } = form;
      if (Array.isArray(items)) {
        const slot = slots.find(({ id }) => id === formSlotId);
        items = (items ?? []).map(({ namespace, ...rest }) => {
          slot.appendChild({ namespace, data });
          return rest;
        });
        form.data = merge(form.data, { ...formData, items });
      }
      outputs.onComplete(sceneId);
    }
  });
};
