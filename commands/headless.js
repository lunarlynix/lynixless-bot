const { SlashCommandBuilder } = require('@discordjs/builders');
const needle = require('needle');
require('dotenv').config();

module.exports = {
	data: new SlashCommandBuilder()
		.setName('headless')
		.setDescription('Used for executing headless commands')
		.addStringOption(option => 
			option.setName('headless')
				.setDescription('The headless server you want to control')
				.setRequired(true)
				.addChoice('Lynixless', 'lynixless-headless'))
		.addStringOption(option =>
			option.setName('action')
				.setDescription('The action you want to run')
				.setRequired(true)
				.addChoice('Restart', 'restart')
				.addChoice('Start', 'start')
				.addChoice('Stop', 'stop')
				.addChoice('Invite', 'invite')
				.addChoice('Accept Friend Request', 'acceptfriendrequest')
				.addChoice('Patch', 'patch')
				.addChoice('Get Metric', 'sysinfo')
				.addChoice('API Health Check', 'healthz'))
		.addStringOption(option =>
			option.setName('option')
				.setDescription('Extra arguments for Metrics and Friend Requests')
				.setRequired(false)),
	async execute(interaction) {
		const headless = interaction.options.getString('headless');
		const action = interaction.options.getString('action');
		const headers = {
			headers: { 'X-API-Key' : process.env.APIKEY }
		}
		let optvalue = interaction.options.getString('option') || 'nothing';
		if(optvalue == 'nothing'){
			var uri = `https://${process.env.APISERVER}/${headless}/${action}`;
		}else{
			var uri = `https://${process.env.APISERVER}/${headless}/${action}/${optvalue}`
		}
		let test = await needle('get', uri, '', headers)
					.then(function(resp) { return resp.body })
					.catch(function(err) { return err })
		await interaction.reply({ content: `**Headless:** ${headless}, **Action:** ${action}, **Optional Value:** ${optvalue}, **Response:** ${JSON.stringify(test.state)||JSON.stringify(test.error)}`, ephemeral: true });
	},
};
