//DESCRIPTION:Apply selected colors
//DESCRIPTION:Applique la couleur choisie
/*
If no text selected: choose 2 colors (1 & 2)
With text selection: 
- apply first color if selection color = color 2
- apply second color if selection color = color 1



*/


if (app.locale.toString() == "FRENCH_LOCALE") {
	var infos = {
		alerte:"Aucun document ouvert",
		dial:"Change la couleur",
		col1:"Couleur 1 : ",
		col2:"Couleur 2 : ",
		ok:"Valider",
		c:"Annuler",
		sc:"Applique une couleur"
	};
} 
else {
	var infos = {
		alerte:"Please open a document",
		dial:"Change color",
		col1:"Color 1 : ",
		col2:"Color 2 : ",
		ok:"OK",
		c:"Cancel",
		sc:"Apply a color"
	};
};

Application.prototype.main = function() {
	
	if (app.documents.length == 0) {
		alert(infos.alerte);
		exit();
	}
	else {
	
	
		// OPTIONS :
		wSet = {};
		wSet.couleur1 = 3;
		wSet.couleur2 = 4;
		getStored_wSet();

		var ln = app.selection.length ;
		if (wSet.couleur1 == undefined || wSet.couleur2 == undefined) createDialog();
		else {
			// if (ln == 1) {
			if (ln > 0) {
				for (var i=0 ; i < ln; i++) {
					// alert(app.selection[i].constructor.name);
					switch (app.selection[i].constructor.name) {
							case "Character": // Story
							case "Word": // Story
							case "Line": // Story
							case "Paragraph": // Story
							case "Text": // Story
						//	case "TextColumn":
							case "TextStyleRange": // Story
						//	case "Story":
								appCouleur(i);
							break;
							default:
								createDialog();
							break;
					} // switch
				} // for
			}
			else createDialog();
		}
	}
/*
Faire en sorte que le choix ne se fasse que si rien n'est sélectionné
sinon appliquer la couleur en mémoire

If no selection: apply color
else select colors
*/
	function appCouleur(i) {
		
		
		if (wSet.couleur1 < app.activeDocument.swatches.length && wSet.couleur2 < app.activeDocument.swatches.length)
			// zeStory.paragraphs[inp].fillColor = zeDocument.swatches[idc];
			try {
				//alert(app.activeDocument.selection[i].fillColor.name + " " + app.activeDocument.swatches[wSet.couleur1].name);
				if (app.activeDocument.selection[i].fillColor.name == app.activeDocument.swatches[wSet.couleur1].name)
					app.activeDocument.selection[i].fillColor = app.activeDocument.swatches[wSet.couleur2];
				else
					app.activeDocument.selection[i].fillColor = app.activeDocument.swatches[wSet.couleur1];
			} catch(e) { alert(e);}
	}
	function createDialog() {
		var mydialog = new Window("dialog", infos.dial);
		with (mydialog) {
			alignment = ["fill", "fill"];
			alignChildren = "right";

			var list_of_couleurs = [];
			var all_couleurs = [];
			app.activeDocument.swatches.everyItem().name;

			for(i = 0; i < app.activeDocument.swatches.length; i++) {
				list_of_couleurs.push(app.activeDocument.swatches[i].name);
				all_couleurs.push(app.activeDocument.swatches[i]);
			}
			var choixGpe1 = add("group");
			with (choixGpe1) {
				var A1_txt = add('statictext', undefined, infos.col1);
				var choix_1 = add('dropdownlist',undefined,undefined,{items:list_of_couleurs});
					choix_1.selection = wSet.couleur1;
			}
			var choixGpe2 = add("group");
			with (choixGpe2) {
				var A2_txt = add('statictext', undefined, infos.col2);
				var choix_2 = add('dropdownlist',undefined,undefined,{items:list_of_couleurs});
					choix_2.selection = wSet.couleur2;
			}

			var okCancelGroup = add("group");
			with (okCancelGroup) {
				orientation = "row";
				alignment = ["right", "right"];
				alignChildren = "right";
				var okBtn = add("button", undefined, infos.ok, {name:"ok"});
				var cancelBtn = add("button", undefined, infos.c, {name:"cancel"});
			}
			// alert(list_of_couleurs);
		}
		var dialogResult = mydialog.show();




		if (dialogResult == 1) {
			// alert(choix_1.selection.index);

			wSet = {};
			// on recup les valeurs cochees
			wSet.couleur1 = choix_1.selection.index;
			wSet.couleur2 = choix_2.selection.index;

			// // on les enregistre
			app.insertLabel("SW_couleur", wSet.toSource());
		}
	} // dialog
//---------------- VARIABLES/DONNEES -------------------------------------------

	function getStored_wSet() {
		wSet = {};
		if (app.extractLabel("SW_couleur") !== "") {
			wSet = eval(app.extractLabel("SW_couleur"));
		}
	}
} // main

app.doScript('app.main();',ScriptLanguage.JAVASCRIPT,undefined,UndoModes.ENTIRE_SCRIPT, infos.sc);