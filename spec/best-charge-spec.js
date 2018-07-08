const { bestCharge, matchFoodInfo, calculateFoodNumber, countFoodSubPrice, buildFoodList } = require('../src/best-charge')
describe('Take out food', function () {

  it('should generate best charge when best is 指定菜品半价', function () {
    let inputs = ["ITEM0001 x 1", "ITEM0013 x 2", "ITEM0022 x 1"];
    let summary = bestCharge(inputs).trim();
    let expected = `
============= 订餐明细 =============
黄焖鸡 x 1 = 18元
肉夹馍 x 2 = 12元
凉皮 x 1 = 8元
-----------------------------------
使用优惠:
指定菜品半价(黄焖鸡，凉皮)，省13元
-----------------------------------
总计：25元
===================================`.trim()
    expect(summary).toEqual(expected)
  });

  it('test the matchFoodInfo function', function () {
    let inputs = 'ITEM0001';
    let summary = JSON.stringify(matchFoodInfo(inputs));
    let expected = JSON.stringify({
      "id": "ITEM0001",
      "name": "黄焖鸡",
      "price": 18.00
    })
    expect(summary).toEqual(expected)
  });
  it('test the calculateFoodNumber function', function () {
    let inputs1 = 'ITEM0013';
    let inputs2 = ["ITEM0001 x 1", "ITEM0013 x 2", "ITEM0022 x 1"];
    let summary = calculateFoodNumber(inputs1,inputs2);
    let expected = 2
    expect(summary).toEqual(expected)
  });
  it('test the countFoodSubPrice function', function () {
    let inputs1 = {
      "id": "ITEM0001",
      "name": "黄焖鸡",
      "price": 18.00
    };
    let inputs2 = 3;
    let summary = countFoodSubPrice(inputs1,inputs2);
    let expected = 54
    expect(summary).toEqual(expected)
  });
  it('test the buildFoodList function', function () {
    let  inputs = ["ITEM0001 x 1", "ITEM0013 x 2", "ITEM0022 x 1"];
    let summary = JSON.stringify(buildFoodList(inputs));
    let expected =  JSON.stringify([{
      foodItemInfo: {
        "id": "ITEM0001",
        "name": "黄焖鸡",
        "price": 18.00
      },
      "foodNum": 1,
      "subPrice": 18
    },
    {
      foodItemInfo: {
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
        'price': 8.00
      },
      "foodNum": 1,
      "subPrice": 8
    }
  ])
    expect(summary).toEqual(expected)
  });
 
  //   it('should generate best charge when best is 满30减6元', function() {
  //     let inputs = ["ITEM0013 x 4", "ITEM0022 x 1"];
  //     let summary = bestCharge(inputs).trim();
  //     let expected = `
  // ============= 订餐明细 =============
  // 肉夹馍 x 4 = 24元
  // 凉皮 x 1 = 8元
  // -----------------------------------
  // 使用优惠:
  // 满30减6元，省6元
  // -----------------------------------
  // 总计：26元
  // ===================================`.trim()
  //     expect(summary).toEqual(expected)
  //   });

  //   it('should generate best charge when no promotion can be used', function() {
  //     let inputs = ["ITEM0013 x 4"];
  //     let summary = bestCharge(inputs).trim();
  //     let expected = `
  // ============= 订餐明细 =============
  // 肉夹馍 x 4 = 24元
  // -----------------------------------
  // 总计：24元
  // ===================================`.trim()
  //     expect(summary).toEqual(expected)
  //   });

});