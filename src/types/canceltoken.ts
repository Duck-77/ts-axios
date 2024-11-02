/**
 * Represents a token that can be used to cancel requests.
 * A CancelToken is associated with a Promise that resolves when a cancellation is triggered.
 */
export interface CancelToken {
  /**
   * A Promise that resolves to a Cancel instance when the cancellation occurs.
   */
  promise: Promise<Cancel>

  /**
   * An optional Cancel instance representing the reason for cancellation, if any.
   */
  reason?: Cancel

  /**
   * Throws an error if a request has already been canceled.
   * This method is used to enforce that a request can only be sent once.
   */
  throwIfrepeatRequest(): void
}

/**
 * A function type that can be used to cancel a request.
 * It accepts an optional message describing the reason for cancellation.
 */
export interface Canceler {
  (message?: string): void
}

/**
 * The executor function for the CancelToken.
 * This function is called when a new CancelToken is created,
 * and it receives a Canceler function as an argument.
 */
export interface CancelExecutor {
  (cancel: Canceler): void
}

/**
 * Represents a source of a CancelToken, including the token itself and
 * a function to trigger cancellation.
 */
export interface CancelTokenSource {
  /**
   * The CancelToken instance associated with the source.
   */
  token: CancelToken

  /**
   * A Canceler function that can be called to trigger cancellation.
   */
  cancel: Canceler
}

/**
 * Static interface for creating CancelToken instances.
 * Provides a constructor and a method to create a CancelTokenSource.
 */
export interface CancelTokenStatic {
  /**
   * Creates a new CancelToken instance using the provided executor function.
   * @param executor - A function that receives a Canceler function to be called for cancellation.
   */
  new (executor: CancelExecutor): CancelToken

  /**
   * Creates a new CancelTokenSource, which includes a CancelToken and a Canceler function.
   * @returns A CancelTokenSource containing a CancelToken and cancel function.
   */
  source(): CancelTokenSource
}

/**
 * Represents a cancellation message, which can be used to provide context
 * for why a request was canceled.
 */
export interface Cancel {
  /**
   * An optional message describing the reason for cancellation.
   */
  message?: string
}

/**
 * Static interface for creating Cancel instances.
 * Provides a constructor for creating Cancel objects with optional messages.
 */
export interface CancelStatic {
  /**
   * Creates a new Cancel instance with an optional message.
   * @param message - An optional message describing the reason for cancellation.
   */
  new (message?: string): Cancel
}
