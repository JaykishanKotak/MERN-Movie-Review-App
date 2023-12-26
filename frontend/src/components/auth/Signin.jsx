import React, { useEffect, useState } from "react";
import Container from "../Container";
import Title from "../form/Title";
import FormInput from "../form/FormInput";
import Submit from "../form/Submit";
import { CustomLink } from "../CustomLink";
// import { ThemeContext } from "../../context/ThemeProvider";
import { useAuth, useNotification, useTheme } from "../../hooks";
import { commonModalClasses } from "../../utils/theme";
import FormContainer from "../form/FormContainer";
import { useNavigate } from "react-router-dom";
import { isValidEmail } from "../../utils/helper";

const validateUserInfo = ({ email, password }) => {
  //const isValidEmail = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  // const isValidPassword =
  //   /^(?=.*[a-z])(?=.*[A-Z])(?=.*d)(?=.*[@$!%*?&])[A-Za-zd@$!%*?&]{8,}$/;
  const isValidPassword =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$#^!%*?&])[A-Za-z\d@$#^!%*?&]{8,16}$/;

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
const Signin = () => {
  //const theme = useContext(ThemeContext);
  // const theme = useTheme();
  // console.log("theme", theme);
  // theme.method();
  const [userInfo, setUserInfo] = useState({
    email: "",
    password: "",
  });

  const navigate = useNavigate();

  const { updateNotification } = useNotification();
  const { handleLogin, authInfo } = useAuth();
  const { isPending, isLoggedIn } = authInfo;

  // console.log(authInfo);

  const handleChange = ({ target }) => {
    const { value, name } = target;
    setUserInfo({ ...userInfo, [name]: value });
    // console.log(target.value, target.name);
  };

  const { email, password } = userInfo;

  const handleSubmit = async (e) => {
    //To Prevent Page Reload and Default Form Beheviour
    e.preventDefault();

    //For Validation
    const { ok, error } = validateUserInfo(userInfo);

    if (!ok) return updateNotification("error", error);
    handleLogin(userInfo.email, userInfo.password);
    console.log(userInfo);
  };

  //Check if user login alredy or not
  // useEffect(() => {
  //   //Move user to home route if alredy loggedin
  //   if (isLoggedIn) {
  //     navigate("/");
  //   }
  // }, [isLoggedIn]);
  return (
    <FormContainer>
      <Container>
        <form onSubmit={handleSubmit} className={commonModalClasses + " w-72"}>
          <Title>Sign In</Title>
          <FormInput
            value={userInfo.email}
            onChange={handleChange}
            label="Email"
            placeholder="user@gmail.com"
            name="email"
          />
          <FormInput
            value={userInfo.password}
            onChange={handleChange}
            label="Password"
            placeholder="*********"
            name="password"
            type="password"
          />
          <Submit value="Sign in" busy={isPending} />
          <div className="flex justify-between">
            <CustomLink to="/auth/forget-password"> Forget Password</CustomLink>
            <CustomLink to="/auth/signup">Sign Up</CustomLink>
          </div>
        </form>
      </Container>
    </FormContainer>
  );
};

export default Signin;
