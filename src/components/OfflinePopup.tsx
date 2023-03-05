import React, { useState, useEffect } from "react";

type IProps = {
  isOnline: boolean;
};

export default function OfflinePopup(props: IProps) {
  const [isHidden, setIsHidden] = useState(props.isOnline);

  useEffect(() => {
    setIsHidden(props.isOnline);
  }, [props.isOnline]);

  return (
    <div className={`offlinePopup ${isHidden ? "hidden" : ""}`}>
      <h2>Jste offline</h2>
      <button
        onClick={() => {
          setIsHidden(true);
        }}
      >
        X
      </button>
      <p>
        Tato aplikace nemusí fungovat správně v režimu offline. Připojte se k internetu a
        aktualizujte stránku, abyste ji zobrazili online
      </p>
    </div>
  );
}
