import isType, {TypeName} from '@marionebl/is';
import {inspect} from 'util';

export interface IMessageContext {
  actual: TypeName;
  expected: string;
  pass: boolean;
  received: any;
}

export interface IMatcherResult {
  pass: boolean;
  message(): string;
}

export type IIsMatcher = (received: any, expected: string) => IMatcherResult;

export type ICheck = (value: any) => boolean;

export interface IIsExtend extends jest.Expect {
  is: IIsMatcher;
}

export function is(received: any, expected: string) {
  const actual = isType(received);
  const pass = actual === expected;
  return {
    message: message({actual, expected, pass, received}),
    pass
  };
}

export const isUndefined = strictCheck('undefined', isType.undefined);
export const isNull = strictCheck('null', isType.null_);
export const isString = strictCheck('string', isType.string);
export const isNumber = strictCheck('number', isType.number);
export const isBoolean = strictCheck('boolean', isType.boolean);
export const isSymbol = strictCheck('symbol', isType.symbol);
export const isArray = strictCheck('Array', isType.array);
export const isFunction = strictCheck('Function', isType.function_);
export const isBuffer = strictCheck('Buffer', isType.buffer);
export const isObject = strictCheck('Object', isType.object);
export const isRegExp = strictCheck('RegExp', isType.regExp);
export const isDate = strictCheck('Date', isType.date);
export const isError = strictCheck('Error', isType.error);
export const isNativePromise = strictCheck('Promise', isType.nativePromise);
export const isMap = strictCheck('Map', isType.map);
export const isSet = strictCheck('Set', isType.set);
export const isWeakMap = strictCheck('WeakMap', isType.weakMap);
export const isWeakSet = strictCheck('WeakSet', isType.weakSet);
export const isInt8Array = strictCheck('Int8Array', isType.int8Array);
export const isUint8Array = strictCheck('Uint8Array', isType.uint8Array);
export const isUint8ClampedArray = strictCheck('Uint8ClampedArray', isType.uint8ClampedArray);
export const isInt16Array = strictCheck('Int16Array', isType.int16Array);
export const isUint16Array = strictCheck('Uint16Array', isType.uint16Array);
export const isInt32Array = strictCheck('Int32Array', isType.int32Array);
export const isUint32Array = strictCheck('Uint32Array', isType.uint32Array);
export const isfloat32Array = strictCheck('Float32Array', isType.float32Array);
export const isfloat64Array = strictCheck('Float64Array', isType.float64Array);
export const isArrayBuffer = strictCheck('ArrayBuffer', isType.arrayBuffer);
export const isSharedArrayBuffer = strictCheck('SharedArrayBuffer', isType.sharedArrayBuffer);

export const isPromise = surfaceCheck('promise-like', isType.promise);
export const isGenerator = surfaceCheck('a generator', isType.generator);
export const isAsyncFunction = surfaceCheck('an async function', isType.asyncFunction);
export const isTruthy = surfaceCheck('truthy', isType.truthy);
export const isFalsy = surfaceCheck('falsy', isType.falsy);
export const isNaN = surfaceCheck('NaN', isType.nan);
export const isNullOrUndefined = surfaceCheck('either null or undefined', isType.nullOrUndefined);
export const isPrimitive = surfaceCheck('a primitive value', isType.primitive);
export const isInteger = surfaceCheck('an integer', isType.integer);
export const isSafeInteger = surfaceCheck('a safe integer', isType.safeInteger);
export const isPlainObject = surfaceCheck('a plain object', isType.plainObject);
export const isIterable = surfaceCheck('an iterable', isType.iterable);
export const isClass = surfaceCheck('a class', isType.class_);
export const isTypedArray = surfaceCheck('a typed array', isType.typedArray);
export const isArrayLike = surfaceCheck('array-like', isType.arrayLike);

export const isDomElement = surfaceCheck('DOM Element', isType.domElement);
export const isInfinite = surfaceCheck('infinite', isType.infinite);
export const isEven = surfaceCheck('even', isType.even);
export const isOdd = surfaceCheck('odd', isType.odd);
export const isEmpty = surfaceCheck('empty', isType.empty);
export const isEmptyOrWhitespace = surfaceCheck('empty or whitespace', isType.emptyOrWhitespace);

// export const isInRange = surfaceCheck('in range', )
// export const isAny
// export const isAll

function surfaceCheck(description: string, check: ICheck): IIsMatcher {
  return (received: any) => {
    const actual = isType(received);
    const pass = check(received);
    return {
      message() {
        const expectation = `expected value ${inspect(received)} to be ${description}`;
        return pass ? expectation : `${expectation}, was of type ${actual}`;
      },
      pass
    };
  };
}

function strictCheck(expected: string, check: ICheck): IIsMatcher {
  return (received: any) => {
    const actual = isType(received);
    const pass = check(received);
    return {
      message: message({actual, expected, pass, received}),
      pass
    };
  };
};

function message(c: IMessageContext): () => string {
  const expectation = `expected value ${inspect(c.received)} to be of type ${c.expected}`;
  return () => c.pass ? expectation : `${expectation}, was of type ${c.actual}`;
}
