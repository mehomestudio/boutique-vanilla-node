const env = require('../environnement/dev');
const { findUsersAll } = require('../queries/user.queries');

// DASHBOARD
exports.dashboard = async (req, res, next) => {
    try {
        res.render("admin/dashboard", { pageName: "dashboard" });
    } catch (e) {
        next(e);
    }
};

// USERS
exports.userList = async (req, res, next) => {
    try {
        const users = await findUsersAll();
        res.render("admin/users/mainPage", { pageName: "users", users });
    } catch (e) {
        next(e);
    }
};

// CATEGORIES
exports.categoriesList = async (req, res, next) => {
    try {
        res.render("admin/categories/mainPage", { pageName: "categories" });
    } catch (e) {
        next(e);
    }
};

// PRODUCTS
exports.productsList = async (req, res, next) => {
    try {
        res.render("admin/products/mainPage", { pageName: "products" });
    } catch (e) {
        next(e);
    }
};

// CARRIERS
exports.carriersList = async (req, res, next) => {
    try {
        res.render("admin/carriers/mainPage", { pageName: "carriers" });
    } catch (e) {
        next(e);
    }
};

// ORDERS
exports.ordersList = async (req, res, next) => {
    try {
        res.render("admin/orders/mainPage", { pageName: "orders" });
    } catch (e) {
        next(e);
    }
};