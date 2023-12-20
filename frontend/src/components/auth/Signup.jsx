import React, { useEffect, useState } from "react";
import Container from "../Container";
import Title from "../form/Title";
import FormInput from "../form/FormInput";
import Submit from "../form/Submit";
import { CustomLink } from "../CustomLink";
import { commonModalClasses } from "../../utils/theme";
import FormContainer from "../form/FormContainer";
import { createUser } from "../../api/auth";
import { useNavigate } from "react-router-dom";
import { useAuth, useNotification } from "../../hooks";
import { isValidEmail } from "../../utils/helper";

const validateUserInfo = ({ name, email, password }) => {
  const isValidName = /^[a-z A-Z]+$/;
  //const isValidEmail = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  // const isValidPassword =
  //   /^(?=.*[a-z])(?=.*[A-Z])(?=.*d)(?=.*[@$!%*?&])[A-Za-zd@$!%*?&]{8,}$/;
  const isValidPassword =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$#^!%*?&])[A-Za-z\d@$#^!%*?&]{8,16}$/;

  //Name Validation
  if (!name.trim()) return { ok: false, error: "Name is missing !" };
  if (!isValidName.test(name)) return { ok: false, error: "Invalid name !" };

  //Email Validation
  if (!email.trim()) return { ok: false, error: "Email is missing !" };
  if (!isValidEmail(email)) return { ok: false, error: "Invalid email !" };

  //if (!isValidEmail.test(email)) return { ok: false, error: "Invalid email !" };

  //Password Validation
  if (!password.trim()) return { ok: false, error: "Password is missing !" };
  if (password.length < 8)
    return { ok: false, error: "Password must be 8 characters long !" };

  return { ok: true };
};
const Signup = () => {
  //For Navigation
  const navigate = useNavigate();

  const [userInfo, setUserInfo] = useState({
    name: "",
    email: "",
    password: "",
  });

  //Notification
  const { updateNotification } = useNotification();

  const handleChange = ({ target }) => {
    const { value, name } = target;
    setUserInfo({ ...userInfo, [name]: value });
    // console.log(target.value, target.name);
  };

  const { name, email, password } = userInfo;

  const handleSubmit = async (e) => {
    //To Prevent Page Reload and Default Form Beheviour
    e.preventDefault();

    //For Validation
    const { ok, error } = validateUserInfo(userInfo);

    if (!ok) return updateNotification("error", error);
    console.log(userInfo);

    const response = await createUser(userInfo);
    if (response.error) return console.log(response.error);

    // replace: true -> Replaces previous history, so user can not get back to previous page
    navigate("/auth/verification", {
      state: { user: response.user },
      replace: true,
    });
    console.log(response.user);
  };

  const { handleLogin, authInfo } = useAuth();
  const { isPending, isLoggedIn } = authInfo;

  useEffect(() => {
    //Move user to home route if alredy loggedin
    if (isLoggedIn) {
      navigate("/");
    }
  }, [isLoggedIn]);
  return (
    <FormContainer>
      <Container>
        <form onSubmit={handleSubmit} className={commonModalClasses + " w-72"}>
          <Title>Sign Up</Title>
          <FormInput
            label="Name"
            value={name}
            onChange={handleChange}
            placeholder="John Doe"
            name="name"
          />
          <FormInput
            label="Email"
            value={email}
            onChange={handleChange}
            placeholder="user@gmail.com"
            name="email"
          />
          <FormInput
            label="Password"
            value={password}
            onChange={handleChange}
            placeholder="*********"
            name="password"
            type="password"
          />
          <Submit value="Sign up" />
          <div className="flex justify-between">
            <CustomLink to="/auth/forget-password"> Forget Password</CustomLink>
            <CustomLink to="/auth/signin">Sign In</CustomLink>
          </div>
        </form>
      </Container>
    </FormContainer>
  );
};

export default Signup;
