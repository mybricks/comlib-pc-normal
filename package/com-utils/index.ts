import Sandbox from './sandbox';

export function runJs(scriptText: string, model?: [], callback?: () => {}) {
    let fn = null;
    if(model && model.length) {
        const sandBox = new Sandbox({module: true});
        let sourceStr = decodeURIComponent(scriptText);
        if(/export\s+default.*async.*function.*\(/g.test(sourceStr)) {
            fn = sandBox.compile(`${sourceStr.replace(/export\s+default.*function.*\(/g, 'async function _RT_(')}`);
        } else {
            fn = sandBox.compile(`${sourceStr.replace(/export\s+default.*function.*\(/g, 'function _RT_(')}`);
        }
    } else {
        const sandBox = new Sandbox();
        fn = sandBox.compile(`${decodeURIComponent(scriptText)}`);
    }

    return fn.run(model, callback);
}