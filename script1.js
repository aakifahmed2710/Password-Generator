const inputSlider = document.querySelector("[data-lengthSlider]");
const lengthDisplay = document.querySelector("[data-lengthNumber]");
const passwordDisplay = document.querySelector("[data-passwordDisplay]");
const copyBtn = document.querySelector("[data-copy]");
const copyMsg = document.querySelector("[data-copyMsg]");
const uppercaseCheck = document.querySelector("#uppercase");
const lowercaseCheck = document.querySelector("#lowercase");
const numberCheck = document.querySelector("#number");
const symbolCheck = document.querySelector("#symbol");
const indicator = document.querySelector("[data-indicator]");
const generateBtn = document.querySelector(".generatebutton");
const allCheckBox = document.querySelectorAll("input[type=checkbox]");
const symbols = '!@#$~`%^&*()_-+=}{][|\/?>"<,.';

let password = "";
let passwordLength = 10;
let checkCount = 0;
handleSlider();
//set indicator color to grey
setIndicator("#f2f2f2");

//set password length
function handleSlider() {
    inputSlider.value = passwordLength;
    lengthDisplay.innerText = passwordLength;

    const min = inputSlider.min;
    const max = inputSlider.max
    inputSlider.style.backgroundSize = ( (passwordLength - min)*100/(max-min)) + "% 100%";

    // const min = inputSlider.min;
    // const max = inputSlider.max;
    // inputSlider.style.backgroundSize = ( (passwordLength - min)*100/(max - min)) + "% 100%"

}
//indictor color
function setIndicator(color) {
    indicator.style.backgroundColor = color;
    //shadow
    indicator.style.boxShadow = `0px 0px 12px 1px ${color}`;
}
//random 
function getRndInteger(min,max) {
    return Math.floor(Math.random() * (max-min)) + min;
    
}
// get random no. from1 to 9 by using above function()
function generateRndNumber() {
    return getRndInteger(0,9);
}

function generateLowerCase() {
    return String.fromCharCode (getRndInteger(97,123))
}

function generateUpperCase() {
    return String.fromCharCode (getRndInteger(65,91))
}

function generateSymbol() {
    const randNum = getRndInteger(0, symbols.length);
    return symbols.charAt(randNum);
}

function calculateStrength() {
    let hasUpper = false;
    let hasLower = false;
    let hasNumber = false;
    let hasSymbols = false;

    if(uppercaseCheck.checked) hasUpper = true;
    if(lowercaseCheck.checked) hasLower = true;
    if(numberCheck.checked) hasNumber = true;
    if(symbolCheck.checked) hasSymbols = true;

    if (hasLower && hasNumber && (hasSymbols || hasUpper) && passwordLength>=8)
        {
        setIndicator("#0f0");
    } 
    else if (
        (hasLower || hasUpper) && (hasNumber || hasSymbols)
    ){
        setIndicator("#ff0");
    } 
    else{
        setIndicator("#f00");
    }

}


async function copyContent() {
    
    try{
        await navigator.clipboard.writeText(passwordDisplay.value);
        copyMsg.innerText = "copied";
    }
    catch{
        copyMsg.innerText = "failed";
    }
    //to make copy span visible
    copyMsg.classList.add("active");

    setTimeout( () => {
        copyMsg.classList.remove("active");
    },2000);
}

inputSlider.addEventListener('input', (e) => {
    passwordLength = e.target.value;
    handleSlider();
})

copyBtn.addEventListener('click', (e) => {
    if(passwordDisplay.value)
        copyContent();
})

function shufflePassword(array){
    //Fisher Yates Method
    for(let i = array.length -1; i>0; i--){
        const j =Math.floor(Math.random() * (i+1));
        const temp = array[i];
        array[i]= array[j];
        array[j]= temp;
    }
    let str = "";
    array.forEach((el) => (str +=el));
    return str;
}

function handleCheckboxChange(){
    checkCount=0;
    allCheckBox.forEach( (checkbox) =>{
        if(checkbox.checked)
            checkCount++;
    });

    //special condition
    if(passwordLength < checkCount){
        passwordLength = checkCount;
        handleSlider();
    }

}

allCheckBox.forEach( (checkbox) => {
    checkbox.addEventListener('change', handleCheckboxChange);
})
     


generateBtn.addEventListener('click', () => {
    //none of the checkbox is selected
    if(checkCount==0) return;

    if(passwordLength< checkCount){
        passwordLength = checkCount;
        handleSlider();
    }

    //let find new password

    //remove old password

    password = ""; 

    //let put the stuff mention by checkboxes

    // if(uppercaseCheck.checked){
    //     password += generateUpperCase;
    // }

    // if(lowercaseCheck.checked){
    //     password += generateLowerCase;
    // }

    // if(numberCheck.checked){
    //     password += generateRndNumber;
    // }

    // if(symbolCheck.checked){
    //     password += generateSymbol;
    // }
    
    let funcArr = [];

    if(uppercaseCheck.checked){
        funcArr.push(generateUpperCase);
    }

    if(lowercaseCheck.checked){
        funcArr.push(generateLowerCase);
    }

    if(numberCheck.checked){
        funcArr.push(generateRndNumber);
    }

    if(symbolCheck.checked){
        funcArr.push(generateSymbol);
    }

    //compulsary

    for(let i=0; i<funcArr.length; i++){
        password += funcArr[i]();
    }

    //remaining
    for(let i=0; i<passwordLength-funcArr.length; i++){
        let randIndex = getRndInteger(0,funcArr.length);
        password += funcArr[randIndex]();
    }

    //shuffle password

    password = shufflePassword(Array.from(password));

    //show in UI
    passwordDisplay.value = password;

    //calculate strength
    calculateStrength();
    
})