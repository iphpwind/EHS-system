<template>
  <div>
    <el-dropdown trigger="click" @command="handleSetSize">
      <div class="size-icon--style">
        <svg-icon class-name="size-icon" icon-class="size"/>
      </div>
      <template #dropdown>
        <el-dropdown-menu>
          <el-dropdown-item v-for="item of sizeOptions" :key="item.value" :disabled="size === item.value"
                            :command="item.value">
            {{ item.label }}
          </el-dropdown-item>
        </el-dropdown-menu>
      </template>
    </el-dropdown>
  </div>
</template>

<script setup>
import {ElMessage} from 'element-plus'

const store = useStore();
const size = computed(() => store.getters.size);
const route = useRoute();
const router = useRouter();
const {proxy} = getCurrentInstance();
const sizeOptions = ref([
  {label: '�ϴ�', value: 'large'},
  {label: 'Ĭ��', value: 'default'},
  {label: '��С', value: 'small'},
])

function refreshView() {
  // In order to make the cached page re-rendered
  store.dispatch('tagsView/delAllCachedViews', route)

  const {fullPath} = route

  nextTick(() => {
    router.replace({
      path: '/redirect' + fullPath
    })
  })
}

function handleSetSize(size) {
  proxy.$modal.loading("�������ò��ִ�С�����Ժ�...");
  store.dispatch('app/setSize', size)
  setTimeout("window.location.reload()", 1000)
};
</script>

<style lang='scss' scoped>
.size-icon--style {
  font-size: 18px;
  line-height: 50px;
  padding-right: 7px;
}
</style>
