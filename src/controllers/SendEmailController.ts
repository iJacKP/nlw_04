import {Request, response, Response} from "express";
import { getCustomRepository } from "typeorm";
import { resolve } from "path";
import { SurveysRepository } from "../repositories/SurveysRepository";
import { UsersRepository } from "../repositories/UsersRepository";
import { SurveysUsersRepository } from "../repositories/SurveysUsersRepository";
import SendMailServices from "../services/SendMailServices";
import { AppError } from "../errors/AppError";

class SendMailController {
    async execute(req: Request,res: Response){
        const { email,survey_id } = req.body;  

        const usersRepository = getCustomRepository(UsersRepository); 
        const surveyRepository = getCustomRepository(SurveysRepository);
        const surveysUsersRepository = getCustomRepository(SurveysUsersRepository);

        const user = await usersRepository.findOne({ email })

        if(!user){
            throw new AppError("User does not exist")
        }


        const survey = await surveyRepository.findOne({id: survey_id})

        if(!survey){
            throw new AppError("Survey does not exist")
        }
        
        //Salvar info na tabela surveyUser


        const npsPath = resolve(__dirname, "..", "views", "emails", "npsMail.hbs");

        const surveyUserAlreadyExists = await surveysUsersRepository.findOne({
            where:{user_id: user.id , value:null},
            relations: ["user","survey"]
        });

        
        const variables = {
            name:user.name,
            title: survey.title,
            description: survey.description,
            id:"",
            link: process.env.URL_MAIL
        }

        if(surveyUserAlreadyExists ){
            variables.id = surveyUserAlreadyExists.id;
            await SendMailServices.execute(email,survey.title, variables,npsPath);
            return res.json(surveyUserAlreadyExists);
        }

        const surveyUser = surveysUsersRepository.create({
            user_id:user.id,
            survey_id
        });

        
        await surveysUsersRepository.save(surveyUser)
        //Enviar Email para o usuário
 
        variables.id = surveyUser.id;
        await SendMailServices.execute(email,survey.title, variables, npsPath);

        return res.json(surveyUser)
    }

}

export { SendMailController }