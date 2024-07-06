import React, { useEffect, useRef, useState } from "react";
import { useTranslation } from "next-i18next";
import { useFormik } from 'formik';
import * as Yup from 'yup';

import { Word } from "../domain/models";
import TextInputMultiple from "./input/TextInputMultiple";
import { useDispatch } from "react-redux";
import { getWordDetailSilentAction } from "../redux/_word.redux";
import { showToast } from "../common/toast";

const WordForm: React.FC<{
  title: string,
  id?: string,
  linkWord?: Word,
  loading?: boolean,
  counter?: number,
  submitHandle: (data: Partial<Word> & {sourceId?: number}) => Promise<void>
}> = ({
  title,
  id,
  linkWord,
  loading,
  counter,
  submitHandle,
}) => {
  const {t} = useTranslation('common');
  const dispatch = useDispatch();
  const inputElement = useRef<HTMLInputElement>(null);

  const [initLoading, setInitLoading] = useState(false);

  const formik = useFormik<{
    content?: string,
    description?: string,
    refs?: string[]
  }>({
		initialValues: {
			content: "",
			description: "",
      refs: []
		},
		validationSchema: Yup.object({
			content: Yup.string().required(t('required')).max(50, t('tooLong')),
			// description: Yup.string().min(0).max(1024, t('tooLong')).optional(),
		}),
		onSubmit: async (values) => {
			if(loading) return;
      var data: Partial<Word> = {
        id: Boolean(id) ? id : undefined,
        content: values.content?.trim(),
        description: values.description?.trim(),
        refs: values.refs?.map(r => r?.trim()),
        sourceId: linkWord?.id
      }
      await submitHandle(data);
		},
	});

  useEffect(() => {
    setTimeout(_ => inputElement.current?.focus(), 1000);
  }, [counter])

  useEffect(() => {
    if(id) {
      setInitLoading(true)
      dispatch(getWordDetailSilentAction(id)).then(data => {
        formik.setValues({
          content: data?.content,
          description: data?.description,
          refs: data?.refs,
        })
        setInitLoading(false)
      }).catch((e: any) => {
        showToast('error', e.message || t('somethingWentWrong'))
      })
    }
  }, [id])

  if(initLoading) {
    return (
      <div className="w-full animate-pulse">
        <h2 className="mb-4 uppercase font-mono">{title}</h2>
        <div className="h-10 bg-base-content rounded opacity-20"></div>
        <div className="form-control pt-5">
          <label className="label">
            <span className="label-text">{t('description')}</span>
          </label>
          <div className="h-32 bg-base-content rounded opacity-20"></div>
        </div>
        <div className="form-control pt-5">
          <label className="label">
            <span className="label-text">{t('referenceLinks')}</span>
          </label>
          <div className="h-4 mb-2 bg-base-content rounded opacity-20"></div>
          <div className="h-4 mb-2 bg-base-content rounded opacity-20"></div>
          <div className="h-4 mb-2 bg-base-content rounded opacity-20"></div>
          <div className="h-4 mb-2 bg-base-content rounded opacity-20"></div>
        </div>
      </div>
    )
  }

  return (
    <form className="" onSubmit={formik.handleSubmit}>
      <h2 className="mb-4 uppercase font-mono">{title}</h2>
      {Boolean(linkWord) && (
        <>
          <input
            readOnly
            type="text"
            className="input input-bordered w-full disabled:bg-transparent"
            value={linkWord?.content}
          />
          <div className="ml-2 w-px h-10 border-r border-dashed bg-base-content opacity-30"/>
        </>
      )}
      <div className="form-control w-full">
        <input
          ref={inputElement}
          type="text"
          name="content"
          className={`input input-bordered w-full bg-transparent ${formik.touched.content && formik.errors.content ? 'input-error' : ''}`}
          placeholder={t("typeYourWord")}
          value={formik.values.content}
          onChange={formik.handleChange}
          disabled={loading}
        />
      </div>
      <div className="form-control pt-5">
        <label className="label">
          <span className="label-text">{t('description')}</span>
        </label>
        <textarea
          className={`textarea textarea-bordered h-40 w-full bg-transparent ${formik.touched.description && formik.errors.description ? 'input-error' : ''}`}
          placeholder={t('someDetailAboutThisWord')}
          name="description"
          onChange={formik.handleChange}
          disabled={loading}
        >{formik.values.description}</textarea>
      </div>
      <div className="form-control pt-5">
        <label className="label">
          <span className="label-text">{t('referenceLinks')}</span>
        </label>
        <TextInputMultiple
          max={10}
          name="refs"
          vals={formik.values.refs}
          onChanged={formik.handleChange}
          placeholder="https://......"
          disabled={loading}
        />
      </div>
      <div className="divider"/>
      <div className="">
        <button type="submit"
          className="btn btn-primary btn-sm"
          disabled={loading || !formik.isValid}
        >
          {t('save')} {loading && <span className="loading loading-dots loading-sm"></span>}
        </button>
      </div>
    </form>
  )
}

export default WordForm