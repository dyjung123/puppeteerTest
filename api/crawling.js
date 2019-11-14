const puppeteer = require("puppeteer");

// function delay( timeout ) {
//   return new Promise(( resolve ) => {
//     setTimeout( resolve, timeout );
//   });
// }

const getStock = async (req, res, next) => {
  const ans = await puppeteer.launch({
    headless : true,	// 헤드리스모드의 사용여부를 묻는다.
    devtools : true	// 개발자 모드의 사용여부를 묻는다.
  }).then(async browser => {
    const page = await browser.newPage();
  
    await page.goto( "http://www.kyobobook.co.kr/product/detailViewKor.laf?ejkGb=KOR&mallGb=KOR&barcode=9788949190020&orderClick=LAG&Kc=", { waitUntil : "networkidle2" } );
    // page.waitForNavigation()	// 해당 페이지의 탐색이 완료되면 클릭 이벤트를 실행
    page.click("#btnStockOpen");	// 클릭이벤트를 실행

    var answer = new Array();

    for (var i = 1; i<4; i++) {
      const loc = await page.waitFor(`#storeStockTable div:nth-of-type(${i}) strong`);
      const txtLoc = await page.evaluate( loc => loc.textContent, loc );
      // console.log("지역", txtLoc);

      var obj = new Object();
      var stockData = new Array();
      
      var trNum = [6,4,6];
      var thNum = [[7,7,1],[7,4,0],[7,7,2]];
      for (var k = 1; k<trNum[i-1]; k+=2) {
        for (var j = 1; j<=thNum[i-1][parseInt(k/2)]; j++) {
          var tmpObj = new Object();
          const storeLoc = await page.waitFor(`#storeStockTable table:nth-of-type(${i}) tbody tr:nth-of-type(${k}) th:nth-of-type(${j})`);
          const txtStoreLoc = await page.evaluate( storeLoc => storeLoc.textContent, storeLoc );
          const stockBook = await page.waitFor(`#storeStockTable table:nth-of-type(${i}) tbody tr:nth-of-type(${k+1}) td:nth-of-type(${j}) a`);
          const txtStockBook = await page.evaluate( stockBook => stockBook.textContent, stockBook );
          tmpObj.store = txtStoreLoc.replace(/(\s*)/g, "");
          tmpObj.stock = txtStockBook;
          stockData.push(tmpObj);
        }
      }
      obj.loc = txtLoc;
      obj.value = stockData;
      answer.push(obj);
    }
    
    // console.log("answer : ",answer);
  
    await browser.close();
    return answer;
  });
  console.log('ans check ', ans);
  res.status(201).json({data: ans});
}

module.exports = {
  getStock
}