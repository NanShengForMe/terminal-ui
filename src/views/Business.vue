<template>
  <div id="wrapper">
    <a-layout id="container">
      <query-sider
        type="business"
        @handleSubmit="handleQuery"
        @keeperChange="handleKeeperValue"
        @depChange="handleDepValue"
        @codeChange="handleCodeValue"
        @assetsTypeChange="handlAssetsTypeValue"
        @formValueChange="handleBpmNoValue"
      />
      <a-layout-content>
        <a-layout-content id="assets-content">
          <a-list
            :dataSource="assetsList"
            :size="'large'"
            :pagination="pagination"
          >
            <slot slot="header">
              <!-- <a-radio-group size="large" defaultValue="bpmNo">
                <a-radio-button value="bpmNo">
                  业务号
                  <a-icon type="sort-ascending" />
                </a-radio-button>
                <a-radio-button value="submitTime">
                  提交时间
                  <a-icon type="sort-ascending" />
                </a-radio-button>
                <a-radio-button value="price">
                  价格
                  <a-icon type="sort-ascending" />
                </a-radio-button>
              </a-radio-group> -->
              <SortGroup :options="sorts" @sortChange="handleSortChange" />
              <router-view ref="sortContent" />
            </slot>
            <a-list-item slot="renderItem" slot-scope="item">
              <a-list-item-meta>
                <slot slot="description">
                  <div>
                    <em>资产名称：{{ item.subject }}</em>
                    <span style="font-size:16px;"
                      >业务号：{{ item.bpm_no }}</span
                    >
                  </div>
                  <div class="currency">价格：￥{{ item.money }}</div>
                  <div>时间：{{ item.submit_time | format }}</div>
                  <div>申请人：{{ item.base_teacher_name_request }}</div>
                  <div>当前节点：{{ item.node_name }}</div>
                </slot>
                <a slot :description="'价格：' + item.money"></a>
                <a
                  slot="title"
                  href="https://vue.ant.design/"
                  class="assetsColor"
                  >{{ item.code }}</a
                >
                <a-avatar slot="avatar" :src="item.image" />
              </a-list-item-meta>
              <slot slot="actions">
                <PrintButton
                  btnType="dashed"
                  btnIcon="qrcode"
                  btnText="打印标签"
                  type="tag"
                  :disabled="false"
                  :params="{ bpmNo: item.bpm_no, id: item.id }"
                />
                <PrintButton
                  v-for="bill in item.billArray"
                  :key="bill.code"
                  btnType="primary"
                  btnIcon="printer"
                  :btnText="bill.name"
                  type="doc"
                  :billCode="bill.code"
                  :disabled="false"
                  :params="JSON.parse(bill.params)"
                />
              </slot>
            </a-list-item>
          </a-list>
        </a-layout-content>
      </a-layout-content>
    </a-layout>
  </div>
</template>

<script>
import QuerySider from "@/components/QuerySider";
import { getBusinessList } from "@/api/business.js";
import SortGroup from "@/components/SortGroup";
import { businessChangeRow } from "../utils/billLink.js";
import PrintButton from "@/components/tools/PrintButton.vue";
// const assetsList = new Array(100).fill().map((item, index) => {
//   const bool = index % 2 === 0;
//   return {
//     type: bool ? "设备" : "家具",
//     code: "SB20190814" + prefixZero(index, 4),
//     name: "资产名称",
//     image: require("@/assets/images/weixin.png"),
//     price: (Math.random() * (Math.random() * 100000)).toFixed(2),
//     factoryNo: prefixZero(index, 14),
//     stockDate: new Date(),
//     checked: false
//   };
// });

export default {
  components: {
    QuerySider,
    SortGroup,
    PrintButton
  },
  data() {
    return {
      sorts: [
        {
          value: "bpm_no",
          label: "业务号",
          type: "asc"
        },
        {
          value: "submit_time",
          label: "提交时间",
          type: "asc"
        },
        {
          value: "money",
          label: "价格",
          type: "asc"
        }
      ],
      params: {
        fields: "",
        start: 1,
        limit: 25,
        totals: "sum(num),sum(money)",
        sort: this.sortData,
        businessRole: "personal",
        stockState: "",
        printCode: "",
        businessType: this.$route.params.type,
        businessCode: this.$route.params.code,
        baseTeacherNo: "",
        baseTeacherName: "",
        bpmNo: "",
        keyword: "",
        chartsprovider_: "",
        request_method_: "",
        browser_version_: "",
        browser_: "",
        assetsType: "",
        dep: ""
      },
      sortData: "",
      assetsList: [],
      pagination: {
        current: 1,
        pageSize: 25,
        pageSizeOptions: ["5", "10", "25", "50", "100", "200", "500", "1000"],
        showSizeChanger: true,
        showTotal: (total, range) =>
          `${range[0]} ~ ${range[1]} 项, 共计 ${total} 项`,
        size: "large",
        position: "top",
        onChange: page => {
          this.pagination.current = page;
          this.query();
        },
        onShowSizeChange: (current, size) => {
          this.pagination.pageSize = size;
          this.query();
        }
      }
    };
  },
  computed: {
    //  assetsList() {
    //     if (!this.items || !this.items.length) {
    //     getAssetsList().then(function (response) {
    //       console.log(response);
    //       return response;
    //     })
    //     .catch(function (error) {
    //       console.log(error)
    //     })
    //   }
    //  },
  },
  mounted() {
    this.$on("roleChange", this.handleRoleChange);
  },
  methods: {
    printTagBpm() {
      this.$info({
        title: "建设中",
        content: "功能建设中, 敬请期待..."
      });
    },
    printBill(bill) {
      this.$info({
        title: "建设中",
        content: "功能建设中, 敬请期待..."
      });
      console.log(bill);
    },
    query() {
      this.params.start = this.pagination.current;
      this.params.limit = this.pagination.pageSize;
      getBusinessList(this.params)
        .then(response => {
          console.log(response);
          // this.assetsList = response;
          this.assetsList = response.resultset.map(record => {
            record.image = require("@/assets/images/weixin.png");
            record.businessRole = this.params.businessRole;
            record.billArray = businessChangeRow(record);
            console.log(record);
            return record;
          });
        })
        .catch(function(error) {
          console.log(error);
        });
    },
    handleQuery(e) {
      this.$log.debug(e);
      this.query();
    },
    handleSortChange(sort) {
      // this.$refs.sortContent.$emit("sortChange", sort);
      if (sort.active) {
        this.params.sort = sort.value + " " + sort.type;
      }
      this.$log.debug(sort);
      this.query();
    },
    handleRoleChange(role) {
      this.params.businessRole = role;
      this.query();
    },
    handleBpmNoValue(bpmNo) {
      this.params.bpmNo = bpmNo;
    },
    handleKeeperValue(keeper) {
      this.params.baseTeacherNo = keeper.split("-")[0];
      this.params.baseTeacherName = keeper.split("-")[1];
    },
    handleDepValue(dep) {
      this.params.dep = dep;
    },
    handleCodeValue(code) {
      this.params.code = code;
    },
    handlAssetsTypeValue(assetsType) {
      // 第一个值为业务大类
      this.params.businessType = assetsType[0];
      // 第二个值为业务编号
      this.params.businessCode = assetsType[1];
    }
  },
  created() {
    this.query();
  }
};
</script>

<style lang="less" scoped>
#wrapper {
  height: calc(~"100% - 112px");
}
#container {
  height: 100%;
  .assets-header {
    padding: 0 20px;
    height: 64px;
    background: #fff;
  }
  #assets-content {
    height: 100%;
    overflow-y: auto;
    overflow-x: hidden;
  }
}
.ant-list-item {
  padding-left: 10px;
  background: white;
  border: 1px solid white;
  margin: 5px;
  font-size: 16px;
}
.ant-list-item em {
  display: block;
  font-size: 20px;
  font-weight: 800;
  color: #333;
  margin-bottom: 2px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>
