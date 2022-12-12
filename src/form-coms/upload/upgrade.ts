export default function ({ input, output }): boolean {
  //1.0.0 -> 1.0.1
  input.get('setValue').setSchema({
    type: 'array',
    items: {
      type: 'object',
      properties: {
        name: {
          type: 'string'
        },
        url: {
          type: 'string'
        }
      }
    }
  });
  input.get('uploadDone').setSchema({
    type: 'object',
    properties: {
      name: {
        type: 'string'
      },
      url: {
        type: 'string'
      }
    }
  });

  // 1.0.1 -> 1.0.2
  output.get('upload').setSchema({
    type: 'object'
  })
  return true;
}
