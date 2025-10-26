import React from 'react'
import StudentDashboardSummary from '../componenets/StudentDashboardSummary';
import InstructorDashboardSummary from '../componenets/InstructorDashboardSummary';
import AdminDashboard from '../componenets/AdminDashboard';

export default function Home() {
  const user = JSON.parse(localStorage.getItem('user'));
  const role = user?.role;

  const renderSummaryByRole = () => {
    switch (role) {
      case 'student':
        return <StudentDashboardSummary user={user}/>;
      case 'instructor':
        return <InstructorDashboardSummary user={user}/>;
      case 'admin':
        return <AdminDashboard user={user}/>
      // Add 'admin' case later
      default:
        return <p>Welcome to your dashboard!</p>;
    }
  };

  return (
    <div>
      {renderSummaryByRole()}
    </div>
  );
}
