<script
  type="text/javascript"
  src="https://cdn.bootcss.com/jquery/3.4.1/jquery.min.js"
  defer
></script>;
export function printTag(settings, chooseList) {
  printMask("tag");
  $("#mask .tips").hide();

  // 本次打印标签个数
  var printNum = chooseList.length,
    masterNum = 0,
    attachNum = 0;
  // 获取终端耗材信息
  if ($.isEmptyObject(settings.terminalStatis) && $.cookie("mac")) {
    loadTerminalStatis();
  }
  // 判断是否需要打印附件标签
  if (settings.notPrintAttachTag === "false") {
    // 查询本次打印标签个数
    callAction(
      "terminal.query.assetsStatis",
      {
        codes: settings.selectedAssets.join(",")
      },
      function(statis) {
        if (statis) {
          printNum = statis.total_num;
          masterNum = statis.master_num;
          attachNum = statis.attach_num;
        }
      },
      function(err) {
        console.log(err);
      }
    );
  }
  // 判断本次打印个数是否超出剩余耗材数量
  if (!$.isEmptyObject(settings.terminalStatis)) {
    if (
      printNum > settings.terminalStatis.tag_num ||
      printNum > settings.terminalStatis.ribbon_num
    ) {
      if (
        false ===
        confirm(
          "本次预计打印 " +
            printNum +
            " 个标签" +
            (settings.notPrintAttachTag === "false" ? "(含附件)" : "") +
            ", 终端标签纸或碳带不足, 是否继续打印?"
        )
      ) {
        $("#mask").hide();
        return false;
      }
    }
  }
  // 打印参数
  var billParam = {
    page: settings.tagAction,
    codes: settings.selectedAssets.join(","),
    window_: "pdf",
    type_: "jasper",
    print: true,
    printer: settings.tagPrinter,
    printCode: option.printCode,
    mac: $.cookie("mac")
  };
  if (attachNum > 0) {
    $("#mask").hide();
    // 选择打印类型
    $("#choosePrintType").modal({
      show: function() {
        $(this)
          .find("#tagTotalNum")
          .text(printNum);
        $(this)
          .find("#tagMasterNum")
          .text(masterNum);
        $(this)
          .find("#tagAttachNum")
          .text(attachNum);
      },
      success: function() {
        $("#mask")
          .show()
          .find(".tips")
          .show(300);
        // 打印类型
        billParam.printType = $(this).attr("data-print-type");
        printTypeInternal();
      }
    });
  } else {
    $("#mask .tips").show();
    printTypeInternal();
  }
  function printTypeInternal() {
    var currentPrintNum = 0;
    switch (billParam.printType) {
      case "onlyMaster":
        currentPrintNum = masterNum;
        break;
      case "onlyAttach":
        currentPrintNum = attachNum;
        break;
      case "masterAndAttach":
      default:
        currentPrintNum = printNum;
        break;
    }
    // 最大打印数量
    if (
      !!settings.terminalPrintTagMaxNum &&
      settings.terminalPrintTagMaxNum > 0 &&
      currentPrintNum > settings.terminalPrintTagMaxNum
    ) {
      $("#mask").hide();
      $("#overflowMaxNum").show();
      return false;
    }
    // 设置打印日志
    settings.printLog = {
      businessBillCode: settings.tagAction,
      billType: 1,
      printState: 1
    };
    // 打印标签
    openWindow("e", billParam, "printFrame");
  }
  // 更新终端耗材数量
  loadTerminalStatis();
}
/**
 * 加载终端耗材信息
 */
function loadTerminalStatis() {
  if (!$.cookie("mac")) {
    return false;
  }
  callAction(
    "terminal.base.materialStatis",
    {
      mac: $.cookie("mac")
    },
    function(statis) {
      if (statis) {
        settings.terminalStatis = statis;
        for (var key in statis) {
          $("#" + key).text(statis[key]);
        }
        $(".terminal-statis").removeClass("hide");
        $(window).trigger("loadTerminalStatis", [statis]);
      }
    },
    function(err) {
      console.log(err);
    }
  );
}
function printMask(printType) {
  $("#mask")
    .show()
    .find(".tips > p")
    .html("正在获取单据信息, 请稍候......");
  $("#mask")
    .find(".tips > .btnbox")
    .hide();
  $("#mask")
    .find(".print-animation")
    .find(printType === "tag" ? ".doc" : ".tag")
    .addClass("disabled");
  $("#mask")
    .find(".print-animation")
    .find(printType === "tag" ? ".tag" : ".doc")
    .removeClass("disabled");

  $('iframe[name="printFrame"]').remove();
  $(document.body).append(
    '<iframe frameborder="0" height="1" width="1" name="printFrame"></iframe>'
  );

  var interval;
  var iframe = window.frames["printFrame"];
  if (iframe) {
    interval = setInterval(function() {
      try {
        if ("complete" === iframe.document.readyState) {
          showDoing(iframe.document);
        }
      } catch (ignore) {
        showDoing(iframe.document);
      }
    }, 1000);
  } else {
    showDoing();
  }
  function showDoing(doc) {
    clearInterval(interval);
    if (doc && doc.title) {
      $("#mask").hide();
      var cause = $(".shortMsg", doc).html();
      $(document.body).append(
        '<div class="mask"><div class="tips logout"><p style="color: red;">打印失败! ' +
          cause +
          '</p><div class="btnbox"><a class="blue" href="javascript:void(0);" onclick="$(this).parents(&#39;.mask&#39;).remove()">确认</a></div></div></div>'
      );
      // 标记为打印失败, 记录失败原因
      printError(cause);
    } else {
      if (settings.systemErrorLinkman && settings.systemErrorLinkmanPhone) {
        $("#mask")
          .find(".tips > p")
          .html(
            '正在打印中......<p style="font-size: 18px;">如遇打印不清晰或打印机缺墨, 请联系' +
              settings.systemErrorLinkman +
              ": " +
              settings.systemErrorLinkmanPhone +
              '</p><p style="font-size: 18px;">如遇打印故障、无响应、未出纸等情况，请勿重复打印！</p>'
          );
      } else {
        $("#mask")
          .find(".tips > p")
          .html("正在打印中......");
      }
      $("#mask")
        .find(".tips > .btnbox")
        .show();
      loadTerminalStatis();
    }
    //        clearInterval(interval);
    //        if (settings.systemErrorLinkman && settings.systemErrorLinkmanPhone) {
    //            $('#mask').find('.tips > p').html('正在打印中......<p style="font-size: 18px;">如遇打印不清晰或打印机缺墨, 请联系'
    //                    + settings.systemErrorLinkman + ': ' + settings.systemErrorLinkmanPhone + '</p>');
    //        } else {
    //            $('#mask').find('.tips > p').html('正在打印中......');
    //        }
    //        $('#mask').find('.tips > .btnbox').show();
    //        loadTerminalStatis();
  }
}
function openWindow(url, data, target) {
  var lc_ = getQueryStringRegExp("lc_");
  data = $.extend(true, {}, data);
  if (lc_) {
    data["lc_"] = lc_;
  }
  $("#__windowOpenForm").remove();
  var fmhtml = $('<form id="__windowOpenForm" method="post" action=""></form>');
  fmhtml.attr("action", url);
  fmhtml.attr("target", target || "_blank");
  var input,
    inputStr = "<input type='hidden'>";
  for (var o in data) {
    if ($.isArray(data[o])) {
      for (var i = 0; i < data[o].length; i++) {
        input = $(inputStr);
        input.attr("name", o);
        input.val(data[o][i]);
        fmhtml.append(input);
      }
    } else {
      input = $(inputStr);
      input.attr("name", o);
      input.val(data[o]);
      fmhtml.append(input);
    }
  }
  $(document)
    .find("body")
    .append(fmhtml);
  fmhtml = $("#__windowOpenForm");
  fmhtml.submit();
  fmhtml.remove();
}
function getQueryStringRegExp(name, href) {
  if (href == undefined || href == "") {
    href = location.href;
  }
  var qop = decodeURLParams(href);
  return qop[name] || "";
}
function decodeURLParams(url) {
  var p = {};
  if (url.indexOf("?") < 0) {
    return p;
  }
  url = url.substring(url.indexOf("?") + 1);
  var params = url.split("&");
  for (var i = 0; i < params.length; i++) {
    var t = params[i].split("=");
    p[t[0]] = t[1];
  }
  return p;
}
