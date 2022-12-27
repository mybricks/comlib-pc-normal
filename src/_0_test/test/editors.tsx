export default {
  '@init'({ style }) {
    style.height = 'auto';
  },
  '@resize': {
    options: ['width', 'height']
  }
};
