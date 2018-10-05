// import * as actionTypes from '../../constants';
import accommodationReducer from '../accommodation';
import * as actionTypes from '../../constants/actionTypes';
import { response } from '../../__mocks__/AccommodationData';


describe('User Reducer', () => {
  const initialState = {
    postAccommodationData: [],
    errors: [],
    guestHouses: [],
    guestHouse: {
      rooms: []
    },
    isLoading: false
  };

  it('should return proper initial state', done => {
    expect(accommodationReducer(undefined, {})).toEqual(initialState);
    done();
  });

  it('dispatches action CREATE_ACCOMMODATION_DATA', done => {
    const action = {
      type: actionTypes.CREATE_ACCOMMODATION_DATA
    };
    const newState = accommodationReducer(initialState, action);
    expect(newState).toEqual(initialState);
    done();
  });

  it('dispatches action CREATE_ACCOMMODATION_DATA_SUCCESS:', done => {
    const action = {
      type: actionTypes.CREATE_ACCOMMODATION_DATA_SUCCESS,
      accommodationData: response,
    };
    const newState = accommodationReducer(initialState, action);
    expect(newState.postAccommodationData).toEqual(response);
    done();
  });
  
  it('dispatches action CREATE_ACCOMMODATION_DATA_FAILURE', done => {
    const action = {
      type: actionTypes.CREATE_ACCOMMODATION_DATA_FAILURE,
      error: 'Possible network error, please reload the page'
    };
    const newState = accommodationReducer(initialState, action);
    expect(newState.errors).toEqual(
      'Possible network error, please reload the page'
    );
    done();
  });

});
