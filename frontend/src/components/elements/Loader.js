import React from "react";
import styled, { keyframes } from "styled-components";

const Loader = () => {
  console.log("is loading...");
  const spin = keyframes`
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
  `,
    Load = styled.div`
      border: 10px solid #f3f3f3;
      border-top: 10px solid #3498db;
      border-radius: 50%;
      width: 80px;
      height: 80px;
      animation: ${spin} 1s linear infinite;
    `,
    Container = styled.div`
      position: fixed;
      top: calc(50% - 100px);
      left: calc(50% - 40px);
    `;

  return (
    <Container>
      <Load />
    </Container>
  );
};

export default Loader;
