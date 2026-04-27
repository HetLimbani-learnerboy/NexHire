import React, { useEffect, useMemo, useState } from "react";
import { useOutletContext } from "react-router-dom";
import {
  FiEye,
  FiEdit2,
  FiX,
  FiArrowRight,
  FiPlus,
  FiSearch,
  FiSave,
  FiRefreshCw,
  FiUser,
  FiMail,
  FiPhone,
  FiBriefcase,
  FiLayers
} from "react-icons/fi";

import Navbar from "@/components/Navbar";
import Table from "@/components/Table";
import Loader from "@/components/Loader";
import "@/styles/forms.css";

const API = "http://localhost:5001/api/candidates";

function Candidates() {
  const { setMobileOpen } = useOutletContext();

  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [btnLoading, setBtnLoading] = useState(false);

  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showResumeModal, setShowResumeModal] = useState(false);

  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [resumeData, setResumeData] = useState(null);

  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const stages = [
    "Submitted",
    "Screened",
    "Interview",
    "Offered",
    "Hired"
  ];

  const emptyForm = {
    full_name: "",
    email: "",
    phone: "",
    vendor_id: "",
    job_id: "",
    skills: ""
  };

  const [form, setForm] = useState(emptyForm);

  /* ===================================
     LOAD DATA
  =================================== */

  const loadCandidates = async () => {
    try {
      setLoading(true);

      const res = await fetch(
        `${API}?search=${searchQuery}&status=${filterStatus}`
      );

      const data = await res.json();

      if (data.success) {
        setCandidates(data.candidates || []);
      }
    } catch (err) {
      setError("Failed to load candidates");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCandidates();
  }, [searchQuery, filterStatus]);

  /* ===================================
     TOAST
  =================================== */

  const showToast = (text) => {
    setMessage(text);

    setTimeout(() => {
      setMessage("");
    }, 2500);
  };

  /* ===================================
     FORM CHANGE
  =================================== */

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  /* ===================================
     ADD
  =================================== */

  const submitCandidate = async () => {
    try {
      setBtnLoading(true);

      const res = await fetch(API, {
        method: "POST",
        headers: {
          "Content-Type":
            "application/json"
        },
        body: JSON.stringify(form)
      });

      const data = await res.json();

      if (data.success) {
        setShowAddModal(false);
        setForm(emptyForm);
        showToast("Candidate submitted");
        loadCandidates();
      } else {
        setError(data.message);
      }
    } catch {
      setError("Failed to submit");
    } finally {
      setBtnLoading(false);
    }
  };

  /* ===================================
     EDIT OPEN
  =================================== */

  const openEdit = (row) => {
    setSelectedCandidate(row);

    setForm({
      full_name: row.full_name || "",
      email: row.email || "",
      phone: row.phone || "",
      vendor_id:
        row.vendor_id || "",
      job_id:
        row.job_id || "",
      skills:
        row.skills || ""
    });

    setShowEditModal(true);
  };

  /* ===================================
     EDIT SAVE
  =================================== */

  const updateCandidate = async () => {
    try {
      setBtnLoading(true);

      const res = await fetch(
        `${API}/${selectedCandidate.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type":
              "application/json"
          },
          body: JSON.stringify(form)
        }
      );

      const data = await res.json();

      if (data.success) {
        setShowEditModal(false);
        showToast("Candidate updated");
        loadCandidates();
      } else {
        setError(data.message);
      }
    } catch {
      setError("Update failed");
    } finally {
      setBtnLoading(false);
    }
  };

  /* ===================================
     REJECT
  =================================== */

  const rejectCandidate = async (
    id
  ) => {
    await fetch(
      `${API}/${id}/reject`,
      { method: "PUT" }
    );

    showToast("Candidate rejected");
    loadCandidates();
  };

  /* ===================================
     NEXT STAGE
  =================================== */

  const moveStage = async (
    row
  ) => {
    const index =
      stages.indexOf(
        row.status
      );

    if (
      index === -1 ||
      row.status ===
        "Rejected" ||
      row.status ===
        "Hired"
    )
      return;

    const next =
      stages[index + 1];

    await fetch(
      `${API}/${row.id}/status`,
      {
        method: "PUT",
        headers: {
          "Content-Type":
            "application/json"
        },
        body: JSON.stringify({
          status: next
        })
      }
    );

    showToast(
      `Moved to ${next}`
    );

    loadCandidates();
  };

  /* ===================================
     RESUME
  =================================== */

  const openResume = async (
    row
  ) => {
    setSelectedCandidate(row);

    const res = await fetch(
      `${API}/${row.id}/resume`
    );

    const data =
      await res.json();

    if (data.success) {
      setResumeData(
        data.data
      );

      setShowResumeModal(
        true
      );
    }
  };

  /* ===================================
     COUNTS
  =================================== */

  const statusCounts =
    useMemo(() => {
      const obj = {};

      candidates.forEach(
        (item) => {
          obj[
            item.status
          ] =
            (obj[
              item.status
            ] || 0) + 1;
        }
      );

      return obj;
    }, [candidates]);

  /* ===================================
     BADGE
  =================================== */

  const badge = (status) => {
    const cls = {
      Submitted:
        "badge-neutral",
      Screened:
        "badge-info",
      Interview:
        "badge-warning",
      Offered:
        "badge-success",
      Hired:
        "badge-success",
      Rejected:
        "badge-danger"
    };

    return (
      <span
        className={`badge ${cls[status]}`}
      >
        {status}
      </span>
    );
  };

  /* ===================================
     TABLE
  =================================== */

  const columns = [
    "Candidate",
    "Job",
    "Vendor",
    "Date",
    "Resume",
    "Status",
    "Actions"
  ];

  const renderRow = (
    row
  ) => (
    <tr key={row.id}>
      <td>
        <div className="table-user">
          <div className="table-user-avatar">
            {row.full_name
              ?.split(
                " "
              )
              .map(
                (w) =>
                  w[0]
              )
              .join(
                ""
              )}
          </div>

          <div className="table-user-info">
            <h4>
              {row.full_name}
            </h4>
            <p>
              {row.email}
            </p>
          </div>
        </div>
      </td>

      <td>{row.job_title}</td>
      <td>{row.vendor_name}</td>

      <td>
        {new Date(
          row.created_at
        ).toLocaleDateString()}
      </td>

      <td>
        <button
          className="badge badge-info"
          onClick={() =>
            openResume(
              row
            )
          }
        >
          Parse
        </button>
      </td>

      <td>
        {badge(
          row.status
        )}
      </td>

      <td>
        <div className="table-actions">

          <button
            className="table-action-btn"
            title="View Resume"
            onClick={() =>
              openResume(
                row
              )
            }
          >
            <FiEye />
          </button>

          <button
            className="table-action-btn"
            title="Edit"
            onClick={() =>
              openEdit(
                row
              )
            }
          >
            <FiEdit2 />
          </button>

          <button
            className="table-action-btn"
            title="Move Stage"
            onClick={() =>
              moveStage(
                row
              )
            }
          >
            <FiArrowRight />
          </button>

          <button
            className="table-action-btn danger"
            title="Reject"
            onClick={() =>
              rejectCandidate(
                row.id
              )
            }
          >
            <FiX />
          </button>

        </div>
      </td>
    </tr>
  );

  if (loading)
    return (
      <Loader fullPage />
    );

  return (
    <>
      <Navbar
        title="Candidates"
        subtitle="Manage hiring pipeline"
        onHamburgerClick={() =>
          setMobileOpen(
            true
          )
        }
      />

      <div className="dashboard-page">

        {message && (
          <div className="success-box">
            {message}
          </div>
        )}

        {error && (
          <div className="error-box">
            {error}
          </div>
        )}

        {/* Stats */}

        <div className="stats-row">

          {[
            "Submitted",
            "Screened",
            "Interview",
            "Offered",
            "Hired",
            "Rejected"
          ].map(
            (
              item
            ) => (
              <div
                key={
                  item
                }
                className="stat-card"
                onClick={() =>
                  setFilterStatus(
                    filterStatus ===
                      item
                      ? "All"
                      : item
                  )
                }
              >
                <div className="stat-info">
                  <h3>
                    {item}
                  </h3>

                  <p className="stat-number">
                    {statusCounts[
                      item
                    ] ||
                      0}
                  </p>
                </div>
              </div>
            )
          )}

        </div>

        {/* Header */}

        <div className="page-header">
          <div>
            <h2>
              Candidates (
              {
                candidates.length
              }
              )
            </h2>

            <p>
              Search,
              edit,
              track
              and
              manage
              candidates
            </p>
          </div>

          <button
            className="btn btn-primary"
            onClick={() =>
              setShowAddModal(
                true
              )
            }
          >
            <FiPlus />
            Add Candidate
          </button>
        </div>

        {/* Filters */}

        <div className="filter-bar">

          <div className="search-bar">
            <FiSearch />

            <input
              type="text"
              placeholder="Search candidate / job / vendor"
              value={
                searchQuery
              }
              onChange={(
                e
              ) =>
                setSearchQuery(
                  e
                    .target
                    .value
                )
              }
            />
          </div>

          <select
            className="filter-select"
            value={
              filterStatus
            }
            onChange={(
              e
            ) =>
              setFilterStatus(
                e
                  .target
                  .value
              )
            }
          >
            <option>
              All
            </option>
            <option>
              Submitted
            </option>
            <option>
              Screened
            </option>
            <option>
              Interview
            </option>
            <option>
              Offered
            </option>
            <option>
              Hired
            </option>
            <option>
              Rejected
            </option>
          </select>

          <button
            className="btn btn-outline"
            onClick={
              loadCandidates
            }
          >
            <FiRefreshCw />
          </button>

        </div>

        {/* Table */}

        <Table
          columns={
            columns
          }
          data={
            candidates
          }
          renderRow={
            renderRow
          }
          currentPage={1}
          totalPages={1}
          onPageChange={() => {}}
        />

        {/* =====================
            FORM MODAL
        ===================== */}

        {(showAddModal ||
          showEditModal) && (
          <div
            className="modal-overlay"
            onClick={() => {
              setShowAddModal(
                false
              );
              setShowEditModal(
                false
              );
            }}
          >
            <div
              className="modal-content"
              onClick={(
                e
              ) =>
                e.stopPropagation()
              }
            >
              <div className="modal-header">
                <h2>
                  {showEditModal
                    ? "Edit Candidate"
                    : "Add Candidate"}
                </h2>

                <button
                  className="modal-close"
                  onClick={() => {
                    setShowAddModal(
                      false
                    );
                    setShowEditModal(
                      false
                    );
                  }}
                >
                  <FiX />
                </button>
              </div>

              <div className="modal-body">

                <input
                  name="full_name"
                  className="form-input"
                  placeholder="Full Name"
                  value={
                    form.full_name
                  }
                  onChange={
                    handleChange
                  }
                />

                <input
                  name="email"
                  className="form-input"
                  placeholder="Email"
                  value={
                    form.email
                  }
                  onChange={
                    handleChange
                  }
                />

                <input
                  name="phone"
                  className="form-input"
                  placeholder="Phone"
                  value={
                    form.phone
                  }
                  onChange={
                    handleChange
                  }
                />

                <input
                  name="vendor_id"
                  className="form-input"
                  placeholder="Vendor ID"
                  value={
                    form.vendor_id
                  }
                  onChange={
                    handleChange
                  }
                />

                <input
                  name="job_id"
                  className="form-input"
                  placeholder="Job ID"
                  value={
                    form.job_id
                  }
                  onChange={
                    handleChange
                  }
                />

                <input
                  name="skills"
                  className="form-input"
                  placeholder="Skills"
                  value={
                    form.skills
                  }
                  onChange={
                    handleChange
                  }
                />

              </div>

              <div className="modal-footer">

                <button
                  className="btn btn-outline"
                  onClick={() => {
                    setShowAddModal(
                      false
                    );
                    setShowEditModal(
                      false
                    );
                  }}
                >
                  Cancel
                </button>

                <button
                  className="btn btn-success"
                  disabled={
                    btnLoading
                  }
                  onClick={
                    showEditModal
                      ? updateCandidate
                      : submitCandidate
                  }
                >
                  {btnLoading ? (
                    <>
                      <Loader
                        size={
                          18
                        }
                      />
                    </>
                  ) : (
                    <>
                      <FiSave />
                      Save
                    </>
                  )}
                </button>

              </div>
            </div>
          </div>
        )}

        {/* =====================
            RESUME MODAL
        ===================== */}

        {showResumeModal &&
          resumeData && (
            <div
              className="modal-overlay"
              onClick={() =>
                setShowResumeModal(
                  false
                )
              }
            >
              <div
                className="modal-content"
                onClick={(
                  e
                ) =>
                  e.stopPropagation()
                }
              >
                <div className="modal-header">
                  <h2>
                    Resume Details
                  </h2>

                  <button
                    className="modal-close"
                    onClick={() =>
                      setShowResumeModal(
                        false
                      )
                    }
                  >
                    <FiX />
                  </button>
                </div>

                <div className="modal-body">

                  <p>
                    <FiUser />{" "}
                    {
                      resumeData.name
                    }
                  </p>

                  <p>
                    <FiBriefcase />{" "}
                    {
                      resumeData.experience
                    }
                  </p>

                  <p>
                    <FiLayers />{" "}
                    {
                      resumeData.company
                    }
                  </p>

                  <p>
                    <FiMail />{" "}
                    {
                      selectedCandidate.email
                    }
                  </p>

                  <div className="skill-wrap">
                    {resumeData.skills.map(
                      (
                        item,
                        index
                      ) => (
                        <span
                          key={
                            index
                          }
                          className="badge badge-info"
                        >
                          {
                            item
                          }
                        </span>
                      )
                    )}
                  </div>

                </div>

                <div className="modal-footer">
                  <button
                    className="btn btn-outline"
                    onClick={() =>
                      setShowResumeModal(
                        false
                      )
                    }
                  >
                    Close
                  </button>
                </div>

              </div>
            </div>
          )}

      </div>
    </>
  );
}

export default Candidates;