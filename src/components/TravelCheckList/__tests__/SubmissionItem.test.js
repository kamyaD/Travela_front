import React from 'react';
import SubmissionItem from '../SubmissionItem';
import {
  checklistSubmission, fileUploadStore,
  itemsToCheck, requestId,
  LagosSubmission,
} from '../../../mockData/checklistSubmissionMockData';

describe('SubmissionItem Component', () => {
  let props = {
    postSubmission: jest.fn(),
    submissions: checklistSubmission,
    handleFileUpload: jest.fn(),
    itemsToCheck,
    checkId: 'NumC5-pK7G-9',
    tripType: 'return',
    requestId,
    postSuccess: [...itemsToCheck],
    fileUploadData: fileUploadStore,
    isUploadingStage2: [],
    checklistItem: {...LagosSubmission.checklist[0], resources: [{
      link: 'image.com',
      lable: 'document'
    }]},
    tripId: 'NumC5-pK7G',
  };

  const setup = (props) => mount(<SubmissionItem {...props} />);

  it ('should render the component', () => {
    const wrapper = setup(props);
    const submissionItem = wrapper.find('.travelSubmission--item');
    const submissionItemLink = wrapper
      .find('.travelSubmission--item__resource-link');
    const textAreaField = wrapper.find('.travelSubmission--item__textarea');


    expect(submissionItem.length).toBe(1);
    expect(submissionItemLink.length).toBe(1);
    expect(textAreaField.length).toBe(1);
  });

  it ('should call `handleTextAreaSubmit` when textarea input is blur', () => {
    const wrapper = setup(props);
    const event = {
      target: { value: 'green card' }
    };

    const textAreaField = wrapper.find('.textArea');
    const handleTextAreaSubmitSpy = jest
      .spyOn(wrapper.instance(), 'handleTextAreaSubmit');

    expect(textAreaField.length).toBe(1);
    textAreaField.simulate('focus');
    textAreaField.simulate('change', event);
    textAreaField.simulate('blur');
    expect(handleTextAreaSubmitSpy).toHaveBeenCalled();
  });

  it ('should show error if textarea field is not filled', () => {
    const wrapper = setup(props);
    const event = {
      target: { value: '', name: 'submissionText' }
    };

    const textAreaField = wrapper.find('.textArea');

    expect(textAreaField.length).toBe(1);
    textAreaField.simulate('focus');
    textAreaField.simulate('change', event);
    textAreaField.simulate('blur');
    const error = wrapper.find('.submission-progress__error');
    expect(error.length).toBe(1);
    expect(error.text()).toBe('*Field is required');
  });

  it ('should show error if all ticket field is not filled', () => {
    props.checklistItem = LagosSubmission.checklist[3];
    const wrapper = setup(props);
    const event = {
      target: { value: '', name: 'returnAirline' }
    };

    const returnAirlineInput = wrapper.find('.returnAirline');

    const handleTicketSubmitSpy = jest
      .spyOn(wrapper.instance(), 'handleTicketSubmit');

    expect(returnAirlineInput.length).toBe(1);
    returnAirlineInput.simulate('focus');
    returnAirlineInput.simulate('change', event);
    returnAirlineInput.simulate('blur');
    expect(handleTicketSubmitSpy).toHaveBeenCalled();
    const error = wrapper.find('.submission-progress__error');
    expect(error.length).toBe(1);
    expect(error.text()).toBe('*All Fields are required');
  });

  it ('should show error if all ticket field is not filled', () => {
    props.checklistItem = LagosSubmission.checklist[3];
    props.tripType = 'multi';
    const wrapper = setup(props);
    const event = {
      target: { value: '', name: 'airline' }
    };

    const airlineInput = wrapper.find('.airline');

    const handleTicketSubmitSpy = jest
      .spyOn(wrapper.instance(), 'handleTicketSubmit');

    expect(airlineInput.length).toBe(1);
    airlineInput.simulate('focus');
    airlineInput.simulate('change', event);
    airlineInput.simulate('blur');
    expect(handleTicketSubmitSpy).toHaveBeenCalled();
    const error = wrapper.find('.submission-progress__error');
    expect(error.length).toBe(1);
    expect(error.text()).toBe('*All Fields are required');
  });

  it ('should show error if all ticket field is not filled',  () => {
    props.checklistItem = LagosSubmission.checklist[3];
    props.tripType = 'return';
    const wrapper = setup(props);
    const event = {
      target: { value: 'Arik Airways', name: 'returnAirline' }
    };

    const returnAirlineInput = wrapper.find('.returnAirline');

    const handleTicketSubmitSpy = jest
      .spyOn(wrapper.instance(), 'handleTicketSubmit');

    expect(returnAirlineInput.length).toBe(1);
    returnAirlineInput.simulate('focus');
    returnAirlineInput.simulate('change', event);
    returnAirlineInput.simulate('blur');
    expect(handleTicketSubmitSpy).toHaveBeenCalled();
    const error = wrapper.find('.submission-progress__error');
    expect(error.length).toBe(0);
  });

  it ('should not upload if no file is chosen',  () => {
    props.checklistItem = LagosSubmission.checklist[2];
    const wrapper = setup(props);
    const event = { target: { files: [] } };

    expect(wrapper.instance().checkFileSize(event.target)).toBe(false);
  });

  it ('should handle file upload if file size is less than 1.5mb',  () => {
    props.checklistItem = LagosSubmission.checklist[2];
    const wrapper = setup(props);
    const event = {
      target: { files: [{ size: 1000, name: 'test.png' }] }
    };

    const fileInput = wrapper.find('.uploadFile');


    expect(fileInput.length).toBe(1);
    fileInput.simulate('change', event);
    expect(props.handleFileUpload).toHaveBeenCalled();
  });
  
  it ('should render file size error if file size is greater than 1.5mb',  () => {
    props.checklistItem = LagosSubmission.checklist[2];
    const wrapper = setup(props);
    const event = {
      target: { files: [{ size: 17000000, name: 'test.png' }] }
    };

    const fileInput = wrapper.find('.uploadFile');

    expect(fileInput.length).toBe(1);
    fileInput.simulate('change', event);
    const error = wrapper.find('.submission-progress__error');
    expect(error.length).toBe(1);
    expect(error.text()).toBe('File must not exceed 1.5mb');
  });

  it (`should render uploaded file input if 
    checklistItem is file and is already uploaded`,  () => {
    props.checklistItem = LagosSubmission.checklist[1];
    const wrapper = setup(props);
    const fileInput = wrapper.find('.uploadedFile');
    const fileInputName = wrapper.find('#file-upload');

    expect(fileInput.length).toBe(1);
    expect(fileInputName.length).toBe(1);
    expect(fileInputName.text()).toBe('test.pdf');
  });

  it ('should render is uploading spinner',  () => {
    const newProps = {
      ...props,
      fileUploadData: { isUploading: 'NumC5-pK7G-7' },
      isUploadingStage2: ['NumC5-pK7G-7'],
      checkId: 'NumC5-pK7G-7',
      checklistItem: LagosSubmission.checklist[2]
    };
    const wrapper = setup(newProps);
    wrapper.setState({ type: 'uploading' });

    const uploadProgress = wrapper.find('#submission-progress');
    const uploadSpinner = wrapper.find('.submission-progress__spinner');

    expect(uploadProgress.length).toBe(1);
    expect(uploadSpinner.length).toBe(1);
    expect(uploadProgress.text()).toBe('Uploading file...');
  });

  it ('should render file name when successfully uploaded',  () => {
    const newProps = {
      ...props,
      postSuccess: ['NumC5-pK7G-7'],
      checkId: 'NumC5-pK7G-7',
      checklistItem: LagosSubmission.checklist[2]
    };
    const wrapper = setup(newProps);
    wrapper.setState({ 
      type: 'success',
      fileName: 'test.png',
      utilsType: 'uploadField'
    });

    const uploadedField = wrapper.find('.uploadedFile');
    const uploadedFileName = wrapper.find('.uploadedFileName');

    expect(uploadedField.length).toBe(1);
    expect(uploadedFileName.text()).toBe('test.png');
  });

  it ('should render `Done` when text is successfully uploaded',  () => {
    const newProps = {
      ...props,
      postSuccess: ['NumC5-pK7G-9'],
      checkId: 'NumC5-pK7G-9',
      checklistItem: LagosSubmission.checklist[0]
    };
    const wrapper = setup(newProps);
    wrapper.setState({ 
      type: 'success',
      fileName: 'green card',
      utilsType: 'textarea'
    });

    const uploadDone = wrapper.find('.submission-progress__success');

    expect(uploadDone.length).toBe(1);
    expect(uploadDone.text()).toBe('Done');
  });

  it ('should set uploaded file name',  () => {
    props.checkId = 'NumC5-pK7G-7';
    const wrapper = setup(props);
    wrapper.instance().setUploadedFileName('test.png', 'NumC5-pK7G-7');

    expect(wrapper.state().uploadedFileName).toBe('test.png');
  });

  it ('should change info state if `nextProps`, isUploading', () => {
    const wrapper = setup(props);
    const nextProps = {
      ...props,
      fileUploadData: { isUploading: 'NumC5-pK7G-7', uploadSuccess: '' },
      checkId: 'NumC5-pK7G-7'
    };

    wrapper.instance().componentWillReceiveProps(nextProps);
    expect(wrapper.state().type).toBe('uploading');
    expect(wrapper.state().info).toBe('Uploading file...');
  });

  it ('should change info state if `nextProps`, uploadSuccess', () => {
    const wrapper = setup(props);
    const nextProps = {
      ...props,
      fileUploadData: { uploadSuccess: 'NumC5-pK7G-7', isUploading: '' },
      checkId: 'NumC5-pK7G-7'
    };

    wrapper.instance().componentWillReceiveProps(nextProps);
    expect(wrapper.state().type).toBe('success');
    expect(wrapper.state().info).toBe('Done');
    expect(wrapper.state().uploadedFileName).toBe('');
  });
});
