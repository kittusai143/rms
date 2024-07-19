import React, { useState,useEffect } from "react";
import Chart from "react-apexcharts";
import { getReq } from "../Api/api";

const BarGraph = () => {
  const url = process.env.REACT_APP_URL;
  const [data, setData] = useState({});
  const [options, setOptions] = useState({
    chart: {
      id: "basic-bar"
    },
    xaxis: {
      categories: []
    }
  });
  const [series, setSeries] = useState([
    {
      name: "count",
      data: []
    }
  ]);
  const fetchBenchRunRate = async () => {
    const response = await getReq(`${url}ResAlloc/bench-resources-count`);
    console.log(response?.data)
    const categories = Object.keys(response?.data);
    const data = Object.values(response?.data);
    console.log()
    
    setOptions(prevOptions => ({
      ...prevOptions,
      xaxis: {
        categories: categories
      }
    }));

    setSeries([
      {
        name: "count",
        data: data
      }
    ]);
  };

  useEffect(()=>{
    fetchBenchRunRate();
  },[])

  return (
    <div className="app">
      <div className="row">
        <div className="mixed-chart">
          <Chart
            options={options}
            series={series}
            type="bar"
            width="500"
          />
        </div>
      </div>
    </div>
  );
};

export default BarGraph;
