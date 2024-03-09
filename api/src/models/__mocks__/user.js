//
// Mocks the User Model Object
//

const userTableDefault = [
    { "id": 17 , "first_name": "James", "last_name": "Mockdata", "email": "james.mockdata@localhost.com", "failed_login_count": 0, "role_id": 1},
    { "id": 18 , "first_name": "Jane", "last_name": "Mockdata", "email": "jane.mockdata@localhost.com", "failed_login_count": 0, "role_id": 1},
    { "id": 19 , "first_name": "John", "last_name": "Doe", "email": "login_account_disabled@localhost.com", "password": "secret", "enabled": false, "failed_login_count": 0, "role_id": 1},
    { "id": 20 , "first_name": "Jill", "last_name": "Doe", "email": "login_account_undefined@localhost.com", "password": "secret", "failed_login_count": 0, "role_id": 1},
    { "id": 21 , "first_name": "Joy", "last_name": "Doe", "email": "login_account_good@localhost.com", "enabled": true, "password": "secret", "failed_login_count": 0, "role_id": 1}
];

let userTable = JSON.parse(JSON.stringify(userTableDefault));
const resetUserTable = () => { userTable = JSON.parse(JSON.stringify(userTableDefault)); }

const User = {
    create: jest.fn().mockImplementation(async (newUserModel) => {
        newUserModel.id = 999;
        return Promise.resolve(newUserModel);
    }),

    findOne: jest.fn(async (filter) => {
        const [filterByFieldName] = Object.keys(filter.where);
        const filterByFieldValue = filter.where[filterByFieldName];
        const userData = userTable.find(x => x[filterByFieldName] === filterByFieldValue);

        if (userData)
            userData.save = jest.fn();

        return Promise.resolve(userData);
    }),

    save: jest.fn(),

    update: jest.fn(async (newVals, filter) => {
        let userData = userTable.find(x => x.email === filter.where.email)
        userData = Object.assign(userData, newVals);
        return Promise.resolve(userData);
    }),

    increment: jest.fn(async (field, filter) => {
        const user = userTable.find(x => x.email === filter.where.email);
        user.failed_login_count = user.failed_login_count + 1;
    }),

    destroy: jest.fn(),

    reset: () => {
        resetUserTable() ;
    }
};

module.exports = User;