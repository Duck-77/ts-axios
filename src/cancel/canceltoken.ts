import { Canceler, CancelExecutor } from '../types/canceltoken'
import Cancel from './cancel'

/**
 * Represents a cancel token that can be used to cancel ongoing requests.
 * This class provides the ability to create cancel tokens and handle cancellation.
 */
class CancelToken {
  /**
   * A promise that resolves when the token is canceled.
   * It will resolve with a Cancel object containing the cancellation reason.
   */
  promise: Promise<Cancel>

  /**
   * The reason for the cancellation, if it has occurred.
   * This is an instance of the Cancel class.
   */
  reason?: Cancel

  /**
   * Creates an instance of CancelToken.
   * @param executor - A function that accepts a callback to cancel the request.
   * The executor will be called immediately with the callback function.
   */
  constructor(executor: CancelExecutor) {
    let resolve: (message: Cancel) => void
    this.promise = new Promise((_resolve) => {
      resolve = _resolve
    })

    executor((message) => {
      if (this.reason) {
        return // Prevents multiple calls to cancel
      }
      this.reason = new Cancel(message) // Sets the cancellation reason
      resolve(this.reason) // Resolves the promise with the cancellation reason
    })
  }

  /**
   * Throws an error if the request has already been canceled.
   * This method can be called to check if a request should be skipped.
   * @throws {Cancel} If the request has already been canceled, it throws the Cancel object.
   */
  throwIfrepeatRequest() {
    if (this.reason) {
      throw this.reason // Throws the cancellation reason if already canceled
    }
  }

  /**
   * Creates a new CancelToken and a Canceler function.
   * The Canceler function can be called to cancel the request associated with the token.
   * @returns An object containing the Canceler function and the CancelToken instance.
   */
  static source() {
    let cancel!: Canceler // A variable to hold the cancel function
    const token = new CancelToken((callback) => {
      cancel = callback // Assigns the callback to the cancel function
    })
    return {
      cancel, // The Canceler function
      token, // The created CancelToken
    }
  }
}

export default CancelToken
