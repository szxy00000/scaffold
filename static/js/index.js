$('#nav').on('click', '.a', function(e) {
	e.preventDefault();
	var href = $(this).attr('href') || 'https://www.baidu.com'
	$('#iframe').attr('src', href);
})
window.onload = function(e) {
	$('#nav img').each(function(index, one) {
        var $this = $(one);
		var img = new Image();
        img.src = $(one).data('src');
        img.onload = function(){
            img.onload = null;
            $this.attr('src', $(one).data('src'));
        }
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
    		$('#cursor').css({'top': -999});
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
var paintRect = false;
var eraser = false;
var paintFunc = {
	removeErase: function() {
		$('#eraser').removeClass('eraser');
		$('#cursor').css({'background': 'rgba(0,0,0,0)'})
		eraser = false;
	},
	addErase: function() {
		$('#eraser').addClass('eraser');
		$('#cursor').css({'background': '#fff'})
		eraser = true;
	},
	removeRect: function() {
		$('#rect').removeClass('rect');
		paintRect = false;
	},
	addRect: function() {
		$('#rect').addClass('rect');
		paintRect = true;
	}
}
$('.color-select').on('click', function(e) {
    paintColor = $(e.target).attr('class');
    paintFunc.removeErase();
    $('.color-select div').each(function () {
        $(this).removeClass('selected');
    })
    $(e.target).addClass('selected');
    $('#rect').css('border-color', paintColor);
})
$('#clear').on('click', function(e) {
	clearArea();
})
$('#rect').on('click', function(e) {
	paintFunc.removeErase();
    if ($(this).hasClass('rect')) {
		paintFunc.removeRect();
	} else {
		paintFunc.addRect();
	}
})
$('#eraser').on('click', function() {
	paintFunc.removeRect();
	if ($(this).hasClass('eraser')) {
		paintFunc.removeErase();
	} else {
		paintFunc.addErase();
	}
})

// canvas
var mousePressed = false;
var lastX, lastY;
var lineWidth = 10;
var ctx;
InitThis();
function InitThis() {
    ctx = document.getElementById('canvas').getContext("2d");
 	ctx.font = "12px Georgia";
 	$('#canvas').mousedown(function (e) {
        mousePressed = true;
        Draw(e.pageX - $(this).offset().left, e.pageY - $(this).offset().top, false);
        startX = e.pageX - $(this).offset().left;
        startY = e.pageY - $(this).offset().top;
    });
 
    $('#canvas').mousemove(function (e) {
    	if (mousePressed) {
            Draw(e.pageX - $(this).offset().left, e.pageY - $(this).offset().top, true);
            if (paintRect) {
            	if (e.pageX > startX) {
            		$('#rectangle').css({
            			'left': startX - lineWidth/2 + 'px', 
            			'top': startY - lineWidth/2 + 'px', 
            			'width': e.pageX - startX - lineWidth + 'px', 
            			'height': e.pageY - startY - lineWidth + 'px',
            			'border': 'solid ' +  lineWidth + 'px ' + paintColor
            		})
            	}
            	else {
            		$('#rectangle').css({
            			'left': e.pageX - lineWidth/2 + 'px', 
            			'top': e.pageY - lineWidth/2 + 'px', 
            			'width': startX - e.pageX - lineWidth + 'px', 
            			'height': startY - e.pageY  - lineWidth + 'px',
            			'border': 'solid ' +  lineWidth + 'px ' + paintColor
            		})
            	}
            }
            if (eraser) {
            	clearCircle(ctx, e.pageX - $(this).offset().left, e.pageY - $(this).offset().top, lineWidth/2);
            }
        }
        $('#cursor').css({
        	'top': e.pageY - lineWidth/2 + 'px', 
        	'left': e.pageX - lineWidth/2 + 'px', 
        	'width': lineWidth - 2 + 'px', 'height': lineWidth - 2 + 'px', 
        	'border-color': paintColor
        })
    });
 
    $('#canvas').mouseup(function (e) {
    	mousePressed = false;
        endX = e.pageX - $(this).offset().left;
        endY = e.pageY - $(this).offset().top;
        drawRect(startX, startY, endX, endY);
        $('#rectangle').css({'left': -999});
    });
    $('#canvas').mouseleave(function (e) {
        mousePressed = false;
    });
    $('#canvas').on('mousewheel MozMousePixelScroll', function(e){
    	var bold = lineWidth + (e.originalEvent.wheelDelta/120 || -e.detail/16);
    	if (bold > 0 && bold < 200) {
    		lineWidth = lineWidth + (e.originalEvent.wheelDelta/120 || -e.detail/16);
    	}
        $('#cursor').css({
        	'top': (e.pageY || e.originalEvent.pageY) - lineWidth/2 + 'px', 
        	'left': (e.pageX || e.originalEvent.pageX) - lineWidth/2 + 'px', 
        	'width': lineWidth - 2 + 'px', 'height': lineWidth - 2 + 'px', 
        	'border-color': paintColor
        })
    })
    // 评论功能
    $('#canvas').dblclick(function(e) {
    	e.preventDefault();
    	$('#comment').css({'left': e.pageX, 'top': e.pageY - 12});
    	$('#comment input').focus();
    	$('#cursor').css({'top': -999});
    })
    $('#comment input').on('keydown blur', function(e){
    	if (e.keyCode === 13 || e.type === 'blur') {
    		var commentOffset = $('#comment').offset();
    		var canvasOffset = $('#canvas').offset();
    		ctx.fillText($(this).val(), commentOffset.left - canvasOffset.left, commentOffset.top - canvasOffset.top + 14);
    		$(this).val('');
    		$('#comment').css({'left': '-999px', 'top': '-999px'});
    	}
    	if (e.keyCode === 27) {
    		$(this).val('');
    		$('#comment').css({'left': '-999px', 'top': '-999px'});
    	}
    })
}
 
function Draw(x, y, isDown) {
	if (paintRect) { return; }
	if (eraser) { return; }
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
function drawRect(startX, startY, endX, endY) {
	if (!paintRect) { return; }
	ctx.strokeStyle = paintColor;
	ctx.lineWidth = lineWidth;
	ctx.strokeRect(startX, startY, endX - startX, endY - startY)
}
function clearArea() {
    // Use the identity matrix while clearing the canvas
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
}  
function clearCircle(oc,x,y,r){
	for(var i=0; i< Math.round(Math.PI * r); i++){
		var angle = (i / Math.round(Math.PI * r)) * 360;
        oc.clearRect(x, y, Math.sin(angle * (Math.PI / 180)) * r , Math.cos(angle * (Math.PI / 180)) * r);
    }
}

