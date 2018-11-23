import { call, put } from 'redux-saga/effects';
import { expectSaga } from 'redux-saga-test-plan';
import { throwError } from 'redux-saga-test-plan/providers';
import mockAxios from '../../__mocks__/mockAxios';
import {
  fetchUserApprovalsSuccess,
  fetchUserApprovalsFailure,
} from '../../actionCreator';
import ApprovalsAPI from '../../../services/approvalsAPI';
import { watchUpdateRequestStatus, watchFetchApprovals } from '../approvalsSaga';


const action = {
  type: 'FETCH_USER_APPROVALS',
  url: '?status=open'
};

describe('Approvals saga', () => {
  describe('fetchApprovals', () => {
    let sagaConstructor, testSaga, axios, ApprovalsApi;

    beforeAll(() => {
      jest.resetModules();
      jest.doMock('axios', () => mockAxios);
      axios = require('axios');
      sagaConstructor = require('../approvalsSaga').fetchUserApprovalsSaga;
      ApprovalsApi = require('../../../services/approvalsAPI').default;
      testSaga = sagaConstructor(action);
    });

    afterAll(() => {
      jest.clearAllMocks();
      jest.resetModules();
    });

    it('should yield a call to getUserApprovals with correct url', async () => {
      const url = action.url;
      expect(testSaga.next().value)
        .toEqual(call(ApprovalsApi.getUserApprovals, url));
    });

    it('sends a get request with the correct url', async () => {
      const urlSearchParams = action.url;
      const fullUrl = `http://127.0.0.1:5000/api/v1/approvals${urlSearchParams}`;
      await ApprovalsApi.getUserApprovals(urlSearchParams);
      expect(axios.get).toHaveBeenCalledWith(fullUrl);
    });

    it('should dispatch an action with the yielded data', async () => {
      const fetchResponse = await ApprovalsApi.getUserApprovals(action.url);
      // expect dispatch with data from response
      expect(testSaga.next(fetchResponse).value)
        .toEqual(put(fetchUserApprovalsSuccess(fetchResponse.data)));
    });

    it('should be done after dispatching the response', () => {
      expect(testSaga.next().done).toBe(true);
    });

    it('should dispatch an error if the response is an error', async () => {
      const badAction = { ...action, url: '?status=badquery' };
      // get a new generator
      const testSaga2 = sagaConstructor(badAction);
      testSaga2.next();
      // simulate a promise rejection
      expect(testSaga2.throw('Server Error').value)
        .toEqual(put(fetchUserApprovalsFailure('Server Error')));
    });
  });

  describe('Update Request Status Saga', () => {
    const action = {
      url: '?status=open'
    };

    const response = {
      data: { updatedRequest: { name: 'Alien Smith', status: 'Rejected' } }
    };

    const error = {
      response: {
        status: 0,
        data: {
          error: 'Server Error'
        }
      }
    };

    it('Fetch approvals successfully', () => {
      return expectSaga(watchFetchApprovals, ApprovalsAPI)
        .provide([
          [call(ApprovalsAPI.getUserApprovals, action.url), response]
        ])
        .put({
          type: 'FETCH_USER_APPROVALS_SUCCESS',
          approvals: response.approvals,
          message: response.message,
          meta:  response.meta
        })
        .dispatch({
          type: 'FETCH_USER_APPROVALS',
          url: action.url
        })
        .run();
    });

    it('throws error while fetching approvals', () => {
      return expectSaga(watchFetchApprovals, ApprovalsAPI)
        .provide([
          [call(ApprovalsAPI.getUserApprovals, action.url),
            throwError(error.response.data)]
        ])
        .put({
          type: 'FETCH_USER_APPROVALS_FAILURE',
          error: {error: error.response.data.error}
        })
        .dispatch({
          type: 'FETCH_USER_APPROVALS',
          url: action.url
        })
        .run();
    });
  });

  describe('Update Request Status Saga', () => {
    const action = {
      statusUpdateData: {
        status: 'Rejected'
      }
    };

    const response = {
      data: { updatedRequest: { name: 'Alien Smith', status: 'Rejected' } }
    };

    const error = {
      response: {
        status: 0,
        data: {
          error: 'Permission denied, you are not requesters manager'
        }
      }
    };

    it('Update a requests status successfully', () => {
      return expectSaga(watchUpdateRequestStatus, ApprovalsAPI)
        .provide([
          [call(ApprovalsAPI.updateRequestStatus, action.statusUpdateData), response]
        ])
        .put({
          type: 'UPDATE_REQUEST_STATUS_SUCCESS',
          updatedRequest: response.data.updatedRequest
        })
        .dispatch({
          type: 'UPDATE_REQUEST_STATUS',
          statusUpdateData: action.statusUpdateData
        })
        .run();
    });

    it('throws error while updating a request status', () => {
      return expectSaga(watchUpdateRequestStatus, ApprovalsAPI)
        .provide([
          [call(ApprovalsAPI.updateRequestStatus, action.statusUpdateData), throwError(error)]
        ])
        .put({
          type: 'UPDATE_REQUEST_STATUS_FAILURE',
          error: error.response.data.error
        })
        .dispatch({
          type: 'UPDATE_REQUEST_STATUS',
          statusUpdateData: action.statusUpdateData
        })
        .run();
    });
  });
});
