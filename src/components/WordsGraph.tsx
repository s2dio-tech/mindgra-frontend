import React, { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { isEmpty } from 'lodash';
import { useTranslation } from 'next-i18next';

import { WordActions, getWordsGraphAction } from '../redux/_word.redux';
import { Graph, Link, Word } from '../domain/models';
import { definedUnique, isEqual } from '../common/array';

import { WordMenu, WordMenuType } from './WordMenu';
import WordsGraphDrawer from './WordsGraphDrawer';
import WordsGraphSide from './WordsGraphSide';
import { Icon, IconCirclePlus } from './Icons';
import { LinkMenu, LinkMenuType } from './LinkMenu';
import { useRouter } from 'next/router';
import Graph2D from './graph/Graph2D';
import Graph3D from './graph/Graph3D';
import { GraphType } from '../domain/models';


const WordsGraph: React.FC<{
  graph: Graph
}> = ({
  graph
}) => {
  const {t} = useTranslation('common');
  const dispatch = useDispatch();
  const router = useRouter()
  
  const wrapperRef = useRef();
  const graphRef = useRef();
  const mouseRef = useRef<{x: number, y: number}>();

  const graphData = useSelector((state: any) => state.word.graph.data)
  const graphSelectedWordIds = useSelector(state => state.word.graph.selectedWordIds)
  const wordLink = useSelector((state: any) => state.word.link)
  const wordFindPath = useSelector(state => state.word.findPath)
  const wordDetail = useSelector(state => state.word.detail)
  
  const theme = useSelector(state => state.ui.theme)

  // const [counter, setCounter] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [focusedWordId, setFocusedWordId] = useState<string | undefined>();
  const [hoverWord, setHoverWord] = useState();
  const [wordMenuState, setWordMenuState] = useState({x: 0, y: 0, active: false, focus: false})
  const [hoverLink, setHoverLink] = useState<Link>();
  const [linkMenuState, setLinkMenuState] = useState({x: 0, y: 0, active: false, focus: false})


  function resetState () {
    setFocusedWordId(undefined)
  }
  
  useEffect(() => {
    return () => {
      dispatch({type: WordActions.CLEAN_GRAPH})
    }
  }, [])

  useEffect(() => {
    resetState()
    dispatch({type: WordActions.CLEAN_GRAPH})
    dispatch(getWordsGraphAction(graph.id)).catch((err: any) => {
      if(err.statusCode) {
        router.replace('errors/' + err.statusCode)
      }
    })
  }, [graph.id])

  useEffect(() => {
    let selectedIds = []
    if(wordLink.active) {
      selectedIds.push(wordLink.source?.id, wordLink.target?.id)
    }
    if(wordFindPath.active) {
      selectedIds.push(wordFindPath.source?.id, wordFindPath.target?.id)
    }
    const ids = selectedIds.filter(definedUnique)
    // ignore if equal
    if(isEqual(ids, graphSelectedWordIds)) return;
    
    dispatch({type: WordActions.GRAPH_NODE_SELECT, ids: ids})
  }, [wordLink.active, wordLink.source?.id, wordLink.target?.id, wordFindPath.active, wordFindPath.source?.id, wordFindPath.target?.id])

  useEffect(() => {
    setFocusedWordId(wordDetail.id)
  }, [wordDetail.id])

  useEffect(() => {
    if(loading || !focusedWordId) return
    if(wordMenuState.focus) return
    if(hoverWord && wordMenuState.active) return
    if(!hoverWord && !wordMenuState.active) return
    if(!hoverWord) {
      setWordMenuState((st) => ({
        ...st,
        active: false
      }))
      return
    }
    if(hoverWord.id === focusedWordId) {
      let p = {};
      if(graph.type === '3d') {
        const el = hoverWord.elementRef?.current?.getBoundingClientRect();
        if(el) {
          p = {x: el.right, y: el.top + el.height/2}
        }
      } else if (graph.type === '2d' && graphRef.current) {
        const coords = graphRef.current.graph2ScreenCoords(hoverWord.x, hoverWord.y)
        p = {x: coords.x + hoverWord._size[0]/2 * graphRef.current.zoom(), y: coords.y}
      }
      setWordMenuState((st) => ({
        ...st,
        active: true,
        ...p
      }))
    }
  }, [hoverWord, wordMenuState])

  useEffect(() => {
    if(loading || linkMenuState.focus || !focusedWordId) return
    if(!hoverLink || ![hoverLink!.sourceId, hoverLink!.targetId].includes(focusedWordId)) {
      setLinkMenuState((st) => ({
        ...st,
        active: false
      }))
      return
    }
    if(hoverLink) {
      setLinkMenuState((st) => ({
        ...st,
        active: true,
        x: mouseRef.current?.x || 0,
        y: mouseRef.current?.y || 0
      }))
    }
  }, [hoverLink])

  const nodeClickHandle = (node: Word) => {
    // turn loading flag ON to ignore hover event until graph animation effect finished
    // setLoading(true)
    dispatch({type: WordActions.SHOW_DETAIL, id: node.id})
    // setTimeout(() => setLoading(false), 1000)
  }

  const hideOthers = (exclude: WordActions) => {
    if(exclude !== WordActions.ADD_WORD) dispatch({type: WordActions.ADD_WORD_END})
    if(exclude !== WordActions.EDIT_WORD) dispatch({type: WordActions.EDIT_WORD_END})
    if(exclude !== WordActions.DELETE_WORD) dispatch({type: WordActions.DELETE_WORD_END})
    if(exclude !== WordActions.LINK_2_WORDS) dispatch({type: WordActions.LINK_END})
    if(exclude !== WordActions.FIND_PATH) dispatch({type: WordActions.FIND_PATH_END})
    if(exclude !== WordActions.UNLINK) dispatch({type: WordActions.UNLINK_END})
  }

  const nodeActionHandle = (action: WordMenuType, node: Word) => {
    // setCounter((counter) => counter + 1)
    setWordMenuState(st => ({...st, focus: false}))
    switch (action) {
      case 'add':
        hideOthers(WordActions.ADD_WORD)
        dispatch({
          type: WordActions.ADD_WORD_START,
          data: {
            source: node,
            graphId: graph.id
          }
        })
        break;
      case 'edit':
        hideOthers(WordActions.EDIT_WORD)
        dispatch({
          type: WordActions.EDIT_WORD_START,
          id: node.id,
        })
        break
      case 'delete':
        hideOthers(WordActions.DELETE_WORD)
        dispatch({
          type: WordActions.DELETE_WORD_START,
          data: {id: node.id, name: node.content}
        })
        break
      case 'linkFrom':
        hideOthers(WordActions.LINK_2_WORDS)
        dispatch({
          type: WordActions.LINK_FROM,
          word: node
        })
        break
      case 'linkTo':
        hideOthers(WordActions.LINK_2_WORDS)
        dispatch({
          type: WordActions.LINK_TO,
          word: node
        })
        break
      case 'findPathFrom':
        hideOthers(WordActions.FIND_PATH)
        dispatch({
          type: WordActions.FIND_PATH_FROM,
          word: node
        })
        break
      case 'findPathTo':
        hideOthers(WordActions.FIND_PATH)
        dispatch({
          type: WordActions.FIND_PATH_TO,
          word: node
        })
        break
    }
  }

  const linkActionHandle = (action: LinkMenuType, link?: Link) => {
    if(!link) return;
    setLinkMenuState(st => ({...st, active: false}))
    switch (action) {
      case 'delete':
        hideOthers(WordActions.UNLINK)
        dispatch({
          type: WordActions.UNLINK_START,
          data: {
            source: graphData.words?.find(w => w.id === link.sourceId),
            target: graphData.words?.find(w => w.id === link.targetId),
            graphId: graph.id
          }
        })
        break;
      default: break
    }
  }

  function buildGraph () {
    if(graph.type == '2d') {
      return (
        <Graph2D
          theme={theme}
          data={{
            nodes: graphData.words,
            links: graphData.links
          }}
          selectedNodeIds={graphSelectedWordIds || []}
          highLightNodeIds={wordFindPath.path}
          focusNodeId={focusedWordId}
          onNodeClick={nodeClickHandle}
          hoverLink={hoverLink}
          onLinkHover={setHoverLink}
          onRenderComplete={(graph) => {
            graphRef.current = graph;
            setLoading(false)
          }}
          // onNodeMouseOver={n => setHoverWord(n)}
          // onNodeMouseLeave={_ => setHoverWord(undefined)}
          onNodeHover={n => setHoverWord(n)}
        />
      )
    } else if (graph.type == '3d') {
      return (
        <Graph3D
          theme={theme}
          data={{
            nodes: graphData.words,
            links: graphData.links
          }}
          selectedNodeIds={graphSelectedWordIds || []}
          highLightNodeIds={wordFindPath.path}
          focusNodeId={focusedWordId}
          onNodeClick={nodeClickHandle}
          hoverLink={hoverLink}
          onLinkHover={setHoverLink}
          onRenderComplete={() => {
            setLoading(false)
          }}
          onNodeMouseOver={n => setHoverWord(n)}
          onNodeMouseLeave={_ => setHoverWord(undefined)}
        />
      )
    }
  }

  return (
    <div className='flex w-full h-full overflow-hidden relative'>
      <WordsGraphDrawer/>
      <WordsGraphSide/>
      <div
        ref={wrapperRef}
        className={`grow h-full relative overflow-hidden`}
        onMouseMove={e => {
          mouseRef.current = {x: e.clientX, y: e.clientY}
        }}
      >
        {buildGraph()}
        <WordMenu
          position={!(wordMenuState.active || wordMenuState.focus) ? {x: 0, y:0, z: -1, display: false} : {
            x: wordMenuState.x,
            y: wordMenuState.y,
            z: 99,
            display: true
          }}
          onMouseOver={() => setWordMenuState(st => ({...st, focus: true}))}
          onMouseLeave={() => setWordMenuState(st => ({...st, focus: false}))}
          onAction={(a) => nodeActionHandle(a, hoverWord)}
        />
        <LinkMenu
          position={!(linkMenuState.active || linkMenuState.focus) ? {x: 0, y:0, z: -1, display: false} : {
            x: linkMenuState.x,
            y: linkMenuState.y,
            z: 99,
            display: true
          }}
          onMouseOver={() => setLinkMenuState(st => ({...st, focus: true}))}
          onMouseLeave={() => setLinkMenuState(st => ({...st, focus: false}))}
          onAction={(a) => linkActionHandle(a, hoverLink)}
        />

        {!loading && !graphData.loading && isEmpty(graphData.words) && (
          <div className='flex w-full h-full absolute left-0 top-0 pointer-events-none flex justify-center items-center'>
            <button className='btn btn-sm pointer-events-auto' onClick={() => {
              dispatch({type: WordActions.ADD_WORD_START, data: {graphId: graph.id}})
            }}>
              <Icon icon={IconCirclePlus} className='w-4'/>
              {t('addWord')}
            </button>
          </div>
        )}
        <div className={`${loading ? 'visible' : 'invisible'} transition-all ease-in-out duration-1000 z-999 absolute top-0 left-0 w-full h-full flex items-center justify-center`}>
          <div className='loading loading-infinity loading-lg scale-150 text-natural'/>
        </div>
      </div>
    </div>
  )
}

export default WordsGraph