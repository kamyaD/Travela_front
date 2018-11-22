/* eslint react/jsx-one-expression-per-line: 0 */
/* eslint react/jsx-key: 0 */
import React, { Component, Fragment } from 'react';
import { PropTypes } from 'prop-types';
import SubmissionsUtils from './SubmissionsUtils';

class SubmissionItem extends Component {
  state = { 
    info: '', type: '', utilsType: '', fileName: '', submissionText: '', 
    departureTime: '', arrivalTime: '', ticketNumber: '', airline: '',
    returnDepartureTime: '', returnTime: '', returnTicketNumber: '',
    returnAirline: '', validTicket: true, uploadedFileName: '', validInput: true
  }

  componentWillReceiveProps(nextProps) {
    const { 
      fileUploadData: { isUploading, uploadSuccess }, checkId
    } = nextProps;

    if (isUploading.match(checkId)) {
      return this.setState({ info: 'Uploading file...', type: 'uploading' });
    }

    uploadSuccess.match(checkId) && this.setState({ 
      info: 'Done', type: 'success', uploadedFileName: '' });
  }

  checkFileSize = (file) => {
    if (file.files[0]) {
      const { size, name } = file.files[0];
      if (size > 1500000) {
        file.value = '';
        this.setState({ info: 'File must not exceed 1.5mb', type: 'error' });
        return false;
      }
      this.setState({ info: '', type: '', fileName: name });
      return true;
    }
    return false; // if no file
  }

  setUtilsType = (utilsType) => {
    this.setState({ utilsType });
  }

  setTextArea = (value, id) => {
    const { checkId } = this.props;
    const fill = checkId.match(id);
    fill && this.setState({ submissionText: value });
  }

  setTicketFields = (ticketDetails, id) => {
    const { checkId } = this.props;
    const fill = checkId.match(id);
    fill && this.setState({ ...ticketDetails });
  }

  setUploadedFileName = (fileName, id) => {
    const { checkId } = this.props;
    checkId.match(id) && this.setState({ uploadedFileName: fileName });
  }

  handleUpload = (e) => {
    e.preventDefault();
    const file = e.target;
    const { 
      tripId, handleFileUpload, checklistItem: { id }, checkId, requestId
    } = this.props;
    const validFileSize = this.checkFileSize(file);
    if (validFileSize) return handleFileUpload(file, id, tripId, checkId, requestId);
  }

  handleInputChange = (e) => {
    e.preventDefault();
    const { name, value } = e.target;
    this.setState({ [name]: value });
  }

  submitTextArea = () => {
    const { submissionText } = this.state;
    const { 
      tripId, checklistItem: { id }, postSubmission, checkId, requestId
    } = this.props;
    const formData = { tripId, file: submissionText };
    submissionText && postSubmission(
      { formData, checklistItemId: id }, checkId, requestId);
  }

  handleTextAreaSubmit = () => {
    const valid = this.validateInputFields();
    valid && this.submitTextArea();
  }

  validateInputFields = () => {
    const { submissionText } = this.state;
    this.setState({ validInput: !!submissionText });
    return !!submissionText;
  }

  validateTicketFields = () => {
    const { tripType } = this.props;
    const { 
      departureTime, arrivalTime, airline, ticketNumber,
      returnDepartureTime, returnTime, returnTicketNumber, returnAirline 
    } = this.state;
    const defaultVals = [departureTime, arrivalTime, airline, ticketNumber];
    const returnVals = [returnDepartureTime, returnTime, 
      returnTicketNumber, returnAirline];
    const valuesArr = tripType.match('return')
      ? [...defaultVals, ...returnVals] : defaultVals;

    const valid = !valuesArr.includes('');
    this.setState({ validTicket: valid });
    return valid;
  }

  submitTicket = (valid) => {
    const { 
      tripId, checklistItem: { id }, postSubmission, checkId, requestId
    } = this.props;
    const {
      departureTime, arrivalTime, airline, ticketNumber,
      returnDepartureTime, returnTime, returnTicketNumber, returnAirline,
    } = this.state;
    const ticket = {
      departureTime, arrivalTime, airline, ticketNumber, 
      returnDepartureTime, returnTime, returnTicketNumber, returnAirline,
    };
    const formData = { tripId, file: ticket };
    valid && postSubmission(
      { formData, checklistItemId: id }, checkId, requestId
    );
  }

  handleTicketSubmit = () => {
    const valid = this.validateTicketFields();
    valid && this.submitTicket(valid);
  }

  renderError = (utilsType) => {
    const { validTicket, validInput } = this.state;
    const msg = utilsType.match('ticketFieldset') &&
      !validTicket && 'All Fields are required';
    const msg2 = !['ticketFieldset', 'uploadField'].includes(utilsType) &&
      !validInput && 'Field is required';
    return (
      <Fragment>
        {(msg || msg2) && (
          <div className="submission-progress__">
            <div className="submission-progress__error">*{msg || msg2}</div>
          </div>
        )}
      </Fragment>
    );
  }

  renderUploadError = () => {
    const { info } = this.state;
    return (
      <div className="submission-progress__">
        <div className="submission-progress__error">
          {info}
        </div>
      </div>
    );
  }

  renderIsUploading = () => {
    const { 
      fileUploadData: { isUploading }, checkId, isUploadingStage2
    } = this.props;
    return (
      <Fragment>
        {
          isUploading.match(checkId) &&
          isUploadingStage2.includes(checkId) && (
            <div className="submission-progress__">
              <div className="submission-progress__spinner" />
              <div id="submission-progress" className="submission-progress__">
                Uploading file...
              </div>
            </div>
          )
        }
      </Fragment>
    );
  }

  renderUploadDone = () => {
    const { fileName, utilsType } = this.state;
    const { postSuccess, checkId, checklistItem} = this.props;
    const { requiresFiles, submissions: [item] } = checklistItem;
    const displayInfo = (requiresFiles && !item) || (!requiresFiles);
    const info = utilsType === 'uploadField'
      ? fileName : 'Done';
    return (
      <Fragment>
        { postSuccess.includes(checkId) && displayInfo && (
          <div className="submission-progress__">
            <div className="submission-progress__success">{info}</div>
          </div>
        )}
      </Fragment>
    );
  }

  renderField = () => {
    const { 
      type, submissionText, validTicket, fileName,
      departureTime, arrivalTime, returnTime, ticketNumber, uploadedFileName,
      returnDepartureTime, returnTicketNumber, airline, returnAirline,
    } = this.state;
    const { 
      checklistItem, fileUploadData, itemsToCheck, tripType, checkId
    } = this.props;
    const { requiresFiles, name, submissions: [item] } = checklistItem;
    let utilsType = requiresFiles ? 'uploadField' : 'textarea';
    utilsType = name.toLowerCase().match('travel ticket details') 
      ? 'ticketFieldset'
      : utilsType;
    return (
      <Fragment>
        <SubmissionsUtils
          checklistItem={checklistItem} utilsType={utilsType} checkId={checkId}
          handleUpload={this.handleUpload} fileUploadData={fileUploadData}
          setUtilsType={this.setUtilsType} setTextArea={this.setTextArea}
          setTicketFields={this.setTicketFields} arrivalTime={arrivalTime}
          uploadedFileName={uploadedFileName || fileName} uploadProcess={type}
          itemsToCheck={itemsToCheck} handleInputChange={this.handleInputChange}
          handleTextAreaSubmit={this.handleTextAreaSubmit} tripType={tripType}
          handleTicketSubmit={this.handleTicketSubmit} submissionText={submissionText}
          departureTime={departureTime} setUploadedFileName={this.setUploadedFileName}
          returnDepartureTime={returnDepartureTime} returnTime={returnTime}
          ticketNumber={ticketNumber} returnTicketNumber={returnTicketNumber}
          airline={airline} returnAirline={returnAirline} validTicket={validTicket}
        />
        {type === 'error' && this.renderUploadError()}
        {type === 'uploading' && this.renderIsUploading()}
        {this.renderError(utilsType)}
        {type === 'success' &&  this.renderUploadDone()}
      </Fragment>
    );
  }

  renderTravelChecklistItem = () => {
    const { checklistItem: { id, name, resources } } = this.props;

    return (
      <div className="travelSubmission--item">
        <span className="travelSubmission--item__name">{ name }</span>
        {resources.length > 0 && resources.map(resource => (
          <a
            key={id} href={resource.link} target="blank"
            className="travelSubmission--item__resource-link">
            [{resource.label}]
          </a>
        ))}
        {this.renderField()}
      </div>
    );
  }

  render() {
    return (<Fragment>{this.renderTravelChecklistItem()}</Fragment>);
  }
}

SubmissionItem.propTypes = {
  checklistItem: PropTypes.object.isRequired, handleFileUpload: PropTypes.func.isRequired,
  postSubmission: PropTypes.func.isRequired, fileUploadData: PropTypes.object.isRequired,
  tripId: PropTypes.string.isRequired, itemsToCheck: PropTypes.array.isRequired,
  postSuccess: PropTypes.array.isRequired, isUploadingStage2: PropTypes.array.isRequired,
  requestId: PropTypes.string.isRequired, tripType: PropTypes.string.isRequired, checkId: PropTypes.string.isRequired
};

export default SubmissionItem;
