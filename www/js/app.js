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

		$scope.sendCrash = function () {
			var crashFolderPath;
			var dirPath;
			//获取日志文件夹
			if (ionic.Platform.isAndroid()) {
				dirPath = cordova.file.externalRootDirectory;
				crashFolderPath = cordova.file.externalRootDirectory + "crash";
			} else {
				dirPath = cordova.file.applicationStorageDirectory;
				crashFolderPath = cordova.file.applicationStorageDirectory + "Documents";
			}
			window.resolveLocalFileSystemURL(crashFolderPath, function (dirEntry) {
				var directoryReader = dirEntry.createReader();
				directoryReader.readEntries(function (result) {
					if (result && result.length > 0) {
						angular.forEach(result, function (file) {
							upload(file.nativeURL, file.fullPath, dirPath);
						})
					} else {
						alert("无可上传日志文件");
					}
				}, function (reason) {
					console.debug("reason---" + JSON.stringify(reason));
				})
			})
		}


		function upload(filePath, crashPath, dirPath) {
			//上传日志文件 流方式
			var server = "http://10.1.236.62:8080/bos-web/uploadAction";
			$cordovaFileTransfer.upload(server, filePath, null, true)
				.then(function (result) {
					if (result.response === "success") {
						//上传成功，删除本地文件
						$cordovaFile.removeFile(dirPath, crashPath)
							.then(function () {
								console.debug("日志文件删除成功");
							}, function () {
								console.debug("日志文件删除失败");
							});
					} else {
						alert("日志文件上传失败");
					}
				}, function (err) {
					console.debug("err---" + JSON.stringify(err));
				}, function (progress) {
				});
		}

	}]);
