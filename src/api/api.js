import {get_Train_Station, get_Train_Odfare, get_Train_TimeTable} from './train';
import {get_THSR_Station, get_THSR_Odfare, get_THSR_TimeTable} from './high_Speed_Rail';
import {get_Bus_Route, 
    get_Bus_StopOfRoute, 
    get_Bus_DisplayStopOfRoute, 
    get_Bus_EstimatedTimeOfArrival, 
    get_Bus_RealTimeByFrequency, 
    get_Bus_RealTimeNearStop, 
    get_Taoyuan_BusStop,
    get_Taoyuan_BusStation} from './bus';


/*====== 台鐵 ====== */

// 得到台鐵的站點資訊(使用到的位置: /components/TrainStation)
export const API_Train_Station = get_Train_Station

// 得到台鐵的票價資訊(使用到的位置: /views/TRA)
export const API_Train_Odfare = get_Train_Odfare

// 得到台鐵的時刻表(使用到的位置: /views/TRA)
export const API_Train_TimeTable = get_Train_TimeTable


/*====== 高鐵 ====== */

// 得到高鐵的站點資訊(使用到的位置: /components/ThsrStation)
export const API_THSR_Station = get_THSR_Station

// 得到高鐵的票價資訊(使用到的位置: /views/THSR)
export const API_THSR_Odfare = get_THSR_Odfare

// 得到高鐵的時刻表(使用到的位置: /views/THSR)
export const API_THSR_TimeTable = get_THSR_TimeTable



/*====== 公車 ====== */

// 得到公車路線資訊(使用到的位置: /views/Bus)
export const API_Bus_Route = get_Bus_Route

// 得到公車路線上的各個站點(使用到的位置: /views/Bus)
export const API_Bus_StopOfRoute = get_Bus_StopOfRoute

// 得到公車路線上的各個站點(使用到的位置: /views/Bus)
export const API_Bus_DisplayStopOfRoute = get_Bus_DisplayStopOfRoute

// 得到公車路線上的到站估計時間(使用到的位置: /views/Bus)
export const API_Bus_EstimatedTimeOfArrival = get_Bus_EstimatedTimeOfArrival

// 得到目前公車在地圖上哪個位置(使用到的位置: /views/Bus)
export const API_Bus_RealTimeByFrequency = get_Bus_RealTimeByFrequency

// 得到目前公車在哪個站點(使用到的位置: /views/Bus)
export const API_Bus_RealTimeNearStop = get_Bus_RealTimeNearStop

// 得到公車的站點資訊(使用到的位置: /components/Map)
export const API_Taoyuan_BusStop = get_Taoyuan_BusStop

// 得到公車的站點資訊(使用到的位置: /components/Map)
export const API_Taoyuan_BusStation = get_Taoyuan_BusStation
