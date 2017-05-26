(function() {
  'use strict';

  function LinechartUtils(APP_CONFIG) {
    return {
      LineChartConfig: LineChartConfig,
    };

    function LineChartConfig(dataSeries, func, tooltipShared, dateFormat) {
      this.options = {
        chart: {
          type: 'line'
        },
        tooltip: {
          xDateFormat: dateFormat || '%d, %Y',
          shared: tooltipShared || false
        },
        plotOptions: {
          series: {
            events: {
              legendItemClick: (func || function() {})
            }
          }
        },
        colors: APP_CONFIG.COLORS,
        loading: {
          labelStyle: {
            color: 'white'
          },
          style: {
            backgroundColor: 'gray'
          },
          hideDuration: 1000,
          showDuration: 1000
        }
      };
      this.title = {
        text: null
      };
      this.xAxis = {
        type: 'datetime'
      };
      this.yAxis = {
        title: null
      };
      this.series = dataSeries;
    }
  }

  LinechartUtils.$inject = ['APP_CONFIG'];

  angular.module('baram.common.utils.LinechartUtils', [])
    .factory('LinechartUtils', LinechartUtils);
})();