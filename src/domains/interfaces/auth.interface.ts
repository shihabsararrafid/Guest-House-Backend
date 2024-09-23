import Joi from "joi";
export const registerSchema = Joi.object({
  username: Joi.string().min(3).max(30).optional(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
});
