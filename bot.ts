//imports
import {Client,Intents,MessageEmbed} from 'discord.js';
import axios from 'axios';
import 'dotenv/config';

//initialize discord client
const client = new Client({
  intents: [
      Intents.FLAGS.GUILDS,
      Intents.FLAGS.GUILD_MESSAGES,
      Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
      Intents.FLAGS.DIRECT_MESSAGES,
      Intents.FLAGS.DIRECT_MESSAGE_REACTIONS,
  ],
  partials: ["CHANNEL"],
});

//Takes user input of pokemon name and returns info
async function getPokemonByName(name:string){
  const response = await axios.get("https://pokeapi.co/api/v2/pokemon/"+name)
  //Embed for pokemon card
  const pokemonEmbed = new MessageEmbed()
	.setColor('#0099ff')
	.setTitle(name)
	.setImage(response.data.sprites.front_default)
	.addFields(
		{ name: 'Weight:', value: (response.data.weight/10).toFixed(1) + 'kg'},
		{ name: 'Height:', value: (response.data.height/3.048).toFixed(1) + 'ft'},
	)
	.setFooter('© EllieBot');
  return pokemonEmbed 
}

client.once('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.on("messageCreate", async (message) => {
  if (message.author.bot) return 
  //Splits the words into an array
  const words = message.content.split(" ")
  //checks the first word only
  switch (words[0]){
    case "!pokemon":
      // if command is info
      if (words[1] === "info"){
        try{
          const pokemonEmbed = await getPokemonByName(words[2].toLowerCase())
          message.reply({ embeds: [pokemonEmbed] }); 
        }
        catch(error){
          message.reply("Pokemon not found idiot")
        }
      }
  }
  //if statement for gotta catch em all message
  if (message.content.includes("pokemon")){
    message.channel.send("Gotta catch em all !")
  }
});


client.login(process.env.DISCORD_TOKEN);
