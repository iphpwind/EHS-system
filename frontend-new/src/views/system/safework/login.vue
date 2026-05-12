<template>
  <div class="login">
		<div class="head-top">
			<img src="@/assets/images/safework/login-logo.png" height="50">
		</div>
		<div class="logo-con">
		    <el-row>
		      <el-col :span="14">
		      </el-col>
		      <el-col :span="10">
		        <div class="denglu">
		          <el-form ref="loginRef" class="login-form">
		            <h3 class="title">登录</h3>
		            <el-form-item prop="username">
		              <el-input
		                  type="text"
		                  size="large"
		                  auto-complete="off"
		                  placeholder="账号"
		              >
		                <template #prefix>
		                  <svg-icon icon-class="user" class="el-input__icon input-icon"/>
		                </template>
		              </el-input>
		            </el-form-item>
		            <el-form-item prop="password">
		              <el-input
		                  type="password"
		                  size="large"
		                  auto-complete="off"
		                  placeholder="密码"
		              >
		                <template #prefix>
		                  <svg-icon icon-class="password" class="el-input__icon input-icon"/>
		                </template>
		              </el-input>
		            </el-form-item>
								<el-form-item prop="code" v-if="captchaOnOff">
									<el-input
											size="large"
											auto-complete="off"
											placeholder="验证码"
											style="width: 63%"
									>
										<template #prefix>
											<svg-icon icon-class="validCode" class="el-input__icon input-icon"/>
										</template>
									</el-input>
									<div class="login-code">
										<img :src="codeUrl" @click="getCode" class="login-code-img"/>
									</div>
								</el-form-item>
								<el-form-item style="width:100%;">
									<el-button
											:loading="loading"
											size="large"
											type="primary"
											style="width:100%;background: #09bec5; border-color: #09bec5;"
											
									>
										<span v-if="!loading">登 录</span>
										<span v-else>登 录 中...</span>
									</el-button>
								</el-form-item>
								
								<div class="gotoreg" v-if="register">
									<router-link class="link-type" :to="'/register'">免费注册</router-link>
								</div>
		          </el-form>
		        </div>
		      </el-col>
		    </el-row>
		  </div>
  </div>
</template>

<script>

export default {
  name: "index",
  data() {
    return {
			captchaOnOff: true,
			codeUrl: '',
			loading: false,
			register: true,
    }
  },

  watch: {

  },
  created() {

  },

  mounted: function () {

  },

  methods: {

  },

}
</script>


<style scoped lang="scss">
.login {
  background: url('@/assets/images/safework/safework-loginbg.jpg') no-repeat center;
	background-size: cover;
	height: calc(100vh - 84px);
	
	.head-top{
		padding-top: 5%;width: 1200px;margin: 0 auto;
	}
	.logo-con{
	  position: absolute;
	  top: 52%;
	  left: 50%;
	  transform: translate(-50%, -50%);
	  width: 1200px;
	  .login-left{
			position: relative;
	    img{max-width: 100%}
			.touming1{position: absolute;left: 0;bottom: 0;width: 80%;z-index: 2;}
			.touming2{position: absolute;right: 0;top: 60px;width: 48%;z-index: 1;}
			.login-wx{position: absolute;right: 20px;top: 25px;width: 40%;border-radius: 10px;}
			span{position: absolute;right: 20px;bottom: 20px;width: 40%;display: block;text-align: center;color: #fff;}
	  }
	}
	.denglu{
	  float: right;
	  margin-top: 5%;
	  .title{
	    font-weight: bold;
	    color: #333333;
	  }
	}
	.title {
	  margin: 0px auto 30px auto;
	  text-align: center;
	  color: #707070;
	}
	
	.login-form {
	  border-radius: 6px;
	  background: #ffffff;
	  width: 400px;
	  padding: 25px;
	
	  .el-input {
	    height: 40px;
	
	    input {
	      height: 40px;
	    }
	  }
	
	  .input-icon {
	    height: 39px;
	    width: 14px;
	    margin-left: 0px;
	  }
	}
	
	.login-tip {
	  font-size: 13px;
	  text-align: center;
	  color: #bfbfbf;
	}
	
	.login-code {
	  width: 33%;
	  height: 40px;
	  float: right;
	
	  img {
	    cursor: pointer;
	    vertical-align: middle;
	  }
	}
	.gotoreg{
		.link-type{
			display: block;text-align: right;
			font-size: 14px;color: #333;
		}
		
	}
}

</style>




