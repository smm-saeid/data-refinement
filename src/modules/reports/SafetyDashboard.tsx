import { useEffect, useRef } from "react";

export default function SianatDashboard(){
const linkRef = useRef(null);

useEffect(() => {
    linkRef.current?.click();
}, []);

  return (
    <div>
        <a href="https://192.180.8.228:8443/portalaja/r/ws_aja/verisa_support153111102105"
            target="_self"
            rel="noopeneer noreferrer"
            ref={linkRef}
        >
        </a>
            </div>
  )
}