import React, { useState, useEffect } from "react";
import "./AdminModuleReview.css";
import redaxios from "redaxios";
import { Link, useNavigate, useParams } from "react-router-dom";
import AdminDashboard from "../components/Dashboards/ADashboard";

function AdminModuleReview() {
    return (
      <div className="flex">
        <div className="dashboard-container">
          <AdminDashboard />
        </div>
  
      <div className="amr-container">
        <div className="amr-results"> 
                      {/*Link the header to the respective module*/}
                        <div className="side-by-side">
                  
                          <h3>Module:</h3>

                          <div className="dropdown">
                            <span className="amr-span">Select Module</span>
                              <div className="dropdown-content">
                                <p>Module 1</p>
                                <p>Module 2</p>
                                <p>Module 3</p>
                                <p>Module 4</p>
                                <p>Module 5</p>
                              </div>
                        </div>
                        </div>
                  
                      <div className="cont-overview-module">
                        <h2>Module 1</h2>
                        <ul></ul>
                        First attempt passing amount: 30%
                        <br></br>
                        Second attempt passing amount: 60%
                        <br></br>
                        Average attempts taken to pass: 3
                      </div>
                  
                  

                      <div className="flags">

                        <div className="side-by-side">
                  
                          <h3>Flags:</h3>

                          <div className="dropdown">
                            <span className="amr-span">Sort by:</span>
                              <div className="dropdown-content">
                                <p>Ascending</p>
                                <p>Descending</p>
                              </div>
                        </div>

                          </div>

                          <div className="cont-overview-qs">
                            <div className="cont-overview-sep-qs">
                              <h4>Question example text</h4>
                              Accuracy: 30%
                            </div>
                            <div className="cont-overview-sep-qs">
                              <h4>Question example text</h4>
                              Accuracy: 32%
                            </div>
                            <div className="cont-overview-sep-qs">
                              <h4>Question example text</h4>
                              Accuracy: 46%
                            </div>
                            <div className="cont-overview-sep-qs">
                              <h4>Question example text</h4>
                              Accuracy: 58%
                            </div>
                      </div>
  
  
        </div>
      </div>
      </div>
  
  
      </div>
    );
  }

export default AdminModuleReview;