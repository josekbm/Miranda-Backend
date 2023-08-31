import { Booking, Room } from "../types/interfaces";
import { queryDb } from "../database/mysqlConnector";
import { ResultSetHeader } from "mysql2";

export const getRooms = async () => {
  try {
    const query = "SELECT * from rooms";

    return await queryDb(query, null);
  } catch (e) {
    throw e;
  }
};

export const getSingleRoom = async (roomId: Room["id"]) => {
  try {
    const query = "SELECT * from rooms WHERE id= ?;";
    const room = (await queryDb(query, [roomId])) as Room[];

    if (room.length === 0) {
      throw new Error("Room not found!");
    } else {
      return room;
    }
  } catch (error) {
    throw error;
  }
};

export const updateRoom = async (updatedRoom: Room, roomId: Room["id"]) => {
  try {
    const {
      roomType,
      roomNumber,
      description,
      price,
      discount,
      cancellation,
      amenities,
      thumbnail,
      images,
      status,
    } = updatedRoom;

    const query =
      "UPDATE rooms SET roomType=?, roomNumber=?, description=?, price=?, discount=?, cancellation=?, thumbnail=?, amenities=?, images=?, status=? WHERE id=?";

    const roomDb = (await queryDb(query, [
      roomType,
      roomNumber,
      description,
      price,
      discount,
      roomInfoChooser(roomType).cancellation,
      roomInfoChooser(roomType).thumbnail,
      JSON.stringify(roomInfoChooser(roomType).amenities),
      JSON.stringify(roomInfoChooser(roomType).images),
      status,
      roomId,
    ])) as ResultSetHeader;

    if (roomDb.affectedRows === 0) {
      throw new Error("Couldn't create the Room.");
    } else return getSingleRoom(roomId);
  } catch (e) {
    throw e;
  }
};

export const createRoom = async (newRoom: Room) => {
  try {
    const lastRoom = (await queryDb(
      "SELECT id FROM rooms ORDER BY ID DESC LIMIT 1;",
      null
    )) as Room[];

    if (lastRoom.length === 0) {
      throw Error("Couldn't find rooms on the database");
    } else {
      const lastId = parseInt(lastRoom[0].id.slice(2));
      const id = "R-" + (lastId + 1).toString().padStart(4, "0");

      const roomDb = (await queryDb(
        "INSERT INTO rooms (id, roomType, roomNumber, description, price, discount, cancellation, amenities, thumbnail, images, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
        [
          id,
          newRoom.roomType,
          newRoom.roomNumber,
          newRoom.description,
          newRoom.price,
          newRoom.discount,
          roomInfoChooser(newRoom.roomType).cancellation,
          JSON.stringify(roomInfoChooser(newRoom.roomType).amenities),
          roomInfoChooser(newRoom.roomType).thumbnail,
          JSON.stringify(roomInfoChooser(newRoom.roomType).images),
          newRoom.status,
        ]
      )) as ResultSetHeader;

      if (roomDb.affectedRows === 0) {
        throw new Error("Couldn't create the Room.");
      } else return getSingleRoom(id);
    }
  } catch (e) {
    throw e;
  }
};

export const deleteRoom = async (roomId: Room["id"]) => {
  try {
    const query = "DELETE FROM rooms WHERE id= ?;";
    const room = (await queryDb(query, [roomId])) as ResultSetHeader;
    if (room.affectedRows === 0) {
      throw new Error("Couldn't delete the room.");
    } else {
      return roomId;
    }
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
          "https://images.unsplash.com/photo-https://images.unsplash.com/photo-1505693314120-0d443867891c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1218&q=80-b512e3989a33?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=3087&q=80",
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
