/**
 * Whether the parameter is one of them is one of them
 * @param {String} value
 * @param {Array} validList
 */
function oneOf(value, validList) {
  for (let i = 0; i < validList.length; i++) {
    if (value === validList[i]) {
      return true
    }
  }
  return false
}

function typeOf(obj) {
  const [toString] = [Object.prototype.toString]
  const map = {
    '[object Boolean]': 'boolean',
    '[object Number]': 'number',
    '[object String]': 'string',
    '[object Function]': 'function',
    '[object Array]': 'array',
    '[object Date]': 'date',
    '[object RegExp]': 'regExp',
    '[object Undefined]': 'undefined',
    '[object Null]': 'null',
    '[object Object]': 'object'
  }
  return map[toString.call(obj)]
}

function isEmptyObj(obj) {
  const OBJ = obj || {}
  return !(JSON.stringify(OBJ).length > 2)
}

function hasCharacter(str, cht, start = 0) {
  const chtArr = cht.split(',')
  for (let i = 0; i < chtArr.length; i += 1) {
    if (str.toString().indexOf(chtArr[i], start) !== -1) {
      return true
    }
  }
  return false
}

export default {
  oneOf,
  typeOf,
  isEmptyObj,
  hasCharacter
}
