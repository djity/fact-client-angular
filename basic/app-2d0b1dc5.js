var app=angular.module("demoBasicApp",["ngMaterial","fact-client.services","fact-client.directives","fact-client.templates"]);app.constant("FACT_API_URL","http://fact-office.djity.net/fact-api/"),app.constant("FACT_API_WS","http://fact-office.djity.net/fact-api/primus"),app.controller("demoBasicCtrl",["$scope","FactStream",function(t,a){t.streams=a.query(),t.$watch("streams",function(){angular.forEach(t.streams,function(t){t.followVariant("fast-low-verySmall")})},!0)}]);