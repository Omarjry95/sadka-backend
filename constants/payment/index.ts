module.exports = {
  stripeDefaultParams: {
    typescript: true
  },
  paymentIntentDefaultParams: {
    currency: "eur",
    confirm: true,
    // confirmation_method: "manual",
    use_stripe_sdk: true,
    automatic_payment_methods: {
      enabled: true,
      allow_redirects: 'never'
    }
  }
}