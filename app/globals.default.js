'use strict';

angular.module('pool.globals', [])

.factory('GLOBALS', function() {
	return {
		pool_name: "miningwell.com",
		api_url : 'https://api.miningwell.com',
		api_refresh_interval: 60000,
		app_update_interval: 30*60000
	};
});
