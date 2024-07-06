import React from 'react'
import dynamic from 'next/dynamic';

import { Navbar } from '../../components/Navbar';
import UserGraphList from '../../components/UserGraphList';
import GraphModal from '../../components/GraphModal';
import { useSelector } from 'react-redux';
import Head from 'next/head';
import { getStaticPaths, makeStaticProps } from '../../locale/getStatic';

const GraphLayout = dynamic(() => import('../../layout/GraphLayout'), {ssr: false});
const UserInfoDrawer = dynamic(() => import('../../components/UserInfoDrawer'), {ssr: false});
const AuthComponent = dynamic (() => import('../../components/auth/AuthComponent'), {ssr: false});

export default function UserPage() {
  const user = useSelector(state => state.auth.user)


  return (
    <div>
      <Head>
        <title>{process.env.NEXT_PUBLIC_APP_TITLE}</title>
      </Head>
      <GraphLayout>
        <div className='w-screen h-screen'>
          <Navbar hideUserMenu={!Boolean(user)}/>
          <UserInfoDrawer/>
          {!Boolean(user) ? (
            <div className='flex w-full h-full justify-center items-center'>
              <div className="modal-box bg-transparent overflow-visible shadow-none">
                <AuthComponent/>
              </div>
            </div>
          ) : (
            <div className='p-20'>
              <UserGraphList/>
              <GraphModal/>
            </div>
          )}
        </div>
      </GraphLayout>
    </div>
  )
}

const getStaticProps = makeStaticProps()
export {getStaticPaths, getStaticProps}
