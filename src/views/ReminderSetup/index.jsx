import React, { Fragment } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { fetchTemplate } from '../../redux/actionCreator/templatedetailsAction';
import { fetchAllEmailTemplates }from '../../redux/actionCreator/listEmailTemplatesActions';
import ListEmailTemplates from '../../components/ReminderSetup/ListEmailTemplates';
import PageHeader from '../../components/PageHeader';
import { closeModal, openModal } from '../../redux/actionCreator/modalActions';
import Base from '../Base';
import {  enableReminderEmailTemplate, disableEmailTemplate } from '../../redux/actionCreator/reminderManagementActions';
import DisableReminderTemplateForm from '../../components/Forms/DisableReminderTemplateForm/DisableReminderTemplate';
import EnableEmailReminderTemplateForm
  from '../../components/Forms/EnableReminderEmailTemplateForm/EnableReminderEmailTemplateForm';

export class ReminderSetup extends Base {
  state = { disableReason: '', templateId: '', templateName: '', templateReason:'' }

  setItemToDisable = (disabled, template, reason) => {
    const { openModal } = this.props;
    if(disabled === true){
      this.setState({
        templateId: template.id,
      });
      openModal(true, 'enable reminder template');
    }else{
      this.setState({
        templateId: template.id,
        templateName: template.name,
        templateReason: reason || ''
      });
      openModal(true, 'disable reminder template');
    }
  }

  handleInputChange = (event) => {
    this.setState({ disableReason: event.target.value });
  }

  enableReminderTemplate = (event) => {
    event.preventDefault();
    const { enableReminderEmailTemplate } = this.props;
    const { templateId } = this.state;
    enableReminderEmailTemplate(templateId);
  }

  disableReminderTemplate = (event) => {
    event.preventDefault();
    const { disableEmailTemplate } = this.props;
    const { templateId } = this.state;
    disableEmailTemplate(templateId, this.state);
    this.setState({ disableReason: null });
  }

  renderEnableReminderTemplateForm() {
    const { shouldOpen, modalType, closeModal } = this.props;
    const { itemName } = this.state;
    return (
      <EnableEmailReminderTemplateForm
        shouldOpen={shouldOpen} enableReminderTemplate={this.enableReminderTemplate}
        itemName={itemName} modalType={modalType} closeModal={closeModal} /> );
  }

  renderDisableReminderTemplateForm() {
    const { shouldOpen, modalType, closeModal } = this.props;
    const { itemName, disableReason, templateReason } = this.state;
    return (
      <DisableReminderTemplateForm
        shouldOpen={shouldOpen} disableReminderTemplate={this.disableReminderTemplate}
        handleInputChange={this.handleInputChange} itemName={itemName} disableReason={disableReason}
        modalType={modalType} closeModal={closeModal} templateReason={templateReason} />
    );
  }

  render() {
    const { fetchTemplates, listEmailTemplatesReducer, location,
      history, openModal, closeModal, shouldOpen, modalType,
      fetchOneTemplate } = this.props;
    return (
      <Fragment>
        <div className="readiness-header">
          <div className="templates-header">
            <PageHeader
              title="EMAIL TEMPLATES"
              actionBtn="CREATE NEW"
              actionBtnClickHandler={() => {
                history.push('/settings/reminder-setup/create');
              }}
            />
          </div>
        </div>
        <ListEmailTemplates
          fetchTemplates={fetchTemplates}
          fetchOneTemplate={fetchOneTemplate}
          listEmailTemplatesReducer={listEmailTemplatesReducer}
          location={location}
          setItemToDisable={this.setItemToDisable}
          openModal={openModal}
          closeModal={closeModal}
          shouldOpen={shouldOpen}
          modalType={modalType}
        />
        {this.renderEnableReminderTemplateForm()}
        {this.renderDisableReminderTemplateForm()}
      </Fragment>
    );
  }
}

const mapDispatchToProps = {
  openModal, closeModal, enableReminderEmailTemplate, disableEmailTemplate,
  fetchTemplates: fetchAllEmailTemplates, fetchOneTemplate: fetchTemplate
};

ReminderSetup.propTypes = {
  fetchTemplates: PropTypes.func.isRequired,
  listEmailTemplatesReducer: PropTypes.object.isRequired,
  location: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
  openModal: PropTypes.func.isRequired,
  closeModal: PropTypes.func.isRequired,
  shouldOpen: PropTypes.bool,
  modalType: PropTypes.string,
  fetchOneTemplate: PropTypes.func.isRequired,
  enableReminderTemplate: PropTypes.func,
};

ReminderSetup.defaultProps = {
  modalType: '',
  shouldOpen: false,
  fetchOneTemplate: () => { }
};

const mapStateToProps = ({listEmailTemplatesReducer, modal}) => ({
  listEmailTemplatesReducer, ...modal.modal,
});

export default connect(mapStateToProps, mapDispatchToProps)(ReminderSetup);
