import { put, takeLatest, takeEvery, call } from 'redux-saga/effects';
import FileSaver from 'file-saver';
import toast from 'toastr';
import * as _ from 'lodash';
import ReadinessAPI from '../../services/ReadinessAPI';
import apiErrorHandler from '../../services/apiErrorHandler';
import {
  FETCH_TRAVEL_READINESS,
  EXPORT_TRAVEL_READINESS,
  CREATE_TRAVEL_READINESS_DOCUMENT
} from '../constants/actionTypes';
import {
  fetchReadinessSuccess,
  fetchReadinessFailure,
  exportReadinessFailure,
  exportReadinessSuccess,
  createTravelReadinessDocumentSuccess, createTravelReadinessDocumentFailure
} from '../actionCreator/travelReadinessActions';
import {closeModal} from '../actionCreator/modalActions';

//fetch Travel Readiness from API and dispatch action to get this data to store via reducer
export function* fetchReadinessSaga(action){
  try{
    const response = yield call(ReadinessAPI.getTravelReadiness, action.query);
    yield put(fetchReadinessSuccess(response.data));
  }catch(error){
    let errorMessage = apiErrorHandler(error);
    yield put(fetchReadinessFailure(errorMessage));
  }
}

// export function* createTravelReadinessDocument(action) {
//   try{
//     const response = yield call(ReadinessAPI.createDocument, action.documentType, action.payload);
//     yield put(createTravelReadinessDocumentSuccess(response));
//     toast.success(_.capitalize(action.documentType)+' created successfully!');
//     yield put(closeModal());
//   }catch (error) {
//     if( error.response.status === 409){
//       const {  response: { data: { errors }}} = error;
//       errors && errors.length > 0 && toast.error(errors[0].message);
//     }
//     yield put(createTravelReadinessDocumentFailure(error.response.data));
//   }
// }

export function* createTravelReadinessDocument(action) {
  try{
    const response = yield call(ReadinessAPI.createDocument, action.documentType, action.payload);
    yield put(createTravelReadinessDocumentSuccess(response));
    toast.success(_.capitalize(action.documentType)+' created successfully!');
    yield put(closeModal());
  }catch (error) {
    if( error.response.status === 409){
      toast.error(apiErrorHandler(error));
    }
    yield put(createTravelReadinessDocumentFailure(error.response.data));
  }
}

export function* exportReadinessSaga(action){
  try{
    const response = yield call(ReadinessAPI.exportTravelReadiness, action.query);
    yield FileSaver.saveAs(response.data, 'Travel readiness for all travelers.csv');
    yield put(exportReadinessSuccess());
  }catch(error){
    let errorMessage = apiErrorHandler(error);
    yield put(exportReadinessFailure(errorMessage));
  }
}

export function* watchFetchReadiness(){
  yield takeEvery(FETCH_TRAVEL_READINESS, fetchReadinessSaga);
}

export function* watchExportReadiness(){
  yield takeEvery(EXPORT_TRAVEL_READINESS, exportReadinessSaga);
}


export function* watchCreateTravelReadinessDocument() {
  yield takeLatest(CREATE_TRAVEL_READINESS_DOCUMENT, createTravelReadinessDocument);
}
