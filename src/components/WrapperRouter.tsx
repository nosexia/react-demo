import React from "react";
import Header from "./Header.tsx";
const WrapperRouter = ({ element }) => {
  return (
    <div>
      <Header />
      {element()}
    </div>
  );
};

export default WrapperRouter;
