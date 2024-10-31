declare global {
  namespace NodeJS {
    interface Global {
      getJasmineRequireObj: () => any
    }
  }
}

export {}
