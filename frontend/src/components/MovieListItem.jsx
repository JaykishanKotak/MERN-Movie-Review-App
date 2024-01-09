import React from "react";
import { BsBoxArrowUpRight, BsPencilSquare, BsTrash } from "react-icons/bs";

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

export default MovieListItem;
