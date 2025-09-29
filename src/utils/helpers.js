// utils/helpers.js
export const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

export const generateEmployeeId = () => {
  return `EMP_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

export const calculateTotalSalary = (employees) => {
  return employees.reduce((total, employee) => {
    if (employee.salary_type === 'fixed') {
      return total + employee.salary_fixed;
    }
    return total + employee.salary_per_session;
  }, 0);
};

export const groupEmployeesBySalaryType = (employees) => {
  return employees.reduce((groups, employee) => {
    const type = employee.salary_type;
    if (!groups[type]) {
      groups[type] = [];
    }
    groups[type].push(employee);
    return groups;
  }, {});
};

export const sortEmployees = (employees, sortBy = 'name', direction = 'asc') => {
  return [...employees].sort((a, b) => {
    let aValue = a[sortBy];
    let bValue = b[sortBy];
    
    if (typeof aValue === 'string') {
      aValue = aValue.toLowerCase();
      bValue = bValue.toLowerCase();
    }
    
    if (direction === 'asc') {
      return aValue > bValue ? 1 : -1;
    } else {
      return aValue < bValue ? 1 : -1;
    }
  });
};