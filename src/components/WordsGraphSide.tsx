import React, { useContext, useEffect, useState } from 'react'
import { useSelector } from 'react-redux';
import { Icon, IconClose } from './Icons';
import { useDispatch } from 'react-redux';
import { useTranslation } from 'next-i18next';

import { WordActions, findWordsPathAction, link2WordsAction } from '../redux/_word.redux';

import WordDetail from './WordDetail';
import Word2Form from './Word2Form';
import { Word } from '../domain/models';
import { showToast } from '../common/toast';

type ContentType = 'detail' | 'findPath'

const WordsGraphSide: React.FC<{
}> = ({
}) => {
  const {t} = useTranslation('common')
  const dispatch = useDispatch()
  const wordDetail = useSelector(state => state.word.detail)
  const wordFindPath = useSelector(state => state.word.findPath)
  const wordLink = useSelector((state: any) => state.word.link)

  const [content, setContent] = useState<ContentType>()

  useEffect(() => {
    setContent(wordFindPath.active ? 'findPath' : wordDetail.active ? 'detail' : undefined)
  }, [wordDetail.active, wordFindPath.active])


  if(!content) {
    return null
  }

  const handleClose = () => {
    wordFindPath.active && dispatch({type: WordActions.FIND_PATH_END})
    wordDetail.active && dispatch({type: WordActions.SHOW_DETAIL_END})
    wordLink.active && dispatch({type: WordActions.LINK_END})
  }

  const handleFindPath = async (w1: Word, w2: Word) => {
    await dispatch(findWordsPathAction(w1.id, w2.id)).catch((err: any) => {
      showToast('error', t(err.message) || t('somethingWentWrong'))
    })
  }

  const handleLinkWords = async (w1: Word, w2: Word) => {
    if(w1.id === w2.id) {
      showToast('warn', t('canNotLinkToSelf'))
      return;
    }
    await dispatch(link2WordsAction(w1.id, w2.id)).then(res => {
      showToast('success', t('linkWordsSuccess'))
      setTimeout(() => dispatch({type: WordActions.LINK_END}), 1000)
    }).catch(err => {
      showToast('error', t(err.message) || t('somethingWentWrong'))
    })
  }
  
  const buildContent = () => {
    if (wordFindPath.active) {
      return (
        <Word2Form
          title={t('findPath')}
          source={wordFindPath.source}
          target={wordFindPath.target}
          loading={wordFindPath.loading}
          submitText={t('find')}
          onSubmit={handleFindPath}
        />
      )
    }

    if(wordLink.active) {
      return (<Word2Form
        title={t('link2Words')}
        source={wordLink.source}
        target={wordLink.target}
        sourceReadonly={true}
        targetReadonly={true}
        loading={wordLink.loading}
        onSubmit={handleLinkWords}
      />
    )}
  }

  return (
    <div className='absolute flex-none h-full md:w-1/4 lg:w-1/5 bg-base-100 z-[99]'>
      <div className='flex flex-row h-full relative'>
        <div className="w-full h-full overflow-y-scroll">
          <div className='w-full pl-4 pr-4 pb-8 pt-8'>
            {buildContent()}
            {(wordFindPath.active || wordLink.active) && wordDetail.active && (
              <div className='divider'/>
            )}
            {wordDetail.active && (
              <WordDetail/>
            )}
          </div>
        </div>
        <div className="divider divider-horizontal h-full w-px m-0"></div>
        <button onClick={handleClose}
          className='btn btn-ghost absolute top-4 -right-8 w-1 border-l-0 rounded-l-none border-base-content/20 bg-base-100 hover:bg-base-100 hover:border-base-content/50'
        >
          <Icon icon={IconClose} className='w-3'/>
        </button>
      </div>
    </div>
  )
}

export default WordsGraphSide;