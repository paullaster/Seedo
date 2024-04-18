import routes from "./routes";
import links from "./links";
import { addNavLink } from "@/util";
import { useGlobalStore } from "@/store";

export default {
    install(app, options) {
        if(options.router) {
            options.router.addRoute(routes);
            addNavLink(useGlobalStore().addNavLink, links)
        }
    }
}