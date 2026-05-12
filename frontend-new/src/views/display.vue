<template>
</template>

<script setup>
import {display} from "@/api/login";
import {setToken, setExpiresIn} from '@/utils/auth'

const msg = ref("");
const store = useStore();
const {proxy} = getCurrentInstance();
const router = useRouter();

function handleLogin() {
	var query = window.location.search.substring(1);
  var vars = query.split("&");
	var username = "";
	var password = "";
	if(vars.length>1){
		username = vars[0];
		password = vars[1];
	}else{
			proxy.$modal.msgError("请输入正确用户名和密码");
			return
	}
	// 调用action的登录方法
	display(username, password).then(res => {
		if(res.code == 200){
			let data = res.data
			setToken(data.access_token)
			store.commit('SET_TOKEN', data.access_token)
			setExpiresIn(data.expires_in)
			store.commit('SET_EXPIRES_IN', data.expires_in)
			router.push("/system/yunxingjk/display");
		}else{
			proxy.$modal.msgError("登录失败");
		}

	})
}

handleLogin();
</script>

<style>
</style>
