import React from 'react';
import dynamic from 'next/dynamic';
import { useSelector } from 'react-redux';
import { ToastContainer } from 'react-toastify'

import AuthModal from '../components/auth/AuthModal';
const SettingDrawer = dynamic(() => import('../components/SettingDrawer'), {ssr: false});
const UserInfoDrawer = dynamic(() => import('../components/UserInfoDrawer'), {ssr: false});

function GraphLayout({
  children
}) {
  const theme = useSelector(state => state.ui.theme)

  return (
    <div data-theme={theme}>
      {children}
      <AuthModal/>
      <UserInfoDrawer/>
      <SettingDrawer/>
      <ToastContainer/>
    </div>
  )
}

export default GraphLayout