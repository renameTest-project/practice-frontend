import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import logo from '../../../images/logo.svg';
import 마이크 from '../../../images/room/mic_none.svg';
import 사람 from '../../../images/room/people_outline.svg';
import 카메라 from '../../../images/room/videocam.svg';
import Timer from './Timer';
import profile from '../../../images/profile.png';
import { fetchUser } from '../../../axios/api';
import { useQuery } from 'react-query';
import { useRecoilState } from 'recoil';
import { RoomUserList } from '../../../recoil/RoomAtom';
import socket from '../socketInstance';

type RoomSideBarProps = {};

type UserListPayload = {
  nickname: string;
  userListArr: { nickname: string, img: string }[];
};

const RoomSideBar: React.FC<RoomSideBarProps> = () => {
  // const [timerState, setTimerState] = useState<boolean>(false);

  // const timerButtonHandler = () => {
  //   setTimerState(!timerState);
  // };

  const navigate = useNavigate();

  const [roomUserList, setRoomUserList] = useRecoilState(RoomUserList);
  console.log('사이드바', roomUserList);

  const { data } = useQuery<user>('user', fetchUser);

  // 나가고 들어온 유저 닉네임 받아오기
  useEffect(() => {
    socket.on('user-list', (payload: UserListPayload) => {
      const { nickname, userListArr } = payload;
      setRoomUserList(userListArr);
      console.log('리코일', roomUserList);
    });

    return () => {
      socket.off('user-list');
      socket.off('left-user');
    };
  }, [socket]);

  return (
    <Body>
      <LogoImg
        src={logo}
        alt="로고이미지"
        onClick={() => {
          alert('방에 나갈 때는 방 나가기 버튼을 이용해주세요.');
        }}
      />
      <UserInfoBox>
        <img
          src={data?.profileImage ? data.profileImage : profile}
          alt="profile image"
        ></img>
        <p>{data?.nickname}</p>
      </UserInfoBox>
      <TimerBox>
        <Timer />
      </TimerBox>
      <CamAndMicSettingsBox>
        <img src={마이크} alt="마이크" />
        <img src={카메라} alt="카메라" />
      </CamAndMicSettingsBox>
      <JoinPeopleBox>
        <UserCount>
          <p>참여인원</p>
          <DetailCount>
            <img src={사람} alt="인원수" />
            <p>{roomUserList.length}</p>
          </DetailCount>
        </UserCount>
        {roomUserList.map((user, index) => 
          <UserList key={index}>
            <img src={user.img} alt="사용자프로필이미지" />
            <p>{user.nickname}</p>
          </UserList>
        )}
      </JoinPeopleBox>
    </Body>
  );
};

const Body = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  background: var(--gray-09);
  width: 200px;
  height: calc(100vh - 60);
  margin-left: 10px;
`;

const LogoImg = styled.img`
  margin: 16px;
  width: 60px;
  height: 73px;
  flex-shrink: 0;
  cursor: pointer;
`;
const UserInfoBox = styled.div`
  width: 152px;
  height: 164px;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 24px;
  margin-left: auto;
  margin-right: auto;
  p {
    margin: 16px;
    color: white;
    text-align: center;
  }
  img {
    margin-top: 24px;
    width: 100px;
    height: 100px;
    border-radius: 50%;
  }
`;

const TimerBox = styled.div`
  margin-top: 16px;
  width: 200px;
  height: 70px;
  /* padding: 24px; */
  margin: 24px 0px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 8px;
  p {
    color: var(--bw-whtie);
    font-size: 24px;
  }
`;

const StartButton = styled.button<{ timerState: boolean }>`
  width: 180px;
  height: 48px;
  border: none;
  display: flex;
  padding: 10px 5px;
  justify-content: center;
  align-items: center;
  gap: 10px;
  background: ${props => (props.timerState ? 'none' : 'var(--primary-01)')};
  p {
    color: var(--gray-01);
    font-size: 16px;
  }
`;

const CamAndMicSettingsBox = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 20px;
  margin-left: 10px;
  img {
    border-radius: 50%;
    border: 1px solid var(--primary-01);
    padding: 10px;
    width: 24px;
    height: 24px;
  }
`;

const JoinPeopleBox = styled.div`
  margin-top: 130px;
  width: 152px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 8px;
  color: white;
`;

const UserCount = styled.div`
  display: flex;
  width: 100%;
  justify-content: space-between;
  p {
    color: white;
    font-size: 12px;
  }
`;

const DetailCount = styled.div`
  display: flex;
  align-items: center;
  img {
    width: 24px;
    height: 24px;
  }
  p {
    font-size: 12px;
    color: white;
  }
`;

const UserList = styled.div`
  display: flex;
  width: 100%;
  gap: 8px;
  align-items: center;
  img {
    width: 24px;
    height: 24px;
    border-radius: 50%;
  }
  p {
    color: white;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
`;

export default RoomSideBar;
