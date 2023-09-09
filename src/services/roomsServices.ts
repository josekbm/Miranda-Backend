import { connect, disconnect } from "../database/mongoDBconnection";
import { Booking } from "../models/bookings";
import { Room } from "../models/rooms";
import { IBooking, IRoom } from "../types/interfaces";
import { jobDescriptionChooser } from "./usersServices";

export const getRooms = async () => {
  try {
    let rooms: IRoom[] = await Room.find().sort({id: 1 }).exec();
    if (rooms.length > 0) {
      console.log(rooms);
      return rooms;
    } else throw new Error("Couldn`t find rooms on the database.");
  } catch (e) {
    throw e;
  }
};

export const getSingleRoom = async (roomId: IRoom["id"]) => {
  try {
    let room = await Room.findOne({ id: roomId }).exec();
    if (room) {
      console.log(room);
      return room;
    } else
      throw new Error(
        `Room with ID ${roomId} could not be found in the database.`
      );
  } catch (error) {
    throw error;
  } 
};

export const updateRoom = async (updatedRoom: IRoom, roomId: IRoom["id"]) => {
  try {
    updatedRoom.id = roomId;
    updatedRoom.images = roomInfoChooser(updatedRoom.roomType).images;
    updatedRoom.thumbnail = roomInfoChooser(updatedRoom.roomType).thumbnail;
    updatedRoom.amenities = roomInfoChooser(updatedRoom.roomType).amenities;
    updatedRoom.cancellation = roomInfoChooser(
      updatedRoom.roomType
    ).cancellation;

    let room = await Room.findOneAndUpdate(
      { id: roomId },
      {
        $set: updatedRoom,
      },
      { new: true }
    ).exec();

    if (room) {
      return room;
    } else
      throw new Error(
        `Room with ID ${roomId} could not be found in the database.`
      );
  } catch (e) {
    throw e;
  } 
};

export const createRoom = async (newRoom: IRoom) => {
  try {
    const lastRoom = (await Room.findOne().sort({ id: -1 }).exec()) as IRoom;
    const lastId = parseInt(lastRoom.id.slice(2));

    if (!lastRoom) {
      throw Error("Couldn't find rooms on the database");
    } else {
      newRoom.id = "R-" + (lastId + 1).toString().padStart(4, "0");
      newRoom.images = roomInfoChooser(newRoom.roomType).images;
      newRoom.thumbnail = roomInfoChooser(newRoom.roomType).thumbnail;
      newRoom.amenities = roomInfoChooser(newRoom.roomType).amenities;
      newRoom.cancellation = roomInfoChooser(newRoom.roomType).cancellation;

      const room = new Room(newRoom);

      await room
        .save()
        .then(() => {
          console.log("Room saved!");
        })
        .catch((error) => {
          throw new Error("Error saving the room " + error);
        });
      console.log(await room);
      return room;
    }
  } catch (e) {
    throw e;
  } 
};

export const deleteRoom = async (roomId: IRoom["id"]) => {
  try {
    let room = await Room.findOneAndDelete({ id: roomId }).exec();
    if (room) {
      let booking = await Booking.updateMany({room: roomId},  { room: "R-0000"})
      return room;
    } else
      throw new Error(
        `Room with ID ${roomId} could not be found in the database.`
      );
  } catch (e) {
    throw e;
  } 
};

export const roomInfoChooser = (roomType: string) => {
  switch (roomType) {
    case "Single Bed":
      return {
        cancellation:
          "You can cancel up to 24 hours before check-in without penalty.",
        amenities: ["Wi-Fi", "TV", "Air conditioning"],
        thumbnail:
          "https://synergy.booking-channel.com/api/hotels/2165/medias/351",
        images: [
          "https://images.unsplash.com/photo-1505693314120-0d443867891c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1218&q=80-b512e3989a33?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=3087&q=80",
          "https://images.unsplash.com/photo-1604709177225-055f99402ea3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
          "https://images.unsplash.com/photo-1486946255434-2466348c2166?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=687&q=80",
        ],
      };
    case "Double Bed":
      return {
        cancellation:
          "You can cancel up to 48 hours before check-in without penalty.",
        amenities: ["Wi-Fi", "TV", "A/C", "Air conditioning", "Safe"],
        thumbnail:
          "https://images.unsplash.com/photo-1540518614846-7eded433c457?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1157&q=80",
        images: [
          "https://images.unsplash.com/photo-1540518614846-7eded433c457?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1157&q=80",
          "https://plus.unsplash.com/premium_photo-1676320514021-7c68dda90026?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=687&q=80",
          "https://images.unsplash.com/photo-1589834390005-5d4fb9bf3d32?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=687&q=80",
        ],
      };
    case "Double Superior":
      return {
        cancellation:
          "You can cancel up to 72 hours before check-in without penalty.",
        amenities: ["Wi-Fi", "TV", "Safe", "Bathtub", "Air conditioning"],
        thumbnail:
          "https://images.unsplash.com/photo-1560185893-a55cbc8c57e8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
        images: [
          "https://images.unsplash.com/photo-1560185893-a55cbc8c57e8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
          "https://images.unsplash.com/photo-1629079447777-1e605162dc8d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1169&q=80",
          "https://images.unsplash.com/photo-1618220179428-22790b461013?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=627&q=80",
        ],
      };
    case "Suite":
      return {
        cancellation:
          "You can cancel up to 1 week before check-in without penalty.",
        amenities: [
          "Wi-Fi",
          "TV",
          "Kitchen",
          "Hair dryer",
          "Air conditioning",
          "Bathtub",
          "Safe",
        ],
        thumbnail:
          "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
        images: [
          "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
          "https://images.unsplash.com/photo-1609946860441-a51ffcf22208?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1056&q=80",
          "https://images.unsplash.com/photo-1564078516393-cf04bd966897?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=687&q=80",
        ],
      };

    default:
      return {
        cancellation: "",
        amenities: [""],
        thumbnail: "",
        images: [""],
      };
  }
};