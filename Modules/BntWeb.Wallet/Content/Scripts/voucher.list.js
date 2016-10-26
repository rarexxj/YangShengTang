jQuery(function ($) {
	var status = $("#Status").val();
	var name = $("#Title").val();
	var goodsTable = $('#VouchersTable').dataTable({
		"processing": true,
		"serverSide": true,
		"ajax": {
			"url": url_loadPage,
			"data": function (d) {
				//添加额外的参数传给服务器
				d.extra_search = { "Name": name, "Status": status };
			}
		},
		"sorting": [[0, "desc"]],
		"aoColumns":
        [
            { "mData": "Title", 'sClass': 'left' },
            {
            	"mData": "Type",
            	'sClass': 'center',
            	"mRender": function (data, type, full) {
            		if (data == 1) {
            			return '<span class="label label-sm label-success">通用</span>';
            		}
            		return '<span class="label label-sm label-success">类型</span>';
            	}
            },
            {
            	"mData": "UseTimes",
            	'sClass': 'center'
            },
            {
            	"mData": "StartTime",
            	'sClass': 'center',
            	"mRender": function (data, type, full) {
            		if (data != null && data.length > 0) {
            			return eval('new ' + data.replace(/\//g, '')).Format("yyyy-MM-dd");
            		} else {
            			return "";
            		}
            	}
            },
            {
            	"mData": "EndTime",
            	'sClass': 'center',
            	"mRender": function (data, type, full) {
            		if (data != null && data.length > 0) {
            			return eval('new ' + data.replace(/\//g, '')).Format("yyyy-MM-dd");
            		} else {
            			return "";
            		}
            	}
            },
            {
            	"mData": "Denomination",
            	'sClass': 'center',
            	"mRender": function (data, type, full) {
            		if (full.Condition == "") {
            			return '<span class="label label-sm label-success">' + full.Denomination + '元</span>';
            		}
            		return '<span class="label label-sm label-danger">满' + full.Condition + '减' + full.Denomination + '元</span>';
            	}
            },
            {
            	"mData": "CreatTime",
            	'sClass': 'left',
            	"mRender": function (data, type, full) {
            		if (data != null && data.length > 0) {
            			return eval('new ' + data.replace(/\//g, '')).Format("yyyy-MM-dd hh:mm:ss");
            		} else {
            			return "";
            		}
            	}
            },
            {
            	"mData": "IsUser",
            	'sClass': 'center',
            	"orderable": false,
            	"mRender": function (data, type, full) {
            		if (data) {
            			return '<span class="label label-sm label-success">是</span>';
            		}
            		return '<span class="label label-sm label-danger">否</span>';
            	}
            },
            {
            	"mData": "Id",
            	'sClass': ' center',
            	"orderable": false,
            	"sWidth": "200px",
            	"mRender": function (data, type, full) {
            		var render = '<div class="visible-md visible-lg hidden-sm hidden-xs action-buttons">';
            		if (full.IsUser == 0) {
            			render += '<a class="green switch" data-id="' + full.Id + '" data-value="on" href="#"  title="启用"><i class="icon-circle-blank bigger-130"></i></a>';
            			render += '<a class="blue" href="' + url_editGoods + '?id=' + full.Id + '" title="编辑"><i class="icon-pencil bigger-130"></i></a>';
            			render += '<a class="red delete" data-id="' + full.Id + '" href="#" title="删除"><i class="icon-trash bigger-130"></i></a>';
            		}
            		render += '</div>';
            		return render;
            	}
            }
        ]
	});

	//查询
	$('#QueryButton').on("click", function () {
	    name = $("#Title").val();
		status = $("#Status").val();
		goodsTable.api().ajax.reload();
	});

	//删除
	$('#VouchersTable').on("click", ".delete", function (e) {
		var id = $(this).data("id");

		bntToolkit.confirm("确定删除该优惠券么？", function () {
		    bntToolkit.post(url_deleteGoods, { id: id }, function (result) {
				if (result.Success) {
					$("#VouchersTable").dataTable().fnDraw();
				} else {
					bntToolkit.error(result.ErrorMessage);
				}
			});
		});
	});

	//启用
	$('#VouchersTable').on("click", ".switch", function (e) {
		var id = $(this).data("id");
		var value = $(this).data("value");
		var url = url_InSaleGoods;
		bntToolkit.confirm("确定启用么？启用之后将不能修改和删除！", function () {
			bntToolkit.post(url, { id: id }, function (result) {
				if (result.Success) {
					$("#VouchersTable").dataTable().fnDraw();
				} else {
					bntToolkit.error(result.ErrorMessage);
				}
			});
		});

	});

});