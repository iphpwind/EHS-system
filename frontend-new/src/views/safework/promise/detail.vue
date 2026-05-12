<template>
  <div class="app-container" id="myprint">
    <button v-print="'#myprint'" class="topbtn">打印</button>
    <h4 class="position">{{form.postName}}岗位</h4>
    <h4 class="title">{{form.promiseName}}</h4>
    <div class="content">
			<div>{{form.introduction}}</div>
			<div>{{form.matter}}</div>
		</div>
		<div class="qianmingbox">
			<div class="qianming">承诺人：
				<img :src="form.sign" alt="" v-if="form.sign">
			</div>
			<div class="qianming">主管领导：
				<img :src="form.chargeSign" alt="" v-if="form.chargeSign">
			</div>
		</div>
		
		<div class="upload">附件：
		  <ul class="list-group list-group-striped">
		    <li v-for="(item, index) in fileList" :key="index">
		      <el-link :href="item" :underline="false" target="_blank">
		        <span class="el-icon-document"> {{item.substring(item.lastIndexOf("/")+1,item.length)}} </span>
		      </el-link>
		    </li>
		  </ul>
		</div>
		
  </div>
</template>

<script setup name="Promise">
import { getPromisesign} from "@/api/safework/promisesign";
import {ref} from "vue";

const { proxy } = getCurrentInstance();
const id = ref("");
const postOption = ref(undefined);
const options = ref([]);
const fileList = ref([]);

const data = reactive({
  form: {},
});
const { form} = toRefs(data);

function getInfo(){
  getPromisesign(id.value).then(response => {
    form.value = response.data;
    fileList.value = form.value.fileUrl.split(",");
  });
}

id.value = proxy.$route.query.id
getInfo();
</script>


<style scoped lang="scss">
	.app-container{
		height: calc(100vh - 84px);overflow: auto;
		.topbtn{
			float: right;color: #fff;
			background: #09bec5;border-radius: 3px;padding: 5px 10px;
			border: 0;cursor: pointer;z-index: 999;position: relative;
		}
		.position{
			padding: 0 15px;border-left: 5px solid #09bec5;
		}
		.title{
			text-align: center;font-weight: bold;
			font-size: 20px;
		}
		.content{
			line-height: 2;text-indent: 2em;
			
		}
		.qianmingbox{
			text-align: right;
			.qianming{
				display:inline-block;margin: 30px 15px;
				img{
					height: 30px;vertical-align: middle;
				}
			}
		}
		.upload{
			height: 15%;padding: 15px;box-sizing: border-box;
			background: #f5f5f5;
		}
		
	}
@media print {
	.app-container .topbtn{
		display: none;
	}
	.app-container{
		height: auto;
	}
}
</style>