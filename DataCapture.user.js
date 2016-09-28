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

		// define LocalStorage
        qx.Class.define("CCTA_DataCapture.LocalStorage", {
          type: "static",
          statics: {
            isSupported: function () {
              return typeof (Storage) !== "undefined";
            },
            set: function (key, value) {
              try {
                if (CCTA_DataCapture.LocalStorage.isSupported()) {
                  localStorage["CCTA_DataCapture_" + key] = JSON.stringify(value);
                }
              } catch (e) {
                console.log("CCTA_DataCapture.LocalStorage.set: ", e);
              }
            },
            get: function (key, defaultValueIfNotSet) {
              try {
                if (CCTA_DataCapture.LocalStorage.isSupported()) {
                  if (localStorage["CCTA_DataCapture_" + key] != null && localStorage["CCTA_DataCapture_" + key] != 'undefined') {
                    return JSON.parse(localStorage["CCTA_DataCapture_" + key]);
                  }
                }
              } catch (e) {
                console.log("CCTA_DataCapture.LocalStorage.get: ", e);
              }
              return defaultValueIfNotSet;
            },
            clearAll: function () {
              try {
                if (!CCTA_DataCapture.LocalStorage.isSupported()) {
                  return;
                }
                for (var key in localStorage) {
                  if (key.indexOf("CCTA_DataCapture_") == 0) {
                    localStorage.removeItem(key);
                  }
                }
              } catch (e) {
                console.log("CCTA_DataCapture.LocalStorage.clearAll: ", e);
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


/*function createRandomRows(rowCount) {
  var rowData = [];
  var now = new Date().getTime();
  var dateRange = 400 * 24 * 60 * 60 * 1000; // 400 days
  var nextId = 0;
  for (var row = 0; row < rowCount; row++) {
    var date = new Date(now + Math.random() * dateRange - dateRange / 2);
    rowData.push([ Math.random() * 10000, nextId++]);
  }
  return rowData;
}


// window
var win = new qx.ui.window.Window("Table").set({
  layout : new qx.ui.layout.Grow(),
  allowClose: false,
  allowMinimize: false,
  contentPadding: 0
});
this.getRoot().add(win);
win.moveTo(30, 40);
win.open();

// table model
var tableModel = new qx.ui.table.model.Simple();
tableModel.setColumns([ "World Name", "Spreadsheet ID" ]);
tableModel.setData(createRandomRows(6));

// make second column editable
tableModel.setColumnEditable(1, true);

// table
var table = new qx.ui.table.Table(tableModel).set({
  decorator: null
});
win.add(table);

var resetButton = new qx.ui.form.Button("Set Data");
      resetButton.addListener("execute", function() {
        tableModel.setData([[1, 1], [2,2]]);
      }, this);
this.getRoot().add(resetButton);

var form = new qx.ui.form.Form();

// add the first headline
form.addGroupHeader("Registration");

// add usernamne
var userName = new qx.ui.form.TextField();
userName.setRequired(true);
form.add(userName, "Name");
// add password
var password = new qx.ui.form.PasswordField();
password.setRequired(true);
form.add(password, "Password");

this.getRoot().add(form);
*/
