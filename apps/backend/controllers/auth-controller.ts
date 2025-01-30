import { Request, Response } from "express";
import passport from "passport";
import jwt from "jsonwebtoken";

const SECRET_KEY = process.env.SECRET_KEY as string;

export const login = (req: Request, res: Response): void => {
  passport.authenticate("local", { session: false }, (err: any, user: any, info: any) => {
    if (err || !user) {
      return res.status(401).json({ error: info?.message || "Invalid credentials" });
    }

    // If authentication is successful, create JWT token
    const token = jwt.sign(
      { userId: user._id, username: user.username },
      SECRET_KEY,
      { expiresIn: "1h" }
    );

    // Set JWT token in HTTP-only cookie
    res.cookie("jwt", token, { httpOnly: true, secure: false, sameSite: "strict" })
      .json({ message: "Logged in successfully" });
  })(req, res);
};

export const logout = (req: Request, res: Response): void => {
  res.clearCookie("jwt").json({ message: "Logged out successfully" });
};
