import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";

import { GraphActions, createGraphAction, deleteGraphAction, updateGraphAction } from "../redux/_graph.redux";
import Modal from "./Modal";
import GraphForm from "./GraphForm";
import { showToast } from "../common/toast";
import ConfirmComponent from "./ConfirmComponent";

const GraphModal: React.FC<{}> = ({
}) => {
  const {t} = useTranslation('common')
  const router = useRouter()
  const dispatch = useDispatch()
  const user = useSelector(state => state.auth.user)
  const createGraph = useSelector(state => state.graph.create)
  const editGraph = useSelector(state => state.graph.edit)
  const deleteGraph = useSelector(state => state.graph.delete)

  const active = createGraph.active || editGraph.active || deleteGraph.active

  useEffect(() => {
    if(active) {
      window?.graph_modal?.showModal()
    } else {
      window?.graph_modal?.close()
    }
  }, [active])

  const handleClose = () => {
    if(createGraph.active) {
      dispatch({type: GraphActions.ADD_GRAPH_END})
    }
    if(editGraph.active) {
      dispatch({type: GraphActions.EDIT_GRAPH_END})
    }
    if(deleteGraph.active) {
      dispatch({type: GraphActions.DELETE_GRAPH_END})
    }
  }

  const handleCreateSubmit = async (data: any) => {
    await dispatch(createGraphAction(data)).then(() => {
      showToast('success', t('dataSavedSuccessful'))
      dispatch({type: GraphActions.ADD_GRAPH_END})
    })
  }

  const handleEditSubmit = async (id: string, data: any) => {
    await dispatch(updateGraphAction(id, data)).then(() => {
      showToast('success', t('dataSavedSuccessful'))
      dispatch({type: GraphActions.EDIT_GRAPH_END})
    })
  }

  const handleDeleteSubmit = async (id: string) => {
    await dispatch(deleteGraphAction(id)).then(() => {
      showToast('success', t('deleted'))
      dispatch({type: GraphActions.DELETE_GRAPH_END})
      // redirect to user's page if current graph was deleted

      if(router.query.id === id) {
        router.replace('/users/' + user.id)
      }
    })
  }

  return (
    <Modal id={'graph_modal'} onClose={handleClose}>
      <div className="flex flex-col justify-center">
        <div className="relative">
          <div
            className="absolute inset-0 bg-gradient-to-r from-primary to-secondary shadow-lg transform -skew-y-6 sm:skew-y-0 sm:-rotate-6 sm:rounded-box">
          </div>
          <div className="relative bg-base-100 shadow-lg px-2 py-4 sm:p-10 sm:rounded-box">
            <div className="min-w-xl mx-auto">
              {createGraph.active ? (
                <GraphForm
                  title={t('createGraph')}
                  loading={createGraph.loading}
                  error={createGraph.error}
                  onSubmit={handleCreateSubmit}
                />
              ): editGraph.active ? (
                <GraphForm
                  title={t('editGraph')}
                  loading={editGraph.loading}
                  graph={editGraph.graph}
                  error={editGraph.error}
                  onSubmit={(data) => handleEditSubmit(editGraph.graph.id, data)}
                />
              ): deleteGraph.active ? (
                <ConfirmComponent
                  message={t('deleteGraph') + ' ' + deleteGraph.graph.name}
                  loading={deleteGraph.loading}
                  error={deleteGraph.error}
                  onAccept={() => handleDeleteSubmit(deleteGraph.graph.id)}
                  onCancel={() => dispatch({type: GraphActions.DELETE_GRAPH_END})}
                />
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </Modal>
  )
}

export default GraphModal;