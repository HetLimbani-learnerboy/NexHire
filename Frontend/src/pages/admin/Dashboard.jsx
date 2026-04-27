import React, {
  useEffect,
  useMemo,
  useState
} from "react";

import { useOutletContext } from "react-router-dom";
import Navbar from "@/components/Navbar";
import DashboardCard from "@/components/DashboardCard";
import Skeleton from "@/components/Skeleton";
import { useAuth } from "../../context/AuthContext";

const API =
  "http://localhost:5001/api/dashboard";

function Dashboard() {
  const { user } = useAuth();
  const { setMobileOpen } =
    useOutletContext();

  const [loading, setLoading] =
    useState(true);

  const [cards, setCards] =
    useState({
      totalJobs: 0,
      activeVendors: 0,
      totalCandidates: 0,
      hiredThisMonth: 0
    });

  const [pipeline, setPipeline] =
    useState([]);

  const [activities, setActivities] =
    useState([]);

  const [vendors, setVendors] =
    useState([]);

  const [error, setError] =
    useState("");

  /* =======================================
     FETCH DATA
  ======================================= */
  const loadDashboard =
    async () => {
      try {
        setLoading(true);

        const res = await fetch(API);
        const data =
          await res.json();

        if (!data.success) {
          throw new Error(
            data.message
          );
        }

        setCards(data.cards);
        setPipeline(
          data.pipeline || []
        );
        setActivities(
          data.activities || []
        );
        setVendors(
          data.topVendors || []
        );
      } catch (err) {
        setError(
          err.message ||
            "Failed to load dashboard"
        );
      } finally {
        setLoading(false);
      }
    };

  useEffect(() => {
    loadDashboard();
  }, []);

  /* =======================================
     PIPELINE FORMAT
  ======================================= */
  const pipelineData =
    useMemo(() => {
      const total =
        pipeline.reduce(
          (sum, item) =>
            sum +
            Number(item.count),
          0
        ) || 1;

      return pipeline.map(
        (item) => ({
          stage:
            item.status,
          count:
            Number(
              item.count
            ),
          percent: Math.round(
            (Number(
              item.count
            ) /
              total) *
              100
          ),
          class:
            item.status
              .toLowerCase()
              .replaceAll(
                " ",
                "-"
              )
        })
      );
    }, [pipeline]);

  /* =======================================
     TIME FORMAT
  ======================================= */
  const getTimeAgo = (
    dateString
  ) => {
    const now =
      new Date();
    const old =
      new Date(
        dateString
      );

    const diff =
      Math.floor(
        (now - old) /
          60000
      );

    if (diff < 60)
      return `${diff} min ago`;

    if (diff < 1440)
      return `${Math.floor(
        diff / 60
      )} hr ago`;

    return `${Math.floor(
      diff / 1440
    )} day ago`;
  };

  /* =======================================
     LOADING
  ======================================= */
  if (loading) {
    return (
      <>
        <Navbar
          title="Dashboard"
          subtitle="Loading..."
          onHamburgerClick={() =>
            setMobileOpen(
              true
            )
          }
        />
        <div className="dashboard-page">
          <Skeleton type="dashboard" />
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar
        title={`Welcome back, ${
          user?.name?.split(
            " "
          )[0] ||
          "User"
        }`}
        subtitle="Hiring overview for today"
        onHamburgerClick={() =>
          setMobileOpen(
            true
          )
        }
      />

      <div className="dashboard-page">

        {error && (
          <div className="error-box">
            {error}
          </div>
        )}

        {/* Cards */}
        <div className="stats-row">

          <DashboardCard
            label="Total Jobs"
            value={
              cards.totalJobs
            }
            change="Live Data"
            changeType="positive"
            iconClass="blue"
          />

          <DashboardCard
            label="Active Vendors"
            value={
              cards.activeVendors
            }
            change="Live Data"
            changeType="positive"
            iconClass="green"
          />

          <DashboardCard
            label="Candidates"
            value={
              cards.totalCandidates
            }
            change="Live Data"
            changeType="positive"
            iconClass="purple"
          />

          <DashboardCard
            label="Hired This Month"
            value={
              cards.hiredThisMonth
            }
            change="Monthly"
            changeType="positive"
            iconClass="orange"
          />

        </div>

        {/* Middle Grid */}
        <div className="dashboard-grid">

          {/* Pipeline */}
          <div className="dashboard-card">

            <div className="dashboard-card-header">
              <h3>
                Hiring Pipeline
              </h3>

              <button
                className="btn btn-sm btn-outline"
                onClick={
                  loadDashboard
                }
              >
                Refresh
              </button>
            </div>

            <div className="dashboard-card-body">

              <div className="pipeline-stages">

                {pipelineData.map(
                  (
                    item,
                    idx
                  ) => (
                    <div
                      className="pipeline-stage"
                      key={idx}
                    >
                      <span className="pipeline-label">
                        {
                          item.stage
                        }
                      </span>

                      <div className="pipeline-bar-track">
                        <div
                          className={`pipeline-bar-fill ${item.class}`}
                          style={{
                            width: `${item.percent}%`
                          }}
                        >
                          {
                            item.count
                          }
                        </div>
                      </div>

                      <span className="pipeline-count">
                        {
                          item.percent
                        }
                        %
                      </span>
                    </div>
                  )
                )}

              </div>

            </div>
          </div>

          {/* Activities */}
          <div className="dashboard-card">

            <div className="dashboard-card-header">
              <h3>
                Recent Activity
              </h3>
            </div>

            <div className="dashboard-card-body">

              <div className="activity-list">

                {activities.map(
                  (
                    item,
                    idx
                  ) => (
                    <div
                      className="activity-item"
                      key={idx}
                    >
                      <div className="activity-dot green" />

                      <div className="activity-text">
                        <p>
                          {
                            item.remarks
                          }
                        </p>

                        <span>
                          {item.status} •{" "}
                          {getTimeAgo(
                            item.updated_at
                          )}
                        </span>
                      </div>
                    </div>
                  )
                )}

              </div>

            </div>
          </div>

        </div>

        {/* Top Vendors */}
        <div className="dashboard-card">

          <div className="dashboard-card-header">
            <h3>
              Top Performing Vendors
            </h3>
          </div>

          <div className="dashboard-card-body">

            <div className="vendor-perf-list">

              {vendors.map(
                (
                  v,
                  idx
                ) => (
                  <div
                    className="vendor-perf-item"
                    key={idx}
                  >
                    <div className="vendor-perf-avatar">
                      {
                        v.initials
                      }
                    </div>

                    <div className="vendor-perf-info">

                      <h4>
                        {
                          v.company_name
                        }
                      </h4>

                      <div className="vendor-perf-bar">
                        <div
                          className="vendor-perf-bar-fill"
                          style={{
                            width: `${v.rating}%`
                          }}
                        />
                      </div>

                    </div>

                    <span className="vendor-perf-score">
                      {v.rating}%
                    </span>
                  </div>
                ) 
              )}

            </div>

          </div>
        </div>

      </div>
    </>
  );
}

export default Dashboard;