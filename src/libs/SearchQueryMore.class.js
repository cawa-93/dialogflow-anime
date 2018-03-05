const SearchQuery = require(`./SearchQuery.class.js`)

class SearchQueryMore extends SearchQuery {
	async toJson() {
		const context = this.getContext(`SearchQuery`)

		if (!context.parameters.page) {
			context.parameters.page = 1
		}

		++context.parameters.page

		return await super.toJson()
	}
}

module.exports = SearchQueryMore
