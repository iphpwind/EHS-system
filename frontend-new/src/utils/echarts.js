/**
 * ECharts 按需导入统一入口
 * 已在 main.js 中注册到全局，组件中可直接使用 this.echarts
 * 如需局部导入，请从此文件引入
 */
import { use } from 'echarts/core'
import {
  BarChart, LineChart, PieChart, RadarChart, ScatterChart,
  MapChart, GaugeChart, PictorialBarChart
} from 'echarts/charts'
import {
  GridComponent, TooltipComponent, LegendComponent, TitleComponent,
  ToolboxComponent, DataZoomComponent, GraphicComponent, PolarComponent,
  VisualMapComponent, GeoComponent, AriaComponent
} from 'echarts/components'
import { CanvasRenderer, SVGRenderer } from 'echarts/renderers'

use([
  BarChart, LineChart, PieChart, RadarChart, ScatterChart,
  MapChart, GaugeChart, PictorialBarChart,
  GridComponent, TooltipComponent, LegendComponent, TitleComponent,
  ToolboxComponent, DataZoomComponent, GraphicComponent, PolarComponent,
  VisualMapComponent, GeoComponent, AriaComponent,
  CanvasRenderer, SVGRenderer
])

export * from 'echarts/core'
export { CanvasRenderer, SVGRenderer }
