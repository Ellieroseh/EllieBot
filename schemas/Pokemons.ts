import mongoose from "mongoose"

interface PokemonsTypes {
    pokemonId: string;
    ownerId: number;
    pokedexId: number;
    gender: string;
    shiny: boolean;
    height: string;
    weight: string;
    claimed: boolean;
}

//Pokemon Schema
const Pokemons = new mongoose.Schema<PokemonsTypes>( 
    {
        "pokemonId": {
          "type": "String"
        },
        "ownerId": {
          "type": "Number"
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
        },
        "claimed": {
          "type": "Boolean"
        },
      },
      
      { timestamps: true }
      );

export default mongoose.model<PokemonsTypes>("Pokemons", Pokemons);