import PostTweetForm from "../components/post-tweet-form";
import styled from "styled-components";

const Home = () => {
  return (
    <Wrapper>
      <PostTweetForm />
    </Wrapper>
  );
};

export default Home;

const Wrapper = styled.div``;
