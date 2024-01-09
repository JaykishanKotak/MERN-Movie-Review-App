import React from "react";
import AppInfoTitle from "./AppInfoTitle";
import { BsBoxArrowUpRight, BsPencilSquare, BsTrash } from "react-icons/bs";
const LatestUploads = () => {
  return (
    <div className="dark:bg-secondary dark:shadow bg-white shadow p-5 rounded col-span-2">
      {/*col-span-2 will allot two grid spaces to div */}
      <AppInfoTitle title="Recent Uploads" />
      <MovieListItem
        movie={{
          poster:
            "https://images.unsplash.com/photo-1682687220208-22d7a2543e88?q=80&w=300&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDF8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
          title: "Consequat culpa",
          status: "public",
          genres: ["Action", "Comady"],
        }}
      />
    </div>
  );
};

export default LatestUploads;

const MovieListItem = ({ movie, onOpenClick, onEditClick, onDeleteClick }) => {
  const { poster, title, genres = [], status } = movie;
  return (
    <table className="w-full border-b">
      <tbody>
        <tr>
          <td>
            <div className="w-24">
              {/*We stored images in landscape format */}
              <img className="w-full aspect-video" src={poster} alt={title} />
            </div>
          </td>
          <td className="w-full pl-5">
            {/*title and genres */}
            <div>
              <h1 className="text-lg font-semibold dark:text-white text-primary">
                {title}
              </h1>
              <div className="space-x-1">
                {genres.map((g, index) => {
                  return (
                    <span
                      key={g + index}
                      className="dark:text-white text-primary text-xs"
                    >
                      {g}
                    </span>
                  );
                })}
              </div>
            </div>
          </td>
          {/*Movie status */}
          <td className="px-5">
            <p className="dark:text-white text-primary">{status}</p>
          </td>

          {/*Buttons */}
          <td>
            <div className="flex items-center space-x-3 dark:text-white text-primary text-lg">
              <button onClick={onDeleteClick} className="" type="button">
                <BsTrash />
              </button>
              <button onClick={onEditClick} className="" type="button">
                <BsPencilSquare />
              </button>
              <button onClick={onOpenClick} className="" type="button">
                <BsBoxArrowUpRight />
              </button>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  );
};
