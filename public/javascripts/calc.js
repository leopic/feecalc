function init() {
  window.calcMethod = "recommendation";

  // calculator
  window.onkeyup = feeCalc;

  // layout 'manager'
  document.getElementById('compare-checkbox').onchange = switchMethod;
}

init();

// should we recommend or compare?
function switchMethod() {
  var compareEl = document.getElementById('compare-checkbox');

  if(compareEl.checked) {
    document.body.className = "comparison-body";
    window.calcMethod = "comparison";
  } else {
    document.body.className = "recommendation-body"
    window.calcMethod = "recommendation";
  }
}

// option b: bank to bank transfer
function bankToBankCalculation(amount, paypalCalc) {
    var intlTransFee = 33,
        bncrFee = 12,
        bacFee = 15,
        transferenceFee = 0,
        result = {
          className: "bank-transfer",
          preferredMethod: "Bank to bank transfer",
          amount: amount,
          totalFees: 0,
          finalAmount: 0
        }

    if(bncrFee < bacFee){
      transferenceFee = intlTransFee + bncrFee;
    } else {
      transferenceFee = intlTransFee + bacFee;
    }

    result.totalFees = intlTransFee + bncrFee;
    result.finalAmount = amount - result.totalFees;

    return result;
}

// option a: paypal > boa > local, chunks of $400
function paypalCalculation(amount) {
    var paypalFee = 5.5531697938,
        boaPerTransFee = 5, // per $400
        localBankFee = 1.50, // per $400
        maximumPerWidthdraw = 400,
        totalFees = 0,
        totalPaypalfees = (paypalFee * amount)/100,
        result = {
          amount: amount,
          preferredMethod: "",
          newAmount: amount - totalPaypalfees,          
          totalWithdrawals: 0,
          totalFees: 0,
          finalAmount: 0,
          className: "paypal"          
        }

    // if the entire thing can be taken out in a single withdrawal
    if(result.newAmount < maximumPerWidthdraw) { // under $400: use paypal + boa
      result.totalWithdrawals = 1;
      result.totalFees = (boaPerTransFee + localBankFee) + totalPaypalfees;      
      result.finalAmount = result.amount - result.totalFees;      
      result.preferredMethod = "Single withdrawl, use Paypal.";
    } else {
      // if it can not be taken out a single withdrawal, calculate total withdrawals and fees
      result.totalWithdrawals = Math.ceil(result.newAmount / maximumPerWidthdraw);      
      result.totalFees = totalPaypalfees + ((boaPerTransFee + localBankFee) * result.totalWithdrawals);
      result.finalAmount = (result.amount - result.totalFees).toFixed(2);      
      result.preferredMethod = "Multiple withdrawls, use Paypal.";
    }

    return result;
}

// recommendation, old school
function feeCalc() {
  var el = document.getElementById('total-amount');
  
  if(el.value > 0) { 
    var amount = el.value;

    var paypalCalc = paypalCalculation(amount),
        bankToBankCalc = bankToBankCalculation(amount, paypalCalc);

    if(window.calcMethod === "recommendation") {
      if(paypalCalc.finalAmount > bankToBankCalc.finalAmount) {
          displayContent(paypalCalc);
      } else {
        displayContent(bankToBankCalc);
      }
    }
   
}

// print and such 
function displayContent(bestCalculation) {
    var newAmountEl = document.getElementById("new-amount"),
        totalWithdrawalsEl = document.getElementById("total-withdrawals");
        prefferdMethodEl = document.getElementById("preferred-method");

    prefferdMethodEl.innerText = bestCalculation.preferredMethod;
    prefferdMethodEl.parentElement.className = 'payment-method ' + bestCalculation.className;
    document.getElementById("initial-amount").innerText = bestCalculation.amount;
    document.getElementById("total-fees").innerText = parseInt(bestCalculation.totalFees, 10).toFixed(2);
    document.getElementById("final-amount").innerText = parseInt(bestCalculation.finalAmount, 10).toFixed(2);

    if(bestCalculation.newAmount) {
      newAmountEl.parentElement.style.display = 'list-item';
      newAmountEl.innerText = parseInt(bestCalculation.newAmount, 10).toFixed(2);
    } else {
      newAmountEl.parentElement.style.display = 'none';
    }

    if(bestCalculation.totalWithdrawals) {
      totalWithdrawalsEl.parentElement.style.display = 'inline';
      totalWithdrawalsEl.innerText = bestCalculation.totalWithdrawals;
    } else {
      totalWithdrawalsEl.parentElement.style.display = 'none';
    }
  }
}
