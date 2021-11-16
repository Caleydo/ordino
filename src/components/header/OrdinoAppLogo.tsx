import * as React from 'react';

export function OrdinoAppLogo() {
  return (
    <a rel="noreferrer" target="_blank" className="text-decoration-none navbar-brand" href="https://ordino-daily.caleydoapp.org/#/">
      <div className="align-items-center h-100 d-flex">
        <svg
          version="1.1"
          xmlns="http://www.w3.org/2000/svg"
          x="0px"
          y="0px"
          width="1.5rem"
          height="1.5rem"
          viewBox="0 0 120.522 138.944"
        >
          <polygon
            fill="#10ACDF"
            points="63.166,138.946 120.33,105.942 63.166,72.937 	"
          />
          <polygon
            fill="#1BA64E"
            points="59.164,72.937 2,105.942 59.164,138.944 	"
          />
          <polygon fill="#FABC15" points="57.164,69.472 0,36.468 0,102.478 	" />
          <polygon fill="#F47D20" points="59.164,0 2,33.003 59.164,66.007 	" />
          <polygon
            fill="#EE2329"
            points="63.166,66.008 120.33,33.004 63.166,0 	"
          />
        </svg>
        <span className="ms-2 mb-0 h5 align-items-center justify-content-center text-light">Ordino</span>
      </div>
    </a>
  );
}
