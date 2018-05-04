define(['angular'], function(angular) {
	var datepicker = function($scope) {

		var max_date='';
		var min_date='';

			$scope.inlineOptions = {
				customClass: getDayClass,
				minDate: new Date(),
				showWeeks: true
			};

			$scope.dateOptions = {
				/*dateDisabled: '',*/
				formatYear: 'yyyy',
				maxDate: '',
				minDate:'',
				startingDay: 1,
				minView:0,
				minuteStep:5,
				pickTime:true,
				showMeridian:true
			};
			$scope.dateOptions1 = {
				/*dateDisabled: '',*/
				format: 'yyyy-mm',
				maxDate: new Date(),
				startingDay: 1,
				minView:0,
				minuteStep:5,
				minMode:'month',
				pickTime:true,
				showMeridian:true
			};
			$scope.dateOptions2 = {
				/*dateDisabled: '',*/
				formatYear: 'yy',
				minDate: new Date(),
				startingDay: 1,
				minView:0,
				minuteStep:4

			};
			
			$scope.dateOptions3 = {
					/*dateDisabled: '',*/
					format: 'yyyy-mm',
					maxDate: new Date(),
					startingDay: 1,
					minView:0,
					minuteStep:5,
					minMode:'year',
					pickTime:true,
					showMeridian:true
				};	
			
			$scope.dateOptions4 = {
					/*dateDisabled: '',*/
				    format: 'yyyy-mm-dd HH:mm:s',
				    autoclose: true,
				};

			$scope.dateOptions5 = {
				/*dateDisabled: '',*/
				format: 'yyyy-mm-dd HH:mm:s',
				minDate: new Date().setDate(new Date().getDate()+1),
				autoclose: true
			};

			
		$scope.dateOptions_limit = {
			/*dateDisabled: '',*/
			format: 'yyyy-mm',
			maxDate: new Date(),
			startingDay: 1,
			minMode:'month',
			minView:0,
			minuteStep:5,
			pickTime:true,
			showMeridian:true
		};
			// Disable weekend selection
			function disabled(data) {
				var date = data.date,
					mode = data.mode;
				return mode === 'day' && (date.getDay() === 0 || date.getDay() === 6);
			}
			$scope.toggleMin = function() {
				$scope.inlineOptions.minDate = $scope.inlineOptions.minDate ? null : new Date();
				$scope.dateOptions.minDate = $scope.inlineOptions.minDate;
				$scope.dateOptions.useCurrent = true

			};
			$scope.toggleMin();
			$scope.open_limit= function(min,max) {
				$scope.popup_limit.opened = true;
				max_date=max;
				min_date=min;
			};
			$scope.open1 = function() {
				$scope.popup1.opened = true;
			};

			$scope.open2 = function() {
				$scope.popup2.opened = true;
			};

			$scope.open3 = function() {
				$scope.popup3.opened = true;
			};

			$scope.open4 = function() {
				$scope.popup4.opened = true;
			};

			$scope.open5 = function() {
				$scope.popup5.opened = true;
			};

			$scope.popup1 = {
				opened: false
			};

			$scope.popup2 = {
				opened: false
			};

			$scope.popup3 = {
				opened: false
			};

			$scope.popup4 = {
				opened: false
			};

			$scope.popup5 = {
				opened: false
			};
		$scope.popup_limit = {
			opened: false
		};
		function getDayClass(data) {
			var date = data.date,
				mode = data.mode;
			if (mode === 'day') {
				var dayToCheck = new Date(date).setHours(0, 0, 0, 0);

				for (var i = 0; i < $scope.events.length; i++) {
					var currentDay = new Date($scope.events[i].date).setHours(0, 0, 0, 0);

					if (dayToCheck === currentDay) {
						return $scope.events[i].status;
					}
				}
			}

			return '';
		}
	};
	return datepicker;
});