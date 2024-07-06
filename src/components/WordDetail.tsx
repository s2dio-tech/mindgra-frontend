import React, { useEffect } from 'react'
import WordDetailSkeleton from './WordDetailSkeleton';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { getWordDetailAction } from '../redux/_word.redux';

const WordDetail: React.FC<{
}> = ({
}) => {

  const dispatch = useDispatch()
  const wordDetail = useSelector(state => state.word.detail)

  useEffect(() => {
    if(wordDetail.id) {
      dispatch(getWordDetailAction(wordDetail.id));
    }
  }, [wordDetail.id])
  
  
  if (wordDetail.loading || wordDetail.error || !Boolean(wordDetail.data)) {
    return (
      <div className={`inset-0 bg-base-100 opacity-100 duration-300`}>
        <WordDetailSkeleton/>
      </div>
    )
  }

  const word = wordDetail.data
  return (
    <div className="space-y-6">
      <div className="text-xl">{word.content}</div>
      <div className="space-y-3 text-base">
        {word.description}
      </div>
      {Boolean(word.refs) && (
        <div className="space-y-3">
          {word.refs?.map((r: any) => (
            <div><a href={r} target='_blank' className='link link-info'>{r}</a></div>
          ))}
        </div>
      )}
      {Boolean(word.links) && (
        <div className="space-y-3">
          {word.links?.map((r: any) => (
            <div><a href={r} target='_blank' className='link link-info'>{r}</a></div>
          ))}
        </div>
      )}
    </div>
  )
}

export default WordDetail;