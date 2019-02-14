import React, { Component } from 'react';
import Proptypes from 'prop-types';
import { isEmpty } from 'lodash';

class FileUploadField extends Component{
  getUrlLink = (name) => {
    const { document:{ data }, modalType } = this.props;
    if (!isEmpty(data) && (modalType.startsWith('edit')) && name === '') {
      const { imageName, cloudinaryUrl } = data;
      const documentImage = imageName 
        ? imageName.length > 40
          ?  `${imageName.substring(0, 40)}...`
          : `${imageName}`
        :cloudinaryUrl.length > 40
          ?  `${cloudinaryUrl.substring(0, 40)}...`
          : `${cloudinaryUrl}`;
      return documentImage;
    }
    return (
      name !== ''
        ? name.length > 50
          ? `${name.substring(0, 50)}...`
          : name
        : 'Drag file here or choose from computer'
    );
  };

  render(){
    const { name, documentUpload, handleUpload } = this.props;
    return  ( 
      <div className="document-input__input-container">
        <label className="document-input__input-container__prompts" htmlFor="select-file">
          <img
            src={documentUpload}
            alt="Document Upload" className="document-input__input-container__prompts__img" />
          <div className="document-input__input-container__prompts__text">
            <p>
              { this.getUrlLink(name)}
            </p>
          </div>
          <input type="file" onChange={handleUpload} id="select-file"  />
        </label>
      </div>
    );
  }
}

FileUploadField.propTypes = {
  name: Proptypes.string,
  documentUpload: Proptypes.string.isRequired,
  handleUpload: Proptypes.func.isRequired,
  document: Proptypes.object.isRequired,
  modalType: Proptypes.string.isRequired,
};

FileUploadField.defaultProps = {
  name: '',
};

export default FileUploadField;

