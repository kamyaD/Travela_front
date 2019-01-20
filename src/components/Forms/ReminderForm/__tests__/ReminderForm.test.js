import React from 'react';
import sinon from 'sinon';
import ReminderForm from '..';

const props = {
  'documentType ':'',
  fetchAllEmailTemplates: jest.fn(),
  createReminder: jest.fn(),
  'history': {
    'length': 7,
    'action': 'POP',
    'location': {
      'pathname': '/settings/reminders/create',
      'search': '',
      'hash': ''
    }
  },
  'isAuthenticated': true,
  'user': {
    'UserInfo': {
      'id': '-LMIzC-bCc10w7Uqc7-A',
      'first_name': 'Celestine',
      'last_name': 'Ekoh-Ordan',
      'firstName': 'Celestine',
      'lastName': 'Ekoh-Ordan',
      'email': 'celestine.ekoh-ordan@andela.com',
      'name': 'Celestine Ekoh-Ordan',
      'picture': 'https://lh5.googleusercontent.com/-xk0tlwMiYU8/AAAAAAAAAAI/AAAAAAAAAAc/UsqgiaqPwNE/photo.jpg?sz=50',
      'roles': {
        'Technology': '-KXH7iME4ebMEXAEc7HP',
        'Andelan': '-KiihfZoseQeqC6bWTau'
      }
    },
    'iat': 1548260486,
    'exp': 1550852486,
    'aud': 'andela.com',
    'iss': 'accounts.andela.com'
  },
  'getUserData': {
    'success': true,
    'message': 'data',
    'result': {
      'id': 1,
      'fullName': 'Celestine Ekoh-Ordan',
      'email': 'celestine.ekoh-ordan@andela.com',
      'userId': '-LMIzC-bCc10w7Uqc7-A',
      'passportName': 'Celestine Ekoh-Ordan',
      'department': 'Fellowship-Programs',
      'occupation': 'Technical Team Lead',
      'manager': 'John Mutuma',
      'gender': 'Male',
      'picture': 'https://lh5.googleusercontent.com/-xk0tlwMiYU8/AAAAAAAAAAI/AAAAAAAAAAc/UsqgiaqPwNE/photo.jpg?sz=50',
      'location': 'Lagos',
      'createdAt': '2019-01-18T10:32:50.407Z',
      'updatedAt': '2019-01-18T11:28:49.121Z',
      'roles': [{
        'roleName': 'Super Administrator',
        'description': 'Can perform all task on travela',
        'centers': [
        ]
      }]
    }
  },
  'currentUser': {
    'id': 1,
    'fullName': 'Celestine Ekoh-Ordan',
    'email': 'celestine.ekoh-ordan@andela.com',
    'userId': '-LMIzC-bCc10w7Uqc7-A',
    'passportName': 'Celestine Ekoh-Ordan',
    'department': 'Fellowship-Programs',
    'occupation': 'Technical Team Lead',
    'manager': 'John Mutuma',
    'gender': 'Male',
    'picture': 'https://lh5.googleusercontent.com/-xk0tlwMiYU8/AAAAAAAAAAI/AAAAAAAAAAc/UsqgiaqPwNE/photo.jpg?sz=50',
    'location': 'Lagos',
    'createdAt': '2019-01-18T10:32:50.407Z',
    'updatedAt': '2019-01-18T11:28:49.121Z',
    'roles': [{
      'roleName': 'Super Administrator',
      'description': 'Can perform all task on travela',
      'centers': [
      ]
    }]
  },
  'errors': {
  },
  'isLoaded': true,
  'templates': [{
    'cc': [
      ''
    ],
    'id': 13,
    'name': 'Barcelone',
    'from': 'ceo@andela.com',
    'subject': 'some mail very nice pr',
    'message': 'this is eet i galknls;mnlskfnsg',
    'disabled': false,
    'createdAt': '2019-01-23T10:11:24.635Z',
    'updatedAt': '2019-01-23T10:11:24.635Z',
    'deletedAt': null,
    'createdBy': 1,
    'creator': {
      'fullName': 'Celestine Ekoh-Ordan',
      'email': 'celestine.ekoh-ordan@andela.com',
      'userId': '-LMIzC-bCc10w7Uqc7-A'
    }
  },
  {
    'cc': [
      'buk@andela.com'
    ],
    'id': 12,
    'name': 'Forza Visa',
    'from': 'celestine.ekoh-ordan@andela.com',
    'subject': 'This is for the visas',
    'message': 'Sometimes you need to make sure of what you are passionate about.',
    'disabled': false,
    'createdAt': '2019-01-23T07:55:47.565Z',
    'updatedAt': '2019-01-23T07:55:47.565Z',
    'deletedAt': null,
    'createdBy': 1,
    'creator': {
      'fullName': 'Celestine Ekoh-Ordan',
      'email': 'celestine.ekoh-ordan@andela.com',
      'userId': '-LMIzC-bCc10w7Uqc7-A'
    }
  },
  {
    'cc': [
      ' '
    ],
    'id': 9,
    'name': 'nine',
    'from': 'ceo@andela.com',
    'subject': 'some subject',
    'message': 'some message',
    'disabled': false,
    'createdAt': '2019-01-18T10:38:31.125Z',
    'updatedAt': '2019-01-18T10:38:31.125Z',
    'deletedAt': null,
    'createdBy': 1,
    'creator': {
      'fullName': 'Celestine Ekoh-Ordan',
      'email': 'celestine.ekoh-ordan@andela.com',
      'userId': '-LMIzC-bCc10w7Uqc7-A'
    }
  },
  {
    'cc': [
      ' '
    ],
    'id': 8,
    'name': 'eight',
    'from': 'celestine.ekoh-ordan@andela.com',
    'subject': 'Visa Expiry',
    'message': 'Dear Andelan, your visa is about to expire.',
    'disabled': false,
    'createdAt': '2019-01-22T11:24:24.755Z',
    'updatedAt': '2019-01-22T11:24:24.755Z',
    'deletedAt': null,
    'createdBy': 1,
    'creator': {
      'fullName': 'Celestine Ekoh-Ordan',
      'email': 'celestine.ekoh-ordan@andela.com',
      'userId': '-LMIzC-bCc10w7Uqc7-A'
    }
  },
  ],
  'currentPage': 1,
  'pageCount': 1,
  'loading': false
};


describe('Reminder Form', () => {
  let wrapper;
  beforeEach(() => {
    wrapper = mount(<ReminderForm {...props} />);
  });

  it('renders correctly', () => {
    expect(wrapper).toMatchSnapshot();
  });

  it('should update the errors state with values from props', () => {
    sinon.spy(wrapper.instance(), 'componentWillReceiveProps');
    wrapper.setProps({
      errors: {
        conditionName: 'cannot be empty',
      }
    });
    expect(wrapper.instance().componentWillReceiveProps.calledOnce).toEqual(true);
    expect(wrapper.state().errors).toEqual({
      conditionName: 'cannot be empty'
    });
  });

  it('should handle adding a reminder input row', () => {
    const addReminderButton = wrapper.find('.add-reminder__button');
    const totalReminderInputs = wrapper.state().totalReminders;
    addReminderButton.simulate('click');
    expect(wrapper.state().totalReminders).toEqual(totalReminderInputs + 1);
  });

  it('should handle deleting a reminder input row', () => {
    const deleteReminderButton = wrapper.find('.delete-icon');
    const totalReminderInputs = wrapper.state().totalReminders;
    deleteReminderButton.simulate('click');
    expect(wrapper.state().totalReminders).toEqual(totalReminderInputs - 1);
  });

  it('should handle submiting a reminder', () => {
    wrapper.setState({
      reminders: [
        {
          date: '2',
          period: 'Days',
          reminderTemplate: '1'
        }
      ]
    });
    const form = wrapper.find('form');
    form.simulate('submit');
    expect(props.createReminder).toHaveBeenCalled();
  });

  it('handles form cancel', () => {
    sinon.spy(wrapper.instance(), 'handleCancel');
    const initialState = wrapper.state();
    wrapper.instance().handleCancel();
    expect(wrapper.instance().handleCancel.calledOnce).toEqual(true);
    expect(wrapper.state()).toEqual(initialState);
  });

  it('handles form input change', () => {
    const initialState = wrapper.state();
    sinon.spy(wrapper.instance(), 'handleInputChange');
    wrapper.instance().handleInputChange({
      target: {
        name: 'date-0',
        value: '5',
        id: '0'
      }
    });
    expect(wrapper.instance().handleInputChange.calledOnce).toEqual(true);
    expect(wrapper.state().values).toEqual({
      ...initialState.values,
      'date-0': '5',
    });
  });

  it('handles form reminder template change', () => {
    const initialState = wrapper.state();
    sinon.spy(wrapper.instance(), 'handleReminderTemplateChange');
    wrapper.instance().handleReminderTemplateChange('2', '0');
    expect(wrapper.instance().handleReminderTemplateChange.calledOnce).toEqual(true);
    expect(wrapper.state().values).toEqual({
      ...initialState.values,
      'reminderTemplate-0': '2',
    });
  });

  it('handles form reminder period change', () => {
    const initialState = wrapper.state();
    sinon.spy(wrapper.instance(), 'handleReminderPeriodChange');
    wrapper.instance().handleReminderPeriodChange('Days', '0');
    expect(wrapper.instance().handleReminderPeriodChange.calledOnce).toEqual(true);
    expect(wrapper.state().values).toEqual({
      ...initialState.values,
      'period-0': 'Days',
    });
  });


});
