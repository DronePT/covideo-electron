import React from 'react';
import { useSelector } from 'react-redux';
import uniqid from 'uniqid';

import { Divider } from 'antd';
import styles from './Lobby.scss';

import { AppRootState, RoomState } from '../../redux/reducers/types';
import LobbyUser from './components/LobbyUser';

const Lobby = () => {
  const roomState = useSelector<AppRootState, RoomState>(({ room }) => room);

  return (
    <>
      <Divider orientation="center" type="horizontal">
        Lobby
      </Divider>
      <div className={styles.Lobby}>
        {roomState.users.map(user => (
          <LobbyUser user={user} key={uniqid()} />
        ))}
      </div>
    </>
  );
};

export default Lobby;
