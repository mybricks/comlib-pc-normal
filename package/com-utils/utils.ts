
function isEmailPrefix(str: string) {
  return /^[a-zA-Z]+[\d\w_-]*$/.test(str)
}

function isNumber(str: string) {
  return /^\d+$/.test(str)
}

function isCommaNumber(str: string) {
  return /^\d+(,\d+)*$/.test(str)
}

function numToPercent(num: number, bit: number) {
  if(num === void 0) return 'input error';
  return `${(num * 100).toFixed(bit || 2)}%`
}

function isUrl (url: string) {
  return /^((https?):\/\/)?((?:[\w-]+\.)+[a-z0-9]+)((?:\/[^/?#]*)+)?(\?[^#]+)?(#.+)?$/i.test(url)
}

function getCookies() {
  return document.cookie.split('; ').reduce((s: any, e) => {
      const p = e.indexOf('=');
      s[e.slice(0, p)] = e.slice(p + 1);
      return s;
  }, {});
}

function getParams() {
  return location.search
  .slice(1)
  .split('&')
  .reduce(function (s: any, a) {
      let m = a.split('=');
      if (m[0]) {
          s[m[0]] = decodeURIComponent(m[1]);
      }
      return s;
  }, {});
}

interface Props {
  presets?: string[];
  errorCallback?: (val: any) => void;
  babelInstance?: any;
}
const transformCodeByBabel = (val: string, props?: Props) => {
  const {
    presets,
    errorCallback,
    babelInstance = (window as any)?.Babel
  } = props || {};
  if (
    typeof babelInstance?.transform !== 'function' ||
    typeof val !== 'string'
  ) {
    return val;
  }
  const res = {
    code: val,
    transformCode: ''
  };
  try {
    let temp = decodeURIComponent(val);
    if (/export\s+default.*async.*function.*\(/g.test(temp)) {
      temp = temp.replace(
        /export\s+default.*function.*\(/g,
        '_RTFN_ = async function _RT_('
      );
    } else if (/export\s+default.*function.*\(/g.test(temp)) {
      temp = temp.replace(
        /export\s+default.*function.*\(/g,
        '_RTFN_ = function _RT_('
      );
    } else {
      temp = `_RTFN_ = ${temp} `
    }
    res.transformCode = encodeURIComponent(
      babelInstance.transform(temp, {
        presets: presets || ['env'],
        comments: false,
      }).code
    );
    res.transformCode = `${encodeURIComponent(`(function() { var _RTFN_; \n`)}${
      res.transformCode
    }${encodeURIComponent(`\n; return _RTFN_; })()`)}`;
  } catch (e) {
    if (typeof errorCallback === 'function') {
      errorCallback(e);
    }
    return val;
  }
  return res;
};

const polyfill = () => {
  if (!String.prototype.matchAll) {
    String.prototype.matchAll = function (regexp: RegExp) {
      const matches = [];
      let match: any;
      while ((match = regexp.exec(this)) != null) {
        matches.push(match);
      }
      return matches;
    };
  }
};

export default {
  isEmailPrefix,
  isCommaNumber,
  numToPercent,
  isNumber,
  isUrl,
  getCookies,
  getParams,
  transformCodeByBabel,
  polyfill
};