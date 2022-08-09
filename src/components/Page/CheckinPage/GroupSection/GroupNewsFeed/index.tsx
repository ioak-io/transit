import React, { useEffect, useState } from 'react';
import './style.scss';
import ParticipantModel from 'src/model/ParticipantModel';
import EventModel from 'src/model/EventModel';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPhone } from '@fortawesome/free-solid-svg-icons';
import Compose from '../../../../../components/Compose';
import MessageList from './MessageList';
import MessageModel from '../../../../../model/MessageModel';
import { getGroupFeedMessages, sendGroupFeedAsUser } from './service';

const queryString = require('query-string');

interface Props {
  space: string;
  location: any;
  participant: ParticipantModel;
  event: EventModel;
  tracks: any[];
  handleChange: any;
  participantMap: any;
  group: string;
}

const GroupNewsFeed = (props: Props) => {
  const handleChange = (description: string) => {
    sendGroupFeedAsUser(props.space, {
      important: false,
      description,
      sender: props.participant._id,
      eventId: props.event._id,
      admin: false,
      userId: '',
      group: props.group
    }).then(() => {
      refreshMessages();
    });
  };

  const [messages, setMessages] = useState<MessageModel[]>([]);

  useEffect(() => {
    if (props.event) {
      refreshMessages();
    }
  }, [props.event]);

  const refreshMessages = () => {
    getGroupFeedMessages(props.space, props.event._id || '', props.group).then(
      (response: MessageModel[]) => {
        setMessages(response || []);
      }
    );
  };

  return (
    <div className="news-feed">
      <MessageList
        messages={messages}
        participant={props.participant}
        participantMap={props.participantMap}
        isAdminMessagePresent
      />
      <Compose handleChange={handleChange} />
    </div>
  );
};

export default GroupNewsFeed;