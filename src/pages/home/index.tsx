import React, { FC } from "react";
import "./index.scss";
import WrapList from '../../constant/home-list.ts'
const Index: FC = () => {
  const handleLeftIcon = (e) => {
    e.preventDefault()
    const wrapperListDom = document.querySelector('.wrapper-list') as HTMLDivElement
    const target = e.target
    const originClassName = target.getAttribute('class')
    const hasDisabled = originClassName.includes('disabled')
    if(hasDisabled) return
    wrapperListDom.style.transform = 'translateX(0)'
    target.setAttribute('class', `${originClassName} disabled`)

    const iconToolRightDom = document.querySelector('.icon-tool-right')
    iconToolRightDom.setAttribute('class', 'icon-tool-right')
  }

  const handleRightIcon = (e) => {
    e.preventDefault()
    const wrapperListDom = document.querySelector('.wrapper-list') as HTMLDivElement
    
    const target = e.target
    const originClassName = target.getAttribute('class')
    
    const hasDisabled = originClassName.includes('disabled')
    if(hasDisabled) return
    wrapperListDom.style.transform = 'translateX(-400px)'
    target.setAttribute('class', `${originClassName} disabled`)

    const iconToolLeftDom = document.querySelector('.icon-tool-left')
    iconToolLeftDom.setAttribute('class', 'icon-tool-left')
  }
  return (
    <div>
      <div className="index-list-home">
        <h3 className="title">
          <span>👋</span>Hello, NFT Holders!
        </h3>
        <div className="wrapper-outer-list">
          <ul className="wrapper-list">
            {
              WrapList.map(((item, index) => (
                <li key={index}>
                  <div className="sub-title">
                    <i className="sub-title-icon"></i><i className="sub-title-info">{item.title}</i>
                    {item.hasButton && <span className="sub-title-button">Farm</span>}
                    
                  </div>
                  <p className="content-info">
                    {item.content}
                  </p>
                  <a
                    href={item.href}
                    target="_blank"
                    className="wrapper-read-more"
                  >Read More</a>
                </li>
              )))
            }
          </ul>
        </div>
        <div className="scroll-tools">
          <div className="scroll-tools-inner">
            <i className="icon-tool-left disabled" onClick={(e) => handleLeftIcon(e)}></i>
            <i className="icon-tool-right" onClick={(e) => handleRightIcon(e)}></i>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
