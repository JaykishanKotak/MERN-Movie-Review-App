export const isValidEmail = (email) => {
  const isValid = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

  return isValid.test(email);
};

export const getToken = () => {
  return localStorage.getItem("auth-token");
};

export const catchError = (error) => {
  const { response } = error;
  if (response?.data) return response.data;

  return { error: error.message || error };
};

export const renderItem = (result) => {
  return (
    <div key={result.id} className="flex rounded overflow-hidden">
      <img
        src={result.avatar}
        alt={result.name}
        className="h-16 w-16 object-cover"
      />
      <p className="dark:text-white font-semibold">{result.name}</p>
    </div>
  );
};

export const getPoster = (posters) => {
  /**
   * If poster more then 2 items - select 2nd poster
   * else select first poster
   */
  const { length } = posters;
  if (!length) return null;

  //If poster more then 2 posters
  if (length > 2) return posters[1];

  //Select first one
  return posters[0];
};

//To handle review count if its more then 999
export const convertReviewCount = (count = 0) => {
  if (count <= 999) {
    return count;
  }
  //Ex   parseFloat(1222 / 1000).toFixed(2) => 1.22;
  //If reviews if more then 999 we will add to K formate ex : 1222 -> 1.22k with last 2 digits
  return parseFloat(count / 1000).toFixed(2) + "k";
};
