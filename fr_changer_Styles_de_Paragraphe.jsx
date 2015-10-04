//*------------------------------
//
// Script for InDesign CS4-+.
// septembre 2015
// sw
// based on
//    Script by Thomas Silkjær
//	http://indesigning.net/
//
// Permet de changer les styles de paragraphes consécutifs
// avec l'option de chercher dans le contenu du 1er style (recherche GREP ou texte)
// et l'option de supprimer les styles de caractères ou styles (gras, italic...) ne correspondant pas au style de paragraphe.
//------------------------------*//

/*
sélectionner la textFrame parente, boucler dans les para jusqu'à avoir la même id que le para en cours,
sélectionner le para suivant

*/
// Globals
const wScriptName = "Remplacer les styles de paragraphe";
const wScriptVersion = "0.1";
var myInDesignVersion = Number(String(app.version).split(".")[0]);

var defaultStyle = "Sans";

if(app.documents.length != 0){

	myDoc = app.activeDocument;
	var pStyles = myDoc.allParagraphStyles;

	var mystring = [], myids = [];
	for (aa = 0; aa < pStyles.length; aa ++){
		mystring[aa] = pStyles[aa].name;
		myids[aa] = pStyles[aa].id;
		if (pStyles[aa].parent.constructor.name == "ParagraphStyleGroup") mystring[aa]+=" ["+pStyles[aa].parent.name+"]";
	}

	// Create a list of paragraph styles
	var list_of_paragraph_styles = [];
	var all_paragraph_styles = [];
	myDoc.paragraphStyles.everyItem().name;

	for(i = 0; i < myDoc.paragraphStyles.length; i++) {
		list_of_paragraph_styles.push(myDoc.paragraphStyles[i].name);
		all_paragraph_styles.push(myDoc.paragraphStyles[i]);
	}


	for(i = 0; i < myDoc.paragraphStyleGroups.length; i++) {
		for(b = 0; b < myDoc.paragraphStyleGroups[i].paragraphStyles.length; b++) {
			list_of_paragraph_styles.push(myDoc.paragraphStyleGroups[i].name+'/'+myDoc.paragraphStyleGroups[i].paragraphStyles[b].name);
			all_paragraph_styles.push(myDoc.paragraphStyleGroups[i].paragraphStyles[b]);
		}
	}

	var ln = app.selection.length ;
	if (ln == 0) { // fonctionne avec CS4, voir si CC lance l'alerte au début
					var infos = "Simples remplacements :\n===============\n Utiliser uniquement les choix de style pour remplacer les styles (1) ou (2) par les styles (3) et (4).\n";
					infos += "Ne pas oublier de remplir les styles (3) et (4), même par des styles identiques si l'on ne veut pas en changer un.\n";
					infos += "\nRecherches :\n============\n Permet de cherche du texte ou des GREP contenu dans le style (1) uniquement.\n";
					infos += "\nRemplacement de styles de caractère :\n========================\n Effacera en même temps les styles de caractères utilisés dans ces paragraphes (= utiliserle style de caractère [Sans]).";
					alert(infos);
	}
	if (ln == 1) {
		switch (app.selection[0].constructor.name){
				case "Character": // Story
				case "Word": // Story
				case "Line": // Story
				case "Paragraph": // Story
				case "InsertionPoint": // Story
				affichage() ;
			break;
				case "Text": // Story
				case "TextColumn":
				case "TextStyleRange": // Story
				case "Story": 
				case "TextFrame": // Spread
				case "Rectangle":
				// alert(app.selection[0].constructor.name + "\nparent : " + app.selection[0].parent.constructor.name) ;
				alert("Mauvaise sélection !");
			break;
		}
	}
}


function affichage() {
	//alert("texte : " + app.selection[0].constructor.name + "\nstyle : " + app.selection[0].paragraphs[0].appliedParagraphStyle.id) ;
	

	var placedstory = app.selection[0].parentTextFrames[0].parentStory;
	var pLn = placedstory.paragraphs.length;
	var nextPara = -1;
	for (var i = 0; i < pLn && nextPara == -1; i++) {
		if (app.selection[0].paragraphs[0].contents == placedstory.paragraphs[i].contents)
		nextPara = i+1;
	}
	//if (nextPara !== -1 && nextPara != pLn) alert("on en a un : " + nextPara);
	if (nextPara == -1 || nextPara == pLn)  {
		// if (nextPara == pLn) 
		alert("Aucun paragraphe suivant !");
		exit();
	}
	

	var mydialog = new Window("dialog", wScriptName + " v." + wScriptVersion);
	with (mydialog) {
		alignment = ["fill", "fill"];
		
		// options recherches
		var searchPanel = add("panel", undefined, "Options de recherche :");
		with(searchPanel){
		alignment = ["fill", "fill"];
		
			var textCheckbox = add ("checkbox", undefined, "Recherche de texte");
			var groupeTexte = add("group");
			with(groupeTexte) {
				alignment = ["fill", "fill"];
				alignChildren = "right";
				groupeTexte.orientation = "row";
				var stTxtTexte = groupeTexte.add("statictext");
					stTxtTexte.text = "Texte :";
					stTxtTexte.helpTip = "Texte ou laisser vide";
				var stTxtTexte_e = groupeTexte.add( "edittext", undefined, "" );
					stTxtTexte_e.preferredSize = [260, 20];
			}
		
			var GREPCheckbox = add ("checkbox", undefined, "Recherche de GREP");
			var groupeGREP = add("group");
			with(groupeGREP) {
				alignment = ["fill", "fill"];
				alignChildren = "right";
				groupeGREP.orientation = "row";
				var stTxtGREP = groupeGREP.add("statictext");
					stTxtGREP.text = "GREP :";
					stTxtGREP.helpTip = "GREP ou laisser vide";
				var stTxtGREP_e = groupeGREP.add( "edittext", undefined, "" );
					stTxtGREP_e.preferredSize = [260, 20];
			}
			stTxtTexte_e.onChange = function() {
				if (stTxtTexte_e != null) { 
					textCheckbox.value = true;
					GREPCheckbox.value = false;
					stTxtGREP_e.text = "";
				}
				else {
					textCheckbox.value = false;
				}
			}
			stTxtGREP_e.onChange = function() {
				if (stTxtTexte_e != null) { 
					GREPCheckbox.value = true;
					textCheckbox.value = false;
					stTxtTexte_e.text = "";
				}
				else {
					GREPCheckbox.value = false;
				}
			}
			textCheckbox.onClick = function() {
				if (textCheckbox.value == false) stTxtTexte_e.text = "";
			}
			GREPCheckbox.onClick = function() {
				if (GREPCheckbox.value == false) stTxtGREP_e.text = "";
			}
		}
		var overRideCheckbox = add ("checkbox", undefined, "Supprimer les remplacements (styles de caractère)");
			overRideCheckbox.helpTip = "Enlèvera aussi les styles de caractères des paragraphes";
		
		// options styles de para
		var stylesPanel = add("panel", undefined, "CHOIX DES STYLES :");
		with(stylesPanel){
			alignChildren = "right";
			var groupeGREP = add("group");
			
			
		
			var groupePara1 = add("group");
			with(groupePara1) {
				var para1_txt = add('statictext', undefined, 'Si (1) :');
				var find_first_paragraph = add('dropdownlist',undefined,undefined,{items:mystring});
					find_first_paragraph.helpTip = "Liste des styles de paragraphe disponibles\r";
					find_first_paragraph.selection = findid(app.selection[0].paragraphs[0].appliedParagraphStyle.id);
			}
			var groupePara2 = add("group");
			with(groupePara2) {
				var para2_txt = add('statictext', undefined, 'est suivi de (2) :');
				var find_second_paragraph = add('dropdownlist',undefined,undefined,{items:mystring});
					find_second_paragraph.helpTip = "Liste des styles de paragraphe disponibles\r";
					find_second_paragraph.selection = findid(placedstory.paragraphs[nextPara].appliedParagraphStyle.id);
			}
			var groupePara3 = add("group");
			with(groupePara3) {
				var para3_txt = add('statictext', undefined, 'remplacer (1) par (3) :');
				var change_first_paragraph = add('dropdownlist',undefined,undefined,{items:mystring});
					change_first_paragraph.helpTip = "Liste des styles de paragraphe disponibles\r";
					change_first_paragraph.selection = 0;
			}
			var groupePara4 = add("group");
			with(groupePara4) {
				var para4_txt = add('statictext', undefined, 'et (2) par (4) :');
				var change_second_paragraph = add('dropdownlist',undefined,undefined,{items:mystring});
					change_second_paragraph.helpTip = "Liste des styles de paragraphe disponibles\r";
					change_second_paragraph.selection = 0;
			}
		}

			var okCancelGroup = add("group");
			with (okCancelGroup) {
				orientation = "row";
				var aideBtn = add("button", undefined, "Aide", {name:"Help"});
					aideBtn.preferredSize = [50, 25];
				var okBtn = add("button", undefined, "Valider", {name:"ok"});
					okBtn.preferredSize = [140, 25];
			}



	//*******************************************
	}
	// fenetre
	var dialogResult = mydialog.show();
	
	// si OK :
	if (dialogResult== 1) {
		// Define paragraph styles
		var find_first_paragraph = all_paragraph_styles[find_first_paragraph.selection.index];
		var find_second_paragraph = all_paragraph_styles[find_second_paragraph.selection.index];
		var change_first_paragraph = all_paragraph_styles[change_first_paragraph.selection.index];
		var change_second_paragraph = all_paragraph_styles[change_second_paragraph.selection.index];

		if (textCheckbox.value) {
			// Set find grep preferences to find all paragraphs with the first selected paragraph style
			app.findChangeTextOptions.includeFootnotes = false;
			app.findChangeTextOptions.includeHiddenLayers = false;
			app.findChangeTextOptions.includeLockedLayersForFind = false;
			app.findChangeTextOptions.includeLockedStoriesForFind = false;
			app.findChangeTextOptions.includeMasterPages = false;

			app.findTextPreferences = NothingEnum.nothing;
			app.findTextPreferences.appliedParagraphStyle = find_first_paragraph;
			if (textCheckbox.value && stTxtTexte_e.text != null) {
				app.findTextPreferences.findWhat = stTxtTexte_e.text;
			} else {
				app.findTextPreferences.findWhat = "";
			}
		}
		if (GREPCheckbox.value || (!textCheckbox.value && !GREPCheckbox.value)) {
			// Set find grep preferences to find all paragraphs with the first selected paragraph style
			app.findChangeGrepOptions.includeFootnotes = false;
			app.findChangeGrepOptions.includeHiddenLayers = false;
			app.findChangeGrepOptions.includeLockedLayersForFind = false;
			app.findChangeGrepOptions.includeLockedStoriesForFind = false;
			app.findChangeGrepOptions.includeMasterPages = false;

			app.findGrepPreferences = NothingEnum.nothing;
			app.findGrepPreferences.appliedParagraphStyle = find_first_paragraph;
			if (GREPCheckbox.value && stTxtGREP_e.text != null) {
				app.findGrepPreferences.findWhat = stTxtGREP_e.text;
			} else {
				app.findGrepPreferences.findWhat = "$";
			}
		}

		//Search the current story
		var the_story = app.selection[0].parentStory;
		if (textCheckbox.value) var found_paragraphs = the_story.findText();
		if (GREPCheckbox.value || (!textCheckbox.value && !GREPCheckbox.value)) var found_paragraphs = the_story.findGrep();

		var change_first_list = [];
		var change_second_list = [];

		// Loop through the paragraphs and create a list of words and mark them as index words
		myCounter = 0;
		do {
			try {
				// Create an object reference to the found paragraph and the next
				var first_paragraph = found_paragraphs[myCounter].paragraphs.firstItem();
				var next_paragraph = first_paragraph.paragraphs[-1].insertionPoints[-1].paragraphs[0];

				// Check if the next paragraph is equal to the find_second_paragraph
				if(next_paragraph.appliedParagraphStyle == find_second_paragraph) {
						change_first_list.push(first_paragraph);
						change_second_list.push(next_paragraph);
				}
			} catch(err) {}
			myCounter++;
		} while (myCounter < found_paragraphs.length); 

		// Apply paragraph styles
		if (overRideCheckbox.value) {
			// cree un "vrai" style "Sans" pour supprimer les styles de caractères
			var defaultStyleName = "["+defaultStyle+"]"; 
			noneStyle = app.activeDocument.characterStyles.item(defaultStyleName);
			try {
				basedOnNone = app.activeDocument.characterStyles.add({name:defaultStyle, basedOn:noneStyle});
			} catch(e) {
				basedOnNone = app.activeDocument.characterStyles.item(defaultStyle);
			}
			myCounter = 0;
			if (change_first_list.length > 0 && change_second_list.length > 0 ) {
				do {
					change_first_list[myCounter].appliedCharacterStyle = basedOnNone;
					change_first_list[myCounter].appliedParagraphStyle = change_first_paragraph;
					change_second_list[myCounter].appliedCharacterStyle = basedOnNone;
					change_second_list[myCounter].appliedParagraphStyle = change_second_paragraph;
					myCounter++;
				} while (myCounter < change_first_list.length);
			}
			//myDoc.characterStyles.item("old style name").remove("new style name"); 
			try { myDoc.characterStyles.item("Sans").remove(); } catch(e) {}
		}
		else {
			myCounter = 0;
			if (change_first_list.length > 0 && change_second_list.length > 0 ) {
				do {
					change_first_list[myCounter].appliedParagraphStyle = change_first_paragraph;
					change_second_list[myCounter].appliedParagraphStyle = change_second_paragraph;
					myCounter++;
				} while (myCounter < change_first_list.length);
			}
		}
		
		alert(myCounter + " remplacement(s) fait(s) !");
	}
}


function findid(lid) {
	for (var i = 0; i < myids.length; i++) {
		if (myids[i] == lid)
			return i;
	}
	return -1;
}


