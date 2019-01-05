import approvals from '../approvals';
import {
  FETCH_USER_APPROVALS,
  FETCH_USER_APPROVALS_SUCCESS,
  FETCH_USER_APPROVALS_FAILURE,
  UPDATE_REQUEST_STATUS,
  UPDATE_REQUEST_STATUS_SUCCESS,
  UPDATE_REQUEST_STATUS_FAILURE,
} from '../../constants/actionTypes';

const initState = {
  postAccommodationData: [],
  errors: [],
  guestHouses: [],
  guestHouse: {
    rooms: []
  },
  isLoading: false
};

describe('Approvals Reducer', () => {
  it('returns initial state with unknown actions', () => {
    const unknownAction = {
      type: 'UNKNOWN TYPE'
    };
    expect(approvals(initState, unknownAction)).toEqual(initState);
  });

  it('updates the error with a fetch failure', () => {
    const errorAction = {
      type: FETCH_USER_APPROVALS_FAILURE,
      error: {
        response: {
          data: {
            error: 'Server error'
          }
        }
      }
    };
    expect(approvals(initState, errorAction).fetchApprovalsError)
      .toBe(errorAction.error.response.data.error);
  });

  it('updates to loading when fetching response', () => {
    const action = {
      type: FETCH_USER_APPROVALS
    };
    expect(approvals(initState, action).isLoading).toBe(true);
  });

  it('returns appovals correctly', () => {
    const action = {
      type: FETCH_USER_APPROVALS_SUCCESS,
      approvals: [{status: 'Open'}],
      message: 'test message',
      meta: {
        pagination: {},
        count: {}
      }
    };
    expect(approvals(initState, action).approvals).toHaveLength(1);
  });

  describe('Update Requests Status reducer', () => {
    let initialState = {
      approvals: [],
      isLoading: false,
      message: '',
      openApprovalsCount: 0,
      pastApprovalsCount: 0,
      pagination: '',
      fetchApprovalError: ''
    };

    let action, newState, receivedState, error;

    it('should return initial state', () => {
      expect(approvals(undefined, {})).toEqual(initialState);
    });

    it('should handle UPDATE_REQUEST_STATUS', () => {
      action = {
        type: UPDATE_REQUEST_STATUS,
        updatedRequest: {
          status: 'Approved'
        }
      };

      initialState.approvals = [
        {
          id: 1,
          status: 'Approved'
        },
        {
          id: 2,
          status: 'Open'
        },
      ];

      newState = approvals(initialState, action);
      receivedState = {
        ...initialState,
        updatingStatus: true,
        approval: action.updatedRequest,
        error: ''
      };

      expect(newState).toEqual(receivedState);
    });

    it('should handle UPDATE_REQUEST_STATUS_SUCCESS', () => {
      action = {
        type: UPDATE_REQUEST_STATUS_SUCCESS,
        updatedRequest: {
          request: {
            id: 1,
            status: 'Approved'
          },
        }
      };

      newState = approvals(initialState, action);
      receivedState = {
        ...initialState,
        updatingStatus: false,
        approvals: [
          {
            id: 1,
            status: 'Approved'
          },
          {
            id: 2,
            status: 'Open'
          },
        ],
        openApprovalsCount: 1,
        error: ''
      };

      expect(newState).toEqual(receivedState);
    });

    it('should handle UPDATE_REQUEST_STATUS_FAILURE', () => {
      error = 'permission denied, you are not requesters manager';
      action = {
        type: UPDATE_REQUEST_STATUS_FAILURE,
        error
      };

      newState = approvals(initialState, action);
      receivedState = {
        ...initialState,
        updatingStatus: false,
        error: 'permission denied, you are not requesters manager'
      };
      expect(newState).toEqual(receivedState);
    });
  });
});
