import moment from 'moment';
import React, { useEffect, useState } from 'react';
import EventModel from 'src/model/EventModel';
import ParticipantModel from 'src/model/ParticipantModel';
import './ParticipantTile.scss';

interface Props {
  participant: ParticipantModel;
}

const ParticipantTile = (props: Props) => {
  return (
    <div className="button participant-tile" key={props.participant._id}>
      <div className="participant-tile__name">
        {props.participant.firstName}
      </div>
      {props.participant.telephone && (
        <div className="participant-tile__description">
          {props.participant.telephone}
        </div>
      )}
      {props.participant.room && (
        <div className="participant-tile__time">
          Room: {props.participant.room}
        </div>
      )}
    </div>
  );
};

export default ParticipantTile;