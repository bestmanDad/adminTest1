import { fa } from "element-plus/es/locales.mjs";
import request from "./request.js";

export default {
    // 获取homeTable数据
    getHomeTableData() {
        return request({
            url: "/home/getUserTableData",
            method: "get",
        });
    },

    getCountData() {
        return request({
            url: "/home/getCountData",
            method: "get",
        });
    },

    getChartData() {
        return request({
            url: "/home/getChartData",
            method: "get",
        });
    },

    getUserData(data) {
        return request({
            url: "/home/getUserData",
            method: "get",
            data,
        });
    },

    deleteUser(data) {
        return request({
            url: "/user/deleteUser",
            method: "get",
            data,
        });
    },

    createUser(data) {
        return request({
            url: "/user/createUser",
            method: "post",
            data,
        });
    },

    updateUser(data) {
        return request({
            url: "/user/updateUser",
            method: "post",
            data,
        });
    },
    getMenu(data) {
        return request({
            url: "/permission/getMenu",
            method: "post",
            data,
        });
    },
};
