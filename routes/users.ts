import express, { NextFunction, Request, Response, Router } from "express";

var router: Router = express.Router();

var send = require('../handlers/send');

router.post('/', (req: Request, res: Response, next: NextFunction) => {

  send({ message: "The user has been created successfully" }, res, next);
});

module.exports = router;
