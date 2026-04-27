import React, {
  useEffect,
  useMemo,
  useState
} from "react";

import { useOutletContext } from "react-router-dom";

import {
  FiPlus,
  FiTrash2,
  FiSearch,
  FiMapPin,
  FiFileText,
  FiPhone,
  FiMail,
  FiUser
} from "react-icons/fi";

import Navbar from "@/components/Navbar";
import Table from "@/components/Table";
import "@/styles/vendorstyle.css";

const API = "http://localhost:5001/api/vendors";

function Vendors() {
  const { setMobileOpen } = useOutletContext();

  const [vendors, setVendors] = useState([]);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("All");
  const [showModal, setShowModal] = useState(false);
  const [toast, setToast] = useState("");

  const [form, setForm] = useState({
    company_name: "",
    contact_person: "",
    email: "",
    phone: "",
    address: "",
    agreement_file: ""
  });

  /* ========================================= */
  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(""), 2200);
  };

  /* ========================================= */
  const loadData = async () => {
    const res = await fetch(API);
    const data = await res.json();

    if (data.success) {
      setVendors(data.vendors);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  /* ========================================= */
  const addVendor = async () => {
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
      showToast("Vendor Added");
      setShowModal(false);

      setForm({
        company_name: "",
        contact_person: "",
        email: "",
        phone: "",
        address: "",
        agreement_file: ""
      });

      loadData();
    } else {
      showToast(data.message);
    }
  };

  /* ========================================= */
  const deleteVendor = async (id) => {
    const ok = window.confirm(
      "Delete vendor?"
    );

    if (!ok) return;

    const res = await fetch(
      `${API}/${id}`,
      {
        method: "DELETE"
      }
    );

    const data = await res.json();

    if (data.success) {
      showToast("Vendor Deleted");
      loadData();
    }
  };

  /* ========================================= */
  const filtered = useMemo(() => {
    return vendors.filter((v) => {
      const matchSearch =
        v.company_name
          ?.toLowerCase()
          .includes(
            search.toLowerCase()
          ) ||
        v.contact_person
          ?.toLowerCase()
          .includes(
            search.toLowerCase()
          );

      const matchStatus =
        status === "All" ||
        v.status === status;

      return (
        matchSearch && matchStatus
      );
    });
  }, [vendors, search, status]);

  /* ========================================= */
  const columns = [
    "Vendor",
    "Contact",
    "Address",
    "Agreement",
    "Rating",
    "Status",
    "Actions"
  ];

  const renderRow = (v) => (
    <tr key={v.id}>
      <td>
        <div className="table-user">
          <div className="table-user-avatar">
            {v.company_name
              ?.charAt(0)
              ?.toUpperCase()}
          </div>

          <div className="table-user-info">
            <h4>
              {v.company_name}
            </h4>
            <p>
              #{v.id}
            </p>
          </div>
        </div>
      </td>

      <td>
        <div>
          <p>
            <FiUser />{" "}
            {v.contact_person}
          </p>
          <p>
            <FiMail /> {v.email}
          </p>
          <p>
            <FiPhone /> {v.phone}
          </p>
        </div>
      </td>

      <td>
        <p>
          <FiMapPin />{" "}
          {v.address ||
            "Not Added"}
        </p>
      </td>

  <td>
  {v.agreement_file ? (
    <button
      type="button"
      className="badge badge-info"
      onClick={() =>
        alert(
          "Agreement file preview/download functionality will be available in Phase 2."
        )
      }
    >
      <FiFileText />
      View
    </button>
  ) : (
    <span className="badge badge-neutral">
      No File
    </span>
  )}
</td>

      <td>
        <span className="badge badge-warning">
          ⭐ {v.rating}
        </span>
      </td>

      <td>
        <span
          className={`badge ${
            v.status ===
            "active"
              ? "badge-success"
              : "badge-danger"
          }`}
        >
          {v.status}
        </span>
      </td>

      <td>
        <div className="table-actions">
          <button
            className="table-action-btn danger"
            onClick={() =>
              deleteVendor(
                v.id
              )
            }
          >
            <FiTrash2 />
          </button>
        </div>
      </td>
    </tr>
  );

  /* ========================================= */
  return (
    <>
      <Navbar
        title="Vendors"
        subtitle="Manage Vendor Partners"
        onHamburgerClick={() =>
          setMobileOpen(true)
        }
      />

      <div className="dashboard-page">

        <div className="page-header">
          <div>
            <h2>
              All Vendors (
              {
                filtered.length
              }
              )
            </h2>

            <p>
              Add and manage
              all recruitment
              vendors
            </p>
          </div>

          <button
            className="btn btn-primary"
            onClick={() =>
              setShowModal(true)
            }
          >
            <FiPlus />
            Add Vendor
          </button>
        </div>

        <div className="filter-bar">

          <div className="search-bar">
            <FiSearch />
            <input
              placeholder="Search vendor..."
              value={search}
              onChange={(e) =>
                setSearch(
                  e.target.value
                )
              }
            />
          </div>

          <select
            className="filter-select"
            value={status}
            onChange={(e) =>
              setStatus(
                e.target.value
              )
            }
          >
            <option>
              All
            </option>
            <option value="active">
              active
            </option>
            <option value="inactive">
              inactive
            </option>
          </select>

        </div>

        <Table
          columns={columns}
          data={filtered}
          renderRow={renderRow}
          currentPage={1}
          totalPages={1}
          onPageChange={() => {}}
        />

        {/* Modal */}

        {showModal && (
          <div className="modal-overlay">
            <div className="modal-content">

              <div className="modal-header">
                <h2>
                  Add Vendor
                </h2>

                <button
                  className="modal-close"
                  onClick={() =>
                    setShowModal(
                      false
                    )
                  }
                >
                  ✕
                </button>
              </div>

              <div className="modal-body">

                <input
                  className="form-input"
                  placeholder="Company Name"
                  value={
                    form.company_name
                  }
                  onChange={(e) =>
                    setForm({
                      ...form,
                      company_name:
                        e.target
                          .value
                    })
                  }
                />

                <input
                  className="form-input"
                  placeholder="Contact Person"
                  value={
                    form.contact_person
                  }
                  onChange={(e) =>
                    setForm({
                      ...form,
                      contact_person:
                        e.target
                          .value
                    })
                  }
                />

                <input
                  className="form-input"
                  placeholder="Email"
                  value={
                    form.email
                  }
                  onChange={(e) =>
                    setForm({
                      ...form,
                      email:
                        e.target
                          .value
                    })
                  }
                />

                <input
                  className="form-input"
                  placeholder="Phone"
                  value={
                    form.phone
                  }
                  onChange={(e) =>
                    setForm({
                      ...form,
                      phone:
                        e.target
                          .value
                    })
                  }
                />

                <input
                  className="form-input"
                  placeholder="Address"
                  value={
                    form.address
                  }
                  onChange={(e) =>
                    setForm({
                      ...form,
                      address:
                        e.target
                          .value
                    })
                  }
                />

                <input
                  className="form-input"
                  placeholder="Agreement File URL"
                  value={
                    form.agreement_file
                  }
                  onChange={(e) =>
                    setForm({
                      ...form,
                      agreement_file:
                        e.target
                          .value
                    })
                  }
                />

              </div>

              <div className="modal-footer">
                <button
                  className="btn btn-success"
                  onClick={
                    addVendor
                  }
                >
                  Save Vendor
                </button>
              </div>

            </div>
          </div>
        )}

        {toast && (
          <div className="toast">
            {toast}
          </div>
        )}

      </div>
    </>
  );
}

export default Vendors;