import Sequelize, {Optional, Model, ModelAttributes} from "sequelize";
import database from "ms-commons/data/db";
import {IContact} from "./contact";

interface IContactCreationAttibutes extends Optional<IContact, "id">{};

export interface IContactModel extends Model<IContact,IContactCreationAttibutes>,IContact{};

export default database.define<IContactModel>('contact', {
    id: {
        type: Sequelize.INTEGER.UNSIGNED,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true
    },
    accountId:{
        type: Sequelize.INTEGER.UNSIGNED,
        allowNull: false
    },
    name: {
        type: Sequelize.STRING(150),
        allowNull: false
    },
    email: {
        type: Sequelize.STRING(150),
        allowNull: false
    },
    phone: {
        type: Sequelize.STRING(11),
        allowNull: false
    },
    status: {
        type: Sequelize.SMALLINT.UNSIGNED,
        allowNull:false,
        defaultValue: 100
    } 
} , {
        indexes: [{
            unique: true,
            fields: ['accountId','email']
        }]
    }
)