import {
    atom,
    selector,
} from 'recoil';

import { LoginParams, Role } from '@/models/login';
import { Locale, User } from '@/models/user';
import { getGlobalState } from '@/models/index';

const initialState: User = {
    ...getGlobalState(),
    noticeCount: 0,
    locale: (
        localStorage.getItem('locale')! 
        || (navigator.languages && navigator.languages[0]) 
        || navigator.language ||'en-us') as Locale,
    newUser: JSON.parse(localStorage.getItem('newUser')!) ?? true,
    logged: true,
    menuList: [],
    username: localStorage.getItem('username') || '',
    role: (localStorage.getItem('username') || '') as Role,
    avatar: 'https://iconfont.alicdn.com/s/a5771840-9a03-41c9-902f-95033c76ec61_origin.svg'
};

export const userState = atom({
    key: 'userState',
    default: initialState,
});

