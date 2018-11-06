import { put, takeLatest, call } from 'redux-saga/effects';
import toast from 'toastr';
import TravelChecklistAPI from '../../services/travelChecklistAPI';
import apiErrorHandler from '../../services/apiErrorHandler';
import {
  FETCH_TRAVEL_CHECKLIST,
  UPDATE_TRAVEL_CHECKLIST,
  CREATE_TRAVEL_CHECKLIST,
  DELETE_TRAVEL_CHECKLIST,
  FETCH_DELETED_CHECKLISTITEMS,
} from '../constants/actionTypes';
import {
  fetchTravelChecklistFailure,
  fetchTravelChecklistSuccess,
  updateChecklistSuccess,
  updateChecklistFailure,
  createChecklistFailure,
  createChecklistSuccess,
  deleteChecklistSuccess,
  deleteChecklistFailure,
  fetchTravelChecklist,
  fetchDeletedChecklistItemsSuccess,
  fetchDeletedChecklistItemsFailure,
  fetchDeletedChecklistItems,
} from '../actionCreator/travelChecklistActions';
import { closeModal } from '../actionCreator/modalActions';

export function* createChecklistAsync(action) {
  try {
    const { requiresFiles, label, link, name, resources } = action.checklistItemData;
    // restructure data from CREATE_TRAVEL_CHECKLIST action
    // to match what the api is expecting
    const checklistItemData = {
      name,
      requiresFiles: requiresFiles === 'true',// convert to boolean
      resources
    };
    const response = yield call(TravelChecklistAPI.createChecklist, checklistItemData);
    yield put(createChecklistSuccess(response.data));
    toast.success(response.data.message);
    yield put(closeModal());
  }
  catch(error) {
    const errorMessage = apiErrorHandler(error);
    yield put(createChecklistFailure(errorMessage));
    toast.error(errorMessage);
  }
}

export function* watchCreateChecklist() {
  yield takeLatest(CREATE_TRAVEL_CHECKLIST, createChecklistAsync);
}

export function* fetchAllChecklistsSync(action) {
  try {
    const serverResponse = yield call(
      TravelChecklistAPI.getAllChecklists, action.requestId, action.destinationName
    );
    yield put(fetchTravelChecklistSuccess(serverResponse.data));
  } catch(error) {
    const err = apiErrorHandler(error);
    yield put(fetchTravelChecklistFailure(err));
  }
}

export function* watchFetchAllChecklists() {
  yield takeLatest(FETCH_TRAVEL_CHECKLIST, fetchAllChecklistsSync);
}


export function* updateChecklistAsync(action) {
  try {
    const { checklistItemId, checklistItemData } = action;
    const { location } = localStorage;
    const response = yield call(TravelChecklistAPI.updateChecklistItem, checklistItemId, checklistItemData);
    yield put(updateChecklistSuccess(response.data.updatedChecklistItem, checklistItemId));
    yield put(closeModal());
    toast.success(response.data.message);
    yield put(fetchTravelChecklist(null, location));
    yield put(fetchDeletedChecklistItems(location));
  }
  catch(error) {
    const errorMessage = apiErrorHandler(error);
    yield put(updateChecklistFailure(errorMessage));
    toast.error(errorMessage);
  }
}

export function* watchUpdateChecklist() {
  yield takeLatest(UPDATE_TRAVEL_CHECKLIST, updateChecklistAsync);
}

export function* deleteChecklistAsync(action) {
  try {
    const { checklistItemId, deleteReason } = action;
    const { location } = localStorage;
    const response = yield call(TravelChecklistAPI.deleteChecklistItem, {checklistItemId, deleteReason});
    yield put(deleteChecklistSuccess(checklistItemId));
    toast.success(response.data.message);
    yield put(closeModal());
    yield put(fetchTravelChecklist(null, location));
    yield put(fetchDeletedChecklistItems(location));
  }
  catch(error) {
    const errorMessage = apiErrorHandler(error);
    yield put(deleteChecklistFailure(errorMessage));
    toast.error(errorMessage);
  }
}

export function* watchDeleteChecklist() {
  yield takeLatest(DELETE_TRAVEL_CHECKLIST, deleteChecklistAsync);
}
export function* fetchDeletedChecklistItemsAsync(action) {
  try {
    const response = yield call(TravelChecklistAPI.getDeletedCheckListItems, action.destinationName);
    yield put(fetchDeletedChecklistItemsSuccess(response.data));
  } catch(error) {
    const errorMessage = apiErrorHandler(error);
    yield put(fetchDeletedChecklistItemsFailure(errorMessage));
    if (errorMessage !== 'There are currently no deleted travel checklist items for your location') {
      toast.error(errorMessage);
    }
  }
}

export function* watchFetchDeletedChecklistItems() {
  yield takeLatest(FETCH_DELETED_CHECKLISTITEMS, fetchDeletedChecklistItemsAsync);
}
