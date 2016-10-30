//DESCRIPTION:Show/hide layer "x" in all open documents
/*==================================

6 octobre 2015
sw 

Modify same layer (same name) visibility
in all opened documents

- Select layer name
- Option Show/Hide

Usefull with inDesign books files

====================================
*/
// Globals
const wScriptName = "Modify layer visibility";
const wScriptVersion = "1.0";
var myInDesignVersion = Number(String(app.version).split(".")[0]);


if (app.documents.length > 0) {

	var mesCalques = [], myids = [];

	for (i = 0; i < app.activeDocument.layers.length; i++){
		mesCalques[i] = app.activeDocument.layers[i].name;
		myids[i] = i;
	}
	// on trie
	mesCalques.sort()
	// alert(mesCalques);
	affichage(mesCalques);
}
else alert("No open document");



function affichage(mesCalques) {

	var mydialog = new Window("dialog", wScriptName + " v." + wScriptVersion);
	with (mydialog) {
		alignment = ["fill", "fill"];

		// options recherches
		var choixPanel = add("panel", undefined, "Show/hide layer:");
		with(choixPanel){
			alignment = ["fill", "fill"];
			var mon_calque_a_switcher = add('dropdownlist',undefined,undefined,{items:mesCalques});
				mon_calque_a_switcher.helpTip = "This document layers list by name\r";
				mon_calque_a_switcher.selection = 0;


			var zeChoixGroupe = add("group");
			with (zeChoixGroupe) {
				alignment = ["fill", "auto"];
				alignChildren = "left";
				orientation = "column";

					add("radiobutton", undefined, "Show");
					add("radiobutton", undefined, "Hide");
			}
			zeChoixGroupe.children[0].value = true;


		}

		var okCancelGroup = add("group");
		with (okCancelGroup) {
			orientation = "row";
			var okBtn = add("button", undefined, "OK", {name:"ok"});
			var cancelBtn = add("button", undefined, "Cancel", {name:"cancel"});
		}

	//*******************************************
	}
	// fenetre
	var dialogResult = mydialog.show();

	// si OK :
	if (dialogResult == 1) {
		for (i = 0; i < app.documents.length; i++){

			try {
				app.documents[i].layers.item(mesCalques[mon_calque_a_switcher.selection.index]).visible = zeChoixGroupe.children[0].value; // true/false
			} catch(e) {
			//	alert(e);
			}
		}
	}
}
