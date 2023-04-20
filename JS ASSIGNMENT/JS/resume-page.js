let resumeData = { resume: [] };
let allResumes = resumeData["resume"];
let currentResumeIndex = 0;

// References to all nodes
// Action Nodes
const previousBtn = document.getElementById("previousBtn");
const nextBtn = document.getElementById("nextBtn");
const searchBar = document.getElementById("search");
// Data Nodes
const loader = document.getElementById("loader");
const noResultContainer = document.getElementById("noResultContainer");
const resumeContainer = document.getElementById("resumeContainer");
const employeeName = document.getElementById("name");
const appliedFor = document.getElementById("appliedFor");
const phone = document.getElementById("phone");
const email = document.getElementById("email");
const linkedin = document.getElementById("linkedin");
const technicalSkills = document.getElementById("technicalSkills");
const hobbies = document.getElementById("hobbies");
const previousCompanyDetails = document.getElementById(
  "previousCompanyDetails"
);
const projectDetails = document.getElementById("projectDetails");
const education = document.getElementById("education");
const internship = document.getElementById("internship");
const achievements = document.getElementById("achievements");

// Will check which buttons to display based on currentResumeIndex and allResumes(filtered out on the basis of search input)
const checkButtonsToDisplay = () => {
  if (currentResumeIndex + 1 >= allResumes.length) {
    nextBtn.style.visibility = "hidden";
  } else {
    nextBtn.style.visibility = "visible";
  }
  if (currentResumeIndex === 0) {
    previousBtn.style.visibility = "hidden";
  } else {
    previousBtn.style.visibility = "visible";
  }
};

// Will fill the data in all the html placeholders based on currently selected resume
const fillData = () => {
  const currentResume = allResumes[currentResumeIndex];
  employeeName.innerText = currentResume["basics"]["name"];
  appliedFor.innerText = currentResume["basics"]["AppliedFor"];
  email.innerText = currentResume["basics"]["email"];
  phone.innerText = currentResume["basics"]["phone"];
  linkedin.href = currentResume["basics"]["profiles"]["url"];
  technicalSkills.innerHTML = `<div>${currentResume["skills"]["keywords"].map(
    (keyword) => `<p>${keyword}</p>`
  )}</div>`.replaceAll(",", "");
  hobbies.innerHTML = `<div>${currentResume["interests"]["hobbies"].map(
    (keyword) => `<p>${keyword}</p>`
  )}</div>`.replaceAll(",", "");
  previousCompanyDetails.innerHTML = `<div>${Object.keys(
    currentResume["work"]
  ).map(
    (key) =>
      `<p class="innerDetail"><b>${key}</b>: ${currentResume["work"][key]}</p>`
  )}</div>`.replaceAll(",", "");
  projectDetails.innerHTML = `<p class="innerDetail"><b>${currentResume["projects"]["name"]}</b>:${currentResume["projects"]["description"]}</p>`;
  education.innerHTML = `<ul>${Object.keys(currentResume["education"]).map(
    (education) =>
      `<li><b>${education}:</b> ${Object.keys(
        currentResume["education"][education]
      ).map(
        (eduDataKey) =>
          `<span> ${currentResume["education"][education][eduDataKey]}</span>`
      )}</li>`
  )}</ul>`;
  internship.innerHTML = `<ul>${Object.keys(currentResume["Internship"]).map(
    (key) => `<li><b>${key}</b>: ${currentResume["Internship"][key]}</li>`
  )}</ul>`.replaceAll(",", "");
  achievements.innerHTML = `<ul>${currentResume["achievements"]["Summary"].map(
    (achievement) => `<li>${achievement}</li>`
  )}</ul>`.replaceAll(",", "");
};

// Validates if the user exists in local storage, otherwise redirect to login page
const validateUser = () => {
  const username = window.localStorage.getItem("username");
  const password = window.localStorage.getItem("password");
  if (!username || !password) {
    window.location.href = "./login.html";
  }
};

// will check the length of filtered out resumes based on search input and makes a decision which container to show, no results or resume
const checkResumes = () => {
  if (allResumes.length > 0) {
    noResultContainer.style.display = "none";
    resumeContainer.style.display = "block";
  } else {
    noResultContainer.style.display = "flex";
    resumeContainer.style.display = "none";
  }
};

// validate user at the top and redirect to login if user not found in local storage
validateUser();

// Data.json was uploaded to npoint as browser was not allowing to read a local file automatically, but both options are working perfectly fine. One has been commented, you can check that too by commenting this and uncommenting the next one

fetch("https://api.npoint.io/61a8966d1dd6666ba656")
  //with the following location, it is able to read as well

  // fetch("../resources/data/Data.json") // this is also working fine
  .then((response) => response.json())
  .then((respData) => {
    loader.style.display = "none";
    resumeData = respData;
    allResumes = resumeData["resume"];
    checkResumes();
    checkButtonsToDisplay();
    fillData();
  })
  .catch((error) => {
    alert(
      "Page interrupted or Unable to load file from npoint. Loading the data from local."
    );
    loader.style.display = "none";
    resumeData = data;
    allResumes = resumeData["resume"];
    checkResumes();
    checkButtonsToDisplay();
    fillData();
  });

// will filter our resumes and saves it to allResumes and checks which buttons to display
searchBar.oninput = function (event) {
  const searchInput = event.target.value;
  if (searchInput.length > 0) {
    allResumes = resumeData["resume"].filter((resume) =>
      resume["basics"]["AppliedFor"]
        .toLowerCase()
        .includes(searchInput.toLowerCase())
    );
  } else {
    allResumes = resumeData["resume"];
  }
  currentResumeIndex = 0;
  if (allResumes.length > 0) fillData();
  checkResumes();
  checkButtonsToDisplay();
};

// will fill the data of next resume
// checks which buttons to display as the currentResumeIndex is changed
const nextBtnClick = () => {
  currentResumeIndex = currentResumeIndex + 1;
  fillData();
  checkButtonsToDisplay();
};

// will fill the data of previous resume
// checks which buttons to display as the currentResumeIndex is changed
const previousBtnClick = () => {
  currentResumeIndex = currentResumeIndex - 1;
  fillData();
  checkButtonsToDisplay();
};

checkButtonsToDisplay();