export const emailDomains = [
  { collegeName: "NTU Faisalabad", emailDomain: "iitb.ac.in" },
  { collegeName: "NTU Karachi", emailDomain: "iitd.ac.in" },
];

export const getEmailDomain = (collegeName) => {
  const college = emailDomains.find(c => c.collegeName === collegeName);
  return college ? college.emailDomain : "Domain not found";
};
  