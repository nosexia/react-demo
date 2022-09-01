import React from 'react'
import { useRoutes } from 'react-router-dom'
import WrapperRouter from './components/WrapperRouter'
import Home from './pages/home/index'
import Swap from './pages/swap/index'
const App = () => {
  return useRoutes([
    {
      key: 'swap',
      path: '/',
      element: <WrapperRouter element={Swap} />
    }, {
      key: 'home',
      path: '/home',
      element: <WrapperRouter element={Home} />
    }
  ])
}

export default App