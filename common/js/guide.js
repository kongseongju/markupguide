
// 소메뉴 생성자 함수
function Btn(selector){
	this.$wrap = null,
	this.$btn = null,
	this.$cnt = null,
    this.index = 0;
	Btn.prototype.init = function(selector){
		this.$wrap = $(selector);
        this.$btn = this.$wrap.find(".lnb .btn > li");
        this.$cnt = this.$wrap.find(".content > article");
	}
	Btn.prototype.initEvent = function(){
		var that = this;
		this.$btn.on("click", function(){
			index = $(this).index();
			that.btnMove(that.$btn);
			that.btnMove(that.$cnt);
			return false;
		});
	}
	Btn.prototype.btnMove = function($select){
		$select.eq(index).addClass("on").siblings().removeClass("on");
    }
    this.init(selector);
	this.initEvent();
}