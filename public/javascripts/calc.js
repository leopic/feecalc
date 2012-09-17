function init() {
  window.onkeyup = feeCalc;
}
init();

function feeCalc() {
  var el = document.getElementById('total-amount');
  
  if(el.value > 0) { // don't spend cycles on less than $7 

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
        newAmount = amount - paypalTakes;

    console.log("---");
    console.log("What you startup with: $" + amount);

    // if the entire thing can be taken out in a single withdrawal
    if(newAmount < maximumPerWidthdraw) { // under $400: use paypal + boa
      finalAmount = newAmount - (boaPerTransFee + localBankFee);
      console.log("What you end up using Paypal, single withdraw: $" + finalAmount);
    } else {
      // if it can't be taken out a single withdrawal, calculate total withdrawals and fees
      //document.getElementById("one-initial-amount");
      //console.log("After Paypal: $" + newAmount);
      console.info("Paypal took: $" + (amount - newAmount));
      totalWithdrawals = Math.ceil(newAmount / maximumPerWidthdraw);
      finalAmount = newAmount - ((boaPerTransFee + localBankFee) * totalWithdrawals);
      console.log("Total in fees: $" + (amount - finalAmount) + ", after " + totalWithdrawals + " withdrawals.");
      console.log("What you end up using Paypal: $" + finalAmount);
    }

    // checking if option one is too expensive
    if((amount - finalAmount) > (intlTransFee + bncrFee)){
        console.log('mejor usar bncr');
        console.log('What you end up using BNCR, bank to bank: $' + (amount - (intlTransFee + bncrFee)));
    }
  }
}
