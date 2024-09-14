import { Outlet } from "react-router-dom";
import styled from "styled-components";
import NavigationBar from "./navigation-bar";
const Layout = () => {
  return (
    <Wrapper>
      <NavigationBar />
      <Outlet />
    </Wrapper>
  );
};

export default Layout;

const Wrapper = styled.div`
  display: grid;
  gap: 20px;
  grid-template-columns: 1fr 4fr;
  height: 100%;
  padding: 50px 0px;
  width: 100%;
  max-width: 860px;
`;
