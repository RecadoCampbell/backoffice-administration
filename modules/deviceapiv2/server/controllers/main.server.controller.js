'use strict'
var path = require('path'),
    db = require(path.resolve('./config/lib/sequelize')),
    response = require(path.resolve("./config/responses.js")),
    models = db.models,
    winston = require(path.resolve('./config/lib/winston'));

/**
 * @api {post} /apiv2/main/device_menu /apiv2/main/device_menu
 * @apiVersion 0.2.0
 * @apiName DeviceMenu
 * @apiGroup DeviceAPI
 *
 * @apiHeader {String} auth Users unique access-key.
 * @apiDescription Removes check box from device so user can login on another device
 */
exports.device_menu = function(req, res) {
    var thisresponse = new response.OK();
    //req.auth_obj = {} ;
    //req.auth_obj.appid = 1;
    models.device_menu.findAll({
        attributes: ['id', 'title', 'url', 'icon_url', [db.sequelize.fn('concat', req.app.locals.settings.assets_url, db.sequelize.col('icon_url')), 'icon'], 'menu_code', 'position', ['menu_code','menucode']],
        where: {appid: {$like: '%'+req.auth_obj.appid+'%' }, isavailable:true},
        order: [[ 'position', 'ASC' ]]
    }).then(function (result) {
        for(var i=0; i<result.length; i++){
            result[i].icon_url = req.app.locals.settings.assets_url+result[i].icon_url;
        }
        response.send_res(req, res, result, 200, 1, 'OK_DESCRIPTION', 'OK_DATA', 'private,max-age=86400');
    }).catch(function(error) {
        response.send_res(req, res, [], 706, -1, 'DATABASE_ERROR_DESCRIPTION', 'DATABASE_ERROR_DATA', 'no-store');
    });
};


/** DEVICE MENU GET
 * @api {get} /apiv2/main/device_menu Get Device Main Menu
 * @apiVersion 0.2.0
 * @apiName GetDeviceMenu
 * @apiGroup Main Menu
 *
 * @apiHeader {String} auth Users unique access-key.
 * @apiDescription Get Main Menu object for the running application.
 */
exports.device_menu_get = function(req, res) {

    models.device_menu.findAll({
        attributes: ['id', 'title', 'url', 'icon_url', [db.sequelize.fn('concat', req.app.locals.settings.assets_url, db.sequelize.col('icon_url')), 'icon'], 'menu_code', 'position', ['menu_code','menucode']],
        where: {appid: {$like: '%'+req.auth_obj.appid+'%' }, isavailable:true},
        order: [[ 'position', 'ASC' ]]
    }).then(function (result) {
        for(var i=0; i<result.length; i++){
            result[i].icon_url = req.app.locals.settings.assets_url+result[i].icon_url;
        }

        response.send_res_get(req, res, result, 200, 1, 'OK_DESCRIPTION', 'OK_DATA', 'private,max-age=86400');

    }).catch(function(error) {
        response.send_res_get(req, res, [], 706, -1, 'DATABASE_ERROR_DESCRIPTION', 'DATABASE_ERROR_DATA', 'no-store');
    });
};


/** GET DEVICE MENU WITH TWO LEVELS - LEVEL ONE
 * @api {get} /apiv2/main/device_menu_levelone Get DeviceMenu level One
 * @apiVersion 0.2.0
 * @apiName GetDeviceMenuLevelOne
 * @apiGroup Main Menu
 *
 * @apiHeader {String} auth Users unique access-key.
 * @apiDescription Get Main Menu object for the running application.
 */
exports.get_devicemenu_levelone = function(req, res) {
    models.device_menu.findAll({
        attributes: ['id', 'title', 'url',
            [db.sequelize.fn('concat', req.app.locals.settings.assets_url, db.sequelize.col('icon_url')), 'icon'],
            [db.sequelize.fn('concat', req.app.locals.settings.assets_url, db.sequelize.col('icon_url')), 'icon_url'],
            'menu_code', 'position','parent_id','menu_description', ['menu_code','menucode']],
        where: {appid: {$like: '%'+req.auth_obj.appid+'%' }, isavailable:true},
        order: [[ 'position', 'ASC' ]]
    }).then(function (result) {
        for(var i=0; i<result.length; i++){
            result[i].dataValues.menucode = 0;
            result[i].dataValues.menu_code = 0;
            result[i].dataValues.parent_id = 0;
        }
        response.send_res_get(req, res, result, 200, 1, 'OK_DESCRIPTION', 'OK_DATA', 'private,max-age=86400');
    }).catch(function(error) {
        winston.error('error getting two level menu: ',error)
        response.send_res_get(req, res, [], 706, -1, 'DATABASE_ERROR_DESCRIPTION', 'DATABASE_ERROR_DATA', 'no-store');
    });
};


/** GET DEVICE MENU WITH TWO LEVELS - LEVEL TWO
 * @api {get} /apiv2/main/device_menu_leveltwo Get DeviceMenu level Two
 * @apiVersion 0.2.0
 * @apiName GetDeviceMenuLevelTwo
 * @apiGroup Main Menu
 *
 * @apiHeader {String} auth Users unique access-key.
 * @apiDescription Get Main Menu object for the running application.
 */
exports.get_devicemenu_leveltwo = function(req, res) {
    models.device_menu_level2.findAll({
        attributes: ['id', 'title', 'url',
            [db.sequelize.fn('concat', req.app.locals.settings.assets_url, db.sequelize.col('icon_url')), 'icon'],
            [db.sequelize.fn('concat', req.app.locals.settings.assets_url, db.sequelize.col('icon_url')), 'icon_url'],
            'menu_code', 'position','parent_id','menu_description', ['menu_code','menucode']],
        where: {appid: {$like: '%'+req.auth_obj.appid+'%' }, isavailable:true},
        order: [[ 'position', 'ASC' ]]
    }).then(function (result) {

        response.send_res_get(req, res, result, 200, 1, 'OK_DESCRIPTION', 'OK_DATA', 'private,max-age=86400');

    }).catch(function(error) {
        winston.error('error getting two level menu: ',error)
        response.send_res_get(req, res, [], 706, -1, 'DATABASE_ERROR_DESCRIPTION', 'DATABASE_ERROR_DATA', 'no-store');
    });
};

