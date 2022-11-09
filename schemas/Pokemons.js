"use strict";
exports.__esModule = true;
var mongoose_1 = require("mongoose");
//Pokemon Schema
var Pokemons = new mongoose_1["default"].Schema({
    pokemonId: {
        type: 'String'
    },
    ownerId: {
        type: 'Number'
    },
    pokedexId: {
        type: 'Number'
    },
    gender: {
        type: 'String'
    },
    shiny: {
        type: 'Boolean'
    },
    height: {
        type: 'String'
    },
    weight: {
        type: 'String'
    },
    claimed: {
        type: 'Boolean'
    },
    ability: {
        type: 'String'
    },
    stats: ['Mixed']
}, { timestamps: true });
exports["default"] = mongoose_1["default"].model('Pokemons', Pokemons);
