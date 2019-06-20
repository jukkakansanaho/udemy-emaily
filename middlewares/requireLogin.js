module.exports = (req, res, next) => {
  if (!req.user) {
    // 401 == Unauthorised (REF: https://www.w3.org/Protocols/rfc2616/rfc2616-sec10.html)
    return res.status(401).send({ error: 'You must log in.' });
  }

  next();
};
