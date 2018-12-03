import React, {Component, Fragment} from 'react';
import { connect } from 'react-redux';
import { PropTypes } from 'prop-types';
import WithLoadingRoleTable from '../../components/RoleTable';
import RolePanelHeader from '../../components/RolePanelHeader';
import Modal from '../../components/modal/Modal';
import { AddRoleForm } from '../../components/Forms';
import { openModal, closeModal } from '../../redux/actionCreator/modalActions';
import {
  getRoleData,
  putRoleData,
  addRole,
  updateRole
} from '../../redux/actionCreator/roleActions';
import './Role.scss';
import checkUserPermission from '../../helper/permissions';

export class Role extends Component {
  state = {
    headTitle: 'Add Role',
    roleDetail: ''
  }
  componentDidMount() {
    const { getRoleData } = this.props;
    getRoleData();
  }

  handleAddRole = () => {
    const {openModal} = this.props;
    this.setState({headTitle: 'Add Role', roleDetail: ''});
    openModal(true, 'new model');
  }

  handleEditRole = (role) => {
    let {openModal} = this.props;
    openModal(true, 'new model');
    this.setState({
      headTitle: 'Edit Role',
      roleDetail: role
    });
  }

  renderUserRolePanelHeader() {
    return (
      <div className="rp-role__header">
        <RolePanelHeader openModal={this.handleAddRole} />
      </div>
    );
  }

  renderRoles() {
    const { isLoading, roles, roleErrors } = this.props;
    return (
      <div className="rp-table">
        <WithLoadingRoleTable
          isLoading={isLoading}
          roles={roles}
          fetchRoleError={roleErrors}
          handleEditRole={this.handleEditRole}
        />
      </div>
    );
  }

  renderRoleForm() {
    const { roleErrors, closeModal, shouldOpen, modalType, addRole, isAddingRole, updateRole } = this.props;
    const { headTitle, roleDetail } = this.state;
    return (
      <Modal
        closeModal={closeModal}
        customModalStyles="add-user"
        width="480px"
        visibility={
          shouldOpen && modalType === 'new model' ? 'visible' : 'invisible'
        }
        title={headTitle}
      >
        <AddRoleForm
          addRole={addRole}
          errors={roleErrors}
          closeModal={closeModal}
          addingRole={isAddingRole}
          roleDetail={roleDetail}
          myTitle={headTitle}
          updateRole={updateRole}
        />
      </Modal>
    );
  }

  renderUserRolePage() {
    return (
      <Fragment>
        {this.renderUserRolePanelHeader()}
        {this.renderRoles()}
      </Fragment>
    );
  }

  render() {
    const { getCurrentUserRole, history, isLoaded } = this.props;
    if (isLoaded) {
      const allowedRoles = ['Super Administrator'];
      checkUserPermission(history, allowedRoles, getCurrentUserRole );
    }
    return (
      <Fragment>
        {this.renderRoleForm()}
        {this.renderUserRolePage( )}
      </Fragment>
    );
  }
}

export const mapStateToProps = ({ modal, role, user }) => ({
  ...user,
  ...modal.modal,
  ...role
});

Role.propTypes = {
  roles: PropTypes.object.isRequired,
  closeModal: PropTypes.func.isRequired,
  getRoleData: PropTypes.func.isRequired,
  roleErrors: PropTypes.string,
  addRole: PropTypes.func.isRequired,
  isLoading: PropTypes.bool,
  getCurrentUserRole: PropTypes.array.isRequired,
  history: PropTypes.shape({}).isRequired,
  openModal: PropTypes.func.isRequired,
  shouldOpen: PropTypes.bool.isRequired,
  modalType: PropTypes.string,
  isLoaded: PropTypes.bool,
  isAddingRole: PropTypes.bool,
  updateRole: PropTypes.func.isRequired
};

Role.defaultProps = {
  isLoading: false,
  roleErrors: '',
  modalType: '',
  isLoaded: false,
  isAddingRole: false
};

const actionCreators = {
  getRoleData,
  putRoleData,
  openModal,
  closeModal,
  addRole,
  updateRole,
};

export default connect(
  mapStateToProps,
  actionCreators
)(Role);
