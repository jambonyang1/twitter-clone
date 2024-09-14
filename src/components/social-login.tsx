import styled from "styled-components";
import GoogleButton from "./google-btn";
import GithubButton from "./github-btn";
const SocialLogin = () => {
  return (
    <Wrapper>
      <GoogleButton />
      <GithubButton />
    </Wrapper>
  );
};

export default SocialLogin;

const Wrapper = styled.div`
  margin-top: 20px;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 10px;
`;
