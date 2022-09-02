import React, { useEffect, useRef, useState } from 'react';
import { format } from 'date-fns';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faCalendar,
  faCheck,
  faChevronRight,
  faLocationDot,
  faPhone,
  faPhoneAlt,
} from '@fortawesome/free-solid-svg-icons';
import './style.scss';
import DisableContextBarCommand from '../../../../events/DisableContextBarCommand';
import ParticipantModel from '../../../../model/ParticipantModel';
import EventModel from '../../../../model/EventModel';
import { registerIn } from '../service';
import AddSpinnerCommand from '../../../../events/AddSpinnerCommand';
import { newId } from '../../../../events/MessageService';
import RemoveSpinnerCommand from '../../../../events/RemoveSpinnerCommand';
import { registerInReg } from '../Agenda/service';
import { formatDateTimeText } from '../../../../components/Lib/DateUtils';

interface Props {
  space: string;
  location: any;
  participant: ParticipantModel;
  event: EventModel;
  tracks: any[];
  handleValidation: any;
  checkinData: any[];
  isEventStarted: boolean;
  isRegistrationOpen: boolean;
  isRegistered: boolean;
  isCheckedIn: boolean;
  isCheckedOut: boolean;
}

const ValidateSection = (props: Props) => {
  const [showError, setshowError] = useState(false);

  useEffect(() => {
    DisableContextBarCommand.next(true);
  }, []);

  const getDateTimeString = (_date: Date) => {
    return format(_date, 'yyyy-MM-dd');
  };

  const [state, setState] = useState<any>({
    date: getDateTimeString(new Date()),
  });

  const handleChange = (track: any) => {
    setState({
      ...state,
      [track.currentTarget.name]: track.currentTarget.value,
    });
  };

  const register = () => {
    const spinnerTaskId = newId();
    AddSpinnerCommand.next(spinnerTaskId);
    registerInReg(
      props.space,
      props.event._id || '',
      props.participant._id || '',
      'NA'
    ).then((response) => {
      RemoveSpinnerCommand.next(spinnerTaskId);
    });
    props.handleValidation();
  };

  const checkIn = () => {
    const spinnerTaskId = newId();
    AddSpinnerCommand.next(spinnerTaskId);
    registerIn(
      props.space,
      props.event._id || '',
      props.participant._id || '',
      'NA',
      123
    ).then((response) => {
      RemoveSpinnerCommand.next(spinnerTaskId);
    });
    props.handleValidation();
  };

  const hideError = () => {
    setshowError(false);
  };

  return (
    <div className="validate-section">
      <div className="validate-section__register">
        <h2>{props.event.name}</h2>
        <h5>{props.event.description}</h5>
        <div className="event-duration">
          <div className="event-duration-content">
            <FontAwesomeIcon icon={faCalendar} />
            <p>{formatDateTimeText(props.event.eventFrom)}</p>
          </div>
          <div className="event-duration-content">
            <FontAwesomeIcon icon={faLocationDot} />
            <div>
              <div className="validate-section__venuetitle">
                {props.event.venueTitle}
              </div>
              <div className="validate-section__venuedesc">
                {props.event.venueDescription}
              </div>
            </div>
          </div>
        </div>
      </div>
      {!props.isEventStarted && !props.isRegistered && (
        <div className="validate-section__action">
          <button
            className="button validate-section__action__button"
            onClick={register}
            disabled={!props.isRegistrationOpen}
          >
            Register
          </button>
          {!props.isRegistrationOpen && (
            <div className="validate_section__deadline">
              Registration opens from &nbsp;
              {formatDateTimeText(props.event.registrationFrom)}
            </div>
          )}
          {props.isRegistrationOpen && (
            <div className="validate_section__deadline">
              Registration closes by &nbsp;
              {formatDateTimeText(props.event.registrationTo)}
            </div>
          )}
        </div>
      )}
      {props.isEventStarted && !props.isCheckedIn && (
        <div className="validate-section__action">
          <button
            className="button validate-section__action__button"
            onClick={checkIn}
          >
            Check in
          </button>
        </div>
      )}
    </div>
  );
};

export default ValidateSection;
