import React, { Component } from 'react';
import {PropTypes} from 'prop-types';
import toast from 'toastr';
import axios from 'axios';
import { isEmpty } from 'lodash';
import moment from 'moment';
import {FormContext} from '../Forms/FormsAPI';
import formatDate from '../../helper/formatDate';
import '../Forms/TravelReadinessForm/TravelDocument.scss';
import DocumentAPI from '../../services/DocumentAPI';
import FileUploadField from '../Forms/TravelReadinessForm/FormFieldsets/FileUploadField';
import SubmitArea from '../Forms/TravelReadinessForm/FormFieldsets/SubmitArea';
import Preloader from '../Preloader/Preloader';
import documentUpload from '../../images/icons/document-upload-blue.svg';

export default function TravelReadinessForm (FormFieldSet, documentType, defaultFormState) {
  class BaseForm extends Component {
    constructor(props) {
      super(props);
      this.state = {...defaultFormState, imageChanged: false};
    }

    componentWillReceiveProps(nextProps) {
      const { errors, document, modalType } = nextProps;
      if(/edit/.test(modalType) && !isEmpty(document)){
        return this.updateFormFields(document, modalType);
      }
      return this.setState({errors, uploadingDocument: false});
    }

    componentWillUnmount() {
      const {fetchUserData, user} = this.props;
      fetchUserData(user.currentUser.userId);
    }

    updateFormFields = (document, modalType) => {
      const { data } = document;
      if(modalType === 'edit passport') {
        return this.setState(prevState => {
          const newValues = {
            ...prevState.values,
            ...data, dateOfBirth: formatDate(data.dateOfBirth),
            dateOfIssue: formatDate(data.dateOfIssue),
            expiryDate: formatDate(data.expiryDate)
          };
          return { ...prevState, id: document.id, values: {...newValues} };
        });
      }
      return this.setState(prevState => {
        const newValues = { ...prevState.values, ...data };
        return { ...prevState, id: document.id, documentUploaded: true, values: {...newValues} };
      });
    }

    onCancel = (event) => {
      event.preventDefault();
      const {closeModal} = this.props;
      closeModal();
    };

    handleSubmit = async (event) => {
      event.preventDefault();
      const {values, image, errors, id} = this.state;
      const {createTravelReadinessDocument, editTravelReadinessDocument, modalType} = this.props;
      const {dateOfIssue, expiryDate} = values;
      const newValues = {
        ...values,
        dateOfIssue: dateOfIssue === '' ? '' :
          moment(dateOfIssue)
            .format( 'MM/DD/YYYY'),
        expiryDate: moment(expiryDate).format(
          'MM/DD/YYYY'
        )
      };

      if (image) {
        const fd = new FormData();
        fd.append('file', image);
        fd.append('upload_preset', process.env.REACT_APP_PRESET_NAME);
        try {
          delete axios.defaults.headers.common['Authorization'];
          this.setState({uploadingDocument: true});
          const imageData = await axios.post(
            process.env.REACT_APP_CLOUNDINARY_API, fd,
            { onUploadProgress: this.handleUploadProgress
            }
          );
          const {data: {url}} = imageData;
          this.setState({
            documentUploaded: true,
            uploadingDocument: false,
            values: {...values, cloudinaryUrl: url}
          });
          DocumentAPI.setToken();
          const documentValues = {
            ...newValues,
            cloudinaryUrl: url,
          };
          if (/edit/.test(modalType)) {
            return editTravelReadinessDocument(documentType, {...documentValues}, id);
          } else {
            return createTravelReadinessDocument(documentType, {...documentValues});
          }
        } catch (e) {
          toast.error('Error uploading document. Please try again!');
        }
      } 
      if (/edit/.test(modalType)) {
        editTravelReadinessDocument(documentType, newValues, id);
      } else {
        createTravelReadinessDocument(documentType, newValues);
      }
      return this.setState({errors: {...errors, cloudinaryUrl: 'Please upload a document'}});
    };

    handleUploadProgress = (e) => this.setState({ uploadProgress: e.loaded/e.total});

    handleUpload = (e) => {
      e.preventDefault();
      const image = e.target.files[0];
      if (!['image/jpeg', 'image/png'].includes(image.type)) {
        return toast.error('Invalid file type. Please upload an image');
      }
      if (image.size > Math.pow(10, 7)) {
        return toast.error('File is too large');
      }
      const {name} = image;
      this.setState({name, image, imageChanged: true});
    };

    render() {
      const {errors, values, hasBlankFields, uploadingDocument,
        name, imageChanged, uploadProgress} = this.state;
      const { modalType, document, fetchingDocument} = this.props;
      if (documentType === 'other') delete errors.documentid;
      const submitButton = {
        other: 'Add Document',
        visa: 'Add Visa',
        passport: 'Add Passport'
      };
      return (
        <div>
          {fetchingDocument ? <Preloader /> : (
            <FormContext values={values} errors={errors} targetForm={this}>
              <form className="travel-document-form" onSubmit={this.handleSubmit}>
                {<FormFieldSet />}
                <div className="travel-document-select-file">
                  <p>Attach File</p>
                  <FileUploadField
                    name={name}
                    documentUpload={documentUpload}
                    handleUpload={this.handleUpload}
                    document={document}
                    modalType={modalType}
                  />
                  {uploadingDocument && <progress className="progress-bar" value={uploadProgress} max={1} />}
                </div>
                <hr />
                <div className="travel-document-submit-area">
                  <SubmitArea
                    onCancel={this.onCancel} hasBlankFields={hasBlankFields && !imageChanged}
                    send={
                      (modalType.startsWith('edit')) ? 'Save Changes' :
                        submitButton[documentType]}
                    loading={uploadingDocument} />
                </div>
              </form>
            </FormContext>)}
        </div>
      );
    }
  }

  BaseForm.propTypes = {
    errors: PropTypes.object,
    createTravelReadinessDocument: PropTypes.func.isRequired,
    closeModal: PropTypes.func.isRequired,
    fetchUserData: PropTypes.func.isRequired,
    user: PropTypes.object.isRequired,
    editTravelReadinessDocument: PropTypes.func,
    document: PropTypes.object,
    modalType: PropTypes.string, fetchingDocument: PropTypes.bool
  };

  BaseForm.defaultProps = {
    editTravelReadinessDocument: () => {
    },
    document: {},
    modalType: '',
    errors: {},
    fetchingDocument: false
  };
  return BaseForm;
}
