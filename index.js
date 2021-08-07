import mc from 'minecraft-protocol';

const HOST = 'localhost';
const PORT = 25565;
const USERS = 100;

/**
 * Sleep
 * @param {integer} duration - Duration in milliseconds to sleep
 * @returns {Promise} Promise 
 */
async function sleep(duration) {
	return new Promise(res => setTimeout(res, duration));
}

/**
 * Connect a new Minecraft client to the server
 * @param {string} username - The username of the client
 * @returns {Promise} Promise that resolves with connected client
 */
function connectClient(username) {
	return new Promise((res, rej) => {
		console.log(`[${username}] Connecting`);

		const client = mc.createClient({
			host: HOST,
			port: PORT,
			username: username,
			auth: 'mojang'
		});

		/**
		 * Logged in
		 */
		client.on('success', () => {
			console.log(`[${username}] Connected Successfully`);
			res(client);
		});

		/**
		 * Disconnected
		 */
		client.on('disconnect', packet => {
			console.log(`[${username}] Disconnected: ${packet.reason}`);
			if (packet.reason.translate === 'multiplayer.disconnect.server_full') rej('Server is full');
		})

		/**
		 * Error
		 */
		client.on('error', error => {
			console.log(`[${username}] Error: ${error}`);
		});

		/**
		 * End
		 */
		client.on('end', error => {
			console.log(`[${username}] End: ${error}`);
		});
	});
}

/**
 * Connect all clients
 * @returns {void}
 */
async function connectAllClients() {
	console.log('Connecting clients...');

	for (let i = 1; i < USERS + 1; i++) {
		await connectClient(`Stress Test ${i}`);
	}

	console.log('Clients connected!');
}

connectAllClients();