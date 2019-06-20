module.exports = (req, res, next) => {
  if (req.user.credits < 1) {
    // 403 = Forbitten (REF: https://www.w3.org/Protocols/rfc2616/rfc2616-sec10.html)
    return res.status(403).send({ error: 'Not enough credits.' });
  }

  next();
};
