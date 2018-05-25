const koa = require('koa');
const app = new koa();
const router = require('koa-router')();
var bodyParser = require('koa-bodyparser');
// CORS是一个W3C标准，全称是"跨域资源共享"（Cross-origin resource sharing）。
const cors = require('koa2-cors');
// 数据库
const Sequelize = require('sequelize');
const config = require('./config');
app.use(cors({
  origin: function (ctx) {
      // if (ctx.url === '/test') {
          return "*"; // 允许来自所有域名请求
      // }
      // return 'http://localhost:8080'; // 这样就能只允许 http://localhost:8080 这个域名的请求了
  },
  exposeHeaders: ['WWW-Authenticate', 'Server-Authorization'],
  maxAge: 5,
  credentials: true,
  allowMethods: ['GET', 'POST', 'DELETE'],
  allowHeaders: ['Content-Type', 'Authorization', 'Accept'],
}))

app.use(bodyParser({
  enableTypes:['json', 'form', 'text']
}))

router.get('/', async function (ctx, next) {
  ctx.response.body = '访问成功';
});

router.get('/getData/:city', async function (ctx, next) {
  const param = ctx.params.city;
  const data = await getData(param);
  ctx.response.body = data;
});

const sequelize = new Sequelize(config.database, config.username, config.password, {
  host: config.host,
  dialect: 'mysql',
  pool: {
      max: 100,
      min: 0,
      idle: 30000
  }
});

const defineCity = (param) => {
  return sequelize.define(param, {
    uid: {
        type: Sequelize.STRING(50),
        primaryKey: true
    },
    title: Sequelize.STRING(100),
    city: Sequelize.STRING(5),
    type: Sequelize.STRING(10),
    address: Sequelize.STRING(500),
    business: Sequelize.STRING(10),
    lon: Sequelize.DECIMAL(10,6),
    lat: Sequelize.DECIMAL(10,6),
    phone: Sequelize.STRING(20),
    url: Sequelize.STRING(100),
    detailUrl: Sequelize.STRING(100),
  }, {
    timestamps: false,
    freezeTableName: true
  });
}

const getData = async function(param) {
  const start = new Date().getTime();
  console.log(`get ${param} begin······`);
  const city = defineCity(param);
  const data = await sequelize.query(`SELECT TYPE,BUSINESS,COUNT(*) AS TOTAL FROM ${param} GROUP BY TYPE,BUSINESS;`,
    { model: city });
  const end = new Date().getTime();
  console.log(`get ${param} completed,cost ${end-start}ms······`);
  return data;
};

app.use(router.routes()).use(router.allowedMethods());

app.listen(8888);
console.log('app started at port 8888...');
