import React, { useEffect, useState } from "react";
import AppInfoBox from "../AppInfoBox";
import LatestUploads from "../LatestUploads";
import { getAppInfo } from "../../api/admin";
import { useNotification } from "../../hooks";
import MostRatedMovies from "../MostRatedMovies";

const Dashboard = () => {
  const [appInfo, setAppInfo] = useState({
    movieCount: 0,
    userCount: 0,
    reviewCount: 0,
  });

  const { updateNotificaion } = useNotification();
  const fetchAppInfo = async () => {
    const { error, appInfo } = await getAppInfo();
    if (error) return updateNotificaion("error", error);
    setAppInfo({ ...appInfo });
  };
  useEffect(() => {
    fetchAppInfo();
  }, []);
  return (
    <div className="grid grid-cols-3 gap-5 p-5">
      <AppInfoBox
        title="Total Uploads"
        subTitle={appInfo.movieCount.toLocaleString()}
      />
      <AppInfoBox
        title="Total Reviews"
        subTitle={appInfo.reviewCount.toLocaleString()}
      />

      <AppInfoBox
        title="Total Users"
        subTitle={appInfo.userCount.toLocaleString()}
      />
      {/*Recent Uploads shows last 5 uploaded movies */}
      <LatestUploads />

      {/*Most rated movies */}
      <MostRatedMovies />
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
