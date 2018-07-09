const {loadAllItems} = require('./items')
const {loadPromotions} = require('./promotions')
//单个食物信息匹配
matchFoodInfo=(foodId)=>{
  let allfoodItems =  loadAllItems()
  return allfoodItems.find(item=>item.id === foodId)
}

//单个食物数量计算
calculateFoodNumber=(foodId,orderList)=>{
  return parseInt(orderList.find(item=>item.split('x')[0].trim() === foodId).split('x')[1].trim())
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
  let allPromotionList = loadPromotions()
  let key = allPromotionList.find(promotionItem=>promotionItem.type === '指定菜品半价' && promotionItem.items && promotionItem.items.includes(foodId))
  let isHalf = key ? true :false
  return isHalf
}

//半价优惠商品总价
countHalfpricePromotionTotalMoney = (halfFoodList)=>{
  return halfFoodList.reduce((result,item)=>result + item.subPrice/2,0)
}
//生成半价商品数组
buildHalfPriceList=(foodList)=>{
  return foodList.filter(foodItem=>isHalfpricePromotion(foodItem.foodItemInfo.id))
}
//计算食物列表原来的总价
countOriginalPrice=(foodList)=>{
  return foodList.reduce((result,item)=>result + item.subPrice,0)
}

//生成优惠信息
buildPromotionInfo=(orderList)=>{
  let promotionInfo = {
    type: '',
    halfFoodList: [],
    saveMoney: 0
  }
  let foodList = buildFoodList(orderList)
  promotionInfo.halfFoodList = buildHalfPriceList(foodList)
  let HalfpricePromotionTotalMoney = countHalfpricePromotionTotalMoney(promotionInfo.halfFoodList)
  let OriginalPrice = countOriginalPrice(foodList)
  if(HalfpricePromotionTotalMoney > 6 || (HalfpricePromotionTotalMoney>0 && OriginalPrice < 30)) {
    promotionInfo.type = '指定菜品半价'
    promotionInfo.saveMoney = HalfpricePromotionTotalMoney
  } 
  if( OriginalPrice > 29 && HalfpricePromotionTotalMoney < 6) {
    promotionInfo.type = '满30减6元'
    promotionInfo.saveMoney = 6
  }
  return promotionInfo
}

//生成输出优惠的字符串
outputPromotionString=(promotionInfo)=>{
  let totalString = ''
  let promotionString = ''
  if(promotionInfo.type==='指定菜品半价') {
    let foodNameString = promotionInfo.halfFoodList.map(item=>item.foodItemInfo.name).join('，')
    promotionString = `${promotionInfo.type}(${foodNameString})，省${promotionInfo.saveMoney}元`
    totalString = `\n使用优惠:
${promotionString}
-----------------------------------`
  } else if (promotionInfo.type==='满30减6元'){
    promotionString = `满30减6元，省6元`
    totalString = `\n使用优惠:
${promotionString}
-----------------------------------`
  }
  return totalString
}

//生成订单字符串
buildOrderDetailString=(foodList,promotionString,TotalMoney)=>{
  let foodListString = foodList.reduce((result,item)=>result + `\n${item.foodItemInfo.name} x ${item.foodNum} = ${item.subPrice}元`,'') 
  let orderInfo = `
============= 订餐明细 =============${foodListString}
-----------------------------------${promotionString}
总计：${TotalMoney}元
===================================`
  return orderInfo;
}

//输出订单信息
bestCharge=(orderList)=> {
  
  let foodList = buildFoodList(orderList)
  let PromotionInfo = buildPromotionInfo(orderList)
  let promotionString = outputPromotionString(PromotionInfo)
  let TotalMoney = countOriginalPrice(foodList) - PromotionInfo.saveMoney
  return buildOrderDetailString(foodList,promotionString,TotalMoney)
}
module.exports = {
  bestCharge,matchFoodInfo,calculateFoodNumber,countFoodSubPrice,buildFoodList,buildPromotionInfo,isHalfpricePromotion
}