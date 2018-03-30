const Action = require(`./Action.class.js`)
const {genres, kinds} = require(`./database`)

class SearchQuery extends Action {
	async toJson() {
		// params for api
		// @see https://shikimori.org/api/doc/1.0/animes/index
		const params = {}
		let inputParams = {}
		const context = this.getContext(`SearchQuery`)

		if (context && context.parameters) {
			inputParams = context.parameters
		} else {
			inputParams = this.parameters
		}

		if (inputParams.genre) {
			params.genre = inputParams.genre.map(g => genres[g]).join(`,`)
		}

		if (inputParams.kind) {
			params.kind = inputParams.kind.map(k => kinds[k]).join(`,`)
		}

		if (inputParams.rating) {
			params.rating = inputParams.rating.join(`,`)
		}

		if (inputParams.order) {
			params.order = inputParams.order
		}

		if (inputParams.limit) {
			params.limit = inputParams.limit
		}

		if (inputParams.page) {
			params.page = inputParams.page
		}

		if (inputParams.status) {
			params.status = inputParams.status.join(`,`)
		} else {
			params.status = `ongoing,released`
		}

		const animes = await this.getAnimes(params)
		const firstText = (params.page && params.page > 1) ? `Вот ещё несколько вариантов:` : `Вот, что я могу посоветовать:`

		const quickReplies = []
		if (animes && animes.length) {
			this.pushMessage({
				text: {text: [firstText]},
			})

			quickReplies.push(`Ещё`)

			if (params.order !== `ranked`)   {
				quickReplies.push(`Лучшее`)
			}
			if (params.order !== `aired_on`) {
				quickReplies.push(`Свежее`)
			}

			if (params.kind && !params.kind.includes(`tv`)) {
				quickReplies.push(`Только сериалы`)
			}
			if (params.kind && !params.kind.includes(`movie`))  {
				quickReplies.push(`Только полнометражные`)
			}
		}

		animes.forEach(anime => {
			this.pushMessage({
				card: this.getCard(anime),
			})
		})

		if (quickReplies.length) {
			this.pushMessage({
				quickReplies: {
					title: ``,
					quickReplies,
				},
			})
		}

		return await super.toJson()
	}
}

module.exports = SearchQuery
