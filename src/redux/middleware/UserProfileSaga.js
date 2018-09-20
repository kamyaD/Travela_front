import { put, takeLatest, call } from 'redux-saga/effects';
import toast from 'toastr';
import ProfileApi from '../../services/ProfileApi';
import apiErrorHandler from '../../services/apiErrorHandler';
import {UPDATE_USER_PROFILE} from '../constants/actionTypes';
import updateUserProfile from '../actionCreator/userProfileActions';


export function* postUserProfileDataSagaAsync(action){
  try{
    const response = yield call(ProfileApi.updateUserProfile, action.userProfileData, action.userId);
    toast.success('Profile updated successfully');
  } catch (error) {
    const errorMessage = apiErrorHandler(error);
    toast.error(errorMessage);
  }
}


export function* watchUpdateUserProfileAsync(){
  yield takeLatest(UPDATE_USER_PROFILE, postUserProfileDataSagaAsync);
}
