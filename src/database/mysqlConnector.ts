import mysql from "mysql2/promise";


export const queryDb = async ( query: string, params: any[] | null) => {
    try {
      const connection = await mysql.createConnection({
        host: "localhost",
        user: "root",
        password: "",
        database: "miranda_db",
      });
  
        const [rows] = await connection.execute(query, params);
        console.log(rows)
        return rows;
    } catch (err) {
        throw err
    }
};