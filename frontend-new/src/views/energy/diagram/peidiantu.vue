<template>
    <div style="position: absolute;width: 100%;height: 100%;">
        <iFrame :src="url" />
        <span>{{ tip }}</span>
    </div>
</template>

<script>
	import { getDiagram } from "@/api/energy/diagram";
	import iFrame from "@/components/iFrame";

	export default {
			name: 'tydk',
			data() {
					return {
							route: useRoute(),
							url: '',
							tip: '',
					}
			},
			components:{
					iFrame
			},
			created() {
				getDiagram(this.route.params && this.route.params.id).then(response => {
					if(response.code == 200 && response.data.svgUrl != null && response.data.svgUrl != ""){
						let wPath = location.protocol+'//' + location.host
						this.url = wPath + "/tubiao/" + response.data.svgUrl + "?id=" + this.route.params.id;
						this.tip="";
					} else{
					  this.url = "";
					  this.tip="接线图不存在。";
					}
				});
			},
	}
</script>
<style lang="scss" scoped>
    iframe{
        border: 0;
        padding: 0;
        margin: 0;
    }
</style>
