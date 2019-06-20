const _ = require('lodash');
const Path = require('path-parser').default;
const { URL } = require('url');
const mongoose = require('mongoose');
const requireLogin = require('../middlewares/requireLogin');
const requireCredits = require('../middlewares/requireCredits');
const Mailer = require('../services/Mailer');
const surveyTemplate = require('../services/emailTemplates/surveyTemplate');

const Survey = mongoose.model('surveys');

module.exports = app => {
  // NOTE: Remember to add 'requireLogin' as a 2nd arg
  // ... to make sure user has been authenticated to use the route.
  app.get('/api/surveys', requireLogin, async (req, res) => {
    // NOTE: In Survey model, creator's user id is stored in Survey._user
    // NOTE: User info is stored in req.user
    // NOTE: To handle async func calls,
    // ...Remember to add 'async' before the function
    // ... and 'await' before the actual DB query
    const surveys = await Survey.find({ _user: req.user.id }).select({
      recipients: false
    });
    // NOTE: 'surveys' response contains also a list of all (potentially 10k+) recipients.
    // => We don't want to send all that data over the NW.
    // => We added .select({ recipients: false }) to exclude recipients from the response.
    // NOTE: To test the endpoint/route, you can do the following:
    // 1) Open browser console
    // 2) type 'axios' to check that axios is in use.
    // 3) Type axios.get('/api/surveys')
    // => If you were logged-in, server returns all your surveys as a response array.
    res.send(surveys);
  });

  app.get('/api/surveys/:surveyId/:choice', (req, res) => {
    res.send('Thanks for voting!');
  });

  // In DEV, Using https://localtunnel.github.io/www/ (service + LocalTunnel server)
  // to route SendGrid messages to localhost.
  // LocalTunnel domain: https://esmethehavaneserocksinmurto.localtunnel.me
  // See package for LocalTunnel configuration.
  // Configure SendGrid: https://app.sendgrid.com/settings/mail_settings
  // => Complete Webhook: https://esmethehavaneserocksinmurto.localtunnel.me/api/surveys/webhooks
  app.post('/api/surveys/webhooks', (req, res) => {
    // Define the parameters we are looking for from pathname (surveyId and choice)
    // Refactor: Moving Path variable outside of the map statement loop.
    const p = new Path('/api/surveys/:surveyId/:choice');

    _.chain(req.body)
      .map(({ email, url }) => {
        // Extract pathname from the event + Compare/test PATH p against pathname
        // p will be either a) match {surveyId: 123456, choice: yes} OR 'null'
        // Refactor: removing a separate pathname variable
        // and moving it inside p.test function.
        const match = p.test(new URL(url).pathname);
        if (match) {
          return {
            email,
            surveyId: match.surveyId,
            choice: match.choice
          };
        }
      })
      // Remove any "undefined" events from the array of events.
      .compact()
      // Remove duplicate events (that have identical email AND surveyId) from array of events.
      // NOTE: events that have identical email but different surveyId are OK.
      .uniqBy('email', 'surveyId')
      // Process filtered unique events and update them to MongoDB
      .each(({ surveyId, email, choice }) => {
        Survey.updateOne(
          {
            _id: surveyId,
            recipients: {
              $elemMatch: { email: email, responded: false }
            }
          },
          {
            $inc: { [choice]: 1 },
            $set: { 'recipients.$.responded': true },
            lastResponded: new Date()
          }
        ).exec();
      })
      // After _.chain'ing the steps, pull out the final value
      // tobe be assigned to events variable.
      .value();

    //console.log(events);
    // Send response to SendGrid that all is OK.
    res.send({});
  });
  // Using async - await to make func call asynchronous.
  app.post('/api/surveys', requireLogin, requireCredits, async (req, res) => {
    const { title, subject, body, recipients } = req.body;

    // NOTE: ES6 syntax below: when key and value are the same, only key is required
    // e.g. title: title => title
    // NOTE: map(email => { return { email: email } }) === map(email => ({ email }))
    // NOTE: to cut out extra white space from email string, we use map(email => ({ email: email.trim() }))
    const survey = new Survey({
      title,
      subject,
      body,
      recipients: recipients.split(',').map(email => ({ email: email.trim() })),
      _user: req.user.id,
      dateSent: Date.now()
    });
    // TODO: Add 'redirectUrl' parameter to Survey model
    // to enable customised landing page for user who clicked link in email.

    // Great place to send an email!
    // 1st arg: survey object with subject + recipients of the email
    // 2nd arg: content of email == HTML template with body of survey object
    const mailer = new Mailer(survey, surveyTemplate(survey));
    try {
      await mailer.send();
      await survey.save();
      req.user.credits -= 1;
      const user = await req.user.save();

      res.send(user);
    } catch (err) {
      res.status(422).send(err); // 422 == Unprocessable entity = something is wrong with the data you send us.
    }
  });
};
