const Action = require(`./Action.class.js`)
const {genres, kinds} = require(`./database`)

class SearchQuery extends Action {
	async toJson() {
		// params for api
		// @see https://shikimori.org/api/doc/1.0/animes/index
		const params = {}
		const context = this.getContext(`SearchQuery`)

		if (context.parameters.genre) {
			params.genre = context.parameters.genre.map(g => genres[g]).join(`,`)
		}

		if (context.parameters.kind) {
			params.kind = context.parameters.kind.map(k => kinds[k]).join(`,`)
		}

		if (context.parameters.rating) {
			params.rating = context.parameters.rating.join(`,`)
		}

		if (context.parameters.order) {
			params.order = context.parameters.order
		}

		if (context.parameters.limit) {
			params.limit = context.parameters.limit
		}

		if (context.parameters.page) {
			params.page = context.parameters.page
		}

		if (context.parameters.status) {
			params.status = context.parameters.status.join(`,`)
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
