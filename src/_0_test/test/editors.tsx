export default {
  '@init'({ style }) {
    style.height = 'auto';
  },
  '@resize': {
    options: ['width', 'height']
  },
  ':root': {
    style: [
      {
        title: '字体',
        options: ['font'],
        target: ({ id }) => [`.test`]
      }
    ]
  }
};
