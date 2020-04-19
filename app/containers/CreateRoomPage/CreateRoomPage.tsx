import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { Button, Input, Row, Col, Divider, Progress } from 'antd';
import { useDispatch } from 'react-redux';

import { resizeMainWindow } from '../../utils/resizeMainWindow';

// import createRoom from '../../events/createRoom';
import {
  // IPCEvents,
  TorrentDownloadData
} from '../../ipcMain';

import css from './CreateRoomPage.scss';

// Components
import Lobby from '../Lobby';

// Redyx
import * as roomActions from '../../redux/actions/room.actions';

const useActions = () => {
  const dispatch = useDispatch();

  const stop = () => {
    dispatch(roomActions.stopTorrent());
  };

  const downloadTorrent = (magnetUrl: string) => {
    dispatch(roomActions.downloadTorrent(magnetUrl));
  };

  const createRoom = (magnetUrl: string) => {
    dispatch(roomActions.createRoom('', magnetUrl));

    return {
      downloadTorrent
    };
  };

  return {
    createRoom,
    downloadTorrent,
    stop
  };
};

const CreateRoomPage = () => {
  const [magnetUrl, setMagnetUrl] = useState(
    'magnet:?xt=urn:btih:08ada5a7a6183aae1e09d831df6748d566095a10&dn=Sintel&tr=udp%3A%2F%2Fexplodie.org%3A6969&tr=udp%3A%2F%2Ftracker.coppersurfer.tk%3A6969&tr=udp%3A%2F%2Ftracker.empire-js.us%3A1337&tr=udp%3A%2F%2Ftracker.leechers-paradise.org%3A6969&tr=udp%3A%2F%2Ftracker.opentrackr.org%3A1337&tr=wss%3A%2F%2Ftracker.btorrent.xyz&tr=wss%3A%2F%2Ftracker.fastcast.nz&tr=wss%3A%2F%2Ftracker.openwebtorrent.com&ws=https%3A%2F%2Fwebtorrent.io%2Ftorrents%2F&xs=https%3A%2F%2Fwebtorrent.io%2Ftorrents%2Fsintel.torrent'
  );

  const [torrentData, setTorrentData] = useState<TorrentDownloadData | null>(
    null
  );

  const actions = useActions();

  useEffect(() => {
    resizeMainWindow(1280, 720);
  }, []);

  const isMagnetAvailable = useMemo(() => {
    return magnetUrl && magnetUrl.length && /^magnet:.*/gi.test(magnetUrl);
  }, [magnetUrl]);

  const downloadStatus = useMemo(() => {
    return torrentData && torrentData.progress < 1 ? 'active' : 'success';
  }, [torrentData]);

  const handleCreateClick = useCallback(() => {
    actions.createRoom(magnetUrl).downloadTorrent(magnetUrl);
  }, [magnetUrl]);

  const handleStopClick = useCallback(() => {
    actions.stop();
  }, []);

  return (
    <div className={css.CreateRoomPage}>
      <Divider />
      <Row>
        <Col flex="1">
          <Input
            size="large"
            placeholder="Magnet URL"
            value={magnetUrl}
            onChange={e => setMagnetUrl(e.target.value)}
          />
        </Col>
        <Col flex="0 1 150px">
          <Button
            type="primary"
            size="large"
            block
            disabled={!isMagnetAvailable}
            onClick={handleCreateClick}
          >
            Create Room
          </Button>
          <Button
            type="primary"
            size="large"
            block
            disabled={!isMagnetAvailable}
            onClick={handleStopClick}
          >
            stop
          </Button>
        </Col>
      </Row>

      <Lobby />

      <pre>{JSON.stringify(torrentData, null, 2)}</pre>
      {torrentData && (
        <Progress
          percent={Math.round(torrentData.progress * 100)}
          status={downloadStatus}
        />
      )}
    </div>
  );
};

export default CreateRoomPage;
