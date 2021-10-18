// train.js
import axios from 'axios'
import {useAuthHeader} from '../utilities/useAuthHeader'

const PTX_Train_Station_V2 = axios.create({
    baseURL: 'https://ptx.transportdata.tw/MOTC/v2/Rail/TRA',
    headers: useAuthHeader()
});

// 票價抓Version3的
const PTX_Train_Station_V3 = axios.create({
    baseURL: 'https://ptx.transportdata.tw/MOTC/v3/Rail/TRA',
    headers: useAuthHeader()
});

const select_Train_Station = "StationUID,StationName,StationClass,StationPosition,LocationCity"
export const get_Train_Station = () => PTX_Train_Station_V2.get(`/Station?$select=${select_Train_Station}`);
export const get_Train_Odfare = (data) => PTX_Train_Station_V3.get(`/ODFare/${data.OriginStationID}/to/${data.DestinationStationID }?$format=JSON`)
export const get_Train_TimeTable = (data) => PTX_Train_Station_V2.get(`/DailyTimetable/OD/${data.OriginStationID}/to/${data.DestinationStationID}/${data.choose_Date}?$format=JSON`)