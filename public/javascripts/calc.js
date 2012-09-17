function init() {
  window.onkeyup = feeCalc;

  var oneInitialAmountEl = document.getElementById("one-initial-amount"),
      oneNewAmountEl = document.getElementById("one-new-amount"),
      oneFinalAmountEl = document.getElementById("one-final-amount"),
      oneTotalFeesEl = document.getElementById("one-total-fees"),
      oneTotalWithdrawal = document.getElementById("one-total-withdrawals");

}
init();

function feeCalc() {
  var el = document.getElementById('total-amount');
  
  if(el.value > 0) { 
    var amount = el.value,
        finalAmount = 0,
        totalWithdrawals = 0;

    // option a
    // paypal > boa > local, chunks of $400
    var paypalFee = 5.5531697938,
        boaPerTransFee = 5, // per $400
        localBankFee = 1.50, // per $400
        maximumPerWidthdraw = 400,
    // option b
    // bank to bank
        intlTransFee = 33,
        bncrFee = 12,
        bacFee = 15;

    var paypalTakes = (paypalFee * amount)/100,
        newAmount = (amount - paypalTakes).toFixed(2);

    console.log("---");

    // if the entire thing can be taken out in a single withdrawal
    if(newAmount < maximumPerWidthdraw) { // under $400: use paypal + boa
      finalAmount = newAmount - (boaPerTransFee + localBankFee);
      console.log("What you end up using Paypal, single withdraw: $" + finalAmount);
    } else {
      // if it can't be taken out a single withdrawal, calculate total withdrawals and fees
      totalWithdrawals = Math.ceil(newAmount / maximumPerWidthdraw);
      finalAmount = (newAmount - ((boaPerTransFee + localBankFee) * totalWithdrawals)).toFixed(2);
      document.getElementById("one-initial-amount").innerText = amount;
      document.getElementById("one-new-amount").innerText = newAmount;
      document.getElementById("one-final-amount").innerText = finalAmount;
      document.getElementById("one-total-fees").innerText = (amount - finalAmount).toFixed(2);
      document.getElementById("one-total-withdrawals").innerText = totalWithdrawals;
    }

    // checking if option one is too expensive
    if((amount - finalAmount) > (intlTransFee + bncrFee)){
        console.log('mejor usar bncr');
        console.log('What you end up using BNCR, bank to bank: $' + (amount - (intlTransFee + bncrFee)));
    }
  }
}
