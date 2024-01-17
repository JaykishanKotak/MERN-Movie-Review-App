import { catchError, getToken } from "../utils/helper";
import client from "./client";

export const uploadTrailer = async (formData, onUploadProgress) => {
  const token = getToken();

  try {
    const { data } = await client.post("/movie/upload-trailer", formData, {
      headers: {
        Authorization: "Bearer " + token,
        "Content-Type": "multipart/form-data",
      },
      //To get upload/download progress event
      onUploadProgress: ({ loaded, total }) => {
        //loaded - how much data uploaded to server
        //total - acctule size of data
        //Return upload progress in form of % value
        if (onUploadProgress)
          onUploadProgress(Math.floor((loaded / total) * 100));
      },
    });
    return data;
  } catch (error) {
    return catchError(error);
  }
};

export const uploadMovie = async (formData) => {
  const token = getToken();

  try {
    const { data } = await client.post("/movie/create", formData, {
      headers: {
        Authorization: "Bearer " + token,
        "Content-Type": "multipart/form-data",
      },
    });
    return data;
  } catch (error) {
    return catchError(error);
  }
};

export const getMovies = async (pageNo, limit) => {
  const token = getToken();

  try {
    const { data } = await client.get(
      `/movie/movies?pageNo=${pageNo}&limit=${limit}`,
      {
        headers: {
          Authorization: "Bearer " + token,
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return data;
  } catch (error) {
    return catchError(error);
  }
};

export const getMovieForUpdate = async (id) => {
  const token = getToken();

  try {
    const { data } = await client.get("/movie/for-update/" + id, {
      headers: {
        Authorization: "Bearer " + token,
      },
    });
    return data;
  } catch (error) {
    return catchError(error);
  }
};

export const updateMovie = async (id, formData) => {
  const token = getToken();
  try {
    const { data } = await client.patch("/movie/update/" + id, formData, {
      headers: {
        Authorization: "Bearer " + token,
        "Content-Type": "multipart/form-data",
      },
    });

    return data;
  } catch (error) {
    return catchError(error);
  }
};

export const deleteMovie = async (id) => {
  const token = getToken();
  try {
    const { data } = await client.delete(`/movie/${id}`, {
      headers: {
        Authorization: "Bearer " + token,
      },
    });

    return data;
  } catch (error) {
    return catchError(error);
  }
};

export const searchMovieForAdmin = async (title) => {
  const token = getToken();
  try {
    const { data } = await client.get(`/movie/search?title=${title}`, {
      headers: {
        Authorization: "Bearer " + token,
      },
    });

    return data;
  } catch (error) {
    return catchError(error);
  }
};

export const getTopRatedMovies = async (type, signal) => {
  try {
    let endPoint = "/movie/top-rated";
    if (type) {
      endPoint = endPoint + "?type=" + type;
    }
    const { data } = await client.get(endPoint, { signal });

    return data;
  } catch (error) {
    return catchError(error);
  }
};

export const getLatestUploads = async (signal) => {
  try {
    const { data } = await client.get("/movie/latest-uploads", { signal });

    return data;
  } catch (error) {
    return catchError(error);
  }
};

export const getSingleMovie = async (id) => {
  try {
    const { data } = await client.get("/movie/single/" + id);

    return data;
  } catch (error) {
    return catchError(error);
  }
};

export const getRelatedMovies = async (movieId) => {
  try {
    const { data } = await client.get("/movie/related/" + movieId);

    return data;
  } catch (error) {
    return catchError(error);
  }
};

export const searchPublicMovie = async (title) => {
  try {
    const { data } = await client.get("/movie/search-public?title=" + title);

    return data;
  } catch (error) {
    return catchError(error);
  }
};
