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

		$scope.server = "http://10.1.236.62:8080/bos-web/uploadAction";

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
		}

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
					var log_count = 0;
					//由于iosDocuments目录下含非log日志
					if (result && result.length > 0) {
						angular.forEach(result, function (file) {
							if (file.nativeURL.endsWith(".log")) {
								upload(file.nativeURL);
								log_count++;
							}
						})
					} else if (log_count === 0) {
						alert("无可上传崩溃日志");
					}
				}, function (reason) {
					console.debug("reason---" + JSON.stringify(reason));
				})
			})
		}


		function upload(filePath) {
			console.debug("upload..");
			//上传日志文件 流方式
			$cordovaFileTransfer.upload($scope.server, filePath, null, true)
				.then(function (result) {
					if (result.response === "success") {
						//上传成功，删除本地文件
						window.resolveLocalFileSystemURL(filePath, function (fileEntry) {
							fileEntry.remove(function () {
								console.log('delete success');
							}, function (err) {
								console.error(err);
							}, function () {
								console.log('file not exist');
							});
						})
					} else {
						alert("日志文件上传失败");
					}
				}, function (err) {
					console.debug("err---" + JSON.stringify(err));
				}, function (progress) {
				});
		}

	}]);
