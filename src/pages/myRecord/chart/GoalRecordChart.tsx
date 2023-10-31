import axios from 'axios';
import {
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  Title,
  Tooltip,
} from 'chart.js';
import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import styled from 'styled-components';
import { getCookie } from '../../../auth/cookie';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
);

type GoalRecordChartProps = {
  view7: boolean;
  view30: boolean;
};

const GoalRecordChart: React.FC<GoalRecordChartProps> = ({ view7, view30 }) => {
  const generateDateArray = (startDate: any, endDate: any) => {
    const dateArray = [];
    for (
      let date = new Date(startDate);
      date <= endDate;
      date.setDate(date.getDate() + 1)
    ) {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      const formattedDate = `${year}-${month}-${day}`;
      const dayOfWeek = date.toLocaleDateString('ko-KR', { weekday: 'short' });
      dateArray.push({ date: formattedDate, dayOfWeek: dayOfWeek });
    }
    return dateArray;
  };

  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth();
  const day = today.getDate();

  const sevenDaysAgo = new Date(year, month, day - 6);
  const dateArray7 = generateDateArray(sevenDaysAgo, today);
  const thirtyDaysAgo = new Date(year, month, day - 29);
  const dateArray30 = generateDateArray(thirtyDaysAgo, today);

  const serverUrl = process.env.REACT_APP_SERVER_URL;
  const token = getCookie('token');
  const [weeklyHobby, setWeeklyHobby] = useState<any[]>([]);
  const [weeklyStudy, setWeeklyStudy] = useState<any[]>([]);
  const [monthlyHobby, setMonthlyHobby] = useState<any[]>([]);
  const [monthlyStudy, setMonthlyStudy] = useState<any[]>([]);
  const sevenData = async () => {
    try {
      const response = await axios.get(`${serverUrl}/learning-history/weekly`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = response.data;
      setWeeklyStudy(
        data.weeklyStudy.map((x: any) => {
          const date = new Date(x.checkIn);
          const dayOfWeek = date.getDay();
          const days = ['일', '월', '화', '수', '목', '금', '토'];
          const dayName = days[dayOfWeek];
          return { ...x, dayName: dayName };
        }),
      );
      setWeeklyHobby(
        data.weeklyHobby.map((x: any) => {
          const date = new Date(x.checkIn);
          const dayOfWeek = date.getDay();
          const days = ['일', '월', '화', '수', '목', '금', '토'];
          const dayName = days[dayOfWeek];
          return { ...x, dayName: dayName };
        }),
      );
    } catch (error) {
      console.error(error);
    }
  };

  const monthData = async () => {
    try {
      const response = await axios.get(
        `${serverUrl}/learning-history/monthly`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      const data = response.data;
      setMonthlyHobby(data.monthlyHobby);
      setMonthlyStudy(data.monthlyStudy);
    } catch (error) {
      console.error(error);
    }
  };
  useEffect(() => {
    sevenData();
    monthData();
  }, []);

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: false,
        text: '목표 달성 기록 모음',
      },
    },
  };

  const weeklyData = {
    labels: dateArray7.map(x => x.dayOfWeek),
    datasets: [
      {
        label: '취미',
        data: dateArray7.map((day, i) => {
          const correspondingHobby = weeklyHobby.find(
            x => x.dayName == day.dayOfWeek,
          );

          return correspondingHobby ? Number(correspondingHobby.totalHours) : 0;
        }),
        stack: 'stack1',
        backgroundColor: ['#00C5FF'],
      },
      {
        label: '스터디',
        data: dateArray7.map(day => {
          const correspondingStudy = weeklyStudy.find(
            x => x.dayName === day.dayOfWeek,
          );
          return correspondingStudy ? correspondingStudy.totalHours : 0;
        }),
        stack: 'stack1',
        backgroundColor: ['#1A81E8'],
      },
    ],
  };
  const monthlyData = {
    
    labels: dateArray30.map(x => x.date.slice(5)),
    datasets: [
      {
        label: '취미',
        data: dateArray30.map((day, i) => {
          
          const correspondingHobby = monthlyHobby.find(
            x => x.checkIn === day.date,
          );
          return correspondingHobby ? Number(correspondingHobby.totalHours) : 0;
        }),
        stack: 'stack1',
        backgroundColor: ['#00C5FF'],
      },
      {
        label: '스터디',
        data: dateArray30.map(day => {
          const correspondingStudy = monthlyStudy.find(
            x => x.checkIn === day.date,
          );
          return correspondingStudy ? Number(correspondingStudy.totalHours) : 0;
        }),
        stack: 'stack1',
        backgroundColor: ['#1A81E8'],
      },
    ],
  };

  return (
    <Body>
      {view7 && (
        <Bar options={options} data={weeklyData} width={730} height={240} />
      )}
      {view30 && (
        <Bar options={options} data={monthlyData} width={730} height={240} />
      )}
    </Body>
  );
};

const Body = styled.div``;

export default GoalRecordChart;
