//imports
import 'dotenv/config';
import { Client, Intents, MessageEmbed } from 'discord.js';
import axios from 'axios';
import mongoose from 'mongoose';
import Users from './schemas/Users';
import Pokemons from './schemas/Pokemons';
import MongoDbError from './classes/MongoDbError';
import { v1 as uuidv1 } from 'uuid';

//initialize discord client
const client = new Client({
	intents: [
		Intents.FLAGS.GUILDS,
		Intents.FLAGS.GUILD_MESSAGES,
		Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
		Intents.FLAGS.DIRECT_MESSAGES,
		Intents.FLAGS.DIRECT_MESSAGE_REACTIONS,
	],
	partials: ['CHANNEL'],
});

//Function that takes user input of pokemon name and returns info
async function getPokemonByName(pokemonName: string) {
	const response = await axios.get(
		'https://pokeapi.co/api/v2/pokemon/' + pokemonName
	);
	//Creating discord embed for pokemon card
	const pokemonInfoEmbed = new MessageEmbed()
		//Setting colour of sidebar to match image
		.setColor('#f0bf62')
		//Setting title
		.setTitle(pokemonName)
		//Setting image
		.setImage(response.data.sprites.other['official-artwork'].front_default)
		//Fields which display information
		.addFields(
			{
				name: 'Average weight:',
				value: (response.data.weight / 10).toFixed(1) + 'kg',
			},
			{
				name: 'Average height:',
				value: (response.data.height / 3.048).toFixed(1) + 'ft',
			}
		)
		.setFooter('© EllieBot');
	return pokemonInfoEmbed;
}

//Function that returns user by id from database
async function getUserById(uid: number) {
	return await Users.findOne({ uid: uid })
		.lean()
		.orFail(new MongoDbError('User has not caught any pokemons yet ! :(', 404));
}

//Function that rolls a random pokemon, logs it in the database and returns an embed of it
async function rollPokemon(ownerId: number) {
	//Generates a unique id for the pokemon in the collection
	const pokemonId = uuidv1();
	//RNG for a number inbetween 1-898 for the pokemon
	const pokedexId = Math.floor(Math.random() * 897 + 1);
	//Pokemon gender
	let gender: string;
	//50% chance male, 50% chance female
	if (Math.floor(Math.random()) === 1) {
		gender = 'female';
	} else {
		gender = 'male';
	}
	//Pokemon shiny
	let shiny: boolean;
	//1 in 450 chance that the pokemon is a shiny pokemon
	if (Math.floor(Math.random() * 449) === 0) {
		shiny = true;
	} else {
		shiny = false;
	}
	//Get pokemon by pokedexId
	const response = await axios.get(
		'https://pokeapi.co/api/v2/pokemon/' + pokedexId
	);
	//Weight multiplier is somewhere inbetween 0.8 and 1.2
	const weightMultiplier = Math.floor(Math.random() * 100 + 50) / 100;
	//The weight of the pokemon is somewhere between 20% < average and 20% > average.
	const weight = response.data.weight * weightMultiplier;
	//Height multiplier is somewhere inbetween 0.8 and 1.2
	const heightMultiplier = Math.floor(Math.random() * 100 + 50) / 100;
	//The height of the pokemon is somewhere between 20% < average and 20% > average.
	const height = response.data.height * heightMultiplier;
	//Selecting a random ability for the pokemon
	const pokemonAbility =
		response.data.abilities[
			Math.floor(Math.random() * response.data.abilities.length)
		];
	//For each loop for RNG pokemon
	const stats = response.data.stats.map((element) => {
		const baseStat =
			element.base_stat * (Math.floor(Math.random() * 100 + 50) / 100);
		const statName = element.stat.name;
		return {
			[statName]: baseStat,
		};
	});

	//creating pokemon in database
	await Pokemons.create({
		pokemonId: pokemonId,
		pokedexId: pokedexId,
		ownerId: ownerId,
		gender: gender,
		shiny: shiny,
		weight: weight,
		height: height,
		stats: stats,
		ability: pokemonAbility.ability.name,
	});

	//checking shiny/female
	let pokemonImage: string = response.data.sprites.front_default;
	//setting the image to shiny if pokemon is shiny
	if (shiny) {
		pokemonImage = response.data.sprites.front_shiny;
	}
	//setting image to female if the pokemon is female
	if (gender === 'female' && response.data.sprites.front_female) {
		pokemonImage = response.data.sprites.front_female;
	}
	//setting image to shiny female if pokemon is female and shiny
	if (
		gender === 'female' &&
		shiny &&
		response.data.sprites.front_shiny_female
	) {
		pokemonImage = response.data.sprites.front_shiny_female;
	}
	//Getting pokemon type
	const types = response.data.types.map((element) => {
		return element.type.name;
	});
	//Creating discord embed for pokemon roll card
	const pokemonRollEmbed = new MessageEmbed()
		//Setting colour of sidebar to match image
		.setColor('#f0bf62')
		//Setting title
		.setTitle(response.data.name)
		//Setting thumbnail image
		.setThumbnail(pokemonImage)
		//Fields which display information
		.addFields(
			{
				name: 'Type(s):',
				value: types.join(', '),
				inline: true,
			},
			{
				name: 'Gender:',
				value: gender,
				inline: true,
			},
			{
				name: 'Shiny:',
				value: shiny.toString(),
				inline: true,
			},
			{
				name: 'Weight:',
				value: weight.toFixed(1) + 'kg',
				inline: true,
			},
			{
				name: 'Height:',
				value: height.toFixed(1) + 'ft',
				inline: true,
			},
			{
				name: 'Ability:',
				value: pokemonAbility.ability.name.split('-').join(' '),
				inline: true,
			},
			{
				name: 'Stats',
				value: '-->',
			},
			{
				name: 'HP:',
				value: stats[0].hp.toFixed(0),
				inline: true,
			},
			{
				name: 'Attack:',
				value: stats[1].attack.toFixed(0),
				inline: true,
			},
			{
				name: 'Defense:',
				value: stats[2].defense.toFixed(0),
				inline: true,
			},
			{
				name: 'Special Attack:',
				value: stats[3]['special-attack'].toFixed(0),
				inline: true,
			},
			{
				name: 'Special Defence:',
				value: stats[4]['special-defense'].toFixed(0),
				inline: true,
			},
			{
				name: 'Speed:',
				value: stats[5].speed.toFixed(0),
				inline: true,
			}
		)
		.setFooter('© EllieBot');
	console.log(pokemonRollEmbed)
	return pokemonRollEmbed;
}


//Console log that discord bot connected to discord
client.once('ready', () => {
	console.log(`Logged in as ${client.user.tag}!`);
});

client.on('messageCreate', async (message) => {
	if (message.author.bot) return;
	//Splits the words into an array
	const words = message.content.toLowerCase().split(' ');
	//checks the first word only
	switch (words[0]) {
		case '!p':
		case '!pokemon':
			//when the !pokemon info is inputted
			switch (words[1]) {
				case 'info':
					try {
						const pokemonInfoEmbed = await getPokemonByName(words[2]);
						message.reply({ embeds: [pokemonInfoEmbed] });
					} catch (error) {
						message.reply('Pokemon not found idiot');
					}
					break;
				//when !pokemon collection is inputted
				case 'collection':
					try {
						let uid: string;
						//If no user is mentioned the user id is the id of the message author
						if (!words[2]) {
							uid = message.author.id;
						}
						//Otherwise the user id is the discord id of the user mentioned in the message
						else {
							const regexp = RegExp('<@!(?<uid>.+?)>');
							const matches = words[2].match(regexp);
							uid = matches.groups.uid;
						}
						const user = await getUserById(Number.parseInt(uid));
					} catch (error) {
						if (error instanceof MongoDbError) {
							message.reply(error.message);
						}
					}
					break;
				case 'roll':
					try {
						const pokemonRollEmbed = await rollPokemon(
							Number.parseInt(message.author.id)
						);
						message.reply({ embeds: [pokemonRollEmbed] });
					} catch (error) {
						if (error instanceof MongoDbError) {
							message.reply(error.message);
						}
					}
					break;
			}
			break;
	}
	//if statement for gotta catch em all message
	if (message.content.includes('pokemon')) {
		message.channel.send('Gotta catch em all !');
	}
});

//Mongodb database connection
mongoose.connect(
	process.env.MONGO_TOKEN,
	{ useNewUrlParser: true, useUnifiedTopology: true },
	() => {
		console.log('Connection to Database established');
	}
);

client.login(process.env.DISCORD_TOKEN);
