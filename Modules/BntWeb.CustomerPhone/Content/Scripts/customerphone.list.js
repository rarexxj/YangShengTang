jQuery($(function () {
    bntToolkit.initForm($("#VoucherForm"), {
        CustomerPhone: {
            required: true
        }
    }, beforeSubmit, success);
}));

function beforeSubmit(formData, jqForm, options) {
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