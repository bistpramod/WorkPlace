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
 
console.log(searchApplications(applications, "google"));
console.log(searchApplications(applications, "developer"));
console.log(searchApplications(applications, "react"));
}
searchApplications();