import { useEffect, useRef } from "react";

export default function OracleAppexDashboard(){
const linkRef = useRef(null);

useEffect(() => {
    linkRef.current?.click();
}, []);

  return (
    <div>
        <a href="https://192.180.8.228:8443/portalaja/r/ws_aja/verisa_support153146104"
            target="_self"
            rel="noopeneer noreferrer"
            ref={linkRef}
        >
        </a>
            </div>
  )
}