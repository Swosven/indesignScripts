//DESCRIPTION:Affiche/masque le calque "x" dans tous les documents ouverts
/*==================================

6 octobre 2015
sw 

Changer la visibilité d'un même calque (même nom)
dans tous les documents ouverts
s'il y existe

- Choix du calque dans un menu déroulant
- Choix Afficher/Masquer

Peut être utilisé sur les fichiers d'un livre inDesign

====================================
*/
// Globals
const wScriptName = "Changer la visibilité d'un calque";
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
else alert("Aucun document ouvert");



function affichage(mesCalques) {

	var mydialog = new Window("dialog", wScriptName + " v." + wScriptVersion);
	with (mydialog) {
		alignment = ["fill", "fill"];

		// options recherches
		var choixPanel = add("panel", undefined, "Calque à afficher/masquer :");
		with(choixPanel){
			alignment = ["fill", "fill"];
			var mon_calque_a_switcher = add('dropdownlist',undefined,undefined,{items:mesCalques});
				mon_calque_a_switcher.helpTip = "Liste des calques de ce document\r";
				mon_calque_a_switcher.selection = 0;


			var zeChoixGroupe = add("group");
			with (zeChoixGroupe) {
				alignment = ["fill", "auto"];
				alignChildren = "left";
				orientation = "column";

					add("radiobutton", undefined, "Afficher");
					add("radiobutton", undefined, "Masquer");
			}
			zeChoixGroupe.children[0].value = true;


		}

		var okCancelGroup = add("group");
		with (okCancelGroup) {
			orientation = "row";
			var okBtn = add("button", undefined, "Valider", {name:"ok"});
			var cancelBtn = add("button", undefined, "Annuler", {name:"cancel"});
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
