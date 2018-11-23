import {
  FETCH_USER_APPROVALS,
  FETCH_USER_APPROVALS_SUCCESS,
  FETCH_USER_APPROVALS_FAILURE,
  UPDATE_REQUEST_STATUS,
  UPDATE_REQUEST_STATUS_SUCCESS,
  UPDATE_REQUEST_STATUS_FAILURE
} from '../constants/actionTypes';

export const fetchUserApprovals = (url) => ({ //eslint-disable-line
  type: FETCH_USER_APPROVALS,
  url
});


export const fetchUserApprovalsSuccess = (response) => ({
  type: FETCH_USER_APPROVALS_SUCCESS,
  approvals: response.approvals,
  message: response.message,
  meta:  response.meta
});

export const fetchUserApprovalsFailure = (error) => ({
  type: FETCH_USER_APPROVALS_FAILURE,
  error
});

export const updateRequestStatus = (statusUpdateData) => ({
  type: UPDATE_REQUEST_STATUS,
  statusUpdateData
});

export const updateRequestStatusSuccess = (updatedRequest) => ({
  type: UPDATE_REQUEST_STATUS_SUCCESS,
  updatedRequest,
});

export const updateRequestStatusFailure = (error) => ({
  type: UPDATE_REQUEST_STATUS_FAILURE,
  error,
});
