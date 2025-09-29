export function formatData(employee) {
  if (!employee) return null;

  return {
    id: employee.id,
    name: employee.name || "N/A",
    email: employee.email || "N/A",
    phone: employee.phone || "N/A",
    salary: employee.salary || 0,
    department: employee.department || "N/A",
    position: employee.position || "N/A",
    joiningDate: employee.joining_date || "N/A",
    leaveBalance: employee.leave_balance || "0 Days",
    experience: employee.experience || "0 Years",
  };
}
