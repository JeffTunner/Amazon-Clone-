import { formatCurrency } from "../../scripts/utils/money.js";

console.log('Testing formatCurrency function');

console.log('converts cents to dollars');

if(formatCurrency(2095) === '20.95') {
    console.log('Test passed');
} else {
    console.log('Test failed');
}

console.log('works with zero cents');
if(formatCurrency(0) === '0.00') {
    console.log('Test passed');
} else {
    console.log('Test failed');
}

console.log('rounds up to nearest cent');
if(formatCurrency(2000.5) === '20.01') {
    console.log('Test passed');
} else {
    console.log('Test failed');
}