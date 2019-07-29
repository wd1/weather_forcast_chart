var mchartData=[];
var startDate, endDate;

$(window).on("resizeEnd", function(event){
            refresh(event);
        });
function refresh(event) {

//	if(event.period != "DD")
	hour =startDate.getHours();
	if(hour % 3 !=0)
	{
		var x = parseInt(hour / 3);
		startDate.setHours((x+1) * 3);
		startDate.setMinutes(0);
		startDate.setSeconds(0);
	}
	
	var panel2 = document.getElementsByClassName("amcharts-stock-panel-div-stockPanel2");
	panel2 = panel2[0];
	var bullets = panel2.getElementsByTagName("image");
	
	var start_index =0;
	for(i =0 ; i<mchartData.length; i++)
	{
		
		if((mchartData[i].date.getFullYear() == startDate.getFullYear()) &&
			(mchartData[i].date.getMonth() == startDate.getMonth()) &&
			(mchartData[i].date.getDate() == startDate.getDate()) &&
			(mchartData[i].date.getDay() == startDate.getDay()) &&
			(mchartData[i].date.getHours() == startDate.getHours()))
		{
			start_index = i;
			break;
		}	
	}
	// console.log(start_index+","+ bullets.length);
	for(i = start_index; i< start_index + bullets.length; i++)
	{
	
		bullets[i-start_index].style.cssText = `-webkit-transform: rotate(`+mchartData[i].winddirDegree+`deg);
							-moz-transform: rotate(`+mchartData[i].winddirDegree+`deg);
							-o-transform: rotate(`+mchartData[i].winddirDegree+`deg);
							-ms-transform: rotate(`+mchartData[i].winddirDegree+`deg);
							transform: rotate(`+mchartData[i].winddirDegree+`deg);
							x: -7;
							y: -7;`
		bullets[i-start_index].x.baseVal.value=-7;
		bullets[i-start_index].y.baseVal.value=-7;
	}
}
$.getJSON('http://api.worldweatheronline.com/premium/v1/ski.ashx?key=80946c38d2014931a87232129162611&q=stowe,vt&format=json&date=today&tp=1', function(data) {
	// console.log(data);
	json_data= data.data.weather;

    	      console.log(json_data);
				
				 for(i = 0; i < json_data.length; i++)
				 {
					 for(j = 0; j< json_data[i].hourly.length; j++)
					 {
						 var temp = json_data[i].hourly[j].mid[0];
						 temp.pressure = json_data[i].hourly[j].pressure;
						 var date = new Date(json_data[i].date);
						 date = new Date(date.valueOf() + (date.getTimezoneOffset())*60000)
						 
						//  console.log(date);
						 date.setHours(json_data[i].hourly[j].time/100);
						 //date = date+ " " +json_data[i].hourly[j].time/100;
						 mchartData.push(temp);
						 mchartData[mchartData.length-1].date =date; 
                         mchartData[mchartData.length-1].precip = json_data[i].hourly[j].precipMM;
                         mchartData[mchartData.length-1].chanceofsnow = json_data[i].hourly[j].chanceofsnow;
						 mchartData[mchartData.length-1].snowfall_cm = json_data[i].hourly[j].snowfall_cm;
						 //if(date.getHours() == 0)
						 {
						 	mchartData[mchartData.length-1].totalSnowfall_cm = json_data[i].totalSnowfall_cm;
						 //}else{
							//mchartData[mchartData.length-1].totalSnowfall_cm = 0;
						 }
                         mchartData[mchartData.length-1].color = "black";
						 mchartData[mchartData.length-1].arrow = "/arrow.png";
						 mchartData[mchartData.length-1].interest = 1;
						 
						 if(mchartData.length>1)
						 {
							if((mchartData[mchartData.length-2].tempF>=32) && (temp.tempF<32) && (mchartData[mchartData.length-2].int_description != "Something Good"))
							{
								mchartData[mchartData.length-1].int_color = "#00FF00";
								mchartData[mchartData.length-1].int_bullet = "round";
								mchartData[mchartData.length-1].int_description = "Something Good";
							}
							
							else if((temp.windspeedMiles>20) && (temp.snowfall_cm > 0) && (mchartData[mchartData.length-2].int_description != "wind blown snow"))
							{
								mchartData[mchartData.length-1].int_color = "yellow";
								mchartData[mchartData.length-1].int_bullet = "round";
								mchartData[mchartData.length-1].int_description = "wind blown snow";
							}
							else if((mchartData[mchartData.length-2].tempF<32) && (temp.tempF>=32) && (mchartData[mchartData.length-2].int_description != "Something Bad"))
							{
								mchartData[mchartData.length-1].int_color = "#FF0000";
								mchartData[mchartData.length-1].int_bullet = "round";
								mchartData[mchartData.length-1].int_description = "Something Bad";
							}
						 }
						 else
						 {
							//  mchartData[mchartData.length-1].int_bullet_size = 0;
						 }
					 }
				 } 


			var chart = AmCharts.makeChart("chartdiv", {

					type: "stock",
					categoryAxesSettings: {
						minPeriod: "mm",
						maxSeries: 0,
						dateFormats:[{period:'fff',format:'JJ:NN:SS'},
									{period:'ss',format:'JJ:NN:SS'},
									{period:'mm',format:'JJ:NN'},
									{period:'hh',format:'JJ:NN'},
									{period:'DD',format:'EEE MMM DD'},
									{period:'WW',format:'MMM DD'},
									{period:'MM',format:'MMM'},
									{period:'YYYY',format:'YYYY'}]
					},

					dataSets: [{
						color: "#b0de09",
						fieldMappings: [{
							fromField: "tempF",
							toField: "tempF"
						}, {
							fromField: "pressure",
							toField: "pressure"
						}, {
							fromField: "precip",
							toField: "precip"
						}, {
							fromField: "chanceofsnow",
							toField: "chanceofsnow"
						}, {
							fromField: "windspeedKmph",
							toField: "windspeedKmph"
						}, {
							fromField: "snowfall_cm",
							toField: "snowfall_cm"
						}, {
							fromField: "totalSnowfall_cm",
							toField: "totalSnowfall_cm"
						}, {
							fromField: "interest",
							toField: "interest"
						}, {
							fromField: "int_bullet",
							toField: "int_bullet"
						}, {
							fromField: "int_description",
							toField: "int_description"
						}				],
						
						dataProvider: mchartData,
						categoryField: "date"
					}],
					mouseWheelScrollEnabled: true,
					panels: [{
							showCategoryAxis: false,
							title: "Temperature",
							// percentHeight: 40,
							valueAxes:[{
									id:"v1"
								}
							],
								
							stockGraphs: [{
								id: "g1",
                                bulletAlpha: 0.5,
                                balloonText: "[[value]]" + "C",
								valueField: "tempF",
								lineThickness: 2,
                                useDataSetColors: false,
                                lineColor: "red"
							}],

							stockLegend: {
								labelText: "Temperature[F]",
                                align: "right"
							}
						},

                        {
							title: "Pressure/Chance of Precip & Snow",
							// percentHeight: 30,
                            valueAxes:[{
                                    "id": "v1",
                                    "title": "ChanceOfSnow",
                                    "position": "left",
                                    "labelFunction": function(value){
                                        return "%" + value;
                                    }
                                },
                                {
                                    "id": "v2",
                                    "title": "Pressure",
                                    "gridAlpha": 0,
                                    "position": "right",
                                    "autoGridCount": false
                                }],
							stockGraphs: [                       
                                {
								valueField: "pressure",
                                balloonText: "[[value]]" + "hPa",
                                valueAxis: "v2",
								type: "line",
                                lineThickness: 2,
                                useDataSetColors: false,
                                lineColor: "#000",                               
								cornerRadiusTop: 2,
								fillAlphas: 0,
                            
							},
                            {
								valueField: "chanceofsnow",
                                balloonText: "[[value]]" + "%",
                                useDataSetColors: false,
                                valueAxis: "v1",
                                fillColors: "#1620FF",
                                lineColor: "#1620FF",
                                lineAlpha: 0.5,
                                stackable: true,
								type: "line",
								cornerRadiusTop: 2,
								fillAlphas: 0.5
							},
                            {
								valueField: "precip",
                                balloonText: "[[value]]" + "%",
                                useDataSetColors: false,
                                valueAxis: "v1",
                                fillColors: "#FF2016",
                                lineColor: "#FF2016",
                                lineAlpha: 0.5,
                                stackable: true,
								type: "line",
								cornerRadiusTop: 2,
								fillAlphas: 0.5
							}],

							stockLegend: {
								valueTextRegular: " ",
								markerType: "none",
								align: "right"
							}
						},

						{
							title: "WindSpeed",
							// percentHeight: 30,

							stockGraphs: [{
								valueField: "windspeedKmph",
								type: "line",
                                bulletSize: 14,
								customBullet: "arrow.png",
        						customBulletField: "customBullet",
								balloonFunction: function(value){
									   return mchartData[value.index].windspeedKmph+"Km/h";
                                },
								useDataSetColors: false,
								cornerRadiusTop: 2,
								fillAlphas: 0
							}],

							stockLegend: {
								valueTextRegular: " ",
								markerType: "none"
							}
						},

						{
							title: "Snow Amount",
							// percentHeight: 30,

							stockGraphs: [{
								valueField: "snowfall_cm",
								type: "column",
								columnWidth: 1,
								lineColor: "#0F00F0",
                                bulletSize: 14,
								useDataSetColors: false,
								cornerRadiusTop: 0,
								fillAlphas: 1
							}
							, {
								valueField: "totalSnowfall_cm",
								type: "step",
								lineColor: "#FF00FF",
								columnWidth: 1,
                                bulletSize: 14,
								useDataSetColors: false,
								cornerRadiusTop: 0,
								fillAlphas: 0.1
							}
							],

							stockLegend: {
								valueTextRegular: " ",
								markerType: "none"
							}
						},

						{
							title: "Interest",
							// percentHeight: 30,

							stockGraphs: [{
								valueField: "interest",
								type: "line",
								columnWidth: 1,
								balloonText:"[[description]]",
								// bulletSize: 10,
								// bulletSizeField: "int_bullet_size",
								bulletField: "int_bullet",
								descriptionField: "int_description",
								// balloonFunction: function(value){
								// 	if(mchartData[value.index].tempF>32)
								// 		return "Bad Condition";
								// 	else
								// 		return "Good Condition";
                                // },
								lineColorField: "int_color",
								fillColorsField: "int_color",
								cornerRadiusTop: 0,
								fillAlphas: 0,
								lineAlpha: 0
							}
							
							],

							stockLegend: {
								valueTextRegular: " ",
								markerType: "none"
							}
						}
					],

					chartScrollbarSettings: {
						graph: "g1",
						usePeriod: "10mm",
						position: "top",
						//enabled: false,
						updateOnReleaseOnly:false
					},

					chartCursorSettings: {
						pan: true,
						valueBalloonsEnabled: true,
						valueLineBalloonEnabled:true,
						valueLineEnabled:true
					},

					periodSelector: {
						position: "bottom",
						dateFormat: "YYYY-MM-DD",
						inputFieldWidth: 150,
						periods: [{
							period: "hh",
							count: 120,
							label: "level1",
							selected: true

						}, {
							period: "hh",
							count: 100,
							label: "level2"
						}, {
							period: "hh",
							count: 80,
							label: "level3"
						}, {
							period: "hh",
							count: 50,
							label: "level4"
						}]
					},

					panelsSettings: {
						usePrefixes: true,
						panEventsEnabled: false
					}
				});
				
				chart.addListener("zoomed", handleZoom);
								
			    startDate = mchartData[0].date;
				endDate = mchartData[20].date;
				var olddate = startDate;
				// console.log(startDate);
				var input_start = document.getElementsByClassName("amcharts-start-date-input")[0];
				var input_end = document.getElementsByClassName("amcharts-end-date-input")[0];
				
				$(input_start).focusout(function(){
					
					var sd = new Date($(this).val());
					var ed = new Date($(input_end).val());
					// console.log(sd);
					chart.zoom(sd, ed);
				});

				$(input_end).focusout(function(){
					
					var sd = new Date($(input_start).val());
					var ed = new Date($(input_end).val());
					// console.log(sd);
					chart.zoom(sd, ed);
				});
				chart.zoom(startDate, endDate);	
				function rotate_arrow(sd,ed)
				{
					
					startDate = sd; 
					endDate = ed;
					// console.log("start");
					// console.log(startDate);
					// hour =startDate.getHours();
					// if(hour % 3 !=0)
					// {
					// 	var x = parseInt(hour / 3);
					// 	startDate.setHours((x+1) * 3);
					// 	startDate.setMinutes(0);
					// 	startDate.setSeconds(0);
					// }
					
					var panel2 = document.getElementsByClassName("amcharts-stock-panel-div-stockPanel2");
					panel2 = panel2[0];
					var bullets = panel2.getElementsByTagName("image");
					
					var start_index =0;

					for(i =0 ; i<mchartData.length; i++)
					{
						var date = new Date(mchartData[i].date.getTime() + 90 * 60000);
						//  console.log(i);
						// console.log(mchartData[i].date);
						// console.log(startDate);
						// console.log(date);
						// console.log(mchartData[i+1].date);
						// console.log(date);
						// if((mchartData[i].date.getFullYear() == startDate.getFullYear()) &&
						// 	(mchartData[i].date.getMonth() == startDate.getMonth()) &&
						// 	(mchartData[i].date.getDate() == startDate.getDate()) &&
						// 	(mchartData[i].date.getDay() == startDate.getDay()) &&
						// 	(mchartData[i].date.getHours() == startDate.getHours()))
						if((mchartData[i].date <= startDate) && 
							(startDate < mchartData[i+1].date))
						{
							if(startDate <= date)
							{
								start_index = i;
							}else{
								start_index = i + 1;
							}
							// console.log(mchartData[i].date.getMinutes());
							// if(startDate.getMinutes() < 30)
							// {
							// 	start_index = i;
							// }else{
							// 	start_index = i+1;
							// }
							break;
						}	
					}
					 console.log(start_index+","+ bullets.length);
					for(i = start_index; i< start_index + bullets.length; i++)
					{
					// console.log(i+","+mchartData[i]);
						bullets[i-start_index].style.cssText = `-webkit-transform: rotate(`+mchartData[i].winddirDegree+`deg);translate(0,0);
											-moz-transform: rotate(`+mchartData[i].winddirDegree+`deg);
											-o-transform: rotate(`+mchartData[i].winddirDegree+`deg); 
											-ms-transform: rotate(`+mchartData[i].winddirDegree+`deg);
											transform: rotate(`+mchartData[i].winddirDegree+`deg);
											x: -7;
											y: -7;`
						// console.log(bullets[i-start_index].style);
						bullets[i-start_index].x.baseVal.value=-7;
						bullets[i-start_index].y.baseVal.value=-7;
					}
				}
				
				

				function handleZoom(event) {
					//  console.log("handle");
				    // console.log(event.startDate);
					// console.log("old"+" "+olddate);
					// console.log(olddate <event.startDate);
					// console.log(event.startDate.getMinutes());
					var period_inputs = document.getElementsByClassName("amcharts-period-input");
					var input_start = document.getElementsByClassName("amcharts-start-date-input")[0];
					var input_end = document.getElementsByClassName("amcharts-end-date-input")[0];
					for(i=0; i <period_inputs.length; i++)
					{
						period_inputs[i].className += " amCharts_period_input";
					}
					input_start.className += " amCharts_period_input";
					input_end.className += " amCharts_period_input";
					if(event.period != "DD"){
						if(event.startDate.getMinutes() != 0){
							if(olddate < event.startDate)
							{
								event.startDate.setMinutes(0);
								event.startDate.setHours(event.startDate.getHours()+1);
								olddate = event.startDate;
								chart.zoom(event.startDate, event.endDate);
							}
							else if(olddate > event.startDate)
							{
								event.startDate.setMinutes(0);
								event.startDate.setHours(event.startDate.getHours()-1);
								olddate = event.startDate;
								chart.zoom(event.startDate, event.endDate);
							} else {}
						}else
						{
							rotate_arrow(event.startDate, event.endDate);
						}
					}
					else
					{
						olddate = event.startDate;
						chart.zoom(startDate, endDate);
					}
					
           		}
	
			 });