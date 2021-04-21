import { Request, Response } from "express";
import { getCustomRepository } from "typeorm";
import { AppError } from "../errors/AppError";
import { SurveyUser } from "../models/SurveyUser";
import { SurveysUsersRespository } from "../repositories/SurveysUsersRespository";


class AnswerController {
  async execute(request: Request, response: Response) {
    const { value } = request.params;
    const { u } = request.query;

    const surveysUsersRespository = getCustomRepository(SurveysUsersRespository);

    const surveyUser = await surveysUsersRespository.findOne({
      id: String(u)
    });
    
    if(!surveyUser) {
      throw new AppError("Survey User does not exists!");
    }

    surveyUser.value = Number(value);
    
    await surveysUsersRespository.save(surveyUser);

    return response.json(surveyUser)
  }
}

export { AnswerController }