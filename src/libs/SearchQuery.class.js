const Action = require(`./Action.class.js`)
const {genres, kinds} = require(`./database`)

class SearchQuery extends Action {
	async toJson() {
		// params for api
		// @see https://shikimori.org/api/doc/1.0/animes/index
		const params = {}

		if (this.parameters.genre) {
			params.genre = this.parameters.genre.map(g => genres[g]).join(`,`)
		}

		if (this.parameters.kind) {
			params.kind = this.parameters.kind.map(k => kinds[k]).join(`,`)
		}

		if (this.parameters.rating) {
			params.rating = this.parameters.rating.join(`,`)
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
			params.status = this.parameters.status.join(`,`)
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
