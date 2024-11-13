<template>
  <div ref="chart" style="width: 100%; height: 400px;"></div>
</template>

<script>
import * as echarts from 'echarts'

export default {
  props: {
    chartData: {
      type: Array,
      required: true
    },
    chartLabels: {
      type: Array,
      required: true
    }
  },
  data() {
    return {
      chartInstance: null
    }
  },
  watch: {
    chartData: {
      handler(newData) {
        this.updateChart()
      },
      deep: true
    },
    chartLabels: {
      handler(newLabels) {
        this.updateChart()
      },
      deep: true
    }
  },
  mounted() {
    this.initChart()
  },
  methods: {
    initChart() {
        this.chartInstance = echarts.init(this.$refs.chart)
        this.updateChart()
    },
    updateChart(){
      if (!this.chartInstance) return

      const option = {
        title: {
          text: '价格趋势'
        },
        tooltip: {
          trigger: 'axis'
        },
        xAxis: {
          type: 'category',
          data: this.chartLabels,
          // boundaryGap: true, // 设置为 true 以增加横向间距
          axisLabel: {
            interval: 0, // 强制显示所有标签
            rotate: 30, // 旋转标签以增加间距，角度可以根据需要调整
            margin: 15, //增加标签与轴的间距
            formatter: function (value) {
              // 如果标签过长，可以截断并添加省略号
              if (value.length > 10) {
                return value.slice(0, 10) + '...'
              }
              return value
            }
          },
          axisTick: {
            alignWithLabel: true, // 刻度与标签对齐
            length: 40
          },
          axisLine: {
            show: false // 隐藏 x 轴的纵向线
          }
        },
        yAxis: {
          type: 'value'
        },
        series: [
          {
            name: '价格',
            type: 'line',
            data: this.chartData
          }
        ]
      }
      this.chartInstance.setOption(option)
    }
  }
}
</script>

<style scoped>
/* 你可以在这里添加一些样式 */
</style>