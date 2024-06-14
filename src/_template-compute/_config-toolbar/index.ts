import { merge } from "lodash";
export default ({ env, data, inputs, outputs, onError }) => {
  const next = !env.runtime.debug;
  inputs.creator((value) => {
    const { sceneId, toolbarData } = value;
    if (!sceneId) {
      onError("没有场景id");
      return;
    }
    if (next && toolbarData) {
      const toolbar = env.canvas.getCom({ sceneId, comId: data.toolbar.id });
      let { btnList } = toolbarData;
      btnList = (btnList || []).map((btn) => {
        return btn;
      });
      toolbar.data = merge(toolbar.data, { ...toolbarData, btnList });
      outputs.onComplete(sceneId);
    }
  });
};
