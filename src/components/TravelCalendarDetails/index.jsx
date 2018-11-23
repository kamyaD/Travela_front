import React, {PureComponent, Fragment} from 'react';
import { PropTypes } from 'prop-types';

import './index.scss';

import ImageLink from '../image-link/ImageLink';
import upic from '../../images/upic.svg';
import upArrow from '../../images/upArrow.svg';
import downArrow from '../../images/downArrow.svg';
import flightTakeoff from '../../images/flightTakeoff.svg';
import flightLand from '../../images/flightLand.svg';

class TravelCalendarDetails extends PureComponent{
  state = {
    hideDetails: false,
    hideBtnLabel: 'Hide Details'
  };

  renderUserBio= (name, role, department, picture) => {
    const {hideDetails, hideBtnLabel} = this.state;
    return (
      <Fragment>
        <div className="user">
          <ImageLink
            imageSrc={picture}
            altText="Andela Logo"
            imageClass="navbar__mdl-upic"
          />
          <span className="user__bio">
            <p className="user__name">{name}</p>
            <span className="user__role">{role}</span>
            <span className="user__role">, </span>
            <span className="user__role">{department}</span>
          </span>
          <button className="toggle-btn" type="button" onClick={this.handleHideToggle}>
            {hideBtnLabel}
            <img className="toggle-btn__icon" src={hideDetails?downArrow:upArrow} alt="show/hide details" />
          </button>
        </div>
      </Fragment>
    );
  }

  renderFlightDetails=(flightType, flightDetails)=>{
    const {timeHeader, time} = flightType==='Arrival'? {timeHeader:'Arrival Time', time:'arrivalTime'}
      :{timeHeader:'Departure Time', time:'departureTime'};
    const headerAttrs = ['Airline', 'Flight No.', timeHeader, 'Destination'];
    const dataAttrs = ['airline', 'flightNo', time, 'destination'];
    const{hideDetails} = this.state;
    const icon = flightType==='Arrival'?flightLand: flightTakeoff;

    if(!hideDetails){return(
      <Fragment>
        <div className="flight">
          <div className="flight__header">
            <img src={icon} alt="Arrival" />
            <p className="flight__title">{flightType}</p>
          </div>
          <table>
            <thead>
              <tr>
                {headerAttrs.map(attr => (<th key={attr}>{attr}</th>))}
              </tr>
            </thead>
            <tbody>
              <tr>
                {dataAttrs.map(attr => (<td key={attr}>{flightDetails[attr]}</td>))}
              </tr>
            </tbody>
          </table>
        </div>
      </Fragment>
    );}
  }

  renderTravelCalendarDetails= () => {
    const {calendar} = this.props;
    if(calendar){
      const {flight, name, role, department, picture} = calendar;
      const {arrival, departure} = flight;

      return (
        <Fragment>
          <div className="demo-card-wide mdl-card mdl-shadow--2dp">
            {this.renderUserBio(name, role, department, picture)}
            <div className="flight-details">
              {this.renderFlightDetails('Arrival', arrival)}
              {this.renderFlightDetails('Departure', departure)}
            </div>
          </div>
        </Fragment>
      );
    }
  }

  handleHideToggle = () => {
    const {hideDetails} = this.state;
    hideDetails ? this.setState({ hideDetails: false, hideBtnLabel:'Hide Details'})
      : this.setState({ hideDetails: true, hideBtnLabel:'Show Details'});
  }

  render(){
    return (
      <Fragment>
        <div>
          {this.renderTravelCalendarDetails()}
        </div>
      </Fragment>
    );
  }
}

TravelCalendarDetails.propTypes = {
  calendar: PropTypes.object.isRequired
};

export default TravelCalendarDetails;
