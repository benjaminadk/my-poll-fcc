export const authHeaderMiddleware = {
  applyMiddleware(req, next) {
    if (!req.options.headers) {
      req.options.headers = {}; 
    }
    const token = window.localStorage.getItem('AUTH_TOKEN');
    req.options.headers.authorization = token ? `${token}` : null;
    next();
  }
}