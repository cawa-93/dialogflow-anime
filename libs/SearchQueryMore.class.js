const SearchQuery = require('./SearchQuery.class.js')
const database = require('./database')

class SearchQueryMore extends SearchQuery {
	async toJson(defaultParams) {


		if (!this.parameters.page) {
			this.parameters.page = 1
		}

		++this.parameters.page

		const context = this.outputContexts.find(c => /searchquery$/.test(c.name))
		if (context && context.parameters) {
			context.parameters.page = parseInt(context.parameters.page || 1) + 1
		}

		return await super.toJson()
	}
}

module.exports = SearchQueryMore
