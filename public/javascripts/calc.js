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

  feeCalc();
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
      result.finalAmount = result.amount - result.totalFees;      
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
        displayRecommendation(paypalCalc);
      } else {
        displayRecommendation(bankToBankCalc);
      }
    } else {
      displayComparisons(paypalCalc, bankToBankCalc);
    }
}

// displaying both payment methods, paypal and b2b
function displayComparisons(paypalCalc, bankToBankCalc) {
  var pplInitialAmtEl = document.getElementById('ppl-initial-amount'),
      pplNewAmtEl = document.getElementById('ppl-new-amount'),
      pplTotalFeesEl = document.getElementById('ppl-total-fees'),
      pplTotalWithdrawalsEl = document.getElementById('ppl-total-withdrawals'),
      pplFinalAmtEl = document.getElementById('ppl-final-amount'),
      b2bInitialAmtEl = document.getElementById('b2b-initial-amount'),
      b2bTotalFeesEl = document.getElementById('b2b-total-fees'),
      b2bFinalAmtEl = document.getElementById('b2b-final-amount');

    // paypal prints
    pplInitialAmtEl.innerText = parseFloat(paypalCalc.amount).toFixed(2);
    pplNewAmtEl.innerText = parseFloat(paypalCalc.newAmount).toFixed(2);
    pplTotalFeesEl.innerText = parseFloat(paypalCalc.totalFees).toFixed(2); 
    pplTotalWithdrawalsEl.innerText = paypalCalc.totalWithdrawals; 
    pplFinalAmtEl.innerText = parseFloat(paypalCalc.finalAmount).toFixed(2); 

    // bank to bank prints
    b2bInitialAmtEl.innerText = parseFloat(bankToBankCalc.amount).toFixed(2); 
    b2bTotalFeesEl.innerText = parseFloat(bankToBankCalc.totalFees).toFixed(2);
    b2bFinalAmtEl.innerText = parseFloat(bankToBankCalc.finalAmount).toFixed(2);

    // adding a 'best' class to the container elements
    if(bankToBankCalc.finalAmount > paypalCalc.finalAmount) {
      document.getElementsByClassName('comparison-paypal')[0].classList.remove('best');
      document.getElementsByClassName('comparison-bank-transfer')[0].classList.add('best');
    } else {
      document.getElementsByClassName('comparison-bank-transfer')[0].classList.remove('best');
      document.getElementsByClassName('comparison-paypal')[0].classList.add('best');
    }
}

// print and such 
function displayRecommendation(recPayMethod) {
    var newAmountEl = document.getElementById("new-amount"),
        totalWithdrawalsEl = document.getElementById("total-withdrawals"),
        prefMethodEl = document.getElementById("preferred-method"),
        initialAmtEl = document.getElementById("initial-amount"),
        totalFeesEl = document.getElementById("total-fees"),
        finalAmtEl = document.getElementById("final-amount");

    prefMethodEl.parentElement.className = 'payment-method ' + recPayMethod.className;
    prefMethodEl.innerText = recPayMethod.preferredMethod;
    initialAmtEl.innerText = parseFloat(recPayMethod.amount).toFixed(2);
    totalFeesEl.innerText = parseFloat(recPayMethod.totalFees).toFixed(2);
    finalAmtEl.innerText = parseFloat(recPayMethod.finalAmount).toFixed(2);

    if(recPayMethod.newAmount) {
      newAmountEl.parentElement.style.display = 'list-item';
      newAmountEl.innerText = parseFloat(recPayMethod.newAmount).toFixed(2);
    } else {
      newAmountEl.parentElement.style.display = 'none';
    }

    if(recPayMethod.totalWithdrawals) {
      totalWithdrawalsEl.parentElement.style.display = 'inline';
      totalWithdrawalsEl.innerText = recPayMethod.totalWithdrawals;
    } else {
      totalWithdrawalsEl.parentElement.style.display = 'none';
    }
  }
}
