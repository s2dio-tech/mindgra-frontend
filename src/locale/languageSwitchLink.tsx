import languageDetector from './languageDetector'
import { useRouter } from 'next/router'
import Link from 'next/link'
import { useTranslation } from 'next-i18next'

const LanguageSwitchLink = ({ locale, ...rest }: {locale: string, [key:string]: any}) => {
  const router = useRouter()
  const {t} = useTranslation()

  let href = rest.href || router.asPath
  let pName = router.pathname
  Object.keys(router.query).forEach(k => {
    if (k === 'locale') {
      pName = pName.replace(`[${k}]`, locale)
      return
    }
    pName = pName.replace(`[${k}]`, router.query[k])
  })
  if (locale) {
    href = rest.href ? `/${locale}${rest.href}` : pName
  }
  if (href.indexOf(`/${locale}`) < 0) {
    href = `/${locale}${href}`
  }

  return (
    <Link href={href}>
      <div
        onClick={() => languageDetector?.cache(locale)}
        className='text-sm whitespace-nowrap'
      >
        {t(locale)}
      </div>
    </Link>
  )
}

export default LanguageSwitchLink