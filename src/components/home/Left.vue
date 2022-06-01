
<template>
    <el-scrollbar>
        <el-menu :default-openeds="['1']">
            <el-sub-menu index="1">
                <template #title>
                    <el-icon>
                        <message />
                    </el-icon>Navigator One
                </template>
                <el-menu-item-group>
                    <template #title>Group 1</template>
                    <el-menu-item index="1-1">Option 1</el-menu-item>
                    <el-menu-item index="1-2">Option 2</el-menu-item>
                </el-menu-item-group>
                <el-menu-item-group title="Group 2">
                    <el-menu-item index="1-3">Option 3</el-menu-item>
                </el-menu-item-group>
                <el-sub-menu index="1-4">
                    <template #title>Option4</template>
                    <el-menu-item index="1-4-1">Option 4-1</el-menu-item>
                </el-sub-menu>
            </el-sub-menu>


        </el-menu>
    </el-scrollbar>
</template>
<script setup lang='ts'>
import { ref } from 'vue'

const headIndex = ref(2)


let menu1 = [{
    index: "1",
    title: "aaa",
    group: {
        title: '123', item: [{
            index: "1-1", text: "a1"},{
            index: "1-2", text: "a2"
        }]
    },
    sub:{ index: "1-3",title: '323', item: [{
            index: "1-3-1", text: "a31"},{
            index: "1-3-2", text: "a32"
        }]
    }
}];




</script>

<style lang='scss' scoped>
</style>