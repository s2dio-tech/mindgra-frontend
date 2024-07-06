
import '../../styles/globals.css'
import "react-toastify/dist/ReactToastify.css";

import type { AppProps } from 'next/app'
import { appWithTranslation } from 'next-i18next'
import { wrapper } from "../redux/store";


function MyApp({ Component, pageProps }: AppProps) {

  return (
    <div>
      <Component {...pageProps} />
    </div>
  )
}

export default wrapper.withRedux(appWithTranslation(MyApp));
