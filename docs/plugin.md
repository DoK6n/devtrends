# PlugIn

> code path : `src/index.ts Elysia class`

## Elysia Class Method
- `public use`
  - plugin이 Promise라면 this.`lazyLoadModules`에 push를 한다.
    - push할때 plugin은 Promise이므로 then안에서 plugin의 type이 `'function'`인지 확인 후 일치하면 `plugin(this)`를 반환하고, 
      아니라면 plugin.default가 `'function'`인지 확인 후 plugin.default(this)를 반환한다
    - 위 조건에 해당하지 않는 경우 `this_use(plugin)`을 반환한다.
    - 이후 다음 then에서 `compile()` 함수를 실행한 결과를 반환한다.
  - plugin이 Promise가 아닌 경우 `this._use(plugin)`을 반환한다.
  - method들은 대부분 마지막에 항상 this를 반환함 (모든 method를 다 확인한건 아님)
  
  <details>
  <summary>show code</summary>
  
  ```typescript
	/**
	 * ### use
	 * Merge separate logic of Elysia with current
	 *
	 * ---
	 * @example
	 * ```typescript
	 * const plugin = (app: Elysia) => app
	 *     .get('/plugin', () => 'hi')
	 *
	 * new Elysia()
	 *     .use(plugin)
	 * ```
	 */
	use(
		plugin:
			| Elysia<any, any, any, any, any, any>
			| MaybePromise<
					(
						app: Elysia<any, any, any, any, any, any>
					) => MaybePromise<Elysia<any, any, any, any, any, any>>
			  >
			| Promise<{
					default: Elysia<any, any, any, any, any, any>
			  }>
			| Promise<{
					default: (
						elysia: Elysia<any, any, any, any, any, any>
					) => MaybePromise<Elysia<any, any, any, any, any, any>>
			  }>
	): Elysia<any, any, any, any, any, any> {
		if (plugin instanceof Promise) {
			this.lazyLoadModules.push(
				plugin
					.then((plugin) => {
						if (typeof plugin === 'function')
							return plugin(
								this as unknown as any
							) as unknown as Elysia

						if (typeof plugin.default === 'function')
							return plugin.default(
								this as unknown as any
							) as unknown as Elysia

						// @ts-ignore
						return this._use(plugin)
					})
					.then((x) => x.compile())
			)

			return this as unknown as any
		} else return this._use(plugin)

		return this
	}
  ```
  </details>
  
- **private _use**
  - plugin을 use를 호출한 메인 서버의 인스턴스로 병합한다.
  - use에 넣은 plugin이 함수로 넣었는지, new Elysia를 통해 새 인스턴스를 넣었는지 여부는 내부적으로 검사한다.
  - 파라미터로 넘어온 plugin이 함수인 경우 plugin을 실행한 결과를 반환하거나 Promise인 경우 lazyLoadModules에 push후 this를 반환
  - plugin이 함수가 아닌경우 (`new Elysia`를 통해 만든 plugin)
    this(메인 서버 인스턴스)에서 getServer() 메소드가 반환한 값을 plugin.getServer에 할당
  - plugin에 추가된 route, plugin, decorate, state, error, store를 this.decorate, this.state, this.model 등에 넣는다.

  <details>
  <summary>show code</summary>

  ```typescript
    private _use(
      plugin:
        | Elysia<any, any, any, any, any, any>
        | ((
            app: Elysia<any, any, any, any, any, any>
          ) => MaybePromise<Elysia<any, any, any, any, any, any>>)
    ) {
      if (typeof plugin === 'function') {
        const instance = plugin(this as unknown as any) as unknown as any
        if (instance instanceof Promise) {
          this.lazyLoadModules.push(instance.then((x) => x.compile()))

          return this as unknown as any
        }

        return instance
      }

      const { name, seed } = plugin.config

      plugin.getServer = () => this.getServer()

      const isScoped = plugin.config.scoped
      if (isScoped) {
        if (name) {
          if (!(name in this.dependencies)) this.dependencies[name] = []

          const current =
            seed !== undefined
              ? checksum(name + JSON.stringify(seed))
              : 0

          if (
            this.dependencies[name].some(
              (checksum) => current === checksum
            )
          )
            return this

          this.dependencies[name].push(current)
        }

        plugin.model(this.definitions.type as any)
        plugin.error(this.definitions.error as any)

        plugin.onRequest((context) => {
          Object.assign(context, this.decorators)
          Object.assign(context.store, this.store)
        })

        plugin.event.trace = [...this.event.trace, ...plugin.event.trace]

        if (plugin.config.aot) plugin.compile()

        const instance = this.mount(plugin.fetch)
        this.routes = this.routes.concat(instance.routes)

        return this
      }

      this.decorate(plugin.decorators)
      this.state(plugin.store)
      this.model(plugin.definitions.type)
      this.error(plugin.definitions.error)

      for (const { method, path, handler, hooks } of Object.values(
        plugin.routes
      )) {
        this.add(
          method,
          path,
          handler,
          mergeHook(hooks as LocalHook<any, any, any, any, any, any>, {
            error: plugin.event.error
          })
        )
      }

      if (!isScoped)
        if (name) {
          if (!(name in this.dependencies)) this.dependencies[name] = []

          const current =
            seed !== undefined
              ? checksum(name + JSON.stringify(seed))
              : 0

          if (
            this.dependencies[name].some(
              (checksum) => current === checksum
            )
          )
            return this

          this.dependencies[name].push(current)
          this.event = mergeLifeCycle(
            this.event,
            filterGlobalHook(plugin.event),
            current
          )
        } else
          this.event = mergeLifeCycle(
            this.event,
            filterGlobalHook(plugin.event)
          )

      return this
    }

  ```
  </details>