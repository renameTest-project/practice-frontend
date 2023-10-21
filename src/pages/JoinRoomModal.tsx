import styled from '@emotion/styled';
import axios from 'axios';
import React, { ChangeEvent, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useRecoilState } from 'recoil';
import { getCookie } from '../auth/cookie';
import { RoomUUIDAtom } from '../recoil/RoomAtom';
import MediaSetup from './MediaSetup';

type JoinRoomModal = {
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  room: {
    uuid: string;
    title: string;
    category: string;
    agoraAppId: string;
    agoraToken: string;
    ownerId: number;

  };
};

const JoinRoomModal: React.FC<JoinRoomModal> = ({ setIsOpen, room }) => {
  const serverUrl = process.env.REACT_APP_SERVER_URL;
  const navigate = useNavigate();
  console.log(room.uuid);
  const [inputText, setInputText] = useState('');
  const [joinUUID, setJoinUUID] = useRecoilState<string>(RoomUUIDAtom);
  console.log(joinUUID)
  const [test, setTest] = useState(true);

  const handleInputChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setInputText(e.target.value);
  };

  const onClickJoinRoom = async () => {
    try {
      const token = getCookie('token');
      const response = await axios.post(`${serverUrl}/room/${room.uuid}/join`,{},{
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log(response);
      setJoinUUID(room.uuid);
      navigate(`room/${room.uuid}`);
    } catch(error) {
      console.error(error);
    }
    
  }

  return (
    <Container>
      <BackGround />
      <ModalContent col justify="start">
        <Title>{room.title}</Title>

        <MediaSetupGroup>
          <MediaSetup></MediaSetup>
        </MediaSetupGroup>

        <Content col gap="15px">
          <Group col align="start">
            <Label>{room.ownerId}</Label>
          </Group>
        </Content>

        <Button col gap="8px">
          <EnterRoomButton onClick={onClickJoinRoom}>들어가기</EnterRoomButton>
          <CancleButton to="/" onClick={() => setIsOpen(false)}>
            취소
          </CancleButton>
        </Button>
      </ModalContent>
    </Container>
  );
};

const FlexContainer = styled.div<{
  col?: boolean;
  align?: string;
  justify?: string;
  gap?: string;
}>`
  display: flex;
  flex-direction: ${props => (props.col ? 'column' : 'row')};
  align-items: ${props => (props.align ? props.align : 'center')};
  justify-content: ${props => (props.justify ? props.justify : 'center')};
  gap: ${props => props.gap || '0'};
`;

const MediaSetupGroup = styled(FlexContainer)``;

const Content = styled(FlexContainer)`
  display: flex;
  width: 582px;
  margin-top: 14px;
`;

const Label = styled.div`
  padding: 10px 0;
`;

const RoomTitle = styled.input`
  width: calc(100% - 30px);
  height: 18px;
  padding: 15px;

  border-radius: 5px;
  border: 1px solid var(--gray-07, #757575);
  background: #fff;
`;

const Group = styled(FlexContainer)`
  width: 100%;
`;

const Title = styled.div`
  font-size: 36px;
  font-style: normal;
  font-weight: 400;
  line-height: 123.5%; /* 44.46px */
  letter-spacing: 0.25px;

  margin-top: 36px;
  margin-bottom: 22px;
  height: 44px;
`;

const Button = styled(FlexContainer)`
  margin-bottom: 16px;
  margin-top: auto;
`;

const EnterRoomButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 510px;
  height: 50px;
  border: none;
  background-color: rgb(110, 110, 110);
  cursor: pointer;
  color: white;
  font-size: 24px;
`;

const CancleButton = styled(Link)`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 510px;
  height: 50px;
  border: none;
  background-color: rgba(110, 110, 110, 0);
  cursor: pointer;
  font-size: 24px;
`;

const BackGround = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.4);
  backdrop-filter: blur(
    5px
  ); // 블러 정도 설정. 숫자를 조절해서 블러 정도를 변경할 수 있어.
  display: flex;
  justify-content: center;
  align-items: center;
`;

const ModalContent = styled(FlexContainer)`
  width: 810px;
  height: 948px;
  background-color: rgba(255, 255, 255, 0.8);
  border-radius: 20px;
  z-index: 50;
  position: absolute;
`;

const Container = styled(FlexContainer)`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 50;
  cursor: auto;
`;

export default JoinRoomModal;