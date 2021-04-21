import { Request, Response } from 'express';
import { getCustomRepository } from 'typeorm';
import { UsersRepository } from '../repositories/UsersRepository';
import * as yup from 'yup';
import { AppError } from '../errors/AppError';
/* 
  GET => Fetch,
  POST => Save,
  PUT => Change,
  DELETE => Delete,
  PATCH => specific change
*/
class UserController {
  async create(request: Request, response: Response) {
    const { name, email } = request.body;

    const schema = yup.object().shape({
      name: yup.string().required("You need a name"),
      email: yup.string().email("It didn't seem like an email, sorry").required("Please a email, ok?")
    });

    try {
      await schema.validate(request.body, {abortEarly: false})
    } catch (err) {
      throw new AppError(err);
    }

    const usersRespository = getCustomRepository(UsersRepository)
    const userAlreadyExists = await usersRespository.findOne({
      email
    });

    if (userAlreadyExists) {
      throw new AppError("User already exists");
    };

    const user = usersRespository.create({
      name, email
    });

    await usersRespository.save(user)
    return response.status(201).json(user);
  }

  async show(request: Request, response: Response) {
    const usersRepository = getCustomRepository(UsersRepository);

    const all = await usersRepository.find();

    return response.json(all);
  }
}

export { UserController };
