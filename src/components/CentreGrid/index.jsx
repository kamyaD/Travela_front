import React, {Fragment, PureComponent } from 'react';
import { PropTypes } from 'prop-types';
import countryUtils from '../../helper/countryUtils';
import withLoading from '../Hoc/withLoading';
import CentreCard from './CentreCard';
import './CentreGrid.scss';

export class CentreGrid extends PureComponent {
  getBedCount(rooms) {
    const bedCount = rooms.reduce((room, value) => room + value.bedCount, 0);
    return bedCount;
  }

  renderNoGuestHouse(guestHouses) {
    if(guestHouses && guestHouses.length === 0) {
      return (
        <div className="table__requests--empty">
          No accommodation centres at the moment
        </div>
      );
    }
  }

  renderError(error) {
    return (
      <div className="table__requests--error">
        {error}
      </div>
    );
  }

  renderGuesthouses(guestHouses) {
    if (guestHouses && guestHouses.length > 0) {
      return (
        <div className="mdl-grid accommodation-grid">
          { guestHouses.map(guestHouse => (
            <CentreCard
              key={guestHouse.id}
              guesthouseId={guestHouse.id}
              cardImage={guestHouse.imageUrl}
              imageAlt={`${guestHouse.houseName} image`}
              countryFlagImage={countryUtils.getCountryFlagUrl(guestHouse.location)}
              guestHouseName={guestHouse.houseName}
              guestHouseLocation={guestHouse.location}
              beds={this.getBedCount(guestHouse.rooms)}
              bathrooms={guestHouse.bathRooms}
            />))
          }
        </div>
      );
    }
  }

  render() {
    const { guestHouses, error } = this.props;
    return(
      <Fragment>
        { this.renderNoGuestHouse(guestHouses) }
        { this.renderGuesthouses(guestHouses) }
        { error && this.renderError(error) }
      </Fragment>
    );
  }
}

CentreGrid.propTypes = {
  guestHouses:  PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.string.isRequired,
    imageUrl: PropTypes.string.isRequired,
    houseName: PropTypes.string.isRequired,
    location: PropTypes.string.isRequired,
    rooms: PropTypes.array.isRequired,
    bathRooms: PropTypes.number.isRequired
  })),
  error: PropTypes.string
};

CentreGrid.defaultProps = {
  guestHouses: [],
  error: '',
};

export default withLoading(CentreGrid);
