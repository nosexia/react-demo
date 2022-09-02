import React, { FC, useState } from "react";
import s from "./Header.scss";
import links from '../constant/links.ts'
import { useLocation } from 'react-router-dom'
const logoSrc = require("../assets/image/logo.png");
const birdSrc = require("../assets/image/brid.png");
const wawaSrc = require("../assets/image/wawa.png");
const githubSrc = require("../assets/image/github.png");

const Header: FC = () => {
  const location = useLocation()
  let {pathname} = location
  pathname = pathname.slice(1)
  const [showWallet, setShowWallet] = useState<boolean>(false)
  const handleWalletShow = (e) => {
    e.preventDefault()
    setShowWallet((showWallet) => {
      return !showWallet
    })
  }
  return (
    <div className={s.headerWrapperOuter}>
      <div className={s.wrapperInner}>
        <span className={pathname === 'home' ? s.active : ''}> Home</span>
        <span className={pathname === '' ? s.active : ''}>Swap</span>
        <span >Farm</span>
        <span >$ve721</span>
        <span >Claim</span>
      </div>
      <img src={logoSrc} className={s.logo} />
      <div className={s.wrapperInnerRight}>
        <div className={s.linkList}>
          <a href={links.twitterIconUrl} target="_blank">
            <img src={birdSrc} className={s.imageBrid} />
          </a>
          <a href={links.swapIconUrl} target="_blank">
            <img src={wawaSrc} className={s.imageWawa} />
          </a>
          <a href={links.githubUrl} target="_blank">
            <img src={githubSrc} className={s.imageGithub} />
          </a>
        </div>

        <div className={s.wrapperToolList}>
          <input type="button" value="Buy $721" className={s.wrapperTool1} />
          <input type="button" value="Connect Wallet" className={s.wrapperTool2} onClick={e => handleWalletShow(e)} />

          {showWallet && <div className={s.innerToolList}>
            <h5 className={s.title}>Connect Wallet<i onClick={() => setShowWallet(false)}></i></h5>
            <div className={s.boxWallet1}>MetaMask</div>
            <div className={s.boxWallet2}>WalletConnect</div>
          </div>}
        </div>
      </div>
    </div>
  );
};

export default Header;
