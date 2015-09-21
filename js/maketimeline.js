/******

drawTimeline optinos object has the following keys:

dateField: the JSON field with the date for events (required)
headField: the JSON field with the headline for events (required)
eventField: the JSON field with the text for events (required)
target: the ID of the target HTML element (default: "timeline")
group: the JSON field used to categorize events in the timeline (optional) 
logging: log some info to the console?

For drawTimelines:

sections: the JSON field used to split the timeline in multiple timelines, one for each section (required)

*******/

var drawTimeline = function(results,options) {
  // Handle options
  var target = (typeof options.target === 'string') ? options.target : "timeline"; 
  var logging = options.log ? true : false; 
  if (typeof  options.dateField !== 'string' || 
      typeof options.headField !== 'string' || 
      typeof options.eventField !== 'string') console.log("Incorrect/missing field specification for building a timeline");
  dateField=options.dateField;
  headField=options.headField;
  eventField=options.eventField;

  // Handle timeline additional options (http://timeline3.knightlab.com/docs/options.html)
  TLoptions = [
    "script_path",
    "height",                     // height of timeline. default: this._el.container.offsetHeight
    "width",                      // width of timeline. default: this._el.container.offsetWidth
    "is_embed",                   // default: false
    "is_full_embed",              // default: false
    "hash_bookmark",              // default: false
    "default_bg_color",           // RGB for slide background. default: {r:255, g:255, b:255}
    "scale_factor",               // How many screen widths timeline should be. default: 2
    "layout",                     // portrait or landscape. default: landscape
    "timenav_position",           // nav on top or bottom? default: bottom
    "optimal_tick_width",         // optimal pixels between ticks. default: 100
    "base_class",                 // default: vco-timeline
    "timenav_height",             // nav height in pixels. default: 150
    "timenav_height_percentage",  // nav height as percentage (overrides timenav_height). default: 25
    "timenav_mobile_height_percentage", // default: 40
    "timenav_height_min",         // default: 150
    "marker_height_min",          // minimum marker height in pixels. default: 30
    "marker_width_min",           // minimum marker width in pixels. default: 100
    "marker_padding",             // top & bottom padding. default: 5
    "start_at_slide",             // default: 0
    "start_at_end",               // default: false
    "menubar_height",             // default: 0
    "skinny_size",                // breakpoint for narrow screens. default: 650
    "medium_size",                // breakpoint for medium screens. default: 800
    "relative_date",              // show relative date for next slide (uses Moments.js). default: false
    "use_bc",                     // use declared suffix on dates earlier than 0. default: false
    "duration",                   // animation duration in milliseconds. default: 1000
    "ease",                       // default: VCO.Ease.easeInOutQuint
    "dragging",                   // default: true
    "trackResize",                // default: true
    "slide_padding_lr",           // padding on left & right of each slide. default: 100
    "slide_default_fade",         // default: 0%
    "zoom_sequence",              // Array of Fibonacci numbers for TimeNav zoom levels. default: [0.5, 1, 2, 3, 5, 8, 13, 21, 34, 55, 89]
    "language",                   // default: en
    "ga_property_id",             // Google analytics id. default: null
    "track_events"                // default: ['back_to_start','nav_next','nav_previous','zoom_in','zoom_out' ]
  ];
  extraoptions={}
  TLoptions.forEach(function(d) {
      if (options[d]) extraoptions[d]=options[d];
  });
  
  var dataObject = {}; // to be passed to the timeline function
  var dateObjects= []; // array of date objects for dataObject.date

  results.forEach(function(d) {
      myDate = {};  // Object to be inserted into the timeline array

      // Find out what field has the date & save its value in startdate
      // Dates are YYYYMMDD 
      var dFields = dateField.split(".");
      var startdate=d[dFields.splice(0,1)];
      while (dFields.length>0) {
        startdate=startdate[dFields.splice(0,1)];
      }
      startdate={year:startdate.substr(0,4),month:startdate.substr(4,2),day:startdate.substr(6,2)};
      // Find out what field has the headline & save its value in headline
      var hFields = headField.split(".");
      var headline=d[hFields.splice(0,1)];
      while (hFields.length>0) {
        headline=headline[hFields.splice(0,1)];
      }
      if(!headline) headline="[MISSING HEADLINE]";
      if(typeof headline === 'number') headline=headline.toString();
      // Find out what field has the event text & save its value in eventdesc
      var evFields = eventField.split(".");
      var eventdesc=d[evFields.splice(0,1)];
      while (evFields.length>0) {
        eventdesc=eventdesc[evFields.splice(0,1)];
      }
      if(!eventdesc) eventdesc="";
      // Optionally build groups
      if(typeof options.group === 'string') { // were we given a group field?
        var groupFields=options.group.split(".");
        var myGroup=d[groupFields.splice(0,1)];
        while (groupFields.length>0) {
          myGroup=myGroup[groupFields.splice(0,1)];
        }
        if(typeof myGroup === 'number') myGroup=myGroup.toString();
      }

      // Build the date object
      myDate.start_date=startdate;
      textObj={headline:headline,text:eventdesc};
      myDate.text=textObj;
      if (myGroup) myDate.group=myGroup;

      dateObjects.push(myDate);
  })

  // Optionally build a title slide
  if(options.title) {
    titleObj={};
    titleObj.text={};
    titleObj.text.headline=options.title;
    if(options.desc) titleObj.text.text=options.desc;
    dataObject.title=titleObj;
  }
  dataObject.events=dateObjects
  if(logging) {
    console.log("Timeline data")
    console.log(dataObject);
  }

  timeline = new TL.Timeline(target, dataObject, extraoptions);
}

var drawTimelines = function(results,options) {
  var target = (typeof options.target === 'string') ? options.target : "timeline"; // optional target HTML targetent id
  if (typeof options.section !== 'string') console.log("Incorrect/missing sections for buildling multiple timelines:"+section)
  var logging = options.log ? true : false; 

  var sections = {}; // object to hold the sections we find (each section is a key)

  // Find the sections in the array
  results.forEach(function(d) {
      var sectionFields=options.section.split(".");
      var mySection=d[sectionFields.splice(0,1)];
      while (sectionFields.length>0) {
        mySection=mySection[sectionFields.splice(0,1)];
      }
      if (!sections.hasOwnProperty(mySection)) sections[mySection]=[];
      sections[mySection].push(d);
  })
  if (logging) {
    console.log("Found sections")
    console.log(sections);
  }

  // Draw a timeline for each section
  for (var o in sections) {
    sectiontarget=target+"-"+o;
    if(logging) console.log("Putting section in: "+sectiontarget)
    $("#"+target).append("<div id="+sectiontarget+"></div>");
    options.target=sectiontarget;
    options.title=o;
    options.desc="Events for "+o;
    drawTimeline(sections[o],options);
  }

}
