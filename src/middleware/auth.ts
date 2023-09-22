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
          if (await hashedPassword === user.password) {
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
export const hashPassword = async (password: string, salt: string): Promise<string> => {
  return new Promise<string>((resolve, reject) => {
    crypto.pbkdf2(password, salt, 10000, 64, "sha512", (err, derivedKey) => {
      if (err) {
        reject(err);
      }
      const hashedPassword = derivedKey.toString("hex");
      resolve(hashedPassword);
    });
  });
};

export const generateSalt = (): string => {
  return crypto.randomBytes(16).toString("hex");
};


export async function verifyPassword(
  password: string,
  hashedPassword: string,
  salt: string
): Promise<boolean> {
  const newHash = await hashPassword(password, salt);
  return newHash === hashedPassword;
}
