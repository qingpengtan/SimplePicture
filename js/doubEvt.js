document.addEventListener("touchstart",
	function(e) {
		e.preventDefault();
	}
)
window.onload = function() {
	var box = document.querySelector("#box");
	var startS = 0;
	var startR = 0;
	var callBack = {
		start: function(e) {
			this.style.background = "blue";
			startS = cssTransform(this, "scale");
			startR = cssTransform(this, "rotate");
		},
		change: function(e) {
			var disS = e.scale;
			var disR = e.rotation;
			cssTransform(this, "scale", startS * disS);
			cssTransform(this, "rotate", startR + disR);
		},
		end: function(e) {
			this.style.background = "red";
		}
	}
	cssTransform(box, "translateZ", 0);
	gesture(box, callBack);
};
/*
	勾股定理:
		斜边的平方 = 直角边1的平方 + 直角边2的平方; 

	正切：
		在直角三角形中 对边和临边比值

		Math.atan2();	
*/
function getDistance(p1, p2) {
	var x = p1.pageX - p2.pageX;
	var y = p1.pageY - p2.pageY;
	return Math.sqrt(x * x + y * y);
}

function getAngle(p1, p2) {
	var x = p1.pageX - p2.pageX;
	var y = p1.pageY - p2.pageY;
	return Math.atan2(y, x) * 180 / Math.PI;
}

function gesture(el, callBack) {
	var isGesture = false;
	var start = {};
	el.addEventListener(
		"touchstart",
		function(e) {
			if(e.touches.length >= 2) {
				isGesture = true;
				start.dis = getDistance(e.touches[0], e.touches[1]);
				start.deg = getAngle(e.touches[0], e.touches[1]);
				if(callBack && callBack.start) {
					callBack.start.call(el, e);
				}
			}
		}
	);
	el.addEventListener(
		"touchmove",
		function(e) {
			if(e.touches.length >= 2 && isGesture) {
				var dis = getDistance(e.touches[0], e.touches[1]);
				var deg = getAngle(e.touches[0], e.touches[1]);
				e.scale = dis / start.dis;
				e.rotation = deg - start.deg;
				if(callBack && callBack.change) {
					callBack.change.call(el, e);
				}
			}
		}
	);
	el.addEventListener(
		"touchend",
		function(e) {
			if(isGesture) {
				if(callBack && callBack.end) {
					callBack.end.call(el, e);
				}
			}
			isGesture = false;
		}
	);
}