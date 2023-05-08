import express, {NextFunction, Request, Response, Router} from "express";
const SuccessResponse = require('../models/app/SuccessResponse');

var router: Router = express.Router();

router.post('/', (req: Request, res: Response, next: NextFunction) => {
  try {
    throw new Error("Not Successful !");
  }
  catch (e) {
    next(e);
  }
  // res.send(new SuccessResponse());
});

module.exports = router;
