import React, {Component, Fragment} from 'react';
import {PropTypes} from 'prop-types';
import moment from 'moment';
import TripDetails from './TripDetails';
import TripGeomHelper from './TripGeomHelper';
import {COLOR_SPEC_RANGES, SHADE_OFFSETS} from '../../settings';
import './TripGeometry.scss';

class TripGeometry extends Component {
  constructor(props) {
    super(props);
    this.state = {
      bookingDetailsVisible: false,
      colorSpecs: this.shuffleColorSpecs(),
      bookingDetailsPos: 0,
      translateDetailsLeft: false
    };
  }

  checkShouldTranslateDetails = (mouseX) => {
    const screenWidth = window.innerWidth;
    if(screenWidth/2 < mouseX)
      return true;
    return false;
  }

  setBookingDetailsAbsolutePos = (e) => {
    const tripGeomLeft = e.target.getBoundingClientRect().left;
    const mouseX = e.clientX;
    const bookingDetailsPos = mouseX - tripGeomLeft;
    const translateDetailsLeft = this.checkShouldTranslateDetails(mouseX);
    this.setState(prevState => ({
      ...prevState,
      bookingDetailsPos,
      translateDetailsLeft
    }));
  }

  toggleBookingDetails = (type) => {
    this.setState(prevState => {
      switch (type) {
      case 'open':
        if(prevState.bookingDetailsVisible)
          return prevState;
        return {
          ...prevState,
          bookingDetailsVisible: true
        };
      default:
        if(!prevState.bookingDetailsVisible)
          return prevState;
        return {
          ...prevState,
          bookingDetailsVisible: false
        };
      }
    });
  }

  getInnerColorShade = (colorSpecs) => {
    let {hue, saturation, lightness} = colorSpecs;
    saturation+=SHADE_OFFSETS.saturation;
    lightness+=SHADE_OFFSETS.lightness;
    return {hue, saturation, lightness};
  }

  pickValueFromRange = (colorSpec) => {
    // add a random fraction of the magnitude to min value
    return Math.round(colorSpec.min + (
      Math.random() * (colorSpec.max - colorSpec.min)
    ));
  }

  shuffleColorSpecs = () => {
    const hue = this.pickValueFromRange(COLOR_SPEC_RANGES.hue);
    const saturation = this.pickValueFromRange(COLOR_SPEC_RANGES.saturation);
    const lightness = this.pickValueFromRange(COLOR_SPEC_RANGES.lightness);
    return {hue, saturation, lightness};
  }

  getBookingDetailsVariant = () => {
    const {bookingDetailsVisible} = this.state;
    return bookingDetailsVisible ? 'visible' : 'hidden';
  }

  renderTripBarInnerElements(tripStats, colorSpecs) {
    const {trip} = this.props;
    const {hue, saturation, lightness} = this.getInnerColorShade(colorSpecs);
    const travellerName = trip.request.name;
    const travellerGenderLabel = trip.request.gender.charAt(0);
    return (
      <Fragment>
        <div
          className="geom-trip geom-trip--inner"
          style={{
            width: tripStats.stayPercentage,
            background: `hsl(${hue},${saturation}%,${lightness}%)`
          }}
        />
        <span>{`${travellerName}  (${travellerGenderLabel})`}</span>
      </Fragment>
    );
  }

  renderTripBar = (tripStats) => {
    const {colorSpecs} = this.state;
    const {tripDayWidth} = this.props;
    const {hue, saturation, lightness} = colorSpecs;
    return (
      <div
        className="geom-trip geom-trip--outer"
        style={{
          minHeight: '20px',
          background: `hsl(${hue},${saturation}%,${lightness}%)`,
          width: `${tripDayWidth * tripStats.length}px`
        }}
      >
        {this.renderTripBarInnerElements(tripStats, colorSpecs)}
      </div>
    );
  }

  render() {
    const {bookingDetailsPos, translateDetailsLeft} = this.state;
    const {trip, handleChangeRoomModal} = this.props;
    const detailsVariant = this.getBookingDetailsVariant();
    const helper = new TripGeomHelper(this.props);
    const tripStats = helper.getTripStats(trip);
    return (
      <div
        className="timeline-trip-geometry"
        tabIndex="-1"
        role="presentation"
        onKeyUp={()=>{}}
        onClick={this.setBookingDetailsAbsolutePos}
        onFocus={() => this.toggleBookingDetails('open')}
        onBlur={() => this.toggleBookingDetails('close')}
        style={{
          left: `${tripStats.tripTimelineOffsetLeft}px`
        }}
      >
        {this.renderTripBar(tripStats)}
        <TripDetails
          trip={trip}
          bookingDetailsPos={bookingDetailsPos}
          translateDetailsLeft={translateDetailsLeft}
          detailsVariantClass={detailsVariant}
          toggleBookingDetails={this.toggleBookingDetails}
          handleChangeRoomModal={handleChangeRoomModal}
        />
      </div>
    );
  }
}

TripGeometry.propTypes = {
  trip: PropTypes.object.isRequired,
  tripDayWidth: PropTypes.number.isRequired,
  handleChangeRoomModal: PropTypes.func.isRequired
};

export default TripGeometry;
