import React, { useEffect, useCallback } from 'react';
import { useHistory } from 'react-router';

import { resizeMainWindow } from '../../utils/resizeMainWindow';
import Routes from '../../constants/routes.json';

import Button from '../../components/Button';

import css from './HomePage.scss';

export default function HomePage() {
  const history = useHistory();

  useEffect(() => {
    resizeMainWindow(500, 500);
  }, []);

  const handleJoinClick = useCallback(() => {
    history.push(Routes.JOIN_ROOM);
  }, [history]);

  const handleCreateClick = useCallback(() => {
    history.push(Routes.CREATE_ROOM);
  }, [history]);

  return (
    <div className={css.HomePage}>
      <div className={css.ButtonsContainer}>
        <Button width="100%" onClick={handleJoinClick}>
          Join Room
        </Button>
        <Button width="100%" onClick={handleCreateClick}>
          Create Room
        </Button>
      </div>
    </div>
  );
}
