import lodash from 'lodash'
import { ApiConst } from '../common/api'

import { ApiFactory } from '../api/Api'
import { Link, Word } from '../domain/models'
import { actionFail, actionSuccess } from '.'
import { isEqual } from '../common/array'

export class WordActions {
  static CLEAN_GRAPH = 'words/cleanGraph'
  static GET_GRAPH_NODES = 'words/getGraphNodes'
  static GET_MORE_GRAPH_NODES = 'words/getMoreGraphNodes'
  static GRAPH_NODE_SELECT = 'words/graphNodeSelect'
  static GRAPH_NODE_FOCUS = 'words/graphNodeFocus'
  static SEARCH_WORD = 'words/searchWords'
  static SHOW_DETAIL = 'words/showDetail'
  static SHOW_DETAIL_END = 'words/showDetailEnd'
  static GET_DETAIL = 'words/getDetail'
  static ADD_WORD_START = 'words/addWordStart'
  static ADD_WORD_END = 'words/addWordEnd'
  static ADD_WORD = 'words/addWord'
  static EDIT_WORD_START = 'words/editWordStart'
  static EDIT_WORD_END = 'words/editWordEnd'
  static EDIT_WORD = 'words/editWord'
  static DELETE_WORD_START = 'words/deleteWordStart'
  static DELETE_WORD_END = 'words/deleteWordEnd'
  static DELETE_WORD = 'words/deleteWord'
  static LINK_FROM = 'words/linkFrom'
  static LINK_TO = 'words/linkTo'
  static LINK_END = 'words/linkEnd'
  static LINK_2_WORDS = 'words/link2Words'
  static UNLINK_START = 'words/unlinkStart'
  static UNLINK_END = 'words/unlinkEnd'
  static UNLINK = 'words/unlink'
  static FIND_PATH_FROM = 'words/findPathFrom'
  static FIND_PATH_TO = 'words/findPathTo'
  static FIND_PATH_END = 'words/findPathEnd'
  static FIND_PATH = 'words/findPath'
}

const initialState = {
  graph: {
    data: {
      words: [],
      links: [],
    },
    selectedWordIds: [],
    focusWordId: null,
    loading: false,
    error: null
  },
  search: {
    params: null,
    words: [],
    loading: false,
    error: null,
  },
  detail: {
    id: null,
    data: null,
    loading: false,
    error: null,
  },
  create: {
    active: false,
    data: null,
    loading: true,
    error: null,
  },
  edit: {
    active: false,
    id: null,
    data: null,
    loading: false,
    error: null
  },
  delete: {
    active: false,
    id: null,
    loading: false,
    error: null
  },
  link: {
    source: null,
    target: null,
    active: false,
    loading: false,
    error: null
  },
  unlink: {
    source: null,
    target: null,
    active: false,
    loading: false,
    error: null
  },
  findPath: {
    source: null,
    target: null,
    active: false,
    loading: false,
    error: null
  }
}

export function getWordsGraphAction(graphId: string) {
  return {
    secure: true,
    type: WordActions.GET_GRAPH_NODES,
    graphId: graphId,
    promise: ((client: ApiFactory) => {
      return client.get(ApiConst.GRAPHS_DATA(graphId))
    })
  }
}

export function searchWordsAction(params: any) {
  return {
    secure: true,
    type: WordActions.SEARCH_WORD,
    promise: ((client: ApiFactory) => {
      return client.get(`${ApiConst.WORDS}/search` , params)
    })
  }
}

export function getWordDetailSilentAction(id: string) {
  return {
    secure: true,
    type: 'silent',
    promise: ((client: ApiFactory) => {
      return client.get(`${ApiConst.WORDS}/${id}`)
    })
  }
}

export function getWordDetailAction(id: string) {
  return {
    secure: true,
    type: WordActions.GET_DETAIL,
    data: {id},
    promise: ((client: ApiFactory) => {
      return client.get(`${ApiConst.WORDS}/${id}`)
    })
  }
}

export function createWordAction(data: Partial<Word> & {sourceId?: string}) {
  return {
    secure: true,
    type: WordActions.ADD_WORD,
    promise: ((client: ApiFactory) => {
      return client.post(ApiConst.WORDS, data)
    })
  }
}

export function updateWordAction(id: string, data: Partial<Word>) {
  return {
    secure: true,
    type: WordActions.EDIT_WORD,
    promise: ((client: ApiFactory) => {
      return client.put(`${ApiConst.WORDS}/${id}`, data)
    })
  }
}

export function deleteWordAction(id: string) {
  return {
    secure: true,
    type: WordActions.DELETE_WORD,
    promise: ((client: ApiFactory) => {
      return client.delete(`${ApiConst.WORDS}/${id}`)
    })
  }
}

export function link2WordsAction(sourceId: string, targetId: string) {
  return {
    secure: true,
    type: WordActions.LINK_2_WORDS,
    promise: ((client: ApiFactory) => {
      return client.post(`${ApiConst.WORDS}/links`, {sourceId, targetId})
    })
  }
}

export function findWordsPathAction(fromId: string, toId: string) {
  return {
    secure: true,
    type: WordActions.FIND_PATH,
    promise: ((client: ApiFactory) => {
      return client.get(`${ApiConst.WORDS}/findPath`, {fromId, toId})
    })
  }
}

export function unlinkWordsAction(fromId: string, toId: string) {
  return {
    secure: true,
    type: WordActions.UNLINK,
    promise: ((client: ApiFactory) => {
      return client.delete(ApiConst.LINKS, {word1Id: fromId, word2Id: toId})
    })
  }
}

export function word(state = initialState, action: any) {
  switch (action.type) {
    case WordActions.CLEAN_GRAPH:
      return {
        ...state,
        graph: {
          data: {
            words: [],
            links: [],
          },
          selectedWordIds: [],
          focusWordId: null,
          loading: false,
          error: null
        },
        detail: {
          id: null,
          data: null,
          loading: false,
          error: null,
        },
      }
    case WordActions.GET_GRAPH_NODES:
      return {
        ...state,
        graph: {
          ...state.graph,
          graphId: action.graphId,
          loading: true,
          error: null
        }
      }
    case actionSuccess(WordActions.GET_GRAPH_NODES):
      return {
        ...state,
        graph: {
          ...state.graph,
          data: action.data,
          loading: false,
          error: null,
        }
      }
    case actionFail(WordActions.GET_GRAPH_NODES):
      return {
        ...state,
        graph: {
          ...state.graph,
          loading: false,
          error: action.error
        }
      }
    case WordActions.GET_MORE_GRAPH_NODES:
      return {
        ...state,
        graph: {
          ...state.graph,
          loading: true,
          error: null
        }
      }
    case actionSuccess(WordActions.GET_MORE_GRAPH_NODES): {
      let newWords = action.data.words.filter((wo: Word) => !Boolean(state.graph.data.words.find(w => w.id === wo.id)))
      let newLinks = action.data.links.filter((li: Link) => !Boolean(state.graph.data.links.find(l => isEqual([li.sourceId, li.targetId], [l.sourceId, l.targetId]))))
      let newData = {
        words: [...state.graph.data.words, ...newWords],
        links: [...state.graph.data.links, ...newLinks],
      }
      return {
        ...state,
        graph: {
          ...state.graph,
          data: newData,
          loading: false,
          error: null,
        }
      }
    }
    case actionSuccess(WordActions.GET_MORE_GRAPH_NODES):
      return {
        ...state,
        graph: {
          ...state.graph,
          loading: false,
          error: action.error
        }
      }
    case WordActions.GRAPH_NODE_SELECT:
      return {
        ...state,
        graph: {
          ...state.graph,
          selectedWordIds: action.ids || []
        }
      }
    case WordActions.GRAPH_NODE_FOCUS:
      return {
        ...state,
        graph: {
          ...state.graph,
          focusWordId: action.id
        }
      }
    // search word
    case WordActions.SEARCH_WORD:
      return {
        ...state,
        search: {
          params: action.data,
          words: [],
          loading: true,
          error: null
        }
      }
    case actionSuccess(WordActions.SEARCH_WORD):
      return {
        ...state,
        search: {
          ...state.search,
          words: action.data,
          loading: false,
          error: null
        }
      }
    case actionFail(WordActions.SEARCH_WORD):
      return {
        ...state,
        search: {
          ...state.search,
          words: [],
          loading: false,
          error: action.error
        }
      }
    // detail
    case WordActions.SHOW_DETAIL:
      return {
        ...state,
        detail: {
          ...state.detail,
          active: true,
          id: action.id,
        }
      }
    case WordActions.SHOW_DETAIL_END:
      return {
        ...state,
        detail: {
          ...state.detail,
          active: false,
          id: null,
        }
      }
    case WordActions.GET_DETAIL:
      return {
        ...state,
        detail: {
          ...state.detail,
          data: null,
          loading: true,
          error: null
        }
      }
    case actionSuccess(WordActions.GET_DETAIL):
      return {
        ...state,
        detail: {
          ...state.detail,
          data: action.data,
          loading: false,
          error: null
        }
      }
    case actionFail(WordActions.GET_DETAIL):
      return {
        ...state,
        detail: {
          ...state.detail,
          loading: false,
          error: action.error
        }
      }
    case WordActions.ADD_WORD_START:
      return {
        ...state,
        create: {
          ...state.create,
          active: true,
          data: action.data,
          loading: false,
          error: null,
        }
      }
    case WordActions.ADD_WORD_END:
      return {
        ...state,
        create: {
          ...state.create,
          active: false,
          data: null,
          error: null
        }
      }
    case WordActions.ADD_WORD:
      return {
        ...state,
        create: {
          ...state.create,
          loading: true,
        }
      }
    case actionSuccess(WordActions.ADD_WORD):
      const {word, link} = action.data;
      return {
        ...state,
        // add created word to graph
        graph: {
          ...state.graph,
          data: {
            ...state.graph.data,
            words: Boolean(word) ? [...state.graph.data.words, word] : state.graph.data.words,
            links: Boolean(link) ? [...state.graph.data.links, link] : state.graph.data.links,
          }
        },
        create: {
          ...state.create,
          loading: false,
          error: null,
        }
      }
    case actionFail(WordActions.ADD_WORD):
      return {
        ...state,
        create: {
          ...state.create,
          loading: false,
          error: action.error
        }
      }

    //edit
    case WordActions.EDIT_WORD_START:
      return {
        ...state,
        edit: {
          ...state.edit,
          active: true,
          id: action.id,
          loading: false,
          error: null,
        }
      }
    case WordActions.EDIT_WORD_END:
      return {
        ...state,
        edit: {
          ...state.edit,
          active: false,
          id: null,
          data: null,
          error: null
        }
      }
    case WordActions.EDIT_WORD:
      return {
        ...state,
        edit: {
          ...state.edit,
          data: action.data,
          loading: true,
        }
      }
    case actionSuccess(WordActions.EDIT_WORD):
      var _gData = lodash.cloneDeep(state.graph.data)
      var _editData: any = state.edit.data
      var w: any = _gData.words.find(w => w.id === state.edit.id)
      if (w) {
        w.content = _editData?.content
      }
      return {
        ...state,
        // add created word to graph
        graph: {
          ...state.graph,
          data: _gData
        },
        edit: {
          ...state.edit,
          loading: false,
          error: null,
        }
      }
    case actionFail(WordActions.EDIT_WORD):
      return {
        ...state,
        edit: {
          ...state.edit,
          loading: false,
          error: action.error
        }
      }
    // delete
    case WordActions.DELETE_WORD_START:
      return {
        ...state,
        delete: {
          ...state.delete,
          data: action.data,
          active: true,
          loading: false,
          error: null,
        }
      }
    case WordActions.DELETE_WORD_END:
      return {
        ...state,
        delete: {
          ...state.delete,
          active: false,
          data: null,
          error: null
        }
      }
    case WordActions.DELETE_WORD:
      return {
        ...state,
        delete: {
          ...state.delete,
          loading: true,
          error: null,
        }
      }
    case actionSuccess(WordActions.DELETE_WORD):
      return {
        ...state,
        delete: {
          ...state.delete,
          loading: false,
          error: null,
        },
        graph: {
          ...state.graph,
          data: {
            words: state.graph.data.words.filter(w => w.id !== state.delete.id),
            links: state.graph.data.links.filter(l => ![l.sourceId, l.targetId].includes(state.delete.id))
          }
        }
      }
    case actionFail(WordActions.DELETE_WORD):
      return {
        ...state,
        delete: {
          ...state.delete,
          loading: false,
          error: action.error,
        }
      }
    
    // create link from word 1 to word 2
    case WordActions.LINK_FROM:
      return {
        ...state,
        link: {
          ...state.link,
          source: action.word,
          active: true,
        }
      }
    case WordActions.LINK_TO:
      return {
        ...state,
        link: {
          ...state.link,
          target: action.word,
          active: true,
        }
      }
    case WordActions.LINK_END:
      return {
        ...state,
        link: {
          ...state.link,
          source: null,
          target: null,
          active: false,
        }
      }
    case WordActions.LINK_2_WORDS:
      return {
        ...state,
        link: {
          ...state.link,
          loading: true,
          error: null
        }
      }
    case actionSuccess(WordActions.LINK_2_WORDS):
      return {
        ...state,
        link: {
          ...state.link,
          loading: false
        },
        graph: {
          ...state.graph,
          data: {
            ...state.graph.data,
            links: [...state.graph.data.links, {sourceId: state.link.source.id, targetId: state.link.target.id}]
          }
        }
      }
    case actionFail(WordActions.LINK_2_WORDS):
      return {
        ...state,
        link: {
          ...state.link,
          loading: false,
          error: action.error
        }
      }
    
    // unlink 2 words
    case WordActions.UNLINK_START:
      return {
        ...state,
        unlink: {
          ...state.unlink,
          data: action.data,
          active: true,
        }
      }
    case WordActions.UNLINK_END:
      return {
        ...state,
        unlink: {
          ...state.unlink,
          data: null,
          active: false,
        }
      }
    case WordActions.UNLINK:
      return {
        ...state,
        unlink: {
          ...state.unlink,
          loading: true,
          error: null
        }
      }
    case actionSuccess(WordActions.UNLINK):
      return {
        ...state,
        unlink: {
          ...state.unlink,
          loading: false
        },
        graph: {
          ...state.graph,
          data: {
            ...state.graph.data,
            links: [...state.graph.data.links].filter(
              l => !isEqual([l.sourceId, l.targetId], [state.unlink.source?.id, state.unlink.target?.id])
            )
          }
        }
      }
    case actionFail(WordActions.UNLINK):
      return {
        ...state,
        unlink: {
          ...state.unlink,
          loading: false,
          error: action.error
        }
      }

    // find path from word 1 to word 2
    case WordActions.FIND_PATH_FROM:
      return {
        ...state,
        findPath: {
          ...state.findPath,
          source: action.word,
          active: true,
          path: null,
        }
      }
    case WordActions.FIND_PATH_TO:
      return {
        ...state,
        findPath: {
          ...state.findPath,
          target: action.word,
          active: true,
          path: null,
        }
      }
    case WordActions.FIND_PATH_END:
      return {
        ...state,
        findPath: {
          ...state.findPath,
          source: null,
          target: null,
          path: null,
          active: false,
        }
      }
    case WordActions.FIND_PATH:
      return {
        ...state,
        findPath: {
          ...state.findPath,
          loading: true,
          error: null
        }
      }
    case actionSuccess(WordActions.FIND_PATH): {
      // add words and links in path to graph
      let newWords = action.data.words.filter((wo: Word) => !Boolean(state.graph.data.words.find(w => w.id === wo.id)))
      let newLinks = action.data.links.filter((li: Link) => !Boolean(state.graph.data.links.find(l => isEqual([li.sourceId, li.targetId], [l.sourceId, l.targetId]))))
      let newData = {
        words: [...state.graph.data.words, ...newWords],
        links: [...state.graph.data.links, ...newLinks],
      }
      return {
        ...state,
        graph: {
          ...state.graph,
          data: newData
        },
        findPath: {
          ...state.findPath,
          path: action.data.words.map((w: Word) => w.id),
          loading: false
        },
      }
    }
    case actionFail(WordActions.FIND_PATH):
      return {
        ...state,
        findPath: {
          ...state.findPath,
          loading: false,
          error: action.error
        }
      }
    default:
      return state;
  }
}


