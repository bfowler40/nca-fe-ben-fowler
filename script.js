var newsModule = (function() {
	var _list      = null;
	var _subreddit = null;
	var _self      = this;
	var _title     = null;

	/**
	 * Init the module
	 *
	 * Retrieve the feed and populate the list
	 *
	 * @param {string} subreddit
	 * @return {void}
	 */
	function _initNewsModule(subreddit) {
		if (typeof subreddit === 'undefined') {
			console.warn('Init module with a subreddit name');
			return;
		}

		// set vars
		_self._list      = document.getElementById('newsList');
		_self._subreddit = subreddit;
		_self._title     = document.getElementById('newsTitle');

		// fetch the json data and pass a function to call on success
		_fetchReddits(_self._subreddit, _listReddits);
	}

	/**
	 * Fetch the top posts for provided subreddit
	 *
	 * @param {string} sub
	 * @param {function} callback
	 * @return {void}
	 */
	function _fetchReddits(sub, callback) {
		var request = new XMLHttpRequest();

		request.open('GET', 'https://www.reddit.com/r/'+sub+'/top.json?limit=5', true);
		request.onload = function() {
			if (request.status >= 200 && request.status < 400) {
				var response = JSON.parse(request.responseText);
				// execute our callback
				callback(response);
			} else {
				console.warn('There was an error trying to retrieve the reddits');
			}
		};
		request.send();
	}

	/**
	 * Populate the list
	 *
	 * @param {object} reddits
	 * @return {void}
	 */
	function _listReddits(list) {
		if (
			list &&
			typeof list === 'object' &&
			list.hasOwnProperty('data')
		) {
			_self._title.textContent = 'Top ' + _self._subreddit + ' posts';
			list.data.children.forEach(_addToList);
		}
	}

	/**
	 * Append the Item
	 *
	 * @param {object} post
	 * @return {void}
	 */
	function _addToList(post) {
		var item = document.createElement('li');
		item.classList.add('news__item', 'news__item--numeric');

		var link         = document.createElement('a');
		link.href        = post.data.url;
		link.title       = post.data.title;
		link.textContent = post.data.title;
		link.target      = '_blank';
		link.classList.add('news__link');

		item.appendChild(link);
		_self._list.appendChild(item);
	}

	return {
		init: _initNewsModule,
	}
})();

newsModule.init('funny');
