import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useHistory, useParams } from 'react-router';
import { addDays, format } from 'date-fns';
import { faCheck, faPlus, faTimes } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import './style.scss';
import ReceiptModel from '../../../../model/ReceiptModel';
import ParticipantModel from '../../../../model/ParticipantModel';
import Topbar from '../../../../components/Topbar';
import DisableContextBarCommand from '../../../../events/DisableContextBarCommand';
import Footer from '../../../../components/Footer';
import {
  getAvailableTracks,
  getEventById,
  getParticipantById,
  getParticipantByReferenceId,
} from './service';
import { fetchAndSetParticipantItems } from '../../../../actions/ParticipantActions';
import EventModel from '../../../../model/EventModel';
import AgendaTile from './AgendaTile';
import AgendaTileGroup from './AgendaTileGroup';

const queryString = require('query-string');

interface Props {
  space: string;
  location: any;
  participant: ParticipantModel;
  event: EventModel;
  tracks: any[];
  handleChange: any;
}

const Agenda = (props: Props) => {
  const history = useHistory();
  const dispatch = useDispatch();

  const [participantId, setParticipantId] = useState<string | null>(null);
  const [eventId, setEventId] = useState<string | null>(null);
  const [tracksAsMap, setTracksAsMap] = useState<any>({});

  const params: { eventId: string; participantReferenceId: string } =
    useParams();

  const [state, setState] = useState<any>({});

  useEffect(() => {
    const _tracksAsMap: any = {};
    props.tracks?.forEach((item: any) => {
      const _from = format(new Date(item.from), 'yyyy-MM-dd');
      if (_tracksAsMap[_from]) {
        _tracksAsMap[_from].push(item);
      } else {
        _tracksAsMap[_from] = [item];
      }
    });
    setTracksAsMap(_tracksAsMap);
  }, [props.tracks]);

  useEffect(() => {
    DisableContextBarCommand.next(true);
  }, []);

  const refreshData = () => {
    props.handleChange();
  };

  return (
    <div className="event-list-page__main">
      {props.event &&
        props.participant &&
        Object.keys(tracksAsMap).map((day) => (
          <AgendaTileGroup
            space={props.space}
            trackList={tracksAsMap[day]}
            day={day}
            key={day}
            participant={props.participant}
          />
        ))}
    </div>
  );
};

export default Agenda;
