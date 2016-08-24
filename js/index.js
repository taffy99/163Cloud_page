 /*
 	以名/值的形式存储cookie;
 	设置cookie的有效期为1小时;
 	使用escape()函数进行编码;
  */
 function setCookie(name,value){
    var exp = new Date(); 
    exp.setTime(exp.getTime() + 1*60*60*1000);//有效期1小时
    document.cookie = name + "="+ escape (value) + ";expires=" + exp.toGMTString();
} 
/*获取cookie值;
  使用unescape()函数进行解码;
*/
function getCookie(name){
    var arr = document.cookie.match(new RegExp("(^| )"+name+"=([^;]*)(;|$)"));
    if(arr != null) return unescape(arr[2]); return null;
}
/*
	页面加载完成
 */
window.onload=function(){
	//获取关闭通知的按钮
	var close_btn=document.getElementById("notice-close");

	//获取通知条
	var notice=document.getElementById("notice"); 

	//点击关闭按钮时，将隐藏通知条，并把关闭状态写入到cookie中
	close_btn.onclick=function(){ 
	/*JS中没有hide()/show函数，
	 隐藏：document.getElementById(id).style.display = 'none'; 
	 显示：document.getElementById(id).style.display = 'block'; 
	 */
		notice.style.display='none';
	//设置cookie值
		setCookie("closeNotice","0");
		
	}
	//获取cookie值，如果关闭状态为"0",则在cookie的有效期内，隐藏通知条;否则显示通知条
	if(getCookie("closeNotice")==0){
			notice.style.display='none';
		}else{
			notice.style.display='block';
		}

	//轮播图
	//1、获取页面需要操作的元素；
	var banner=document.getElementById("banner");//获取轮播图父容器；
	var list=document.getElementById("banner_list");//获取图片列表；
	var buttons=document.getElementById("slideBtn").getElementsByTagName("span");//获取图片切换圆点按钮；
	var pre=document.getElementById("prev");//获取向左切换箭头
	var next=document.getElementById("next");//获取向右切换箭头；
	var index=1;//用于存放当前要显示的第1张图片
	var animated=false;//优化动画效果，解决当前动画执行未完成，多次点击切换按钮时出现的卡图现象，初始值为false
	var timer;//设置自动播放的定时器
	//封装圆点按钮样式切换函数
	
	function showBtn(){
		//遍历圆点按钮数组，将按钮初始化未选中状态
		for(var i=0;i<buttons.length;i++){
			var button=buttons[i];

			if(button.className == 'active'){
				button.className='';
				break;
			}
		}
		buttons[index-1].className='active';
	}

	//将偏移的动作封装到函数animate()中
	function animate(offset){ 
		animated=true;//调用animate()切换时设置为true;
		var newleft=parseInt(list.style.left)+offset;
		var time=500;//位移总时间
		var interval=10;//位移间隔时间
		var speed=offset/(time/interval);//每次位移量 

		function go(){
			//判断偏移量是否达到了目标值，如果没有，在原来的基础上继续移动
			if((speed<0 && parseInt(list.style.left)>newleft)||(speed>0 && parseInt(list.style.left)<newleft)){
				list.style.left=parseInt(list.style.left) + speed +'px';
				//setTimeout只会被执行一次
				setTimeout(go,interval);//设置定时器，每隔interval的时间调用一下go()函数
			}
			//如果达到了目标值，就将newleft值设置为目标值，
			else{
				animated=false;//切换结束，动画执行完毕，设置为false;

				//获取当前图片的left值：用list.style.left获取left的字符串，需要parseInt()函数将字符串转换为数值
				list.style.left = newleft+'px';

				if( newleft > -1610 ){
					list.style.left='-4830px';
				}
				if( newleft < -4830){
					list.style.left='-1610px';
				}
			}
		} 

		go();//递归，在函数内部调用自身
		

	}
	//2、实现左右箭头的切换：给按钮绑定点击事件；
	// 问题：在左右切换过程中会在图片切换完后显示空白；
	// 解决方法：使用无限滚动的方式，即实现循环无缝切换：
	// 1)在页面图片列表的开始加上最后一张图片的附属图，在最后加上第一张图片的附属图
	// 2)每次切换时判断切换后的位置是否大于-1610px或是小于-4830px：
	// 	  如果大于-1610px,就把图片定位到真正的最后一张图的位置：-4830px;
	// 	  如果小于-4830px,就把图片定位到真正的第一张图的位置：-1610px;
	
	pre.onclick=function(){
		//切换到当前图片左边的图片，如果当前是第一张，会切换到最后一张
		if(index==1){
			index=3;
		}
		//否则会切换到前一张，即index-1
		else{
			index-=1;	
		}
		//每次点击时，判断animated为false时执行动画
		if(!animated){
			animate(1610);	
		}
		
		//底部圆点按钮样式切换到选中状态，其他圆点为未选中状态
		showBtn();
	}
	next.onclick=function(){
		//切换到当前图片右边的图片，如果当前是最后一张，会切换到第一张
		if(index==3){
			index=1;
		}
		//否则会切换到下一张，即index+1
		else{
			index+=1;	
		}
		//每次点击时，判断animated为false时执行动画
		if(!animated){
			animate(-1610);	
		}
		//底部圆点按钮样式切换到选中状态，其他圆点为未选中状态
		showBtn();
	}

	//3、实现圆点按钮点击切换
	for(var i=0;i<buttons.length;i++){
		var button=buttons[i];
		button.onclick=function(){
			//程序优化：如果点击当前显示的按钮，则不执行任何操作
			if(this.className=='active'){
				return;//当程序执行到这里时会退出当前函数，不会再执行后面的语句
			}
			//问题：如何定位切换到对应的图片上？
			//解决方法：在每次点击时算出当前按钮的偏移量，在按钮上加入index属性
			var myIndex=parseInt(this.getAttribute('index'));//获取自定义的属性的值并转换为数字
            var offset=-1610 * (myIndex-index);//算出偏移量
            if(!animated){
            	animate(offset);//调用animate实现切换
            } 
            index=myIndex;//更新当前的index值
            showBtn();//调用showBtn实现按钮的样式切换 
		}
	}
	 
	//4、实现图片自动切换：实现每5s切换图片，图片循环播放；鼠标悬停某张图片，则暂停切换；
	//切换效果使用入场图片500ms淡入的方式
	function play(){
		//设置定时器，每个5s点击右键头
		timer=setInterval(function(){ 

			next.onclick();

		},5000);
	}
	function stop(){
		//鼠标悬停图片图片时，暂停自动播放
		clearInterval(timer);
	}

	banner.onmouseover=stop;
	banner.onmouseout=play;

	play();//初始化为自动播放
}

