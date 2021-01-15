import { Request, Response } from "express";

export class ViewController {
  static async apiOverview(req: Request, res: Response) {
    res.render("index.ejs");
  }
}
