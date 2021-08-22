import mongoose from "mongoose"

interface PokemonsTypes {
    pokemonId: string;
    pokedexId: number;
    gender: string;
    shiny: boolean;
    height: string;
    weight: string;
}

//Pokemon Schema
const Pokemons = new mongoose.Schema<PokemonsTypes>( 
    {
        "pokemonId": {
          "type": "String"
        },
        "pokedexId": {
          "type": "Number"
        },
        "gender": {
          "type": "String"
        },
        "shiny": {
          "type": "Boolean"
        },
        "height": {
          "type": "String"
        },
        "weight": {
          "type": "String"
        }
      },
      
      { timestamps: true }
      );

export default mongoose.model<PokemonsTypes>("Pokemons", Pokemons);