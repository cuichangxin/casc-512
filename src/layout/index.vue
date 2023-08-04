<template>
  <el-container class="container">
    <el-header>
      <Header></Header>
    </el-header>
    <el-container>
      <el-aside>
        <Sidebar></Sidebar>
      </el-aside>
      <el-main>
        <app-main />
      </el-main>
    </el-container>
  </el-container>
</template>
<script setup lang="ts">
import { AppMain, Sidebar, Header } from './Components'
import { useKeepAliver } from '../store/keepAlive'
import { useRouter, useRoute } from 'vue-router'
import { watch } from 'vue'

const route = useRoute()
const router = useRouter()
function addKeepView() {
  const { name } = route
  if (name) {
    useKeepAliver().addKeepAlive(route)
  }
}
function removeKeepView() {
  const { name } = route
  if (name) {
    useKeepAliver().removeKeepAlive(route)
  }
}
watch(
  () => router.currentRoute.value,
  (n, o) => {
    if (n.keepAlive) {
      addKeepView()
    } else {
      removeKeepView()
    }
  }
)

onMounted(() => {
  addKeepView()
})
</script>
<style lang="scss" scoped></style>
