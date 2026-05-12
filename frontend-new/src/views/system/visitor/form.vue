<template>
  <div class="visitor">
		<div class="top">
			<el-icon :size="18" @click="goback"><ArrowLeft /></el-icon>
			访客预约
		</div>
		<div class="form">
			<el-form ref="fkform" :model="form2" :rules="rules" label-width="120px" label-position="left">
				<div class="formtit">访客信息</div>
				<div class="formgroup">
					<el-form-item label="证件类型" prop="credentialType">
						<el-select v-model="form2.credentialType" placeholder="请选择">
							<el-option label="身份证" value="身份证" />
							<el-option label="其他" value="其他" />
						</el-select>
					</el-form-item>
					<el-form-item label="证件号" prop="credentialNum">
						<el-input @blur="getVisitor" v-model="form2.credentialNum" placeholder="请输入证件号" />
					</el-form-item>
					<el-form-item label="所属单位">
						<el-input v-model="form2.company" placeholder="请输入所属单位" />
					</el-form-item>
					<el-form-item label="姓名" prop="name">
						<el-input v-model="form2.name" placeholder="请输入姓名" />
					</el-form-item>
					<el-form-item label="性别">
						<el-radio-group v-model="form2.sex">
							<el-radio label="男" />
							<el-radio label="女" />
						</el-radio-group>
					</el-form-item>
					<el-form-item label="手机号" prop="phone">
						<el-input v-model="form2.phone" placeholder="请输入手机号" />
					</el-form-item>
					<el-form-item label="车牌号牌">
						<el-input v-model="form2.carNum" placeholder="请输入车牌号牌" />
					</el-form-item>
				</div>

				<div class="formtit">访问信息</div>
				<div class="formgroup">
					<el-form-item label="被访人姓名" required>
						<el-input @blur="getStraff" v-model="form2.customtel" placeholder="请输入被访人姓名" />
					</el-form-item>
<!--					<el-form-item label="被访人姓名">-->
<!--						<el-input readonly v-model="form.customer" placeholder="填写好手机号自动带入" />-->
<!--					</el-form-item>-->
					<el-form-item label="来访事由" prop="reason">
						<el-select v-model="form2.reason" placeholder="请选择来访事由">
              <el-option
                  v-for="item in dicList"
                  :key="item.name"
                  :label="item.name"
                  :value="item.name">
              </el-option>
						</el-select>
					</el-form-item>
					<el-form-item label="预约开始时间" prop="startTime">
						<el-date-picker
							v-model="form2.startTime"
							type="datetime"
							placeholder="请选择开始时间"
              @change="ctimeonfirm1"
              value-format="YYYY-MM-DD HH:mm:ss"
							:teleported="false"
              :editable="false"
						/>
					</el-form-item>
					<el-form-item label="预约结束时间" prop="endTime">
						<el-date-picker
							v-model="form2.endTime"
							type="datetime"
							placeholder="请选择结束时间"
              @change="ctimeonfirm2"
              value-format="YYYY-MM-DD HH:mm:ss"
							:teleported="false"
              :editable="false"
						/>
					</el-form-item>
				</div>
			</el-form>
			<div class="bottombtn" @click="submit">
				提交申请
			</div>
		</div>

  </div>
</template>

<script>
import {listVisitDic} from "@/api/safework/visitDic";
import {listStaffNoLog} from "@/api/system/staff";
import {listUserNoLog} from "@/api/system/user";
import {listVisitor, updateVisitor, addVisitor} from "@/api/safework/visitor";
import {addVisitReservation} from "@/api/safework/visitReservation"

export default {
  data() {

    var validateMobilePhone = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('手机号不可为空'))
      } else {
        if (value !== '') {
          var reg = /^1[3456789]\d{9}$/
          if (!reg.test(value)) {
            callback(new Error('请输入有效的手机号码'))
          }
        }
        callback()
      }
    }

    var validateIdCard = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('身份证号不可为空'))
      } else {
        if (value !== '') {
          var reg =  /^[0-9A-Za-z]{18}$/
          if (!reg.test(value)) {
            callback(new Error('请输入有效的身份证号'))
          }
        }
        callback()
      }
    }

    return {
      form: reactive({
				idcardtype: '身份证',
        idcard: '',
				company: '',
				name: '',
				gender: '',
				telephone: '',
				carnum: '',
				customtel: '',
				customer: '',
				reason: '',
				date1: '',
				date2: '',
      }),
      form2:{
        enterpriseCode: null,
        name: null,
        phone: null,
        sex: null,
        credentialType: '身份证',
        credentialNum: null,
        company: null,
        carNum: null,
        staffId: null,
        reason: null,
        startTime: null,
        endTime: null,
        openid:'',
        result:'未回执',
        customtel: '',
      },
      dicList:[],
      vId:null,
      rules: {
        credentialType: [
          { required: true, message: "证件类型不能为空", trigger: "blur" }
        ],
        credentialNum: [
          { required: true,  validator: validateIdCard,trigger: 'change' }
        ],
        name: [
          { required: true, message: "姓名不能为空", trigger: "blur" }
        ],
        phone: [
          { required: true, validator: validateMobilePhone, trigger: 'change' }
        ],
        reason: [
          { required: true, message: "来访事由不能为空", trigger: "blur" }
        ],
        startTime: [
          { required: true, message: "开始时间不能为空", trigger: "blur" }
        ],
        endTime: [
          { required: true, message: "结束时间不能为空", trigger: "blur" }
        ],
        customtel: [
          { required: true, message: "被访人不能为空", trigger: "blur" }
        ],

      },

    }
  },

  watch: {

  },
  created() {
    this.form2.openid = this.$route.query.openid;
    this.form2.enterpriseCode = this.$route.query.enterpriseCode;
    this.getDic()
  },

  mounted: function () {
		setTimeout(() => {
		  //判断，若手机端，去掉顶部和侧边栏
		  var windowWidth = document.body.clientWidth;
		  if(windowWidth<1200){
		  	document.querySelector('.sidebar-container').style = "width:0!important";
		  	document.querySelector('.main-container').style = "margin-left:0!important";
		  	document.querySelector('.app-main').style.minHeight = '100vh';
		  	document.querySelector('.visitor').style.width = '100%';
		  	document.querySelector('.navbar').style.display = 'none';
		  	document.querySelector('.tags-view-container').style.display = 'none';
		  }else{
				document.querySelector('.visitor').style.minHeight = '100%';
				document.querySelector('.bottombtn').style = 'width: 400px;';
			}
		}, 500)

  },

  methods: {

    ctimeonfirm1(val){
      this.datePicker = false;
      this.form2.startTime = this.timeFormat(val);
    },

    ctimeonfirm2(val){
      this.datePicker = false;
      this.form.endTime = this.timeFormat(val);
    },
    timeFormat(time) { // 时间格式化 2019-09-08
      let year = time.getFullYear();
      let month = time.getMonth() + 1;
      let day = time.getDate();
      let hh = time.getHours();
      let dd = time.getMinutes();
      let ss = time.getSeconds();
      return year + '-' + month + '-' + day + ' ' + hh + ':' + dd + ':' + ss;
    },
    getDic(){
      listVisitDic({enterpriseCode:this.form2.enterpriseCode,delFlag:'0'}).then(res => {
        this.dicList = res.rows
      })
    },

    getStraff(){
      if (this.form2.customtel != null && this.form2.customtel != ''){
        listUserNoLog({deptId:this.form2.enterpriseCode,nickName:this.form2.customtel}).then(res => {
          if (res.rows.length>0){
            let staff = res.rows[0]
            this.form2.customtel = staff.nickName
            // this.form.customer = staff.staffName
            this.form2.staffId = staff.userId
          }else {
            this.$message.error("被访人查无此人！请核对后继续申请")
          }
        })
      }

    },

    getVisitor(){
      if (this.form2.credentialNum != null && this.form2.credentialNum != ''){
        listVisitor({enterpriseCode:this.form2.enterpriseCode,credentialNum:this.form2.credentialNum}).then(res => {
          if (res.rows.length>0){
            let visiter = res.rows[0]
            this.form2.name = visiter.name
            this.form2.phone = visiter.phone
            this.form2.sex = visiter.sex
            this.form2.company = visiter.company
            this.form2.carNum = visiter.carNum
            this.vId = visiter.id
          }
        })
      }

    },

    submit() {


      this.$refs["fkform"].validate(valid => {
        if (valid) {
          if (this.form2.staffId != null && this.form2.staffId != ''){
            addVisitReservation(this.form2).then(res => {
              if (res.code == 200){
                if (this.vId != null && this.vId != ''){
                  this.form2.id = this.vId
                  updateVisitor(this.form2).then(res => {
                    if (res.code == 200){
                      this.$message.success("申请成功！")
                      this.$router.push({
                        path: '/system/visitor/index',
                        query:{
                          openid:this.form2.openid,
                          enterpriseCode:this.form2.enterpriseCode,
                        }
                      })
                    }
                  })
                }else {
                  addVisitor(this.form2).then(res => {
                    if (res.code == 200){
                      this.$message.success("申请成功！")
                      this.$router.push({
                        path: '/system/visitor/index',
                        query:{
                          openid:this.form2.openid,
                          enterpriseCode:this.form2.enterpriseCode,
                        }
                      })
                    }
                  })
                }
              }
            })
          } else {
            this.$message.error("被访人姓名为空或查无此人！请核对后继续申请")
          }
        }
      })
    },

		goback() {
			this.$router.push({
			  path: '/system/visitor/index',
        query:{
          openid:this.form2.openid,
          enterpriseCode:this.form2.enterpriseCode,
        }
			})
		}
  },

}
</script>


<style scoped lang="scss">
.visitor{
	//width: 480px;
  margin: 0 auto;
	background: url("@/assets/images/visitor/applybg.jpg") no-repeat center;
	background-size: cover;
	min-height: 100vh;
	position: relative;
	.top{
		text-align: center;
		color: #555;
		padding: 10px 0;
		background: #fff;
		position: relative;
		:deep .el-icon{
			position: absolute;left: 10px;top: 10px;
			cursor: pointer;
		}
	}
	.form{
		padding: 0 10px 15px;
		.formtit{
			padding: 10px 0;text-align: center;
			color: #3a7be4;font-weight: bold;
			font-size: 14px;
			background: rgba(255, 255, 255, 0.4);
			margin: 10px 0;
		}
		.formgroup{
			padding: 10px 10px 0;background: #fff;
			:deep .el-form-item{
				border-bottom: 1px solid #eee;
				margin: 0;padding: 6px 0;
				.el-input__inner{
					text-align: right;border: 0;
					color: #333;
				}
				.el-form-item__label{
					font-weight: normal;
				}
				.el-radio-group{
					position: absolute;right: 10px;
				}
				.el-popper{
					left: auto !important;
					right: 0;
				}
				.el-input--prefix .el-input__inner{
					padding: 0;
				}
				.el-input__prefix-inner{
					display: none;
				}
			}


		}
	}
	.bottombtn{
		color: #fff;text-align: center;
		background: url("@/assets/images/visitor/btnbg.jpg") repeat-x;
		background-size: auto 100%;
		border-radius: 30px;
		width: 88%;padding: 10px 0;
		cursor: pointer;
		margin: 20px auto 0;
	}
}
</style>




