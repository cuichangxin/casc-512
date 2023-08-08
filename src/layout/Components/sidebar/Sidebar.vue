<template>
  菜单
</template>
<script setup lang="ts">
import { getCurrentInstance,ComponentInternalInstance } from "vue";

const { proxy } = getCurrentInstance() as ComponentInternalInstance

proxy?.$axios.login({
  userName:'MKSF',
  userPwd:'123456'
}).then((res: any) => {
  console.log(res);
})
</script>
<style lang="scss" scoped>

</style>
