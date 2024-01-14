import React from "react";
import NotVerified from "./user/NotVerified";
import TopRatedMovies from "./user/TopRatedMovies";
import Container from "./Container";
import TopRatedWebSeries from "./user/TopRatedWebSeries";
import TopRatedTVSeries from "./user/TopRatedTVSeries";

const Home = () => {
  return (
    <div className="dark:bg-primary bg-dark min-h-screen">
      <Container>
        <NotVerified />
        {/*Movie Slider */}
        {/*Top Rated Movies */}
        <TopRatedMovies />
        <TopRatedWebSeries />
        <TopRatedTVSeries />
      </Container>
    </div>
  );
};

export default Home;
