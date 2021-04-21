import { Request, Response } from "express";
import { resolve } from "path";
import { getCustomRepository } from "typeorm";
import { AppError } from "../errors/AppError";
import { SurveysRepository } from "../repositories/SurveysRepository";
import { SurveysUsersRespository } from "../repositories/SurveysUsersRespository";
import { UsersRepository } from "../repositories/UsersRepository";
import SendMailService from "../services/SendMailService";


class SendMailController {
  async execute(request: Request, response: Response) {
    const { email, survey_id } = request.body;

    const userRepository = getCustomRepository(UsersRepository);
    const surveysRepository = getCustomRepository(SurveysRepository);
    const surveysUsersRespository = getCustomRepository(SurveysUsersRespository);

    const userExists = await userRepository.findOne({email});

    if (!userExists) {
      throw new AppError("User does not exists");
    }

    const surveyExists = await surveysRepository.findOne({id: survey_id});

    if (!surveyExists) {
      throw new AppError("Survey does not exists");
    }

    const surveyUserExists = await surveysUsersRespository.findOne({
      where: {user_id: userExists.id, value: null}, // OR brackets around them and curly braces. AND curly braces around them 
      relations: ["user", "survey"]
    });

    const npsPath = resolve(__dirname, "..", "views", "emails", "npsMail.hbs");

    
    const variables = {
      name: userExists.name,
      title: surveyExists.title,
      description: surveyExists.description,
      id: "",
      link: process.env.URL_MAIL
    }

    if(surveyUserExists) {
      variables.id = surveyUserExists.id;
      await SendMailService.execute(email, surveyExists.title, variables, npsPath);
      return response.json(surveyUserExists)
    };

    const surveyUser = surveysUsersRespository.create({
      user_id: userExists.id,
      survey_id: surveyExists.id
    });
    await surveysUsersRespository.save(surveyUser);

    variables.id = surveyUser.id;
    

    await SendMailService.execute(email, surveyExists.title, variables, npsPath)

    return response.status(201).json(surveyUser);
  }
}

export { SendMailController }