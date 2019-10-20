// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('starter', ['ionic', 'ngCordova'])

	.run(function ($ionicPlatform) {
		$ionicPlatform.ready(function () {
			// Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
			// for form inputs).
			// The reason we default this to hidden is that native apps don't usually show an accessory bar, at
			// least on iOS. It's a dead giveaway that an app is using a Web View. However, it's sometimes
			// useful especially with forms, though we would prefer giving the user a little more room
			// to interact with the app.
			if (window.cordova && window.Keyboard) {
				window.Keyboard.hideKeyboardAccessoryBar(true);
			}

			if (window.StatusBar) {
				// Set the statusbar to use the default style, tweak this to
				// remove the status bar on iOS or change it to use white instead of dark colors.
				StatusBar.styleDefault();
			}
		});
	})
	.controller('myController', ['$scope', '$cordovaFile', '$cordovaFileTransfer', function ($scope, $cordovaFile, $cordovaFileTransfer) {
		$scope.makeCrash = function () {
			cordova.plugins.AppCrash.crash(
				"crash",
				function (success) {
					console.debug("success--" + success);
				}, function (error) {
					console.debug("error--" + error);
				}
			);
		};

		$scope.readCrash = function () {
			if (ionic.Platform.isAndroid()) {
				//获取sdcard目录
				var sdcardPath = cordova.file.externalRootDirectory;
				//日志文件路径
				var crashPath = "crash/shuto-crash.log";
				//检测日志文件是否存在
				$cordovaFile.checkFile(sdcardPath, crashPath).then(function () {
					//读取日志文件
					$cordovaFile.readAsText(sdcardPath, crashPath).then(function (result) {
						$scope.crashLog = result;
					}, function (err) {
						$scope.crashLog = "err--" + "\n" + err;
					})
				}, function () {
					alert("暂无日志文件");
				})
			} else {
				alert("ios 暂不支持");
			}
		};

		$scope.sendCrash = function () {
			if (ionic.Platform.isAndroid()) {
				//获取sdcard目录
				var sdcardPath = cordova.file.externalRootDirectory;
				//日志文件路径
				var crashPath = "crash/shuto-crash.log";
				//检测日志文件是否存在
				$cordovaFile.checkFile(sdcardPath, crashPath).then(function () {
					//上传日志文件 流方式
					var server = "http://192.168.0.112:8080/bos-web/uploadAction";
					var filePath = sdcardPath + crashPath;
					$cordovaFileTransfer.upload(server, filePath, null, true)
						.then(function (result) {
							if (result.response === "success") {
								//上传成功，删除本地文件
								$cordovaFile.removeFile(sdcardPath, crashPath)
									.then(function () {
										alert("日志文件删除成功");
									}, function () {
										alert("日志文件删除失败");
									});
							} else {
								alert("日志文件上传失败");
							}
						}, function (err) {
							console.debug("err---" + JSON.stringify(err));
						}, function (progress) {
						});
				}, function () {
					alert("暂无日志文件");
				})
			} else {
				alert("ios 暂不支持");
			}
		}
	}]);
