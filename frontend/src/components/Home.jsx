import React from "react";
import NotVerified from "./user/NotVerified";
import TopRatedMovies from "./user/TopRatedMovies";
import Container from "./Container";
import TopRatedWebSeries from "./user/TopRatedWebSeries";
import TopRatedTVSeries from "./user/TopRatedTVSeries";
import HeroSlideShow from "./user/HeroSlideShow";

const Home = () => {
  return (
    <div className="dark:bg-primary bg-dark min-h-screen">
      <Container className="px-2 xl:p-0 ">
        <NotVerified />
        {/*Movie Slider */}
        <HeroSlideShow />
        <div className="space-y-3 py-8">
          {/*Top Rated Movies / Web Series / TV Series */}
          <TopRatedMovies />
          <TopRatedWebSeries />
          <TopRatedTVSeries />
        </div>
      </Container>
    </div>
  );
};

export default Home;
