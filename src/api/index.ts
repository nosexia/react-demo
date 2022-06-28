import { MenuList } from "@/models/menu.interface";
import { LoginParams, LoginResult } from "@/models/login";
import { CurrentUserResult } from "@/models/user";
import { useBatch, useCreate, useGetList, useGetOne, useUpdate } from "./request";
import { createBrowserHistory } from 'history';
const projectResource = '/projects';
const history = createBrowserHistory();
const location = history.location;
export const useLogin = () => {
    return useCreate<LoginParams, LoginResult>("/login");
}

export const useGetCurrentUser = (navigate:any) => {
    let token = localStorage.getItem('token');
    // if(token === null) {
    //     return new Promise((resolve, reject) => {
    //         navigate(`/login?redirect=${location.pathname}${location.search}`);
    //         //不发出请求
    //         resolve({data:null, error:null})
    //     })
    // }
    return useGetOne<CurrentUserResult>(
        "CurrentUser",
        "/spw/userCenter/getUserInfo"
      );
}

export const useGetCurrentMenus = () => {
    return useGetList<MenuList>("CurrentMenuList",
        "/current/menu"
    );

}
export const useGetProjects = (pagination: any, filters: any) => {
    return useGetList<API.ProjectPagination>(
        "Projects",
        projectResource,
        pagination,
        filters
    );
}
export const useAddProject = () => {
    return useCreate<API.Project, API.Project>(projectResource);
}

export const useUpdateProject = () => {
    return useUpdate<API.Project>(projectResource);
}

export const useBatchDeleteProject = () => {
    return useBatch(projectResource + ':batchDelete');
}
