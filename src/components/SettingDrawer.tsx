import React from "react";
import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";
import { useSelector, useDispatch } from "react-redux";

import { UIActions } from "../redux/_ui.redux";
import Drawer from "./Drawer";
import { Icon, IconClose, IdonChevronDown } from "./Icons";
import { LANGUAGES } from "../common/theme";
import LanguageSwitchLink from "../locale/languageSwitchLink";

import i18nextConfig from '../../next-i18next.config'


const SettingDrawer: React.FC<{}> = ({

}) => {
  const {t} = useTranslation()
  const dispatch = useDispatch();
  const router = useRouter()

  const settingModalActive = useSelector(state => state.ui.settingModalActive)
  const currentLocale = router.query.locale || i18nextConfig.i18n.defaultLocale


  return (
    <Drawer id="theme_select_drawer" open={settingModalActive} onClose={() => dispatch({type: UIActions.SETTING_MODAL_TOGGLE})}>
      <div className="w-full flex flex-col overflow-y-scroll">
        <div>
          <button onClick={() => dispatch({type: UIActions.SETTING_MODAL_TOGGLE})}
            className='btn btn-ghost'
          >
            <Icon icon={IconClose} className='w-4'/>
          </button>
        </div>
        <div className="flex flex-row justify-between items-center pl-2">
          <h4 className="font-medium">{t('language')}</h4>
          <div className="dropdown dropdown-bottom dropdown-end dropdown-hover">
            <div tabIndex={0} role="button" className="btn btn-sm m-1">
              <span className="text-xs">{t(currentLocale)}</span>
              <Icon icon={IdonChevronDown} className="w-2"/>
            </div>
            <ul tabIndex={0} className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box">
              {i18nextConfig.i18n.locales.map(locale => (
                <li key={locale}>
                  <LanguageSwitchLink locale={locale} key={locale}/>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="divider h-1 mx-2 my-4"/>
        <h4 className="pl-2 pb-2 font-medium">{t('theme')}</h4>
        <div className="grid grid-cols-2 grid-flow-row auto-rows-max p-2 gap-4">
            {["light",
              "dark",
              "cupcake",
              "bumblebee",
              "emerald",
              "corporate",
              "synthwave",
              "retro",
              "cyberpunk",
              "valentine",
              "halloween",
              "garden",
              "forest",
              "aqua",
              "lofi",
              "pastel",
              "fantasy",
              "wireframe",
              "black",
              "luxury",
              "dracula",
              "cmyk",
              "autumn",
              "business",
              "acid",
              "lemonade",
              "night",
              "coffee",
              "winter",
            ].map(theme => (
              <div
                key={theme}
                onClick={() => dispatch({type: UIActions.THEME_CHANGE, theme: theme})}
                className="border-base-content/20 hover:border-base-content/40 rounded-box border overflow-hidden"
                data-set-theme={theme}
                // data-act-className="!outline-base-content"
              >
                <div data-theme={theme} className="bg-base-100 text-base-content w-full cursor-pointer font-sans">
                  <div className="grid grid-cols-5 grid-rows-3">
                    <div className="bg-base-200 col-start-1 row-span-2 row-start-1">
                    </div>
                    <div className="bg-base-300 col-start-1 row-start-3">
                    </div>
                    <div className="bg-base-100 col-span-4 col-start-2 row-span-3 row-start-1 flex flex-col gap-1 p-2">
                      <div className="font-bold">{theme}</div>
                      <div className="flex flex-row flex-nowrap gap-1">
                        <div className="bg-primary flex aspect-square w-5 items-center justify-center rounded lg:w-6">
                          <div className="text-primary-content text-sm font-bold">A</div>
                        </div>
                        <div className="bg-secondary flex aspect-square w-5 items-center justify-center rounded lg:w-6">
                          <div className="text-secondary-content text-sm font-bold">A</div>
                        </div>
                        <div className="bg-accent flex aspect-square w-5 items-center justify-center rounded lg:w-6">
                          <div className="text-accent-content text-sm font-bold">A</div>
                        </div>
                        <div className="bg-neutral flex aspect-square w-5 items-center justify-center rounded lg:w-6">
                          <div className="text-neutral-content text-sm font-bold">A</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
        </div>
      </div>
    </Drawer>
  )
}

export default SettingDrawer;