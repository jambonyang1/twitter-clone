import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import React, { useState } from "react";
import styled from "styled-components";
import { auth } from "../firebase";
import { useNavigate } from "react-router-dom";

const CreateAccount = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  // 나중에 form을 다룰수 있는 다른 패키지로 리팩토링하기
  // velog글, 작가 hdpark : 맨날 하는 폼, 좀만 더 쉽게 해보자 React-hook-form
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const {
      target: { name, value },
    } = e;
    if (name === "name") {
      setName(value);
    } else if (name === "email") {
      setEmail(value);
    } else if (name === "password") {
      setPassword(value);
    }
  };
  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isLoading || name === "" || email === "" || password === "") return;
    try {
      setIsLoading(true);
      // create an account
      const credentials = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      console.log(credentials.user);
      // set the name of the user
      // 계정을 생성하는 데엔 이메일과 비밀번호만 있으면 되지만, 이름값을 받았으니 해당 정보도 업데이트해줌.
      await updateProfile(credentials.user, {
        displayName: name,
      });
      // redirect to the homepage
      navigate("/");
    } catch (e) {
      // set error
    } finally {
      setIsLoading(false);
    }
    console.log(name, email, password);
  };
  return (
    <Wrapper>
      <div className="wrapper">
        <Title>Join 𝕏</Title>
        <Form onSubmit={onSubmit}>
          <Input
            onChange={onChange}
            name="name"
            value={name}
            placeholder="Name"
            type="text"
          ></Input>
          <Input
            onChange={onChange}
            name="email"
            value={email}
            placeholder="Email"
            type="email"
          ></Input>
          <Input
            onChange={onChange}
            name="password"
            value={password}
            placeholder="Password"
            type="password"
          ></Input>
          <Input
            type="submit"
            value={isLoading ? "Loading..." : "Create Account"}
          ></Input>
        </Form>
      </div>
    </Wrapper>
  );
};

export default CreateAccount;

const Wrapper = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;

  .wrapper {
    padding: 50px 0px;
    width: 420px;
    display: flex;
    flex-direction: column;
    align-items: center;
  }
`;

const Title = styled.h1`
  font-size: 42px;
`;

const Form = styled.form`
  margin-top: 50px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  width: 100%;
`;

const Input = styled.input`
  padding: 10px 20px;
  border-radius: 50px;
  border: none;
  width: 100%;
  font-size: 16px;
  &[type="submit"] {
    cursor: pointer;
    &:hover {
      opacity: 0.9;
    }
  }
`;
