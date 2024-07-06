import React from "react";
import { useTranslation } from "next-i18next";
import { ellipsis } from "../common/text";
import { Icon, IconGhost, IconWarning } from "./Icons";
import { Word } from "../domain/models";

export const WordSearchResult: React.FC<{
  loading: boolean,
  results: Word[],
  error: any,
  onSelect?: (w: Word) => void
}> = ({
  loading,
  results,
  error,
  onSelect
}) => {
  const {t} = useTranslation('common')

  if(loading) {
    return (
      <div className="w-full flex py-3 items-center justify-center">
        <span className="loading loading-spinner loading-md"></span>
      </div>
    )
  }

  if(Boolean(error)) {
    return (
      <div className="w-full flex alert alert-error rounded-none">
        <Icon icon={IconWarning} className={'w-4'} color='error-content'/>
        {error.message || t('somethingWentWrong')}
      </div>
    )
  }

  if(results.length == 0) {
    return (
      <div className="w-full flex flex-row py-3 px-2">
        <Icon icon={IconGhost} className={'w-4'}/>
        <span className="pl-2">{t('notFound')}</span>
      </div>
    )
  }
  
  return (
    <div className="w-full grid grid-cols-1 divide-y divide-base-300">
      {results.map((w: any) => (
        <div onClick={_ => onSelect?.call(this, w)} className="flex flex-col p-2 cursor-pointer hover:bg-base-300 text-base-content">
          <div className="text-sm">{w.content}</div>
          <p className="text-xs">{ellipsis(w.description, 50)}</p>
        </div>
      ))}
    </div>
  )
}