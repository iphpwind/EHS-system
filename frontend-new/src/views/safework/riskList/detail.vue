<template>
  <div class="beijian">
    <!-- 筛选 -->
    <el-card class="box-card">
      <template #header>
        <div class="card-header">
          <span>风险清单详情</span>
        </div>
      </template>
      <div class="seachform">
        <el-form :inline="true" :model="queryParams" >
          <el-form-item label="编码">
            <el-input
                v-model="queryParams.code"
                placeholder="请输入分析单元编码"
                clearable
            />
          </el-form-item>
          <el-form-item label="名称" prop="name">
            <el-input
                v-model="queryParams.name"
                placeholder="请输入分析单元名称"
                clearable
            />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="getList" class="checkbtn">查询</el-button>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="goback" class="checkbtn">返回</el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-card>
    <div class="demo-collapse">
      <el-collapse accordion @change="handleChange" class="floor">
        <el-collapse-item v-for="(item, index) in tableData" 
				:name="item.id">
          <template #title>
						<h4><span>{{ index+1 }}</span>{{item.name}}({{item.code}})</h4>
            <div class="titright">
							<div class="item">
								风险事件<span>{{item.evenCount}}</span>
							</div>
							<div class="item">
								管控措施<span>{{item.measureCount}}</span>
							</div>
							<div class="item">
								排查内容<span>{{item.measureCount}}</span>
							</div>
						</div>
          </template>
          <div class="child">
            <el-collapse accordion @change="handleChange2">
              <el-collapse-item v-for="(item, index) in eventData" :name="item.id">
                <template #title>
                  {{ index+1 }}、风险事件：{{item.name}}
                </template>
                <div class="childtable">
                  <el-table
                      :data="measureData"
                      stripe="true"
                      border
                      style="width: 100%"
                  >
                    <el-table-column prop="className"  label="管控措施分类"/>
                    <el-table-column prop="mince"  label="管控措施细分"/>
                    <el-table-column prop="depict"  label="描述" />
                    <el-table-column prop="content"  label="隐患排查内容" />
                    <el-table-column prop="userNames"  label="责任人" />
                    <el-table-column prop="cycles"  label="周期" />
                  </el-table>
                </div>
              </el-collapse-item>
            </el-collapse>
          </div>
        </el-collapse-item>
      </el-collapse>
    </div>
  </div>
</template>

<script>
import { selectUnitHuizong } from "@/api/safework/unit";
import { listEvent } from "@/api/safework/event";
import { listMeasure } from "@/api/safework/measure";


export default {
  name: "index",
  data() {
    return {
      dialogVisible: false,
      dialogVisiblerec: false,
      mask: false,
      maskclose: false,
      showClose: false,
      value1: [],
      Options:[],
      spcstockDics:[],
      sprstockDics:[],
      spinfos:[],
      spinfoListc:[],
      spinfoListr:[],
      loading:true,
      total:0,
      queryParams: {
        objectId: null,
        code: '',
        name:''
      },
      eventParams:{
        unitId: null
      },
      meaParams:{
        eventId: null
      },
      tableData: [],
      eventData:[],
      measureData:[]
    }
  },

  created() {
    this.queryParams.objectId = this.$route.query.obId
    this.getList();
  },

  mounted() {
    // this.getObject();

  },

  methods: {

    getList() {
      selectUnitHuizong(this.queryParams).then(res => {
        this.total = res.total
        this.tableData = res.rows;
        this.loading = false
      })
    },
    handleChange(val) {
      console.log(val)
      this.eventParams.unitId = val
      listEvent(this.eventParams).then(res => {
        this.eventData = res.rows
      })
    },
    handleChange2(val) {
      this.meaParams.eventId = val
      listMeasure(this.meaParams).then(response => {
        this.measureData = response.rows;
      });
    },

    goback() {
      this.$router.push({
        path:'/safework/riskList'
      })
    }


  }

}


</script>

<style scoped lang="scss">
.beijian{
  padding: 10px;
  background: #f3f3f3;
  height: calc(100vh - 84px);
  .box-card{
    .card-header{
      span{
        padding: 0 10px;border-left: 4px solid #09bec5;font-size: 18px;
      }
    }
    .card-con{
      .ico{
        vertical-align: middle;
        padding: 10px 0;
      }
      .title{
        padding: 10px 0;
        line-height: 28px;
        color: #252631;
        i{
          font-style: inherit;
          color: #a1aab7;
        }
      }

    }
    .seachform{
      .checkbtn{
        background: #09bec5;padding: 0 25px;border: 0;color: #fff;
      }
    }
  }
  .table{
    padding: 20px;border: 1px solid #eee;background: #fff;
    box-shadow: 0 0 5px #eee;border-radius: 3px;
    height: calc(100% - 160px);position: relative;
    margin: 10px 0 0;

    .handlebtn{
      height: auto;border: 0;padding: 0;color: #09bec5;
    }

    :deep(.el-table) {

      .el-table__header-wrapper th{
        text-align: center;background: #09bec5 !important;color: #fff;border: 0;
      }
      .sort-caret.ascending{
        border-bottom-color: #fff !important;
      }
      .sort-caret.descending{
        border-top-color: #fff !important;
      }
      td.el-table__cell{text-align: center;border-color: #d2eef1;}
      .el-table__inner-wrapper::before{
        display: none;
      }
      .el-table__row--striped td.el-table__cell{
        background: #f6fcfc !important;
      }
      .el-table__row:hover  td.el-table__cell{
        background: #f6fcfc !important;
      }
    }
    :deep(.el-table--border::after) {
      display: none;
    }
    :deep(.el-table--border::before) {
      display: none;
    }
    .pages{
      position: absolute;padding-right: 70px;
      right: 20px;bottom: 10px;
      :deep(.el-pagination) {
        padding: 0;
        .el-pager li{
          outline: none;background: transparent;border: 1px solid #ddd;
        }
        .el-pager li.active{
          background: #09bec5;border-color: #09bec5;font-weight: normal;
        }
      }
      .pagebtn{
        position: absolute;right: 0;top: 0;
      }
    }
    .operation{
      padding: 0;
      border: none;
      background: transparent;
      --el-button-hover-text-color:#37c4cb;
    }
    .nav{
      text-align: right;
      margin-bottom: 10px;
    }
    .addtanchu{
      :deep(.el-dialog) {
        overflow: hidden;
        .el-dialog__header{
          box-shadow: 0 5px 10px #eee;
        }
      }
      .el-form {
        .el-select{
          width: 100%;
        }
      }
      .dialog-footer{
        display: block;width: 100%;text-align: center;margin-top: -20px;
        padding: 0 0 20px;
        .btn{
          width: 200px;
        }
        .green{background: #09bec5;color: #fff;border-color: #09bec5;}
      }
      .el-tree-select{
        width: 400px;
      }
    }
  }

  /*库存记录*/
  .detailtc{
    :deep(.el-dialog) {
      margin-top: calc(100vh - 84px);
      padding: 10px;
      background: #f3f3f3;
      margin-left: 200px;
      margin-top: 84px !important;
      margin-bottom: 0;margin-right: 0;
      height: calc(100vh - 84px);
      border: 0;border-radius: 0;

      .el-dialog__header{display: none;}
      .el-dialog__body{padding: 0;height: 100%;}
      .table{
        height: calc(100% - 145px);
      }
    }
  }
  .box-card{
		border: 0;margin: 0 0 10px;
    .card-header{
      span{
        padding: 0 10px;border-left: 4px solid #09bec5;font-size: 18px;
      }
      .btn{
        float: right;padding: 6px 15px;border: 0;border-radius: 20px;
        background: url("@/assets/images/xunjian/btn-bg.jpg") repeat-y;
        background-size: 100%;color: #fff;
        height: auto;
      }
    }
    .seachform{
      .checkbtn{
        background: #09bec5;padding: 0 25px;border: 0;color: #fff;
      }

    }
  }
  .record-con{
    padding: 20px;
    border: 1px solid #eee;
    background: #fff;
    box-shadow: 0 0 5px #eee;
    border-radius: 3px;
    height: calc(100% - 210px);
    position: relative;
    margin: 10px 0 0;
    .record-con-top{
      display: flex;
      margin-bottom: 20px;
      .demonstration{
        margin-right: 10px;
        line-height: 32px;
      }
      .checkbtn{
        background: #09bec5;padding: 0 25px;border: 0;color: #fff;margin-left: 10px;
      }
    }
    .record-con-li{

    }

  }
	.demo-collapse{
		h4{
			margin: 0;padding: 0 20px;
			font-weight: bold;color: #09bec5;
			span{
				width: 24px;height: 24px;
				line-height: 24px;background: #09bec5;border-radius: 50%;
				font-weight: bold;color: #fff;
				display: inline-block;text-align: center;
				margin-right: 6px;
			}
		}
		.titright{
			position: absolute;right: 50px;
			.item{
				display: inline-block;line-height: 24px;
				span{
					margin: 0 20px 0 5px;width: 24px;height: 24px;
					line-height: 24px;border-radius: 3px;
					font-weight: bold;color: #09bec5;
					border: 1px solid #eee;
					display: inline-block;
					text-align: center;
					vertical-align: middle;
				}
			}
		}
		:deep .floor{
			border: 0;
			.el-collapse{
				border: 1px solid #eee;
			}
			.el-collapse-item__header{
				border: 0;
			}
			.el-collapse-item{
				margin: 0 0 5px;
			}
			.el-collapse-item__content{
				padding: 0 0 10px;
			}
		}
		:deep .child{
			margin: 0 20px;
			.el-collapse{
				border: 0;
			}
			.el-collapse-item{
				border: 1px solid #eee;padding: 0 20px;
			}
			.el-collapse-item__wrap{
				border: 0;
			}
		}
	}
}
</style>
