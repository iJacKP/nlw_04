import {Request, Response} from "express";
import { getCustomRepository } from "typeorm";
import { AppError } from "../errors/AppError";
import { SurveysUsersRepository } from "../repositories/SurveysUsersRepository";


class AnswerController {

    // http://localhost:3000/answers/1?u=829967d6-4445-4af2-b07f-e7f83bb8909f

    async execute(req: Request,res: Response){
        const { value } = req.params;
        const { u } = req.query;

        const surveysUsersRepository = getCustomRepository(SurveysUsersRepository);

        const surveyUser = await surveysUsersRepository.findOne({
            id:String(u)
        })

        if(!surveyUser){
            throw new AppError("Survey  User does not exists!")
        }

        surveyUser.value = Number(value);

        surveysUsersRepository.save(surveyUser)

        return res.json(surveyUser)
    }
}

export { AnswerController }