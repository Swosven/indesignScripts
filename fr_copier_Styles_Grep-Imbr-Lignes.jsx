//DESCRIPTION:Copie/mémorise les (GREP/styles imbriqués/styles lignes) d'un para à l'autre

//*------------------------------
//
// Script for InDesign CS4-CC2015.
// 2014-2016
// sw
//
//
// inspiré de :
// http://indesignsecrets.com/topic/copying-all-grep-styles-from-one-paragraph-style-to-annother

//http://forums.adobe.com/thread/681085 (Ariel's script to select a paragraph style)
//http://forums.adobe.com/message/5888276 (jkorchok2's script to apply grep styles from a predefined paragraph style)
//This utility will copy GREP styles into styles that are nested in up to two levels of groups i.e. Main Style Group>Headings Group>Heading 1

// Permet de sélectionner et récupérer/enregistrer les styles GREP, imbriqués, de ligne dans un fichier texte
// Permet de coller les styles enregistrés dans les styles de paragraphes choisis du document ouvert.
// Permet de supprimer des styles de la liste pré-enregistrée
// 
// Nécessite de valider l'action avant de valider le script (boutons "Enregister" ou "Transférer")
// Utilise le fichier texte (dans le même dossier) : fr_copier_listeStyles.txt
//========================================

if (app.locale.toString() == "FRENCH_LOCALE") {

	var infos = {
		appliedDef:		"[Sans]", 												//	appliedCSDefault 
		butC:			"Annuler",												// button cancel 
		butOK:			"Valider",												// button ok
		butS:			"Supprimer le(s) style(s) sélectionné(s)",				// button delete
		butSh:			"Supprime les styles uniquement de la liste mémorisée.",// helptip
		butT:			"Transférer",											// button tranfer
		butTh1:			"Memorise le transfert des styles sélectionnés dans l'onglet du haut visible,\r", // helptip l.1
		butTh2:			"vers les styles sélectionnés dans le panneau ci-dessus.\r", // helptip l.2
		butTh3:			"Si clic sur 'Valider', le transfert sera effectué.", 	// helptip l.3
		choi:			"Choisir : ",											// choose
		choisir:		"Choisir un style : ", 								//	
		col1:			["No", "Valide", "Style appliqué", "Grep"],				// columns names
		col2:			["No", "Valide", "Style appliqué", "Inclusif", "Repét.", "Délimiteur"],			// columns names
		col3:			["No", "Valide", "Style appliqué", "Sur nb lignes", "Repéter"],			// columns names
		contenu:		"Contenu du style choisi :			",					//	group bottom 1
		emsg:			"Impossible de mémoriser le style.", 					// error message
		err:			"Le style de paragraphe source n’existe pas",			// mySetGrepStyle function
		err1:			"\rLe style à modifier n’existe pas.",					// mySetGrepStyle function
		Gp:				"Groupe : ",											// fillpStyleStringList
		gpD:			"Coller vers ces styles de paragraphe",					// target paragraphs
		gRep:			"Style de caractères de remplacement",					// group replace
		grep2:			"GREP mémorisés", 										// GREP memorised
		grep2c:			["Nom", "Valide", "Style appliqué", "Grep"], 			// columns name
		gSource:		"Style de paragraphe source", 							//	(group source)
		h1:				"Permet de visualiser les styles Grep | Imbriqués | de ligne\r", 	//	help l.1
		h2:				"dans les 3 onglets au dessous.",						//	help l.2
		hlp1:			"Si le style de caractères appliqué du style mémorisé n'existe pas,\r", // helptip l.1
		hlp2:			"il sera remplacé par celui-ci.",						// helptip l.2
		last1:			"Les styles ont été mémorisés.\n", 						// last line
		last2:			" transfert(s) fait(s).",								// 
		last3:			"Aucun transfert effectué.",				 			// 
		lgn:			" ligne(s)",											// 
		myS1:			"\r\rLe style '",										// 
		myS2:			"' n'existe pas.\rIl a été remplacé par '",				// mySetGrepStyle function
		nbG:			"? GREP",												// tab names
		nbGt:			" GREP",												// txt 1
		nbI:			"? Imbriqués", 											//
		nbIt:			" Imbriqués",											// txt 2
		nbL:			"? Lignes", 											// 
		nbLt:			" Lignes",												// txt 3 
		nGp:			"Nom : ",												//
		nmD:			"Nom du style", 										// style name
		nmP:			"Choisir un nom de style", 								// select style name
		ns:				"Nouveau style", 										// G_ListeStyles, I_ListeStyles, L_ListeStyles
		path:			"Choisir le fichier contenant la liste des styles.", 	// myFindFile
		q2:				"Transférer le style ?",								// question 2
		q3:				"Supprimer ce(s) style(s) ?",							// question3 
		q4:				"Mémoriser le style ?", 								// question
		saveB:			"Nommer le style avant de l'enregistrer",				// save button
		scName:			"Copier/coller les styles GREP, imbriqués, lignes", 	// 	wScriptName 
		sGp:			"Sous-groupe : ",										// 
		sh1:			"Enregistre les styles Grep | Imbriqués | de ligne\r", 	// help l.1
		sh2:			"sélectionnés dans la liste de l'onglet 'Collage de styles'.\r", 	// help l.2
		sh3:			"Si clic sur 'Valider', enregistre dans un fichier texte permanent.", 	// help l.3
		sur:			" sur ",												// 
		tabColler:		"Collage vers des styles de paragraphe", 				// tab paste name
		tabCopTxt:		"Mémorisation à partir d'un style de paragraphe", 		//	(tabCopy name)
		tabG:			"GREP",													// main tab name
		tabI:			"Imbriqués"								,				// second tab name
		tabImb:			"Imbriqués mémorisés", 									// tab2 name
		tabImbc:		["Nom", "Valide", "Style appliqué", "Inclusif", "Repét.", "Délimiteur"],	// columns name
		tabL:			"Lignes"								,				// third tab name
		tabLig:			"Lignes mémorisées", 									// tab2 name
		tabLigc:		["Nom", "Valide", "Style appliqué", "Sur nb lignes", "Repéter"]	// columns name
	};
	var delim = {
		1380541539: "Caractères",
		1380541559: "Mots",
		1396797550: "Numérotation automatique des pages",
		1380541540: "Chiffres",
		1380541507: "Lettrine",
		1397058899: "Cadratins",
		1396855379: "Caractères de fin de style imbriqué",
		1397059155: "Demi-cadratins",
		1397124194: "Saut de ligne forcé",
		1397319796: "Caractères d'indentation jusqu'à ce point",
		1380541545: "Marqueur d'objet ancré",
		1380541548: "Lettres",
		1397645907: "Espaces insécables",
		1380545132: "Répétition",
		1400073805: "Marque de section",
		1380541555: "Phrases",
		1380541556: "Caractères de tabulation"
	};
	var rep = {
		y:"oui",
		n:"non"
	};
	var inc = {
		s:"sur",
		j:"jusqu'à"
	};
}
else {
	var infos = {
		appliedDef:		"[None]", 												// appliedCSDefault 
		butC:			"Cancel",												// button cancel
		butOK:			"Apply",												// button ok
		butS:			"Delete selected style(s)",								// button delete
		butSh:			"Delete styles from list file.",						// helptip
		butT:			"Transfer",												// button tranfer
		butTh1:			"Save selected styles to upper visible tab,\r", 		// helptip l.1
		butTh2:			"to selected styles in the upper panel.\r", 			// helptip l.2
		butTh3:			"Clic on 'Apply' to transfer.", 						// helptip l.3
		choi:			"Select: ",												// choose
		choisir:		"Select a style: ", 									// 	
		col1:			["Nb", "Valid", "Applied style", "Grep"],				//  columns names
		col2:			["Nb", "Valid", "Applied style", "Inclusive", "Repeat", "Delimiter"],			//  columns names
		col3:			["Nb", "Valid", "Applied style", "On nb lines", "Repeat"],			//  columns names
		contenu:		"Selected style content:",								// 	group bottom 1
		emsg:			"Unable to save style.", 								// error message
		err:			"The source paragraph style doesn’t exist",				// mySetGrepStyle function
		err1:			"\rUnable to modify: the style doesn’t exist.",			//
		Gp:				"Group:	",												// fillpStyleStringList
		gpD:			"Paste to paragraphs styles",							// target paragraphs
		gRep:			"Replace with characters style",						// group replace
		grep2:			"Saved GREP", 											// GREP memorised
		grep2c:			["Name", "Valid", "Applied Style", "Grep"], 			// columns name
		gSource:		"Source of paragraph style", 							// 	(group source)
		h1:				"View Grep | nested | line styles\r", 					// 	help l.1
		h2:				"in 3 tabs below.",										// 	help l.2
		hlp1:			"If the applied characters style used in the saved style doesn't exist,\r", // helptip l.1
		hlp2:			"this characters style will be applied.",				// helptip l.2
		last1:			"Styles saved.\n", 										// last line
		last2:			" transfer(s) done.",									// 
		last3:			"No transfer done.",				 					// 
		lgn:			" line(s)",												// 
		myS1:			"\r\rThe style '",
		myS2:			"' doesn’t exist.\rIt was replaced by '",				// 
		nbG:			"? GREP",												//  tab names
		nbGt:			" GREP",												// txt 1
		nbI:			"? Nested", 											// 
		nbIt:			" Nested",												// txt 2
		nbL:			"? Lines", 												// 
		nbLt:			" Lines",												// txt 3
		nGp:			"Name: ",												//
		nmD:			"Style name", 											// style name
		nmP:			"Select a style name", 									// select style name
		ns:				"New style", 											// G_ListeStyles, I_ListeStyles, L_ListeStyles
		path:			"Select the file that contains the styles list.",		// myFindFile
		q2:				"Transfer this style?",									// question 2
		q3:				"Delete those styles ?",								// question3
		q4:				"Save this style?", 									// question
		saveB:			"Name the style before saving",													// save button
		scName:			"Copy/paste GREP, nested, lines styles", 				// 	wScriptName 
		sGp:			"Sub-group:	",											// 
		sh1:			"Save Grep | Nested | Line styles\r", 					// help l.1
		sh2:			"selected in the tab 'Style paste' list'.\r", 			// help l.2
		sh3:			"If you clic on 'Apply', save in a text file.", 		// help l.3
		sur:			" on ",													// 
		tabColler:		"Paste to paragraph styles", 							// tab paste name
		tabCopTxt:		"Save from paragraph style", 							// 	(tabCopy name)
		tabG:			"GREP",													//  main tab name
		tabI:			"Nested",												//  second tab name
		tabImb:			"Imbriqués mémorisés", 									// tab2 name
		tabImbc:		["Name", "Valid", "Applied Style", "Inclusive", "Repeat", "Delimiter"],	// columns name
		tabL:			"Lines",												//  third tab name
		tabLig:			"Lignes mémorisées", 									// tab2 name
		tabLigc:		["Name", "Valid", "Applied Style", "On nb lines", "Repeat"]	// columns name
	};
	var delim = {
		1380541539: "Characters",
		1380541559: "Words",
		1396797550: "Automatic page number",
		1380541540: "Digits",
		1380541507: "Drop Cap",
		1397058899: "EM space",
		1396855379: "End nested style character",
		1397059155: "EN space",
		1397124194: "Forced line break",
		1397319796: "Indent here tab",
		1380541545: "Inline graphic",
		1380541548: "Letters",
		1397645907: "Non-breaking space",
		1380545132: "Repeat",
		1400073805: "Section marker",
		1380541555: "Sentence",
		1380541556: "Tabs"
	};
	var rep = {
		y:"yes",
		n:"no"
	};
	var inc = {
		s:"on",
		j:"until"
	};

}



// Globals
const wScriptName = infos.scName; 
const wScriptVersion = "1.0";

myDoc = app.activeDocument;
var myInDesignVersion = Number(String(app.version).split(".")[0]);

var txtListe = "en_copy_listStyles.txt";
var myListeFile = File(myFindFile(txtListe));

var g_Liste = new G_ListeStyles();
var i_Liste = new I_ListeStyles();
var l_Liste = new L_ListeStyles();
var del_Liste = [[],[],[]];



listerTxt();
//exit();


var theDoc = app.activeDocument;
var pStyles = theDoc.allParagraphStyles;
var cStyles = theDoc.allCharacterStyles;
var pStyleStringList = [];// listbox
var appliedCSDefault = infos.appliedDef; 

var sel = -1, selectedStylesNames = [], typeS = "", transfert = false;




fillpStyleStringList();
var saveStyles = mainDialog();

if (transfert == true && sel != -1) {
	if (typeS == "g") {
		for (var i =sel.length-1; i > -1; i--) {

			var cur = g_Liste.l_find(sel[i].text);
			var l = selectedStylesNames.length;
			while(l--){
				mySetGrepStyle([selectedStylesNames[l][0]],
				[selectedStylesNames[l][1]],
				[selectedStylesNames[l][2]],
				cur);
			}
		}
	}
	if (typeS == "i") {
		for (var i =sel.length-1; i > -1; i--) {

			var cur = i_Liste.l_find(sel[i].text);
			var l = selectedStylesNames.length;
			while(l--){
				mySetGrepStyle([selectedStylesNames[l][0]],
				[selectedStylesNames[l][1]],
				[selectedStylesNames[l][2]],
				cur);
			}
		}
	}
	if (typeS == "l") {
		for (var i =sel.length-1; i > -1; i--) {

			var cur = l_Liste.l_find(sel[i].text);
			var l = selectedStylesNames.length;
			while(l--){
				mySetGrepStyle([selectedStylesNames[l][0]],
				[selectedStylesNames[l][1]],
				[selectedStylesNames[l][2]],
				cur);
			}
		}
	}
}

// liste dans menu deroulant tous les styles de paragraphe
// list all paragraph styles for dropdown
function mainDialog(){

	var mydialog = new Window("dialog", wScriptName + " v." + wScriptVersion);
	myStyles = myDoc.allParagraphStyles;
	var mystring = [];
	for (aa = 0; aa < myStyles.length; aa ++){
		mystring[aa] = myStyles[aa].name;
		if (myStyles[aa].parent.constructor.name == "ParagraphStyleGroup") mystring[aa]+=" ["+myStyles[aa].parent.name+"]";
	}
	myStylesc = myDoc.allCharacterStyles;
	var mystringc = [];
	for (aa = 0; aa < myStylesc.length; aa ++){
		mystringc[aa] = myStylesc[aa].name;
	}



	var cWidth = 150;
	var sizeTabl = [cWidth*4,cWidth*3];
	var sizeTabl2 = [cWidth*4,cWidth*2];


	with (mydialog) {
		alignment = ["fill", "fill"];

		// tab Copier styles / Coller styles
		// tab copy styles / paste styles
		//********************************************
		//********************************************
	var tpanelCopCol = add ("tabbedpanel");
	with(tpanelCopCol) {
	  var tabCopier = add ("tab", undefined, infos.tabCopTxt);
	  with(tabCopier) {

		var groupeSource = add("panel", undefined, infos.gSource);
		with (groupeSource) {
			alignment = ["fill", "auto"];
			alignChildren = "left";
			orientation = "row";

			var choisir_txt = add('statictext', undefined, infos.choisir);
			var mymenu = add('dropdownlist',undefined,undefined,{items:mystring});
				mymenu.helpTip = infos.h1;
				mymenu.helpTip += infos.h2;
			mymenu.selection = 0;

		}

		var groupeBas1 = add("panel", undefined, infos.contenu);
		with (groupeBas1) {
				alignment = ["fill", "auto"];
				//alignChildren = "left";
				orientation = "row";
				preferredSize = [cWidth*4,25];

				var nbG_txt = add('statictext', undefined, infos.nbG);
					nbG_txt.preferredSize = [105,25];
				var nbI_txt = add('statictext', undefined, infos.nbI); 
					nbI_txt.preferredSize = [105,25];
				var nbL_txt = add('statictext', undefined, infos.nbL);
		}


		// tabs copier (GREP, Imbr, Lignes)
		// tabs copy (GREP, Imbr, Lines)
		//********************************************
		//********************************************
		var tpanelCop = add ("tabbedpanel");
		with(tpanelCop) {
			alignChildren = ["fill", "fill"];
			preferredSize = sizeTabl;

			// var myList =w.add ("listbox", undefined, ["one", "two", "three"], {multiselect: true});


			// tab GREP
			//********************************************
			var tabGrep =add ("tab", undefined, infos.tabG);
			with(tabGrep) {
				alignChildren = "fill";

				var gTableau = add ("listbox", undefined, "",{
					numberOfColumns: 4, showHeaders: true,
					columnTitles: infos.col1});
					gTableau.preferredSize = sizeTabl;
			}


			// tab IMBRIQUES /  nested
			//********************************************
			var tabImbriques =add ("tab", undefined, infos.tabI);
			with(tabImbriques) {
				alignChildren = "fill";

				var iTableau = add ("listbox", undefined, "",{
					numberOfColumns: 6, showHeaders: true,
					columnTitles: infos.col2});
					iTableau.preferredSize = sizeTabl;
			} // tabImbriques



			// tab LIGNES / lines
			//********************************************
			var tabLignes =add ("tab", undefined, infos.tabL);
			with(tabLignes) {
				alignChildren = "fill";

				var lTableau = add ("listbox", undefined, "",{
					numberOfColumns: 5, showHeaders: true,
					columnTitles: infos.col3});
					lTableau.preferredSize = sizeTabl;
			}

		} // end tpanel
		tpanelCop.selection = tabGrep;
		// nestedGrepStyles // styles Grep
		// nestedLineStyles // dans lettrines et styles imbriques
		// nestedStyles // lettrines et styles imbriques
		var saveBtn = add("button", undefined, infos.saveB); //, {name:"test"});
			saveBtn.helpTip =  infos.sh1;
			saveBtn.helpTip += infos.sh2;
			saveBtn.helpTip += infos.sh3;


		mymenu.onChange = function() {

			var myresult = myStyles[parseInt(mymenu.selection)];

			nbG_txt.text = myresult.nestedGrepStyles.length + infos.nbGt ;
			nbI_txt.text = myresult.nestedStyles.length + infos.nbIt ;
			nbL_txt.text =  myresult.nestedLineStyles.length + infos.nbLt;

			gTableau.removeAll();
			for (var i = 0; i < myresult.nestedGrepStyles.length; i++) {

				with (gTableau.add ("item", myresult.nestedGrepStyles[i].index)) {
					subItems[0].text = repTrad(myresult.nestedGrepStyles[i].isValid);
					subItems[1].text = myresult.nestedGrepStyles[i].appliedCharacterStyle.name;
					subItems[2].text = myresult.nestedGrepStyles[i].grepExpression;
				}
			}

			iTableau.removeAll();
			for (var i = 0; i < myresult.nestedStyles.length; i++) {

				with (iTableau.add ("item", myresult.nestedStyles[i].index)) {
					subItems[0].text = repTrad(myresult.nestedStyles[i].isValid);
					subItems[1].text = myresult.nestedStyles[i].appliedCharacterStyle.name;
					subItems[2].text = incTrad(myresult.nestedStyles[i].inclusive);
					subItems[3].text = myresult.nestedStyles[i].repetition;
					subItems[4].text = delimTr(myresult.nestedStyles[i].delimiter);
				}
			}

			lTableau.removeAll();
			for (var i = 0; i < myresult.nestedLineStyles.length; i++) {

				with (lTableau.add ("item", myresult.nestedLineStyles[i].index)) {
					subItems[0].text = repTrad(myresult.nestedLineStyles[i].isValid);
					subItems[1].text = myresult.nestedLineStyles[i].appliedCharacterStyle.name;
					subItems[2].text = infos.sur + myresult.nestedLineStyles[i].lineCount + infos.lgn;
					subItems[3].text = myresult.nestedLineStyles[i].repeatLast;
				}
			}
		}
	  } // tabCopier





		// tabs coller (GREP, Imbr, Lignes)
		// tabs paste  (GREP, nested, Lines)
		//********************************************
	  var tabColler =add ("tab", undefined, infos.tabColler);
	  with(tabColler) {

		// tabs copier (GREP, Imbr, Lignes)
		// tabs copy   (GREP, nested, Lines)
		//********************************************
		//********************************************
		var tpanelCol = add ("tabbedpanel");
		with(tpanelCol) {
			alignChildren = ["fill", "fill"];
			preferredSize = sizeTabl2;

			// tab GREP2
			//********************************************
			var tabGrep2 =add ("tab", undefined, infos.grep2);
			with(tabGrep2) {
				alignChildren = "fill";

				var gTableau2 = add ("listbox", undefined, "",{
					numberOfColumns: 4, showHeaders: true,
					columnTitles: infos.grep2c,
					multiselect: true});
					gTableau2.preferredSize = sizeTabl2;

					if (g_Liste.listSize > 0) {

						for (var i = 0; i < g_Liste.listSize; i++) {
							with (gTableau2.add ("item", g_Liste.l[i].nom)) {
								subItems[0].text = repTrad(g_Liste.l[i].isValid);
								subItems[1].text = g_Liste.l[i].appliedChStyle;
								subItems[2].text = g_Liste.l[i].grep;
							}
						}
					}
			} // tabGREP2


			// tab IMBRIQUES2 / NESTED2
			//********************************************
			var tabImbriques2 =add ("tab", undefined, infos.tabImb);
			with(tabImbriques2) {
				alignChildren = "fill";

				var iTableau2 = add ("listbox", undefined, "",{
					numberOfColumns: 6, showHeaders: true,
					columnTitles: infos.tabImbc,
					multiselect: true});
					iTableau2.preferredSize = sizeTabl2;

					if (i_Liste.listSize > 0) {

						for (var i = 0; i < i_Liste.listSize; i++) {
							with (iTableau2.add ("item", i_Liste.l[i].nom)) {
								subItems[0].text = repTrad(i_Liste.l[i].isValid);
								subItems[1].text = i_Liste.l[i].appliedChStyle;
								subItems[2].text = incTrad(i_Liste.l[i].inclusive);
								subItems[3].text = i_Liste.l[i].repetition;
								subItems[4].text = delimInDesign(i_Liste.l[i].delimiter);
							}
						}
					}

			} // tabImbriques2



			// tab LIGNES2 / LINES2
			//********************************************
			var tabLignes2 =add ("tab", undefined, infos.tabLig);
			with(tabLignes2) {
				alignChildren = "fill";

				var lTableau2 = add ("listbox", undefined, "",{
					numberOfColumns: 5, showHeaders: true,
					columnTitles: infos.tabLigc,
					multiselect: true});
					lTableau2.preferredSize = sizeTabl2;

					if (l_Liste.listSize > 0) {

						for (var i = 0; i < l_Liste.listSize; i++) {
							with (lTableau2.add ("item", l_Liste.l[i].nom)) {
								subItems[0].text = repTrad(l_Liste.l[i].isValid);
								subItems[1].text = l_Liste.l[i].appliedChStyle;
								subItems[2].text = infos.sur + l_Liste.l[i].nbLignes + infos.lgn;
								subItems[3].text = l_Liste.l[i].repetition;
							}
						}
					}

			} // tabLIGNES2

		} // fin tpanel
		tpanelCol.selection = tabGrep2;







		// bouton supprimer / button delete
		//*************************************
		var suppBtn = add("button", undefined, infos.butS);
			suppBtn.helpTip = infos.butSh;
		var question3 = infos.q3;

		suppBtn.onClick = function(){
			if (tpanelCol.selection == tabGrep2) {
				var sel1 = (gTableau2.selection !== null) ? gTableau2.selection : -1;
				if (sel1.length > 0) { // sel = array nom des styles
					var n = confirm(question3);
					if (n != null) {
						for (var i =sel1.length-1; i > -1; i--) {
							var cur = g_Liste.l_find(sel1[i].text);
							del_Liste[0].push(cur.nom);
						}
					}
				}
			}
			if (tpanelCol.selection == tabImbriques2) {
				var sel1 = (iTableau2.selection !== null) ? iTableau2.selection : -1;
				if (sel1.length > 0) { // sel = array nom des styles
					var n = confirm(question3);
					if (n != null) {
						for (var i =sel1.length-1; i > -1; i--) {
							var cur = i_Liste.l_find(sel1[i].text);
							del_Liste[1].push(cur.nom);
						}
					}
				}
			}
			if (tpanelCol.selection == tabLignes2) {
				var sel1 = (lTableau2.selection !== null) ? lTableau2.selection : -1;
				if (sel1.length > 0) { // sel = array nom des styles
					var n = confirm(question3);
					if (n != null) {
						for (var i =sel1.length-1; i > -1; i--) {
							var cur = l_Liste.l_find(sel1[i].text);
							del_Liste[2].push(cur.nom);
						}
					}
				}
			}
		};
		// add ("panel", [0,0,200,3]);

		// group replace
		var groupeRempl = add("panel", undefined, infos.gRep);
		with (groupeRempl) {
			alignment = ["fill", "auto"];
			alignChildren = "left";
			orientation = "row";

			var choisir2_txt = add('statictext', undefined, infos.choi);
			var mymenu2 = add('dropdownlist',undefined,undefined,{items:mystringc});
			mymenu2.helpTip = infos.hlp1;
			mymenu2.helpTip += infos.hlp2;
			mymenu2.selection = 0;

		}
		// group target
		var groupeDestin = add("panel", undefined, infos.gpD);
		with(groupeDestin) {
			alignment = ["fill", "auto"];
			alignChildren = "left";
			orientation = "row";
			//var choisir_txt2 = add('statictext', undefined, 'Choisir un/des style(s) :');
			var select = add ("listbox", [0, 0, 350, 200], pStyleStringList, {scrolling: true, multiselect: true});
		}
		var colleBtn = add("button", undefined, infos.butT);
			colleBtn.helpTip = infos.butTh1;
			colleBtn.helpTip += infos.butTh2;
			colleBtn.helpTip += infos.butTh3;

	  }


	  // action bouton enregister
	  // action button save
	  //*********************************
	  //*********************************
	var er_msg = infos.emsg;

	var pattName=/[\\^$.*+?()[\]\/\&'"@\?,\#%+~;:\.\\{}|=!<>:°‘’“”•… «»\r\n\u2009]/g;
	saveBtn.onClick = function(){
		sel = -1;
		var question = infos.q4;
		var nomDeft = infos.nmD;
		var nomPal = infos.nmP;

		if (tpanelCop.selection == tabGrep) {
			sel = (gTableau.selection !== null) ? gTableau.selection : -1;
			if (sel != -1) {
				// on attend un nom valide ou une annulation
				var n = "";
				do {
					n = prompt(question, nomDeft, nomPal);
				} while(n != null && g_Liste.l_checkNomExist(n) == true) ;

				if (n != null) {
					n = n.replace(pattName, "");

					var myres = myStyles[parseInt(mymenu.selection)];
			//		alert(myres.nestedGrepStyles[sel].appliedCharacterStyle.name.toSource());

					var t = g_Liste.add(n, myres.nestedGrepStyles[sel].isValid,
								myres.nestedGrepStyles[sel].appliedCharacterStyle.name,
								myres.nestedGrepStyles[sel].grepExpression
								);
					if (t) {
						with (gTableau2.add ("item", n)) {
							subItems[0].text = repTrad(myres.nestedGrepStyles[sel].isValid);
							subItems[1].text = myres.nestedGrepStyles[sel].appliedCharacterStyle.name;
							subItems[2].text = myres.nestedGrepStyles[sel].grepExpression;
						}
					}
					else alert(er_msg);
				}
			}
		}
		if (tpanelCop.selection == tabImbriques) {
			sel = (iTableau.selection !== null) ? iTableau.selection : -1;
			if (sel != -1) {
				// on attend un nom valide ou une annulation
				var n = "";
				do {
					n = prompt(question, nomDeft, nomPal);
				} while(n != null && i_Liste.l_checkNomExist(n) == true) ;

				if (n != null) {
					n = n.replace(pattName, "");

					var myres = myStyles[parseInt(mymenu.selection)];

					var t = i_Liste.add(n,
								myres.nestedStyles[sel].isValid,
								myres.nestedStyles[sel].appliedCharacterStyle.name,
								myres.nestedStyles[sel].delimiter,
								myres.nestedStyles[sel].inclusive,
								myres.nestedStyles[sel].repetition
								);
					if (t) {
						with (iTableau2.add ("item", n)) {
							subItems[0].text = repTrad(myres.nestedStyles[sel].isValid);
							subItems[1].text = myres.nestedStyles[sel].appliedCharacterStyle.name;
							subItems[2].text = myres.nestedStyles[sel].delimiter; // delimTr(myresult.nestedStyles[i].delimiter);
							subItems[3].text = repTrad(myres.nestedStyles[sel].inclusive);
							subItems[4].text = myres.nestedStyles[sel].repetition;
						}
					}
					else alert(er_msg);
				}
			}
		}
		if (tpanelCop.selection == tabLignes) {
			sel = (lTableau.selection !== null) ? lTableau.selection : -1;
			if (sel != -1) {
				// on attend un nom valide ou une annulation
				// get a valid name or annulation
				var n = "";
				do {
					n = prompt(question, nomDeft, nomPal);
				} while(n != null && l_Liste.l_checkNomExist(n) == true) ;

				if (n != null) {
					n = n.replace(pattName, "");

					var myres = myStyles[parseInt(mymenu.selection)];

					var t = l_Liste.add(n, 
								myres.nestedLineStyles[sel].isValid,
								myres.nestedLineStyles[sel].appliedCharacterStyle.name,
								myres.nestedLineStyles[sel].lineCount,
								myres.nestedLineStyles[sel].repeatLast
								);
					if (t) {
						with (lTableau2.add ("item", n)) {
							subItems[0].text = repTrad(myres.nestedLineStyles[sel].isValid);
							subItems[1].text = myres.nestedLineStyles[sel].appliedCharacterStyle.name;
							subItems[2].text = myres.nestedLineStyles[sel].lineCount;
							subItems[3].text = myres.nestedLineStyles[sel].repeatLast;
						}
					}
					else alert(er_msg);
				}
			}
		}
	};


	  // action bouton coller/transferer
	  //*********************************
	  //*********************************
		colleBtn.onClick = function(){

			sel = -1;
			//var sel1 = (gTableau2.selection !== null) ? gTableau2.selection : -1;

			appliedCSDefault = myStylesc[parseInt(mymenu2.selection)];
			var question2 = infos.q2;
			var mySelection = select.selection;
			var selectedStylesIdx = []; // = selectpStyle() retour
			for(g = 0; g < mySelection.length; g++){
				selectedStylesIdx.push(mySelection[g].index);
			}
			selectedStylesNames = getSelectedpStyleNames(selectedStylesIdx);


			if (tpanelCol.selection == tabGrep2) {
				typeS = "g";
				sel = (gTableau2.selection !== null) ? gTableau2.selection : -1;
				if (sel.length > 0) { // sel = array nom des styles
					var n = confirm(question2);
					if (n != null) {
						transfert = true;
					}
				}
			}
			if (tpanelCol.selection == tabImbriques2) {
				typeS = "i";
				sel = (iTableau2.selection !== null) ? iTableau2.selection : -1;
				if (sel.length > 0) { // sel = array nom des styles
					var n = confirm(question2);
					if (n != null) {
						transfert = true;
					}
				}
			}
			if (tpanelCol.selection == tabLignes2) {
				typeS = "l";
				sel = (lTableau2.selection !== null) ? lTableau2.selection : -1;
				if (sel.length > 0) { // sel = array nom des styles
					var n = confirm(question2);
					if (n != null) {
						transfert = true;
					}
				}
			}
		};
	} // tpanelCopCol
	var okCancelGroup = add("group");
	with (okCancelGroup) {
		orientation = "row";
		var okBtn = add("button", undefined, infos.butOK, {name:"ok"});
		var cancelBtn = add("button", undefined, infos.butC, {name:"cancel"});
	}




	//*******************************************
	}
	// fenetre
	// var dialogResult = mydialog.show();
	return mydialog.show();
}



// fonctions
//******************************************
//******************************************
function fillpStyleStringList(){
		for(i = 0 ; i < pStyles.length; i++){
				if(pStyles[i].parent.parent.toString() === '[object ParagraphStyleGroup]'){
						pStyleStringList.push(infos.Gp + pStyles[i].parent.parent.name + ', ' + infos.Gp + infos.sGp + pStyles[i].parent.name + ', ' + infos.nGp + pStyles[i].name);
				}else if(pStyles[i].parent.toString() === '[object ParagraphStyleGroup]'){
						pStyleStringList.push(infos.sGp + pStyles[i].parent.name + ', '+ infos.nGp + pStyles[i].name);
				}else{
						pStyleStringList.push(infos.nGp + pStyles[i].name);
				}
		}
}

//alert("array : " + SelectedNameArray);
///// style Nom: Style de paragraphe 1
// 		Adobe InDesign,Sans titre-1.indd,Style de paragraphe 1
///// style Sous-groupe: Encadré, Nom: Encadré titre
// 		Sans titre-1.indd,Encadré,Encadré titre
function getSelectedpStyleNames(selectedIdx){
	var currentTargetpStyleName, currentTargetpStyleSubgroup, currentTargetpStyleGroup;
	var SelectedNameArray = [];
	for(j = 0; j < selectedIdx.length; j++){
		var tempArray = new Array(2);
		currentTargetpStyleName = pStyles[selectedIdx[j]].name;
		currentTargetpStyleSubgroup = pStyles[selectedIdx[j]].parent.name;
		currentTargetpStyleGroup = pStyles[selectedIdx[j]].parent.parent.name;
		tempArray[0] = currentTargetpStyleGroup;
		tempArray[1] = currentTargetpStyleSubgroup;
		tempArray[2] = currentTargetpStyleName;
		SelectedNameArray[j] = tempArray;
		}
		return SelectedNameArray;
}

function mySetGrepStyle(targetGroup, targetSubgroup, targetName, objStyles){
	var target, error = "";

	var t = objStyles.t;
	if (!objStyles.isValid) error = infos.err;

	if(targetGroup != "" && targetGroup != theDoc.name && targetGroup != app.name){
		var temptarget = theDoc.paragraphStyleGroups.itemByName(targetGroup.toString());
		target = temptarget.paragraphStyleGroups.itemByName(targetSubgroup.toString()).paragraphStyles.itemByName(targetName.toString());
	}else if(targetSubgroup != "" && targetSubgroup != theDoc.name && targetSubgroup != app.name){
		target = theDoc.paragraphStyleGroups.itemByName(targetSubgroup.toString()).paragraphStyles.itemByName(targetName.toString());
	}else{
		target = theDoc.paragraphStyles.itemByName(targetName.toString());
	}
	if (!target.isValid) error += infos.err1;
	if (error != ""){alert(error);}
	if (t === "g") {
		try{
			target.nestedGrepStyles.add ({
				isValid: (objStyles.isValid) ? true : false,
				appliedCharacterStyle: theDoc.characterStyles.itemByName(objStyles.appliedChStyle.toString()),
				grepExpression: objStyles.grep
			});
		} catch(e) {
			target.nestedGrepStyles.add ({
				isValid: (objStyles.isValid) ? true : false,
				appliedCharacterStyle: appliedCSDefault,
				grepExpression: objStyles.grep
			});
			// alert(e + "\r\rLe style '" + objStyles.appliedChStyle + "' n'existe pas.\rIl a été remplacé par '"+ appliedCSDefault.name + "'." );
		}
	}
	if (t === "i") {
		try{
			target.nestedStyles.add ({
				isValid: (objStyles.isValid) ? true : false,
				appliedCharacterStyle: theDoc.characterStyles.itemByName(objStyles.appliedChStyle.toString()),
				delimiter: delimInDesignObj(objStyles.delimiter),
				inclusive: (objStyles.inclusive) ? true : false,
				repetition: parseInt(objStyles.repetition)
			});
		} catch(e) {
			target.nestedStyles.add ({
				isValid: (objStyles.isValid) ? true : false,
				appliedCharacterStyle: appliedCSDefault,
				delimiter: delimInDesignObj(objStyles.delimiter),
				inclusive: (objStyles.inclusive) ? true : false,
				repetition: parseInt(objStyles.repetition)
			});
			// alert(e + "\r\rLe style '" + objStyles.appliedChStyle + "' n'existe pas.\rIl a été remplacé par '"+ appliedCSDefault.name + "'." );
		}
	}
	if (t === "l") {
		try{
		target.nestedLineStyles.add ({
			isValid: (objStyles.isValid) ? true : false,
			appliedCharacterStyle: theDoc.characterStyles.itemByName(objStyles.appliedChStyle.toString()),
			lineCount: parseInt(objStyles.nbLignes),
			//repeatLast: parseInt(objStyles.repetition) // bug
			});
		} catch(e) {
			target.nestedLineStyles.add ({
				isValid: (objStyles.isValid) ? true : false,
				appliedCharacterStyle: appliedCSDefault,
				lineCount: parseInt(objStyles.nbLignes),
				//repeatLast: parseInt(objStyles.repetition)
			});
			alert(e + infos.myS1 + objStyles.appliedChStyle + infos.myS2+ appliedCSDefault.name + "'." );
		}
	}

}


function myFindFile(myFilePath) {
	var myScriptFile = myGetScriptPath();
		myScriptFile = File(myScriptFile);
	var myScriptFolder = myScriptFile.path;
	myFilePath = myScriptFolder + "/" + myFilePath;
	if(File(myFilePath).exists == false) {
		//Display a dialog.
		myFilePath = File.openDialog(infos.path);
	}
	// else alert("ok");
	return myFilePath;
}
function myGetScriptPath() {
	try {
		myFile = app.activeScript;
	}
	catch(myError){
		myFile = myError.fileName;
	}
	return myFile;
}
function writeToFile(zeFile, myText, rewriteAll) {
	var myScriptFile = myGetScriptPath();
		myScriptFile = File(myScriptFile);
	var myScriptFolder = myScriptFile.path;
	var myFile = new File(myScriptFolder + "/"  + zeFile);
	if ( myFile.exists && rewriteAll == undefined) {
		myFile.open("e");
		myFile.seek(0, 2);
	}
	else {
		myFile.open("w");
		//myText = nTest + "\n" + myText;
	}
	myFile.write(myText);
	myFile.close();
}




function repTrad(v){ return (v) ? rep.y : rep.n; }
function incTrad(v){ return (v) ? inc.s : inc.j; }



function delimTr(w){
	//alert("ANY_WORD" == w.toString());
	switch (w.toString()) {
		case "ANY_CHARACTER" :		return delim.1380541539; break;
		case "ANY_WORD" : 			return delim.1380541559; break;
		case "AUTO_PAGE_NUMBER" : 	return delim.1396797550; break;
		case "DIGITS" : 			return delim.1380541540; break;
		case "DROPCAP" : 			return delim.1380541507; break; // pas traduit ni dans liste
		case "EM_SPACE" : 			return delim.1397058899; break;
		case "END_NESTED_STYLE" : 	return delim.1396855379; break;
		case "EN_SPACE" : 			return delim.1397059155; break;
		case "FORCED_LINE_BREAK" : 	return delim.1397124194; break;
		case "INDENT_HERE_TAB" : 	return delim.1397319796; break;
		case "INLINE_GRAPHIC" : 	return delim.1380541545; break;
		case "LETTERS" : 			return delim.1380541548; break;
		case "NONBREAKING_SPACE" : 	return delim.1397645907; break;
		case "REPEAT" : 			return delim.1380545132; break; // pas traduit ni dans liste
		case "SECTION_MARKER" : 	return delim.1400073805; break;
		case "SENTENCE" : 			return delim.1380541555; break;
		case "TABS" : 				return delim.1380541556; break;
		default: return w;
	}
}
function delimInDesign(w){
	//alert("ANY_WORD" == w.toString());
	switch (w.toString()) {
		case "1380541539" : return delim.1380541539; break; // "ANY_CHARACTER" NestedStyleDelimiters.ANY_CHARACTER
		case "1380541559" : return delim.1380541559; break; //  "ANY_WORD"
		case "1396797550" : return delim.1396797550; break;	//  "AUTO_PAGE_NUMBER"
		case "1380541540" : return delim.1380541540; break; //  "DIGITS"
		case "1380541507" : return delim.1380541507; break; // "DROPCAP"
		case "1397058899" : return delim.1397058899; break;	// "EM_SPACE"
		case "1396855379" : return delim.1396855379; break; //  "END_NESTED_STYLE"
		case "1397059155" : return delim.1397059155; break; //  "EN_SPACE"
		case "1397124194" : return delim.1397124194; break;	// "FORCED_LINE_BREAK"
		case "1397319796" : return delim.1397319796; break;	//  "INDENT_HERE_TAB"
		case "1380541545" : return delim.1380541545; break; //  "INLINE_GRAPHIC"
		case "1380541548" : return delim.1380541548; break; //  "LETTERS"
		case "1397645907" : return delim.1397645907; break; // "NONBREAKING_SPACE"
		case "1380545132" : return delim.1380545132; break; // "REPEAT"
		case "1400073805" : return delim.1400073805; break; // "SECTION_MARKER"
		case "1380541555" : return delim.1380541555; break; //  "SENTENCE"
		case "1380541556" : return delim.1380541556; break; // "TABS"
		default: return w;
	}
}


function delimInDesignObj(w){
	//alert("ANY_WORD" == w.toString());
	switch (w.toString()) {
		case "1380541539" : return NestedStyleDelimiters.ANY_CHARACTER; break; 		// "ANY_CHARACTER" NestedStyleDelimiters.ANY_CHARACTER
		case "1380541559" : return NestedStyleDelimiters.ANY_WORD; break; 			//  "ANY_WORD"
		case "1396797550" : return NestedStyleDelimiters.AUTO_PAGE_NUMBER; break;	//  "AUTO_PAGE_NUMBER"
		case "1380541540" : return NestedStyleDelimiters.DIGITS; break; 			//  "DIGITS"
		case "1380541507" : return NestedStyleDelimiters.DROPCAP; break; 			// "DROPCAP"
		case "1397058899" : return NestedStyleDelimiters.EM_SPACE; break;			// "EM_SPACE"
		case "1396855379" : return NestedStyleDelimiters.END_NESTED_STYLE; break; 	//  "END_NESTED_STYLE"
		case "1397059155" : return NestedStyleDelimiters.EN_SPACE; break; 			//  "EN_SPACE"
		case "1397124194" : return NestedStyleDelimiters.FORCED_LINE_BREAK; break;	// "FORCED_LINE_BREAK"
		case "1397319796" : return NestedStyleDelimiters.INDENT_HERE_TAB; break;	//  "INDENT_HERE_TAB"
		case "1380541545" : return NestedStyleDelimiters.INLINE_GRAPHIC; break; 	//  "INLINE_GRAPHIC"
		case "1380541548" : return NestedStyleDelimiters.LETTERS; break; 			//  "LETTERS"
		case "1397645907" : return NestedStyleDelimiters.NONBREAKING_SPACE; break; 	// "NONBREAKING_SPACE"
		case "1380545132" : return NestedStyleDelimiters.REPEAT; break; 			// "REPEAT"
		case "1400073805" : return NestedStyleDelimiters.SECTION_MARKER; break;	 	// "SECTION_MARKER"
		case "1380541555" : return NestedStyleDelimiters.SENTENCE; break; 			//  "SENTENCE"
		case "1380541556" : return NestedStyleDelimiters.TABS; break; 				// "TABS"
		default: return w;
	}
}




// objets
//**************************************
//**************************************


function aGrepStyle(nom, valid, appCs, regExp) {
	this.t ="g";
	this.nom = nom;
	this.isValid = valid;
	this.appliedChStyle = appCs;
	this.grep = regExp;
}
function anImbriqueStyle(nom, valid, appCs, delimiter, inc, rep) {
	this.t ="i";
	this.nom = nom;
	this.isValid = valid;
	this.appliedChStyle = appCs;
	this.delimiter = delimiter;
	this.inclusive = inc;
	this.repetition = rep;
}
function aLineStyle(nom, valid, appCs, nbL, rep) {
	this.t ="l";
	this.nom = nom;
	this.isValid = valid;
	this.appliedChStyle = appCs;
	this.nbLignes = nbL;
	this.repetition = rep;
}


function G_ListeStyles() {
	this.l = [];
	this.noms = [];
	this.listSize = 0;
	this.pos = 0;
	this.add = add;
	this.l_remove = l_remove;
	this.l_find = l_find;
	this.l_findIdx = l_findIdx;
	this.l_checkNomExist = l_checkNomExist;

	function add(nom, valid, appCs, regExp) {

		var nm = (nom) ? nom : infos.ns;

		if (this.l_checkNomExist(nm) == false) {
			var va = (valid) ? true : false;
			var curr = new aGrepStyle(nm, va, appCs, regExp);
			this.noms.push(nom);
			this.noms.sort();
			var idx = this.l_findIdx(nom);
			if (idx !== false)
				this.l.splice(idx, 0, curr);
			else
				this.l.push(curr);
			this.listSize++;
			return true;
		}
		else return false;
	}
}

function I_ListeStyles() {
	this.l = [];
	this.noms= [];
	this.listSize = 0;
	this.pos = 0;
	this.add = add;
	this.l_remove = l_remove;
	this.l_find = l_find;
	this.l_findIdx = l_findIdx;
	this.l_checkNomExist = l_checkNomExist;

	function add(nom, valid, appCs, delimiter, inc, rep) {

		var nm = (nom) ? nom : infos.ns;

		if (this.l_checkNomExist(nm) == false) {
			var va = (valid) ? true : false;
			var incl = (inc) ? true : false;
			var curr = new anImbriqueStyle(nm, va, appCs, delimiter, incl, rep);
			this.noms.push(nom);
			this.noms.sort();
			var idx = this.l_findIdx(nom);
			if (idx !== false)
				this.l.splice(idx, 0, curr);
			else
				this.l.push(curr);
			this.listSize++;
			return true;
		}
		else return false;
	}
}

function L_ListeStyles() {
	this.l = [];
	this.noms= [];
	this.listSize = 0;
	this.pos = 0;
	this.add = add;
	this.l_remove = l_remove;
	this.l_find = l_find;
	this.l_findIdx = l_findIdx;
	this.l_checkNomExist = l_checkNomExist;

	function add(nom, valid, appCs, nbL, rep) {

		var nm = (nom) ? nom : infos.ns;

		if (this.l_checkNomExist(nm) == false) {
			var va = (valid) ? true : false;
			var curr = new aLineStyle(nm, va, appCs, nbL, rep);
			this.noms.push(nom);
			this.noms.sort();
			var idx = this.l_findIdx(nom);
			if (idx !== false)
				this.l.splice(idx, 0, curr);
			else
				this.l.push(curr);
			this.listSize++;
			return true;
		}
		else return false;
	}
}

function l_checkNomExist(nom) {
	var testn = this.l_findIdx(nom);
	if (testn !== false) return true;
	else return false;
}

function l_remove(nom) {
	var test = this.l_findIdx(nom);
	if (test !== false) {
		this.l.splice(test, 1);
		this.noms.splice(test, 1);
		this.listSize--;
		return true;
	}
	return false;
}
function l_find(n) {
	for (var i = 0; i < this.l.length; i++) {
		if (this.l[i].nom == n) return this.l[i];
	}
	return false;
}

function l_findIdx(n) {
	for ( var i = 0; i < this.noms.length; i++) {
		if (this.noms[i] == n) return i;
	}
	return false;
}

function exportList2Txt(obj){

	if (obj.length > 0) {

		var txt = "";
		if (obj[0].t == "g") {
			for (var i = 0; i < obj.length; i++) {
				txt += "g_nom=" + obj[i].nom + "\n";
				txt += "g_isValid=" + obj[i].isValid + "\n";
				txt += "g_appliedChStyle=" + obj[i].appliedChStyle.toString() + "\n";
				txt += "g_grep=" + obj[i].grep + "\n\n";
			}
		}
		else if (obj[0].t == "i") {
			for (var i = 0; i < obj.length; i++) {
				txt += "i_nom=" + obj[i].nom + "\n";
				txt += "i_isValid=" + obj[i].isValid + "\n";
				txt += "i_appliedChStyle=" + obj[i].appliedChStyle + "\n";
				txt += "i_delimiter=" + obj[i].delimiter + "\n";
				txt += "i_inclusive=" + obj[i].inclusive + "\n";
				txt += "i_repetition=" + obj[i].repetition + "\n\n";
			}
		}
		else if (obj[0].t == "l") {
			for (var i = 0; i < obj.length; i++) {
				txt += "l_nom=" + obj[i].nom + "\n";
				txt += "l_isValid=" + obj[i].isValid + "\n";
				txt += "l_appliedChStyle=" + obj[i].appliedChStyle + "\n";
				txt += "l_nbLignes=" + obj[i].nbLignes + "\n";
				txt += "l_repetition=" + obj[i].repetition + "\n\n";
			}
		}
		//alert(txt);
		return txt;
	}
	//alert(false);
	return false;
}

function listerTxt() {
	// Open the file for reading
	myListeFile.open("r");
	var text = myListeFile.read();
	var paraStyl = text.split("\n\n");

	for (var p = 0; p < paraStyl.length; p++) {

		// on regarde la premiere lettre :
		if (paraStyl[p][0] == "g") {

			var sousPara = paraStyl[p].split("\n");

			if (/^g_nom=/.test(sousPara[0])) {
				var n = sousPara[0].substring(6,sousPara[0].length);

				if (/^g_isValid=/.test(sousPara[1])) {
					var v = sousPara[1].substring(10,sousPara[1].length);
					v = (v == "true") ? true : false;

					if (/^g_appliedChStyle=/.test(sousPara[2])) {
						var cs = sousPara[2].substring(17,sousPara[2].length);

						if (/^g_grep=/.test(sousPara[3])) {
							var g = sousPara[3].substring(7,sousPara[3].length);
							g_Liste.add(n, v, cs, g);
						}
					}
				}

			}
		}
		else if (paraStyl[p][0] == "i") {

			var sousPara = paraStyl[p].split("\n");

			if (/^i_nom=/.test(sousPara[0])) {
				var n = sousPara[0].substring(6,sousPara[0].length);

				if (/^i_isValid=/.test(sousPara[1])) {
					var v = sousPara[1].substring(10,sousPara[1].length);
					v = (v == "true") ? true : false;

					if (/^i_appliedChStyle=/.test(sousPara[2])) {
						var cs = sousPara[2].substring(17,sousPara[2].length);

						if (/^i_delimiter=/.test(sousPara[3])) {
							var d = sousPara[3].substring(12,sousPara[3].length);

							if (/^i_inclusive=/.test(sousPara[4])) {
							var inc = sousPara[4].substring(12,sousPara[4].length);
								inc = (inc == "true") ? true : false;

								if (/^i_repetition=/.test(sousPara[5])) {
									var r = parseInt(sousPara[5].substring(13,sousPara[5].length));

									i_Liste.add(n, v, cs, d, inc, r);
								}
							}
						}
					}
				}

			}
		}
		else if (paraStyl[p][0] == "l") {

			var sousPara = paraStyl[p].split("\n");

			if (/^l_nom=/.test(sousPara[0])) {
				var n = sousPara[0].substring(6,sousPara[0].length);

				if (/^l_isValid=/.test(sousPara[1])) {
					var v = sousPara[1].substring(10,sousPara[1].length);
					v = (v == "true") ? true : false;

					if (/^l_appliedChStyle=/.test(sousPara[2])) {
						var cs = sousPara[2].substring(17,sousPara[2].length);

						if (/^l_nbLignes=/.test(sousPara[3])) {
							var nb = parseInt(sousPara[3].substring(11,sousPara[3].length));

							if (/^l_repetition=/.test(sousPara[4])) {
								var r = parseInt(sousPara[4].substring(13,sousPara[4].length));

								l_Liste.add(n, v, cs, nb, r);
							}
						}
					}
				}
			}
		} // para l
	} // for
}

// on supprime de la liste
//*********************************
if (del_Liste[0].length > 0) {
	for (var i = 0; i < del_Liste[0].length; i++) {
		g_Liste.l_remove(del_Liste[0][i]);
	}
	saveStyles = 1;
}
if (del_Liste[1].length > 0) {
	for (var i = 0; i < del_Liste[1].length; i++) {
		i_Liste.l_remove(del_Liste[1][i]);
	}
	saveStyles = 1;
}
if (del_Liste[2].length > 0) {
	for (var i = 0; i < del_Liste[2].length; i++) {
		l_Liste.l_remove(del_Liste[2][i]);
	}
	saveStyles = 1;
}


// ecriture dans le fichier texte
//*********************************
var ecriture = "", testTX = "";
if (g_Liste.listSize > 0) testTX = exportList2Txt(g_Liste.l);
if (testTX) ecriture += testTX; testTX = "";
if (i_Liste.listSize > 0) testTX = exportList2Txt(i_Liste.l);
if (testTX) ecriture += testTX; testTX = "";
if (l_Liste.listSize > 0) testTX = exportList2Txt(l_Liste.l);
if (testTX) ecriture += testTX;
// 1 = ok, 2 cancel
if (saveStyles == 1 && ecriture !== "") writeToFile(txtListe, ecriture, true); // rewriteAll


alert( ((saveStyles == 1) ? infos.last1 : "") + ((sel.length != undefined) ? sel.length + infos.last2 : infos.last3));

