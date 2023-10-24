import styled from '@emotion/styled';
import axios from 'axios';
import React, { ChangeEvent, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useRecoilState } from 'recoil';
import { getCookie } from '../../../auth/cookie';
import { RoomAtom, RoomUUIDAtom } from '../../../recoil/RoomAtom';
import MediaSetup from './MediaSetup';
import BasicPrecautions from './BasicPrecautions';

type JoinRoomModal = {
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  room: {
    agoraAppId: string;
    agoraToken: string;
    category: string;
    count: number;
    createdAt: string;
    maxHeadcount: number;
    note: string;
    nowHeadcount: number;
    ownerId: number;
    uuid: string;
    roomThumbnail: string | null;
    title: string;
    updatedAt: string;
    roomId: number;
  };
};

const JoinRoomModal: React.FC<JoinRoomModal> = ({ setIsOpen, room }) => {
  const serverUrl = process.env.REACT_APP_SERVER_URL;
  const navigate = useNavigate();
  const [inputText, setInputText] = useState('');
  const [joinUUID, setJoinUUID] = useRecoilState<string>(RoomUUIDAtom);
  const [roomInfo, setRoomInfo] = useRecoilState(RoomAtom);
  console.log(room);
  const [test, setTest] = useState(true);

  const handleInputChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setInputText(e.target.value);
  };

  const onClickJoinRoom = async () => {
    try {
      const token = getCookie('token');
      console.log('조인룸 토큰', token);
      const response = await axios.post(
        `${serverUrl}/room/${room.uuid}/join`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      console.log(response);
      setRoomInfo({
        agoraAppId: room.agoraAppId,
        agoraToken: room.agoraToken,
        category: room.category,
        count: room.count,
        createdAt: room.createdAt,
        maxHeadcount: room.maxHeadcount,
        note: room.note,
        nowHeadcount: room.nowHeadcount,
        ownerId: room.ownerId,
        roomId: room.roomId,
        roomThumbnail: room.roomThumbnail ? room.roomThumbnail : '',
        title: room.title,
        updatedAt: room.updatedAt,
        uuid: room.uuid,
      });
      setJoinUUID(room.uuid);
      navigate(`/room/${room.uuid}`);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Container>
      <BackGround />
      <ModalContent>
        <Title>{room.title}</Title>

        <MediaSetupGroup>
          <MediaSetup></MediaSetup>
        </MediaSetupGroup>

        <Content>
          <Group>
            <Label>방 입장 시 유의 사항</Label>
            <BasicPrecautions />
            <Note>{room.note}</Note>
          </Group>
        </Content>

        <Button>
          <EnterRoomButton onClick={onClickJoinRoom}>들어가기</EnterRoomButton>
          <CancleButton to="/" onClick={() => setIsOpen(false)}>
            취소
          </CancleButton>
        </Button>
      </ModalContent>
    </Container>
  );
};

const Note = styled.div`
  font-size: 12px;
  color: var(--gray-07);
  margin-right: auto;
`;

const MediaSetupGroup = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;

  width: 400px;
`;

const Content = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 15px;
  display: flex;
  width: 400px;
  margin-top: 14px;
`;

const Label = styled.div`
  padding: 10px 0;
`;

const Group = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: start;

  width: 100%;
`;

const Title = styled.div`
  font-size: 24px;
  font-weight: 500;
  margin-bottom: 25px;
`;

const Button = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;

  width: 400px;
  margin-top: auto;
`;

const EnterRoomButton = styled.button`
  width: 195px;
  height: 50px;
  border: none;
  background-color: var(--primary-01);
  color: white;
  font-size: 16px;
  font-weight: 600;
`;

const CancleButton = styled(Link)`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 195px;
  height: 50px;
  border: 1px solid var(--primary-01);
  color: var(--primary-01);
  background-color: rgba(110, 110, 110, 0);
  font-size: 16px;
  font-weight: 600;
`;

const BackGround = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.4);
  backdrop-filter: blur(
    5px
  ); // 블러 정도 설정. 숫자를 조절해서 블러 정도를 변경할 수 있어.
  display: flex;
  justify-content: center;
  align-items: center;
`;

const ModalContent = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: start;
  align-items: center;

  width: 600px;
  height: 800px;
  /* background-color: rgba(255, 255, 255, 0.8); */
  background-color: white;
  border-radius: 20px;
  z-index: 50;
  position: absolute;
  padding: 60px 0;
`;

const Container = styled.div`
  display: flex;
  flex-direction: col;
  align-items: center;
  justify-content: center;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 5000;
  cursor: auto;
`;

export default JoinRoomModal;