import { Router } from "express";
import { AnswerController } from "./controllers/AnswersController";
import { NpsController } from "./controllers/npsController";
import { SendMailController } from "./controllers/SendEmailController";
import { SurveysControllers } from "./controllers/SurveysControllers";
import { UserController } from "./controllers/UserControllers";

const router = Router();

const userController = new UserController(); 
const surveysController = new SurveysControllers(); 

const sendMailController = new SendMailController();

const answerController = new AnswerController();

const npsController = new NpsController; 

router.post("/users", userController.create); 
router.post("/surveys", surveysController.create);  
router.get("/surveys", surveysController.show);  

router.post("/sendMail", sendMailController.execute);

router.get("/answers/:value", answerController.execute);

router.get("/nps/:survey_id", npsController.execute);



export { router };