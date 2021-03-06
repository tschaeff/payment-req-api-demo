const STRIPE_PK = 'pk_test_IR0lZ3Ot5IQnsde6xuAmkHvB';

// Config Stripe.js V3
stripe = Stripe(STRIPE_PK);
elements = stripe.elements();

// Config payment request
let prData = {
  country: 'IE',
  currency: 'eur',
  total: {
    label: 'Demo total',
    amount: 0,
  },
};
paymentRequest = stripe.paymentRequest(prData);
paymentRequest.on('source', (event) => {
  console.log('Got source: ', event.source.id);
  event.complete('success');
  ChromeSamples.log(JSON.stringify(event.source, 2));
  // Send the source to your server to charge it!
});
prButton = elements.create('paymentRequestButton', {
  paymentRequest,
});
// Check the availability of the Payment Request API first.
paymentRequest.canMakePayment().then((result) => {
  if (result) {
    // Calculate your total basket and update payment request
    fetch('/.well-known/apple-developer-merchantid-domain-association').then(()=>{
      prData.total.amount = 500
      paymentRequest.update({ total: prData.total });
      prButton.mount('#payment-request-button');
    });
  } else {
    document.getElementById('payment-request-button').style.display = 'none';
    ChromeSamples.setStatus("Not supported, please try with Chrome Beta on Android");
  }
});
// Listen to click events of the button
prButton.on('click', e => {
  // Here you can perform synchronous updates to your payment request
  prData.total.amount += 100
  paymentRequest.update({ total: prData.total });
});

// Helpers
const ChromeSamples = {
  log: function() {
    let line = Array.prototype.slice.call(arguments).map(function(argument) {
      return typeof argument === 'string' ? argument : JSON.stringify(argument);
    }).join(' ');

    document.querySelector('#log').textContent += line + '\n';
  },

  clearLog: function() {
    document.querySelector('#log').textContent = '';
  },

  setStatus: function(status) {
    document.querySelector('#status').textContent = status;
  },

  setContent: function(newContent) {
    var content = document.querySelector('#content');
    while(content.hasChildNodes()) {
      content.removeChild(content.lastChild);
    }
    content.appendChild(newContent);
  }
};
