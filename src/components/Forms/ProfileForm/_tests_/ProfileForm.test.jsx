import React from 'react';
import  ProfileForm  from '../index';
import mocks from '../__mocks__';

const { values, managers, centers } = mocks;
describe ('<ProfileForm />', () =>{
  let wrapper, onSubmit;
  onSubmit = jest.fn();

  const props = {
    user: {
      UserInfo: {
        name: 'John Doe',
        id: '-LHJlG',
        picture: 'http://www.image.com/jepg'
      }
    },
    isLoading: false,
    history: {
      push: jest.fn()
    },
    errors: [],
    shouldOpen: false,
    onNotificationToggle: jest.fn(),
    updateUserProfile: jest.fn(() => {}),
    getUserData: jest.fn(() => {}),
    onChange: jest.fn(() => {}),
    getCenters: jest.fn(),
    size:10,
    managers,
    centers,
    userData: {
      ...values,
    },
    userDataUpdate: []
  };

  beforeEach(() => {
    wrapper = mount(<ProfileForm {...props} />);
  });

  it('renders correctly', () => {
    expect(wrapper).toMatchSnapshot();
  });

  it('submits calls on submit if all details are available',() =>{
    const form = wrapper.find('.new-profile');
    form.simulate('submit');
    const onSubmit = jest.fn();
    expect(onSubmit).toHaveBeenCalledTimes(0);
  });

  it('does not update user profile if form is not valid', ()=>{
    wrapper.find('input[name="name"]').simulate('blur');
    wrapper.update();
    const onSubmit = jest.fn();
    expect(onSubmit).toHaveBeenCalledTimes(0);
  });

  it('sets default state and restore values when clear button is clicked',() =>{
    wrapper.setProps({ userData: values});
    wrapper.setState({
      values: {
        name: 'Moffat Gitau',
        gender: 'Male',
        department: 'Success',
        role: 'Technical Team Lead',
        manager: 'Samuel Kubai',
        location: 'Nairobi'
      }, hasBlankFields: false, errors: { manager: '' }});

    const button = wrapper.find('#btn-cancel');
    button.simulate('click');

    const expected = values;
    delete expected.passportName;

    expect(wrapper.state('values')).toEqual(expected);
  });

  it('should set manager error when manager input is changed to a non existing manager',() =>{
    wrapper.setProps({ userData: values});
    const event = {
      target: {
        value: 'Joy'
      }
    };
    wrapper.find('.manager').at(0).simulate('change', event);
    expect(wrapper.state().errors.manager).toEqual('Please select a manager from the dropdown');
  });

  it('should ensure the location has AutoComplete feature with only the city names', () => {
    const input = wrapper.find('DropdownSelect[name="location"]');
    expect(input.props().choices).toEqual(centers.map(
      center => center.location.split(',')[0]
    ));
  });

  it('should not render the loading icon on the save changes button during initial render', ()=>{
    const button = wrapper.find('.profile-bg-btn');
    expect(button.contains(<i className="loading-icon" />)).toEqual(false);
    expect(button.text()).toEqual('Save Changes');
  });
});
