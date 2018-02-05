const Action = require(`./Action.class.js`)

class SearchByName extends Action {
	async toJson() {
		const params = {}

		if (this.parameters.name) {
			params.search = this.parameters.name.toLowerCase()
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
			animes = await this.getAnimes({limit: 3}, `/animes/${anime.id}/related `)
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
