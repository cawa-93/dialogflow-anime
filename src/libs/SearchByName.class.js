const Action = require(`./Action.class.js`)

class SearchByName extends Action {
	async toJson() {
		const params = {}
		let inputParams = {}

		const context = this.getContext(`SearchQuery`)
		if (context && context.parameters) {
			inputParams = context.parameters
		} else {
			inputParams = this.parameters
		}

		if (inputParams.name) {
			params.search = inputParams.name.toLowerCase()
			params.limit = 1
		}

		const anime = (await this.getAnimes(params))[0]
		if (!anime) {
			return await super.toJson()
		}

		this.pushMessage({
			card: this.getCard(anime, {
				text    : `Все результаты`,
				postback: `https://relanime.herokuapp.com/search/?q=${params.search}&utm_source=chatbot`,
			}),
		})

		this.pushMessage({
			platform : `ACTIONS_ON_GOOGLE`,
			basicCard: this.getBasicCard(anime, {
				title        : `Все результаты`,
				openUriAction: {
					uri: `https://relanime.herokuapp.com/search/?q=${params.search}&utm_source=chatbot`,
				},
			}),
		})

		return await super.toJson()
	}
}

module.exports = SearchByName
