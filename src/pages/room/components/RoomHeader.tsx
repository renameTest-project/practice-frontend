import { useRecoilState } from 'recoil';
import styled from 'styled-components';
import { RoomInfo } from '../../../recoil/RoomAtom';
import {bell, chat, music} from '../../../images/room';

type Props = {};


function RoomHeader({}: Props) {

  const [roomInfo, setRoomInfo] = useRecoilState(RoomInfo);
  console.log('헤더',roomInfo) 
  return (
    <HeaderBG>
      <RoomName>{roomInfo.title}</RoomName>
      <IconDiv>
        <img src={bell} alt="" />
        <img src={music} alt="" />
        <img src={chat} alt="" />
      </IconDiv>
    </HeaderBG>
  );
}

const HeaderBG = styled.div`
  background: var(--gray-09, #424242);
  height: 96px;
  display: flex;
  align-items: center;
`;

const IconDiv = styled.div`
  display: flex;
  width: 350px;
  height: 100%;
  align-items: center;
  gap: 24px;
  justify-content: space-around;
  img {
    width: 24px;
    height: 24px;
    border-radius: 50%;
    border: 2px solid var(--primary-01, rgba(0, 197, 255, 1));
    padding: 10px;
    overflow: inherit;
  }
`;

const RoomName = styled.p`
  font-size: 18px;
  text-align: left;
  margin-left: 70px;
  margin-right: auto;
  width: 400px;
  color: white;
  white-space: nowrap;
  overflow: hidden;
`;


export default RoomHeader;
