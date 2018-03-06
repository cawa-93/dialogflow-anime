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
			card: this.getCard(anime),
		})

		/**
		 * Load 3 anime to answer
		 */
		let text = ``
		let animes = await this.getAnimes({limit: 3}, `/animes/${anime.id}/similar`)

		if (animes && animes.length) {
			text = `Вот несколько похожих аниме:`
		} else {
			const relateds = await this.getAnimes({limit: 3}, `/animes/${anime.id}/related`, false)
			animes = await Promise.all(
				relateds.filter(r => Boolean(r.anime)).map(r => this.getSingleAnime(r.anime.id))
			)
			if (animes && animes.length) {
				text = `Связанные аниме:`
			}
		}

		if (text) {
			this.pushMessage({
				text: {text: [text]},
			})

			animes.forEach(a => {
				this.pushMessage({
					card: this.getCard(a),
				})
			})
		}

		return await super.toJson()
	}
}

module.exports = SearchByName
