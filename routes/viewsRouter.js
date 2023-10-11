const express = require('express');
const path = require('path');

const viewsRouter = express.Router();

viewsRouter.use('/', express.static('views'));
viewsRouter.use('/:directory/:subdirectory/:file', (req, res, next) => {
  const { directory, subdirectory, file } = req.params;
  if (!file.includes('.')) {
    res.sendFile(path.join(__dirname, `../views/${directory}/${subdirectory}/${file}.html`));
  } else {
    next();
  }
});
viewsRouter.use('/:directory/:file', (req, res, next) => {
  const { directory, file } = req.params;
  if (!file.includes('.')) {
    res.sendFile(path.join(__dirname, `../views/${directory}/${file}.html`));
  } else {
    next();
  }
});
viewsRouter.use('/:view', (req, res, next) => {
  const { view } = req.params;
  if (!view.includes('.')) {
    res.sendFile(path.join(__dirname, `../views/${view}/${view}.html`));
  } else {
    next();
  }
});

module.exports = viewsRouter;
