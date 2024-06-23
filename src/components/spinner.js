// Spinner.js
import React from "react";
import { ClipLoader } from "react-spinners";

const Spinner = ({ loading }) => (
  <div className="spinner">
    <ClipLoader size={50} color={"#123abc"} loading={loading} />
  </div>
);

export default Spinner;
