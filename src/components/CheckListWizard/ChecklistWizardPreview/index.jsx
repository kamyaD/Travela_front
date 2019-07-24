import React, { createRef } from 'react';
import toast from 'toastr';
import PropTypes from 'prop-types';
import PreviewChecklistItem from './PreviewChecklistItem';
import './index.scss';

const ChecklistWizardPreview = ({ items, nationality, destinations }) => {
  const refs = items.reduce((acc, value) => {
    acc[value.order] = createRef();
    return acc;
  }, {});

  const handleSkipToQuestion = questionToSkipTo => {
    if (!refs[questionToSkipTo]) {
      toast.error(`Question ${questionToSkipTo} does not exist yet`);
    } else {
      refs[questionToSkipTo].current.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      });
    }
  };
  return (
    <div className="checklist-wizard-preview checklist-wizard-col">
      <div className="preview-item-header">
        <p className="preview-header">Preview the Checklist</p>
        <p className="travellingto-preview">
          {`Applicable to ${nationality.name} travelling to `}
          <span className="coutries-blue">{`${destinations.length} countries`}</span>
        </p>
      </div>
      {items.map(item => (
        <div className="preview-checklist-item" key={item.order} ref={refs[item.order]} id={item.order}>
          <PreviewChecklistItem
            key={item.order}
            type={item.type}
            order={item.order}
            prompt={item.prompt}
            configuration={item.configuration}
            handleSkipToQuestion={handleSkipToQuestion}
            items={items}
            itemBehaviour={item.behaviour}
          />
        </div>
      ))}
    </div>
  );
};


ChecklistWizardPreview.propTypes = {
  items: PropTypes.arrayOf(Object).isRequired,
  nationality: PropTypes.objectOf(PropTypes.string).isRequired,
  destinations: PropTypes.arrayOf(PropTypes.object).isRequired,
};

export default ChecklistWizardPreview;
