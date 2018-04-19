const typeCheck = require('../typechecks.js');
const assert = require('assert');

describe('Library of type check utilities', () => {

  const assertFalse = function(text, val) {
    assert.equal(val, false, text);
  };

  const assertTrue = function(text, val) {
    assert.ok(val, text);
  };

  it('can parse truethy things', () => {
    const trueNess = [1, 2, 3, 'true', true, 'True'];
    trueNess.forEach(val =>  {
      assertTrue('This is true:', typeCheck.parseBool(val));
    });
  });

  it('can parse falsey things', () => {
    const falseNess = [0, -1, -2, -3, '', false, 'string', null, NaN, undefined];
    falseNess.forEach(val =>  {
      assertFalse('This is false:', typeCheck.parseBool(val));
    });
  });

  it('can check for functions', () => {
    const functions = [function(){}, a => a];
    const notFunctions = ['', '1', 'string', 1, -1, 1.2, -1.2, 0, +0, -0,
      Infinity, -Infinity, NaN, Number.MAX_VALUE, Number.MIN_VALUE,
      undefined, {}, {k: 'v'}, new Object(), null, NaN,
      [1, 2],[], new Array()];

    functions.forEach(val =>  {
      assertTrue('This is a string: ' + val, typeCheck.isFunction(val));
    });
    notFunctions.forEach(val =>  {
      assertFalse('This is not a string: ' + val, typeCheck.isFunction(val));
    });
  });

  it('can check for arrays', () => {
    const arrays = [[1, 2],[], new Array()];
    const notArrays = ['', '1', 'string', 1, -1, 1.2, -1.2, 0, +0, -0,
      Infinity, -Infinity, NaN, Number.MAX_VALUE, Number.MIN_VALUE,
      undefined, {}, {k: 'v'}, new Object(), null, NaN, function(){}];

    arrays.forEach(val =>  {
      assertTrue('This is a string: ' + val, typeCheck.isArray(val));
    });
    notArrays.forEach(val =>  {
      assertFalse('This is not a string: ' + val, typeCheck.isArray(val));
    });
  });

  it('can check that arrays are not empty', () => {
    assert.ok(typeCheck.isNotEmptyArr([1]));
    assertFalse('This is false', typeCheck.isNotEmptyArr([]));
  });

  it('can check if arrays are empty', () => {
    assert.ok(typeCheck.isEmptyArr([]));
    assertFalse('This is false', typeCheck.isEmptyArr([1]));
  });

  it('can check that an array length is inside a range', () => {
    assert.ok(typeCheck.arrLengthBetween([], 0, 1));
    assert.ok(typeCheck.arrLengthBetween(['a'], 0, 1));
    assertFalse('This is false', typeCheck.arrLengthBetween(['a', 'b'], 0, 1));
  });

  it('can check if something is a string', () => {
    const validStrings = ['', '1', 'string'];
    const notStrings = [1, -1, 1.2, -1.2, 0, +0, -0, Infinity, -Infinity, NaN,
      Number.MAX_VALUE, Number.MIN_VALUE, undefined, [], ['a'], {}, {k: 'v'}
    ];
    validStrings.forEach(val =>  {
      assert.ok(typeCheck.isString(val), 'This is a string: ' + val);
    });
    notStrings.forEach(val =>  {
      assertFalse('This is not a string: ' + val, typeCheck.isString(val));
    });
  });

  it('can check if something is a number', () => {
    const validNumbers = [1, -1, 1.2, -1.2, 0, +0, -0, Infinity, -Infinity, NaN,
                        Number.MAX_VALUE, Number.MIN_VALUE];
    const notNumbers = [
        '1', '0', [1], {}, undefined, null, true, false, 'blah'];
    validNumbers.forEach(val =>  {
      assertTrue('This is a number: ' + val, typeCheck.isNumber(val));
    });
    notNumbers.forEach(val =>  {
      assertFalse('This is not a number: ' + val, typeCheck.isNumber(val));
    });
  });

  it('can check if something is a useful (not NaN) number', () => {
    const validNumbers = [1, -1, 1.2, -1.2, 0, +0, -0, Infinity, -Infinity,
      Number.MAX_VALUE, Number.MIN_VALUE];
    const notNumbers = [
      '1', '0', [1], {}, undefined, null, true, false, 'blah', NaN];
    validNumbers.forEach(val =>  {
      assertTrue('This is a number: ' + val, typeCheck.isSaneNumber(val));
    });
    notNumbers.forEach(val =>  {
      assertFalse('This is not a number: ' + val, typeCheck.isSaneNumber(val));
    });
  });

  it('can check if something is a int', () => {
    const validInts = [1, 234, 0, +0, -0];
    const notInts = [-1, -2, 1.3, 0.1, '1', '0', [1], {}, undefined, null, true,
      false, NaN, -Infinity, Infinity, Number.MIN_VALUE, Number.MAX_VALUE];
    validInts.forEach(val =>  {
      assert.ok(typeCheck.isInt(val), 'This is an int: ' + val);
    });
    notInts.forEach(val =>  {
      assertFalse('This is not an int: ' + val, typeCheck.isInt(val));
    });
  });

  it('can check if something is a signed int', () => {
    const validSignedInts = [1, 234, 0, +0, -0, -1, -234];
    const notSignedInts = [-1.3, -0.1, 1.3, 0.1, '1', '0', [1], {}, undefined,
      null, true, false, NaN, -Infinity, Infinity, Number.MIN_VALUE,
      Number.MAX_VALUE];
    validSignedInts.forEach(val =>  {
      assert.ok(typeCheck.isSignedInt(val), 'This is a signed int: ' + val);
    });
    notSignedInts.forEach(val =>  {
      assertFalse('This is not a signed int: ' + val,
        typeCheck.isSignedInt(val));
    });
  });

  it('can check if something is an object', () => {
    const validObjects = [{}, {k: 'v'}, new Object(), new Date()];
    const notObjects = ['', '1', 'string', 1, -1, 1.2, -1.2, 0, +0, -0,
      Infinity, -Infinity, NaN, Number.MAX_VALUE, Number.MIN_VALUE,
      undefined, [], ['a']];
    validObjects.forEach(val =>  {
      assert.ok(typeCheck.isObject(val));
    });
    notObjects.forEach(val =>  {
      assertFalse('This is not an object:', typeCheck.isObject(val));
    });
  });

  it('can check if something is a date', () => {
    const validDates = [new Date()];
    const notDates = ['', '1', 'string', 1, -1, 1.2, -1.2, 0, +0, -0,
      Infinity, -Infinity, NaN, Number.MAX_VALUE, Number.MIN_VALUE,
      undefined, [], ['a'], {}, {k: 'v'}, new Object()];
    validDates.forEach(val =>  {
      assertTrue('This is a date: ' + val, typeCheck.isDate(val));
    });
    notDates.forEach(val =>  {
      assertFalse('This is not a date: ' + val, typeCheck.isDate(val));
    });
  });

  it('can check if something is NaN', () => {
    const validNaN = [NaN, 42 / 'General Zod', parseInt('Doomsday', 10)];
    const notNaN = ['', '1', 'string', 1, -1, 1.2, -1.2, 0, +0, -0,
      Infinity, -Infinity, Number.MAX_VALUE, Number.MIN_VALUE,
      undefined, [], ['a'], {}, {k: 'v'}, new Object(), new Date()];
    validNaN.forEach(val =>  {
      assertTrue(`This is NaN: ${val}`, typeCheck.isNaN(val));
    });
    notNaN.forEach(val =>  {
      assertFalse(`This is not NaN: ${val}`, typeCheck.isNaN(val));
    });
  });

});
