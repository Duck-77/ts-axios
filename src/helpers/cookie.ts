const cookie = {
  /**
   * Enter the name of the cookie and retrieve its value
   * @param name cookie name
   * @returns
   */
  read(name: string): string | null {
    const match = document.cookie.match(new RegExp('(^|;\\s)*(' + name + ')=([^;]*)'))
    return match ? encodeURIComponent(match[3]) : null
  },
}

export default cookie
