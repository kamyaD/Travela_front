import React, { PureComponent } from 'react';
import { PropTypes } from 'prop-types';
import moment from 'moment';
import { FormContext } from '../FormsAPI';
import MaintainanceFieldSets from './FormFieldsets/maintaince';
import './maintainance.scss';

class MaintainceForm extends PureComponent {
  constructor(props) {
    super(props);

    this.defaultState = {
      values: {
        reason: '',
        maintainanceStart: '',
        maintainanceEnd: ''
      },
      errors: {},
      hasBlankFields: true,
      hideNotificationPane: true,
      hideSideBar: false,
      openSearch: false,
      selectedLink: 'settings page',
      hideOverlay: false
    };
    this.state = { ...this.defaultState };
  }

  componentDidMount() {
    const { maintenance } = this.props;
    const { departureDate, returnDate, reason } = maintenance;
    const startDate = departureDate ? moment(departureDate, 'YYYY-MM-DD').format('MM/DD/YYYY') : '';
    const endDate = returnDate ? moment(returnDate, 'YYYY-MM-DD').format('MM/DD/YYYY') : '';  

    // eslint-disable-next-line react/no-did-mount-set-state
    this.setState(prevState => ({...prevState, values : {maintainanceStart: startDate, maintainanceEnd: endDate, reason }}));
  }

  submitMaintainanceData = event => {
    event.preventDefault();
    const { values } = this.state;
    const {addmaintenanceRecord, id, closeModal, timelineDateRange, guestHouseId} = this.props;
    const [startDateString, endDateString] = timelineDateRange;
    if (this.validate) {
      let data = { ...values };
      data.start = data.maintainanceStart;
      data.end = data.maintainanceEnd;
      addmaintenanceRecord(data, id, startDateString, endDateString, guestHouseId);
      closeModal(true, 'new model');
    }
  };

  submitEditedMaintenanceData = event => {
    event.preventDefault();
    const { values } = this.state;
    const record = {
      reason: values.reason,
      start: values.maintainanceStart,
      end: values.maintainanceEnd
    };
    const { maintenance, updateMaintenanceRecord } = this.props;
    updateMaintenanceRecord(record, maintenance.roomId);
  };

  handleClearForm = () => {
    this.setState({ ...this.defaultState });
  };

  validate = field => {
    let { values, errors } = this.state;
    [errors, values] = [{ ...errors }, { ...values }];
    let hasBlankFields = false;
    !values[field]
      ? (errors[field] = 'This field is required')
      : (errors[field] = '');
    hasBlankFields = Object.keys(values).some(key => !values[key]);
    this.setState(prevState => {
      return { ...prevState, errors, hasBlankFields };
    });
    return !hasBlankFields;
  };

  render() {
    const { values, errors, hasBlankFields } = this.state;
    const { modalType, editMaintenance } = this.props;
    const onSubmit = (modalType === 'edit-maintenance') 
      ? this.submitEditedMaintenanceData 
      : this.submitMaintainanceData;
    return (
      <FormContext targetForm={this} validatorName="validate" values={values} errors={errors}>
        <form onSubmit={onSubmit} className="maintainance-form">
          <MaintainanceFieldSets values={values} hasBlankFields={hasBlankFields} editMaintenance={editMaintenance} />
          <div className="maintainence-line" />
          <div className="maintainence-submit-area">
            {hasBlankFields ? (
              <div className="maintainence-submit-area_false">
                <button type="submit" disabled={hasBlankFields} className="bg-btn bg-btn--inactive">
                Save Changes
                </button>
              </div>) :
              (
                <div className="maintainence-submit-area">
                  <button type="button" className="bg-btn bg-btn--inactive btn-cancel" onClick={this.handleClearForm} id="btn-cancel">
                Cancel
                  </button>
                  <button type="submit" className="bg-btn bg-btn--active">
                Save Changes
                  </button>
                </div>
              )}
          </div>

        </form>
      </FormContext>
    );
  }
}

MaintainceForm.propTypes = {
  modalType: PropTypes.string,
  editMaintenance: PropTypes.object,
  maintenance: PropTypes.object,
  addmaintenanceRecord: PropTypes.func.isRequired,
  id: PropTypes.string.isRequired,
  closeModal: PropTypes.func.isRequired,
  updateMaintenanceRecord: PropTypes.func.isRequired,
  timelineDateRange: PropTypes.array,
  guestHouseId: PropTypes.string
};

MaintainceForm.defaultProps = {
  modalType: '',
  maintenance: {},
  editMaintenance: {},
  timelineDateRange: [],
  guestHouseId: ''
};

export default MaintainceForm;
