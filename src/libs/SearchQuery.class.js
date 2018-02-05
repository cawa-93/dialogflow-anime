const Action = require(`./Action.class.js`)
const database = require(`./database`)

class SearchQuery extends Action {
	async toJson() {
		const params = {}

		if (this.parameters.genres) {
			params.genre = this.parameters.genres.map(genre => database.genres[genre]).join(`,`)
		}

		if (this.parameters.types) {
			params.kind = database.types[this.parameters.types]
		}

		if (this.parameters.order) {
			params.order = this.parameters.order
		}

		if (this.parameters.limit) {
			params.limit = this.parameters.limit
		}

		if (this.parameters.page) {
			params.page = this.parameters.page
		}

		if (this.parameters.status) {
			params.status = this.parameters.status
		} else {
			params.status = `ongoing,released`
		}

		// if (this.parameters.period) {
		// 	params.period  = this.parameters.period
		// }

		const animes = await this.getAnimes(params)

		const firstText = (params.page && params.page > 1) ? `Вот ещё несколько вариантов:` : `Вот, что я могу посоветовать:`

		this.pushMessage({
			text: {text: [firstText]},
		})

		animes.forEach(anime => {
			this.pushMessage({
				card: this.getCard(anime),
			})
		})

		return await super.toJson()
	}
}

module.exports = SearchQuery
