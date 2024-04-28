import "./AdminSetting.css";
import AdminDashboard from "../components/Dashboards/ADashboard";
import React, { useState } from "react";
import { Link } from "react-router-dom";

export function AdminName() {
  return (
    <>
      <div className="admin">
        <div className="admin-image"></div>
        <div className="admin-name">John Smith</div>
      </div>
    </>
  );
}

export default function AdminSetting() {
  return (
    <>
      <AdminName />
      {/* <div className="dashboard-container">
        <AdminDashboard />
      </div> */}
      <section className="settings">
        <div className="container-settings">
          <div className="accordion">
            <div className="accordion-item" id="adminprofile">
              <a className="accordion-link" href="#adminprofile">
                Profile <i className="fa-solid fa-caret-down"></i>
                <i className="fa-solid fa-caret-up"></i>
              </a>
              <div className="information-text">
                <p>Edit your details</p>
              </div>
              <div className="information">
                <input
                  type="text"
                  className="input-box-settings"
                  id="firstname"
                  placeholder="firstname"
                  required
                ></input>
                <input
                  type="text"
                  className="input-box-settings"
                  id="lastname"
                  placeholder="lastname"
                  required
                ></input>
                <input
                  type="text"
                  className="input-box-settings"
                  id="email"
                  placeholder="email"
                  required
                ></input>
                <button className="btn-settings">Save Changes</button>
              </div>
            </div>
            <div className="accordion-item" id="addnewadmin">
              <a className="accordion-link" href="#addnewadmin">
                Add New Admin <i className="fa-solid fa-caret-down"></i>
                <i className="fa-solid fa-caret-up"></i>
              </a>
              <div className="information-text">
                <p>
                  Once you submit this information the recipient will be
                  notified with their login information and may change their
                  password
                </p>
              </div>
              <div className="information">
                <input
                  type="text"
                  className="input-box-settings"
                  id="firstname"
                  placeholder="First Name"
                  required
                ></input>
                <input
                  type="text"
                  className="input-box-settings"
                  id="lastname"
                  placeholder="Last Name"
                  required
                ></input>
                <input
                  type="text"
                  className="input-box-settings"
                  id="email"
                  placeholder="Email Address"
                  required
                ></input>
                <input
                  type="password"
                  className="input-box-settings"
                  id="password"
                  placeholder="Password"
                  required
                ></input>
                <button className="btn-settings">Submit</button>
              </div>
            </div>
            <div className="accordion-item" id="admins">
              <a className="accordion-link" href="#admins">
                Admins <i className="fa-solid fa-caret-down"></i>
                <i className="fa-solid fa-caret-up"></i>
              </a>
              <div className="information">
                <p>
                  Lorem ipsum dolor, sit amet consectetur adipisicing elit.
                  Mollitia cupiditate autem quam temporibus, quaerat magni
                  voluptas, architecto blanditiis numquam illum at alias. Rem,
                  quibusdam maxime et dolores ab laborum voluptates?
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
