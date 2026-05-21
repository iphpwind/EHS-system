import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { login, logout, getInfo, refreshToken } from '@/api/login'
import { getToken, setToken, setExpiresIn, removeToken } from '@/utils/auth'
import defAva from '@/assets/images/profile.jpg'

export const useUserStore = defineStore('user', () => {
  const token = ref(getToken() || '')
  const expires_in = ref('')
  const name = ref('')
  const avatar = ref('')
  const roles = ref<string[]>([])
  const permissions = ref<string[]>([])
  const user = ref<any>({})

  const isAdmin = computed(() => roles.value.includes('admin'))

  const Login = async (userInfo: any) => {
    const username = userInfo.username.trim()
    const password = userInfo.password
    const res = await login(username, password)
    const data = res.data
    setToken(data.access_token)
    token.value = data.access_token
    setExpiresIn(data.expires_in)
    expires_in.value = data.expires_in
    return res
  }

  const GetInfo = async () => {
    const res = await getInfo()
    const userData = res.user
    const avatarUrl = (userData.avatar == '' || userData.avatar == null) ? defAva : userData.avatar

    if (res.roles && res.roles.length > 0) {
      roles.value = res.roles
      permissions.value = res.permissions
    } else {
      roles.value = ['ROLE_DEFAULT']
    }
    name.value = userData.userName
    avatar.value = avatarUrl
    user.value = userData
    return res
  }

  const RefreshToken = async () => {
    const res = await refreshToken()
    const data = res.data || res
    const newToken = data.access_token || data.token || token.value
    setToken(newToken)
    token.value = newToken
    const expiresIn = data.expires_in || data.expiresIn || 7200
    setExpiresIn(expiresIn)
    expires_in.value = expiresIn
    return newToken
  }

  const LogOut = async () => {
    await logout(token.value)
    ResetState()
  }

  const FedLogOut = () => {
    token.value = ''
    removeToken()
  }

  const ResetState = () => {
    token.value = ''
    expires_in.value = ''
    name.value = ''
    avatar.value = ''
    roles.value = []
    permissions.value = []
    user.value = {}
  }

  return {
    token,
    expires_in,
    name,
    avatar,
    roles,
    permissions,
    user,
    isAdmin,
    Login,
    GetInfo,
    RefreshToken,
    LogOut,
    FedLogOut,
    ResetState
  }
}, {
  persist: {
    key: 'ehs-user',
    paths: ['token', 'roles', 'permissions']
  }
})
