jQuery($(function () {
    var options = $.datepicker.regional["zh-CN"];
    options["dateFormat"] = "yy-mm-dd";
    $("#StartTime").datepicker(options);
    $("#EndTime").datepicker(options);

    bntToolkit.initForm($("#VoucherForm"), {
        Title: {
            required: true
        },
        CategoryName: {
            required: true
        },
        Denomination: {
            required: true,
            number:true
        },
        StartTime: {
            required: true,
           date:true
        },
        EndTime: {
            required: true,
            date:true
        },
        UseTimes: {
            required: true
        }
    }, beforeSubmit, success);
}));

function beforeSubmit(formData, jqForm, options) {
    if ($("#Type").val() == "2" && $("#CategoryName").val() == "") {
        bntToolkit.error("商品分类不能为空");
        return false;
    }
    return true;
}

// post-submit callback
function success(result, statusText, xhr, $form) {
    if (!result.Success) {
        bntToolkit.error(result.ErrorMessage);
    } else {
        location.href = url_list;
    }
}

function divCategory() {
    if ($("#Type").val() == "1") {
        $("#divCategory").css("display", "none");
    }
    else {
        $("#divCategory").css("display", "");
    }
}