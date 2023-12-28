import React, { Component } from "react";
import { Route, Routes } from "react-router-dom";
import Movies from "../components/admin/Movies";
import Actors from "../components/admin/Actors";
import Dashboard from "../components/admin/Dashboard";
import NotFound from "../components/NotFound";
import Navbar from "../components/admin/Navbar";
import Header from "../components/admin/Header";

export class AdminNavigator extends Component {
  render() {
    return (
      <div className="flex dark:bg-primary bg-white">
        <Navbar />

        <div className="flex-1 p-2 max-w-screen-xl">
          <Header onAddMovieClick={() => console.log("Add Movie")} />
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/movies" element={<Movies />} />
            <Route path="/actors" element={<Actors />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </div>
      </div>
    );
  }
}

export default AdminNavigator;
