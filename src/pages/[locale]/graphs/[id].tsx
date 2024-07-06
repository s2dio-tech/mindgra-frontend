import React from 'react'
import Head from 'next/head';
import dynamic from 'next/dynamic'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'

import { Navbar } from '../../../components/Navbar';
import GraphModal from '../../../components/GraphModal';
import { ApiConst } from '../../../common/api';
import { useSelector } from 'react-redux';
import AuthComponent from '../../../components/auth/AuthComponent';
import { getI18nProps, getStaticPaths, makeStaticProps } from '../../../locale/getStatic';

const GraphLayout = dynamic(() => import('../../../layout/GraphLayout'), {ssr: false});
const WordsGraph = dynamic(() => import('../../../components/WordsGraph'), {ssr: false});

export default function Home({graph}: {graph: any}) {
  const user = useSelector(state => state.auth.user)

  return (
    <GraphLayout>
      <div className='w-screen h-screen'>
        {Boolean(graph) && (
          <Head>
            <title>{graph?.name}</title>
          </Head>
        )}
        {Boolean(user) ? (
          <>
            <Navbar graph={graph}/>
            <WordsGraph graph={graph}/>
          </>
        ) : (
          <>
            <Navbar hideUserMenu/>
            <div className='flex w-full h-full justify-center items-center'>
              <div className="modal-box bg-transparent overflow-visible shadow-none">
                <AuthComponent/>
              </div>
            </div>
          </>
        )}
        <GraphModal/>
      </div>
    </GraphLayout>
  )
}

export const getServerSideProps = (async (context: any) => {
  const id = context.params.id
  const res = await fetch(process.env.NEXT_PUBLIC_API_BASE_URL + ApiConst.GRAPHS_DETAIL(id))
  const graph = await res.json()
  const i18nProps = await getI18nProps(context)
  return { props: {
    graph,
    ...i18nProps
  } }
})
