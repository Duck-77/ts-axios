const cookie = {
  /**
   * 传入cookie的名称,获取cookie的值
   * @param name 需要获取的cookie的值
   * @returns
   */
  read(name: string): string | null {
    const match = document.cookie.match(new RegExp('(^|;\\s)*(' + name + ')=([^;]*)'))
    return match ? encodeURIComponent(match[3]) : null
  },
}

export default cookie
