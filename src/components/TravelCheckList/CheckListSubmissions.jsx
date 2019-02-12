import React, {Component, Fragment} from 'react';
import {PropTypes} from 'prop-types';
import { Link } from 'react-router-dom';
import countryUtils from '../../helper/countryUtils';
import SubmissionItem from './SubmissionItem';
import Preloader from '../Preloader/Preloader';
import './travelSubmission.scss';


class CheckListSubmissions extends Component {
  renderCheckList = (list, keyIndex) => {
    const {
      fileUploads, handleFileUpload, postSuccess, tripType,
      postSubmission, itemsToCheck, isUploadingStage2, requestId,
      request
    } = this.props;
    const {checklist, destinationName, tripId} = list;
    const countryFlagUrl = countryUtils.getCountryFlagUrl(destinationName);
    return (
      <div key={keyIndex} className="travelCheckList__destination">
        <div className="travelCheckList__destination-name">
          <div
            className="travelCheckList__destination-flag" alt="country flag"
            style={{backgroundImage: `url(${countryFlagUrl})`}}
          />
          {destinationName}
        </div>
        {
          checklist.length &&
          checklist.map((item) => (
            <SubmissionItem
              key={`${item.id}`} checklistItem={item}
              checkId={`${tripId}-${item.id}`}
              fileUploadData={fileUploads}
              request={request}
              handleFileUpload={handleFileUpload}
              requestId={requestId}
              postSubmission={postSubmission}
              postSuccess={postSuccess}
              tripId={tripId}
              tripType={tripType}
              itemsToCheck={itemsToCheck}
              isUploadingStage2={isUploadingStage2}
            />
          ))
        }
      </div>
    );
  }

  renderSubmissions = () => {
    const {submissions, closeModal} = this.props;
    let url = location.pathname;
    if (/requests\/\w+\/checklist/.test(url)) {
      url = '/requests';
    }
    return (
      <Fragment>
        <div className="travelCheckList">
          {
            submissions.length
              ? submissions.map((list, i) => this.renderCheckList(list, i))
              : (
                <p className="travelCheckList__not-found">
                  There are no checklist items for your selected destination(s).
                  Please contact your Travel Department.
                </p>
              )
          }
        </div>
        <div className="travelCheckList__submit-area">
          <Link to={url}>
            <button
              type="button"
              className="bg-btn bg-btn--active"
              onClick={() => {closeModal();}}
              disabled={false}
            >
              Close
            </button>
          </Link>
        </div>
      </Fragment>
    );
  };

  render() {
    const {isLoading} = this.props;
    return (
      <Fragment>
        {isLoading
          ? <Preloader spinnerClass="loader" />
          : this.renderSubmissions()
        }
      </Fragment>
    );
  }
}

CheckListSubmissions.defaultProps = {
  request: {}
};

CheckListSubmissions.propTypes = {
  postSubmission: PropTypes.func.isRequired,
  submissions: PropTypes.array.isRequired,
  isLoading: PropTypes.bool.isRequired,
  handleFileUpload: PropTypes.func.isRequired,
  itemsToCheck: PropTypes.array.isRequired,
  closeModal: PropTypes.func.isRequired,
  tripType: PropTypes.string.isRequired,
  request: PropTypes.object,
  requestId: PropTypes.string.isRequired,
  postSuccess: PropTypes.array.isRequired,
  fileUploads: PropTypes.object.isRequired,
  isUploadingStage2: PropTypes.array.isRequired
};

export default CheckListSubmissions;
