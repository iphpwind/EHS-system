<template>
  <div>
    <div id="main"></div>
  </div>
</template>

<script>
import bjt3D from '@/utils/bjt3DMap'
import {getMapConfig} from '@/api/system/positioning'
import JQuery from 'jquery'
import {positionImg} from "@/utils/pointUtil";

export default {
  name: 'basestationLocation',
  props: {
    params: {
      lat: null,
      lng: null
    }
  },
  data() {
    return {}
  },
  methods: {},
  mounted() {
    JQuery('#main').html('')
    let that = this
    getMapConfig().then(res => {
      bjt3D.init('main', res.data.mapAddress, res.data, function() {
        let location = {
          longitude: that.params.lng,
          latitude: that.params.lat
        }
        let cartesian3 = bjt3D.parseCartesian3(location)
        bjt3D.pointLoad(1, 1, cartesian3, positionImg())
      })
    })
  }
}
</script>

<style scoped>

</style>
