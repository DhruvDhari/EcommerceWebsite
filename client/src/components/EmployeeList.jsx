import React, { useEffect, useState } from "react";
import axios from "axios";

function EmployeeList() {
  const [employees, setEmployees] = useState([]);
  const [editingEmployee, setEditingEmployee] = useState(null);
  const [updatedName, setUpdatedName] = useState("");
  const [updatedEmail, setUpdatedEmail] = useState("");
  const [userName, setUserName] = useState("");
  const [currentPage, setCurrentPage] = useState(1); 
  const [employeesPerPage] = useState(10); 

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_BACKEND_URL}/api/employees`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        setEmployees(response.data);
        
      } catch (error) {
        console.error("Error fetching employees:", error);
      }
    };

    const fetchUserName = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/auth/me`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        setUserName(response.data.username);
      } catch (error) {
        console.error("Error fetching user info:", error);
      }
    };

    fetchUserName();
    fetchEmployees();
  }, []);


  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this employee?")) {
      try {
        await axios.delete(`${process.env.REACT_APP_BACKEND_URL}/api/employees/${id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        setEmployees(employees.filter((employee) => employee._id !== id));
      } catch (error) {
        console.error("Error deleting employee:", error);
      }
    }
  };


  const handleUpdate = (employee) => {
    setEditingEmployee(employee);
    setUpdatedName(employee.username);
    setUpdatedEmail(employee.email);
  };

  const saveUpdatedEmployee = async (id) => {
    try {
      await axios.put(
        `${process.env.REACT_APP_BACKEND_URL}/api/employees/${id}`,
        { username: updatedName, email: updatedEmail },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setEmployees(
        employees.map((emp) =>
          emp._id === id
            ? { ...emp, username: updatedName, email: updatedEmail }
            : emp
        )
      );
      setEditingEmployee(null);
    } catch (error) {
      console.error("Error updating employee:", error);
    }
  };

  // const handleLogout = () => {
  //   if (window.confirm("Are you sure you want to log out?")) {
  //     localStorage.removeItem("token");
  //     navigate("/login");
  //   }
  // };


  const indexOfLastEmployee = currentPage * employeesPerPage;
  const indexOfFirstEmployee = indexOfLastEmployee - employeesPerPage;
  const currentEmployees = employees.slice(
    indexOfFirstEmployee,
    indexOfLastEmployee
  );

  const nextPage = () => {
    setCurrentPage(currentPage + 1);
  };

  const prevPage = () => {
    setCurrentPage(currentPage - 1);
  };

  return (
    <>
  

        <div className="employee-list-container">
        <h2 className="welcome-message">Welcome {userName.toUpperCase()}</h2>
          <table className="employee-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Email</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentEmployees.map((employee, index) => (
                <tr key={employee._id}>
                  <td>{indexOfFirstEmployee + index + 1}</td>
                  <td>
                    {editingEmployee?._id === employee._id ? (
                      <input
                        type="text"
                        value={updatedName}
                        onChange={(e) => setUpdatedName(e.target.value)}
                      />
                    ) : (
                      employee.username
                    )}
                  </td>
                  <td>
                    {editingEmployee?._id === employee._id ? (
                      <input
                        type="email"
                        value={updatedEmail}
                        onChange={(e) => setUpdatedEmail(e.target.value)}
                      />
                    ) : (
                      employee.email
                    )}
                  </td>
                  <td>
                    {editingEmployee?._id === employee._id ? (
                      <button onClick={() => saveUpdatedEmployee(employee._id)}>
                        Save
                      </button>
                    ) : (
                      <div className="action-container">
                        <button
                          onClick={() => handleUpdate(employee)}
                          className="action-button"
                        >
                         <i className="bi bi-pencil-square"></i>
                        </button>
                        
                        <button
                          onClick={() => handleDelete(employee._id)}
                          className="action-button" style={{backgroundColor:'#ff4d4d'}}
                        >
                         <i className="bi bi-trash"></i>
                        </button>
                        
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="pagination-buttons">
            <button onClick={prevPage} disabled={currentPage === 1}>
              Prev
            </button>
            <button
              onClick={nextPage}
              disabled={indexOfLastEmployee >= employees.length}
            >
              Next
            </button>
          </div>
        </div>
      {/* </div> */}
    </>
  );
}

export default EmployeeList;
