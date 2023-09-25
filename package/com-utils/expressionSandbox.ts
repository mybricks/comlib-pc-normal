import utils from './utils';
const { polyfill } = utils;
type Options = Partial<{
  prefix: string;
  context: Record<string, any>;
}>;

export default class Sandbox {
  private options: Options = {};
  constructor(options: Options) {
    polyfill();
    this.options = options;
  }
  private unscopeCompileCode(prefix: string = 'context', expression: string) {
    return new Function(
      prefix,
      `with(${prefix}){
            return ${expression}
        }`
    );
  }
  private scopeCompileCode(expression: string) {
    const fn = this.unscopeCompileCode(this.options.prefix, expression);
    return (sandbox) => {
      const _target = this.options.prefix ? { [this.options.prefix]: sandbox } : sandbox;
      const proxy = new Proxy(_target, {
        // 拦截所有属性，防止到 Proxy 对象以外的作用域链查找
        has(target, key) {
          return true;
        },
        get(target, key, receiver) {
          // 防止沙箱逃逸逃逸
          if (key === Symbol.unscopables) {
            return undefined;
          }
          return Reflect.get(target, key, receiver);
        }
      });
      return fn(proxy);
    };
  }
  execute(expression: string) {
    const fn = this.scopeCompileCode(expression);
    const _context = this.options.context ?? {};
    return fn.call(this, _context);
  }
  executeWithTemplate(expression: string) {
    const reg = /\{([^\{\}]*?|.+)\}/g;
    const matchIterator = expression.matchAll(reg);
    const iteratorArray = Array.from(matchIterator);
    if (!iteratorArray.length) return expression;
    const retGroup = iteratorArray.map((it) => {
      const match = it[0];
      const input = it.input;
      let ret = it[1];
      if (!!ret.trim()) {
        ret = this.execute(ret);
      }
      return {
        match,
        ret,
        input
      };
    });
    if (retGroup.length === 1 && retGroup[0].input === retGroup[0].match) {
      return retGroup[0].ret;
    }
    const retStr = retGroup.reduce((pre, cur) => {
      const { match, ret } = cur;
      if (match === expression && ret === undefined) {
        return ret;
      }
      return pre.replace(match, typeof ret === 'string' ? ret : JSON.stringify(ret));
    }, expression);
    try {
      return JSON.parse(retStr);
    } catch (error) {
      return retStr;
    }
  }
}
