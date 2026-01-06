import { useEffect, useState } from "react";
import { getAllTickets } from "../services/api";

const DashboardPage = () => {
  const [tickets, setTickets] = useState([]);

  useEffect(() => {
    getAllTickets().then((res) => setTickets(res.data));
  }, []);

  return (
    <>
      <header className="header">📊 Ticket Dashboard</header>
      <table className="table">
        <thead>
          <tr>
            <th>ID</th>
            <th>User</th>
            <th>Category</th>
            <th>Priority</th>
            <th>Status</th>
            <th>Team</th>
          </tr>
        </thead>
        <tbody>
          {tickets.map((t) => (
            <tr key={t.id}>
              <td>{t.id}</td>
              <td>{t.username}</td>
              <td>{t.category}</td>
              <td>{t.priority}</td>
              <td>{t.status}</td>
              <td>{t.supportTeam}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
};

export default DashboardPage;
