import React, { useContext, useState, useEffect } from 'react'
import { BranchContext } from '../../branch/Branch'
import M from 'materialize-css'
import { Link } from 'react-router-dom';
import Config from '../../config/Config';
import Chart from 'chart.js/auto';

// Global Variable For BarChart
var batch = {};
// Global Variable For BarChart
var payment = {};

function Dashboard() {
  const { state, dispatch } = useContext(BranchContext)
  const [selectedSession, setSelectedSession] = useState(
    localStorage.getItem("branchSession") || ""
  );
  const [isLoaded, setIsLoaded] = useState(false);
  const [isUpdated, setisUpdated] = useState(false);
  const [pendingListing, setPendingListing] = useState([]);
  const [totalStudent, setTotalStudent] = useState(0);
  const [isTotalStudentLoaded, setIsTotalStudentLoaded] = useState(false);
  const [allBatches, setAllBatches] = useState([]);
  const [isAllBatchLoaded, setIsAllBatchLoaded] = useState(false);
  const [isChartDataLoaded, setIsChartDataLoaded] = useState(false);
  const [subComment, setSubCommment] = useState([]);
  const [recComment, setRecCommment] = useState([]);

  // Fetching the data
  useEffect(() => {
    // Get All Students
    fetch(Config.SERVER_URL + "/branch/countStudent?session=" + selectedSession, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("jwt_branch_token")}`,
      },
    })
      .then((res) => res.json())
      .then(
        (result) => {
          setIsTotalStudentLoaded(true);
          if (result.success) {
            setTotalStudent(result.data || 0);
          } else {
            M.toast({ html: result.message, classes: "bg-danger" });
          }
        },
        (error) => {
          M.toast({ html: error, classes: "bg-danger" });
          setIsTotalStudentLoaded(true);
        }
      );


    // Get All Batches
    fetch(Config.SERVER_URL + "/branch/searchBatch?session=" + selectedSession, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("jwt_branch_token")}`,
      },
    })
      .then((res) => res.json())
      .then(
        (result) => {
          setIsAllBatchLoaded(true);
          if (result.success) {

            result.data.map(value => {
              batch[value.name] = 0
              payment[value.name] = 0
            })
            setAllBatches(result.data || []);

          } else {
            M.toast({ html: result.message, classes: "bg-danger" });
          }
        },
        (error) => {
          M.toast({ html: error, classes: "bg-danger" });
          setIsAllBatchLoaded(true);
        }
      );


    // Get All Student
    fetch(
      Config.SERVER_URL + "/branch/searchStudent?session=" + selectedSession,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("jwt_branch_token")}`,
        },
      }
    )
      .then((res) => res.json())
      .then(
        (result) => {
          if (result.success) {
            const filteredData = [];
            result.data.map((value, index) => {
              value.session.map((val, indx) => {
                if (val.session._id == selectedSession) {
                  batch[val.batch.name] += 1;

                  // Calculate Payment
                  if (!value.payment) value.payment = [];
                  value.payment.forEach(element => {
                    payment[val.batch.name] += Number(element.amount);
                  })
                }
              })
            })

            setIsChartDataLoaded(true)
            // Batch Chart
            var ctx = document.getElementById('batchBarChart');
            var batchBarChart = new Chart(ctx, {
              type: 'bar',
              data: {
                // labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
                labels: Object.keys(batch),
                datasets: [{
                  label: 'Batch of Students',
                  // data: [12, 19, 3, 5, 2, 3],
                  data: Object.values(batch),
                  backgroundColor: [
                    'rgba(255, 99, 132, 0.2)',
                    'rgba(54, 162, 235, 0.2)',
                    'rgba(255, 206, 86, 0.2)',
                    'rgba(75, 192, 192, 0.2)',
                    'rgba(153, 102, 255, 0.2)',
                    'rgba(255, 206, 86, 0.2)',
                  ],
                  borderColor: [
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(75, 192, 192, 1)',
                    'rgba(153, 102, 255, 1)',
                    'rgba(255, 159, 64, 1)',
                    'rgba(54, 162, 235, 1)',
                  ],
                  borderWidth: 1
                }]
              },
              options: {
                scales: {
                  y: {
                    beginAtZero: true
                  }
                }
              }
            });


            // Payment Chart
            var ctx2 = document.getElementById('paymentPieChart');
            var paymentPieChart = new Chart(ctx2, {
              type: 'pie',
              data: {
                // labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
                labels: Object.keys(payment),
                datasets: [{
                  label: 'Batch of Payments',
                  // data: [12, 19, 3, 5, 2, 3],
                  data: Object.values(payment),
                  backgroundColor: [
                    'rgba(255, 99, 132, 0.2)',
                    'rgba(54, 162, 235, 0.2)',
                    'rgba(255, 206, 86, 0.2)',
                    'rgba(75, 192, 192, 0.2)',
                    'rgba(153, 102, 255, 0.2)',
                    'rgba(255, 206, 86, 0.2)',
                  ],
                  borderColor: [
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(75, 192, 192, 1)',
                    'rgba(153, 102, 255, 1)',
                    'rgba(255, 159, 64, 1)',
                    'rgba(54, 162, 235, 1)',
                  ],
                  borderWidth: 1
                }]
              },
              options: {
                scales: {
                  y: {
                    beginAtZero: true
                  }
                }
              }
            });

          } else {
            M.toast({ html: result.message, classes: "bg-danger" });
            if (result.session)
              M.toast({ html: result.session, classes: "bg-danger" });
            setIsChartDataLoaded(true)
          }
        },
        (error) => {
          M.toast({ html: error, classes: "bg-danger" });
          setIsChartDataLoaded(true)
        }
      );

  }, []);

  return (
    <div>
      <div className="page-wrapper px-0 pt-0">
        {/* <!-- ============================================================== --> */}
        {/* <!-- Container fluid  --> */}
        {/* <!-- ============================================================== --> */}
        <div className="container-fluid">
          {/* <!-- ============================================================== --> */}
          {/* <!-- Bread crumb and right siLine toggle --> */}
          {/* <!-- ============================================================== --> */}
          <div className="row page-titles mb-0">
            <div className="col-md-5 col-8 align-self-center">
              <h3 className="text-themecolor">Dashboard</h3>
              <ol className="breadcrumb">
                <li className="breadcrumb-item"><a href="#">Home</a></li>
                <li className="breadcrumb-item active">Dashboard</li>
              </ol>
            </div>
          </div>
          {/* <!-- End Bread crumb and right sidebar toggle --> */}

          {/* <!-- Card Section --> */}
          <div className={"row page-titles px-1 my-0 shadow-none"} style={{ background: "none" }}>
            <div className={"col-md-12 px-0"}>
              <div className={"card"}>
                <div className={"card-body"}>
                  <h3 className="card-title">Stats Overview</h3>
                  <div className={"row"}>

                    {/* All Students */}
                    <div className={"col-md-3"}>
                      <div className={"card bg-primary border-0"}>
                        <Link to={"/branch/studentRegistration"}>
                          <div className={"card-body py-1"}>
                            <div className={"float-left"}>
                              <i className={'mdi mdi-account-multiple v-big-icon text-light'} />
                            </div>
                            <div className={"float-right text-right m-2"}>
                              <h2 className={"text-light"}>
                                {isTotalStudentLoaded ? totalStudent : (
                                  <div className={"text-center"}>
                                    <span
                                      className="spinner-border spinner-border-sm mr-1"
                                      role="status"
                                      aria-hidden="true"
                                    ></span>

                                  </div>
                                )}
                              </h2>
                              <span className={"text-light h6"}>All Students</span>
                            </div>
                          </div>
                        </Link>
                      </div>
                    </div>

                    {/* All Batches */}
                    <div className={"col-md-3"}>
                      <div className={"card bg-info border-0"}>
                        <Link to={"/branch/batch"}>
                          <div className={"card-body py-1"}>
                            <div className={"float-left"}>
                              <i className={'mdi mdi-group v-big-icon text-light'} />
                            </div>
                            <div className={"float-right text-right m-2"}>
                              <h2 className={"text-light"}>
                                {isAllBatchLoaded ? allBatches.length : (
                                  <div className={"text-center"}>
                                    <span
                                      className="spinner-border spinner-border-sm mr-1"
                                      role="status"
                                      aria-hidden="true"
                                    ></span>

                                  </div>
                                )}
                              </h2>
                              <span className={"text-light h6"}>All Batches</span>
                            </div>
                          </div>
                        </Link>
                      </div>
                    </div>

                    {/* Submited Comments */}
                    <div className={"col-md-3"}>
                      <Link to={"/user/submitedComment"}>
                        <div className={"card bg-warning border-0"}>
                          <div className={"card-body py-1"}>
                            <div className={"float-left"}>
                              <i className={'mdi mdi-comment v-big-icon text-light'} />
                            </div>
                            <div className={"float-right text-right m-2"}>
                              <h2 className={"text-light"}> {subComment.length} </h2>
                              <span className={"text-light"}>Post Comments</span>
                            </div>
                          </div>
                        </div>
                      </Link>
                    </div>

                    {/* Got Comments */}
                    <div className={"col-md-3"}>
                      <Link to={"/user/receivedComment"}>
                        <div className={"card bg-danger border-0"}>
                          <div className={"card-body py-1"}>
                            <div className={"float-left"}>
                              <i className={'mdi mdi-comment-multiple-outline v-big-icon text-light'} />
                            </div>
                            <div className={"float-right text-right m-2"}>
                              <h2 className={"text-light"}> {recComment.length} </h2>
                              <span className={"text-light"}>Got Comments</span>
                            </div>
                          </div>
                        </div>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* <!-- Row --> */}
          <div className={"row page-titles px-1 my-0 shadow-none "} style={{ background: "none" }}>
            {/* <!-- Batch of Student Bar Chart --> */}
            <div className="col-md-8 px-0">
              <div className={"card"}>
                <div className={"card-body"}>
                  {isChartDataLoaded ? <canvas className={"bg-white"} id="batchBarChart" ></canvas> :
                    (<div className={"text-center"}>
                      <span
                        className="spinner-border spinner-border-sm mr-1"
                        role="status"
                        aria-hidden="true"
                      ></span>

                    </div>
                    )}
                </div>
              </div>
            </div>

            {/* <!-- Batch of Payment Pie Chart --> */}
            <div className="col-md-4 px-0">
              <div className={"card"}>
                <div className={"card-body"}>
                  {isChartDataLoaded ? <canvas className={"bg-white"} id="paymentPieChart" ></canvas> :
                    (<div className={"text-center"}>
                      <span
                        className="spinner-border spinner-border-sm mr-1"
                        role="status"
                        aria-hidden="true"
                      ></span>

                    </div>
                    )}
                </div>
              </div>
            </div>
          </div>

          {/* <!-- Row --> */}
          <div className="row page-titles px-1 my-0 shadow-none" style={{ background: "none" }}>
            {/* <!-- Column --> */}
            <div className="col-lg-4 col-xlg-3 col-md-5 px-0">
              {/* <!-- Column --> */}
              <div className="card">
                <img className="card-img-top" src="../assets/images/background/profile-bg.jpg" alt="Card image cap" />
                <div className="card-body little-profile text-center">
                  <div className="pro-img"><img src={state && (state.photo || "/assets/images/users/4.jpg")} alt="user" /></div>
                  <h3 className="m-b-0"> {state && state.name} </h3>
                  <p> {state && state.bio} </p>
                  <h5> Social Profile </h5>
                  {state && <a
                    target={"_blank"}
                    href={state.facebook}
                    className="btn btn-circle btn-secondary"
                  >
                    <i className="mdi mdi-facebook"></i>
                  </a>}
                  {state && <a
                    target={"_blank"}
                    href={state.instagram}
                    className="btn btn-circle btn-secondary"
                  >
                    <i className="mdi mdi-instagram"></i>
                  </a>}
                  {state && <a
                    target={"_blank"}
                    href={state.twitter}
                    className="btn btn-circle btn-secondary"
                  >
                    <i className="mdi mdi-twitter"></i>
                  </a>}
                  {state && <a
                    target={"_blank"}
                    href={state.youtube}
                    className="btn btn-circle btn-secondary"
                  >
                    <i className="mdi mdi-youtube"></i>
                  </a>}
                </div>
              </div>

            </div>

            <div className="col-lg-8 col-xlg-9 col-md-7 px-0">
              <div className="card">
                {/* <!-- Nav tabs --> */}
                <ul className="nav nav-tabs profile-tab" role="tablist">
                  <li className="nav-item"> <a className="nav-link active" data-toggle="tab" href="#home" role="tab">Activity</a> </li>
                </ul>
                {/* <!-- Tab panes --> */}
                <div className="tab-content">
                  <div className="tab-pane active" id="home" role="tabpanel">
                    <div className="card-body">
                      <div className="profiletimeline">
                        {recComment.map(list => {
                          return (
                            <>
                              <div className="sl-item">
                                <div className="sl-left"> <img src={list.user.photo || "/assets/images/users/4.jpg"} alt="user" className="img-circle" /> </div>
                                <div className="sl-right">
                                  <div><Link to={"/user/receivedComment"} className="link"> {list.user.name} </Link> <span className="sl-date"></span>
                                    <blockquote className="m-t-10">
                                      {list.comment}
                                    </blockquote>
                                  </div>
                                </div>
                              </div>
                              <hr />
                            </>
                          )
                        })}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div>
          {/* <!-- ============================================================== --> */}

        </div>
        {/* <!-- ============================================================== --> */}
        {/* <!-- End Container fluid  --> */}
        {/* <!-- footer --> */}
        {/* <!-- ============================================================== --> */}
        <footer className="footer">
          © 2021 Vijay Physics
        </footer>
        {/* <!-- ============================================================== --> */}
        {/* <!-- End footer --> */}
        {/* <!-- ============================================================== --> */}
      </div>

    </div >
  )
}

export default Dashboard
