import { CSVLink } from "react-csv";

import { useEffect, useState } from "react";

import API from "../api";

function Dashboard() {

  const role =
    localStorage.getItem("role");

  const [leads, setLeads] =
    useState<any[]>([]);

  const [name, setName] =
    useState("");

  const [email, setEmail] =
    useState("");

  const [status, setStatus] =
    useState("New");

  const [source, setSource] =
    useState("Website");

  const [search, setSearch] =
    useState("");

  const [filterStatus, setFilterStatus] =
    useState("");

  const [filterSource, setFilterSource] =
    useState("");

  const [page, setPage] =
    useState(1);

  const [totalPages, setTotalPages] =
    useState(1);

  const [editId, setEditId] =
    useState("");

  const [isEditing, setIsEditing] =
    useState(false);

  const [loading, setLoading] =
    useState(false);

  const getLeads = async () => {

    setLoading(true);

    try {

      const token =
        localStorage.getItem("token");

      const res = await API.get(
  `/leads?search=${search}&status=${filterStatus}&source=${filterSource}&page=${page}`,
  {
    headers: {
      authorization: token,
    },
  }
);

      setLeads(res.data.leads);
      setTotalPages(res.data.totalPages);

      setLoading(false);

    } catch (error) {

      setLoading(false);
      console.log(error);

    }
  };

  const createLead = async () => {

    try {

      const token =
        localStorage.getItem("token");

      await API.post(
        "/leads",
        {
          name,
          email,
          status,
          source,
        },
        {
          headers: {
            authorization: token,
          },
        }
      );

      alert("Lead Created");

      getLeads();

    } catch (error) {

      console.log(error);

    }
  };

  useEffect(() => {
    getLeads();
  }, [
    search,
    filterStatus,
    filterSource,
    page,
]);

  const deleteLead = async (
  id: string
) => {

  try {

    const token =
      localStorage.getItem("token");

    await API.delete(
      `/leads/${id}`,
      {
        headers: {
          authorization: token,
        },
      }
    );

    alert("Lead Deleted");

    getLeads();

  } catch (error) {

    console.log(error);

  }
};

const updateLead = async () => {

  try {

    const token =
      localStorage.getItem("token");

    await API.put(
      `/leads/${editId}`,
      {
        name,
        email,
        status,
        source,
      },
      {
        headers: {
          authorization: token,
        },
      }
    );

    alert("Lead Updated");

    setIsEditing(false);

    getLeads();

  } catch (error) {

    console.log(error);

    alert("Update Failed");
  }
};

const logout = () => {

  localStorage.removeItem(
    "token"
  );

  localStorage.removeItem(
    "role"
  );

  window.location.href = "/";
};

return (
  <div className="min-h-screen bg-gray-100 p-6">

    <div className="flex justify-between items-center mb-6">

    <h1 className="text-4xl font-bold">
      Leads Dashboard
    </h1>

    <button
      className="bg-black text-white px-4 py-2 rounded"
      onClick={logout}
    >
      Logout
    </button>

    </div>

    <div className="bg-white p-6 rounded shadow mb-6">

      <div className="flex gap-4 mb-4">

        <input
          type="text"
          placeholder="Search"
          className="border p-2 rounded"
          onChange={(e) =>
            setSearch(e.target.value)
          }
        />

        <select
          className="border p-2 rounded"
          onChange={(e) =>
            setFilterStatus(
              e.target.value
            )
          }
        >
          <option value="">
            All Status
          </option>

          <option>New</option>
          <option>Contacted</option>
          <option>Qualified</option>
          <option>Lost</option>

        </select>

        <select
          className="border p-2 rounded"
          onChange={(e) =>
            setFilterSource(
              e.target.value
            )
          }
        >
          <option value="">
            All Sources
          </option>

          <option>Website</option>
          <option>Instagram</option>
          <option>Referral</option>

        </select>

      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">

        <input
          type="text"
          placeholder="Name"
          value={name}
          className="border p-2 rounded"
          onChange={(e) =>
            setName(e.target.value)
          }
        />

        <input
          type="email"
          placeholder="Email"
          value={email}
          className="border p-2 rounded"
          onChange={(e) =>
            setEmail(e.target.value)
          }
        />

        <select
          className="border p-2 rounded"
          onChange={(e) =>
            setStatus(
              e.target.value
            )
          }
        >
          <option>New</option>
          <option>Contacted</option>
          <option>Qualified</option>
          <option>Lost</option>
        </select>

        <select
          className="border p-2 rounded"
          onChange={(e) =>
            setSource(
              e.target.value
            )
          }
        >
          <option>Website</option>
          <option>Instagram</option>
          <option>Referral</option>
        </select>

      </div>

      <div className="flex gap-4 mb-4">

        <button
          className="bg-blue-500 text-white px-4 py-2 rounded"

          onClick={
            isEditing
              ? updateLead
              : createLead
          }
        >

          {isEditing
            ? "Update Lead"
            : "Create Lead"}

        </button>

        <CSVLink
          data={leads}
          filename={"leads.csv"}
          className="bg-green-500 text-white px-4 py-2 rounded"
        >
          Export CSV
        </CSVLink>

      </div>

    </div>

    <div className="bg-white rounded shadow overflow-hidden">

      <table className="w-full">

        <thead className="bg-gray-200">

          <tr>

            <th className="p-3">
              Name
            </th>

            <th className="p-3">
              Email
            </th>

            <th className="p-3">
              Status
            </th>

            <th className="p-3">
              Source
            </th>

            <th className="p-3">
              Delete
            </th>

          </tr>

        </thead>

        {loading && (
          <h2 className="text-xl mb-4">
            Loading...
          </h2>
      )}

        <tbody>

          {leads.length === 0 ? (

  <tr>

    <td
      colSpan={5}
      className="text-center p-6"
    >
      No Leads Found
    </td>

  </tr>

) : (

  leads.map((lead) => (

    <tr
      key={lead._id}
      className="border-t"
    >

      <td className="p-3">
        {lead.name}
      </td>

      <td className="p-3">
        {lead.email}
      </td>

      <td className="p-3">
        {lead.status}
      </td>

      <td className="p-3">
        {lead.source}
      </td>

      <td className="p-3">

        {role === "ADMIN" && (

          <button
            className="bg-red-500 text-white px-3 py-1 rounded"
            onClick={() =>
              deleteLead(lead._id)
            }
          >
            Delete
          </button>

        )}

        {role === "ADMIN" && (

          <button
            className="bg-yellow-500 text-white px-3 py-1 rounded ml-2"
            onClick={() => {

              setEditId(lead._id);

              setName(lead.name);

              setEmail(lead.email);

              setStatus(lead.status);

              setSource(lead.source);

              setIsEditing(true);

            }}
          >
            Edit
          </button>

        )}

      </td>

    </tr>

  ))

)}

        </tbody>

      </table>

    </div>

    <div className="flex gap-4 mt-6">

      <button
        className="bg-gray-300 px-4 py-2 rounded"
        disabled={page === 1}
        onClick={() =>
          setPage(page - 1)
        }
      >
        Prev
      </button>

      <div className="p-2">
        Page {page}
      </div>

      <button
        className="bg-gray-300 px-4 py-2 rounded"
        disabled={
          page === totalPages
        }
        onClick={() =>
          setPage(page + 1)
        }
      >
        Next
      </button>

    </div>

  </div>
);
}

export default Dashboard;