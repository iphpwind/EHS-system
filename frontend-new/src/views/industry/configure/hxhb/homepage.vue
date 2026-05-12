<template>
    <!--设备数据-->
    <div class="paramenter">
      <el-card :body-style="{ padding: '10px' }">
        <el-row :gutter="15">
          <el-col :span="24">
            <!--区域设备导航-->
            <el-row :gutter="30">
              <el-col :span="4">
                <div class="qysb">
  
                  <div class="head-container tree">
                      <h4>区域设备导航</h4>
                      <el-input
                          v-model="deptName"
                          placeholder="请输入名称"
                          clearable
                          prefix-icon="Search"
                          style="margin-bottom: 20px"
                      />
                      </div>
                      <div class="head-container tree down-tree">
                      <el-tree
                :current-node-key="0"
                :highlight-current="true"
                          :data="deptOptions"
                          :props="{ label: 'label', children: 'children' }"
                          :expand-on-click-node="false"
                          :filter-node-method="filterNode"
                          ref="deptTreeRef"
                          default-expand-all
                node-key = "id"
                          @node-click="handleNodeClick"
                      />
                      </div>
                </div>
              </el-col>
              <el-col :span="20" style="border-left: 1px solid rgb(231, 232, 237);">
                <div class="sbgl-com" style="height: calc(100vh - 120px);">
                    <iframe ref="svg" src="" key="svgiframe" width="100%" height="100%" frameborder="0" scrolling="auto" ></iframe>           
                </div>
               </el-col>
            </el-row>
          </el-col>
        </el-row>
      </el-card>
    </div>
  </template>
  
  <script>
  import { treeselect } from "@/api/system/dept";
  import {getUserProfile} from "@/api/system/user";
  import { listRealIndustryAreaSensor } from "@/api/industry/industryAreaSensor";
  import { getIndustrySensorData,getYcHis,getYxHis } from "@/api/industry/industrySensorData"
  import { onLine } from "@/api/industry/base";
  import {parseTime} from "@/utils/ruoyi";
  import { deptAndIndustryAreaTreeSelect } from "@/api/industry/base";
  
  export default {
    name: "index",
    data() {
      return {
          queryParams: {
              pageNum: 1,
              pageSize: 12,
              industryAreaId: null,
              deptId:'',
          },
          queryParams2: {
              historyId: null,
              day: null,
              type: null
          },
          industryAreaSensorList: [],
          areaOptions: [],
          user:{
              dept: {}
          },
          loading: true,
          total: 0,
          open: false,
          title: '',
          defaultProps: {
              children: 'children',
              label: 'label'
          },
          sensorData: {},
          activeName: 'first',
          dataList:[],
          allEqNum:'',
          onlineNum:'',
          unit:'',
          tabPosition:'tubiao',
          show: false,
          allList: [],
          currentPage:1,   //默认页码为1
          pagesize:10,  //默认一页显示10条
          isActive: null,
          lister:'',
          statusCurr:'',
          deptOptions: [],
          deptName: '',
          filterNode: (value, data) => {
              if (!value) return true;
              return data.label.indexOf(value) !== -1;
          },
  
      };
    },
    watch: {
      deptName:{
        handler: function(newValue, oldValue) {
          this.$refs["deptTreeRef"].filter(newValue);
        },
        deep: true, // 深度监听
      }
    },
    mounted() {
        this.getTreeSelect();
    },
   
    methods: {
      
      
      handleNodeClick(data) {
        if(data.id == '142'){
            this.$refs.svg.src ="/industry/hxhb/index"
        }else
        if(data.id == '139'){
            this.$refs.svg.src ="/industry/hxhb/taoci2"
        }else
        if(data.id == '141'){
            this.$refs.svg.src ="/industry/hxhb/taoci"
        }else
        if(data.id == '143'){
            this.$refs.svg.src ="/industry/hxhb/gxxq"
        }else{
            this.$refs.svg.src =""
        }
        
      },
       
 
          /** 查询区域下拉树结构 */
      getTreeSelect() {
        treeselect({status:"0",delFlag:'0'}).then(response => {
                  this.deptOptions = response.data;
              this.$nextTick(()=>{
                this.$refs["deptTreeRef"].setCurrentKey(this.deptOptions[0].id);
              })
          // this.$refs.tree.setCurrentKey(this.curren)
              });
          },
    },
  }
  </script>
  
  <style scoped lang="scss">
  .paramenter{
    padding: 15px;
    .fl{
      float: left;
    }
    .text-right{
      text-align: right;
    }
    .pading10{
      padding-left: 10px;
    }
    .greyline{
      width: 100%;
      border-top: 1px solid #f0f0f0;
    }
    .lborder{
      border-left: 1px solid #f0f0f0;
    }
    .card-tit{
      padding-left: 10px;
      border-left: 5px solid #09bec5;
      font-size: 18px;
    }
  
    .qysb{
      .qysb-head{
        .title{
          color: #333333;
          font-size: 18px;
        }
        .ico{
          margin-top: 4px;
        }
      }
      .tree{
        h4{
          margin: 10px 0 10px;
          color: #09bec5;
          font-weight: bold;
          font-size: 16px;
          border-bottom: 1px solid #e7e8ed;
          padding: 0 0 15px;
        }
  
      }
  
    }
    .head-tit{
      .ico{
        background: #09bec5;
        color: #fff;
        font-size: 12px;
        padding: 2px 12px;
        border-radius: 50px;
        margin-left: 10px;
      }
      .datetime{
        font-size: 14px;
        color: #5c5c5c;
      }
  
    }
  
      .paramenter-on{
          padding: 15px;
      height: 600px;
      overflow-y:scroll ;
          .title{
              border-bottom: 1px solid #ebebeb;
              padding-bottom: 10px;
              .card-tit{
                  padding-left: 10px;
                  border-left: 5px solid #09bec5;
                  font-size: 18px;
              }
          }
          .sbgy-ul{
              padding: 30px 0;
              .sbgy-li{
                  padding: 10px 0;
                  .ico{
                      text-align: center;
                  }
                  .name{
                      font-size: 15px;
                      color: #a1aab7;
                      line-height: 31px;
                      span{
                          color: #252631;
                      }
                  }
  
              }
          }
          .sbmx-nr{
              padding-top: 15px;
          }
          .echart-con{
              height: 500px;
          }
      }
  
  
      .sbgl-com{
          .sbgl-top{
              position: relative;text-align: center;
              padding: 5px 0 10px;margin-bottom: 10px;
              border-bottom: 1px solid #eee;
              :deep(.el-select) {
                  width: 120px;
                  .el-input__inner{
                      border: 0;font-size: 16px;color: #09bec5;
                  }
                  .el-icon{font-size: 16px;color: #09bec5;}
                  .el-select-dropdown__item.selected{color: #09bec5;}
              }
        .state{
          // position: absolute;right: 0;top: 6px;
          //text-align: right;
          font-size: 16px;
          color: #5c5c5c;
          width: 60%;
          margin: 0 auto;
          span{color: #09bec5;
            font-size: 20px;}
          i{
            width: 12px;height: 12px;border-radius: 50%;margin-right: 5px;
            display: inline-block;    border: 2px solid #dcdcdc;
          }
          i.active {border: 4px solid #09bec5;}
          .state-li{
            cursor:pointer;
            .green{
              color:#22ac38;
            }
            .redcolor{
              color: #fc3a3a;
            }
          }
        }
          }
          .li-subtit{
              .h4{
                  display: inline-block;margin-right: 5px;font-size: 14px;
              }
              .i{
                  font-size: 12px;border-radius: 20px;display: inline-block;
                  font-style: normal;color: #fff;padding: 0 5px;
              }
              .i.green{background: #22ad38;}
              .i.red{background: #fd3b3c;}
              :deep(.el-icon) {
                  float: right;color: #5c5c5c;
              }
          }
      .data-top{
        span{
          display: block;color:#555;font-size: 14px;
        }
        span.rt{text-align: right;}
      }
          .data{
              //background: #f7f7f7;border-radius:5px;overflow-y: auto;
              //height: 180px;padding: 10px;margin: 10px 0 0;
              //line-height: 2;
  
        background: #f9ffff;border-radius:5px;
        height: 90px;padding: 10px;margin: 10px 0 0;
        line-height: 1.5;
        overflow-y: auto;
        border: 1px solid #f0f9f9;
        //.zaixian:nth-child(1){
        //  span{
        //    font-size: 16px;
        //    color: #333333;
        //  }
        //  .rt{
        //    font-size: 18px;
        //    color: #1bb0d7;
        //    font-weight: bold;
        //
        //  }
        //}
  
              .dataitem{
                  span{
                      display: block;color:#555;font-size: 14px;
                  }
                  span.rt{text-align: right;}
              }
          }
      .gl{
        margin-bottom: 10px;
              :deep(.el-card) {cursor: pointer;}
      }
      .li-title{
        padding: 5px 0;
        text-align: left;
        border-bottom: 1px solid #f5f5f5;
        margin-bottom: 10px;
              img{width: 30px;}
              h4{font-size: 14px;margin: 5px 0 10px;color: #666}
              .li-subtit{
                  width: 34px;text-align: center;
                  i{display: block;}
              }
        .name{
          font-size: 16px;text-align: right;
                  margin: 3px 0 8px;
        }
              .state{
                  text-align: right;
          font-size: 14px;
                  span{
                      width: 12px;height: 12px;border-radius: 50%;
                      border:2px solid transparent;display: inline-block;
                  }
                  .run{
                      background: #22ac38;
                  }
          .runtext{color: #22ac38;}
          .gray{
            background: #B1B1B1;
          }
          .graytext{color: #B1B1B1;}
          .gray2{
            background: #4a4646;
          }
          .graytext2{color: #585656;}
  
                  .stop{
                      background: #f49d0c;
                  }
          .stoptext{color: #f49d0c;}
          .grey{
            border-color: #B1B1B1;
          }
                  .warn{
                      background: #fc3a3a;
                  }
          .warntext{color: #fc3a3a;}
                  .green.checked{
                      background:#22ac38;
                  }
                  .orange.checked{
                      background:#f49d0c;
                  }
                  .warn.checked{
                      background:#fc3a3a;
                  }
              }
              .outline{
                  .grey{
                      border-color: #afb0b0;
                  }
              }
      }
      .li-con{
        font-size: 12px;
        color: #5c5c5c;
        .li-con-nr{
          line-height: 30px;
          padding: 0 10px;
        }
  
        }
      }
  
    .freeze-con {
      padding: 15px;
  
      .button-ico {
        .btn {
          border: 0;
          padding: 0 20px;
          height: 24px;
        }
  
        .active {
          color: #fff;
          background: #09bec5;
        }
      }
    }
  
    .freeze-nr {
      .tit {
        line-height: 32px;
        padding-right: 6px;
      }
  
      .inquirebtn {
        background: #09bec5;
        color: #fff;
        border: none;
      }
    }
  
      .pad10 {
        padding: 10px;
      }
  }
  </style>
  