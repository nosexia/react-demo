import React, { FC, MouseEvent } from "react";
import s from "./index.scss";
import WrapList from '../../constant/home-list'
import classname from 'classnames'
const Index: FC = () => {
  const handleLeftIcon = (e:MouseEvent) => {
    e.preventDefault()
    const wrapperListDom = document.querySelector(`\.${s.wrapperList}`) as HTMLDivElement
    const target = e.target as HTMLDivElement
    const originClassName = target.getAttribute('class') as string
    const hasDisabled = originClassName.includes(`${s.disabled}`)
    if(hasDisabled) return
    wrapperListDom.style.transform = 'translateX(0)'
    target.setAttribute('class', `${originClassName} ${s.disabled}`)

    const iconToolRightDom = document.querySelector(`\.${s.iconToolRight}`) as HTMLDivElement
    iconToolRightDom.setAttribute('class', `${s.iconToolRight}`)
  }

  const handleRightIcon = (e:MouseEvent) => {
    e.preventDefault()
    const wrapperListDom = document.querySelector(`\.${s.wrapperList}`) as HTMLDivElement
    
    const target = e.target as HTMLDivElement
    const originClassName = target.getAttribute('class') as string
    
    const hasDisabled = originClassName.includes(`${s.disabled}`)
    if(hasDisabled) return
    wrapperListDom.style.transform = 'translateX(-400px)'
    target.setAttribute('class', `${originClassName} ${s.disabled}`)

    const iconToolLeftDom = document.querySelector(`\.${s.iconToolLeft}`) as HTMLDivElement;
    iconToolLeftDom.setAttribute('class', `${s.iconToolLeft}`)
  }
  return (
    <div>
      <div className={s.indexListHome}>
        <h3 className={s.title}>
          <span>👋</span>Hello, NFT Holders!
        </h3>
        <div className={s.wrapperOuterList}>
          <ul className={s.wrapperList}>
            {
              WrapList.map(((item, index) => (
                <li key={index}>
                  <div className={s.subTitle}>
                    <i className={s.subTitleIcon}></i><i className={s.subTitleInfo}>{item.title}</i>
                    {item.hasButton && <span className={s.subTitleButton}>Farm</span>}
                    
                  </div>
                  <p className={s.contentInfo}>
                    {item.content}
                  </p>
                  <a
                    href={item.href}
                    target="_blank"
                    className={s.wrapperReadMore}
                  >Read More</a>
                </li>
              )))
            }
          </ul>
        </div>
        <div className={s.scrollTools}>
          <div className={s.scrollToolsInner}>
            <i className={classname(s.iconToolLeft, s.disabled)} onClick={(e) => handleLeftIcon(e)}></i>
            <i className={s.iconToolRight} onClick={(e) => handleRightIcon(e)}></i>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
