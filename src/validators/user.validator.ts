import joi from "joi";
import { User } from "../interfaces/user";

const userSchema = joi.object<User>({
    id: joi.string().uuid().optional(),
    name: joi.string().min(2).max(50).required(),
    email: joi.string().email().required(),
    password: joi.string().min(6).max(50).required()
});

export default userSchema;