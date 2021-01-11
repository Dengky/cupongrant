<template>
<div><el-container>
    <el-header>优惠券发放系统</el-header>
    <el-main>
        <el-card class="box-card">
        <el-tabs v-model="activeName">
            <el-tab-pane label="消费券" name="first" >
                <el-button type="primary" @click="dialogFormVisible=true">生成新的消费券</el-button>
                <el-button type="primary" @click="sendAll">发放所有消费券</el-button>
                <el-dialog title="生成新的优惠券" :visible.sync="dialogFormVisible">
                    <el-form :model="form" :rules="rule" ref="form">
                        <el-form-item label="名称" :label-width="formLabelWidth" prop="name">
                            <el-input v-model="form.name" autocomplete="off"></el-input>
                        </el-form-item>
                        <el-form-item label="额度" :label-width="formLabelWidth" prop="value">
                            <el-input v-model="form.value" auto-complete="off" type="number"></el-input>
                        </el-form-item>
                        <el-form-item label="总数量" :label-width="formLabelWidth" prop="amount">
                            <el-input v-model="form.amount" auto-complete="off" type="number"></el-input>
                        </el-form-item>
                    </el-form>
                    <div slot="footer" class="dialog-footer">
                        <el-button @click="dialogFormVisible = false">取 消</el-button>
                        <el-button type="primary" @click="submitForm('form')" >确 定</el-button>
                    </div>
                </el-dialog>
                <el-table
                        :key="formList.length"
                        :data="formList">
                    <el-table-column
                            prop="id"
                            label="编号">
                    </el-table-column>
                    <el-table-column
                            prop="name"
                            label="优惠券名称">
                    </el-table-column>
                    <el-table-column
                            prop="value"
                            label="优惠金额">
                    </el-table-column>
                    <el-table-column
                            prop="amount"
                            label="数量">
                    </el-table-column>
                    <el-table-column
                            fixed="right"
                            prop="issued"
                            label="操作">
                        <template slot-scope="scope"><el-button size="mini" v-bind:disabled="scope.row.issued" v-on:click="send(scope.row)">发放</el-button></template>
                    </el-table-column>
                </el-table>
            </el-tab-pane>
            <el-tab-pane label="用户" name="second">
                <el-switch
                        v-model="value1"
                        active-text="只显示有优惠券的客户"
                        inactive-text="">
                </el-switch>
                <el-table
                        :data="userList"
                >
                    <el-table-column         prop="user.id"         label="ID">       </el-table-column>
                    <el-table-column         prop="user.nickname"         label="昵称">       </el-table-column>
                    <el-table-column         prop="user.phoneNumber"         label="手机号码">       </el-table-column>
                    <el-table-column         prop="couponStatistics.length"         label="优惠券数量">       </el-table-column>
                </el-table>
            </el-tab-pane>
        </el-tabs>
        </el-card>
    </el-main>
</el-container></div>
</template>

<script>
export default {
    name: "",
    methods: {
        submitForm(formName){
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    this.dialogFormVisible=false
                    this.form.amount=parseInt(this.form.amount)
                    this.form.value=parseInt(this.form.value)
                    console.log(typeof (this.form.value))
                    this.$http.post('/api/coupon-batches',this.form)
                        .then((res)=> {
                            console.log(res)
                            this.$message({           message: '优惠券添加成功',           type: 'success'         })
                            this.$http.get("/api/coupon-batches")
                                .then(res => {
                                    this.formList = res.data.data}
                                    )

                        })
                } else {
                    console.log('error submit!!');
                    return false;
                }
                this.$refs[formName].resetFields()
            });
        },
        send(row) {
            console.log('/api/coupon-batches/' + row.id)
            this.$http.patch('/api/coupon-batches/' + (row.id))
                .then((res) => {
                    console.log(res)
                    this.$message({           message: '优惠券发放成功',           type: 'success'         })
                    row.issued=true
                })
            },
        sendAll(){
            let data = {
                "issued": true
            }
            this.$http.patch('/api/coupon-batches',data).then(
                (res)=>{console.log(res),
                    this.$message({           message: '所有优惠券发放成功',           type: 'success'         })
                }
            )
        }
    },
    created() {
        this.$http.get("/api/coupon-batches")
            .then(res => {
                console.log(res.data.data)
                this.formList = res.data.data
            })
            .catch(error => {
                console.log(error)
            })
        this.$http.get("/api/users").then(res => {
            console.log(res.data.data)
            this.userList = res.data.data
        }).catch(error => {
            console.log(error)
        })
    },
    data() {
        return {
            isDisabled: true,
            activeName: 'first',
            value1: true,
            dialogFormVisible: false,
            txt:['发放','未发放'],
            form: {
                name: "",
                value: "",
                amount: "",
            },
            userList:[],
            formList:[],
            formLabelWidth: '120px',
            rule: {
                name: [
                    {required: true,message:'请输入名称',trigger: 'blur'}
                ],
                value:[
                    {required: true,message:'请输入金额',trigger: 'blur'}
                ],
                amount:[
                    {required:true,message:'请输入数量',trigger: 'blur'}
                ]

            }
        }
    }
}
</script>

<style >
.el-header{
    text-align: center;
    font-size:40px;
}
.el-main{
    width:70%;
    position: relative;
    margin: 0 auto;
}



</style>
