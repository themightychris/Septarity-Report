Ext.define('SeptarityReport', {
	singleton: true
	
	,moveBuffer: 30
	,useAnimation: false
	,debug: false
	,cursorSize: 15
	,handPlaneWidth: 100
	,handPlaneHeight: 100
	
	
	,constructor: function() {
		this.lastMoveTime = 0;
		this.debug = window.location.hash=='#debug';
		this.cursorOffset = this.cursorSize / 2;
		this.hoverSchedule = false;
		
/*
			    	var html = '<h2 class="destination">'+ destination +'</h2>';
				        		    
			    	
			    	if(response.length){
				    	
						html +=	
						'<table class="trains">'
							+'<thead><tr><td>Train #</td><td>Departure</td><td>Delay</td><tr></thead>'
							+'<tbody>';
				    	
			    	
			    	
			    	
				    	Ext.Array.each(response, function(name, index) {
				    		html+= 				
					    		'	<tr>'
								+'		<td class="train-number">'+ response[index].orig_train +'</td>'
								+'		<td class="train-departure-time">'+ response[index].orig_departure_time +'</td>'
								+'		<td class="train-delay-duration">'+ response[index].orig_delay +'</td>'
								+'	</tr>';
						});
					
			    	
				    	html += '</tbody></table>';
			    	
			    	}else{
						html+='<h2>No Trains</h2>'
					}
*/
		
		
		this.scheduleTemplate = new Ext.XTemplate([
			'<h2>{destination}</h2>'
			,'<tpl if="trains.length">'
				,'<table class="trains">'
				,'<thead><tr><td>Train #</td><td>Departure</td><td>Delay</td><tr></thead>'
				,'<tbody>'
					,'<tpl for="trains">'
						,'<tr>'
							,'<td class="train-number">{orig_train}</td>'
							,'<td class="train-departure-time">{orig_departure_time}</td>'
							,'<td class="train-delay-duration">{orig_delay}</td>'
						,'</tr>'
					,'</tpl>'
				,'</tbody>'
				,'</table>'
			,'</tpl>'
			,'<tpl if="!trains.length">'
				,'<h2>No Trains</h2>'
			,'</tpl>'
		]);
	
	
		Ext.onReady(this.domReady, this);
	}
	
	,domReady: function() {
	
		this.ct = Ext.get('main');
		this.ct.setStyle('position', 'relative');
		this.ctXY = this.ct.getXY();
		
		this.cursor = this.ct.createChild({
			id: 'cursor'
			,style: {
				position: 'absolute'
				,width: this.cursorSize+'px'
				,height: this.cursorSize+'px'
				,border: '3px solid red'
				,'border-radius': '8px'
				,'z-index': 9999
			}
		});

		DJS.on('KinectInit', this.onKinectInit, this);
		DJS.on('Move', this.onMove, this);
		DJS.on('HandClick', this.onHandClick, this, {buffer: 250});
		DJS.on('SwipeLeft', this.onSwipe, this);
		DJS.on('SwipeRight', this.onSwipe, this);
		DJS.on('SwipeUp', this.onSwipe, this);
		DJS.on('SwipeDown', this.onSwipe, this);
		
		Ext.EventManager.onWindowResize(this.onWindowResize, this);
		
		
		this.ct.on('click', function(ev, t) {
		
			this.selectSchedule(Ext.get(t));
		
		}, this, {delegate: '.schedule'});
		
		
		Ext.getBody().on('click', function(ev, t) {
			ev.stopEvent();
			this.back();
		}, this, {delegate: 'a.back'});
		
		
		this.loadSchedules();
	}
	
	
	,onKinectInit: function(data) {
		console.info('kinect init');
	}
	
	,onWindowResize: function() {
		this.ctXY = this.ct.getXY();
	}
	
	
	,onMove: function(data) {
		var now = new Date().getTime();
		
		// ignore event if within move buffer
		if(this.lastMoveTime + this.moveBuffer > now)
			return;
			
		this.lastMoveTime = now;
			
		
		// calculate 
		var xFrac = (1 - data.x / this.handPlaneWidth)
			,yFrac = (data.y / this.handPlaneHeight)
			,x = this.ct.getWidth() * xFrac
			,y = this.ct.getHeight() * yFrac
			,border = 6*(50/data.z);
			
		
		// position cursor
		this.cursor.setLeftTop(x-this.cursorOffset, y-this.cursorOffset);
		this.cursor.setStyle('border-width', border+'px');


		// handle page position
		var pageX = (x + this.ctXY[0]) - this.cursorOffset - 1
			,pageY = (y + this.ctXY[1]) - this.cursorOffset - 1;
			
		var hoverEl = Ext.Element.fromPoint(pageX, pageY);

		if(hoverEl)
		{
			var routeEl = hoverEl.hasCls('schedule') ? hoverEl : hoverEl.up('.schedule');
			
			if(routeEl)
			{
				routeEl.radioCls('hover');
				this.hoverSchedule = routeEl;
			}
		}
		
		// debug output
		if(this.debug)
		{
			console.log(
				'move to: translate(%o, %o) scale(%o, %o)'
				,newAttrs.translate.x, newAttrs.translate.y
				,newAttrs.scale.x, newAttrs.scale.y
			);
		}
	}
	
	
	
	,onHandClick: function(data) {
		
		this.cursor.frame('#00FF00', 1, {duration: 800});
		
		if(this.hoverSchedule)
		{
			this.selectSchedule(this.hoverSchedule);
		}
		
		if(this.debug)
		{
			console.log('hand click: %o', data);
		}
	}
	
	
	,onSwipe: function(data, eventName) {
		this.back(eventName.substr(5).toLowerCase());
	}



	,loadSchedules: function() {
	
		this.ct.select('.schedule').each(function(scheduleEl) {
		
			// squash the fly
			scheduleEl = Ext.get(scheduleEl.id);
			
			// add loading class
			scheduleEl.addCls('loading');
		
			Ext.Ajax.request({
			   url: '/rail-next_to_arrive.php'
			   ,params: {
			        start_station: '30th Street Station'
			        ,end_station: scheduleEl.id
			        ,count: '2'
			    }
			    ,timeout: 10000
			    ,method: 'GET'
			    ,scope: this
			    ,success: function(response) {
			    
			    	var r = Ext.decode(response.responseText);
			    	
			    	this.scheduleTemplate.overwrite(scheduleEl, {
			    		destination: scheduleEl.id
			    		,trains: r
			    	});
			    	
			    	scheduleEl.removeCls('loading');
			    	
			    	if(r.length)
			    		scheduleEl.removeCls('inactive');
			    	else    
			    		scheduleEl.addCls('inactive');     
			    }
			});
			
			
			
		}, this);
		
	
	}

	
	,selectSchedule: function(scheduleEl) {
	
		// ignore if a details window exists
		if(this.scheduleDetails)
			return;
	
		scheduleEl.radioCls('selected');
		
		// Matt added this to get the return trains
		Ext.Ajax.request({
		   url: '/rail-next_to_arrive.php'
		   ,params: {
		        start_station: scheduleEl.id
		        ,end_station: '30th Street Station'
		        ,count: 10
		    }
		    ,timeout: 10000
		    ,method: 'GET'
		    ,scope: this
		    ,success: function(response) {
		    
		    	var r = Ext.decode(response.responseText);
		    	
		    	this.scheduleTemplate.overwrite(scheduleEl, {
		    		destination: scheduleEl.id
		    		,trains: r
		    	});
		    	    
		    }
		});
		
		this.scheduleDetails = Ext.create('Ext.Component', {
			width: scheduleEl.getWidth(true)
			,height: scheduleEl.getHeight(true)
			,floating: true
			,renderTpl: [
				'<a href="#back" class="back">&laquo; back</a>'
				,'<h2>Details for {destination}</h2>'
/*
				,'<div class="line-schedules">'
				,	'<div class="next-trains"></div>'
				//this.scheduleTemplate;
				,	'<div class="returning-trains"></div>'
				,'</div>'
*/
			]
			,renderData: {
				destination: scheduleEl.id
			}
			,cls: 'schedule-details'
			,style: {
				'opacity': 0
			}
		}).show();
				
		this.scheduleDetails.el.alignTo(scheduleEl, 'tl-tl');
		
		this.scheduleDetails.el.animate({
			to: {
				opacity: 1
				,x: this.ct.getLeft()
				,y: this.ct.getTop()
				,width: this.ct.getWidth()-this.ct.getMargin('lr')-this.ct.getPadding('lr')
				,height: this.ct.getHeight()-this.ct.getMargin('tb')-this.ct.getPadding('tb')
			}
			,scope: this
			,callback: function() {
/*
				this.scheduleDetails.el.mask('Loading Schedule&hellip;', 'x-mask-loading');
				
				Ext.Ajax.request({
					url: '/rail-schedules/json'
					,
				});
*/

				this.scheduleDetails.el.createChild('<div style="text-align:center"><iframe src="http://www3.septa.org/hackathon/TrainView/map.html" width="96%" height="400"></iframe></div>');
			}
		});
		
	}
	
	
	,back: function(dir) {
	
		if(!this.scheduleDetails)
			return;

		dir = dir || 'left';
		
		var to = {
			opacity: 0
		};
		
		switch(dir)
		{
			case 'up':
				to.y = this.ct.getHeight() * -1;
				break;
		
			case 'down':
				to.y = Ext.Element.getViewHeight();
				break;
		
			case 'left':
				to.x = Ext.Element.getViewWidth() * -1;
				break;
				
			default:
			case 'right':
				to.x = Ext.Element.getViewWidth();
				break;
		}
		
		console.info('back(%o): %o', dir, to);
		
	
		this.scheduleDetails.el.animate({
			duration: 500
			,to: to
			,callback: function() {
				this.scheduleDetails.destroy();
				this.scheduleDetails = null;
			}
			,scope: this
		});
	
	}

})