import VueRouter, { RouteConfig } from "vue-router"
import { Store } from "vuex"

type AppName = 'poratl' | 'overview'

interface RemoteApp {
    name: AppName
    chunk: string
}

interface AppBootstrap {
    name: AppName
    routes: RouteConfig[]
    storeModule: Record<string, Store<object>>
}

interface AppComponent {
    bootstrap: () => Promise<AppBootstrap>
}

export async function loadScript(url: string) {
    return new Promise((resolve, reject) => {
        const element = document.createElement('script')

        element.src = url
        element.type = 'text/javascript'
        element.async = false

        element.onload = () => {
            console.info(`Dynamic Script Loaded: ${url}`)
            resolve(url)
        }

        element.onerror = () => {
            console.error(`Dynamic Script Error: ${url}`)
            reject(url)
        }

        document.head.appendChild(element)
    })
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function loadComponent(scope: any, moduleName: string): Promise<AppComponent> {

    await __webpack_init_sharing__('default') 

    const container = window[scope] as any

    await container.init(__webpack_share_scopes__.default)

    const factory = await container.get(moduleName)

    const Module = factory()
    return Module
}

export async function initChunks(remoteList: RemoteApp[], config: {
    router: VueRouter
    store: Store<object>
}) {
    return await Promise.all(
        remoteList.map(async ({ chunk, name }) => {
            try {
                await loadScript(chunk)
                const { bootstrap } = await loadComponent(name, './exports')

                if (bootstrap) {
                    const { routes } = await bootstrap()

                    // 注册子应用的 vuex
                    // Object.entries(storeModule).forEach(([key, value]) => {
                    //     config.store.registerModule(key, value)
                    // })
                    // 注册子应用的路由
                    config.router?.addRoutes(routes)
                } else {
                    console.warn(`${name} chunk must be export bootstrap.`)
                }
            } catch (error) {
                console.error(error)
            }
        })
    )
}
