import { Canceler, CancelExecutor } from '../types/canceltoken'
import Cancel from './cancel'

class CancelToken {
  promise: Promise<Cancel>
  reason?: Cancel

  constructor(executor: CancelExecutor) {
    let resolve: (message: Cancel) => void
    this.promise = new Promise((res) => {
      resolve = res
    })

    executor((message = '') => {
      // 防止多次调用
      if (this.reason) {
        return
      }
      this.reason = new Cancel(message)
      resolve(this.reason)
    })
  }

  repeatRequest() {
    if (this.reason) {
      throw this.reason
    }
  }

  static source() {
    let cancel!: Canceler
    const token = new CancelToken((callback) => {
      cancel = callback
    })
    return {
      cancel,
      token,
    }
  }
}

export default CancelToken
