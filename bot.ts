//imports
import 'dotenv/config';
import { Client, Intents, MessageEmbed } from 'discord.js';
import axios from 'axios';
import mongoose from 'mongoose';
import Users from './schemas/Users';
import Pokemons from './schemas/Pokemons';
import MongoDbError from './classes/MongoDbError';
import { v1 as uuidv1 } from "uuid";

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
async function getPokemonByName(name: string) {
	const response = await axios.get('https://pokeapi.co/api/v2/pokemon/' + name);
	//Creating discord embed for pokemon card
	const pokemonEmbed = new MessageEmbed()
		//Setting colour of sidebar to match image
		.setColor('#f0bf62')
		//Setting title
		.setTitle(name)
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
	return pokemonEmbed;
}

//Function that returns user by id from database
async function getUserById(uid: number) {
	return await Users.findOne({ uid: uid })
		.lean()
		.orFail(new MongoDbError('User has not caught any pokemons yet ! :(', 404));
}

//Function that rolls a random pokemon and returns an embed of it
async function rollPokemon() {
	const pokemonId = uuidv1()
	return await Pokemons.create({pokemonId:pokemonId})
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
			//if statement for when the !pokemon info is inputted
			if (words[1] === 'info') {
				try {
					const pokemonEmbed = await getPokemonByName(words[2]);
					message.reply({ embeds: [pokemonEmbed] });
				} catch (error) {
					message.reply('Pokemon not found idiot');
				}
			}
			//If statement for the when !pokemon collection is inputted
			if (words[1] === 'collection') {
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
					console.log(user);
				} catch (error) {
					if (error instanceof MongoDbError) {
						message.reply(error.message);
					}
				}
			}
			if (words[1] === 'roll') {
				try {
					
				} catch (error) {
					
				}
			}
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
