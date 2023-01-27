/**
 * Author : Nazim Uddin
 * Date : 17th January 2023
 */

//globals
const presetColor = 
[
    '#e1bee7',
    '#ff8a80',
    '#ff6909',
    '#21ffee',
    '#ffdeef',
    '#aaffdd',
    '#dd2211',
    '#dd4477',
    '#dd2255',
    '#dd9911',
    '#dddd99',
    '#dd7799',
    '#dddd12',
    '#ccff11',
    '#d1d1d1',
    '#ffaadd',
    '#ff0011',
    '#00ff00',
    '#e12345',
    '#000000'
];

const copySound = new Audio('./Bleh Bleh Bleh-[AudioTrimmer.com].mp3');
const customColors = [];

let div = null;
const defaultColor = {
    red :6,
    green : 10, 
    blue : 31,
}

//onload function
window.onload = () => {
    main();
    updateColorCodeInDOM(defaultColor);
    displayPresetColorBoxes(document.getElementById('preset-colors'), presetColor);
    const customColorsString = localStorage.getItem('customColors');
    console.log(customColorsString);

    if (customColorsString){
        customColor = JSON.parse(customColorsString)
        displayPresetColorBoxes(document.getElementById('custom-colors'), customColor)
    }
    
}


//Main function
function main(){
    //dom reference
    const headerBtn = document.getElementById('header-btn');
    const hexInput = document.getElementById('hex-input');
    const colorSliderRed = document.getElementById('slider-heading-red');
    const colorSliderGreen = document.getElementById('slider-heading-green');
    const colorSliderBlue = document.getElementById('slider-heading-blue');
    const copyToClipboardBtn = document.getElementById('body-btn');
    const presetColorParents = document.getElementById('preset-colors');
    const saveBtn = document.getElementById('save-btn');
    const customColorParents = document.getElementById('custom-colors');
    const uploadBtn = document.getElementById('uploadBtn');
    const leftPanel = document.getElementById('left-panel');
    const inputFile = document.getElementById('bgFile');
    const deleteBtn = document.getElementById('deleteBtn');
    deleteBtn.style.display = 'none';
    const bgController = document.getElementById('bg-controller');
    bgController.style.display = 'none';

    
    


    //Event Listener
    headerBtn.addEventListener('click',generateRandomColorBtn);
    copyToClipboardBtn.addEventListener('click',handleCopyToClipboardBtn);
    hexInput.addEventListener('keyup', handleHexColorInput);
    colorSliderRed.addEventListener('change', handleColorSlider(colorSliderRed, colorSliderGreen, colorSliderBlue));
    colorSliderGreen.addEventListener('change', handleColorSlider(colorSliderRed, colorSliderGreen, colorSliderBlue));
    colorSliderBlue.addEventListener('change', handleColorSlider(colorSliderRed, colorSliderGreen, colorSliderBlue));
    presetColorParents.addEventListener('click', handlePresetColorParents);
    saveBtn.addEventListener('click', handleSaveToCustomBtn(customColorParents, hexInput));
    uploadBtn.addEventListener('click', function(){inputFile.click();});
    inputFile.addEventListener('change', handleInputFile(leftPanel, deleteBtn, bgController));
    deleteBtn.addEventListener('click', handleDeleteBtn(deleteBtn,leftPanel,inputFile, bgController))

    document.getElementById('bg-size').addEventListener('change', changeBackgroundPreferences);
    document.getElementById('bg-repeat').addEventListener('change', changeBackgroundPreferences);
    document.getElementById('bg-attachment').addEventListener('change', changeBackgroundPreferences);
    document.getElementById('bg-position').addEventListener('change', changeBackgroundPreferences);
}

//Event Handler functions
function handleColorSlider(colorSliderRed, colorSliderGreen, colorSliderBlue) {
    return function(){
        const color ={
            red : parseInt(colorSliderRed.value),
            green : parseInt(colorSliderGreen.value),
            blue : parseInt(colorSliderBlue.value)
        };
        updateColorCodeInDOM(color);
    };
}




function handleHexColorInput(e){
    const hexCode = e.target.value;
    if (hexCode) {
        this.value = hexCode.toUpperCase();
    }
    if (hexCode && isHexValid(hexCode)){
        const color = generateHexToDecimalColorCode(hexCode);
        console.log(color);
        updateColorCodeInDOM(color);
    }
}




function generateRandomColorBtn(){
    let decimalColor = generateDecimalColorCode();
    updateColorCodeInDOM(decimalColor);
 
}



function handleCopyToClipboardBtn(){
    const radiosBtn = document.getElementsByName('color-mode');
    const checkedValue = getCheckedValueFromRadiosBtn(radiosBtn);
    if (checkedValue === null){
        //(`invalid radio input`);
        alert('Invalid Code');
    }
    if (checkedValue === 'hex'){
        const hexCode = document.getElementById('hex-input').value;
        if (hexCode && isHexValid(hexCode)){
            navigator.clipboard.writeText(hexCode);
            if (div != null){
                div.remove();
                generateToastMessage(hexCode);
            }else{
                generateToastMessage(hexCode);
            }    
        }else{
            alert('Invalid hexCode');
        }
    }if (checkedValue === 'rgb'){
        console.log(checkedValue);
        rgbCode = document.getElementById('rgb-input').value;
        navigator.clipboard.writeText(rgbCode);
        if (div != null){
            div.remove();
            generateToastMessage(rgbCode);
        }else{
            generateToastMessage(rgbCode);
        }
    }
}


function handlePresetColorParents(event) {
    const child = event.target;
    if (child.className === 'color-box'){
        navigator.clipboard.writeText(child.getAttribute('data-color'));
        copySound.volume = 0.7;
        copySound.play();
    };
}

function handleSaveToCustomBtn(customColorParents, hexInput){
    
    return function(){
        const color = hexInput.value;
        if (customColors.includes(color)) {
            alert('Already picked color');
            return;
        };
        customColors.unshift(color);
        if (customColors.length > 24){
            customColors = customColors.slice(0, 24);
        }
        localStorage.setItem('customColors', JSON.stringify(customColors));
        removeChildren(customColorParents);
        displayPresetColorBoxes(customColorParents, customColors);
    }
}

function handleInputFile(leftPanel,deleteBtn,bgController){
    return function(event){
        const files = event.target.files[0];
        const imgUrl =URL.createObjectURL(files);
        leftPanel.style.background = `url(${imgUrl})`;
        document.body.style.background = `url(${imgUrl})`;
        deleteBtn.style.display = 'inline';
        bgController.style.display = 'flex';
    }
}

function handleDeleteBtn(deleteBtn,leftPanel,inputFile, bgController){
    return function(){
        deleteBtn.style.display = 'none';
        leftPanel.style.background = 'none';
        leftPanel.style.backgroundColor = '#060a1f';
        document.body.style.background = 'none';
        document.body.style.backgroundColor = '#060a1f';
        inputFile.value = null;
        bgController.style.display = 'none';
    }
}

//DOM function
function updateColorCodeInDOM(decimalColor) {
    const {red,green,blue} = decimalColor;

    let hexColor = generateHexColorCode(decimalColor);
    let rgbColor = generateRGBColorCode(decimalColor);


    document.getElementById('color-display').style.backgroundColor = hexColor;
    document.getElementById('hex-input').value = hexColor;
    document.getElementById('rgb-input').value = rgbColor;
    document.getElementById('slider-one-value').innerText = red;
    document.getElementById('slider-two-value').innerText = green;
    document.getElementById('slider-three-value').innerText =blue;
    document.getElementById('slider-heading-red').value = red;
    document.getElementById('slider-heading-green').value = green;
    document.getElementById('slider-heading-blue').value = blue;
}

/**
 * create a dive with color name and color-box
 * @param {string} color 
 * @returns {object}
 */


function generateColorBox(color) {
    const div = document.createElement('div');
    div.className = 'color-box';
    div.style.backgroundColor = color;
    div.setAttribute('data-color',color);

    return div;
}


/**
 * this function will create and append color boxes to it's parents
 * @param {*} color 
 * @returns 
 */
function displayPresetColorBoxes(parent,color) {
    color.forEach( (color) => {
        const colorBox = generateColorBox(color);
        parent.appendChild(colorBox);
    });
}

/**
 * 
 * @param {object} parent 
 */
function removeChildren(parent) {
    let child = parent.lastElementChild;
    while (child){
        parent.removeChild(child);
        child = parent.lastElementChild;
    }
}

function changeBackgroundPreferences(){
    document.body.style.backgroundSize= document.getElementById('bg-size').value;
    document.body.style.backgroundRepeat = document.getElementById('bg-repeat').value;
    document.body.style.backgroundPosition = document.getElementById('bg-position').value;
    document.body.style.backgroundAttachment = document.getElementById('bg-attachment').value;
}


//Utils function
/**
 * this function show a toast message
 * @param {string} msg 
 */
function generateToastMessage(msg){
    div = document.createElement('div');
    div.innerHTML = `${msg} is copied`;
    div.className = 'toast-message toast-message-slide-in';
    div.addEventListener('click', function(){
        div.classList.remove('toast-message-slide-in');
        div.classList.add('toast-message-slide-out');
        div.addEventListener('animationend',function (){
            div.remove();
            div = null;
        })
    })
    document.body.appendChild(div);
}


/**
 * this function creates random decimal color code
 * @returns {object}
 */
function generateDecimalColorCode(){
    let red = Math.round(Math.random() * 255);
    let green = Math.round(Math.random() * 255);
    let blue = Math.round(Math.random() * 255);
    return {red,green,blue};
}

/**
 * this function creates hex color code
 * @param {object}
 * @returns {string}
 */
function generateHexColorCode({red,green,blue}){
    const getTwoCode = (value) =>{
        let hexCode = value.toString(16);
        return hexCode.length === 1 ? `0${hexCode}` : hexCode;
    }
    return `#${getTwoCode(red)}${getTwoCode(green)}${getTwoCode(blue)}`.toUpperCase();
}



/**
 * this function creates RGB color code
 * @param {object}
 * @returns {string}}
 */
function generateRGBColorCode({red,green,blue}){
    return `rgb(${red},${green},${blue})`;
}


/**
 * validate the hex color code
 * @param {string}
 * 
 */
function isHexValid(color){
    if (color[0] != '#') return false;
    if (color.length != 7) return false;
    color = color.substring(1);
    
    return /^[0-9A-Fa-f]{6}$/i.test(color);
}

/**
 * this function converts hex color code to decimal color code
 * @param {string}
 * @return {object}
 */
function generateHexToDecimalColorCode(hexCode){
    let red = parseInt(hexCode.slice(1, 3), 16);
    let green = parseInt(hexCode.slice(3, 5), 16);
    let blue = parseInt(hexCode.slice(5), 16);
    return {red,green,blue};
}

/**
 * 
 * @param {Array} nodes
 */
function getCheckedValueFromRadiosBtn(nodes){
    let checkedValue = null;
    for (let i = 0; i< nodes.length; i++){
        if(nodes[i].checked){
            checkedValue = nodes[i].value;
            break;
        }
    }
    return checkedValue;
}