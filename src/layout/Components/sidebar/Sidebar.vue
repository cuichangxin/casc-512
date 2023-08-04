<template>
  菜单
</template>
<script setup lang="ts">
import { getCurrentInstance } from "vue";

const { proxy } = getCurrentInstance()

proxy.$axios.login({
  userName:'MKSF',
  userPwd:'123456'
}).then((res) => {
  console.log(res);
})
</script>
<style lang="scss" scoped>

</style>
