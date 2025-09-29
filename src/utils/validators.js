export const validateEmployee=(data)=>{
    const error={};
     // Name validation
    if(!data.name || data.name.trim().length===0){
        errors.name='the name of employee is required';
    }else if(data.name.trim().length<=2){
         errors.name='the name of employee must be graeter than 2';
    }
    //phone validation
    if(!data.phone || data.phone.trim().length===0){
         errors.phone='the number of employee is required';
    }else if(!/^01[0-9]{9}$/.test(data.phone.replace(/\s/g, ''))){
         errors.phone='the number of employee is wrong (start with 01 and contain 11 number)';
    }
    // salary validate
     if(!data.salary_type || !['fixed','per_session'].includes(data.salary_type)){
         errors.salary_typ='the type of salary is wrong';
    }
     
  // Salary amount validation
if (data.salary_type === 'fixed') {
  if (!data.salary_fixed || data.salary_fixed <= 0) {
    errors.salary_fixed = 'الراتب الثابت يجب أن يكون أكبر من صفر';
  } else if (data.salary_fixed > 100000) {
    errors.salary_fixed = 'الراتب الثابت كبير جداً';
  }
}
if (data.salary_type === 'per_session') {
    if (!data.salary_per_session || data.salary_per_session <= 0) {
      errors.salary_per_session = 'راتب الجلسة يجب أن يكون أكبر من صفر';
    } else if (data.salary_per_session > 5000) {
      errors.salary_per_session = 'راتب الجلسة كبير جداً';
    }
}
return errors;
}