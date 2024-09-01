
import mongoose from "mongoose";



const connect_to_db = () => {
    mongoose.connect(
        `mongodb+srv://campushub4u:${process.env.Password}@cluster1.ozwg2bh.mongodb.net/?retryWrites=true&w=majority`
      )
      .then((x) => {
        console.log("connected to database");
      })
      .catch((err) => {
        console.log("error while connecting:", err);
      });
}

export default connect_to_db