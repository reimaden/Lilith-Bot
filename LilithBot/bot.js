const Discord = require('discord.js');
const Sequelize = require('sequelize');
const client = new Discord.Client();
const auth = require('./auth.json');

// Used to call the bot
const prefix = '!';

const sequelize = new Sequelize('database', 'user', 'password', {
	host: 'localhost',
	dialect: 'sqlite',
	logging: false,
	// SQLite only
	storage: 'database.sqlite',
});

const Tags = sequelize.define('tags', {
	name: {
		type: Sequelize.STRING,
		unique: true,
	},
	description: Sequelize.TEXT,
	username: Sequelize.STRING,
	usage_count: {
		type: Sequelize.INTEGER,
		defaultValue: 0,
		allowNull: false,
	},
});

// Login message
client.on('ready', () => {
    Tags.sync();
    console.log(`Logged in as ${client.user.tag}!`);
});

// List of commands
client.on('message', async message => {
	if (message.content.startsWith(prefix)) {
		const input = message.content.slice(prefix.length).split(' ');
		const command = input.shift();
		const commandArgs = input.join(' ');

		if (command === 'addItem') {
			const splitArgs = commandArgs.split(' ');
			const tagName = splitArgs.shift();
			const tagDescription = splitArgs.join(' ');

			try {
			// equivalent to: INSERT INTO tags (name, description, username) values (?, ?, ?);
			const tag = await Tags.create({
			name: tagName,
			description: tagDescription,
			username: message.author.username,
		});
			return message.reply(`${tag.name} added to user`);
		}
		catch (e) {
			if (e.name === 'SequelizeUniqueConstraintError') {
				return message.reply('That item already exists.');
			}
			return message.reply('Something went wrong with adding the item.');
		}
		} else if (command === 'tag') {
			// [epsilon]
		} else if (command === 'edittag') {
			// [zeta]
		} else if (command === 'taginfo') {
			// [theta]
		} else if (command === 'showtags') {
			// [lambda]
		} else if (command === 'remove') {
			const tagName = commandArgs;

			// equivalent to: DELETE from tags WHERE name = ?;
			const rowCount = await Tags.destroy({ where: { name: tagName } });
			if (!rowCount) return message.reply('Uh oh a fucky wucky occurred since item does not exist QwQ');

			return message.reply('Item removed');
		} else if (command === 'help') {
			// Returns a list of commands
			return message.reply('UwU here are the commands to reach me');
			// Add commands later i'm too tired atm lmao
		}
	}
});

client.login(auth.token);