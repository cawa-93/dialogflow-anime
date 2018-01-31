const SearchQuery = require('./SearchQuery.class.js')
const database = require('./database')

class SearchQueryMore extends SearchQuery {
	async toJson(defaultParams) {
		if (!this.parameters.page) {
			this.parameters.page = 1
		}

		++this.parameters.page

		this.outputContexts = [{
			name: 'SearchQuery',
			lifespanCount: 5,
			parameters: {
				page: this.parameters.page
			}
		}]

		return await super.toJson()
	}
}

module.exports = SearchQueryMore
