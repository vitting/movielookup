import { Request, Response } from "express";
import userSchema from "../validators/user.validator";
import { v4 } from "uuid";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { User } from "../interfaces/user";
import { UserModel } from "../db";
import { RefreshTokenModel } from "../db_tokens";
import userLoginSchema from "../validators/user_login.validator";
import { UserLogin } from "../interfaces/user_login";
import refreshTokenSchema from "../validators/refresh_token.validator";
import { Refreshtoken } from "../interfaces/refresh_token";
import { AuthRequest } from "../interfaces/auth_request.interface";

dotenv.config();

export class AuthController {
  public static activeRefreshTokens: string[] = [];

  static async login(req: Request, res: Response) {
    const body = req.body;
    const { error, value } = userLoginSchema.validate(body);
    if (error) {
      res.status(404).json({ error: "Invalid user data supplied" });
      return;
    }

    const user: UserLogin = value as UserLogin;

    const result = await UserModel.findOne({
      where: {
        email: user.email,
      },
    });

    if (!result) {
      res
        .status(404)
        .json({ error: "Supplied Email or Password is incorrect" });
      return;
    }

    const userFromDb = result.toJSON() as User;
    const validPwd = await bcrypt.compare(user.password, userFromDb.password);

    if (!validPwd) {
      res
        .status(404)
        .json({ error: "Supplied Email or Password is incorrect" });
      return;
    }

    const jwtAccessToken = AuthController.generateAccessToken(userFromDb.id!);
    const jwtRefreshToken = AuthController.generateRefreshToken(userFromDb.id!);

    const currentToken = await RefreshTokenModel.findByPk(userFromDb.id);
    if (currentToken) {
      await currentToken.set("token", jwtRefreshToken).save();
    } else {
      await RefreshTokenModel.create({
        id: userFromDb.id,
        token: jwtRefreshToken,
      });
    }

    AuthController.removeTokenFromMem(jwtRefreshToken);
    AuthController.activeRefreshTokens.push(jwtRefreshToken);

    res.json({
      accessToken: jwtAccessToken,
      refreshToken: jwtRefreshToken,
    });
  }

  static async logout(req: Request, res: Response) {
    const authReq = req as AuthRequest;
    const userId = authReq?.auth?.id;

    const refreshToken = await RefreshTokenModel.findByPk(userId);
    if (refreshToken) {
      const token = refreshToken.get("token") as string;
      await refreshToken?.destroy();
      AuthController.removeTokenFromMem(token);
    }

    res.json({ message: "user logged out" });
  }

  static async register(req: Request, res: Response) {
    const body = req.body;
    const { error, value } = userSchema.validate(body);
    if (error) {
      res.status(404).json({ error: "Invalid user data supplied" });
      return;
    }

    const user: User = value as User;

    const userExists = await UserModel.findOne({
      where: {
        email: user.email,
      },
    });

    if (userExists) {
      res.status(404).json({ error: "User already exists" });
      return;
    }

    user.id = v4();
    user.password = await bcrypt.hash(user.password, 10);

    try {
      await UserModel.create(user);
    } catch (error) {
      console.error(error);
      res.status(404).json({ error: "Error creating user" });
      return;
    }

    res.json({
      message: "User created",
      user: { name: user.name, email: user.email },
    });
  }

  static token(req: Request, res: Response) {
    const body = req.body;
    const { error, value } = refreshTokenSchema.validate(body);

    if (error) {
      res.status(404).json({ error: "Invalid data supplied" });
      return;
    }

    const refreshToken: Refreshtoken = value as Refreshtoken;

    if (
      !AuthController.activeRefreshTokens.includes(refreshToken.refreshToken)
    ) {
      return res.sendStatus(403);
    }

    jwt.verify(
      refreshToken.refreshToken,
      process.env.REFRESH_TOKEN_SECRET!,
      (err, payload) => {
        if (err) {
          return res.sendStatus(403);
        }

        const data = payload as { id: string };
        const accessToken = AuthController.generateAccessToken(data.id);
        return res.json({ accessToken });
      }
    );
  }

  static async loadRefreshTokensToMem(): Promise<void> {
    const tokens = await RefreshTokenModel.findAll({attributes: ["token"]});
    this.activeRefreshTokens = tokens.map(model => model.getDataValue("token"));
  }

  private static generateAccessToken(userId: string) {
    return jwt.sign({ id: userId }, process.env.ACCESS_TOKEN_SECRET!, {
      expiresIn: "1h",
    });
  }

  private static generateRefreshToken(userId: string) {
    return jwt.sign({ id: userId }, process.env.REFRESH_TOKEN_SECRET!);
  }

  private static removeTokenFromMem(jwtRefreshToken: string) {
    const indexForRefreshToken = AuthController.activeRefreshTokens.indexOf(
      jwtRefreshToken
    );

    if (indexForRefreshToken) {
      AuthController.activeRefreshTokens.splice(indexForRefreshToken, 1);
    }
  }
}
