<?php
/**
 *
 * 简要的功能描述
 *
 * @Project foodtruck
 * @Copyright:
 * @Author: shifangyu
 * @Createtime: 2017/8/29 23:02
 */
define('MAXVIEWNUM', 20); //最大展示数量
$content = file_get_contents('./foodtrucks.json');
$content = json_decode($content, true);
$data = $content['data'];
$func = $_GET['f'];
$lng = htmlentities(trim($_POST['lng']), ENT_QUOTES);
$lat = htmlentities(trim($_POST['lat']), ENT_QUOTES);
if ($func == 'getnear') {
    $result = get_near($data, $lng, $lat);
    if (false === $result) $result = ['status' => false, 'msg' => 'Failed to get near food trucks'];
    else $result = ['status' => true, 'data' => $result];
    echo json_encode($result);
} else if ($func == 'search') {
    $sval = htmlentities(trim($_POST['searchval']), ENT_QUOTES);
    $result = search($data, $sval, $lng, $lat);
    if (false === $result) $result = ['status' => false, 'msg' => 'Failed to search food truck'];
    else $result = ['status' => true, 'data' => $result];
    echo json_encode($result);
}
return;

function get_near($data = [], $lng = null, $lat = null) {
    if (!$data || !is_array($data) || !is_numeric($lng) || !is_numeric($lat)) return false;
    $nears = [];
    foreach ($data as $d) {
        if (($dis = get_distance($lng, $lat, $d[23], $d[22])) < 2 * 1000) {
            $nears[$dis] = getReturnVal($d);
        }
    }
    ksort($nears);
    if(count($nears) > MAXVIEWNUM) $nears = array_slice($nears, 0, MAXVIEWNUM);
    return $nears;
}

function get_distance($lng1, $lat1, $lng2, $lat2) {
    // 将角度转为狐度
    $radLat1 = deg2rad($lat1); //deg2rad()函数将角度转换为弧度
    $radLat2 = deg2rad($lat2);
    $radLng1 = deg2rad($lng1);
    $radLng2 = deg2rad($lng2);
    $a = $radLat1 - $radLat2;
    $b = $radLng1 - $radLng2;
    $s = 2 * asin(sqrt(pow(sin($a / 2), 2) + cos($radLat1) * cos($radLat2) * pow(sin($b / 2), 2))) * 6378.137 * 1000;
    return $s;
}

function getReturnVal($row) {
    return ['applicant' => $row[9], 'facilitytype' => $row[10], 'locationdescription' => $row[12], 'address' => $row[13], 'fooditems' => $row[19], 'lat' => $row[22], 'lng' => $row[23]];
}

function search($data = [], $sval = null, $lng = null, $lat = null) {
    if (!$data || !is_array($data) || !$sval) return false;
    $result = [];
    foreach ($data as $d) {
        if (stripos($d[9], $sval) !== false || stripos($d[12], $sval) !== false || stripos($d[13], $sval) !== false || stripos($d[19], $sval) !== false) {
            $item = getReturnVal($d);
            if (is_numeric($lng) && is_numeric($lat)) {
                $dis = get_distance($lng, $lat, $d[23], $d[22]);
                $result[$dis] = $item;
            } else
                $result[] = $item;
        }
    }
    is_numeric($lng) && is_numeric($lat) && ksort($result);
    if(count($result) > MAXVIEWNUM) $result = array_slice($result, 0, MAXVIEWNUM);
    return $result;
}