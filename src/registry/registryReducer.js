import { REQUEST_RESEARCHERS_SUCCESS, REQUEST_PENDING_SUCCESS } from './ui/registrylist/RegistryListActions'

let initialState = {
  researchers: [],
  pending: [],
  owner: false,
  waitingApproval: false
}

const registryReducer = (state = initialState, action) => {
  switch(action.type) {
    case REQUEST_RESEARCHERS_SUCCESS:
      return Object.assign({}, state, {
        researchers: action.payload
      })
    case REQUEST_PENDING_SUCCESS:
      return Object.assign({}, state, {
        pending: action.payload
      })
    case 'REQUEST_APPROVAL':
    case 'IS_OWNER':
    default:
      return state
  }

}

export default registryReducer
