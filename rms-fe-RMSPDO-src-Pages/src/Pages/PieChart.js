import React, { useState, useEffect } from 'react';
import Chart from 'react-apexcharts';
import { postReq } from '../Api/api';

const PieChart = () => {
  const url = process.env.REACT_APP_URL;
  const [options, setOptions] = useState({
    chart: {
      type: 'donut',
    },
    labels: ['0-3 years', '3-5 years', '5-7 years', '7-10 years', '10+ years'],
  });
  const [series, setSeries] = useState([0, 0, 0, 0, 0]);

  const fetchYears = async () => {
    const API = {
      techGroups: [],
      roles: [],
      skills: [],
      yearsOfExp: [],
      locations: [],
      domains: [],
      availability: [],
      availForeCastWeeks: null
    };

    try {
      const response = await postReq(`${url}ResAlloc/filter`, API);
      if (response && response.data) {
        processYearsData(response.data);
        // console.log(response.data);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const processYearsData = (data) => {
    const newSeries = [0, 0, 0, 0, 0];

    data.forEach(employee => {
      const years = employee.resource.yearsOfExp;
      // console.log(years);
      if (years >= 0 && years < 3) {
        newSeries[0]++;
      } else if (years >= 3 && years < 5) {
        newSeries[1]++;
      } else if (years >= 5 && years < 7) {
        newSeries[2]++;
      } else if (years >= 7 && years < 10) {
        newSeries[3]++;
      } else if (years >= 10) {
        newSeries[4]++;
      }
    });

    setSeries(newSeries);
  };

  useEffect(() => {
    fetchYears();
  }, []);

  return (
    
    <div className="donut">
      <Chart options={options} series={series} type="donut" width="400" />
    </div>
  );
};

export default PieChart;




