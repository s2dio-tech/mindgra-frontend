import React, { createContext, useContext, useMemo } from "react";
import { Icon, IconCirclePlus, IconLoadMoreNode, IconPen, IconTrash, IconSearch } from "./Icons";
import { useTranslation } from "next-i18next";

export type WordMenuType = 'add' | 'edit' | 'delete' | 'loadmore' | 'linkFrom' | 'linkTo' | 'findPathFrom' | 'findPathTo'

export const WordMenu: React.FC<{
  position: {x: number, y: number, z: number, display: boolean},
  onMouseOver: () => void,
  onMouseLeave: () => void,
  onAction: (type: WordMenuType) => void,
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
      className={`action absolute left-full`}
      style={{
        top: position?.y, left: position?.x, zIndex: position?.z,
        display: position.display ? 'block' : 'none'
      }}
    >
      <div className={`relative border rounded-btn -translate-y-1/2 translate-x-1`}>
        <div className="absolute top-0 -left-1/2 h-full scale-x-[0.2] scale-y-[0.7] -translate-x-[2rem]">
          <div className="aspect-square h-full rotate-45 origin-center -z-10"></div>
        </div>
        <div className="absolute top-1/2 -mt-2 -left-1.5 aspect-square h-3 rotate-45 origin-center bg-base-200 border border-r-0 border-t-0 -z-10"></div>
        <div className="dropdown-content join join-vertical">
          {
            [
              {icon: IconCirclePlus, text: 'add', action: () => onAction('add')},
              {icon: IconPen, text: 'edit', action: () => onAction('edit')},
              {icon: IconTrash, text: 'delete', action: () => onAction('delete')},
              // {icon: IconLoadMoreNode, text: 'loadMore', action: () => onAction('loadmore')},
              {icon: IconLoadMoreNode, text: 'linkFromHere', action: () => onAction('linkFrom')},
              {icon: IconLoadMoreNode, text: 'linkToHere', action: () => onAction('linkTo')},
              {icon: IconSearch, text: 'findPathFromHere', action: () => onAction('findPathFrom')},
              {icon: IconSearch, text: 'findPathToHere', action: () => onAction('findPathTo')},
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
