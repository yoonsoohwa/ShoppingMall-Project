const express = require('express');
const path = require('path');

const viewsRouter = express.Router();

function serveStatic(resource) {
  const resourcePath = path.join(__dirname, `../views/${resource}`);
  const option = { index: `${resource}.html` };
  return express.static(resourcePath, option);
}

viewsRouter.use('/', express.static('views'));
viewsRouter.use('/admin', serveStatic('admin'));
viewsRouter.use('/basket', serveStatic('basket'));
viewsRouter.use('/category', serveStatic('category'));
viewsRouter.use('/login', serveStatic('login'));
viewsRouter.use('/order', serveStatic('order'));
viewsRouter.use('/product', serveStatic('product'));

module.exports = viewsRouter;
