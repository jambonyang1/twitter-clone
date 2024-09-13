import React, { useState } from "react";
import styled from "styled-components";
import { auth } from "../firebase";
import { Link, useNavigate } from "react-router-dom";
import { FirebaseError } from "firebase/app";
import { signInWithEmailAndPassword } from "firebase/auth";

const Login = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  // 나중에 form을 다룰수 있는 다른 패키지로 리팩토링하기
  // velog글, 작가 hdpark : 맨날 하는 폼, 좀만 더 쉽게 해보자 React-hook-form
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const {
      target: { name, value },
    } = e;
    if (name === "email") {
      setEmail(value);
    } else if (name === "password") {
      setPassword(value);
    }
  };
  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    if (isLoading || email === "" || password === "") return;
    try {
      setIsLoading(true);
      await signInWithEmailAndPassword(auth, email, password);
      // redirect to the homepage
      navigate("/");
    } catch (e) {
      // set error
      if (e instanceof FirebaseError) {
        setError(e.message);
      }
    } finally {
      setIsLoading(false);
    }
    console.log(email, password);
  };
  return (
    <Wrapper>
      <Title>Log into 𝕏</Title>
      <Form onSubmit={onSubmit}>
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
          value={isLoading ? "Loading..." : "Log in"}
        ></Input>
      </Form>
      {error !== "" ? <Error>{error}</Error> : null}
      <Switcher>
        계정이 없으신가요? <Link to="/create-account">회원가입</Link>
      </Switcher>
    </Wrapper>
  );
};

export default Login;

const Wrapper = styled.div`
  padding: 50px 0px;
  width: 420px;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Title = styled.h1`
  font-size: 42px;
`;

const Form = styled.form`
  margin-top: 50px;
  margin-bottom: 10px;
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

const Error = styled.span`
  font-weight: 600;
  color: tomato;
`;

const Switcher = styled.span`
  margin-top: 20px;
  a {
    color: #1d9bf0;
  }
`;
