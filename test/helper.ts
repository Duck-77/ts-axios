// 使用jasmine伪造网络响应

export function getAjaxRequest(): Promise<JasmineAjaxRequest> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(jasmine.Ajax.requests.mostRecent())
    }, 0)
  })
}
