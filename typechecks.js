/**
 * Created by gumm on 2015/03/15.
 */

//==============================================================================
// Language Enhancements
//==============================================================================

/**
 * This is a "fixed" version of the typeof operator.  It differs from the typeof
 * operator in such a way that null returns 'null' and arrays return 'array'.
 * @param {*} value The value to get the type of.
 * @return {string} The name of the type.
 */
const typeOf = value => {
  const s = typeof value;
  if (s === 'object') {
    if (value) {
      // Check these first, so we can avoid calling Object.prototype.toString if
      // possible.
      //
      // IE improperly marshals tyepof across execution contexts, but a
      // cross-context object will still return false for "instanceof Object".
      if (value instanceof Array) {
        return 'array';
      } else if (value instanceof Object) {
        return s;
      }

      // HACK: In order to use an Object prototype method on the arbitrary
      //   value, the compiler requires the value be cast to type Object,
      //   even though the ECMA spec explicitly allows it.
      const className = Object.prototype.toString.call(
          /** @type {Object} */ (value));
      // In Firefox 3.6, attempting to access iframe window objects' length
      // property throws an NS_ERROR_FAILURE, so we need to special-case it
      // here.
      if (className === '[object Window]') {
        return 'object';
      }

      // We cannot always use constructor == Array or instanceof Array because
      // different frames have different Array objects. In IE6, if the iframe
      // where the array was created is destroyed, the array loses its
      // prototype. Then dereferencing val.splice here throws an exception, so
      // we can't use isFunction. Calling typeof directly returns 'unknown'
      // so that will work. In this case, this function will return false and
      // most array functions will still work because the array is still
      // array-like (supports length and []) even though it has lost its
      // prototype.
      // Mark Miller noticed that Object.prototype.toString
      // allows access to the unforgeable [[Class]] property.
      //  15.2.4.2 Object.prototype.toString ( )
      //  When the toString method is called, the following steps are taken:
      //      1. Get the [[Class]] property of this object.
      //      2. Compute a string value by concatenating the three strings
      //         "[object ", Result(1), and "]".
      //      3. Return Result(2).
      // and this behavior survives the destruction of the execution context.
      if ((className === '[object Array]' ||
           // In IE all non value types are wrapped as objects across window
           // boundaries (not iframe though) so we have to do object detection
           // for this edge case.
           typeof value.length === 'number' &&
           typeof value.splice !== 'undefined' &&
           typeof value.propertyIsEnumerable !== 'undefined' &&
           !value.propertyIsEnumerable('splice')

          )) {
        return 'array';
      }
      // HACK: There is still an array case that fails.
      //     function ArrayImpostor() {}
      //     ArrayImpostor.prototype = [];
      //     const impostor = new ArrayImpostor;
      // this can be fixed by getting rid of the fast path
      // (value instanceof Array) and solely relying on
      // (value && Object.prototype.toString.vall(value) === '[object Array]')
      // but that would require many more function calls and is not warranted
      // unless closure code is receiving objects from untrusted sources.

      // IE in cross-window calls does not correctly marshal the function type
      // (it appears just as an object) so we cannot use just typeof val ==
      // 'function'. However, if the object has a call property, it is a
      // function.
      if ((className === '[object Function]' ||
          typeof value.call !== 'undefined' &&
          typeof value.propertyIsEnumerable !== 'undefined' &&
          !value.propertyIsEnumerable('call'))) {
        return 'function';
      }

    } else {
      return 'null';
    }

  } else if (s === 'function' && typeof value.call === 'undefined') {
    // In Safari typeof nodeList returns 'function', and on Firefox typeof
    // behaves similarly for HTML{Applet,Embed,Object}, Elements and RegExps. We
    // would like to return object for those and we can detect an invalid
    // function by making sure that the function object has a call method.
    return 'object';
  }
  return s;
};

/**
 * Returns true if the specified value is not undefined.
 * WARNING: Do not use this to test if an object has a property. Use the in
 * operator instead.
 *
 * @param {?} val Variable to test.
 * @return {boolean} Whether variable is defined.
 */
const isDef = val => {
  // void 0 always evaluates to undefined and hence we do not need to depend on
  // the definition of the global variable named 'undefined'.
  return val !== void 0;
};

/**
 * Returns true if the specified value is defined and not null.
 * @param {?} val Variable to test.
 * @return {boolean} Whether variable is defined and not null.
 */
const isDefAndNotNull = val => val != null;

/**
 * Returns true if the specified value is a function.
 * @param {?} val Variable to test.
 * @return {boolean} Whether variable is a function.
 */
const isFunction = val => typeOf(val) === 'function';


/**
 * Returns true if the specified value is a boolean.
 * @param {?} val Variable to test.
 * @return {boolean} Whether variable is boolean.
 */
const isBoolean = val => typeof val === 'boolean';

/**
 * Parses a value and converts it to a boolean. This considers all positive
 * numbers, as well as the strings 'true' and 'True' and 'TRUE' as true.
 * Everything else is considered false. NaN, Undefined, null, all false.
 *
 * @param {(string|number|boolean|Boolean)=} a The value to parse.
 * @return {boolean} A boolean value.
 */
const parseBool = a => {
  let bool = false;
  if (parseFloat(a) > 0 || (/^(true)/i).test(a)) {
    bool = true;
  }
  return bool;
};

/**
 * True if the given value is an array regardless if it is populated.
 * The rest false.
 * @param {*} a The value to check
 * @return {boolean}
 */
const isArray = a => typeOf(a) === 'array';

/**
 * True if the given value is an array with at least one element.
 * The rest false.
 * @param {*} a The value to check
 * @return {boolean}
 */
const isEmptyArr = a => isArray(a) && !isDef(a[0]);

/**
 * True if the given value is an empty array.
 * The rest false.
 * @param {*} a The value to check
 * @return {boolean}
 */
const isNotEmptyArr = a => !isEmptyArr(a);

/**
 * True if the given value is an array and its length is between the given
 * values (inclusive)
 * The rest false.
 * @param {*} a The value to check
 * @return {boolean}
 */
const arrLengthBetween = (a, min, max) => {
  return a.length >= min && a.length <= max;
};

/**
 * Only valid strings return true;
 * The rest false.
 * @param {*} a The value to check
 * @return {boolean}
 */
const isString = a => typeOf(a) === 'string';

/**
 * Anything that is a valid JS number returns true. This includes stuff like
 * NaN (which is a number) and Infinity, Number.MAX_VALUE and Number.MIN_VALUE.
 * The rest false.
 * @param {*} a The value to check
 * @return {boolean}
 */
const isNumber = a => typeof a === 'number';

/**
 * Its mildly insane to make the type of NaN a number, and definitely not
 * expected. This is a saner version of the simple isNumber test, that fails
 * NaN's as well.
 * The rest false.
 * @param {*} a The value to check
 * @return {boolean}
 */
const isSaneNumber = a => !isNaN(a) && typeof a === 'number';

/**
 * Only numbers that can reliably be passed to JSON as a number, and that
 * are not floats will and that does not carry a sign returns true.
 * The rest false.
 * @param {*} a The value to check
 * @return {boolean}
 */
const isInt = a => {
  const aS = isDefAndNotNull(a) ? a.toString() : '.';
  const valid = '0123456789'.split('');
  let eachCheck = 0;
  aS.split('').forEach(function(n) {
    eachCheck += valid.indexOf(n) >= 0 ? 0 : 1;
  });
  return typeOf(a) === 'number' && a >= 0 && !eachCheck;
};

/**
 * Only numbers that can reliably be passed to JSON as a number, and that
 * are not floats will return true. The rest false.
 * @param {*} a The value to check
 * @return {boolean}
 */
const isSignedInt = a => {
  const aS = isDefAndNotNull(a) ? a.toString() : '.';
  const valid = '+-0123456789'.split('');
  let eachCheck = 0;
  aS.split('').forEach(function(n) {
    eachCheck += valid.indexOf(n) >= 0 ? 0 : 1;
  });
  return typeOf(a) === 'number' && !eachCheck;
};

/**
 * Given an object structure this returns true. Arrays, even though technically
 * an object, return false.
 * @param {*} a The value to check
 * @return {boolean}
 */
const isObject = a => typeOf(a) === 'object';

/**
 * Given a date this returns true.
 * @param {*} a The value to check
 * @return {boolean}
 */
const isDate = a => Object.prototype.toString.call(a) === '[object Date]';

/**
 * Normal isNaN has some unexpected behavior, such like: isNaN(' ') evaluates
 * to false and isNaN('sting') evaluates to true.
 * ECMAScript (ES6) delivers the Number.isNaN() with much more sane results, and
 * the only thing that delivers a true is a true NaN
 * @param {*} a The value to evaluate
 * @return {boolean}s
 */
const isNaN = a => Number.isNaN(a);


export default {
  typeOf,
  isDef,
  isDefAndNotNull,
  isFunction,
  isBoolean,
  parseBool,
  isArray,
  isEmptyArr,
  isNotEmptyArr,
  arrLengthBetween,
  isString,
  isNumber,
  isSaneNumber,
  isInt,
  isSignedInt,
  isObject,
  isDate,
  isNaN,
}
