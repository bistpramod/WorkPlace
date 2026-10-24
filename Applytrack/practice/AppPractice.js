const applications = [
  {
    id: 1,
    company: "Google",
    role: "Frontend Developer",
    status: "applied",
    appliedOn: "2026-10-20",
  },
  {
    id: 2,
    company: "Microsoft",
    role: "Backend Developer",
    status: "interviewing",
    appliedOn: "2026-10-18",
  },
  {
    id: 3,
    company: "Netflix",
    role: "React Developer",
    status: "rejected",
    appliedOn: "2026-10-15",
  },
];
function searchApplications(applications, searchText) {
  const cleanSearchText = searchText.toLowerCase();

  return applications.filter((application) => {
    return (
      application.company.toLowerCase().includes(cleanSearchText) ||
      application.role.toLowerCase().includes(cleanSearchText)
    );
  });
}

// These must be outside the function
console.log(searchApplications(applications, "google"));
console.log(searchApplications(applications, "developer"));
console.log(searchApplications(applications, "react"));
function filterByStatus(applications, selectedStatus) {
  return applications.filter((application) => {
    return application.status === selectedStatus;
  });
}
console.log("Applied:");
console.log(filterByStatus(applications, "applied"));

console.log("Interviewing:");
console.log(filterByStatus(applications, "interviewing"));