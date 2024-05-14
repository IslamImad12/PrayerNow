import React, { useEffect, useState } from 'react';
import Button from '@mui/material/Button';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Unstable_Grid2';
import Container from '@mui/material/Container';
import Divider from '@mui/material/Divider';
import Stack from '@mui/material/Stack';
import Prayer from '../Prayer/Prayer';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import axios from 'axios';
import moment from 'moment';
import 'moment/locale/ar';

// Import your images
import Image1 from '../../Images/fajr.png';
import Image2 from '../../Images/dhhr.png';
import Image3 from '../../Images/asr.png';
import Image4 from '../../Images/maghreb.png';
import Image5 from '../../Images/Ishaa.png';

export default function Home() {
  moment.locale('ar');

  const [timings, setTimings] = useState({
    Fajr: '04:20',
    Dhuhr: '11:50',
    Asr: '15:18',
    Sunset: '18:03',
    Isha: '19:33',
  });

  const cities = [
    { displayName: 'مكة المكرمة', apiName: 'Makkah al Mukarramah' },
    { displayName: 'القاهرة', apiName: 'Cairo' },
    { displayName: 'قطر', apiName: 'Qatar' }
  ];

  const [selectedCity, setSelectedCity] = useState(cities[0]); // Set default city

  const [today, setToday] = useState('');

  const [nextPrayerIndex, setNextPrayerIndex] = useState(2);

  const [remainingTime, setRemainingTime] = useState('');

  const prayersArray = [
    { key: 'Fajr', displayName: 'الفجر', image: Image1 },
    { key: 'Dhuhr', displayName: 'الظهر', image: Image2 },
    { key: 'Asr', displayName: 'العصر', image: Image3 },
    { key: 'Sunset', displayName: 'المغرب', image: Image4 },
    { key: 'Isha', displayName: 'العشاء', image: Image5 },
  ];

  const getTimings = async () => {
    try {
      const response = await axios.get(
        `https://api.aladhan.com/v1/timingsByCity/:date?country=SA&city=${selectedCity.apiName}`
      );
      setTimings(response.data.data.timings);
    } catch (error) {
      console.error('Error fetching timings:', error);
    }
  };

  useEffect(() => {
    getTimings();
  }, [selectedCity]);

  useEffect(() => {
    const t = moment();
    setToday(t.format('MMM Do YYYY | h:mm'));

    const interval = setInterval(() => {
      setupCountdownTimer();
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, [timings]);

  const setupCountdownTimer = () => {
    const momentNow = moment();

    let prayerIndex = 2;

    if (
      momentNow.isAfter(moment(timings['Fajr'], 'hh:mm')) &&
      momentNow.isBefore(moment(timings['Dhuhr'], 'hh:mm'))
    ) {
      prayerIndex = 1;
    } else if (
      momentNow.isAfter(moment(timings['Dhuhr'], 'hh:mm')) &&
      momentNow.isBefore(moment(timings['Asr'], 'hh:mm'))
    ) {
      prayerIndex = 2;
    } else if (
      momentNow.isAfter(moment(timings['Asr'], 'hh:mm')) &&
      momentNow.isBefore(moment(timings['Sunset'], 'hh:mm'))
    ) {
      prayerIndex = 3;
    } else if (
      momentNow.isAfter(moment(timings['Sunset'], 'hh:mm')) &&
      momentNow.isBefore(moment(timings['Isha'], 'hh:mm'))
    ) {
      prayerIndex = 4;
    } else {
      prayerIndex = 0;
    }

    setNextPrayerIndex(prayerIndex);

    const nextPrayerObject = prayersArray[prayerIndex];
    const nextPrayerTime = timings[nextPrayerObject.key];
    const nextPrayerTimeMoment = moment(nextPrayerTime, 'hh:mm');

    let remainingTime = moment(nextPrayerTime, 'hh:mm').diff(momentNow);

    if (remainingTime < 0) {
      const midnightDiff = moment('23:59:59', 'hh:mm:ss').diff(momentNow);
      const fajrToMidnightDiff = nextPrayerTimeMoment.diff(
        moment('00:00:00', 'hh:mm:ss')
      );

      const totalDifference = midnightDiff + fajrToMidnightDiff;

      remainingTime = totalDifference;
    }

    const durationRemainingTime = moment.duration(remainingTime);
    setRemainingTime(
      `${durationRemainingTime.hours()}:${durationRemainingTime.minutes()}:${durationRemainingTime.seconds()}`
    );
  };

  const handleCityChange = (event) => {
    const selectedCityValue = event.target.value;
    const selectedCityObject = cities.find(city => city.displayName === selectedCityValue);
    setSelectedCity(selectedCityObject);
  };

  return (
    <>
      <Container maxwidth="xl" className="my-5">
        <Box sx={{ flexGrow: 1 }}>
          <Grid container spacing={2}>
            <Grid xs={6} className="bg-danger">
              <div>
                <h2>{today}</h2>
                <h3>{selectedCity.displayName}</h3>
              </div>
            </Grid>
            <Grid xs={6} className="bg-success">
              <div>
                <h2>متبقي حتى صلاة {prayersArray[nextPrayerIndex].displayName}</h2>
                <h1>{remainingTime}</h1>
              </div>
            </Grid>
          </Grid>
        </Box>
      </Container>
      <Divider />
      <Container maxwidth="xl" className="my-5">
        <Stack direction="row" justifyContent={'space-around'} style={{ marginTop: '50px' }}>
          {prayersArray.map((prayer) => (
            <Prayer key={prayer.key} name={prayer.displayName} img={prayer.image} time={timings[prayer.key]} />
          ))}
        </Stack>
      </Container>

      <Stack direction="row" justifyContent={'center'} className="my-5">
        <FormControl style={{ width: '20%' }}>
          <InputLabel id="demo-simple-select-label">المدينة</InputLabel>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={selectedCity.displayName}
            onChange={handleCityChange}
          >
            {cities.map(city => (
              <MenuItem key={city.apiName} value={city.displayName}>{city.displayName}</MenuItem>
            ))}
          </Select>
        </FormControl>
      </Stack>
    </>
  );
}
