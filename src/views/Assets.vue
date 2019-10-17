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
              <a-button
                size="large"
                type="dashed"
                icon="delete"
                @click="clearChoose"
                :disabled="chooseCount === 0"
                >清空</a-button
              >
              <a-divider type="vertical" />
              <a-button
                size="large"
                type="primary"
                icon="printer"
                @click="printTag"
                :disabled="chooseCount === 0"
                >打印标签</a-button
              >
              <PrintButton
                :disabled="chooseCount === 0"
                btnType="dashed"
                btnIcon="qrcode"
                btnText="打印标签"
                type="tag"
                @click="printTag"
                :params="{ codes: ['SB20190814', 'SB20190815'] }"
              />
            </a-col>
          </a-row>
        </a-layout-header>
        <a-layout-content id="assets-content">
          <a-list
            :grid="{ gutter: 16, xl: 3, xxl: 4 }"
            :dataSource="assetsList"
            :size="'large'"
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
                        top: 138px;
                        right: 13px;
                        position: absolute;"
                    >
                      {{ item.typeName }}
                    </div>
                  </slot>
                  <slot slot="description">
                    <em class="price">¥ {{ item.price }}</em>
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
                        {{ item.type }}
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
      params: {
        fields: "",
        start: 1,
        limit: 25,
        totals: "",
        sort: this.sortData,
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
        assetsType: "",
        dep: ""
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
      },
      assetsList: []
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
    }
  },
  methods: {
    chooseAll() {
      const start = (this.pagination.current - 1) * this.pagination.pageSize;
      const end = this.pagination.current * this.pagination.pageSize;
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
      this.params.start = this.pagination.current;
      this.params.limit = this.pagination.pageSize;
      getAssetsList(this.params)
        .then(response => {
          console.log(response.resultset);
          this.assetsList = response.resultset.map(record => {
            record.image = require("@/assets/images/userhead.jpg");
            record.typeName = record.type_name;
            record.code = "编号：" + record.code;
            record.price = record.price_merge;
            record.factoryNo = record.factory_no;
            record.stockDate = record.stock_date;
            record.checked = false;
            return record;
          });
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
      this.params.assetsType = assetsType;
    }
  },
  mounted() {
    this.$on("roleChange", this.handleRoleChange);
  },
  created() {
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
  color: #ed5554;
}
</style>
