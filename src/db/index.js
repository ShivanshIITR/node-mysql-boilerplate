const Sequelize = require("sequelize");
var fs = require("fs");
var path = require("path");
const db = {};
const basePath = `${path.join(__dirname, "./../../src/db/schema")}`;
const colors = require("colors/safe");

function recursiveModels(folderName = basePath) {
  fs.readdirSync(folderName).map((file) => {
    const fullName = path.join(folderName, file);
    const stat = fs.lstatSync(fullName);
    if (stat.isDirectory()) {
      recursiveModels(fullName);
    } else if (file === "index.js") {
      let x = require(fullName)(sequelize);
      db[x["Schema"]] = x;
    }
  });
}

const sequelize = new Sequelize(
  process.env.TEST_MODE != undefined
    ? `${process.env.DB_NAME}_test`
    : process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASS,
  {
    dialect: process.env.DB_DRIVER || "postgres",
    dialectOptions: {
      options: {
        requestTimeout: 15000,
      },
    },
    logging: parseInt(process.env.DB_LOGGING) === 1 ? true : false,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    pool: {
      max: parseInt(process.env.DB_POOL_SIZE, 0),
      min: 0,
      acquire: 100000,
      idle: 5000,
      evict: 1000,
    },
    connectionTimeout: 15000,
    requestTimeout: 15000,
  }
);
recursiveModels(basePath);
Object.keys(db).forEach((schemaName) => {
  Object.keys(db[schemaName]).forEach((modelName) => {
    if (db[schemaName][modelName].associate) {
      db[schemaName][modelName].associate(db);
    }
  });
});

// db.UserSchema = require("./schema/user")(sequelize);
// db.UserSchema.UserAccount.associate(db)

db.sequelize = sequelize;
db.Sequelize = Sequelize;

// const PublicSchemma = require("./schemas/public")(sequelize);
// for(var key in PublicSchemma) {
//     db[key] = PublicSchemma[key]
// }

// ping call
db.ping = async () => {
  try {
    await sequelize.authenticate();
    // const current_timestamp = await sequelize.query("select CURRENT_TIMESTAMP as timestamp;", { raw: false, type: Sequelize.QueryTypes.SELECT  });
    // const timezone = await sequelize.query("DECLARE @TimeZone VARCHAR(50)\n" +
    //     "EXEC MASTER.dbo.xp_regread 'HKEY_LOCAL_MACHINE','SYSTEM\\CurrentControlSet\\Control\\TimeZoneInformation','TimeZoneKeyName',@TimeZone OUT\n" +
    //     "SELECT @TimeZone as timezone", { raw: false, type: Sequelize.QueryTypes.SELECT  });

    console.log(
      `$ {colors.green(figures.tick)} Database connection ${colors.green("OK")}`
    );
    // console.info(`${(process.env.DB_DRIVER || 'postgres').toUpperCase()} Current Timestamp:`, current_timestamp[0].timestamp);
    // console.info(`${(process.env.DB_DRIVER || 'postgres').toUpperCase()} Current Timezone:`, timezone[0].timezone);
  } catch (e) {
    console.error(
      `$ {colors.red(figures.cross)} Database connection  ${colors.red(
        "FAILED"
      )}`,
      e
    );
    process.exit(1);
  }
};
//
// db.result = (result) => {
//     if(result instanceof Error) {
//         return  { error: result, data: null }
//     }
// }

module.exports = db;
