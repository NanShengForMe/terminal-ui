<template>
  <a-layout-sider theme="light" width="270" class="query-sider" height="100%">
    <a-form
      :form="form"
      @submit.prevent="$emit('handleSubmit', formData)"
      layout="vertical"
      class="query-from"
      @click="$emit('queryHandle', formData)"
    >
      <a-form-item label="业务状态" v-if="isBusiness">
        <a-radio-group
          size="large"
          buttonStyle="solid"
          v-model="formData.businessState"
        >
          <a-radio-button>全部</a-radio-button>
          <a-radio-button value="0">办理中</a-radio-button>
          <a-radio-button value="1">已办结</a-radio-button>
        </a-radio-group>
      </a-form-item>
      <a-form-item label="入账状态" v-if="isAssets">
        <a-radio-group
          size="large"
          buttonStyle="solid"
          v-model="formData.stockState"
        >
          <a-radio-button>全部</a-radio-button>
          <a-radio-button value="-1">未入帐</a-radio-button>
          <a-radio-button value="1">已入帐</a-radio-button>
        </a-radio-group>
      </a-form-item>
      <a-form-item label="资产类别" v-if="isAssets">
        <a-select
          size="large"
          allowClear
          :options="assetsTypes"
          placeholder="可筛选资产类别"
          notFoundContent="没有可选择的资产类别"
          v-model="formData.assetsType"
          @change="$emit('assetsTypeChange', formData.assetsType)"
        />
      </a-form-item>
      <a-form-item label="业务类别" v-if="isBusiness">
        <a-cascader
          size="large"
          allowClear
          changeOnSelect
          :options="businesses"
          expandTrigger="hover"
          placeholder="可筛选业务类别"
          notFoundContent="没有可选的业务类别"
          v-model="formData.business"
          @change="businessChange"
          :loadData="loadBusiness"
          @onblur="$emit('assetsTypeChange', formData.business)"
        />
      </a-form-item>
      <a-form-item label="领用单位">
        <a-auto-complete
          size="large"
          allowClear
          :dataSource="deps"
          @search="handleSearchDep"
          placeholder="匹配编号、简拼"
          v-model="formData.dep"
          @change="$emit('depChange', formData.dep)"
        />
      </a-form-item>
      <a-form-item label="领用人">
        <a-auto-complete
          size="large"
          allowClear
          :dataSource="keepers"
          @search="handleSearchKeeper"
          placeholder="匹配工号、简拼"
          v-model="formData.keeper"
          @change="$emit('keeperChange', formData.keeper)"
        />
      </a-form-item>
      <a-form-item label="业务号">
        <a-input
          size="large"
          placeholder="匹配完整业务号"
          v-model="formData.bpmNo"
          @change="$emit('formValueChange', $event.target.value)"
        />
      </a-form-item>
      <a-form-item label="资产编号" v-if="isAssets">
        <a-input
          size="large"
          placeholder="匹配完整编号"
          v-model="formData.assetsCode"
          @change="$emit('codeChange', $event.target.value)"
        />
      </a-form-item>
      <a-form-item label="资产编号" v-if="isBusiness">
        <a-input
          size="large"
          placeholder="匹配完整编号"
          v-model="formData.assetsCode"
          @change="$emit('codeChange', $event.target.value)"
        />
      </a-form-item>
      <a-form-item>
        <a-button
          size="large"
          type="primary"
          icon="search"
          html-type="submit"
          style="width: 100%;"
          >查询</a-button
        >
      </a-form-item>
    </a-form>
    <div class="sider-footer">
      <h3>故障联系方式</h3>
      <dl class="speed-link">
        <dt>联系人A:</dt>
        <dd>152xxxx9527</dd>
        <dt>联系人A:</dt>
        <dd>152xxxx9527</dd>
      </dl>
      <img src width="230" height="50" />
    </div>
  </a-layout-sider>
</template>

<script>
import {
  getAssetsType,
  getBusinessType,
  getBaseTeacher,
  getBaseDep,
  businessCodes
} from "@/api/querySider.js";
export default {
  name: "QuerySider",
  props: {
    type: String
  },
  data() {
    return {
      form: this.$form.createForm(this),
      formData: {
        stockState: undefined,
        assetsType: undefined,
        business: undefined,
        dep: undefined,
        keeper: undefined,
        bpmNo: undefined,
        assetsCode: undefined
      },
      assetsTypes: [],
      businesses: [],
      deps: [],
      keepers: [],
      businessRole: "personal",
      businessType: null,
      businessCode: null
    };
  },
  mounted() {
    this.$on("roleChange", this.handleRoleChange);
  },
  computed: {
    isAssets() {
      return this.type === "assets";
    },
    isBusiness() {
      return this.type === "business";
    }
  },
  methods: {
    handleSearchDep(value) {
      if (this.type) {
        var params = {};
        params.filter = value;
        getBaseDep(value)
          .then(response => {
            console.log(response);
            this.deps = response.resultset.map(
              dep => `${dep.code}-${dep.name}`
            );
          })
          .catch(function(error) {
            console.log(error);
          });
      }
    },
    handleSearchKeeper(value) {
      if (this.type) {
        var param = {};
        param.filter = value;
        var jsessionid = this.$store.getters.user.sessionId;
        param.JSESSIONID = jsessionid;
        getBaseTeacher(param)
          .then(response => {
            console.log(response);
            this.keepers = response.resultset.map(
              keeper => `${keeper.code}-${keeper.name}`
            );
          })
          .catch(function(error) {
            console.log(error);
          });
      }
    },
    handleSubmit() {
      this.$log.debug(this.formData);
    },
    handleRoleChange(role) {
      this.businessRole = role;
    },
    loadBusiness(selectedOptions) {
      // 获取选中的业务大类
      const targetOption = selectedOptions[selectedOptions.length - 1];
      targetOption.loading = true;
      // 加载该业务大类下的业务类别
      var params = {};
      params.businessRole = this.businessRole;
      params.businessType = targetOption.value;
      businessCodes(params).then(businessCodes => {
        targetOption.loading = false;
        // 数据转换
        targetOption.children = businessCodes.map(businessCode => {
          return {
            label: businessCode.name,
            value: businessCode.code
          };
        });
        // 触发数据更新操作
        this.businesses = [...this.businesses];
      });
    },
    businessChange(value) {
      // 第一个值为业务大类
      this.businessType = value[0];
      // 第二个值为业务编号
      this.businessCode = value[1];
    }
  },
  created() {
    if (this.isAssets) {
      var param = {};
      param.businessRole = this.businessRole;
      getAssetsType(param)
        .then(response => {
          console.log(response);
          console.log(Object.keys(response));
          this.assetsTypes = Object.values(response).map(element => {
            return {
              label: element.name,
              value: element.code
            };
            // element => `${element.code}-${element.name}`
          });
        })
        .catch(function(error) {
          console.log(error);
        });
    }
    if (this.isBusiness) {
      var params = {};
      params.businessRole = this.businessRole;
      getBusinessType(params)
        .then(businessTypes => {
          console.log(businessTypes);
          this.businesses = businessTypes.map(businessType => {
            return {
              label: businessType.name,
              value: businessType.code,
              // 标记不是叶子节点, 表示还有下一级
              isLeaf: false
            };
          });
        })
        .catch(function(error) {
          console.log(error);
        });
    }
    this.handleSearchKeeper();
    this.handleSearchDep();
  }
};
</script>

<style lang="less" scoped>
.query-sider {
  padding: 0 20px;
  .query-from {
    .ant-form-item {
      padding-bottom: 0;
      // margin-bottom: 20px;
    }
  }
  .sider-footer {
    position: absolute;
    bottom: 0;
    width: 230px;
    border-top: 1px solid #999;
    padding: 10px 0 0 0;
    h3 {
      font-size: 20px;
      color: #444444;
      font-family: MicrosoftYaHeiLight, serif;
    }
    .speed-link {
      margin-left: 10px;

      dt {
        font-size: 16px;
      }

      dd {
        font-size: 16px;
        margin-left: 10px;
        font-weight: 700;
      }
    }
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
</style>
