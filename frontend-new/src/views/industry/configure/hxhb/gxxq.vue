<template>
    <div class="container">
        <!-- <Configure selId="4"  seltitle="广西鑫琪矿业"> </Configure> -->
        <div class="mainbox">
            <div class="fldiv" @click="showDaishiguolv('1432604930173169664')">
                <img src="@/assets/hxhb/image009.png"/>
                <div class="mc">带式过滤机</div>
            </div>
        </div>
        <el-dialog title="带式过滤机" width="900px" v-model="dialogDaishiguolvVisible">
            <div>
                <img src="@/assets/hxhb/image017.png"/>
            </div>
            <div>
                <table>
                    <tr>
                        <td class="aleft">驱动电机电流:</td>
                        <td colspan="3"><span>{{ daishi.di.value }}</span></td>
                    </tr>
                    <tr>
                        <td class="aleft">变频器运行频率:</td>
                        <td colspan="3"><span>{{ daishi.spd.value }}</span></td>
                    </tr>

                    <tr>
                        <td class="aleft">真空泵电流:</td>
                        <td><span>{{ daishi.zkbdi.value }}</span></td>

                    </tr>
                    <tr>
                        <td class="aleft">远程停机控制按钮:</td>
                        <td colspan="3">
                            <el-button type="danger" @click="stopDaishiguolvbpq('0')">变频器停机</el-button>
                            <el-button type="danger" @click="stopDaishiguolvzkb('0')">真空泵停机</el-button>
                            <!--              <el-button type="danger" @click="stopDaishiguolv1zkb2('0')">真空泵2停机</el-button>-->
                        </td>
                    </tr>
                    <tr>
                        <td></td>
                        <td colspan="3">
                            <el-button type="info" @click="stopDaishiguolvbpq('1')">变频器取消</el-button>
                            <el-button type="info" @click="stopDaishiguolvzkb('1')">真空泵取消</el-button>
                            <!--              <el-button type="info" @click="stopDaishiguolv1zkb2('1')">真空泵2取消</el-button>-->
                        </td>
                    </tr>
                </table>
            </div>
        </el-dialog>
    </div>
</template>

<script>
import {getDaishi, ctl} from '@/api/hxhb'
//import ztsel from '../../components/ztsel.vue'
import Configure from '@/components/Configure';

export default {
    name: 'qxxq',
    components: {
        Configure
    },
    data() {
        return {
            daishi: {
                di: { state: false, value: '' },
                spd: { state: false, value: '' },
                qhf: { state: false, value: '' },
                zkbzt: { state: false, value: '' },
                zkbdi: { state: false, value: '' },
            },
            dialogDaishiguolvVisible: false
        }
    },
    mounted: function (){
		document.querySelector('.sidebar-container').style = "width:0!important;display:none;";
		document.querySelector('#app .main-container').style = "margin-left:0;"
		document.querySelector('.navbar').style.display = 'none';
		document.querySelector('.tags-view-container').style.display = 'none';
	},
    methods: {
        resetDaishi() {
            let that = this
            Object.getOwnPropertyNames(that.daishi)
                .map(r => that.daishi[r].state = false)
        },
        showDaishiguolv(equipId) {
            let that = this
            this.resetDaishi()
            getDaishi(equipId)
                .then(res => {
                    console.info(res)
                    if (res != null) {
                        res.map(r => {
                            switch (r.name) {
                                case 'dsglj:di':
                                    that.daishi.di.state = true
                                    that.daishi.di.value = r.valeu
                                    break
                                case 'dsglj:spd':
                                    that.daishi.spd.state = true
                                    that.daishi.spd.value = r.valeu
                                    break
                                case 'zkb:di':
                                    that.daishi.zkbdi.state = true
                                    that.daishi.zkbdi.value = r.valeu
                                    break
                            }
                        })
                        Object.getOwnPropertyNames(that.daishi).map(r => {
                            if (that.daishi[r].state == false) {
                                that.daishi[r].value = ''
                            }
                        })
                        that.dialogDaishiguolvVisible = true
                    }
                })
        },
        stopDaishiguolvbpq(state){
            ctl('1432604930173169664','jdq:out1',state).then(res=>{
                console.info(res);
            })
        },
        stopDaishiguolvzkb(state){
          ctl('1432604930173169664','jdq:out2',state).then(res=>{
            console.info(res);
          })
        },
    }
}
</script>

<style lang="scss" scoped>
.fldiv {
    display: block;
    float: left;
    text-align: center;
    cursor: pointer;

    img {
        margin: 2px;
    }

    .mc {
        margin-top: 5px;
    }
}

table {
    width: 100%;
}

table tr {
    line-height: 28px;
}

.aleft {
    width: 200px;
    text-align: right;
}

.aright {
    padding-left: 30px;
    text-align: left;
}

.odd {
    width: 20%;
}

.even {
    width: 30%;
}
</style>
