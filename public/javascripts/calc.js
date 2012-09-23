function init() {
  window.onkeyup = feeCalc;
}
init();

function feeCalc() {
  var el = document.getElementById('total-amount');
  
  if(el.value > 0) { 
    var amount = el.value,
        finalAmount = 0,
        totalWithdrawals = 0,
        preferredMethod;

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

    // if the entire thing can be taken out in a single withdrawal
    if(newAmount < maximumPerWidthdraw) { // under $400: use paypal + boa
      finalAmount = newAmount - (boaPerTransFee + localBankFee);
      totalWithdrawals = 1;
      preferredMethod = "Single withdrawl, use Paypal.";
    } else {
      // if it can't be taken out a single withdrawal, calculate total withdrawals and fees
      totalWithdrawals = Math.ceil(newAmount / maximumPerWidthdraw);
      finalAmount = (newAmount - ((boaPerTransFee + localBankFee) * totalWithdrawals)).toFixed(2);
      preferredMethod = "Multiple withdrawls, use Paypal.";
    }

    // checking if option one is too expensive, then use option B
    if((amount - finalAmount) > (intlTransFee + bncrFee)){
      totalFees = intlTransFee + bncrFee;
      totalWithdrawals = false;
      newAmount = false;
      preferredMethod = "Bank to bank transfer";
    } 
   
   // print and such 
    document.getElementById("one-initial-amount").innerText = amount;
    if(newAmount){
      document.getElementById("one-new-amount").parentElement.style.display = 'list-item';
      document.getElementById("one-new-amount").innerText = newAmount;
    } else {
      document.getElementById("one-new-amount").parentElement.style.display = 'none';
    }
    document.getElementById("one-new-amount").innerText = newAmount;
    document.getElementById("one-final-amount").innerText = finalAmount;
    document.getElementById("one-total-fees").innerText = (amount - finalAmount).toFixed(2);
    if(totalWithdrawals){
      document.getElementById("one-total-withdrawals").parentElement.style.display = 'inline';
      document.getElementById("one-total-withdrawals").innerText = totalWithdrawals;
    } else {
      document.getElementById("one-total-withdrawals").parentElement.style.display = 'none';
    }
    document.getElementById("one-total-withdrawals").innerText = totalWithdrawals;
    document.getElementById("preferred-method").innerText = preferredMethod;
  }
}
