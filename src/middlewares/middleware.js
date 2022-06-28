exports.middlewareGlobal = (req, res, next) => {
    console.log('Middleware Global');
    next();
}

exports.middlewareLocal = (req, res, next) => {
    console.log('Middleware Local');
    next();
}

exports.checkCsrfError = (err, req, res, next) => {
    if (err && err.code === 'EBADCSRFTOKEN') {
        return res.status(403).json({ error: 'Invalid CSRF Token' });
    }
        
}

exports.csrfMiddleware = (req, res, next) => {
    res.locals.csrfToken = req.csrfToken();
    next();
}