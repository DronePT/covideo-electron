import React from 'react';
import PropTypes from 'prop-types';

import { Progress, Avatar } from 'antd';

import styles from './LobbyUser.scss';
import UserEntity from '../../../domain/User';

interface LobbyUserProps {
  user: UserEntity;
}

const LobbyUserAvatar: React.FC<LobbyUserProps> = ({ user }) => {
  const avatar = user
    .getName()
    .split(' ')
    .reduce((acc, name, i, arr) => {
      if (arr.length === 1) {
        return `${name[0]}${name[1]}`.toUpperCase();
      }

      if (i === 0 || i === arr.length - 1) {
        return `${acc}${name[0]}`.toUpperCase();
      }

      return acc;
    }, '');

  return <Avatar style={{ backgroundColor: '#87d068' }}>{avatar}</Avatar>;
};

LobbyUserAvatar.propTypes = {
  user: PropTypes.instanceOf(UserEntity).isRequired
};

const LobbyUser: React.FC<LobbyUserProps> = ({ user }) => {
  return (
    <div className={styles.LobbyUser}>
      <div className={styles['LobbyUser-name']}>
        <LobbyUserAvatar user={user} />
        <span>{user.getName()}</span>
      </div>
      <div className={styles['LobbyUser-progress']}>
        <Progress
          percent={user.getProgress()}
          status={user.getProgress() < 100 ? 'active' : 'normal'}
        />
      </div>
    </div>
  );
};

LobbyUser.propTypes = {
  user: PropTypes.instanceOf(UserEntity).isRequired
};

export default LobbyUser;
