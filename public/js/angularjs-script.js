var app = angular.module("myapp", ["ngRoute"]);
app.config(function ($routeProvider) {
    $routeProvider
        .when("/home", {
            templateUrl: "../../home.ejs"
        })
        .when('/exchange/:id', {
            templateUrl:"../../exchange.ejs",
            controller: "exchangeCtrl"
        })
        .otherwise({
            redirectTo: "/home"
        })
})

app.run(function ($rootScope) {
    $rootScope.$on('$routeChangeStart', function () {
        $rootScope.loading = true
    })
    $rootScope.$on('$routeChangeSuccess', function () {
        $rootScope.loading = false
    })
    $rootScope.$on('$routeChangeError', function () {
        $rootScope.loading = false
        alert("Error! Can't load template!!")
    })
})

app.controller("myctrl", function ($scope) {

});

app.controller("exchangeCtrl", function ($scope, $routeParams) {
    $scope.exchangeType = $routeParams.id.charAt(0).toUpperCase() + $routeParams.id.slice(1)
});


