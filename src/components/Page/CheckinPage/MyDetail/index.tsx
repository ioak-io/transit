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
import { fetchAndSetParticipantItems } from '../../../../actions/ParticipantActions';
import EventModel from '../../../../model/EventModel';
import moment from 'moment';
import { saveRoom } from './service';
import { formatDateTimeText } from '../../../../components/Lib/DateUtils';
// import mapImage from '../../../../assets/map.png';

const queryString = require('query-string');

interface Props {
  space: string;
  location: any;
  participant: ParticipantModel;
  event: EventModel;
  tracks: any[];
  handleChange: any;
}

const MyDetail = (props: Props) => {
  const history = useHistory();
  const dispatch = useDispatch();

  const [participantId, setParticipantId] = useState<string | null>(null);
  const [eventId, setEventId] = useState<string | null>(null);

  const params: { eventId: string; participantReferenceId: string } =
    useParams();

  const [showAllTracks, setShowAllTracks] = useState(false);

  const [state, setState] = useState<any>({});

  const goToCreateParticipantPage = () => {
    history.push(`/${props.space}/participant/new`);
  };

  const goToCompanyPage = (participantId: string) => {
    history.push(`/${props.space}/participant/${participantId}`);
  };

  const handleChange = (participant: any) => {
    setState({
      ...state,
      [participant.currentTarget.name]: participant.currentTarget.value,
    });
  };

  const save = (event: any) => {
    event.preventDefault();
    console.log(state);
    saveRoom(props.space, props.participant._id, state.room).then(
      (response: any) => {
        refreshData();
      }
    );
  };

  const toggleShowAllTracks = () => {
    setShowAllTracks(!showAllTracks);
  };

  useEffect(() => {
    DisableContextBarCommand.next(true);
  }, []);

  const refreshData = () => {
    props.handleChange();
  };

  return (
    <div className="my-detail">
      <div className="my-detail__item">
        <div className="my-detail__item__label">Name</div>
        <div>{`${props.participant.firstName} ${props.participant.lastName}`}</div>
      </div>
      <div className="my-detail__item">
        <div className="my-detail__item__label">e-mail</div>
        <div>{props.participant.email || '-'}</div>
      </div>
      <div className="my-detail__item">
        <div className="my-detail__item__label">Birth date</div>
        <div>
          {moment(props.participant.birthDate).format('DD-MM-YYYY') || '-'}
        </div>
      </div>
      {/* <div className="my-detail__item">
        <div className="my-detail__item__label">Joining date</div>
        <div>{moment(props.participant.joiningDate).format("DD-MM-YYYY") || '-'}</div>
      </div> */}
      {props.participant.room && (
        <div className="my-detail__item">
          <div className="my-detail__item__label">Room number</div>
          <div>{props.participant.room || '-'}</div>
        </div>
      )}
      <div className="my-detail__item">
        <div className="my-detail__item__label">Practice</div>
        <div>{props.participant.practice || '-'}</div>
      </div>
      <div className="my-detail__item">
        <div className="my-detail__item__label">Food preference</div>
        <div>{props.participant.food || '-'}</div>
      </div>
      <div className="my-detail__item">
        <div className="my-detail__item__label">Drink preference</div>
        <div>{props.participant.drink || '-'}</div>
      </div>
      <div className="my-detail__item">
        <div className="my-detail__item__label">Sports</div>
        <div>{props.participant.sports || '-'}</div>
      </div>
      <div className="my-detail__item">
        <div className="my-detail__item__label">Travel mode</div>
        <div>{props.participant.travelMode || '-'}</div>
      </div>
      {props.participant.flightNoIn && (
        <>
          <div className="my-detail__item">
            <div className="my-detail__item__label">Onward flight#</div>
            <div>{props.participant.flightNoIn || '-'}</div>
          </div>
          <div className="my-detail__item">
            <div className="my-detail__item__label">
              Onward flight departure
            </div>
            <div>
              {formatDateTimeText(
                props.participant.startBaseIn || new Date()
              ) || '-'}
            </div>
          </div>
          <div className="my-detail__item">
            <div className="my-detail__item__label">Onward flight arrival</div>
            <div>
              {formatDateTimeText(props.participant.landBaseIn || new Date()) ||
                '-'}
            </div>
          </div>
        </>
      )}
      {props.participant.flightNoOut && (
        <>
          <div className="my-detail__item">
            <div className="my-detail__item__label">Return flight#</div>
            <div>{props.participant.flightNoOut || '-'}</div>
          </div>
          <div className="my-detail__item">
            <div className="my-detail__item__label">
              Return flight departure
            </div>
            <div>
              {formatDateTimeText(
                props.participant.startBaseOut || new Date()
              ) || '-'}
            </div>
          </div>
          <div className="my-detail__item">
            <div className="my-detail__item__label">Return flight arrival</div>
            <div>
              {formatDateTimeText(
                props.participant.landBaseOut || new Date()
              ) || '-'}
            </div>
          </div>
        </>
      )}
      {!props.participant.room && (
        <div>
          <label>Add Room Number</label>
          <div className="edit_room">
            <input name="room" onInput={handleChange} value={state.room} />
            <button
              className="button primary-button"
              type="submit"
              onClick={save}
            >
              <FontAwesomeIcon icon={faCheck} />
            </button>
          </div>
        </div>
      )}
      {/* <img src={mapImage} alt="Location map" /> */}
    </div>
  );
};

export default MyDetail;