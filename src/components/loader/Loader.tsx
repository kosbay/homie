import React from "react";
import ReactLoaderSpinner from "react-loader-spinner";

import "./Loader.scss";

const Loader = () => {
  const [showSpinner, setShowSpinner] = React.useState(false);

  React.useEffect(() => {
    const timer = setTimeout(() => setShowSpinner(true), 750);

    return () => clearTimeout(timer);
  });

  return showSpinner ? (
    <div className="loader-container">
      <ReactLoaderSpinner
        className="loader"
        type="TailSpin"
        color="#27263b"
        height={200}
        width={200}
      />
    </div>
  ) : null;
};

export default Loader;
