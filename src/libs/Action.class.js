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

	async getAnimes(params, url = '/animes', extend = true) {
		if (!params.limit) {
			params.limit = 3
		}
		
		let {data: animes} = await shikimori.get(url, { params })
		animes = animes.slice(0, params.limit)
		
		if (!extend) {
			return animes
		}

    return Promise.all(
    	animes.map(a => this.getSingleAnime(a.id))
  	)
	}

	async getSingleAnime(id) {
		const {data} = await shikimori.get(`/animes/${id}`)
		if (data.description_html) {
			data.description = data.description_html.split('</div>')[0].replace(/<[^>]+>/g, '') + '...'
		}
		return data
	}

	getCard(anime) {
		return {
			title: (anime.russian || anime.name) + (anime.score ? ` (${anime.score}/10)` : ''),
			subtitle: anime.description ? anime.description : undefined,
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