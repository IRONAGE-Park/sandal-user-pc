import React from 'react';
import EventContainer from '../../containers/event/EventContainer';

const Event = ({ match, location }) => (
    <EventContainer match={match} location={location} />
);

export default Event;
