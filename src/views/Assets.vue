<template>
  <div id="wrapper">
    <a-layout id="container">
      <QuerySider
        type="assets"
        @handleSubmit="handleQuery"
        @keeperChange="handleKeeperValue"
        @depChange="handleDepValue"
        @codeChange="handleCodeValue"
        @assetsTypeChange="handlAssetsTypeValue"
        @formValueChange="handleBpmNoValue"
      />
      <router-view ref="valueContent" />
      <a-layout-content>
        <a-layout-header class="assets-header">
          <a-row>
            <a-col span="12">
              <SortGroup :options="sorts" @sortChange="handleSortChange" />
              <router-view ref="sortContent" />
            </a-col>
            <a-col span="12" align="right">
              <a-badge :count="chooseCount" :overflowCount="999">
                <a-button
                  size="large"
                  icon="shopping-cart"
                  @click="drawerVisible = true"
                  :disabled="chooseCount === 0"
                  >已选</a-button
                >
              </a-badge>
              <a-divider type="vertical" />
              <a-button
                size="large"
                type="default"
                icon="plus"
                @click="chooseAll"
                >全选</a-button
              >
              <a-divider type="vertical" />
              <a-button
                size="large"
                type="dashed"
                icon="delete"
                @click="clearChoose"
                :disabled="chooseCount === 0"
                >清空</a-button
              >
              <a-divider type="vertical" />
              <!-- <a-button
                size="large"
                type="primary"
                icon="printer"
                @click="printTag"
                :disabled="chooseCount === 0"
                >打印标签</a-button
              > -->
              <PrintButton
                :disabled="chooseCount === 0"
                btnType="primary"
                btnIcon="qrcode"
                btnText="打印标签"
                type="tag"
                :params="selectCodesObject"
              />
            </a-col>
          </a-row>
        </a-layout-header>
        <a-layout-content id="assets-content">
          <a-list
            :grid="{ gutter: 8, xl: 3, xxl: 4 }"
            :dataSource="assetsList"
            :size="'small'"
            itemLayout="vertical"
            :pagination="pagination"
          >
            <a-list-item class="list" slot="renderItem" slot-scope="item">
              <a-card
                :title="item.code"
                @click="item.checked = !item.checked"
                hoverable
              >
                <slot slot="extra">
                  <a-checkbox size="large" :checked="item.checked" />
                </slot>
                <a-card-meta :title="item.name">
                  <slot slot="avatar">
                    <img :src="item.image" width="80" />
                    <div
                      style="font-size: 14px; text-align: center;border: 1px solid green;
                        width: 77px;
                        height: 24px;
                        top: 75px;
                        right: 13px;
                        position: absolute;"
                    >
                      {{ item.typeName }}
                    </div>
                  </slot>
                  <slot slot="description">
                    <span class="price">¥ {{ item.price }}</span>
                    <!-- <div class="assets-sn">SN: {{ item.factoryNo }}</div> -->
                    <div class="assets-date">
                      入库时间: {{ item.stockDate | format("YYYY-MM-DD") }}
                    </div>
                  </slot>
                </a-card-meta>
              </a-card>
            </a-list-item>
          </a-list>
          <keep-alive>
            <a-drawer
              width="350"
              placement="right"
              wrapClassName="assets-drawer"
              @close="drawerVisible = false"
              :visible="drawerVisible"
              :closable="false"
            >
              <slot slot="title">
                <a-row type="flex" align="middle">
                  <a-col span="18">
                    <div>
                      已选 {{ chooseCount }} 项, 总值
                      <em class="price">¥{{ chooseMoney }}</em
                      >元
                    </div>
                  </a-col>
                  <a-col span="6" align="right">
                    <a-button
                      size="large"
                      type="danger"
                      icon="delete"
                      @click="clearChoose"
                      >清空</a-button
                    >
                  </a-col>
                </a-row>
              </slot>
              <a-list :dataSource="chooseList" size="large">
                <a-list-item slot="renderItem" slot-scope="item">
                  <slot slot="actions">
                    <a-button
                      size="large"
                      type="danger"
                      @click="item.checked = !item.checked"
                      icon="minus"
                      >取消</a-button
                    >
                  </slot>
                  <a-list-item-meta>
                    <slot slot="title">
                      <div>{{ item.code }}</div>
                      <div>{{ item.name }}</div>
                    </slot>
                    <div slot="description">¥ {{ item.price }}</div>
                    <slot slot="avatar">
                      <img :src="item.image" width="40" />
                      <div style="font-size: 14px; text-align: center;">
                        {{ item.typeName }}
                      </div>
                    </slot>
                  </a-list-item-meta>
                </a-list-item>
              </a-list>
            </a-drawer>
          </keep-alive>
        </a-layout-content>
      </a-layout-content>
    </a-layout>
  </div>
</template>

<script>
import QuerySider from "@/components/QuerySider";
import SortGroup from "@/components/SortGroup";
import { getAssetsList } from "@/api/assets.js";
import PrintButton from "@/components/tools/PrintButton.vue";

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
          value: "stock_date",
          label: "入库时间",
          type: "asc"
        },
        {
          value: "code",
          label: "编号",
          type: "asc"
        },
        {
          value: "price_merge",
          label: "价格",
          type: "asc"
        }
      ],
      param: {},
      params: {
        fields: "",
        start: 1,
        limit: 25,
        totals: "",
        sort: "stock_date desc",
        businessRole: "",
        stockState: "",
        printCode: "",
        businessType: "",
        businessCode: "",
        baseTeacherNo: "",
        baseTeacherName: "",
        bpmNo: "",
        keyword: "",
        chartsprovider_: "",
        request_method_: "",
        browser_version_: "",
        browser_: "",
        assetsTypes: [],
        dep: "",
        baseDepCode: "",
        baseDepName: ""
      },
      settings: {
        billPrinter: "",
        tagPrinter: "",
        tagAction: "assets.acceptance.accept.tag_code",
        notPrintAttachTag: "true",
        dataTableSelector: "#assetsList",
        terminalSsologoutUrl: "",
        terminalPrintTagMaxNum: 0,
        selectedAssets: [],
        billCode: "",
        bpmNo: "",
        billParams: "",
        terminalStatis: {}
      },
      drawerVisible: false,
      pagination: {
        start: 1,
        current: 1,
        pageSize: 25,
        total: 0,
        pageSizeOptions: ["5", "10", "25", "50", "100", "200", "500", "1000"],
        showSizeChanger: true,
        showTotal: (total, range) =>
          `${range[0]} ~ ${range[1]} 项, 共计 ${total} 项`,
        size: "large",
        position: "top",
        onChange: (page, pageSize) => {
          this.pagination.current = page;
          this.pagination.start = (page - 1) * pageSize + 1;
          this.query();
        },
        onShowSizeChange: (current, size) => {
          this.pagination.pageSize = size;
          this.query();
        }
      },
      assetsList: [],
      selectCode: []
    };
  },
  computed: {
    chooseList() {
      return this.assetsList.filter(item => item.checked);
    },
    chooseCount() {
      return this.chooseList.length;
    },
    chooseMoney() {
      return this.chooseList
        .reduce((price, item) => price + +item.price, 0)
        .toFixed(2);
    },
    selectCodesList() {
      return this.chooseList.map(record => {
        return record.code;
      });
    },
    selectCodesObject() {
      let vm = this;
      var codesStr = "";
      this.selectCodesList.forEach(record => {
        codesStr = codesStr + "," + record;
      });
      vm.$data.param.codes = codesStr.slice(1);
      return vm.$data.param;
    }
  },
  methods: {
    chooseAll() {
      const start = 0;
      const end = this.pagination.pageSize;
      this.assetsList
        .filter((item, index) => index >= start && index < end)
        .forEach(item => (item.checked = true));
    },
    clearChoose() {
      this.$confirm({
        title: "请确认",
        content: `是否取消所有选中项(${this.chooseCount}项)?`,
        onOk: () => {
          this.assetsList.forEach(item => (item.checked = false));
          this.drawerVisible = false;
          this.$message.info("已清空所有选中项");
        }
      });
    },
    printTag() {
      this.$info({
        title: "建设中",
        content: "功能建设中, 敬请期待..."
      });
    },
    query() {
      let vm = this;
      vm.$data.assetsList = [];
      this.params.start = this.pagination.start;
      this.params.limit = this.pagination.pageSize;
      if (this.params.businessRole == "") {
        // this.params.businessRole = this.$store.getters.firstBusinessRole;
        return;
      }

      // this.params.baseTeacherNo = this.$store.getters.user.userinfo.username;
      // this.params.baseDepCode = this.$store.getters.user.userinfo.baseDepCode;
      // this.params.baseDepName = this.$store.getters.user.userinfo.baseDepName;

      getAssetsList(this.params)
        .then(response => {
          console.log(response.resultset);
          vm.$data.assetsList = response.resultset.map(record => {
            record.image = require("@/assets/images/tagimg.png");
            record.typeName = record.type_name;
            // record.code = record.code;
            record.price = record.price_merge;
            record.factoryNo = record.factory_no;
            record.stockDate = record.stock_date;
            record.checked = false;
            return record;
          });
          this.pagination.total = response.count;
        })
        .catch(error => {
          this.$notification.error({
            message: "请求错误",
            description: error.message
          });
        });
    },
    handleQuery(e) {
      this.$log.debug(e);
      this.query();
    },
    handleSortChange(sort) {
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
      this.params.baseTeacherNo = "";
      this.params.baseTeacherName = "";
      this.params.baseTeacherNo = keeper.split("-")[0];
      this.params.baseTeacherName = keeper.split("-")[1];
    },
    handleDepValue(dep) {
      this.params.baseDepCode = "";
      this.params.baseDepName = "";
      this.params.baseDepCode = dep.split("-")[0];
      this.params.baseDepName = dep.split("-")[1];
    },
    handleCodeValue(code) {
      this.params.keyword = code;
    },
    handlAssetsTypeValue(assetsType) {
      this.params.assetsTypes = assetsType;
    }
  },
  mounted() {
    this.$on("roleChange", this.handleRoleChange);
  },
  created() {
    this.$on("roleChange", this.handleRoleChange);
    this.query();
  }
};
</script>

<style lang="less" scoped>
// .assets-content {
//   padding: 20px;
//   height: calc(100% - 65px - 40px);
// }

// .assets-sn,
// .assets-date {
//   line-height: 24px;
// }
//
</style>

<style lang="less" scoped>
.ant-list-pagination {
  margin-top: 5px;
}

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
    height: calc(~"100% - 64px");
    overflow-y: auto;
    overflow-x: hidden;
    padding-left: 9px;
  }
}
h1,
h2,
h3,
h4,
h5,
h6 {
  margin: 0;
}
.price {
  font-size: 20px;
}
</style>
