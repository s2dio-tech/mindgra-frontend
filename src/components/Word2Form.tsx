import React, { FormEvent, useEffect, useRef, useState } from "react";
import { useTranslation } from "next-i18next";

import { Word } from "../domain/models";
import { useDispatch } from "react-redux";
import AutoCompleteInput from "./input/AutoCompleteInput";

const WordLinkForm: React.FC<{
  title: string,
  source?: Word,
  target?: Word,
  sourceReadonly?: boolean,
  targetReadonly?: boolean,
  loading?: boolean,
  submitText?: string,
  onSubmit: (source: Word, target: Word) => void
}> = ({
  title,
  source,
  target,
  sourceReadonly,
  targetReadonly,
  loading,
  submitText,
  onSubmit,
}) => {
  const {t} = useTranslation('common');
  const dispatch = useDispatch();

  const inputElement = useRef<HTMLInputElement>(null);

  const [fromWord, setFromWord] = useState<Word>()
  const [toWord, setToWord] = useState<Word>()

  useEffect(() => {
    setTimeout(() => inputElement.current?.focus(), 1000);
  }, [])

  useEffect(() => {
    setFromWord(source)
  }, [source])

  useEffect(() => {
    setToWord(target)
  }, [target])

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    if(!Boolean(source) || !Boolean(target)) {
      return
    }
    onSubmit(source, target)
  }

  return (
    <div className="h-full w-full">
      <form className="" onSubmit={handleSubmit}>
        <h2 className="mb-4 uppercase font-mono">{title}</h2>
        <div className="form-control w-full">
          <AutoCompleteInput
            id="linkFromWord"
            name="fromWord"
            placeholder={t('fromWord')}
            readonly={sourceReadonly}
            disabled={loading || false}
            remoteSearchHandle={async (txt) => {return []}}
            value={fromWord?.content}
            onSelect={setFromWord}
          />
        </div>
        <div className="form-control w-full mt-4">
          <AutoCompleteInput
            id="linkToWord"
            name="toWord"
            placeholder={t('toWord')}
            readonly={targetReadonly}
            disabled={loading || false}
            remoteSearchHandle={async (txt) => {return []}}
            value={toWord?.content}
            onSelect={setToWord}
          />
        </div>
        <div className="mt-4">
          <button type="submit"
            className="btn btn-primary btn-sm"
            disabled={loading || !Boolean(source) || !Boolean(target)}
          >
            {submitText || t('save')} {loading && <span className="loading loading-dots loading-sm"></span>}
          </button>
        </div>
      </form>
    </div>
  )
}

export default WordLinkForm