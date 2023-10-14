import { Link } from 'react-router-dom';
import Goal from './components/Goal';
import styled from 'styled-components';
import MainTop from './components/MainTop';
import DeskRecoder from './components/DeskRecoder';
import RoomCard from './components/RoomCard';
import thumbnail from '../../images/sample.png';
import NonUserIntro from './components/NonUserIntro';

const Home = () => {
  const rooms = [
    {
      id: 1,
      title: '방 타이틀1',
      category: 'study',
      nowHeadcount: 2,
      maxHeadcount: 4,
      roomThumnail: { thumbnail },
      createdAt: '2023-10-10',
      updatedAt: '2023-10-11',
    },
    {
      id: 2,
      title: '방 타이틀2',
      category: 'music',
      nowHeadcount: 1,
      maxHeadcount: 3,
      roomThumnail: { thumbnail },
      createdAt: '2023-10-09',
      updatedAt: '2023-10-10',
    },
    {
      id: 3,
      title: '방 타이틀3',
      category: 'movie',
      nowHeadcount: 4,
      maxHeadcount: 5,
      roomThumnail: { thumbnail },
      createdAt: '2023-10-08',
      updatedAt: '2023-10-09',
    },
    {
      id: 4,
      title: '방 타이틀4',
      category: 'game',
      nowHeadcount: 3,
      maxHeadcount: 4,
      roomThumnail: { thumbnail },
      createdAt: '2023-10-07',
      updatedAt: '2023-10-08',
    },
    {
      id: 5,
      title: '방 타이틀5',
      category: 'hobby',
      nowHeadcount: 2,
      maxHeadcount: 3,
      roomThumnail: { thumbnail },
      createdAt: '2023-10-06',
      updatedAt: '2023-10-07',
    },
    {
      id: 6,
      title: '방 타이틀6',
      category: 'reading',
      nowHeadcount: 1,
      maxHeadcount: 2,
      roomThumnail: { thumbnail },
      createdAt: '2023-10-05',
      updatedAt: '2023-10-06',
    },
    {
      id: 7,
      title: '방 타이틀7',
      category: 'exercise',
      nowHeadcount: 4,
      maxHeadcount: 5,
      roomThumnail: { thumbnail },
      createdAt: '2023-10-04',
      updatedAt: '2023-10-05',
    },
    {
      id: 8,
      title: '방 타이틀8',
      category: 'travel',
      nowHeadcount: 3,
      maxHeadcount: 4,
      roomThumnail: { thumbnail },
      createdAt: '2023-10-03',
      updatedAt: '2023-10-04',
    },
    {
      id: 9,
      title: '방 타이틀9',
      category: 'food',
      nowHeadcount: 2,
      maxHeadcount: 3,
      roomThumnail: { thumbnail },
      createdAt: '2023-10-02',
      updatedAt: '2023-10-03',
    },
    {
      id: 10,
      title: '방 타이틀10',
      category: 'discussion',
      nowHeadcount: 1,
      maxHeadcount: 2,
      roomThumnail: { thumbnail },
      createdAt: '2023-10-01',
      updatedAt: '2023-10-02',
    },
  ];

  const isLogged = true;

  return (
    <Container column justify="start" align="start">

      <삭제></삭제>
      <MainTop />

      <Info gap="33px">
        {isLogged ? (
          <>
            <Goal />
            <DeskRecoder />
          </>
        ) : (
          <NonUserIntro />
        )}
      </Info>
      <List column align="start">
        <ListTitle>내가 참여했던 방</ListTitle>
        <JoinedRooms>
          {rooms.map(room => {
            return <RoomCard key={room.id} room={room} />;
          })}
          {/* <RoomCard /> */}
        </JoinedRooms>
      </List>
    </Container>
  );
};

const FlexContainer = styled.div<{
  column?: boolean;
  align?: string;
  justify?: string;
  gap?: string;
}>`
  display: flex;
  flex-direction: ${props => (props.column ? 'column' : 'row')};
  align-items: ${props => (props.align ? props.align : 'center')};
  justify-content: ${props => (props.justify ? props.justify : 'center')};
  gap: ${props => props.gap || '0'};
`;

const 삭제 = styled.div`
  width: 112px;
  height: 100vh;
  background-color: gray;
  position: fixed;
  top: 0;
  left: 0;
`;

const 삭제2 = styled.div`
  width: 746.5px;
  margin-left: 63px;
`;

const List = styled(FlexContainer)`
  margin-left: 78px;
  margin-top: 72px;
`;

const ListTitle = styled.div`
  margin-bottom: 16px;
  font-size: 24px;
  font-style: normal;
  font-weight: 400;
  line-height: 123.5%; /* 29.64px */
  letter-spacing: 0.25px;
`;

const JoinedRooms = styled.div`
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 16px;
`;

const Container = styled(FlexContainer)`
  width: calc(100vw - 200px);
  margin-left: auto;
`;

const Info = styled(FlexContainer)`
  margin-left: 78px;
  margin-top: 31px;
`;
export default Home;