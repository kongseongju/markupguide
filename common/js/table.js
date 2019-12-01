$(document).ready(function(){
	$.setIdAndHeadersToTables();
});
//http://code.jquery.com/jquery-1.11.3.min.js

//class값에 tableJs가 있는 테이블만 값세팅.(param값이 없을 시)
//적용할 table class값 변경 시 param에 class명을 넘김
//코딩 시 th/td 구분 및 scope, colspan, rowspan 값을 정확히 세팅
//코딩 시 th에 id값을 넣으면 그 값으로 세팅됨

$.setIdAndHeadersToTables=function(param){
	var prefixId="tb"// id = prefixId-tbIdx-thIdx
	var tbIdx=0;
	
	var str = 'table.'+param;
	if(!param){
		str = 'table.tableJs';
	}
	
	$(str).each(function (){
		//--- set id --------------------------------------
		var thIdx=0;
		$(this).find("th").each(function (){
			if(!this.id||this.id=="") this.id=prefixId+"-"+tbIdx+"-"+thIdx;			
			thIdx++;
		});
		//-------------------------------------------------

		//--- count row&column ----------------------------
		var rowCnt=$(this).find("tr").length;
		var colCnt=0;
		$(this).find("tr:eq(0)").children().each(function(){
			var colspan=$(this).attr("colspan");
			if(colspan) colCnt+=Number(colspan);
			else colCnt++;
		});
		//-------------------------------------------------

		//--- 초기화 table array ----------------------------
		var tableArr=new Array(rowCnt);
		for(var i=0;i<rowCnt;i++) tableArr[i]=new Array(colCnt);
		//-------------------------------------------------

		//--- set tableElement to array -------------------
		var row=0;
		$(this).find("tr").each(function(){
			var col=0;
			$(this).children().each(function(){
				var rs=$(this).attr("rowspan");
				var cs=$(this).attr("colspan");

				for(var i=col;i<colCnt;i++){
					if(!tableArr[row][i]){
						col=i;
						break;
					}
				}

				if(rs && cs){
					for(var i=0;i<Number(rs);i++) {
						for(var j=0;j<Number(cs);j++) {
							tableArr[row+i][col+j]=this;	
						}
					}
					col+=(Number(cs)-1);
				}
				else if(rs){
					for(var i=0;i<Number(rs);i++) {
						tableArr[row+i][col]=this;
					}
				}else if(cs){
					for(var i=0;i<Number(cs);i++) {
						tableArr[row][col+i]=this;
					}
					col+=(Number(cs)-1);
				}else{
					tableArr[row][col]=this;
				}

				col++;
			});
			row++;	
		});
		//-------------------------------------------------

		//--- set headers ---------------------------------
		var setHeaders=function(id,scp,i,j){
			if(scp&&scp.indexOf("row")==0){
				for(var k=j+1;k<colCnt;k++) {
					if(tableArr[i][k].tagName=="TH" || tableArr[i][k].tagName=="th") {
						var childScp=$(tableArr[i][k]).attr("scope");
						if(childScp&&childScp.indexOf("row")==-1) {
							setHeaders(id+" "+tableArr[i][k].id,childScp,i,k); //재귀
						}
						continue;
					}

					var hdrs=$(tableArr[i][k]).attr("headers");
					var idArr=id.split(" ");
					
					for(var x=0;x<idArr.length;x++){
						if(hdrs && hdrs.split(" ").indexOf(idArr[x])!=-1) continue;	

						if(hdrs==""|| !hdrs) {
							hdrs=idArr[x];
							$(tableArr[i][k]).attr("headers",hdrs);
						}
						else {
							hdrs+=" "+idArr[x];
							$(tableArr[i][k]).attr("headers",hdrs);
						}
					}
				}
			}else if(scp&&scp.indexOf("col")==0){
				for(var k=i+1;k<rowCnt;k++) {
					if(tableArr[k][j].tagName=="TH" || tableArr[k][j].tagName=="th") {
						var childScp=$(tableArr[k][j]).attr("scope");
						if(childScp&&childScp.indexOf("col")==-1) {
							setHeaders(id+" "+tableArr[k][j].id,childScp,k,j); //재귀
						}
						continue;
					}

					var hdrs=$(tableArr[k][j]).attr("headers");
					var idArr=id.split(" ");

					for(var x=0;x<idArr.length;x++){
						if(hdrs && hdrs.split(" ").indexOf(idArr[x])!=-1) continue;	

						if(hdrs==""|| !hdrs) {
							hdrs=idArr[x];
							$(tableArr[k][j]).attr("headers",hdrs);
						}
						else {
							hdrs+=" "+idArr[x];
							$(tableArr[k][j]).attr("headers",hdrs);
						}
					}
				}
			}
		};

		for(var i=0;i<rowCnt;i++){
			for(var j=0;j<colCnt;j++){
				if(tableArr[i][j].tagName=="TH" || tableArr[i][j].tagName=="th") {
					setHeaders(tableArr[i][j].id,$(tableArr[i][j]).attr("scope"),i,j);
				}
			}
		}
		//-------------------------------------------------

		tbIdx++;
	});
	
}