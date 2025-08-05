class Calculator {
    constructor() {
        this.displayValue = '0';
        this.firstOperand = null;
        this.waitingForSecondOperand = false;
        this.operator = null;
        this.displayElement = document.querySelector('.display-text');
        this.calculatorElement = document.querySelector('.calculator');
        this.isSpinning = false;
        this.spinArray = ['8008', '5328008', '0.607', '707', '376676', '0.7734', '55378008', '217', '58008'];
        this.initializeEventListeners();
    }

    checkForSpin() {
        if (this.isSpinning) return;
        
        if (this.spinArray.includes(this.displayValue)) {
            this.isSpinning = true;
            this.calculatorElement.classList.add('spin');
            
            setTimeout(() => {
                this.calculatorElement.classList.remove('spin');
                this.calculatorElement.classList.add('spin-back');
                this.isSpinning = false;
            }, 2000);

            setTimeout(() => {
                this.calculatorElement.classList.remove('spin-back');
            }, 2500);
        }
    }

    updateDisplay() {
        this.displayElement.textContent = this.displayValue;
        this.checkForSpin();
    }

    inputDigit(digit) {
        if (this.waitingForSecondOperand) {
            this.displayValue = digit;
            this.waitingForSecondOperand = false;
        } else {
            this.displayValue = this.displayValue === '0' ? digit : this.displayValue + digit;
        }
        this.updateDisplay();
    }

    inputDecimal() {
        if (this.waitingForSecondOperand) {
            this.displayValue = '0.';
            this.waitingForSecondOperand = false;
            this.updateDisplay();
            return;
        }

        if (!this.displayValue.includes('.')) {
            this.displayValue += '.';
            this.updateDisplay();
        }
    }

    handleOperator(nextOperator) {
        const inputValue = parseFloat(this.displayValue);

        if (this.operator && this.waitingForSecondOperand) {
            this.operator = nextOperator;
            return;
        }

        if (this.firstOperand === null && !isNaN(inputValue)) {
            this.firstOperand = inputValue;
        } else if (this.operator) {
            const result = this.calculate(this.firstOperand, inputValue, this.operator);
            this.displayValue = `${parseFloat(result.toFixed(7))}`;
            this.firstOperand = result;
        }

        this.waitingForSecondOperand = true;
        this.operator = nextOperator;
        this.updateDisplay();
    }

    calculate(firstOperand, secondOperand, operator) {
        switch (operator) {
            case 'add':
                return firstOperand + secondOperand;
            case 'subtract':
                return firstOperand - secondOperand;
            case 'multiply':
                return firstOperand * secondOperand;
            case 'percent':
                return (firstOperand * secondOperand) / 100;
            default:
                return secondOperand;
        }
    }

    toggleSign() {
        this.displayValue = (parseFloat(this.displayValue) * -1).toString();
        this.updateDisplay();
    }

    clearEntry() {
        this.displayValue = '0';
        this.updateDisplay();
    }

    clearAll() {
        this.displayValue = '0';
        this.firstOperand = null;
        this.waitingForSecondOperand = false;
        this.operator = null;
        this.updateDisplay();
    }

    showHelp() {
        const infoBox = document.getElementById('info-box');
        infoBox.classList.add('visible');
        
        // Hide the info box after 3 seconds
        setTimeout(() => {
            this.hideInfo();
        }, 3000);
    }

    hideInfo() {
        const infoBox = document.getElementById('info-box');
        infoBox.classList.remove('visible');
    }

    initializeEventListeners() {
        document.querySelector('.button-overlay').addEventListener('click', (event) => {
            const target = event.target;
            if (!target.classList.contains('btn')) return;

            // Hide info box when any button is clicked (except help button)
            if (target.dataset.action !== 'help') {
                this.hideInfo();
            }

            if (target.classList.contains('number')) {
                if (target.dataset.action === 'decimal') {
                    this.inputDecimal();
                } else {
                    this.inputDigit(target.dataset.value);
                }
                return;
            }

            if (target.classList.contains('operator')) {
                const action = target.dataset.action;
                if (action === 'equals') {
                    this.handleOperator(null);
                } else {
                    this.handleOperator(action);
                }
                return;
            }

            if (target.classList.contains('function')) {
                const action = target.dataset.action;
                switch (action) {
                    case 'clear':
                        this.clearEntry();
                        break;
                    case 'all-clear':
                        this.clearAll();
                        break;
                    case 'toggle':
                        this.toggleSign();
                        break;
                    case 'percent':
                        this.handleOperator('percent');
                        break;
                    case 'help':
                        this.showHelp();
                        break;
                }
            }
        });
    }
}

// Initialize the calculator when the page loads
document.addEventListener('DOMContentLoaded', () => {
    new Calculator();
});

const spinArray = ["8008", "5328008", "0.607", "707", "376676", "0.7734", "55378008", "217", "58008"]