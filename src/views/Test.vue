<template>
  <div>
    <PrintButton
      btnType="dashed"
      btnIcon="qrcode"
      btnText="打印标签"
      type="tag"
      :params="{ codes: ['SB20190814', 'SB20190815'] }"
    />
    <PrintButton
      btnType="primary"
      btnIcon="printer"
      btnText="打印单据"
      type="doc"
      billCode="requestBill"
      :params="{ businessCode: 'acceptance', businessId: '20191010001' }"
    />
    <!-- <img class="bg" src="@/assets/images/bg.png" alt />
    <a-layout theme="light" width="270" class="siderColor">
      <a-layout-sider class="query-sider">
        <div>
          <span class="label-ms"
            >业务主题：&nbsp;&nbsp;&nbsp;&nbsp;{{ acceptance.name }}</span
          >

          <span class="label-ms"
            >业务号：&nbsp;&nbsp;&nbsp;&nbsp;{{ acceptance.name }}</span
          >
          <br />
          <span class="label-ms"
            >业务类别：&nbsp;&nbsp;&nbsp;&nbsp;{{ acceptance.name }}</span
          >

          <span class="label-ms"
            >提交时间：&nbsp;&nbsp;&nbsp;&nbsp;{{ acceptance.name }}</span
          >
          <br />
          <span class="label-ms"
            >当前节点：&nbsp;&nbsp;&nbsp;&nbsp;{{ acceptance.name }}</span
          >
          <br />
          <span class="label-ms"
            >办结时间：&nbsp;&nbsp;&nbsp;&nbsp;{{ acceptance.name }}</span
          >
        </div>
      </a-layout-sider>
      <a-layout-content class="assets-content">
        <div class="ms">
          <a-list :dataSource="assetsList" :size="'large'">
            <a-list-item slot="renderItem" slot-scope="item">
              <div class="title">
                资产信息
                <span style="color: black; font-size: 18px;"
                  >共台件, 总值￥元.</span
                >
              </div>
              <div style="max-height: 380px; overflow-y: auto;">
                <table>
                  <thead>
                    <tr class="">
                      <th width="100px">类别</th>
                      <th width="200px">编号</th>
                      <th>名称</th>
                      <th width="160px">单价</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>{{ item.name }}</td>
                      <td>{{ item.name }}</td>
                      <td>{{ item.name }}</td>
                      <td>{{ item.name }}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </a-list-item>
          </a-list>
          <div
            style="position: absolute; bottom: 10px; left: 20px; font-size: 20px;"
          >
            打印码: , 可打印次数: 次, 创建时间:, 过期时间:
          </div>
        </div>
        <div class="btn-bar">
          <a-list>
            <a-list-item>
              <a-button
                size="large"
                type="primary"
                icon="qrcode"
                @click="printTag"
                >打印报销单</a-button
              >
            </a-list-item>
          </a-list>
        </div>
      </a-layout-content>
      <a-layout-footer></a-layout-footer>
    </a-layout> -->
  </div>
</template>
<script>
// const assetsList = new Array(1).fill().map((item, index) => {
//   const bool = index % 2 === 0;
//   return {
//     type: bool ? "设备" : "家具",
//     code: "SB20190814" + (Math.random() * (Math.random() * 100000)).toFixed(2),
//     name: "资产名称",
//     image: require("@/assets/images/weixin.png"),
//     price: (Math.random() * (Math.random() * 100000)).toFixed(2),
//     factoryNo: (Math.random() * (Math.random() * 100000)).toFixed(2),
//     stockDate: "2019/09/24",
//     checked: false
//   };
// });
// const acceptance = {
//   type: "设备",
//   code: "SB20190814" + (Math.random() * (Math.random() * 100000)).toFixed(2),
//   name: "资产名称",
//   image: require("@/assets/images/weixin.png"),
//   price: (Math.random() * (Math.random() * 100000)).toFixed(2),
//   factoryNo: (Math.random() * (Math.random() * 100000)).toFixed(2),
//   stockDate: "2019/09/24",
//   checked: false
// };
// export default {
//   data() {
//     return {
//       assetsList,
//       acceptance
//     };
//   },
//   methods: {
//     printTag() {
//       this.$info({
//         title: "建设中",
//         content: "功能建设中, 敬请期待..."
//       });
//     }
//   }
// };
import PrintButton from "@/components/tools/PrintButton.vue";

export default {
  components: {
    PrintButton
  }
};
</script>
<style lang="less" scoped>
.clearfix {
  zoom: 1;
  display: block;
}
.ms {
  width: 100%;
  min-height: 500px;
  background: rgba(255, 255, 255, 0.7);
  border-radius: 20px;
  padding: 10px 35px;
  box-shadow: 0 3px 8px rgba(0, 0, 0, 0.15);
  position: relative;
  margin: 0 auto;
}
.title {
  display: block;
  width: 122px;
  height: 122px;
  /* background:url(../assets/images/weixin.png) 0 0 no-repeat; */
  overflow: hidden;
  text-indent: -999px;
  position: absolute;
  top: -4px;
  right: -4px;
  z-index: 9;
}
.btn-bar {
  position: absolute;
  top: 160px;
  right: 10px;
}
.siderColor {
  background: rgba(255, 255, 255, 0.7);
}
.query-sider {
  background: rgba(255, 255, 255, 0.7);
  height: 100%;
  width: 100%;
  font-size: 16px;
  margin-left: 10px;
  font-weight: 700;
  margin-right: 10px;
  padding: 40px 30px;
  min-height: 500px;
  background: rgba(255, 255, 255, 0.7);
  border-radius: 20px;
  box-shadow: 0 3px 8px rgba(0, 0, 0, 0.15);
  position: relative;
  margin: 0 auto;
}
.assets-content {
  padding: 50px;
  height: calc(100% - 65px - 40px);
}
</style>
