import React, { Fragment, createContext, useReducer, useContext, useEffect } from "react"
import { BrowserRouter as Router, Route, Switch, useHistory } from "react-router-dom"
import LeftNavigation from "./LeftNavigation"
import TopNavigation from "./TopNavigation"
import Dashboard from "./pages/Dashboard"
import Login from "./pages/Login"
import { initialState, branchReducer } from "../../reducer/branchReducer"
import Profile from "./pages/Profile"
import PageNoteFound from "./pages/PageNotFound"
import Session from "./pages/Session"
import Standard from "./pages/Standard"
import Subject from "./pages/Subject"
import CourseType from "./pages/CourseType"
import Batch from "./pages/Batch"
import StudentRegistration from "./pages/StudentRegistration"
import TakePicture from "./pages/TakePicture"
import StudentInquiry from "./pages/StudentInquiry"
import Staff from "./pages/Staff"
import StaffRights from "./pages/StaffRights"
import LiveClass from "./pages/LiveClass"
import QuestionType from "./pages/QuestionType"
import Questions from "./pages/Questions"
import Chapter from "./pages/Chapter"
import OnlineTest from "./pages/OnlineTest"
import AddQuestionToOnlineTest from "./pages/AddQuestionToTest"
import Video from "./pages/Video"
import ChapterLayouts from "./pages/ChapterLayouts"
import FormulaCharts from "./pages/FormulaCharts"
import Assignments from "./pages/Assignments"
import OnlineTestDetails from "./pages/OnlineTestDetails"
import Results from "./pages/Results"
import Result from "./pages/Result"



// Create Context
export const BranchContext = createContext();

// Create Context
const Routing = () => {
  const history = useHistory()
  // Branch Context
  const { state, dispatch } = useContext(BranchContext)
  useEffect(() => {
    const branch = JSON.parse(localStorage.getItem("branch"))
    if (branch) {
      dispatch({ type: "BRANCH", payload: branch })
      // history.push("/")
    } else {
      history.push("/branch/login")
    }
  }, [])

  return (
    <Switch>
      <Route exact path="/branch" component={Dashboard} />
      <Route exact path="/branch/dashboard" component={Dashboard} />
      <Route exact path="/branch/login" component={Login} />
      <Route exact path="/branch/liveClassSetup" component={LiveClass} />
      <Route exact path="/branch/profile" component={Profile} />
      <Route exact path="/branch/session" component={Session} />
      <Route exact path="/branch/standard" component={Standard} />
      <Route exact path="/branch/subject" component={Subject} />
      <Route exact path="/branch/courseType" component={CourseType} />
      <Route exact path="/branch/questionType" component={QuestionType} />
      <Route exact path="/branch/questions" component={Questions} />
      <Route exact path="/branch/onlineTest" component={OnlineTest} />
      <Route exact path="/branch/onlineTestDetails/:testId" component={OnlineTestDetails} />
      <Route exact path="/branch/AddQuestionToOnlineTest" component={AddQuestionToOnlineTest} />
      <Route exact path="/branch/video" component={Video} />
      <Route exact path="/branch/chapter" component={Chapter} />
      <Route exact path="/branch/batch" component={Batch} />
      <Route exact path="/branch/studentRegistration" component={StudentRegistration} />
      <Route exact path="/branch/takePicture" component={TakePicture} />
      <Route exact path="/branch/studentInquiry" component={StudentInquiry} />
      <Route exact path="/branch/chapterLayouts" component={ChapterLayouts} />
      <Route exact path="/branch/formulaCharts" component={FormulaCharts} />
      <Route exact path="/branch/assignments" component={Assignments} />
      <Route exact path="/branch/staff" component={Staff} />
      <Route exact path="/branch/staffRights" component={StaffRights} />


      {/* Result */}
      <Route exact path="/branch/results" component={Results} />
      <Route exact path="/branch/result/:id" component={Result} />

      {/* Page Not Found */}
      <Route exact path="/*" component={PageNoteFound} />
    </Switch>
  );
};


const Branch = () => {
  const [state, dispatch] = useReducer(branchReducer, initialState);
  return (
    <div id="main-wrapper">
      <BranchContext.Provider value={{ state: state, dispatch: dispatch }}>
        <Router>
          <TopNavigation />
          <LeftNavigation />
          <Routing />
        </Router>
      </BranchContext.Provider>
    </div>
  );
};

export default Branch;
