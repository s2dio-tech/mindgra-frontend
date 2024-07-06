import { useEffect } from 'react'
import { useRouter } from 'next/router'
import languageDetector from './languageDetector'

export const useRedirect = (to?: string | undefined) => {
  const router = useRouter()
  to = to || router.asPath

  console.debug(to)

  // language detection
  useEffect(() => {
    const detectedLng = languageDetector.detect()
    console.debug(detectedLng)
    if (
      to?.startsWith('/' + detectedLng)
      && router.route === '/404'
    ) {
      // prevent endless loop
      router.replace('/' + detectedLng + router.route)
      return
    }

    languageDetector.cache(detectedLng)
    router.replace('/' + detectedLng + to)
  })

  return <></>
}

export const Redirect = () => {
  useRedirect()
  return <></>
}

// eslint-disable-next-line react/display-name
export const getRedirect = (to: string) => () => {
  useRedirect(to)
  return <></>
}