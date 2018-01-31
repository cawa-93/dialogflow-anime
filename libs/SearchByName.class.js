const Action = require('./Action.class.js')
const database = require('./database')

class SearchByName extends Action {
	async toJson() {
		const params = {}

		if (this.parameters.name) {
			params.search = this.parameters.name
		}

		const anime = (await this.getAnimes(params))[0]

		if (!anime) {
			return await super.toJson()
		}
		this.pushMessage({
			card: this.getCard(anime)
		})

		const similar = await this.getAnimes({limit: 3}, `/animes/${anime.id}/similar`)

		if (!similar || !similar.length) {
			return await super.toJson()
		}

		this.pushMessage({
			text: {text: ['Вот несколько похожих аниме:']}
		})

		similar.forEach(anime => {
			this.pushMessage({
				card: this.getCard(anime)
			})
		})

		return await super.toJson()
	}
}

module.exports = SearchByName
