import mongoose from "mongoose"

interface UsersTypes {
    uid: number;
    userName: string;
    listOfCaughtPokemon: string[];
    listOfOwnedPokemon: string[];
}

//Users Schema
const Users = new mongoose.Schema<UsersTypes>( 
    {
        "uid": {
          "type": "Number"
        },
        "userName": {
          "type": "String"
        },
        "listOfCaughtPokemon": {
          "type": [
            "String"
          ]
        },
        "listOfOwnedPokemon": {
          "type": [
            "String"
          ]
        }
      },
      
          { timestamps: true }
      );


export default mongoose.model<UsersTypes>("Users", Users);