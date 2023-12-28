import client from "./client";

export const uploadTrailer = async (formData, onUploadProgress) => {
  const token = localStorage.getItem("auth-token");

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
    console.log(error);
    const { response } = error;
    if (response?.data) return response.data;

    return { error: error.message || error };
  }
};
