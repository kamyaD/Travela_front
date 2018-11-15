import React from 'react';
import { shallow } from 'enzyme';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';

import ConnectedAnalytics, {mapStateToProps, Analytics} from '..';

const initialState = {
  analytics: {
    payload: {
      total_requests: 230
    },
    error: '',
    isLoading: false,
    success: false
  }
};

const mockStore = configureStore();
const store = mockStore(initialState);
let wrapper, props, fetchAnalytics;


beforeEach(() => {
  props = {
    analytics: {
      payload: {
        total_requests: 230
      }
    },
    children: [],
    context: {
      state: {
        range: ['2018-11-01', '2018-11-08'],
        city: 'Nairobi',
      },
      handleFilter: jest.fn()
    },
    fetchAnalytics: jest.fn()
  };
});

describe('<Analytics />', () => {
  it('calls ComponentDidMount', () => {
    wrapper = shallow(<Analytics {...props} />);
    expect(props.fetchAnalytics).toHaveBeenCalled();
  });

  it('call componentWillReceiveProps', () => {
    wrapper = shallow(<Analytics {...props} />);
    wrapper.setProps({
      context: {
        state: {
          range: {start: '2018-12-01', end: '2018-12-31'},
          filter: 'This Month',
          city: 'Nigeria',
        },
        handleFilter: jest.fn()
      }
    });
    expect(props.fetchAnalytics).toHaveBeenCalled();
    expect(wrapper.instance().props.context.state.range.start).toBe('2018-12-01');
  });

  it('should render the connected component correctly', () => {
    wrapper = mount(
      <Provider store={store}>
        <ConnectedAnalytics {...props} />
      </Provider>
    );

    expect(wrapper).toMatchSnapshot();
  });
});
