import React, {Component, Fragment} from 'react';
import {PropTypes} from 'prop-types';
import moment from 'moment';
import check from '../../images/check.svg';
import uploadIcon from '../../images/uploadIcon.svg';

class SubmissionsUtils extends Component {
  state = { showUploadedField: false, departureDate: null, departureTime: null, arrivalTime: null,
    returnDepartureTime: null, returnTime: null, arrivalDate: null, errors: {}, isValid: true,
  };

  componentDidMount() {
    this.getItemValue();
    this.initializeDates(this.props);
  }

  componentWillReceiveProps(nextProps, nextContext) {
    const {postSuccess, checkId} = nextProps;
    postSuccess.includes(checkId) && this.setState({showUploadedField: true});
    this.initializeDates(nextProps);
  }

  initializeDates = (props) => {
    const {trip, departureTime, arrivalTime, returnDepartureTime, returnTime} = props;
    this.setState({ departureDate: this.formatDateTime(trip.departureDate),
      departureTime:  this.formatDateTime(departureTime || trip.departureDate),
      arrivalTime: this.formatDateTime(arrivalTime || trip.departureDate),
      returnDepartureTime: this.formatDateTime(returnDepartureTime || trip.returnDate),
      returnTime: this.formatDateTime(returnTime || trip.returnDate),
      arrivalDate: this.formatDateTime(trip.returnDate),
    });
  };

  getItemValue = () => {
    const { checklistItem: {submissions: [item]}, utilsType, checkId,
      setTextArea, setTicketFields, setUploadedFileName } = this.props;
    utilsType.match('textarea') && item && setTextArea(item.value, checkId);
    utilsType.match('ticketFieldset') && item && setTicketFields(item.value, checkId);
    utilsType.match('uploadField') && item && setUploadedFileName(item.value.fileName, checkId);
  };

  renderTextarea = () => {
    const { itemsToCheck, checkId, submissionText, handleTextAreaSubmit } = this.props;

    return (
      <div className="travelSubmission--item__textarea">
        <textarea
          placeholder="input information here..." name="submissionText" rows="4" cols="80"
          className="textArea" value={submissionText} onChange={this.handleInputChange} 
          type="submit" onBlur={handleTextAreaSubmit}
        />
        {
          itemsToCheck.includes(checkId) && (
            <img
              src={check} alt="check_icon"
              className="travelCheckList--input__check-image__ticket visible" />
          )}
      </div>
    );
  };
  renderUploadField = () => {
    const { fileUploadData, itemsToCheck, checkId, handleUpload} = this.props;
    return (
      <div className="travelSubmission--input__upload-field">
        <div className="travelSubmission--input__input-field">
          <div role="presentation" className="travelSubmission--input__btn">
            <img
              src={uploadIcon} alt="upload_icon" className="travelSubmission--input__image"
            />
            <span id="file-upload" role="presentation">Upload file</span>
          </div>
          <input
            type="file" name="file" className="uploadFile"
            onChange={handleUpload} disabled={fileUploadData.isUploading}
          />
        </div>
        {
          itemsToCheck.includes(checkId) && (
            <img
              src={check} alt="check_icon" 
              className="travelCheckList--input__check-image__ticket visible"
            />
          )
        }
      </div>
    );
  };

  renderUploadedField = () => {
    const { itemsToCheck, checkId, uploadedFileName, handleUpload,
      fileUploadData: { isUploading }, uploadProcess } = this.props;
    const fileName = (!uploadProcess || uploadProcess.match('success')) && uploadedFileName;
    return (
      <div className="travelSubmission--input__upload-field__">
        <div className="travelSubmission--input__input-field__">
          <div role="presentation" className="travelSubmission--input__btn--">
            <span id="file-upload" role="presentation" className="uploadedFileName">
              {fileName}
            </span>
            <img src={uploadIcon} alt="upload_icon" className="travelSubmission--input__image" />
          </div>
          <input
            type="file" name="file" className="uploadedFile" 
            onChange={handleUpload} disabled={isUploading} />
        </div>
        {
          itemsToCheck.includes(checkId) && (
            <img
              src={check} alt="check_icon" 
              className="travelCheckList--input__check-image__ticket visible" />
          )
        }
      </div>
    );
  };

  handleInputChange = (event) => {
    event.preventDefault();
    const {target: {name, value, type}} = event;
    const {handleInputChange} = this.props;
    this.setState({[name]: value});
    handleInputChange(name, value);
    if (type === 'datetime-local') {
      this.setState({isValid: this.validateDates(name, value)});
    }
  };

  validateDates = (name, value) => {
    const fields = ['departureDate', 'departureTime', 
      'arrivalTime', 'returnDepartureTime', 'returnTime'];
    const values = {...this.state, [name]: value};
    let allValid = true;
    for (let i = 1; i < fields.length; i++) {
      const max = i === fields.length - 1 ? null : fields[i + 1];
      if (!this.validateDate(fields[i], 
        values[fields[i]], values[fields[i - 1]], max && values[max])) {
        allValid = false;
      }
    }
    return allValid;
  };

  validateDate = (name, value, min, max) => {
    const valid = (min ? moment(value).isSameOrAfter(moment(min)) : true) &&
    (max ? moment(value).isSameOrBefore(moment(max)) : true);
    this.setState((prevState) => ({
      errors: { ...prevState.errors,
        [name]: !valid ? 'Inconsistent date. Please check again!' : null
      }
    }));
    return valid;
  };

  handleTicketSubmit = () => {
    const {handleTicketSubmit} = this.props;
    const {isValid} = this.state;
    if (isValid) {
      handleTicketSubmit();
    }
  };

  renderTicketInput = (type, placeholder, label, name, tripId, value, min = null, max = null) => {
    const {errors} = this.state;
    return (
      <div className="airline-name">
        <span id="label">{label}</span>
        <input
          id={`${name}-${tripId}`} type={type} value={value || ''} 
          onChange={this.handleInputChange} onBlur={this.handleTicketSubmit}
          name={name} placeholder={placeholder} className={name} min={min} max={max}
        />
        {
          errors[name] && <div className="submission-progress__error">{errors[name]}</div>
        }
      </div>
    );
  };

  renderTicketFieldset = () => {
    const { checklistItem, itemsToCheck, tripType, airline, ticketNumber,
      checkId, returnTicketNumber, returnAirline } = this.props;
    const {name, submissions: {tripId}} = checklistItem;
    const { departureDate, departureTime, arrivalTime, 
      returnDepartureTime, returnTime, arrivalDate } = this.state;
    return (
      name.toLowerCase().includes('travel ticket') &&
      (
        <form className="ticket-submission">
          <div className="ticket-submission--ticket__fieldSet">
            <div className="travel-submission-details__return" id="departure-fields">
              {this.renderTicketInput('datetime-local', '19:35:00', 'Departure Time',
                'departureTime', tripId, departureTime, this.formatDateTime(departureDate),
                this.formatDateTime(arrivalDate)
              )}
              {this.renderTicketInput('datetime-local', '19:35:00', 'Arrival Time',
                'arrivalTime', tripId, arrivalTime, this.formatDateTime(departureTime),
                this.formatDateTime(returnDepartureTime),
              )}
              {this.renderTicketInput('text', 'e.g KQ 532', 'Flight Number',
                'ticketNumber', tripId, ticketNumber
              )}
              {this.renderTicketInput('text', 'e.g Kenya Airways', 'Airline',
                'airline', tripId, airline
              )}
            </div>
            {tripType.match('return') && (
              <div className="travel-submission-details__return" id="return-fields">
                {this.renderTicketInput('datetime-local', '19:35:00', 'Departure Time',
                  'returnDepartureTime', tripId, returnDepartureTime,
                  this.formatDateTime(arrivalTime), this.formatDateTime(arrivalDate)
                )}
                {this.renderTicketInput('datetime-local', '19:35:00', 'Arrival Time',
                  'returnTime', tripId, returnTime, this.formatDateTime(returnDepartureTime)
                )}
                {this.renderTicketInput('text', 'e.g KQ 532', 'Return Flight Number',
                  'returnTicketNumber', tripId, returnTicketNumber
                )}
                {this.renderTicketInput('text', 'e.g Kenya Airways', 'Airline',
                  'returnAirline', tripId, returnAirline
                )}
              </div>
            )}
          </div>
          {itemsToCheck.includes(checkId) && (
            <img
              src={check} alt="check_icon" 
              className="travelCheckList--input__check-image__ticket visible" />
          )}
        </form>
      )
    );
  };

  formatDateTime = (date) => moment(date).format('YYYY-MM-DDTHH:mm');

  renderSubmissionsUtils = () => {
    const {utilsType, checklistItem: {submissions: [item]}} = this.props;
    const {showUploadedField} = this.state;
    return (
      <Fragment>
        {utilsType && utilsType.match('ticketFieldset') && this.renderTicketFieldset()}
        {(utilsType && utilsType.match('uploadField') && !item && !showUploadedField) &&
        this.renderUploadField()}
        {utilsType && utilsType.match('uploadField') && (item || showUploadedField) &&
        this.renderUploadedField()}
        {utilsType && utilsType.match('textarea') && this.renderTextarea()}
      </Fragment>
    );
  };

  render() {
    return ( <Fragment>{this.renderSubmissionsUtils()}</Fragment> );
  }
}

SubmissionsUtils.propTypes = {
  checklistItem: PropTypes.object.isRequired, utilsType: PropTypes.string,
  checkId: PropTypes.string.isRequired, returnTicketNumber: PropTypes.string.isRequired,
  submissionText: PropTypes.string.isRequired, ticketNumber: PropTypes.string.isRequired, 
  airline: PropTypes.string.isRequired, returnAirline: PropTypes.string.isRequired,
  handleUpload: PropTypes.func.isRequired, setTicketFields: PropTypes.func.isRequired,
  setTextArea: PropTypes.func.isRequired, postSuccess: PropTypes.array.isRequired,
  setUploadedFileName: PropTypes.func.isRequired, handleInputChange: PropTypes.func.isRequired,
  handleTextAreaSubmit: PropTypes.func.isRequired, fileUploadData: PropTypes.object.isRequired,
  handleTicketSubmit: PropTypes.func.isRequired, tripType: PropTypes.string.isRequired,
  uploadedFileName: PropTypes.string.isRequired, uploadProcess: PropTypes.string.isRequired,
  itemsToCheck: PropTypes.array.isRequired,
};

SubmissionsUtils.defaultProps = {utilsType: ''};

export default SubmissionsUtils;
