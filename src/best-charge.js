const {loadAllItems} = require('./items')
const {loadPromotions} = require('./promotions')
let promotionInfo = {
  "type": "指定菜品半价",
  "halfPriceList": [
    {
      "foodItemInfo": {
        "id": "ITEM0013",
        "name": "肉夹馍",
        "price": 6.00
      },
      "foodNum": 2,
      "subPrice": 12
    },
    {
      "foodItemInfo": {
        "id": "ITEM0022",
        "name": "凉皮",
        "price": 8.00
      },
      "foodNum": 1,
      "subPrice": 8
    }
  ],
  "saveMoney": 13
}
let orderPrice = 25

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

//单个商品是否属于半价优惠类型
isHalfpricePromotion=(foodId)=>{
  let isHalf = false
  let allPromotionList = loadPromotions()
  allPromotionList.map(promotionItem=>{
    if(promotionItem.type === '指定菜品半价' && promotionItem.items && promotionItem.items.includes(foodId)){
      isHalf = true
      return
    }
  })
  return isHalf
}

//单个商品是否属于半价优惠类型
countHalfpricePromotionTotalMoney = (halfFoodList)=>{
  let HalfpricePromotionTotalMoney = 0
  halfFoodList.map(item=>{
    HalfpricePromotionTotalMoney += item.subPrice/2
  })
  return HalfpricePromotionTotalMoney
}
//生成半价商品数组
buildHalfPriceList=(foodList)=>{
  let halfFoodList = []
  foodList.map(foodItem=>{
    if(isHalfpricePromotion(foodItem.foodItemInfo.id)){
      halfFoodList.push(foodItem)
    }
  })
  return halfFoodList
}
//计算食物列表原来的总价
countOriginalPrice=(foodList)=>{
  let originalPrice = 0
  foodList.map(item=>{
    originalPrice +=item.subPrice
  })
  return originalPrice
}

//生成优惠信息
buildPromotionInfo=(orderList)=>{
  let promotionInfo = {
    type: '',
    halfFoodList: [],
    saveMoney: 0
  }
  let foodList = buildFoodList(orderList)
  console.log("-----------------------------")
  console.log(foodList)
  promotionInfo.halfFoodList = buildHalfPriceList(foodList)
  console.log(promotionInfo.halfFoodList)
  let HalfpricePromotionTotalMoney = countHalfpricePromotionTotalMoney(promotionInfo.halfFoodList)
  let OriginalPrice = countOriginalPrice(foodList)
  if(HalfpricePromotionTotalMoney > 6 || (HalfpricePromotionTotalMoney<6 && OriginalPrice < 30)) {
    promotionInfo.type = '指定菜品半价'
    promotionInfo.saveMoney = HalfpricePromotionTotalMoney
  } 
  if( OriginalPrice > 29 && HalfpricePromotionTotalMoney < 6) {
    promotionInfo.type = '满30减6元'
    promotionInfo.saveMoney = 6
  }
  return promotionInfo
}

//计算总计
countTotalMoney=()=>{
  
}

//生成输出优惠的字符串
outputPromotionString=(promotionInfo)=>{
  let promotionString = ''
  if(promotionInfo.type==='指定菜品半价') {
    let foodNameString = promotionInfo.halfFoodList.map(item=>item.foodItemInfo.name).join('，')
    promotionString = `${promotionInfo.type}(${foodNameString})，省${promotionInfo.saveMoney}元`
  } else if (promotionInfo.type==='满30减6元'){
    promotionString = `满30减6元，省6元`
  }
  let totalString = `使用优惠:
${promotionString}
-----------------------------------`
  return totalString
}
//输出订单信息
bestCharge=(orderList)=> {
  let foodListString = ''
  let foodList = buildFoodList(orderList)
  let PromotionInfo = buildPromotionInfo(orderList)
  let promotionString = outputPromotionString(PromotionInfo)
  for (let item of foodList) {
    foodListString += `\n${item.foodItemInfo.name} x ${item.foodNum} = ${item.subPrice}元`
  }
  
  
  let orderInfo = `
============= 订餐明细 =============${foodListString}
-----------------------------------
${promotionString}
总计：25元
===================================`
  return orderInfo;
}
module.exports = {
  bestCharge,matchFoodInfo,calculateFoodNumber,countFoodSubPrice,buildFoodList,buildPromotionInfo,isHalfpricePromotion
}