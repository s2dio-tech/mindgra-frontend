'use client'
import React from "react"
import Error from 'next/error'
import { useTranslation } from "next-i18next"
import { useRouter } from 'next/router';

 
export default function ErrorPage() {

  const {t} = useTranslation('common')
  const router = useRouter()

  return (
    <div>
      {/* <Head>
        <title>{errorCode}</title>
      </Head> */}
      <Error statusCode={parseInt((router.query.code as string)) || 500}/>
    </div>
  )
}