import React from "react";
import Container from "../Container";
import Title from "../form/Title";
import FormInput from "../form/FormInput";
import Submit from "../form/Submit";
import { CustomLink } from "../CustomLink";
import FormContainer from "../form/FormContainer";
import { commonModalClasses } from "../../utils/theme";

const ForgetPassword = () => {
  return (
    <FormContainer>
      <Container>
        <form className={commonModalClasses + " w-96"}>
          <Title>Please Enter Your Email</Title>
          <FormInput label="Email" placeholder="user@gmail.com" name="email" />
          <Submit value="Send Link" />
          <div className="flex justify-between">
            <CustomLink to="/auth/signin"> Sign In</CustomLink>
            <CustomLink to="/auth/signup">Sign Up</CustomLink>
          </div>
        </form>
      </Container>
    </FormContainer>
  );
};

export default ForgetPassword;
