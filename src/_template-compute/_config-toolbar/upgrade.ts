export default function ({ input, output, data }): boolean {
  /**
   * @description v1.0.2->1.0.3 , remove sceneId场景ID
   */
  if (input.get('creator.sceneId')) {
    input.remove("creator.sceneId");
  }
  return true;
}
