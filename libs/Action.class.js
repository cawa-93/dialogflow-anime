const shikimori = require('./shikimori')

class Action {
	constructor({parameters, outputContexts, requestSource, session}) {
		this.parameters = parameters
		this.outputContexts = outputContexts
		this.requestSource = requestSource
		this.session = session
	}

	async toJson() {
		const json = {
			source: 'shikimori.org'
		}

		const keys = ['fulfillmentText','fulfillmentMessages','outputContexts','source']
		
		keys.forEach(key => {
	    if (this[key]) {
	      json[key] = this[key]
	    }
		})

		return json
	}

	async getAnimes(params, url = '/animes') {
		const {data} = await shikimori.get(url, { params })
		if (!params.limit) {
			params.limit = 3
		}
    return Promise.all(
    	data.slice(0, params.limit).map(a => this.getSingleAnime(a.id))
  	)
	}

	async getSingleAnime(id) {
		return (await shikimori.get(`/animes/${id}`)).data
	}

	getCard(anime) {
		return {
			title: (anime.russian || anime.name) + (anime.score ? ` (${anime.score}/10)` : ''),
			subtitle: anime.description ? anime.description.replace(/\[[^]+\]/gi, '') : undefined,
			imageUri: anime.image ? `https://shikimori.org${anime.image.original}` : undefined,
			buttons: [{
			  "text": 'Смотреть',
			  "postback": anime.shortUrl || 'https://shikimori.org'+anime.url,
			}]
		}
	}

	pushMessage (message) {
		if (!message.platform)
			message.platform = 'PLATFORM_UNSPECIFIED'

		if (!this.fulfillmentMessages) {
			this.fulfillmentMessages = []
		}
		this.fulfillmentMessages.push(message)
	}
}

module.exports = Action