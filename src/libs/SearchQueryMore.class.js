const SearchQuery = require(`./SearchQuery.class.js`)

class SearchQueryMore extends SearchQuery {
	async toJson() {
		if (!this.parameters.page) {
			this.parameters.page = 1
		}

		++this.parameters.page

		const context = this.outputContexts.find(c => /searchquery$/.test(c.name))
		if (context && context.parameters) {
			context.parameters.page = this.parameters.page
		}

		return await super.toJson()
	}
}

module.exports = SearchQueryMore
