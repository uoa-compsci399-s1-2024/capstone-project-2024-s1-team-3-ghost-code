import React, { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";


function NotFoundPage() {

return (
    <div className="loadingpage">
      <head>
        <title>404 - Page Not Found</title>
      </head>
      <body>
        <div className="loadingbody">
          <div className="loadingtextcont">
            <h1 className="loadingh1">404 - Page Not Found</h1>
            <p className="loadingp">
              The page you are looking for might have been removed, had its
              name changed, or is temporarily unavailable.
            </p>

            <div className="cont-return-but">
              <Link to="/home" style={{ textDecoration: "none" }}>
                <button className="btn return-button">Back to Home</button>
              </Link>
            </div>
          </div>
        </div>
      </body>
    </div>
  );
}

export default NotFoundPage;