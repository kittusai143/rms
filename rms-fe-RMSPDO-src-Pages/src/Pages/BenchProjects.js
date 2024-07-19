// import React, { useState, useEffect } from 'react';
// import Chart from 'react-apexcharts';
// import { postReq } from '../Api/api';
// import "../CSS/Dashboard.css";

// const BenchProjects = () => {
//   const url = process.env.REACT_APP_URL;
//   const [options, setOptions] = useState({ pie: {
//     size: 500
//   },
//     chart: {
//       type: 'donut',
//     },
//     labels: [],
//   });
//   const [series, setSeries] = useState([]);

//   const fetchProjects = async () => {
//     const API = {
//       techGroups: [],
//       roles: [],
//       skills: [],
//       yearsOfExp: [],
//       locations: [],
//       domains: [],
//       availability: [],
//       availForeCastWeeks: null
//     };

//     try {
//       const response = await postReq(`${url}ResAlloc/filter`, API);
//       if (response && response.data) {
//         processProjectData(response.data);
//         console.log(response.data);
//       }
//     } catch (error) {
//       console.error('Error fetching data:', error);
//     }

//   };

//   const processProjectData = (data) => {
//     const projectCounts = {};

//     data.forEach(employee => {
//       const projectName = employee.resource.projectName;
//       if (employee.resource.projectType === 'INTERNAL') {
//         if (!projectCounts[projectName]) {
//           projectCounts[projectName] = 0;
//         }
//         projectCounts[projectName]++;
//       }
//     });
// console.log(Object.keys(projectCounts),Object.values(projectCounts))
// let a=Object.keys(projectCounts)
//     const labels =Object.keys(projectCounts);
//     const series = Object.values(projectCounts);

//     setOptions(prevOptions => ({
//       ...prevOptions,
//       labels,
//     }));
//     setSeries(series);
//   };

//   useEffect(() => {
//     fetchProjects();
//   }, []);

//   return (
//     <div className="donut" >     
//       <Chart options={options} series={series} type="donut" width={"580"}/>
//     </div>
//   );
// };

// export default BenchProjects;


import React, { useState, useEffect } from 'react';
import Chart from 'react-apexcharts';
import { postReq,getReq } from '../Api/api';
import "../CSS/Dashboard.css";

const BenchProjects = () => {
  
  const url = process.env.REACT_APP_URL;
  const [options, setOptions] = useState({ pie: {
    size: 500
  },
    chart: {
      type: 'donut',
    },
    labels: [],
  });
  const [series, setSeries] = useState([]);
  const [empdata, setEmpData] = useState([]);
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
        setEmpData(response.data);
        processProjectData(response.data);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  // const fetchProjects = async () => {
   

  //   try {
  //     const response = await getReq(`${url}techgroup/getAll`,);
  //     if (response && response.data) {
       
  //       console.log(response.data);
  //     }
  //   } catch (error) {
  //     console.error('Error fetching data:', error);
  //   }

  // };

  const processProjectData = (data) => {
    const projectCounts = {};

    data.forEach(employee => {
      const projectName = employee.resource.technologydivision;
     
        if (!projectCounts[projectName]) {
          projectCounts[projectName] = 0;
        }
        projectCounts[projectName]++;
      }
    );
   

let a=Object.keys(projectCounts)
    const labels =Object.keys(projectCounts);
    const series = Object.values(projectCounts);

    setOptions(prevOptions => ({
      ...prevOptions,
      labels,
    }));
    setSeries(series);
  };

  useEffect(() => {
    // fetchProjects();
    fetchYears();
  }, []);

  return (
    <div className="donut" >     
      <Chart options={options} series={series} type="donut" width={"550"}/>
    </div>
  );
};

export default BenchProjects;