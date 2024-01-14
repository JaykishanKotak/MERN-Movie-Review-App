import React from "react";
import { useAuth } from "../../hooks";
import { useNavigate } from "react-router-dom";

const NotVerified = () => {
  const { authInfo } = useAuth();
  const { isLoggedIn } = authInfo;
  // console.log("auth", authInfo);
  const isVerified = authInfo.profile?.isVerified;
  //Show if user is loggend in but not verified
  const navigate = useNavigate();
  const navigateToVerification = () => {
    navigate("/auth/verification", {
      state: {
        user: authInfo.profile,
      },
    });
  };
  return (
    <div>
      {isLoggedIn && !isVerified ? (
        <p className="text-lg text-center bg-blue-50 p-2">
          It looks like you haven't verified your account,{" "}
          <button
            onClick={navigateToVerification}
            className="text-blue-500 font-semibold hover:underline"
          >
            Click here to verify your account
          </button>{" "}
          !
        </p>
      ) : null}
    </div>
  );
};

export default NotVerified;
