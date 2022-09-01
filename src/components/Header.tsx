import React, { FC, useState } from "react";
import "./Header.scss";
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
    <div className="header-wrapperOuter">
      <div className="wrapperInner">
        <span className={pathname === 'home' ? 'active' : ''}> Home</span>
        <span className={pathname === '' ? 'active' : ''}>Swap</span>
        <span className="fa">Farm</span>
        <span className="ga">$ve721</span>
        <span className="ha">Claim</span>
      </div>
      <img src={logoSrc} className="logo" />
      <div className="wrapper-inner-right">
        <div className="link-list">
          <a href={links.twitterIconUrl} target="_blank">
            <img src={birdSrc} className="image-brid" />
          </a>
          <a href={links.swapIconUrl} target="_blank">
            <img src={wawaSrc} className="image-wawa" />
          </a>
          <a href={links.githubUrl} target="_blank">
            <img src={githubSrc} className="image-github" />
          </a>
        </div>

        <div className="wrapper-tool-list">
          <input type="button" value="Buy $721" className="wrapper-tool1" />
          <input type="button" value="Connect Wallet" className="wrapper-tool2" onClick={e => handleWalletShow(e)} />

          {showWallet && <div className="inner-tool-list">
            <h5 className="title">Connect Wallet<i onClick={() => setShowWallet(false)}></i></h5>
            <div className="box-wallet1">MetaMask</div>
            <div className="box-wallet2">WalletConnect</div>
          </div>}
        </div>
      </div>
    </div>
  );
};

export default Header;
