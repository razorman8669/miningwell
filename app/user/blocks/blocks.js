'use strict';

app.controller('BlocksCtrl', function($scope, $route, dataService, timerService) {
    $scope.blocks = {};
    $scope.selected = [];
    $scope.totalLuck = {}

    $scope.options = {
        page: 1,
        limit: 15
    }

    $scope.loadBlocks = function () {
        var params = angular.copy($scope.options);
        params.page -= 1;
        var urlParams = $.param(params)
        $scope.promise = dataService.getData("/pool/blocks?"+urlParams, function(data){
            $scope.blocks.global = data;
            updateMaturity();
        });
    };

    var updateMaturity = function () {
        var luck;
        var totalLuck = 0;
        if($scope.poolStats.global !== undefined) {
            _.each($scope.blocks.global, function(block, index){
                if($scope.network !== undefined) {
                    $scope.blocks.global[index].maturity = $scope.config.maturity_depth - ($scope.network.height - block.height);
                }

                // calculate luck
                luck = block.shares / block.diff * 100;
                totalLuck += luck

                var $b = 0, $r = 0, $g = 0;
                if (luck <= 100) {
                    var $r = Math.floor(luck / 100 * 80);
                    var $g = 128;
                } else if (luck <= 200) {
                    $r = 255;
                    $g = Math.floor((100 - luck % 100) / 100 * 160);
                } else {
                    $r = 255;
                    $g = 0;
                    $b = 0;
                }
                $scope.blocks.global[index].icon = (block.valid) ? 'done' : 'clear';
                $scope.blocks.global[index].color = block.valid ? "rgb(" + $r + "," + $g + "," + $b + ")" : "black"
                $scope.blocks.global[index].luck = luck
                index == $scope.blocks.global.length - 1 ? $scope.blocks.global[index].time = "¯\\_(ツ)_/¯" : $scope.blocks.global[index].time = block.ts - $scope.blocks.global[index + 1].ts
            });

            if($scope.blocks.global !== undefined) {
                totalLuck = totalLuck / $scope.blocks.global.length
                $scope.totalLuck.effort = totalLuck
                var $b = 0, $r = 0, $g = 0;
                if ($scope.totalLuck.effort <= 100) {
                    var $r = Math.floor(luck / 100 * 80);
                    var $g = 128;
                } else if ($scope.totalLuck.effort <= 200) {
                    $r = 255;
                    $g = Math.floor((100 - $scope.totalLuck.effort % 100) / 100 * 160);
                } else {
                    $r = 255;
                    $g = 0;
                    $b = 0;
                }
                $scope.totalLuck.color = "rgb(" + $r + "," + $g + "," + $b + ")"
                $scope.total_effort = (totalLuck <= 100) ? (100-totalLuck) : (-totalLuck+100) ;
            }
            
        }
    }

    $scope.$watchGroup(["blocks.global", "poolStats.global"], updateMaturity);

    // Register call with timer 
    timerService.register($scope.loadBlocks, $route.current.controller);
    $scope.loadBlocks();
    
    $scope.$on("$routeChangeStart", function () {
        timerService.remove($route.current.controller);
    });
});