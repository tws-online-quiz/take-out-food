const {loadAllItems} = require('./items')
const {loadPromotions} = require('./promotions')
// let foodList = [
//   {
//     foodItemInfo: {
//       "id": "ITEM0001",
//       "name": "黄焖鸡",
//       "price": 18.00
//     },
//     "foodNum": 1,
//     "subPrice": 18
//   },
//   {
//     foodItemInfo: {
//       "id": "ITEM0013",
//       "name": "肉夹馍",
//       "price": 6.00
//     },
//     "foodNum": 2,
//     "subPrice": 12
//   },
//   {
//     "foodItemInfo": {
//       "id": "ITEM0022",
//       "name": "凉皮",
//       'price': 8.00
//     },
//     "foodNum": 1,
//     "subPrice": 8
//   }
// ]
let promotionInfo = {
  type: '指定菜品半价',
  halfPriceList: [
    {
      foodItemInfo: {
        id: 'ITEM0013',
        name: '肉夹馍',
        price: 6.00
      },
      foodNum: 2,
      subPrice: 12
    },
    {
      foodItemInfo: {
        id: 'ITEM0022',
        name: '凉皮',
        price: 8.00
      },
      foodNum: 1,
      subPrice: 8
    }
  ],
  saveMoney: 13
}
let orderPrice = 25
//计算总计
countTotalMoney=()=>{
  
}
//单个食物信息匹配
matchFoodInfo=(foodId)=>{
  let allfoodItems =  loadAllItems()
  let foodItemInfo = ''
  allfoodItems.map(item=>{
    if(item.id === foodId){
      foodItemInfo = item
      return
    } 
  })
  return foodItemInfo
}
//单个食物数量计算
calculateFoodNumber=(foodId,orderList)=>{
  let num = 0
  orderList.map(item=>{
    if(item.split('x')[0].trim() === foodId){
      num = parseInt(item.split('x')[1].trim())
      return
    } 
  })
  return num
}
//计算单个食物小计
countFoodSubPrice=(foodItemInfo,num)=>{
  return parseInt(num *foodItemInfo.price)
}
//生成食物清单列表
buildFoodList=(orderList)=>{
  return orderList.map(item=>{
    let foodListItem = {}
    foodListItem.foodItemInfo = matchFoodInfo(item.split('x')[0].trim())
    foodListItem.foodNum = calculateFoodNumber(item.split('x')[0].trim(),orderList)
    foodListItem.subPrice = countFoodSubPrice(foodListItem.foodItemInfo,foodListItem.foodNum)
    return foodListItem
  })
}
//输出订单信息
bestCharge=(orderList)=> {
  let foodListString = ''
  let foodList = buildFoodList(orderList)
  for (let item of foodList) {
    foodListString += `\n${item.foodItemInfo.name} x ${item.foodNum} = ${item.subPrice}元`
  }
  let orderInfo = `
============= 订餐明细 =============${foodListString}
-----------------------------------
使用优惠:
指定菜品半价(黄焖鸡，凉皮)，省13元
-----------------------------------
总计：25元
===================================`
  console.log(orderInfo)
  return orderInfo;
}
module.exports = {
  bestCharge,matchFoodInfo,calculateFoodNumber,countFoodSubPrice,buildFoodList
}