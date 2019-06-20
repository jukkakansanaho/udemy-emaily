const keys = require('../config/keys');
const stripe = require('stripe')(keys.stripeSecretKey);
const requireLogin = require('../middlewares/requireLogin');

module.exports = app => {
  app.post('/api/stripe', requireLogin, async (req, res) => {
    const charge = await stripe.charges.create({
      amount: 500,
      currency: 'usd',
      description: '$5 for 5 credits',
      source: req.body.id
    });
    // Add credits to user (model) + save it to Mongodb
    req.user.credits += 5;
    const user = await req.user.save();

    // Send back the updated user (model) to browser/client
    res.send(user);
  });
};
