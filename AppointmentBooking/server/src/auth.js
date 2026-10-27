import jwt from "jsonwebtoken";
import { config } from "./config.js";
import { User } from "./models.js";
export const COOKIE = "slotwise_session";
export function setSession(res, user) {
  res.cookie(
    COOKIE,
    jwt.sign({ sub: user.id }, config.jwtSecret, { expiresIn: "7d" }),
    {
      httpOnly: true,
      secure: config.production,
      sameSite: config.production ? "none" : "lax",
      maxAge: 604800000,
    },
  );
}
export async function requireAuth(req, res, next) {
  try {
    const token = req.cookies[COOKIE];
    if (!token)
      return res.status(401).json({ message: "Please log in to continue." });
    const payload = jwt.verify(token, config.jwtSecret);
    const user = await User.findById(payload.sub);
    if (!user)
      return res.status(401).json({ message: "Session is no longer valid." });
    req.user = user;
    next();
  } catch {
    return res.status(401).json({ message: "Session is no longer valid." });
  }
}
export function requireAdmin(req, res, next) {
  if (req.user.role !== "admin")
    return res.status(403).json({ message: "Admin access required." });
  next();
}
