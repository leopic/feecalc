function init() {
  window.onkeyup = feeCalc;
}

init();

function feeCalc() {
  var el = document.getElementById('total-amount');

  // option a
  // paypal > boa > local, chunks of $400
  var paypalFee = 5.5531697938,
      boaPerTransFee = 5, // per $400
      localBankFee = 1.50, // per $400
      maximumPerWidthdraw = 400;

  // option b
  // bank to bank
  var intlTransFee = 33,
      bncrFee = 12,
      bacFee = 15;

  var amount = el.value,
      paypalTakes = (paypalFee * amount)/100,
      newAmount = amount - paypalTakes,
      finalAmount = 0,
      totalWithdrawals = 0;

  console.log("---");
  console.log("What you see in Paypal: $" + amount);

  if(newAmount < 400) {
    finalAmount = newAmount - (boaPerTransFee + localBankFee);
  } else {
    console.log("After Paypal: $" + newAmount);
    console.info("Paypal took: $" + (amount - newAmount));
    totalWithdrawals = Math.ceil(newAmount / maximumPerWidthdraw);
    finalAmount = newAmount - ((boaPerTransFee + localBankFee) * totalWithdrawals);
    console.log("Total in fees: $" + (amount - finalAmount) + ", after " + totalWithdrawals + ".");
  }
  
  console.log("What you end up with: $" + finalAmount);

}
