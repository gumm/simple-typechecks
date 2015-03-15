var typeCheck = require('./typechecks.js');
var assert = require('assert');

describe('Library of type check utilities', function() {

  var assertFalse = function(text, val) {
    assert.equal(val, false, text);
  };

  var assertTrue = function(text, val) {
    assert.ok(val, text);
  };

  it('can parse truethy things', function() {
    var trueNess = [1, 2, 3, 'true', true, 'True'];
    trueNess.forEach(function(val) {
      assertTrue('This is true:', typeCheck.parseBool(val));
    });
  });

  it('can parse falsey things', function() {
    var falseNess = [0, -1, -2, -3, '', false, 'string', null, NaN, undefined];
    falseNess.forEach(function(val) {
      assertFalse('This is false:', typeCheck.parseBool(val));
    });
  });

  it('can check for functions', function() {
    var functions = [function(){}];
    var notFunctions = ['', '1', 'string', 1, -1, 1.2, -1.2, 0, +0, -0,
      Infinity, -Infinity, NaN, Number.MAX_VALUE, Number.MIN_VALUE,
      undefined, {}, {k: 'v'}, new Object(), null, NaN,
      [1, 2],[], new Array()];

    functions.forEach(function(val) {
      assertTrue('This is a string: ' + val, typeCheck.isFunction(val));
    });
    notFunctions.forEach(function(val) {
      assertFalse('This is not a string: ' + val, typeCheck.isFunction(val));
    });
  });

  it('can check for arrays', function() {
    var arrays = [[1, 2],[], new Array()];
    var notArrays = ['', '1', 'string', 1, -1, 1.2, -1.2, 0, +0, -0,
      Infinity, -Infinity, NaN, Number.MAX_VALUE, Number.MIN_VALUE,
      undefined, {}, {k: 'v'}, new Object(), null, NaN, function(){}];

    arrays.forEach(function(val) {
      assertTrue('This is a string: ' + val, typeCheck.isArray(val));
    });
    notArrays.forEach(function(val) {
      assertFalse('This is not a string: ' + val, typeCheck.isArray(val));
    });
  });

  it('can check that arrays are not empty', function() {
    assert.ok(typeCheck.isNotEmptyArr([1]));
    assertFalse('This is false', typeCheck.isNotEmptyArr([]));
  });

  it('can check if arrays are empty', function() {
    assert.ok(typeCheck.isEmptyArr([]));
    assertFalse('This is false', typeCheck.isEmptyArr([1]));
  });

  it('can check that an array length is inside a range', function() {
    assert.ok(typeCheck.arrLengthBetween([], 0, 1));
    assert.ok(typeCheck.arrLengthBetween(['a'], 0, 1));
    assertFalse('This is false', typeCheck.arrLengthBetween(['a', 'b'], 0, 1));
  });

  it('can check if something is a string', function() {
    var validStrings = ['', '1', 'string'];
    var notStrings = [1, -1, 1.2, -1.2, 0, +0, -0, Infinity, -Infinity, NaN,
      Number.MAX_VALUE, Number.MIN_VALUE, undefined, [], ['a'], {}, {k: 'v'}
    ];
    validStrings.forEach(function(val) {
      assert.ok(typeCheck.isString(val), 'This is a string: ' + val);
    });
    notStrings.forEach(function(val) {
      assertFalse('This is not a string: ' + val, typeCheck.isString(val));
    });
  });

  it('can check if something is a number', function() {
    var validNumbers = [1, -1, 1.2, -1.2, 0, +0, -0, Infinity, -Infinity, NaN,
                        Number.MAX_VALUE, Number.MIN_VALUE];
    var notNumbers = ['1', '0', [1], {}, undefined, null, true, false];
    validNumbers.forEach(function(val) {
      assertTrue('This is a number: ' + val, typeCheck.isNumber(val));
    });
    notNumbers.forEach(function(val) {
      assertFalse('This is not a number: ' + val, typeCheck.isNumber(val));
    });
  });

  it('can check if something is a int', function() {
    var validInts = [1, 234, 0, +0, -0];
    var notInts = [-1, -2, 1.3, 0.1, '1', '0', [1], {}, undefined, null, true,
      false, NaN, -Infinity, Infinity, Number.MIN_VALUE, Number.MAX_VALUE];
    validInts.forEach(function(val) {
      assert.ok(typeCheck.isInt(val), 'This is an int: ' + val);
    });
    notInts.forEach(function(val) {
      assertFalse('This is not an int: ' + val, typeCheck.isInt(val));
    });
  });

  it('can check if something is a signed int', function() {
    var validSignedInts = [1, 234, 0, +0, -0, -1, -234];
    var notSignedInts = [-1.3, -0.1, 1.3, 0.1, '1', '0', [1], {}, undefined,
      null, true, false, NaN, -Infinity, Infinity, Number.MIN_VALUE,
      Number.MAX_VALUE];
    validSignedInts.forEach(function(val) {
      assert.ok(typeCheck.isSignedInt(val), 'This is a signed int: ' + val);
    });
    notSignedInts.forEach(function(val) {
      assertFalse('This is not a signed int: ' + val,
        typeCheck.isSignedInt(val));
    });
  });

  it('can check if something is an object', function() {
    var validObjects = [{}, {k: 'v'}, new Object(), new Date()];
    var notObjects = ['', '1', 'string', 1, -1, 1.2, -1.2, 0, +0, -0,
      Infinity, -Infinity, NaN, Number.MAX_VALUE, Number.MIN_VALUE,
      undefined, [], ['a']];
    validObjects.forEach(function(val) {
      assert.ok(typeCheck.isObject(val));
    });
    notObjects.forEach(function(val) {
      assertFalse('This is not an object:', typeCheck.isObject(val));
    });
  });

  it('can check if something is a date', function() {
    var validDates = [new Date()];
    var notDates = ['', '1', 'string', 1, -1, 1.2, -1.2, 0, +0, -0,
      Infinity, -Infinity, NaN, Number.MAX_VALUE, Number.MIN_VALUE,
      undefined, [], ['a'], {}, {k: 'v'}, new Object()];
    validDates.forEach(function(val) {
      assertTrue('This is a date: ' + val, typeCheck.isDate(val));
    });
    notDates.forEach(function(val) {
      assertFalse('This is not a date: ' + val, typeCheck.isDate(val));
    });
  });

  it('can check if something is NaN', function() {
    var validNaN = [NaN, 42 / 'General Zod', parseInt('Doomsday', 10)];
    var notNaN = ['', '1', 'string', 1, -1, 1.2, -1.2, 0, +0, -0,
      Infinity, -Infinity, Number.MAX_VALUE, Number.MIN_VALUE,
      undefined, [], ['a'], {}, {k: 'v'}, new Object(), new Date()];
    validNaN.forEach(function(val) {
      assertTrue('This is NaN: ' + val, typeCheck.isNaN(val));
    });
    notNaN.forEach(function(val) {
      assertFalse('This is not NaN: ' + val, typeCheck.isNaN(val));
    });
  });

});
