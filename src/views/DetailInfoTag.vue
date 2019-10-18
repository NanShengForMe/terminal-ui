<template>
  <div>
    <img class="bg" src="@/assets/images/bg.png" alt />
    <div v-if="bpi" style="padding-top: 63px">
      <div class="ms">
        <div>
          <a-row>
            <a-col :span="24">
              <div class="title">业务信息</div>
            </a-col>
          </a-row>
          <a-row
            style="font-family: 'microsoft yahei';
    font-size: 18px;
    font-weight: 500;"
          >
            <a-col>
              <div>
                <dl>
                  <dd>
                    <span class="label-ms">业务主题: {{ bpi.subject }}</span>
                  </dd>
                  <dd>
                    <span class="label-ms"
                      >业务号&nbsp;&nbsp;&nbsp;：{{ bpi.bpmNo }}</span
                    >
                  </dd>
                  <dd>
                    <span class="label-ms"
                      >业务类别：{{ bpi.businessName }}</span
                    >
                  </dd>
                  <dd>
                    <span class="label-ms">提交时间：{{ bpi.submitTime }}</span>
                  </dd>
                  <dd>
                    <span class="label-ms"
                      >当前节点：{{ bpi.currentNodeName }}</span
                    >
                  </dd>
                  <dd>
                    <span class="label-ms">办结时间：{{ bpi.finishTime }}</span>
                  </dd>
                </dl>
              </div>
            </a-col>
          </a-row>
        </div>
        <div v-if="assetsList">
          <a-row>
            <a-col :span="24">
              <div class="title">
                资产信息
                <span style="color: black; font-size: 18px;"
                  >共{{ statistics.count }}台件, 总值￥{{
                    statistics.price | currency
                  }}元.</span
                >
              </div>
            </a-col>
          </a-row>
          <a-row>
            <a-col :span="6">
              <span>类别</span>
            </a-col>
            <a-col :span="6">
              <span>编号</span>
            </a-col>
            <a-col :span="6">
              <span>名称</span>
            </a-col>
            <a-col :span="6">
              <span>单价</span>
            </a-col>
          </a-row>
          <a-row>
            <a-list :dataSource="assetsList" :size="'large'">
              <a-list-item slot="renderItem" slot-scope="item">
                <a-col :span="6">{{ item.type_name }}</a-col>
                <a-col :span="6">{{ item.code }}</a-col>
                <a-col :span="6">{{ item.name }}</a-col>
                <a-col :span="6">¥ {{ item.price | currency }}</a-col>
              </a-list-item>
            </a-list>
          </a-row>
        </div>

        <div
          style="position: absolute; bottom: 10px; left: 20px; font-size: 20px;"
        >
          打印码: {{ printCode.printCode }}, 可打印次数:
          {{ printTimes || 0 }}次, 创建时间:{{ printCode.createTime }},
          过期时间:{{ expireTime }}:
        </div>
      </div>
      <div class="btn-bar">
        <PrintButton
          btnType="dashed"
          btnIcon="qrcode"
          v-if="isBpmTag"
          btnText="打印资产标签"
          type="tag"
          :params="{ codes: ['SB20190814', 'SB20190815'] }"
        />
        <PrintButton
          btnType="dashed"
          btnIcon="qrcode"
          v-if="isAssetsTag"
          btnText="打印资产标签"
          type="tag"
          :params="{ codes: ['SB20190814', 'SB20190815'] }"
        />
        <a-list :dataSource="buttonArr">
          <a-list-item slot="renderItem" slot-scope="it">
            <!-- <a-button
            size="large"
            type="primary"
            icon="qrcode"
            v-if="it.isBpmTag"
            @click="printTagBpm"
            >打印资产标签</a-button
          >
          <a-button
            size="large"
            type="primary"
            icon="qrcode"
            v-if="it.isAssetsTag"
            @click="printTag"
            >打印资产标签</a-button
          > -->

            <!-- <a-button
            size="large"
            type="primary"
            icon="qrcode"
            @click="printBill(it)"
            >打印{{ it.name }}</a-button
          > -->
            <PrintButton
              :key="it.code"
              btnType="primary"
              btnIcon="printer"
              :btnText="it.name"
              type="doc"
              :billCode="it.code"
              :params="JSON.parse(it.params)"
            />
          </a-list-item>
        </a-list>
      </div>
    </div>
  </div>
</template>
<script>
import { getPrintCodeInfo } from "@/api/printCodeLogin.js";
import { getPrintableBill } from "../utils/billLink.js";
import PrintButton from "@/components/tools/PrintButton.vue";
export default {
  components: {
    PrintButton
  },
  data() {
    return {
      assetsList: {},
      business: {},
      bpi: {},
      buttonArr: {},
      printCode: {},
      printCodes: this.$route.params.printCode,
      printTimes: "",
      expireTime: "",
      statistics: {},
      isBpmTag: false,
      isAssetsTag: false
    };
  },
  methods: {
    printTag() {
      this.$info({
        title: "建设中",
        content: "功能建设中, 敬请期待..."
      });
    },
    packageBillParameters(businessCode, businessRole, record) {
      //将record中统一修改为驼峰命名;
      var params = {};
      for (var i in record) {
        var field = this.underscoreToCamel(i);
        params[field] = record[i];
      }
      //北林  在建工程转固入帐单   需要一个参数去判断验收业务 是 在建工程转固的业务。
      var isProjectToAssets = false;
      if (
        params.isInProcEqu != undefined &&
        params.isInProcEqu != null &&
        params.inProcEquId != undefined &&
        params.inProcEquId != null
      ) {
        isProjectToAssets = true;
      }
      //需要封装给params的参数;
      var billParam = {
        businessCode: businessCode,
        businessRole: businessRole,
        businessId: params.businessId,
        payId: params.businessId,
        isMerge: params.isMerge || "N",
        assetsType: params.assetsType,
        maxPrice: params.maxPrice,
        money: params.money,
        belong: params.belong,
        acceptanceForm: params.acceptanceForm,
        bpmNo: params.bpmNo,
        isdifferentcollege: params.isdifferentcollege,
        source: params.source,
        equipmentMaxMoney:
          params.maxPrice == null ? params.equipmentMaxMoney : params.maxPrice,
        backstockType: params.backstockType,
        hasMaterial: params.hasMaterial || "N", //验收业务是否包含材料
        hasSoft: params.hasSoft || "N", //验收业务是否包含软件
        hasOther: params.hasOther || false, //是否包含仪器设备或家具
        divisionPassed: params.divisionPassed, //主管是否已审核通过
        advanceScrap: params.advanceScrap, //是否提前报废
        isCar: params.isCar, //包含汽车
        state: params.state,
        node: params.node,
        financeState: params.financeState, // 财务审核状态
        materialMoney: params.materialMoney,
        hasHighAssets: params.hasHighAssets,
        hasLowAssets: params.hasLowAssets,
        financeOutlaySubject: params.financeOutlaySubject,
        isPrint: params.isPrint,
        hasNonFixBook: params.hasNonFixBook || false,
        assetsTypes: params.assetsTypes,
        mergeBpmNo: params.mergeBpmNo,
        isProjectToAssets: isProjectToAssets,
        flittingoutType: params.flittingoutType,
        nodeTime: new Date(params.nodeTime).getTime()
      };
      var assetsTypes = billParam.assetsTypes;
      if (assetsTypes != undefined && assetsTypes != "") {
        if (assetsTypes.indexOf("material") >= 0) {
          billParam["hasMaterial"] = "Y";
        }
        if (assetsTypes.indexOf("software") >= 0) {
          billParam["hasSoft"] = "Y";
        }
        if (
          assetsTypes.indexOf("equipment") >= 0 ||
          assetsTypes.indexOf("furniture") >= 0
        ) {
          billParam["hasOther"] = true;
        }
        if (assetsTypes.indexOf("books_non_fixed") >= 0) {
          billParam["hasNonFixBook"] = true;
        }
      }
      if (billParam.mergeBpmNo != undefined && billParam.mergeBpmNo != "") {
        billParam["isMerge"] = "Y";
      }
      // 对象序列化为JSON时会忽略undefined的键值, 为避免EL解析报错, 此处需进行初始化赋值
      for (var key in billParam) {
        if ("undefined" === typeof billParam[key]) {
          billParam[key] = null;
        }
      }
      return billParam;
    },
    underscoreToCamel(string) {
      if (string.indexOf("-") < 0 && string.indexOf("_") < 0) {
        return string;
      }
      return string.replace(/[-_][^-_]/g, function(match) {
        return match.charAt(1).toUpperCase();
      });
    },
    printBill(bill) {
      this.$info({
        title: "建设中",
        content: "功能建设中, 敬请期待..."
      });
      console.log(bill);
    }
  },
  created() {
    let vm = this;
    if (!this.business || !this.business.length) {
      var param = {};
      param.printCode = vm.$data.printCodes;
      getPrintCodeInfo(param)
        .then(record => {
          if (record.business) {
            vm.$data.isBpmTag = true;
          } else {
            vm.$data.isAssetsTag = true;
          }
          vm.$data.assetsList = record.assetsList;
          vm.$data.business = record.business;
          vm.$data.bpi = record.bpi;
          vm.$data.printCode = record.printCode;
          vm.$data.expireTime = record.expireTime;
          vm.$data.printTimes = record.printTimes;
          vm.$data.statistics = record.statistics;
          var businessRole = "personal";
          var businessCode = this.business.business_code;
          var billParam = this.packageBillParameters(
            this.business.business_code,
            businessRole,
            this.business,
            businessCode
          );
          var billArr = getPrintableBill(
            businessCode,
            businessRole,
            billParam,
            this.business.business_process_code,
            this.business.node,
            this.business.state
          );
          vm.$data.buttonArr = billArr;
          console.log(this.buttonArr);
        })
        .catch(function(error) {
          console.log(error);
        });
    }
  }
};
</script>
<style scoped>
.clearfix {
  zoom: 1;
  display: block;
}
.ms {
  width: 990px;
  min-height: 500px;
  background: rgba(255, 255, 255, 0.7);
  border-radius: 20px;
  padding: 10px 35px;
  box-shadow: 0 3px 8px rgba(0, 0, 0, 0.15);
  position: relative;
  margin: 0 auto;
}
.title {
  line-height: 50px;
  font-size: 24px;
  color: #607d8b;
  border-bottom: 1px solid rgba(255, 255, 255, 0.5);
  padding-bottom: 10px;
  margin-bottom: 20px;
}
.btn-bar {
  position: absolute;
  top: 160px;
  right: 100px;
}
.label-ms {
  font-size: large;
  position: relative;
  margin: 0 atuo;
}
</style>
