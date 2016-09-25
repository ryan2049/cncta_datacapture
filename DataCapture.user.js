// ==UserScript==
// @name        Data Capture for Google Spreadsheets
// @namespace   DataCapture
// @description Uploads user statistics to a google spreadsheet for CiC's to keep track of player progress.
// @version     0.0.1
// @author      ryan2049 (aka comndrdata)
// @include     http*://prodgame*.alliances.commandandconquer.com/*/index.aspx*
// ==/UserScript==
(function () {
  var DataCapture_inject = function () {
	function create_ccta_datacapture() {
		console.log('ccta_datacapture loading');

		qx.Class.define('CCTA_DataCapture.Window',
			{
				type: 'singleton',
				extend: qx.ui.tabview.Page,
				construct: function(x)
				{
					try
					{
						this.base(arguments, x);
						this.set({layout: new qx.ui.layout.Grow(), label: "Data Capture", padding: 10});

						var overlay = webfrontend.gui.alliance.AllianceOverlay.getInstance();
						var mainTabview = overlay.getChildren()[12].getChildren()[0];
						mainTabview.addAt(this, 0);
						mainTabview.setSelection([this]);
					}
					catch(e)
					{
						console.log(e.toString());
					}
				},
				destruct: function(){},
				members:
				{
					__style:
					{
						"table": {"margin": "5px", "borderTop": "1px solid #333", "borderBottom": "1px solid #333", "fontFamily": "Verdana, Geneva, sans-serif"},
						"graph":
						{
							"td": {"width": "68px", "verticalAlign": "bottom", "textAlign": "center"},
							"div": {"width": "24px", "margin": "0 auto -1px auto", "border": "3px solid #333", "borderBottom": "none"}
						},
						"icon":
						{
							"ul": {"listStyleType": "none", "margin": 0, "padding": 0},
							"div": {"padding": "6px", "marginRight": "6px", "display": "inline-block", "border": "1px solid #000"},
							"p": {"display": "inline", "fontSize": "10px", "color": "#555"},
							"li": {"height": "15px", "padding": "2px", "marginLeft": "10px"}
						},
						"cell":
						{
							"data": {"width": "68px", "textAlign": "center", "color": "#555", "padding": "3px 2px"},
							"header": {"color": "#416d96", "padding": "3px 2px"}
						},
						"rows":
						{
							"graph": {"borderBottom": "3px solid #333", "height": "200px"},
							"tr": {"fontSize": "11px", "borderBottom": "1px solid #333",  "backgroundColor": "#d6dde1"}
						}      
					}
				}
			});
	}

    function initialize_ccta_datacapture() {
      try {
        if (typeof qx != 'undefined' && qx.core.Init.getApplication() && qx.core.Init.getApplication().getUIItem(ClientLib.Data.Missions.PATH.BAR_NAVIGATION) && qx.core.Init.getApplication().getUIItem(ClientLib.Data.Missions.PATH.BAR_NAVIGATION).isVisible()) {
          create_ccta_datacapture();
          CCTA_DataCapture.Window.getInstance();
        } else {
          setTimeout(initialize_ccta_datacapture, 1500);
        }
      } catch (e) {
        console.log("initialize_ccta_datacapture: ", e);
      }
    }
    setTimeout(initialize_ccta_datacapture, 1500);
  };

  try {
    var CTTA_DataCaptureScript = document.createElement("script");
    CTTA_DataCaptureScript.innerHTML = "(" + DataCapture_inject.toString() + ")();";
    CTTA_DataCaptureScript.type = "text/javascript";
    document.getElementsByTagName("head")[0].appendChild(CTTA_DataCaptureScript);
    console.log("CCTA_DataCapture injected");
  } catch (e) {
    console.log("CTTA_DataCaptureScript: init error: ", e);
  }
})();
