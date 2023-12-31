import { faker } from "@faker-js/faker";
import { IBooking, IContact, IRoom, IUser, UserFromJson } from "../types/interfaces";
import db from "./db.json";
import { jobDescriptionChooser } from "../services/usersServices";
import { roomInfoChooser } from "../services/roomsServices";
import { generateSalt } from "../middleware/auth"; // Importa la función para generar la sal
import { Contact } from "../models/contacts";
import { connect, disconnect } from "./mongoDBconnection";
import { User } from "../models/users";
import { Room } from "../models/rooms";
import { Booking } from "../models/bookings";
import { hashPassword } from "../middleware/auth";

const InsertAll = async () => {
  await connect();
  await insertJSON();
  await Promise.all([await insertFaker()]);
  await disconnect();
};

const insertJSON = async () => {
  await insertJsonRooms();
  await Promise.all([
    await insertJsonContacts(),
    await insertJsonUsers(),
    await insertJsonBookings(),
  ]);
};

const insertFaker = async () => {
  await insertFakerRooms(10);
  await Promise.all([
    await insertFakerContacts(10),
    await insertFakerUsers(10),
    await insertFakerBookings(10),
  ]);
};

const getRandomValue = (arr: any[]) => {
  const indiceAleatorio = Math.floor(Math.random() * arr.length);
  return arr[indiceAleatorio];
};

const insertJsonContacts = async () => {
  try {
    db.contacts.forEach(async (element) => {
      let contact = await new Contact({
        id: element.id,
        date: element.date,
        customer: element.customer,
        archived: element.archived,
        subject: element.subject,
        comment: element.comment,
      })
        .save()
        .then(() => {
          console.log("Contact saved!");
        })
        .catch((error) => {
          console.error("Error saving the contact: ", error);
        });
    });
  } catch (error) {
    console.error("Error saving the contacts: ", error);
  }
};

const insertFakerContacts = async (count: number) => {
  for (let i = 0; i < count; i++) {
    const lastContact = await Contact.findOne().sort({ id: -1 }).exec() as IContact;
    if (!lastContact) {
      throw Error("Couldn't find contacts in the database");
    } else {
      let id = parseInt(lastContact.id.slice(2));
      let contact = await new Contact({
        id: "C-" + (id + 1).toString().padStart(4, "0"),
        date: new Date(faker.date.past()).toLocaleDateString("en-US", {
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
        }),
        customer: {
          name: faker.person.fullName(),
          email: faker.internet.email(),
          phone: faker.phone.number('501-###-###'),
        },
        archived: getRandomValue([true, false]),
        subject: faker.lorem.sentence(5),
        comment: faker.lorem.paragraph(4),
      })
        .save()
        .then(() => {
          console.log("Contact saved!");
        })
        .catch((error) => {
          console.error("Error saving the contact: ", error);
        });
    }
  }
};

const insertJsonUsers = async () => {
  db.users.forEach(async (element: UserFromJson) => {
    try {
      let { salt, password } = element;
      if (!salt) {
        // Si no existe la sal, genera una sal aleatoria
        salt = await generateSalt();
        // Hashea la contraseña antes de guardarla en la base de datos
        password = await hashPassword(element.password, salt);
      }
      let user = new User({
        id: element.id,
        photo: element.photo,
        name: element.name,
        email: element.email,
        phone: element.phone,
        startDate: element.startDate,
        state: element.state,
        password: password,
        salt: salt, // Almacena la sal en el usuario
        jobDescription: element.jobDescription,
        position: element.position,
      })
        .save()
        .then(() => {
          console.log("User saved!");
        })
        .catch((error) => {
          console.error("Error saving the user: ", error);
        });
    } catch (error) {
      console.error("Error saving the users: ", error);
    }
  });
};


const insertFakerUsers = async (count: number) => {
  for (let i = 0; i < count; i++) {
    const lastUser = await User.findOne().sort({ id: -1 }).exec() as IUser;
    if (!lastUser) {
      throw Error("Couldn't find users in the database");
    } else {
      let id = parseInt(lastUser.id.slice(2));
      let position = getRandomValue([
        "Manager",
        "Receptionist",
        "Room Service",
      ]);
      let password = faker.internet.password();
      const salt = await generateSalt(); // Genera una sal aleatoria
      const hashedPassword = await hashPassword(password, salt); // Hashea la contraseña
      let user = await new User({
        id: "U-" + (id + 1).toString().padStart(4, "0"),
        photo: faker.image.avatar(),
        name: faker.person.fullName(),
        email: faker.internet.email(),
        phone: faker.phone.number('501-###-###'),
        startDate: new Date(faker.date.past()).toLocaleDateString("en-US", {
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
        }),
        state: getRandomValue(["ACTIVE", "INACTIVE"]),
        password: hashedPassword, // Utiliza la contraseña hasheada
        salt: salt, // Almacena la salt del usuario
        jobDescription: jobDescriptionChooser(position),
        position: position,
      })
        .save()
        .then(() => {
          console.log("User saved!");
        })
        .catch((error) => {
          console.error("Error saving the user: ", error);
        });
    }
  }
};

const insertJsonRooms = async () => {
  db.rooms.forEach(async (element) => {
    let room = await new Room({
      id: element.id,
      roomType: element.roomType,
      roomNumber: element.roomNumber,
      description: element.description,
      price: element.price,
      discount: element.discount,
      cancellation: element.cancellation,
      thumbnail: element.thumbnail,
      amenities: element.amenities,
      images: element.images,
      status: element.status
    })
      .save()
      .then(() => {
        console.log("Room saved!");
      })
      .catch((error) => {
        console.error("Error saving the room: ", error);
      });
  });
};

const insertFakerRooms = async (count: number) => {
  for (let i = 0; i < count; i++) {
    const lastRoom = await Room.findOne().sort({ id: -1 }).exec() as IRoom;
    if (!lastRoom) {
      throw Error("Couldn't find rooms in the database");
    } else {
      const lastId = parseInt(lastRoom.id.slice(2));
      const roomType = getRandomValue([
        "Single Bed",
        "Double Bed",
        "Double Superior",
        "Suite",
      ]);
      const room = await new Room({
        id: "R-" + (lastId + 1).toString().padStart(4, "0"),
        roomType: roomType,
        roomNumber: faker.number.int({ min: 100, max: 500 }).toString(),
        description: faker.lorem.paragraph(3),
        price: faker.number.int({ min: 20, max: 500 }),
        discount: faker.number.int({ min: 0, max: 50 }),
        cancellation: roomInfoChooser(roomType).cancellation,
        thumbnail: roomInfoChooser(roomType).thumbnail,
        amenities: roomInfoChooser(roomType).amenities,
        images: roomInfoChooser(roomType).images,
        status: getRandomValue(['AVAILABLE', 'BOOKED'])
      })
        .save()
        .then(() => {
          console.log("Room saved!");
        })
        .catch((error) => {
          console.error("Error saving the room: ", error);
        });
    }
  }
};

const insertJsonBookings = async () => {
  db.bookings.forEach(async (element) => {
    let booking = await new Booking({
      id: element.id,
      name: element.name,
      orderDate: element.orderDate,
      checkIn: element.checkIn,
      checkOut: element.checkOut,
      room: element.room,
      specialRequest: element.specialRequest,
    })
      .save()
      .then(() => {
        console.log("Booking saved!");
      })
      .catch((error) => {
        console.error("Error saving the booking: ", error);
      });
  });
};

const insertFakerBookings = async (count: number) => {
  const roomsId = await Room.find({}, 'id');
  roomsId.filter((room) => room.id !== "R-0000");

  for (let i = 0; i < count; i++) {
    const lastBooking = await Booking.findOne().sort({ id: -1 }).exec() as IBooking;
    if (!lastBooking) {
      throw Error("Couldn't find bookings in the database");
    } else {
      const lastId = parseInt(lastBooking.id.slice(2));
      const orderDate = new Date(faker.date.past()).toLocaleDateString(
        "en-US",
        {
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
        }
      );
      const checkIn = new Date(faker.date.soon({})).toLocaleDateString("en-US", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      });
      const checkOut = new Date(
        faker.date.soon({ days: getRandomValue([3, 4, 5, 8, 9]), refDate: checkIn })
      ).toLocaleDateString("en-US", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      });

      const booking = await new Booking({
        id: "B-" + (lastId + 1).toString().padStart(4, "0"),
        name: faker.person.fullName(),
        orderDate: orderDate,
        checkIn: checkIn,
        checkOut: checkOut,
        room: getRandomValue(roomsId).id,
        specialRequest: faker.lorem.paragraph(3),
      })
        .save()
        .then(() => {
          console.log("Booking saved!");
        })
        .catch((error) => {
          console.error("Error saving the booking: ", error);
        });
    }
  }
};

InsertAll();
