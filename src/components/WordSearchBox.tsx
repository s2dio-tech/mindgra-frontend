import React, { FormEvent, useEffect, useState } from "react";
import { useTranslation } from "next-i18next";
import { useDispatch, useSelector } from "react-redux";
import { getWordsGraphAction, searchWordsAction } from "../redux/_word.redux";
import { WordSearchResult } from "./WordSearchResult";
import { Icon, IconSearch } from "./Icons";
import { Word } from "../domain/models";



export const WordSearchBox: React.FC<{
  graphId: string
}> = ({
  graphId
}) => {
  const {t} = useTranslation('common')
  const dispatch = useDispatch()
  const search = useSelector(state => state.word.search)
  const [showResult, setShowResult] = useState(false)

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if(search.loading) {
      return
    }
    var formData = Object.fromEntries(new FormData(e.target));
    if(formData.search.length < 3) {
      return
    }
    dispatch(searchWordsAction({graphId, search}))
    // dispatch({
    //   type: actionSuccess(WordActions.SEARCH_WORD),
    //   data: Array(10).fill(1).map((_, i) => ({id: i, content: 'word ' +i, description: 'word description ' + i})),
    // })
    setShowResult(true)
  }

  const handleSelect =  (w: Word) => {
    setShowResult(false)
    dispatch(getWordsGraphAction(w.id))
  }

  useEffect(() => {
    if (!Boolean(document)) {
      return
    }
    document.addEventListener("mousedown", (event) => {
      var searchBox = document.getElementById('search_box')
      if(Boolean(searchBox) && !(searchBox!.contains(event.target))) {
        setShowResult(false)
      }
    });
  }, [])

  return (
    <div
      id="search_box"
      className={`w-full dropdown ${showResult ? 'dropdown-open' : ''}`}
    >
      <form tabIndex={1} className="join w-full" onSubmit={handleSubmit}>
        <input
          tabIndex={2}
          name="search"
          autoComplete="off"
          className={`w-full join-item input input-bordered px-2 focus:outline-none border-opacity-100 ${showResult ? 'rounded-b-none' : ''}`}
          placeholder={t('search')}
        />
        <div className="indicator">
          <button type="submit" className={`join-item btn btn-square btn-outline ${showResult ? 'rounded-b-none' : ''}`}>
            <Icon icon={IconSearch} className="w-4 h-4"/>
          </button>
        </div>
      </form>
      <div tabIndex={0} className={`dropdown-content z-[1] w-full ${showResult ? '' : 'hidden'}`}>
        <div className="overflow-hidden shadow border border-base-content border-t-0 rounded-md rounded-t-none bg-base-100 text-base-content">
          <WordSearchResult
            loading={search.loading}
            results={search.words}
            error={search.error}
            onSelect={handleSelect}
          />
        </div>
      </div>
    </div>
  )
}