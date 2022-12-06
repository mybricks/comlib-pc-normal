export default function ({ input }): boolean {
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
  return true;
}
