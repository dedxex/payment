/* global Stripe */
export const getStripeToken = (card) =>
new Promise((resolve, reject) => {
  Stripe.setPublishableKey('pk_test_T5KyzJzWEGXXWsWJhLDAWftZ');
  Stripe.card.createToken(card, (status, { error, id }) => {
    if (error) {
      console.log("the error while generating token is",error);
      reject(error.message);
    } else {
      console.log("Id got from response is",id);
      console.log("Id got from response is",status);
      resolve(id);
    }
  });
});
