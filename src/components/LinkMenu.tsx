import React, { createContext, useContext, useMemo } from "react";
import { Icon, IconCirclePlus, IconLoadMoreNode, IconPen, IconTrash, IconSearch } from "./Icons";
import { useTranslation } from "next-i18next";

export type LinkMenuType = 'delete'

export const LinkMenu: React.FC<{
  position: {x: number, y: number, z: number, display: boolean},
  onMouseOver: () => void,
  onMouseLeave: () => void,
  onAction: (type: LinkMenuType) => void,
}> = ({
  position,
  onMouseOver,
  onMouseLeave,
  onAction,
}) => {
  const {t} = useTranslation('common')

  function menuHandler (e: MouseEvent, callback: () => void) {
    e.preventDefault()
    e.stopPropagation()
    if(typeof callback == 'function') {
      callback()
    }
  }

  return useMemo(() => (
    <div
      onMouseOver={onMouseOver}
      onMouseLeave={onMouseLeave}
      className="action absolute left-full"
      style={{top: position?.y, left: position?.x, zIndex: position?.z, display: position?.display ? 'block' : 'none'}}
    >
      <div className="relative -translate-y-1/2 translate-x-2 border rounded-btn">
        <div className="absolute top-0 -left-4 aspect-square h-full scale-75 rotate-45 origin-center -z-10"></div>
        <div className="absolute top-2.5 -left-1 aspect-square h-3 rotate-45 origin-center bg-base-200 border border-r-0 border-t-0 -z-10"></div>
        <div className="dropdown-content join join-vertical">
          {
            [
              {icon: IconTrash, text: 'unLink', action: () => onAction('delete')}
            ].map(item => (
              <button
                key={item.text}
                className="btn btn-sm join-item text-xs flex flex-row flex-nowrap justify-start normal-case"
                onClick={(e) => menuHandler(e, item.action)}
              >
                <Icon icon={item.icon} className="w-3"/> {t(item.text)}
              </button>
            ))
          }
        </div>
      </div>
    </div>
    // </div>
  ), [JSON.stringify(position)])
}
