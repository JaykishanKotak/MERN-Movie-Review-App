import React, { useEffect, useRef, useState } from "react";
import Container from "../Container";
import Title from "../form/Title";
import Submit from "../form/Submit";
import FormContainer from "../form/FormContainer";
import { commonModalClasses } from "../../utils/theme";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { resendEmailVerificationToken, verifyUserEmail } from "../../api/auth";
import { useAuth, useNotification } from "../../hooks";

//Dynamic OTP Length
const OTP_LENGTH = 6;
let currentOTPIndex;

const isValidOTP = (otp) => {
  let valid = false;

  for (let val of otp) {
    //Check if otp value is int or empty
    valid = !isNaN(parseInt(val));
    //Break even if one value is empty or NaN Ex: [1, "", 2 , "3"]
    if (!valid) break;
  }

  return valid;
};
const EmailVerification = () => {
  //Array fill with empty items of given length
  const [otp, setOtp] = useState(new Array(OTP_LENGTH).fill(""));

  const [activeOTPIndex, setActiveOTPIndex] = useState(0);

  const { updateNotification } = useNotification();

  const { isAuth, authInfo } = useAuth();
  const { isLoggedIn, profile } = authInfo;
  const isVerified = profile?.isVerified;

  const navigate = useNavigate();
  //To get user data from Signup state
  const { state } = useLocation();
  console.log(state);
  const user = state?.user;

  //Ref hook to get refrance of input field of otp
  const inputRef = useRef();

  const handleOTPChange = ({ target }) => {
    const { value } = target;
    console.log(value);
    //Update OTP State
    const newOTP = [...otp];
    //Get current otp value by index
    //To only get one number per box
    newOTP[currentOTPIndex] = value.substring(value.length - 1, value.length);
    //setOtp([value]);
    console.log(value);
    if (!value) {
      focusPreviousInputFiled(currentOTPIndex);
    } else {
      focusNextInputFiled(currentOTPIndex);
    }
    setOtp([...newOTP]);
  };

  //For Backspace - back to prev field
  const focusPreviousInputFiled = (index) => {
    let nextIndex;
    //Check for first box and not go to -1 index
    let diff = index - 1;
    //It will not allow to go back beyond first otp field
    nextIndex = diff !== 0 ? diff : 0;
    setActiveOTPIndex(nextIndex);
  };

  //For move next field
  const focusNextInputFiled = (index) => {
    setActiveOTPIndex(index + 1);
  };

  //To check which key pressed by user
  const handleKeyDown = ({ key }, index) => {
    currentOTPIndex = index;
    if (key === "Backspace") {
      focusPreviousInputFiled(currentOTPIndex);
    }
  };

  useEffect(() => {
    //currently active input field
    inputRef.current?.focus();
    // console.log(inputRef);
  }, [activeOTPIndex]);

  useEffect(() => {
    if (!user) navigate("/not-found");
    if (isLoggedIn && isVerified) navigate("/");
  }, [user, isLoggedIn, isVerified]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isValidOTP(otp)) {
      //return console.log("Invalid OTP");
      return updateNotification("error", "Invalid OTP");
    }
    console.log(otp);
    //Submit OTP
    const {
      error,
      message,
      user: userResponse,
    } = await verifyUserEmail({
      //Convort Array otp to string
      OTP: otp.join(""),
      userId: user.id,
    });
    if (error) return updateNotification("error", error);

    updateNotification("success", message);
    //console.log(message);
    //Set token inside local storage
    localStorage.setItem("auth-token", userResponse.token);
    isAuth();
  };

  const handleOTPResend = async () => {
    const { error, message } = await resendEmailVerificationToken(user.id);

    if (error) {
      return updateNotification("error", error);
    }
    updateNotification("success", message);
  };
  return (
    <FormContainer>
      <Container>
        <form onSubmit={handleSubmit} className={commonModalClasses}>
          <div>
            <Title>Please Enter the OTP to verify your Account</Title>
            <p className="text-center dark:text-dark-subtle text-white-subtle">
              OTP has been sent to your email.
            </p>
          </div>
          <div className="flex justify-center items-center space-x-4">
            {otp.map((_, index) => {
              return (
                <input
                  ref={activeOTPIndex === index ? inputRef : null}
                  key={index}
                  value={otp[index] || ""}
                  // onChange={(e) => handleOTPChange(e, index)}
                  onChange={handleOTPChange}
                  onKeyDown={(e) => handleKeyDown(e, index)}
                  type="number"
                  className="w-12 h-12 border-2 rounded dark:border-dark-subtle border-light-subtle dark:focus:border-white focus:border-primary bg-transparent outline-none text-center dark:text-white text-primary font-semibold text-xl spin-button-none"
                />
              );
            })}
          </div>
          <div>
            <Submit value="Verify Account" />
            <button
              onClick={handleOTPResend}
              type="button"
              className="dark:text-white text-blue-500 font-semibold hover:underline mt-2"
            >
              I don't have otp
            </button>
          </div>
        </form>
      </Container>
    </FormContainer>
  );
};

export default EmailVerification;
