/*
AUTHOR: misya
*/

var misya = misya || {};
misya.tools = {};
//加载js
misya.tools.loadJsFile = function(src) {
    var head_script = document.createElement("script");
    head_script.setAttribute("type", "text/javascript");
    head_script.setAttribute("src", src);
    head_script.setAttribute("defer", "defer");//延迟加载,非立即执行的js代码
    document.getElementsByTagName("head")[0].appendChild(head_script)
};
//加载css
misya.tools.loadCssFile = function(href) {
    var head_link = document.createElement("link");
    head_link.setAttribute("rel", "stylesheet");
    head_link.setAttribute("type", "text/css");
    head_link.setAttribute("href", href);
    document.getElementsByTagName("head")[0].appendChild(head_link)
};
//浮动状态
misya.tools.fixable = function(elem, options) {
    var elem_obj = $(elem);
    if (elem_obj) {
        if ($.browser.msie && $.browser.version < 7) {//针对IE6 position:fixed bug
            elem_obj.css("position", "absolute");
            var offset_height = (options.top || $(window).height());
			      elem_obj[0].style.setExpression("top", "eval((document.documentElement||document.body).scrollTop+" + offset_height + ") + 'px'")
        } else {
			      elem_obj.css("position", "fixed");
        }
        elem_obj.css(options)
    }
};

misya.timer = {};//计时器
misya.sidecatalog = {};
misya.sidecatalog.step = 20;//步长(行高)
misya.sidecontentList = [];
misya.sidecatalog.vHeight = 80;//side-title-panel默认高度
misya.sidecatalog.togglestatus = false;//sidecatalog显隐状态
//检查sidecatalog是否显示
misya.sidecatalog.checkToShow = function() {
    var scrollTop = $(window).scrollTop();
    var clientHeight = $(window).height();
    var min_height = Math.min(clientHeight * 2, 200);
    if (scrollTop < min_height) {
        return false;
    } else {
        return true;
    }
};
//内容scroll
misya.sidecatalog.contentScroll = function(step_length) {
    var side_title_list = $("#side-title-list");
    var steps = step_length * misya.sidecatalog.step;
    var vHeight = misya.sidecatalog.vHeight;
    var totalHeight = misya.sidecatalog.getTotalHeight() - 40;
    if (vHeight <= 0) {
        return;
    }

    var top = parseInt(side_title_list.position().top) || 0;
    var height = top + steps;
    var status = "normal";
    if (height >= 0) {
        height = 0;
        status = "top"
    }
    if (height + totalHeight <= vHeight) {
        height = Math.min( - totalHeight + vHeight, 0);
        status = (status == "top") ? "both": "bottom"
    }
    misya.sidecatalog.statuschange(status);
    height = height - height % misya.sidecatalog.step;
	  //无间隔滚动
    side_title_list.animate({ 
		  top: height + "px"
  	},
  	300, "linear");
};
//初始化
misya.sidecatalog.init = function() {
    //if ($(".toc").size() == 0) {
        //$("#sidebar").css("visibility", "hidden");
    //} else {
        misya.sidecatalog.contentbuild();
		
        $("#side-catalog-up").mousedown(
        function() {
            clearInterval(misya.timer.ele_side_catalog_scroll);
            misya.timer.ele_side_catalog_scroll = setInterval(function() {
                misya.sidecatalog.contentScroll(3)
            },
            300)
        });
        $("#side-catalog-up").mouseup(
            function() {
                clearInterval(misya.timer.ele_side_catalog_scroll)
            });
        $("#side-catalog-up").click(
            function() {
                clearInterval(misya.timer.ele_side_catalog_scroll);
                misya.sidecatalog.contentScroll(3)
            });
        $("#side-catalog-down").mousedown(
            function() {
                clearInterval(misya.timer.ele_side_catalog_scroll);
                misya.timer.ele_side_catalog_scroll = setInterval(function() {
                    misya.sidecatalog.contentScroll( - 3)
                },
                300)
            });
        $("#side-catalog-down").click(
            function() {
                clearInterval(misya.timer.ele_side_catalog_scroll);
                misya.sidecatalog.contentScroll( - 3)
            });
        $("#side-catalog-down").mouseup(
            function() {
                clearInterval(misya.timer.ele_side_catalog_scroll)
            });
        $("#side-catalog-up").mouseover(
            function() {
                if (this.className != "disabled") {
                  $(this).addClass("hover")
                }
            });
        $("#side-catalog-up").mouseout(
            function() {
              $(this).removeClass("hover")
            });
        $("#side-catalog-down").mouseout(
            function() {
              $(this).removeClass("hover")
            });
        $("#side-catalog-down").mouseover(
            function() {
              if (this.className != "disabled") {
                $(this).addClass("hover")
              }
          });
    //}
};
//sidecatalog 向上向下箭头状态
misya.sidecatalog.statuschange = function(status) {
    switch (status) {
      case "top":
        $("#side-catalog-up").addClass("disable");
        $("#side-catalog-down").removeClass("disable");
        break;
      case "bottom":
        $("#side-catalog-down").addClass("disable");
        $("#side-catalog-up").removeClass("disable");
        break;
      case "normal":
        $("#side-catalog-up").removeClass("disable");
        $("#side-catalog-down").removeClass("disable");
        break;
      case "both":
        $("#side-catalog-down").addClass("disable");
        $("#side-catalog-up").addClass("disable");
        break;
    }
};
//sidecatalog 内容构建
misya.sidecatalog.contentbuild = function() {
    var content = $("#content");
    var h2 = $("h2", content);
    var h3 = $("h3", content);
    var h4 = $("h4", content);
    $.each([h2.toArray(), h3.toArray(), h4.toArray()], 
    function(i, v) {
        $.each(v, 
        function(ii,vv) {
            $(vv).addClass("bk-sidecatalog-title")
        })
    });
    
    var contentList = [];
    var sidecatalog_title = $(".bk-sidecatalog-title", content);

    function set_tag(elem, tag_h_num) {
        return {
            ele: elem,
            title: $(elem).text(),
            level: tag_h_num
        }
    }
    $.each(sidecatalog_title, 
    function(i, elem) {
        var tag_h_num = elem.tagName.substr(1);
        var temp_content = set_tag(elem, tag_h_num);
        contentList.push(temp_content)
    });

    misya.sidecontentList = contentList;
    misya.sidecatalogDomInit();
};

//初始化sidecatelog DOM
misya.sidecatalogDomInit  = function() {
    var side_title_panel  = document.createElement("div");
    var side_title_list   = document.createElement("div");
    var side_catalog_up   = document.createElement("div");
    var side_catalog_down = document.createElement("div");
    side_title_list.id    = "side-title-list";
    side_title_panel.id   = "side-title-panel";
    side_catalog_up.id    = "side-catalog-up";
    side_catalog_down.id  = "side-catalog-down";
	
    $.each(misya.sidecontentList, 
    function(i, obj) {
        var h_tag = document.createElement("h" + obj.level);
        var code_title = (obj.title).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");//编码
        var h_tag_link = ["<a href='#' data-index = '" + i + "'", "title='", code_title, "'>", obj.title, "</a>"];
        h_tag.innerHTML = h_tag_link.join("");
        side_title_list.appendChild(h_tag);
        obj.item = h_tag;
        h_tag = null
    });

    side_title_panel.appendChild(side_title_list);
    var side_catalog_content = $("#side-catalog-content");
    side_catalog_up.innerHTML = "<div></div>";
    side_catalog_down.innerHTML = "<div></div>";
    side_catalog_content.append(side_catalog_up);
    side_catalog_content.append(side_title_panel);
    side_catalog_content.append(side_catalog_down);
    var a_links = $("a", side_title_list);
    for (var i = 0, link_length = a_links.length; i < link_length; i++) {
        $(a_links[i]).click(
        function(e) {
            misya.sidecatalog.scrollto($(this).attr("data-index"));
            if(e.preventDefault){
              e.preventDefault();
            }else{
              e.returnValue = false;
            }
        })
    }
    a_links = null;
    side_title_list = side_title_panel = side_catalog_up = side_catalog_down = side_catalog_content = null
};
//Animate 自定义滚动条滚动效果
misya.sidecatalog.scrollto = function(index) {
	  if (misya.sidecontentList[index]) {
      var target = $(misya.sidecontentList[index].ele);
      if (!target) return;
      var targetOffset = $(target).offset().top;
      $body = ($.browser.opera) ? (document.compatMode == "CSS1Compat" ? $('html') : $('body')) : $('html,body');
      $body.animate({scrollTop: targetOffset+'px'}, 400);
    }
};
//展开,隐藏sidecatalog
misya.sidecatalog.toggle = function() {
    var toggle_status = false;
    return function() {
        $("#side-catalog-content").css('display', toggle_status ? "none": "block");
		if(!toggle_status){
			$(".sidebar").addClass('show');	
		}else{
			$(".sidebar").removeClass('show');	
		}
		
        toggle_status = !toggle_status;
        misya.sidecatalog.togglestatus = toggle_status;
        var scroll_event = misya.sidecatalog.tofocus;
        if ($.browser.msie && $.browser.version < 7) {//IE6时延迟聚焦
            scroll_event = misya.sidecatalog.delayfocus;

        }
        if (toggle_status) {
            misya.sidecatalog.tofocus();
            $(window).bind("scroll", scroll_event);
        } else {
            try {
                $(window).unbind("scroll", scroll_event);
            } catch(e) {}
        }
    }
};
//延迟聚焦
misya.sidecatalog.delayfocus = function() {
    clearTimeout(misya.timer.scroll_catalogfocus);
    misya.timer.scroll_catalogfocus = setTimeout(misya.sidecatalog.tofocus, 200)
};
//聚焦
misya.sidecatalog.tofocus = function() {
    if (misya.sidecatalog.togglestatus) {
        var scrollTop = $(window).scrollTop() + 40;
        var side_title_list = $("#side-title-list");
        if (side_title_list) {
            var vHeight = misya.sidecatalog.vHeight;
            var totalHeight = misya.sidecatalog.getTotalHeight() - 40;
            if (vHeight <= 0 || totalHeight == 0) {
                return;
            }
            for (var i = 0, sidecontentList_length = misya.sidecontentList.length; i < sidecontentList_length; i++) {
                var current = misya.sidecontentList[i];
                if ($(current.ele).position().top <= scrollTop && ((i + 1 == sidecontentList_length) || ((i + 1 < sidecontentList_length) && $(misya.sidecontentList[i + 1].ele).position().top > scrollTop))) {
                    var height = i * misya.sidecatalog.step;//sidecatalog 当前行的高度
                    var half_vHeight = vHeight / 2;
                    half_vHeight = half_vHeight - half_vHeight % 20;
                    var temp_height = Math.min(vHeight - height - half_vHeight, 0);
                    var status = "normal";
					
                    if (temp_height + totalHeight <= vHeight) {
                        temp_height = -totalHeight + vHeight;
                        status = "bottom"
                    }

                    if (temp_height == 0) {
                        status = (status == "bottom") ? "both": "top"
                    }

                    misya.sidecatalog.statuschange(status);
                    side_title_list.css("top", temp_height);
                    $(current.item).addClass("on")
                } else {
                    $(current.item).removeClass("on")
                }
            }
        }
    }
};

//获取catalog总高度
misya.sidecatalog.getTotalHeight = function() {
    return (misya.sidecontentList.length * misya.sidecatalog.step + 40)
};
//resize事件
misya.sidecatalog.resize = function(e) {
    var sidecatalog = $("#sidecatalog");
    var side_catalog_content = $("#side-catalog-content");
    var totalHeight = misya.sidecatalog.getTotalHeight();
    var min_height = Math.min($(window).height() - 200, 500);
    min_height = min_height - min_height % 20;
    if (totalHeight > min_height) {
        totalHeight = min_height
    }
    if (totalHeight < 100) {
        totalHeight = 100
    }

    misya.sidecatalog.vHeight = totalHeight - 40;

    misya.tools.fixable(sidecatalog, {
        top: ($(window).height() - 160),
        right: 0
    });
    misya.tools.fixable(side_catalog_content, {
        overflow: "hidden",
        height: totalHeight,
        top: ($(window).height() - totalHeight - 70),
        right: 27
    });
    var side_title_panel = $("#side-title-panel");
    if (side_title_panel) {
        side_title_panel.css("height", totalHeight - 40)
    }
    misya.sidecatalog.tofocus()
};
//scroll事件
misya.sidecatalog.scroll = function(e) {
    var sidecatalog = $("#sidecatalog");
    if (!misya.sidecatalog.checkToShow()) {
        sidecatalog.hide()
        $(".sidebar").removeClass('show');
        $("#side-catalog-content").hide();
    } else {
      sidecatalog.show()
      if (misya.sidecatalog.togglestatus) {
        $(".sidebar").addClass('show');
        $("#side-catalog-content").show();
      }
    }
};

$(function(){
	//container 高度补全
	if($('body').innerHeight() < $(window).height()){
		$('#container').css('height', $(window).height() - 80);
		$(window).resize(function(){$('#container').css('height', $(window).height() - 80)});
	}else{
		//当高度大于一屏时,加载 Category
		misya.sidecatalog.init();
    if(misya.sidecontentList.length < 2) return false;
		//$("#sidecatalog").show();
		misya.sidecatalog.resize();
		misya.sidecatalog.scroll();
		$(window).scroll(function(){misya.sidecatalog.scroll()})
		$('.sidebar').click(misya.sidecatalog.toggle());
		$(window).resize(function(){misya.sidecatalog.resize()});
	}
	
	//IE6 HACK
	if($.browser.msie && $.browser.version < 7){
		//PNG图片透明
		misya.tools.loadJsFile("scripts/unitpngfix.js");
		//缓存图片
		document.execCommand("BackgroundImageCache", false, true);
		//链接虚框
		$('a[href]').each(function() {
      if (this.href.indexOf(window.location.host) == -1) $(this).attr({target: '_blank', title: this.href });
			this.hideFocus = true;
    });
	}else{
		//链接新窗口打开
		$('a[href]').each(function() {
			if (this.href.indexOf(window.location.host) == -1) $(this).attr({target: '_blank', title: this.href });
		});
	}
	
	//代码高亮
   ~function() {
        misya.tools.loadCssFile(root_path + 'syntax/styles/shCoreDefault.css');
        $.getScript(root_path + 'syntax/scripts/shCore.js', function() {
            $.getScript(root_path + 'syntax/scripts/shAutoloader.js', function(){
				//SyntaxHighlighter.defaults['html-script'] = false;
				//if(SyntaxHighlighter.defaults['html-script'] == true){
					misya.tools.loadJsFile(root_path + 'syntax/scripts/shBrushXml.js');
				//}
                SyntaxHighlighter.autoloader(
                  'js jscript javascript '+ root_path + 'syntax/scripts/shBrushJScript.js',
                  'php '+ root_path + 'syntax/scripts/shBrushPhp.js',
                  'css '+ root_path + 'syntax/scripts/shBrushCss.js'
                  //'xml xhtml xslt html '+ root_path + 'syntax/scripts/shBrushXml.js'
                );
                SyntaxHighlighter.all();
            });
		});
    }();
});

//谷歌统计
var _gaq = _gaq || [];
_gaq.push(['_setAccount', 'UA-34924709-1']);
_gaq.push(['_setDomainName', '.misya.me']);
_gaq.push(['_trackPageview']);

(function() {
var ga = document.createElement('script'); ga.type = 'text/javascript'; ga.async = true;
ga.src = ('https:' == document.location.protocol ? 'https://ssl' : 'http://www') + '.google-analytics.com/ga.js';
var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ga, s);
})();

/*
//百度统计
(function() {
var ba = document.createElement('script'); ba.type = 'text/javascript'; ba.async = true;
ba.src = (("https:" == document.location.protocol) ? " https://" : " http://") + 'hm.baidu.com/h.js?ae3873e8cd3a7eb735164e586ffa3150';
var b = document.getElementsByTagName('script')[0]; b.parentNode.insertBefore(ba, b);
})();
*/