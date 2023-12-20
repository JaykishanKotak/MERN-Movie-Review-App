import React, { useEffect, useState } from "react";
import Container from "../Container";
import Title from "../form/Title";
import FormInput from "../form/FormInput";
import Submit from "../form/Submit";
import FormContainer from "../form/FormContainer";
import { commonModalClasses } from "../../utils/theme";
import { useNavigate, useSearchParams } from "react-router-dom";
import { ImSpinner3 } from "react-icons/im";
import { resetPassword, verifyPasswordResetToken } from "../../api/auth";
import { useNotification } from "../../hooks";

const ConfirmPassword = () => {
  /* Sample URL - localhost:3000/auth/reset-password?token=8011fb1dfc0f5325471c6ca34b253bd8baebe1139aac55b0402b7e12ee9e&id=655ceea2f869c81e18ee11ee */

  //To get value of token and userId from Params
  const [searchParams] = useSearchParams();

  const navigate = useNavigate();

  const { updateNotification } = useNotification();

  const [password, setPassword] = useState({
    one: "",
    two: "",
  });
  const [isVerifying, setIsVerifying] = useState(true);
  const [isValid, setIsValid] = useState(false);

  const token = searchParams.get("token");
  const id = searchParams.get("id");

  //console.log(token, id);

  //Check if token is valid or not, if verify - show isVerifyying indicator ,if not valid redirect user to somewhere else

  const isValidToken = async () => {
    const { error, valid } = await verifyPasswordResetToken(token, id);
    setIsVerifying(false);
    if (error) {
      navigate("/auth/reset-password", { replace: true });
      return updateNotification("error", error);
    }
    //If token is not valid, ,reset params values
    if (!valid) {
      setIsValid(false);
      return navigate("/auth/reset-password", { replace: true });
    }
    setIsValid(true);
  };

  //Call isValidToken method whenever user enters route/url
  useEffect(() => {
    isValidToken();
  }, []);

  const handleChange = ({ target }) => {
    const { name, value } = target;

    setPassword({ ...password, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(password);

    if (!password.one.trim()) {
      return updateNotification("error", "Password is missing !");
    }

    if (password.one.trim().length < 8) {
      return updateNotification(
        "error",
        "Password must be 8 characters long !"
      );
    }

    if (password.one !== password.two) {
      return updateNotification("error", "Password do not match");
    }

    const { error, message } = await resetPassword({
      newPassword: password.one,
      userId: id,
      token,
    });

    if (error) {
      return updateNotification("error", error);
    }
    updateNotification("success", message);

    navigate("/auth/signin", { replace: true });
  };
  if (isVerifying) {
    return (
      <FormContainer>
        <Container>
          <div className="flex space-x-2 items-center">
            <h1 className="text-4xl font-semibold dark:text-white text-primary">
              Please wait, we're verifying your token !
            </h1>
            <ImSpinner3 className="animate-spin text-4xl dark:text-white text-primary" />
          </div>
        </Container>
      </FormContainer>
    );
  }

  if (!isValid) {
    return (
      <FormContainer>
        <Container>
          <div className="flex space-x-2 items-center">
            <h1 className="text-4xl font-semibold dark:text-white text-primary">
              Sorry, the token is invalid
            </h1>
          </div>
        </Container>
      </FormContainer>
    );
  }

  return (
    <FormContainer>
      <Container>
        <form onSubmit={handleSubmit} className={commonModalClasses + " w-96"}>
          <Title>Enter New Password</Title>
          <FormInput
            value={password.one}
            onChange={handleChange}
            label="New Password"
            placeholder="********"
            name="one"
            type="password"
          />
          <FormInput
            value={password.two}
            onChange={handleChange}
            label="Confirm Password"
            placeholder="********"
            name="two"
            type="password"
          />
          <Submit value="Confirm Password" />
        </form>
      </Container>
    </FormContainer>
  );
};

export default ConfirmPassword;
