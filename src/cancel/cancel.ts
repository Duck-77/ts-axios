/**
 * Represents a cancellation message for an ongoing request.
 * The Cancel class is used to create cancellation objects that can
 * be thrown to indicate a request has been canceled.
 */
class Cancel {
  /**
   * An optional cancellation message.
   * This can provide context on why the request was canceled.
   */
  message?: string

  /**
   * Creates an instance of Cancel.
   * @param message - An optional message that describes the reason for cancellation.
   */
  constructor(message?: string) {
    this.message = message // Assigns the cancellation message if provided
  }
}

/**
 * Determines whether the provided value is an instance of the Cancel class.
 * This function can be used to check if a request was canceled.
 * @param value - The value to check.
 * @returns {boolean} True if the value is an instance of Cancel, false otherwise.
 */
export function isCancel(value: any): boolean {
  return value instanceof Cancel // Returns true if value is a Cancel instance
}

export default Cancel
