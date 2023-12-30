// display
const passwordDisplay = document.querySelector("[data-password-display]");

// checkboxes
const uppercaseCb = document.querySelector("#uppercaseCb");
const lowercaseCb = document.querySelector("#lowercaseCb");
const numberCb = document.querySelector("#numberCb");
const symbolCb = document.querySelector("#symbolCb");
const allCheckbox = document.querySelectorAll("input[type=checkbox]");

// length
const lengthSlider = document.querySelector("[ data-length-slider]");
const lengthDisplay = document.querySelector("[ data-length-display]");

// indicator
const indicator = document.querySelector("[data-indicator]");

// generate button
const generateButton = document.querySelector("#generatebtn");

// copy password
const copyBtn = document.querySelector("[data-copy-btn]");
const copyMsg = document.querySelector("[data-copy-msg]");

const symbols = '~`!@#$%^&*()_-+={[}]|:;"<,>.?/';

let password = "";
let passwordLength = 10;

// uppercase is checked by default. so checkCount = 1
uppercaseCb.checked = true;
let checkCount = 1;

// show password length to UI
function handelSlider() {
  lengthSlider.value = passwordLength; // for default purpose
  lengthDisplay.innerText = passwordLength;

  const min = lengthSlider.min;
  const max = lengthSlider.max;
  lengthSlider.style.backgroundSize =
    ((passwordLength - min) * 100) / (max - min) + "% 100%";
}

handelSlider();

// handle input event on length slider
lengthSlider.addEventListener("input", (e) => {
  passwordLength = e.target.value;
  handelSlider();
});

// handle check-count and password length
function countCheckedCb() {
  checkCount = 0;
  allCheckbox.forEach((checkbox) => {
    if (checkbox.checked) {
      checkCount++;
    }
  });
  if (checkCount > passwordLength) {
    passwordLength = checkCount;
    handelSlider();
  }
}
allCheckbox.forEach((checkbox) => {
  checkbox.addEventListener("change", countCheckedCb);
});

// calculate password strength
// set Indicator
setIndicator("#ccc");
function setIndicator(color) {
  indicator.style.backgroundColor = color;
  indicator.style.boxShadow = `0px 0px 12px 1px ${color}`;
}

function calcStrength() {
  let hasUpper = false;
  let hasLower = false;
  let hasNumber = false;
  let hasSymbol = false;

  if (uppercaseCb.checked) hasUpper = true;
  if (lowercaseCb.checked) hasLower = true;
  if (numberCb.checked) hasNumber = true;
  if (symbolCb.checked) hasSymbol = true;

  if (hasUpper && hasLower && (hasNumber || hasSymbol) && passwordLength >= 8)
    setIndicator("#0f0");
  else if (
    (hasUpper || hasLower) &&
    (hasNumber || hasSymbol) &&
    passwordLength >= 6
  ) {
    setIndicator("#ff0");
  } else setIndicator("#f00");
}

// copy password
async function copyContent() {
  try {
    // throw error if password is empty
    if (password === "") {
      alert("First Generate Password to copy");
      throw "Failed";
    }

    await navigator.clipboard.writeText(password);
    copyMsg.innerText = "Copied";
  } catch (error) {
    // catch() will only run if any error is thrown by the try block
    copyMsg.innerText = error;
  }

  copyMsg.classList.add("active");

  setTimeout(() => {
    copyMsg.classList.remove("active");
  }, 2000);
}

copyBtn.addEventListener("click", () => {
  // if (password) copyContent();
  copyContent();
});

// generate any random no. b/w min and max
function getRandomInteger(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

// generate any random no. b/w 0- 9
function generateNumber() {
  return getRandomInteger(1, 10);
}

// The ASCII value of the lowercase alphabet is from 97 to 122.
// generate any random lowercase b/w a - z
function generateLowercase() {
  return String.fromCharCode(getRandomInteger(97, 123));
}

// ASCII value of the uppercase alphabet is from 65 to 90.
// generate any random uppercase b/w A - Z
function generateUppercase() {
  return String.fromCharCode(getRandomInteger(65, 91));
}

// symbol generate
function generateSymbol() {
  const randomIndex = getRandomInteger(0, symbols.length);
  return symbols.charAt(randomIndex);
}

// Shuffle the array randomly - Fisher Yates algorithm
function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    // find out random j
    const j = Math.floor(Math.random() * (i + 1));
    // swap 2 numbers
    const temp = array[i];
    array[i] = array[j];
    array[j] = temp;
  }
  let str = "";
  // array.forEach((el) => (str += el));
  str = array.join("");
  return str;
}

// Handle generate password
function generatePassword() {
  // none of the checkboxes are selected
  if (checkCount <= 0) {
    alert("Atleast check one checkbox!");
    return;
  }
  // password-length should be >= selected no. of checkbox
  if (checkCount > passwordLength) {
    passwordLength = checkCount;
    handelSlider();
  }
  // remove the previous password
  if (password.length) {
    password = "";
  }

  let checkedCbArray = [];
  // add selected checkbox functions to an array

  if (uppercaseCb.checked) {
    checkedCbArray.push(generateUppercase);
  }
  if (lowercaseCb.checked) {
    checkedCbArray.push(generateLowercase);
  }
  if (numberCb.checked) {
    checkedCbArray.push(generateNumber);
  }
  if (symbolCb.checked) {
    checkedCbArray.push(generateSymbol);
  }
  // add the required characters - compulsory addition

  for (let i = 0; i < checkedCbArray.length; i++) {
    password += checkedCbArray[i](); // calling the functions stored in the array
  }

  // adding random characters till the password length - remaining addition

  for (let i = 0; i < passwordLength - checkedCbArray.length; i++) {
    let randomIndex = getRandomInteger(0, checkedCbArray.length);
    password += checkedCbArray[randomIndex]();
  }

  // shuffle the newly created pass.
  password = shuffleArray(Array.from(password));
  passwordDisplay.value = password;
  console.log("password :", password);

  // calculate strength
  calcStrength();
}

generateButton.addEventListener("click", generatePassword);



/* This code is written by Bikash Santra
Linkedin : https://www.linkedin.com/in/bikash-santra-886901217/ */
