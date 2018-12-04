import React, {Fragment}  from  'react';
import {connect} from 'react-redux';
import VerificationsPanelHeader from '../../components/VerificationsPanelHeader';
import { fetchUserApprovals } from '../../redux/actionCreator/approvalActions';
import { openModal, closeModal } from '../../redux/actionCreator/modalActions';
import WithLoadingTable from '../../components/Table';
import Base from '../Base';
import Utils from '../../helper/Utils';
import checkUserPermission from '../../helper/permissions';

export class Verifications extends Base {

  state = {
    clickPage: true,
    activeStatus: Utils.getActiveStatus(this.props.location.search),
    searchQuery:  this.props.location.search,
    requestId: ''
  }

  componentDidMount () {
    const { fetchUserApprovals, match: {params: {requestId}}, openModal, page, getCurrentUserRole} = this.props;
    const { searchQuery } = this.state;
    // check if ? exists in searchQuery then append &verified=true
    if (getCurrentUserRole.length > 0) {
      const prefix = (searchQuery.indexOf('?') < 0) ? '?' : '&';
      fetchUserApprovals(`${searchQuery}${prefix}verified=true`);
    }
    if(requestId){
      openModal(true, 'request details', page);
      this.storeRequestIdApproval(requestId);
    }
  }

  storeRequestIdApproval = (requestId)=> {
    this.setState({requestId: requestId});
  }

  renderApprovalsTable(){
    const { approvals, history, location, openModal, closeModal, shouldOpen, modalType, submissionInfo } = this.props;
    const {requestId} = this.state;
    const requestData = approvals.approvals ? approvals.approvals.filter(approval => (approval.id === requestId))[0] : {};
    return(
      <WithLoadingTable
        requests={approvals.approvals}
        location={location}
        history={history}
        isLoading={approvals.isLoading}
        fetchRequestsError={approvals.fetchApprovalsError}
        message={approvals.message}
        type="verifications"
        requestId={requestId}
        closeModal={closeModal}
        openModal={openModal}
        shouldOpen={shouldOpen}
        modalType={modalType}
        submissionInfo={submissionInfo}
        page="Verifications"
        requestData={requestData}
      />
    );
  }

  fetchFilteredApprovals = (query) => {
    const { history, location, fetchUserApprovals } = this.props;
    const prefix = (query.indexOf('?') < 0) ? '?' : '&';
    history.push(`/requests/my-verifications${query}`);
    fetchUserApprovals(`${query}${prefix}verified=true`);
    this.setState(prevState => ({
      ...prevState,
      activeStatus: Utils.getActiveStatus(query),
      searchQuery: query
    }));
  }

  onPageChange = (page) => {
    const { searchQuery } = this.state;
    const query = Utils.buildQuery(searchQuery, 'page', page);
    this.fetchFilteredApprovals(query);
  }

  getApprovalsWithLimit = (limit) => {
    let { searchQuery } = this.state;
    const { approvals } = this.props;
    this.getEntriesWithLimit(limit, searchQuery, approvals.pagination, this.fetchFilteredApprovals);
  }

  renderVerificationsPaneHeader(loading){
    const { activeStatus, searchQuery } = this.state;
    const { approvals } = this.props;
    const { approvedApprovalsCount, verifiedApprovalsCount } = approvals;

    return(
      <div className="rp-requests__header">
        <VerificationsPanelHeader
          url={searchQuery}
          approvedApprovalsCount={approvedApprovalsCount}
          verifiedApprovalsCount={verifiedApprovalsCount}
          fetchApprovals={this.fetchFilteredApprovals}
          getApprovalsWithLimit={this.getApprovalsWithLimit}
          activeStatus={activeStatus}
          approvalsLength={approvals.approvals.length}
          loading={loading}
        />
      </div>
    );
  }
  
  render() {
    const {approvals, getCurrentUserRole, history} = this.props;
    const { isLoading } = approvals;
    if (!isLoading && getCurrentUserRole.length > 0) {
      const allowedRoles = ['Travel Administrator', 'Super Administrator', 'Travel Team Member'];
      checkUserPermission(history, allowedRoles, getCurrentUserRole);
    }
    return (
      <Fragment>
        {this.renderVerificationsPaneHeader(approvals.isLoading )}
        {approvals.approvals && this.renderApprovalsTable()}
        {!approvals.isLoading && approvals.approvals.length > 0 && this.renderPagination(approvals.pagination)}
      </Fragment>
    );
  }
}

const mapStateToProps = (state) => ({
  approvals: state.approvals,
  ...state.modal.modal,
  submissionInfo: state.submissions,
  getCurrentUserRole: state.user.getCurrentUserRole
});

const actionCreators = {
  fetchUserApprovals,
  openModal,
  closeModal
};

export default connect(mapStateToProps, actionCreators)(Verifications);
