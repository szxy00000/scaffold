$('#nav').on('click', '.a', function(e) {
	e.preventDefault();
	var href = $(this).attr('href') || 'https://www.baidu.com'
	$('#iframe').attr('src', href);
})
window.onload = function(e) {
	$('#nav img').each(function(index, one) {
		one.src = $(one).data('src');
	})
}
var toggleAnimate = {
	navShow: function() {
		$('#nav').animate({'left': '0'}, 200, function(){
			$('#nav').removeClass('nav-hide');
			$('#nav-title').animate({'top': '0'}, 200);
		})
	},
	navHide: function() {
		$('#nav').animate({'left': '-235'}, 200, function(){
			$('#nav').addClass('nav-hide');
		})
		$('#nav-title').animate({'top': '-56'}, 200);
	},
	paintBoxShow: function() {
		$('#paint-box').animate({'right': '0'}, 200, function(){
			$('#paint-box').removeClass('paint-box-hide');
		})
	},
	paintBoxHide: function() {
		$('#paint-box').animate({'right': '-80'}, 200, function(){
			$('#paint-box').addClass('paint-box-hide');
		})
	}
}
$('#arrow').on('click', function() {
	if ($('#nav').hasClass('nav-hide')) {
		toggleAnimate.navShow();
	} else {
		toggleAnimate.navHide();
	}
})
$('#r-arrow').on('click', function() {
	if ($('#paint-box').hasClass('paint-box-hide')) {
		toggleAnimate.paintBoxShow();
	} else {
		toggleAnimate.paintBoxHide();
	}
})

// 画笔开关
mousedown = false;
$('#pencil').on('mousedown', function(e) {
	originLeft = $(this).offset().left;
	originRight = $(this).offset().right;
	offsetY = e.offsetY;
    offsetX = e.offsetX;
	mousedown = true;
	mousedownTime = e.timeStamp;
})
$('#pencil').on('mouseup', function(e) {
	mousedown = false;
	if (e.timeStamp - mousedownTime < 160) {
		$('#canvas').toggle();
		if ($('#canvas')[0].style.display === 'block' || !$('#canvas')[0].style.display) {
			$(this).removeClass('lock');
			toggleAnimate.paintBoxShow();
			toggleAnimate.navHide();
		} else {
			$(this).addClass('lock');
			toggleAnimate.paintBoxHide();
			toggleAnimate.navShow();
		}
	}
	// console.log(e)
})
$('#pencil').on('mouseleave', function(e) {
	mousedown = false;
})
$('#pencil').on('mousemove', function(e) {
	if (mousedown) {
		$(this).css({'top': e.pageY - offsetY + 'px', 'left': e.pageX - offsetX + 'px'});
	}
	// console.log(e)
})

// paint-box
var paintColor = 'red';
$('.color-select').on('click', function(e) {
    paintColor = $(e.target).attr('class');
    $('.color-select div').each(function () {
        $(this).removeClass('selected');
    })
    $(e.target).addClass('selected')
})
$('#clear').on('click', function(e) {
	clearArea();
})

// canvas
var mousePressed = false;
var lastX, lastY;
var lineWidth = 5;
var ctx;
InitThis();
function InitThis() {
    ctx = document.getElementById('canvas').getContext("2d");
 	ctx.font="11px Georgia";
 	$('#canvas').mousedown(function (e) {
        mousePressed = true;
        Draw(e.pageX - $(this).offset().left, e.pageY - $(this).offset().top, false);
    });
 
    $('#canvas').mousemove(function (e) {
    	if (mousePressed) {
            Draw(e.pageX - $(this).offset().left, e.pageY - $(this).offset().top, true);
        }
        $('#cursor').css({'top': e.pageY - lineWidth/2 + 'px', 'left': e.pageX - lineWidth/2 + 'px', 'width': lineWidth - 2 + 'px', 'height': lineWidth - 2 + 'px', 'border-color': paintColor})
    });
 
    $('#canvas').mouseup(function (e) {
        mousePressed = false;
    });
    $('#canvas').mouseleave(function (e) {
        mousePressed = false;
    });
    $('#canvas').on('mousewheel', function(e){
    	var bold = lineWidth + e.originalEvent.wheelDelta/120;
    	if (bold > 0 && bold < 200) {
    		lineWidth = lineWidth + e.originalEvent.wheelDelta/120;
    	}
        $('#cursor').css({'top': e.pageY - lineWidth/2 + 'px', 'left': e.pageX - lineWidth/2 + 'px', 'width': lineWidth - 2 + 'px', 'height': lineWidth - 2 + 'px', 'border-color': paintColor})
    })
    // 评论功能
    $('#canvas').dblclick(function(e) {
    	e.preventDefault();
    	$('#comment').css({'left': e.pageX, 'top': e.pageY - 12});
    	$('#comment input').focus();
    	$('#cursor').css({'top': -999})
    })
    $('#comment input').on('keydown blur', function(e){
    	if (e.keyCode === 13 || e.type === 'blur') {
    		var commentOffset = $('#comment').offset();
    		var canvasOffset = $('#canvas').offset();
    		ctx.fillText($(this).val(), commentOffset.left - canvasOffset.left, commentOffset.top - canvasOffset.top + 12);
    		$(this).val('');
    		$('#comment').css({'left': '-999px', 'top': '-999px'});
    	}
    })
}
 
function Draw(x, y, isDown) {
	if (isDown) {
        ctx.beginPath();
        ctx.strokeStyle = paintColor;
        ctx.lineWidth = lineWidth;
        ctx.lineJoin = "round";
        ctx.moveTo(lastX, lastY);
        ctx.lineTo(x, y);
        ctx.closePath();
        ctx.stroke();
    }
    lastX = x; lastY = y;
}
     
function clearArea() {
    // Use the identity matrix while clearing the canvas
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
}  
