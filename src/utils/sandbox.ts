type Expression = string | undefined;
type Context = Record<string, any> | undefined;

export default class Sandbox {
  static CONTEXT: string = 'input';
  private expression: Expression;
  private context: Context;
  constructor({ context, expression }: { context?: Context; expression?: Expression } = {}) {
    this.context = context;
    this.expression = expression;
  }

  private unscopeCompileCode() {
    const keys = Object.keys(this.context || {}) || []
    return new Function(
      Sandbox.CONTEXT,
      `with(${Sandbox.CONTEXT}){
            return ${this.expression}
        }`
    );
  }
  private scopeCompileCode() {
    const fn = this.unscopeCompileCode();
    return (sandbox) => {
      const proxy = new Proxy(
        // { [Sandbox.CONTEXT]: sandbox },
        { ...window, ...this.context },
        {
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
        }
      );
      return fn(proxy);
    };
  }
  private setContext(context: Context) {
    this.context = context;
  }
  private setExpression(expression: Expression) {
    this.expression = expression;
  }
  run({ context, expression }: { context: Context; expression: Expression }) {
    this.setContext(context);
    this.setExpression(expression);
    const fn = this.scopeCompileCode();
    return fn.call(this, this.context);
  }
}
