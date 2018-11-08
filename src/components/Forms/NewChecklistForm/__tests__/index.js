import React from 'react';
import NewChecklistForm from '../index';

describe('<NewChecklistForm />', () => {
  let wrapper;
  const props = {
    createTravelChecklist: jest.fn(() => {}),
    fetchTravelChecklist: jest.fn(() => {}),
    closeModal: jest.fn(),
    updateTravelChecklist: jest.fn(),
    modalType: 'new checklist',
    checklistItem: {},
    currentUser: {},
  };

  beforeEach(() => {
    wrapper = mount(<NewChecklistForm {...props} />);
  });


  it('renders without crashing', () => {
    expect(wrapper.length).toEqual(1);
    wrapper.unmount();
  });

  it('should clear the form when the component unmounts', () => {
    const componentWillUnmount = jest.spyOn(
      wrapper.instance(),
      'componentWillUnmount'
    );
    wrapper.unmount();
    expect(componentWillUnmount).toHaveBeenCalledTimes(1);
  });

  it('handles handleCancel method', () => {
    wrapper = mount(<NewChecklistForm {...props} />);
    const cancelBtn = wrapper.find('#cancel');
    cancelBtn.simulate('click');
    expect(props.closeModal).toHaveBeenCalledTimes(1);
    wrapper.unmount();
  });
    
  it('should handle creation of a checklist', () => {
    const submitBtn = wrapper.find('#submit');
    const spy = jest.spyOn(wrapper.instance(), 'handleSubmit');
    const event = {
      preventDefault: jest.fn()
    };
    wrapper.setState({ values: { itemName: 'name'} });
    submitBtn.simulate('submit', event);
    expect(spy).toHaveBeenCalledTimes(1);
    wrapper.unmount();
  });

  it('should handle edit of a checklist', () => {
    const submitBtn = wrapper.find('#submit');
    const spy = jest.spyOn(wrapper.instance(), 'handleSubmit');
    const event = {
      preventDefault: jest.fn()
    };
    wrapper.setState({ values: { itemName: 'name'} });
    wrapper.setProps({ modalType: 'edit cheklistItem'});
    submitBtn.simulate('submit', event);
    expect(spy).toHaveBeenCalledTimes(1);
    wrapper.unmount();
  });

  it('should not enable save button with of a checklist with no value', () => {
    wrapper.setProps({ modalType: 'edit cheklistItem'});
    wrapper.setState({ values: { itemName: ''} });
    expect(wrapper.state().hasBlankFields).toBe(true);
    wrapper.unmount();
  });
});
