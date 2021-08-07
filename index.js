import mc from 'minecraft-protocol';

const HOST = 'localhost';
const PORT = 25565;
const USERS = 2;

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
 * @returns {client} Client
 */
function connectClient(username) {
	console.log(`[${username}] Connecting`);

	const client = mc.createClient({
		host: HOST,
		port: PORT,
		username: username,
		auth: 'mojang',
		version: '1.17.1'
	});

	/**
	 * Logged in
	 */
	client.on('success', () => {
		console.log(`[${username}] Connected Successfully`);
		client.write('chat', { message: `Hello, world!` });
	});

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
}

/**
 * Connect all clients
 * @returns {void}
 */
async function connectAllClients() {
	console.log('Connecting clients...');

	for (let i = 1; i < USERS + 1; i++) {
		connectClient(`Test ${i}`);
		await sleep(1000);
	}

	console.log('Clients connected!');
}

connectAllClients();