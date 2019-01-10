import React from 'react';
import moment from 'moment';
import RoomsGeomWrapper from '..';

const props = {
  rooms: [{
    faulty: false,
    id: 'room-id-1',
    beds: [{
      bedId: 'kitanda1',
      bedName: 'kitanda 1'
    }],
    maintainances: [{
      reason: 'Bad window',
      start: '11-10-2018',
      end: '11-10-2018'
    }],
  }],
  timelineStartDate: moment().startOf('month'),
  tripDayWidth: 31,
  timelineViewType: 'month',
  handleChangeRoomModal: jest.fn(),
  handleEditMaintenanceModal: jest.fn(),
  handleDeleteMaintenanceModal: jest.fn()
};

describe('<RoomsGeomWrapper />', () => {
  let wrapper;
  beforeEach(() => {
    wrapper = shallow(
      <RoomsGeomWrapper {...props} />
    );
  });

  it('renders properly', () => {
    expect(wrapper).toMatchSnapshot();
  });

  it('renders a wrapper for all rooms\' visualization geometries', () => {
    expect(wrapper.find('.rooms-geometry-wrapper')).toHaveLength(1);
  });

  it('renders the RoomGeomWrapper for the rooms', () => {
    const roomGeomWrappers = wrapper.find('RoomGeomWrapper');
    expect(roomGeomWrappers).toHaveLength(1);
  });
});
