
import { routes } from "./router/routes";

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
window.overviewScope = {
    appName: 'overview'
}

export const bootstrap = () => {
    return {
        appName: 'overview',
        routes
    }
}