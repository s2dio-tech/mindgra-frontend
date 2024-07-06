import React, { useEffect, useRef, useState } from "react";
import { useTranslation } from "next-i18next";
import { Icon, IconGhost, IconWarning } from "../Icons";

const AutoCompleteInput: React.FC<{
  id: string,
  name: string,
  value?: string,
  placeholder?: string,
  readonly?: boolean,
  disabled: boolean,
  remoteSearchHandle: (text: string) => Promise<any[]>,
  onSelect: (item: any) => void,
}> = ({
  id,
  name,
  value,
  placeholder,
  readonly,
  disabled,
  onSelect,
  remoteSearchHandle
}) => {
  const {t} = useTranslation('common');
  const remoteSearchRef = useRef<NodeJS.Timeout>();

  const [showSelect, setShowSelect] = useState(false)
  const [loading, setLoading] = useState(false);
  const [text, setText] = useState('');
  const [searchItems, setSearchItems] = useState<any[]>()
  const [error, setError] = useState<any>()

  useEffect(() => {
    setText(value || '')
  }, [value])

  const autocomplete = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault()
    const txt = e.target.value
    if(remoteSearchRef.current) {
      clearTimeout(remoteSearchRef.current)
    }
    setText(txt)
    if(!txt || txt.length == 0) {
      setShowSelect(false)
      return
    }
    setLoading(true)
    setShowSelect(true)
    remoteSearchRef.current = setTimeout(async () => {
      await remoteSearchHandle(txt).then(res => {
        setSearchItems(res)
      }).catch(err => {
        setError(err)
      }).finally(() => setLoading(false))
    }, 1000)
  }

  useEffect(() => {
    if (!Boolean(document)) {
      return
    }
    document.addEventListener("mousedown", (event) => {
      var searchBox = document.getElementById(id)
      if(Boolean(searchBox) && !(searchBox!.contains(event.target))) {
        setShowSelect(false)
      }
    });
  }, [])

  const buildContent = () => {
    if(Boolean(error)) {
      return (
        <div className="w-full flex alert alert-error rounded-none">
          <Icon icon={IconWarning} className={'w-4'} color='error-content'/>
          {error.message || t('somethingWentWrong')}
        </div>
      )
    }

    if (loading || !searchItems) {
      return (
        <div className="w-full flex py-3 items-center justify-center">
          <span className="loading loading-spinner loading-md"></span>
        </div>
      )
    }
  
    if(searchItems.length == 0) {
      return (
        <div className="w-full flex flex-row py-3 px-2">
          <Icon icon={IconGhost} className={'w-4'}/>
          <span className="pl-2">{t('notFound')}</span>
        </div>
      )
    }
    
    return (
      <div className="w-full grid grid-cols-1 divide-y divide-base-300">
        {searchItems.map((w: any) => (
          <div onClick={_ => onSelect(w)} className="flex flex-col p-2 cursor-pointer hover:bg-base-300 text-base-content">
            <div className="text-sm">{w.content}</div>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div id={id} className={`w-full dropdown ${showSelect ? 'dropdown-open' : ''}`}>
      <input
        type="text"
        name={name}
        className={`input input-bordered w-full bg-transparent ${showSelect ? 'rounded-b-none' : ''}`}
        placeholder={placeholder}
        autoComplete="off"
        value={text}
        onChange={autocomplete}
        readOnly={readonly}
        disabled={disabled}
      />
      <div tabIndex={0} className={`dropdown-content z-[1] border border-base-content/[.20] border-t-0 w-full bg-base-100 rounded rounded-t-none ${showSelect ? '' : 'hidden'}`}>
        {buildContent()}
      </div>
    </div>
  )
}

export default AutoCompleteInput