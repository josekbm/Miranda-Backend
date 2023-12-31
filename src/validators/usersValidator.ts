import Joi from "joi";

export const validateCreateUser = Joi.object({
  id: Joi.string().max(100).optional(),
  photo: Joi.string().uri().required(),
  name: Joi.string().min(3).max(255).required(),
  position: Joi.string().min(3).max(255).required(),
  email: Joi.string().email().required(),
  phone: Joi.string().required(),
  startDate: Joi.date().min("2022-01-01").max("2023-12-31").required(),
  jobDescription: Joi.string().min(3).max(255).required(),
  state: Joi.string().valid("ACTIVE", "INACTIVE").required(),
  password: Joi.string().alphanum().min(8).required(),
});

export const validateUpdateUser = Joi.object({
  id: Joi.string().max(100).optional(),
  photo: Joi.string().uri().optional(),
  name: Joi.string().min(3).max(255).optional(),
  position: Joi.string().min(3).max(255).optional(),
  email: Joi.string().email().optional(),
  phone: Joi.string().optional(),
  startDate: Joi.date().min("2022-01-01").max("2023-12-31").optional(),
  jobDescription: Joi.string().min(3).max(255).optional(),
  state: Joi.string().valid("ACTIVE", "INACTIVE").optional(),
  password: Joi.string().alphanum().min(8).optional(),
});

/*import { check } from "express-validator";
import moment, { locale } from "moment";
import db from "../database/db.json";

export const validateCreateUser = [
  check("photo")
    .exists()
    .withMessage("Photo must exists")
    .notEmpty()
    .withMessage("Photo can't be empty")
    .isURL()
    .withMessage("Photo must be a valid URL."),
  check("name")
    .exists()
    .withMessage("Name must exists")
    .notEmpty()
    .withMessage("Name can't be empty.")
    .isString()
    .withMessage("Name must be a string."),
  check("position")
    .exists()
    .withMessage("Position must exists")
    .isString()
    .withMessage("Position must be a string"),
  check("email")
    .exists()
    .withMessage("Email must exists")
    .isEmail()
    .withMessage("Email must be a valid email.")
    .notEmpty()
    .withMessage("Email can't be empty"),
  check("phone")
    .exists()
    .withMessage("Phone must exists.")
    .notEmpty()
    .withMessage("Phone can't be empty")
    .isMobilePhone("any")
    .withMessage("Phone must be a valid phone number."),
  check("startDate")
    .notEmpty()
    .withMessage("The start date cannot be empty."),
    /*.custom((value) => {
      if (!moment(value, "MM/DD/YYYY", true).isValid()) {
        throw new Error("The end date is not valid.");
      }
      return true;
    })
    check("jobDescription")
    .exists()
    .withMessage("Job description must exists")
    .isString()
    .withMessage("Job description must be a string"),

  check("state")
    .exists()
    .withMessage("State must exists.")
    .isString()
    .withMessage("State must be a string.")
    .notEmpty()
    .withMessage("State can't be empty"),

  check("password")
    .exists()
    .withMessage("Password must exists.")
    .isString()
    .withMessage("Password must be a string.")
    .notEmpty()
    .withMessage("Password can't be empty.")
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters long."),
];

export const validateUpdateUser = [
  check("photo")
    .exists()
    .withMessage("Photo must exists")
    .notEmpty()
    .withMessage("Photo can't be empty")
    .isURL()
    .withMessage("Photo must be a valid URL."),
  check("name")
    .exists()
    .withMessage("Name must exists")
    .notEmpty()
    .withMessage("Name can't be empty.")
    .isString()
    .withMessage("Name must be a string."),
  check("position")
    .exists()
    .withMessage("Position must exists")
    .isString()
    .withMessage("Position must be a string"),
  check("email")
    .exists()
    .withMessage("Email must exists")
    .isEmail()
    .withMessage("Email must be a valid email.")
    .notEmpty()
    .withMessage("Email can't be empty"),
  check("phone")
    .exists()
    .withMessage("Phone must exists.")
    .notEmpty()
    .withMessage("Phone can't be empty")
    .isMobilePhone("any")
    .withMessage("Phone must be a valid phone number."),
  check("startDate")
    .notEmpty()
    .withMessage("The start date cannot be empty."),
    /*.custom((value) => {
      if (!moment(value, "MM/DD/YYYY", true).isValid()) {
        throw new Error("The end date is not valid.");
      }
      return true;
    })
  check("jobDescription")
    .exists()
    .withMessage("Job description must exists")
    .isString()
    .withMessage("Job description must be a string"),

  check("state")
    .exists()
    .withMessage("State must exists.")
    .isString()
    .withMessage("State must be a string.")
    .notEmpty()
    .withMessage("State can't be empty"),

  check("password")
    .exists()
    .withMessage("Password must exists.")
    .isString()
    .withMessage("Password must be a string.")
    .notEmpty()
    .withMessage("Password can't be empty.")
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters long."),

  check("id")
    .exists()
    .notEmpty()
    .custom(async (value) => {
      const user = await db.users.find((user) => user.id === value);
      if (!user) {
        throw new Error("The booking does not exists on the database.");
      }
      return true;
    }),
];*/