import store from "@/store";
const printableBillConfigMap = [];
const printableBillMap = [];
const printableNodeMap = [];
export function businessChangeRow(record) {
  var billParam = {
    businessId: record["id"],
    isMerge: !!record["merge_bpm_no"],
    assetsType: record["assets_type"],
    maxPrice: record["max_price"],
    money: record["money"],
    belong: record["belong"],
    acceptanceForm: record["acceptance_form"],
    businessRole: "",
    bpmNo: record["bpmNo"],
    isdifferentcollege: record["is differentcollege"],
    source: record["source"],
    equipmentMaxMoney: record["equipment_max_money"] || record["max_price"],
    businessCode: record["business_code"],
    backstockType: record["backstock_type"],
    // 验收业务是否包含材料
    hasMaterial: false,
    // 验收业务是否包含软件
    hasSoft: "N",
    // 是否包含仪器设备或家具
    hasOther: false,
    // 主管是否已审核通过
    divisionPassed: record["division_passed"],
    // 是否提前报废
    advanceScrap: record["advance_scrap"],
    // 包含汽车
    isCar: record["is_car"],
    state: record["state"],
    node: record["node"],
    // 财务审核状态
    financeState: record["finance_state"],
    materialMoney: record["material_money"],
    // 防止打印单据时获取bpmNo抛出空指针异常
    issso: 1,
    hasHighAssets: record["has_high_assets"],
    hasLowAssets: record["has_low_assets"],
    nodeTime: new Date(record.nodeTime).getTime()
  };
  var assetsTypes = record["assets_type"];
  if (assetsTypes && assetsTypes.length > 0) {
    if (assetsTypes.indexOf("material") >= 0) {
      billParam["hasMaterial"] = true;
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
  }
  var billLink = [];
  if (record["bpm_no"] && (record["state"] == 0 || record["state"] == 1)) {
    billLink = getPrintableBillHtml(
      record["business_code"],
      "businessRole",
      billParam,
      record["business_code"],
      record["node"],
      record["state"]
    );
  }
  // 无可打印单据则不显示该业务
  if (billLink.length <= 0) {
    return "";
  } else {
    return billLink;
  }
}
function getPrintableBillHtml(
  businessCode,
  role,
  params,
  businessProcessCode,
  currentNodeCode,
  state
) {
  var result = getPrintableBill(
    businessCode,
    role,
    params,
    businessProcessCode,
    currentNodeCode,
    state
  );
  return result;
}
export function getPrintableBill(
  businessCode,
  role,
  params,
  businessProcessCode,
  currentNodeCode,
  state
) {
  queryPrintableBill(businessCode, role, params);
  var html = [];
  var billAndConfigCache = store.getters.product.billAndConfigCache;
  var billList = billAndConfigCache.bill.resultset;
  if (billList && billList.length > 0) {
    for (var i in printableBillMap) {
      var bill = printableBillMap[i];
      if (
        bill.business_code != businessCode ||
        (bill.default_use_role && bill.default_use_role.indexOf(role) == -1)
      ) {
        continue;
      }
      var billHtml = {
        code: bill.code,
        name: bill.name,
        action: "e?page=base.business.bill.printpreview",
        params: JSON.stringify(params)
      };
      // "<a class='btn'
      // href='javascript:printPreview(&#39;"+bill.code+"&#39;,&#39;"+$.toJSON(params)+"&#39;)'>"+bill.name+"</a>";
      var billConfigArray = printableBillConfigMap[bill.id + ""];
      var needAdd = false;
      var billConfig = null;
      if (billConfigArray) {
        for (var j in billConfigArray) {
          billConfig = billConfigArray[j];
          if (billConfig.condition) {
            var condition = billConfig.condition.replace(
              new RegExp(" gt ", "g"),
              " > "
            );
            condition = condition.replace(new RegExp(" lt ", "g"), " < ");
            condition = condition.replace(new RegExp(" ge ", "g"), " >= ");
            condition = condition.replace(new RegExp(" le ", "g"), " <= ");
            condition = condition.replace(new RegExp(" eq ", "g"), " == ");
            condition = condition.replace(new RegExp(" ne ", "g"), " != ");
            condition = condition.replace(new RegExp(" and ", "g"), " && ");
            condition = condition.replace(new RegExp(" or ", "g"), " || ");
            condition = condition.replace("${", "").replace("}", "");
            var evalStr = [];
            for (var p in params) {
              if (params[i]) {
                evalStr.push("var " + p + "='" + params[p] + "'");
              } else {
                evalStr.push("var " + p + "=''");
              }
            }
            evalStr.push(condition);
            var result = false;
            try {
              result = eval(evalStr.join(";"));
            } catch (e) {
              result = false;
            }
            needAdd = result;
          } else {
            needAdd = true;
          }
          if (needAdd) {
            if (
              billConfig.business_process_code &&
              billConfig.business_process_node_code &&
              currentNodeCode &&
              businessProcessCode
            ) {
              var currentNodeOrder =
                printableNodeMap[businessProcessCode + "$" + currentNodeCode];
              var configNodeOrder =
                printableNodeMap[
                  billConfig.business_process_code +
                    "$" +
                    billConfig.business_process_node_code
                ];
              if (state == -1) {
                break;
              } else if (
                currentNodeOrder &&
                configNodeOrder &&
                configNodeOrder < currentNodeOrder
              ) {
                html.push(billHtml);
                break;
              } else if (state == 1) {
                html.push(billHtml);
                break;
              }
            } else {
              html.push(billHtml);
              break;
            }
          }
        }
      }
      // html.push(billHtml);
    }
  }
  return html;
}
function queryPrintableBill(businessCode, role, params) {
  if (!(businessCode && role)) {
    return;
  }
  // var key = businessCode+"_"+role;
  if (params == undefined) {
    params = {};
  }
  // 如果不缓存，非常影响效率
  //	if(printableBill){
  //		return printableBill;
  //	}
  //	var async = AJAX_CONFIG["async"];
  //	AJAX_CONFIG["async"] = false;
  //	callAction("base.business.bill.queryPrintableBill", {}, function(result) {
  //		printableBill=result;
  //	});
  //	AJAX_CONFIG["async"] = async;
  var billAndConfigCache = "";
  billAndConfigCache = store.getters.product.billAndConfigCache;
  var result = billAndConfigCache; //如果界面优引入表格，则会自动加载一个js，此js包含此变量
  var billList = result.bill.resultset;
  var billConfigList = result.billConfig.resultset;

  for (var i in billList) {
    var bill = billList[i];
    // if(bill.businessCode == businessCode){
    // if(bill.default_use_role && bill.default_use_role.indexOf(role)!=-1){
    printableBillMap["" + bill.id] = bill;
    // }
    // }
  }

  for (var r in billConfigList) {
    var billConfig = billConfigList[r];
    if (printableBillMap[billConfig.business_bill_id]) {
      if (!printableBillConfigMap[billConfig.business_bill_id]) {
        printableBillConfigMap[billConfig.business_bill_id] = [];
      }
      printableBillConfigMap[billConfig.business_bill_id].push(billConfig);
    }
  }
  var sortedNodeCache = "";
  sortedNodeCache = store.getters.product.sortedNodeCache;
  var sortedNodeList = sortedNodeCache.resultset; //表格就会加载一个js文件，这个js文件里面有此变量
  for (var t in sortedNodeList) {
    var node = sortedNodeList[t];

    printableNodeMap[node.p + "$" + node.c] = node.o;
  }
}
