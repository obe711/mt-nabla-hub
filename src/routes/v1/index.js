const express = require('express');
const authRoute = require('./auth.route');
const userRoute = require('./user.route');
const serverRoute = require('./server.route');
const siteRoute = require('./site.route');
const nablaErrorRoute = require("./nablaErrors.route");
const nablaLogRoute = require("./nablaLogs.route")
const accessLogRoute = require("./accessLogs.route")
const docsRoute = require('./docs.route');
const config = require('../../config/config');

const devRoute = require("./dev.route");

const router = express.Router();

const defaultRoutes = [
  {
    path: '/auth',
    route: authRoute,
  },
  {
    path: '/users',
    route: userRoute,
  },
  {
    path: '/servers',
    route: serverRoute,
  },
  {
    path: '/sites',
    route: siteRoute,
  },
  {
    path: "/nablaErrors",
    route: nablaErrorRoute
  },
  {
    path: "/nablaLogs",
    route: nablaLogRoute
  },
  {
    path: "/accessLogs",
    route: accessLogRoute
  },
  {
    path: "/dev",
    route: devRoute
  }
];

const devRoutes = [
  // routes available only in development mode
  {
    path: '/docs',
    route: docsRoute,
  },
];

defaultRoutes.forEach((route) => {
  router.use(route.path, route.route);
});

/* istanbul ignore next */
if (config.env === 'development') {
  devRoutes.forEach((route) => {
    router.use(route.path, route.route);
  });
}

module.exports = router;
