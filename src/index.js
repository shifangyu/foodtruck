/**
 * Created by shifangyu on 2017/9/1.
 */
(function ($) {
    var map = new BMap.Map("container");
    var point = new BMap.Point(-122.395902231236, 37.7593037663834);
    map.centerAndZoom(point, 15);
    map.enableScrollWheelZoom(true);
    var selfmarker = new BMap.Marker(point, {
        // 指定Marker的icon属性为Symbol
        icon: new BMap.Symbol(BMap_Symbol_SHAPE_POINT, {
            scale: 1.5,//图标缩放大小
            fillColor: "orange",//填充颜色
            fillOpacity: 0.8//填充透明度
        })
    });
    selfmarker.enableDragging();
    var label = new BMap.Label("Move me to find trucks", {offset: new BMap.Size(20, -10)});
    label.setStyle({
        fontSize: '14px',
        border: '0px',
        height: "20px",
        lineHeight: "20px",
        fontFamily: "微软雅黑"
    });
    label.addEventListener("click", function (e) {
        map.removeOverlay(this);
    });
    selfmarker.setLabel(label);
    selfmarker.setTitle('Move me to find food trucks nearby');
    selfmarker.disableMassClear();
    selfmarker.setAnimation(BMAP_ANIMATION_BOUNCE);
    map.addOverlay(selfmarker);
    setTimeout(function () {
        selfmarker.setAnimation(null);
    }, 3000);
    var opts = {
        width: 300,     // 信息窗口宽度
        height: 0,     // 信息窗口高度
        title: "信息窗口", // 信息窗口标题
        enableMessage: true//设置允许信息窗发送短息
    };
    var createMarkerCb = function (opts, content, point) {
        return function (e) {
            var infoWindow = new BMap.InfoWindow(content, opts);  // 创建信息窗口对象
            map.openInfoWindow(infoWindow, point); //开启信息窗口
        };
    }
    selfmarker.addEventListener("dragend", function (e) {
        var pt = e.point;
        map.clearOverlays();
        $.ajax({
            url: 'service.php?f=getnear',
            type: "POST",
            async: true,
            data: pt,
            dataType: 'json'
        }).done(function (ret) {
            if (ret) {
                if (ret.status) {
                    if (ret.data && ret.data.length > 0) {
                        $.each(ret.data, function (i, e) {
                            var point = new BMap.Point(e.lng, e.lat);
                            var marker = new BMap.Marker(point);
                            map.addOverlay(marker);
                            var infCon = '<p style="height: 100px; overflow-y: auto">FacilityType: ' + e.facilitytype + '<br/>LocationDescription: ' + (e.locationdescription) + '<br/>Address: ' + e.address + '<br/>FoodItems: ' + e.fooditems + '</p>';
                            var opt = $.extend({}, opts);
                            opt.title = e.applicant;
                            marker.addEventListener("click", createMarkerCb(opt, infCon, point));
                        });
                        map.setCenter(selfmarker.getPosition());
                    } else {
                        alert('There is no food truck near');
                    }
                } else {
                    alert(ret.msg);
                }
            } else {
                alert('Failed to get near food trucks');
            }
        }).fail(function () {
            alert("Failed to get near food trucks");
        });
    });
    var search = function (sval, point) {
        $.ajax({
            url: 'service.php?f=search',
            type: "POST",
            async: true,
            data: {'searchval': sval, 'lng': point.lng, 'lat': point.lat},
            dataType: 'json'
        }).done(function (ret) {
            if (ret) {
                if (ret.status) {
                    if (ret.data && ret.data.length > 0) {
                        $.each(ret.data, function (i, e) {
                            var point = new BMap.Point(e.lng, e.lat);
                            var marker = new BMap.Marker(point);
                            map.addOverlay(marker);
                            var infCon = '<p style="height: 100px; overflow-y: auto">FacilityType: ' + e.facilitytype + '<br/>LocationDescription: ' + (e.locationdescription) + '<br/>Address: ' + e.address + '<br/>FoodItems: ' + e.fooditems + '</p>';
                            var opt = $.extend({}, opts);
                            opt.title = e.applicant;
                            marker.addEventListener("click", createMarkerCb(opt, infCon, point));
                        });
                        map.centerAndZoom(new BMap.Point(ret.data[0].lng, ret.data[0].lat), 15);
                    } else {
                        alert('There is no matched food truck');
                    }
                } else {
                    alert(ret.msg);
                }
            } else {
                alert('Failed to search food truck');
            }
        }).fail(function () {
            alert("Failed to search food trucks");
        });
    }
    $('#btn_search').on('click', function () {
        var val = $('#inp_search').val();
        if ($.trim(val) != '') {
            search(val, selfmarker.getPosition());
            map.clearOverlays();
        }
    });
    $('#inp_search').on('keydown', function (e) {
        var val = $(this).val();
        if (e.keyCode == 13 && $.trim(val) != '') {
            search(val, selfmarker.getPosition());
            map.clearOverlays();
        }
    });
})(window.jQuery);