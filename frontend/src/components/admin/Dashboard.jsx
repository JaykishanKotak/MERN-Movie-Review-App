import React from "react";
import AppInfoBox from "../AppInfoBox";
import LatestUploads from "../LatestUploads";

const Dashboard = () => {
  return (
    <div className="grid grid-cols-3 gap-5 p-5">
      <AppInfoBox title="Total Uploads" subTitle="100" />
      <AppInfoBox title="Total Reviews" subTitle="15,00" />

      <AppInfoBox title="Total Users" subTitle="250" />
      {/*Recent Uploads shows last 5 uploaded movies */}
      <LatestUploads />
    </div>
  );
};

export default Dashboard;

// let timeoutId;

// const debounce = (func, delay) => {
//   return (...args) => {
//     if (timeoutId) clearTimeout(timeoutId);
//     timeoutId = setTimeout(() => {
//       func.apply(null, args);
//     }, delay);
//   };
// };

/* 
   const search = (value) => {
     console.log(value);
   };
   const debounceSearch = debounce(search, 500);

  const handleChange = ({ target }) => {
    debounceSearch(target.value);
   };

return (
    <div className="p-14">
      <input
        className="borde border-gray-500"
        type="text"
        onChange={handleChange}
      />
    </div>
    )
*/
