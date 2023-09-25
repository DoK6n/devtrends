interface ApiConfig {
  baseURL: string
  prefix: string
}

abstract class AbstractApi {
  constructor(protected config: ApiConfig) { }

  buildUrl(endpoint: string, params?: Record<string, any>): URL {
    const url = new URL(`${this.config.baseURL}${this.config.prefix}${endpoint}`)
    if (params) {
      url.search = new URLSearchParams(params).toString()
    }
    return url;
  }

  abstract get<T>(endpoint: string, params?: Record<string, any>): Promise<T>
  abstract post<T>(endpoint: string, data: Record<string, any>): Promise<T>
  abstract put<T>(endpoint: string, data: Record<string, any>): Promise<T>
  abstract delete<T>(endpoint: string, params?: Record<string, any>): Promise<T>
  abstract patch<T>(endpoint: string, data: Record<string, any>): Promise<T>
}

export class Api extends AbstractApi {
  constructor(config: ApiConfig) {
    super(config); // 부모 클래스의 생성자를 호출
  }

  async get<T>(endpoint: string, params?: Record<string, any>): Promise<T> {
    const url = this.buildUrl(endpoint, params);
    const request = new Request(url.toString(), { method: 'GET' });
    // 실제 API 요청 코드를 여기에 작성하거나, request 객체를 반환합니다.
    return request.json() as T
  }

  async post<T>(endpoint: string, data: Record<string, any>): Promise<T> {
    const url = this.buildUrl(endpoint);
    const request = new Request(url.toString(), {
      method: 'POST',
      body: JSON.stringify(data),
      headers: { 'Content-Type': 'application/json' },
    });
    // 실제 API 요청 코드를 여기에 작성하거나, request 객체를 반환합니다.
    return request.json() as T
  }

  async put<T>(endpoint: string, data: Record<string, any>): Promise<T> {
    const url = this.buildUrl(endpoint);
    const request = new Request(url.toString(), {
      method: 'PUT',
      body: JSON.stringify(data),
      headers: { 'Content-Type': 'application/json' },
    });
    // 실제 API 요청 코드를 여기에 작성하거나, request 객체를 반환합니다.
    return request.json() as T
  }

  async delete<T>(endpoint: string, params?: Record<string, any>): Promise<T> {
    const url = this.buildUrl(endpoint, params);
    const request = new Request(url.toString(), { method: 'DELETE' });
    // 실제 API 요청 코드를 여기에 작성하거나, request 객체를 반환합니다.
    return request.json() as T
  }

  async patch<T>(endpoint: string, data: Record<string, any>): Promise<T> {
    const url = this.buildUrl(endpoint);
    const request = new Request(url.toString(), {
      method: 'PATCH',
      body: JSON.stringify(data),
      headers: { 'Content-Type': 'application/json' },
    });
    // 실제 API 요청 코드를 여기에 작성하거나, request 객체를 반환합니다.
    return request.json() as T
  }
}


export const reqBase = (path: string, options?: RequestInit) =>
  new Request(`http://localhost${path}`, options)

export const req = (path: string, options?: RequestInit) =>
  reqBase(`/v1${path}`, options)

type MaybeArray<T> = T | T[]

export const upload = (
  path: string,
  fields: Record<
    string,
    // eslint-disable-next-line @typescript-eslint/ban-types
    MaybeArray<(string & {}) | 'aris-yuzu.jpg' | 'midori.png' | 'millenium.jpg'>
  >,
) => {
  const body = new FormData()
  // eslint-disable-next-line no-magic-numbers
  let size = 0

  for (const [key, value] of Object.entries(fields)) {
    if (Array.isArray(value))
      value.forEach(value => {
        const file = Bun.file(`./test/images/${value}`)
        size += file.size
        body.append(key, file)
      })
    else if (value.includes('.')) {
      const file = Bun.file(`./test/images/${value}`)
      size += file.size
      body.append(key, file)
    } else body.append(key, value)
  }

  return {
    request: new Request(`http://localhost${path}`, {
      method: 'POST',
      body,
    }),
    size,
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const post = (path: string, body: Record<string, any>) =>
  new Request(`http://localhost/v1${path}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  })

export const delay = (delay: number) =>
  new Promise(resolve => setTimeout(resolve, delay))
