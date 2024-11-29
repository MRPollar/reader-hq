import { RouteLocationRaw } from "vue-router"

interface IRoute{
    pathname: string;
    icon: string;
    to: RouteLocationRaw;
}

export default IRoute;