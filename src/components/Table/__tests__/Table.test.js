import React from 'react';
import { shallow } from 'enzyme';
import { Table } from '../index';

const props = {
  requests: [
    {
      id: 'xDh20btGz',
      name: 'Amarachukwo Agbo',
      tripType: 'oneWay',
      status: 'Open',
      manager: 'Ezrqn Kiptanui',
      gender: 'Female',
      trips: [
        {
          departureDate: '2018-09-20',
          origin: 'Lagos',
          destination: 'Angola'
        }
      ],
      department: 'TDD',
      role: 'Learning Facilitator'
    },
    {
      id: 'xDh20btGy',
      name: 'Amarachukwo Agbo',
      tripType: 'oneWay',
      status: 'Rejected',
      manager: 'Ezrqn Kiptanui',
      gender: 'Female',
      trips: [
        {
          departureDate: '2018-09-20',
          origin: 'Lagos',
          destination: 'Angola'
        }
      ],
      department: 'TDD',
      role: 'Learning Facilitator'
    },
    {
      id: 'xDh20btGx',
      name: 'Amarachukwo Agbo',
      tripType: 'oneWay',
      status: 'Approved',
      manager: 'Ezrqn Kiptanui',
      gender: 'Female',
      trips: [
        {
          departureDate: '2018-09-20',
          origin: 'Lagos',
          destination: 'Angola'
        }
      ],
      department: 'TDD',
      role: 'Learning Facilitator'
    }
  ],
  fetchRequestsError: null,
  message: 'Requests retrieved successfully'
};

const wrapper = shallow(<Table {...props} />);

describe('<Requests />', () => {
  it('should render the requests table when there are requests', () => {
    expect(wrapper.find('table.mdl-data-table').length).toBe(1);
    expect(wrapper.find('.table__row').length).toBe(3);
  });

  it('adds the appropriate class based on the status of the request', () => {
    expect(
      wrapper.find('#status-xDh20btGz').hasClass('request__status--open')
    ).toEqual(true);
    expect(
      wrapper.find('#status-xDh20btGy').hasClass('request__status--rejected')
    ).toEqual(true);
    expect(
      wrapper.find('#status-xDh20btGx').hasClass('request__status--approved')
    ).toEqual(true);
  });

  it('should render a div when there are no requests', () => {
    wrapper.setProps({
      requests: [],
      message: 'You have no requests at the moment'
    });
    expect(wrapper.find('table.mdl-data-table').length).toBe(0);
    expect(wrapper.find('div.table__requests--empty').length).toBe(1);
    expect(wrapper.find('div.table__requests--empty').text()).toEqual(
      'You have no requests at the moment'
    );
  });

  it('should render error when there is an error fetching requests', () => {
    wrapper.setProps({ fetchRequestsError: 'Server Error' });
    expect(wrapper.find('table.mdl-data-table').length).toBe(0);
    expect(wrapper.find('div.table__requests--error').length).toBe(1);
    expect(wrapper.find('div.table__requests--error').text()).toEqual(
      'Server Error'
    );
  });

  it('should render Onclick request works as exepected', () => {
    const wrapper = mount(<Table {...props} />);
    let requestId = wrapper
      .find('tr.table__row')
      .at(0)
      .find('div')
      .at(0);
    requestId.simulate('click');
    expect(wrapper.state().clickedRequestId).toBe('xDh20btGz');
  });
});
