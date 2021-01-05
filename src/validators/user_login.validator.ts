import joi from "joi";
import { UserLogin } from "../interfaces/user_login";

const userLoginSchema = joi.object<UserLogin>({
    email: joi.string().email().required(),
    password: joi.string().min(6).max(50).required()
});

export default userLoginSchema;