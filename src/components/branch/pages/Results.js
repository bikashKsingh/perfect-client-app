import React, { useState, useEffect, useMemo } from "react";
import M from "materialize-css";
import $ from "jquery";
import { Link, useHistory } from "react-router-dom";
import Config from "../../config/Config";
import { useTable, useSortBy, useGlobalFilter, usePagination } from "react-table";
import { format } from 'date-fns';

const GlobalFilter = ({ filter, setFilter }) => {
    return (
        <span className={""}>
            <input placeholder={"Query Here!"} className={"py-1 px-3"} value={filter || ""} onChange={(e) => setFilter(e.target.value)} />
        </span>
    )
}

//  Component Function
const Results = React.memo((props) => {
    const [addingFormData, setAddingFormData] = useState({
        name: "",
        total_questions: "",
        question_type: "",
        total_marks: "",
        date: "",
        duration: "",
        standard: "",
        course_type: "",
        session: "",
        standard: "",
        comment: "",
        status: 0
    });
    const history = useHistory();
    const [selectBatch, setSelectBatch] = useState([]);
    const [selectedSession, setSelectedSession] = useState(localStorage.getItem("branchSession") || "");
    const [allStandard, setAllStandard] = useState([]);
    const [allCourseType, setAllCourseType] = useState([]);
    const [allBatch, setAllBatch] = useState([]);
    const [isAddLaoded, setIsAddLaoded] = useState(true);
    const [isUpdateLaoded, setIsUpdateLaoded] = useState(true);
    const [isDeleteLaoded, setIsDeleteLaoded] = useState(true);
    const [isAdded, setIsAdded] = useState(false);
    const [isallOnlineTestLoaded, setIsallOnlineTestLoaded] = useState(false);
    const [allOnlineTest, setAllOnlineTest] = useState([]);
    const [data, setData] = useState({});
    const [isUpdated, setIsUpdated] = useState(false);
    const [isDeleted, setIsDeleted] = useState(false);
    const [deleteId, setDeleteId] = useState("");

    // Update the state while clicking the edit button
    const updateState = (list) => {
        console.log(list)
        setData({ ...list });
    };


    // Get Data From Database
    useEffect(() => {
        fetch(Config.SERVER_URL + "/branch/searchOnlineTest?session=" + selectedSession, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("jwt_branch_token")}`,
            },
        })
            .then((res) => res.json())
            .then(
                (result) => {
                    setIsallOnlineTestLoaded(true);
                    if (result.success) {
                        setAllOnlineTest(result.data || []);
                    } else {
                        M.toast({ html: result.message, classes: "bg-danger" });
                    }
                },
                (error) => {
                    M.toast({ html: error, classes: "bg-danger" });
                    setIsallOnlineTestLoaded(true);
                }
            );

        // Get All Standard
        fetch(Config.SERVER_URL + "/branch/searchStandard?session=" + selectedSession, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("jwt_branch_token")}`,
            },
        })
            .then((res) => res.json())
            .then(
                (result) => {
                    // setIsAllCourseTypeLoaded(false);
                    if (result.success) {
                        setAllStandard(result.data || []);
                        //   console.log(allCourseType);
                    } else {
                        M.toast({ html: result.message, classes: "bg-danger" });
                        if (result.session) M.toast({ html: result.session, classes: "bg-danger" });
                    }
                },
                (error) => {
                    M.toast({ html: error, classes: "bg-danger" });
                    // setIsAllCourseTypeLoaded(false);
                }
            );


    }, []);


    // Create Column for Table
    const COLUMNS = [
        {
            Header: "#SN",
            accessor: "",
            Cell: (({ row }) => { return (Number(row.id) + 1) })
        },
        {
            Header: "NAME",
            accessor: "name",
        },
        {
            Header: "TOTAL QUES",
            accessor: "total_questions",
        },
        {
            Header: "ADDED QUES",
            accessor: "questions",
            Cell: ({ value }) => { return value.length }
        },
        {
            Header: "TOTAL MARKS",
            accessor: "total_marks",
        },
        {
            Header: "STANDARD",
            accessor: "standard.name",
        },
        {
            Header: "COURSE TYPE",
            accessor: "course_type.name",
        },

        {
            Header: "CREATED DATE",
            accessor: "created_date",
            Cell: ({ value }) => { return format(new Date(value), "dd/MM/yyyy") }
        },
        {
            Header: "STATUS",
            accessor: "status",
            // disableSortBy: true,
            Cell: row => {
                const status = row.row.original.status;

                return (
                    <span>
                        {status ? <span className={"badge badge-info"}>Active</span> : <span className={"badge badge-danger"}>Disable</span>}
                    </span>
                )
            }
        },
        {
            Header: "ACTION",
            accessor: "",
            disableSortBy: true,
            Cell: (({ row }) => {

                return (
                    <div>

                        {/* Check Result */}
                        <Link
                            type="button"
                            title={"Result"}
                            className="ml-2 btn btn-danger footable-delete"
                            to={`/branch/result/${row.original._id}`}
                        >
                            Check Result
                        </Link>
                    </div >
                )
            })
        },
    ];

    const columns = useMemo(() => COLUMNS, []);
    const rows_data = useMemo(() => allOnlineTest, [allOnlineTest]);
    const tableInstance = useTable(
        {
            columns,
            data: rows_data,
        },
        useGlobalFilter, useSortBy, usePagination
    );

    // destructuring the table instance
    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        page,
        prepareRow,
        state,
        nextPage,
        previousPage,
        canNextPage,
        canPreviousPage,
        pageOptions,
        gotoPage,
        pageCount,
        setPageSize,
        setGlobalFilter
    } = tableInstance;

    // Destructuring the state
    const { globalFilter } = state;
    // Destructuring the state
    const { pageIndex, pageSize } = state;
    // Return function
    return (
        <div className="page-wrapper">
            <div className={"container-fluid"}>
                {/* Bread crumb and right sidebar toggle */}
                <div className="row page-titles">
                    <div className="col-md-5 col-8 align-self-center">
                        <h3 className="text-themecolor m-b-0 m-t-0">Manage Test Result</h3>
                        <ol className="breadcrumb">
                            <li className="breadcrumb-item">
                                <Link to="/branch">Branch</Link>
                            </li>
                            <li className="breadcrumb-item active">Results</li>
                        </ol>
                    </div>
                </div>

                {/* End Bread crumb and right sidebar toggle */}
                <div className={"row page-titles shadow-none p-0"} style={{ background: "none" }}>
                    <div className={"col-md-12 px-0"}>
                        {/* Heading */}
                        <div className={"card mb-0 mt-2 border-0 rounded-0"}>
                            <div className={"card-body pb-0 pt-2"}>
                                <div>
                                    <h4 className="float-left mt-2 mr-2">Search: {" "} </h4>
                                    <GlobalFilter filter={globalFilter} setFilter={setGlobalFilter} />
                                    {/* <!-- Button trigger modal --> */}

                                </div>
                            </div>
                        </div>

                        {/* Data */}
                        {isallOnlineTestLoaded ? (
                            <div className="card border-0 rounded-0 m-0 py-1">
                                {allOnlineTest.length ? (
                                    <div className="card-body py-0">
                                        <div className="table-responsive">

                                            <table
                                                {...getTableProps()}
                                                className={"table table-bordered table-striped my-0"}
                                            >
                                                <thead>
                                                    {
                                                        // Loop over the header rows
                                                        headerGroups.map((headerGroup) => (
                                                            // Apply the header row props
                                                            <tr {...headerGroup.getHeaderGroupProps()}>
                                                                {
                                                                    // Loop over the headers in each row
                                                                    headerGroup.headers.map((column) => (
                                                                        // Apply the header cell props
                                                                        <th {...column.getHeaderProps(column.getSortByToggleProps())}>
                                                                            {
                                                                                // Render the header
                                                                                column.render("Header")
                                                                            }
                                                                            <span>
                                                                                {column.isSorted ? (column.isSortedDesc ? ' 🔽' : ' 🔼') : ''}
                                                                            </span>
                                                                        </th>
                                                                    ))
                                                                }
                                                            </tr>
                                                        ))
                                                    }
                                                </thead>
                                                <tbody {...getTableBodyProps()}>
                                                    {page.map((row) => {
                                                        prepareRow(row);
                                                        return (
                                                            <tr {...row.getRowProps()}>
                                                                {row.cells.map((cell) => {
                                                                    return (
                                                                        <td {...cell.getCellProps()}>
                                                                            {" "}
                                                                            {cell.render("Cell")}{" "}
                                                                        </td>
                                                                    );
                                                                })}
                                                            </tr>
                                                        );
                                                    })}
                                                </tbody>
                                            </table>
                                            <div>
                                                <span>
                                                    Page:{' '}
                                                    <strong>
                                                        {pageIndex + 1} of {pageOptions.length}
                                                    </strong>
                                                </span>
                                                <select value={pageSize} onChange={(e) => setPageSize(e.target.value)}>
                                                    {
                                                        [10, pageCount * 10].map((val, i) => {
                                                            return (
                                                                <option key={i} value={val}> {val} </option>
                                                            )
                                                        })
                                                    }
                                                </select>
                                                <button onClick={() => gotoPage(0)} disabled={!canPreviousPage}> {'<<'} </button>
                                                <button onClick={() => previousPage()} disabled={!canPreviousPage} >Previous</button>
                                                <button onClick={() => nextPage()} disabled={!canNextPage} >Next</button>
                                                <button onClick={() => gotoPage(pageCount - 1)} disabled={!canNextPage}> {'>>'} </button>
                                            </div>

                                        </div>
                                    </div>
                                ) : (
                                    <div
                                        className={
                                            "alert alert-danger mx-3 rounded-0 border-0 py-2"
                                        }
                                    >
                                        No Data Available
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className={"bg-white p-3 text-center"}>
                                <span
                                    className="spinner-border spinner-border-sm mr-1"
                                    role="status"
                                    aria-hidden="true"
                                ></span>
                                Loading..
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
});

export default Results;
