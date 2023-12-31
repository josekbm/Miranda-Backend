import  express from 'express';
import cors from "cors";
import { bookingsRouter } from "./routes/bookingsRoutes";
import {contactsRouter} from "./routes/contactsRoutes"
import { roomsRouter } from "./routes/roomsRoutes";
import { usersRouter } from "./routes/usersRoutes";
import "./middleware/auth"
import passport from 'passport';
import { authRouter } from './routes/authRoutes';
import "dotenv/config"
import mongoose from 'mongoose';

const app = express();

/*const allowedOrigins = ['http://localhost:3000'];

const options: cors.CorsOptions = {
  origin: allowedOrigins
};*/


app.use(cors());

app.use(express.json());

app.use("/login", authRouter )
app.get('/', (req, res) => res.send({
    
    name: "MIRANDA DASHBOARD API",
    endpoints: [{
        bookings: {
            methods: "GET/GET(single)/POST/PUT/DELETE",
            path: "/bookings"
        },
        rooms: {methods: "GET/GET(single)/POST/PUT/DELETE",
                path: "/rooms" },
        contacts: {
            methods: "GET/PUT",
            path: "/contacts"},
            
        users: {
            methods: "GET/GET(single)/POST/PUT/DELETE",
            path: "/users"}
            
    }]
}))
app.use("/bookings", passport.authenticate('jwt', { session: false }), bookingsRouter);
app.use("/contacts", passport.authenticate('jwt', { session: false }), contactsRouter);
app.use("/rooms", passport.authenticate('jwt', { session: false }), roomsRouter);
app.use("/users", passport.authenticate('jwt', { session: false }), usersRouter);

mongoose.connect(String(process.env.MONGO_DB));
const db = mongoose.connection;

db.once('open', () => {
    console.log('Successfully connected to the database!');
});

export default app;