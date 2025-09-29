import { useState } from "react";
import { employeeService } from "../services/employeeService";

export default function useEmployeeForm(employee, setEmployee) {
  const [formData, setFormData] = useState(employee || {});
  const [notification, setNotification] = useState(null);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSave = async () => {
    try {
      await employeeService.updatePersonalData(employee.id, formData);
      setEmployee(formData);
      setNotification({ type: "success", message: "Changes saved successfully" });
    } catch (error) {
      setNotification({ type: "error", message: "Error saving changes" });
    }
  };

  return { formData, handleChange, handleSave, notification };
}
