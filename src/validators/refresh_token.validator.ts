import joi from "joi";
import { Refreshtoken } from "../interfaces/refresh_token";

const refreshTokenSchema = joi.object<Refreshtoken>({
    refreshToken: joi.string().required()
});

export default refreshTokenSchema;