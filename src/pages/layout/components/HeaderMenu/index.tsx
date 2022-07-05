import { parseParams } from '@utils/utils';
import { Button, message, Popover } from 'antd';
import classnames from 'classnames';
import React, { FC, useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import styles from './index.module.less';
const menus = [
    {
        path: '/home',
        name: '主页',
    },
    {
        path: '/model',
        name: '模型',
        children: [
            {
                path: '/model?id=1',
                name: '智慧园区复杂体系'
            },
            {
                path: '/model?id=2',
                name: '智慧城市复杂体系'
            },
            {
                path: '/model?id=3',
                name: '中关村环保园'
            }
        ]
    },
    {
        path: '/data',
        name: '数据',
    },
    {
        path: '/arithmetic',
        name: '算法',
    },
];

function getPathIndex(path: string) {
    for (let i = 0; i < menus.length; i++) {
        let item = menus[i]
        if (path.startsWith(item.path)) {
            return i
        }
    }

    return -1;
}
const HeaderMenu: FC = () => {
    const [index, setIndex] = useState(-1);
    const [itemIndex, setItemIndex] = useState(-1);
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const { pathname } = location;
        setIndex(getPathIndex(pathname))
        //根据路径和id判定选中的子列表
        if (pathname === '/model') {
             let {id} = parseParams(location.search);
             if(id){
                 console.log(id)
                 setItemIndex(Number.parseInt(id)-1)
             }
        } else {
            setItemIndex(-1)
        }
    }, [location])

    const handleClick = (item: any, i: number) => {
        navigate(item.path)
    }

    const handleMenuItemClick = (item: any, i: number) => {
        navigate(item.path)
        // setItemIndex(i)
    }
    return <div className={styles.headerMenus}>
        {
            menus.map((item, i) => (
                item.children ? (
                    <Popover content={<div>
                        {
                            item?.children?.map?.((listItem, index) => <div
                                onClick={() => handleMenuItemClick(listItem, index)}
                                className={classnames(styles.overItem, { [styles.overItem_active]: itemIndex === index })}>
                                {listItem.name}
                            </div>)
                        }
                    </div>} >
                        <div
                            key={i}
                            // onClick={() => handleClick(item, i)}
                            className={classnames(styles.menuItem, { [styles.menuItem_active]: i === index })}
                        >
                            {item.name}
                        </div>
                    </Popover>

                ) :
                    <div
                        key={i}
                        onClick={() => handleClick(item, i)}
                        className={classnames(styles.menuItem, { [styles.menuItem_active]: i === index })}
                    >
                        {item.name}
                    </div>
            ))
        }
    </div>
}

export default HeaderMenu;