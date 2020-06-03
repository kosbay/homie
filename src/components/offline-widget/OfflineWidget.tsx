import React from "react";
import classnames from "classnames";

import "./OfflineWidget.scss";

const OfflineWidget = () => {
  const isOffline = (): boolean => !navigator.onLine;

  const updateOnlineStatus = (): void => {
    showOfflineIcon();
    showPopup();
  };

  const showPopup = (): void => {
    setShowPopup(true);

    this.timeout = setTimeout(() => setShowPopup(false), 5000);
  };

  const showOfflineIcon = (): void => {
    this.timeoutForOffline = setTimeout(
      () => setOfflineIconVisible(isOffline()),
      4500
    );
  };

  const [isOfflineIconVisible, setOfflineIconVisible] = React.useState(
    isOffline()
  );
  const [isShowPopup, setShowPopup] = React.useState(false);

  React.useEffect(() => {
    window.addEventListener("online", updateOnlineStatus);
    window.addEventListener("offline", updateOnlineStatus);

    return () => {
      window.removeEventListener("online", updateOnlineStatus);
      window.removeEventListener("offline", updateOnlineStatus);
      window.clearTimeout(this.timeout);
      window.clearTimeout(this.timeoutForOffline);
    };
  }, []);

  return (
    <div id="offline-widget">
      {isShowPopup && (
        <div className={classnames("connection-popup", "show-popup")}>
          <p>{isOffline() ? "Internet is gone" : "We are online!"}</p>
          <span>
            {isOffline()
              ? "The application runs offline and uses the cache"
              : "Internet connection restored"}
          </span>
        </div>
      )}
      <div
        className={classnames("circle", {
          "hide-cirdle": isOfflineIconVisible
        })}
      >
        <div
          className={classnames(
            "line",
            { show: isOffline() },
            { hide: !isOffline() }
          )}
        />
        <img src="/assets/wifi.png" />
      </div>
    </div>
  );
};

export default OfflineWidget;
