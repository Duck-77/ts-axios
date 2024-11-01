import { Canceler, CancelExecutor } from '../types/canceltoken'
import Cancel from './cancel'

class CancelToken {
  promise: Promise<Cancel>
  reason?: Cancel

  constructor(executor: CancelExecutor) {
    let resolve: (message: Cancel) => void
    this.promise = new Promise((_resolve) => {
      resolve = _resolve
    })

    executor((message) => {
      if (this.reason) {
        return
      }
      this.reason = new Cancel(message)
      resolve(this.reason)
    })
  }

  throwIfrepeatRequest() {
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
