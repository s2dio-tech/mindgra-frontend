import React from 'react'
import { useDispatch, useSelector } from 'react-redux';
import dynamic from 'next/dynamic';

import { WordActions, createWordAction, deleteWordAction, unlinkWordsAction, updateWordAction } from '../redux/_word.redux';
import Drawer from './Drawer';
import WordForm from './WordForm';
import ConfirmComponent from './ConfirmComponent';
import { Icon, IconClose } from './Icons';
import { useTranslation } from 'next-i18next';
import { ERRORS } from '../common/errors';
import { Word } from '../domain/models';
import { showToast } from '../common/toast';

const PrivateComponent = dynamic (() => import('../components/PrivateComponent'), {ssr: false});

export type Mode = 'detail' | 'create' | 'edit' | 'delete'

const Wrapper: React.FC<{
  open?: boolean,
  children: any,
  onClose: ()=>void
}>  = ({
  open,
  onClose,
  children
}) => {
  return (
    <Drawer
      id={'word_drawer'}
      side='left'
      open={!!open}
      onClose={onClose}
    >
      <div className='w-full'>
        <button onClick={onClose}
          className='btn btn-ghost absolute top-4 -right-8 w-1 border-l-0 rounded-l-none border-base-content/20 bg-base-100 hover:bg-base-100 hover:border-base-content/50'
        >
          <Icon icon={IconClose} className='w-3'/>
        </button>
        <div className='p-4 h-full overflow-y-scroll'>
          {children}
        </div>
      </div>
    </Drawer>
  )
}

const WordsGraphDrawer: React.FC<{
}> = ({
}) => {
  const {t} = useTranslation()
  const dispatch = useDispatch()

  const wordCreate = useSelector((state: any) => state.word.create);
  const wordEdit = useSelector((state: any) => state.word.edit);
  const wordDelete = useSelector((state: any) => state.word.delete);
  const wordsUnlink = useSelector((state: any) => state.word.unlink);

  async function addWordSubmit (data: Partial<Word>) {
    await dispatch(createWordAction({
      ...data,
      graphId: wordCreate.data?.graphId,
      sourceId: wordCreate.data?.source?.id,
    })).then(_ => {
      showToast('success', t('addWordSuccess'))
      dispatch({type: WordActions.ADD_WORD_END})
    }).catch((err: Error) => {
      showToast('error', t(err.message))
    })
  }

  async function editWordSubmit (id: string, data: Partial<Word>) {
    await dispatch(updateWordAction(id, data)).then(_ => {
      showToast('success', t('updateWordSuccess'))
      dispatch({type: WordActions.EDIT_WORD_END})
    }).catch((err: Error) => {
      showToast('error', t(err.message))
    })
  }

  async function deleteWordSubmit (id: string) {
    await dispatch(deleteWordAction(id)).then(_ => {
      showToast('success', t('deleteWordSuccess'))
      dispatch({type: WordActions.DELETE_WORD_END})
    }).catch((err: Error) => {
      showToast('error', t(err.message) || t(ERRORS.SomethingWentWrong))
    })
  }

  async function unlinkSubmit (sourceWordId: string, targetLinkId: string) {
    await dispatch(unlinkWordsAction(sourceWordId, targetLinkId)).then(_ => {
      showToast('success', t('deleteWordSuccess'))
      dispatch({type: WordActions.UNLINK_END})
    }).catch((err: Error) => {
      showToast('error', t(err.message) || t(ERRORS.SomethingWentWrong))
    })
  }

  const buildContent = () => {
    if (wordCreate.active) {
      return (
        <WordForm
          title={t('addNewWord')}
          linkWord={wordCreate.data?.source}
          loading={wordCreate.loading}
          submitHandle={addWordSubmit}
        />
      )
    }

    if (wordEdit.active) {
      return (
        <WordForm
          title={t('editWord')}
          id={wordEdit.id}
          loading={wordEdit.loading}
          submitHandle={data => editWordSubmit(wordEdit.id, data)}
        />
      )
    }

    if (wordDelete.active) {
      return (
        <ConfirmComponent
          message={t('doYouReallyWantToDelete', {name: wordDelete.data?.name})}
          acceptText={t('delete')}
          loading={wordDelete.loading}
          onAccept={() => deleteWordSubmit(wordDelete.id)}
          onCancel={() => dispatch({type: WordActions.DELETE_WORD_END})}
        />
      )
    }

    if (wordsUnlink.active) {
      return (
        <ConfirmComponent
          message={t('unlinkTwoWords')}
          acceptText={t('unlink')}
          detail={(
            <div>
              <div className='font-bold'>{wordsUnlink.data?.source?.content}</div>
              <div className='font-bold'>{wordsUnlink.data?.target?.content}</div>
            </div>
          )}
          loading={wordDelete.loading}
          onAccept={() => unlinkSubmit(wordsUnlink.data?.source?.id, wordsUnlink.data?.target?.id)}
          onCancel={() => dispatch({type: WordActions.UNLINK_END})}
        />
      )
    }
  }

  const closeHandle = () => {
    if(wordCreate.active) {
      dispatch({type: WordActions.ADD_WORD_END})
    }
    if(wordEdit.active) {
      dispatch({type: WordActions.EDIT_WORD_END})
    }
    if(wordDelete.active) {
      dispatch({type: WordActions.DELETE_WORD_END})
    }
    if(wordsUnlink.active) {
      dispatch({type: WordActions.UNLINK_END})
    }
  }

  const active = wordCreate.active || wordEdit.active || wordDelete.active || wordsUnlink.active

  return (
    <Wrapper
      open={active}
      onClose={closeHandle}
    >
      {active && (
        <PrivateComponent
          onCancel={closeHandle}
        >
          {buildContent()}
        </PrivateComponent>
      )}
    </Wrapper>
      
  )
}

export default WordsGraphDrawer