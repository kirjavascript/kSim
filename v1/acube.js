var workerSource = function() {
var that = this;

var Module = {
  'print': function report(str) {
    that.postMessage(str);
  }
};

// Note: For maximum-speed code, see "Optimizing Code" on the Emscripten wiki, https://github.com/kripken/emscripten/wiki/Optimizing-Code
// Note: Some Emscripten settings may limit the speed of the generated code.
try {
  this['Module'] = Module;
} catch(e) {
  this['Module'] = Module = {};
}
// The environment setup code below is customized to use Module.
// *** Environment setup code ***
var ENVIRONMENT_IS_NODE = typeof process === 'object' && typeof require === 'function';
var ENVIRONMENT_IS_WEB = typeof window === 'object';
var ENVIRONMENT_IS_WORKER = typeof importScripts === 'function';
var ENVIRONMENT_IS_SHELL = !ENVIRONMENT_IS_WEB && !ENVIRONMENT_IS_NODE && !ENVIRONMENT_IS_WORKER;
if (ENVIRONMENT_IS_NODE) {
  // Expose functionality in the same simple way that the shells work
  // Note that we pollute the global namespace here, otherwise we break in node
  Module['print'] = function(x) {
    process['stdout'].write(x + '\n');
  };
  Module['printErr'] = function(x) {
    process['stderr'].write(x + '\n');
  };
  var nodeFS = require('fs');
  var nodePath = require('path');
  Module['read'] = function(filename) {
    filename = nodePath['normalize'](filename);
    var ret = nodeFS['readFileSync'](filename).toString();
    // The path is absolute if the normalized version is the same as the resolved.
    if (!ret && filename != nodePath['resolve'](filename)) {
      filename = path.join(__dirname, '..', 'src', filename);
      ret = nodeFS['readFileSync'](filename).toString();
    }
    return ret;
  };
  Module['load'] = function(f) {
    globalEval(read(f));
  };
  if (!Module['arguments']) {
    Module['arguments'] = process['argv'].slice(2);
  }
}
if (ENVIRONMENT_IS_SHELL) {
  Module['print'] = print;
  if (typeof printErr != 'undefined') Module['printErr'] = printErr; // not present in v8 or older sm
  // Polyfill over SpiderMonkey/V8 differences
  if (typeof read != 'undefined') {
    Module['read'] = read;
  } else {
    Module['read'] = function(f) { snarf(f) };
  }
  if (!Module['arguments']) {
    if (typeof scriptArgs != 'undefined') {
      Module['arguments'] = scriptArgs;
    } else if (typeof arguments != 'undefined') {
      Module['arguments'] = arguments;
    }
  }
}
if (ENVIRONMENT_IS_WEB && !ENVIRONMENT_IS_WORKER) {
  if (!Module['print']) {
    Module['print'] = function(x) {
      console.log(x);
    };
  }
  if (!Module['printErr']) {
    Module['printErr'] = function(x) {
      console.log(x);
    };
  }
}
if (ENVIRONMENT_IS_WEB || ENVIRONMENT_IS_WORKER) {
  Module['read'] = function(url) {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', url, false);
    xhr.send(null);
    return xhr.responseText;
  };
  if (!Module['arguments']) {
    if (typeof arguments != 'undefined') {
      Module['arguments'] = arguments;
    }
  }
}
if (ENVIRONMENT_IS_WORKER) {
  // We can do very little here...
  var TRY_USE_DUMP = false;
  if (!Module['print']) {
    Module['print'] = (TRY_USE_DUMP && (typeof(dump) !== "undefined") ? (function(x) {
      dump(x);
    }) : (function(x) {
      // self.postMessage(x); // enable this if you want stdout to be sent as messages
    }));
  }
  Module['load'] = importScripts;
}
if (!ENVIRONMENT_IS_WORKER && !ENVIRONMENT_IS_WEB && !ENVIRONMENT_IS_NODE && !ENVIRONMENT_IS_SHELL) {
  // Unreachable because SHELL is dependant on the others
  throw 'Unknown runtime environment. Where are we?';
}
function globalEval(x) {
  eval.call(null, x);
}
if (!Module['load'] == 'undefined' && Module['read']) {
  Module['load'] = function(f) {
    globalEval(Module['read'](f));
  };
}
if (!Module['print']) {
  Module['print'] = function(){};
}
if (!Module['printErr']) {
  Module['printErr'] = Module['print'];
}
if (!Module['arguments']) {
  Module['arguments'] = [];
}
// *** Environment setup code ***
// Closure helpers
Module.print = Module['print'];
Module.printErr = Module['printErr'];
// Callbacks
if (!Module['preRun']) Module['preRun'] = [];
if (!Module['postRun']) Module['postRun'] = [];
// === Auto-generated preamble library stuff ===
//========================================
// Runtime code shared with compiler
//========================================
var Runtime = {
  stackSave: function () {
    return STACKTOP;
  },
  stackRestore: function (stackTop) {
    STACKTOP = stackTop;
  },
  forceAlign: function (target, quantum) {
    quantum = quantum || 4;
    if (quantum == 1) return target;
    if (isNumber(target) && isNumber(quantum)) {
      return Math.ceil(target/quantum)*quantum;
    } else if (isNumber(quantum) && isPowerOfTwo(quantum)) {
      var logg = log2(quantum);
      return '((((' +target + ')+' + (quantum-1) + ')>>' + logg + ')<<' + logg + ')';
    }
    return 'Math.ceil((' + target + ')/' + quantum + ')*' + quantum;
  },
  isNumberType: function (type) {
    return type in Runtime.INT_TYPES || type in Runtime.FLOAT_TYPES;
  },
  isPointerType: function isPointerType(type) {
  return type[type.length-1] == '*';
},
  isStructType: function isStructType(type) {
  if (isPointerType(type)) return false;
  if (/^\[\d+\ x\ (.*)\]/.test(type)) return true; // [15 x ?] blocks. Like structs
  if (/<?{ ?[^}]* ?}>?/.test(type)) return true; // { i32, i8 } etc. - anonymous struct types
  // See comment in isStructPointerType()
  return type[0] == '%';
},
  INT_TYPES: {"i1":0,"i8":0,"i16":0,"i32":0,"i64":0},
  FLOAT_TYPES: {"float":0,"double":0},
  or64: function (x, y) {
    var l = (x | 0) | (y | 0);
    var h = (Math.round(x / 4294967296) | Math.round(y / 4294967296)) * 4294967296;
    return l + h;
  },
  and64: function (x, y) {
    var l = (x | 0) & (y | 0);
    var h = (Math.round(x / 4294967296) & Math.round(y / 4294967296)) * 4294967296;
    return l + h;
  },
  xor64: function (x, y) {
    var l = (x | 0) ^ (y | 0);
    var h = (Math.round(x / 4294967296) ^ Math.round(y / 4294967296)) * 4294967296;
    return l + h;
  },
  getNativeTypeSize: function (type, quantumSize) {
    if (Runtime.QUANTUM_SIZE == 1) return 1;
    var size = {
      '%i1': 1,
      '%i8': 1,
      '%i16': 2,
      '%i32': 4,
      '%i64': 8,
      "%float": 4,
      "%double": 8
    }['%'+type]; // add '%' since float and double confuse Closure compiler as keys, and also spidermonkey as a compiler will remove 's from '_i8' etc
    if (!size) {
      if (type.charAt(type.length-1) == '*') {
        size = Runtime.QUANTUM_SIZE; // A pointer
      } else if (type[0] == 'i') {
        var bits = parseInt(type.substr(1));
        assert(bits % 8 == 0);
        size = bits/8;
      }
    }
    return size;
  },
  getNativeFieldSize: function (type) {
    return Math.max(Runtime.getNativeTypeSize(type), Runtime.QUANTUM_SIZE);
  },
  dedup: function dedup(items, ident) {
  var seen = {};
  if (ident) {
    return items.filter(function(item) {
      if (seen[item[ident]]) return false;
      seen[item[ident]] = true;
      return true;
    });
  } else {
    return items.filter(function(item) {
      if (seen[item]) return false;
      seen[item] = true;
      return true;
    });
  }
},
  set: function set() {
  var args = typeof arguments[0] === 'object' ? arguments[0] : arguments;
  var ret = {};
  for (var i = 0; i < args.length; i++) {
    ret[args[i]] = 0;
  }
  return ret;
},
  calculateStructAlignment: function calculateStructAlignment(type) {
    type.flatSize = 0;
    type.alignSize = 0;
    var diffs = [];
    var prev = -1;
    type.flatIndexes = type.fields.map(function(field) {
      var size, alignSize;
      if (Runtime.isNumberType(field) || Runtime.isPointerType(field)) {
        size = Runtime.getNativeTypeSize(field); // pack char; char; in structs, also char[X]s.
        alignSize = size;
      } else if (Runtime.isStructType(field)) {
        size = Types.types[field].flatSize;
        alignSize = Types.types[field].alignSize;
      } else if (field[0] == 'b') {
        // bN, large number field, like a [N x i8]
        size = field.substr(1)|0;
        alignSize = 1;
      } else {
        throw 'Unclear type in struct: ' + field + ', in ' + type.name_ + ' :: ' + dump(Types.types[type.name_]);
      }
      alignSize = type.packed ? 1 : Math.min(alignSize, Runtime.QUANTUM_SIZE);
      type.alignSize = Math.max(type.alignSize, alignSize);
      var curr = Runtime.alignMemory(type.flatSize, alignSize); // if necessary, place this on aligned memory
      type.flatSize = curr + size;
      if (prev >= 0) {
        diffs.push(curr-prev);
      }
      prev = curr;
      return curr;
    });
    type.flatSize = Runtime.alignMemory(type.flatSize, type.alignSize);
    if (diffs.length == 0) {
      type.flatFactor = type.flatSize;
    } else if (Runtime.dedup(diffs).length == 1) {
      type.flatFactor = diffs[0];
    }
    type.needsFlattening = (type.flatFactor != 1);
    return type.flatIndexes;
  },
  generateStructInfo: function (struct, typeName, offset) {
    var type, alignment;
    if (typeName) {
      offset = offset || 0;
      type = (typeof Types === 'undefined' ? Runtime.typeInfo : Types.types)[typeName];
      if (!type) return null;
      if (type.fields.length != struct.length) {
        printErr('Number of named fields must match the type for ' + typeName + ': possibly duplicate struct names. Cannot return structInfo');
        return null;
      }
      alignment = type.flatIndexes;
    } else {
      var type = { fields: struct.map(function(item) { return item[0] }) };
      alignment = Runtime.calculateStructAlignment(type);
    }
    var ret = {
      __size__: type.flatSize
    };
    if (typeName) {
      struct.forEach(function(item, i) {
        if (typeof item === 'string') {
          ret[item] = alignment[i] + offset;
        } else {
          // embedded struct
          var key;
          for (var k in item) key = k;
          ret[key] = Runtime.generateStructInfo(item[key], type.fields[i], alignment[i]);
        }
      });
    } else {
      struct.forEach(function(item, i) {
        ret[item[1]] = alignment[i];
      });
    }
    return ret;
  },
  dynCall: function (sig, ptr, args) {
    if (args && args.length) {
      if (!args.splice) args = Array.prototype.slice.call(args);
      args.splice(0, 0, ptr);
      return Module['dynCall_' + sig].apply(null, args);
    } else {
      return Module['dynCall_' + sig].call(null, ptr);
    }
  },
  addFunction: function (func, sig) {
    //assert(sig); // TODO: support asm
    var table = FUNCTION_TABLE; // TODO: support asm
    var ret = table.length;
    table.push(func);
    table.push(0);
    return ret;
  },
  removeFunction: function (index) {
    var table = FUNCTION_TABLE; // TODO: support asm
    table[index] = null;
  },
  warnOnce: function (text) {
    if (!Runtime.warnOnce.shown) Runtime.warnOnce.shown = {};
    if (!Runtime.warnOnce.shown[text]) {
      Runtime.warnOnce.shown[text] = 1;
      Module.printErr(text);
    }
  },
  funcWrappers: {},
  getFuncWrapper: function (func, sig) {
    assert(sig);
    if (!Runtime.funcWrappers[func]) {
      Runtime.funcWrappers[func] = function() {
        Runtime.dynCall(sig, func, arguments);
      };
    }
    return Runtime.funcWrappers[func];
  },
  UTF8Processor: function () {
    var buffer = [];
    var needed = 0;
    this.processCChar = function (code) {
      code = code & 0xff;
      if (needed) {
        buffer.push(code);
        needed--;
      }
      if (buffer.length == 0) {
        if (code < 128) return String.fromCharCode(code);
        buffer.push(code);
        if (code > 191 && code < 224) {
          needed = 1;
        } else {
          needed = 2;
        }
        return '';
      }
      if (needed > 0) return '';
      var c1 = buffer[0];
      var c2 = buffer[1];
      var c3 = buffer[2];
      var ret;
      if (c1 > 191 && c1 < 224) {
        ret = String.fromCharCode(((c1 & 31) << 6) | (c2 & 63));
      } else {
        ret = String.fromCharCode(((c1 & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63));
      }
      buffer.length = 0;
      return ret;
    }
    this.processJSString = function(string) {
      string = unescape(encodeURIComponent(string));
      var ret = [];
      for (var i = 0; i < string.length; i++) {
        ret.push(string.charCodeAt(i));
      }
      return ret;
    }
  },
  stackAlloc: function (size) { var ret = STACKTOP;STACKTOP = (STACKTOP + size)|0;STACKTOP = ((((STACKTOP)+3)>>2)<<2); return ret; },
  staticAlloc: function (size) { var ret = STATICTOP;STATICTOP = (STATICTOP + size)|0;STATICTOP = ((((STATICTOP)+3)>>2)<<2); if (STATICTOP >= TOTAL_MEMORY) enlargeMemory();; return ret; },
  alignMemory: function (size,quantum) { var ret = size = Math.ceil((size)/(quantum ? quantum : 4))*(quantum ? quantum : 4); return ret; },
  makeBigInt: function (low,high,unsigned) { var ret = (unsigned ? ((+(((low)>>>(0))))+((+(((high)>>>(0))))*(+(4294967296)))) : ((+(((low)>>>(0))))+((+(((high)|(0))))*(+(4294967296))))); return ret; },
  QUANTUM_SIZE: 4,
  __dummy__: 0
}
//========================================
// Runtime essentials
//========================================
var __THREW__ = 0; // Used in checking for thrown exceptions.
var setjmpId = 1; // Used in setjmp/longjmp
var setjmpLabels = {};
var ABORT = false;
var undef = 0;
// tempInt is used for 32-bit signed values or smaller. tempBigInt is used
// for 32-bit unsigned values or more than 32 bits. TODO: audit all uses of tempInt
var tempValue, tempInt, tempBigInt, tempInt2, tempBigInt2, tempPair, tempBigIntI, tempBigIntR, tempBigIntS, tempBigIntP, tempBigIntD;
var tempI64, tempI64b;
var tempRet0, tempRet1, tempRet2, tempRet3, tempRet4, tempRet5, tempRet6, tempRet7, tempRet8, tempRet9;
function abort(text) {
  Module.print(text + ':\n' + (new Error).stack);
  ABORT = true;
  throw "Assertion: " + text;
}
function assert(condition, text) {
  if (!condition) {
    abort('Assertion failed: ' + text);
  }
}
var globalScope = this;
// C calling interface. A convenient way to call C functions (in C files, or
// defined with extern "C").
//
// Note: LLVM optimizations can inline and remove functions, after which you will not be
//       able to call them. Closure can also do so. To avoid that, add your function to
//       the exports using something like
//
//         -s EXPORTED_FUNCTIONS='["_main", "_myfunc"]'
//
// @param ident      The name of the C function (note that C++ functions will be name-mangled - use extern "C")
// @param returnType The return type of the function, one of the JS types 'number', 'string' or 'array' (use 'number' for any C pointer, and
//                   'array' for JavaScript arrays and typed arrays).
// @param argTypes   An array of the types of arguments for the function (if there are no arguments, this can be ommitted). Types are as in returnType,
//                   except that 'array' is not possible (there is no way for us to know the length of the array)
// @param args       An array of the arguments to the function, as native JS values (as in returnType)
//                   Note that string arguments will be stored on the stack (the JS string will become a C string on the stack).
// @return           The return value, as a native JS value (as in returnType)
function ccall(ident, returnType, argTypes, args) {
  return ccallFunc(getCFunc(ident), returnType, argTypes, args);
}
Module["ccall"] = ccall;
// Returns the C function with a specified identifier (for C++, you need to do manual name mangling)
function getCFunc(ident) {
  try {
    var func = globalScope['Module']['_' + ident]; // closure exported function
    if (!func) func = eval('_' + ident); // explicit lookup
  } catch(e) {
  }
  assert(func, 'Cannot call unknown function ' + ident + ' (perhaps LLVM optimizations or closure removed it?)');
  return func;
}
// Internal function that does a C call using a function, not an identifier
function ccallFunc(func, returnType, argTypes, args) {
  var stack = 0;
  function toC(value, type) {
    if (type == 'string') {
      if (value === null || value === undefined || value === 0) return 0; // null string
      if (!stack) stack = Runtime.stackSave();
      var ret = Runtime.stackAlloc(value.length+1);
      writeStringToMemory(value, ret);
      return ret;
    } else if (type == 'array') {
      if (!stack) stack = Runtime.stackSave();
      var ret = Runtime.stackAlloc(value.length);
      writeArrayToMemory(value, ret);
      return ret;
    }
    return value;
  }
  function fromC(value, type) {
    if (type == 'string') {
      return Pointer_stringify(value);
    }
    assert(type != 'array');
    return value;
  }
  var i = 0;
  var cArgs = args ? args.map(function(arg) {
    return toC(arg, argTypes[i++]);
  }) : [];
  var ret = fromC(func.apply(null, cArgs), returnType);
  if (stack) Runtime.stackRestore(stack);
  return ret;
}
// Returns a native JS wrapper for a C function. This is similar to ccall, but
// returns a function you can call repeatedly in a normal way. For example:
//
//   var my_function = cwrap('my_c_function', 'number', ['number', 'number']);
//   alert(my_function(5, 22));
//   alert(my_function(99, 12));
//
function cwrap(ident, returnType, argTypes) {
  var func = getCFunc(ident);
  return function() {
    return ccallFunc(func, returnType, argTypes, Array.prototype.slice.call(arguments));
  }
}
Module["cwrap"] = cwrap;
// Sets a value in memory in a dynamic way at run-time. Uses the
// type data. This is the same as makeSetValue, except that
// makeSetValue is done at compile-time and generates the needed
// code then, whereas this function picks the right code at
// run-time.
// Note that setValue and getValue only do *aligned* writes and reads!
// Note that ccall uses JS types as for defining types, while setValue and
// getValue need LLVM types ('i8', 'i32') - this is a lower-level operation
function setValue(ptr, value, type, noSafe) {
  type = type || 'i8';
  if (type.charAt(type.length-1) === '*') type = 'i32'; // pointers are 32-bit
    switch(type) {
      case 'i1': HEAP8[(ptr)]=value; break;
      case 'i8': HEAP8[(ptr)]=value; break;
      case 'i16': HEAP16[((ptr)>>1)]=value; break;
      case 'i32': HEAP32[((ptr)>>2)]=value; break;
      case 'i64': (tempI64 = [value>>>0,Math.min(Math.floor((value)/(+(4294967296))), (+(4294967295)))>>>0],HEAP32[((ptr)>>2)]=tempI64[0],HEAP32[(((ptr)+(4))>>2)]=tempI64[1]); break;
      case 'float': HEAPF32[((ptr)>>2)]=value; break;
      case 'double': (HEAPF64[(tempDoublePtr)>>3]=value,HEAP32[((ptr)>>2)]=((HEAP32[((tempDoublePtr)>>2)])|0),HEAP32[(((ptr)+(4))>>2)]=((HEAP32[(((tempDoublePtr)+(4))>>2)])|0)); break;
      default: abort('invalid type for setValue: ' + type);
    }
}
Module['setValue'] = setValue;
// Parallel to setValue.
function getValue(ptr, type, noSafe) {
  type = type || 'i8';
  if (type.charAt(type.length-1) === '*') type = 'i32'; // pointers are 32-bit
    switch(type) {
      case 'i1': return HEAP8[(ptr)];
      case 'i8': return HEAP8[(ptr)];
      case 'i16': return HEAP16[((ptr)>>1)];
      case 'i32': return HEAP32[((ptr)>>2)];
      case 'i64': return HEAP32[((ptr)>>2)];
      case 'float': return HEAPF32[((ptr)>>2)];
      case 'double': return (HEAP32[((tempDoublePtr)>>2)]=HEAP32[((ptr)>>2)],HEAP32[(((tempDoublePtr)+(4))>>2)]=HEAP32[(((ptr)+(4))>>2)],(+(HEAPF64[(tempDoublePtr)>>3])));
      default: abort('invalid type for setValue: ' + type);
    }
  return null;
}
Module['getValue'] = getValue;
var ALLOC_NORMAL = 0; // Tries to use _malloc()
var ALLOC_STACK = 1; // Lives for the duration of the current function call
var ALLOC_STATIC = 2; // Cannot be freed
var ALLOC_NONE = 3; // Do not allocate
Module['ALLOC_NORMAL'] = ALLOC_NORMAL;
Module['ALLOC_STACK'] = ALLOC_STACK;
Module['ALLOC_STATIC'] = ALLOC_STATIC;
Module['ALLOC_NONE'] = ALLOC_NONE;
// allocate(): This is for internal use. You can use it yourself as well, but the interface
//             is a little tricky (see docs right below). The reason is that it is optimized
//             for multiple syntaxes to save space in generated code. So you should
//             normally not use allocate(), and instead allocate memory using _malloc(),
//             initialize it with setValue(), and so forth.
// @slab: An array of data, or a number. If a number, then the size of the block to allocate,
//        in *bytes* (note that this is sometimes confusing: the next parameter does not
//        affect this!)
// @types: Either an array of types, one for each byte (or 0 if no type at that position),
//         or a single type which is used for the entire block. This only matters if there
//         is initial data - if @slab is a number, then this does not matter at all and is
//         ignored.
// @allocator: How to allocate memory, see ALLOC_*
function allocate(slab, types, allocator, ptr) {
  var zeroinit, size;
  if (typeof slab === 'number') {
    zeroinit = true;
    size = slab;
  } else {
    zeroinit = false;
    size = slab.length;
  }
  var singleType = typeof types === 'string' ? types : null;
  var ret;
  if (allocator == ALLOC_NONE) {
    ret = ptr;
  } else {
    ret = [_malloc, Runtime.stackAlloc, Runtime.staticAlloc][allocator === undefined ? ALLOC_STATIC : allocator](Math.max(size, singleType ? 1 : types.length));
  }
  if (zeroinit) {
    var ptr = ret, stop;
    assert((ret & 3) == 0);
    stop = ret + (size & ~3);
    for (; ptr < stop; ptr += 4) {
      HEAP32[((ptr)>>2)]=0;
    }
    stop = ret + size;
    while (ptr < stop) {
      HEAP8[((ptr++)|0)]=0;
    }
    return ret;
  }
  if (singleType === 'i8') {
    HEAPU8.set(new Uint8Array(slab), ret);
    return ret;
  }
  var i = 0, type, typeSize, previousType;
  while (i < size) {
    var curr = slab[i];
    if (typeof curr === 'function') {
      curr = Runtime.getFunctionIndex(curr);
    }
    type = singleType || types[i];
    if (type === 0) {
      i++;
      continue;
    }
    if (type == 'i64') type = 'i32'; // special case: we have one i32 here, and one i32 later
    setValue(ret+i, curr, type);
    // no need to look up size unless type changes, so cache it
    if (previousType !== type) {
      typeSize = Runtime.getNativeTypeSize(type);
      previousType = type;
    }
    i += typeSize;
  }
  return ret;
}
Module['allocate'] = allocate;
function Pointer_stringify(ptr, /* optional */ length) {
  // Find the length, and check for UTF while doing so
  var hasUtf = false;
  var t;
  var i = 0;
  while (1) {
    t = HEAPU8[(((ptr)+(i))|0)];
    if (t >= 128) hasUtf = true;
    else if (t == 0 && !length) break;
    i++;
    if (length && i == length) break;
  }
  if (!length) length = i;
  var ret = '';
  if (!hasUtf) {
    var MAX_CHUNK = 1024; // split up into chunks, because .apply on a huge string can overflow the stack
    var curr;
    while (length > 0) {
      curr = String.fromCharCode.apply(String, HEAPU8.subarray(ptr, ptr + Math.min(length, MAX_CHUNK)));
      ret = ret ? ret + curr : curr;
      ptr += MAX_CHUNK;
      length -= MAX_CHUNK;
    }
    return ret;
  }
  var utf8 = new Runtime.UTF8Processor();
  for (i = 0; i < length; i++) {
    t = HEAPU8[(((ptr)+(i))|0)];
    ret += utf8.processCChar(t);
  }
  return ret;
}
Module['Pointer_stringify'] = Pointer_stringify;
// Memory management
var PAGE_SIZE = 4096;
function alignMemoryPage(x) {
  return ((x+4095)>>12)<<12;
}
var HEAP;
var HEAP8, HEAPU8, HEAP16, HEAPU16, HEAP32, HEAPU32, HEAPF32, HEAPF64;
var STACK_ROOT, STACKTOP, STACK_MAX;
var STATICTOP;
function enlargeMemory() {
  abort('Cannot enlarge memory arrays in asm.js. Either (1) compile with -s TOTAL_MEMORY=X with X higher than the current value, or (2) set Module.TOTAL_MEMORY before the program runs.');
}
var TOTAL_STACK = Module['TOTAL_STACK'] || 5242880;
var TOTAL_MEMORY = Module['TOTAL_MEMORY'] || 67108864;
var FAST_MEMORY = Module['FAST_MEMORY'] || 2097152;
// Initialize the runtime's memory
// check for full engine support (use string 'subarray' to avoid closure compiler confusion)
assert(!!Int32Array && !!Float64Array && !!(new Int32Array(1)['subarray']) && !!(new Int32Array(1)['set']),
       'Cannot fallback to non-typed array case: Code is too specialized');
var buffer = new ArrayBuffer(TOTAL_MEMORY);
HEAP8 = new Int8Array(buffer);
HEAP16 = new Int16Array(buffer);
HEAP32 = new Int32Array(buffer);
HEAPU8 = new Uint8Array(buffer);
HEAPU16 = new Uint16Array(buffer);
HEAPU32 = new Uint32Array(buffer);
HEAPF32 = new Float32Array(buffer);
HEAPF64 = new Float64Array(buffer);
// Endianness check (note: assumes compiler arch was little-endian)
HEAP32[0] = 255;
assert(HEAPU8[0] === 255 && HEAPU8[3] === 0, 'Typed arrays 2 must be run on a little-endian system');
Module['HEAP'] = HEAP;
Module['HEAP8'] = HEAP8;
Module['HEAP16'] = HEAP16;
Module['HEAP32'] = HEAP32;
Module['HEAPU8'] = HEAPU8;
Module['HEAPU16'] = HEAPU16;
Module['HEAPU32'] = HEAPU32;
Module['HEAPF32'] = HEAPF32;
Module['HEAPF64'] = HEAPF64;
STACK_ROOT = STACKTOP = Runtime.alignMemory(1);
STACK_MAX = TOTAL_STACK; // we lose a little stack here, but TOTAL_STACK is nice and round so use that as the max
var tempDoublePtr = Runtime.alignMemory(allocate(12, 'i8', ALLOC_STACK), 8);
assert(tempDoublePtr % 8 == 0);
function copyTempFloat(ptr) { // functions, because inlining this code increases code size too much
  HEAP8[tempDoublePtr] = HEAP8[ptr];
  HEAP8[tempDoublePtr+1] = HEAP8[ptr+1];
  HEAP8[tempDoublePtr+2] = HEAP8[ptr+2];
  HEAP8[tempDoublePtr+3] = HEAP8[ptr+3];
}
function copyTempDouble(ptr) {
  HEAP8[tempDoublePtr] = HEAP8[ptr];
  HEAP8[tempDoublePtr+1] = HEAP8[ptr+1];
  HEAP8[tempDoublePtr+2] = HEAP8[ptr+2];
  HEAP8[tempDoublePtr+3] = HEAP8[ptr+3];
  HEAP8[tempDoublePtr+4] = HEAP8[ptr+4];
  HEAP8[tempDoublePtr+5] = HEAP8[ptr+5];
  HEAP8[tempDoublePtr+6] = HEAP8[ptr+6];
  HEAP8[tempDoublePtr+7] = HEAP8[ptr+7];
}
STATICTOP = STACK_MAX;
assert(STATICTOP < TOTAL_MEMORY); // Stack must fit in TOTAL_MEMORY; allocations from here on may enlarge TOTAL_MEMORY

// Tools
// This processes a JS string into a C-line array of numbers, 0-terminated.
// For LLVM-originating strings, see parser.js:parseLLVMString function
function intArrayFromString(stringy, dontAddNull, length /* optional */) {
  var ret = (new Runtime.UTF8Processor()).processJSString(stringy);
  if (length) {
    ret.length = length;
  }
  if (!dontAddNull) {
    ret.push(0);
  }
  return ret;
}
var nullString = allocate(intArrayFromString('(null)'), 'i8', ALLOC_STACK);
function callRuntimeCallbacks(callbacks) {
  while(callbacks.length > 0) {
    var callback = callbacks.shift();
    var func = callback.func;
    if (typeof func === 'number') {
      if (callback.arg === undefined) {
        Runtime.dynCall('v', func);
      } else {
        Runtime.dynCall('vi', func, [callback.arg]);
      }
    } else {
      func(callback.arg === undefined ? null : callback.arg);
    }
  }
}
var __ATINIT__ = []; // functions called during startup
var __ATMAIN__ = []; // functions called when main() is to be run
var __ATEXIT__ = []; // functions called during shutdown
function initRuntime() {
  callRuntimeCallbacks(__ATINIT__);
}
function preMain() {
  callRuntimeCallbacks(__ATMAIN__);
}
function exitRuntime() {
  callRuntimeCallbacks(__ATEXIT__);
}
Module['intArrayFromString'] = intArrayFromString;
function intArrayToString(array) {
  var ret = [];
  for (var i = 0; i < array.length; i++) {
    var chr = array[i];
    if (chr > 0xFF) {
      chr &= 0xFF;
    }
    ret.push(String.fromCharCode(chr));
  }
  return ret.join('');
}
Module['intArrayToString'] = intArrayToString;
// Write a Javascript array to somewhere in the heap
function writeStringToMemory(string, buffer, dontAddNull) {
  var array = intArrayFromString(string, dontAddNull);
  var i = 0;
  while (i < array.length) {
    var chr = array[i];
    HEAP8[(((buffer)+(i))|0)]=chr
    i = i + 1;
  }
}
Module['writeStringToMemory'] = writeStringToMemory;
function writeArrayToMemory(array, buffer) {
  for (var i = 0; i < array.length; i++) {
    HEAP8[(((buffer)+(i))|0)]=array[i];
  }
}
Module['writeArrayToMemory'] = writeArrayToMemory;
function unSign(value, bits, ignore, sig) {
  if (value >= 0) {
    return value;
  }
  return bits <= 32 ? 2*Math.abs(1 << (bits-1)) + value // Need some trickery, since if bits == 32, we are right at the limit of the bits JS uses in bitshifts
                    : Math.pow(2, bits)         + value;
}
function reSign(value, bits, ignore, sig) {
  if (value <= 0) {
    return value;
  }
  var half = bits <= 32 ? Math.abs(1 << (bits-1)) // abs is needed if bits == 32
                        : Math.pow(2, bits-1);
  if (value >= half && (bits <= 32 || value > half)) { // for huge values, we can hit the precision limit and always get true here. so don't do that
                                                       // but, in general there is no perfect solution here. With 64-bit ints, we get rounding and errors
                                                       // TODO: In i64 mode 1, resign the two parts separately and safely
    value = -2*half + value; // Cannot bitshift half, as it may be at the limit of the bits JS uses in bitshifts
  }
  return value;
}
if (!Math.imul) Math.imul = function(a, b) {
  var ah  = a >>> 16;
  var al = a & 0xffff;
  var bh  = b >>> 16;
  var bl = b & 0xffff;
  return (al*bl + ((ah*bl + al*bh) << 16))|0;
};
// A counter of dependencies for calling run(). If we need to
// do asynchronous work before running, increment this and
// decrement it. Incrementing must happen in a place like
// PRE_RUN_ADDITIONS (used by emcc to add file preloading).
// Note that you can add dependencies in preRun, even though
// it happens right before run - run will be postponed until
// the dependencies are met.
var runDependencies = 0;
var runDependencyTracking = {};
var calledRun = false;
var runDependencyWatcher = null;
function addRunDependency(id) {
  runDependencies++;
  if (Module['monitorRunDependencies']) {
    Module['monitorRunDependencies'](runDependencies);
  }
  if (id) {
    assert(!runDependencyTracking[id]);
    runDependencyTracking[id] = 1;
    if (runDependencyWatcher === null && typeof setInterval !== 'undefined') {
      // Check for missing dependencies every few seconds
      runDependencyWatcher = setInterval(function() {
        var shown = false;
        for (var dep in runDependencyTracking) {
          if (!shown) {
            shown = true;
            Module.printErr('still waiting on run dependencies:');
          }
          Module.printErr('dependency: ' + dep);
        }
        if (shown) {
          Module.printErr('(end of list)');
        }
      }, 6000);
    }
  } else {
    Module.printErr('warning: run dependency added without ID');
  }
}
Module['addRunDependency'] = addRunDependency;
function removeRunDependency(id) {
  runDependencies--;
  if (Module['monitorRunDependencies']) {
    Module['monitorRunDependencies'](runDependencies);
  }
  if (id) {
    assert(runDependencyTracking[id]);
    delete runDependencyTracking[id];
  } else {
    Module.printErr('warning: run dependency removed without ID');
  }
  if (runDependencies == 0) {
    if (runDependencyWatcher !== null) {
      clearInterval(runDependencyWatcher);
      runDependencyWatcher = null;
    } 
    // If run has never been called, and we should call run (INVOKE_RUN is true, and Module.noInitialRun is not false)
    if (!calledRun && shouldRunNow) run();
  }
}
Module['removeRunDependency'] = removeRunDependency;
Module["preloadedImages"] = {}; // maps url to image data
Module["preloadedAudios"] = {}; // maps url to audio data
// === Body ===
assert(STATICTOP == STACK_MAX); assert(STACK_MAX == TOTAL_STACK);
STATICTOP += 7144;
assert(STATICTOP < TOTAL_MEMORY);
var _stdout;
var _stderr;
var __ZTVN10__cxxabiv120__si_class_type_infoE;
var __ZTISt9exception;
var _stdout = _stdout=allocate(4, "i8", ALLOC_STATIC);
var _stderr = _stderr=allocate(4, "i8", ALLOC_STATIC);
allocate(24, "i8", ALLOC_NONE, 5242880);
allocate([82,85,0] /* RU\00 */, "i8", ALLOC_NONE, 5242904);
allocate([70,85,0] /* FU\00 */, "i8", ALLOC_NONE, 5242908);
allocate([66,76,0] /* BL\00 */, "i8", ALLOC_NONE, 5242912);
allocate([66,82,0] /* BR\00 */, "i8", ALLOC_NONE, 5242916);
allocate([70,76,0] /* FL\00 */, "i8", ALLOC_NONE, 5242920);
allocate([70,82,0] /* FR\00 */, "i8", ALLOC_NONE, 5242924);
allocate([68,76,0] /* DL\00 */, "i8", ALLOC_NONE, 5242928);
allocate([78,0] /* N\00 */, "i8", ALLOC_NONE, 5242932);
allocate([32,45,32,108,111,99,97,116,105,111,110,115,32,111,102,32,115,108,105,99,101,32,101,100,103,101,115,46,46,46,10,32,32,32,45,32,117,112,46,46,46,32,32,32,32,0] /*  - locations of slic */, "i8", ALLOC_NONE, 5242936);
allocate([68,66,0] /* DB\00 */, "i8", ALLOC_NONE, 5242984);
allocate([40,37,105,113,42,44,32,37,105,102,44,32,37,105,115,41,10,0] /* (%iq_, %if, %is)\0A\ */, "i8", ALLOC_NONE, 5242988);
allocate([10,32,45,32,99,111,114,110,101,114,32,112,101,114,109,117,116,97,116,105,111,110,115,32,40,112,104,97,115,101,32,49,41,58,32,110,111,110,101,10,0] /* \0A - corner permuta */, "i8", ALLOC_NONE, 5243008);
allocate([68,82,0] /* DR\00 */, "i8", ALLOC_NONE, 5243052);
allocate([68,70,0] /* DF\00 */, "i8", ALLOC_NONE, 5243056);
allocate([83,108,105,99,101,45,116,117,114,110,115,32,79,70,70,46,10,0] /* Slice-turns OFF.\0A\ */, "i8", ALLOC_NONE, 5243060);
allocate([85,76,0] /* UL\00 */, "i8", ALLOC_NONE, 5243080);
allocate([85,66,0] /* UB\00 */, "i8", ALLOC_NONE, 5243084);
allocate([85,82,0] /* UR\00 */, "i8", ALLOC_NONE, 5243088);
allocate([85,70,0] /* UF\00 */, "i8", ALLOC_NONE, 5243092);
allocate([82,66,68,0] /* RBD\00 */, "i8", ALLOC_NONE, 5243096);
allocate([66,76,68,0] /* BLD\00 */, "i8", ALLOC_NONE, 5243100);
allocate([76,70,68,0] /* LFD\00 */, "i8", ALLOC_NONE, 5243104);
allocate([107,0] /* k\00 */, "i8", ALLOC_NONE, 5243108);
allocate([70,82,68,0] /* FRD\00 */, "i8", ALLOC_NONE, 5243112);
allocate([32,45,32,112,101,114,109,117,116,97,116,105,111,110,115,32,111,102,32,109,105,100,100,108,101,32,101,100,103,101,115,46,46,46,0] /*  - permutations of m */, "i8", ALLOC_NONE, 5243116);
allocate([46,32,0] /* . \00 */, "i8", ALLOC_NONE, 5243152);
allocate([10,32,45,32,109,105,100,100,108,101,32,101,100,103,101,32,45,32,117,112,100,111,119,110,32,101,100,103,101,32,112,101,114,109,117,116,97,116,105,111,110,115,32,40,112,104,97,115,101,32,50,41,58,32,110,111,110,101,10,0] /* \0A - middle edge -  */, "i8", ALLOC_NONE, 5243156);
allocate([70,76,85,0] /* FLU\00 */, "i8", ALLOC_NONE, 5243216);
allocate([76,66,85,0] /* LBU\00 */, "i8", ALLOC_NONE, 5243220);
allocate([83,108,105,99,101,45,116,117,114,110,115,32,79,78,46,10,0] /* Slice-turns ON.\0A\0 */, "i8", ALLOC_NONE, 5243224);
allocate([66,82,85,0] /* BRU\00 */, "i8", ALLOC_NONE, 5243244);
allocate([82,70,85,0] /* RFU\00 */, "i8", ALLOC_NONE, 5243248);
allocate([66,68,82,0] /* BDR\00 */, "i8", ALLOC_NONE, 5243252);
allocate([76,68,66,0] /* LDB\00 */, "i8", ALLOC_NONE, 5243256);
allocate([70,68,76,0] /* FDL\00 */, "i8", ALLOC_NONE, 5243260);
allocate([82,68,70,0] /* RDF\00 */, "i8", ALLOC_NONE, 5243264);
allocate([76,85,70,0] /* LUF\00 */, "i8", ALLOC_NONE, 5243268);
allocate([75,0] /* K\00 */, "i8", ALLOC_NONE, 5243272);
allocate([66,85,76,0] /* BUL\00 */, "i8", ALLOC_NONE, 5243276);
allocate([32,45,32,112,101,114,109,117,116,97,116,105,111,110,115,32,111,102,32,117,112,32,97,110,100,32,100,111,119,110,32,101,100,103,101,115,46,46,46,0] /*  - permutations of u */, "i8", ALLOC_NONE, 5243280);
allocate([37,115,32,0] /* %s \00 */, "i8", ALLOC_NONE, 5243320);
allocate([10,32,45,32,109,105,100,100,108,101,32,101,100,103,101,32,112,101,114,109,117,116,97,116,105,111,110,115,32,45,32,99,111,114,110,101,114,32,112,101,114,109,117,116,97,116,105,111,110,115,32,40,112,104,97,115,101,32,50,41,58,32,110,111,110,101,10,0] /* \0A - middle edge pe */, "i8", ALLOC_NONE, 5243324);
allocate([82,85,66,0] /* RUB\00 */, "i8", ALLOC_NONE, 5243392);
allocate([70,85,82,0] /* FUR\00 */, "i8", ALLOC_NONE, 5243396);
allocate([83,108,105,99,101,45,116,117,114,110,32,109,101,116,114,105,99,115,32,79,78,46,10,0] /* Slice-turn metrics O */, "i8", ALLOC_NONE, 5243400);
allocate([68,82,66,0] /* DRB\00 */, "i8", ALLOC_NONE, 5243424);
allocate([68,66,76,0] /* DBL\00 */, "i8", ALLOC_NONE, 5243428);
allocate([68,76,70,0] /* DLF\00 */, "i8", ALLOC_NONE, 5243432);
allocate([68,70,82,0] /* DFR\00 */, "i8", ALLOC_NONE, 5243436);
allocate([85,70,76,0] /* UFL\00 */, "i8", ALLOC_NONE, 5243440);
allocate([85,76,66,0] /* ULB\00 */, "i8", ALLOC_NONE, 5243444);
allocate([85,66,82,0] /* UBR\00 */, "i8", ALLOC_NONE, 5243448);
allocate([113,0] /* q\00 */, "i8", ALLOC_NONE, 5243452);
allocate([85,82,70,0] /* URF\00 */, "i8", ALLOC_NONE, 5243456);
allocate([32,45,32,112,101,114,109,117,116,97,116,105,111,110,115,32,111,102,32,99,111,114,110,101,114,115,46,46,46,0] /*  - permutations of c */, "i8", ALLOC_NONE, 5243460);
allocate([10,32,45,32,101,100,103,101,32,102,108,105,112,115,32,40,112,104,97,115,101,32,49,41,58,32,110,111,110,101,10,0] /* \0A - edge flips (ph */, "i8", ALLOC_NONE, 5243492);
allocate([82,68,66,0] /* RDB\00 */, "i8", ALLOC_NONE, 5243524);
allocate([66,68,76,0] /* BDL\00 */, "i8", ALLOC_NONE, 5243528);
allocate([70,97,99,101,45,116,117,114,110,32,109,101,116,114,105,99,115,32,79,78,46,10,0] /* Face-turn metrics ON */, "i8", ALLOC_NONE, 5243532);
allocate([76,68,70,0] /* LDF\00 */, "i8", ALLOC_NONE, 5243556);
allocate([70,68,82,0] /* FDR\00 */, "i8", ALLOC_NONE, 5243560);
allocate([70,85,76,0] /* FUL\00 */, "i8", ALLOC_NONE, 5243564);
allocate([76,85,66,0] /* LUB\00 */, "i8", ALLOC_NONE, 5243568);
allocate([66,85,82,0] /* BUR\00 */, "i8", ALLOC_NONE, 5243572);
allocate([82,85,70,0] /* RUF\00 */, "i8", ALLOC_NONE, 5243576);
allocate([66,82,68,0] /* BRD\00 */, "i8", ALLOC_NONE, 5243580);
allocate([81,0] /* Q\00 */, "i8", ALLOC_NONE, 5243584);
allocate([76,66,68,0] /* LBD\00 */, "i8", ALLOC_NONE, 5243588);
allocate([32,45,32,108,111,99,97,116,105,111,110,115,32,111,102,32,109,105,100,100,108,101,32,101,100,103,101,115,46,46,46,0] /*  - locations of midd */, "i8", ALLOC_NONE, 5243592);
allocate([32,40,37,108,117,37,37,32,115,97,118,101,32,105,110,32,112,104,97,115,101,32,50,46,46,46,32,37,108,117,32,111,102,32,37,108,117,32,101,110,116,114,105,101,115,41,10,0] /*  (%lu%% save in phas */, "i8", ALLOC_NONE, 5243624);
allocate([10,32,45,32,99,111,114,110,101,114,32,116,119,105,115,116,115,32,45,32,101,100,103,101,32,102,108,105,112,115,32,40,112,104,97,115,101,32,49,41,58,32,110,111,110,101,10,0] /* \0A - corner twists  */, "i8", ALLOC_NONE, 5243672);
allocate([70,76,68,0] /* FLD\00 */, "i8", ALLOC_NONE, 5243720);
allocate([82,70,68,0] /* RFD\00 */, "i8", ALLOC_NONE, 5243724);
allocate([81,117,97,114,116,101,114,45,116,117,114,110,32,109,101,116,114,105,99,115,32,79,78,46,10,0] /* Quarter-turn metrics */, "i8", ALLOC_NONE, 5243728);
allocate([10,42,42,42,32,98,114,101,97,107,32,42,42,42,10,0] /* \0A___ break ___\0A\ */, "i8", ALLOC_NONE, 5243756);
allocate([76,70,85,0] /* LFU\00 */, "i8", ALLOC_NONE, 5243772);
allocate([77,39,0] /* M'\00 */, "i8", ALLOC_NONE, 5243776);
allocate([66,76,85,0] /* BLU\00 */, "i8", ALLOC_NONE, 5243780);
allocate([77,0] /* M\00 */, "i8", ALLOC_NONE, 5243784);
allocate([82,66,85,0] /* RBU\00 */, "i8", ALLOC_NONE, 5243788);
allocate([83,0] /* S\00 */, "i8", ALLOC_NONE, 5243792);
allocate([70,82,85,0] /* FRU\00 */, "i8", ALLOC_NONE, 5243796);
allocate([83,39,0] /* S'\00 */, "i8", ALLOC_NONE, 5243800);
allocate([68,66,82,0] /* DBR\00 */, "i8", ALLOC_NONE, 5243804);
allocate([82,39,32,76,0] /* R' L\00 */, "i8", ALLOC_NONE, 5243808);
allocate([68,76,66,0] /* DLB\00 */, "i8", ALLOC_NONE, 5243816);
allocate([82,32,76,39,0] /* R L'\00 */, "i8", ALLOC_NONE, 5243820);
allocate([68,70,76,0] /* DFL\00 */, "i8", ALLOC_NONE, 5243828);
allocate([70,39,32,66,0] /* F' B\00 */, "i8", ALLOC_NONE, 5243832);
allocate([68,82,70,0] /* DRF\00 */, "i8", ALLOC_NONE, 5243840);
allocate([32,45,32,102,108,105,112,115,32,111,102,32,101,100,103,101,115,46,46,46,0] /*  - flips of edges... */, "i8", ALLOC_NONE, 5243844);
allocate([32,40,37,108,117,37,37,32,115,97,118,101,32,105,110,32,112,104,97,115,101,32,49,46,46,46,32,37,108,117,32,111,102,32,37,108,117,32,101,110,116,114,105,101,115,41,10,0] /*  (%lu%% save in phas */, "i8", ALLOC_NONE, 5243868);
allocate([70,32,66,39,0] /* F B'\00 */, "i8", ALLOC_NONE, 5243916);
allocate([10,32,45,32,101,100,103,101,32,102,108,105,112,115,32,45,32,109,105,100,100,108,101,32,101,100,103,101,32,108,111,99,97,116,105,111,110,115,32,40,112,104,97,115,101,32,49,41,58,32,110,111,110,101,10,0] /* \0A - edge flips - m */, "i8", ALLOC_NONE, 5243924);
allocate([85,76,70,0] /* ULF\00 */, "i8", ALLOC_NONE, 5243980);
allocate([82,39,0] /* R'\00 */, "i8", ALLOC_NONE, 5243984);
allocate([85,66,76,0] /* UBL\00 */, "i8", ALLOC_NONE, 5243988);
allocate([79,112,116,105,109,97,108,32,115,101,97,114,99,104,32,79,70,70,46,10,0] /* Optimal search OFF.\ */, "i8", ALLOC_NONE, 5243992);
allocate([82,0] /* R\00 */, "i8", ALLOC_NONE, 5244016);
allocate([85,82,66,0] /* URB\00 */, "i8", ALLOC_NONE, 5244020);
allocate([66,39,0] /* B'\00 */, "i8", ALLOC_NONE, 5244024);
allocate([85,70,82,0] /* UFR\00 */, "i8", ALLOC_NONE, 5244028);
allocate([66,0] /* B\00 */, "i8", ALLOC_NONE, 5244032);
allocate([37,105,0] /* %i\00 */, "i8", ALLOC_NONE, 5244036);
allocate([76,39,0] /* L'\00 */, "i8", ALLOC_NONE, 5244040);
allocate([37,108,117,37,108,117,37,104,117,37,108,117,37,104,117,37,104,117,37,104,117,37,104,117,37,104,117,0] /* %lu%lu%hu%lu%hu%hu%h */, "i8", ALLOC_NONE, 5244044);
allocate([76,0] /* L\00 */, "i8", ALLOC_NONE, 5244072);
allocate([69,110,116,101,114,32,116,104,101,32,107,101,121,32,40,109,97,107,101,32,115,117,114,101,32,116,104,101,32,105,110,112,117,116,32,105,115,32,99,111,114,114,101,99,116,41,58,10,0] /* Enter the key (make  */, "i8", ALLOC_NONE, 5244076);
allocate([70,39,0] /* F'\00 */, "i8", ALLOC_NONE, 5244128);
allocate([70,0] /* F\00 */, "i8", ALLOC_NONE, 5244132);
allocate([99,111,117,110,116,101,114,45,0] /* counter-\00 */, "i8", ALLOC_NONE, 5244136);
allocate([115,116,100,58,58,98,97,100,95,97,108,108,111,99,0] /* std::bad_alloc\00 */, "i8", ALLOC_NONE, 5244148);
allocate([69,39,0] /* E'\00 */, "i8", ALLOC_NONE, 5244164);
allocate([84,119,105,115,116,32,97,110,121,32,99,111,114,110,101,114,32,99,117,98,105,101,32,37,115,99,108,111,99,107,119,105,115,101,33,10,0] /* Twist any corner cub */, "i8", ALLOC_NONE, 5244168);
allocate([32,37,105,32,105,116,101,109,115,32,112,101,114,32,109,111,118,101,46,10,0] /*  %i items per move.\ */, "i8", ALLOC_NONE, 5244208);
allocate([32,0] /*  \00 */, "i8", ALLOC_NONE, 5244232);
allocate([68,111,110,101,46,32,40,37,108,117,32,101,110,116,114,105,101,115,32,116,111,32,112,104,97,115,101,32,50,32,40,37,108,117,32,116,114,105,101,115,41,41,10,0] /* Done. (%lu entries t */, "i8", ALLOC_NONE, 5244236);
allocate([69,50,0] /* E2\00 */, "i8", ALLOC_NONE, 5244280);
allocate([115,109,97,108,108,0] /* small\00 */, "i8", ALLOC_NONE, 5244284);
allocate([70,108,105,112,32,97,110,121,32,101,100,103,101,32,99,117,98,105,101,33,10,0] /* Flip any edge cubie! */, "i8", ALLOC_NONE, 5244292);
allocate([69,0] /* E\00 */, "i8", ALLOC_NONE, 5244316);
allocate([83,119,97,112,32,97,110,121,32,116,119,111,32,101,100,103,101,32,99,117,98,105,101,115,32,111,114,32,97,110,121,32,116,119,111,32,99,111,114,110,101,114,32,99,117,98,105,101,115,33,10,0] /* Swap any two edge cu */, "i8", ALLOC_NONE, 5244320);
allocate([79,112,116,105,109,97,108,32,115,101,97,114,99,104,32,79,78,46,10,0] /* Optimal search ON.\0 */, "i8", ALLOC_NONE, 5244372);
allocate([77,50,0] /* M2\00 */, "i8", ALLOC_NONE, 5244392);
allocate([83,112,101,99,105,102,121,32,112,111,115,105,116,105,111,110,32,111,102,32,108,97,115,116,32,101,100,103,101,32,99,117,98,105,101,33,10,0] /* Specify position of  */, "i8", ALLOC_NONE, 5244396);
allocate([83,50,0] /* S2\00 */, "i8", ALLOC_NONE, 5244436);
allocate([83,112,101,99,105,102,121,32,112,111,115,105,116,105,111,110,32,111,102,32,108,97,115,116,32,99,111,114,110,101,114,32,99,117,98,105,101,33,10,0] /* Specify position of  */, "i8", ALLOC_NONE, 5244440);
allocate([85,39,32,68,0] /* U' D\00 */, "i8", ALLOC_NONE, 5244480);
allocate([66,97,100,32,99,117,98,105,101,115,46,10,0] /* Bad cubies.\0A\00 */, "i8", ALLOC_NONE, 5244488);
allocate([85,50,32,68,50,0] /* U2 D2\00 */, "i8", ALLOC_NONE, 5244504);
allocate([66,97,100,32,99,111,114,110,101,114,32,102,111,114,109,97,116,46,32,40,77,97,105,108,32,109,101,32,116,104,101,32,105,110,112,117,116,32,112,108,101,97,115,101,46,41,10,0] /* Bad corner format. ( */, "i8", ALLOC_NONE, 5244512);
allocate([85,32,68,39,0] /* U D'\00 */, "i8", ALLOC_NONE, 5244560);
allocate([73,109,112,114,111,112,101,114,32,99,111,114,110,101,114,32,99,117,98,105,101,58,32,37,115,10,0] /* Improper corner cubi */, "i8", ALLOC_NONE, 5244568);
allocate([82,50,32,76,50,0] /* R2 L2\00 */, "i8", ALLOC_NONE, 5244596);
allocate([10,32,45,32,109,105,100,100,108,101,32,101,100,103,101,32,45,32,117,112,100,111,119,110,32,101,100,103,101,32,112,101,114,109,117,116,97,116,105,111,110,115,32,40,112,104,97,115,101,32,50,44,32,37,105,32,120,32,37,105,41,58,10,0] /* \0A - middle edge -  */, "i8", ALLOC_NONE, 5244604);
allocate([43,63,0] /* +?\00 */, "i8", ALLOC_NONE, 5244668);
allocate([70,50,32,66,50,0] /* F2 B2\00 */, "i8", ALLOC_NONE, 5244672);
allocate([10,32,45,32,109,105,100,100,108,101,32,101,100,103,101,32,112,101,114,109,117,116,97,116,105,111,110,115,32,45,32,99,111,114,110,101,114,32,112,101,114,109,117,116,97,116,105,111,110,115,32,40,112,104,97,115,101,32,50,44,32,37,105,32,120,32,37,105,32,103,111,97,108,47,115,41,58,10,0] /* \0A - middle edge pe */, "i8", ALLOC_NONE, 5244680);
allocate([43,33,0] /* +!\00 */, "i8", ALLOC_NONE, 5244760);
allocate([68,39,0] /* D'\00 */, "i8", ALLOC_NONE, 5244764);
allocate([10,32,45,32,109,105,100,100,108,101,32,115,108,105,99,101,32,101,100,103,101,32,112,111,115,105,116,105,111,110,115,32,40,112,104,97,115,101,32,49,44,32,37,105,32,103,111,97,108,47,115,41,58,10,0] /* \0A - middle slice e */, "i8", ALLOC_NONE, 5244768);
allocate([66,97,100,32,101,100,103,101,32,102,111,114,109,97,116,46,32,40,77,97,105,108,32,109,101,32,116,104,101,32,105,110,112,117,116,32,112,108,101,97,115,101,46,41,10,0] /* Bad edge format. (Ma */, "i8", ALLOC_NONE, 5244824);
allocate([32,45,32,116,119,105,115,116,115,32,111,102,32,99,111,114,110,101,114,115,46,46,46,0] /*  - twists of corners */, "i8", ALLOC_NONE, 5244872);
allocate([89,111,117,32,99,97,110,32,117,115,101,32,97,108,115,111,58,10,32,39,33,39,40,111,114,46,41,32,39,43,33,39,40,99,119,46,41,32,39,45,33,39,40,99,45,99,119,46,41,32,39,64,33,39,40,117,110,111,114,46,41,32,45,32,111,110,32,114,105,103,104,116,32,112,111,115,46,10,32,39,63,39,32,39,43,63,39,32,39,45,63,39,32,39,64,63,39,32,45,32,117,110,107,110,111,119,110,32,99,117,98,105,101,32,111,110,32,112,111,115,46,10,32,39,33,33,39,32,39,64,33,33,39,32,39,94,32,39,64,94,32,45,32,114,101,112,101,97,116,32,116,111,32,116,104,101,32,101,110,100,32,111,102,32,99,111,114,110,101,114,115,47,101,100,103,101,115,10,32,39,85,70,39,40,61,39,45,70,85,39,41,32,39,70,85,39,40,61,39,45,85,70,39,41,32,39,64,85,70,39,40,61,39,64,70,85,39,41,10,32,39,85,70,82,39,40,61,39,85,82,70,39,41,32,39,70,82,85,39,32,39,82,85,70,39,32,39,64,85,70,82,39,32,39,45,85,70,82,39,32,39,43,85,70,82,39,32,46,46,46,10,0] /* You can use also:\0A */, "i8", ALLOC_NONE, 5244896);
allocate([32,40,37,108,117,37,37,32,115,97,118,101,46,46,46,32,37,108,117,32,111,102,32,37,108,117,32,101,110,116,114,105,101,115,41,10,0] /*  (%lu%% save... %lu  */, "i8", ALLOC_NONE, 5245168);
allocate([68,50,0] /* D2\00 */, "i8", ALLOC_NONE, 5245208);
allocate([10,32,45,32,100,111,119,110,115,108,105,99,101,32,101,100,103,101,32,112,111,115,105,116,105,111,110,115,32,45,32,109,105,100,100,108,101,32,101,100,103,101,32,108,111,99,97,116,105,111,110,115,32,40,112,104,97,115,101,32,49,44,32,37,105,32,120,32,37,105,32,103,111,97,108,47,115,41,58,10,0] /* \0A - downslice edge */, "i8", ALLOC_NONE, 5245212);
allocate([98,105,103,0] /* big\00 */, "i8", ALLOC_NONE, 5245296);
allocate([73,109,112,114,111,112,101,114,32,101,100,103,101,32,99,117,98,105,101,58,32,37,115,10,0] /* Improper edge cubie: */, "i8", ALLOC_NONE, 5245300);
allocate([32,37,105,32,105,116,101,109,115,46,10,32,32,32,45,32,100,111,119,110,46,46,46,0] /*  %i items.\0A   - do */, "i8", ALLOC_NONE, 5245328);
allocate([68,0] /* D\00 */, "i8", ALLOC_NONE, 5245352);
allocate([10,32,45,32,117,112,115,108,105,99,101,32,101,100,103,101,32,112,111,115,105,116,105,111,110,115,32,45,32,109,105,100,100,108,101,32,101,100,103,101,32,108,111,99,97,116,105,111,110,115,32,40,112,104,97,115,101,32,49,44,32,37,105,32,120,32,37,105,32,103,111,97,108,47,115,41,58,10,0] /* \0A - upslice edge p */, "i8", ALLOC_NONE, 5245356);
allocate([45,63,0] /* -?\00 */, "i8", ALLOC_NONE, 5245436);
allocate([65,108,108,32,115,101,97,114,99,104,32,79,70,70,46,10,0] /* All search OFF.\0A\0 */, "i8", ALLOC_NONE, 5245440);
allocate([32,45,32,115,108,105,99,101,32,101,100,103,101,115,39,32,99,104,97,114,97,99,116,101,114,115,32,102,111,114,32,112,104,97,115,101,32,50,46,46,46,10,32,32,32,45,32,117,112,46,46,46,32,32,0] /*  - slice edges' char */, "i8", ALLOC_NONE, 5245460);
allocate([82,50,0] /* R2\00 */, "i8", ALLOC_NONE, 5245516);
allocate([10,32,45,32,99,111,114,110,101,114,32,112,101,114,109,117,116,97,116,105,111,110,115,32,40,112,104,97,115,101,32,49,44,32,37,105,32,103,111,97,108,47,115,41,58,10,0] /* \0A - corner permuta */, "i8", ALLOC_NONE, 5245520);
allocate([10,66,117,105,108,100,105,110,103,32,116,114,97,110,115,102,111,114,109,97,116,105,111,110,32,116,97,98,108,101,115,46,46,46,10,0] /* \0ABuilding transfor */, "i8", ALLOC_NONE, 5245568);
allocate([45,33,0] /* -!\00 */, "i8", ALLOC_NONE, 5245604);
allocate([32,37,105,32,105,116,101,109,115,46,10,0] /*  %i items.\0A\00 */, "i8", ALLOC_NONE, 5245608);
allocate([66,50,0] /* B2\00 */, "i8", ALLOC_NONE, 5245620);
allocate([10,32,45,32,101,100,103,101,32,102,108,105,112,115,32,45,32,109,105,100,100,108,101,32,101,100,103,101,32,108,111,99,97,116,105,111,110,115,32,40,112,104,97,115,101,32,49,44,32,37,105,32,120,32,37,105,32,103,111,97,108,47,115,41,58,10,0] /* \0A - edge flips - m */, "i8", ALLOC_NONE, 5245624);
allocate([64,63,0] /* @?\00 */, "i8", ALLOC_NONE, 5245692);
allocate([32,37,105,32,105,116,101,109,115,46,10,32,32,32,45,32,109,105,100,100,108,101,46,46,46,0] /*  %i items.\0A   - mi */, "i8", ALLOC_NONE, 5245696);
allocate([85,39,0] /* U'\00 */, "i8", ALLOC_NONE, 5245724);
allocate([10,32,45,32,99,111,114,110,101,114,32,116,119,105,115,116,115,32,45,32,109,105,100,100,108,101,32,101,100,103,101,32,108,111,99,97,116,105,111,110,115,32,40,112,104,97,115,101,32,49,44,32,37,105,32,120,32,37,105,32,103,111,97,108,47,115,41,58,10,0] /* \0A - corner twists  */, "i8", ALLOC_NONE, 5245728);
allocate([64,63,63,0] /* @??\00 */, "i8", ALLOC_NONE, 5245800);
allocate([63,0] /* ?\00 */, "i8", ALLOC_NONE, 5245804);
allocate(1, "i8", ALLOC_NONE, 5245808);
allocate([32,37,105,32,105,116,101,109,115,46,10,32,32,32,45,32,100,111,119,110,46,46,46,32,32,0] /*  %i items.\0A   - do */, "i8", ALLOC_NONE, 5245812);
allocate([85,50,0] /* U2\00 */, "i8", ALLOC_NONE, 5245840);
allocate([10,32,45,32,101,100,103,101,32,102,108,105,112,115,32,40,112,104,97,115,101,32,49,44,32,37,105,32,103,111,97,108,47,115,41,58,10,0] /* \0A - edge flips (ph */, "i8", ALLOC_NONE, 5245844);
allocate([10,69,110,116,101,114,32,99,117,98,101,32,40,116,104,105,115,32,105,115,32,116,104,101,32,115,111,108,118,101,100,32,111,110,101,41,32,111,114,32,81,40,113,117,105,116,41,44,32,78,40,110,101,119,41,44,32,75,40,107,101,121,41,58,10,0] /* \0AEnter cube (this  */, "i8", ALLOC_NONE, 5245884);
allocate([32,45,32,115,108,105,99,101,32,101,100,103,101,115,39,32,116,114,97,110,115,102,111,114,109,97,116,105,111,110,115,46,46,46,10,32,32,32,45,32,117,112,46,46,46,32,32,32,32,0] /*  - slice edges' tran */, "i8", ALLOC_NONE, 5245952);
allocate([85,0] /* U\00 */, "i8", ALLOC_NONE, 5246004);
allocate([32,32,32,37,50,105,32,37,56,105,32,37,49,48,117,10,0] /*    %2i %8i %10u\0A\0 */, "i8", ALLOC_NONE, 5246008);
allocate([63,63,0] /* ??\00 */, "i8", ALLOC_NONE, 5246028);
allocate([64,33,0] /* @!\00 */, "i8", ALLOC_NONE, 5246032);
allocate([32,37,105,32,120,32,37,105,32,105,116,101,109,115,46,10,0] /*  %i x %i items.\0A\0 */, "i8", ALLOC_NONE, 5246036);
allocate([76,50,0] /* L2\00 */, "i8", ALLOC_NONE, 5246056);
allocate([10,32,45,32,99,111,114,110,101,114,32,116,119,105,115,116,115,32,45,32,101,100,103,101,32,102,108,105,112,115,32,40,112,104,97,115,101,32,49,44,32,37,105,32,120,32,37,105,32,103,111,97,108,47,115,41,58,10,0] /* \0A - corner twists  */, "i8", ALLOC_NONE, 5246060);
allocate([99,111,109,112,117,116,105,110,103,32,100,101,112,116,104,32,37,105,46,46,46,10,0] /* computing depth %i.. */, "i8", ALLOC_NONE, 5246120);
allocate([64,33,33,0] /* @!!\00 */, "i8", ALLOC_NONE, 5246144);
allocate([70,50,0] /* F2\00 */, "i8", ALLOC_NONE, 5246148);
allocate([80,114,117,110,105,110,103,32,116,97,98,108,101,115,32,100,111,110,101,46,10,0] /* Pruning tables done. */, "i8", ALLOC_NONE, 5246152);
allocate([73,110,105,116,105,97,108,105,122,101,100,46,0] /* Initialized.\00 */, "i8", ALLOC_NONE, 5246176);
allocate([33,0] /* !\00 */, "i8", ALLOC_NONE, 5246192);
allocate([32,45,32,117,112,32,97,110,100,32,100,111,119,110,32,101,100,103,101,115,39,32,116,114,97,110,115,102,111,114,109,97,116,105,111,110,115,46,46,0] /*  - up and down edges */, "i8", ALLOC_NONE, 5246196);
allocate([40,37,105,113,44,32,37,105,102,44,32,37,105,115,41,10,0] /* (%iq, %if, %is)\0A\0 */, "i8", ALLOC_NONE, 5246236);
allocate([10,32,45,32,109,105,100,100,108,101,32,115,108,105,99,101,32,101,100,103,101,32,112,111,115,105,116,105,111,110,115,32,40,112,104,97,115,101,32,49,41,58,32,110,111,110,101,10,0] /* \0A - middle slice e */, "i8", ALLOC_NONE, 5246256);
allocate([85,70,32,85,82,32,85,66,32,85,76,32,68,70,32,68,82,32,68,66,32,68,76,32,70,82,32,70,76,32,66,82,32,66,76,32,85,70,82,32,85,82,66,32,85,66,76,32,85,76,70,32,68,82,70,32,68,70,76,32,68,76,66,32,68,66,82,0] /* UF UR UB UL DF DR DB */, "i8", ALLOC_NONE, 5246308);
allocate([84,114,97,110,115,102,111,114,109,97,116,105,111,110,32,116,97,98,108,101,115,32,100,111,110,101,46,10,0] /* Transformation table */, "i8", ALLOC_NONE, 5246376);
allocate([85,70,32,85,82,32,85,66,32,85,76,32,68,70,32,68,82,32,68,66,32,68,76,32,70,82,32,70,76,32,66,82,32,66,76,32,32,85,70,82,32,85,82,66,32,85,66,76,32,85,76,70,32,68,82,70,32,68,70,76,32,68,76,66,32,68,66,82,10,0] /* UF UR UB UL DF DR DB */, "i8", ALLOC_NONE, 5246408);
allocate([68,111,110,101,46,32,40,37,108,117,32,115,111,108,117,116,105,111,110,115,32,102,111,117,110,100,41,10,0] /* Done. (%lu solutions */, "i8", ALLOC_NONE, 5246480);
allocate([33,33,0] /* !!\00 */, "i8", ALLOC_NONE, 5246512);
allocate([32,37,105,32,105,116,101,109,115,32,112,101,114,32,109,111,118,101,46,10,32,32,32,45,32,109,105,100,100,108,101,46,46,46,0] /*  %i items per move.\ */, "i8", ALLOC_NONE, 5246516);
allocate([40,37,105,113,44,32,37,105,102,44,32,37,105,115,42,41,10,0] /* (%iq, %if, %is_)\0A\ */, "i8", ALLOC_NONE, 5246552);
allocate([10,32,45,32,100,111,119,110,115,108,105,99,101,32,101,100,103,101,32,112,111,115,105,116,105,111,110,115,32,45,32,109,105,100,100,108,101,32,101,100,103,101,32,108,111,99,97,116,105,111,110,115,32,40,112,104,97,115,101,32,49,41,58,32,110,111,110,101,10,0] /* \0A - downslice edge */, "i8", ALLOC_NONE, 5246572);
allocate([32,45,32,101,100,103,101,32,102,108,105,112,115,32,110,117,109,98,101,114,58,32,37,115,44,32,99,111,114,110,101,114,32,116,119,105,115,116,115,32,110,117,109,98,101,114,58,32,37,115,10,0] /*  - edge flips number */, "i8", ALLOC_NONE, 5246644);
allocate([10,66,117,105,108,100,105,110,103,32,112,114,117,110,105,110,103,32,116,97,98,108,101,115,46,46,46,10,0] /* \0ABuilding pruning  */, "i8", ALLOC_NONE, 5246696);
allocate([76,66,0] /* LB\00 */, "i8", ALLOC_NONE, 5246728);
allocate([82,66,0] /* RB\00 */, "i8", ALLOC_NONE, 5246732);
allocate([76,70,0] /* LF\00 */, "i8", ALLOC_NONE, 5246736);
allocate([82,70,0] /* RF\00 */, "i8", ALLOC_NONE, 5246740);
allocate([76,68,0] /* LD\00 */, "i8", ALLOC_NONE, 5246744);
allocate([66,68,0] /* BD\00 */, "i8", ALLOC_NONE, 5246748);
allocate([82,68,0] /* RD\00 */, "i8", ALLOC_NONE, 5246752);
allocate([110,0] /* n\00 */, "i8", ALLOC_NONE, 5246756);
allocate([32,37,105,32,105,116,101,109,115,32,112,101,114,32,109,111,118,101,46,10,32,32,32,45,32,100,111,119,110,46,46,46,32,32,0] /*  %i items per move.\ */, "i8", ALLOC_NONE, 5246760);
allocate([70,68,0] /* FD\00 */, "i8", ALLOC_NONE, 5246796);
allocate([40,37,105,113,44,32,37,105,102,42,44,32,37,105,115,41,10,0] /* (%iq, %if_, %is)\0A\ */, "i8", ALLOC_NONE, 5246800);
allocate([10,32,45,32,117,112,115,108,105,99,101,32,101,100,103,101,32,112,111,115,105,116,105,111,110,115,32,45,32,109,105,100,100,108,101,32,101,100,103,101,32,108,111,99,97,116,105,111,110,115,32,40,112,104,97,115,101,32,49,41,58,32,110,111,110,101,10,0] /* \0A - upslice edge p */, "i8", ALLOC_NONE, 5246820);
allocate([76,85,0] /* LU\00 */, "i8", ALLOC_NONE, 5246888);
allocate([66,85,0] /* BU\00 */, "i8", ALLOC_NONE, 5246892);
allocate([73,110,118,97,108,105,100,32,111,112,116,105,111,110,32,39,37,99,39,46,10,0] /* Invalid option '%c'. */, "i8", ALLOC_NONE, 5246896);
allocate([65,108,108,32,115,101,97,114,99,104,32,79,78,46,10,0] /* All search ON.\0A\00 */, "i8", ALLOC_NONE, 5246920);
allocate([111,112,116,105,111,110,115,58,10,32,113,32,45,32,113,117,97,114,116,101,114,45,116,117,114,110,32,109,101,116,114,105,99,115,10,32,102,32,45,32,102,97,99,101,45,116,117,114,110,32,109,101,116,114,105,99,115,32,40,100,101,102,97,117,108,116,41,10,32,115,32,45,32,115,108,105,99,101,45,116,117,114,110,32,109,101,116,114,105,99,115,10,32,99,32,45,32,115,108,105,99,101,45,116,117,114,110,115,32,97,108,108,111,119,101,100,10,32,97,32,45,32,115,101,97,114,99,104,32,102,111,114,32,97,108,108,32,115,101,113,117,101,110,99,101,115,10,32,111,32,45,32,115,101,97,114,99,104,32,111,110,108,121,32,102,111,114,32,111,112,116,105,109,97,108,32,115,101,113,117,101,110,99,101,115,10,0] /* options:\0A q - quar */, "i8", ALLOC_NONE, 5246936);
allocate(472, "i8", ALLOC_NONE, 5247124);
allocate(24, "i8", ALLOC_NONE, 5247596);
allocate(216, "i8", ALLOC_NONE, 5247620);
allocate(24, "i8", ALLOC_NONE, 5247836);
allocate(24, "i8", ALLOC_NONE, 5247860);
allocate(27, "i8", ALLOC_NONE, 5247884);
allocate(27, "i8", ALLOC_NONE, 5247912);
allocate(27, "i8", ALLOC_NONE, 5247940);
allocate(9, "i8", ALLOC_NONE, 5247968);
allocate([0,0,0,0,20,20,80,0,0,0,0,0,0,0,0,0,0,0,0,0], "i8", ALLOC_NONE, 5247980);
allocate(1, "i8", ALLOC_NONE, 5248000);
var __ZTVN10__cxxabiv120__si_class_type_infoE = __ZTVN10__cxxabiv120__si_class_type_infoE=allocate(4, "i8", ALLOC_STATIC);
allocate(1, "i8", ALLOC_STATIC);
allocate([83,116,57,98,97,100,95,97,108,108,111,99,0] /* St9bad_alloc\00 */, "i8", ALLOC_NONE, 5248004);
var __ZTISt9exception = __ZTISt9exception=allocate(4, "i8", ALLOC_STATIC);
allocate(12, "i8", ALLOC_NONE, 5248020);
allocate(4, "i8", ALLOC_NONE, 5248032);
allocate(648, "i8", ALLOC_NONE, 5248036);
allocate(648, "i8", ALLOC_NONE, 5248684);
allocate(15, "i8", ALLOC_NONE, 5249332);
allocate(27, "i8", ALLOC_NONE, 5249348);
allocate(60, "i8", ALLOC_NONE, 5249376);
allocate(108, "i8", ALLOC_NONE, 5249436);
allocate(96, "i8", ALLOC_NONE, 5249544);
allocate(192, "i8", ALLOC_NONE, 5249640);
allocate(60, "i8", ALLOC_NONE, 5249832);
allocate(108, "i8", ALLOC_NONE, 5249892);
allocate(16, "i8", ALLOC_NONE, 5250000);
allocate(4, "i8", ALLOC_NONE, 5250016);
allocate(4, "i8", ALLOC_NONE, 5250020);
HEAP32[((5247988)>>2)]=(4);
HEAP32[((5247992)>>2)]=(2);
HEAP32[((5247996)>>2)]=(8);
HEAP32[((5248020)>>2)]=(((__ZTVN10__cxxabiv120__si_class_type_infoE+8)|0));
HEAP32[((5248024)>>2)]=((5248004)|0);
HEAP32[((5248028)>>2)]=__ZTISt9exception;
HEAP32[((5249376)>>2)]=((5246148)|0);
HEAP32[((5249380)>>2)]=((5246056)|0);
HEAP32[((5249384)>>2)]=((5246004)|0);
HEAP32[((5249388)>>2)]=((5245840)|0);
HEAP32[((5249392)>>2)]=((5245724)|0);
HEAP32[((5249396)>>2)]=((5245620)|0);
HEAP32[((5249400)>>2)]=((5245516)|0);
HEAP32[((5249404)>>2)]=((5245352)|0);
HEAP32[((5249408)>>2)]=((5245208)|0);
HEAP32[((5249412)>>2)]=((5244764)|0);
HEAP32[((5249416)>>2)]=((5244436)|0);
HEAP32[((5249420)>>2)]=((5244392)|0);
HEAP32[((5249424)>>2)]=((5244316)|0);
HEAP32[((5249428)>>2)]=((5244280)|0);
HEAP32[((5249432)>>2)]=((5244164)|0);
HEAP32[((5249436)>>2)]=((5244132)|0);
HEAP32[((5249440)>>2)]=((5246148)|0);
HEAP32[((5249444)>>2)]=((5244128)|0);
HEAP32[((5249448)>>2)]=((5244072)|0);
HEAP32[((5249452)>>2)]=((5246056)|0);
HEAP32[((5249456)>>2)]=((5244040)|0);
HEAP32[((5249460)>>2)]=((5246004)|0);
HEAP32[((5249464)>>2)]=((5245840)|0);
HEAP32[((5249468)>>2)]=((5245724)|0);
HEAP32[((5249472)>>2)]=((5244032)|0);
HEAP32[((5249476)>>2)]=((5245620)|0);
HEAP32[((5249480)>>2)]=((5244024)|0);
HEAP32[((5249484)>>2)]=((5244016)|0);
HEAP32[((5249488)>>2)]=((5245516)|0);
HEAP32[((5249492)>>2)]=((5243984)|0);
HEAP32[((5249496)>>2)]=((5245352)|0);
HEAP32[((5249500)>>2)]=((5245208)|0);
HEAP32[((5249504)>>2)]=((5244764)|0);
HEAP32[((5249508)>>2)]=((5243800)|0);
HEAP32[((5249512)>>2)]=((5244436)|0);
HEAP32[((5249516)>>2)]=((5243792)|0);
HEAP32[((5249520)>>2)]=((5243784)|0);
HEAP32[((5249524)>>2)]=((5244392)|0);
HEAP32[((5249528)>>2)]=((5243776)|0);
HEAP32[((5249532)>>2)]=((5244316)|0);
HEAP32[((5249536)>>2)]=((5244280)|0);
HEAP32[((5249540)>>2)]=((5244164)|0);
HEAP32[((5249544)>>2)]=((5243092)|0);
HEAP32[((5249548)>>2)]=((5243088)|0);
HEAP32[((5249552)>>2)]=((5243084)|0);
HEAP32[((5249556)>>2)]=((5243080)|0);
HEAP32[((5249560)>>2)]=((5243056)|0);
HEAP32[((5249564)>>2)]=((5243052)|0);
HEAP32[((5249568)>>2)]=((5242984)|0);
HEAP32[((5249572)>>2)]=((5242928)|0);
HEAP32[((5249576)>>2)]=((5242924)|0);
HEAP32[((5249580)>>2)]=((5242920)|0);
HEAP32[((5249584)>>2)]=((5242916)|0);
HEAP32[((5249588)>>2)]=((5242912)|0);
HEAP32[((5249592)>>2)]=((5242908)|0);
HEAP32[((5249596)>>2)]=((5242904)|0);
HEAP32[((5249600)>>2)]=((5246892)|0);
HEAP32[((5249604)>>2)]=((5246888)|0);
HEAP32[((5249608)>>2)]=((5246796)|0);
HEAP32[((5249612)>>2)]=((5246752)|0);
HEAP32[((5249616)>>2)]=((5246748)|0);
HEAP32[((5249620)>>2)]=((5246744)|0);
HEAP32[((5249624)>>2)]=((5246740)|0);
HEAP32[((5249628)>>2)]=((5246736)|0);
HEAP32[((5249632)>>2)]=((5246732)|0);
HEAP32[((5249636)>>2)]=((5246728)|0);
HEAP32[((5249640)>>2)]=((5244028)|0);
HEAP32[((5249644)>>2)]=((5244020)|0);
HEAP32[((5249648)>>2)]=((5243988)|0);
HEAP32[((5249652)>>2)]=((5243980)|0);
HEAP32[((5249656)>>2)]=((5243840)|0);
HEAP32[((5249660)>>2)]=((5243828)|0);
HEAP32[((5249664)>>2)]=((5243816)|0);
HEAP32[((5249668)>>2)]=((5243804)|0);
HEAP32[((5249672)>>2)]=((5243796)|0);
HEAP32[((5249676)>>2)]=((5243788)|0);
HEAP32[((5249680)>>2)]=((5243780)|0);
HEAP32[((5249684)>>2)]=((5243772)|0);
HEAP32[((5249688)>>2)]=((5243724)|0);
HEAP32[((5249692)>>2)]=((5243720)|0);
HEAP32[((5249696)>>2)]=((5243588)|0);
HEAP32[((5249700)>>2)]=((5243580)|0);
HEAP32[((5249704)>>2)]=((5243576)|0);
HEAP32[((5249708)>>2)]=((5243572)|0);
HEAP32[((5249712)>>2)]=((5243568)|0);
HEAP32[((5249716)>>2)]=((5243564)|0);
HEAP32[((5249720)>>2)]=((5243560)|0);
HEAP32[((5249724)>>2)]=((5243556)|0);
HEAP32[((5249728)>>2)]=((5243528)|0);
HEAP32[((5249732)>>2)]=((5243524)|0);
HEAP32[((5249736)>>2)]=((5243456)|0);
HEAP32[((5249740)>>2)]=((5243448)|0);
HEAP32[((5249744)>>2)]=((5243444)|0);
HEAP32[((5249748)>>2)]=((5243440)|0);
HEAP32[((5249752)>>2)]=((5243436)|0);
HEAP32[((5249756)>>2)]=((5243432)|0);
HEAP32[((5249760)>>2)]=((5243428)|0);
HEAP32[((5249764)>>2)]=((5243424)|0);
HEAP32[((5249768)>>2)]=((5243396)|0);
HEAP32[((5249772)>>2)]=((5243392)|0);
HEAP32[((5249776)>>2)]=((5243276)|0);
HEAP32[((5249780)>>2)]=((5243268)|0);
HEAP32[((5249784)>>2)]=((5243264)|0);
HEAP32[((5249788)>>2)]=((5243260)|0);
HEAP32[((5249792)>>2)]=((5243256)|0);
HEAP32[((5249796)>>2)]=((5243252)|0);
HEAP32[((5249800)>>2)]=((5243248)|0);
HEAP32[((5249804)>>2)]=((5243244)|0);
HEAP32[((5249808)>>2)]=((5243220)|0);
HEAP32[((5249812)>>2)]=((5243216)|0);
HEAP32[((5249816)>>2)]=((5243112)|0);
HEAP32[((5249820)>>2)]=((5243104)|0);
HEAP32[((5249824)>>2)]=((5243100)|0);
HEAP32[((5249828)>>2)]=((5243096)|0);
HEAP32[((5249832)>>2)]=((5246148)|0);
HEAP32[((5249836)>>2)]=((5246056)|0);
HEAP32[((5249840)>>2)]=((5246004)|0);
HEAP32[((5249844)>>2)]=((5245840)|0);
HEAP32[((5249848)>>2)]=((5245724)|0);
HEAP32[((5249852)>>2)]=((5245620)|0);
HEAP32[((5249856)>>2)]=((5245516)|0);
HEAP32[((5249860)>>2)]=((5245352)|0);
HEAP32[((5249864)>>2)]=((5245208)|0);
HEAP32[((5249868)>>2)]=((5244764)|0);
HEAP32[((5249872)>>2)]=((5244672)|0);
HEAP32[((5249876)>>2)]=((5244596)|0);
HEAP32[((5249880)>>2)]=((5244560)|0);
HEAP32[((5249884)>>2)]=((5244504)|0);
HEAP32[((5249888)>>2)]=((5244480)|0);
HEAP32[((5249892)>>2)]=((5244132)|0);
HEAP32[((5249896)>>2)]=((5246148)|0);
HEAP32[((5249900)>>2)]=((5244128)|0);
HEAP32[((5249904)>>2)]=((5244072)|0);
HEAP32[((5249908)>>2)]=((5246056)|0);
HEAP32[((5249912)>>2)]=((5244040)|0);
HEAP32[((5249916)>>2)]=((5246004)|0);
HEAP32[((5249920)>>2)]=((5245840)|0);
HEAP32[((5249924)>>2)]=((5245724)|0);
HEAP32[((5249928)>>2)]=((5244032)|0);
HEAP32[((5249932)>>2)]=((5245620)|0);
HEAP32[((5249936)>>2)]=((5244024)|0);
HEAP32[((5249940)>>2)]=((5244016)|0);
HEAP32[((5249944)>>2)]=((5245516)|0);
HEAP32[((5249948)>>2)]=((5243984)|0);
HEAP32[((5249952)>>2)]=((5245352)|0);
HEAP32[((5249956)>>2)]=((5245208)|0);
HEAP32[((5249960)>>2)]=((5244764)|0);
HEAP32[((5249964)>>2)]=((5243916)|0);
HEAP32[((5249968)>>2)]=((5244672)|0);
HEAP32[((5249972)>>2)]=((5243832)|0);
HEAP32[((5249976)>>2)]=((5243820)|0);
HEAP32[((5249980)>>2)]=((5244596)|0);
HEAP32[((5249984)>>2)]=((5243808)|0);
HEAP32[((5249988)>>2)]=((5244560)|0);
HEAP32[((5249992)>>2)]=((5244504)|0);
HEAP32[((5249996)>>2)]=((5244480)|0);
  var ERRNO_CODES={E2BIG:7,EACCES:13,EADDRINUSE:98,EADDRNOTAVAIL:99,EAFNOSUPPORT:97,EAGAIN:11,EALREADY:114,EBADF:9,EBADMSG:74,EBUSY:16,ECANCELED:125,ECHILD:10,ECONNABORTED:103,ECONNREFUSED:111,ECONNRESET:104,EDEADLK:35,EDESTADDRREQ:89,EDOM:33,EDQUOT:122,EEXIST:17,EFAULT:14,EFBIG:27,EHOSTUNREACH:113,EIDRM:43,EILSEQ:84,EINPROGRESS:115,EINTR:4,EINVAL:22,EIO:5,EISCONN:106,EISDIR:21,ELOOP:40,EMFILE:24,EMLINK:31,EMSGSIZE:90,EMULTIHOP:72,ENAMETOOLONG:36,ENETDOWN:100,ENETRESET:102,ENETUNREACH:101,ENFILE:23,ENOBUFS:105,ENODATA:61,ENODEV:19,ENOENT:2,ENOEXEC:8,ENOLCK:37,ENOLINK:67,ENOMEM:12,ENOMSG:42,ENOPROTOOPT:92,ENOSPC:28,ENOSR:63,ENOSTR:60,ENOSYS:38,ENOTCONN:107,ENOTDIR:20,ENOTEMPTY:39,ENOTRECOVERABLE:131,ENOTSOCK:88,ENOTSUP:95,ENOTTY:25,ENXIO:6,EOVERFLOW:75,EOWNERDEAD:130,EPERM:1,EPIPE:32,EPROTO:71,EPROTONOSUPPORT:93,EPROTOTYPE:91,ERANGE:34,EROFS:30,ESPIPE:29,ESRCH:3,ESTALE:116,ETIME:62,ETIMEDOUT:110,ETXTBSY:26,EWOULDBLOCK:11,EXDEV:18};
  function ___setErrNo(value) {
      // For convenient setting and returning of errno.
      if (!___setErrNo.ret) ___setErrNo.ret = allocate([0], 'i32', ALLOC_STATIC);
      HEAP32[((___setErrNo.ret)>>2)]=value
      return value;
    }
  var _stdin=allocate(1, "i32*", ALLOC_STACK);
  var _stdout=allocate(1, "i32*", ALLOC_STACK);
  var _stderr=allocate(1, "i32*", ALLOC_STACK);
  var __impure_ptr=allocate(1, "i32*", ALLOC_STACK);var FS={currentPath:"/",nextInode:2,streams:[null],ignorePermissions:true,joinPath:function (parts, forceRelative) {
        var ret = parts[0];
        for (var i = 1; i < parts.length; i++) {
          if (ret[ret.length-1] != '/') ret += '/';
          ret += parts[i];
        }
        if (forceRelative && ret[0] == '/') ret = ret.substr(1);
        return ret;
      },absolutePath:function (relative, base) {
        if (typeof relative !== 'string') return null;
        if (base === undefined) base = FS.currentPath;
        if (relative && relative[0] == '/') base = '';
        var full = base + '/' + relative;
        var parts = full.split('/').reverse();
        var absolute = [''];
        while (parts.length) {
          var part = parts.pop();
          if (part == '' || part == '.') {
            // Nothing.
          } else if (part == '..') {
            if (absolute.length > 1) absolute.pop();
          } else {
            absolute.push(part);
          }
        }
        return absolute.length == 1 ? '/' : absolute.join('/');
      },analyzePath:function (path, dontResolveLastLink, linksVisited) {
        var ret = {
          isRoot: false,
          exists: false,
          error: 0,
          name: null,
          path: null,
          object: null,
          parentExists: false,
          parentPath: null,
          parentObject: null
        };
        path = FS.absolutePath(path);
        if (path == '/') {
          ret.isRoot = true;
          ret.exists = ret.parentExists = true;
          ret.name = '/';
          ret.path = ret.parentPath = '/';
          ret.object = ret.parentObject = FS.root;
        } else if (path !== null) {
          linksVisited = linksVisited || 0;
          path = path.slice(1).split('/');
          var current = FS.root;
          var traversed = [''];
          while (path.length) {
            if (path.length == 1 && current.isFolder) {
              ret.parentExists = true;
              ret.parentPath = traversed.length == 1 ? '/' : traversed.join('/');
              ret.parentObject = current;
              ret.name = path[0];
            }
            var target = path.shift();
            if (!current.isFolder) {
              ret.error = ERRNO_CODES.ENOTDIR;
              break;
            } else if (!current.read) {
              ret.error = ERRNO_CODES.EACCES;
              break;
            } else if (!current.contents.hasOwnProperty(target)) {
              ret.error = ERRNO_CODES.ENOENT;
              break;
            }
            current = current.contents[target];
            if (current.link && !(dontResolveLastLink && path.length == 0)) {
              if (linksVisited > 40) { // Usual Linux SYMLOOP_MAX.
                ret.error = ERRNO_CODES.ELOOP;
                break;
              }
              var link = FS.absolutePath(current.link, traversed.join('/'));
              ret = FS.analyzePath([link].concat(path).join('/'),
                                   dontResolveLastLink, linksVisited + 1);
              return ret;
            }
            traversed.push(target);
            if (path.length == 0) {
              ret.exists = true;
              ret.path = traversed.join('/');
              ret.object = current;
            }
          }
        }
        return ret;
      },findObject:function (path, dontResolveLastLink) {
        FS.ensureRoot();
        var ret = FS.analyzePath(path, dontResolveLastLink);
        if (ret.exists) {
          return ret.object;
        } else {
          ___setErrNo(ret.error);
          return null;
        }
      },createObject:function (parent, name, properties, canRead, canWrite) {
        if (!parent) parent = '/';
        if (typeof parent === 'string') parent = FS.findObject(parent);
        if (!parent) {
          ___setErrNo(ERRNO_CODES.EACCES);
          throw new Error('Parent path must exist.');
        }
        if (!parent.isFolder) {
          ___setErrNo(ERRNO_CODES.ENOTDIR);
          throw new Error('Parent must be a folder.');
        }
        if (!parent.write && !FS.ignorePermissions) {
          ___setErrNo(ERRNO_CODES.EACCES);
          throw new Error('Parent folder must be writeable.');
        }
        if (!name || name == '.' || name == '..') {
          ___setErrNo(ERRNO_CODES.ENOENT);
          throw new Error('Name must not be empty.');
        }
        if (parent.contents.hasOwnProperty(name)) {
          ___setErrNo(ERRNO_CODES.EEXIST);
          throw new Error("Can't overwrite object.");
        }
        parent.contents[name] = {
          read: canRead === undefined ? true : canRead,
          write: canWrite === undefined ? false : canWrite,
          timestamp: Date.now(),
          inodeNumber: FS.nextInode++
        };
        for (var key in properties) {
          if (properties.hasOwnProperty(key)) {
            parent.contents[name][key] = properties[key];
          }
        }
        return parent.contents[name];
      },createFolder:function (parent, name, canRead, canWrite) {
        var properties = {isFolder: true, isDevice: false, contents: {}};
        return FS.createObject(parent, name, properties, canRead, canWrite);
      },createPath:function (parent, path, canRead, canWrite) {
        var current = FS.findObject(parent);
        if (current === null) throw new Error('Invalid parent.');
        path = path.split('/').reverse();
        while (path.length) {
          var part = path.pop();
          if (!part) continue;
          if (!current.contents.hasOwnProperty(part)) {
            FS.createFolder(current, part, canRead, canWrite);
          }
          current = current.contents[part];
        }
        return current;
      },createFile:function (parent, name, properties, canRead, canWrite) {
        properties.isFolder = false;
        return FS.createObject(parent, name, properties, canRead, canWrite);
      },createDataFile:function (parent, name, data, canRead, canWrite) {
        if (typeof data === 'string') {
          var dataArray = new Array(data.length);
          for (var i = 0, len = data.length; i < len; ++i) dataArray[i] = data.charCodeAt(i);
          data = dataArray;
        }
        var properties = {
          isDevice: false,
          contents: data.subarray ? data.subarray(0) : data // as an optimization, create a new array wrapper (not buffer) here, to help JS engines understand this object
        };
        return FS.createFile(parent, name, properties, canRead, canWrite);
      },createLazyFile:function (parent, name, url, canRead, canWrite) {
        if (typeof XMLHttpRequest !== 'undefined') {
          if (!ENVIRONMENT_IS_WORKER) throw 'Cannot do synchronous binary XHRs outside webworkers in modern browsers. Use --embed-file or --preload-file in emcc';
          // Lazy chunked Uint8Array (implements get and length from Uint8Array). Actual getting is abstracted away for eventual reuse.
          var LazyUint8Array = function(chunkSize, length) {
            this.length = length;
            this.chunkSize = chunkSize;
            this.chunks = []; // Loaded chunks. Index is the chunk number
          }
          LazyUint8Array.prototype.get = function(idx) {
            if (idx > this.length-1 || idx < 0) {
              return undefined;
            }
            var chunkOffset = idx % chunkSize;
            var chunkNum = Math.floor(idx / chunkSize);
            return this.getter(chunkNum)[chunkOffset];
          }
          LazyUint8Array.prototype.setDataGetter = function(getter) {
            this.getter = getter;
          }
          // Find length
          var xhr = new XMLHttpRequest();
          xhr.open('HEAD', url, false);
          xhr.send(null);
          if (!(xhr.status >= 200 && xhr.status < 300 || xhr.status === 304)) throw new Error("Couldn't load " + url + ". Status: " + xhr.status);
          var datalength = Number(xhr.getResponseHeader("Content-length"));
          var header;
          var hasByteServing = (header = xhr.getResponseHeader("Accept-Ranges")) && header === "bytes";
          var chunkSize = 1024*1024; // Chunk size in bytes
          if (!hasByteServing) chunkSize = datalength;
          // Function to get a range from the remote URL.
          var doXHR = (function(from, to) {
            if (from > to) throw new Error("invalid range (" + from + ", " + to + ") or no bytes requested!");
            if (to > datalength-1) throw new Error("only " + datalength + " bytes available! programmer error!");
            // TODO: Use mozResponseArrayBuffer, responseStream, etc. if available.
            var xhr = new XMLHttpRequest();
            xhr.open('GET', url, false);
            if (datalength !== chunkSize) xhr.setRequestHeader("Range", "bytes=" + from + "-" + to);
            // Some hints to the browser that we want binary data.
            if (typeof Uint8Array != 'undefined') xhr.responseType = 'arraybuffer';
            if (xhr.overrideMimeType) {
              xhr.overrideMimeType('text/plain; charset=x-user-defined');
            }
            xhr.send(null);
            if (!(xhr.status >= 200 && xhr.status < 300 || xhr.status === 304)) throw new Error("Couldn't load " + url + ". Status: " + xhr.status);
            if (xhr.response !== undefined) {
              return new Uint8Array(xhr.response || []);
            } else {
              return intArrayFromString(xhr.responseText || '', true);
            }
          });
          var lazyArray = new LazyUint8Array(chunkSize, datalength);
          lazyArray.setDataGetter(function(chunkNum) {
            var start = chunkNum * lazyArray.chunkSize;
            var end = (chunkNum+1) * lazyArray.chunkSize - 1; // including this byte
            end = Math.min(end, datalength-1); // if datalength-1 is selected, this is the last block
            if (typeof(lazyArray.chunks[chunkNum]) === "undefined") {
              lazyArray.chunks[chunkNum] = doXHR(start, end);
            }
            if (typeof(lazyArray.chunks[chunkNum]) === "undefined") throw new Error("doXHR failed!");
            return lazyArray.chunks[chunkNum];
          });
          var properties = { isDevice: false, contents: lazyArray };
        } else {
          var properties = { isDevice: false, url: url };
        }
        return FS.createFile(parent, name, properties, canRead, canWrite);
      },createPreloadedFile:function (parent, name, url, canRead, canWrite, onload, onerror, dontCreateFile) {
        Browser.init();
        var fullname = FS.joinPath([parent, name], true);
        function processData(byteArray) {
          function finish(byteArray) {
            if (!dontCreateFile) {
              FS.createDataFile(parent, name, byteArray, canRead, canWrite);
            }
            if (onload) onload();
            removeRunDependency('cp ' + fullname);
          }
          var handled = false;
          Module['preloadPlugins'].forEach(function(plugin) {
            if (handled) return;
            if (plugin['canHandle'](fullname)) {
              plugin['handle'](byteArray, fullname, finish, function() {
                if (onerror) onerror();
                removeRunDependency('cp ' + fullname);
              });
              handled = true;
            }
          });
          if (!handled) finish(byteArray);
        }
        addRunDependency('cp ' + fullname);
        if (typeof url == 'string') {
          Browser.asyncLoad(url, function(byteArray) {
            processData(byteArray);
          }, onerror);
        } else {
          processData(url);
        }
      },createLink:function (parent, name, target, canRead, canWrite) {
        var properties = {isDevice: false, link: target};
        return FS.createFile(parent, name, properties, canRead, canWrite);
      },createDevice:function (parent, name, input, output) {
        if (!(input || output)) {
          throw new Error('A device must have at least one callback defined.');
        }
        var ops = {isDevice: true, input: input, output: output};
        return FS.createFile(parent, name, ops, Boolean(input), Boolean(output));
      },forceLoadFile:function (obj) {
        if (obj.isDevice || obj.isFolder || obj.link || obj.contents) return true;
        var success = true;
        if (typeof XMLHttpRequest !== 'undefined') {
          throw new Error("Lazy loading should have been performed (contents set) in createLazyFile, but it was not. Lazy loading only works in web workers. Use --embed-file or --preload-file in emcc on the main thread.");
        } else if (Module['read']) {
          // Command-line.
          try {
            // WARNING: Can't read binary files in V8's d8 or tracemonkey's js, as
            //          read() will try to parse UTF8.
            obj.contents = intArrayFromString(Module['read'](obj.url), true);
          } catch (e) {
            success = false;
          }
        } else {
          throw new Error('Cannot load without read() or XMLHttpRequest.');
        }
        if (!success) ___setErrNo(ERRNO_CODES.EIO);
        return success;
      },ensureRoot:function () {
        if (FS.root) return;
        // The main file system tree. All the contents are inside this.
        FS.root = {
          read: true,
          write: true,
          isFolder: true,
          isDevice: false,
          timestamp: Date.now(),
          inodeNumber: 1,
          contents: {}
        };
      },init:function (input, output, error) {
        // Make sure we initialize only once.
        assert(!FS.init.initialized, 'FS.init was previously called. If you want to initialize later with custom parameters, remove any earlier calls (note that one is automatically added to the generated code)');
        FS.init.initialized = true;
        FS.ensureRoot();
        // Allow Module.stdin etc. to provide defaults, if none explicitly passed to us here
        input = input || Module['stdin'];
        output = output || Module['stdout'];
        error = error || Module['stderr'];
        // Default handlers.
        var stdinOverridden = true, stdoutOverridden = true, stderrOverridden = true;
        if (!input) {
          stdinOverridden = false;
          input = function() {
            if (!input.cache || !input.cache.length) {
              var result;
              if (typeof window != 'undefined' &&
                  typeof window.prompt == 'function') {
                // Browser.
                result = window.prompt('Input: ');
                if (result === null) result = String.fromCharCode(0); // cancel ==> EOF
              } else if (typeof readline == 'function') {
                // Command line.
                result = readline();
              }
              if (!result) result = '';
              input.cache = intArrayFromString(result + '\n', true);
            }
            return input.cache.shift();
          };
        }
        var utf8 = new Runtime.UTF8Processor();
        function simpleOutput(val) {
          if (val === null || val === 10) {
            output.printer(output.buffer.join(''));
            output.buffer = [];
          } else {
            output.buffer.push(utf8.processCChar(val));
          }
        }
        if (!output) {
          stdoutOverridden = false;
          output = simpleOutput;
        }
        if (!output.printer) output.printer = Module['print'];
        if (!output.buffer) output.buffer = [];
        if (!error) {
          stderrOverridden = false;
          error = simpleOutput;
        }
        if (!error.printer) error.printer = Module['print'];
        if (!error.buffer) error.buffer = [];
        // Create the temporary folder, if not already created
        try {
          FS.createFolder('/', 'tmp', true, true);
        } catch(e) {}
        // Create the I/O devices.
        var devFolder = FS.createFolder('/', 'dev', true, true);
        var stdin = FS.createDevice(devFolder, 'stdin', input);
        var stdout = FS.createDevice(devFolder, 'stdout', null, output);
        var stderr = FS.createDevice(devFolder, 'stderr', null, error);
        FS.createDevice(devFolder, 'tty', input, output);
        // Create default streams.
        FS.streams[1] = {
          path: '/dev/stdin',
          object: stdin,
          position: 0,
          isRead: true,
          isWrite: false,
          isAppend: false,
          isTerminal: !stdinOverridden,
          error: false,
          eof: false,
          ungotten: []
        };
        FS.streams[2] = {
          path: '/dev/stdout',
          object: stdout,
          position: 0,
          isRead: false,
          isWrite: true,
          isAppend: false,
          isTerminal: !stdoutOverridden,
          error: false,
          eof: false,
          ungotten: []
        };
        FS.streams[3] = {
          path: '/dev/stderr',
          object: stderr,
          position: 0,
          isRead: false,
          isWrite: true,
          isAppend: false,
          isTerminal: !stderrOverridden,
          error: false,
          eof: false,
          ungotten: []
        };
        assert(Math.max(_stdin, _stdout, _stderr) < 128); // make sure these are low, we flatten arrays with these
        HEAP32[((_stdin)>>2)]=1;
        HEAP32[((_stdout)>>2)]=2;
        HEAP32[((_stderr)>>2)]=3;
        // Other system paths
        FS.createPath('/', 'dev/shm/tmp', true, true); // temp files
        // Newlib initialization
        for (var i = FS.streams.length; i < Math.max(_stdin, _stdout, _stderr) + 4; i++) {
          FS.streams[i] = null; // Make sure to keep FS.streams dense
        }
        FS.streams[_stdin] = FS.streams[1];
        FS.streams[_stdout] = FS.streams[2];
        FS.streams[_stderr] = FS.streams[3];
        allocate([ allocate(
          [0, 0, 0, 0, _stdin, 0, 0, 0, _stdout, 0, 0, 0, _stderr, 0, 0, 0],
          'void*', ALLOC_STATIC) ], 'void*', ALLOC_NONE, __impure_ptr);
      },quit:function () {
        if (!FS.init.initialized) return;
        // Flush any partially-printed lines in stdout and stderr. Careful, they may have been closed
        if (FS.streams[2] && FS.streams[2].object.output.buffer.length > 0) FS.streams[2].object.output(10);
        if (FS.streams[3] && FS.streams[3].object.output.buffer.length > 0) FS.streams[3].object.output(10);
      },standardizePath:function (path) {
        if (path.substr(0, 2) == './') path = path.substr(2);
        return path;
      },deleteFile:function (path) {
        path = FS.analyzePath(path);
        if (!path.parentExists || !path.exists) {
          throw 'Invalid path ' + path;
        }
        delete path.parentObject.contents[path.name];
      }};
  function _pwrite(fildes, buf, nbyte, offset) {
      // ssize_t pwrite(int fildes, const void *buf, size_t nbyte, off_t offset);
      // http://pubs.opengroup.org/onlinepubs/000095399/functions/write.html
      var stream = FS.streams[fildes];
      if (!stream || stream.object.isDevice) {
        ___setErrNo(ERRNO_CODES.EBADF);
        return -1;
      } else if (!stream.isWrite) {
        ___setErrNo(ERRNO_CODES.EACCES);
        return -1;
      } else if (stream.object.isFolder) {
        ___setErrNo(ERRNO_CODES.EISDIR);
        return -1;
      } else if (nbyte < 0 || offset < 0) {
        ___setErrNo(ERRNO_CODES.EINVAL);
        return -1;
      } else {
        var contents = stream.object.contents;
        while (contents.length < offset) contents.push(0);
        for (var i = 0; i < nbyte; i++) {
          contents[offset + i] = HEAPU8[(((buf)+(i))|0)];
        }
        stream.object.timestamp = Date.now();
        return i;
      }
    }function _write(fildes, buf, nbyte) {
      // ssize_t write(int fildes, const void *buf, size_t nbyte);
      // http://pubs.opengroup.org/onlinepubs/000095399/functions/write.html
      var stream = FS.streams[fildes];
      if (!stream) {
        ___setErrNo(ERRNO_CODES.EBADF);
        return -1;
      } else if (!stream.isWrite) {
        ___setErrNo(ERRNO_CODES.EACCES);
        return -1;
      } else if (nbyte < 0) {
        ___setErrNo(ERRNO_CODES.EINVAL);
        return -1;
      } else {
        if (stream.object.isDevice) {
          if (stream.object.output) {
            for (var i = 0; i < nbyte; i++) {
              try {
                stream.object.output(HEAP8[(((buf)+(i))|0)]);
              } catch (e) {
                ___setErrNo(ERRNO_CODES.EIO);
                return -1;
              }
            }
            stream.object.timestamp = Date.now();
            return i;
          } else {
            ___setErrNo(ERRNO_CODES.ENXIO);
            return -1;
          }
        } else {
          var bytesWritten = _pwrite(fildes, buf, nbyte, stream.position);
          if (bytesWritten != -1) stream.position += bytesWritten;
          return bytesWritten;
        }
      }
    }function _fwrite(ptr, size, nitems, stream) {
      // size_t fwrite(const void *restrict ptr, size_t size, size_t nitems, FILE *restrict stream);
      // http://pubs.opengroup.org/onlinepubs/000095399/functions/fwrite.html
      var bytesToWrite = nitems * size;
      if (bytesToWrite == 0) return 0;
      var bytesWritten = _write(stream, ptr, bytesToWrite);
      if (bytesWritten == -1) {
        if (FS.streams[stream]) FS.streams[stream].error = true;
        return 0;
      } else {
        return Math.floor(bytesWritten / size);
      }
    }
  Module["_strlen"] = _strlen;
  function __reallyNegative(x) {
      return x < 0 || (x === 0 && (1/x) === -Infinity);
    }function __formatString(format, varargs) {
      var textIndex = format;
      var argIndex = 0;
      function getNextArg(type) {
        // NOTE: Explicitly ignoring type safety. Otherwise this fails:
        //       int x = 4; printf("%c\n", (char)x);
        var ret;
        if (type === 'double') {
          ret = (HEAP32[((tempDoublePtr)>>2)]=HEAP32[(((varargs)+(argIndex))>>2)],HEAP32[(((tempDoublePtr)+(4))>>2)]=HEAP32[(((varargs)+((argIndex)+(4)))>>2)],(+(HEAPF64[(tempDoublePtr)>>3])));
        } else if (type == 'i64') {
          ret = [HEAP32[(((varargs)+(argIndex))>>2)],
                 HEAP32[(((varargs)+(argIndex+4))>>2)]];
        } else {
          type = 'i32'; // varargs are always i32, i64, or double
          ret = HEAP32[(((varargs)+(argIndex))>>2)];
        }
        argIndex += Runtime.getNativeFieldSize(type);
        return ret;
      }
      var ret = [];
      var curr, next, currArg;
      while(1) {
        var startTextIndex = textIndex;
        curr = HEAP8[(textIndex)];
        if (curr === 0) break;
        next = HEAP8[((textIndex+1)|0)];
        if (curr == 37) {
          // Handle flags.
          var flagAlwaysSigned = false;
          var flagLeftAlign = false;
          var flagAlternative = false;
          var flagZeroPad = false;
          flagsLoop: while (1) {
            switch (next) {
              case 43:
                flagAlwaysSigned = true;
                break;
              case 45:
                flagLeftAlign = true;
                break;
              case 35:
                flagAlternative = true;
                break;
              case 48:
                if (flagZeroPad) {
                  break flagsLoop;
                } else {
                  flagZeroPad = true;
                  break;
                }
              default:
                break flagsLoop;
            }
            textIndex++;
            next = HEAP8[((textIndex+1)|0)];
          }
          // Handle width.
          var width = 0;
          if (next == 42) {
            width = getNextArg('i32');
            textIndex++;
            next = HEAP8[((textIndex+1)|0)];
          } else {
            while (next >= 48 && next <= 57) {
              width = width * 10 + (next - 48);
              textIndex++;
              next = HEAP8[((textIndex+1)|0)];
            }
          }
          // Handle precision.
          var precisionSet = false;
          if (next == 46) {
            var precision = 0;
            precisionSet = true;
            textIndex++;
            next = HEAP8[((textIndex+1)|0)];
            if (next == 42) {
              precision = getNextArg('i32');
              textIndex++;
            } else {
              while(1) {
                var precisionChr = HEAP8[((textIndex+1)|0)];
                if (precisionChr < 48 ||
                    precisionChr > 57) break;
                precision = precision * 10 + (precisionChr - 48);
                textIndex++;
              }
            }
            next = HEAP8[((textIndex+1)|0)];
          } else {
            var precision = 6; // Standard default.
          }
          // Handle integer sizes. WARNING: These assume a 32-bit architecture!
          var argSize;
          switch (String.fromCharCode(next)) {
            case 'h':
              var nextNext = HEAP8[((textIndex+2)|0)];
              if (nextNext == 104) {
                textIndex++;
                argSize = 1; // char (actually i32 in varargs)
              } else {
                argSize = 2; // short (actually i32 in varargs)
              }
              break;
            case 'l':
              var nextNext = HEAP8[((textIndex+2)|0)];
              if (nextNext == 108) {
                textIndex++;
                argSize = 8; // long long
              } else {
                argSize = 4; // long
              }
              break;
            case 'L': // long long
            case 'q': // int64_t
            case 'j': // intmax_t
              argSize = 8;
              break;
            case 'z': // size_t
            case 't': // ptrdiff_t
            case 'I': // signed ptrdiff_t or unsigned size_t
              argSize = 4;
              break;
            default:
              argSize = null;
          }
          if (argSize) textIndex++;
          next = HEAP8[((textIndex+1)|0)];
          // Handle type specifier.
          switch (String.fromCharCode(next)) {
            case 'd': case 'i': case 'u': case 'o': case 'x': case 'X': case 'p': {
              // Integer.
              var signed = next == 100 || next == 105;
              argSize = argSize || 4;
              var currArg = getNextArg('i' + (argSize * 8));
              var origArg = currArg;
              var argText;
              // Flatten i64-1 [low, high] into a (slightly rounded) double
              if (argSize == 8) {
                currArg = Runtime.makeBigInt(currArg[0], currArg[1], next == 117);
              }
              // Truncate to requested size.
              if (argSize <= 4) {
                var limit = Math.pow(256, argSize) - 1;
                currArg = (signed ? reSign : unSign)(currArg & limit, argSize * 8);
              }
              // Format the number.
              var currAbsArg = Math.abs(currArg);
              var prefix = '';
              if (next == 100 || next == 105) {
                if (argSize == 8 && i64Math) argText = i64Math.stringify(origArg[0], origArg[1], null); else
                argText = reSign(currArg, 8 * argSize, 1).toString(10);
              } else if (next == 117) {
                if (argSize == 8 && i64Math) argText = i64Math.stringify(origArg[0], origArg[1], true); else
                argText = unSign(currArg, 8 * argSize, 1).toString(10);
                currArg = Math.abs(currArg);
              } else if (next == 111) {
                argText = (flagAlternative ? '0' : '') + currAbsArg.toString(8);
              } else if (next == 120 || next == 88) {
                prefix = flagAlternative ? '0x' : '';
                if (argSize == 8 && i64Math) {
                  if (origArg[1]) {
                    argText = (origArg[1]>>>0).toString(16);
                    var lower = (origArg[0]>>>0).toString(16);
                    while (lower.length < 8) lower = '0' + lower;
                    argText += lower;
                  } else {
                    argText = (origArg[0]>>>0).toString(16);
                  }
                } else
                if (currArg < 0) {
                  // Represent negative numbers in hex as 2's complement.
                  currArg = -currArg;
                  argText = (currAbsArg - 1).toString(16);
                  var buffer = [];
                  for (var i = 0; i < argText.length; i++) {
                    buffer.push((0xF - parseInt(argText[i], 16)).toString(16));
                  }
                  argText = buffer.join('');
                  while (argText.length < argSize * 2) argText = 'f' + argText;
                } else {
                  argText = currAbsArg.toString(16);
                }
                if (next == 88) {
                  prefix = prefix.toUpperCase();
                  argText = argText.toUpperCase();
                }
              } else if (next == 112) {
                if (currAbsArg === 0) {
                  argText = '(nil)';
                } else {
                  prefix = '0x';
                  argText = currAbsArg.toString(16);
                }
              }
              if (precisionSet) {
                while (argText.length < precision) {
                  argText = '0' + argText;
                }
              }
              // Add sign if needed
              if (flagAlwaysSigned) {
                if (currArg < 0) {
                  prefix = '-' + prefix;
                } else {
                  prefix = '+' + prefix;
                }
              }
              // Add padding.
              while (prefix.length + argText.length < width) {
                if (flagLeftAlign) {
                  argText += ' ';
                } else {
                  if (flagZeroPad) {
                    argText = '0' + argText;
                  } else {
                    prefix = ' ' + prefix;
                  }
                }
              }
              // Insert the result into the buffer.
              argText = prefix + argText;
              argText.split('').forEach(function(chr) {
                ret.push(chr.charCodeAt(0));
              });
              break;
            }
            case 'f': case 'F': case 'e': case 'E': case 'g': case 'G': {
              // Float.
              var currArg = getNextArg('double');
              var argText;
              if (isNaN(currArg)) {
                argText = 'nan';
                flagZeroPad = false;
              } else if (!isFinite(currArg)) {
                argText = (currArg < 0 ? '-' : '') + 'inf';
                flagZeroPad = false;
              } else {
                var isGeneral = false;
                var effectivePrecision = Math.min(precision, 20);
                // Convert g/G to f/F or e/E, as per:
                // http://pubs.opengroup.org/onlinepubs/9699919799/functions/printf.html
                if (next == 103 || next == 71) {
                  isGeneral = true;
                  precision = precision || 1;
                  var exponent = parseInt(currArg.toExponential(effectivePrecision).split('e')[1], 10);
                  if (precision > exponent && exponent >= -4) {
                    next = ((next == 103) ? 'f' : 'F').charCodeAt(0);
                    precision -= exponent + 1;
                  } else {
                    next = ((next == 103) ? 'e' : 'E').charCodeAt(0);
                    precision--;
                  }
                  effectivePrecision = Math.min(precision, 20);
                }
                if (next == 101 || next == 69) {
                  argText = currArg.toExponential(effectivePrecision);
                  // Make sure the exponent has at least 2 digits.
                  if (/[eE][-+]\d$/.test(argText)) {
                    argText = argText.slice(0, -1) + '0' + argText.slice(-1);
                  }
                } else if (next == 102 || next == 70) {
                  argText = currArg.toFixed(effectivePrecision);
                  if (currArg === 0 && __reallyNegative(currArg)) {
                    argText = '-' + argText;
                  }
                }
                var parts = argText.split('e');
                if (isGeneral && !flagAlternative) {
                  // Discard trailing zeros and periods.
                  while (parts[0].length > 1 && parts[0].indexOf('.') != -1 &&
                         (parts[0].slice(-1) == '0' || parts[0].slice(-1) == '.')) {
                    parts[0] = parts[0].slice(0, -1);
                  }
                } else {
                  // Make sure we have a period in alternative mode.
                  if (flagAlternative && argText.indexOf('.') == -1) parts[0] += '.';
                  // Zero pad until required precision.
                  while (precision > effectivePrecision++) parts[0] += '0';
                }
                argText = parts[0] + (parts.length > 1 ? 'e' + parts[1] : '');
                // Capitalize 'E' if needed.
                if (next == 69) argText = argText.toUpperCase();
                // Add sign.
                if (flagAlwaysSigned && currArg >= 0) {
                  argText = '+' + argText;
                }
              }
              // Add padding.
              while (argText.length < width) {
                if (flagLeftAlign) {
                  argText += ' ';
                } else {
                  if (flagZeroPad && (argText[0] == '-' || argText[0] == '+')) {
                    argText = argText[0] + '0' + argText.slice(1);
                  } else {
                    argText = (flagZeroPad ? '0' : ' ') + argText;
                  }
                }
              }
              // Adjust case.
              if (next < 97) argText = argText.toUpperCase();
              // Insert the result into the buffer.
              argText.split('').forEach(function(chr) {
                ret.push(chr.charCodeAt(0));
              });
              break;
            }
            case 's': {
              // String.
              var arg = getNextArg('i8*') || nullString;
              var argLength = _strlen(arg);
              if (precisionSet) argLength = Math.min(argLength, precision);
              if (!flagLeftAlign) {
                while (argLength < width--) {
                  ret.push(32);
                }
              }
              for (var i = 0; i < argLength; i++) {
                ret.push(HEAPU8[((arg++)|0)]);
              }
              if (flagLeftAlign) {
                while (argLength < width--) {
                  ret.push(32);
                }
              }
              break;
            }
            case 'c': {
              // Character.
              if (flagLeftAlign) ret.push(getNextArg('i8'));
              while (--width > 0) {
                ret.push(32);
              }
              if (!flagLeftAlign) ret.push(getNextArg('i8'));
              break;
            }
            case 'n': {
              // Write the length written so far to the next parameter.
              var ptr = getNextArg('i32*');
              HEAP32[((ptr)>>2)]=ret.length
              break;
            }
            case '%': {
              // Literal percent sign.
              ret.push(curr);
              break;
            }
            default: {
              // Unknown specifiers remain untouched.
              for (var i = startTextIndex; i < textIndex + 2; i++) {
                ret.push(HEAP8[(i)]);
              }
            }
          }
          textIndex += 2;
          // TODO: Support a/A (hex float) and m (last error) specifiers.
          // TODO: Support %1${specifier} for arg selection.
        } else {
          ret.push(curr);
          textIndex += 1;
        }
      }
      return ret;
    }function _fprintf(stream, format, varargs) {
      // int fprintf(FILE *restrict stream, const char *restrict format, ...);
      // http://pubs.opengroup.org/onlinepubs/000095399/functions/printf.html
      var result = __formatString(format, varargs);
      var stack = Runtime.stackSave();
      var ret = _fwrite(allocate(result, 'i8', ALLOC_STACK), 1, result.length, stream);
      Runtime.stackRestore(stack);
      return ret;
    }
  function __exit(status) {
      // void _exit(int status);
      // http://pubs.opengroup.org/onlinepubs/000095399/functions/exit.html
      function ExitStatus() {
        this.name = "ExitStatus";
        this.message = "Program terminated with exit(" + status + ")";
        this.status = status;
        Module.print('Exit Status: ' + status);
      };
      ExitStatus.prototype = new Error();
      ExitStatus.prototype.constructor = ExitStatus;
      exitRuntime();
      ABORT = true;
      throw new ExitStatus();
    }function _exit(status) {
      __exit(status);
    }
  Module["_memcpy"] = _memcpy;var _llvm_memcpy_p0i8_p0i8_i32=_memcpy;
  function _printf(format, varargs) {
      // int printf(const char *restrict format, ...);
      // http://pubs.opengroup.org/onlinepubs/000095399/functions/printf.html
      var stdout = HEAP32[((_stdout)>>2)];
      return _fprintf(stdout, format, varargs);
    }
  function ___gxx_personality_v0() {
    }
  Module["_strcpy"] = _strcpy;
  var ___strtok_state=0;
  function _strtok_r(s, delim, lasts) {
      var skip_leading_delim = 1;
      var spanp;
      var c, sc;
      var tok;
      if (s == 0 && (s = getValue(lasts, 'i8*')) == 0) {
        return 0;
      }
      cont: while (1) {
        c = getValue(s++, 'i8');
        for (spanp = delim; (sc = getValue(spanp++, 'i8')) != 0;) {
          if (c == sc) {
            if (skip_leading_delim) {
              continue cont;
            } else {
              setValue(lasts, s, 'i8*');
              setValue(s - 1, 0, 'i8');
              return s - 1;
            }
          }
        }
        break;
      }
      if (c == 0) {
        setValue(lasts, 0, 'i8*');
        return 0;
      }
      tok = s - 1;
      for (;;) {
        c = getValue(s++, 'i8');
        spanp = delim;
        do {
          if ((sc = getValue(spanp++, 'i8')) == c) {
            if (c == 0) {
              s = 0;
            } else {
              setValue(s - 1, 0, 'i8');
            }
            setValue(lasts, s, 'i8*');
            return tok;
          }
        } while (sc != 0);
      }
      abort('strtok_r error!');
    }function _strtok(s, delim) {
      return _strtok_r(s, delim, ___strtok_state);
    }
  function _fflush(stream) {
      // int fflush(FILE *stream);
      // http://pubs.opengroup.org/onlinepubs/000095399/functions/fflush.html
      var flush = function(filedes) {
        // Right now we write all data directly, except for output devices.
        if (FS.streams[filedes] && FS.streams[filedes].object.output) {
          if (!FS.streams[filedes].isTerminal) { // don't flush terminals, it would cause a \n to also appear
            FS.streams[filedes].object.output(null);
          }
        }
      };
      try {
        if (stream === 0) {
          for (var i = 0; i < FS.streams.length; i++) if (FS.streams[i]) flush(i);
        } else {
          flush(stream);
        }
        return 0;
      } catch (e) {
        ___setErrNo(ERRNO_CODES.EIO);
        return -1;
      }
    }
  function _strncmp(px, py, n) {
      var i = 0;
      while (i < n) {
        var x = HEAPU8[(((px)+(i))|0)];
        var y = HEAPU8[(((py)+(i))|0)];
        if (x == y && x == 0) return 0;
        if (x == 0) return -1;
        if (y == 0) return 1;
        if (x == y) {
          i ++;
          continue;
        } else {
          return x > y ? 1 : -1;
        }
      }
      return 0;
    }function _strcmp(px, py) {
      return _strncmp(px, py, TOTAL_MEMORY);
    }
  function __isFloat(text) {
      return !!(/^[+-]?[0-9]*\.?[0-9]+([eE][+-]?[0-9]+)?$/.exec(text));
    }function __scanString(format, get, unget, varargs) {
      if (!__scanString.whiteSpace) {
        __scanString.whiteSpace = {};
        __scanString.whiteSpace[32] = 1;
        __scanString.whiteSpace[9] = 1;
        __scanString.whiteSpace[10] = 1;
        __scanString.whiteSpace[' '] = 1;
        __scanString.whiteSpace['\t'] = 1;
        __scanString.whiteSpace['\n'] = 1;
      }
      // Supports %x, %4x, %d.%d, %lld, %s, %f, %lf.
      // TODO: Support all format specifiers.
      format = Pointer_stringify(format);
      var soFar = 0;
      if (format.indexOf('%n') >= 0) {
        // need to track soFar
        var _get = get;
        get = function() {
          soFar++;
          return _get();
        }
        var _unget = unget;
        unget = function() {
          soFar--;
          return _unget();
        }
      }
      var formatIndex = 0;
      var argsi = 0;
      var fields = 0;
      var argIndex = 0;
      var next;
      mainLoop:
      for (var formatIndex = 0; formatIndex < format.length;) {
        if (format[formatIndex] === '%' && format[formatIndex+1] == 'n') {
          var argPtr = HEAP32[(((varargs)+(argIndex))>>2)];
          argIndex += Runtime.getNativeFieldSize('void*');
          HEAP32[((argPtr)>>2)]=soFar;
          formatIndex += 2;
          continue;
        }
        // TODO: Support strings like "%5c" etc.
        if (format[formatIndex] === '%' && format[formatIndex+1] == 'c') {
          var argPtr = HEAP32[(((varargs)+(argIndex))>>2)];
          argIndex += Runtime.getNativeFieldSize('void*');
          fields++;
          next = get();
          HEAP8[(argPtr)]=next
          formatIndex += 2;
          continue;
        }
        // remove whitespace
        while (1) {
          next = get();
          if (next == 0) return fields;
          if (!(next in __scanString.whiteSpace)) break;
        }
        unget();
        if (format[formatIndex] === '%') {
          formatIndex++;
          var maxSpecifierStart = formatIndex;
          while (format[formatIndex].charCodeAt(0) >= 48 &&
                 format[formatIndex].charCodeAt(0) <= 57) {
            formatIndex++;
          }
          var max_;
          if (formatIndex != maxSpecifierStart) {
            max_ = parseInt(format.slice(maxSpecifierStart, formatIndex), 10);
          }
          var long_ = false;
          var half = false;
          var longLong = false;
          if (format[formatIndex] == 'l') {
            long_ = true;
            formatIndex++;
            if(format[formatIndex] == 'l') {
              longLong = true;
              formatIndex++;
            }
          } else if (format[formatIndex] == 'h') {
            half = true;
            formatIndex++;
          }
          var type = format[formatIndex];
          formatIndex++;
          var curr = 0;
          var buffer = [];
          // Read characters according to the format. floats are trickier, they may be in an unfloat state in the middle, then be a valid float later
          if (type == 'f' || type == 'e' || type == 'g' || type == 'E') {
            var last = 0;
            next = get();
            while (next > 0) {
              buffer.push(String.fromCharCode(next));
              if (__isFloat(buffer.join(''))) {
                last = buffer.length;
              }
              next = get();
            }
            for (var i = 0; i < buffer.length - last + 1; i++) {
              unget();
            }
            buffer.length = last;
          } else {
            next = get();
            var first = true;
            while ((curr < max_ || isNaN(max_)) && next > 0) {
              if (!(next in __scanString.whiteSpace) && // stop on whitespace
                  (type == 's' ||
                   ((type === 'd' || type == 'u' || type == 'i') && ((next >= 48 && next <= 57) ||
                                                                     (first && next == 45))) ||
                   (type === 'x' && (next >= 48 && next <= 57 ||
                                     next >= 97 && next <= 102 ||
                                     next >= 65 && next <= 70))) &&
                  (formatIndex >= format.length || next !== format[formatIndex].charCodeAt(0))) { // Stop when we read something that is coming up
                buffer.push(String.fromCharCode(next));
                next = get();
                curr++;
                first = false;
              } else {
                break;
              }
            }
            unget();
          }
          if (buffer.length === 0) return 0;  // Failure.
          var text = buffer.join('');
          var argPtr = HEAP32[(((varargs)+(argIndex))>>2)];
          argIndex += Runtime.getNativeFieldSize('void*');
          switch (type) {
            case 'd': case 'u': case 'i':
              if (half) {
                HEAP16[((argPtr)>>1)]=parseInt(text, 10);
              } else if(longLong) {
                (tempI64 = [parseInt(text, 10)>>>0,Math.min(Math.floor((parseInt(text, 10))/(+(4294967296))), (+(4294967295)))>>>0],HEAP32[((argPtr)>>2)]=tempI64[0],HEAP32[(((argPtr)+(4))>>2)]=tempI64[1]);
              } else {
                HEAP32[((argPtr)>>2)]=parseInt(text, 10);
              }
              break;
            case 'x':
              HEAP32[((argPtr)>>2)]=parseInt(text, 16)
              break;
            case 'f':
            case 'e':
            case 'g':
            case 'E':
              // fallthrough intended
              if (long_) {
                (HEAPF64[(tempDoublePtr)>>3]=parseFloat(text),HEAP32[((argPtr)>>2)]=((HEAP32[((tempDoublePtr)>>2)])|0),HEAP32[(((argPtr)+(4))>>2)]=((HEAP32[(((tempDoublePtr)+(4))>>2)])|0))
              } else {
                HEAPF32[((argPtr)>>2)]=parseFloat(text)
              }
              break;
            case 's':
              var array = intArrayFromString(text);
              for (var j = 0; j < array.length; j++) {
                HEAP8[(((argPtr)+(j))|0)]=array[j]
              }
              break;
          }
          fields++;
        } else if (format[formatIndex] in __scanString.whiteSpace) {
          next = get();
          while (next in __scanString.whiteSpace) {
            if (next <= 0) break mainLoop;  // End of input.
            next = get();
          }
          unget(next);
          formatIndex++;
        } else {
          // Not a specifier.
          next = get();
          if (format[formatIndex].charCodeAt(0) !== next) {
            unget(next);
            break mainLoop;
          }
          formatIndex++;
        }
      }
      return fields;
    }
  function _pread(fildes, buf, nbyte, offset) {
      // ssize_t pread(int fildes, void *buf, size_t nbyte, off_t offset);
      // http://pubs.opengroup.org/onlinepubs/000095399/functions/read.html
      var stream = FS.streams[fildes];
      if (!stream || stream.object.isDevice) {
        ___setErrNo(ERRNO_CODES.EBADF);
        return -1;
      } else if (!stream.isRead) {
        ___setErrNo(ERRNO_CODES.EACCES);
        return -1;
      } else if (stream.object.isFolder) {
        ___setErrNo(ERRNO_CODES.EISDIR);
        return -1;
      } else if (nbyte < 0 || offset < 0) {
        ___setErrNo(ERRNO_CODES.EINVAL);
        return -1;
      } else {
        var bytesRead = 0;
        while (stream.ungotten.length && nbyte > 0) {
          HEAP8[((buf++)|0)]=stream.ungotten.pop()
          nbyte--;
          bytesRead++;
        }
        var contents = stream.object.contents;
        var size = Math.min(contents.length - offset, nbyte);
        if (contents.subarray) { // typed array
          HEAPU8.set(contents.subarray(offset, offset+size), buf);
        } else
        if (contents.slice) { // normal array
          for (var i = 0; i < size; i++) {
            HEAP8[(((buf)+(i))|0)]=contents[offset + i]
          }
        } else {
          for (var i = 0; i < size; i++) { // LazyUint8Array from sync binary XHR
            HEAP8[(((buf)+(i))|0)]=contents.get(offset + i)
          }
        }
        bytesRead += size;
        return bytesRead;
      }
    }function _read(fildes, buf, nbyte) {
      // ssize_t read(int fildes, void *buf, size_t nbyte);
      // http://pubs.opengroup.org/onlinepubs/000095399/functions/read.html
      var stream = FS.streams[fildes];
      if (!stream) {
        ___setErrNo(ERRNO_CODES.EBADF);
        return -1;
      } else if (!stream.isRead) {
        ___setErrNo(ERRNO_CODES.EACCES);
        return -1;
      } else if (nbyte < 0) {
        ___setErrNo(ERRNO_CODES.EINVAL);
        return -1;
      } else {
        var bytesRead;
        if (stream.object.isDevice) {
          if (stream.object.input) {
            bytesRead = 0;
            while (stream.ungotten.length && nbyte > 0) {
              HEAP8[((buf++)|0)]=stream.ungotten.pop()
              nbyte--;
              bytesRead++;
            }
            for (var i = 0; i < nbyte; i++) {
              try {
                var result = stream.object.input();
              } catch (e) {
                ___setErrNo(ERRNO_CODES.EIO);
                return -1;
              }
              if (result === null || result === undefined) break;
              bytesRead++;
              HEAP8[(((buf)+(i))|0)]=result
            }
            return bytesRead;
          } else {
            ___setErrNo(ERRNO_CODES.ENXIO);
            return -1;
          }
        } else {
          var ungotSize = stream.ungotten.length;
          bytesRead = _pread(fildes, buf, nbyte, stream.position);
          if (bytesRead != -1) {
            stream.position += (stream.ungotten.length - ungotSize) + bytesRead;
          }
          return bytesRead;
        }
      }
    }function _fgetc(stream) {
      // int fgetc(FILE *stream);
      // http://pubs.opengroup.org/onlinepubs/000095399/functions/fgetc.html
      if (!FS.streams[stream]) return -1;
      var streamObj = FS.streams[stream];
      if (streamObj.eof || streamObj.error) return -1;
      var ret = _read(stream, _fgetc.ret, 1);
      if (ret == 0) {
        streamObj.eof = true;
        return -1;
      } else if (ret == -1) {
        streamObj.error = true;
        return -1;
      } else {
        return HEAPU8[((_fgetc.ret)|0)];
      }
    }var _getc=_fgetc;
  function _ungetc(c, stream) {
      // int ungetc(int c, FILE *stream);
      // http://pubs.opengroup.org/onlinepubs/000095399/functions/ungetc.html
      if (FS.streams[stream]) {
        c = unSign(c & 0xFF);
        FS.streams[stream].ungotten.push(c);
        return c;
      } else {
        return -1;
      }
    }function _fscanf(stream, format, varargs) {
      // int fscanf(FILE *restrict stream, const char *restrict format, ... );
      // http://pubs.opengroup.org/onlinepubs/000095399/functions/scanf.html
      if (FS.streams[stream]) {
        var stack = [];
        var get = function() { var ret = _fgetc(stream); stack.push(ret); return ret };
        var unget = function(c) { return _ungetc(stack.pop(), stream) };
        return __scanString(format, get, unget, varargs);
      } else {
        return -1;
      }
    }function _scanf(format, varargs) {
      // int scanf(const char *restrict format, ... );
      // http://pubs.opengroup.org/onlinepubs/000095399/functions/scanf.html
      var stdin = HEAP32[((_stdin)>>2)];
      return _fscanf(stdin, format, varargs);
    }
  function _signal(sig, func) {
      // TODO
      return 0;
    }
  function _abort() {
      ABORT = true;
      throw 'abort() at ' + (new Error().stack);
    }
  Module["_memset"] = _memset;var _llvm_memset_p0i8_i32=_memset;
  function ___errno_location() {
      return ___setErrNo.ret;
    }var ___errno=___errno_location;
  function _sysconf(name) {
      // long sysconf(int name);
      // http://pubs.opengroup.org/onlinepubs/009695399/functions/sysconf.html
      switch(name) {
        case 8: return PAGE_SIZE;
        case 54:
        case 56:
        case 21:
        case 61:
        case 63:
        case 22:
        case 67:
        case 23:
        case 24:
        case 25:
        case 26:
        case 27:
        case 69:
        case 28:
        case 101:
        case 70:
        case 71:
        case 29:
        case 30:
        case 199:
        case 75:
        case 76:
        case 32:
        case 43:
        case 44:
        case 80:
        case 46:
        case 47:
        case 45:
        case 48:
        case 49:
        case 42:
        case 82:
        case 33:
        case 7:
        case 108:
        case 109:
        case 107:
        case 112:
        case 119:
        case 121:
          return 200809;
        case 13:
        case 104:
        case 94:
        case 95:
        case 34:
        case 35:
        case 77:
        case 81:
        case 83:
        case 84:
        case 85:
        case 86:
        case 87:
        case 88:
        case 89:
        case 90:
        case 91:
        case 94:
        case 95:
        case 110:
        case 111:
        case 113:
        case 114:
        case 115:
        case 116:
        case 117:
        case 118:
        case 120:
        case 40:
        case 16:
        case 79:
        case 19:
          return -1;
        case 92:
        case 93:
        case 5:
        case 72:
        case 6:
        case 74:
        case 92:
        case 93:
        case 96:
        case 97:
        case 98:
        case 99:
        case 102:
        case 103:
        case 105:
          return 1;
        case 38:
        case 66:
        case 50:
        case 51:
        case 4:
          return 1024;
        case 15:
        case 64:
        case 41:
          return 32;
        case 55:
        case 37:
        case 17:
          return 2147483647;
        case 18:
        case 1:
          return 47839;
        case 59:
        case 57:
          return 99;
        case 68:
        case 58:
          return 2048;
        case 0: return 2097152;
        case 3: return 65536;
        case 14: return 32768;
        case 73: return 32767;
        case 39: return 16384;
        case 60: return 1000;
        case 106: return 700;
        case 52: return 256;
        case 62: return 255;
        case 2: return 100;
        case 65: return 64;
        case 36: return 20;
        case 100: return 16;
        case 20: return 6;
        case 53: return 4;
        case 10: return 1;
      }
      ___setErrNo(ERRNO_CODES.EINVAL);
      return -1;
    }
  function _time(ptr) {
      var ret = Math.floor(Date.now()/1000);
      if (ptr) {
        HEAP32[((ptr)>>2)]=ret
      }
      return ret;
    }
  function _sbrk(bytes) {
      // Implement a Linux-like 'memory area' for our 'process'.
      // Changes the size of the memory area by |bytes|; returns the
      // address of the previous top ('break') of the memory area
      // We need to make sure no one else allocates unfreeable memory!
      // We must control this entirely. So we don't even need to do
      // unfreeable allocations - the HEAP is ours, from STATICTOP up.
      // TODO: We could in theory slice off the top of the HEAP when
      //       sbrk gets a negative increment in |bytes|...
      var self = _sbrk;
      if (!self.called) {
        STATICTOP = alignMemoryPage(STATICTOP); // make sure we start out aligned
        self.called = true;
        _sbrk.DYNAMIC_START = STATICTOP;
      }
      var ret = STATICTOP;
      if (bytes != 0) Runtime.staticAlloc(bytes);
      return ret;  // Previous break location.
    }
  function ___cxa_allocate_exception(size) {
      return _malloc(size);
    }
  function _llvm_eh_exception() {
      return HEAP32[((_llvm_eh_exception.buf)>>2)];
    }
  function __ZSt18uncaught_exceptionv() { // std::uncaught_exception()
      return !!__ZSt18uncaught_exceptionv.uncaught_exception;
    }
  function ___cxa_is_number_type(type) {
      var isNumber = false;
      try { if (type == __ZTIi) isNumber = true } catch(e){}
      try { if (type == __ZTIj) isNumber = true } catch(e){}
      try { if (type == __ZTIl) isNumber = true } catch(e){}
      try { if (type == __ZTIm) isNumber = true } catch(e){}
      try { if (type == __ZTIx) isNumber = true } catch(e){}
      try { if (type == __ZTIy) isNumber = true } catch(e){}
      try { if (type == __ZTIf) isNumber = true } catch(e){}
      try { if (type == __ZTId) isNumber = true } catch(e){}
      try { if (type == __ZTIe) isNumber = true } catch(e){}
      try { if (type == __ZTIc) isNumber = true } catch(e){}
      try { if (type == __ZTIa) isNumber = true } catch(e){}
      try { if (type == __ZTIh) isNumber = true } catch(e){}
      try { if (type == __ZTIs) isNumber = true } catch(e){}
      try { if (type == __ZTIt) isNumber = true } catch(e){}
      return isNumber;
    }function ___cxa_does_inherit(definiteType, possibilityType, possibility) {
      if (possibility == 0) return false;
      if (possibilityType == 0 || possibilityType == definiteType)
        return true;
      var possibility_type_info;
      if (___cxa_is_number_type(possibilityType)) {
        possibility_type_info = possibilityType;
      } else {
        var possibility_type_infoAddr = HEAP32[((possibilityType)>>2)] - 8;
        possibility_type_info = HEAP32[((possibility_type_infoAddr)>>2)];
      }
      switch (possibility_type_info) {
      case 0: // possibility is a pointer
        // See if definite type is a pointer
        var definite_type_infoAddr = HEAP32[((definiteType)>>2)] - 8;
        var definite_type_info = HEAP32[((definite_type_infoAddr)>>2)];
        if (definite_type_info == 0) {
          // Also a pointer; compare base types of pointers
          var defPointerBaseAddr = definiteType+8;
          var defPointerBaseType = HEAP32[((defPointerBaseAddr)>>2)];
          var possPointerBaseAddr = possibilityType+8;
          var possPointerBaseType = HEAP32[((possPointerBaseAddr)>>2)];
          return ___cxa_does_inherit(defPointerBaseType, possPointerBaseType, possibility);
        } else
          return false; // one pointer and one non-pointer
      case 1: // class with no base class
        return false;
      case 2: // class with base class
        var parentTypeAddr = possibilityType + 8;
        var parentType = HEAP32[((parentTypeAddr)>>2)];
        return ___cxa_does_inherit(definiteType, parentType, possibility);
      default:
        return false; // some unencountered type
      }
    }function ___cxa_find_matching_catch(thrown, throwntype, typeArray) {
      // If throwntype is a pointer, this means a pointer has been
      // thrown. When a pointer is thrown, actually what's thrown
      // is a pointer to the pointer. We'll dereference it.
      if (throwntype != 0 && !___cxa_is_number_type(throwntype)) {
        var throwntypeInfoAddr= HEAP32[((throwntype)>>2)] - 8;
        var throwntypeInfo= HEAP32[((throwntypeInfoAddr)>>2)];
        if (throwntypeInfo == 0)
          thrown = HEAP32[((thrown)>>2)];
      }
      // The different catch blocks are denoted by different types.
      // Due to inheritance, those types may not precisely match the
      // type of the thrown object. Find one which matches, and
      // return the type of the catch block which should be called.
      for (var i = 0; i < typeArray.length; i++) {
        if (___cxa_does_inherit(typeArray[i], throwntype, thrown))
          return ((asm.setTempRet0(typeArray[i]),thrown)|0);
      }
      // Shouldn't happen unless we have bogus data in typeArray
      // or encounter a type for which emscripten doesn't have suitable
      // typeinfo defined. Best-efforts match just in case.
      return ((asm.setTempRet0(throwntype),thrown)|0);
    }function ___cxa_throw(ptr, type, destructor) {
      if (!___cxa_throw.initialized) {
        try {
          HEAP32[((__ZTVN10__cxxabiv119__pointer_type_infoE)>>2)]=0; // Workaround for libcxxabi integration bug
        } catch(e){}
        try {
          HEAP32[((__ZTVN10__cxxabiv117__class_type_infoE)>>2)]=1; // Workaround for libcxxabi integration bug
        } catch(e){}
        try {
          HEAP32[((__ZTVN10__cxxabiv120__si_class_type_infoE)>>2)]=2; // Workaround for libcxxabi integration bug
        } catch(e){}
        ___cxa_throw.initialized = true;
      }
      HEAP32[((_llvm_eh_exception.buf)>>2)]=ptr
      HEAP32[(((_llvm_eh_exception.buf)+(4))>>2)]=type
      HEAP32[(((_llvm_eh_exception.buf)+(8))>>2)]=destructor
      if (!("uncaught_exception" in __ZSt18uncaught_exceptionv)) {
        __ZSt18uncaught_exceptionv.uncaught_exception = 1;
      } else {
        __ZSt18uncaught_exceptionv.uncaught_exception++;
      }
      throw ptr + " - Exception catching is disabled, this exception cannot be caught. Compile with -s DISABLE_EXCEPTION_CATCHING=0 or DISABLE_EXCEPTION_CATCHING=2 to catch.";;
    }
  function ___cxa_call_unexpected(exception) {
      Module.printErr('Unexpected exception thrown, this is not properly supported - aborting');
      ABORT = true;
      throw exception;
    }
  function __ZNSt9exceptionD2Ev(){}
  function _fputc(c, stream) {
      // int fputc(int c, FILE *stream);
      // http://pubs.opengroup.org/onlinepubs/000095399/functions/fputc.html
      var chr = unSign(c & 0xFF);
      HEAP8[((_fputc.ret)|0)]=chr
      var ret = _write(stream, _fputc.ret, 1);
      if (ret == -1) {
        if (FS.streams[stream]) FS.streams[stream].error = true;
        return -1;
      } else {
        return chr;
      }
    }
  function _llvm_lifetime_start() {}
  function _llvm_lifetime_end() {}
  var _llvm_memset_p0i8_i64=_memset;
  function _putchar(c) {
      // int putchar(int c);
      // http://pubs.opengroup.org/onlinepubs/000095399/functions/putchar.html
      return _fputc(c, HEAP32[((_stdout)>>2)]);
    }
  var Browser={mainLoop:{scheduler:null,shouldPause:false,paused:false,queue:[],pause:function () {
          Browser.mainLoop.shouldPause = true;
        },resume:function () {
          if (Browser.mainLoop.paused) {
            Browser.mainLoop.paused = false;
            Browser.mainLoop.scheduler();
          }
          Browser.mainLoop.shouldPause = false;
        },updateStatus:function () {
          if (Module['setStatus']) {
            var message = Module['statusMessage'] || 'Please wait...';
            var remaining = Browser.mainLoop.remainingBlockers;
            var expected = Browser.mainLoop.expectedBlockers;
            if (remaining) {
              if (remaining < expected) {
                Module['setStatus'](message + ' (' + (expected - remaining) + '/' + expected + ')');
              } else {
                Module['setStatus'](message);
              }
            } else {
              Module['setStatus']('');
            }
          }
        }},isFullScreen:false,pointerLock:false,moduleContextCreatedCallbacks:[],workers:[],init:function () {
        if (Browser.initted) return;
        Browser.initted = true;
        try {
          new Blob();
          Browser.hasBlobConstructor = true;
        } catch(e) {
          Browser.hasBlobConstructor = false;
          console.log("warning: no blob constructor, cannot create blobs with mimetypes");
        }
        Browser.BlobBuilder = typeof MozBlobBuilder != "undefined" ? MozBlobBuilder : (typeof WebKitBlobBuilder != "undefined" ? WebKitBlobBuilder : (!Browser.hasBlobConstructor ? console.log("warning: no BlobBuilder") : null));
        Browser.URLObject = typeof window != "undefined" ? (window.URL ? window.URL : window.webkitURL) : console.log("warning: cannot create object URLs");
        // Support for plugins that can process preloaded files. You can add more of these to
        // your app by creating and appending to Module.preloadPlugins.
        //
        // Each plugin is asked if it can handle a file based on the file's name. If it can,
        // it is given the file's raw data. When it is done, it calls a callback with the file's
        // (possibly modified) data. For example, a plugin might decompress a file, or it
        // might create some side data structure for use later (like an Image element, etc.).
        function getMimetype(name) {
          return {
            'jpg': 'image/jpeg',
            'jpeg': 'image/jpeg',
            'png': 'image/png',
            'bmp': 'image/bmp',
            'ogg': 'audio/ogg',
            'wav': 'audio/wav',
            'mp3': 'audio/mpeg'
          }[name.substr(-3)];
          return ret;
        }
        if (!Module["preloadPlugins"]) Module["preloadPlugins"] = [];
        var imagePlugin = {};
        imagePlugin['canHandle'] = function(name) {
          return !Module.noImageDecoding && /\.(jpg|jpeg|png|bmp)$/.exec(name);
        };
        imagePlugin['handle'] = function(byteArray, name, onload, onerror) {
          var b = null;
          if (Browser.hasBlobConstructor) {
            try {
              b = new Blob([byteArray], { type: getMimetype(name) });
            } catch(e) {
              Runtime.warnOnce('Blob constructor present but fails: ' + e + '; falling back to blob builder');
            }
          }
          if (!b) {
            var bb = new Browser.BlobBuilder();
            bb.append((new Uint8Array(byteArray)).buffer); // we need to pass a buffer, and must copy the array to get the right data range
            b = bb.getBlob();
          }
          var url = Browser.URLObject.createObjectURL(b);
          var img = new Image();
          img.onload = function() {
            assert(img.complete, 'Image ' + name + ' could not be decoded');
            var canvas = document.createElement('canvas');
            canvas.width = img.width;
            canvas.height = img.height;
            var ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0);
            Module["preloadedImages"][name] = canvas;
            Browser.URLObject.revokeObjectURL(url);
            if (onload) onload(byteArray);
          };
          img.onerror = function(event) {
            console.log('Image ' + url + ' could not be decoded');
            if (onerror) onerror();
          };
          img.src = url;
        };
        Module['preloadPlugins'].push(imagePlugin);
        var audioPlugin = {};
        audioPlugin['canHandle'] = function(name) {
          return !Module.noAudioDecoding && name.substr(-4) in { '.ogg': 1, '.wav': 1, '.mp3': 1 };
        };
        audioPlugin['handle'] = function(byteArray, name, onload, onerror) {
          var done = false;
          function finish(audio) {
            if (done) return;
            done = true;
            Module["preloadedAudios"][name] = audio;
            if (onload) onload(byteArray);
          }
          function fail() {
            if (done) return;
            done = true;
            Module["preloadedAudios"][name] = new Audio(); // empty shim
            if (onerror) onerror();
          }
          if (Browser.hasBlobConstructor) {
            try {
              var b = new Blob([byteArray], { type: getMimetype(name) });
            } catch(e) {
              return fail();
            }
            var url = Browser.URLObject.createObjectURL(b); // XXX we never revoke this!
            var audio = new Audio();
            audio.addEventListener('canplaythrough', function() { finish(audio) }, false); // use addEventListener due to chromium bug 124926
            audio.onerror = function(event) {
              if (done) return;
              console.log('warning: browser could not fully decode audio ' + name + ', trying slower base64 approach');
              function encode64(data) {
                var BASE = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
                var PAD = '=';
                var ret = '';
                var leftchar = 0;
                var leftbits = 0;
                for (var i = 0; i < data.length; i++) {
                  leftchar = (leftchar << 8) | data[i];
                  leftbits += 8;
                  while (leftbits >= 6) {
                    var curr = (leftchar >> (leftbits-6)) & 0x3f;
                    leftbits -= 6;
                    ret += BASE[curr];
                  }
                }
                if (leftbits == 2) {
                  ret += BASE[(leftchar&3) << 4];
                  ret += PAD + PAD;
                } else if (leftbits == 4) {
                  ret += BASE[(leftchar&0xf) << 2];
                  ret += PAD;
                }
                return ret;
              }
              audio.src = 'data:audio/x-' + name.substr(-3) + ';base64,' + encode64(byteArray);
              finish(audio); // we don't wait for confirmation this worked - but it's worth trying
            };
            audio.src = url;
            // workaround for chrome bug 124926 - we do not always get oncanplaythrough or onerror
            setTimeout(function() {
              finish(audio); // try to use it even though it is not necessarily ready to play
            }, 10000);
          } else {
            return fail();
          }
        };
        Module['preloadPlugins'].push(audioPlugin);
        // Canvas event setup
        var canvas = Module['canvas'];
        canvas.requestPointerLock = canvas['requestPointerLock'] ||
                                    canvas['mozRequestPointerLock'] ||
                                    canvas['webkitRequestPointerLock'];
        canvas.exitPointerLock = document['exitPointerLock'] ||
                                 document['mozExitPointerLock'] ||
                                 document['webkitExitPointerLock'];
        canvas.exitPointerLock = canvas.exitPointerLock.bind(document);
        function pointerLockChange() {
          Browser.pointerLock = document['pointerLockElement'] === canvas ||
                                document['mozPointerLockElement'] === canvas ||
                                document['webkitPointerLockElement'] === canvas;
        }
        document.addEventListener('pointerlockchange', pointerLockChange, false);
        document.addEventListener('mozpointerlockchange', pointerLockChange, false);
        document.addEventListener('webkitpointerlockchange', pointerLockChange, false);
        if (Module['elementPointerLock']) {
          canvas.addEventListener("click", function(ev) {
            if (!Browser.pointerLock && canvas.requestPointerLock) {
              canvas.requestPointerLock();
              ev.preventDefault();
            }
          }, false);
        }
      },createContext:function (canvas, useWebGL, setInModule) {
        var ctx;
        try {
          if (useWebGL) {
            ctx = canvas.getContext('experimental-webgl', {
              alpha: false
            });
          } else {
            ctx = canvas.getContext('2d');
          }
          if (!ctx) throw ':(';
        } catch (e) {
          Module.print('Could not create canvas - ' + e);
          return null;
        }
        if (useWebGL) {
          // Set the background of the WebGL canvas to black
          canvas.style.backgroundColor = "black";
          // Warn on context loss
          canvas.addEventListener('webglcontextlost', function(event) {
            alert('WebGL context lost. You will need to reload the page.');
          }, false);
        }
        if (setInModule) {
          Module.ctx = ctx;
          Module.useWebGL = useWebGL;
          Browser.moduleContextCreatedCallbacks.forEach(function(callback) { callback() });
          Browser.init();
        }
        return ctx;
      },destroyContext:function (canvas, useWebGL, setInModule) {},fullScreenHandlersInstalled:false,lockPointer:undefined,resizeCanvas:undefined,requestFullScreen:function (lockPointer, resizeCanvas) {
        this.lockPointer = lockPointer;
        this.resizeCanvas = resizeCanvas;
        if (typeof this.lockPointer === 'undefined') this.lockPointer = true;
        if (typeof this.resizeCanvas === 'undefined') this.resizeCanvas = false;
        var canvas = Module['canvas'];
        function fullScreenChange() {
          Browser.isFullScreen = false;
          if ((document['webkitFullScreenElement'] || document['webkitFullscreenElement'] ||
               document['mozFullScreenElement'] || document['mozFullscreenElement'] ||
               document['fullScreenElement'] || document['fullscreenElement']) === canvas) {
            canvas.cancelFullScreen = document['cancelFullScreen'] ||
                                      document['mozCancelFullScreen'] ||
                                      document['webkitCancelFullScreen'];
            canvas.cancelFullScreen = canvas.cancelFullScreen.bind(document);
            if (Browser.lockPointer) canvas.requestPointerLock();
            Browser.isFullScreen = true;
            if (Browser.resizeCanvas) Browser.setFullScreenCanvasSize();
          } else if (Browser.resizeCanvas){
            Browser.setWindowedCanvasSize();
          }
          if (Module['onFullScreen']) Module['onFullScreen'](Browser.isFullScreen);
        }
        if (!this.fullScreenHandlersInstalled) {
          this.fullScreenHandlersInstalled = true;
          document.addEventListener('fullscreenchange', fullScreenChange, false);
          document.addEventListener('mozfullscreenchange', fullScreenChange, false);
          document.addEventListener('webkitfullscreenchange', fullScreenChange, false);
        }
        canvas.requestFullScreen = canvas['requestFullScreen'] ||
                                   canvas['mozRequestFullScreen'] ||
                                   (canvas['webkitRequestFullScreen'] ? function() { canvas['webkitRequestFullScreen'](Element['ALLOW_KEYBOARD_INPUT']) } : null);
        canvas.requestFullScreen(); 
      },requestAnimationFrame:function (func) {
        if (!window.requestAnimationFrame) {
          window.requestAnimationFrame = window['requestAnimationFrame'] ||
                                         window['mozRequestAnimationFrame'] ||
                                         window['webkitRequestAnimationFrame'] ||
                                         window['msRequestAnimationFrame'] ||
                                         window['oRequestAnimationFrame'] ||
                                         window['setTimeout'];
        }
        window.requestAnimationFrame(func);
      },getMovementX:function (event) {
        return event['movementX'] ||
               event['mozMovementX'] ||
               event['webkitMovementX'] ||
               0;
      },getMovementY:function (event) {
        return event['movementY'] ||
               event['mozMovementY'] ||
               event['webkitMovementY'] ||
               0;
      },xhrLoad:function (url, onload, onerror) {
        var xhr = new XMLHttpRequest();
        xhr.open('GET', url, true);
        xhr.responseType = 'arraybuffer';
        xhr.onload = function() {
          if (xhr.status == 200) {
            onload(xhr.response);
          } else {
            onerror();
          }
        };
        xhr.onerror = onerror;
        xhr.send(null);
      },asyncLoad:function (url, onload, onerror, noRunDep) {
        Browser.xhrLoad(url, function(arrayBuffer) {
          assert(arrayBuffer, 'Loading data file "' + url + '" failed (no arrayBuffer).');
          onload(new Uint8Array(arrayBuffer));
          if (!noRunDep) removeRunDependency('al ' + url);
        }, function(event) {
          if (onerror) {
            onerror();
          } else {
            throw 'Loading data file "' + url + '" failed.';
          }
        });
        if (!noRunDep) addRunDependency('al ' + url);
      },resizeListeners:[],updateResizeListeners:function () {
        var canvas = Module['canvas'];
        Browser.resizeListeners.forEach(function(listener) {
          listener(canvas.width, canvas.height);
        });
      },setCanvasSize:function (width, height, noUpdates) {
        var canvas = Module['canvas'];
        canvas.width = width;
        canvas.height = height;
        if (!noUpdates) Browser.updateResizeListeners();
      },windowedWidth:0,windowedHeight:0,setFullScreenCanvasSize:function () {
        var canvas = Module['canvas'];
        this.windowedWidth = canvas.width;
        this.windowedHeight = canvas.height;
        canvas.width = screen.width;
        canvas.height = screen.height;
        var flags = HEAPU32[((SDL.screen+Runtime.QUANTUM_SIZE*0)>>2)];
        flags = flags | 0x00800000; // set SDL_FULLSCREEN flag
        HEAP32[((SDL.screen+Runtime.QUANTUM_SIZE*0)>>2)]=flags
        Browser.updateResizeListeners();
      },setWindowedCanvasSize:function () {
        var canvas = Module['canvas'];
        canvas.width = this.windowedWidth;
        canvas.height = this.windowedHeight;
        var flags = HEAPU32[((SDL.screen+Runtime.QUANTUM_SIZE*0)>>2)];
        flags = flags & ~0x00800000; // clear SDL_FULLSCREEN flag
        HEAP32[((SDL.screen+Runtime.QUANTUM_SIZE*0)>>2)]=flags
        Browser.updateResizeListeners();
      }};
__ATINIT__.unshift({ func: function() { if (!Module["noFSInit"] && !FS.init.initialized) FS.init() } });__ATMAIN__.push({ func: function() { FS.ignorePermissions = false } });__ATEXIT__.push({ func: function() { FS.quit() } });Module["FS_createFolder"] = FS.createFolder;Module["FS_createPath"] = FS.createPath;Module["FS_createDataFile"] = FS.createDataFile;Module["FS_createPreloadedFile"] = FS.createPreloadedFile;Module["FS_createLazyFile"] = FS.createLazyFile;Module["FS_createLink"] = FS.createLink;Module["FS_createDevice"] = FS.createDevice;
___setErrNo(0);
___strtok_state = Runtime.staticAlloc(4);
_fgetc.ret = allocate([0], "i8", ALLOC_STATIC);
_llvm_eh_exception.buf = allocate(12, "void*", ALLOC_STATIC);
_fputc.ret = allocate([0], "i8", ALLOC_STATIC);
Module["requestFullScreen"] = function(lockPointer, resizeCanvas) { Browser.requestFullScreen(lockPointer, resizeCanvas) };
  Module["requestAnimationFrame"] = function(func) { Browser.requestAnimationFrame(func) };
  Module["pauseMainLoop"] = function() { Browser.mainLoop.pause() };
  Module["resumeMainLoop"] = function() { Browser.mainLoop.resume() };
var Math_min = Math.min;
function asmPrintInt(x, y) {
  Module.print('int ' + x + ',' + y);// + ' ' + new Error().stack);
}
function asmPrintFloat(x, y) {
  Module.print('float ' + x + ',' + y);// + ' ' + new Error().stack);
}
// EMSCRIPTEN_START_ASM
var asm=(function(global,env,buffer){"use asm";var a=new global.Int8Array(buffer);var b=new global.Int16Array(buffer);var c=new global.Int32Array(buffer);var d=new global.Uint8Array(buffer);var e=new global.Uint16Array(buffer);var f=new global.Uint32Array(buffer);var g=new global.Float32Array(buffer);var h=new global.Float64Array(buffer);var i=env.STACKTOP|0;var j=env.STACK_MAX|0;var k=env.tempDoublePtr|0;var l=env.ABORT|0;var m=env._stdout|0;var n=env.__ZTVN10__cxxabiv120__si_class_type_infoE|0;var o=env.__ZTISt9exception|0;var p=env._stderr|0;var q=+env.NaN;var r=+env.Infinity;var s=0;var t=0;var u=0,v=0,w=0,x=0,y=0.0,z=0,A=0,B=0,C=0.0;var D=0;var E=0;var F=0;var G=0;var H=0;var I=0;var J=0;var K=0;var L=0;var M=0;var N=global.Math.floor;var O=global.Math.abs;var P=global.Math.sqrt;var Q=global.Math.pow;var R=global.Math.cos;var S=global.Math.sin;var T=global.Math.tan;var U=global.Math.acos;var V=global.Math.asin;var W=global.Math.atan;var X=global.Math.atan2;var Y=global.Math.exp;var Z=global.Math.log;var _=global.Math.ceil;var $=global.Math.imul;var aa=env.abort;var ab=env.assert;var ac=env.asmPrintInt;var ad=env.asmPrintFloat;var ae=env.copyTempDouble;var af=env.copyTempFloat;var ag=env.min;var ah=env._strncmp;var ai=env._llvm_lifetime_end;var aj=env._sysconf;var ak=env.__scanString;var al=env.___cxa_throw;var am=env.__isFloat;var an=env._strtok_r;var ao=env._abort;var ap=env._fprintf;var aq=env._printf;var ar=env._pread;var as=env._fflush;var at=env.__reallyNegative;var au=env._fputc;var av=env._strtok;var aw=env.___setErrNo;var ax=env._fwrite;var ay=env._scanf;var az=env._llvm_eh_exception;var aA=env._write;var aB=env._fgetc;var aC=env._exit;var aD=env.___cxa_find_matching_catch;var aE=env.___cxa_allocate_exception;var aF=env._read;var aG=env.___cxa_is_number_type;var aH=env.__formatString;var aI=env.___cxa_does_inherit;var aJ=env.__ZSt18uncaught_exceptionv;var aK=env._pwrite;var aL=env._putchar;var aM=env.___cxa_call_unexpected;var aN=env._sbrk;var aO=env._fscanf;var aP=env._signal;var aQ=env.___errno_location;var aR=env.___gxx_personality_v0;var aS=env.__ZNSt9exceptionD2Ev;var aT=env._time;var aU=env._ungetc;var aV=env.__exit;var aW=env._strcmp;var aX=env._llvm_lifetime_start;
// EMSCRIPTEN_START_FUNCS
function a0(a){a=a|0;var b=0;b=i;i=i+a|0;i=i+3>>2<<2;return b|0}function a1(){return i|0}function a2(a){a=a|0;i=a}function a3(a){a=a|0;s=a}function a4(a){a=a|0;D=a}function a5(a){a=a|0;E=a}function a6(a){a=a|0;F=a}function a7(a){a=a|0;G=a}function a8(a){a=a|0;H=a}function a9(a){a=a|0;I=a}function ba(a){a=a|0;J=a}function bb(a){a=a|0;K=a}function bc(a){a=a|0;L=a}function bd(a){a=a|0;M=a}function be(a){a=a|0;var b=0,d=0,e=0,f=0,g=0,h=0,i=0,j=0,k=0,l=0,m=0,n=0,o=0,p=0,q=0,r=0,s=0,t=0,u=0,v=0,w=0,x=0,y=0,z=0,A=0,B=0,C=0;b=c[a+52>>2]|0;d=c[a+48>>2]|0;L1:do{if((d-b|0)>0){e=0;f=b;g=0;while(1){if((c[a+(e<<2)>>2]|0)==0){h=g;i=f}else{j=f-1|0;L6:do{if((f|0)>0){k=d-e|0;l=f;m=1;n=1;while(1){o=k-1|0;p=$(o,m);q=$(l,n);r=l-1|0;if((r|0)>0){k=o;l=r;m=p;n=q}else{s=p;t=q;break L6}}}else{s=1;t=1}}while(0);h=((s|0)/(t|0)&-1)+g|0;i=j}n=e+1|0;if((n|0)<(d-i|0)){e=n;f=i;g=h}else{u=h;break L1}}}else{u=0}}while(0);h=$(c[a+60>>2]|0,u);u=d-1|0;if((u|0)>0){v=0;w=0}else{x=0;y=x+h|0;return y|0}while(1){i=c[a+(v<<2)>>2]|0;if((i|0)==0){z=w}else{t=0;s=w;b=v;L18:while(1){g=b;while(1){A=g+1|0;if((A|0)>=(d|0)){break L18}B=c[a+(A<<2)>>2]|0;if((B|0)==0){g=A}else{break}}t=t+1|0;s=((B|0)<(i|0)&1)+s|0;b=A}if((t|0)<2){x=s;C=19;break}z=$(t,s)}b=v+1|0;if((b|0)<(u|0)){v=b;w=z}else{x=0;C=20;break}}if((C|0)==19){y=x+h|0;return y|0}else if((C|0)==20){y=x+h|0;return y|0}return 0}function bf(a,b){a=a|0;b=b|0;var d=0,e=0,f=0,g=0,h=0,i=0,j=0,k=0,l=0,m=0,n=0,o=0,p=0,q=0,r=0,s=0,t=0,u=0,v=0,w=0,x=0,y=0;d=a+60|0;e=a+48|0;f=c[e>>2]|0;L31:do{if((f|0)>0){g=0;h=c[a+52>>2]|0;i=(b|0)/(c[d>>2]|0)&-1;j=f;while(1){L35:do{if((h|0)>0){k=j-g|0;l=h;m=1;n=1;while(1){o=k-1|0;p=$(o,m);q=$(l,n);r=l-1|0;if((r|0)>0){k=o;l=r;m=p;n=q}else{s=p;t=q;break L35}}}else{s=1;t=1}}while(0);n=(s|0)/(t|0)&-1;if((n|0)>(i|0)){c[a+(g<<2)>>2]=0;u=i;v=h}else{c[a+(g<<2)>>2]=1;u=i-n|0;v=h-1|0}n=g+1|0;m=c[e>>2]|0;if((n|0)<(m|0)){g=n;h=v;i=u;j=m}else{w=m;break L31}}}else{w=f}}while(0);f=1;u=w;w=(b|0)%(c[d>>2]|0);L45:while(1){d=u;while(1){x=d-1|0;if((d|0)<=0){break L45}y=a+(x<<2)|0;if((c[y>>2]|0)==0){d=x}else{break}}c[y>>2]=(w|0)%(f|0)+1|0;d=(w|0)/(f|0)&-1;b=(c[e>>2]|0)-1|0;L51:do{if((b|0)>(x|0)){v=b;while(1){t=a+(v<<2)|0;s=c[t>>2]|0;do{if((s|0)!=0){if((s|0)<(c[y>>2]|0)){break}c[t>>2]=s+1|0}}while(0);s=v-1|0;if((s|0)>(x|0)){v=s}else{break L51}}}}while(0);f=f+1|0;u=x;w=d}return}function bg(a){a=a|0;var b=0,d=0,e=0;b=i;i=i+584|0;d=b|0;e=d+568|0;c[e>>2]=c[1312500]|0;c[e+4>>2]=c[1312501]|0;c[e+8>>2]=c[1312502]|0;c[e+12>>2]=c[1312503]|0;e=bl(d,a)|0;do{if((e|0)==2){bm(d)}else if((e|0)==0){if((bn(d)|0)!=0){break}bo(d)}}while(0);bt(d);i=b;return}function bh(){var a=0,b=0,d=0;a=i;i=i+584|0;b=a|0;d=b+568|0;c[d>>2]=c[1312500]|0;c[d+4>>2]=c[1312501]|0;c[d+8>>2]=c[1312502]|0;c[d+12>>2]=c[1312503]|0;d=bl(b,5246308)|0;do{if((d|0)==2){bm(b)}else if((d|0)==0){if((bn(b)|0)!=0){break}bo(b)}}while(0);bt(b);i=a;return}function bi(b){b=b|0;var c=0,d=0,e=0;c=a[b]|0;if(c<<24>>24==0){return}else{d=1;e=c}while(1){bk(525e4,e);if(d>>>0>=(cU(b)|0)>>>0){break}c=a[b+d|0]|0;d=d+1|0;e=c}return}function bj(b,d){b=b|0;d=d|0;var e=0,f=0,g=0,h=0,j=0,k=0,l=0,m=0;e=i;c[1312500]=2;c[1312501]=0;c[1312502]=0;c[1312503]=0;L80:do{if((b|0)>1){f=1;while(1){g=d+(f<<2)|0;h=a[c[g>>2]|0]|0;L83:do{if(h<<24>>24!=0){j=0;k=h;while(1){bk(525e4,k);l=j+1|0;m=a[(c[g>>2]|0)+l|0]|0;if(m<<24>>24==0){break L83}else{j=l;k=m}}}}while(0);g=f+1|0;if((g|0)==(b|0)){break L80}else{f=g}}}}while(0);au(10,c[p>>2]|0);aq(5246176,(u=i,i=i+1|0,i=i+3>>2<<2,c[u>>2]=0,u)|0);i=e;return 0}function bk(a,b){a=a|0;b=b|0;var d=0,e=0;d=i;e=b<<24>>24;if((e|0)==111){c[a+8>>2]=1;b=c[p>>2]|0;ax(5244372,19,1,b|0);i=d;return}else if((e|0)==112){c[a+8>>2]=0;ax(5243992,20,1,c[p>>2]|0);i=d;return}else if((e|0)==102){c[a>>2]=2;ax(5243532,22,1,c[p>>2]|0);i=d;return}else if((e|0)==115){c[a>>2]=3;ax(5243400,23,1,c[p>>2]|0);i=d;return}else if((e|0)==99){c[a+12>>2]=1;ax(5243224,16,1,c[p>>2]|0);i=d;return}else if((e|0)==100){c[a+12>>2]=0;ax(5243060,17,1,c[p>>2]|0);i=d;return}else if((e|0)==98){c[a+4>>2]=0;ax(5245440,16,1,c[p>>2]|0);i=d;return}else if((e|0)==113){c[a>>2]=1;ax(5243728,25,1,c[p>>2]|0);i=d;return}else if((e|0)==63|(e|0)==104){ax(5246936,186,1,c[p>>2]|0);aC(0)}else if((e|0)==97){c[a+4>>2]=1;ax(5246920,15,1,c[p>>2]|0);i=d;return}else{ap(c[p>>2]|0,5246896,(u=i,i=i+4|0,c[u>>2]=e,u)|0);i=d;return}}function bl(b,d){b=b|0;d=d|0;var e=0,f=0,g=0,h=0,j=0,k=0,l=0,n=0,o=0,q=0,r=0,s=0,t=0,w=0,x=0,y=0,z=0,A=0,B=0,C=0,D=0,E=0,F=0,G=0,H=0,I=0,J=0,K=0,L=0,M=0,N=0,O=0,P=0,Q=0,R=0,S=0;e=i;i=i+336|0;f=e|0;g=e+48|0;ax(5245884,65,1,c[p>>2]|0);ax(5246408,69,1,c[p>>2]|0);ax(5244896,271,1,c[p>>2]|0);h=e+80|0;cW(h,d);d=0;while(1){if((d|0)>=12){j=0;break}if((d|0)==0){k=av(h|0,5244232)|0;c[f>>2]=k;l=k}else{k=av(0,5244232)|0;c[f+(d<<2)>>2]=k;l=k}aq(5243320,(u=i,i=i+4|0,c[u>>2]=l,u)|0);as(c[m>>2]|0);if((aW(l|0,5243584)|0)==0){n=-1;o=232;break}if((aW(l|0,5243452)|0)==0){n=-1;o=233;break}if((aW(l|0,5243272)|0)==0){n=2;o=234;break}if((aW(l|0,5243108)|0)==0){n=2;o=226;break}if((aW(l|0,5242932)|0)==0){n=1;o=227;break}if((aW(l|0,5246756)|0)==0){n=1;o=228;break}if((aW(l|0,5246512)|0)==0){q=d;o=97;break}if((aW(l|0,5246144)|0)==0){r=d;o=99;break}if((aW(l|0,5246028)|0)==0){s=d;o=101;break}if((aW(l|0,5245800)|0)==0){t=d;o=103;break}else{d=d+1|0}}L128:do{if((o|0)==103){while(1){o=0;d=c[f+(t<<2)>>2]|0;a[d]=a[5245692]|0;a[d+1|0]=a[5245693|0]|0;a[d+2|0]=a[5245694|0]|0;d=t+1|0;if((d|0)==12){j=0;break L128}else{t=d;o=103}}}else if((o|0)==97){while(1){o=0;d=c[f+(q<<2)>>2]|0;v=33;a[d]=v&255;v=v>>8;a[d+1|0]=v&255;d=q+1|0;if((d|0)==12){j=0;break L128}else{q=d;o=97}}}else if((o|0)==99){while(1){o=0;d=c[f+(r<<2)>>2]|0;a[d]=a[5246032]|0;a[d+1|0]=a[5246033|0]|0;a[d+2|0]=a[5246034|0]|0;d=r+1|0;if((d|0)==12){j=0;break L128}else{r=d;o=99}}}else if((o|0)==101){while(1){o=0;d=c[f+(s<<2)>>2]|0;v=63;a[d]=v&255;v=v>>8;a[d+1|0]=v&255;d=s+1|0;if((d|0)==12){j=0;break L128}else{s=d;o=101}}}else if((o|0)==226){i=e;return n|0}else if((o|0)==227){i=e;return n|0}else if((o|0)==228){i=e;return n|0}else if((o|0)==232){i=e;return n|0}else if((o|0)==233){i=e;return n|0}else if((o|0)==234){i=e;return n|0}}while(0);while(1){if((j|0)>=8){w=0;break}s=av(0,5244232)|0;c[g+(j<<2)>>2]=s;aq(5243320,(u=i,i=i+4|0,c[u>>2]=s,u)|0);as(c[m>>2]|0);if((aW(s|0,5243584)|0)==0){n=-1;o=223;break}if((aW(s|0,5243452)|0)==0){n=-1;o=224;break}r=c[f+(j<<2)>>2]|0;if((aW(r|0,5243272)|0)==0){n=2;o=225;break}if((aW(r|0,5243108)|0)==0){n=2;o=229;break}if((aW(r|0,5242932)|0)==0){n=1;o=230;break}if((aW(r|0,5246756)|0)==0){n=1;o=231;break}if((aW(s|0,5246512)|0)==0){x=j;y=s;o=112;break}if((aW(s|0,5246144)|0)==0){z=j;A=s;o=115;break}if((aW(s|0,5246028)|0)==0){B=j;C=s;o=118;break}if((aW(s|0,5245800)|0)==0){D=j;E=s;o=121;break}else{j=j+1|0}}L155:do{if((o|0)==112){while(1){o=0;j=y;v=33;a[j]=v&255;v=v>>8;a[j+1|0]=v&255;j=x+1|0;if((j|0)==8){w=0;break L155}x=j;y=c[g+(j<<2)>>2]|0}}else if((o|0)==115){while(1){o=0;a[A]=a[5246032]|0;a[A+1|0]=a[5246033|0]|0;a[A+2|0]=a[5246034|0]|0;j=z+1|0;if((j|0)==8){w=0;break L155}z=j;A=c[g+(j<<2)>>2]|0}}else if((o|0)==118){while(1){o=0;j=C;v=63;a[j]=v&255;v=v>>8;a[j+1|0]=v&255;j=B+1|0;if((j|0)==8){w=0;break L155}B=j;C=c[g+(j<<2)>>2]|0}}else if((o|0)==121){while(1){o=0;a[E]=a[5245692]|0;a[E+1|0]=a[5245693|0]|0;a[E+2|0]=a[5245694|0]|0;j=D+1|0;if((j|0)==8){w=0;break L155}D=j;E=c[g+(j<<2)>>2]|0}}else if((o|0)==223){i=e;return n|0}else if((o|0)==224){i=e;return n|0}else if((o|0)==225){i=e;return n|0}else if((o|0)==229){i=e;return n|0}else if((o|0)==230){i=e;return n|0}else if((o|0)==231){i=e;return n|0}}while(0);while(1){c[b+(w<<2)>>2]=0;c[b+80+(w<<2)>>2]=0;c[b+160+(w<<2)>>2]=0;c[b+240+(w<<2)>>2]=1;c[b+320+(w<<2)>>2]=-1;E=w+1|0;if((E|0)==12){F=0;G=0;break}else{w=E}}while(1){w=c[f+(F<<2)>>2]|0;do{if((aW(w|0,5246192)|0)==0){E=F+1|0;c[b+(F<<2)>>2]=E;c[b+80+(F<<2)>>2]=E;c[b+160+(F<<2)>>2]=1;c[b+240+(F<<2)>>2]=0;c[b+320+(F<<2)>>2]=0;H=G}else{if((aW(w|0,5246032)|0)==0){E=F+1|0;c[b+(F<<2)>>2]=E;c[b+80+(F<<2)>>2]=E;c[b+240+(F<<2)>>2]=0;c[b+320+(F<<2)>>2]=1;H=G;break}if((aW(w|0,5245604)|0)==0){c[b+(F<<2)>>2]=F+13|0;c[b+80+(F<<2)>>2]=F+1|0;c[b+160+(F<<2)>>2]=2;c[b+240+(F<<2)>>2]=0;c[b+320+(F<<2)>>2]=0;H=G;break}if((aW(w|0,5245804)|0)==0){c[b+160+(F<<2)>>2]=1;H=G;break}if((aW(w|0,5245692)|0)==0){H=G;break}if((aW(w|0,5245436)|0)==0){c[b+160+(F<<2)>>2]=2;H=G;break}E=a[w]|0;if((E<<24>>24|0)==64){D=0;while(1){if((D|0)>=24){break}if((aW(w+1|0,c[5249544+(D<<2)>>2]|0)|0)==0){o=138;break}else{D=D+1|0}}if((o|0)==138){o=0;C=(D|0)%12;c[b+(F<<2)>>2]=C+1|0;B=(C|0)%12;C=b+80+(F<<2)|0;c[C>>2]=B+1|0;c[b+240+(B<<2)>>2]=0;c[b+320+((c[C>>2]|0)-1<<2)>>2]=1;H=G;break}if((D|0)!=24){H=G;break}ap(c[p>>2]|0,5245300,(u=i,i=i+4|0,c[u>>2]=w,u)|0);H=1;break}else if((E<<24>>24|0)==45){C=0;while(1){if((C|0)>=24){break}if((aW(w+1|0,c[5249544+(C<<2)>>2]|0)|0)==0){o=143;break}else{C=C+1|0}}if((o|0)==143){o=0;E=(C+12|0)%24;c[b+(F<<2)>>2]=E+1|0;D=(E|0)%12;B=b+80+(F<<2)|0;c[B>>2]=D+1|0;c[b+160+(F<<2)>>2]=((E|0)/12&-1)+1|0;c[b+240+(D<<2)>>2]=0;c[b+320+((c[B>>2]|0)-1<<2)>>2]=0;H=G;break}if((C|0)!=24){H=G;break}ap(c[p>>2]|0,5245300,(u=i,i=i+4|0,c[u>>2]=w,u)|0);H=1;break}else{B=0;while(1){if((B|0)>=24){break}I=B+1|0;if((aW(w|0,c[5249544+(B<<2)>>2]|0)|0)==0){o=148;break}else{B=I}}if((o|0)==148){o=0;c[b+(F<<2)>>2]=I;C=(B|0)%12;D=b+80+(F<<2)|0;c[D>>2]=C+1|0;c[b+160+(F<<2)>>2]=((B|0)/12&-1)+1|0;c[b+240+(C<<2)>>2]=0;c[b+320+((c[D>>2]|0)-1<<2)>>2]=0;H=G;break}if((B|0)!=24){H=G;break}ap(c[p>>2]|0,5245300,(u=i,i=i+4|0,c[u>>2]=w,u)|0);H=1;break}}}while(0);w=F+1|0;if((w|0)==12){J=0;K=H;break}else{F=w;G=H}}while(1){do{if((c[b+80+(J<<2)>>2]|0)==0){if((c[b+160+(J<<2)>>2]|0)==0){H=0;while(1){if((H|0)>=12){break}if((c[b+320+(H<<2)>>2]|0)==-1){break}else{H=H+1|0}}if((H|0)==12){B=c[p>>2]|0;ax(5244824,45,1,B|0);L=1;break}else{c[b+320+(H<<2)>>2]=1;L=K;break}}else{B=0;while(1){if((B|0)>=12){break}if((c[b+320+(B<<2)>>2]|0)==-1){break}else{B=B+1|0}}if((B|0)==12){H=c[p>>2]|0;ax(5244824,45,1,H|0);L=1;break}else{c[b+320+(B<<2)>>2]=0;L=K;break}}}else{L=K}}while(0);H=J+1|0;if((H|0)==12){M=0;break}else{J=H;K=L}}while(1){if((M|0)>=12){N=L;break}if((c[b+320+(M<<2)>>2]|0)==-1){o=167;break}else{M=M+1|0}}if((o|0)==167){M=c[p>>2]|0;ax(5244824,45,1,M|0);N=1}c[b+48>>2]=0;c[b+128>>2]=0;c[b+208>>2]=0;c[b+288>>2]=1;c[b+368>>2]=-1;c[b+52>>2]=0;c[b+132>>2]=0;c[b+212>>2]=0;c[b+292>>2]=1;c[b+372>>2]=-1;c[b+56>>2]=0;c[b+136>>2]=0;c[b+216>>2]=0;c[b+296>>2]=1;c[b+376>>2]=-1;c[b+60>>2]=0;c[b+140>>2]=0;c[b+220>>2]=0;c[b+300>>2]=1;c[b+380>>2]=-1;c[b+64>>2]=0;c[b+144>>2]=0;c[b+224>>2]=0;c[b+304>>2]=1;c[b+384>>2]=-1;c[b+68>>2]=0;c[b+148>>2]=0;c[b+228>>2]=0;c[b+308>>2]=1;c[b+388>>2]=-1;c[b+72>>2]=0;c[b+152>>2]=0;c[b+232>>2]=0;c[b+312>>2]=1;c[b+392>>2]=-1;c[b+76>>2]=0;c[b+156>>2]=0;c[b+236>>2]=0;c[b+316>>2]=1;c[b+396>>2]=-1;M=0;L=N;while(1){N=c[g+(M<<2)>>2]|0;do{if((aW(N|0,5246192)|0)==0){K=M+1|0;c[b+48+(M<<2)>>2]=K;c[b+128+(M<<2)>>2]=K;c[b+208+(M<<2)>>2]=1;c[b+288+(M<<2)>>2]=0;c[b+368+(M<<2)>>2]=0;O=L}else{if((aW(N|0,5246032)|0)==0){K=M+1|0;c[b+48+(M<<2)>>2]=K;c[b+128+(M<<2)>>2]=K;c[b+288+(M<<2)>>2]=0;c[b+368+(M<<2)>>2]=1;O=L;break}if((aW(N|0,5244760)|0)==0){c[b+48+(M<<2)>>2]=M+9|0;c[b+128+(M<<2)>>2]=M+1|0;c[b+208+(M<<2)>>2]=2;c[b+288+(M<<2)>>2]=0;c[b+368+(M<<2)>>2]=0;O=L;break}if((aW(N|0,5245604)|0)==0){c[b+48+(M<<2)>>2]=M+17|0;c[b+128+(M<<2)>>2]=M+1|0;c[b+208+(M<<2)>>2]=3;c[b+288+(M<<2)>>2]=0;c[b+368+(M<<2)>>2]=0;O=L;break}if((aW(N|0,5245804)|0)==0){c[b+208+(M<<2)>>2]=1;O=L;break}if((aW(N|0,5245692)|0)==0){O=L;break}if((aW(N|0,5244668)|0)==0){c[b+208+(M<<2)>>2]=2;O=L;break}if((aW(N|0,5245436)|0)==0){c[b+208+(M<<2)>>2]=3;O=L;break}K=a[N]|0;if((K<<24>>24|0)==64){J=0;while(1){if((J|0)>=48){break}if((aW(N+1|0,c[5249640+(J<<2)>>2]|0)|0)==0){o=187;break}else{J=J+1|0}}if((o|0)==187){o=0;B=((J|0)%24|0)%8;c[b+48+(M<<2)>>2]=B+1|0;H=(B|0)%8;B=b+128+(M<<2)|0;c[B>>2]=H+1|0;c[b+288+(H<<2)>>2]=0;c[b+368+((c[B>>2]|0)-1<<2)>>2]=1;O=L;break}if((J|0)!=48){O=L;break}ap(c[p>>2]|0,5244568,(u=i,i=i+4|0,c[u>>2]=N,u)|0);O=1;break}else if((K<<24>>24|0)==43){B=0;while(1){if((B|0)>=48){break}if((aW(N+1|0,c[5249640+(B<<2)>>2]|0)|0)==0){o=192;break}else{B=B+1|0}}if((o|0)==192){o=0;J=(B+8|0)%24;c[b+48+(M<<2)>>2]=J+1|0;H=(J|0)%8;G=b+128+(M<<2)|0;c[G>>2]=H+1|0;c[b+208+(M<<2)>>2]=((J|0)/8&-1)+1|0;c[b+288+(H<<2)>>2]=0;c[b+368+((c[G>>2]|0)-1<<2)>>2]=0;O=L;break}if((B|0)!=48){O=L;break}ap(c[p>>2]|0,5244568,(u=i,i=i+4|0,c[u>>2]=N,u)|0);O=1;break}else if((K<<24>>24|0)==45){G=0;while(1){if((G|0)>=48){break}if((aW(N+1|0,c[5249640+(G<<2)>>2]|0)|0)==0){o=197;break}else{G=G+1|0}}if((o|0)==197){o=0;K=(G+16|0)%24;c[b+48+(M<<2)>>2]=K+1|0;B=(K|0)%8;H=b+128+(M<<2)|0;c[H>>2]=B+1|0;c[b+208+(M<<2)>>2]=((K|0)/8&-1)+1|0;c[b+288+(B<<2)>>2]=0;c[b+368+((c[H>>2]|0)-1<<2)>>2]=0;O=L;break}if((G|0)!=48){O=L;break}ap(c[p>>2]|0,5244568,(u=i,i=i+4|0,c[u>>2]=N,u)|0);O=1;break}else{H=0;while(1){if((H|0)>=48){break}if((aW(N|0,c[5249640+(H<<2)>>2]|0)|0)==0){o=202;break}else{H=H+1|0}}if((o|0)==202){o=0;G=(H|0)%24;c[b+48+(M<<2)>>2]=G+1|0;B=(G|0)%8;K=b+128+(M<<2)|0;c[K>>2]=B+1|0;c[b+208+(M<<2)>>2]=((G|0)/8&-1)+1|0;c[b+288+(B<<2)>>2]=0;c[b+368+((c[K>>2]|0)-1<<2)>>2]=0;O=L;break}if((H|0)!=48){O=L;break}ap(c[p>>2]|0,5244568,(u=i,i=i+4|0,c[u>>2]=N,u)|0);O=1;break}}}while(0);N=M+1|0;if((N|0)==8){P=0;Q=O;break}else{M=N;L=O}}while(1){do{if((c[b+128+(P<<2)>>2]|0)==0){if((c[b+208+(P<<2)>>2]|0)==0){O=0;while(1){if((O|0)>=8){break}if((c[b+368+(O<<2)>>2]|0)==-1){break}else{O=O+1|0}}if((O|0)==8){H=c[p>>2]|0;ax(5244512,47,1,H|0);R=1;break}else{c[b+368+(O<<2)>>2]=1;R=Q;break}}else{H=0;while(1){if((H|0)>=8){break}if((c[b+368+(H<<2)>>2]|0)==-1){break}else{H=H+1|0}}if((H|0)==8){O=c[p>>2]|0;ax(5244512,47,1,O|0);R=1;break}else{c[b+368+(H<<2)>>2]=0;R=Q;break}}}else{R=Q}}while(0);O=P+1|0;if((O|0)==8){S=0;break}else{P=O;Q=R}}while(1){if((S|0)>=8){n=R;o=235;break}if((c[b+128+(S<<2)>>2]|0)==-1){break}else{S=S+1|0}}if((o|0)==235){i=e;return n|0}ax(5244512,47,1,c[p>>2]|0);n=1;i=e;return n|0}function bm(a){a=a|0;var d=0,e=0,f=0,g=0,h=0,j=0,k=0,l=0,m=0;d=i;e=a+436|0;c[e>>2]=30;f=a+444|0;c[f>>2]=0;g=a+440|0;c[g>>2]=0;cX(a+448|0,-1|0,120);ax(5244076,48,1,c[p>>2]|0);h=a+404|0;j=a+408|0;if((ay(5244044,(u=i,i=i+36|0,c[u>>2]=h,c[u+4>>2]=j,c[u+8>>2]=a+416|0,c[u+12>>2]=a+420|0,c[u+16>>2]=a+424|0,c[u+20>>2]=a+426|0,c[u+24>>2]=a+430|0,c[u+28>>2]=a+432|0,c[u+32>>2]=a+428|0,u)|0)|0)!=9){k=1;i=d;return k|0}b[a+412>>1]=(c[h>>2]|0)>>>8&255;b[a+414>>1]=(c[j>>2]|0)>>>12&4095;if((ay(5244036,(u=i,i=i+4|0,c[u>>2]=e,u)|0)|0)!=1){k=1;i=d;return k|0}if((ay(5244036,(u=i,i=i+4|0,c[u>>2]=f,u)|0)|0)!=1){k=1;i=d;return k|0}if((ay(5244036,(u=i,i=i+4|0,c[u>>2]=g,u)|0)|0)==1){l=0}else{k=1;i=d;return k|0}while(1){if((l|0)>=(c[g>>2]|0)){k=0;m=244;break}if((ay(5244036,(u=i,i=i+4|0,c[u>>2]=a+448+(l<<2)|0,u)|0)|0)==1){l=l+1|0}else{k=1;m=246;break}}if((m|0)==246){i=d;return k|0}else if((m|0)==244){i=d;return k|0}return 0}function bn(a){a=a|0;var b=0,d=0,e=0,f=0,g=0,h=0,j=0,k=0,l=0,m=0,n=0,o=0,q=0,r=0,s=0,t=0,v=0,w=0,x=0,y=0,z=0,A=0,B=0,C=0,D=0,E=0,F=0,G=0,H=0,I=0,J=0,K=0,L=0,M=0,N=0,O=0,P=0,Q=0,R=0,S=0;b=i;i=i+192|0;d=b|0;e=b+48|0;f=b+120|0;g=e+48|0;c[g>>2]=8;c[e+52>>2]=8;c[e+56>>2]=40320;c[e+60>>2]=40320;c[e+64>>2]=1;c[e+68>>2]=40320;h=0;while(1){c[e+(h<<2)>>2]=0;j=h+1|0;k=c[g>>2]|0;if((j|0)<(k|0)){h=j}else{break}}h=f+48|0;c[h>>2]=12;c[f+52>>2]=12;c[f+56>>2]=479001600;c[f+60>>2]=479001600;c[f+64>>2]=1;c[f+68>>2]=479001600;j=0;while(1){c[f+(j<<2)>>2]=0;l=j+1|0;m=c[h>>2]|0;if((l|0)<(m|0)){j=l}else{break}}L349:do{if((k|0)>0){j=0;while(1){c[e+(j<<2)>>2]=c[a+128+(j<<2)>>2]|0;l=j+1|0;n=c[g>>2]|0;if((l|0)<(n|0)){j=l}else{o=n;break L349}}}else{o=k}}while(0);L353:do{if((m|0)>0){k=0;while(1){c[f+(k<<2)>>2]=c[a+80+(k<<2)>>2]|0;g=k+1|0;j=c[h>>2]|0;if((g|0)<(j|0)){k=g}else{q=j;break L353}}}else{q=m}}while(0);m=d;h=(o|0)>0;L357:do{if(h){cX(m|0,0,((o|0)>1?o<<2:4)|0);k=0;while(1){j=c[e+(k<<2)>>2]|0;if((j|0)<0|(j|0)>(o|0)){break L357}if((j|0)!=0){g=d+(j-1<<2)|0;c[g>>2]=(c[g>>2]|0)+1|0}g=k+1|0;if((g|0)<(o|0)){k=g}else{r=0;s=264;break L357}}}else{r=0;s=264}}while(0);L365:do{if((s|0)==264){while(1){s=0;if((r|0)>=(o|0)){break}if((c[d+(r<<2)>>2]|0)>1){break L365}else{r=r+1|0;s=264}}k=(q|0)>0;L370:do{if(k){cX(m|0,0,((q|0)>1?q<<2:4)|0);g=0;while(1){j=c[f+(g<<2)>>2]|0;if((j|0)<0|(j|0)>(q|0)){break L365}if((j|0)!=0){n=d+(j-1<<2)|0;c[n>>2]=(c[n>>2]|0)+1|0}n=g+1|0;if((n|0)<(q|0)){g=n}else{t=0;break L370}}}else{t=0}}while(0);while(1){if((t|0)>=(q|0)){break}if((c[d+(t<<2)>>2]|0)>1){break L365}else{t=t+1|0}}L382:do{if(h){g=0;n=0;while(1){if((c[e+(g<<2)>>2]|0)==0){if((n|0)==-1){v=-2;break L382}else{w=-1}}else{w=n}j=g+1|0;if((j|0)<(o|0)){g=j;n=w}else{break}}if((w|0)==-1){v=-1;break}else{x=w;s=280;break}}else{x=0;s=280}}while(0);L389:do{if((s|0)==280){n=o-1|0;if((n|0)>0){y=0;z=x}else{v=x;break}while(1){g=y+1|0;L393:do{if((g|0)<(o|0)){j=c[e+(y<<2)>>2]|0;l=g;A=z;while(1){B=(j|0)>(c[e+(l<<2)>>2]|0)?1-A|0:A;C=l+1|0;if((C|0)==(o|0)){D=B;break L393}else{l=C;A=B}}}else{D=z}}while(0);if((g|0)==(n|0)){v=D;break L389}else{y=g;z=D}}}}while(0);L399:do{if(k){n=0;A=0;while(1){if((c[f+(n<<2)>>2]|0)==0){if((A|0)==-1){E=-2;break L399}else{F=-1}}else{F=A}l=n+1|0;if((l|0)<(q|0)){n=l;A=F}else{break}}if((F|0)==-1){E=-1;break}else{G=F;s=290;break}}else{G=0;s=290}}while(0);L406:do{if((s|0)==290){k=q-1|0;if((k|0)>0){H=0;I=G}else{E=G;break}while(1){A=H+1|0;L410:do{if((A|0)<(q|0)){n=c[f+(H<<2)>>2]|0;l=A;j=I;while(1){B=(n|0)>(c[f+(l<<2)>>2]|0)?1-j|0:j;C=l+1|0;if((C|0)==(q|0)){J=B;break L410}else{l=C;j=B}}}else{J=I}}while(0);if((A|0)==(k|0)){E=J;break L406}else{H=A;I=J}}}}while(0);if((v|0)==-1){k=c[p>>2]|0;ax(5244440,39,1,k|0);K=1}else{K=0}do{if((E|0)==-1){k=c[p>>2]|0;ax(5244396,37,1,k|0);L=1}else{if((E|v|0)<0|(v|0)==(E|0)){L=K;break}ax(5244320,51,1,c[p>>2]|0);L=1}}while(0);k=c[a+160>>2]|0;do{if((k|0)==0){M=L}else{g=c[a+164>>2]|0;if((g|0)==0){M=L;break}j=c[a+168>>2]|0;if((j|0)==0){M=L;break}l=c[a+172>>2]|0;if((l|0)==0){M=L;break}n=c[a+176>>2]|0;if((n|0)==0){M=L;break}B=c[a+180>>2]|0;if((B|0)==0){M=L;break}C=c[a+184>>2]|0;if((C|0)==0){M=L;break}N=c[a+188>>2]|0;if((N|0)==0){M=L;break}O=c[a+192>>2]|0;if((O|0)==0){M=L;break}P=c[a+196>>2]|0;if((P|0)==0){M=L;break}Q=c[a+200>>2]|0;if((Q|0)==0){M=L;break}R=c[a+204>>2]|0;if((R|0)==0){M=L;break}if(((((((((((((((((((((((k-2|0)+g|0)-1|0)+j|0)-1|0)+l|0)-1|0)+n|0)-1|0)+B|0)-1|0)+C|0)-1|0)+N|0)-1|0)+O|0)-1|0)+P|0)-1|0)+Q|0)-1|0)+R&-2147483647|0)!=1){M=L;break}ax(5244292,21,1,c[p>>2]|0);M=1}}while(0);k=c[a+208>>2]|0;if((k|0)==0){S=M;i=b;return S|0}R=c[a+212>>2]|0;if((R|0)==0){S=M;i=b;return S|0}Q=c[a+216>>2]|0;if((Q|0)==0){S=M;i=b;return S|0}P=c[a+220>>2]|0;if((P|0)==0){S=M;i=b;return S|0}O=c[a+224>>2]|0;if((O|0)==0){S=M;i=b;return S|0}N=c[a+228>>2]|0;if((N|0)==0){S=M;i=b;return S|0}C=c[a+232>>2]|0;if((C|0)==0){S=M;i=b;return S|0}B=c[a+236>>2]|0;if((B|0)==0){S=M;i=b;return S|0}n=(((((((((((((k-2|0)+R|0)-1|0)+Q|0)-1|0)+P|0)-1|0)+O|0)-1|0)+N|0)-1|0)+C|0)-1|0)+B|0;if((n|0)<=-1){S=M;i=b;return S|0}B=(n|0)%3;if((B|0)==0){S=M;i=b;return S|0}ap(c[p>>2]|0,5244168,(u=i,i=i+4|0,c[u>>2]=(B|0)==1?5244136:5245808,u)|0);S=1;i=b;return S|0}}while(0);ax(5244488,12,1,c[p>>2]|0);S=1;i=b;return S|0}function bo(a){a=a|0;var d=0,e=0,f=0,g=0,h=0,j=0,k=0,l=0,m=0,n=0,o=0,p=0,q=0,r=0,s=0,t=0,u=0,v=0,w=0,x=0,y=0,z=0,A=0,B=0,C=0,D=0,E=0,F=0,G=0,H=0,I=0,J=0,K=0,L=0,M=0,N=0,O=0,P=0,Q=0,R=0,S=0,T=0,U=0,V=0,W=0,X=0,Y=0,Z=0,_=0,aa=0,ab=0,ac=0,ad=0,ae=0,af=0,ag=0,ah=0,ai=0,aj=0,ak=0,al=0,am=0,an=0,ao=0,ap=0,aq=0,ar=0,as=0,at=0,au=0,av=0,aw=0,ax=0,ay=0,az=0,aA=0,aB=0;d=i;i=i+580|0;e=d|0;f=d+48|0;g=d+124|0;h=d+200|0;j=d+276|0;k=d+352|0;l=d+428|0;m=d+504|0;c[a+436>>2]=30;c[a+444>>2]=0;c[a+440>>2]=0;cX(a+448|0,-1|0,120);n=c[a+316>>2]<<7|(c[a+312>>2]<<6|(c[a+308>>2]<<5|(c[a+304>>2]<<4|(c[a+300>>2]<<3|(c[a+296>>2]<<2|(c[a+292>>2]<<1|c[a+288>>2]))))));o=n<<8|(c[a+396>>2]<<7|(c[a+392>>2]<<6|(c[a+388>>2]<<5|(c[a+384>>2]<<4|(c[a+380>>2]<<3|(c[a+376>>2]<<2|(c[a+372>>2]<<1|c[a+368>>2])))))));c[a+404>>2]=o;b[a+412>>1]=n&65535;br(f,o);o=f+48|0;p=c[o>>2]|0;L473:do{if((p|0)>0){q=0;while(1){c[f+(q<<2)>>2]=c[a+208+(q<<2)>>2]|0;r=q+1|0;s=c[o>>2]|0;if((r|0)<(s|0)){q=r}else{break}}if((s|0)>0){t=0;u=0;v=1}else{w=0;x=1;y=s;break}while(1){q=c[f+(t<<2)>>2]|0;if((q|0)==0){z=v;A=u}else{z=v*3&-1;A=((u*3&-1)-1|0)+q|0}q=t+1|0;if((q|0)==(s|0)){w=A;x=z;y=s;break L473}else{t=q;u=A;v=z}}}else{w=0;x=1;y=p}}while(0);if((c[f+72>>2]&255|0)==0){B=(x|0)/3&-1;C=(w|0)/3&-1}else{B=x;C=w}w=c[f+52>>2]|0;L486:do{if((y-w|0)>0){x=0;p=w;z=0;while(1){if((c[f+(x<<2)>>2]|0)==0){D=z;E=p}else{v=p-1|0;L491:do{if((p|0)>0){A=y-x|0;u=p;t=1;s=1;while(1){o=A-1|0;q=$(o,t);r=$(u,s);F=u-1|0;if((F|0)>0){A=o;u=F;t=q;s=r}else{G=q;H=r;break L491}}}else{G=1;H=1}}while(0);D=((G|0)/(H|0)&-1)+z|0;E=v}s=x+1|0;if((s|0)<(y-E|0)){x=s;p=E;z=D}else{I=D;break L486}}}else{I=0}}while(0);b[a+416>>1]=$(I,B)+C&65535;C=c[a+240>>2]|0;B=c[a+244>>2]<<1|C;I=c[a+248>>2]<<2|B;D=c[a+256>>2]<<4|(c[a+252>>2]<<3|I);E=c[a+260>>2]<<5|D;y=c[a+264>>2]<<6|E;H=c[a+272>>2]<<8|(c[a+268>>2]<<7|y);G=c[a+276>>2]<<9|H;f=c[a+280>>2]<<10|G;w=c[a+284>>2]<<11|f;z=w<<12|(c[a+364>>2]<<11|(c[a+360>>2]<<10|(c[a+356>>2]<<9|(c[a+352>>2]<<8|(c[a+348>>2]<<7|(c[a+344>>2]<<6|(c[a+340>>2]<<5|(c[a+336>>2]<<4|(c[a+332>>2]<<3|(c[a+328>>2]<<2|(c[a+324>>2]<<1|c[a+320>>2])))))))))));c[a+408>>2]=z;b[a+414>>1]=w&65535;bq(g,z);z=g+48|0;p=c[z>>2]|0;L498:do{if((p|0)>0){x=0;while(1){c[g+(x<<2)>>2]=c[a+160+(x<<2)>>2]|0;s=x+1|0;J=c[z>>2]|0;if((s|0)<(J|0)){x=s}else{break}}if((J|0)>0){K=0;L=0;M=1}else{N=0;O=1;P=J;break}while(1){x=c[g+(K<<2)>>2]|0;if((x|0)==0){Q=M;R=L}else{Q=M<<1;R=((L<<1)-1|0)+x|0}x=K+1|0;if((x|0)==(J|0)){N=R;O=Q;P=J;break L498}else{K=x;L=R;M=Q}}}else{N=0;O=1;P=p}}while(0);if((c[g+72>>2]&4095|0)==0){S=(O|0)/2&-1;T=(N|0)/2&-1}else{S=O;T=N}N=c[g+52>>2]|0;L511:do{if((P-N|0)>0){O=0;p=N;Q=0;while(1){if((c[g+(O<<2)>>2]|0)==0){U=Q;V=p}else{M=p-1|0;L516:do{if((p|0)>0){R=P-O|0;L=p;K=1;J=1;while(1){z=R-1|0;x=$(z,K);s=$(L,J);t=L-1|0;if((t|0)>0){R=z;L=t;K=x;J=s}else{W=x;X=s;break L516}}}else{W=1;X=1}}while(0);U=((W|0)/(X|0)&-1)+Q|0;V=M}v=O+1|0;if((v|0)<(P-V|0)){O=v;p=V;Q=U}else{Y=U;break L511}}}else{Y=0}}while(0);c[a+420>>2]=$(Y,S)+T|0;T=0;while(1){S=c[a+80+(T<<2)>>2]|0;if((S|0)==0){c[e+(T<<2)>>2]=0}else{c[e+(T<<2)>>2]=(S-1|0)/8&-1}S=T+1|0;if((S|0)==12){break}else{T=S}}T=w^-1;S=(((T>>>8&1)+(T>>>9&1)|0)+(T>>>10&1)|0)+(T>>>11&1)|0;Y=h+48|0;c[Y>>2]=12;U=h+52|0;c[U>>2]=S;c[h+56>>2]=479001600;V=h+60|0;P=(S|0)>1;L530:do{if(P){X=S;W=1;while(1){g=$(X,W);N=X-1|0;if((N|0)>1){X=N;W=g}else{Z=g;break L530}}}else{Z=1}}while(0);c[V>>2]=Z;Z=h+64|0;V=(S|0)>0;L534:do{if(V){W=12;X=S;g=1;N=1;while(1){_=$(W,g);aa=$(X,N);Q=X-1|0;if((Q|0)>0){W=W-1|0;X=Q;g=_;N=aa}else{break}}c[Z>>2]=(_|0)/(aa|0)&-1;N=12;g=S;X=1;while(1){W=$(N,X);Q=g-1|0;if((Q|0)>0){N=N-1|0;g=Q;X=W}else{ab=W;break L534}}}else{c[Z>>2]=1;ab=1}}while(0);c[h+68>>2]=ab;ab=0;while(1){c[h+(ab<<2)>>2]=0;Z=ab+1|0;ac=c[Y>>2]|0;if((Z|0)<(ac|0)){ab=Z}else{break}}c[h+72>>2]=w;L545:do{if((ac|0)>0){ab=0;while(1){c[h+(ab<<2)>>2]=c[e+(ab<<2)>>2]|0;Z=ab+1|0;aa=c[Y>>2]|0;if((Z|0)<(aa|0)){ab=Z}else{ad=aa;break L545}}}else{ad=ac}}while(0);ac=c[U>>2]|0;L549:do{if((ad-ac|0)>0){U=0;Y=ac;ab=0;while(1){if((c[h+(U<<2)>>2]|0)==0){ae=ab;af=Y}else{aa=Y-1|0;L554:do{if((Y|0)>0){Z=ad-U|0;_=Y;X=1;g=1;while(1){N=Z-1|0;W=$(N,X);Q=$(_,g);p=_-1|0;if((p|0)>0){Z=N;_=p;X=W;g=Q}else{ag=W;ah=Q;break L554}}}else{ag=1;ah=1}}while(0);ae=((ag|0)/(ah|0)&-1)+ab|0;af=aa}M=U+1|0;if((M|0)<(ad-af|0)){U=M;Y=af;ab=ae}else{ai=ae;break L549}}}else{ai=0}}while(0);b[a+424>>1]=ai&65535;bp(j,n);n=j|0;ai=j+48|0;L561:do{if((c[ai>>2]|0)>0){ae=0;while(1){c[j+(ae<<2)>>2]=c[a+128+(ae<<2)>>2]|0;af=ae+1|0;if((af|0)<(c[ai>>2]|0)){ae=af}else{break L561}}}}while(0);b[a+426>>1]=be(n)&65535;n=H>>>8&1;H=2-n|0;ai=G>>>9&1;G=(n^3)-ai|0;j=((4-n|0)-ai|0)-(f>>>10&1)|0;f=0;while(1){ai=c[a+80+(f<<2)>>2]|0;if((ai|0)==9){c[e+(f<<2)>>2]=1}else if((ai|0)==10){c[e+(f<<2)>>2]=H}else if((ai|0)==11){c[e+(f<<2)>>2]=G}else if((ai|0)==12){c[e+(f<<2)>>2]=j}else if((ai|0)==0){c[e+(f<<2)>>2]=0}else{c[e+(f<<2)>>2]=0}ai=f+1|0;if((ai|0)==12){break}else{f=ai}}f=k+48|0;c[f>>2]=12;c[k+52>>2]=S;c[k+56>>2]=479001600;j=k+60|0;L576:do{if(P){G=S;H=1;while(1){ai=$(G,H);n=G-1|0;if((n|0)>1){G=n;H=ai}else{aj=ai;break L576}}}else{aj=1}}while(0);c[j>>2]=aj;aj=k+64|0;L580:do{if(V){j=12;P=S;H=1;G=1;while(1){ak=$(j,H);al=$(P,G);ai=P-1|0;if((ai|0)>0){j=j-1|0;P=ai;H=ak;G=al}else{break}}c[aj>>2]=(ak|0)/(al|0)&-1;G=12;H=S;P=1;while(1){j=$(G,P);ai=H-1|0;if((ai|0)>0){G=G-1|0;H=ai;P=j}else{am=j;break L580}}}else{c[aj>>2]=1;am=1}}while(0);c[k+68>>2]=am;am=0;while(1){c[k+(am<<2)>>2]=0;aj=am+1|0;an=c[f>>2]|0;if((aj|0)<(an|0)){am=aj}else{break}}c[k+72>>2]=w;am=k|0;L591:do{if((an|0)>0){aj=0;while(1){c[k+(aj<<2)>>2]=c[e+(aj<<2)>>2]|0;S=aj+1|0;if((S|0)<(c[f>>2]|0)){aj=S}else{break L591}}}}while(0);b[a+428>>1]=be(am)&65535;am=C&1;C=2-am|0;f=B>>>1&1;B=(am^3)-f|0;k=((4-am|0)-f|0)-(I>>>2&1)|0;I=0;while(1){f=c[a+80+(I<<2)>>2]|0;if((f|0)==1){c[e+(I<<2)>>2]=1}else if((f|0)==2){c[e+(I<<2)>>2]=C}else if((f|0)==3){c[e+(I<<2)>>2]=B}else if((f|0)==4){c[e+(I<<2)>>2]=k}else if((f|0)==0){c[e+(I<<2)>>2]=0}else{c[e+(I<<2)>>2]=0}f=I+1|0;if((f|0)==12){break}else{I=f}}I=(((T>>>1&1)+(T&1)|0)+(T>>>2&1)|0)+(T>>>3&1)|0;k=l+48|0;c[k>>2]=12;c[l+52>>2]=I;c[l+56>>2]=479001600;B=l+60|0;L606:do{if((I|0)>1){C=I;f=1;while(1){am=$(C,f);an=C-1|0;if((an|0)>1){C=an;f=am}else{ao=am;break L606}}}else{ao=1}}while(0);c[B>>2]=ao;ao=l+64|0;L610:do{if((I|0)>0){B=12;f=I;C=1;am=1;while(1){ap=$(B,C);aq=$(f,am);an=f-1|0;if((an|0)>0){B=B-1|0;f=an;C=ap;am=aq}else{break}}c[ao>>2]=(ap|0)/(aq|0)&-1;am=12;C=I;f=1;while(1){B=$(am,f);an=C-1|0;if((an|0)>0){am=am-1|0;C=an;f=B}else{ar=B;break L610}}}else{c[ao>>2]=1;ar=1}}while(0);c[l+68>>2]=ar;ar=0;while(1){c[l+(ar<<2)>>2]=0;ao=ar+1|0;as=c[k>>2]|0;if((ao|0)<(as|0)){ar=ao}else{break}}c[l+72>>2]=w;ar=l|0;L621:do{if((as|0)>0){ao=0;while(1){c[l+(ao<<2)>>2]=c[e+(ao<<2)>>2]|0;I=ao+1|0;if((I|0)<(c[k>>2]|0)){ao=I}else{break L621}}}}while(0);b[a+430>>1]=be(ar)&65535;ar=D>>>4&1;D=2-ar|0;k=E>>>5&1;E=(ar^3)-k|0;l=((4-ar|0)-k|0)-(y>>>6&1)|0;y=0;while(1){k=c[a+80+(y<<2)>>2]|0;if((k|0)==5){c[e+(y<<2)>>2]=1}else if((k|0)==6){c[e+(y<<2)>>2]=D}else if((k|0)==7){c[e+(y<<2)>>2]=E}else if((k|0)==8){c[e+(y<<2)>>2]=l}else if((k|0)==0){c[e+(y<<2)>>2]=0}else{c[e+(y<<2)>>2]=0}k=y+1|0;if((k|0)==12){break}else{y=k}}y=(((T>>>4&1)+(T>>>5&1)|0)+(T>>>6&1)|0)+(T>>>7&1)|0;T=m+48|0;c[T>>2]=12;c[m+52>>2]=y;c[m+56>>2]=479001600;l=m+60|0;L636:do{if((y|0)>1){E=y;D=1;while(1){k=$(E,D);ar=E-1|0;if((ar|0)>1){E=ar;D=k}else{at=k;break L636}}}else{at=1}}while(0);c[l>>2]=at;at=m+64|0;L640:do{if((y|0)>0){l=12;D=y;E=1;k=1;while(1){au=$(l,E);av=$(D,k);ar=D-1|0;if((ar|0)>0){l=l-1|0;D=ar;E=au;k=av}else{break}}c[at>>2]=(au|0)/(av|0)&-1;k=12;E=y;D=1;while(1){l=$(k,D);ar=E-1|0;if((ar|0)>0){k=k-1|0;E=ar;D=l}else{aw=l;break L640}}}else{c[at>>2]=1;aw=1}}while(0);c[m+68>>2]=aw;aw=0;while(1){c[m+(aw<<2)>>2]=0;at=aw+1|0;ax=c[T>>2]|0;if((at|0)<(ax|0)){aw=at}else{break}}c[m+72>>2]=w;w=m|0;if((ax|0)>0){ay=0}else{az=be(w)|0;aA=az&65535;aB=a+432|0;b[aB>>1]=aA;i=d;return}while(1){c[m+(ay<<2)>>2]=c[e+(ay<<2)>>2]|0;ax=ay+1|0;if((ax|0)<(c[T>>2]|0)){ay=ax}else{break}}az=be(w)|0;aA=az&65535;aB=a+432|0;b[aB>>1]=aA;i=d;return}function bp(a,b){a=a|0;b=b|0;var d=0,e=0,f=0,g=0,h=0,i=0,j=0,k=0,l=0,m=0,n=0;d=b^-1;e=(((((((d>>>1&1)+(d&1)|0)+(d>>>2&1)|0)+(d>>>3&1)|0)+(d>>>4&1)|0)+(d>>>5&1)|0)+(d>>>6&1)|0)+(d>>>7&1)|0;d=a+48|0;c[d>>2]=8;c[a+52>>2]=e;c[a+56>>2]=40320;f=a+60|0;L657:do{if((e|0)>1){g=e;h=1;while(1){i=$(g,h);j=g-1|0;if((j|0)>1){g=j;h=i}else{k=i;break L657}}}else{k=1}}while(0);c[f>>2]=k;k=a+64|0;L661:do{if((e|0)>0){f=8;h=e;g=1;i=1;while(1){l=$(f,g);m=$(h,i);j=h-1|0;if((j|0)>0){f=f-1|0;h=j;g=l;i=m}else{break}}c[k>>2]=(l|0)/(m|0)&-1;i=8;g=e;h=1;while(1){f=$(i,h);j=g-1|0;if((j|0)>0){i=i-1|0;g=j;h=f}else{n=f;break L661}}}else{c[k>>2]=1;n=1}}while(0);c[a+68>>2]=n;n=0;while(1){c[a+(n<<2)>>2]=0;k=n+1|0;if((k|0)<(c[d>>2]|0)){n=k}else{break}}c[a+72>>2]=b;return}function bq(a,b){a=a|0;b=b|0;var d=0,e=0,f=0,g=0,h=0,i=0,j=0,k=0,l=0,m=0,n=0;d=b^-1;e=(((((((((((d>>>1&1)+(d&1)|0)+(d>>>2&1)|0)+(d>>>3&1)|0)+(d>>>4&1)|0)+(d>>>5&1)|0)+(d>>>6&1)|0)+(d>>>7&1)|0)+(d>>>8&1)|0)+(d>>>9&1)|0)+(d>>>10&1)|0)+(d>>>11&1)|0;d=a+48|0;c[d>>2]=12;c[a+52>>2]=e;c[a+56>>2]=479001600;f=a+60|0;L673:do{if((e|0)>1){g=e;h=1;while(1){i=$(g,h);j=g-1|0;if((j|0)>1){g=j;h=i}else{k=i;break L673}}}else{k=1}}while(0);c[f>>2]=k;k=a+64|0;L677:do{if((e|0)>0){f=12;h=e;g=1;i=1;while(1){l=$(f,g);m=$(h,i);j=h-1|0;if((j|0)>0){f=f-1|0;h=j;g=l;i=m}else{break}}c[k>>2]=(l|0)/(m|0)&-1;i=12;g=e;h=1;while(1){f=$(i,h);j=g-1|0;if((j|0)>0){i=i-1|0;g=j;h=f}else{n=f;break L677}}}else{c[k>>2]=1;n=1}}while(0);c[a+68>>2]=n;n=0;while(1){c[a+(n<<2)>>2]=0;k=n+1|0;if((k|0)<(c[d>>2]|0)){n=k}else{break}}c[a+72>>2]=b;return}function br(a,b){a=a|0;b=b|0;var d=0,e=0,f=0,g=0,h=0,i=0,j=0,k=0,l=0,m=0,n=0;d=b^-1;e=(((((((d>>>1&1)+(d&1)|0)+(d>>>2&1)|0)+(d>>>3&1)|0)+(d>>>4&1)|0)+(d>>>5&1)|0)+(d>>>6&1)|0)+(d>>>7&1)|0;d=a+48|0;c[d>>2]=8;c[a+52>>2]=e;c[a+56>>2]=40320;f=a+60|0;L689:do{if((e|0)>1){g=e;h=1;while(1){i=$(g,h);j=g-1|0;if((j|0)>1){g=j;h=i}else{k=i;break L689}}}else{k=1}}while(0);c[f>>2]=k;k=a+64|0;L693:do{if((e|0)>0){f=8;h=e;g=1;i=1;while(1){l=$(f,g);m=$(h,i);j=h-1|0;if((j|0)>0){f=f-1|0;h=j;g=l;i=m}else{break}}c[k>>2]=(l|0)/(m|0)&-1;i=8;g=e;h=1;while(1){f=$(i,h);j=g-1|0;if((j|0)>0){i=i-1|0;g=j;h=f}else{n=f;break L693}}}else{c[k>>2]=1;n=1}}while(0);c[a+68>>2]=n;n=0;while(1){c[a+(n<<2)>>2]=0;k=n+1|0;if((k|0)<(c[d>>2]|0)){n=k}else{break}}c[a+72>>2]=b;return}function bs(a,b){a=a|0;b=b|0;var d=0,e=0,f=0,g=0,h=0,i=0,j=0,k=0,l=0,m=0,n=0,o=0,p=0,q=0,r=0,s=0,t=0,u=0,v=0,w=0,x=0,y=0,z=0,A=0,B=0,C=0,D=0,E=0,F=0,G=0,H=0,I=0;d=a+48|0;e=c[d>>2]|0;f=(e|0)>0;g=c[a+72>>2]|0;L705:do{if(f){h=0;i=1;while(1){if((1<<h&(g^-1)|0)==0){j=i}else{j=i*3&-1}k=h+1|0;if((k|0)<(e|0)){h=k;i=j}else{l=j;break L705}}}else{l=1}}while(0);if((g&255|0)==0){g=(l|0)/3&-1;L736:do{if(f){j=0;i=c[a+52>>2]|0;h=(b|0)/(g|0)&-1;k=e;while(1){L740:do{if((i|0)>0){m=k-j|0;n=i;o=1;p=1;while(1){q=m-1|0;r=$(q,o);s=$(n,p);t=n-1|0;if((t|0)>0){m=q;n=t;o=r;p=s}else{u=r;v=s;break L740}}}else{u=1;v=1}}while(0);p=(u|0)/(v|0)&-1;if((p|0)>(h|0)){c[a+(j<<2)>>2]=0;w=h;x=i}else{c[a+(j<<2)>>2]=1;w=h-p|0;x=i-1|0}p=j+1|0;o=c[d>>2]|0;if((p|0)<(o|0)){j=p;i=x;h=w;k=o}else{y=o;break L736}}}else{y=e}}while(0);w=y-2|0;if((w|0)>-1){x=(b|0)%(g|0);g=w;w=0;while(1){v=(x|0)%3;c[a+(g<<2)>>2]=v+1|0;z=v+w|0;if((g|0)>0){x=(x|0)/3&-1;g=g-1|0;w=z}else{break}}A=(z|0)%3;B=c[d>>2]|0}else{A=0;B=y}c[a+(B-1<<2)>>2]=(3-A|0)%3+1|0;return}else{L714:do{if(f){A=0;B=c[a+52>>2]|0;y=(b|0)/(l|0)&-1;z=e;while(1){L718:do{if((B|0)>0){w=z-A|0;g=B;x=1;v=1;while(1){u=w-1|0;k=$(u,x);h=$(g,v);i=g-1|0;if((i|0)>0){w=u;g=i;x=k;v=h}else{C=k;D=h;break L718}}}else{C=1;D=1}}while(0);v=(C|0)/(D|0)&-1;if((v|0)>(y|0)){c[a+(A<<2)>>2]=0;E=y;F=B}else{c[a+(A<<2)>>2]=1;E=y-v|0;F=B-1|0}v=A+1|0;x=c[d>>2]|0;if((v|0)<(x|0)){A=v;B=F;y=E;z=x}else{G=x;break L714}}}else{G=e}}while(0);e=G;G=(b|0)%(l|0);L728:while(1){l=e;while(1){H=l-1|0;if((l|0)<=0){break L728}I=a+(H<<2)|0;if((c[I>>2]|0)==0){l=H}else{break}}c[I>>2]=(G|0)%3+1|0;e=H;G=(G|0)/3&-1}return}}function bt(a){a=a|0;var b=0,d=0,e=0,f=0,g=0,h=0,i=0,j=0,k=0,l=0,m=0,n=0,o=0;b=cT(28)|0;d=b;e=a+404|0;f=a+576|0;bY(d,e,c[f>>2]|0);g=cT(69)|0;h=g;i=a+568|0;cK(h,c[i>>2]|0);j=cT(48)|0;k=j;bF(k,d,h,e,c[f>>2]|0);l=cT(966)|0;m=l;cJ(m);n=cT(1848)|0;o=n;c[n>>2]=d;c[n+4>>2]=k;c[n+8>>2]=h;c[n+12>>2]=m;m=a+400|0;c[m>>2]=o;cV(n+16|0,e,164);c[n+1808>>2]=c[i>>2]|0;c[n+1812>>2]=c[a+572>>2]|0;c[n+1816>>2]=c[f>>2]|0;c[n+1820>>2]=c[a+580>>2]|0;bR(o);o=c[m>>2]|0;if((o|0)!=0){cQ(o)}if((b|0)!=0){bZ(d);cQ(b)}if((g|0)!=0){cQ(g)}if((j|0)!=0){bG(k);cQ(j)}if((l|0)==0){return}cQ(l);return}function bu(a,b){a=a|0;b=b|0;var d=0,e=0,f=0,g=0,h=0,j=0,k=0,l=0,m=0,n=0,o=0,p=0,q=0,r=0,s=0,t=0,u=0,v=0,w=0,x=0,y=0,z=0,A=0,B=0,C=0,D=0,E=0,F=0,G=0,H=0,I=0,J=0,K=0,L=0,M=0,N=0,O=0,P=0,Q=0,R=0,S=0,T=0,U=0,V=0,W=0,X=0,Y=0,Z=0,_=0,aa=0,ab=0,ac=0,ad=0,ae=0,af=0,ag=0,ah=0,ai=0,aj=0;d=i;i=i+72|0;e=d|0;f=a+48|0;g=c[f>>2]|0;h=(g|0)>0;L777:do{if(h){j=c[a+72>>2]|0;k=j>>8;l=j^-1;j=0;m=0;n=0;while(1){o=1<<j;if((k&o|0)==0){p=n;q=m}else{p=((o&l|0)!=0&1)+n|0;q=m+1|0}o=j+1|0;if((o|0)<(g|0)){j=o;m=q;n=p}else{break}}n=e+48|0;c[n>>2]=q;m=e+52|0;c[m>>2]=p;j=e+56|0;L785:do{if((q|0)>1){l=q;k=1;while(1){o=$(l,k);r=l-1|0;if((r|0)>1){l=r;k=o}else{s=o;break L785}}}else{s=1}}while(0);c[j>>2]=s;k=e+60|0;L789:do{if((p|0)>1){l=p;o=1;while(1){r=$(l,o);t=l-1|0;if((t|0)>1){l=t;o=r}else{u=r;break L789}}}else{u=1}}while(0);c[k>>2]=u;j=e+64|0;if((p|0)>0){v=q;w=p;x=1;y=1}else{z=q;A=n;B=m;C=j;D=552;break}while(1){E=$(v,x);F=$(w,y);o=w-1|0;if((o|0)>0){v=v-1|0;w=o;x=E;y=F}else{break}}c[j>>2]=(E|0)/(F|0)&-1;k=q;o=p;l=1;while(1){r=$(k,l);t=o-1|0;if((t|0)>0){k=k-1|0;o=t;l=r}else{G=r;H=q;I=n;J=m;break L777}}}else{m=e+48|0;c[m>>2]=0;n=e+52|0;c[n>>2]=0;c[e+56>>2]=1;c[e+60>>2]=1;z=0;A=m;B=n;C=e+64|0;D=552;break}}while(0);if((D|0)==552){c[C>>2]=1;G=1;H=z;I=A;J=B}c[e+68>>2]=G;L802:do{if((H|0)>0){G=0;while(1){c[e+(G<<2)>>2]=0;B=G+1|0;K=c[I>>2]|0;if((B|0)<(K|0)){G=B}else{break}}if((K|0)<=0){break}G=0;B=c[J>>2]|0;A=b;z=K;while(1){L809:do{if((B|0)>0){C=z-G|0;D=B;q=1;p=1;while(1){F=C-1|0;E=$(F,q);y=$(D,p);x=D-1|0;if((x|0)>0){C=F;D=x;q=E;p=y}else{L=E;M=y;break L809}}}else{L=1;M=1}}while(0);p=(L|0)/(M|0)&-1;if((p|0)>(A|0)){c[e+(G<<2)>>2]=0;N=A;O=B}else{c[e+(G<<2)>>2]=1;N=A-p|0;O=B-1|0}p=G+1|0;q=c[I>>2]|0;if((p|0)<(q|0)){G=p;B=O;A=N;z=q}else{break L802}}}}while(0);L819:do{if(h){N=a+72|0;O=0;I=0;while(1){M=c[N>>2]|0;L=1<<O;do{if((M>>8&L|0)==0){K=a+(O<<2)|0;if((L&(M^-1)|0)==0){c[K>>2]=0;P=I;break}else{c[K>>2]=1;P=I;break}}else{c[a+(O<<2)>>2]=c[e+(I<<2)>>2]|0;P=I+1|0}}while(0);M=O+1|0;Q=c[f>>2]|0;if((M|0)<(Q|0)){O=M;I=P}else{break}}if((Q|0)>0){R=0;S=0;T=1}else{U=0;V=1;W=Q;break}while(1){I=c[a+(R<<2)>>2]|0;if((I|0)==0){X=T;Y=S}else{X=T*3&-1;Y=((S*3&-1)-1|0)+I|0}I=R+1|0;if((I|0)==(Q|0)){U=Y;V=X;W=Q;break L819}else{R=I;S=Y;T=X}}}else{U=0;V=1;W=g}}while(0);if((c[a+72>>2]&255|0)==0){Z=(V|0)/3&-1;_=(U|0)/3&-1}else{Z=V;_=U}U=c[a+52>>2]|0;if((W-U|0)>0){aa=0;ab=U;ac=0}else{ad=0;ae=$(ad,Z);af=ae+_|0;i=d;return af|0}while(1){if((c[a+(aa<<2)>>2]|0)==0){ag=ac;ah=ab}else{U=ab-1|0;L846:do{if((ab|0)>0){V=W-aa|0;g=ab;X=1;T=1;while(1){Y=V-1|0;S=$(Y,X);R=$(g,T);Q=g-1|0;if((Q|0)>0){V=Y;g=Q;X=S;T=R}else{ai=S;aj=R;break L846}}}else{ai=1;aj=1}}while(0);ag=((ai|0)/(aj|0)&-1)+ac|0;ah=U}T=aa+1|0;if((T|0)<(W-ah|0)){aa=T;ab=ah;ac=ag}else{ad=ag;break}}ae=$(ad,Z);af=ae+_|0;i=d;return af|0}function bv(a,b){a=a|0;b=b|0;var d=0,e=0,f=0,g=0,h=0,i=0,j=0,k=0,l=0,m=0,n=0,o=0,p=0,q=0,r=0,s=0,t=0,u=0,v=0,w=0,x=0,y=0,z=0,A=0,B=0,C=0,D=0,E=0,F=0,G=0,H=0,I=0;d=a+48|0;e=c[d>>2]|0;f=(e|0)>0;g=c[a+72>>2]|0;L854:do{if(f){h=0;i=1;while(1){j=i<<((1<<h&(g^-1)|0)!=0&1);k=h+1|0;if((k|0)<(e|0)){h=k;i=j}else{l=j;break L854}}}else{l=1}}while(0);if((g&4095|0)==0){g=(l|0)/2&-1;L882:do{if(f){i=0;h=c[a+52>>2]|0;j=(b|0)/(g|0)&-1;k=e;while(1){L886:do{if((h|0)>0){m=k-i|0;n=h;o=1;p=1;while(1){q=m-1|0;r=$(q,o);s=$(n,p);t=n-1|0;if((t|0)>0){m=q;n=t;o=r;p=s}else{u=r;v=s;break L886}}}else{u=1;v=1}}while(0);p=(u|0)/(v|0)&-1;if((p|0)>(j|0)){c[a+(i<<2)>>2]=0;w=j;x=h}else{c[a+(i<<2)>>2]=1;w=j-p|0;x=h-1|0}p=i+1|0;o=c[d>>2]|0;if((p|0)<(o|0)){i=p;h=x;j=w;k=o}else{y=o;break L882}}}else{y=e}}while(0);w=y-2|0;if((w|0)>-1){x=(b|0)%(g|0);g=w;w=0;while(1){v=(x|0)%2;c[a+(g<<2)>>2]=v+1|0;z=v+w|0;if((g|0)>0){x=(x|0)/2&-1;g=g-1|0;w=z}else{break}}A=(z|0)%2;B=c[d>>2]|0}else{A=0;B=y}c[a+(B-1<<2)>>2]=(2-A|0)%2+1|0;return}else{L860:do{if(f){A=0;B=c[a+52>>2]|0;y=(b|0)/(l|0)&-1;z=e;while(1){L864:do{if((B|0)>0){w=z-A|0;g=B;x=1;v=1;while(1){u=w-1|0;k=$(u,x);j=$(g,v);h=g-1|0;if((h|0)>0){w=u;g=h;x=k;v=j}else{C=k;D=j;break L864}}}else{C=1;D=1}}while(0);v=(C|0)/(D|0)&-1;if((v|0)>(y|0)){c[a+(A<<2)>>2]=0;E=y;F=B}else{c[a+(A<<2)>>2]=1;E=y-v|0;F=B-1|0}v=A+1|0;x=c[d>>2]|0;if((v|0)<(x|0)){A=v;B=F;y=E;z=x}else{G=x;break L860}}}else{G=e}}while(0);e=G;G=(b|0)%(l|0);L874:while(1){l=e;while(1){H=l-1|0;if((l|0)<=0){break L874}I=a+(H<<2)|0;if((c[I>>2]|0)==0){l=H}else{break}}c[I>>2]=(G|0)%2+1|0;e=H;G=(G|0)/2&-1}return}}function bw(a,b){a=a|0;b=b|0;var d=0,e=0,f=0,g=0,h=0,j=0,k=0,l=0,m=0,n=0,o=0,p=0,q=0,r=0,s=0,t=0,u=0,v=0,w=0,x=0,y=0,z=0,A=0,B=0,C=0,D=0,E=0,F=0,G=0,H=0,I=0,J=0,K=0,L=0,M=0,N=0,O=0,P=0,Q=0,R=0,S=0,T=0,U=0,V=0,W=0,X=0,Y=0,Z=0,_=0,aa=0,ab=0,ac=0,ad=0,ae=0,af=0,ag=0,ah=0,ai=0,aj=0;d=i;i=i+72|0;e=d|0;f=a+48|0;g=c[f>>2]|0;h=(g|0)>0;L904:do{if(h){j=c[a+72>>2]|0;k=j>>12;l=j^-1;j=0;m=0;n=0;while(1){o=1<<j;if((k&o|0)==0){p=n;q=m}else{p=((o&l|0)!=0&1)+n|0;q=m+1|0}o=j+1|0;if((o|0)<(g|0)){j=o;m=q;n=p}else{break}}n=e+48|0;c[n>>2]=q;m=e+52|0;c[m>>2]=p;j=e+56|0;L913:do{if((q|0)>1){l=q;k=1;while(1){o=$(l,k);r=l-1|0;if((r|0)>1){l=r;k=o}else{s=o;break L913}}}else{s=1}}while(0);c[j>>2]=s;k=e+60|0;L917:do{if((p|0)>1){l=p;o=1;while(1){r=$(l,o);t=l-1|0;if((t|0)>1){l=t;o=r}else{u=r;break L917}}}else{u=1}}while(0);c[k>>2]=u;j=e+64|0;if((p|0)>0){v=q;w=p;x=1;y=1}else{z=q;A=n;B=m;C=j;D=636;break}while(1){E=$(v,x);F=$(w,y);o=w-1|0;if((o|0)>0){v=v-1|0;w=o;x=E;y=F}else{break}}c[j>>2]=(E|0)/(F|0)&-1;k=q;o=p;l=1;while(1){r=$(k,l);t=o-1|0;if((t|0)>0){k=k-1|0;o=t;l=r}else{G=r;H=q;I=n;J=m;break L904}}}else{m=e+48|0;c[m>>2]=0;n=e+52|0;c[n>>2]=0;c[e+56>>2]=1;c[e+60>>2]=1;z=0;A=m;B=n;C=e+64|0;D=636;break}}while(0);if((D|0)==636){c[C>>2]=1;G=1;H=z;I=A;J=B}c[e+68>>2]=G;L929:do{if((H|0)>0){G=0;while(1){c[e+(G<<2)>>2]=0;B=G+1|0;K=c[I>>2]|0;if((B|0)<(K|0)){G=B}else{break}}if((K|0)<=0){break}G=0;B=c[J>>2]|0;A=b;z=K;while(1){L936:do{if((B|0)>0){C=z-G|0;D=B;q=1;p=1;while(1){F=C-1|0;E=$(F,q);y=$(D,p);x=D-1|0;if((x|0)>0){C=F;D=x;q=E;p=y}else{L=E;M=y;break L936}}}else{L=1;M=1}}while(0);p=(L|0)/(M|0)&-1;if((p|0)>(A|0)){c[e+(G<<2)>>2]=0;N=A;O=B}else{c[e+(G<<2)>>2]=1;N=A-p|0;O=B-1|0}p=G+1|0;q=c[I>>2]|0;if((p|0)<(q|0)){G=p;B=O;A=N;z=q}else{break L929}}}}while(0);L946:do{if(h){N=a+72|0;O=0;I=0;while(1){M=c[N>>2]|0;L=1<<O;do{if((M>>12&L|0)==0){K=a+(O<<2)|0;if((L&(M^-1)|0)==0){c[K>>2]=0;P=I;break}else{c[K>>2]=1;P=I;break}}else{c[a+(O<<2)>>2]=c[e+(I<<2)>>2]|0;P=I+1|0}}while(0);M=O+1|0;Q=c[f>>2]|0;if((M|0)<(Q|0)){O=M;I=P}else{break}}if((Q|0)>0){R=0;S=0;T=1}else{U=0;V=1;W=Q;break}while(1){I=c[a+(R<<2)>>2]|0;if((I|0)==0){X=T;Y=S}else{X=T<<1;Y=((S<<1)-1|0)+I|0}I=R+1|0;if((I|0)==(Q|0)){U=Y;V=X;W=Q;break L946}else{R=I;S=Y;T=X}}}else{U=0;V=1;W=g}}while(0);if((c[a+72>>2]&4095|0)==0){Z=(V|0)/2&-1;_=(U|0)/2&-1}else{Z=V;_=U}U=c[a+52>>2]|0;if((W-U|0)>0){aa=0;ab=U;ac=0}else{ad=0;ae=$(ad,Z);af=ae+_|0;i=d;return af|0}while(1){if((c[a+(aa<<2)>>2]|0)==0){ag=ac;ah=ab}else{U=ab-1|0;L973:do{if((ab|0)>0){V=W-aa|0;g=ab;X=1;T=1;while(1){Y=V-1|0;S=$(Y,X);R=$(g,T);Q=g-1|0;if((Q|0)>0){V=Y;g=Q;X=S;T=R}else{ai=S;aj=R;break L973}}}else{ai=1;aj=1}}while(0);ag=((ai|0)/(aj|0)&-1)+ac|0;ah=U}T=aa+1|0;if((T|0)<(W-ah|0)){aa=T;ab=ah;ac=ag}else{ad=ag;break}}ae=$(ad,Z);af=ae+_|0;i=d;return af|0}function bx(a,b){a=a|0;b=b|0;var d=0,e=0,f=0,g=0,h=0,j=0,k=0,l=0,m=0,n=0,o=0,p=0,q=0,r=0,s=0,t=0,u=0,v=0,w=0,x=0,y=0,z=0,A=0,B=0,C=0,D=0,E=0,F=0,G=0,H=0;d=i;i=i+72|0;e=d|0;f=c[a+72>>2]^-1;g=(((f>>>8&1)+(f>>>9&1)|0)+(f>>>10&1)|0)+(f>>>11&1)|0;f=e+48|0;c[f>>2]=4;h=e+52|0;c[h>>2]=g;c[e+56>>2]=24;j=e+60|0;L981:do{if((g|0)>1){k=g;l=1;while(1){m=$(k,l);n=k-1|0;if((n|0)>1){k=n;l=m}else{o=m;break L981}}}else{o=1}}while(0);c[j>>2]=o;o=e+64|0;L985:do{if((g|0)>0){j=4;l=g;k=1;m=1;while(1){p=$(j,k);q=$(l,m);n=l-1|0;if((n|0)>0){j=j-1|0;l=n;k=p;m=q}else{break}}c[o>>2]=(p|0)/(q|0)&-1;m=4;k=g;l=1;while(1){j=$(m,l);n=k-1|0;if((n|0)>0){m=m-1|0;k=n;l=j}else{r=j;break L985}}}else{c[o>>2]=1;r=1}}while(0);c[e+68>>2]=r;r=0;while(1){c[e+(r<<2)>>2]=0;o=r+1|0;s=c[f>>2]|0;if((o|0)<(s|0)){r=o}else{break}}L996:do{if((s|0)>0){r=0;o=c[h>>2]|0;g=b;q=s;while(1){L1000:do{if((o|0)>0){p=q-r|0;l=o;k=1;m=1;while(1){j=p-1|0;n=$(j,k);t=$(l,m);u=l-1|0;if((u|0)>0){p=j;l=u;k=n;m=t}else{v=n;w=t;break L1000}}}else{v=1;w=1}}while(0);m=(v|0)/(w|0)&-1;if((m|0)>(g|0)){c[e+(r<<2)>>2]=0;x=g;y=o}else{c[e+(r<<2)>>2]=1;x=g-m|0;y=o-1|0}m=r+1|0;k=c[f>>2]|0;if((m|0)<(k|0)){r=m;o=y;g=x;q=k}else{break L996}}}}while(0);x=a+48|0;y=c[x>>2]|0;L1010:do{if((y|0)>0){f=0;while(1){c[a+(f<<2)>>2]=0;w=f+1|0;v=c[x>>2]|0;if((w|0)<(v|0)){f=w}else{z=v;break L1010}}}else{z=y}}while(0);c[a+32>>2]=c[e>>2]|0;c[a+36>>2]=c[e+4>>2]|0;c[a+40>>2]=c[e+8>>2]|0;c[a+44>>2]=c[e+12>>2]|0;e=c[a+52>>2]|0;if((z-e|0)>0){A=0;B=e;C=0}else{D=0;i=d;return D|0}while(1){if((c[a+(A<<2)>>2]|0)==0){E=C;F=B}else{e=B-1|0;L1020:do{if((B|0)>0){y=z-A|0;x=B;f=1;v=1;while(1){w=y-1|0;s=$(w,f);b=$(x,v);h=x-1|0;if((h|0)>0){y=w;x=h;f=s;v=b}else{G=s;H=b;break L1020}}}else{G=1;H=1}}while(0);E=((G|0)/(H|0)&-1)+C|0;F=e}v=A+1|0;if((v|0)<(z-F|0)){A=v;B=F;C=E}else{D=E;break}}i=d;return D|0}function by(a,b){a=a|0;b=b|0;var d=0,e=0,f=0,g=0,h=0,i=0,j=0,k=0,l=0,m=0,n=0;b=a|0;d=a+48|0;L1028:do{if((c[d>>2]|0)>0){e=0;while(1){c[a+(e<<2)>>2]=0;f=e+1|0;if((f|0)<(c[d>>2]|0)){e=f}else{break L1028}}}}while(0);d=c[a+72>>2]|0;if((d&1|0)==0){c[a>>2]=1;g=2}else{g=1}if((d&2|0)==0){c[a+4>>2]=g;h=g+1|0}else{h=g}if((d&4|0)==0){c[a+8>>2]=h;i=h+1|0}else{i=h}if((d&8|0)==0){c[a+12>>2]=i;j=i+1|0}else{j=i}if((d&16|0)==0){c[a+16>>2]=j;k=j+1|0}else{k=j}if((d&32|0)==0){c[a+20>>2]=k;l=k+1|0}else{l=k}if((d&64|0)==0){c[a+24>>2]=l;m=l+1|0}else{m=l}if((d&128|0)!=0){n=be(b)|0;return n|0}c[a+28>>2]=m;n=be(b)|0;return n|0}function bz(a,b){a=a|0;b=b|0;var d=0,e=0,f=0,g=0,h=0,i=0,j=0,k=0,l=0,m=0,n=0;b=a|0;d=a+48|0;L1058:do{if((c[d>>2]|0)>0){e=0;while(1){c[a+(e<<2)>>2]=0;f=e+1|0;if((f|0)<(c[d>>2]|0)){e=f}else{break L1058}}}}while(0);d=c[a+72>>2]|0;if((d&1|0)==0){c[a>>2]=1;g=2}else{g=1}if((d&2|0)==0){c[a+4>>2]=g;h=g+1|0}else{h=g}if((d&4|0)==0){c[a+8>>2]=h;i=h+1|0}else{i=h}if((d&8|0)==0){c[a+12>>2]=i;j=i+1|0}else{j=i}if((d&16|0)==0){c[a+16>>2]=j;k=j+1|0}else{k=j}if((d&32|0)==0){c[a+20>>2]=k;l=k+1|0}else{l=k}if((d&64|0)==0){c[a+24>>2]=l;m=l+1|0}else{m=l}if((d&128|0)!=0){n=be(b)|0;return n|0}c[a+28>>2]=m;n=be(b)|0;return n|0}function bA(a,b){a=a|0;b=b|0;var d=0,e=0,f=0,g=0,h=0,j=0,k=0,l=0,m=0,n=0,o=0,p=0,q=0;d=i;i=i+72|0;e=d|0;f=c[a+72>>2]^-1;g=(((f>>>1&1)+(f&1)|0)+(f>>>2&1)|0)+(f>>>3&1)|0;f=e+48|0;c[f>>2]=8;c[e+52>>2]=g;c[e+56>>2]=40320;h=e+60|0;L1088:do{if((g|0)>1){j=g;k=1;while(1){l=$(j,k);m=j-1|0;if((m|0)>1){j=m;k=l}else{n=l;break L1088}}}else{n=1}}while(0);c[h>>2]=n;n=e+64|0;L1092:do{if((g|0)>0){h=8;k=g;j=1;l=1;while(1){o=$(h,j);p=$(k,l);m=k-1|0;if((m|0)>0){h=h-1|0;k=m;j=o;l=p}else{break}}c[n>>2]=(o|0)/(p|0)&-1;l=8;j=g;k=1;while(1){h=$(l,k);m=j-1|0;if((m|0)>0){l=l-1|0;j=m;k=h}else{q=h;break L1092}}}else{c[n>>2]=1;q=1}}while(0);c[e+68>>2]=q;q=0;while(1){c[e+(q<<2)>>2]=0;n=q+1|0;if((n|0)<(c[f>>2]|0)){q=n}else{break}}bf(a|0,b);c[e>>2]=c[a>>2]|0;c[e+4>>2]=c[a+4>>2]|0;c[e+8>>2]=c[a+8>>2]|0;c[e+12>>2]=c[a+12>>2]|0;c[e+16>>2]=c[a+16>>2]|0;c[e+20>>2]=c[a+20>>2]|0;c[e+24>>2]=c[a+24>>2]|0;c[e+28>>2]=c[a+28>>2]|0;a=be(e)|0;i=d;return a|0}function bB(a,b){a=a|0;b=b|0;var d=0,e=0,f=0,g=0,h=0,j=0,k=0,l=0,m=0,n=0,o=0,p=0,q=0;d=i;i=i+72|0;e=d|0;f=c[a+72>>2]^-1;g=(((f>>>4&1)+(f>>>5&1)|0)+(f>>>6&1)|0)+(f>>>7&1)|0;f=e+48|0;c[f>>2]=8;c[e+52>>2]=g;c[e+56>>2]=40320;h=e+60|0;L1104:do{if((g|0)>1){j=g;k=1;while(1){l=$(j,k);m=j-1|0;if((m|0)>1){j=m;k=l}else{n=l;break L1104}}}else{n=1}}while(0);c[h>>2]=n;n=e+64|0;L1108:do{if((g|0)>0){h=8;k=g;j=1;l=1;while(1){o=$(h,j);p=$(k,l);m=k-1|0;if((m|0)>0){h=h-1|0;k=m;j=o;l=p}else{break}}c[n>>2]=(o|0)/(p|0)&-1;l=8;j=g;k=1;while(1){h=$(l,k);m=j-1|0;if((m|0)>0){l=l-1|0;j=m;k=h}else{q=h;break L1108}}}else{c[n>>2]=1;q=1}}while(0);c[e+68>>2]=q;q=0;while(1){c[e+(q<<2)>>2]=0;n=q+1|0;if((n|0)<(c[f>>2]|0)){q=n}else{break}}bf(a|0,b);c[e>>2]=c[a>>2]|0;c[e+4>>2]=c[a+4>>2]|0;c[e+8>>2]=c[a+8>>2]|0;c[e+12>>2]=c[a+12>>2]|0;c[e+16>>2]=c[a+16>>2]|0;c[e+20>>2]=c[a+20>>2]|0;c[e+24>>2]=c[a+24>>2]|0;c[e+28>>2]=c[a+28>>2]|0;a=be(e)|0;i=d;return a|0}function bC(a,b){a=a|0;b=b|0;var d=0,e=0,f=0,g=0,h=0,j=0,k=0,l=0,m=0,n=0,o=0,p=0,q=0;d=i;i=i+72|0;e=d|0;f=c[a+72>>2]^-1;g=(((f>>>8&1)+(f>>>9&1)|0)+(f>>>10&1)|0)+(f>>>11&1)|0;f=e+48|0;c[f>>2]=4;c[e+52>>2]=g;c[e+56>>2]=24;h=e+60|0;L1120:do{if((g|0)>1){j=g;k=1;while(1){l=$(j,k);m=j-1|0;if((m|0)>1){j=m;k=l}else{n=l;break L1120}}}else{n=1}}while(0);c[h>>2]=n;n=e+64|0;L1124:do{if((g|0)>0){h=4;k=g;j=1;l=1;while(1){o=$(h,j);p=$(k,l);m=k-1|0;if((m|0)>0){h=h-1|0;k=m;j=o;l=p}else{break}}c[n>>2]=(o|0)/(p|0)&-1;l=4;j=g;k=1;while(1){h=$(l,k);m=j-1|0;if((m|0)>0){l=l-1|0;j=m;k=h}else{q=h;break L1124}}}else{c[n>>2]=1;q=1}}while(0);c[e+68>>2]=q;q=0;while(1){c[e+(q<<2)>>2]=0;n=q+1|0;if((n|0)<(c[f>>2]|0)){q=n}else{break}}bf(a|0,b);c[e>>2]=c[a+32>>2]|0;c[e+4>>2]=c[a+36>>2]|0;c[e+8>>2]=c[a+40>>2]|0;c[e+12>>2]=c[a+44>>2]|0;a=be(e)|0;i=d;return a|0}function bD(a,b){a=a|0;b=b|0;var d=0,e=0,f=0,g=0,h=0,i=0,j=0,k=0,l=0,m=0,n=0;d=b^-1;e=(((((((d>>>1&1)+(d&1)|0)+(d>>>2&1)|0)+(d>>>3&1)|0)+(d>>>4&1)|0)+(d>>>5&1)|0)+(d>>>6&1)|0)+(d>>>7&1)|0;d=a+48|0;c[d>>2]=8;c[a+52>>2]=e;c[a+56>>2]=40320;f=a+60|0;L1136:do{if((e|0)>1){g=e;h=1;while(1){i=$(g,h);j=g-1|0;if((j|0)>1){g=j;h=i}else{k=i;break L1136}}}else{k=1}}while(0);c[f>>2]=k;k=a+64|0;L1140:do{if((e|0)>0){f=8;h=e;g=1;i=1;while(1){l=$(f,g);m=$(h,i);j=h-1|0;if((j|0)>0){f=f-1|0;h=j;g=l;i=m}else{break}}c[k>>2]=(l|0)/(m|0)&-1;i=8;g=e;h=1;while(1){f=$(i,h);j=g-1|0;if((j|0)>0){i=i-1|0;g=j;h=f}else{n=f;break L1140}}}else{c[k>>2]=1;n=1}}while(0);c[a+68>>2]=n;n=0;while(1){c[a+(n<<2)>>2]=0;k=n+1|0;if((k|0)<(c[d>>2]|0)){n=k}else{break}}c[a+72>>2]=b;return}function bE(a,b,d){a=a|0;b=b|0;d=d|0;var e=0,f=0,g=0,h=0,j=0,k=0,l=0,m=0,n=0,o=0,p=0,q=0,r=0,s=0,t=0,u=0,v=0,w=0,x=0;e=i;f=a;g=i;i=i+76|0;h=i;i=i+76|0;j=h;k=c[a+72>>2]|0;l=k^-1;m=(((l>>>4&1)+(l>>>5&1)|0)+(l>>>6&1)|0)+(l>>>7&1)|0;l=g+48|0;c[l>>2]=8;c[g+52>>2]=m;c[g+56>>2]=40320;n=g+60|0;L1152:do{if((m|0)>1){o=m;p=1;while(1){q=$(o,p);r=o-1|0;if((r|0)>1){o=r;p=q}else{s=q;break L1152}}}else{s=1}}while(0);c[n>>2]=s;s=g+64|0;L1156:do{if((m|0)>0){n=8;p=m;o=1;q=1;while(1){t=$(n,o);u=$(p,q);r=p-1|0;if((r|0)>0){n=n-1|0;p=r;o=t;q=u}else{break}}c[s>>2]=(t|0)/(u|0)&-1;q=8;o=m;p=1;while(1){n=$(q,p);r=o-1|0;if((r|0)>0){q=q-1|0;o=r;p=n}else{v=n;break L1156}}}else{c[s>>2]=1;v=1}}while(0);c[g+68>>2]=v;v=0;while(1){c[g+(v<<2)>>2]=0;s=v+1|0;if((s|0)<(c[l>>2]|0)){v=s}else{break}}c[g+72>>2]=k;bD(h,k);bf(a|0,b);cV(j,f,32);f=c[a>>2]|0;j=(f|0)>0?f:0;f=c[a+4>>2]|0;b=(j|0)<(f|0)?f:j;j=c[a+8>>2]|0;f=(b|0)<(j|0)?j:b;b=c[a+12>>2]|0;j=(f|0)<(b|0)?b:f;f=c[a+16>>2]|0;b=(j|0)<(f|0)?f:j;j=c[a+20>>2]|0;f=(b|0)<(j|0)?j:b;b=c[a+24>>2]|0;j=(f|0)<(b|0)?b:f;f=c[a+28>>2]|0;a=(j|0)<(f|0)?f:j;bf(g|0,d);d=c[g>>2]|0;if((d|0)!=0){c[h>>2]=d+a|0}d=c[g+4>>2]|0;if((d|0)!=0){c[h+4>>2]=d+a|0}d=c[g+8>>2]|0;if((d|0)!=0){c[h+8>>2]=d+a|0}d=c[g+12>>2]|0;if((d|0)!=0){c[h+12>>2]=d+a|0}d=c[g+16>>2]|0;if((d|0)!=0){c[h+16>>2]=d+a|0}d=c[g+20>>2]|0;if((d|0)!=0){c[h+20>>2]=d+a|0}d=c[g+24>>2]|0;if((d|0)!=0){c[h+24>>2]=d+a|0}d=c[g+28>>2]|0;if((d|0)==0){w=h|0;x=be(w)|0;i=e;return x|0}c[h+28>>2]=d+a|0;w=h|0;x=be(w)|0;i=e;return x|0}function bF(a,b,d,f,g){a=a|0;b=b|0;d=d|0;f=f|0;g=g|0;var h=0,j=0,k=0,l=0,m=0,n=0,o=0,q=0,r=0,s=0,t=0,v=0,w=0,x=0,y=0,z=0,A=0,B=0,C=0,D=0,E=0;h=i;i=i+152|0;j=f;f=i;i=i+164|0;cV(f,j,164);j=h|0;k=h+76|0;l=c[f+4>>2]|0;bq(j,l);m=c[f>>2]|0;br(k,m);ax(5246696,28,1,c[p>>2]|0);n=a|0;c[n>>2]=0;o=a+4|0;c[o>>2]=0;q=c[j+48>>2]|0;r=c[j+72>>2]|0;L1193:do{if((q|0)>0){s=r^-1;t=0;v=1;while(1){w=v<<((1<<t&s|0)!=0&1);x=t+1|0;if((x|0)==(q|0)){y=w;break L1193}else{t=x;v=w}}}else{y=1}}while(0);if((r&4095|0)==0){z=(y|0)/2&-1}else{z=y}if(($(c[j+64>>2]|0,z)|0)>2048){c[o>>2]=1;A=1}else{A=0}z=c[k+48>>2]|0;j=c[k+72>>2]|0;L1204:do{if((z|0)>0){y=j^-1;r=0;q=1;while(1){if((1<<r&y|0)==0){B=q}else{B=q*3&-1}v=r+1|0;if((v|0)==(z|0)){C=B;break L1204}else{r=v;q=B}}}else{C=1}}while(0);if((j&255|0)==0){D=(C|0)/3&-1}else{D=C}if(($(c[k+64>>2]|0,D)|0)>2187){c[n>>2]=1;E=5245296}else{E=5244284}ap(c[p>>2]|0,5246644,(u=i,i=i+8|0,c[u>>2]=(A|0)!=0?5245296:5244284,c[u+4>>2]=E,u)|0);E=cT(10103948)|0;A=e[f+10>>1]|0;bJ(E,b,d,m,A);c[a+16>>2]=E;do{if((c[o>>2]|0)==0){E=c[p>>2]|0;ax(5243492,31,1,E|0);c[a+8>>2]=0;E=cT(1013768)|0;bK(E,b,d,l,A);c[a+20>>2]=E;if((c[n>>2]|0)==0){E=cT(4478984)|0;bH(E,b,d,m,l);c[a+12>>2]=E;break}else{E=c[p>>2]|0;ax(5243672,47,1,E|0);c[a+12>>2]=0;break}}else{E=cT(126724)|0;bI(E,b,d,l);c[a+8>>2]=E;ax(5243924,55,1,c[p>>2]|0);c[a+20>>2]=0;ax(5243672,47,1,c[p>>2]|0);c[a+12>>2]=0}}while(0);if((g|0)==0){g=c[p>>2]|0;ax(5243008,40,1,g|0);c[a+24>>2]=0;g=c[p>>2]|0;ax(5246820,67,1,g|0);c[a+28>>2]=0;g=c[p>>2]|0;ax(5246572,69,1,g|0);c[a+32>>2]=0;g=c[p>>2]|0;ax(5246256,48,1,g|0);c[a+36>>2]=0;g=cT(967688)|0;l=c[f+8>>2]|0;bP(g,b,d,A,l&65535);c[a+40>>2]=g;g=cT(967684)|0;bQ(g,b,d,l>>>16);c[a+44>>2]=g;g=c[p>>2]|0;l=ax(5246152,21,1,g|0)|0;i=h;return}else{A=cT(40324)|0;m=c[f+8>>2]|0;bL(A,b,d,m&65535);c[a+24>>2]=A;A=cT(5880604)|0;f=m>>>16;bM(A,b,d,f);c[a+28>>2]=A;A=cT(5880604)|0;bN(A,b,d,f);c[a+32>>2]=A;A=cT(11884)|0;bO(A,b,d,f);c[a+36>>2]=A;A=c[p>>2]|0;ax(5243324,67,1,A|0);c[a+40>>2]=0;A=c[p>>2]|0;ax(5243156,59,1,A|0);c[a+44>>2]=0;g=c[p>>2]|0;l=ax(5246152,21,1,g|0)|0;i=h;return}}function bG(a){a=a|0;var b=0;b=c[a+8>>2]|0;if((b|0)!=0){cQ(b|0)}b=c[a+12>>2]|0;if((b|0)!=0){cQ(b|0)}b=c[a+16>>2]|0;if((b|0)!=0){cQ(b|0)}b=c[a+20>>2]|0;if((b|0)!=0){cQ(b|0)}b=c[a+24>>2]|0;if((b|0)!=0){cQ(b|0)}b=c[a+28>>2]|0;if((b|0)!=0){cQ(b|0)}b=c[a+32>>2]|0;if((b|0)!=0){cQ(b|0)}b=c[a+36>>2]|0;if((b|0)!=0){cQ(b|0)}b=c[a+40>>2]|0;if((b|0)!=0){cQ(b|0)}b=c[a+44>>2]|0;if((b|0)==0){return}cQ(b|0);return}function bH(b,f,g,h,j){b=b|0;f=f|0;g=g|0;h=h|0;j=j|0;var k=0,l=0,m=0,n=0,o=0,q=0,r=0,s=0,t=0,v=0,w=0,x=0,y=0,z=0,A=0,B=0,C=0,D=0,E=0,F=0,G=0,H=0,I=0,J=0,K=0,L=0,M=0,N=0,O=0,P=0,Q=0,R=0,S=0,T=0,U=0,V=0,W=0,X=0,Y=0,Z=0;k=i;i=i+152|0;l=k|0;m=k+76|0;c[b+4478976>>2]=h;c[b+4478980>>2]=j;br(l,h);h=c[l+48>>2]|0;n=(h|0)>0;o=c[l+72>>2]|0;L1263:do{if(n){q=o^-1;r=0;s=1;while(1){if((1<<r&q|0)==0){t=s}else{t=s*3&-1}v=r+1|0;if((v|0)==(h|0)){w=t;break L1263}else{r=v;s=t}}}else{w=1}}while(0);if((o&255|0)==0){x=(w|0)/3&-1}else{x=w}w=$(c[l+64>>2]|0,x);L1274:do{if(n){x=o>>8;t=o^-1;s=0;r=0;q=0;while(1){v=1<<s;if((v&x|0)==0){y=q;z=r}else{y=((v&t|0)!=0&1)+q|0;z=r+1|0}v=s+1|0;if((v|0)==(h|0)){break}else{s=v;r=z;q=y}}if((y|0)>0){A=z;B=y;C=1;D=1}else{E=1;F=1;break}while(1){q=$(A,C);r=$(B,D);s=B-1|0;if((s|0)>0){A=A-1|0;B=s;C=q;D=r}else{E=q;F=r;break L1274}}}else{E=1;F=1}}while(0);D=(E|0)/(F|0)&-1;bq(m,j);j=c[m+48>>2]|0;F=(j|0)>0;E=c[m+72>>2]|0;L1285:do{if(F){C=E^-1;B=0;A=1;while(1){y=A<<((1<<B&C|0)!=0&1);z=B+1|0;if((z|0)==(j|0)){G=y;break L1285}else{B=z;A=y}}}else{G=1}}while(0);if((E&4095|0)==0){H=(G|0)/2&-1}else{H=G}G=$(c[m+64>>2]|0,H);L1293:do{if(F){H=E>>12;A=E^-1;B=0;C=0;y=0;while(1){z=1<<B;if((z&H|0)==0){I=y;J=C}else{I=((z&A|0)!=0&1)+y|0;J=C+1|0}z=B+1|0;if((z|0)==(j|0)){break}else{B=z;C=J;y=I}}if((I|0)>0){K=J;L=I;M=1;N=1}else{O=1;P=1;break}while(1){y=$(K,M);C=$(L,N);B=L-1|0;if((B|0)>0){K=K-1|0;L=B;M=y;N=C}else{O=y;P=C;break L1293}}}else{O=1;P=1}}while(0);N=(O|0)/(P|0)&-1;P=(w|0)>0;L1304:do{if(P){O=(G|0)>0;M=0;while(1){if(O){cX(b+(M<<11)|0,30,G|0)}L=M+1|0;if((L|0)==(w|0)){Q=0;R=0;break L1304}else{M=L}}}else{Q=0;R=0}}while(0);while(1){M=d[g+Q|0]|0;S=(R|0)<(M|0)?M:R;M=Q+1|0;if((M|0)==27){break}else{Q=M;R=S}}ap(c[p>>2]|0,5246060,(u=i,i=i+8|0,c[u>>2]=D,c[u+4>>2]=N,u)|0);L1314:do{if((D|0)>0){R=(N|0)>0;Q=0;while(1){L1318:do{if(R){M=0;while(1){O=bw(m,M)|0;a[b+(bu(l,Q)<<11)+O|0]=0;O=M+1|0;if((O|0)==(N|0)){break L1318}else{M=O}}}}while(0);M=Q+1|0;if((M|0)==(D|0)){break L1314}else{Q=M}}}}while(0);l=$(N,D);if((l|0)==0){i=k;return}D=(G|0)>0;N=f|0;m=f+4|0;f=0;Q=0;R=l;while(1){l=R+f|0;ap(c[p>>2]|0,5246008,(u=i,i=i+12|0,c[u>>2]=Q,c[u+4>>2]=R,c[u+8>>2]=l,u)|0);M=Q+1|0;if(!P){T=919;break}O=M&255;L=0;K=0;while(1){L1331:do{if(D){I=0;J=K;while(1){j=b+(L<<11)+I|0;E=a[j]|0;F=E&255;L1334:do{if((M|0)>(F|0)){if((M|0)>(F+S|0)){U=J;break}else{V=0;W=J;X=E}while(1){do{if((M|0)==((d[g+V|0]|0)+(X&255)|0)){C=(c[(c[m>>2]|0)+(V*506880&-1)+(I<<2)>>2]|0)+(b+((e[(c[N>>2]|0)+(V*40824&-1)+(L<<1)>>1]|0)<<11))|0;if((d[C]|0|0)<=(M|0)){Y=W;break}a[C]=O;Y=W+1|0}else{Y=W}}while(0);C=V+1|0;if((C|0)==27){U=Y;break L1334}V=C;W=Y;X=a[j]|0}}else{U=J}}while(0);j=I+1|0;if((j|0)==(G|0)){Z=U;break L1331}else{I=j;J=U}}}else{Z=K}}while(0);J=L+1|0;if((J|0)==(w|0)){break}else{L=J;K=Z}}if((Z|0)==0){T=918;break}else{f=l;Q=M;R=Z}}if((T|0)==918){i=k;return}else if((T|0)==919){i=k;return}}function bI(b,e,f,g){b=b|0;e=e|0;f=f|0;g=g|0;var h=0,j=0,k=0,l=0,m=0,n=0,o=0,q=0,r=0,s=0,t=0,v=0,w=0,x=0,y=0,z=0,A=0,B=0,C=0,D=0,E=0,F=0,G=0,H=0,I=0,J=0,K=0,L=0,M=0;h=i;j=b|0;k=i;i=i+76|0;c[b+126720>>2]=g;bq(k,g);g=c[k+48>>2]|0;l=(g|0)>0;m=c[k+72>>2]|0;L1350:do{if(l){n=m^-1;o=0;q=1;while(1){r=q<<((1<<o&n|0)!=0&1);s=o+1|0;if((s|0)==(g|0)){t=r;break L1350}else{o=s;q=r}}}else{t=1}}while(0);if((m&4095|0)==0){v=(t|0)/2&-1}else{v=t}t=$(c[k+64>>2]|0,v);L1358:do{if(l){v=m>>12;q=m^-1;o=0;n=0;r=0;while(1){s=1<<o;if((s&v|0)==0){w=r;x=n}else{w=((s&q|0)!=0&1)+r|0;x=n+1|0}s=o+1|0;if((s|0)==(g|0)){break}else{o=s;n=x;r=w}}if((w|0)>0){y=x;z=w;A=1;B=1}else{C=1;D=1;break}while(1){r=$(y,A);n=$(z,B);o=z-1|0;if((o|0)>0){y=y-1|0;z=o;A=r;B=n}else{C=r;D=n;break L1358}}}else{C=1;D=1}}while(0);B=(C|0)/(D|0)&-1;D=(t|0)>0;do{if(D){cX(j|0,30,t|0);E=0;F=0;break}else{E=0;F=0}}while(0);while(1){j=d[f+E|0]|0;G=(F|0)<(j|0)?j:F;j=E+1|0;if((j|0)==27){break}else{E=j;F=G}}ap(c[p>>2]|0,5245844,(u=i,i=i+4|0,c[u>>2]=B,u)|0);L1374:do{if((B|0)>0){F=0;while(1){a[b+(bw(k,F)|0)|0]=0;E=F+1|0;if((E|0)==(B|0)){break L1374}else{F=E}}}}while(0);if((B|0)==0){i=h;return}k=e+4|0;e=0;F=0;E=B;while(1){B=E+e|0;ap(c[p>>2]|0,5246008,(u=i,i=i+12|0,c[u>>2]=F,c[u+4>>2]=E,c[u+8>>2]=B,u)|0);j=F+1|0;if(!D){H=954;break}C=j&255;A=0;z=0;while(1){y=b+A|0;w=a[y]|0;x=w&255;L1386:do{if((j|0)>(x|0)){if((j|0)>(x+G|0)){I=z;break}else{J=0;K=z;L=w}while(1){do{if((j|0)==((d[f+J|0]|0)+(L&255)|0)){g=b+(c[(c[k>>2]|0)+(J*506880&-1)+(A<<2)>>2]|0)|0;if((d[g]|0|0)<=(j|0)){M=K;break}a[g]=C;M=K+1|0}else{M=K}}while(0);g=J+1|0;if((g|0)==27){I=M;break L1386}J=g;K=M;L=a[y]|0}}else{I=z}}while(0);y=A+1|0;if((y|0)==(t|0)){break}else{A=y;z=I}}if((I|0)==0){H=953;break}else{e=B;F=j;E=I}}if((H|0)==954){i=h;return}else if((H|0)==953){i=h;return}}function bJ(b,f,g,h,j){b=b|0;f=f|0;g=g|0;h=h|0;j=j|0;var k=0,l=0,m=0,n=0,o=0,q=0,r=0,s=0,t=0,v=0,w=0,x=0,y=0,z=0,A=0,B=0,C=0,D=0,E=0,F=0,G=0,H=0,I=0,J=0,K=0,L=0,M=0,N=0,O=0,P=0,Q=0,R=0,S=0,T=0,U=0,V=0,W=0;k=i;i=i+152|0;l=k|0;m=k+76|0;c[b+10103940>>2]=h;c[b+10103944>>2]=j;br(l,h);h=c[l+48>>2]|0;n=(h|0)>0;o=c[l+72>>2]|0;L1401:do{if(n){q=o^-1;r=0;s=1;while(1){if((1<<r&q|0)==0){t=s}else{t=s*3&-1}v=r+1|0;if((v|0)==(h|0)){w=t;break L1401}else{r=v;s=t}}}else{w=1}}while(0);if((o&255|0)==0){x=(w|0)/3&-1}else{x=w}w=$(c[l+64>>2]|0,x);L1412:do{if(n){x=o>>8;t=o^-1;s=0;r=0;q=0;while(1){v=1<<s;if((v&x|0)==0){y=q;z=r}else{y=((v&t|0)!=0&1)+q|0;z=r+1|0}v=s+1|0;if((v|0)==(h|0)){break}else{s=v;r=z;q=y}}if((y|0)>0){A=z;B=y;C=1;D=1}else{E=1;F=1;break}while(1){q=$(A,C);r=$(B,D);s=B-1|0;if((s|0)>0){A=A-1|0;B=s;C=q;D=r}else{E=q;F=r;break L1412}}}else{E=1;F=1}}while(0);D=(E|0)/(F|0)&-1;F=j^-1;E=(((F>>>8&1)+(F>>>9&1)|0)+(F>>>10&1)|0)+(F>>>11&1)|0;F=m+48|0;c[F>>2]=12;c[m+52>>2]=E;c[m+56>>2]=479001600;C=m+60|0;L1423:do{if((E|0)>1){B=E;A=1;while(1){y=$(B,A);z=B-1|0;if((z|0)>1){B=z;A=y}else{G=y;break L1423}}}else{G=1}}while(0);c[C>>2]=G;G=m+64|0;C=(E|0)>0;L1427:do{if(C){A=12;B=E;y=1;z=1;while(1){H=$(A,y);I=$(B,z);h=B-1|0;if((h|0)>0){A=A-1|0;B=h;y=H;z=I}else{break}}c[G>>2]=(H|0)/(I|0)&-1;z=12;y=E;B=1;while(1){A=$(z,B);h=y-1|0;if((h|0)>0){z=z-1|0;y=h;B=A}else{J=A;break L1427}}}else{c[G>>2]=1;J=1}}while(0);c[m+68>>2]=J;J=0;while(1){c[m+(J<<2)>>2]=0;I=J+1|0;if((I|0)<(c[F>>2]|0)){J=I}else{break}}c[m+72>>2]=j;j=c[G>>2]|0;L1438:do{if(C){G=4;J=E;F=1;I=1;while(1){H=$(G,F);B=$(J,I);y=J-1|0;if((y|0)>0){G=G-1|0;J=y;F=H;I=B}else{K=H;L=B;break L1438}}}else{K=1;L=1}}while(0);E=(K|0)/(L|0)&-1;L=(w|0)>0;L1442:do{if(L){K=(j|0)>0;C=0;while(1){if(K){cX(b+(C*495&-1)|0,30,j|0)}I=C+1|0;if((I|0)==(w|0)){M=0;N=0;break L1442}else{C=I}}}else{M=0;N=0}}while(0);while(1){C=d[g+M|0]|0;O=(N|0)<(C|0)?C:N;C=M+1|0;if((C|0)==27){break}else{M=C;N=O}}ap(c[p>>2]|0,5245728,(u=i,i=i+8|0,c[u>>2]=D,c[u+4>>2]=E,u)|0);L1452:do{if((D|0)>0&(E|0)>0){N=0;while(1){M=0;while(1){C=bx(m,M)|0;a[b+((bu(l,N)|0)*495&-1)+C|0]=0;C=M+1|0;if((C|0)==(E|0)){break}else{M=C}}M=N+1|0;if((M|0)==(D|0)){break L1452}else{N=M}}}}while(0);l=$(E,D);if((l|0)==0){i=k;return}D=(j|0)>0;E=f|0;m=f+8|0;f=0;N=0;M=l;while(1){l=M+f|0;ap(c[p>>2]|0,5246008,(u=i,i=i+12|0,c[u>>2]=N,c[u+4>>2]=M,c[u+8>>2]=l,u)|0);C=N+1|0;if(!L){P=1009;break}K=C&255;if(D){Q=0;R=0}else{P=1006;break}while(1){I=0;F=R;while(1){J=b+(Q*495&-1)+I|0;G=a[J]|0;B=G&255;L1469:do{if((C|0)>(B|0)){if((C|0)>(B+O|0)){S=F;break}else{T=0;U=F;V=G}while(1){do{if((C|0)==((d[g+T|0]|0)+(V&255)|0)){H=(e[(c[m>>2]|0)+(T*990&-1)+(I<<1)>>1]|0)+(b+((e[(c[E>>2]|0)+(T*40824&-1)+(Q<<1)>>1]|0)*495&-1))|0;if((d[H]|0|0)<=(C|0)){W=U;break}a[H]=K;W=U+1|0}else{W=U}}while(0);H=T+1|0;if((H|0)==27){S=W;break L1469}T=H;U=W;V=a[J]|0}}else{S=F}}while(0);J=I+1|0;if((J|0)==(j|0)){break}else{I=J;F=S}}F=Q+1|0;if((F|0)==(w|0)){break}else{Q=F;R=S}}if((S|0)==0){P=1008;break}else{f=l;N=C;M=S}}if((P|0)==1006){i=k;return}else if((P|0)==1008){i=k;return}else if((P|0)==1009){i=k;return}}function bK(b,f,g,h,j){b=b|0;f=f|0;g=g|0;h=h|0;j=j|0;var k=0,l=0,m=0,n=0,o=0,q=0,r=0,s=0,t=0,v=0,w=0,x=0,y=0,z=0,A=0,B=0,C=0,D=0,E=0,F=0,G=0,H=0,I=0,J=0,K=0,L=0,M=0,N=0,O=0,P=0,Q=0,R=0,S=0,T=0,U=0,V=0;k=i;i=i+152|0;l=k|0;m=k+76|0;c[b+1013760>>2]=h;c[b+1013764>>2]=j;bq(l,h);h=c[l+48>>2]|0;n=(h|0)>0;o=c[l+72>>2]|0;L1486:do{if(n){q=o^-1;r=0;s=1;while(1){t=s<<((1<<r&q|0)!=0&1);v=r+1|0;if((v|0)==(h|0)){w=t;break L1486}else{r=v;s=t}}}else{w=1}}while(0);if((o&4095|0)==0){x=(w|0)/2&-1}else{x=w}w=$(c[l+64>>2]|0,x);L1494:do{if(n){x=o>>12;s=o^-1;r=0;q=0;t=0;while(1){v=1<<r;if((v&x|0)==0){y=t;z=q}else{y=((v&s|0)!=0&1)+t|0;z=q+1|0}v=r+1|0;if((v|0)==(h|0)){break}else{r=v;q=z;t=y}}if((y|0)>0){A=z;B=y;C=1;D=1}else{E=1;F=1;break}while(1){t=$(A,C);q=$(B,D);r=B-1|0;if((r|0)>0){A=A-1|0;B=r;C=t;D=q}else{E=t;F=q;break L1494}}}else{E=1;F=1}}while(0);D=(E|0)/(F|0)&-1;F=j^-1;E=(((F>>>8&1)+(F>>>9&1)|0)+(F>>>10&1)|0)+(F>>>11&1)|0;F=m+48|0;c[F>>2]=12;c[m+52>>2]=E;c[m+56>>2]=479001600;C=m+60|0;L1505:do{if((E|0)>1){B=E;A=1;while(1){y=$(B,A);z=B-1|0;if((z|0)>1){B=z;A=y}else{G=y;break L1505}}}else{G=1}}while(0);c[C>>2]=G;G=m+64|0;C=(E|0)>0;L1509:do{if(C){A=12;B=E;y=1;z=1;while(1){H=$(A,y);I=$(B,z);h=B-1|0;if((h|0)>0){A=A-1|0;B=h;y=H;z=I}else{break}}c[G>>2]=(H|0)/(I|0)&-1;z=12;y=E;B=1;while(1){A=$(z,B);h=y-1|0;if((h|0)>0){z=z-1|0;y=h;B=A}else{J=A;break L1509}}}else{c[G>>2]=1;J=1}}while(0);c[m+68>>2]=J;J=0;while(1){c[m+(J<<2)>>2]=0;I=J+1|0;if((I|0)<(c[F>>2]|0)){J=I}else{break}}c[m+72>>2]=j;j=c[G>>2]|0;L1520:do{if(C){G=4;J=E;F=1;I=1;while(1){H=$(G,F);B=$(J,I);y=J-1|0;if((y|0)>0){G=G-1|0;J=y;F=H;I=B}else{K=H;L=B;break L1520}}}else{K=1;L=1}}while(0);E=(K|0)/(L|0)&-1;L=(w|0)>0;L1524:do{if(L){K=(j|0)>0;C=0;while(1){if(K){cX(b+(C*495&-1)|0,30,j|0)}I=C+1|0;if((I|0)==(w|0)){M=0;N=0;break L1524}else{C=I}}}else{M=0;N=0}}while(0);while(1){C=d[g+M|0]|0;O=(N|0)<(C|0)?C:N;C=M+1|0;if((C|0)==27){break}else{M=C;N=O}}ap(c[p>>2]|0,5245624,(u=i,i=i+8|0,c[u>>2]=D,c[u+4>>2]=E,u)|0);L1534:do{if((D|0)>0){N=(E|0)>0;M=0;while(1){L1538:do{if(N){C=0;while(1){K=bx(m,C)|0;a[b+((bw(l,M)|0)*495&-1)+K|0]=0;K=C+1|0;if((K|0)==(E|0)){break L1538}else{C=K}}}}while(0);C=M+1|0;if((C|0)==(D|0)){break L1534}else{M=C}}}}while(0);l=$(E,D);if((l|0)==0){i=k;return}D=(j|0)>0;E=f+4|0;m=f+8|0;f=0;M=0;N=l;while(1){l=N+f|0;ap(c[p>>2]|0,5246008,(u=i,i=i+12|0,c[u>>2]=M,c[u+4>>2]=N,c[u+8>>2]=l,u)|0);C=M+1|0;if(!L){P=1062;break}K=C&255;I=0;F=0;while(1){L1551:do{if(D){J=0;G=F;while(1){B=b+(I*495&-1)+J|0;H=a[B]|0;y=H&255;L1554:do{if((C|0)>(y|0)){if((C|0)>(y+O|0)){Q=G;break}else{R=0;S=G;T=H}while(1){do{if((C|0)==((d[g+R|0]|0)+(T&255)|0)){z=(e[(c[m>>2]|0)+(R*990&-1)+(J<<1)>>1]|0)+(b+((c[(c[E>>2]|0)+(R*506880&-1)+(I<<2)>>2]|0)*495&-1))|0;if((d[z]|0|0)<=(C|0)){U=S;break}a[z]=K;U=S+1|0}else{U=S}}while(0);z=R+1|0;if((z|0)==27){Q=U;break L1554}R=z;S=U;T=a[B]|0}}else{Q=G}}while(0);B=J+1|0;if((B|0)==(j|0)){V=Q;break L1551}else{J=B;G=Q}}}else{V=F}}while(0);G=I+1|0;if((G|0)==(w|0)){break}else{I=G;F=V}}if((V|0)==0){P=1061;break}else{f=l;M=C;N=V}}if((P|0)==1061){i=k;return}else if((P|0)==1062){i=k;return}}function bL(b,f,g,h){b=b|0;f=f|0;g=g|0;h=h|0;var j=0,k=0,l=0,m=0,n=0,o=0,q=0,r=0,s=0,t=0,v=0,w=0,x=0,y=0,z=0,A=0,B=0,C=0,D=0,E=0,F=0;j=i;i=i+76|0;k=j|0;c[b+40320>>2]=h;bp(k,h);h=c[k+68>>2]|0;l=(h|0)>0;do{if(l){cX(b|0,30,h|0);m=0;n=0;break}else{m=0;n=0}}while(0);while(1){o=d[g+m|0]|0;q=(n|0)<(o|0)?o:n;o=m+1|0;if((o|0)==27){break}else{m=o;n=q}}ap(c[p>>2]|0,5245520,(u=i,i=i+4|0,c[u>>2]=1,u)|0);a[b+(by(k,0)|0)|0]=0;k=f+12|0;f=0;n=0;m=1;while(1){o=m+f|0;ap(c[p>>2]|0,5246008,(u=i,i=i+12|0,c[u>>2]=n,c[u+4>>2]=m,c[u+8>>2]=o,u)|0);r=n+1|0;if(!l){s=1079;break}t=r&255;v=0;w=0;while(1){x=b+v|0;y=a[x]|0;z=y&255;L1580:do{if((r|0)>(z|0)){if((r|0)>(z+q|0)){A=w;break}else{B=0;C=w;D=y}while(1){do{if((r|0)==((d[g+B|0]|0)+(D&255)|0)){E=b+(e[(c[k>>2]|0)+(B*80640&-1)+(v<<1)>>1]|0)|0;if((d[E]|0|0)<=(r|0)){F=C;break}a[E]=t;F=C+1|0}else{F=C}}while(0);E=B+1|0;if((E|0)==27){A=F;break L1580}B=E;C=F;D=a[x]|0}}else{A=w}}while(0);x=v+1|0;if((x|0)==(h|0)){break}else{v=x;w=A}}if((A|0)==0){s=1080;break}else{f=o;n=r;m=A}}if((s|0)==1079){i=j;return}else if((s|0)==1080){i=j;return}}function bM(b,f,g,h){b=b|0;f=f|0;g=g|0;h=h|0;var j=0,k=0,l=0,m=0,n=0,o=0,q=0,r=0,s=0,t=0,v=0,w=0,x=0,y=0,z=0,A=0,B=0,C=0,D=0,E=0,F=0,G=0,H=0,I=0,J=0,K=0,L=0,M=0,N=0,O=0,P=0,Q=0,R=0,S=0,T=0,U=0,V=0,W=0;j=i;i=i+152|0;k=j|0;l=j+76|0;c[b+5880600>>2]=h;m=h^-1;n=(((m>>>1&1)+(m&1)|0)+(m>>>2&1)|0)+(m>>>3&1)|0;o=k+48|0;c[o>>2]=12;c[k+52>>2]=n;c[k+56>>2]=479001600;q=k+60|0;L1595:do{if((n|0)>1){r=n;s=1;while(1){t=$(r,s);v=r-1|0;if((v|0)>1){r=v;s=t}else{w=t;break L1595}}}else{w=1}}while(0);c[q>>2]=w;w=k+64|0;L1599:do{if((n|0)>0){q=12;s=n;r=1;t=1;while(1){x=$(q,r);y=$(s,t);v=s-1|0;if((v|0)>0){q=q-1|0;s=v;r=x;t=y}else{break}}c[w>>2]=(x|0)/(y|0)&-1;t=12;r=n;s=1;while(1){q=$(t,s);v=r-1|0;if((v|0)>0){t=t-1|0;r=v;s=q}else{z=q;break L1599}}}else{c[w>>2]=1;z=1}}while(0);w=k+68|0;c[w>>2]=z;z=0;while(1){c[k+(z<<2)>>2]=0;n=z+1|0;A=c[o>>2]|0;if((n|0)<(A|0)){z=n}else{break}}z=k+72|0;c[z>>2]=h;n=c[w>>2]|0;w=(((m>>>8&1)+(m>>>9&1)|0)+(m>>>10&1)|0)+(m>>>11&1)|0;m=l+48|0;c[m>>2]=12;c[l+52>>2]=w;c[l+56>>2]=479001600;y=l+60|0;L1610:do{if((w|0)>1){x=w;s=1;while(1){r=$(x,s);t=x-1|0;if((t|0)>1){x=t;s=r}else{B=r;break L1610}}}else{B=1}}while(0);c[y>>2]=B;B=l+64|0;y=(w|0)>0;L1614:do{if(y){s=12;x=w;r=1;t=1;while(1){C=$(s,r);D=$(x,t);q=x-1|0;if((q|0)>0){s=s-1|0;x=q;r=C;t=D}else{break}}c[B>>2]=(C|0)/(D|0)&-1;t=12;r=w;x=1;while(1){s=$(t,x);q=r-1|0;if((q|0)>0){t=t-1|0;r=q;x=s}else{E=s;break L1614}}}else{c[B>>2]=1;E=1}}while(0);c[l+68>>2]=E;E=0;while(1){c[l+(E<<2)>>2]=0;D=E+1|0;if((D|0)<(c[m>>2]|0)){E=D}else{break}}c[l+72>>2]=h;E=c[B>>2]|0;L1625:do{if(y){B=4;m=w;D=1;C=1;while(1){x=$(B,D);r=$(m,C);t=m-1|0;if((t|0)>0){B=B-1|0;m=t;D=x;C=r}else{F=x;G=r;break L1625}}}else{F=1;G=1}}while(0);w=(F|0)/(G|0)&-1;G=(n|0)>0;L1629:do{if(G){F=(E|0)>0;y=0;while(1){if(F){cX(b+(y*495&-1)|0,30,E|0)}C=y+1|0;if((C|0)==(n|0)){H=0;I=0;break L1629}else{y=C}}}else{H=0;I=0}}while(0);while(1){y=d[g+H|0]|0;J=(I|0)<(y|0)?y:I;y=H+1|0;if((y|0)==27){break}else{H=y;I=J}}ap(c[p>>2]|0,5245356,(u=i,i=i+8|0,c[u>>2]=1,c[u+4>>2]=w,u)|0);I=k|0;H=k|0;y=k+4|0;F=k+8|0;C=k+12|0;L1639:do{if((w|0)>0){D=0;m=A;B=h;while(1){r=bx(l,D)|0;if((m|0)>0){x=0;while(1){c[k+(x<<2)>>2]=0;t=x+1|0;K=c[o>>2]|0;if((t|0)<(K|0)){x=t}else{break}}L=K;M=c[z>>2]|0}else{L=m;M=B}if((M&1|0)==0){c[H>>2]=1;N=2}else{N=1}if((M&2|0)==0){c[y>>2]=N;O=N+1|0}else{O=N}if((M&4|0)==0){c[F>>2]=O;P=O+1|0}else{P=O}if((M&8|0)==0){c[C>>2]=P}a[b+((be(I)|0)*495&-1)+r|0]=0;x=D+1|0;if((x|0)==(w|0)){break L1639}else{D=x;m=L;B=M}}}}while(0);if((w|0)==0){i=j;return}M=(E|0)>0;L=f+24|0;I=f+8|0;f=0;P=0;C=w;while(1){w=C+f|0;ap(c[p>>2]|0,5246008,(u=i,i=i+12|0,c[u>>2]=P,c[u+4>>2]=C,c[u+8>>2]=w,u)|0);O=P+1|0;if(!G){Q=1137;break}F=O&255;N=0;y=0;while(1){L1668:do{if(M){H=0;z=y;while(1){K=b+(N*495&-1)+H|0;o=a[K]|0;k=o&255;L1671:do{if((O|0)>(k|0)){if((O|0)>(k+J|0)){R=z;break}else{S=0;T=z;U=o}while(1){do{if((O|0)==((d[g+S|0]|0)+(U&255)|0)){l=(e[(c[I>>2]|0)+(S*990&-1)+(H<<1)>>1]|0)+(b+((e[(c[L>>2]|0)+(S*23760&-1)+(N<<1)>>1]|0)*495&-1))|0;if((d[l]|0|0)<=(O|0)){V=T;break}a[l]=F;V=T+1|0}else{V=T}}while(0);l=S+1|0;if((l|0)==27){R=V;break L1671}S=l;T=V;U=a[K]|0}}else{R=z}}while(0);K=H+1|0;if((K|0)==(E|0)){W=R;break L1668}else{H=K;z=R}}}else{W=y}}while(0);r=N+1|0;if((r|0)==(n|0)){break}else{N=r;y=W}}if((W|0)==0){Q=1136;break}else{f=w;P=O;C=W}}if((Q|0)==1136){i=j;return}else if((Q|0)==1137){i=j;return}}function bN(b,f,g,h){b=b|0;f=f|0;g=g|0;h=h|0;var j=0,k=0,l=0,m=0,n=0,o=0,q=0,r=0,s=0,t=0,v=0,w=0,x=0,y=0,z=0,A=0,B=0,C=0,D=0,E=0,F=0,G=0,H=0,I=0,J=0,K=0,L=0,M=0,N=0,O=0,P=0,Q=0,R=0,S=0,T=0,U=0,V=0,W=0;j=i;i=i+152|0;k=j|0;l=j+76|0;c[b+5880600>>2]=h;m=h^-1;n=(((m>>>4&1)+(m>>>5&1)|0)+(m>>>6&1)|0)+(m>>>7&1)|0;o=k+48|0;c[o>>2]=12;c[k+52>>2]=n;c[k+56>>2]=479001600;q=k+60|0;L1687:do{if((n|0)>1){r=n;s=1;while(1){t=$(r,s);v=r-1|0;if((v|0)>1){r=v;s=t}else{w=t;break L1687}}}else{w=1}}while(0);c[q>>2]=w;w=k+64|0;L1691:do{if((n|0)>0){q=12;s=n;r=1;t=1;while(1){x=$(q,r);y=$(s,t);v=s-1|0;if((v|0)>0){q=q-1|0;s=v;r=x;t=y}else{break}}c[w>>2]=(x|0)/(y|0)&-1;t=12;r=n;s=1;while(1){q=$(t,s);v=r-1|0;if((v|0)>0){t=t-1|0;r=v;s=q}else{z=q;break L1691}}}else{c[w>>2]=1;z=1}}while(0);w=k+68|0;c[w>>2]=z;z=0;while(1){c[k+(z<<2)>>2]=0;n=z+1|0;A=c[o>>2]|0;if((n|0)<(A|0)){z=n}else{break}}z=k+72|0;c[z>>2]=h;n=c[w>>2]|0;w=(((m>>>8&1)+(m>>>9&1)|0)+(m>>>10&1)|0)+(m>>>11&1)|0;m=l+48|0;c[m>>2]=12;c[l+52>>2]=w;c[l+56>>2]=479001600;y=l+60|0;L1702:do{if((w|0)>1){x=w;s=1;while(1){r=$(x,s);t=x-1|0;if((t|0)>1){x=t;s=r}else{B=r;break L1702}}}else{B=1}}while(0);c[y>>2]=B;B=l+64|0;y=(w|0)>0;L1706:do{if(y){s=12;x=w;r=1;t=1;while(1){C=$(s,r);D=$(x,t);q=x-1|0;if((q|0)>0){s=s-1|0;x=q;r=C;t=D}else{break}}c[B>>2]=(C|0)/(D|0)&-1;t=12;r=w;x=1;while(1){s=$(t,x);q=r-1|0;if((q|0)>0){t=t-1|0;r=q;x=s}else{E=s;break L1706}}}else{c[B>>2]=1;E=1}}while(0);c[l+68>>2]=E;E=0;while(1){c[l+(E<<2)>>2]=0;D=E+1|0;if((D|0)<(c[m>>2]|0)){E=D}else{break}}c[l+72>>2]=h;E=c[B>>2]|0;L1717:do{if(y){B=4;m=w;D=1;C=1;while(1){x=$(B,D);r=$(m,C);t=m-1|0;if((t|0)>0){B=B-1|0;m=t;D=x;C=r}else{F=x;G=r;break L1717}}}else{F=1;G=1}}while(0);w=(F|0)/(G|0)&-1;G=(n|0)>0;L1721:do{if(G){F=(E|0)>0;y=0;while(1){if(F){cX(b+(y*495&-1)|0,30,E|0)}C=y+1|0;if((C|0)==(n|0)){H=0;I=0;break L1721}else{y=C}}}else{H=0;I=0}}while(0);while(1){y=d[g+H|0]|0;J=(I|0)<(y|0)?y:I;y=H+1|0;if((y|0)==27){break}else{H=y;I=J}}ap(c[p>>2]|0,5245212,(u=i,i=i+8|0,c[u>>2]=1,c[u+4>>2]=w,u)|0);I=k|0;H=k+16|0;y=k+20|0;F=k+24|0;C=k+28|0;L1731:do{if((w|0)>0){D=0;m=A;B=h;while(1){r=bx(l,D)|0;if((m|0)>0){x=0;while(1){c[k+(x<<2)>>2]=0;t=x+1|0;K=c[o>>2]|0;if((t|0)<(K|0)){x=t}else{break}}L=K;M=c[z>>2]|0}else{L=m;M=B}if((M&16|0)==0){c[H>>2]=1;N=2}else{N=1}if((M&32|0)==0){c[y>>2]=N;O=N+1|0}else{O=N}if((M&64|0)==0){c[F>>2]=O;P=O+1|0}else{P=O}if((M&128|0)==0){c[C>>2]=P}a[b+((be(I)|0)*495&-1)+r|0]=0;x=D+1|0;if((x|0)==(w|0)){break L1731}else{D=x;m=L;B=M}}}}while(0);if((w|0)==0){i=j;return}M=(E|0)>0;L=f+24|0;I=f+8|0;f=0;P=0;C=w;while(1){w=C+f|0;ap(c[p>>2]|0,5246008,(u=i,i=i+12|0,c[u>>2]=P,c[u+4>>2]=C,c[u+8>>2]=w,u)|0);O=P+1|0;if(!G){Q=1196;break}F=O&255;N=0;y=0;while(1){L1760:do{if(M){H=0;z=y;while(1){K=b+(N*495&-1)+H|0;o=a[K]|0;k=o&255;L1763:do{if((O|0)>(k|0)){if((O|0)>(k+J|0)){R=z;break}else{S=0;T=z;U=o}while(1){do{if((O|0)==((d[g+S|0]|0)+(U&255)|0)){l=(e[(c[I>>2]|0)+(S*990&-1)+(H<<1)>>1]|0)+(b+((e[(c[L>>2]|0)+641520+(S*23760&-1)+(N<<1)>>1]|0)*495&-1))|0;if((d[l]|0|0)<=(O|0)){V=T;break}a[l]=F;V=T+1|0}else{V=T}}while(0);l=S+1|0;if((l|0)==27){R=V;break L1763}S=l;T=V;U=a[K]|0}}else{R=z}}while(0);K=H+1|0;if((K|0)==(E|0)){W=R;break L1760}else{H=K;z=R}}}else{W=y}}while(0);r=N+1|0;if((r|0)==(n|0)){break}else{N=r;y=W}}if((W|0)==0){Q=1195;break}else{f=w;P=O;C=W}}if((Q|0)==1195){i=j;return}else if((Q|0)==1196){i=j;return}}function bO(b,f,g,h){b=b|0;f=f|0;g=g|0;h=h|0;var j=0,k=0,l=0,m=0,n=0,o=0,q=0,r=0,s=0,t=0,v=0,w=0,x=0,y=0,z=0,A=0,B=0,C=0,D=0,E=0,F=0,G=0,H=0,I=0,J=0,K=0,L=0,M=0;j=i;k=b|0;l=i;i=i+76|0;c[b+11880>>2]=h;m=h^-1;n=(((m>>>8&1)+(m>>>9&1)|0)+(m>>>10&1)|0)+(m>>>11&1)|0;m=l+48|0;c[m>>2]=12;c[l+52>>2]=n;c[l+56>>2]=479001600;o=l+60|0;L1779:do{if((n|0)>1){q=n;r=1;while(1){s=$(q,r);t=q-1|0;if((t|0)>1){q=t;r=s}else{v=s;break L1779}}}else{v=1}}while(0);c[o>>2]=v;v=l+64|0;L1783:do{if((n|0)>0){o=12;r=n;q=1;s=1;while(1){w=$(o,q);x=$(r,s);t=r-1|0;if((t|0)>0){o=o-1|0;r=t;q=w;s=x}else{break}}c[v>>2]=(w|0)/(x|0)&-1;s=12;q=n;r=1;while(1){o=$(s,r);t=q-1|0;if((t|0)>0){s=s-1|0;q=t;r=o}else{y=o;break L1783}}}else{c[v>>2]=1;y=1}}while(0);v=l+68|0;c[v>>2]=y;y=0;while(1){c[l+(y<<2)>>2]=0;n=y+1|0;z=c[m>>2]|0;if((n|0)<(z|0)){y=n}else{break}}y=l+72|0;c[y>>2]=h;n=c[v>>2]|0;v=(n|0)>0;do{if(v){cX(k|0,30,n|0);A=0;B=0;break}else{A=0;B=0}}while(0);while(1){k=d[g+A|0]|0;C=(B|0)<(k|0)?k:B;k=A+1|0;if((k|0)==27){break}else{A=k;B=C}}ap(c[p>>2]|0,5244768,(u=i,i=i+4|0,c[u>>2]=1,u)|0);B=l|0;A=l+32|0;k=l+36|0;x=l+40|0;w=l+44|0;if((z|0)>0){z=0;while(1){c[l+(z<<2)>>2]=0;r=z+1|0;if((r|0)<(c[m>>2]|0)){z=r}else{break}}D=c[y>>2]|0}else{D=h}if((D&256|0)==0){c[A>>2]=1;E=2}else{E=1}if((D&512|0)==0){c[k>>2]=E;F=E+1|0}else{F=E}if((D&1024|0)==0){c[x>>2]=F;G=F+1|0}else{G=F}if((D&2048|0)==0){c[w>>2]=G}a[b+(be(B)|0)|0]=0;B=f+24|0;f=0;G=0;w=1;while(1){D=w+f|0;ap(c[p>>2]|0,5246008,(u=i,i=i+12|0,c[u>>2]=G,c[u+4>>2]=w,c[u+8>>2]=D,u)|0);F=G+1|0;if(!v){H=1233;break}x=F&255;E=0;k=0;while(1){A=b+E|0;h=a[A]|0;y=h&255;L1821:do{if((F|0)>(y|0)){if((F|0)>(y+C|0)){I=k;break}else{J=0;K=k;L=h}while(1){do{if((F|0)==((d[g+J|0]|0)+(L&255)|0)){z=b+(e[(c[B>>2]|0)+1283040+(J*23760&-1)+(E<<1)>>1]|0)|0;if((d[z]|0|0)<=(F|0)){M=K;break}a[z]=x;M=K+1|0}else{M=K}}while(0);z=J+1|0;if((z|0)==27){I=M;break L1821}J=z;K=M;L=a[A]|0}}else{I=k}}while(0);A=E+1|0;if((A|0)==(n|0)){break}else{E=A;k=I}}if((I|0)==0){H=1234;break}else{f=D;G=F;w=I}}if((H|0)==1233){i=j;return}else if((H|0)==1234){i=j;return}}function bP(b,f,g,h,j){b=b|0;f=f|0;g=g|0;h=h|0;j=j|0;var k=0,l=0,m=0,n=0,o=0,q=0,r=0,s=0,t=0,v=0,w=0,x=0,y=0,z=0,A=0,B=0,C=0,D=0,E=0,F=0,G=0,H=0,I=0,J=0,K=0,L=0,M=0;k=i;i=i+152|0;l=k|0;m=k+76|0;c[b+967680>>2]=h;c[b+967684>>2]=j;n=h^-1;o=(((n>>>8&1)+(n>>>9&1)|0)+(n>>>10&1)|0)+(n>>>11&1)|0;n=l+48|0;c[n>>2]=4;c[l+52>>2]=o;c[l+56>>2]=24;q=l+60|0;L1836:do{if((o|0)>1){r=o;s=1;while(1){t=$(r,s);v=r-1|0;if((v|0)>1){r=v;s=t}else{w=t;break L1836}}}else{w=1}}while(0);c[q>>2]=w;w=l+64|0;L1840:do{if((o|0)>0){q=4;s=o;r=1;t=1;while(1){x=$(q,r);y=$(s,t);v=s-1|0;if((v|0)>0){q=q-1|0;s=v;r=x;t=y}else{break}}c[w>>2]=(x|0)/(y|0)&-1;t=4;r=o;s=1;while(1){q=$(t,s);v=r-1|0;if((v|0)>0){t=t-1|0;r=v;s=q}else{z=q;break L1840}}}else{c[w>>2]=1;z=1}}while(0);w=l+68|0;c[w>>2]=z;z=0;while(1){c[l+(z<<2)>>2]=0;o=z+1|0;A=c[n>>2]|0;if((o|0)<(A|0)){z=o}else{break}}z=l+72|0;c[z>>2]=h;o=c[w>>2]|0;bp(m,j);j=c[m+68>>2]|0;w=(o|0)>0;L1851:do{if(w){y=(j|0)>0;x=0;while(1){if(y){cX(b+(x*40320&-1)|0,30,j|0)}s=x+1|0;if((s|0)==(o|0)){break L1851}else{x=s}}}}while(0);x=d[g+27|0]|0;y=d[g+28|0]|0;s=x>>>0<y>>>0?y:x;x=d[g+29|0]|0;y=s>>>0<x>>>0?x:s;s=d[g+30|0]|0;x=y>>>0<s>>>0?s:y;y=d[g+31|0]|0;s=x>>>0<y>>>0?y:x;x=d[g+32|0]|0;y=s>>>0<x>>>0?x:s;s=d[g+33|0]|0;x=y>>>0<s>>>0?s:y;y=d[g+34|0]|0;s=(x|0)<(y|0)?y:x;x=d[g+35|0]|0;y=(s|0)<(x|0)?x:s;s=d[g+36|0]|0;x=(y|0)<(s|0)?s:y;y=d[g+37|0]|0;s=(x|0)<(y|0)?y:x;x=d[g+38|0]|0;y=(s|0)<(x|0)?x:s;s=d[g+39|0]|0;x=(y|0)<(s|0)?s:y;y=d[g+40|0]|0;s=(x|0)<(y|0)?y:x;x=d[g+41|0]|0;y=(s|0)<(x|0)?x:s;ap(c[p>>2]|0,5244680,(u=i,i=i+8|0,c[u>>2]=1,c[u+4>>2]=1,u)|0);s=l|0;x=l|0;r=l+4|0;t=l+8|0;q=l+12|0;v=by(m,0)|0;if((A|0)>0){A=0;while(1){c[l+(A<<2)>>2]=0;m=A+1|0;if((m|0)<(c[n>>2]|0)){A=m}else{break}}B=c[z>>2]|0}else{B=h}if((B&256|0)==0){c[x>>2]=1;C=2}else{C=1}if((B&512|0)==0){c[r>>2]=C;D=C+1|0}else{D=C}if((B&1024|0)==0){c[t>>2]=D;E=D+1|0}else{E=D}if((B&2048|0)==0){c[q>>2]=E}a[b+((be(s)|0)*40320&-1)+v|0]=0;v=(j|0)>0;s=f+20|0;E=f+12|0;f=0;q=0;B=1;while(1){D=B+f|0;ap(c[p>>2]|0,5246008,(u=i,i=i+12|0,c[u>>2]=q,c[u+4>>2]=B,c[u+8>>2]=D,u)|0);t=q+1|0;if(!w){F=1276;break}C=t&255;r=0;x=0;while(1){L1881:do{if(v){h=0;z=x;while(1){A=b+(r*40320&-1)+h|0;n=a[A]|0;l=n&255;L1884:do{if((t|0)>(l|0)){if((t|0)>(l+y|0)){G=z;break}else{H=0;I=z;J=n}while(1){do{if((t|0)==((d[H+(g+27)|0]|0)+(J&255)|0)){m=c[E>>2]|0;K=(e[m+((d[H+(m+2177280)|0]|0)*80640&-1)+(h<<1)>>1]|0)+(b+((e[(c[s>>2]|0)+(H*48&-1)+(r<<1)>>1]|0)*40320&-1))|0;if((d[K]|0|0)<=(t|0)){L=I;break}a[K]=C;L=I+1|0}else{L=I}}while(0);K=H+1|0;if((K|0)==15){G=L;break L1884}H=K;I=L;J=a[A]|0}}else{G=z}}while(0);A=h+1|0;if((A|0)==(j|0)){M=G;break L1881}else{h=A;z=G}}}else{M=x}}while(0);z=r+1|0;if((z|0)==(o|0)){break}else{r=z;x=M}}if((M|0)==0){F=1275;break}else{f=D;q=t;B=M}}if((F|0)==1275){i=k;return}else if((F|0)==1276){i=k;return}}function bQ(b,f,g,h){b=b|0;f=f|0;g=g|0;h=h|0;var j=0,k=0,l=0,m=0,n=0,o=0,q=0,r=0,s=0,t=0,v=0,w=0,x=0,y=0,z=0,A=0,B=0,C=0,D=0,E=0,F=0,G=0,H=0,I=0,J=0,K=0,L=0;j=i;i=i+152|0;k=j|0;l=j+76|0;c[b+967680>>2]=h;m=h^-1;n=(((m>>>8&1)+(m>>>9&1)|0)+(m>>>10&1)|0)+(m>>>11&1)|0;m=k+48|0;c[m>>2]=4;c[k+52>>2]=n;c[k+56>>2]=24;o=k+60|0;L1900:do{if((n|0)>1){q=n;r=1;while(1){s=$(q,r);t=q-1|0;if((t|0)>1){q=t;r=s}else{v=s;break L1900}}}else{v=1}}while(0);c[o>>2]=v;v=k+64|0;L1904:do{if((n|0)>0){o=4;r=n;q=1;s=1;while(1){w=$(o,q);x=$(r,s);t=r-1|0;if((t|0)>0){o=o-1|0;r=t;q=w;s=x}else{break}}c[v>>2]=(w|0)/(x|0)&-1;s=4;q=n;r=1;while(1){o=$(s,r);t=q-1|0;if((t|0)>0){s=s-1|0;q=t;r=o}else{y=o;break L1904}}}else{c[v>>2]=1;y=1}}while(0);v=k+68|0;c[v>>2]=y;y=0;while(1){c[k+(y<<2)>>2]=0;n=y+1|0;z=c[m>>2]|0;if((n|0)<(z|0)){y=n}else{break}}y=k+72|0;c[y>>2]=h;n=c[v>>2]|0;bD(l,h);v=c[l+68>>2]|0;x=(n|0)>0;L1915:do{if(x){w=(v|0)>0;r=0;while(1){if(w){cX(b+(r*40320&-1)|0,30,v|0)}q=r+1|0;if((q|0)==(n|0)){break L1915}else{r=q}}}}while(0);r=d[g+27|0]|0;w=d[g+28|0]|0;q=r>>>0<w>>>0?w:r;r=d[g+29|0]|0;w=q>>>0<r>>>0?r:q;q=d[g+30|0]|0;r=w>>>0<q>>>0?q:w;w=d[g+31|0]|0;q=r>>>0<w>>>0?w:r;r=d[g+32|0]|0;w=q>>>0<r>>>0?r:q;q=d[g+33|0]|0;r=w>>>0<q>>>0?q:w;w=d[g+34|0]|0;q=(r|0)<(w|0)?w:r;r=d[g+35|0]|0;w=(q|0)<(r|0)?r:q;q=d[g+36|0]|0;r=(w|0)<(q|0)?q:w;w=d[g+37|0]|0;q=(r|0)<(w|0)?w:r;r=d[g+38|0]|0;w=(q|0)<(r|0)?r:q;q=d[g+39|0]|0;r=(w|0)<(q|0)?q:w;w=d[g+40|0]|0;q=(r|0)<(w|0)?w:r;r=d[g+41|0]|0;w=(q|0)<(r|0)?r:q;ap(c[p>>2]|0,5244604,(u=i,i=i+8|0,c[u>>2]=1,c[u+4>>2]=1,u)|0);q=k|0;r=k|0;s=k+4|0;o=k+8|0;t=k+12|0;A=bz(l,0)|0;if((z|0)>0){z=0;while(1){c[k+(z<<2)>>2]=0;l=z+1|0;if((l|0)<(c[m>>2]|0)){z=l}else{break}}B=c[y>>2]|0}else{B=h}if((B&256|0)==0){c[r>>2]=1;C=2}else{C=1}if((B&512|0)==0){c[s>>2]=C;D=C+1|0}else{D=C}if((B&1024|0)==0){c[o>>2]=D;E=D+1|0}else{E=D}if((B&2048|0)==0){c[t>>2]=E}a[b+((be(q)|0)*40320&-1)+A|0]=0;A=(v|0)>0;q=f+20|0;E=f+16|0;f=0;t=0;B=1;while(1){D=B+f|0;ap(c[p>>2]|0,5246008,(u=i,i=i+12|0,c[u>>2]=t,c[u+4>>2]=B,c[u+8>>2]=D,u)|0);o=t+1|0;if(!x){F=1317;break}C=o&255;s=0;r=0;while(1){L1945:do{if(A){h=0;y=r;while(1){z=b+(s*40320&-1)+h|0;m=a[z]|0;k=m&255;L1948:do{if((o|0)>(k|0)){if((o|0)>(k+w|0)){G=y;break}else{H=0;I=y;J=m}while(1){do{if((o|0)==((d[H+(g+27)|0]|0)+(J&255)|0)){l=(e[(c[E>>2]|0)+(H*80640&-1)+(h<<1)>>1]|0)+(b+((e[(c[q>>2]|0)+(H*48&-1)+(s<<1)>>1]|0)*40320&-1))|0;if((d[l]|0|0)<=(o|0)){K=I;break}a[l]=C;K=I+1|0}else{K=I}}while(0);l=H+1|0;if((l|0)==15){G=K;break L1948}H=l;I=K;J=a[z]|0}}else{G=y}}while(0);z=h+1|0;if((z|0)==(v|0)){L=G;break L1945}else{h=z;y=G}}}else{L=r}}while(0);y=s+1|0;if((y|0)==(n|0)){break}else{s=y;r=L}}if((L|0)==0){F=1318;break}else{f=D;t=o;B=L}}if((F|0)==1317){i=j;return}else if((F|0)==1318){i=j;return}}function bR(a){a=a|0;var e=0,f=0,g=0,h=0,j=0,k=0,l=0,m=0,n=0,o=0,q=0,r=0,s=0,t=0,v=0,w=0,x=0,y=0,z=0,A=0,B=0,C=0,D=0,E=0,F=0,G=0,H=0,I=0,J=0,K=0,L=0,M=0,N=0;e=i;c[1312504]=aP(2,6)|0;f=c[a+48>>2]|0;g=a+180|0;c[g>>2]=f;h=a+1836|0;j=a+1832|0;k=a+1844|0;l=a+1840|0;m=a+1828|0;n=a+1824|0;o=n;c[o>>2]=0;c[o+4>>2]=0;c[o+8>>2]=0;c[o+12>>2]=0;c[o+16>>2]=0;c[o+20>>2]=0;o=b[a+28>>1]|0;b[a+200>>1]=o;q=c[a+32>>2]|0;c[a+204>>2]=q;r=b[a+36>>1]|0;b[a+208>>1]=r;s=b[a+38>>1]|0;b[a+210>>1]=s;t=b[a+42>>1]|0;b[a+212>>1]=t;v=b[a+44>>1]|0;b[a+214>>1]=v;w=b[a+40>>1]|0;b[a+216>>1]=w;b[a+196>>1]=1;c[a+192>>2]=-1;x=a+1816|0;y=c[a+4>>2]|0;z=o&65535;o=r&65535;do{if((c[x>>2]|0)==0){if((c[y+4>>2]|0)!=0){r=d[(c[y+16>>2]|0)+(z*495&-1)+o|0]|0;A=d[(c[y+8>>2]|0)+q|0]|0;B=r>>>0>A>>>0?r:A;break}A=d[(c[y+16>>2]|0)+(z*495&-1)+o|0]|0;r=d[(c[y+20>>2]|0)+(q*495&-1)+o|0]|0;if((c[y>>2]|0)==0){C=d[(c[y+12>>2]|0)+(z<<11)+q|0]|0;D=A>>>0>r>>>0?A:r;B=D>>>0>C>>>0?D:C;break}else{B=A>>>0>r>>>0?A:r;break}}else{r=s&65535;A=t&65535;C=v&65535;D=w&65535;do{if((c[y+4>>2]|0)==0){E=d[(c[y+16>>2]|0)+(z*495&-1)+o|0]|0;F=d[(c[y+20>>2]|0)+(q*495&-1)+o|0]|0;if((c[y>>2]|0)==0){G=d[(c[y+12>>2]|0)+(z<<11)+q|0]|0;H=E>>>0>F>>>0?E:F;I=H>>>0>G>>>0?H:G;break}else{I=E>>>0>F>>>0?E:F;break}}else{F=d[(c[y+16>>2]|0)+(z*495&-1)+o|0]|0;E=d[(c[y+8>>2]|0)+q|0]|0;I=F>>>0>E>>>0?F:E}}while(0);E=d[(c[y+24>>2]|0)+r|0]|0;F=d[(c[y+36>>2]|0)+D|0]|0;G=d[(c[y+28>>2]|0)+(A*495&-1)+o|0]|0;H=d[(c[y+32>>2]|0)+(C*495&-1)+o|0]|0;J=E>>>0>F>>>0?E:F;F=G>>>0>H>>>0?G:H;H=J>>>0>F>>>0?J:F;B=(I|0)>(H|0)?I:H}}while(0);I=c[a+56>>2]|0;o=(B|0)<(I|0)?I:B;L1981:do{if((o|0)<=(f|0)){B=a+1812|0;I=a+184|0;y=o;while(1){ap(c[p>>2]|0,5246120,(u=i,i=i+4|0,c[u>>2]=y,u)|0);q=((c[g>>2]|0)-y|0)+(((c[B>>2]|0)==0)<<31>>31)|0;c[I>>2]=q;if((q|0)<0){break L1981}if((c[x>>2]|0)==0){bU(a,y)}else{bT(a,y)}q=y+1|0;if((q|0)>(c[g>>2]|0)){break L1981}else{y=q}}}}while(0);g=c[p>>2]|0;a=c[n>>2]|0;if((c[x>>2]|0)!=0){ap(g|0,5246480,(u=i,i=i+4|0,c[u>>2]=a,u)|0);x=c[j>>2]|0;if((x|0)==0){K=aL(10)|0;i=e;return}n=c[l>>2]|0;if(x>>>0<1e4){L=((n*100&-1)>>>0)/(x>>>0)>>>0}else{L=(n>>>0)/((x>>>0)/100>>>0>>>0)>>>0}ap(c[p>>2]|0,5245168,(u=i,i=i+12|0,c[u>>2]=L,c[u+4>>2]=n,c[u+8>>2]=x,u)|0);K=aL(10)|0;i=e;return}x=c[m>>2]|0;ap(g|0,5244236,(u=i,i=i+8|0,c[u>>2]=a,c[u+4>>2]=x,u)|0);x=c[j>>2]|0;if((x|0)!=0){j=c[l>>2]|0;if(x>>>0<1e4){M=((j*100&-1)>>>0)/(x>>>0)>>>0}else{M=(j>>>0)/((x>>>0)/100>>>0>>>0)>>>0}ap(c[p>>2]|0,5243868,(u=i,i=i+12|0,c[u>>2]=M,c[u+4>>2]=j,c[u+8>>2]=x,u)|0)}x=c[h>>2]|0;if((x|0)==0){K=aL(10)|0;i=e;return}h=c[k>>2]|0;if(x>>>0<1e4){N=((h*100&-1)>>>0)/(x>>>0)>>>0}else{N=(h>>>0)/((x>>>0)/100>>>0>>>0)>>>0}ap(c[p>>2]|0,5243624,(u=i,i=i+12|0,c[u>>2]=N,c[u+4>>2]=h,c[u+8>>2]=x,u)|0);K=aL(10)|0;i=e;return}function bS(a){a=a|0;ax(5243756,15,1,c[p>>2]|0);return}function bT(f,g){f=f|0;g=g|0;var h=0,i=0,j=0,k=0,l=0,m=0,n=0,o=0,p=0,q=0,r=0,s=0,t=0,u=0,v=0,w=0,x=0,y=0,z=0,A=0,B=0,C=0,D=0,E=0,F=0,G=0,H=0,I=0,J=0,K=0,L=0,M=0,N=0,O=0,P=0,Q=0,R=0,S=0,T=0,U=0,V=0,W=0,X=0,Y=0,Z=0,_=0,$=0;h=f+1800|0;c[h>>2]=0;i=f+188|0;c[i>>2]=g;c[f+224>>2]=-1;g=f+52|0;j=c[g>>2]|0;do{if((j|0)>0){c[h>>2]=j;k=f+56|0;l=c[k>>2]|0;c[i>>2]=l;m=f+12|0;n=f+8|0;o=f|0;p=1;q=l;while(1){l=p-1|0;r=f+60+(l<<2)|0;s=c[r>>2]|0;c[f+188+(p<<5)+4>>2]=s;b[f+188+(p<<5)+8>>1]=d[(e[f+188+(l<<5)+8>>1]|0)+((c[m>>2]|0)+(s*23&-1))|0]|0;t=f+188+(p<<5)|0;c[t>>2]=q-(d[(c[n>>2]|0)+s|0]|0)|0;u=c[o>>2]|0;b[f+188+(p<<5)+12>>1]=b[(c[u>>2]|0)+(s*40824&-1)+((e[f+188+(l<<5)+12>>1]|0)<<1)>>1]|0;c[f+188+(p<<5)+16>>2]=c[(c[u+4>>2]|0)+(s*506880&-1)+(c[f+188+(l<<5)+16>>2]<<2)>>2]|0;b[f+188+(p<<5)+20>>1]=b[(c[u+8>>2]|0)+(s*990&-1)+((e[f+188+(l<<5)+20>>1]|0)<<1)>>1]|0;b[f+188+(p<<5)+22>>1]=b[(c[u+12>>2]|0)+(s*80640&-1)+((e[f+188+(l<<5)+22>>1]|0)<<1)>>1]|0;v=u+24|0;b[f+188+(p<<5)+24>>1]=b[(c[v>>2]|0)+(s*23760&-1)+((e[f+188+(l<<5)+24>>1]|0)<<1)>>1]|0;b[f+188+(p<<5)+26>>1]=b[(c[v>>2]|0)+641520+(s*23760&-1)+((e[f+188+(l<<5)+26>>1]|0)<<1)>>1]|0;b[f+188+(p<<5)+28>>1]=b[(c[v>>2]|0)+1283040+(s*23760&-1)+((e[f+188+(l<<5)+28>>1]|0)<<1)>>1]|0;c[r>>2]=-1;r=p+1|0;w=c[h>>2]|0;if((r|0)>(w|0)){break}p=r;q=c[t>>2]|0}c[f+188+(w+1<<5)+4>>2]=-1;c[g>>2]=0;c[k>>2]=0;if((w|0)>-1){x=w;break}return}else{x=0}}while(0);w=f+180|0;g=f+1824|0;j=f+1812|0;q=f+12|0;p=f+8|0;o=f|0;n=f+1832|0;m=f+4|0;t=f+1840|0;r=x;L2027:while(1){x=c[f+188+(r<<5)>>2]|0;do{if((x|0)==0){bV(f);c[w>>2]=c[i>>2]|0;c[g>>2]=(c[g>>2]|0)+1|0;if((c[j>>2]|0)==0){y=1390;break L2027}z=c[h>>2]|0}else{l=r+1|0;s=f+188+(l<<5)+4|0;v=(c[s>>2]|0)+1|0;L2033:do{if((v|0)<27){u=f+188+(l<<5)|0;A=f+188+(r<<5)+12|0;B=f+188+(l<<5)+12|0;C=f+188+(r<<5)+16|0;D=f+188+(l<<5)+16|0;E=f+188+(r<<5)+20|0;F=f+188+(l<<5)+20|0;G=f+188+(r<<5)+22|0;H=f+188+(l<<5)+22|0;I=f+188+(r<<5)+24|0;J=f+188+(l<<5)+24|0;K=f+188+(r<<5)+26|0;L=f+188+(l<<5)+26|0;M=f+188+(r<<5)+28|0;N=f+188+(l<<5)+28|0;O=b[f+188+(r<<5)+8>>1]|0;P=v;L2035:while(1){Q=O&65535;do{if(a[(c[q>>2]|0)+(P*23&-1)+Q|0]<<24>>24!=0){R=x-(d[(c[p>>2]|0)+P|0]|0)|0;c[u>>2]=R;if((R|0)<0){break}S=c[o>>2]|0;b[B>>1]=b[(c[S>>2]|0)+(P*40824&-1)+((e[A>>1]|0)<<1)>>1]|0;T=c[(c[S+4>>2]|0)+(P*506880&-1)+(c[C>>2]<<2)>>2]|0;c[D>>2]=T;U=b[(c[S+8>>2]|0)+(P*990&-1)+((e[E>>1]|0)<<1)>>1]|0;b[F>>1]=U;V=b[(c[S+12>>2]|0)+(P*80640&-1)+((e[G>>1]|0)<<1)>>1]|0;b[H>>1]=V;W=S+24|0;S=b[(c[W>>2]|0)+(P*23760&-1)+((e[I>>1]|0)<<1)>>1]|0;b[J>>1]=S;X=b[(c[W>>2]|0)+641520+(P*23760&-1)+((e[K>>1]|0)<<1)>>1]|0;b[L>>1]=X;Y=b[(c[W>>2]|0)+1283040+(P*23760&-1)+((e[M>>1]|0)<<1)>>1]|0;b[N>>1]=Y;c[n>>2]=(c[n>>2]|0)+1|0;W=c[m>>2]|0;Z=e[B>>1]|0;_=U&65535;U=V&65535;V=S&65535;S=X&65535;X=Y&65535;L2040:do{if((d[(c[W+16>>2]|0)+(Z*495&-1)+_|0]|0|0)<=(R|0)){do{if((c[W+4>>2]|0)==0){if((d[(c[W+20>>2]|0)+(T*495&-1)+_|0]|0|0)>(R|0)){break L2040}if((c[W>>2]|0)!=0){break}if((d[(c[W+12>>2]|0)+(Z<<11)+T|0]|0|0)>(R|0)){break L2040}}else{if((d[(c[W+8>>2]|0)+T|0]|0|0)>(R|0)){break L2040}}}while(0);if((d[(c[W+24>>2]|0)+U|0]|0|0)>(R|0)){break}if((d[(c[W+28>>2]|0)+(V*495&-1)+_|0]|0|0)>(R|0)){break}if((d[(c[W+32>>2]|0)+(S*495&-1)+_|0]|0|0)>(R|0)){break}if((d[(c[W+36>>2]|0)+X|0]|0|0)<=(R|0)){break L2035}}}while(0);c[t>>2]=(c[t>>2]|0)+1|0}}while(0);R=P+1|0;if((R|0)<27){P=R}else{$=R;break L2033}}c[s>>2]=P;b[f+188+(l<<5)+8>>1]=d[(c[q>>2]|0)+(P*23&-1)+Q|0]|0;$=P}else{$=v}}while(0);v=c[h>>2]|0;if(($|0)==27){z=v;break}l=v+1|0;c[h>>2]=l;c[f+188+(v+2<<5)+4>>2]=-1;if((l|0)>-1){r=l;continue L2027}else{y=1393;break L2027}}}while(0);x=z-1|0;c[h>>2]=x;if((z|0)>0){r=x}else{y=1391;break}}if((y|0)==1393){return}else if((y|0)==1390){return}else if((y|0)==1391){return}}function bU(f,g){f=f|0;g=g|0;var h=0,i=0,j=0,k=0,l=0,m=0,n=0,o=0,p=0,q=0,r=0,s=0,t=0,u=0,v=0,w=0,x=0,y=0,z=0,A=0,B=0,C=0,D=0,E=0,F=0,G=0,H=0,I=0,J=0,K=0,L=0;h=f+1800|0;c[h>>2]=0;i=f+188|0;c[i>>2]=g;c[f+224>>2]=-1;g=f+52|0;j=c[g>>2]|0;do{if((j|0)>0){c[h>>2]=j;k=f+56|0;l=c[k>>2]|0;c[i>>2]=l;m=f+12|0;n=f+8|0;o=f|0;p=1;q=l;while(1){l=p-1|0;r=f+60+(l<<2)|0;s=c[r>>2]|0;c[f+188+(p<<5)+4>>2]=s;b[f+188+(p<<5)+8>>1]=d[(e[f+188+(l<<5)+8>>1]|0)+((c[m>>2]|0)+(s*23&-1))|0]|0;t=f+188+(p<<5)|0;c[t>>2]=q-(d[(c[n>>2]|0)+s|0]|0)|0;u=c[o>>2]|0;b[f+188+(p<<5)+12>>1]=b[(c[u>>2]|0)+(s*40824&-1)+((e[f+188+(l<<5)+12>>1]|0)<<1)>>1]|0;c[f+188+(p<<5)+16>>2]=c[(c[u+4>>2]|0)+(s*506880&-1)+(c[f+188+(l<<5)+16>>2]<<2)>>2]|0;b[f+188+(p<<5)+20>>1]=b[(c[u+8>>2]|0)+(s*990&-1)+((e[f+188+(l<<5)+20>>1]|0)<<1)>>1]|0;c[r>>2]=-1;r=p+1|0;v=c[h>>2]|0;if((r|0)>(v|0)){break}p=r;q=c[t>>2]|0}c[f+188+(v+1<<5)+4>>2]=-1;c[g>>2]=0;c[k>>2]=0;if((v|0)>-1){w=v;break}return}else{w=0}}while(0);v=f+12|0;g=f+8|0;i=f|0;j=f+1832|0;q=f+4|0;p=f+1840|0;o=w;L2070:while(1){w=c[f+188+(o<<5)>>2]|0;do{if((w|0)==0){bW(f);x=c[h>>2]|0}else{n=o+1|0;m=f+188+(n<<5)+4|0;t=(c[m>>2]|0)+1|0;L2075:do{if((t|0)<27){r=f+188+(n<<5)|0;l=f+188+(o<<5)+12|0;s=f+188+(n<<5)+12|0;u=f+188+(o<<5)+16|0;y=f+188+(n<<5)+16|0;z=f+188+(o<<5)+20|0;A=f+188+(n<<5)+20|0;B=b[f+188+(o<<5)+8>>1]|0;C=t;L2077:while(1){D=B&65535;do{if(a[(c[v>>2]|0)+(C*23&-1)+D|0]<<24>>24!=0){E=w-(d[(c[g>>2]|0)+C|0]|0)|0;c[r>>2]=E;if((E|0)<0){break}F=c[i>>2]|0;b[s>>1]=b[(c[F>>2]|0)+(C*40824&-1)+((e[l>>1]|0)<<1)>>1]|0;G=c[(c[F+4>>2]|0)+(C*506880&-1)+(c[u>>2]<<2)>>2]|0;c[y>>2]=G;H=b[(c[F+8>>2]|0)+(C*990&-1)+((e[z>>1]|0)<<1)>>1]|0;b[A>>1]=H;c[j>>2]=(c[j>>2]|0)+1|0;F=c[q>>2]|0;I=e[s>>1]|0;J=H&65535;do{if((d[(c[F+16>>2]|0)+(I*495&-1)+J|0]|0|0)<=(E|0)){if((c[F+4>>2]|0)!=0){if((d[(c[F+8>>2]|0)+G|0]|0|0)>(E|0)){break}else{break L2077}}if((d[(c[F+20>>2]|0)+(G*495&-1)+J|0]|0|0)>(E|0)){break}if((c[F>>2]|0)!=0){break L2077}if((d[(c[F+12>>2]|0)+(I<<11)+G|0]|0|0)<=(E|0)){break L2077}}}while(0);c[p>>2]=(c[p>>2]|0)+1|0}}while(0);E=C+1|0;if((E|0)<27){C=E}else{K=E;break L2075}}c[m>>2]=C;b[f+188+(n<<5)+8>>1]=d[(c[v>>2]|0)+(C*23&-1)+D|0]|0;K=C}else{K=t}}while(0);t=c[h>>2]|0;if((K|0)==27){x=t;break}n=t+1|0;c[h>>2]=n;c[f+188+(t+2<<5)+4>>2]=-1;if((n|0)>-1){o=n;continue L2070}else{L=1421;break L2070}}}while(0);w=x-1|0;c[h>>2]=w;if((x|0)>0){o=w}else{L=1419;break}}if((L|0)==1419){return}else if((L|0)==1421){return}}function bV(b){b=b|0;var e=0,f=0,g=0,h=0,j=0,k=0,l=0,m=0,n=0,o=0,p=0,q=0,r=0,s=0,t=0,v=0,w=0,x=0,y=0,z=0,A=0,B=0,C=0,D=0,E=0,F=0,G=0,H=0;e=i;i=i+220|0;f=e|0;g=e+72|0;h=e+144|0;j=e+216|0;a[f+17|0]=1;a[f+15|0]=1;a[f+14|0]=1;a[f+12|0]=1;a[f+11|0]=1;a[f+9|0]=1;a[f+8|0]=1;a[f+6|0]=1;a[f+5|0]=1;a[f+3|0]=1;a[f+2|0]=1;a[f|0]=1;a[f+36|0]=1;a[f+34|0]=1;a[f+31|0]=1;a[f+29|0]=1;a[f+16|0]=2;a[f+13|0]=2;a[f+10|0]=2;a[f+7|0]=2;a[f+4|0]=2;a[f+1|0]=2;a[f+26|0]=2;a[f+21|0]=2;a[f+20|0]=2;a[f+24|0]=2;a[f+23|0]=2;a[f+18|0]=2;a[f+25|0]=4;a[f+22|0]=4;a[f+19|0]=4;a[f+35|0]=2;a[f+33|0]=2;a[f+32|0]=2;a[f+30|0]=2;a[f+28|0]=2;a[f+27|0]=2;a[f+41|0]=2;a[f+39|0]=2;a[f+40|0]=4;a[f+38|0]=4;a[f+37|0]=4;a[f+56|0]=0;a[f+54|0]=0;a[f+53|0]=0;a[f+51|0]=0;a[f+47|0]=0;a[f+45|0]=0;a[f+44|0]=0;a[f+42|0]=0;a[f+63|0]=0;a[f+62|0]=0;a[f+65|0]=0;a[f+60|0]=0;a[f+59|0]=1;a[f+58|0]=1;a[f+57|0]=1;a[f+55|0]=1;a[f+52|0]=1;a[f+50|0]=1;a[f+49|0]=1;a[f+48|0]=1;a[f+46|0]=1;a[f+43|0]=1;a[f+68|0]=1;a[f+66|0]=1;a[f+64|0]=1;a[f+67|0]=1;a[f+61|0]=1;a[g+36|0]=1;a[g+34|0]=1;a[g+31|0]=1;a[g+29|0]=1;cX(g|0,1,18);cX(g+18|0,2,9);a[g+35|0]=1;a[g+33|0]=1;a[g+32|0]=1;a[g+30|0]=1;a[g+28|0]=1;a[g+27|0]=1;k=g+37|0;a[k]=2;a[k+1|0]=2;a[k+2|0]=2;a[k+3|0]=2;a[k+4|0]=2;a[g+56|0]=0;a[g+54|0]=0;a[g+53|0]=0;a[g+51|0]=0;a[g+47|0]=0;a[g+45|0]=0;a[g+44|0]=0;a[g+42|0]=0;a[g+63|0]=0;a[g+62|0]=0;a[g+65|0]=0;a[g+60|0]=0;a[g+59|0]=1;a[g+58|0]=1;a[g+57|0]=1;a[g+55|0]=1;a[g+52|0]=1;a[g+50|0]=1;a[g+49|0]=1;a[g+48|0]=1;a[g+46|0]=1;a[g+43|0]=1;a[g+68|0]=1;a[g+66|0]=1;a[g+64|0]=1;a[g+67|0]=1;a[g+61|0]=1;cX(h|0,1,42);a[h+56|0]=0;a[h+54|0]=0;a[h+53|0]=0;a[h+51|0]=0;a[h+47|0]=0;a[h+45|0]=0;a[h+44|0]=0;a[h+42|0]=0;a[h+63|0]=0;a[h+62|0]=0;a[h+65|0]=0;a[h+60|0]=0;a[h+59|0]=1;a[h+58|0]=1;a[h+57|0]=1;a[h+55|0]=1;a[h+52|0]=1;a[h+50|0]=1;a[h+49|0]=1;a[h+48|0]=1;a[h+46|0]=1;a[h+43|0]=1;a[h+68|0]=1;a[h+66|0]=1;a[h+64|0]=1;a[h+67|0]=1;a[h+61|0]=1;cL(j);k=b+1800|0;L2099:do{if((c[k>>2]|0)<1){l=0;m=0;n=0}else{o=b+1820|0;p=j|0;q=1;r=0;s=0;t=0;while(1){v=c[b+188+(q<<5)+4>>2]|0;if((c[o>>2]|0)==0){w=c[5249892+(v<<2)>>2]|0;aq(5243320,(u=i,i=i+4|0,c[u>>2]=w,u)|0);x=v}else{w=c[p>>2]|0;y=d[5248036+(w*27&-1)+v|0]|0;c[p>>2]=d[5248684+(w*27&-1)+v|0]|0;v=c[5249436+(y<<2)>>2]|0;aq(5243320,(u=i,i=i+4|0,c[u>>2]=v,u)|0);x=y}y=(d[f+x|0]|0)+r|0;v=(d[g+x|0]|0)+s|0;w=(d[h+x|0]|0)+t|0;z=q+1|0;if((z|0)>(c[k>>2]|0)){l=y;m=v;n=w;break L2099}else{q=z;r=y;s=v;t=w}}}}while(0);k=b+1816|0;x=b+1804|0;do{if((c[k>>2]|0)==0){A=1430}else{if((c[x>>2]|0)==0){A=1430;break}else{B=l;C=m;D=n;break}}}while(0);do{if((A|0)==1430){aq(5243152,(u=i,i=i+1|0,i=i+3>>2<<2,c[u>>2]=0,u)|0);L2112:do{if((c[x>>2]|0)<1){E=l;F=m;G=n}else{t=b+1820|0;s=j|0;r=1;q=l;p=m;o=n;while(1){w=c[b+1180+(r*20&-1)+4>>2]|0;if((c[t>>2]|0)==0){v=c[5249832+(w<<2)>>2]|0;aq(5243320,(u=i,i=i+4|0,c[u>>2]=v,u)|0);H=w}else{v=d[w+5249332|0]|0;w=c[s>>2]|0;y=d[5248036+(w*27&-1)+v|0]|0;c[s>>2]=d[5248684+(w*27&-1)+v|0]|0;v=d[y+5249348|0]|0;y=c[5249376+(v<<2)>>2]|0;aq(5243320,(u=i,i=i+4|0,c[u>>2]=y,u)|0);H=v}v=(d[H+(f+27)|0]|0)+q|0;y=(d[H+(g+27)|0]|0)+p|0;w=(d[H+(h+27)|0]|0)+o|0;z=r+1|0;if((z|0)>(c[x>>2]|0)){E=v;F=y;G=w;break L2112}else{r=z;q=v;p=y;o=w}}}}while(0);if((c[k>>2]|0)!=0){B=E;C=F;D=G;break}aq(5246236,(u=i,i=i+12|0,c[u>>2]=E,c[u+4>>2]=F,c[u+8>>2]=G,u)|0);i=e;return}}while(0);G=c[b+1808>>2]|0;if((G|0)==3){aq(5246552,(u=i,i=i+12|0,c[u>>2]=B,c[u+4>>2]=C,c[u+8>>2]=D,u)|0);i=e;return}else if((G|0)==1){aq(5242988,(u=i,i=i+12|0,c[u>>2]=B,c[u+4>>2]=C,c[u+8>>2]=D,u)|0);i=e;return}else if((G|0)==2){aq(5246800,(u=i,i=i+12|0,c[u>>2]=B,c[u+4>>2]=C,c[u+8>>2]=D,u)|0);i=e;return}else{i=e;return}}function bW(f){f=f|0;var g=0,h=0,i=0,j=0,k=0,l=0,m=0,n=0,o=0,p=0,q=0,r=0,s=0,t=0,u=0,v=0,w=0,x=0,y=0,z=0,A=0,B=0,C=0,D=0,E=0,F=0;g=f+1828|0;c[g>>2]=(c[g>>2]|0)+1|0;g=b[f+38>>1]|0;h=e[f+44>>1]|0;i=e[f+42>>1]|0;j=e[f+40>>1]|0;k=g&65535;l=c[f+1800>>2]|0;m=c[f>>2]|0;L2133:do{if((l|0)<1){n=g;o=h;p=i;q=j;r=k;s=c[m+24>>2]|0}else{t=c[m+12>>2]|0;u=c[m+24>>2]|0;v=1;w=h;x=i;y=j;z=k;while(1){A=c[f+188+(v<<5)+4>>2]|0;B=v+1|0;C=b[t+(A*80640&-1)+(z<<1)>>1]|0;D=e[u+641520+(A*23760&-1)+(w<<1)>>1]|0;E=e[u+(A*23760&-1)+(x<<1)>>1]|0;F=e[u+1283040+(A*23760&-1)+(y<<1)>>1]|0;A=C&65535;if((B|0)>(l|0)){n=C;o=D;p=E;q=F;r=A;s=u;break L2133}else{v=B;w=D;x=E;y=F;z=A}}}}while(0);k=m+24|0;if(a[p+(s+7640640)|0]<<24>>24==0){return}if(a[o+(s+7652520)|0]<<24>>24==0){return}s=f+1824|0;c[s>>2]=(c[s>>2]|0)+1|0;b[f+1192>>1]=n;n=c[k>>2]|0;s=b[n+1924560+((e[n+7569360+(p<<1)>>1]|0)*3360&-1)+((e[n+7593120+(o<<1)>>1]|0)<<1)>>1]|0;b[f+1194>>1]=s;o=b[(c[k>>2]|0)+7616880+(q<<1)>>1]|0;q=o&65535;b[f+1196>>1]=o;o=c[f+4>>2]|0;k=d[(c[o+40>>2]|0)+(q*40320&-1)+r|0]|0;r=d[(s&65535)+((c[o+44>>2]|0)+(q*40320&-1))|0]|0;q=k>>>0>r>>>0?k:r;r=f+1836|0;c[r>>2]=(c[r>>2]|0)+1|0;r=f+184|0;if((q|0)>(c[r>>2]|0)){k=f+1844|0;c[k>>2]=(c[k>>2]|0)+1|0;return}b[f+1188>>1]=b[f+188+(l<<5)+8>>1]|0;c[f+1184>>2]=c[f+188+(l<<5)+4>>2]|0;l=q;while(1){bX(f,l);q=l+1|0;if((q|0)>(c[r>>2]|0)){break}else{l=q}}return}function bX(f,g){f=f|0;g=g|0;var h=0,i=0,j=0,k=0,l=0,m=0,n=0,o=0,p=0,q=0,r=0,s=0,t=0,u=0,v=0,w=0,x=0,y=0,z=0,A=0,B=0,C=0,D=0,E=0,F=0,G=0,H=0,I=0,J=0,K=0,L=0,M=0;h=f+1804|0;c[h>>2]=0;i=f+1180|0;c[i>>2]=g;c[f+1204>>2]=-1;g=f+188|0;j=f+180|0;k=f+1812|0;l=f+184|0;m=f+12|0;n=f+8|0;o=f|0;p=f+1836|0;q=f+4|0;r=f+1844|0;s=0;L2153:while(1){t=f+1180+(s*20&-1)|0;do{if((c[t>>2]|0)==0){bV(f);u=c[i>>2]|0;c[j>>2]=u+(c[g>>2]|0)|0;if((c[k>>2]|0)==0){v=1466;break L2153}c[l>>2]=u;w=c[h>>2]|0}else{x=s+1|0;y=f+1180+(x*20&-1)+4|0;z=(c[y>>2]|0)+1|0;L2157:do{if((z|0)<15){A=f+1180+(s*20&-1)+8|0;B=f+1180+(x*20&-1)|0;C=f+1180+(s*20&-1)+16|0;D=f+1180+(x*20&-1)+16|0;E=f+1180+(s*20&-1)+12|0;F=f+1180+(x*20&-1)+12|0;G=f+1180+(s*20&-1)+14|0;H=f+1180+(x*20&-1)+14|0;I=z;L2159:while(1){do{if(a[(e[A>>1]|0)+((c[m>>2]|0)+621+(I*23&-1))|0]<<24>>24!=0){J=(c[t>>2]|0)-(d[(c[n>>2]|0)+27+I|0]|0)|0;c[B>>2]=J;if((J|0)<0){break}b[D>>1]=b[(c[(c[o>>2]|0)+20>>2]|0)+(I*48&-1)+((e[C>>1]|0)<<1)>>1]|0;J=c[(c[o>>2]|0)+12>>2]|0;b[F>>1]=b[J+((d[I+(J+2177280)|0]|0)*80640&-1)+((e[E>>1]|0)<<1)>>1]|0;b[H>>1]=b[(c[(c[o>>2]|0)+16>>2]|0)+(I*80640&-1)+((e[G>>1]|0)<<1)>>1]|0;c[p>>2]=(c[p>>2]|0)+1|0;J=c[q>>2]|0;K=e[D>>1]|0;L=c[B>>2]|0;if((d[(e[F>>1]|0)+((c[J+40>>2]|0)+(K*40320&-1))|0]|0|0)<=(L|0)){if((d[(e[H>>1]|0)+((c[J+44>>2]|0)+(K*40320&-1))|0]|0|0)<=(L|0)){break L2159}}c[r>>2]=(c[r>>2]|0)+1|0}}while(0);L=I+1|0;if((L|0)<15){I=L}else{M=L;break L2157}}c[y>>2]=I;b[f+1180+(x*20&-1)+8>>1]=d[(e[A>>1]|0)+((c[m>>2]|0)+621+(I*23&-1))|0]|0;M=I}else{M=z}}while(0);z=c[h>>2]|0;if((M|0)==15){w=z;break}c[h>>2]=z+1|0;c[f+1180+((z+2|0)*20&-1)+4>>2]=-1;z=c[h>>2]|0;if((z|0)>-1){s=z;continue L2153}else{v=1481;break L2153}}}while(0);t=w-1|0;c[h>>2]=t;if((w|0)>0){s=t}else{v=1482;break}}if((v|0)==1481){return}else if((v|0)==1466){c[l>>2]=u-1|0;return}else if((v|0)==1482){return}}function bY(a,b,d){a=a|0;b=b|0;d=d|0;var f=0,g=0,h=0,j=0,k=0,l=0;f=i;g=b;b=i;i=i+164|0;cV(b,g,164);ax(5245568,35,1,c[p>>2]|0);g=cT(1102252)|0;b_(g,c[b>>2]|0);c[a>>2]=g;g=cT(13685764)|0;b5(g,c[b+4>>2]|0);c[a+4>>2]=g;g=cT(26736)|0;cc(g,e[b+10>>1]|0);c[a+8>>2]=g;g=cT(2177312)|0;h=c[b+8>>2]|0;cj(g,h&65535);c[a+12>>2]=g;g=h>>>16;if((d|0)==0){h=cT(1209604)|0;ck(h,g);c[a+16>>2]=h;h=cT(724)|0;cl(h,g);c[a+20>>2]=h;h=cT(7664404)|0;b=h;cq(b,g,d);j=a+24|0;c[j>>2]=b;k=c[p>>2]|0;l=ax(5246376,28,1,k|0)|0;i=f;return}else{c[a+16>>2]=0;c[a+20>>2]=0;h=cT(7664404)|0;b=h;cq(b,g,d);j=a+24|0;c[j>>2]=b;k=c[p>>2]|0;l=ax(5246376,28,1,k|0)|0;i=f;return}}function bZ(a){a=a|0;var b=0;b=c[a>>2]|0;if((b|0)!=0){cQ(b)}b=c[a+4>>2]|0;if((b|0)!=0){cQ(b)}b=c[a+8>>2]|0;if((b|0)!=0){cQ(b)}b=c[a+12>>2]|0;if((b|0)!=0){cQ(b)}b=c[a+16>>2]|0;if((b|0)!=0){cQ(b)}b=c[a+20>>2]|0;if((b|0)!=0){cQ(b)}b=c[a+24>>2]|0;if((b|0)==0){return}cQ(b);return}function b_(a,d){a=a|0;d=d|0;var f=0,g=0,h=0,j=0,k=0,l=0,m=0,n=0,o=0,q=0,r=0,s=0,t=0,v=0,w=0,x=0;f=i;i=i+76|0;g=f|0;c[a+1102248>>2]=d;br(g,d);d=c[g+48>>2]|0;h=c[g+72>>2]|0;L2209:do{if((d|0)>0){j=h^-1;k=0;l=1;while(1){if((1<<k&j|0)==0){m=l}else{m=l*3&-1}n=k+1|0;if((n|0)==(d|0)){o=m;break L2209}else{k=n;l=m}}}else{o=1}}while(0);if((h&255|0)==0){q=(o|0)/3&-1}else{q=o}o=$(c[g+64>>2]|0,q);ax(5244872,23,1,c[p>>2]|0);as(c[p>>2]|0);q=(o|0)>0;if(q){r=0}else{s=c[p>>2]|0;t=ap(s|0,5244208,(u=i,i=i+4|0,c[u>>2]=o,u)|0)|0;i=f;return}while(1){b[a+244944+(r<<1)>>1]=b$(a,r)&65535;b[a+(r<<1)>>1]=b0(a,r)&65535;b[a+489888+(r<<1)>>1]=b1(a,r)&65535;b[a+612360+(r<<1)>>1]=b2(a,r)&65535;b[a+367416+(r<<1)>>1]=b3(a,r)&65535;b[a+122472+(r<<1)>>1]=b4(a,r)&65535;g=r+1|0;if((g|0)==(o|0)){break}else{r=g}}if(q){v=0}else{s=c[p>>2]|0;t=ap(s|0,5244208,(u=i,i=i+4|0,c[u>>2]=o,u)|0)|0;i=f;return}while(1){b[a+285768+(v<<1)>>1]=b[a+244944+((e[a+244944+(v<<1)>>1]|0)<<1)>>1]|0;b[a+40824+(v<<1)>>1]=b[a+((e[a+(v<<1)>>1]|0)<<1)>>1]|0;b[a+530712+(v<<1)>>1]=b[a+489888+((e[a+489888+(v<<1)>>1]|0)<<1)>>1]|0;b[a+653184+(v<<1)>>1]=b[a+612360+((e[a+612360+(v<<1)>>1]|0)<<1)>>1]|0;b[a+408240+(v<<1)>>1]=b[a+367416+((e[a+367416+(v<<1)>>1]|0)<<1)>>1]|0;b[a+163296+(v<<1)>>1]=b[a+122472+((e[a+122472+(v<<1)>>1]|0)<<1)>>1]|0;r=v+1|0;if((r|0)==(o|0)){break}else{v=r}}if(q){w=0}else{s=c[p>>2]|0;t=ap(s|0,5244208,(u=i,i=i+4|0,c[u>>2]=o,u)|0)|0;i=f;return}while(1){b[a+326592+(w<<1)>>1]=b[a+285768+((e[a+244944+(w<<1)>>1]|0)<<1)>>1]|0;b[a+81648+(w<<1)>>1]=b[a+40824+((e[a+(w<<1)>>1]|0)<<1)>>1]|0;b[a+571536+(w<<1)>>1]=b[a+530712+((e[a+489888+(w<<1)>>1]|0)<<1)>>1]|0;b[a+694008+(w<<1)>>1]=b[a+653184+((e[a+612360+(w<<1)>>1]|0)<<1)>>1]|0;b[a+449064+(w<<1)>>1]=b[a+408240+((e[a+367416+(w<<1)>>1]|0)<<1)>>1]|0;b[a+204120+(w<<1)>>1]=b[a+163296+((e[a+122472+(w<<1)>>1]|0)<<1)>>1]|0;v=w+1|0;if((v|0)==(o|0)){break}else{w=v}}if(q){x=0}else{s=c[p>>2]|0;t=ap(s|0,5244208,(u=i,i=i+4|0,c[u>>2]=o,u)|0)|0;i=f;return}while(1){b[a+979776+(x<<1)>>1]=b[a+694008+((e[a+244944+(x<<1)>>1]|0)<<1)>>1]|0;b[a+734832+(x<<1)>>1]=b[a+449064+((e[a+(x<<1)>>1]|0)<<1)>>1]|0;b[a+857304+(x<<1)>>1]=b[a+204120+((e[a+489888+(x<<1)>>1]|0)<<1)>>1]|0;b[a+1020600+(x<<1)>>1]=b[a+653184+((e[a+285768+(x<<1)>>1]|0)<<1)>>1]|0;b[a+775656+(x<<1)>>1]=b[a+408240+((e[a+40824+(x<<1)>>1]|0)<<1)>>1]|0;b[a+898128+(x<<1)>>1]=b[a+163296+((e[a+530712+(x<<1)>>1]|0)<<1)>>1]|0;b[a+1061424+(x<<1)>>1]=b[a+326592+((e[a+612360+(x<<1)>>1]|0)<<1)>>1]|0;b[a+816480+(x<<1)>>1]=b[a+81648+((e[a+367416+(x<<1)>>1]|0)<<1)>>1]|0;b[a+938952+(x<<1)>>1]=b[a+571536+((e[a+122472+(x<<1)>>1]|0)<<1)>>1]|0;q=x+1|0;if((q|0)==(o|0)){break}else{x=q}}s=c[p>>2]|0;t=ap(s|0,5244208,(u=i,i=i+4|0,c[u>>2]=o,u)|0)|0;i=f;return}function b$(a,b){a=a|0;b=b|0;var d=0,e=0,f=0,g=0,h=0,j=0,k=0,l=0,m=0,n=0,o=0,p=0,q=0,r=0,s=0,t=0,u=0,v=0,w=0,x=0,y=0,z=0,A=0,B=0;d=i;i=i+76|0;e=d|0;br(e,c[a+1102248>>2]|0);bs(e,b);b=e|0;a=c[b>>2]|0;f=e+4|0;g=c[f>>2]|0;c[b>>2]=g;b=e+8|0;c[f>>2]=c[b>>2]|0;f=e+12|0;c[b>>2]=c[f>>2]|0;c[f>>2]=a;a=c[e+48>>2]|0;L2241:do{if((a|0)>0){f=1;b=0;h=1;j=g;while(1){if((j|0)==0){k=h;l=b}else{k=h*3&-1;l=((b*3&-1)-1|0)+j|0}if((f|0)==(a|0)){m=l;n=k;break L2241}o=c[e+(f<<2)>>2]|0;f=f+1|0;b=l;h=k;j=o}}else{m=0;n=1}}while(0);if((c[e+72>>2]&255|0)==0){p=(n|0)/3&-1;q=(m|0)/3&-1}else{p=n;q=m}m=c[e+52>>2]|0;if((a-m|0)>0){r=0;s=m;t=0;u=g}else{v=0;w=$(v,p);x=w+q|0;i=d;return x|0}while(1){if((u|0)==0){y=t;z=s}else{g=s-1|0;L2258:do{if((s|0)>0){m=a-r|0;n=s;k=1;l=1;while(1){j=m-1|0;h=$(j,k);b=$(n,l);f=n-1|0;if((f|0)>0){m=j;n=f;k=h;l=b}else{A=h;B=b;break L2258}}}else{A=1;B=1}}while(0);y=((A|0)/(B|0)&-1)+t|0;z=g}l=r+1|0;if((l|0)>=(a-z|0)){v=y;break}r=l;s=z;t=y;u=c[e+(l<<2)>>2]|0}w=$(v,p);x=w+q|0;i=d;return x|0}function b0(a,b){a=a|0;b=b|0;var d=0,e=0,f=0,g=0,h=0,j=0,k=0,l=0,m=0,n=0,o=0,p=0,q=0,r=0,s=0,t=0,u=0,v=0,w=0,x=0,y=0,z=0,A=0,B=0,C=0,D=0;d=i;i=i+76|0;e=d|0;br(e,c[a+1102248>>2]|0);bs(e,b);b=e+20|0;a=c[b>>2]|0;f=e+16|0;g=c[f>>2]|0;c[b>>2]=g;h=e|0;j=c[h>>2]|0;c[f>>2]=j;k=e+12|0;l=c[k>>2]|0;c[h>>2]=l;c[k>>2]=a;if((g|0)!=0){c[b>>2]=(g|0)%3+1|0}if((j|0)!=0){c[f>>2]=(j+1|0)%3+1|0}if((l|0)==0){m=0}else{j=(l|0)%3+1|0;c[h>>2]=j;m=j}if((a|0)!=0){c[k>>2]=(a+1|0)%3+1|0}a=c[e+48>>2]|0;L2279:do{if((a|0)>0){k=1;j=0;h=1;l=m;while(1){if((l|0)==0){n=h;o=j}else{n=h*3&-1;o=((j*3&-1)-1|0)+l|0}if((k|0)==(a|0)){p=o;q=n;break L2279}f=c[e+(k<<2)>>2]|0;k=k+1|0;j=o;h=n;l=f}}else{p=0;q=1}}while(0);if((c[e+72>>2]&255|0)==0){r=(q|0)/3&-1;s=(p|0)/3&-1}else{r=q;s=p}p=c[e+52>>2]|0;if((a-p|0)>0){t=0;u=p;v=0;w=m}else{x=0;y=$(x,r);z=y+s|0;i=d;return z|0}while(1){if((w|0)==0){A=v;B=u}else{m=u-1|0;L2296:do{if((u|0)>0){p=a-t|0;q=u;n=1;o=1;while(1){l=p-1|0;h=$(l,n);j=$(q,o);k=q-1|0;if((k|0)>0){p=l;q=k;n=h;o=j}else{C=h;D=j;break L2296}}}else{C=1;D=1}}while(0);A=((C|0)/(D|0)&-1)+v|0;B=m}o=t+1|0;if((o|0)>=(a-B|0)){x=A;break}t=o;u=B;v=A;w=c[e+(o<<2)>>2]|0}y=$(x,r);z=y+s|0;i=d;return z|0}function b1(a,b){a=a|0;b=b|0;var d=0,e=0,f=0,g=0,h=0,j=0,k=0,l=0,m=0,n=0,o=0,p=0,q=0,r=0,s=0,t=0,u=0,v=0,w=0,x=0,y=0,z=0,A=0,B=0,C=0,D=0;d=i;i=i+76|0;e=d|0;br(e,c[a+1102248>>2]|0);bs(e,b);b=e+16|0;a=c[b>>2]|0;f=e+28|0;g=c[f>>2]|0;c[b>>2]=g;h=e+4|0;j=c[h>>2]|0;c[f>>2]=j;k=e|0;l=c[k>>2]|0;c[h>>2]=l;c[k>>2]=a;if((g|0)!=0){c[b>>2]=(g|0)%3+1|0}if((j|0)!=0){c[f>>2]=(j+1|0)%3+1|0}if((l|0)!=0){c[h>>2]=(l|0)%3+1|0}if((a|0)==0){m=0}else{l=(a+1|0)%3+1|0;c[k>>2]=l;m=l}l=c[e+48>>2]|0;L2317:do{if((l|0)>0){k=1;a=0;h=1;j=m;while(1){if((j|0)==0){n=h;o=a}else{n=h*3&-1;o=((a*3&-1)-1|0)+j|0}if((k|0)==(l|0)){p=o;q=n;break L2317}f=c[e+(k<<2)>>2]|0;k=k+1|0;a=o;h=n;j=f}}else{p=0;q=1}}while(0);if((c[e+72>>2]&255|0)==0){r=(q|0)/3&-1;s=(p|0)/3&-1}else{r=q;s=p}p=c[e+52>>2]|0;if((l-p|0)>0){t=0;u=p;v=0;w=m}else{x=0;y=$(x,r);z=y+s|0;i=d;return z|0}while(1){if((w|0)==0){A=v;B=u}else{m=u-1|0;L2334:do{if((u|0)>0){p=l-t|0;q=u;n=1;o=1;while(1){j=p-1|0;h=$(j,n);a=$(q,o);k=q-1|0;if((k|0)>0){p=j;q=k;n=h;o=a}else{C=h;D=a;break L2334}}}else{C=1;D=1}}while(0);A=((C|0)/(D|0)&-1)+v|0;B=m}o=t+1|0;if((o|0)>=(l-B|0)){x=A;break}t=o;u=B;v=A;w=c[e+(o<<2)>>2]|0}y=$(x,r);z=y+s|0;i=d;return z|0}function b2(a,b){a=a|0;b=b|0;var d=0,e=0,f=0,g=0,h=0,j=0,k=0,l=0,m=0,n=0,o=0,p=0,q=0,r=0,s=0,t=0,u=0,v=0,w=0,x=0,y=0,z=0;d=i;i=i+76|0;e=d|0;br(e,c[a+1102248>>2]|0);bs(e,b);b=e+20|0;a=c[b>>2]|0;f=e+24|0;c[b>>2]=c[f>>2]|0;b=e+28|0;c[f>>2]=c[b>>2]|0;f=e+16|0;c[b>>2]=c[f>>2]|0;c[f>>2]=a;a=c[e+48>>2]|0;L2343:do{if((a|0)>0){f=0;b=0;g=1;while(1){h=c[e+(f<<2)>>2]|0;if((h|0)==0){j=g;k=b}else{j=g*3&-1;k=((b*3&-1)-1|0)+h|0}h=f+1|0;if((h|0)==(a|0)){l=k;m=j;break L2343}else{f=h;b=k;g=j}}}else{l=0;m=1}}while(0);if((c[e+72>>2]&255|0)==0){n=(m|0)/3&-1;o=(l|0)/3&-1}else{n=m;o=l}l=c[e+52>>2]|0;if((a-l|0)>0){p=0;q=l;r=0}else{s=0;t=$(s,n);u=t+o|0;i=d;return u|0}while(1){if((c[e+(p<<2)>>2]|0)==0){v=r;w=q}else{l=q-1|0;L2359:do{if((q|0)>0){m=a-p|0;j=q;k=1;g=1;while(1){b=m-1|0;f=$(b,k);h=$(j,g);x=j-1|0;if((x|0)>0){m=b;j=x;k=f;g=h}else{y=f;z=h;break L2359}}}else{y=1;z=1}}while(0);v=((y|0)/(z|0)&-1)+r|0;w=l}g=p+1|0;if((g|0)<(a-w|0)){p=g;q=w;r=v}else{s=v;break}}t=$(s,n);u=t+o|0;i=d;return u|0}function b3(a,b){a=a|0;b=b|0;var d=0,e=0,f=0,g=0,h=0,j=0,k=0,l=0,m=0,n=0,o=0,p=0,q=0,r=0,s=0,t=0,u=0,v=0,w=0,x=0,y=0,z=0,A=0,B=0;d=i;i=i+76|0;e=d|0;br(e,c[a+1102248>>2]|0);bs(e,b);b=e+28|0;a=c[b>>2]|0;f=e+24|0;g=c[f>>2]|0;c[b>>2]=g;h=e+8|0;j=c[h>>2]|0;c[f>>2]=j;k=e+4|0;l=c[k>>2]|0;c[h>>2]=l;c[k>>2]=a;if((g|0)!=0){c[b>>2]=(g|0)%3+1|0}if((j|0)!=0){c[f>>2]=(j+1|0)%3+1|0}if((l|0)!=0){c[h>>2]=(l|0)%3+1|0}if((a|0)!=0){c[k>>2]=(a+1|0)%3+1|0}a=c[e+48>>2]|0;L2379:do{if((a|0)>0){k=0;l=0;h=1;while(1){j=c[e+(k<<2)>>2]|0;if((j|0)==0){m=h;n=l}else{m=h*3&-1;n=((l*3&-1)-1|0)+j|0}j=k+1|0;if((j|0)==(a|0)){o=n;p=m;break L2379}else{k=j;l=n;h=m}}}else{o=0;p=1}}while(0);if((c[e+72>>2]&255|0)==0){q=(p|0)/3&-1;r=(o|0)/3&-1}else{q=p;r=o}o=c[e+52>>2]|0;if((a-o|0)>0){s=0;t=o;u=0}else{v=0;w=$(v,q);x=w+r|0;i=d;return x|0}while(1){if((c[e+(s<<2)>>2]|0)==0){y=u;z=t}else{o=t-1|0;L2395:do{if((t|0)>0){p=a-s|0;m=t;n=1;h=1;while(1){l=p-1|0;k=$(l,n);j=$(m,h);f=m-1|0;if((f|0)>0){p=l;m=f;n=k;h=j}else{A=k;B=j;break L2395}}}else{A=1;B=1}}while(0);y=((A|0)/(B|0)&-1)+u|0;z=o}h=s+1|0;if((h|0)<(a-z|0)){s=h;t=z;u=y}else{v=y;break}}w=$(v,q);x=w+r|0;i=d;return x|0}function b4(a,b){a=a|0;b=b|0;var d=0,e=0,f=0,g=0,h=0,j=0,k=0,l=0,m=0,n=0,o=0,p=0,q=0,r=0,s=0,t=0,u=0,v=0,w=0,x=0,y=0,z=0,A=0,B=0;d=i;i=i+76|0;e=d|0;br(e,c[a+1102248>>2]|0);bs(e,b);b=e+24|0;a=c[b>>2]|0;f=e+20|0;g=c[f>>2]|0;c[b>>2]=g;h=e+12|0;j=c[h>>2]|0;c[f>>2]=j;k=e+8|0;l=c[k>>2]|0;c[h>>2]=l;c[k>>2]=a;if((g|0)!=0){c[b>>2]=(g|0)%3+1|0}if((j|0)!=0){c[f>>2]=(j+1|0)%3+1|0}if((l|0)!=0){c[h>>2]=(l|0)%3+1|0}if((a|0)!=0){c[k>>2]=(a+1|0)%3+1|0}a=c[e+48>>2]|0;L2415:do{if((a|0)>0){k=0;l=0;h=1;while(1){j=c[e+(k<<2)>>2]|0;if((j|0)==0){m=h;n=l}else{m=h*3&-1;n=((l*3&-1)-1|0)+j|0}j=k+1|0;if((j|0)==(a|0)){o=n;p=m;break L2415}else{k=j;l=n;h=m}}}else{o=0;p=1}}while(0);if((c[e+72>>2]&255|0)==0){q=(p|0)/3&-1;r=(o|0)/3&-1}else{q=p;r=o}o=c[e+52>>2]|0;if((a-o|0)>0){s=0;t=o;u=0}else{v=0;w=$(v,q);x=w+r|0;i=d;return x|0}while(1){if((c[e+(s<<2)>>2]|0)==0){y=u;z=t}else{o=t-1|0;L2431:do{if((t|0)>0){p=a-s|0;m=t;n=1;h=1;while(1){l=p-1|0;k=$(l,n);j=$(m,h);f=m-1|0;if((f|0)>0){p=l;m=f;n=k;h=j}else{A=k;B=j;break L2431}}}else{A=1;B=1}}while(0);y=((A|0)/(B|0)&-1)+u|0;z=o}h=s+1|0;if((h|0)<(a-z|0)){s=h;t=z;u=y}else{v=y;break}}w=$(v,q);x=w+r|0;i=d;return x|0}function b5(a,b){a=a|0;b=b|0;var d=0,e=0,f=0,g=0,h=0,j=0,k=0,l=0,m=0,n=0,o=0,q=0,r=0,s=0,t=0,v=0;d=i;i=i+76|0;e=d|0;c[a+13685760>>2]=b;bq(e,b);b=c[e+48>>2]|0;f=c[e+72>>2]|0;L2439:do{if((b|0)>0){g=f^-1;h=0;j=1;while(1){k=j<<((1<<h&g|0)!=0&1);l=h+1|0;if((l|0)==(b|0)){m=k;break L2439}else{h=l;j=k}}}else{m=1}}while(0);if((f&4095|0)==0){n=(m|0)/2&-1}else{n=m}m=$(c[e+64>>2]|0,n);ax(5243844,20,1,c[p>>2]|0);as(c[p>>2]|0);n=(m|0)>0;if(n){o=0}else{q=c[p>>2]|0;r=ap(q|0,5244208,(u=i,i=i+4|0,c[u>>2]=m,u)|0)|0;i=d;return}while(1){c[a+3041280+(o<<2)>>2]=b6(a,o)|0;c[a+(o<<2)>>2]=b7(a,o)|0;c[a+6082560+(o<<2)>>2]=b8(a,o)|0;c[a+7603200+(o<<2)>>2]=b9(a,o)|0;c[a+4561920+(o<<2)>>2]=ca(a,o)|0;c[a+1520640+(o<<2)>>2]=cb(a,o)|0;e=o+1|0;if((e|0)==(m|0)){break}else{o=e}}if(n){s=0}else{q=c[p>>2]|0;r=ap(q|0,5244208,(u=i,i=i+4|0,c[u>>2]=m,u)|0)|0;i=d;return}while(1){c[a+3548160+(s<<2)>>2]=c[a+3041280+(c[a+3041280+(s<<2)>>2]<<2)>>2]|0;c[a+506880+(s<<2)>>2]=c[a+(c[a+(s<<2)>>2]<<2)>>2]|0;c[a+6589440+(s<<2)>>2]=c[a+6082560+(c[a+6082560+(s<<2)>>2]<<2)>>2]|0;c[a+8110080+(s<<2)>>2]=c[a+7603200+(c[a+7603200+(s<<2)>>2]<<2)>>2]|0;c[a+5068800+(s<<2)>>2]=c[a+4561920+(c[a+4561920+(s<<2)>>2]<<2)>>2]|0;c[a+2027520+(s<<2)>>2]=c[a+1520640+(c[a+1520640+(s<<2)>>2]<<2)>>2]|0;o=s+1|0;if((o|0)==(m|0)){break}else{s=o}}if(n){t=0}else{q=c[p>>2]|0;r=ap(q|0,5244208,(u=i,i=i+4|0,c[u>>2]=m,u)|0)|0;i=d;return}while(1){c[a+4055040+(t<<2)>>2]=c[a+3548160+(c[a+3041280+(t<<2)>>2]<<2)>>2]|0;c[a+1013760+(t<<2)>>2]=c[a+506880+(c[a+(t<<2)>>2]<<2)>>2]|0;c[a+7096320+(t<<2)>>2]=c[a+6589440+(c[a+6082560+(t<<2)>>2]<<2)>>2]|0;c[a+8616960+(t<<2)>>2]=c[a+8110080+(c[a+7603200+(t<<2)>>2]<<2)>>2]|0;c[a+5575680+(t<<2)>>2]=c[a+5068800+(c[a+4561920+(t<<2)>>2]<<2)>>2]|0;c[a+2534400+(t<<2)>>2]=c[a+2027520+(c[a+1520640+(t<<2)>>2]<<2)>>2]|0;s=t+1|0;if((s|0)==(m|0)){break}else{t=s}}if(n){v=0}else{q=c[p>>2]|0;r=ap(q|0,5244208,(u=i,i=i+4|0,c[u>>2]=m,u)|0)|0;i=d;return}while(1){c[a+12165120+(v<<2)>>2]=c[a+8616960+(c[a+3041280+(v<<2)>>2]<<2)>>2]|0;c[a+9123840+(v<<2)>>2]=c[a+5575680+(c[a+(v<<2)>>2]<<2)>>2]|0;c[a+10644480+(v<<2)>>2]=c[a+2534400+(c[a+6082560+(v<<2)>>2]<<2)>>2]|0;c[a+12672e3+(v<<2)>>2]=c[a+8110080+(c[a+3548160+(v<<2)>>2]<<2)>>2]|0;c[a+9630720+(v<<2)>>2]=c[a+5068800+(c[a+506880+(v<<2)>>2]<<2)>>2]|0;c[a+11151360+(v<<2)>>2]=c[a+2027520+(c[a+6589440+(v<<2)>>2]<<2)>>2]|0;c[a+13178880+(v<<2)>>2]=c[a+4055040+(c[a+7603200+(v<<2)>>2]<<2)>>2]|0;c[a+10137600+(v<<2)>>2]=c[a+1013760+(c[a+4561920+(v<<2)>>2]<<2)>>2]|0;c[a+11658240+(v<<2)>>2]=c[a+7096320+(c[a+1520640+(v<<2)>>2]<<2)>>2]|0;n=v+1|0;if((n|0)==(m|0)){break}else{v=n}}q=c[p>>2]|0;r=ap(q|0,5244208,(u=i,i=i+4|0,c[u>>2]=m,u)|0)|0;i=d;return}function b6(a,b){a=a|0;b=b|0;var d=0,e=0,f=0,g=0,h=0,j=0,k=0,l=0,m=0,n=0,o=0,p=0,q=0,r=0,s=0,t=0,u=0,v=0,w=0,x=0,y=0,z=0,A=0,B=0;d=i;i=i+76|0;e=d|0;bq(e,c[a+13685760>>2]|0);bv(e,b);b=e+4|0;a=c[b>>2]|0;f=e+8|0;c[b>>2]=c[f>>2]|0;b=e+12|0;c[f>>2]=c[b>>2]|0;f=e|0;c[b>>2]=c[f>>2]|0;c[f>>2]=a;f=c[e+48>>2]|0;L2468:do{if((f|0)>0){b=1;g=0;h=1;j=a;while(1){if((j|0)==0){k=h;l=g}else{k=h<<1;l=((g<<1)-1|0)+j|0}if((b|0)==(f|0)){m=l;n=k;break L2468}o=c[e+(b<<2)>>2]|0;b=b+1|0;g=l;h=k;j=o}}else{m=0;n=1}}while(0);if((c[e+72>>2]&4095|0)==0){p=(n|0)/2&-1;q=(m|0)/2&-1}else{p=n;q=m}m=c[e+52>>2]|0;if((f-m|0)>0){r=0;s=m;t=0;u=a}else{v=0;w=$(v,p);x=w+q|0;i=d;return x|0}while(1){if((u|0)==0){y=t;z=s}else{a=s-1|0;L2485:do{if((s|0)>0){m=f-r|0;n=s;k=1;l=1;while(1){j=m-1|0;h=$(j,k);g=$(n,l);b=n-1|0;if((b|0)>0){m=j;n=b;k=h;l=g}else{A=h;B=g;break L2485}}}else{A=1;B=1}}while(0);y=((A|0)/(B|0)&-1)+t|0;z=a}l=r+1|0;if((l|0)>=(f-z|0)){v=y;break}r=l;s=z;t=y;u=c[e+(l<<2)>>2]|0}w=$(v,p);x=w+q|0;i=d;return x|0}function b7(a,b){a=a|0;b=b|0;var d=0,e=0,f=0,g=0,h=0,j=0,k=0,l=0,m=0,n=0,o=0,p=0,q=0,r=0,s=0,t=0,u=0,v=0,w=0,x=0,y=0,z=0,A=0,B=0,C=0,D=0;d=i;i=i+76|0;e=d|0;bq(e,c[a+13685760>>2]|0);bv(e,b);b=e+36|0;a=c[b>>2]|0;f=e+16|0;g=c[f>>2]|0;c[b>>2]=g;h=e+32|0;j=c[h>>2]|0;c[f>>2]=j;k=e|0;l=c[k>>2]|0;c[h>>2]=l;c[k>>2]=a;if((g|0)!=0){c[b>>2]=3-g|0}if((j|0)!=0){c[f>>2]=3-j|0}if((l|0)!=0){c[h>>2]=3-l|0}if((a|0)==0){m=0}else{l=3-a|0;c[k>>2]=l;m=l}l=c[e+48>>2]|0;L2506:do{if((l|0)>0){k=1;a=0;h=1;j=m;while(1){if((j|0)==0){n=h;o=a}else{n=h<<1;o=((a<<1)-1|0)+j|0}if((k|0)==(l|0)){p=o;q=n;break L2506}f=c[e+(k<<2)>>2]|0;k=k+1|0;a=o;h=n;j=f}}else{p=0;q=1}}while(0);if((c[e+72>>2]&4095|0)==0){r=(q|0)/2&-1;s=(p|0)/2&-1}else{r=q;s=p}p=c[e+52>>2]|0;if((l-p|0)>0){t=0;u=p;v=0;w=m}else{x=0;y=$(x,r);z=y+s|0;i=d;return z|0}while(1){if((w|0)==0){A=v;B=u}else{m=u-1|0;L2523:do{if((u|0)>0){p=l-t|0;q=u;n=1;o=1;while(1){j=p-1|0;h=$(j,n);a=$(q,o);k=q-1|0;if((k|0)>0){p=j;q=k;n=h;o=a}else{C=h;D=a;break L2523}}}else{C=1;D=1}}while(0);A=((C|0)/(D|0)&-1)+v|0;B=m}o=t+1|0;if((o|0)>=(l-B|0)){x=A;break}t=o;u=B;v=A;w=c[e+(o<<2)>>2]|0}y=$(x,r);z=y+s|0;i=d;return z|0}function b8(a,b){a=a|0;b=b|0;var d=0,e=0,f=0,g=0,h=0,j=0,k=0,l=0,m=0,n=0,o=0,p=0,q=0,r=0,s=0,t=0,u=0,v=0,w=0,x=0,y=0,z=0;d=i;i=i+76|0;e=d|0;bq(e,c[a+13685760>>2]|0);bv(e,b);b=e+32|0;a=c[b>>2]|0;f=e+20|0;c[b>>2]=c[f>>2]|0;b=e+40|0;c[f>>2]=c[b>>2]|0;f=e+4|0;c[b>>2]=c[f>>2]|0;c[f>>2]=a;a=c[e+48>>2]|0;L2532:do{if((a|0)>0){f=0;b=0;g=1;while(1){h=c[e+(f<<2)>>2]|0;if((h|0)==0){j=g;k=b}else{j=g<<1;k=((b<<1)-1|0)+h|0}h=f+1|0;if((h|0)==(a|0)){l=k;m=j;break L2532}else{f=h;b=k;g=j}}}else{l=0;m=1}}while(0);if((c[e+72>>2]&4095|0)==0){n=(m|0)/2&-1;o=(l|0)/2&-1}else{n=m;o=l}l=c[e+52>>2]|0;if((a-l|0)>0){p=0;q=l;r=0}else{s=0;t=$(s,n);u=t+o|0;i=d;return u|0}while(1){if((c[e+(p<<2)>>2]|0)==0){v=r;w=q}else{l=q-1|0;L2548:do{if((q|0)>0){m=a-p|0;j=q;k=1;g=1;while(1){b=m-1|0;f=$(b,k);h=$(j,g);x=j-1|0;if((x|0)>0){m=b;j=x;k=f;g=h}else{y=f;z=h;break L2548}}}else{y=1;z=1}}while(0);v=((y|0)/(z|0)&-1)+r|0;w=l}g=p+1|0;if((g|0)<(a-w|0)){p=g;q=w;r=v}else{s=v;break}}t=$(s,n);u=t+o|0;i=d;return u|0}function b9(a,b){a=a|0;b=b|0;var d=0,e=0,f=0,g=0,h=0,j=0,k=0,l=0,m=0,n=0,o=0,p=0,q=0,r=0,s=0,t=0,u=0,v=0,w=0,x=0,y=0,z=0;d=i;i=i+76|0;e=d|0;bq(e,c[a+13685760>>2]|0);bv(e,b);b=e+28|0;a=c[b>>2]|0;f=e+24|0;c[b>>2]=c[f>>2]|0;b=e+20|0;c[f>>2]=c[b>>2]|0;f=e+16|0;c[b>>2]=c[f>>2]|0;c[f>>2]=a;a=c[e+48>>2]|0;L2556:do{if((a|0)>0){f=0;b=0;g=1;while(1){h=c[e+(f<<2)>>2]|0;if((h|0)==0){j=g;k=b}else{j=g<<1;k=((b<<1)-1|0)+h|0}h=f+1|0;if((h|0)==(a|0)){l=k;m=j;break L2556}else{f=h;b=k;g=j}}}else{l=0;m=1}}while(0);if((c[e+72>>2]&4095|0)==0){n=(m|0)/2&-1;o=(l|0)/2&-1}else{n=m;o=l}l=c[e+52>>2]|0;if((a-l|0)>0){p=0;q=l;r=0}else{s=0;t=$(s,n);u=t+o|0;i=d;return u|0}while(1){if((c[e+(p<<2)>>2]|0)==0){v=r;w=q}else{l=q-1|0;L2572:do{if((q|0)>0){m=a-p|0;j=q;k=1;g=1;while(1){b=m-1|0;f=$(b,k);h=$(j,g);x=j-1|0;if((x|0)>0){m=b;j=x;k=f;g=h}else{y=f;z=h;break L2572}}}else{y=1;z=1}}while(0);v=((y|0)/(z|0)&-1)+r|0;w=l}g=p+1|0;if((g|0)<(a-w|0)){p=g;q=w;r=v}else{s=v;break}}t=$(s,n);u=t+o|0;i=d;return u|0}function ca(a,b){a=a|0;b=b|0;var d=0,e=0,f=0,g=0,h=0,j=0,k=0,l=0,m=0,n=0,o=0,p=0,q=0,r=0,s=0,t=0,u=0,v=0,w=0,x=0,y=0,z=0,A=0,B=0;d=i;i=i+76|0;e=d|0;bq(e,c[a+13685760>>2]|0);bv(e,b);b=e+40|0;a=c[b>>2]|0;f=e+24|0;g=c[f>>2]|0;c[b>>2]=g;h=e+44|0;j=c[h>>2]|0;c[f>>2]=j;k=e+8|0;l=c[k>>2]|0;c[h>>2]=l;c[k>>2]=a;if((g|0)!=0){c[b>>2]=3-g|0}if((j|0)!=0){c[f>>2]=3-j|0}if((l|0)!=0){c[h>>2]=3-l|0}if((a|0)!=0){c[k>>2]=3-a|0}a=c[e+48>>2]|0;L2592:do{if((a|0)>0){k=0;l=0;h=1;while(1){j=c[e+(k<<2)>>2]|0;if((j|0)==0){m=h;n=l}else{m=h<<1;n=((l<<1)-1|0)+j|0}j=k+1|0;if((j|0)==(a|0)){o=n;p=m;break L2592}else{k=j;l=n;h=m}}}else{o=0;p=1}}while(0);if((c[e+72>>2]&4095|0)==0){q=(p|0)/2&-1;r=(o|0)/2&-1}else{q=p;r=o}o=c[e+52>>2]|0;if((a-o|0)>0){s=0;t=o;u=0}else{v=0;w=$(v,q);x=w+r|0;i=d;return x|0}while(1){if((c[e+(s<<2)>>2]|0)==0){y=u;z=t}else{o=t-1|0;L2608:do{if((t|0)>0){p=a-s|0;m=t;n=1;h=1;while(1){l=p-1|0;k=$(l,n);j=$(m,h);f=m-1|0;if((f|0)>0){p=l;m=f;n=k;h=j}else{A=k;B=j;break L2608}}}else{A=1;B=1}}while(0);y=((A|0)/(B|0)&-1)+u|0;z=o}h=s+1|0;if((h|0)<(a-z|0)){s=h;t=z;u=y}else{v=y;break}}w=$(v,q);x=w+r|0;i=d;return x|0}function cb(a,b){a=a|0;b=b|0;var d=0,e=0,f=0,g=0,h=0,j=0,k=0,l=0,m=0,n=0,o=0,p=0,q=0,r=0,s=0,t=0,u=0,v=0,w=0,x=0,y=0,z=0;d=i;i=i+76|0;e=d|0;bq(e,c[a+13685760>>2]|0);bv(e,b);b=e+44|0;a=c[b>>2]|0;f=e+28|0;c[b>>2]=c[f>>2]|0;b=e+36|0;c[f>>2]=c[b>>2]|0;f=e+12|0;c[b>>2]=c[f>>2]|0;c[f>>2]=a;a=c[e+48>>2]|0;L2616:do{if((a|0)>0){f=0;b=0;g=1;while(1){h=c[e+(f<<2)>>2]|0;if((h|0)==0){j=g;k=b}else{j=g<<1;k=((b<<1)-1|0)+h|0}h=f+1|0;if((h|0)==(a|0)){l=k;m=j;break L2616}else{f=h;b=k;g=j}}}else{l=0;m=1}}while(0);if((c[e+72>>2]&4095|0)==0){n=(m|0)/2&-1;o=(l|0)/2&-1}else{n=m;o=l}l=c[e+52>>2]|0;if((a-l|0)>0){p=0;q=l;r=0}else{s=0;t=$(s,n);u=t+o|0;i=d;return u|0}while(1){if((c[e+(p<<2)>>2]|0)==0){v=r;w=q}else{l=q-1|0;L2632:do{if((q|0)>0){m=a-p|0;j=q;k=1;g=1;while(1){b=m-1|0;f=$(b,k);h=$(j,g);x=j-1|0;if((x|0)>0){m=b;j=x;k=f;g=h}else{y=f;z=h;break L2632}}}else{y=1;z=1}}while(0);v=((y|0)/(z|0)&-1)+r|0;w=l}g=p+1|0;if((g|0)<(a-w|0)){p=g;q=w;r=v}else{s=v;break}}t=$(s,n);u=t+o|0;i=d;return u|0}function cc(a,d){a=a|0;d=d|0;var f=0,g=0,h=0,j=0,k=0,l=0,m=0,n=0,o=0,q=0,r=0,s=0,t=0,v=0,w=0,x=0,y=0,z=0,A=0;f=i;i=i+76|0;g=f|0;c[a+26732>>2]=d;h=d^-1;j=(((h>>>8&1)+(h>>>9&1)|0)+(h>>>10&1)|0)+(h>>>11&1)|0;h=g+48|0;c[h>>2]=12;c[g+52>>2]=j;c[g+56>>2]=479001600;k=g+60|0;L2640:do{if((j|0)>1){l=j;m=1;while(1){n=$(l,m);o=l-1|0;if((o|0)>1){l=o;m=n}else{q=n;break L2640}}}else{q=1}}while(0);c[k>>2]=q;q=g+64|0;L2644:do{if((j|0)>0){k=12;m=j;l=1;n=1;while(1){r=$(k,l);s=$(m,n);o=m-1|0;if((o|0)>0){k=k-1|0;m=o;l=r;n=s}else{break}}c[q>>2]=(r|0)/(s|0)&-1;n=12;l=j;m=1;while(1){k=$(n,m);o=l-1|0;if((o|0)>0){n=n-1|0;l=o;m=k}else{t=k;break L2644}}}else{c[q>>2]=1;t=1}}while(0);c[g+68>>2]=t;t=0;while(1){c[g+(t<<2)>>2]=0;j=t+1|0;if((j|0)<(c[h>>2]|0)){t=j}else{break}}c[g+72>>2]=d;d=c[q>>2]|0;ax(5243592,31,1,c[p>>2]|0);as(c[p>>2]|0);q=(d|0)>0;if(q){v=0}else{w=c[p>>2]|0;x=ap(w|0,5244208,(u=i,i=i+4|0,c[u>>2]=d,u)|0)|0;i=f;return}while(1){b[a+(v<<1)>>1]=cd(a,v)&65535;b[a+2970+(v<<1)>>1]=ce(a,v)&65535;b[a+5940+(v<<1)>>1]=cf(a,v)&65535;b[a+8910+(v<<1)>>1]=cg(a,v)&65535;b[a+11880+(v<<1)>>1]=ch(a,v)&65535;b[a+14850+(v<<1)>>1]=ci(a,v)&65535;g=v+1|0;if((g|0)==(d|0)){break}else{v=g}}if(q){y=0}else{w=c[p>>2]|0;x=ap(w|0,5244208,(u=i,i=i+4|0,c[u>>2]=d,u)|0)|0;i=f;return}while(1){b[a+6930+(y<<1)>>1]=b[a+5940+((e[a+5940+(y<<1)>>1]|0)<<1)>>1]|0;b[a+990+(y<<1)>>1]=b[a+((e[a+(y<<1)>>1]|0)<<1)>>1]|0;b[a+12870+(y<<1)>>1]=b[a+11880+((e[a+11880+(y<<1)>>1]|0)<<1)>>1]|0;b[a+15840+(y<<1)>>1]=b[a+14850+((e[a+14850+(y<<1)>>1]|0)<<1)>>1]|0;b[a+9900+(y<<1)>>1]=b[a+8910+((e[a+8910+(y<<1)>>1]|0)<<1)>>1]|0;b[a+3960+(y<<1)>>1]=b[a+2970+((e[a+2970+(y<<1)>>1]|0)<<1)>>1]|0;v=y+1|0;if((v|0)==(d|0)){break}else{y=v}}if(q){z=0}else{w=c[p>>2]|0;x=ap(w|0,5244208,(u=i,i=i+4|0,c[u>>2]=d,u)|0)|0;i=f;return}while(1){b[a+7920+(z<<1)>>1]=b[a+6930+((e[a+5940+(z<<1)>>1]|0)<<1)>>1]|0;b[a+1980+(z<<1)>>1]=b[a+990+((e[a+(z<<1)>>1]|0)<<1)>>1]|0;b[a+13860+(z<<1)>>1]=b[a+12870+((e[a+11880+(z<<1)>>1]|0)<<1)>>1]|0;b[a+16830+(z<<1)>>1]=b[a+15840+((e[a+14850+(z<<1)>>1]|0)<<1)>>1]|0;b[a+10890+(z<<1)>>1]=b[a+9900+((e[a+8910+(z<<1)>>1]|0)<<1)>>1]|0;b[a+4950+(z<<1)>>1]=b[a+3960+((e[a+2970+(z<<1)>>1]|0)<<1)>>1]|0;y=z+1|0;if((y|0)==(d|0)){break}else{z=y}}if(q){A=0}else{w=c[p>>2]|0;x=ap(w|0,5244208,(u=i,i=i+4|0,c[u>>2]=d,u)|0)|0;i=f;return}while(1){b[a+23760+(A<<1)>>1]=b[a+16830+((e[a+5940+(A<<1)>>1]|0)<<1)>>1]|0;b[a+17820+(A<<1)>>1]=b[a+10890+((e[a+(A<<1)>>1]|0)<<1)>>1]|0;b[a+20790+(A<<1)>>1]=b[a+4950+((e[a+11880+(A<<1)>>1]|0)<<1)>>1]|0;b[a+24750+(A<<1)>>1]=b[a+15840+((e[a+6930+(A<<1)>>1]|0)<<1)>>1]|0;b[a+18810+(A<<1)>>1]=b[a+9900+((e[a+990+(A<<1)>>1]|0)<<1)>>1]|0;b[a+21780+(A<<1)>>1]=b[a+3960+((e[a+12870+(A<<1)>>1]|0)<<1)>>1]|0;b[a+25740+(A<<1)>>1]=b[a+7920+((e[a+14850+(A<<1)>>1]|0)<<1)>>1]|0;b[a+19800+(A<<1)>>1]=b[a+1980+((e[a+8910+(A<<1)>>1]|0)<<1)>>1]|0;b[a+22770+(A<<1)>>1]=b[a+13860+((e[a+2970+(A<<1)>>1]|0)<<1)>>1]|0;q=A+1|0;if((q|0)==(d|0)){break}else{A=q}}w=c[p>>2]|0;x=ap(w|0,5244208,(u=i,i=i+4|0,c[u>>2]=d,u)|0)|0;i=f;return}function cd(a,b){a=a|0;b=b|0;var d=0,e=0,f=0,g=0,h=0,j=0,k=0,l=0,m=0,n=0,o=0,p=0,q=0,r=0,s=0,t=0,u=0,v=0,w=0,x=0,y=0,z=0,A=0,B=0,C=0,D=0,E=0,F=0,G=0,H=0;d=i;i=i+76|0;e=d|0;f=c[a+26732>>2]|0;a=f^-1;g=(((a>>>8&1)+(a>>>9&1)|0)+(a>>>10&1)|0)+(a>>>11&1)|0;a=e+48|0;c[a>>2]=12;h=e+52|0;c[h>>2]=g;c[e+56>>2]=479001600;j=e+60|0;L2676:do{if((g|0)>1){k=g;l=1;while(1){m=$(k,l);n=k-1|0;if((n|0)>1){k=n;l=m}else{o=m;break L2676}}}else{o=1}}while(0);c[j>>2]=o;o=e+64|0;L2680:do{if((g|0)>0){j=12;l=g;k=1;m=1;while(1){p=$(j,k);q=$(l,m);n=l-1|0;if((n|0)>0){j=j-1|0;l=n;k=p;m=q}else{break}}c[o>>2]=(p|0)/(q|0)&-1;m=12;k=g;l=1;while(1){j=$(m,l);n=k-1|0;if((n|0)>0){m=m-1|0;k=n;l=j}else{r=j;break L2680}}}else{c[o>>2]=1;r=1}}while(0);c[e+68>>2]=r;r=0;while(1){c[e+(r<<2)>>2]=0;o=r+1|0;s=c[a>>2]|0;if((o|0)<(s|0)){r=o}else{break}}c[e+72>>2]=f;L2691:do{if((s|0)>0){f=0;r=c[h>>2]|0;o=b;g=s;while(1){L2695:do{if((r|0)>0){q=g-f|0;p=r;l=1;k=1;while(1){m=q-1|0;j=$(m,l);n=$(p,k);t=p-1|0;if((t|0)>0){q=m;p=t;l=j;k=n}else{u=j;v=n;break L2695}}}else{u=1;v=1}}while(0);k=(u|0)/(v|0)&-1;if((k|0)>(o|0)){c[e+(f<<2)>>2]=0;w=o;x=r}else{c[e+(f<<2)>>2]=1;w=o-k|0;x=r-1|0}k=f+1|0;l=c[a>>2]|0;if((k|0)<(l|0)){f=k;r=x;o=w;g=l}else{y=l;break L2691}}}else{y=s}}while(0);s=e+36|0;w=c[s>>2]|0;x=e+16|0;c[s>>2]=c[x>>2]|0;s=e+32|0;c[x>>2]=c[s>>2]|0;x=e|0;c[s>>2]=c[x>>2]|0;c[x>>2]=w;x=c[h>>2]|0;if((y-x|0)>0){z=0;A=x;B=0;C=w}else{D=0;i=d;return D|0}while(1){if((C|0)==0){E=B;F=A}else{w=A-1|0;L2711:do{if((A|0)>0){x=y-z|0;h=A;s=1;a=1;while(1){v=x-1|0;u=$(v,s);b=$(h,a);g=h-1|0;if((g|0)>0){x=v;h=g;s=u;a=b}else{G=u;H=b;break L2711}}}else{G=1;H=1}}while(0);E=((G|0)/(H|0)&-1)+B|0;F=w}a=z+1|0;if((a|0)>=(y-F|0)){D=E;break}z=a;A=F;B=E;C=c[e+(a<<2)>>2]|0}i=d;return D|0}function ce(a,b){a=a|0;b=b|0;var d=0,e=0,f=0,g=0,h=0,j=0,k=0,l=0,m=0,n=0,o=0,p=0,q=0,r=0,s=0,t=0,u=0,v=0,w=0,x=0,y=0,z=0,A=0,B=0,C=0,D=0,E=0,F=0,G=0;d=i;i=i+76|0;e=d|0;f=c[a+26732>>2]|0;a=f^-1;g=(((a>>>8&1)+(a>>>9&1)|0)+(a>>>10&1)|0)+(a>>>11&1)|0;a=e+48|0;c[a>>2]=12;h=e+52|0;c[h>>2]=g;c[e+56>>2]=479001600;j=e+60|0;L2720:do{if((g|0)>1){k=g;l=1;while(1){m=$(k,l);n=k-1|0;if((n|0)>1){k=n;l=m}else{o=m;break L2720}}}else{o=1}}while(0);c[j>>2]=o;o=e+64|0;L2724:do{if((g|0)>0){j=12;l=g;k=1;m=1;while(1){p=$(j,k);q=$(l,m);n=l-1|0;if((n|0)>0){j=j-1|0;l=n;k=p;m=q}else{break}}c[o>>2]=(p|0)/(q|0)&-1;m=12;k=g;l=1;while(1){j=$(m,l);n=k-1|0;if((n|0)>0){m=m-1|0;k=n;l=j}else{r=j;break L2724}}}else{c[o>>2]=1;r=1}}while(0);c[e+68>>2]=r;r=0;while(1){c[e+(r<<2)>>2]=0;o=r+1|0;s=c[a>>2]|0;if((o|0)<(s|0)){r=o}else{break}}c[e+72>>2]=f;L2735:do{if((s|0)>0){f=0;r=c[h>>2]|0;o=b;g=s;while(1){L2739:do{if((r|0)>0){q=g-f|0;p=r;l=1;k=1;while(1){m=q-1|0;j=$(m,l);n=$(p,k);t=p-1|0;if((t|0)>0){q=m;p=t;l=j;k=n}else{u=j;v=n;break L2739}}}else{u=1;v=1}}while(0);k=(u|0)/(v|0)&-1;if((k|0)>(o|0)){c[e+(f<<2)>>2]=0;w=o;x=r}else{c[e+(f<<2)>>2]=1;w=o-k|0;x=r-1|0}k=f+1|0;l=c[a>>2]|0;if((k|0)<(l|0)){f=k;r=x;o=w;g=l}else{y=l;break L2735}}}else{y=s}}while(0);s=e+44|0;w=c[s>>2]|0;x=e+28|0;c[s>>2]=c[x>>2]|0;s=e+36|0;c[x>>2]=c[s>>2]|0;x=e+12|0;c[s>>2]=c[x>>2]|0;c[x>>2]=w;w=c[h>>2]|0;if((y-w|0)>0){z=0;A=w;B=0}else{C=0;i=d;return C|0}while(1){if((c[e+(z<<2)>>2]|0)==0){D=B;E=A}else{w=A-1|0;L2755:do{if((A|0)>0){h=y-z|0;x=A;s=1;a=1;while(1){v=h-1|0;u=$(v,s);b=$(x,a);g=x-1|0;if((g|0)>0){h=v;x=g;s=u;a=b}else{F=u;G=b;break L2755}}}else{F=1;G=1}}while(0);D=((F|0)/(G|0)&-1)+B|0;E=w}a=z+1|0;if((a|0)<(y-E|0)){z=a;A=E;B=D}else{C=D;break}}i=d;return C|0}function cf(a,b){a=a|0;b=b|0;var d=0,e=0,f=0,g=0,h=0,j=0,k=0,l=0,m=0,n=0,o=0,p=0,q=0,r=0,s=0,t=0,u=0,v=0,w=0,x=0,y=0,z=0,A=0,B=0,C=0,D=0,E=0,F=0,G=0,H=0;d=i;i=i+76|0;e=d|0;f=c[a+26732>>2]|0;a=f^-1;g=(((a>>>8&1)+(a>>>9&1)|0)+(a>>>10&1)|0)+(a>>>11&1)|0;a=e+48|0;c[a>>2]=12;h=e+52|0;c[h>>2]=g;c[e+56>>2]=479001600;j=e+60|0;L2763:do{if((g|0)>1){k=g;l=1;while(1){m=$(k,l);n=k-1|0;if((n|0)>1){k=n;l=m}else{o=m;break L2763}}}else{o=1}}while(0);c[j>>2]=o;o=e+64|0;L2767:do{if((g|0)>0){j=12;l=g;k=1;m=1;while(1){p=$(j,k);q=$(l,m);n=l-1|0;if((n|0)>0){j=j-1|0;l=n;k=p;m=q}else{break}}c[o>>2]=(p|0)/(q|0)&-1;m=12;k=g;l=1;while(1){j=$(m,l);n=k-1|0;if((n|0)>0){m=m-1|0;k=n;l=j}else{r=j;break L2767}}}else{c[o>>2]=1;r=1}}while(0);c[e+68>>2]=r;r=0;while(1){c[e+(r<<2)>>2]=0;o=r+1|0;s=c[a>>2]|0;if((o|0)<(s|0)){r=o}else{break}}c[e+72>>2]=f;L2778:do{if((s|0)>0){f=0;r=c[h>>2]|0;o=b;g=s;while(1){L2782:do{if((r|0)>0){q=g-f|0;p=r;l=1;k=1;while(1){m=q-1|0;j=$(m,l);n=$(p,k);t=p-1|0;if((t|0)>0){q=m;p=t;l=j;k=n}else{u=j;v=n;break L2782}}}else{u=1;v=1}}while(0);k=(u|0)/(v|0)&-1;if((k|0)>(o|0)){c[e+(f<<2)>>2]=0;w=o;x=r}else{c[e+(f<<2)>>2]=1;w=o-k|0;x=r-1|0}k=f+1|0;l=c[a>>2]|0;if((k|0)<(l|0)){f=k;r=x;o=w;g=l}else{y=l;break L2778}}}else{y=s}}while(0);s=e|0;w=c[s>>2]|0;x=e+4|0;a=c[x>>2]|0;c[s>>2]=a;s=e+8|0;c[x>>2]=c[s>>2]|0;x=e+12|0;c[s>>2]=c[x>>2]|0;c[x>>2]=w;w=c[h>>2]|0;if((y-w|0)>0){z=0;A=w;B=0;C=a}else{D=0;i=d;return D|0}while(1){if((C|0)==0){E=B;F=A}else{a=A-1|0;L2798:do{if((A|0)>0){w=y-z|0;h=A;x=1;s=1;while(1){v=w-1|0;u=$(v,x);b=$(h,s);g=h-1|0;if((g|0)>0){w=v;h=g;x=u;s=b}else{G=u;H=b;break L2798}}}else{G=1;H=1}}while(0);E=((G|0)/(H|0)&-1)+B|0;F=a}s=z+1|0;if((s|0)>=(y-F|0)){D=E;break}z=s;A=F;B=E;C=c[e+(s<<2)>>2]|0}i=d;return D|0}function cg(a,b){a=a|0;b=b|0;var d=0,e=0,f=0,g=0,h=0,j=0,k=0,l=0,m=0,n=0,o=0,p=0,q=0,r=0,s=0,t=0,u=0,v=0,w=0,x=0,y=0,z=0,A=0,B=0,C=0,D=0,E=0,F=0,G=0;d=i;i=i+76|0;e=d|0;f=c[a+26732>>2]|0;a=f^-1;g=(((a>>>8&1)+(a>>>9&1)|0)+(a>>>10&1)|0)+(a>>>11&1)|0;a=e+48|0;c[a>>2]=12;h=e+52|0;c[h>>2]=g;c[e+56>>2]=479001600;j=e+60|0;L2807:do{if((g|0)>1){k=g;l=1;while(1){m=$(k,l);n=k-1|0;if((n|0)>1){k=n;l=m}else{o=m;break L2807}}}else{o=1}}while(0);c[j>>2]=o;o=e+64|0;L2811:do{if((g|0)>0){j=12;l=g;k=1;m=1;while(1){p=$(j,k);q=$(l,m);n=l-1|0;if((n|0)>0){j=j-1|0;l=n;k=p;m=q}else{break}}c[o>>2]=(p|0)/(q|0)&-1;m=12;k=g;l=1;while(1){j=$(m,l);n=k-1|0;if((n|0)>0){m=m-1|0;k=n;l=j}else{r=j;break L2811}}}else{c[o>>2]=1;r=1}}while(0);c[e+68>>2]=r;r=0;while(1){c[e+(r<<2)>>2]=0;o=r+1|0;s=c[a>>2]|0;if((o|0)<(s|0)){r=o}else{break}}c[e+72>>2]=f;L2822:do{if((s|0)>0){f=0;r=c[h>>2]|0;o=b;g=s;while(1){L2826:do{if((r|0)>0){q=g-f|0;p=r;l=1;k=1;while(1){m=q-1|0;j=$(m,l);n=$(p,k);t=p-1|0;if((t|0)>0){q=m;p=t;l=j;k=n}else{u=j;v=n;break L2826}}}else{u=1;v=1}}while(0);k=(u|0)/(v|0)&-1;if((k|0)>(o|0)){c[e+(f<<2)>>2]=0;w=o;x=r}else{c[e+(f<<2)>>2]=1;w=o-k|0;x=r-1|0}k=f+1|0;l=c[a>>2]|0;if((k|0)<(l|0)){f=k;r=x;o=w;g=l}else{y=l;break L2822}}}else{y=s}}while(0);s=e+40|0;w=c[s>>2]|0;x=e+24|0;c[s>>2]=c[x>>2]|0;s=e+44|0;c[x>>2]=c[s>>2]|0;x=e+8|0;c[s>>2]=c[x>>2]|0;c[x>>2]=w;w=c[h>>2]|0;if((y-w|0)>0){z=0;A=w;B=0}else{C=0;i=d;return C|0}while(1){if((c[e+(z<<2)>>2]|0)==0){D=B;E=A}else{w=A-1|0;L2842:do{if((A|0)>0){h=y-z|0;x=A;s=1;a=1;while(1){v=h-1|0;u=$(v,s);b=$(x,a);g=x-1|0;if((g|0)>0){h=v;x=g;s=u;a=b}else{F=u;G=b;break L2842}}}else{F=1;G=1}}while(0);D=((F|0)/(G|0)&-1)+B|0;E=w}a=z+1|0;if((a|0)<(y-E|0)){z=a;A=E;B=D}else{C=D;break}}i=d;return C|0}function ch(a,b){a=a|0;b=b|0;var d=0,e=0,f=0,g=0,h=0,j=0,k=0,l=0,m=0,n=0,o=0,p=0,q=0,r=0,s=0,t=0,u=0,v=0,w=0,x=0,y=0,z=0,A=0,B=0,C=0,D=0,E=0,F=0,G=0;d=i;i=i+76|0;e=d|0;f=c[a+26732>>2]|0;a=f^-1;g=(((a>>>8&1)+(a>>>9&1)|0)+(a>>>10&1)|0)+(a>>>11&1)|0;a=e+48|0;c[a>>2]=12;h=e+52|0;c[h>>2]=g;c[e+56>>2]=479001600;j=e+60|0;L2850:do{if((g|0)>1){k=g;l=1;while(1){m=$(k,l);n=k-1|0;if((n|0)>1){k=n;l=m}else{o=m;break L2850}}}else{o=1}}while(0);c[j>>2]=o;o=e+64|0;L2854:do{if((g|0)>0){j=12;l=g;k=1;m=1;while(1){p=$(j,k);q=$(l,m);n=l-1|0;if((n|0)>0){j=j-1|0;l=n;k=p;m=q}else{break}}c[o>>2]=(p|0)/(q|0)&-1;m=12;k=g;l=1;while(1){j=$(m,l);n=k-1|0;if((n|0)>0){m=m-1|0;k=n;l=j}else{r=j;break L2854}}}else{c[o>>2]=1;r=1}}while(0);c[e+68>>2]=r;r=0;while(1){c[e+(r<<2)>>2]=0;o=r+1|0;s=c[a>>2]|0;if((o|0)<(s|0)){r=o}else{break}}c[e+72>>2]=f;L2865:do{if((s|0)>0){f=0;r=c[h>>2]|0;o=b;g=s;while(1){L2869:do{if((r|0)>0){q=g-f|0;p=r;l=1;k=1;while(1){m=q-1|0;j=$(m,l);n=$(p,k);t=p-1|0;if((t|0)>0){q=m;p=t;l=j;k=n}else{u=j;v=n;break L2869}}}else{u=1;v=1}}while(0);k=(u|0)/(v|0)&-1;if((k|0)>(o|0)){c[e+(f<<2)>>2]=0;w=o;x=r}else{c[e+(f<<2)>>2]=1;w=o-k|0;x=r-1|0}k=f+1|0;l=c[a>>2]|0;if((k|0)<(l|0)){f=k;r=x;o=w;g=l}else{y=l;break L2865}}}else{y=s}}while(0);s=e+32|0;w=c[s>>2]|0;x=e+20|0;c[s>>2]=c[x>>2]|0;s=e+40|0;c[x>>2]=c[s>>2]|0;x=e+4|0;c[s>>2]=c[x>>2]|0;c[x>>2]=w;w=c[h>>2]|0;if((y-w|0)>0){z=0;A=w;B=0}else{C=0;i=d;return C|0}while(1){if((c[e+(z<<2)>>2]|0)==0){D=B;E=A}else{w=A-1|0;L2885:do{if((A|0)>0){h=y-z|0;x=A;s=1;a=1;while(1){v=h-1|0;u=$(v,s);b=$(x,a);g=x-1|0;if((g|0)>0){h=v;x=g;s=u;a=b}else{F=u;G=b;break L2885}}}else{F=1;G=1}}while(0);D=((F|0)/(G|0)&-1)+B|0;E=w}a=z+1|0;if((a|0)<(y-E|0)){z=a;A=E;B=D}else{C=D;break}}i=d;return C|0}function ci(a,b){a=a|0;b=b|0;var d=0,e=0,f=0,g=0,h=0,j=0,k=0,l=0,m=0,n=0,o=0,p=0,q=0,r=0,s=0,t=0,u=0,v=0,w=0,x=0,y=0,z=0,A=0,B=0,C=0,D=0,E=0,F=0,G=0;d=i;i=i+76|0;e=d|0;f=c[a+26732>>2]|0;a=f^-1;g=(((a>>>8&1)+(a>>>9&1)|0)+(a>>>10&1)|0)+(a>>>11&1)|0;a=e+48|0;c[a>>2]=12;h=e+52|0;c[h>>2]=g;c[e+56>>2]=479001600;j=e+60|0;L2893:do{if((g|0)>1){k=g;l=1;while(1){m=$(k,l);n=k-1|0;if((n|0)>1){k=n;l=m}else{o=m;break L2893}}}else{o=1}}while(0);c[j>>2]=o;o=e+64|0;L2897:do{if((g|0)>0){j=12;l=g;k=1;m=1;while(1){p=$(j,k);q=$(l,m);n=l-1|0;if((n|0)>0){j=j-1|0;l=n;k=p;m=q}else{break}}c[o>>2]=(p|0)/(q|0)&-1;m=12;k=g;l=1;while(1){j=$(m,l);n=k-1|0;if((n|0)>0){m=m-1|0;k=n;l=j}else{r=j;break L2897}}}else{c[o>>2]=1;r=1}}while(0);c[e+68>>2]=r;r=0;while(1){c[e+(r<<2)>>2]=0;o=r+1|0;s=c[a>>2]|0;if((o|0)<(s|0)){r=o}else{break}}c[e+72>>2]=f;L2908:do{if((s|0)>0){f=0;r=c[h>>2]|0;o=b;g=s;while(1){L2912:do{if((r|0)>0){q=g-f|0;p=r;l=1;k=1;while(1){m=q-1|0;j=$(m,l);n=$(p,k);t=p-1|0;if((t|0)>0){q=m;p=t;l=j;k=n}else{u=j;v=n;break L2912}}}else{u=1;v=1}}while(0);k=(u|0)/(v|0)&-1;if((k|0)>(o|0)){c[e+(f<<2)>>2]=0;w=o;x=r}else{c[e+(f<<2)>>2]=1;w=o-k|0;x=r-1|0}k=f+1|0;l=c[a>>2]|0;if((k|0)<(l|0)){f=k;r=x;o=w;g=l}else{y=l;break L2908}}}else{y=s}}while(0);s=e+16|0;w=c[s>>2]|0;x=e+28|0;c[s>>2]=c[x>>2]|0;s=e+24|0;c[x>>2]=c[s>>2]|0;x=e+20|0;c[s>>2]=c[x>>2]|0;c[x>>2]=w;w=c[h>>2]|0;if((y-w|0)>0){z=0;A=w;B=0}else{C=0;i=d;return C|0}while(1){if((c[e+(z<<2)>>2]|0)==0){D=B;E=A}else{w=A-1|0;L2928:do{if((A|0)>0){h=y-z|0;x=A;s=1;a=1;while(1){v=h-1|0;u=$(v,s);b=$(x,a);g=x-1|0;if((g|0)>0){h=v;x=g;s=u;a=b}else{F=u;G=b;break L2928}}}else{F=1;G=1}}while(0);D=((F|0)/(G|0)&-1)+B|0;E=w}a=z+1|0;if((a|0)<(y-E|0)){z=a;A=E;B=D}else{C=D;break}}i=d;return C|0}function cj(d,f){d=d|0;f=f|0;var g=0,h=0,j=0,k=0,l=0,m=0,n=0,o=0,q=0,r=0,s=0,t=0,v=0,w=0,x=0,y=0,z=0,A=0,B=0,C=0,D=0,E=0,F=0,G=0,H=0,I=0,J=0,K=0,L=0,M=0,N=0,O=0,P=0,Q=0,R=0,S=0,T=0,U=0,V=0,W=0,X=0,Y=0,Z=0,_=0,$=0,aa=0;g=i;i=i+532|0;h=g|0;j=g+76|0;k=g+152|0;l=g+228|0;m=g+304|0;n=g+380|0;o=g+456|0;q=d+2177308|0;c[q>>2]=f;bp(o,f);f=c[o+68>>2]|0;a[d+2177282|0]=6;a[d+2177283|0]=7;a[d+2177284|0]=8;a[d+2177287|0]=15;a[d+2177288|0]=16;a[d+2177289|0]=17;a[d+2177280|0]=1;a[d+2177286|0]=13;a[d+2177285|0]=10;a[d+2177281|0]=4;a[d+2177292|0]=24;a[d+2177293|0]=25;a[d+2177294|0]=26;a[d+2177290|0]=19;a[d+2177291|0]=22;ax(5243460,29,1,c[p>>2]|0);as(c[p>>2]|0);o=(f|0)>0;if(!o){r=c[p>>2]|0;s=ap(r|0,5244208,(u=i,i=i+4|0,c[u>>2]=f,u)|0)|0;i=g;return}t=m|0;v=m+4|0;w=m+8|0;x=m+12|0;y=m|0;z=l|0;A=l+20|0;B=l+16|0;C=l|0;D=l+12|0;E=k|0;F=k+16|0;G=k+28|0;H=k+4|0;I=k|0;J=j|0;K=j+20|0;L=j+24|0;M=j+28|0;N=j+16|0;O=h|0;P=h+28|0;Q=h+24|0;R=h+8|0;S=h+4|0;T=n|0;U=n+24|0;V=n+20|0;W=n+12|0;X=n+8|0;Y=0;while(1){bp(m,c[q>>2]|0);bf(t,Y);Z=c[v>>2]|0;c[v>>2]=c[w>>2]|0;c[w>>2]=c[x>>2]|0;c[x>>2]=c[y>>2]|0;c[y>>2]=Z;b[d+483840+(Y<<1)>>1]=be(t)&65535;bp(l,c[q>>2]|0);bf(z,Y);Z=c[A>>2]|0;c[A>>2]=c[B>>2]|0;c[B>>2]=c[C>>2]|0;c[C>>2]=c[D>>2]|0;c[D>>2]=Z;b[d+(Y<<1)>>1]=be(z)&65535;bp(k,c[q>>2]|0);bf(E,Y);Z=c[F>>2]|0;c[F>>2]=c[G>>2]|0;c[G>>2]=c[H>>2]|0;c[H>>2]=c[I>>2]|0;c[I>>2]=Z;b[d+967680+(Y<<1)>>1]=be(E)&65535;bp(j,c[q>>2]|0);bf(J,Y);Z=c[K>>2]|0;c[K>>2]=c[L>>2]|0;c[L>>2]=c[M>>2]|0;c[M>>2]=c[N>>2]|0;c[N>>2]=Z;b[d+1209600+(Y<<1)>>1]=be(J)&65535;bp(h,c[q>>2]|0);bf(O,Y);Z=c[P>>2]|0;c[P>>2]=c[Q>>2]|0;c[Q>>2]=c[R>>2]|0;c[R>>2]=c[S>>2]|0;c[S>>2]=Z;b[d+725760+(Y<<1)>>1]=be(O)&65535;bp(n,c[q>>2]|0);bf(T,Y);Z=c[U>>2]|0;c[U>>2]=c[V>>2]|0;c[V>>2]=c[W>>2]|0;c[W>>2]=c[X>>2]|0;c[X>>2]=Z;b[d+241920+(Y<<1)>>1]=be(T)&65535;Z=Y+1|0;if((Z|0)==(f|0)){break}else{Y=Z}}if(o){_=0}else{r=c[p>>2]|0;s=ap(r|0,5244208,(u=i,i=i+4|0,c[u>>2]=f,u)|0)|0;i=g;return}while(1){b[d+564480+(_<<1)>>1]=b[d+483840+((e[d+483840+(_<<1)>>1]|0)<<1)>>1]|0;b[d+80640+(_<<1)>>1]=b[d+((e[d+(_<<1)>>1]|0)<<1)>>1]|0;b[d+1048320+(_<<1)>>1]=b[d+967680+((e[d+967680+(_<<1)>>1]|0)<<1)>>1]|0;b[d+1290240+(_<<1)>>1]=b[d+1209600+((e[d+1209600+(_<<1)>>1]|0)<<1)>>1]|0;b[d+806400+(_<<1)>>1]=b[d+725760+((e[d+725760+(_<<1)>>1]|0)<<1)>>1]|0;b[d+322560+(_<<1)>>1]=b[d+241920+((e[d+241920+(_<<1)>>1]|0)<<1)>>1]|0;Y=_+1|0;if((Y|0)==(f|0)){break}else{_=Y}}if(o){$=0}else{r=c[p>>2]|0;s=ap(r|0,5244208,(u=i,i=i+4|0,c[u>>2]=f,u)|0)|0;i=g;return}while(1){b[d+645120+($<<1)>>1]=b[d+564480+((e[d+483840+($<<1)>>1]|0)<<1)>>1]|0;b[d+161280+($<<1)>>1]=b[d+80640+((e[d+($<<1)>>1]|0)<<1)>>1]|0;b[d+1128960+($<<1)>>1]=b[d+1048320+((e[d+967680+($<<1)>>1]|0)<<1)>>1]|0;b[d+1370880+($<<1)>>1]=b[d+1290240+((e[d+1209600+($<<1)>>1]|0)<<1)>>1]|0;b[d+887040+($<<1)>>1]=b[d+806400+((e[d+725760+($<<1)>>1]|0)<<1)>>1]|0;b[d+403200+($<<1)>>1]=b[d+322560+((e[d+241920+($<<1)>>1]|0)<<1)>>1]|0;_=$+1|0;if((_|0)==(f|0)){break}else{$=_}}if(o){aa=0}else{r=c[p>>2]|0;s=ap(r|0,5244208,(u=i,i=i+4|0,c[u>>2]=f,u)|0)|0;i=g;return}while(1){b[d+1935360+(aa<<1)>>1]=b[d+1370880+((e[d+483840+(aa<<1)>>1]|0)<<1)>>1]|0;b[d+1451520+(aa<<1)>>1]=b[d+887040+((e[d+(aa<<1)>>1]|0)<<1)>>1]|0;b[d+1693440+(aa<<1)>>1]=b[d+403200+((e[d+967680+(aa<<1)>>1]|0)<<1)>>1]|0;b[d+2016e3+(aa<<1)>>1]=b[d+1290240+((e[d+564480+(aa<<1)>>1]|0)<<1)>>1]|0;b[d+1532160+(aa<<1)>>1]=b[d+806400+((e[d+80640+(aa<<1)>>1]|0)<<1)>>1]|0;b[d+1774080+(aa<<1)>>1]=b[d+322560+((e[d+1048320+(aa<<1)>>1]|0)<<1)>>1]|0;b[d+2096640+(aa<<1)>>1]=b[d+645120+((e[d+1209600+(aa<<1)>>1]|0)<<1)>>1]|0;b[d+1612800+(aa<<1)>>1]=b[d+161280+((e[d+725760+(aa<<1)>>1]|0)<<1)>>1]|0;b[d+1854720+(aa<<1)>>1]=b[d+1128960+((e[d+241920+(aa<<1)>>1]|0)<<1)>>1]|0;o=aa+1|0;if((o|0)==(f|0)){break}else{aa=o}}r=c[p>>2]|0;s=ap(r|0,5244208,(u=i,i=i+4|0,c[u>>2]=f,u)|0)|0;i=g;return}function ck(a,d){a=a|0;d=d|0;var f=0,g=0,h=0,j=0,k=0,l=0,m=0,n=0,o=0,q=0,r=0,s=0,t=0,v=0,w=0,x=0,y=0,z=0,A=0,B=0,C=0,D=0,E=0,F=0,G=0,H=0,I=0,J=0,K=0,L=0,M=0,N=0,O=0,P=0,Q=0,R=0,S=0,T=0;f=i;i=i+532|0;g=f|0;h=f+76|0;j=f+152|0;k=f+228|0;l=f+304|0;m=f+380|0;n=f+456|0;o=a+1209600|0;c[o>>2]=d;bD(n,d);d=c[n+68>>2]|0;ax(5243280,39,1,c[p>>2]|0);as(c[p>>2]|0);n=(d|0)>0;if(!n){q=c[p>>2]|0;r=ap(q|0,5244208,(u=i,i=i+4|0,c[u>>2]=d,u)|0)|0;i=f;return}s=l|0;t=l+4|0;v=l+8|0;w=l+12|0;x=l|0;y=k|0;z=k|0;A=k+16|0;B=j|0;C=j+4|0;D=j+20|0;E=h|0;F=h+28|0;G=h+24|0;H=h+20|0;I=h+16|0;J=g|0;K=g+8|0;L=g+24|0;M=m|0;N=m+12|0;O=m+28|0;P=0;while(1){bD(l,c[o>>2]|0);bf(s,P);Q=c[t>>2]|0;c[t>>2]=c[v>>2]|0;c[v>>2]=c[w>>2]|0;c[w>>2]=c[x>>2]|0;c[x>>2]=Q;b[a+161280+(P<<1)>>1]=be(s)&65535;bD(k,c[o>>2]|0);bf(y,P);Q=c[z>>2]|0;c[z>>2]=c[A>>2]|0;c[A>>2]=Q;b[a+(P<<1)>>1]=be(y)&65535;bD(j,c[o>>2]|0);bf(B,P);Q=c[C>>2]|0;c[C>>2]=c[D>>2]|0;c[D>>2]=Q;b[a+483840+(P<<1)>>1]=be(B)&65535;bD(h,c[o>>2]|0);bf(E,P);Q=c[F>>2]|0;c[F>>2]=c[G>>2]|0;c[G>>2]=c[H>>2]|0;c[H>>2]=c[I>>2]|0;c[I>>2]=Q;b[a+564480+(P<<1)>>1]=be(E)&65535;bD(g,c[o>>2]|0);bf(J,P);Q=c[K>>2]|0;c[K>>2]=c[L>>2]|0;c[L>>2]=Q;b[a+403200+(P<<1)>>1]=be(J)&65535;bD(m,c[o>>2]|0);bf(M,P);Q=c[N>>2]|0;c[N>>2]=c[O>>2]|0;c[O>>2]=Q;b[a+80640+(P<<1)>>1]=be(M)&65535;Q=P+1|0;if((Q|0)==(d|0)){break}else{P=Q}}if(n){R=0}else{q=c[p>>2]|0;r=ap(q|0,5244208,(u=i,i=i+4|0,c[u>>2]=d,u)|0)|0;i=f;return}while(1){b[a+241920+(R<<1)>>1]=b[a+161280+((e[a+161280+(R<<1)>>1]|0)<<1)>>1]|0;b[a+645120+(R<<1)>>1]=b[a+564480+((e[a+564480+(R<<1)>>1]|0)<<1)>>1]|0;P=R+1|0;if((P|0)==(d|0)){break}else{R=P}}if(n){S=0}else{q=c[p>>2]|0;r=ap(q|0,5244208,(u=i,i=i+4|0,c[u>>2]=d,u)|0)|0;i=f;return}while(1){b[a+322560+(S<<1)>>1]=b[a+241920+((e[a+161280+(S<<1)>>1]|0)<<1)>>1]|0;b[a+725760+(S<<1)>>1]=b[a+645120+((e[a+564480+(S<<1)>>1]|0)<<1)>>1]|0;R=S+1|0;if((R|0)==(d|0)){break}else{S=R}}if(n){T=0}else{q=c[p>>2]|0;r=ap(q|0,5244208,(u=i,i=i+4|0,c[u>>2]=d,u)|0)|0;i=f;return}while(1){b[a+967680+(T<<1)>>1]=b[a+725760+((e[a+161280+(T<<1)>>1]|0)<<1)>>1]|0;b[a+1048320+(T<<1)>>1]=b[a+645120+((e[a+241920+(T<<1)>>1]|0)<<1)>>1]|0;b[a+1128960+(T<<1)>>1]=b[a+322560+((e[a+564480+(T<<1)>>1]|0)<<1)>>1]|0;b[a+806400+(T<<1)>>1]=b[a+403200+((e[a+(T<<1)>>1]|0)<<1)>>1]|0;b[a+887040+(T<<1)>>1]=b[a+80640+((e[a+483840+(T<<1)>>1]|0)<<1)>>1]|0;n=T+1|0;if((n|0)==(d|0)){break}else{T=n}}q=c[p>>2]|0;r=ap(q|0,5244208,(u=i,i=i+4|0,c[u>>2]=d,u)|0)|0;i=f;return}function cl(a,d){a=a|0;d=d|0;var f=0,g=0,h=0,j=0,k=0,l=0,m=0,n=0,o=0,q=0,r=0,s=0,t=0,v=0,w=0,x=0,y=0,z=0,A=0;f=i;i=i+76|0;g=f|0;c[a+720>>2]=d;h=d^-1;j=(((h>>>8&1)+(h>>>9&1)|0)+(h>>>10&1)|0)+(h>>>11&1)|0;h=g+48|0;c[h>>2]=4;c[g+52>>2]=j;c[g+56>>2]=24;k=g+60|0;L2980:do{if((j|0)>1){l=j;m=1;while(1){n=$(l,m);o=l-1|0;if((o|0)>1){l=o;m=n}else{q=n;break L2980}}}else{q=1}}while(0);c[k>>2]=q;q=g+64|0;L2984:do{if((j|0)>0){k=4;m=j;l=1;n=1;while(1){r=$(k,l);s=$(m,n);o=m-1|0;if((o|0)>0){k=k-1|0;m=o;l=r;n=s}else{break}}c[q>>2]=(r|0)/(s|0)&-1;n=4;l=j;m=1;while(1){k=$(n,m);o=l-1|0;if((o|0)>0){n=n-1|0;l=o;m=k}else{t=k;break L2984}}}else{c[q>>2]=1;t=1}}while(0);q=g+68|0;c[q>>2]=t;t=0;while(1){c[g+(t<<2)>>2]=0;j=t+1|0;if((j|0)<(c[h>>2]|0)){t=j}else{break}}c[g+72>>2]=d;d=c[q>>2]|0;ax(5243116,34,1,c[p>>2]|0);as(c[p>>2]|0);q=(d|0)>0;if(q){v=0}else{w=c[p>>2]|0;x=ap(w|0,5244208,(u=i,i=i+4|0,c[u>>2]=d,u)|0)|0;i=f;return}while(1){g=v&65535;b[a+96+(v<<1)>>1]=g;b[a+(v<<1)>>1]=cm(a,v)&65535;b[a+288+(v<<1)>>1]=cn(a,v)&65535;b[a+336+(v<<1)>>1]=g;b[a+240+(v<<1)>>1]=co(a,v)&65535;b[a+48+(v<<1)>>1]=cp(a,v)&65535;g=v+1|0;if((g|0)==(d|0)){break}else{v=g}}if(q){y=0}else{w=c[p>>2]|0;x=ap(w|0,5244208,(u=i,i=i+4|0,c[u>>2]=d,u)|0)|0;i=f;return}while(1){b[a+144+(y<<1)>>1]=b[a+96+((e[a+96+(y<<1)>>1]|0)<<1)>>1]|0;b[a+384+(y<<1)>>1]=b[a+336+((e[a+336+(y<<1)>>1]|0)<<1)>>1]|0;v=y+1|0;if((v|0)==(d|0)){break}else{y=v}}if(q){z=0}else{w=c[p>>2]|0;x=ap(w|0,5244208,(u=i,i=i+4|0,c[u>>2]=d,u)|0)|0;i=f;return}while(1){b[a+192+(z<<1)>>1]=b[a+144+((e[a+96+(z<<1)>>1]|0)<<1)>>1]|0;b[a+432+(z<<1)>>1]=b[a+384+((e[a+336+(z<<1)>>1]|0)<<1)>>1]|0;y=z+1|0;if((y|0)==(d|0)){break}else{z=y}}if(q){A=0}else{w=c[p>>2]|0;x=ap(w|0,5244208,(u=i,i=i+4|0,c[u>>2]=d,u)|0)|0;i=f;return}while(1){b[a+576+(A<<1)>>1]=b[a+432+((e[a+96+(A<<1)>>1]|0)<<1)>>1]|0;b[a+624+(A<<1)>>1]=b[a+384+((e[a+144+(A<<1)>>1]|0)<<1)>>1]|0;b[a+672+(A<<1)>>1]=b[a+192+((e[a+336+(A<<1)>>1]|0)<<1)>>1]|0;b[a+480+(A<<1)>>1]=b[a+240+((e[a+(A<<1)>>1]|0)<<1)>>1]|0;b[a+528+(A<<1)>>1]=b[a+48+((e[a+288+(A<<1)>>1]|0)<<1)>>1]|0;q=A+1|0;if((q|0)==(d|0)){break}else{A=q}}w=c[p>>2]|0;x=ap(w|0,5244208,(u=i,i=i+4|0,c[u>>2]=d,u)|0)|0;i=f;return}function cm(a,b){a=a|0;b=b|0;var d=0,e=0,f=0,g=0,h=0,j=0,k=0,l=0,m=0,n=0,o=0,p=0,q=0;d=i;i=i+76|0;e=d|0;f=c[a+720>>2]|0;a=f^-1;g=(((a>>>8&1)+(a>>>9&1)|0)+(a>>>10&1)|0)+(a>>>11&1)|0;a=e+48|0;c[a>>2]=4;c[e+52>>2]=g;c[e+56>>2]=24;h=e+60|0;L3016:do{if((g|0)>1){j=g;k=1;while(1){l=$(j,k);m=j-1|0;if((m|0)>1){j=m;k=l}else{n=l;break L3016}}}else{n=1}}while(0);c[h>>2]=n;n=e+64|0;L3020:do{if((g|0)>0){h=4;k=g;j=1;l=1;while(1){o=$(h,j);p=$(k,l);m=k-1|0;if((m|0)>0){h=h-1|0;k=m;j=o;l=p}else{break}}c[n>>2]=(o|0)/(p|0)&-1;l=4;j=g;k=1;while(1){h=$(l,k);m=j-1|0;if((m|0)>0){l=l-1|0;j=m;k=h}else{q=h;break L3020}}}else{c[n>>2]=1;q=1}}while(0);c[e+68>>2]=q;q=0;while(1){c[e+(q<<2)>>2]=0;n=q+1|0;if((n|0)<(c[a>>2]|0)){q=n}else{break}}c[e+72>>2]=f;f=e|0;bf(f,b);b=e|0;q=c[b>>2]|0;a=e+4|0;c[b>>2]=c[a>>2]|0;c[a>>2]=q;q=be(f)|0;i=d;return q|0}function cn(a,b){a=a|0;b=b|0;var d=0,e=0,f=0,g=0,h=0,j=0,k=0,l=0,m=0,n=0,o=0,p=0,q=0;d=i;i=i+76|0;e=d|0;f=c[a+720>>2]|0;a=f^-1;g=(((a>>>8&1)+(a>>>9&1)|0)+(a>>>10&1)|0)+(a>>>11&1)|0;a=e+48|0;c[a>>2]=4;c[e+52>>2]=g;c[e+56>>2]=24;h=e+60|0;L3032:do{if((g|0)>1){j=g;k=1;while(1){l=$(j,k);m=j-1|0;if((m|0)>1){j=m;k=l}else{n=l;break L3032}}}else{n=1}}while(0);c[h>>2]=n;n=e+64|0;L3036:do{if((g|0)>0){h=4;k=g;j=1;l=1;while(1){o=$(h,j);p=$(k,l);m=k-1|0;if((m|0)>0){h=h-1|0;k=m;j=o;l=p}else{break}}c[n>>2]=(o|0)/(p|0)&-1;l=4;j=g;k=1;while(1){h=$(l,k);m=j-1|0;if((m|0)>0){l=l-1|0;j=m;k=h}else{q=h;break L3036}}}else{c[n>>2]=1;q=1}}while(0);c[e+68>>2]=q;q=0;while(1){c[e+(q<<2)>>2]=0;n=q+1|0;if((n|0)<(c[a>>2]|0)){q=n}else{break}}c[e+72>>2]=f;f=e|0;bf(f,b);b=e|0;q=c[b>>2]|0;a=e+8|0;c[b>>2]=c[a>>2]|0;c[a>>2]=q;q=be(f)|0;i=d;return q|0}function co(a,b){a=a|0;b=b|0;var d=0,e=0,f=0,g=0,h=0,j=0,k=0,l=0,m=0,n=0,o=0,p=0,q=0;d=i;i=i+76|0;e=d|0;f=c[a+720>>2]|0;a=f^-1;g=(((a>>>8&1)+(a>>>9&1)|0)+(a>>>10&1)|0)+(a>>>11&1)|0;a=e+48|0;c[a>>2]=4;c[e+52>>2]=g;c[e+56>>2]=24;h=e+60|0;L3048:do{if((g|0)>1){j=g;k=1;while(1){l=$(j,k);m=j-1|0;if((m|0)>1){j=m;k=l}else{n=l;break L3048}}}else{n=1}}while(0);c[h>>2]=n;n=e+64|0;L3052:do{if((g|0)>0){h=4;k=g;j=1;l=1;while(1){o=$(h,j);p=$(k,l);m=k-1|0;if((m|0)>0){h=h-1|0;k=m;j=o;l=p}else{break}}c[n>>2]=(o|0)/(p|0)&-1;l=4;j=g;k=1;while(1){h=$(l,k);m=j-1|0;if((m|0)>0){l=l-1|0;j=m;k=h}else{q=h;break L3052}}}else{c[n>>2]=1;q=1}}while(0);c[e+68>>2]=q;q=0;while(1){c[e+(q<<2)>>2]=0;n=q+1|0;if((n|0)<(c[a>>2]|0)){q=n}else{break}}c[e+72>>2]=f;f=e|0;bf(f,b);b=e+8|0;q=c[b>>2]|0;a=e+12|0;c[b>>2]=c[a>>2]|0;c[a>>2]=q;q=be(f)|0;i=d;return q|0}function cp(a,b){a=a|0;b=b|0;var d=0,e=0,f=0,g=0,h=0,j=0,k=0,l=0,m=0,n=0,o=0,p=0,q=0;d=i;i=i+76|0;e=d|0;f=c[a+720>>2]|0;a=f^-1;g=(((a>>>8&1)+(a>>>9&1)|0)+(a>>>10&1)|0)+(a>>>11&1)|0;a=e+48|0;c[a>>2]=4;c[e+52>>2]=g;c[e+56>>2]=24;h=e+60|0;L3064:do{if((g|0)>1){j=g;k=1;while(1){l=$(j,k);m=j-1|0;if((m|0)>1){j=m;k=l}else{n=l;break L3064}}}else{n=1}}while(0);c[h>>2]=n;n=e+64|0;L3068:do{if((g|0)>0){h=4;k=g;j=1;l=1;while(1){o=$(h,j);p=$(k,l);m=k-1|0;if((m|0)>0){h=h-1|0;k=m;j=o;l=p}else{break}}c[n>>2]=(o|0)/(p|0)&-1;l=4;j=g;k=1;while(1){h=$(l,k);m=j-1|0;if((m|0)>0){l=l-1|0;j=m;k=h}else{q=h;break L3068}}}else{c[n>>2]=1;q=1}}while(0);c[e+68>>2]=q;q=0;while(1){c[e+(q<<2)>>2]=0;n=q+1|0;if((n|0)<(c[a>>2]|0)){q=n}else{break}}c[e+72>>2]=f;f=e|0;bf(f,b);b=e+4|0;q=c[b>>2]|0;a=e+12|0;c[b>>2]=c[a>>2]|0;c[a>>2]=q;q=be(f)|0;i=d;return q|0}function cq(d,f,g){d=d|0;f=f|0;g=g|0;var h=0,j=0,k=0,l=0,m=0,n=0,o=0,q=0,r=0,s=0,t=0,v=0,w=0,x=0,y=0,z=0,A=0,B=0,C=0,D=0,E=0,F=0,G=0,H=0,I=0,J=0,K=0,L=0,M=0,N=0,O=0,P=0,Q=0,R=0,S=0,T=0,U=0,V=0,W=0,X=0,Y=0,Z=0,_=0,aa=0,ab=0,ac=0,ad=0,ae=0,af=0;h=i;i=i+380|0;j=h|0;k=h+76|0;l=h+152|0;m=h+228|0;n=h+304|0;c[d+7664400>>2]=f;o=f^-1;q=(((o>>>1&1)+(o&1)|0)+(o>>>2&1)|0)+(o>>>3&1)|0;r=j+48|0;c[r>>2]=12;c[j+52>>2]=q;c[j+56>>2]=479001600;s=j+60|0;t=(q|0)>1;L3080:do{if(t){v=q;w=1;while(1){x=$(v,w);y=v-1|0;if((y|0)>1){v=y;w=x}else{z=x;break L3080}}}else{z=1}}while(0);c[s>>2]=z;z=j+64|0;s=(q|0)>0;L3084:do{if(s){w=12;v=q;x=1;y=1;while(1){A=$(w,x);B=$(v,y);C=v-1|0;if((C|0)>0){w=w-1|0;v=C;x=A;y=B}else{break}}c[z>>2]=(A|0)/(B|0)&-1;y=12;x=q;v=1;while(1){w=$(y,v);C=x-1|0;if((C|0)>0){y=y-1|0;x=C;v=w}else{D=w;break L3084}}}else{c[z>>2]=1;D=1}}while(0);z=j+68|0;c[z>>2]=D;D=0;while(1){c[j+(D<<2)>>2]=0;B=D+1|0;if((B|0)<(c[r>>2]|0)){D=B}else{break}}c[j+72>>2]=f;D=c[z>>2]|0;z=(((o>>>4&1)+(o>>>5&1)|0)+(o>>>6&1)|0)+(o>>>7&1)|0;r=k+48|0;c[r>>2]=12;c[k+52>>2]=z;c[k+56>>2]=479001600;B=k+60|0;A=(z|0)>1;L3095:do{if(A){v=z;x=1;while(1){y=$(v,x);w=v-1|0;if((w|0)>1){v=w;x=y}else{E=y;break L3095}}}else{E=1}}while(0);c[B>>2]=E;E=k+64|0;B=(z|0)>0;L3099:do{if(B){x=12;v=z;y=1;w=1;while(1){F=$(x,y);G=$(v,w);C=v-1|0;if((C|0)>0){x=x-1|0;v=C;y=F;w=G}else{break}}c[E>>2]=(F|0)/(G|0)&-1;w=12;y=z;v=1;while(1){x=$(w,v);C=y-1|0;if((C|0)>0){w=w-1|0;y=C;v=x}else{H=x;break L3099}}}else{c[E>>2]=1;H=1}}while(0);E=k+68|0;c[E>>2]=H;H=0;while(1){c[k+(H<<2)>>2]=0;G=H+1|0;if((G|0)<(c[r>>2]|0)){H=G}else{break}}c[k+72>>2]=f;H=c[E>>2]|0;E=(((o>>>8&1)+(o>>>9&1)|0)+(o>>>10&1)|0)+(o>>>11&1)|0;o=l+48|0;c[o>>2]=12;c[l+52>>2]=E;c[l+56>>2]=479001600;r=l+60|0;L3110:do{if((E|0)>1){G=E;F=1;while(1){v=$(G,F);y=G-1|0;if((y|0)>1){G=y;F=v}else{I=v;break L3110}}}else{I=1}}while(0);c[r>>2]=I;I=l+64|0;L3114:do{if((E|0)>0){r=12;F=E;G=1;v=1;while(1){J=$(r,G);K=$(F,v);y=F-1|0;if((y|0)>0){r=r-1|0;F=y;G=J;v=K}else{break}}c[I>>2]=(J|0)/(K|0)&-1;v=12;G=E;F=1;while(1){r=$(v,F);y=G-1|0;if((y|0)>0){v=v-1|0;G=y;F=r}else{L=r;break L3114}}}else{c[I>>2]=1;L=1}}while(0);I=l+68|0;c[I>>2]=L;L=0;while(1){c[l+(L<<2)>>2]=0;E=L+1|0;if((E|0)<(c[o>>2]|0)){L=E}else{break}}c[l+72>>2]=f;L=c[I>>2]|0;ax(5242936,45,1,c[p>>2]|0);as(c[p>>2]|0);I=(D|0)>0;L3125:do{if(I){o=0;while(1){b[d+142560+(o<<1)>>1]=cr(d,o)&65535;b[d+(o<<1)>>1]=cs(d,o)&65535;b[d+285120+(o<<1)>>1]=ct(d,o)&65535;b[d+356400+(o<<1)>>1]=cu(d,o)&65535;b[d+213840+(o<<1)>>1]=cv(d,o)&65535;b[d+71280+(o<<1)>>1]=cw(d,o)&65535;E=o+1|0;if((E|0)==(D|0)){break}else{o=E}}if(I){M=0}else{break}while(1){b[d+166320+(M<<1)>>1]=b[d+142560+((e[d+142560+(M<<1)>>1]|0)<<1)>>1]|0;b[d+23760+(M<<1)>>1]=b[d+((e[d+(M<<1)>>1]|0)<<1)>>1]|0;b[d+308880+(M<<1)>>1]=b[d+285120+((e[d+285120+(M<<1)>>1]|0)<<1)>>1]|0;b[d+380160+(M<<1)>>1]=b[d+356400+((e[d+356400+(M<<1)>>1]|0)<<1)>>1]|0;b[d+237600+(M<<1)>>1]=b[d+213840+((e[d+213840+(M<<1)>>1]|0)<<1)>>1]|0;b[d+95040+(M<<1)>>1]=b[d+71280+((e[d+71280+(M<<1)>>1]|0)<<1)>>1]|0;o=M+1|0;if((o|0)==(D|0)){break}else{M=o}}if(I){N=0}else{break}while(1){b[d+190080+(N<<1)>>1]=b[d+166320+((e[d+142560+(N<<1)>>1]|0)<<1)>>1]|0;b[d+47520+(N<<1)>>1]=b[d+23760+((e[d+(N<<1)>>1]|0)<<1)>>1]|0;b[d+332640+(N<<1)>>1]=b[d+308880+((e[d+285120+(N<<1)>>1]|0)<<1)>>1]|0;b[d+403920+(N<<1)>>1]=b[d+380160+((e[d+356400+(N<<1)>>1]|0)<<1)>>1]|0;b[d+261360+(N<<1)>>1]=b[d+237600+((e[d+213840+(N<<1)>>1]|0)<<1)>>1]|0;b[d+118800+(N<<1)>>1]=b[d+95040+((e[d+71280+(N<<1)>>1]|0)<<1)>>1]|0;o=N+1|0;if((o|0)==(D|0)){break}else{N=o}}if(I){O=0}else{break}while(1){b[d+570240+(O<<1)>>1]=b[d+403920+((e[d+142560+(O<<1)>>1]|0)<<1)>>1]|0;b[d+427680+(O<<1)>>1]=b[d+261360+((e[d+(O<<1)>>1]|0)<<1)>>1]|0;b[d+498960+(O<<1)>>1]=b[d+118800+((e[d+285120+(O<<1)>>1]|0)<<1)>>1]|0;b[d+594e3+(O<<1)>>1]=b[d+380160+((e[d+166320+(O<<1)>>1]|0)<<1)>>1]|0;b[d+451440+(O<<1)>>1]=b[d+237600+((e[d+23760+(O<<1)>>1]|0)<<1)>>1]|0;b[d+522720+(O<<1)>>1]=b[d+95040+((e[d+308880+(O<<1)>>1]|0)<<1)>>1]|0;b[d+617760+(O<<1)>>1]=b[d+190080+((e[d+356400+(O<<1)>>1]|0)<<1)>>1]|0;b[d+475200+(O<<1)>>1]=b[d+47520+((e[d+213840+(O<<1)>>1]|0)<<1)>>1]|0;b[d+546480+(O<<1)>>1]=b[d+332640+((e[d+71280+(O<<1)>>1]|0)<<1)>>1]|0;o=O+1|0;if((o|0)==(D|0)){break L3125}else{O=o}}}}while(0);ap(c[p>>2]|0,5246760,(u=i,i=i+4|0,c[u>>2]=D,u)|0);as(c[p>>2]|0);O=(H|0)>0;L3138:do{if(O){N=0;while(1){b[d+784080+(N<<1)>>1]=cx(d,N)&65535;b[d+641520+(N<<1)>>1]=cy(d,N)&65535;b[d+926640+(N<<1)>>1]=cz(d,N)&65535;b[d+997920+(N<<1)>>1]=cA(d,N)&65535;b[d+855360+(N<<1)>>1]=cB(d,N)&65535;b[d+712800+(N<<1)>>1]=cC(d,N)&65535;M=N+1|0;if((M|0)==(H|0)){break}else{N=M}}if(O){P=0}else{break}while(1){b[d+807840+(P<<1)>>1]=b[d+784080+((e[d+784080+(P<<1)>>1]|0)<<1)>>1]|0;b[d+665280+(P<<1)>>1]=b[d+641520+((e[d+641520+(P<<1)>>1]|0)<<1)>>1]|0;b[d+950400+(P<<1)>>1]=b[d+926640+((e[d+926640+(P<<1)>>1]|0)<<1)>>1]|0;b[d+1021680+(P<<1)>>1]=b[d+997920+((e[d+997920+(P<<1)>>1]|0)<<1)>>1]|0;b[d+879120+(P<<1)>>1]=b[d+855360+((e[d+855360+(P<<1)>>1]|0)<<1)>>1]|0;b[d+736560+(P<<1)>>1]=b[d+712800+((e[d+712800+(P<<1)>>1]|0)<<1)>>1]|0;N=P+1|0;if((N|0)==(H|0)){break}else{P=N}}if(O){Q=0}else{break}while(1){b[d+831600+(Q<<1)>>1]=b[d+807840+((e[d+784080+(Q<<1)>>1]|0)<<1)>>1]|0;b[d+689040+(Q<<1)>>1]=b[d+665280+((e[d+641520+(Q<<1)>>1]|0)<<1)>>1]|0;b[d+974160+(Q<<1)>>1]=b[d+950400+((e[d+926640+(Q<<1)>>1]|0)<<1)>>1]|0;b[d+1045440+(Q<<1)>>1]=b[d+1021680+((e[d+997920+(Q<<1)>>1]|0)<<1)>>1]|0;b[d+902880+(Q<<1)>>1]=b[d+879120+((e[d+855360+(Q<<1)>>1]|0)<<1)>>1]|0;b[d+760320+(Q<<1)>>1]=b[d+736560+((e[d+712800+(Q<<1)>>1]|0)<<1)>>1]|0;N=Q+1|0;if((N|0)==(H|0)){break}else{Q=N}}if(O){R=0}else{break}while(1){b[d+1211760+(R<<1)>>1]=b[d+1045440+((e[d+784080+(R<<1)>>1]|0)<<1)>>1]|0;b[d+1069200+(R<<1)>>1]=b[d+902880+((e[d+641520+(R<<1)>>1]|0)<<1)>>1]|0;b[d+1140480+(R<<1)>>1]=b[d+760320+((e[d+926640+(R<<1)>>1]|0)<<1)>>1]|0;b[d+1235520+(R<<1)>>1]=b[d+1021680+((e[d+807840+(R<<1)>>1]|0)<<1)>>1]|0;b[d+1092960+(R<<1)>>1]=b[d+879120+((e[d+665280+(R<<1)>>1]|0)<<1)>>1]|0;b[d+1164240+(R<<1)>>1]=b[d+736560+((e[d+950400+(R<<1)>>1]|0)<<1)>>1]|0;b[d+1259280+(R<<1)>>1]=b[d+831600+((e[d+997920+(R<<1)>>1]|0)<<1)>>1]|0;b[d+1116720+(R<<1)>>1]=b[d+689040+((e[d+855360+(R<<1)>>1]|0)<<1)>>1]|0;b[d+1188e3+(R<<1)>>1]=b[d+974160+((e[d+712800+(R<<1)>>1]|0)<<1)>>1]|0;N=R+1|0;if((N|0)==(H|0)){break L3138}else{R=N}}}}while(0);ap(c[p>>2]|0,5246516,(u=i,i=i+4|0,c[u>>2]=H,u)|0);as(c[p>>2]|0);R=(L|0)>0;L3151:do{if(R){Q=0;while(1){b[d+1425600+(Q<<1)>>1]=cD(d,Q)&65535;b[d+1283040+(Q<<1)>>1]=cE(d,Q)&65535;b[d+1568160+(Q<<1)>>1]=cF(d,Q)&65535;b[d+1639440+(Q<<1)>>1]=cG(d,Q)&65535;b[d+1496880+(Q<<1)>>1]=cH(d,Q)&65535;b[d+1354320+(Q<<1)>>1]=cI(d,Q)&65535;P=Q+1|0;if((P|0)==(L|0)){break}else{Q=P}}if(R){S=0}else{break}while(1){b[d+1449360+(S<<1)>>1]=b[d+1425600+((e[d+1425600+(S<<1)>>1]|0)<<1)>>1]|0;b[d+1306800+(S<<1)>>1]=b[d+1283040+((e[d+1283040+(S<<1)>>1]|0)<<1)>>1]|0;b[d+1591920+(S<<1)>>1]=b[d+1568160+((e[d+1568160+(S<<1)>>1]|0)<<1)>>1]|0;b[d+1663200+(S<<1)>>1]=b[d+1639440+((e[d+1639440+(S<<1)>>1]|0)<<1)>>1]|0;b[d+1520640+(S<<1)>>1]=b[d+1496880+((e[d+1496880+(S<<1)>>1]|0)<<1)>>1]|0;b[d+1378080+(S<<1)>>1]=b[d+1354320+((e[d+1354320+(S<<1)>>1]|0)<<1)>>1]|0;Q=S+1|0;if((Q|0)==(L|0)){break}else{S=Q}}if(R){T=0}else{break}while(1){b[d+1473120+(T<<1)>>1]=b[d+1449360+((e[d+1425600+(T<<1)>>1]|0)<<1)>>1]|0;b[d+1330560+(T<<1)>>1]=b[d+1306800+((e[d+1283040+(T<<1)>>1]|0)<<1)>>1]|0;b[d+1615680+(T<<1)>>1]=b[d+1591920+((e[d+1568160+(T<<1)>>1]|0)<<1)>>1]|0;b[d+1686960+(T<<1)>>1]=b[d+1663200+((e[d+1639440+(T<<1)>>1]|0)<<1)>>1]|0;b[d+1544400+(T<<1)>>1]=b[d+1520640+((e[d+1496880+(T<<1)>>1]|0)<<1)>>1]|0;b[d+1401840+(T<<1)>>1]=b[d+1378080+((e[d+1354320+(T<<1)>>1]|0)<<1)>>1]|0;Q=T+1|0;if((Q|0)==(L|0)){break}else{T=Q}}if(R){U=0}else{break}while(1){b[d+1853280+(U<<1)>>1]=b[d+1686960+((e[d+1425600+(U<<1)>>1]|0)<<1)>>1]|0;b[d+1710720+(U<<1)>>1]=b[d+1544400+((e[d+1283040+(U<<1)>>1]|0)<<1)>>1]|0;b[d+1782e3+(U<<1)>>1]=b[d+1401840+((e[d+1568160+(U<<1)>>1]|0)<<1)>>1]|0;b[d+1877040+(U<<1)>>1]=b[d+1663200+((e[d+1449360+(U<<1)>>1]|0)<<1)>>1]|0;b[d+1734480+(U<<1)>>1]=b[d+1520640+((e[d+1306800+(U<<1)>>1]|0)<<1)>>1]|0;b[d+1805760+(U<<1)>>1]=b[d+1378080+((e[d+1591920+(U<<1)>>1]|0)<<1)>>1]|0;b[d+1900800+(U<<1)>>1]=b[d+1473120+((e[d+1639440+(U<<1)>>1]|0)<<1)>>1]|0;b[d+1758240+(U<<1)>>1]=b[d+1330560+((e[d+1496880+(U<<1)>>1]|0)<<1)>>1]|0;b[d+1829520+(U<<1)>>1]=b[d+1615680+((e[d+1354320+(U<<1)>>1]|0)<<1)>>1]|0;Q=U+1|0;if((Q|0)==(L|0)){break L3151}else{U=Q}}}}while(0);ap(c[p>>2]|0,5244208,(u=i,i=i+4|0,c[u>>2]=L,u)|0);if((g|0)!=0){i=h;return}g=m+48|0;c[g>>2]=8;c[m+52>>2]=q;c[m+56>>2]=40320;U=m+60|0;L3167:do{if(t){T=q;S=1;while(1){Q=$(T,S);P=T-1|0;if((P|0)>1){T=P;S=Q}else{V=Q;break L3167}}}else{V=1}}while(0);c[U>>2]=V;V=m+64|0;L3171:do{if(s){U=8;t=q;S=1;T=1;while(1){W=$(U,S);X=$(t,T);Q=t-1|0;if((Q|0)>0){U=U-1|0;t=Q;S=W;T=X}else{break}}c[V>>2]=(W|0)/(X|0)&-1;T=8;S=q;t=1;while(1){U=$(T,t);Q=S-1|0;if((Q|0)>0){T=T-1|0;S=Q;t=U}else{Y=U;break L3171}}}else{c[V>>2]=1;Y=1}}while(0);V=m+68|0;c[V>>2]=Y;Y=0;while(1){c[m+(Y<<2)>>2]=0;q=Y+1|0;if((q|0)<(c[g>>2]|0)){Y=q}else{break}}c[m+72>>2]=f;Y=c[V>>2]|0;V=n+48|0;c[V>>2]=8;c[n+52>>2]=z;c[n+56>>2]=40320;g=n+60|0;L3182:do{if(A){q=z;X=1;while(1){W=$(q,X);s=q-1|0;if((s|0)>1){q=s;X=W}else{Z=W;break L3182}}}else{Z=1}}while(0);c[g>>2]=Z;Z=n+64|0;L3186:do{if(B){g=8;A=z;X=1;q=1;while(1){_=$(g,X);aa=$(A,q);W=A-1|0;if((W|0)>0){g=g-1|0;A=W;X=_;q=aa}else{break}}c[Z>>2]=(_|0)/(aa|0)&-1;q=8;X=z;A=1;while(1){g=$(q,A);W=X-1|0;if((W|0)>0){q=q-1|0;X=W;A=g}else{ab=g;break L3186}}}else{c[Z>>2]=1;ab=1}}while(0);Z=n+68|0;c[Z>>2]=ab;ab=0;while(1){c[n+(ab<<2)>>2]=0;z=ab+1|0;if((z|0)<(c[V>>2]|0)){ab=z}else{break}}c[n+72>>2]=f;f=c[Z>>2]|0;ax(5246196,39,1,c[p>>2]|0);as(c[p>>2]|0);L3197:do{if((Y|0)>0){if((f|0)>0){ac=0}else{Z=0;while(1){if((Z&255|0)==0){n=c[p>>2]|0;au(46,n|0);n=c[p>>2]|0;as(n|0)}n=Z+1|0;if((n|0)==(Y|0)){break L3197}else{Z=n}}}while(1){do{if((ac&255|0)==0){Z=c[p>>2]|0;au(46,Z|0);Z=c[p>>2]|0;as(Z|0);ad=0;break}else{ad=0}}while(0);while(1){b[d+1924560+(ac*3360&-1)+(ad<<1)>>1]=bE(m,ac,ad)&65535;Z=ad+1|0;if((Z|0)==(f|0)){break}else{ad=Z}}Z=ac+1|0;if((Z|0)==(Y|0)){break L3197}else{ac=Z}}}}while(0);ap(c[p>>2]|0,5246036,(u=i,i=i+8|0,c[u>>2]=Y,c[u+4>>2]=f,u)|0);ax(5245952,49,1,c[p>>2]|0);as(c[p>>2]|0);L3213:do{if(I){f=0;while(1){b[d+7569360+(f<<1)>>1]=bA(j,f)&65535;Y=f+1|0;if((Y|0)==(D|0)){break L3213}else{f=Y}}}}while(0);ap(c[p>>2]|0,5245812,(u=i,i=i+4|0,c[u>>2]=D,u)|0);as(c[p>>2]|0);L3217:do{if(O){f=0;while(1){b[d+7593120+(f<<1)>>1]=bB(k,f)&65535;Y=f+1|0;if((Y|0)==(H|0)){break L3217}else{f=Y}}}}while(0);ap(c[p>>2]|0,5245696,(u=i,i=i+4|0,c[u>>2]=H,u)|0);as(c[p>>2]|0);L3221:do{if(R){f=0;while(1){b[d+7616880+(f<<1)>>1]=bC(l,f)&65535;Y=f+1|0;if((Y|0)==(L|0)){break L3221}else{f=Y}}}}while(0);ap(c[p>>2]|0,5245608,(u=i,i=i+4|0,c[u>>2]=L,u)|0);ax(5245460,54,1,c[p>>2]|0);as(c[p>>2]|0);L3225:do{if(I){L=j|0;l=j+32|0;R=j+36|0;f=j+40|0;Y=j+44|0;ac=0;while(1){bf(L,ac);do{if((c[l>>2]|0)==0){if((c[R>>2]|0)!=0){ae=0;break}if((c[f>>2]|0)!=0){ae=0;break}ae=(c[Y>>2]|0)==0&1}else{ae=0}}while(0);a[ac+(d+7640640)|0]=ae;ad=ac+1|0;if((ad|0)==(D|0)){break L3225}else{ac=ad}}}}while(0);ap(c[p>>2]|0,5245328,(u=i,i=i+4|0,c[u>>2]=D,u)|0);as(c[p>>2]|0);L3235:do{if(O){D=k|0;ae=k+32|0;j=k+36|0;I=k+40|0;ac=k+44|0;Y=0;while(1){bf(D,Y);do{if((c[ae>>2]|0)==0){if((c[j>>2]|0)!=0){af=0;break}if((c[I>>2]|0)!=0){af=0;break}af=(c[ac>>2]|0)==0&1}else{af=0}}while(0);a[Y+(d+7652520)|0]=af;f=Y+1|0;if((f|0)==(H|0)){break L3235}else{Y=f}}}}while(0);ap(c[p>>2]|0,5245608,(u=i,i=i+4|0,c[u>>2]=H,u)|0);i=h;return}function cr(a,b){a=a|0;b=b|0;var d=0,e=0,f=0,g=0,h=0,j=0,k=0,l=0,m=0,n=0,o=0,p=0,q=0;d=i;i=i+76|0;e=d|0;f=c[a+7664400>>2]|0;a=f^-1;g=(((a>>>1&1)+(a&1)|0)+(a>>>2&1)|0)+(a>>>3&1)|0;a=e+48|0;c[a>>2]=12;c[e+52>>2]=g;c[e+56>>2]=479001600;h=e+60|0;L3247:do{if((g|0)>1){j=g;k=1;while(1){l=$(j,k);m=j-1|0;if((m|0)>1){j=m;k=l}else{n=l;break L3247}}}else{n=1}}while(0);c[h>>2]=n;n=e+64|0;L3251:do{if((g|0)>0){h=12;k=g;j=1;l=1;while(1){o=$(h,j);p=$(k,l);m=k-1|0;if((m|0)>0){h=h-1|0;k=m;j=o;l=p}else{break}}c[n>>2]=(o|0)/(p|0)&-1;l=12;j=g;k=1;while(1){h=$(l,k);m=j-1|0;if((m|0)>0){l=l-1|0;j=m;k=h}else{q=h;break L3251}}}else{c[n>>2]=1;q=1}}while(0);c[e+68>>2]=q;q=0;while(1){c[e+(q<<2)>>2]=0;n=q+1|0;if((n|0)<(c[a>>2]|0)){q=n}else{break}}c[e+72>>2]=f;f=e|0;bf(f,b);b=e+4|0;q=c[b>>2]|0;a=e+8|0;c[b>>2]=c[a>>2]|0;b=e+12|0;c[a>>2]=c[b>>2]|0;a=e|0;c[b>>2]=c[a>>2]|0;c[a>>2]=q;q=be(f)|0;i=d;return q|0}function cs(a,b){a=a|0;b=b|0;var d=0,e=0,f=0,g=0,h=0,j=0,k=0,l=0,m=0,n=0,o=0,p=0,q=0;d=i;i=i+76|0;e=d|0;f=c[a+7664400>>2]|0;a=f^-1;g=(((a>>>1&1)+(a&1)|0)+(a>>>2&1)|0)+(a>>>3&1)|0;a=e+48|0;c[a>>2]=12;c[e+52>>2]=g;c[e+56>>2]=479001600;h=e+60|0;L3263:do{if((g|0)>1){j=g;k=1;while(1){l=$(j,k);m=j-1|0;if((m|0)>1){j=m;k=l}else{n=l;break L3263}}}else{n=1}}while(0);c[h>>2]=n;n=e+64|0;L3267:do{if((g|0)>0){h=12;k=g;j=1;l=1;while(1){o=$(h,j);p=$(k,l);m=k-1|0;if((m|0)>0){h=h-1|0;k=m;j=o;l=p}else{break}}c[n>>2]=(o|0)/(p|0)&-1;l=12;j=g;k=1;while(1){h=$(l,k);m=j-1|0;if((m|0)>0){l=l-1|0;j=m;k=h}else{q=h;break L3267}}}else{c[n>>2]=1;q=1}}while(0);c[e+68>>2]=q;q=0;while(1){c[e+(q<<2)>>2]=0;n=q+1|0;if((n|0)<(c[a>>2]|0)){q=n}else{break}}c[e+72>>2]=f;f=e|0;bf(f,b);b=e+36|0;q=c[b>>2]|0;a=e+16|0;c[b>>2]=c[a>>2]|0;b=e+32|0;c[a>>2]=c[b>>2]|0;a=e|0;c[b>>2]=c[a>>2]|0;c[a>>2]=q;q=be(f)|0;i=d;return q|0}function ct(a,b){a=a|0;b=b|0;var d=0,e=0,f=0,g=0,h=0,j=0,k=0,l=0,m=0,n=0,o=0,p=0,q=0;d=i;i=i+76|0;e=d|0;f=c[a+7664400>>2]|0;a=f^-1;g=(((a>>>1&1)+(a&1)|0)+(a>>>2&1)|0)+(a>>>3&1)|0;a=e+48|0;c[a>>2]=12;c[e+52>>2]=g;c[e+56>>2]=479001600;h=e+60|0;L3279:do{if((g|0)>1){j=g;k=1;while(1){l=$(j,k);m=j-1|0;if((m|0)>1){j=m;k=l}else{n=l;break L3279}}}else{n=1}}while(0);c[h>>2]=n;n=e+64|0;L3283:do{if((g|0)>0){h=12;k=g;j=1;l=1;while(1){o=$(h,j);p=$(k,l);m=k-1|0;if((m|0)>0){h=h-1|0;k=m;j=o;l=p}else{break}}c[n>>2]=(o|0)/(p|0)&-1;l=12;j=g;k=1;while(1){h=$(l,k);m=j-1|0;if((m|0)>0){l=l-1|0;j=m;k=h}else{q=h;break L3283}}}else{c[n>>2]=1;q=1}}while(0);c[e+68>>2]=q;q=0;while(1){c[e+(q<<2)>>2]=0;n=q+1|0;if((n|0)<(c[a>>2]|0)){q=n}else{break}}c[e+72>>2]=f;f=e|0;bf(f,b);b=e+32|0;q=c[b>>2]|0;a=e+20|0;c[b>>2]=c[a>>2]|0;b=e+40|0;c[a>>2]=c[b>>2]|0;a=e+4|0;c[b>>2]=c[a>>2]|0;c[a>>2]=q;q=be(f)|0;i=d;return q|0}function cu(a,b){a=a|0;b=b|0;var d=0,e=0,f=0,g=0,h=0,j=0,k=0,l=0,m=0,n=0,o=0,p=0,q=0;d=i;i=i+76|0;e=d|0;f=c[a+7664400>>2]|0;a=f^-1;g=(((a>>>1&1)+(a&1)|0)+(a>>>2&1)|0)+(a>>>3&1)|0;a=e+48|0;c[a>>2]=12;c[e+52>>2]=g;c[e+56>>2]=479001600;h=e+60|0;L3295:do{if((g|0)>1){j=g;k=1;while(1){l=$(j,k);m=j-1|0;if((m|0)>1){j=m;k=l}else{n=l;break L3295}}}else{n=1}}while(0);c[h>>2]=n;n=e+64|0;L3299:do{if((g|0)>0){h=12;k=g;j=1;l=1;while(1){o=$(h,j);p=$(k,l);m=k-1|0;if((m|0)>0){h=h-1|0;k=m;j=o;l=p}else{break}}c[n>>2]=(o|0)/(p|0)&-1;l=12;j=g;k=1;while(1){h=$(l,k);m=j-1|0;if((m|0)>0){l=l-1|0;j=m;k=h}else{q=h;break L3299}}}else{c[n>>2]=1;q=1}}while(0);c[e+68>>2]=q;q=0;while(1){c[e+(q<<2)>>2]=0;n=q+1|0;if((n|0)<(c[a>>2]|0)){q=n}else{break}}c[e+72>>2]=f;f=e|0;bf(f,b);b=e+28|0;q=c[b>>2]|0;a=e+24|0;c[b>>2]=c[a>>2]|0;b=e+20|0;c[a>>2]=c[b>>2]|0;a=e+16|0;c[b>>2]=c[a>>2]|0;c[a>>2]=q;q=be(f)|0;i=d;return q|0}function cv(a,b){a=a|0;b=b|0;var d=0,e=0,f=0,g=0,h=0,j=0,k=0,l=0,m=0,n=0,o=0,p=0,q=0;d=i;i=i+76|0;e=d|0;f=c[a+7664400>>2]|0;a=f^-1;g=(((a>>>1&1)+(a&1)|0)+(a>>>2&1)|0)+(a>>>3&1)|0;a=e+48|0;c[a>>2]=12;c[e+52>>2]=g;c[e+56>>2]=479001600;h=e+60|0;L3311:do{if((g|0)>1){j=g;k=1;while(1){l=$(j,k);m=j-1|0;if((m|0)>1){j=m;k=l}else{n=l;break L3311}}}else{n=1}}while(0);c[h>>2]=n;n=e+64|0;L3315:do{if((g|0)>0){h=12;k=g;j=1;l=1;while(1){o=$(h,j);p=$(k,l);m=k-1|0;if((m|0)>0){h=h-1|0;k=m;j=o;l=p}else{break}}c[n>>2]=(o|0)/(p|0)&-1;l=12;j=g;k=1;while(1){h=$(l,k);m=j-1|0;if((m|0)>0){l=l-1|0;j=m;k=h}else{q=h;break L3315}}}else{c[n>>2]=1;q=1}}while(0);c[e+68>>2]=q;q=0;while(1){c[e+(q<<2)>>2]=0;n=q+1|0;if((n|0)<(c[a>>2]|0)){q=n}else{break}}c[e+72>>2]=f;f=e|0;bf(f,b);b=e+40|0;q=c[b>>2]|0;a=e+24|0;c[b>>2]=c[a>>2]|0;b=e+44|0;c[a>>2]=c[b>>2]|0;a=e+8|0;c[b>>2]=c[a>>2]|0;c[a>>2]=q;q=be(f)|0;i=d;return q|0}function cw(a,b){a=a|0;b=b|0;var d=0,e=0,f=0,g=0,h=0,j=0,k=0,l=0,m=0,n=0,o=0,p=0,q=0;d=i;i=i+76|0;e=d|0;f=c[a+7664400>>2]|0;a=f^-1;g=(((a>>>1&1)+(a&1)|0)+(a>>>2&1)|0)+(a>>>3&1)|0;a=e+48|0;c[a>>2]=12;c[e+52>>2]=g;c[e+56>>2]=479001600;h=e+60|0;L3327:do{if((g|0)>1){j=g;k=1;while(1){l=$(j,k);m=j-1|0;if((m|0)>1){j=m;k=l}else{n=l;break L3327}}}else{n=1}}while(0);c[h>>2]=n;n=e+64|0;L3331:do{if((g|0)>0){h=12;k=g;j=1;l=1;while(1){o=$(h,j);p=$(k,l);m=k-1|0;if((m|0)>0){h=h-1|0;k=m;j=o;l=p}else{break}}c[n>>2]=(o|0)/(p|0)&-1;l=12;j=g;k=1;while(1){h=$(l,k);m=j-1|0;if((m|0)>0){l=l-1|0;j=m;k=h}else{q=h;break L3331}}}else{c[n>>2]=1;q=1}}while(0);c[e+68>>2]=q;q=0;while(1){c[e+(q<<2)>>2]=0;n=q+1|0;if((n|0)<(c[a>>2]|0)){q=n}else{break}}c[e+72>>2]=f;f=e|0;bf(f,b);b=e+44|0;q=c[b>>2]|0;a=e+28|0;c[b>>2]=c[a>>2]|0;b=e+36|0;c[a>>2]=c[b>>2]|0;a=e+12|0;c[b>>2]=c[a>>2]|0;c[a>>2]=q;q=be(f)|0;i=d;return q|0}function cx(a,b){a=a|0;b=b|0;var d=0,e=0,f=0,g=0,h=0,j=0,k=0,l=0,m=0,n=0,o=0,p=0,q=0;d=i;i=i+76|0;e=d|0;f=c[a+7664400>>2]|0;a=f^-1;g=(((a>>>4&1)+(a>>>5&1)|0)+(a>>>6&1)|0)+(a>>>7&1)|0;a=e+48|0;c[a>>2]=12;c[e+52>>2]=g;c[e+56>>2]=479001600;h=e+60|0;L3343:do{if((g|0)>1){j=g;k=1;while(1){l=$(j,k);m=j-1|0;if((m|0)>1){j=m;k=l}else{n=l;break L3343}}}else{n=1}}while(0);c[h>>2]=n;n=e+64|0;L3347:do{if((g|0)>0){h=12;k=g;j=1;l=1;while(1){o=$(h,j);p=$(k,l);m=k-1|0;if((m|0)>0){h=h-1|0;k=m;j=o;l=p}else{break}}c[n>>2]=(o|0)/(p|0)&-1;l=12;j=g;k=1;while(1){h=$(l,k);m=j-1|0;if((m|0)>0){l=l-1|0;j=m;k=h}else{q=h;break L3347}}}else{c[n>>2]=1;q=1}}while(0);c[e+68>>2]=q;q=0;while(1){c[e+(q<<2)>>2]=0;n=q+1|0;if((n|0)<(c[a>>2]|0)){q=n}else{break}}c[e+72>>2]=f;f=e|0;bf(f,b);b=e+4|0;q=c[b>>2]|0;a=e+8|0;c[b>>2]=c[a>>2]|0;b=e+12|0;c[a>>2]=c[b>>2]|0;a=e|0;c[b>>2]=c[a>>2]|0;c[a>>2]=q;q=be(f)|0;i=d;return q|0}function cy(a,b){a=a|0;b=b|0;var d=0,e=0,f=0,g=0,h=0,j=0,k=0,l=0,m=0,n=0,o=0,p=0,q=0;d=i;i=i+76|0;e=d|0;f=c[a+7664400>>2]|0;a=f^-1;g=(((a>>>4&1)+(a>>>5&1)|0)+(a>>>6&1)|0)+(a>>>7&1)|0;a=e+48|0;c[a>>2]=12;c[e+52>>2]=g;c[e+56>>2]=479001600;h=e+60|0;L3359:do{if((g|0)>1){j=g;k=1;while(1){l=$(j,k);m=j-1|0;if((m|0)>1){j=m;k=l}else{n=l;break L3359}}}else{n=1}}while(0);c[h>>2]=n;n=e+64|0;L3363:do{if((g|0)>0){h=12;k=g;j=1;l=1;while(1){o=$(h,j);p=$(k,l);m=k-1|0;if((m|0)>0){h=h-1|0;k=m;j=o;l=p}else{break}}c[n>>2]=(o|0)/(p|0)&-1;l=12;j=g;k=1;while(1){h=$(l,k);m=j-1|0;if((m|0)>0){l=l-1|0;j=m;k=h}else{q=h;break L3363}}}else{c[n>>2]=1;q=1}}while(0);c[e+68>>2]=q;q=0;while(1){c[e+(q<<2)>>2]=0;n=q+1|0;if((n|0)<(c[a>>2]|0)){q=n}else{break}}c[e+72>>2]=f;f=e|0;bf(f,b);b=e+36|0;q=c[b>>2]|0;a=e+16|0;c[b>>2]=c[a>>2]|0;b=e+32|0;c[a>>2]=c[b>>2]|0;a=e|0;c[b>>2]=c[a>>2]|0;c[a>>2]=q;q=be(f)|0;i=d;return q|0}function cz(a,b){a=a|0;b=b|0;var d=0,e=0,f=0,g=0,h=0,j=0,k=0,l=0,m=0,n=0,o=0,p=0,q=0;d=i;i=i+76|0;e=d|0;f=c[a+7664400>>2]|0;a=f^-1;g=(((a>>>4&1)+(a>>>5&1)|0)+(a>>>6&1)|0)+(a>>>7&1)|0;a=e+48|0;c[a>>2]=12;c[e+52>>2]=g;c[e+56>>2]=479001600;h=e+60|0;L3375:do{if((g|0)>1){j=g;k=1;while(1){l=$(j,k);m=j-1|0;if((m|0)>1){j=m;k=l}else{n=l;break L3375}}}else{n=1}}while(0);c[h>>2]=n;n=e+64|0;L3379:do{if((g|0)>0){h=12;k=g;j=1;l=1;while(1){o=$(h,j);p=$(k,l);m=k-1|0;if((m|0)>0){h=h-1|0;k=m;j=o;l=p}else{break}}c[n>>2]=(o|0)/(p|0)&-1;l=12;j=g;k=1;while(1){h=$(l,k);m=j-1|0;if((m|0)>0){l=l-1|0;j=m;k=h}else{q=h;break L3379}}}else{c[n>>2]=1;q=1}}while(0);c[e+68>>2]=q;q=0;while(1){c[e+(q<<2)>>2]=0;n=q+1|0;if((n|0)<(c[a>>2]|0)){q=n}else{break}}c[e+72>>2]=f;f=e|0;bf(f,b);b=e+32|0;q=c[b>>2]|0;a=e+20|0;c[b>>2]=c[a>>2]|0;b=e+40|0;c[a>>2]=c[b>>2]|0;a=e+4|0;c[b>>2]=c[a>>2]|0;c[a>>2]=q;q=be(f)|0;i=d;return q|0}function cA(a,b){a=a|0;b=b|0;var d=0,e=0,f=0,g=0,h=0,j=0,k=0,l=0,m=0,n=0,o=0,p=0,q=0;d=i;i=i+76|0;e=d|0;f=c[a+7664400>>2]|0;a=f^-1;g=(((a>>>4&1)+(a>>>5&1)|0)+(a>>>6&1)|0)+(a>>>7&1)|0;a=e+48|0;c[a>>2]=12;c[e+52>>2]=g;c[e+56>>2]=479001600;h=e+60|0;L3391:do{if((g|0)>1){j=g;k=1;while(1){l=$(j,k);m=j-1|0;if((m|0)>1){j=m;k=l}else{n=l;break L3391}}}else{n=1}}while(0);c[h>>2]=n;n=e+64|0;L3395:do{if((g|0)>0){h=12;k=g;j=1;l=1;while(1){o=$(h,j);p=$(k,l);m=k-1|0;if((m|0)>0){h=h-1|0;k=m;j=o;l=p}else{break}}c[n>>2]=(o|0)/(p|0)&-1;l=12;j=g;k=1;while(1){h=$(l,k);m=j-1|0;if((m|0)>0){l=l-1|0;j=m;k=h}else{q=h;break L3395}}}else{c[n>>2]=1;q=1}}while(0);c[e+68>>2]=q;q=0;while(1){c[e+(q<<2)>>2]=0;n=q+1|0;if((n|0)<(c[a>>2]|0)){q=n}else{break}}c[e+72>>2]=f;f=e|0;bf(f,b);b=e+28|0;q=c[b>>2]|0;a=e+24|0;c[b>>2]=c[a>>2]|0;b=e+20|0;c[a>>2]=c[b>>2]|0;a=e+16|0;c[b>>2]=c[a>>2]|0;c[a>>2]=q;q=be(f)|0;i=d;return q|0}function cB(a,b){a=a|0;b=b|0;var d=0,e=0,f=0,g=0,h=0,j=0,k=0,l=0,m=0,n=0,o=0,p=0,q=0;d=i;i=i+76|0;e=d|0;f=c[a+7664400>>2]|0;a=f^-1;g=(((a>>>4&1)+(a>>>5&1)|0)+(a>>>6&1)|0)+(a>>>7&1)|0;a=e+48|0;c[a>>2]=12;c[e+52>>2]=g;c[e+56>>2]=479001600;h=e+60|0;L3407:do{if((g|0)>1){j=g;k=1;while(1){l=$(j,k);m=j-1|0;if((m|0)>1){j=m;k=l}else{n=l;break L3407}}}else{n=1}}while(0);c[h>>2]=n;n=e+64|0;L3411:do{if((g|0)>0){h=12;k=g;j=1;l=1;while(1){o=$(h,j);p=$(k,l);m=k-1|0;if((m|0)>0){h=h-1|0;k=m;j=o;l=p}else{break}}c[n>>2]=(o|0)/(p|0)&-1;l=12;j=g;k=1;while(1){h=$(l,k);m=j-1|0;if((m|0)>0){l=l-1|0;j=m;k=h}else{q=h;break L3411}}}else{c[n>>2]=1;q=1}}while(0);c[e+68>>2]=q;q=0;while(1){c[e+(q<<2)>>2]=0;n=q+1|0;if((n|0)<(c[a>>2]|0)){q=n}else{break}}c[e+72>>2]=f;f=e|0;bf(f,b);b=e+40|0;q=c[b>>2]|0;a=e+24|0;c[b>>2]=c[a>>2]|0;b=e+44|0;c[a>>2]=c[b>>2]|0;a=e+8|0;c[b>>2]=c[a>>2]|0;c[a>>2]=q;q=be(f)|0;i=d;return q|0}function cC(a,b){a=a|0;b=b|0;var d=0,e=0,f=0,g=0,h=0,j=0,k=0,l=0,m=0,n=0,o=0,p=0,q=0;d=i;i=i+76|0;e=d|0;f=c[a+7664400>>2]|0;a=f^-1;g=(((a>>>4&1)+(a>>>5&1)|0)+(a>>>6&1)|0)+(a>>>7&1)|0;a=e+48|0;c[a>>2]=12;c[e+52>>2]=g;c[e+56>>2]=479001600;h=e+60|0;L3423:do{if((g|0)>1){j=g;k=1;while(1){l=$(j,k);m=j-1|0;if((m|0)>1){j=m;k=l}else{n=l;break L3423}}}else{n=1}}while(0);c[h>>2]=n;n=e+64|0;L3427:do{if((g|0)>0){h=12;k=g;j=1;l=1;while(1){o=$(h,j);p=$(k,l);m=k-1|0;if((m|0)>0){h=h-1|0;k=m;j=o;l=p}else{break}}c[n>>2]=(o|0)/(p|0)&-1;l=12;j=g;k=1;while(1){h=$(l,k);m=j-1|0;if((m|0)>0){l=l-1|0;j=m;k=h}else{q=h;break L3427}}}else{c[n>>2]=1;q=1}}while(0);c[e+68>>2]=q;q=0;while(1){c[e+(q<<2)>>2]=0;n=q+1|0;if((n|0)<(c[a>>2]|0)){q=n}else{break}}c[e+72>>2]=f;f=e|0;bf(f,b);b=e+44|0;q=c[b>>2]|0;a=e+28|0;c[b>>2]=c[a>>2]|0;b=e+36|0;c[a>>2]=c[b>>2]|0;a=e+12|0;c[b>>2]=c[a>>2]|0;c[a>>2]=q;q=be(f)|0;i=d;return q|0}function cD(a,b){a=a|0;b=b|0;var d=0,e=0,f=0,g=0,h=0,j=0,k=0,l=0,m=0,n=0,o=0,p=0,q=0;d=i;i=i+76|0;e=d|0;f=c[a+7664400>>2]|0;a=f^-1;g=(((a>>>8&1)+(a>>>9&1)|0)+(a>>>10&1)|0)+(a>>>11&1)|0;a=e+48|0;c[a>>2]=12;c[e+52>>2]=g;c[e+56>>2]=479001600;h=e+60|0;L3439:do{if((g|0)>1){j=g;k=1;while(1){l=$(j,k);m=j-1|0;if((m|0)>1){j=m;k=l}else{n=l;break L3439}}}else{n=1}}while(0);c[h>>2]=n;n=e+64|0;L3443:do{if((g|0)>0){h=12;k=g;j=1;l=1;while(1){o=$(h,j);p=$(k,l);m=k-1|0;if((m|0)>0){h=h-1|0;k=m;j=o;l=p}else{break}}c[n>>2]=(o|0)/(p|0)&-1;l=12;j=g;k=1;while(1){h=$(l,k);m=j-1|0;if((m|0)>0){l=l-1|0;j=m;k=h}else{q=h;break L3443}}}else{c[n>>2]=1;q=1}}while(0);c[e+68>>2]=q;q=0;while(1){c[e+(q<<2)>>2]=0;n=q+1|0;if((n|0)<(c[a>>2]|0)){q=n}else{break}}c[e+72>>2]=f;f=e|0;bf(f,b);b=e+4|0;q=c[b>>2]|0;a=e+8|0;c[b>>2]=c[a>>2]|0;b=e+12|0;c[a>>2]=c[b>>2]|0;a=e|0;c[b>>2]=c[a>>2]|0;c[a>>2]=q;q=be(f)|0;i=d;return q|0}function cE(a,b){a=a|0;b=b|0;var d=0,e=0,f=0,g=0,h=0,j=0,k=0,l=0,m=0,n=0,o=0,p=0,q=0;d=i;i=i+76|0;e=d|0;f=c[a+7664400>>2]|0;a=f^-1;g=(((a>>>8&1)+(a>>>9&1)|0)+(a>>>10&1)|0)+(a>>>11&1)|0;a=e+48|0;c[a>>2]=12;c[e+52>>2]=g;c[e+56>>2]=479001600;h=e+60|0;L3455:do{if((g|0)>1){j=g;k=1;while(1){l=$(j,k);m=j-1|0;if((m|0)>1){j=m;k=l}else{n=l;break L3455}}}else{n=1}}while(0);c[h>>2]=n;n=e+64|0;L3459:do{if((g|0)>0){h=12;k=g;j=1;l=1;while(1){o=$(h,j);p=$(k,l);m=k-1|0;if((m|0)>0){h=h-1|0;k=m;j=o;l=p}else{break}}c[n>>2]=(o|0)/(p|0)&-1;l=12;j=g;k=1;while(1){h=$(l,k);m=j-1|0;if((m|0)>0){l=l-1|0;j=m;k=h}else{q=h;break L3459}}}else{c[n>>2]=1;q=1}}while(0);c[e+68>>2]=q;q=0;while(1){c[e+(q<<2)>>2]=0;n=q+1|0;if((n|0)<(c[a>>2]|0)){q=n}else{break}}c[e+72>>2]=f;f=e|0;bf(f,b);b=e+36|0;q=c[b>>2]|0;a=e+16|0;c[b>>2]=c[a>>2]|0;b=e+32|0;c[a>>2]=c[b>>2]|0;a=e|0;c[b>>2]=c[a>>2]|0;c[a>>2]=q;q=be(f)|0;i=d;return q|0}function cF(a,b){a=a|0;b=b|0;var d=0,e=0,f=0,g=0,h=0,j=0,k=0,l=0,m=0,n=0,o=0,p=0,q=0;d=i;i=i+76|0;e=d|0;f=c[a+7664400>>2]|0;a=f^-1;g=(((a>>>8&1)+(a>>>9&1)|0)+(a>>>10&1)|0)+(a>>>11&1)|0;a=e+48|0;c[a>>2]=12;c[e+52>>2]=g;c[e+56>>2]=479001600;h=e+60|0;L3471:do{if((g|0)>1){j=g;k=1;while(1){l=$(j,k);m=j-1|0;if((m|0)>1){j=m;k=l}else{n=l;break L3471}}}else{n=1}}while(0);c[h>>2]=n;n=e+64|0;L3475:do{if((g|0)>0){h=12;k=g;j=1;l=1;while(1){o=$(h,j);p=$(k,l);m=k-1|0;if((m|0)>0){h=h-1|0;k=m;j=o;l=p}else{break}}c[n>>2]=(o|0)/(p|0)&-1;l=12;j=g;k=1;while(1){h=$(l,k);m=j-1|0;if((m|0)>0){l=l-1|0;j=m;k=h}else{q=h;break L3475}}}else{c[n>>2]=1;q=1}}while(0);c[e+68>>2]=q;q=0;while(1){c[e+(q<<2)>>2]=0;n=q+1|0;if((n|0)<(c[a>>2]|0)){q=n}else{break}}c[e+72>>2]=f;f=e|0;bf(f,b);b=e+32|0;q=c[b>>2]|0;a=e+20|0;c[b>>2]=c[a>>2]|0;b=e+40|0;c[a>>2]=c[b>>2]|0;a=e+4|0;c[b>>2]=c[a>>2]|0;c[a>>2]=q;q=be(f)|0;i=d;return q|0}function cG(a,b){a=a|0;b=b|0;var d=0,e=0,f=0,g=0,h=0,j=0,k=0,l=0,m=0,n=0,o=0,p=0,q=0;d=i;i=i+76|0;e=d|0;f=c[a+7664400>>2]|0;a=f^-1;g=(((a>>>8&1)+(a>>>9&1)|0)+(a>>>10&1)|0)+(a>>>11&1)|0;a=e+48|0;c[a>>2]=12;c[e+52>>2]=g;c[e+56>>2]=479001600;h=e+60|0;L3487:do{if((g|0)>1){j=g;k=1;while(1){l=$(j,k);m=j-1|0;if((m|0)>1){j=m;k=l}else{n=l;break L3487}}}else{n=1}}while(0);c[h>>2]=n;n=e+64|0;L3491:do{if((g|0)>0){h=12;k=g;j=1;l=1;while(1){o=$(h,j);p=$(k,l);m=k-1|0;if((m|0)>0){h=h-1|0;k=m;j=o;l=p}else{break}}c[n>>2]=(o|0)/(p|0)&-1;l=12;j=g;k=1;while(1){h=$(l,k);m=j-1|0;if((m|0)>0){l=l-1|0;j=m;k=h}else{q=h;break L3491}}}else{c[n>>2]=1;q=1}}while(0);c[e+68>>2]=q;q=0;while(1){c[e+(q<<2)>>2]=0;n=q+1|0;if((n|0)<(c[a>>2]|0)){q=n}else{break}}c[e+72>>2]=f;f=e|0;bf(f,b);b=e+28|0;q=c[b>>2]|0;a=e+24|0;c[b>>2]=c[a>>2]|0;b=e+20|0;c[a>>2]=c[b>>2]|0;a=e+16|0;c[b>>2]=c[a>>2]|0;c[a>>2]=q;q=be(f)|0;i=d;return q|0}function cH(a,b){a=a|0;b=b|0;var d=0,e=0,f=0,g=0,h=0,j=0,k=0,l=0,m=0,n=0,o=0,p=0,q=0;d=i;i=i+76|0;e=d|0;f=c[a+7664400>>2]|0;a=f^-1;g=(((a>>>8&1)+(a>>>9&1)|0)+(a>>>10&1)|0)+(a>>>11&1)|0;a=e+48|0;c[a>>2]=12;c[e+52>>2]=g;c[e+56>>2]=479001600;h=e+60|0;L3503:do{if((g|0)>1){j=g;k=1;while(1){l=$(j,k);m=j-1|0;if((m|0)>1){j=m;k=l}else{n=l;break L3503}}}else{n=1}}while(0);c[h>>2]=n;n=e+64|0;L3507:do{if((g|0)>0){h=12;k=g;j=1;l=1;while(1){o=$(h,j);p=$(k,l);m=k-1|0;if((m|0)>0){h=h-1|0;k=m;j=o;l=p}else{break}}c[n>>2]=(o|0)/(p|0)&-1;l=12;j=g;k=1;while(1){h=$(l,k);m=j-1|0;if((m|0)>0){l=l-1|0;j=m;k=h}else{q=h;break L3507}}}else{c[n>>2]=1;q=1}}while(0);c[e+68>>2]=q;q=0;while(1){c[e+(q<<2)>>2]=0;n=q+1|0;if((n|0)<(c[a>>2]|0)){q=n}else{break}}c[e+72>>2]=f;f=e|0;bf(f,b);b=e+40|0;q=c[b>>2]|0;a=e+24|0;c[b>>2]=c[a>>2]|0;b=e+44|0;c[a>>2]=c[b>>2]|0;a=e+8|0;c[b>>2]=c[a>>2]|0;c[a>>2]=q;q=be(f)|0;i=d;return q|0}function cI(a,b){a=a|0;b=b|0;var d=0,e=0,f=0,g=0,h=0,j=0,k=0,l=0,m=0,n=0,o=0,p=0,q=0;d=i;i=i+76|0;e=d|0;f=c[a+7664400>>2]|0;a=f^-1;g=(((a>>>8&1)+(a>>>9&1)|0)+(a>>>10&1)|0)+(a>>>11&1)|0;a=e+48|0;c[a>>2]=12;c[e+52>>2]=g;c[e+56>>2]=479001600;h=e+60|0;L3519:do{if((g|0)>1){j=g;k=1;while(1){l=$(j,k);m=j-1|0;if((m|0)>1){j=m;k=l}else{n=l;break L3519}}}else{n=1}}while(0);c[h>>2]=n;n=e+64|0;L3523:do{if((g|0)>0){h=12;k=g;j=1;l=1;while(1){o=$(h,j);p=$(k,l);m=k-1|0;if((m|0)>0){h=h-1|0;k=m;j=o;l=p}else{break}}c[n>>2]=(o|0)/(p|0)&-1;l=12;j=g;k=1;while(1){h=$(l,k);m=j-1|0;if((m|0)>0){l=l-1|0;j=m;k=h}else{q=h;break L3523}}}else{c[n>>2]=1;q=1}}while(0);c[e+68>>2]=q;q=0;while(1){c[e+(q<<2)>>2]=0;n=q+1|0;if((n|0)<(c[a>>2]|0)){q=n}else{break}}c[e+72>>2]=f;f=e|0;bf(f,b);b=e+44|0;q=c[b>>2]|0;a=e+28|0;c[b>>2]=c[a>>2]|0;b=e+36|0;c[a>>2]=c[b>>2]|0;a=e+12|0;c[b>>2]=c[a>>2]|0;c[a>>2]=q;q=be(f)|0;i=d;return q|0}function cJ(b){b=b|0;var c=0,d=0,e=0,f=0,g=0,h=0,i=0,j=0,k=0,l=0,m=0,n=0,o=0,p=0,q=0,r=0,s=0;c=0;while(1){a[b+c|0]=2;a[c+(b+69)|0]=5;a[c+(b+138)|0]=8;a[c+(b+207)|0]=11;a[c+(b+276)|0]=14;a[c+(b+345)|0]=17;a[c+(b+23)|0]=3;a[c+(b+92)|0]=6;a[c+(b+161)|0]=9;a[c+(b+230)|0]=12;a[c+(b+299)|0]=15;a[c+(b+368)|0]=18;a[c+(b+46)|0]=4;a[c+(b+115)|0]=7;a[c+(b+184)|0]=10;a[c+(b+253)|0]=13;a[c+(b+322)|0]=16;a[c+(b+391)|0]=19;a[c+(b+460)|0]=20;a[c+(b+437)|0]=20;a[c+(b+414)|0]=20;a[c+(b+529)|0]=21;a[c+(b+506)|0]=21;a[c+(b+483)|0]=21;a[c+(b+598)|0]=22;a[c+(b+575)|0]=22;a[c+(b+552)|0]=22;d=c+1|0;if((d|0)==23){break}else{c=d}}a[b|0]=0;a[b+23|0]=0;a[b+46|0]=0;a[b+69|0]=0;a[b+92|0]=0;a[b+115|0]=0;a[b+138|0]=0;a[b+161|0]=0;a[b+184|0]=0;a[b+207|0]=0;a[b+230|0]=0;a[b+253|0]=0;a[b+276|0]=0;a[b+299|0]=0;a[b+322|0]=0;a[b+345|0]=0;a[b+368|0]=0;a[b+391|0]=0;a[b+414|0]=0;a[b+437|0]=0;a[b+460|0]=0;a[b+483|0]=0;a[b+506|0]=0;a[b+529|0]=0;a[b+552|0]=0;a[b+575|0]=0;a[b+598|0]=0;a[b+160|0]=0;a[b+157|0]=0;a[b+156|0]=0;a[b+155|0]=0;a[b+148|0]=0;a[b+147|0]=0;a[b+146|0]=0;a[b+183|0]=0;a[b+180|0]=0;a[b+179|0]=0;a[b+178|0]=0;a[b+171|0]=0;a[b+170|0]=0;a[b+169|0]=0;a[b+206|0]=0;a[b+203|0]=0;a[b+202|0]=0;a[b+201|0]=0;a[b+194|0]=0;a[b+193|0]=0;a[b+192|0]=0;a[b+20|0]=0;a[b+13|0]=0;a[b+12|0]=0;a[b+11|0]=0;a[b+4|0]=0;a[b+3|0]=0;a[b+2|0]=0;a[b+43|0]=0;a[b+36|0]=0;a[b+35|0]=0;a[b+34|0]=0;a[b+27|0]=0;a[b+26|0]=0;a[b+25|0]=0;a[b+66|0]=0;a[b+59|0]=0;a[b+58|0]=0;a[b+57|0]=0;a[b+50|0]=0;a[b+49|0]=0;a[b+48|0]=0;a[b+297|0]=0;a[b+292|0]=0;a[b+291|0]=0;a[b+290|0]=0;a[b+283|0]=0;a[b+282|0]=0;a[b+281|0]=0;a[b+320|0]=0;a[b+315|0]=0;a[b+314|0]=0;a[b+313|0]=0;a[b+306|0]=0;a[b+305|0]=0;a[b+304|0]=0;a[b+343|0]=0;a[b+338|0]=0;a[b+337|0]=0;a[b+336|0]=0;a[b+329|0]=0;a[b+328|0]=0;a[b+327|0]=0;a[b+354|0]=22;a[b+353|0]=22;a[b+367|0]=0;a[b+355|0]=0;a[b+364|0]=0;a[b+363|0]=0;a[b+362|0]=0;a[b+378|0]=22;a[b+376|0]=22;a[b+390|0]=0;a[b+377|0]=0;a[b+387|0]=0;a[b+386|0]=0;a[b+385|0]=0;a[b+401|0]=22;a[b+400|0]=22;a[b+413|0]=0;a[b+399|0]=0;a[b+410|0]=0;a[b+409|0]=0;a[b+408|0]=0;a[b+210|0]=20;a[b+209|0]=20;a[b+227|0]=0;a[b+211|0]=0;a[b+220|0]=0;a[b+219|0]=0;a[b+218|0]=0;a[b+234|0]=20;a[b+232|0]=20;a[b+250|0]=0;a[b+233|0]=0;a[b+243|0]=0;a[b+242|0]=0;a[b+241|0]=0;a[b+257|0]=20;a[b+256|0]=20;a[b+273|0]=0;a[b+255|0]=0;a[b+266|0]=0;a[b+265|0]=0;a[b+264|0]=0;a[b+84|0]=21;a[b+83|0]=21;a[b+90|0]=0;a[b+85|0]=0;a[b+76|0]=0;a[b+75|0]=0;a[b+74|0]=0;a[b+108|0]=21;a[b+106|0]=21;a[b+113|0]=0;a[b+107|0]=0;a[b+99|0]=0;a[b+98|0]=0;a[b+97|0]=0;a[b+131|0]=21;a[b+130|0]=21;a[b+136|0]=0;a[b+129|0]=0;a[b+122|0]=0;a[b+121|0]=0;a[b+120|0]=0;a[b+571|0]=0;a[b+570|0]=0;a[b+569|0]=0;a[b+574|0]=0;a[b+562|0]=0;a[b+561|0]=0;a[b+560|0]=0;a[b+594|0]=0;a[b+593|0]=0;a[b+592|0]=0;a[b+597|0]=0;a[b+585|0]=0;a[b+584|0]=0;a[b+583|0]=0;a[b+617|0]=0;a[b+616|0]=0;a[b+615|0]=0;a[b+620|0]=0;a[b+608|0]=0;a[b+607|0]=0;a[b+606|0]=0;a[b+427|0]=0;a[b+426|0]=0;a[b+425|0]=0;a[b+434|0]=0;a[b+418|0]=0;a[b+417|0]=0;a[b+416|0]=0;a[b+450|0]=0;a[b+449|0]=0;a[b+448|0]=0;a[b+457|0]=0;a[b+441|0]=0;a[b+440|0]=0;a[b+439|0]=0;a[b+473|0]=0;a[b+472|0]=0;a[b+471|0]=0;a[b+480|0]=0;a[b+464|0]=0;a[b+463|0]=0;a[b+462|0]=0;a[b+490|0]=0;a[b+489|0]=0;a[b+488|0]=0;a[b+504|0]=0;a[b+499|0]=0;a[b+498|0]=0;a[b+497|0]=0;a[b+513|0]=0;a[b+512|0]=0;a[b+511|0]=0;a[b+527|0]=0;a[b+522|0]=0;a[b+521|0]=0;a[b+520|0]=0;a[b+536|0]=0;a[b+535|0]=0;a[b+534|0]=0;a[b+550|0]=0;a[b+545|0]=0;a[b+544|0]=0;a[b+543|0]=0;c=0;d=0;e=0;f=0;g=0;h=0;i=0;j=0;k=0;l=0;m=0;n=0;o=0;p=0;q=0;r=0;while(1){a[c+(b+621)|0]=d;a[c+(b+736)|0]=e;a[c+(b+851)|0]=f;a[c+(b+759)|0]=g;a[c+(b+644)|0]=h;a[c+(b+874)|0]=i;a[c+(b+667)|0]=j;a[c+(b+690)|0]=k;a[c+(b+713)|0]=l;a[c+(b+782)|0]=m;a[c+(b+805)|0]=n;a[c+(b+828)|0]=o;a[c+(b+897)|0]=p;a[c+(b+920)|0]=q;a[c+(b+943)|0]=r;s=c+1|0;if((s|0)==23){break}c=s;d=a[s+(b+23)|0]|0;e=a[s+(b+230)|0]|0;f=a[s+(b+437)|0]|0;g=a[s+(b+299)|0]|0;h=a[s+(b+92)|0]|0;i=a[s+(b+506)|0]|0;j=a[s+(b+138)|0]|0;k=a[s+(b+161)|0]|0;l=a[s+(b+184)|0]|0;m=a[s+(b+345)|0]|0;n=a[s+(b+368)|0]|0;o=a[s+(b+391)|0]|0;p=a[s+(b+552)|0]|0;q=a[s+(b+575)|0]|0;r=a[s+(b+598)|0]|0}return}function cK(b,c){b=b|0;c=c|0;var d=0,e=0;a[b+17|0]=1;a[b+15|0]=1;a[b+14|0]=1;a[b+12|0]=1;a[b+11|0]=1;a[b+9|0]=1;a[b+8|0]=1;a[b+6|0]=1;a[b+5|0]=1;a[b+3|0]=1;a[b+2|0]=1;a[b|0]=1;d=b+27|0;a[b+36|0]=1;a[b+34|0]=1;a[b+31|0]=1;a[b+29|0]=1;if((c|0)==2){a[b+16|0]=1;a[b+13|0]=1;a[b+10|0]=1;a[b+7|0]=1;a[b+4|0]=1;a[b+1|0]=1;cX(b+18|0,2,9);a[b+35|0]=1;a[b+33|0]=1;a[b+32|0]=1;a[b+30|0]=1;a[b+28|0]=1;a[d|0]=1;e=b+37|0;a[e]=2;a[e+1|0]=2;a[e+2|0]=2;a[e+3|0]=2;a[e+4|0]=2}else if((c|0)==3){a[b+16|0]=1;a[b+13|0]=1;a[b+10|0]=1;a[b+7|0]=1;a[b+4|0]=1;a[b+1|0]=1;a[b+35|0]=1;a[b+33|0]=1;a[b+32|0]=1;a[b+30|0]=1;e=b+37|0;cX(b+18|0,1,11);a[e]=1;a[e+1|0]=1;a[e+2|0]=1;a[e+3|0]=1;a[e+4|0]=1}else if((c|0)==1){a[b+16|0]=2;a[b+13|0]=2;a[b+10|0]=2;a[b+7|0]=2;a[b+4|0]=2;a[b+1|0]=2;a[b+26|0]=2;a[b+21|0]=2;a[b+20|0]=2;a[b+24|0]=2;a[b+23|0]=2;a[b+18|0]=2;a[b+25|0]=4;a[b+22|0]=4;a[b+19|0]=4;a[b+35|0]=2;a[b+33|0]=2;a[b+32|0]=2;a[b+30|0]=2;a[b+28|0]=2;a[d|0]=2;a[b+41|0]=2;a[b+39|0]=2;a[b+40|0]=4;a[b+38|0]=4;a[b+37|0]=4}a[b+56|0]=0;a[b+54|0]=0;a[b+53|0]=0;a[b+51|0]=0;a[b+47|0]=0;a[b+45|0]=0;a[b+44|0]=0;a[b+42|0]=0;a[b+63|0]=0;a[b+62|0]=0;a[b+65|0]=0;a[b+60|0]=0;a[b+59|0]=1;a[b+58|0]=1;a[b+57|0]=1;a[b+55|0]=1;a[b+52|0]=1;a[b+50|0]=1;a[b+49|0]=1;a[b+48|0]=1;a[b+46|0]=1;a[b+43|0]=1;a[b+68|0]=1;a[b+66|0]=1;a[b+64|0]=1;a[b+67|0]=1;a[b+61|0]=1;return}function cL(b){b=b|0;var e=0,f=0,g=0,h=0,i=0,j=0,k=0,l=0,m=0,n=0,o=0,p=0,q=0,r=0,s=0,t=0,u=0,v=0,w=0,x=0;c[b>>2]=0;if((c[1312008]|0)!=0){return}a[5249354]=2;a[5249355]=3;a[5249356]=4;a[5249363]=7;a[5249364]=8;a[5249365]=9;a[5249349]=0;a[5249361]=6;a[5249358]=5;a[5249352]=1;a[5249372]=12;a[5249373]=13;a[5249374]=14;a[5249367]=10;a[5249370]=11;a[5249334]=6;a[5249335]=7;a[5249336]=8;a[5249339]=15;a[5249340]=16;a[5249341]=17;a[5249332]=1;a[5249338]=13;a[5249337]=10;a[5249333]=4;a[5249344]=24;a[5249345]=25;a[5249346]=26;a[5249342]=19;a[5249343]=22;a[5247968]=24;a[5247971]=18;a[5247974]=21;a[5247969]=25;a[5247972]=19;a[5247975]=22;a[5247970]=26;a[5247973]=20;a[5247976]=23;a[5247596]=1;a[5247597]=4;a[5247598]=11;a[5247599]=13;a[5247600]=7;a[5247601]=15;a[5247602]=14;a[5247603]=0;a[5247604]=20;a[5247605]=10;a[5247606]=19;a[5247607]=16;a[5247608]=3;a[5247609]=18;a[5247610]=5;a[5247611]=6;a[5247612]=21;a[5247613]=22;a[5247614]=12;a[5247615]=23;a[5247616]=17;a[5247617]=2;a[5247618]=8;a[5247619]=9;a[5247860]=2;a[5247861]=10;a[5247862]=5;a[5247863]=11;a[5247864]=17;a[5247865]=8;a[5247866]=16;a[5247867]=12;a[5247868]=0;a[5247869]=21;a[5247870]=14;a[5247871]=19;a[5247872]=15;a[5247873]=1;a[5247874]=13;a[5247875]=23;a[5247876]=4;a[5247877]=6;a[5247878]=20;a[5247879]=22;a[5247880]=9;a[5247881]=18;a[5247882]=3;a[5247883]=7;a[5247836]=3;a[5247837]=11;a[5247838]=12;a[5247839]=6;a[5247840]=19;a[5247841]=18;a[5247842]=9;a[5247843]=22;a[5247844]=13;a[5247845]=0;a[5247846]=2;a[5247847]=15;a[5247848]=17;a[5247849]=16;a[5247850]=21;a[5247851]=20;a[5247852]=23;a[5247853]=10;a[5247854]=4;a[5247855]=5;a[5247856]=1;a[5247857]=7;a[5247858]=14;a[5247859]=8;b=0;e=1;f=2;g=3;while(1){a[5247620+(b*9&-1)|0]=e;a[5247623+(b*9&-1)|0]=f;a[5247626+(b*9&-1)|0]=g;h=b+1|0;if((h|0)==24){i=0;break}b=h;e=a[h+5247596|0]|0;f=a[h+5247860|0]|0;g=a[h+5247836|0]|0}while(1){a[5247621+(i*9&-1)|0]=a[5247620+((d[5247620+(i*9&-1)|0]|0)*9&-1)|0]|0;a[5247624+(i*9&-1)|0]=a[5247623+((d[5247623+(i*9&-1)|0]|0)*9&-1)|0]|0;a[5247627+(i*9&-1)|0]=a[5247626+((d[5247626+(i*9&-1)|0]|0)*9&-1)|0]|0;g=i+1|0;if((g|0)==24){j=0;break}else{i=g}}while(1){a[5247622+(j*9&-1)|0]=a[5247620+((d[5247621+(j*9&-1)|0]|0)*9&-1)|0]|0;a[5247625+(j*9&-1)|0]=a[5247623+((d[5247624+(j*9&-1)|0]|0)*9&-1)|0]|0;a[5247628+(j*9&-1)|0]=a[5247626+((d[5247627+(j*9&-1)|0]|0)*9&-1)|0]|0;i=j+1|0;if((i|0)==24){k=0;break}else{j=i}}while(1){cX(5248684+(k*27&-1)|0,k&255|0,27);a[5248708+(k*27&-1)|0]=a[5247620+(k*9&-1)|0]|0;a[5248709+(k*27&-1)|0]=a[5247621+(k*9&-1)|0]|0;a[5248710+(k*27&-1)|0]=a[5247622+(k*9&-1)|0]|0;a[5248702+(k*27&-1)|0]=a[5247623+(k*9&-1)|0]|0;a[5248703+(k*27&-1)|0]=a[5247624+(k*9&-1)|0]|0;a[5248704+(k*27&-1)|0]=a[5247625+(k*9&-1)|0]|0;a[5248705+(k*27&-1)|0]=a[5247626+(k*9&-1)|0]|0;a[5248706+(k*27&-1)|0]=a[5247627+(k*9&-1)|0]|0;a[5248707+(k*27&-1)|0]=a[5247628+(k*9&-1)|0]|0;j=k+1|0;if((j|0)==24){l=0;break}else{k=j}}while(1){k=l&255;a[l+5247884|0]=k;a[l+5247940|0]=k;a[l+5247912|0]=k;k=l+1|0;if((k|0)==27){break}else{l=k}}a[5247884]=12;a[5247885]=13;a[5247886]=14;a[5247896]=9;a[5247897]=10;a[5247898]=11;a[5247893]=3;a[5247894]=4;a[5247895]=5;a[5247887]=0;a[5247888]=1;a[5247889]=2;a[5247902]=21;a[5247903]=22;a[5247904]=23;a[5247905]=20;a[5247906]=19;a[5247907]=18;a[5247946]=3;a[5247947]=4;a[5247948]=5;a[5247952]=6;a[5247953]=7;a[5247954]=8;a[5247955]=12;a[5247956]=13;a[5247957]=14;a[5247943]=15;a[5247944]=16;a[5247945]=17;a[5247964]=23;a[5247965]=22;a[5247966]=21;a[5247961]=24;a[5247962]=25;a[5247963]=26;a[5247918]=0;a[5247919]=1;a[5247920]=2;a[5247912]=15;a[5247913]=16;a[5247914]=17;a[5247927]=9;a[5247928]=10;a[5247929]=11;a[5247921]=6;a[5247922]=7;a[5247923]=8;a[5247936]=18;a[5247937]=19;a[5247938]=20;a[5247930]=26;a[5247931]=25;a[5247932]=24;l=0;k=12;j=15;i=9;g=9;f=3;e=6;b=6;h=3;m=6;n=3;o=6;while(1){a[l+5248036|0]=l&255;a[l+5248063|0]=k;p=a[l+5247940|0]|0;a[l+5248090|0]=p;a[l+5248117|0]=j;a[l+5248144|0]=i;q=p&255;p=a[q+5247940|0]|0;a[l+5248171|0]=p;a[l+5248198|0]=g;a[l+5248225|0]=f;a[l+5248252|0]=a[5247940+(p&255)|0]|0;a[l+5248279|0]=e;a[l+5248306|0]=b;p=a[5247912+(k&255)|0]|0;a[l+5248333|0]=p;r=a[q+5247912|0]|0;a[l+5248360|0]=r;s=a[5247884+(j&255)|0]|0;a[l+5248387|0]=s;a[l+5248414|0]=h;t=a[5247912+(p&255)|0]|0;a[l+5248441|0]=t;p=a[5247884+(d[q+5247884|0]|0)|0]|0;a[l+5248468|0]=p;a[l+5248495|0]=a[5247912+(r&255)|0]|0;a[l+5248522|0]=a[5247884+(s&255)|0]|0;a[l+5248549|0]=m;a[l+5248576|0]=a[5247912+(t&255)|0]|0;a[l+5248603|0]=a[5247884+(p&255)|0]|0;a[l+5248630|0]=n;a[l+5248657|0]=o;p=l+1|0;if((p|0)==27){break}t=a[p+5247884|0]|0;s=a[p+5247912|0]|0;r=t&255;q=a[r+5247884|0]|0;u=s&255;v=a[u+5247912|0]|0;w=a[5247884+(q&255)|0]|0;x=a[r+5247940|0]|0;r=a[5247940+(d[u+5247940|0]|0)|0]|0;l=p;k=t;j=s;i=q;g=v;f=w;e=a[5247912+(v&255)|0]|0;b=x;h=a[5247940+(x&255)|0]|0;m=r;n=a[5247940+(r&255)|0]|0;o=a[5247940+(d[5247940+(d[5247940+(w&255)|0]|0)|0]|0)|0]|0}c[1312008]=1;return}
function cM(a){a=a|0;var b=0,d=0,e=0,f=0,g=0,h=0,i=0,j=0,k=0,l=0,m=0,n=0,o=0,p=0,q=0,r=0,s=0,t=0,u=0,v=0,w=0,x=0,y=0,z=0,A=0,B=0,C=0,D=0,E=0,F=0,G=0,H=0,I=0,J=0,K=0,L=0,M=0,N=0,O=0,P=0,Q=0,R=0,S=0,T=0,U=0,V=0,W=0,X=0,Y=0,Z=0,_=0,$=0,aa=0,ab=0,ac=0,ad=0,ae=0,af=0,ag=0,ah=0,ai=0,ak=0,al=0,am=0,an=0,ap=0,aq=0,ar=0,as=0,at=0,au=0,av=0,aw=0,ax=0,ay=0,az=0,aA=0,aB=0,aC=0,aD=0,aE=0,aF=0,aG=0,aH=0,aI=0;do{if(a>>>0<245){if(a>>>0<11){b=16}else{b=a+11&-8}d=b>>>3;e=c[1311781]|0;f=e>>>(d>>>0);if((f&3|0)!=0){g=(f&1^1)+d|0;h=g<<1;i=5247164+(h<<2)|0;j=5247164+(h+2<<2)|0;h=c[j>>2]|0;k=h+8|0;l=c[k>>2]|0;do{if((i|0)==(l|0)){c[1311781]=e&(1<<g^-1)}else{if(l>>>0<(c[1311785]|0)>>>0){ao();return 0}m=l+12|0;if((c[m>>2]|0)==(h|0)){c[m>>2]=i;c[j>>2]=l;break}else{ao();return 0}}}while(0);l=g<<3;c[h+4>>2]=l|3;j=h+(l|4)|0;c[j>>2]=c[j>>2]|1;n=k;return n|0}if(b>>>0<=(c[1311783]|0)>>>0){o=b;break}if((f|0)!=0){j=2<<d;l=f<<d&(j|-j);j=(l&-l)-1|0;l=j>>>12&16;i=j>>>(l>>>0);j=i>>>5&8;m=i>>>(j>>>0);i=m>>>2&4;p=m>>>(i>>>0);m=p>>>1&2;q=p>>>(m>>>0);p=q>>>1&1;r=(j|l|i|m|p)+(q>>>(p>>>0))|0;p=r<<1;q=5247164+(p<<2)|0;m=5247164+(p+2<<2)|0;p=c[m>>2]|0;i=p+8|0;l=c[i>>2]|0;do{if((q|0)==(l|0)){c[1311781]=e&(1<<r^-1)}else{if(l>>>0<(c[1311785]|0)>>>0){ao();return 0}j=l+12|0;if((c[j>>2]|0)==(p|0)){c[j>>2]=q;c[m>>2]=l;break}else{ao();return 0}}}while(0);l=r<<3;m=l-b|0;c[p+4>>2]=b|3;q=p;e=q+b|0;c[q+(b|4)>>2]=m|1;c[q+l>>2]=m;l=c[1311783]|0;if((l|0)!=0){q=c[1311786]|0;d=l>>>3;l=d<<1;f=5247164+(l<<2)|0;k=c[1311781]|0;h=1<<d;do{if((k&h|0)==0){c[1311781]=k|h;s=f;t=5247164+(l+2<<2)|0}else{d=5247164+(l+2<<2)|0;g=c[d>>2]|0;if(g>>>0>=(c[1311785]|0)>>>0){s=g;t=d;break}ao();return 0}}while(0);c[t>>2]=q;c[s+12>>2]=q;c[q+8>>2]=s;c[q+12>>2]=f}c[1311783]=m;c[1311786]=e;n=i;return n|0}l=c[1311782]|0;if((l|0)==0){o=b;break}h=(l&-l)-1|0;l=h>>>12&16;k=h>>>(l>>>0);h=k>>>5&8;p=k>>>(h>>>0);k=p>>>2&4;r=p>>>(k>>>0);p=r>>>1&2;d=r>>>(p>>>0);r=d>>>1&1;g=c[5247428+((h|l|k|p|r)+(d>>>(r>>>0))<<2)>>2]|0;r=g;d=g;p=(c[g+4>>2]&-8)-b|0;while(1){g=c[r+16>>2]|0;if((g|0)==0){k=c[r+20>>2]|0;if((k|0)==0){break}else{u=k}}else{u=g}g=(c[u+4>>2]&-8)-b|0;k=g>>>0<p>>>0;r=u;d=k?u:d;p=k?g:p}r=d;i=c[1311785]|0;if(r>>>0<i>>>0){ao();return 0}e=r+b|0;m=e;if(r>>>0>=e>>>0){ao();return 0}e=c[d+24>>2]|0;f=c[d+12>>2]|0;L3748:do{if((f|0)==(d|0)){q=d+20|0;g=c[q>>2]|0;do{if((g|0)==0){k=d+16|0;l=c[k>>2]|0;if((l|0)==0){v=0;break L3748}else{w=l;x=k;break}}else{w=g;x=q}}while(0);while(1){q=w+20|0;g=c[q>>2]|0;if((g|0)!=0){w=g;x=q;continue}q=w+16|0;g=c[q>>2]|0;if((g|0)==0){break}else{w=g;x=q}}if(x>>>0<i>>>0){ao();return 0}else{c[x>>2]=0;v=w;break}}else{q=c[d+8>>2]|0;if(q>>>0<i>>>0){ao();return 0}g=q+12|0;if((c[g>>2]|0)!=(d|0)){ao();return 0}k=f+8|0;if((c[k>>2]|0)==(d|0)){c[g>>2]=f;c[k>>2]=q;v=f;break}else{ao();return 0}}}while(0);L3770:do{if((e|0)!=0){f=d+28|0;i=5247428+(c[f>>2]<<2)|0;do{if((d|0)==(c[i>>2]|0)){c[i>>2]=v;if((v|0)!=0){break}c[1311782]=c[1311782]&(1<<c[f>>2]^-1);break L3770}else{if(e>>>0<(c[1311785]|0)>>>0){ao();return 0}q=e+16|0;if((c[q>>2]|0)==(d|0)){c[q>>2]=v}else{c[e+20>>2]=v}if((v|0)==0){break L3770}}}while(0);if(v>>>0<(c[1311785]|0)>>>0){ao();return 0}c[v+24>>2]=e;f=c[d+16>>2]|0;do{if((f|0)!=0){if(f>>>0<(c[1311785]|0)>>>0){ao();return 0}else{c[v+16>>2]=f;c[f+24>>2]=v;break}}}while(0);f=c[d+20>>2]|0;if((f|0)==0){break}if(f>>>0<(c[1311785]|0)>>>0){ao();return 0}else{c[v+20>>2]=f;c[f+24>>2]=v;break}}}while(0);if(p>>>0<16){e=p+b|0;c[d+4>>2]=e|3;f=r+(e+4|0)|0;c[f>>2]=c[f>>2]|1}else{c[d+4>>2]=b|3;c[r+(b|4)>>2]=p|1;c[r+(p+b|0)>>2]=p;f=c[1311783]|0;if((f|0)!=0){e=c[1311786]|0;i=f>>>3;f=i<<1;q=5247164+(f<<2)|0;k=c[1311781]|0;g=1<<i;do{if((k&g|0)==0){c[1311781]=k|g;y=q;z=5247164+(f+2<<2)|0}else{i=5247164+(f+2<<2)|0;l=c[i>>2]|0;if(l>>>0>=(c[1311785]|0)>>>0){y=l;z=i;break}ao();return 0}}while(0);c[z>>2]=e;c[y+12>>2]=e;c[e+8>>2]=y;c[e+12>>2]=q}c[1311783]=p;c[1311786]=m}f=d+8|0;if((f|0)==0){o=b;break}else{n=f}return n|0}else{if(a>>>0>4294967231){o=-1;break}f=a+11|0;g=f&-8;k=c[1311782]|0;if((k|0)==0){o=g;break}r=-g|0;i=f>>>8;do{if((i|0)==0){A=0}else{if(g>>>0>16777215){A=31;break}f=(i+1048320|0)>>>16&8;l=i<<f;h=(l+520192|0)>>>16&4;j=l<<h;l=(j+245760|0)>>>16&2;B=(14-(h|f|l)|0)+(j<<l>>>15)|0;A=g>>>((B+7|0)>>>0)&1|B<<1}}while(0);i=c[5247428+(A<<2)>>2]|0;L3578:do{if((i|0)==0){C=0;D=r;E=0}else{if((A|0)==31){F=0}else{F=25-(A>>>1)|0}d=0;m=r;p=i;q=g<<F;e=0;while(1){B=c[p+4>>2]&-8;l=B-g|0;if(l>>>0<m>>>0){if((B|0)==(g|0)){C=p;D=l;E=p;break L3578}else{G=p;H=l}}else{G=d;H=m}l=c[p+20>>2]|0;B=c[p+16+(q>>>31<<2)>>2]|0;j=(l|0)==0|(l|0)==(B|0)?e:l;if((B|0)==0){C=G;D=H;E=j;break L3578}else{d=G;m=H;p=B;q=q<<1;e=j}}}}while(0);if((E|0)==0&(C|0)==0){i=2<<A;r=k&(i|-i);if((r|0)==0){o=g;break}i=(r&-r)-1|0;r=i>>>12&16;e=i>>>(r>>>0);i=e>>>5&8;q=e>>>(i>>>0);e=q>>>2&4;p=q>>>(e>>>0);q=p>>>1&2;m=p>>>(q>>>0);p=m>>>1&1;I=c[5247428+((i|r|e|q|p)+(m>>>(p>>>0))<<2)>>2]|0}else{I=E}L3593:do{if((I|0)==0){J=D;K=C}else{p=I;m=D;q=C;while(1){e=(c[p+4>>2]&-8)-g|0;r=e>>>0<m>>>0;i=r?e:m;e=r?p:q;r=c[p+16>>2]|0;if((r|0)!=0){p=r;m=i;q=e;continue}r=c[p+20>>2]|0;if((r|0)==0){J=i;K=e;break L3593}else{p=r;m=i;q=e}}}}while(0);if((K|0)==0){o=g;break}if(J>>>0>=((c[1311783]|0)-g|0)>>>0){o=g;break}k=K;q=c[1311785]|0;if(k>>>0<q>>>0){ao();return 0}m=k+g|0;p=m;if(k>>>0>=m>>>0){ao();return 0}e=c[K+24>>2]|0;i=c[K+12>>2]|0;L3606:do{if((i|0)==(K|0)){r=K+20|0;d=c[r>>2]|0;do{if((d|0)==0){j=K+16|0;B=c[j>>2]|0;if((B|0)==0){L=0;break L3606}else{M=B;N=j;break}}else{M=d;N=r}}while(0);while(1){r=M+20|0;d=c[r>>2]|0;if((d|0)!=0){M=d;N=r;continue}r=M+16|0;d=c[r>>2]|0;if((d|0)==0){break}else{M=d;N=r}}if(N>>>0<q>>>0){ao();return 0}else{c[N>>2]=0;L=M;break}}else{r=c[K+8>>2]|0;if(r>>>0<q>>>0){ao();return 0}d=r+12|0;if((c[d>>2]|0)!=(K|0)){ao();return 0}j=i+8|0;if((c[j>>2]|0)==(K|0)){c[d>>2]=i;c[j>>2]=r;L=i;break}else{ao();return 0}}}while(0);L3628:do{if((e|0)!=0){i=K+28|0;q=5247428+(c[i>>2]<<2)|0;do{if((K|0)==(c[q>>2]|0)){c[q>>2]=L;if((L|0)!=0){break}c[1311782]=c[1311782]&(1<<c[i>>2]^-1);break L3628}else{if(e>>>0<(c[1311785]|0)>>>0){ao();return 0}r=e+16|0;if((c[r>>2]|0)==(K|0)){c[r>>2]=L}else{c[e+20>>2]=L}if((L|0)==0){break L3628}}}while(0);if(L>>>0<(c[1311785]|0)>>>0){ao();return 0}c[L+24>>2]=e;i=c[K+16>>2]|0;do{if((i|0)!=0){if(i>>>0<(c[1311785]|0)>>>0){ao();return 0}else{c[L+16>>2]=i;c[i+24>>2]=L;break}}}while(0);i=c[K+20>>2]|0;if((i|0)==0){break}if(i>>>0<(c[1311785]|0)>>>0){ao();return 0}else{c[L+20>>2]=i;c[i+24>>2]=L;break}}}while(0);do{if(J>>>0<16){e=J+g|0;c[K+4>>2]=e|3;i=k+(e+4|0)|0;c[i>>2]=c[i>>2]|1}else{c[K+4>>2]=g|3;c[k+(g|4)>>2]=J|1;c[k+(J+g|0)>>2]=J;i=J>>>3;if(J>>>0<256){e=i<<1;q=5247164+(e<<2)|0;r=c[1311781]|0;j=1<<i;do{if((r&j|0)==0){c[1311781]=r|j;O=q;P=5247164+(e+2<<2)|0}else{i=5247164+(e+2<<2)|0;d=c[i>>2]|0;if(d>>>0>=(c[1311785]|0)>>>0){O=d;P=i;break}ao();return 0}}while(0);c[P>>2]=p;c[O+12>>2]=p;c[k+(g+8|0)>>2]=O;c[k+(g+12|0)>>2]=q;break}e=m;j=J>>>8;do{if((j|0)==0){Q=0}else{if(J>>>0>16777215){Q=31;break}r=(j+1048320|0)>>>16&8;i=j<<r;d=(i+520192|0)>>>16&4;B=i<<d;i=(B+245760|0)>>>16&2;l=(14-(d|r|i)|0)+(B<<i>>>15)|0;Q=J>>>((l+7|0)>>>0)&1|l<<1}}while(0);j=5247428+(Q<<2)|0;c[k+(g+28|0)>>2]=Q;c[k+(g+20|0)>>2]=0;c[k+(g+16|0)>>2]=0;q=c[1311782]|0;l=1<<Q;if((q&l|0)==0){c[1311782]=q|l;c[j>>2]=e;c[k+(g+24|0)>>2]=j;c[k+(g+12|0)>>2]=e;c[k+(g+8|0)>>2]=e;break}if((Q|0)==31){R=0}else{R=25-(Q>>>1)|0}l=J<<R;q=c[j>>2]|0;while(1){if((c[q+4>>2]&-8|0)==(J|0)){break}S=q+16+(l>>>31<<2)|0;j=c[S>>2]|0;if((j|0)==0){T=2542;break}else{l=l<<1;q=j}}if((T|0)==2542){if(S>>>0<(c[1311785]|0)>>>0){ao();return 0}else{c[S>>2]=e;c[k+(g+24|0)>>2]=q;c[k+(g+12|0)>>2]=e;c[k+(g+8|0)>>2]=e;break}}l=q+8|0;j=c[l>>2]|0;i=c[1311785]|0;if(q>>>0<i>>>0){ao();return 0}if(j>>>0<i>>>0){ao();return 0}else{c[j+12>>2]=e;c[l>>2]=e;c[k+(g+8|0)>>2]=j;c[k+(g+12|0)>>2]=q;c[k+(g+24|0)>>2]=0;break}}}while(0);k=K+8|0;if((k|0)==0){o=g;break}else{n=k}return n|0}}while(0);K=c[1311783]|0;if(o>>>0<=K>>>0){S=K-o|0;J=c[1311786]|0;if(S>>>0>15){R=J;c[1311786]=R+o|0;c[1311783]=S;c[R+(o+4|0)>>2]=S|1;c[R+K>>2]=S;c[J+4>>2]=o|3}else{c[1311783]=0;c[1311786]=0;c[J+4>>2]=K|3;S=J+(K+4|0)|0;c[S>>2]=c[S>>2]|1}n=J+8|0;return n|0}J=c[1311784]|0;if(o>>>0<J>>>0){S=J-o|0;c[1311784]=S;J=c[1311787]|0;K=J;c[1311787]=K+o|0;c[K+(o+4|0)>>2]=S|1;c[J+4>>2]=o|3;n=J+8|0;return n|0}do{if((c[1310720]|0)==0){J=aj(8)|0;if((J-1&J|0)==0){c[1310722]=J;c[1310721]=J;c[1310723]=-1;c[1310724]=2097152;c[1310725]=0;c[1311892]=0;c[1310720]=aT(0)&-16^1431655768;break}else{ao();return 0}}}while(0);J=o+48|0;S=c[1310722]|0;K=o+47|0;R=S+K|0;Q=-S|0;S=R&Q;if(S>>>0<=o>>>0){n=0;return n|0}O=c[1311891]|0;do{if((O|0)!=0){P=c[1311889]|0;L=P+S|0;if(L>>>0<=P>>>0|L>>>0>O>>>0){n=0}else{break}return n|0}}while(0);L3837:do{if((c[1311892]&4|0)==0){O=c[1311787]|0;L3839:do{if((O|0)==0){T=2572}else{L=O;P=5247572;while(1){U=P|0;M=c[U>>2]|0;if(M>>>0<=L>>>0){V=P+4|0;if((M+(c[V>>2]|0)|0)>>>0>L>>>0){break}}M=c[P+8>>2]|0;if((M|0)==0){T=2572;break L3839}else{P=M}}if((P|0)==0){T=2572;break}L=R-(c[1311784]|0)&Q;if(L>>>0>=2147483647){W=0;break}q=aN(L|0)|0;e=(q|0)==((c[U>>2]|0)+(c[V>>2]|0)|0);X=e?q:-1;Y=e?L:0;Z=q;_=L;T=2581;break}}while(0);do{if((T|0)==2572){O=aN(0)|0;if((O|0)==-1){W=0;break}g=O;L=c[1310721]|0;q=L-1|0;if((q&g|0)==0){$=S}else{$=(S-g|0)+(q+g&-L)|0}L=c[1311889]|0;g=L+$|0;if(!($>>>0>o>>>0&$>>>0<2147483647)){W=0;break}q=c[1311891]|0;if((q|0)!=0){if(g>>>0<=L>>>0|g>>>0>q>>>0){W=0;break}}q=aN($|0)|0;g=(q|0)==(O|0);X=g?O:-1;Y=g?$:0;Z=q;_=$;T=2581;break}}while(0);L3859:do{if((T|0)==2581){q=-_|0;if((X|0)!=-1){aa=Y;ab=X;T=2592;break L3837}do{if((Z|0)!=-1&_>>>0<2147483647&_>>>0<J>>>0){g=c[1310722]|0;O=(K-_|0)+g&-g;if(O>>>0>=2147483647){ac=_;break}if((aN(O|0)|0)==-1){aN(q|0);W=Y;break L3859}else{ac=O+_|0;break}}else{ac=_}}while(0);if((Z|0)==-1){W=Y}else{aa=ac;ab=Z;T=2592;break L3837}}}while(0);c[1311892]=c[1311892]|4;ad=W;T=2589;break}else{ad=0;T=2589}}while(0);do{if((T|0)==2589){if(S>>>0>=2147483647){break}W=aN(S|0)|0;Z=aN(0)|0;if(!((Z|0)!=-1&(W|0)!=-1&W>>>0<Z>>>0)){break}ac=Z-W|0;Z=ac>>>0>(o+40|0)>>>0;Y=Z?W:-1;if((Y|0)==-1){break}else{aa=Z?ac:ad;ab=Y;T=2592;break}}}while(0);do{if((T|0)==2592){ad=(c[1311889]|0)+aa|0;c[1311889]=ad;if(ad>>>0>(c[1311890]|0)>>>0){c[1311890]=ad}ad=c[1311787]|0;L3879:do{if((ad|0)==0){S=c[1311785]|0;if((S|0)==0|ab>>>0<S>>>0){c[1311785]=ab}c[1311893]=ab;c[1311894]=aa;c[1311896]=0;c[1311790]=c[1310720]|0;c[1311789]=-1;S=0;while(1){Y=S<<1;ac=5247164+(Y<<2)|0;c[5247164+(Y+3<<2)>>2]=ac;c[5247164+(Y+2<<2)>>2]=ac;ac=S+1|0;if((ac|0)==32){break}else{S=ac}}S=ab+8|0;if((S&7|0)==0){ae=0}else{ae=-S&7}S=(aa-40|0)-ae|0;c[1311787]=ab+ae|0;c[1311784]=S;c[ab+(ae+4|0)>>2]=S|1;c[ab+(aa-36|0)>>2]=40;c[1311788]=c[1310724]|0}else{S=5247572;while(1){af=c[S>>2]|0;ag=S+4|0;ah=c[ag>>2]|0;if((ab|0)==(af+ah|0)){T=2604;break}ac=c[S+8>>2]|0;if((ac|0)==0){break}else{S=ac}}do{if((T|0)==2604){if((c[S+12>>2]&8|0)!=0){break}ac=ad;if(!(ac>>>0>=af>>>0&ac>>>0<ab>>>0)){break}c[ag>>2]=ah+aa|0;ac=c[1311787]|0;Y=(c[1311784]|0)+aa|0;Z=ac;W=ac+8|0;if((W&7|0)==0){ai=0}else{ai=-W&7}W=Y-ai|0;c[1311787]=Z+ai|0;c[1311784]=W;c[Z+(ai+4|0)>>2]=W|1;c[Z+(Y+4|0)>>2]=40;c[1311788]=c[1310724]|0;break L3879}}while(0);if(ab>>>0<(c[1311785]|0)>>>0){c[1311785]=ab}S=ab+aa|0;Y=5247572;while(1){ak=Y|0;if((c[ak>>2]|0)==(S|0)){T=2614;break}Z=c[Y+8>>2]|0;if((Z|0)==0){break}else{Y=Z}}do{if((T|0)==2614){if((c[Y+12>>2]&8|0)!=0){break}c[ak>>2]=ab;S=Y+4|0;c[S>>2]=(c[S>>2]|0)+aa|0;S=ab+8|0;if((S&7|0)==0){al=0}else{al=-S&7}S=ab+(aa+8|0)|0;if((S&7|0)==0){am=0}else{am=-S&7}S=ab+(am+aa|0)|0;Z=S;W=al+o|0;ac=ab+W|0;_=ac;K=(S-(ab+al|0)|0)-o|0;c[ab+(al+4|0)>>2]=o|3;do{if((Z|0)==(c[1311787]|0)){J=(c[1311784]|0)+K|0;c[1311784]=J;c[1311787]=_;c[ab+(W+4|0)>>2]=J|1}else{if((Z|0)==(c[1311786]|0)){J=(c[1311783]|0)+K|0;c[1311783]=J;c[1311786]=_;c[ab+(W+4|0)>>2]=J|1;c[ab+(J+W|0)>>2]=J;break}J=aa+4|0;X=c[ab+(J+am|0)>>2]|0;if((X&3|0)==1){$=X&-8;V=X>>>3;L3924:do{if(X>>>0<256){U=c[ab+((am|8)+aa|0)>>2]|0;Q=c[ab+((aa+12|0)+am|0)>>2]|0;R=5247164+(V<<1<<2)|0;do{if((U|0)!=(R|0)){if(U>>>0<(c[1311785]|0)>>>0){ao();return 0}if((c[U+12>>2]|0)==(Z|0)){break}ao();return 0}}while(0);if((Q|0)==(U|0)){c[1311781]=c[1311781]&(1<<V^-1);break}do{if((Q|0)==(R|0)){an=Q+8|0}else{if(Q>>>0<(c[1311785]|0)>>>0){ao();return 0}q=Q+8|0;if((c[q>>2]|0)==(Z|0)){an=q;break}ao();return 0}}while(0);c[U+12>>2]=Q;c[an>>2]=U}else{R=S;q=c[ab+((am|24)+aa|0)>>2]|0;P=c[ab+((aa+12|0)+am|0)>>2]|0;L3945:do{if((P|0)==(R|0)){O=am|16;g=ab+(J+O|0)|0;L=c[g>>2]|0;do{if((L|0)==0){e=ab+(O+aa|0)|0;M=c[e>>2]|0;if((M|0)==0){ap=0;break L3945}else{aq=M;ar=e;break}}else{aq=L;ar=g}}while(0);while(1){g=aq+20|0;L=c[g>>2]|0;if((L|0)!=0){aq=L;ar=g;continue}g=aq+16|0;L=c[g>>2]|0;if((L|0)==0){break}else{aq=L;ar=g}}if(ar>>>0<(c[1311785]|0)>>>0){ao();return 0}else{c[ar>>2]=0;ap=aq;break}}else{g=c[ab+((am|8)+aa|0)>>2]|0;if(g>>>0<(c[1311785]|0)>>>0){ao();return 0}L=g+12|0;if((c[L>>2]|0)!=(R|0)){ao();return 0}O=P+8|0;if((c[O>>2]|0)==(R|0)){c[L>>2]=P;c[O>>2]=g;ap=P;break}else{ao();return 0}}}while(0);if((q|0)==0){break}P=ab+((aa+28|0)+am|0)|0;U=5247428+(c[P>>2]<<2)|0;do{if((R|0)==(c[U>>2]|0)){c[U>>2]=ap;if((ap|0)!=0){break}c[1311782]=c[1311782]&(1<<c[P>>2]^-1);break L3924}else{if(q>>>0<(c[1311785]|0)>>>0){ao();return 0}Q=q+16|0;if((c[Q>>2]|0)==(R|0)){c[Q>>2]=ap}else{c[q+20>>2]=ap}if((ap|0)==0){break L3924}}}while(0);if(ap>>>0<(c[1311785]|0)>>>0){ao();return 0}c[ap+24>>2]=q;R=am|16;P=c[ab+(R+aa|0)>>2]|0;do{if((P|0)!=0){if(P>>>0<(c[1311785]|0)>>>0){ao();return 0}else{c[ap+16>>2]=P;c[P+24>>2]=ap;break}}}while(0);P=c[ab+(J+R|0)>>2]|0;if((P|0)==0){break}if(P>>>0<(c[1311785]|0)>>>0){ao();return 0}else{c[ap+20>>2]=P;c[P+24>>2]=ap;break}}}while(0);as=ab+(($|am)+aa|0)|0;at=$+K|0}else{as=Z;at=K}J=as+4|0;c[J>>2]=c[J>>2]&-2;c[ab+(W+4|0)>>2]=at|1;c[ab+(at+W|0)>>2]=at;J=at>>>3;if(at>>>0<256){V=J<<1;X=5247164+(V<<2)|0;P=c[1311781]|0;q=1<<J;do{if((P&q|0)==0){c[1311781]=P|q;au=X;av=5247164+(V+2<<2)|0}else{J=5247164+(V+2<<2)|0;U=c[J>>2]|0;if(U>>>0>=(c[1311785]|0)>>>0){au=U;av=J;break}ao();return 0}}while(0);c[av>>2]=_;c[au+12>>2]=_;c[ab+(W+8|0)>>2]=au;c[ab+(W+12|0)>>2]=X;break}V=ac;q=at>>>8;do{if((q|0)==0){aw=0}else{if(at>>>0>16777215){aw=31;break}P=(q+1048320|0)>>>16&8;$=q<<P;J=($+520192|0)>>>16&4;U=$<<J;$=(U+245760|0)>>>16&2;Q=(14-(J|P|$)|0)+(U<<$>>>15)|0;aw=at>>>((Q+7|0)>>>0)&1|Q<<1}}while(0);q=5247428+(aw<<2)|0;c[ab+(W+28|0)>>2]=aw;c[ab+(W+20|0)>>2]=0;c[ab+(W+16|0)>>2]=0;X=c[1311782]|0;Q=1<<aw;if((X&Q|0)==0){c[1311782]=X|Q;c[q>>2]=V;c[ab+(W+24|0)>>2]=q;c[ab+(W+12|0)>>2]=V;c[ab+(W+8|0)>>2]=V;break}if((aw|0)==31){ax=0}else{ax=25-(aw>>>1)|0}Q=at<<ax;X=c[q>>2]|0;while(1){if((c[X+4>>2]&-8|0)==(at|0)){break}ay=X+16+(Q>>>31<<2)|0;q=c[ay>>2]|0;if((q|0)==0){T=2687;break}else{Q=Q<<1;X=q}}if((T|0)==2687){if(ay>>>0<(c[1311785]|0)>>>0){ao();return 0}else{c[ay>>2]=V;c[ab+(W+24|0)>>2]=X;c[ab+(W+12|0)>>2]=V;c[ab+(W+8|0)>>2]=V;break}}Q=X+8|0;q=c[Q>>2]|0;$=c[1311785]|0;if(X>>>0<$>>>0){ao();return 0}if(q>>>0<$>>>0){ao();return 0}else{c[q+12>>2]=V;c[Q>>2]=V;c[ab+(W+8|0)>>2]=q;c[ab+(W+12|0)>>2]=X;c[ab+(W+24|0)>>2]=0;break}}}while(0);n=ab+(al|8)|0;return n|0}}while(0);Y=ad;W=5247572;while(1){az=c[W>>2]|0;if(az>>>0<=Y>>>0){aA=c[W+4>>2]|0;aB=az+aA|0;if(aB>>>0>Y>>>0){break}}W=c[W+8>>2]|0}W=az+(aA-39|0)|0;if((W&7|0)==0){aC=0}else{aC=-W&7}W=az+((aA-47|0)+aC|0)|0;ac=W>>>0<(ad+16|0)>>>0?Y:W;W=ac+8|0;_=ab+8|0;if((_&7|0)==0){aD=0}else{aD=-_&7}_=(aa-40|0)-aD|0;c[1311787]=ab+aD|0;c[1311784]=_;c[ab+(aD+4|0)>>2]=_|1;c[ab+(aa-36|0)>>2]=40;c[1311788]=c[1310724]|0;c[ac+4>>2]=27;c[W>>2]=c[1311893]|0;c[W+4>>2]=c[5247576>>2]|0;c[W+8>>2]=c[5247580>>2]|0;c[W+12>>2]=c[5247584>>2]|0;c[1311893]=ab;c[1311894]=aa;c[1311896]=0;c[1311895]=W;W=ac+28|0;c[W>>2]=7;L4043:do{if((ac+32|0)>>>0<aB>>>0){_=W;while(1){K=_+4|0;c[K>>2]=7;if((_+8|0)>>>0<aB>>>0){_=K}else{break L4043}}}}while(0);if((ac|0)==(Y|0)){break}W=ac-ad|0;_=Y+(W+4|0)|0;c[_>>2]=c[_>>2]&-2;c[ad+4>>2]=W|1;c[Y+W>>2]=W;_=W>>>3;if(W>>>0<256){K=_<<1;Z=5247164+(K<<2)|0;S=c[1311781]|0;q=1<<_;do{if((S&q|0)==0){c[1311781]=S|q;aE=Z;aF=5247164+(K+2<<2)|0}else{_=5247164+(K+2<<2)|0;Q=c[_>>2]|0;if(Q>>>0>=(c[1311785]|0)>>>0){aE=Q;aF=_;break}ao();return 0}}while(0);c[aF>>2]=ad;c[aE+12>>2]=ad;c[ad+8>>2]=aE;c[ad+12>>2]=Z;break}K=ad;q=W>>>8;do{if((q|0)==0){aG=0}else{if(W>>>0>16777215){aG=31;break}S=(q+1048320|0)>>>16&8;Y=q<<S;ac=(Y+520192|0)>>>16&4;_=Y<<ac;Y=(_+245760|0)>>>16&2;Q=(14-(ac|S|Y)|0)+(_<<Y>>>15)|0;aG=W>>>((Q+7|0)>>>0)&1|Q<<1}}while(0);q=5247428+(aG<<2)|0;c[ad+28>>2]=aG;c[ad+20>>2]=0;c[ad+16>>2]=0;Z=c[1311782]|0;Q=1<<aG;if((Z&Q|0)==0){c[1311782]=Z|Q;c[q>>2]=K;c[ad+24>>2]=q;c[ad+12>>2]=ad;c[ad+8>>2]=ad;break}if((aG|0)==31){aH=0}else{aH=25-(aG>>>1)|0}Q=W<<aH;Z=c[q>>2]|0;while(1){if((c[Z+4>>2]&-8|0)==(W|0)){break}aI=Z+16+(Q>>>31<<2)|0;q=c[aI>>2]|0;if((q|0)==0){T=2722;break}else{Q=Q<<1;Z=q}}if((T|0)==2722){if(aI>>>0<(c[1311785]|0)>>>0){ao();return 0}else{c[aI>>2]=K;c[ad+24>>2]=Z;c[ad+12>>2]=ad;c[ad+8>>2]=ad;break}}Q=Z+8|0;W=c[Q>>2]|0;q=c[1311785]|0;if(Z>>>0<q>>>0){ao();return 0}if(W>>>0<q>>>0){ao();return 0}else{c[W+12>>2]=K;c[Q>>2]=K;c[ad+8>>2]=W;c[ad+12>>2]=Z;c[ad+24>>2]=0;break}}}while(0);ad=c[1311784]|0;if(ad>>>0<=o>>>0){break}W=ad-o|0;c[1311784]=W;ad=c[1311787]|0;Q=ad;c[1311787]=Q+o|0;c[Q+(o+4|0)>>2]=W|1;c[ad+4>>2]=o|3;n=ad+8|0;return n|0}}while(0);c[aQ()>>2]=12;n=0;return n|0}function cN(a){a=a|0;var b=0,d=0,e=0,f=0,g=0,h=0,i=0,j=0,k=0,l=0,m=0,n=0,o=0,p=0,q=0,r=0,s=0,t=0,u=0,v=0,w=0,x=0,y=0,z=0,A=0,B=0,C=0,D=0,E=0,F=0,G=0,H=0,I=0,J=0,K=0,L=0,M=0,N=0,O=0;if((a|0)==0){return}b=a-8|0;d=b;e=c[1311785]|0;if(b>>>0<e>>>0){ao()}f=c[a-4>>2]|0;g=f&3;if((g|0)==1){ao()}h=f&-8;i=a+(h-8|0)|0;j=i;L4096:do{if((f&1|0)==0){k=c[b>>2]|0;if((g|0)==0){return}l=-8-k|0;m=a+l|0;n=m;o=k+h|0;if(m>>>0<e>>>0){ao()}if((n|0)==(c[1311786]|0)){p=a+(h-4|0)|0;if((c[p>>2]&3|0)!=3){q=n;r=o;break}c[1311783]=o;c[p>>2]=c[p>>2]&-2;c[a+(l+4|0)>>2]=o|1;c[i>>2]=o;return}p=k>>>3;if(k>>>0<256){k=c[a+(l+8|0)>>2]|0;s=c[a+(l+12|0)>>2]|0;t=5247164+(p<<1<<2)|0;do{if((k|0)!=(t|0)){if(k>>>0<e>>>0){ao()}if((c[k+12>>2]|0)==(n|0)){break}ao()}}while(0);if((s|0)==(k|0)){c[1311781]=c[1311781]&(1<<p^-1);q=n;r=o;break}do{if((s|0)==(t|0)){u=s+8|0}else{if(s>>>0<e>>>0){ao()}v=s+8|0;if((c[v>>2]|0)==(n|0)){u=v;break}ao()}}while(0);c[k+12>>2]=s;c[u>>2]=k;q=n;r=o;break}t=m;p=c[a+(l+24|0)>>2]|0;v=c[a+(l+12|0)>>2]|0;L4130:do{if((v|0)==(t|0)){w=a+(l+20|0)|0;x=c[w>>2]|0;do{if((x|0)==0){y=a+(l+16|0)|0;z=c[y>>2]|0;if((z|0)==0){A=0;break L4130}else{B=z;C=y;break}}else{B=x;C=w}}while(0);while(1){w=B+20|0;x=c[w>>2]|0;if((x|0)!=0){B=x;C=w;continue}w=B+16|0;x=c[w>>2]|0;if((x|0)==0){break}else{B=x;C=w}}if(C>>>0<e>>>0){ao()}else{c[C>>2]=0;A=B;break}}else{w=c[a+(l+8|0)>>2]|0;if(w>>>0<e>>>0){ao()}x=w+12|0;if((c[x>>2]|0)!=(t|0)){ao()}y=v+8|0;if((c[y>>2]|0)==(t|0)){c[x>>2]=v;c[y>>2]=w;A=v;break}else{ao()}}}while(0);if((p|0)==0){q=n;r=o;break}v=a+(l+28|0)|0;m=5247428+(c[v>>2]<<2)|0;do{if((t|0)==(c[m>>2]|0)){c[m>>2]=A;if((A|0)!=0){break}c[1311782]=c[1311782]&(1<<c[v>>2]^-1);q=n;r=o;break L4096}else{if(p>>>0<(c[1311785]|0)>>>0){ao()}k=p+16|0;if((c[k>>2]|0)==(t|0)){c[k>>2]=A}else{c[p+20>>2]=A}if((A|0)==0){q=n;r=o;break L4096}}}while(0);if(A>>>0<(c[1311785]|0)>>>0){ao()}c[A+24>>2]=p;t=c[a+(l+16|0)>>2]|0;do{if((t|0)!=0){if(t>>>0<(c[1311785]|0)>>>0){ao()}else{c[A+16>>2]=t;c[t+24>>2]=A;break}}}while(0);t=c[a+(l+20|0)>>2]|0;if((t|0)==0){q=n;r=o;break}if(t>>>0<(c[1311785]|0)>>>0){ao()}else{c[A+20>>2]=t;c[t+24>>2]=A;q=n;r=o;break}}else{q=d;r=h}}while(0);d=q;if(d>>>0>=i>>>0){ao()}A=a+(h-4|0)|0;e=c[A>>2]|0;if((e&1|0)==0){ao()}do{if((e&2|0)==0){if((j|0)==(c[1311787]|0)){B=(c[1311784]|0)+r|0;c[1311784]=B;c[1311787]=q;c[q+4>>2]=B|1;if((q|0)==(c[1311786]|0)){c[1311786]=0;c[1311783]=0}if(B>>>0<=(c[1311788]|0)>>>0){return}cS(0);return}if((j|0)==(c[1311786]|0)){B=(c[1311783]|0)+r|0;c[1311783]=B;c[1311786]=q;c[q+4>>2]=B|1;c[d+B>>2]=B;return}B=(e&-8)+r|0;C=e>>>3;L4201:do{if(e>>>0<256){u=c[a+h>>2]|0;g=c[a+(h|4)>>2]|0;b=5247164+(C<<1<<2)|0;do{if((u|0)!=(b|0)){if(u>>>0<(c[1311785]|0)>>>0){ao()}if((c[u+12>>2]|0)==(j|0)){break}ao()}}while(0);if((g|0)==(u|0)){c[1311781]=c[1311781]&(1<<C^-1);break}do{if((g|0)==(b|0)){D=g+8|0}else{if(g>>>0<(c[1311785]|0)>>>0){ao()}f=g+8|0;if((c[f>>2]|0)==(j|0)){D=f;break}ao()}}while(0);c[u+12>>2]=g;c[D>>2]=u}else{b=i;f=c[a+(h+16|0)>>2]|0;t=c[a+(h|4)>>2]|0;L4203:do{if((t|0)==(b|0)){p=a+(h+12|0)|0;v=c[p>>2]|0;do{if((v|0)==0){m=a+(h+8|0)|0;k=c[m>>2]|0;if((k|0)==0){E=0;break L4203}else{F=k;G=m;break}}else{F=v;G=p}}while(0);while(1){p=F+20|0;v=c[p>>2]|0;if((v|0)!=0){F=v;G=p;continue}p=F+16|0;v=c[p>>2]|0;if((v|0)==0){break}else{F=v;G=p}}if(G>>>0<(c[1311785]|0)>>>0){ao()}else{c[G>>2]=0;E=F;break}}else{p=c[a+h>>2]|0;if(p>>>0<(c[1311785]|0)>>>0){ao()}v=p+12|0;if((c[v>>2]|0)!=(b|0)){ao()}m=t+8|0;if((c[m>>2]|0)==(b|0)){c[v>>2]=t;c[m>>2]=p;E=t;break}else{ao()}}}while(0);if((f|0)==0){break}t=a+(h+20|0)|0;u=5247428+(c[t>>2]<<2)|0;do{if((b|0)==(c[u>>2]|0)){c[u>>2]=E;if((E|0)!=0){break}c[1311782]=c[1311782]&(1<<c[t>>2]^-1);break L4201}else{if(f>>>0<(c[1311785]|0)>>>0){ao()}g=f+16|0;if((c[g>>2]|0)==(b|0)){c[g>>2]=E}else{c[f+20>>2]=E}if((E|0)==0){break L4201}}}while(0);if(E>>>0<(c[1311785]|0)>>>0){ao()}c[E+24>>2]=f;b=c[a+(h+8|0)>>2]|0;do{if((b|0)!=0){if(b>>>0<(c[1311785]|0)>>>0){ao()}else{c[E+16>>2]=b;c[b+24>>2]=E;break}}}while(0);b=c[a+(h+12|0)>>2]|0;if((b|0)==0){break}if(b>>>0<(c[1311785]|0)>>>0){ao()}else{c[E+20>>2]=b;c[b+24>>2]=E;break}}}while(0);c[q+4>>2]=B|1;c[d+B>>2]=B;if((q|0)!=(c[1311786]|0)){H=B;break}c[1311783]=B;return}else{c[A>>2]=e&-2;c[q+4>>2]=r|1;c[d+r>>2]=r;H=r}}while(0);r=H>>>3;if(H>>>0<256){d=r<<1;e=5247164+(d<<2)|0;A=c[1311781]|0;E=1<<r;do{if((A&E|0)==0){c[1311781]=A|E;I=e;J=5247164+(d+2<<2)|0}else{r=5247164+(d+2<<2)|0;h=c[r>>2]|0;if(h>>>0>=(c[1311785]|0)>>>0){I=h;J=r;break}ao()}}while(0);c[J>>2]=q;c[I+12>>2]=q;c[q+8>>2]=I;c[q+12>>2]=e;return}e=q;I=H>>>8;do{if((I|0)==0){K=0}else{if(H>>>0>16777215){K=31;break}J=(I+1048320|0)>>>16&8;d=I<<J;E=(d+520192|0)>>>16&4;A=d<<E;d=(A+245760|0)>>>16&2;r=(14-(E|J|d)|0)+(A<<d>>>15)|0;K=H>>>((r+7|0)>>>0)&1|r<<1}}while(0);I=5247428+(K<<2)|0;c[q+28>>2]=K;c[q+20>>2]=0;c[q+16>>2]=0;r=c[1311782]|0;d=1<<K;do{if((r&d|0)==0){c[1311782]=r|d;c[I>>2]=e;c[q+24>>2]=I;c[q+12>>2]=q;c[q+8>>2]=q}else{if((K|0)==31){L=0}else{L=25-(K>>>1)|0}A=H<<L;J=c[I>>2]|0;while(1){if((c[J+4>>2]&-8|0)==(H|0)){break}M=J+16+(A>>>31<<2)|0;E=c[M>>2]|0;if((E|0)==0){N=2901;break}else{A=A<<1;J=E}}if((N|0)==2901){if(M>>>0<(c[1311785]|0)>>>0){ao()}else{c[M>>2]=e;c[q+24>>2]=J;c[q+12>>2]=q;c[q+8>>2]=q;break}}A=J+8|0;B=c[A>>2]|0;E=c[1311785]|0;if(J>>>0<E>>>0){ao()}if(B>>>0<E>>>0){ao()}else{c[B+12>>2]=e;c[A>>2]=e;c[q+8>>2]=B;c[q+12>>2]=J;c[q+24>>2]=0;break}}}while(0);q=(c[1311789]|0)-1|0;c[1311789]=q;if((q|0)==0){O=5247580}else{return}while(1){q=c[O>>2]|0;if((q|0)==0){break}else{O=q+8|0}}c[1311789]=-1;return}function cO(a){a=a|0;return 5244148}function cP(a){a=a|0;return}function cQ(a){a=a|0;if((a|0)==0){return}cN(a);return}function cR(a){a=a|0;cQ(a);return}function cS(a){a=a|0;var b=0,d=0,e=0,f=0,g=0,h=0,i=0,j=0,k=0,l=0,m=0,n=0,o=0,p=0;do{if((c[1310720]|0)==0){b=aj(8)|0;if((b-1&b|0)==0){c[1310722]=b;c[1310721]=b;c[1310723]=-1;c[1310724]=2097152;c[1310725]=0;c[1311892]=0;c[1310720]=aT(0)&-16^1431655768;break}else{ao();return 0}}}while(0);if(a>>>0>=4294967232){d=0;e=d&1;return e|0}b=c[1311787]|0;if((b|0)==0){d=0;e=d&1;return e|0}f=c[1311784]|0;do{if(f>>>0>(a+40|0)>>>0){g=c[1310722]|0;h=$(((((((-40-a|0)-1|0)+f|0)+g|0)>>>0)/(g>>>0)>>>0)-1|0,g);i=b;j=5247572;while(1){k=c[j>>2]|0;if(k>>>0<=i>>>0){if((k+(c[j+4>>2]|0)|0)>>>0>i>>>0){l=j;break}}k=c[j+8>>2]|0;if((k|0)==0){l=0;break}else{j=k}}if((c[l+12>>2]&8|0)!=0){break}j=aN(0)|0;i=l+4|0;if((j|0)!=((c[l>>2]|0)+(c[i>>2]|0)|0)){break}k=aN(-(h>>>0>2147483646?-2147483648-g|0:h)|0)|0;m=aN(0)|0;if(!((k|0)!=-1&m>>>0<j>>>0)){break}k=j-m|0;if((j|0)==(m|0)){break}c[i>>2]=(c[i>>2]|0)-k|0;c[1311889]=(c[1311889]|0)-k|0;i=c[1311787]|0;n=(c[1311784]|0)-k|0;k=i;o=i+8|0;if((o&7|0)==0){p=0}else{p=-o&7}o=n-p|0;c[1311787]=k+p|0;c[1311784]=o;c[k+(p+4|0)>>2]=o|1;c[k+(n+4|0)>>2]=40;c[1311788]=c[1310724]|0;d=(j|0)!=(m|0);e=d&1;return e|0}}while(0);if((c[1311784]|0)>>>0<=(c[1311788]|0)>>>0){d=0;e=d&1;return e|0}c[1311788]=-1;d=0;e=d&1;return e|0}function cT(a){a=a|0;var b=0,d=0,e=0;b=(a|0)==0?1:a;while(1){d=cM(b)|0;if((d|0)!=0){e=2987;break}a=(B=c[1312505]|0,c[1312505]=B+0,B);if((a|0)==0){break}a$[a&15]()}if((e|0)==2987){return d|0}d=aE(4)|0;c[d>>2]=5247988;al(d|0,5248020,4);return 0}function cU(b){b=b|0;var c=0;c=b;while(a[c]|0!=0){c=c+1|0}return c-b|0}function cV(b,d,e){b=b|0;d=d|0;e=e|0;var f=0;f=b|0;if((b&3)==(d&3)){while(b&3){if((e|0)==0)return f|0;a[b]=a[d]|0;b=b+1|0;d=d+1|0;e=e-1|0}while((e|0)>=4){c[b>>2]=c[d>>2]|0;b=b+4|0;d=d+4|0;e=e-4|0}}while((e|0)>0){a[b]=a[d]|0;b=b+1|0;d=d+1|0;e=e-1|0}return f|0}function cW(b,c){b=b|0;c=c|0;var d=0;do{a[b+d|0]=a[c+d|0];d=d+1|0}while(a[c+(d-1)|0]|0!=0);return b|0}function cX(b,d,e){b=b|0;d=d|0;e=e|0;var f=0,g=0,h=0;f=b+e|0;if((e|0)>=20){d=d&255;e=b&3;g=d|d<<8|d<<16|d<<24;h=f&~3;if(e){e=b+4-e|0;while((b|0)<(e|0)){a[b]=d;b=b+1|0}}while((b|0)<(h|0)){c[b>>2]=g;b=b+4|0}}while((b|0)<(f|0)){a[b]=d;b=b+1|0}}function cY(a,b){a=a|0;b=b|0;aY[a&15](b|0)}function cZ(a,b){a=a|0;b=b|0;return aZ[a&15](b|0)|0}function c_(a,b,c){a=a|0;b=b|0;c=c|0;return a_[a&15](b|0,c|0)|0}function c$(a){a=a|0;a$[a&15]()}function c0(a){a=a|0;aa(0)}function c1(a){a=a|0;aa(1);return 0}function c2(a,b){a=a|0;b=b|0;aa(2);return 0}function c3(){aa(3)}
// EMSCRIPTEN_END_FUNCS
var aY=[c0,c0,cR,c0,cP,c0,bS,c0,c0,c0,c0,c0,c0,c0,c0,c0];var aZ=[c1,c1,c1,c1,c1,c1,c1,c1,cO,c1,c1,c1,c1,c1,c1,c1];var a_=[c2,c2,c2,c2,c2,c2,c2,c2,c2,c2,c2,c2,c2,c2,c2,c2];var a$=[c3,c3,c3,c3,c3,c3,c3,c3,c3,c3,c3,c3,c3,c3,c3,c3];return{_strlen:cU,_free:cN,_main:bj,_memset:cX,_malloc:cM,_memcpy:cV,_set_opts:bi,_solve_wrap:bh,_strcpy:cW,_solve:bg,stackAlloc:a0,stackSave:a1,stackRestore:a2,setThrew:a3,setTempRet0:a4,setTempRet1:a5,setTempRet2:a6,setTempRet3:a7,setTempRet4:a8,setTempRet5:a9,setTempRet6:ba,setTempRet7:bb,setTempRet8:bc,setTempRet9:bd,dynCall_vi:cY,dynCall_ii:cZ,dynCall_iii:c_,dynCall_v:c$}})
// EMSCRIPTEN_END_ASM
({ Math: Math, Int8Array: Int8Array, Int16Array: Int16Array, Int32Array: Int32Array, Uint8Array: Uint8Array, Uint16Array: Uint16Array, Uint32Array: Uint32Array, Float32Array: Float32Array, Float64Array: Float64Array }, { abort: abort, assert: assert, asmPrintInt: asmPrintInt, asmPrintFloat: asmPrintFloat, copyTempDouble: copyTempDouble, copyTempFloat: copyTempFloat, min: Math_min, _strncmp: _strncmp, _llvm_lifetime_end: _llvm_lifetime_end, _sysconf: _sysconf, __scanString: __scanString, ___cxa_throw: ___cxa_throw, __isFloat: __isFloat, _strtok_r: _strtok_r, _abort: _abort, _fprintf: _fprintf, _printf: _printf, _pread: _pread, _fflush: _fflush, __reallyNegative: __reallyNegative, _fputc: _fputc, _strtok: _strtok, ___setErrNo: ___setErrNo, _fwrite: _fwrite, _scanf: _scanf, _llvm_eh_exception: _llvm_eh_exception, _write: _write, _fgetc: _fgetc, _exit: _exit, ___cxa_find_matching_catch: ___cxa_find_matching_catch, ___cxa_allocate_exception: ___cxa_allocate_exception, _read: _read, ___cxa_is_number_type: ___cxa_is_number_type, __formatString: __formatString, ___cxa_does_inherit: ___cxa_does_inherit, __ZSt18uncaught_exceptionv: __ZSt18uncaught_exceptionv, _pwrite: _pwrite, _putchar: _putchar, ___cxa_call_unexpected: ___cxa_call_unexpected, _sbrk: _sbrk, _fscanf: _fscanf, _signal: _signal, ___errno_location: ___errno_location, ___gxx_personality_v0: ___gxx_personality_v0, __ZNSt9exceptionD2Ev: __ZNSt9exceptionD2Ev, _time: _time, _ungetc: _ungetc, __exit: __exit, _strcmp: _strcmp, _llvm_lifetime_start: _llvm_lifetime_start, STACKTOP: STACKTOP, STACK_MAX: STACK_MAX, tempDoublePtr: tempDoublePtr, ABORT: ABORT, NaN: NaN, Infinity: Infinity, _stdout: _stdout, __ZTVN10__cxxabiv120__si_class_type_infoE: __ZTVN10__cxxabiv120__si_class_type_infoE, __ZTISt9exception: __ZTISt9exception, _stderr: _stderr }, buffer);
var _strlen = Module["_strlen"] = asm._strlen;
var _free = Module["_free"] = asm._free;
var _main = Module["_main"] = asm._main;
var _memset = Module["_memset"] = asm._memset;
var _malloc = Module["_malloc"] = asm._malloc;
var _memcpy = Module["_memcpy"] = asm._memcpy;
var _set_opts = Module["_set_opts"] = asm._set_opts;
var _solve_wrap = Module["_solve_wrap"] = asm._solve_wrap;
var _strcpy = Module["_strcpy"] = asm._strcpy;
var _solve = Module["_solve"] = asm._solve;
var dynCall_vi = Module["dynCall_vi"] = asm.dynCall_vi;
var dynCall_ii = Module["dynCall_ii"] = asm.dynCall_ii;
var dynCall_iii = Module["dynCall_iii"] = asm.dynCall_iii;
var dynCall_v = Module["dynCall_v"] = asm.dynCall_v;
Runtime.stackAlloc = function(size) { return asm.stackAlloc(size) };
Runtime.stackSave = function() { return asm.stackSave() };
Runtime.stackRestore = function(top) { asm.stackRestore(top) };
// Warning: printing of i64 values may be slightly rounded! No deep i64 math used, so precise i64 code not included
var i64Math = null;
// === Auto-generated postamble setup entry stuff ===
Module.callMain = function callMain(args) {
  var argc = args.length+1;
  function pad() {
    for (var i = 0; i < 4-1; i++) {
      argv.push(0);
    }
  }
  var argv = [allocate(intArrayFromString("/bin/this.program"), 'i8', ALLOC_STATIC) ];
  pad();
  for (var i = 0; i < argc-1; i = i + 1) {
    argv.push(allocate(intArrayFromString(args[i]), 'i8', ALLOC_STATIC));
    pad();
  }
  argv.push(0);
  argv = allocate(argv, 'i32', ALLOC_STATIC);
  var ret;
  var initialStackTop = STACKTOP;
  try {
    ret = Module['_main'](argc, argv, 0);
  }
  catch(e) {
    if (e.name == 'ExitStatus') {
      return e.status;
    } else if (e == 'SimulateInfiniteLoop') {
      Module['noExitRuntime'] = true;
    } else {
      throw e;
    }
  } finally {
    STACKTOP = initialStackTop;
  }
  return ret;
}
function run(args) {
  args = args || Module['arguments'];
  if (runDependencies > 0) {
    Module.printErr('run() called, but dependencies remain, so not running');
    return 0;
  }
  if (Module['preRun']) {
    if (typeof Module['preRun'] == 'function') Module['preRun'] = [Module['preRun']];
    var toRun = Module['preRun'];
    Module['preRun'] = [];
    for (var i = toRun.length-1; i >= 0; i--) {
      toRun[i]();
    }
    if (runDependencies > 0) {
      // a preRun added a dependency, run will be called later
      return 0;
    }
  }
  function doRun() {
    var ret = 0;
    calledRun = true;
    if (Module['_main']) {
      preMain();
      ret = Module.callMain(args);
      if (!Module['noExitRuntime']) {
        exitRuntime();
      }
    }
    if (Module['postRun']) {
      if (typeof Module['postRun'] == 'function') Module['postRun'] = [Module['postRun']];
      while (Module['postRun'].length > 0) {
        Module['postRun'].pop()();
      }
    }
    return ret;
  }
  if (Module['setStatus']) {
    Module['setStatus']('Running...');
    setTimeout(function() {
      setTimeout(function() {
        Module['setStatus']('');
      }, 1);
      doRun();
    }, 1);
    return 0;
  } else {
    return doRun();
  }
}
Module['run'] = Module.run = run;
// {{PRE_RUN_ADDITIONS}}
if (Module['preInit']) {
  if (typeof Module['preInit'] == 'function') Module['preInit'] = [Module['preInit']];
  while (Module['preInit'].length > 0) {
    Module['preInit'].pop()();
  }
}
initRuntime();
var shouldRunNow = true;
if (Module['noInitialRun']) {
  shouldRunNow = false;
}
if (shouldRunNow) {
  run();
}
// {{POST_RUN_ADDITIONS}}
  // {{MODULE_ADDITIONS}}


var solve = Module.cwrap('solve', 'void', ['string']);
var set_opts = Module.cwrap('set_opts', 'void', ['string']);

this.addEventListener('message', function(e) {
  switch(e.data[0]) {
    case "solve":
      solve(e.data[1]);
      break;
    case "set_opts":
      set_opts(e.data[1]);
      break;
    default:
      //Module.print("Bad message.");
      break;
  }
}, false);
};

var worker;
var startTime = null;


function pad(n, minLength) {
  var str = '' + n;
  while (str.length < minLength) {
    str = '0' + str;
  }
  return str;
}
function prettyTime(endTime) {
  var now = new Date().getTime();
  var cumulative = now - startTime;
  var str = "";
  str += Math.floor(cumulative/1000/60);
  str += ":";
  str += pad(Math.floor(cumulative/1000 % 60), 2);
  str += ".";
  str += pad(Math.floor((cumulative % 1000) / 10), 2);
  return str;
}

// From alg.garron.us
function escapealg(algstr){return algstr.replace(/\n/g, '%0A').replace(/-/g, '%2D').replace(/\'/g, '-').replace(/ /g, '_');}

// http://www.codeproject.com/Articles/321893/Working-with-Inline-Web-Workers
var workerHelpers = workerHelpers || {};

// set the blob builder and window.URL according to the browser prefix if needed
var BlobBuilder = window.BlobBuilder || window.WebKitBlobBuilder || window.MozBlobBuilder;
window.URL = window.URL || window.webkitURL;

workerHelpers.InlineWorkerCreator = function () {
};

workerHelpers.InlineWorkerCreator.prototype = function () {
    createInlineWorker = function (workerBody, onmessage) {
        if (Blob) {
            var bb = new Blob([workerBody]);

            var workerURL = window.URL.createObjectURL(bb);
            var worker = new Worker(workerURL);
            worker.onmessage = onmessage;
            return [worker, workerURL];
        }
        else {
            console.log('BlobBuilder is not supported in the browser');
            return;
        }
    },
    releaseInlineWorker = function (workerURL) {
        window.URL.revokeObjectURL(workerURL);
    };

    return {
        createInlineWorker: createInlineWorker,
        releaseInlineWorker: releaseInlineWorker
    };
} ();

var go = function() {


  var creator = new workerHelpers.InlineWorkerCreator();
  var src = workerSource.toString();
  src = src.slice(0, src.lastIndexOf("}")).substring(src.indexOf("\n") + 1);
  //console.log(src);
  var w = creator.createInlineWorker(src, function(e) {

    console.log(e.data);

    var textarea = document.getElementById("result");
    var timePrefix = "";
    if (startTime != null) {
      timePrefix = "[" + prettyTime() + "] ";
    }
    textarea.innerHTML += timePrefix + e.data + "\n";

    var match = e.data.match(/([^\(]*) \(([^\)]*q[^\)]*f[^\)]*s)\)/)
    /*if (match != null) {
      var el = document.createElement("li");

      var alg = escapealg(match[1] + " // " + match[2]);

      el.innerHTML = "<a href=\"http://alg.garron.us/?alg=" + alg + "&animtype=solve\">" + match[1] + "</a> (" + match[2] + ")";
      document.getElementById("algs").appendChild(el);
    }*/

    textarea.scrollTop = textarea.scrollHeight;
  });
  worker = w[0];
  console.log(worker);
  worker.postMessage("dsf");

  // release the URL after a second
  setTimeout(function () { creator.releaseInlineWorker(w[1]); }, 1000);

  set_all_opts();
}

function solve(str) {
  startTime = new Date().getTime();
  worker.postMessage(["solve", str]); // Send data to our worker.
}

function set_opts(str) {
  worker.postMessage(["set_opts", str]); // Send data to our worker.
}

function set_slice() {
  if (document.getElementById("slice").checked) {
    set_opts("c");
  }
  else{
    set_opts("d");
  }
}

function set_all() {
  if (document.getElementById("all").checked) {
    set_opts("a");
  }
  else{
    set_opts("d");
  }
}

function set_optimal() {
  if (document.getElementById("optimal").checked) {
    set_opts("o");
  }
  else{
    set_opts("p");
  }
}

function set_metric(str) {
  
  var metrics = document.getElementsByName("metric");
  for (i in metrics) {
    if (metrics[i].checked) {
        set_opts(metrics[i].value);
    }
  }
}

function set_all_opts() {
  set_slice();
  set_all();
  set_optimal();
  set_metric();
}

function stop() {
  startTime = null;
  worker.terminate();
  go();
}

window.onload = go;
