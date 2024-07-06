import { ApiConst } from '../common/api'

import { ApiFactory } from '../api/Api'
import { actionFail, actionSuccess } from '.'
import { updateArrayItem } from '../common/array'

export class GraphActions {
  static GET_GRAPHS = 'graphs/getList'
  static ADD_GRAPH_START = 'graphs/addGraphStart'
  static ADD_GRAPH_END = 'graphs/addGraphEnd'
  static ADD_GRAPH = 'graphs/addGraph'
  static EDIT_GRAPH_START = 'graphs/editGraphStart'
  static EDIT_GRAPH_END = 'graphs/editGraphEnd'
  static EDIT_GRAPH = 'graphs/editGraph'
  static DELETE_GRAPH_START = 'graphs/deleteGraphStart'
  static DELETE_GRAPH_END = 'graphs/deleteGraphEnd'
  static DELETE_GRAPH = 'graphs/deleteGraph'
}

const initialState = {
  list: {
    params: null,
    items: [],
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
    graph: null,
    data: null,
    loading: false,
    error: null
  },
  delete: {
    active: false,
    graph: null,
    loading: false,
    error: null
  }
}


export function getMyGraphs() {
  return {
    secure: true,
    type: GraphActions.GET_GRAPHS,
    promise: ((client: ApiFactory) => {
      return client.get(ApiConst.GRAPHS)
    })
  }
}

export function getGraphsAction() {
  return {
    type: GraphActions.GET_GRAPHS,
    promise: ((client: ApiFactory) => {
      return client.get(ApiConst.GRAPHS)
    })
  }
}

export function createGraphAction(data: any) {
  return {
    secure: true,
    type: GraphActions.ADD_GRAPH,
    promise: ((client: ApiFactory) => {
      return client.post(ApiConst.GRAPHS, data)
    })
  }
}

export function updateGraphAction(id: string, data: any) {
  return {
    secure: true,
    type: GraphActions.EDIT_GRAPH,
    data: data,
    promise: ((client: ApiFactory) => {
      return client.put(`${ApiConst.GRAPHS}/${id}`, data)
    })
  }
}

export function deleteGraphAction(id: string) {
  return {
    secure: true,
    type: GraphActions.DELETE_GRAPH,
    promise: ((client: ApiFactory) => {
      return client.delete(`${ApiConst.GRAPHS}/${id}`)
    })
  }
}

export function graph(state = initialState, action: any) {
  switch (action.type) {
    case GraphActions.GET_GRAPHS:
      return {
        ...state,
        list: {
          ...state.list,
          loading: true,
          error: null
        }
      }
    case actionSuccess(GraphActions.GET_GRAPHS):
      return {
        ...state,
        list: {
          ...state.list,
          items: action.data,
          loading: false,
          error: null,
        }
      }
    case actionFail(GraphActions.GET_GRAPHS):
      return {
        ...state,
        list: {
          ...state.list,
          loading: false,
          error: action.error
        }
      }
    case GraphActions.ADD_GRAPH_START:
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
    case GraphActions.ADD_GRAPH_END:
      return {
        ...state,
        create: {
          ...state.create,
          active: false,
          data: null,
          error: null
        }
      }
    case GraphActions.ADD_GRAPH:
      return {
        ...state,
        create: {
          ...state.create,
          loading: true,
          error: null
        }
      }
    case actionSuccess(GraphActions.ADD_GRAPH):
      return {
        ...state,
        // add created graph to graph
        list: {
          ...state.list,
          items: [
            ...state.list.items,
            action.data
          ]
        },
        create: {
          ...state.create,
          loading: false,
          error: null,
        }
      }
    case actionFail(GraphActions.ADD_GRAPH):
      return {
        ...state,
        create: {
          ...state.create,
          loading: false,
          error: action.error
        }
      }

    //edit
    case GraphActions.EDIT_GRAPH_START:
      return {
        ...state,
        edit: {
          ...state.edit,
          active: true,
          graph: action.graph,
          loading: false,
          error: null,
        }
      }
    case GraphActions.EDIT_GRAPH_END:
      return {
        ...state,
        edit: {
          ...state.edit,
          active: false,
          graph: null,
          data: null,
          error: null
        }
      }
    case GraphActions.EDIT_GRAPH:
      console.debug(action.data)
      return {
        ...state,
        edit: {
          ...state.edit,
          data: action.data,
          loading: true,
        }
      }
    case actionSuccess(GraphActions.EDIT_GRAPH):
      return {
        ...state,
        edit: {
          ...state.edit,
          loading: false,
          error: null,
        },
        list: {
          ...state.list,
          items: updateArrayItem(state.list.items, (i) => i.id === state.edit.graph?.id, state.edit.data)
        }
      }
    case actionFail(GraphActions.EDIT_GRAPH):
      return {
        ...state,
        edit: {
          ...state.edit,
          loading: false,
          error: action.error
        }
      }
    // delete
    case GraphActions.DELETE_GRAPH_START:
      return {
        ...state,
        delete: {
          ...state.delete,
          graph: action.graph,
          active: true,
          loading: false,
          error: null,
        }
      }
    case GraphActions.DELETE_GRAPH_END:
      return {
        ...state,
        delete: {
          ...state.delete,
          active: false,
          graph: null,
          error: null
        }
      }
    case GraphActions.DELETE_GRAPH:
      return {
        ...state,
        delete: {
          ...state.delete,
          loading: true,
          error: null,
        }
      }
    case actionSuccess(GraphActions.DELETE_GRAPH):
      return {
        ...state,
        list: {
          ...state.list,
          items: state.list.items?.filter(i => i.id !== state.delete.graph?.id)
        },
        delete: {
          ...state.delete,
          loading: false,
          error: null,
        }
      }
    case actionFail(GraphActions.DELETE_GRAPH):
      return {
        ...state,
        delete: {
          ...state.delete,
          loading: false,
          error: action.error,
        }
      }
    
    default:
      return state;
  }
}


