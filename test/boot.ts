const JasmineCore = require('jasmine-core')

;(global as any)['getJasmineRequireObj'] = function () {
  return JasmineCore
}
;(global as any)['jasmine'] = JasmineCore

require('jasmine-ajax')
