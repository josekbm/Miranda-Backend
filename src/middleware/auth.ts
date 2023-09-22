import passport from "passport";
import { Strategy as localStrategy } from "passport-local";
import { Strategy as JWTstrategy } from "passport-jwt";
import { ExtractJwt as ExtractJWT } from "passport-jwt";
import "dotenv/config";
import crypto from "crypto"; // Importa el módulo crypto
import { User } from "../models/users";

passport.use(
  "login",
  new localStrategy(
    {
      usernameField: "email",
      passwordField: "password",
    },
    async (email: string, password: string, done) => {
      try {
        const user = await User.findOne({
          email: email,
        }).exec();
        if (user) {
          const hashedPassword = hashPassword(password, user.salt); // Genera el hash usando la sal almacenada en el usuario
          if (hashedPassword === user.password) {
            console.log("Valid credentials!");
            return done(null, { id: user.id, email: email });
          } else {
            return done(new Error("Invalid password!"), false);
          }
        } else return done(new Error("Invalid credentials!"), false);
      } catch (error: any) {
        return done(error);
      }
    }
  )
);

passport.use(
  new JWTstrategy(
    {
      secretOrKey: process.env.SECRET_KEY,
      jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
    },
    async (token, done) => {
      try {
        return done(null, token.user);
      } catch (error) {
        done(error);
      }
    }
  )
);

// Función para generar un hash usando crypto y una sal
export function hashPassword(password: string, salt: string): string {
  const hash = crypto.pbkdf2Sync(password, salt, 100000, 64, "sha512");
  return hash.toString("hex");
}

export async function generateSalt(): Promise<string> {
  const salt = crypto.randomBytes(16).toString("hex");
  return salt;
}


export async function verifyPassword(
  password: string,
  hashedPassword: string,
  salt: string
): Promise<boolean> {
  const newHash = hashPassword(password, salt);
  return newHash === hashedPassword;
}
