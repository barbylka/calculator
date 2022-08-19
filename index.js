const calculatorDisplay = document.querySelector('.calculator__result');
const operatorsButtons = Array.from(document.querySelectorAll('.calculator__operator'));
const digitButtons = Array.from(document.querySelectorAll('.calculator__digit'));
const equalButton = document.querySelector('.calculator__equal');
const clearButton = document.querySelector('.calculator__clear');
const errorMessage = document.querySelector('.calculator__error');
const pointBtn = document.querySelector('.button_type_point');
const backSpaceBtn = document.querySelector('.calculator__backspace');
let calculatorValue = calculatorDisplay.textContent;
let userOperator = '';
let firstNum = undefined;
let secondNum = undefined;

document.addEventListener('keydown', (evt) => {
  const key = document.getElementById(evt.key);
  key.click();
});

function checkZero(value) {
  if (value[0] === '0' && value[1] !== '.') {
    return value.slice(1)
  } else {
    return value
  }
};

function clearErrorMessage() {
  if (errorMessage.textContent.length > 0) {
    errorMessage.textContent = '';
  };
};

function togglePointBtnState(value) {
  pointBtn.disabled = value;

  if (value) {
    pointBtn.classList.add('button_type_point_disabled');
  } else {
    pointBtn.classList.remove('button_type_point_disabled');
  }
};

function checkDisplayLength(value) {
  if (value.length >= 16) {
    errorMessage.textContent = 'Too many digits, 15 is a maximum';
    return true
  }
  return false;
};

function toggleBackSpaceBtnState(value) {
  backSpaceBtn.disabled = value;

  if (value) {
    backSpaceBtn.classList.add('calculator__backspace_disabled');
  } else {
    backSpaceBtn.classList.remove('calculator__backspace_disabled');
  }
};

backSpaceBtn.addEventListener('click', () => {
  clearErrorMessage();
  const value = calculatorDisplay.textContent;
  if (value.length !== 1) {
    calculatorValue = value.substring(0, value.length - 1);
    calculatorDisplay.textContent = calculatorValue;
    if (calculatorValue.includes('.')) {
      togglePointBtnState(true);
    } else {
      togglePointBtnState(false);
    }
  } else {
    calculatorValue = '0';
    calculatorDisplay.textContent = calculatorValue;
  }
  if (secondNum === undefined) {
    firstNum = Number(calculatorValue);
  } else {
    secondNum = Number(calculatorValue)
  }

})

digitButtons.forEach((btn) => {
  btn.addEventListener('click', () => {

    clearErrorMessage();
    toggleBackSpaceBtnState(false);
    calculatorValue = checkZero(calculatorValue.concat(btn.textContent));
    if (checkDisplayLength(calculatorValue)) {
      return
    } else {
      calculatorDisplay.textContent = calculatorValue;
      if (secondNum === undefined) {
        firstNum = Number(calculatorValue);
      } else {
        secondNum = Number(calculatorValue)
      }

      if (calculatorValue.includes('.')) {
        togglePointBtnState(true);
      }
    }
  });
})

operatorsButtons.forEach((btn) => {
  btn.addEventListener('click', () => {
    clearErrorMessage();

    if (secondNum === undefined) {
      calculatorValue = '0'
      secondNum = 0
    } else {
      count();
      secondNum = 0

    }
    userOperator = btn.textContent;
    togglePointBtnState(false);
  })
})

clearButton.addEventListener('click', () => {
  clearErrorMessage();
  userOperator = '';
  firstNum = undefined;
  secondNum = undefined;
  calculatorValue = '0';
  calculatorDisplay.textContent = calculatorValue;
  togglePointBtnState(false);
})

function operate(operator, a, b) {
  const round = (number, decimals) => +(Math.round(number + 'e+' + decimals) + 'e-' + decimals);

  let result;
  if (operator === '+') {
    result = a + b
  } else if (operator === '-') {
    result = a - b
  } else if (operator === '*') {
    result = a * b
  } else {
    if (b === 0) {
      errorMessage.textContent = 'Don\'t divide by 0';
    } else {
      result = a / b
    }
  }
  const roundedResult = round(result, 5);
  if (checkDisplayLength('' + roundedResult)) {
    return NaN
  }
  return roundedResult;
};

function count() {
  if (firstNum && secondNum !== undefined) {
    calculatorValue = operate(userOperator, firstNum, secondNum);
    calculatorDisplay.textContent = calculatorValue;
    firstNum = calculatorValue;
    calculatorValue = '0';
    toggleBackSpaceBtnState(true);
    togglePointBtnState(false);
  }
}

equalButton.addEventListener('click', () => {
  count();
  secondNum = undefined;
})

