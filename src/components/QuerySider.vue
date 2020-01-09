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
          @change="$emit('businessStateChange', formData.businessState)"
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
          :loadData="loadBusiness"
          @change="$emit('assetsTypeChange', formData.business)"
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
          @focus="showKey('dep')"
          @keyup="handleInput($event)"
          :open="depsSelect"
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
          @focus="showKey('keeper')"
          @keyup="handleInput($event)"
          :open="keepersSelect"
        />
      </a-form-item>
      <a-form-item label="业务号">
        <a-input
          size="large"
          placeholder="匹配完整业务号"
          v-model="formData.bpmNo"
          @change="$emit('formValueChange', $event.target.value)"
          @focus="showKey('bpmNo')"
          @keyup="handleInput($event)"
        />
      </a-form-item>
      <a-form-item label="资产编号" v-if="isAssets">
        <a-input
          size="large"
          placeholder="多个编号请用逗号隔开"
          v-model="formData.assetsCode"
          @change="$emit('codeChange', $event.target.value)"
          @focus="showKey('codes')"
          @keyup="handleInput($event)"
        />
      </a-form-item>
      <a-form-item label="资产编号" v-if="isBusiness">
        <a-input
          size="large"
          placeholder="匹配完整编号"
          v-model="formData.assetsCode"
          @change="$emit('codeChange', $event.target.value)"
          @focus="showKey('codes')"
          @keyup="handleInput($event)"
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
        <dt>向小梅:</dt>
        <dd>18071012486</dd>
        <dt>设备处:</dt>
        <dd>87540224转8003</dd>
      </dl>
      <img src="@/assets/images/speed.png" width="188" height="50" />
    </div>
    <div>
      <a-drawer
        height="450"
        placement="bottom"
        :closable="false"
        @close="onClose"
        :visible="showBoard"
        :wrapClassName="inputType"
      >
        <!-- <key-board @delHandle="delKeyVal" @updatekey="GetKeyVal" /> -->
        <all-key-board
          @enterHanle="enterKeyVal"
          @delHandle="delKeyVal"
          @updatekey="GetKeyVal"
        />
      </a-drawer>
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
import allKeyBoard from "@/components/keyboard/allKey";
export default {
  name: "QuerySider",
  props: {
    type: String
  },
  components: { allKeyBoard },
  data() {
    return {
      keepersSelect: false,
      depsSelect: false,
      visible: false,
      showBoard: false,
      keyShow: false,
      inputType: "",
      form: this.$form.createForm(this),
      formData: {
        stockState: "",
        assetsType: "",
        business: [],
        dep: "",
        keeper: "",
        bpmNo: "",
        assetsCode: ""
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
    handleInput(e) {
      e.stopPropagation();
      console.log(this, e);
    },
    enterKeyVal() {},
    delKeyVal() {
      if (this.inputType == "codes") {
        this.formData.assetsCode = this.formData.assetsCode.substr(
          0,
          this.formData.assetsCode.length - 1
        );
        this.$emit("codeChange", this.formData.assetsCode);
      }
      if (this.inputType == "bpmNo") {
        this.formData.bpmNo = this.formData.bpmNo.substr(
          0,
          this.formData.bpmNo.length - 1
        );
        this.$emit("formValueChange", this.formData.bpmNo);
      }
      if (this.inputType == "keeper") {
        this.formData.keeper = this.formData.keeper.substr(
          0,
          this.formData.keeper.length - 1
        );
        this.handleSearchKeeper(this.formData.keeper);
      }
      if (this.inputType == "dep") {
        this.formData.dep = this.formData.dep.substr(
          0,
          this.formData.dep.length - 1
        );
        this.handleSearchDep(this.formData.dep);
      }
    },
    // keyDown(val) {

    // },
    GetKeyVal(val) {
      if (this.inputType == "codes") {
        this.formData.assetsCode += val;
        this.$emit("codeChange", this.formData.assetsCode);
      }
      if (this.inputType == "bpmNo") {
        this.formData.bpmNo += val;
        this.$emit("formValueChange", this.formData.bpmNo);
      }
      if (this.inputType == "keeper") {
        this.keepersSelect = true;
        this.formData.keeper += val;
        this.handleSearchKeeper(this.formData.keeper);
      }
      if (this.inputType == "dep") {
        this.depsSelect = true;
        this.formData.dep += val;
        // this.$emit('handleSearchDep', this.formData.dep);
        this.handleSearchDep(this.formData.dep);
      }
    },
    onClose() {
      this.showBoard = false;
      if ("keeper" == this.inputType) {
        this.keepersSelect = false;
      } else if ("dep" == this.inputType) {
        this.depsSelect = false;
      }
      this.inputType = "";
    },
    showKey(type) {
      if ("codes" == type) {
        this.inputType = "codes";
      } else if ("bpmNo" == type) {
        this.inputType = "bpmNo";
      } else if ("keeper" == type) {
        this.inputType = "keeper";
      } else if ("dep" == type) {
        this.inputType = "dep";
      }
      this.showBoard = true;
    },
    handleSearchDep(value) {
      let vm = this;
      if (value == "" || value == undefined) {
        return;
      }
      if (this.type) {
        var param = {};
        param.filter = value;
        getBaseDep(param)
          .then(response => {
            console.log(response);
            vm.$data.deps = response.resultset.map(
              dep => `${dep.code}-${dep.name}`
            );
          })
          .catch(function(error) {
            console.log(error);
          });
      }
    },
    handleSearchKeeper(value) {
      let vm = this;
      if (value == "" || value == undefined) {
        return;
      }
      if (this.type) {
        var param = {};
        param.filter = value;
        var jsessionid = this.$store.getters.user.sessionId;
        param.JSESSIONID = jsessionid;
        getBaseTeacher(param)
          .then(response => {
            console.log(response);
            vm.$data.keepers = response.resultset.map(
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
    let vm = this;
    if (this.isAssets) {
      var param = {};
      param.businessRole = this.businessRole;
      getAssetsType(param)
        .then(response => {
          console.log(response);
          console.log(Object.keys(response));
          vm.$data.assetsTypes = Object.values(response).map(element => {
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
          vm.$data.businesses = businessTypes.map(businessType => {
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
    this.handleSearchKeeper(this.formData.keeper);
    this.handleSearchDep(this.formData.dep);
  }
};
</script>

<style lang="less" scoped>
.query-sider {
  padding: 6px 20px 0px 20px;
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
