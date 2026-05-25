<template>
</template>

<script setup>
import {display} from "@/api/login";
import {setToken, setExpiresIn} from '@/utils/auth'
import { useUserStore } from '@/store/modules/user'

const msg = ref("");
const userStore = useUserStore()
const {proxy} = getCurrentInstance();
const router = useRouter();

function handleLogin() {
  var query = window.location.search.substring(1);
  var vars = query.split("&");
  var username = "";
  var password = "";
  var redirect = "";
  if (vars.length > 1) {
    username = vars[0];
    password = vars[1];
    redirect = vars[2];
  } else {
    proxy.$modal.msgError("请输入正确用户名和密码");
    return
  }
  // 调用action的登录方法
  display(username, password).then(res => {
    if (res.code == 200) {
      let data = res.data
      setToken(data.access_token)
      userStore.token = data.access_token
      setExpiresIn(data.expires_in)
      userStore.expires_in = data.expires_in
      console.log(redirect)

      router.push(redirect);
    } else {
      proxy.$modal.msgError("登录失败");
    }

  })
}

handleLogin();
</script>

<style>
</style>
