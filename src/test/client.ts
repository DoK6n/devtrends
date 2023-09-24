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
