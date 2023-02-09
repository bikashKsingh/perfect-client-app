import React, { useContext, useState, useEffect } from "react";
import { Link, BrowserRouter, useHistory } from "react-router-dom";
import M from 'materialize-css'
import { BranchContext } from "./Branch";
import $ from "jquery";

function LeftNavigation() {
  const history = useHistory()
  const { state, dispatch } = useContext(BranchContext)

  // Fetching the data
  useEffect(() => {

  }, []);

  // Login Function
  const logout = (evt) => {
    evt.preventDefault()
    localStorage.removeItem("branch");
    localStorage.removeItem("jwt_branch_token");
    dispatch({ type: "CLEAR" })
    history.push('/branch/login')
  }

  // Remove Left Navigation When Click On The Link
  const removeLeftNavigation = (evt) => {
    $("body").removeClass("show-sidebar");
  }

  // Return Function
  return (
    <div>
      {state &&
        <aside className="left-sidebar">
          {/* <!-- Sidebar scroll--> */}
          <div className="scroll-sidebar">
            {/* <!-- User profile --> */}
            <div
              className="user-profile"
              style={{
                background:
                  "url(../assets/images/background/user-info.jpg) no-repeat",
              }}
            >
              {/* <!-- User profile image --> */}
              <div className="profile-img text-center">
                {state.profile_picture ? <img src={state.profile_picture} alt="user" /> : <span className={"fas fa-user-circle text-white"} style={{ fontSize: "51px" }} />}
              </div>
              {/* <!-- User profile text--> */}
              <div className="profile-text">
                <Link
                  to="/"
                  className="dropdown-toggle u-dropdown"
                  data-toggle="dropdown"
                  role="button"
                  aria-haspopup="true"
                  aria-expanded="true"
                >
                  {state.name}
                </Link>

                <div className="dropdown-menu animated flipInY">
                  <Link to="/branch/profile" className="dropdown-item" onClick={removeLeftNavigation}>
                    <i className="ti-user"></i> My Profile
                  </Link>

                  <div className="dropdown-divider"></div>

                  <Link to="/branch/profile" className="dropdown-item" onClick={removeLeftNavigation}>
                    <i className="ti-settings"></i> Account Setting
                  </Link>

                  <div className="dropdown-divider"></div>

                  <Link className="dropdown-item" to={"#"} onClick={logout} onClick={removeLeftNavigation}>
                    <i className="fa fa-power-off"></i> Logout
                  </Link>
                </div>
              </div>
            </div>
            {/* <!-- End User profile text--> */}

            {/* <!-- Sidebar navigation--> */}
            <nav className="sidebar-nav">
              <ul id="sidebarnav">
                <li className="nav-small-cap">PERSONAL</li>
                {/* Dashboard */}
                <li>
                  <Link
                    className="has-arrow waves-dark"
                    to="/branch"
                    onClick={removeLeftNavigation}
                  >
                    <i className="mdi mdi-gauge"></i>
                    <span className="hide-menu">Dashboard </span>
                  </Link>
                </li>


                {/* Setup Section */}
                <li>
                  <Link
                    className="has-arrow waves-dark"
                    to="/"
                    aria-expanded="false"
                  >
                    <i className="mdi mdi-settings"></i>
                    <span className="hide-menu">Setup</span>
                  </Link>

                  <ul aria-expanded="false" className="collapse">
                    <li>
                      <Link to="/branch/session" onClick={removeLeftNavigation}>Year/Session</Link>
                    </li>
                    <li>
                      <Link to="/branch/standard" onClick={removeLeftNavigation}>Standard</Link>
                    </li>
                    {/* <li>
                      <Link to="/branch/subject">Subject</Link>
                    </li> */}
                    <li>
                      <Link to="/branch/courseType" onClick={removeLeftNavigation}>Course Type</Link>
                    </li>
                    <li>
                      <Link to="/branch/batch" onClick={removeLeftNavigation}>Class/Batch</Link>
                    </li>
                    <li>
                      <Link to="/branch/liveClassSetup" onClick={removeLeftNavigation}>Live Class</Link>
                    </li>
                    <li>
                      <Link to="/branch/chapter" onClick={removeLeftNavigation}>Chapter</Link>
                    </li>
                    {/* <li>
                    <Link to="/user/pendingListing">Pending Listing <span className="badge badge-danger"> {pendingListing.length} </span> </Link>
                  </li> */}
                  </ul>
                </li>

                {/* Student Section */}
                <li>
                  <Link
                    className="has-arrow waves-dark"
                    to="/"
                    aria-expanded="false"
                  >
                    <i className="mdi mdi-account-plus"></i>
                    <span className="hide-menu">Student</span>
                  </Link>

                  <ul aria-expanded="false" className="collapse">
                    <li>
                      <Link to="/branch/studentInquiry" onClick={removeLeftNavigation}>Student Inquiry</Link>
                    </li>
                    <li>
                      <Link to="/branch/studentRegistration" onClick={removeLeftNavigation}>Student Registration</Link>
                    </li>
                    <li>
                      <Link to="/branch/manageStudentRegistration" onClick={removeLeftNavigation}>Mange Student Registration</Link>
                    </li>
                  </ul>
                </li>

                {/* Staff Section */}
                <li>
                  <Link
                    className="has-arrow waves-dark"
                    to="/"
                    aria-expanded="false"
                  >
                    <i className="mdi mdi-account-multiple-plus"></i>
                    <span className="hide-menu">Staff</span>
                  </Link>

                  <ul aria-expanded="false" className="collapse">
                    <li>
                      <Link to="/branch/staff" onClick={removeLeftNavigation}>Staff Registration</Link>
                    </li>
                    <li>
                      <Link to="/branch/staffRights" onClick={removeLeftNavigation}>Manage Staff Rights</Link>
                    </li>
                    <li>
                      <Link to="/branch/staffActionRights" onClick={removeLeftNavigation}>Manage Staff Action Rights</Link>
                    </li>
                    <li>
                      <Link to="/branch/staffAttendence" onClick={removeLeftNavigation}>Staff Attendence</Link>
                    </li>
                  </ul>
                </li>

                {/* Test Section */}
                <li>
                  <Link
                    className="has-arrow waves-dark"
                    to="/"
                    aria-expanded="false"
                  >
                    <i className="mdi mdi-book-open-variant"></i>
                    <span className="hide-menu">Online Test</span>
                  </Link>

                  <ul aria-expanded="false" className="collapse">
                    <li>
                      <Link to="/branch/questionType" onClick={removeLeftNavigation}>Manage Question Types</Link>
                    </li>
                    <li>
                      <Link to="/branch/questions" onClick={removeLeftNavigation}>Manage Questions</Link>
                    </li>
                    <li>
                      <Link to="/branch/onlineTest" onClick={removeLeftNavigation}>Manage Online Test</Link>
                    </li>
                    <li>
                      <Link to="/branch/results" onClick={removeLeftNavigation}>Check Result</Link>
                    </li>
                    <li>
                      <Link to="/branch/courseType" onClick={removeLeftNavigation}>Publish Result</Link>
                    </li>

                    {/* <li>
                  <Link to="/user/pendingListing">Pending Listing <span className="badge badge-danger"> {pendingListing.length} </span> </Link>
                </li> */}
                  </ul>
                </li>

                {/* Video Section */}
                <li>
                  <Link
                    className="has-arrow waves-dark"
                    to="/branch/video"
                  >
                    <i className="mdi mdi-camera"></i>
                    <span className="hide-menu">Video </span>
                  </Link>
                </li>

                {/* Classroom Assets Section */}
                <li>
                  <Link
                    className="has-arrow waves-dark"
                    to="/"
                    aria-expanded="false"
                  >
                    <i className="mdi mdi-note-multiple-outline"></i>
                    <span className="hide-menu">Classroom Assets</span>
                  </Link>

                  <ul aria-expanded="false" className="collapse">
                    <li>
                      <Link to="/branch/chapterLayouts" onClick={removeLeftNavigation}>Chapter Layouts</Link>
                    </li>
                    <li>
                      <Link to="/branch/formulaCharts" onClick={removeLeftNavigation}>Formula Charts</Link>
                    </li>
                    <li>
                      <Link to="/branch/assignments" onClick={removeLeftNavigation}>Assignments</Link>
                    </li>
                    {/* <li>
                  <Link to="/user/pendingListing">Pending Listing <span className="badge badge-danger"> {pendingListing.length} </span> </Link>
                </li> */}
                  </ul>
                </li>

              </ul>
            </nav>
            {/* <!-- End Sidebar navigation --> */}
          </div>
          {/* <!-- End Sidebar scroll--> */}
          {/* <!-- Bottom points--> */}
          <div className="sidebar-footer">
            {/* <!-- item--> */}
            <Link
              to="/branch/setting"
              className="link"
              data-toggle="tooltip"
              title="Settings"
              onClick={removeLeftNavigation}
            >
              <i className="ti-settings"></i>
            </Link>
            {/* <!-- item--> */}
            <Link to="#" className="link" data-toggle="tooltip" title="Email" onClick={removeLeftNavigation}>
              <i className="mdi mdi-gmail"></i>
            </Link>
            {/* <!-- item--> */}

            <Link
              to='#'
              onClick={(evt) => logout(evt)}
              className="link"
              data-toggle="tooltip"
              title="Logout"
            >
              <i className="mdi mdi-power"></i>
            </Link>
          </div>
          {/* <!-- End Bottom points--> */}
        </aside>
      }
    </div>
  );
}

export default LeftNavigation;
