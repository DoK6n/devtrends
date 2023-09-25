interface ReqConfig {
  baseURL: string
  prefix: string
}

abstract class AbstractReq {
  constructor(protected config: ReqConfig) {}

  protected _buildURL(path: string, params?: Record<string, any>): URL {
    const url = new URL(`${this.config.baseURL}${path}`)
    if (params) {
      url.search = new URLSearchParams(params).toString()
    }
    return url
  }

  buildURL(path: string, params?: Record<string, any>): URL {
    const url = new URL(`${this.config.baseURL}${this.config.prefix}${path}`)
    if (params) {
      url.search = new URLSearchParams(params).toString()
    }
    return url
  }

  abstract _get(path: string, params?: Record<string, any>): Request
  abstract get(path: string, params?: Record<string, any>): Request
  abstract post(path: string, data: Record<string, any>): Request
  abstract put(path: string, data: Record<string, any>): Request
  abstract delete(path: string, params?: Record<string, any>): Request
  abstract patch(path: string, data: Record<string, any>): Request
}

export class Req extends AbstractReq {
  constructor(config: ReqConfig) {
    super(config) // 부모 클래스의 생성자를 호출
  }

  _get(path: string, params?: Record<string, any>) {
    const url = this._buildURL(path, params)
    return new Request(url.toString(), { method: 'GET' })
  }

  get(path: string, params?: Record<string, any>) {
    const url = this.buildURL(path, params)
    return new Request(url.toString(), { method: 'GET' })
  }

  post(path: string, body: Record<string, any>) {
    const url = this.buildURL(path)
    return new Request(url.toString(), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })
  }

  put(path: string, body: Record<string, any>) {
    const url = this.buildURL(path)
    return new Request(url.toString(), {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })
  }

  delete(path: string, params?: Record<string, any>) {
    const url = this.buildURL(path, params)
    return new Request(url.toString(), { method: 'DELETE' })
  }

  patch(path: string, body: Record<string, any>) {
    const url = this.buildURL(path)
    return new Request(url.toString(), {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })
  }
}

export const sleep = (delay: number) =>
  new Promise(resolve => setTimeout(resolve, delay))
