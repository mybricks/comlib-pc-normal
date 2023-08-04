import { Data } from './types';


export default {
  '@resize': {
    options: ['width']
  },
  '@init': ({ style }) => {
    style.width = '100%';
  },
  ':root'({ data }: EditorResult<{ type }>, ...catalog) {
    
  }
};
