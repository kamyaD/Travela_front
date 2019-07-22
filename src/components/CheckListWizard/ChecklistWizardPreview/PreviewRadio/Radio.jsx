import React, { Component } from 'react';
import PropTypes from 'prop-types';

class Radio extends Component {
  componentDidUpdate(prevProps) {
    const { behaviourName, handleCheckName, optionId, radioId } = this.props;
    if (prevProps.behaviourName !== behaviourName) {
      handleCheckName(behaviourName, radioId);
    }
  }

  render() {
    const { options, prompt, handleCheckName, behaviourName, optionId, radioId, order } = this.props;
    return (
      <label className={radioId === optionId ? 'radio-cell-selected' : 'radio-cell'} htmlFor="radio">
        <input 
          className="radio-btn"
          type="radio"
          checked={radioId === optionId}
          onChange={() => handleCheckName(behaviourName, radioId)}
          name={`${order}-radio-${prompt}`} 
          value={options.name} />
        <span className="radio-value">{options.name}</span>
      </label>
    );
  }
}

Radio.defaultProps = {
  behaviourName: '',
  optionId: 1,
};

Radio.propTypes = {
  prompt: PropTypes.string.isRequired,
  options: PropTypes.shape({id: PropTypes.number, name: PropTypes.string}).isRequired,
  handleCheckName: PropTypes.func.isRequired,
  behaviourName: PropTypes.string,
  optionId: PropTypes.number,
  radioId: PropTypes.number.isRequired,
  order: PropTypes.number.isRequired,
  
};

export default Radio;
