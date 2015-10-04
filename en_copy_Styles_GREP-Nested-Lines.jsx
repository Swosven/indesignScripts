//===============================================================
//
// Script for InDesign CS3-5.
// juillet 2014
// sw
//
//
// after reading :
// http://indesignsecrets.com/topic/copying-all-grep-styles-from-one-paragraph-style-to-annother

//http://forums.adobe.com/thread/681085 (Ariel's script to select a paragraph style)
//http://forums.adobe.com/message/5888276 (jkorchok2's script to apply grep styles from a predefined paragraph style)
//This utility will copy GREP styles into styles that are nested in up to two levels of groups i.e. Main Style Group>Headings Group>Heading 1

// Help to select and get back/save GREP styles, nested styles or lines styles in a texte file
// Help to copy those saved styles in selected paragraph styles from current document
// Saved styles can be deleted from list

// You need to click "Save", "Copy" or "Delete" first, to confirm action
//
// need text file in same folder : en_copy_listStyles.txt
//================================================================

// Globals
const wScriptName = "Copy/paste GREP, nested and lines styles";
const wScriptVersion = "0.1";

myDoc = app.activeDocument;
var myInDesignVersion = Number(String(app.version).split(".")[0]);

var txtList = "en_copy_listStyles.txt";
var myListFile = File(myFindFile(txtList));

var g_List = new G_ListStyles();
var i_List = new I_ListStyles();
var l_List = new L_ListStyles();
var del_List = [[],[],[]];
listerTxt();
//exit();

var theDoc = app.activeDocument;
var pStyles = theDoc.allParagraphStyles;
var cStyles = theDoc.allCharacterStyles;
var pStyleStringList = [];// listbox
var appliedCSDefault = "[Sans]"; // None

var sel = -1, selectedStylesNames = [], typeS = "", transfert = false;




fillpStyleStringList();
var saveStyles = mainDialog();

if (transfert == true && sel != -1) {

	if (typeS == "g") {
		for (var i =sel.length-1; i > -1; i--) {

			var cur = g_List.l_find(sel[i].text);
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

			var cur = i_List.l_find(sel[i].text);
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

			var cur = l_List.l_find(sel[i].text);
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
// else alert("No style transfer done.");

// (dropdown) all paragraphs styles in a list
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

		// tab Copy styles / Paste styles
		//********************************************
		//********************************************
	var tpanelCopCol = add ("tabbedpanel");
	with(tpanelCopCol) {
	  var tabCopier =add ("tab", undefined, "Save from paragraph style");
	  with(tabCopier) {

		var groupeSource = add("panel", undefined, "Paragraph styles's source");
		with (groupeSource) {
			alignment = ["fill", "auto"];
			alignChildren = "left";
			orientation = "row";

			var choisir_txt = add('statictext', undefined, 'Select a style:');
			var mymenu = add('dropdownlist',undefined,undefined,{items:mystring});
				mymenu.helpTip = "Help visualize GREP |Lines | Nested styles \r";
				mymenu.helpTip += "in 3 next tabs.";
			mymenu.selection = 0;

		}

		var groupeBas1 = add("panel", undefined, "Selected style content:");
		with (groupeBas1) {
				alignment = ["fill", "auto"];
				orientation = "row";
				preferredSize = [cWidth*4,25];

				var nbG_txt = add('statictext', undefined, "? GREP");
					nbG_txt.preferredSize = [105,25];
				var nbI_txt = add('statictext', undefined, "? Nested"); 
					nbI_txt.preferredSize = [105,25];
				var nbL_txt = add('statictext', undefined, "? Lines");
		}


		// tabs copy (GREP, Emb, Lines)
		//********************************************
		//********************************************
		var tpanelCop = add ("tabbedpanel");
		with(tpanelCop) {
			alignChildren = ["fill", "fill"];
			preferredSize = sizeTabl;

			// var myList =w.add ("listbox", undefined, ["one", "two", "three"], {multiselect: true});


			// tab GREP
			//********************************************
			var tabGrep =add ("tab", undefined, "GREP");
			with(tabGrep) {
				alignChildren = "fill";

				var gTableau = add ("listbox", undefined, "",{
					numberOfColumns: 4, showHeaders: true,
					columnTitles: ["No", "Valid", "Applied Style", "Grep"]});
					gTableau.preferredSize = sizeTabl;
			}


			// tab EMBEDDED
			//********************************************
			var tabImbriques =add ("tab", undefined, "Nested");
			with(tabImbriques) {
				alignChildren = "fill";

				var iTableau = add ("listbox", undefined, "",{
					numberOfColumns: 6, showHeaders: true,
					columnTitles: ["No", "Valid", "Applied Style", "Inclusive", "Repeat", "Delimiter"]});
					iTableau.preferredSize = sizeTabl;
			} // tabImbriques



			// tab LINES
			//********************************************
			var tabLignes =add ("tab", undefined, "Lines");
			with(tabLignes) {
				alignChildren = "fill";

				var lTableau = add ("listbox", undefined, "",{
					numberOfColumns: 5, showHeaders: true,
					columnTitles: ["No", "Valid", "Applied Style", "Lines count", "Repeat"]});
					lTableau.preferredSize = sizeTabl;
			}

		} // fin tpanel
		tpanelCop.selection = tabGrep;
		// nestedGrepStyles // styles Grep
		// nestedLineStyles // Drop caps & nested styles
		// nestedStyles // Drop caps & nested styles
		var saveBtn = add("button", undefined, "Save", {name:"test"});
			saveBtn.helpTip = "GREP | Nested | Lines styles\r";
			saveBtn.helpTip += "selected in list from 'Paste styles', \r";
			saveBtn.helpTip += "are saved as text file if clicked.";


		mymenu.onChange = function() {

			var myresult = myStyles[parseInt(mymenu.selection)];

			nbG_txt.text = myresult.nestedGrepStyles.length + " GREP" ;
			nbI_txt.text = myresult.nestedStyles.length + " Nested" ;
			nbL_txt.text =  myresult.nestedLineStyles.length + " Lines";

			gTableau.removeAll();
			for (var i = 0; i < myresult.nestedGrepStyles.length; i++) {

				with (gTableau.add ("item", myresult.nestedGrepStyles[i].index)) {
					subItems[0].text = repFr(myresult.nestedGrepStyles[i].isValid);
					subItems[1].text = myresult.nestedGrepStyles[i].appliedCharacterStyle.name;
					subItems[2].text = myresult.nestedGrepStyles[i].grepExpression;
				}
			}

			iTableau.removeAll();
			for (var i = 0; i < myresult.nestedStyles.length; i++) {

				with (iTableau.add ("item", myresult.nestedStyles[i].index)) {
					subItems[0].text = repFr(myresult.nestedStyles[i].isValid);
					subItems[1].text = myresult.nestedStyles[i].appliedCharacterStyle.name;
					subItems[2].text = incFr(myresult.nestedStyles[i].inclusive);
					subItems[3].text = myresult.nestedStyles[i].repetition;
					subItems[4].text = delimFr(myresult.nestedStyles[i].delimiter);
				}
			}

			lTableau.removeAll();
			for (var i = 0; i < myresult.nestedLineStyles.length; i++) {

				with (lTableau.add ("item", myresult.nestedLineStyles[i].index)) {
					subItems[0].text = repFr(myresult.nestedLineStyles[i].isValid);
					subItems[1].text = myresult.nestedLineStyles[i].appliedCharacterStyle.name;
					subItems[2].text = " on " + myresult.nestedLineStyles[i].lineCount + " line(s)";
					subItems[3].text = myresult.nestedLineStyles[i].repeatLast;
				}
			}
		}
	  } // tabCopier





		// tabs paste (GREP, Imbr, Lignes)
		//********************************************
	  var tabColler =add ("tab", undefined, "Paste saved style(s) to paragraph style(s)");
	  with(tabColler) {

		// tabs copier (GREP, Imbr, Lignes)
		//********************************************
		//********************************************
		var tpanelCol = add ("tabbedpanel");
		with(tpanelCol) {
			alignChildren = ["fill", "fill"];
			preferredSize = sizeTabl2;

			// tab GREP2
			//********************************************
			var tabGrep2 =add ("tab", undefined, "Saved GREP styles");
			with(tabGrep2) {
				alignChildren = "fill";

				var gTableau2 = add ("listbox", undefined, "",{
					numberOfColumns: 4, showHeaders: true,
					columnTitles: ["Name", "Valid", "Applied style", "GREP"],
					multiselect: true});
					gTableau2.preferredSize = sizeTabl2;

					if (g_List.listSize > 0) {

						for (var i = 0; i < g_List.listSize; i++) {
							with (gTableau2.add ("item", g_List.l[i].name)) {
								subItems[0].text = repFr(g_List.l[i].isValid);
								subItems[1].text = g_List.l[i].appliedChStyle;
								subItems[2].text = g_List.l[i].grep;
							}
						}
					}
			} // tabGREP2


			// tab IMBRIQUES2
			//********************************************
			var tabImbriques2 =add ("tab", undefined, "Saved nested styles");
			with(tabImbriques2) {
				alignChildren = "fill";

				var iTableau2 = add ("listbox", undefined, "",{
					numberOfColumns: 6, showHeaders: true,
					columnTitles: ["Name", "Valid", "Applied style", "Inclusive", "Repeat", "Delimiter"],
					multiselect: true});
					iTableau2.preferredSize = sizeTabl2;

					if (i_List.listSize > 0) {

						for (var i = 0; i < i_List.listSize; i++) {
							with (iTableau2.add ("item", i_List.l[i].name)) {
								subItems[0].text = repFr(i_List.l[i].isValid);
								subItems[1].text = i_List.l[i].appliedChStyle;
								subItems[2].text = incFr(i_List.l[i].inclusive);
								subItems[3].text = i_List.l[i].repetition;
								subItems[4].text = delimInDesign(i_List.l[i].delimiter);
							}
						}
					}

			} // tabImbriques2



			// tab LIGNES2
			//********************************************
			var tabLignes2 =add ("tab", undefined, "Saved line styles");
			with(tabLignes2) {
				alignChildren = "fill";

				var lTableau2 = add ("listbox", undefined, "",{
					numberOfColumns: 5, showHeaders: true,
					columnTitles: ["Name", "Valid", "Applied style", "On x lignes", "Repeat"],
					multiselect: true});
					lTableau2.preferredSize = sizeTabl2;

					if (l_List.listSize > 0) {

						for (var i = 0; i < l_List.listSize; i++) {
							with (lTableau2.add ("item", l_List.l[i].name)) {
								subItems[0].text = repFr(l_List.l[i].isValid);
								subItems[1].text = l_List.l[i].appliedChStyle;
								subItems[2].text = " sur " + l_List.l[i].nbLines + " line(s)";
								subItems[3].text = l_List.l[i].repetition;
							}
						}
					}

			} // tabLIGNES2

		} // fin tpanel
		tpanelCol.selection = tabGrep2;







		// delete button
		//*************************************
		var suppBtn = add("button", undefined, "Delete selected style(s)");
			suppBtn.helpTip = "Delete style(s) from saved text file.";
		var question3 = "Delete thoses styles?";

		suppBtn.onClick = function(){
			if (tpanelCol.selection == tabGrep2) {
				var sel1 = (gTableau2.selection !== null) ? gTableau2.selection : -1;
				if (sel1.length > 0) { // sel = array styles name
					var n = confirm(question3);
					if (n != null) {
						for (var i =sel1.length-1; i > -1; i--) {
							var cur = g_List.l_find(sel1[i].text);
							del_List[0].push(cur.name);
						}
					}
				}
			}
			if (tpanelCol.selection == tabImbriques2) {
				var sel1 = (iTableau2.selection !== null) ? iTableau2.selection : -1;
				if (sel1.length > 0) { // sel = array styles name
					var n = confirm(question3);
					if (n != null) {
						for (var i =sel1.length-1; i > -1; i--) {
							var cur = i_List.l_find(sel1[i].text);
							del_List[1].push(cur.name);
						}
					}
				}
			}
			if (tpanelCol.selection == tabLignes2) {
				var sel1 = (lTableau2.selection !== null) ? lTableau2.selection : -1;
				if (sel1.length > 0) { // sel = array styles name
					var n = confirm(question3);
					if (n != null) {
						for (var i =sel1.length-1; i > -1; i--) {
							var cur = l_List.l_find(sel1[i].text);
							del_List[2].push(cur.name);
						}
					}
				}
			}
		};
		// add ("panel", [0,0,200,3]);

		var groupeRempl = add("panel", undefined, "Replace with character style:");
		with (groupeRempl) {
			alignment = ["fill", "auto"];
			alignChildren = "left";
			orientation = "row";

			var choisir2_txt = add('statictext', undefined, 'Select:');
			var mymenu2 = add('dropdownlist',undefined,undefined,{items:mystringc});
			mymenu2.helpTip += "Will aply this selected character style \r";
			mymenu2.helpTip += "if former character style doesn't exist in the document.";
			mymenu2.selection = 0;

		}
		var groupeDestin = add("panel", undefined, "Copy to selected paragraph styles:");
		with(groupeDestin) {
			alignment = ["fill", "auto"];
			alignChildren = "left";
			orientation = "row";
			var select = add ("listbox", [0, 0, 350, 200], pStyleStringList, {scrolling: true, multiselect: true});
		}
		var colleBtn = add("button", undefined, "Copy");
			colleBtn.helpTip = "Save transfer of selected style(s) from top panel,\r";
			colleBtn.helpTip += "to selected paragraph styles in bottom panel.\r";
			colleBtn.helpTip += "On click, transfer the style.";
	  }



	  // action bouton enregister
	  //*********************************
	  //*********************************
	var er_msg = "Unable to save the style.";

	var pattName=/[\\^$.*+?()[\]\/\&'"@\?,\#%+~;:\.\\{}|=!<>:°‘’“”•… «»\r\n\u2009]/g;
	saveBtn.onClick = function(){
		sel = -1;
		var question = "Save this style?";
		var nomDeft = "Style name";
		var nomPal = "Select a style name";

		if (tpanelCop.selection == tabGrep) {
			sel = (gTableau.selection !== null) ? gTableau.selection : -1;
			if (sel != -1) {
				// valid name or cancel
				var n = "";
				do {
					n = prompt(question, nomDeft, nomPal);
				} while(n != null && g_List.l_checkNameExists(n) == true) ;

				if (n != null) {
					n = n.replace(pattName, "");

					var myres = myStyles[parseInt(mymenu.selection)];
			//		alert(myres.nestedGrepStyles[sel].appliedCharacterStyle.name.toSource());

					var t = g_List.add(n, myres.nestedGrepStyles[sel].isValid,
								myres.nestedGrepStyles[sel].appliedCharacterStyle.name,
								myres.nestedGrepStyles[sel].grepExpression
								);
					if (t) {
						with (gTableau2.add ("item", n)) {
							subItems[0].text = repFr(myres.nestedGrepStyles[sel].isValid);
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
				// valid name or cancel
				var n = "";
				do {
					n = prompt(question, nomDeft, nomPal);
				} while(n != null && i_List.l_checkNameExists(n) == true) ;

				if (n != null) {
					n = n.replace(pattName, "");

					var myres = myStyles[parseInt(mymenu.selection)];

					var t = i_List.add(n,
								myres.nestedStyles[sel].isValid,
								myres.nestedStyles[sel].appliedCharacterStyle.name,
								myres.nestedStyles[sel].delimiter,
								myres.nestedStyles[sel].inclusive,
								myres.nestedStyles[sel].repetition
								);
					if (t) {
						with (iTableau2.add ("item", n)) {
							subItems[0].text = repFr(myres.nestedStyles[sel].isValid);
							subItems[1].text = myres.nestedStyles[sel].appliedCharacterStyle.name;
							subItems[2].text = myres.nestedStyles[sel].delimiter; 
							subItems[3].text = repFr(myres.nestedStyles[sel].inclusive);
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
				// valid name or cancel
				var n = "";
				do {
					n = prompt(question, nomDeft, nomPal);
				} while(n != null && l_List.l_checkNameExists(n) == true) ;

				if (n != null) {
					n = n.replace(pattName, "");

					var myres = myStyles[parseInt(mymenu.selection)];

					var t = l_List.add(n, myres.nestedLineStyles[sel].isValid,
								myres.nestedLineStyles[sel].appliedCharacterStyle.name,
								myres.nestedLineStyles[sel].lineCount,
								myres.nestedLineStyles[sel].repeatLast
								);
					if (t) {
						with (lTableau2.add ("item", n)) {
							subItems[0].text = repFr(myres.nestedLineStyles[sel].isValid);
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


	  // action button paste/transfer
	  //*********************************
	  //*********************************
		colleBtn.onClick = function(){

			sel = -1;
			//var sel1 = (gTableau2.selection !== null) ? gTableau2.selection : -1;

			appliedCSDefault = myStylesc[parseInt(mymenu2.selection)];
			var question2 = "Transfer this style?";
			var mySelection = select.selection;
			var selectedStylesIdx = []; // = selectpStyle() retour
			for(g = 0; g < mySelection.length; g++){
				selectedStylesIdx.push(mySelection[g].index);
			}
			selectedStylesNames = getSelectedpStyleNames(selectedStylesIdx);


			if (tpanelCol.selection == tabGrep2) {
				typeS = "g";
				sel = (gTableau2.selection !== null) ? gTableau2.selection : -1;
				if (sel.length > 0) { // sel = array styles name
					var n = confirm(question2);
					if (n != null) {
						transfert = true;
					}
				}
			}
			if (tpanelCol.selection == tabImbriques2) {
				typeS = "i";
				sel = (iTableau2.selection !== null) ? iTableau2.selection : -1;
				if (sel.length > 0) { // sel = array styles name
					var n = confirm(question2);
					if (n != null) {
						transfert = true;
					}
				}
			}
			if (tpanelCol.selection == tabLignes2) {
				typeS = "l";
				sel = (lTableau2.selection !== null) ? lTableau2.selection : -1;
				if (sel.length > 0) { // sel = array styles name
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
		var okBtn = add("button", undefined, "OK", {name:"ok"});
		var cancelBtn = add("button", undefined, "Cancel", {name:"cancel"});
	}




	//*******************************************
	}
	// var dialogResult = mydialog.show();
	return mydialog.show(); // 1 = ok, 2 cancel
}



// fonctions
//******************************************
//******************************************
function fillpStyleStringList(){
		for(i = 0 ; i < pStyles.length; i++){
				if(pStyles[i].parent.parent.toString() === '[object ParagraphStyleGroup]'){
						pStyleStringList.push('Group: ' + pStyles[i].parent.parent.name + ', Sub-groupe: ' + pStyles[i].parent.name + ', Name: ' + pStyles[i].name);
				}else if(pStyles[i].parent.toString() === '[object ParagraphStyleGroup]'){
						pStyleStringList.push('Sub-group: ' + pStyles[i].parent.name + ', Name: ' + pStyles[i].name);
				}else{
						pStyleStringList.push('Name: ' + pStyles[i].name);
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
	if (!objStyles.isValid) error = "The paragraph style doesn't exists.";

	if(targetGroup != "" && targetGroup != theDoc.name && targetGroup != app.name){
		var temptarget = theDoc.paragraphStyleGroups.itemByName(targetGroup.toString());
		target = temptarget.paragraphStyleGroups.itemByName(targetSubgroup.toString()).paragraphStyles.itemByName(targetName.toString());
	}else if(targetSubgroup != "" && targetSubgroup != theDoc.name && targetSubgroup != app.name){
		target = theDoc.paragraphStyleGroups.itemByName(targetSubgroup.toString()).paragraphStyles.itemByName(targetName.toString());
	}else{
		target = theDoc.paragraphStyles.itemByName(targetName.toString());
	}
	if (!target.isValid) error += "\rThe selected style doesn't exist.";
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
			// alert(e + "\r\r'" + objStyles.appliedChStyle + "' style doesn't exists.\rIt 'll be replace by '"+ appliedCSDefault.name + "'." );
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
			// alert(e + "\r\r'" + objStyles.appliedChStyle + "' style doesn't exists.\rIt 'll be replace by '"+ appliedCSDefault.name + "'." );
		}
	}
	if (t === "l") {
		try{
		target.nestedLineStyles.add ({
			isValid: (objStyles.isValid) ? true : false,
			appliedCharacterStyle: theDoc.characterStyles.itemByName(objStyles.appliedChStyle.toString()),
			lineCount: parseInt(objStyles.nbLines),
			//repeatLast: parseInt(objStyles.repetition) // bug
			});
		} catch(e) {
			target.nestedLineStyles.add ({
				isValid: (objStyles.isValid) ? true : false,
				appliedCharacterStyle: appliedCSDefault,
				lineCount: parseInt(objStyles.nbLines),
				//repeatLast: parseInt(objStyles.repetition)
			});
			// alert(e + "\r\r'" + objStyles.appliedChStyle + "' style doesn't exists.\rIt 'll be replace by '"+ appliedCSDefault.name + "'." );
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
		myFilePath = File.openDialog("Select the file that contains the saved styles' list.");
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


function repFr(v){ return (v) ? "yes" : "no"; }
function incFr(v){ return (v) ? "up to" : "through"; }


function delimFr(w){
	//alert("ANY_WORD" == w.toString());
	switch (w.toString()) {
		case "ANY_CHARACTER" : return "Characters"; break;
		case "ANY_WORD" : return "Words"; break;
		case "AUTO_PAGE_NUMBER" : return "Auto page number"; break;
		case "DIGITS" : return "Digits"; break;
			case "DROPCAP" : return "Dropcap"; break; 
		case "EM_SPACE" : return "Em space"; break;
		case "END_NESTED_STYLE" : return "End of nested style"; break;
		case "EN_SPACE" : return "En space"; break;
		case "FORCED_LINE_BREAK" : return "Forced line break"; break;
		case "INDENT_HERE_TAB" : return "Indent here tab"; break;
		case "INLINE_GRAPHIC" : return "Inline graphic"; break;
		case "LETTERS" : return "Letters"; break;
		case "NONBREAKING_SPACE" : return "Nonbreaking space"; break;
			case "REPEAT" : return "Repeat"; break; // pas traduit ni dans liste
		case "SECTION_MARKER" : return "Section marker"; break;
		case "SENTENCE" : return "Sentence"; break;
		case "TABS" : return "Tabs"; break;
		default: return w;
	}
}
function delimInDesign(w){
	//alert("ANY_WORD" == w.toString());
	switch (w.toString()) {
		case "1380541539" : return "Characters"; break; // "ANY_CHARACTER" NestedStyleDelimiters.ANY_CHARACTER
		case "1380541559" : return "Words"; break; //  "ANY_WORD"
		case "1396797550" : return "Auto page number"; break;//  "AUTO_PAGE_NUMBER"
		case "1380541540" : return "Digits"; break; //  "DIGITS"
			case "1380541507" : return "Dropcap"; break; // "DROPCAP"
		case "1397058899" : return "Em space"; break;// "EM_SPACE"
		case "1396855379" : return "End of nested style"; break; //  "END_NESTED_STYLE"
		case "1397059155" : return "En space"; break; //  "EN_SPACE"
		case "1397124194" : return "Forced line break"; break;// "FORCED_LINE_BREAK"
		case "1397319796" : return "Indent here tab"; break;//  "INDENT_HERE_TAB"
		case "1380541545" : return "Inline graphic"; break; //  "INLINE_GRAPHIC"
		case "1380541548" : return "Letters"; break; //  "LETTERS"
		case "1397645907" : return "Nonbreaking space"; break; // "NONBREAKING_SPACE"
			case "1380545132" : return "Repeat"; break; // "REPEAT"
		case "1400073805" : return "Section marker"; break; // "SECTION_MARKER"
		case "1380541555" : return "Sentence"; break; //  "SENTENCE"
		case "1380541556" : return "Tabs"; break; // "TABS"
		default: return w;
	}
}


function delimInDesignObj(w){
	//alert("ANY_WORD" == w.toString());
	switch (w.toString()) {
		case "1380541539" : return NestedStyleDelimiters.ANY_CHARACTER; break; // "ANY_CHARACTER" NestedStyleDelimiters.ANY_CHARACTER
		case "1380541559" : return NestedStyleDelimiters.ANY_WORD; break; //  "ANY_WORD"
		case "1396797550" : return NestedStyleDelimiters.AUTO_PAGE_NUMBER; break;//  "AUTO_PAGE_NUMBER"
		case "1380541540" : return NestedStyleDelimiters.DIGITS; break; //  "DIGITS"
			case "1380541507" : return NestedStyleDelimiters.DROPCAP; break; // "DROPCAP"
		case "1397058899" : return NestedStyleDelimiters.EM_SPACE; break;// "EM_SPACE"
		case "1396855379" : return NestedStyleDelimiters.END_NESTED_STYLE; break; //  "END_NESTED_STYLE"
		case "1397059155" : return NestedStyleDelimiters.EN_SPACE; break; //  "EN_SPACE"
		case "1397124194" : return NestedStyleDelimiters.FORCED_LINE_BREAK; break;// "FORCED_LINE_BREAK"
		case "1397319796" : return NestedStyleDelimiters.INDENT_HERE_TAB; break;//  "INDENT_HERE_TAB"
		case "1380541545" : return NestedStyleDelimiters.INLINE_GRAPHIC; break; //  "INLINE_GRAPHIC"
		case "1380541548" : return NestedStyleDelimiters.LETTERS; break; //  "LETTERS"
		case "1397645907" : return NestedStyleDelimiters.NONBREAKING_SPACE; break; // "NONBREAKING_SPACE"
			case "1380545132" : return NestedStyleDelimiters.REPEAT; break; // "REPEAT"
		case "1400073805" : return NestedStyleDelimiters.SECTION_MARKER; break; // "SECTION_MARKER"
		case "1380541555" : return NestedStyleDelimiters.SENTENCE; break; //  "SENTENCE"
		case "1380541556" : return NestedStyleDelimiters.TABS; break; // "TABS"
		default: return w;
	}
}






// objets
//**************************************
//**************************************


function aGrepStyle(name, valid, appCs, regExp) {
	this.t ="g";
	this.name = name;
	this.isValid = valid;
	this.appliedChStyle = appCs;
	this.grep = regExp;
}
function anNestedStyle(name, valid, appCs, delimiter, inc, rep) {
	this.t ="i";
	this.name = name;
	this.isValid = valid;
	this.appliedChStyle = appCs;
	this.delimiter = delimiter;
	this.inclusive = inc;
	this.repetition = rep;
}
function aLineStyle(name, valid, appCs, nbL, rep) {
	this.t ="l";
	this.name = name;
	this.isValid = valid;
	this.appliedChStyle = appCs;
	this.nbLines = nbL;
	this.repetition = rep;
}


function G_ListStyles() {
	this.l = [];
	this.names = [];
	this.listSize = 0;
	this.pos = 0;
	this.add = add;
	this.l_remove = l_remove;
	this.l_find = l_find;
	this.l_findIdx = l_findIdx;
	this.l_checkNameExists = l_checkNameExists;

	function add(name, valid, appCs, regExp) {

		var nm = (name) ? name : "New style";

		if (this.l_checkNameExists(nm) == false) {
			var va = (valid) ? true : false;
			var curr = new aGrepStyle(nm, va, appCs, regExp);
			this.names.push(name);
			this.names.sort();
			var idx = this.l_findIdx(name);
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

function I_ListStyles() {
	this.l = [];
	this.names= [];
	this.listSize = 0;
	this.pos = 0;
	this.add = add;
	this.l_remove = l_remove;
	this.l_find = l_find;
	this.l_findIdx = l_findIdx;
	this.l_checkNameExists = l_checkNameExists;

	function add(name, valid, appCs, delimiter, inc, rep) {

		var nm = (name) ? name : "New style";

		if (this.l_checkNameExists(nm) == false) {
			var va = (valid) ? true : false;
			var incl = (inc) ? true : false;
			var curr = new anNestedStyle(nm, va, appCs, delimiter, incl, rep);
			this.names.push(name);
			this.names.sort();
			var idx = this.l_findIdx(name);
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
function L_ListStyles() {
	this.l = [];
	this.names= [];
	this.listSize = 0;
	this.pos = 0;
	this.add = add;
	this.l_remove = l_remove;
	this.l_find = l_find;
	this.l_findIdx = l_findIdx;
	this.l_checkNameExists = l_checkNameExists;

	function add(name, valid, appCs, nbL, rep) {

		var nm = (name) ? name : "New style";

		if (this.l_checkNameExists(nm) == false) {
			var va = (valid) ? true : false;
			var curr = new aLineStyle(nm, va, appCs, nbL, rep);
			this.names.push(name);
			this.names.sort();
			var idx = this.l_findIdx(name);
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

function l_checkNameExists(name) {
	var testn = this.l_findIdx(name);
	if (testn !== false) return true;
	else return false;
}

function l_remove(name) {
	var test = this.l_findIdx(name);
	if (test !== false) {
		this.l.splice(test, 1);
		this.names.splice(test, 1);
		this.listSize--;
		return true;
	}
	return false;
}
function l_find(n) {
	for (var i = 0; i < this.l.length; i++) {
		if (this.l[i].name == n) return this.l[i];
	}
	return false;
}

function l_findIdx(n) {
	for ( var i = 0; i < this.names.length; i++) {
		if (this.names[i] == n) return i;
	}
	return false;
}

function exportList2Txt(obj){

	if (obj.length > 0) {

		var txt = "";
		if (obj[0].t == "g") {
			for (var i = 0; i < obj.length; i++) {
				txt += "g_name=" + obj[i].name + "\n";
				txt += "g_isValid=" + obj[i].isValid + "\n";
				txt += "g_appliedChStyle=" + obj[i].appliedChStyle.toString() + "\n";
				txt += "g_grep=" + obj[i].grep + "\n\n";
			}
		}
		else if (obj[0].t == "i") {
			for (var i = 0; i < obj.length; i++) {
				txt += "i_name=" + obj[i].name + "\n";
				txt += "i_isValid=" + obj[i].isValid + "\n";
				txt += "i_appliedChStyle=" + obj[i].appliedChStyle + "\n";
				txt += "i_delimiter=" + obj[i].delimiter + "\n";
				txt += "i_inclusive=" + obj[i].inclusive + "\n";
				txt += "i_repetition=" + obj[i].repetition + "\n\n";
			}
		}
		else if (obj[0].t == "l") {
			for (var i = 0; i < obj.length; i++) {
				txt += "l_name=" + obj[i].name + "\n";
				txt += "l_isValid=" + obj[i].isValid + "\n";
				txt += "l_appliedChStyle=" + obj[i].appliedChStyle + "\n";
				txt += "l_nbLines=" + obj[i].nbLines + "\n";
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
	myListFile.open("r");
	var text = myListFile.read();
	var paraStyl = text.split("\n\n");

	for (var p = 0; p < paraStyl.length; p++) {

		// check first character :
		if (paraStyl[p][0] == "g") {

			var subPara = paraStyl[p].split("\n");
			// substring(x => x = "g_name=".length
			if (/^g_name=/.test(subPara[0])) {
				var n = subPara[0].substring(7,subPara[0].length);

				if (/^g_isValid=/.test(subPara[1])) {
					var v = subPara[1].substring(10,subPara[1].length);
					v = (v == "true") ? true : false;

					if (/^g_appliedChStyle=/.test(subPara[2])) {
						var cs = subPara[2].substring(17,subPara[2].length);

						if (/^g_grep=/.test(subPara[3])) {
							var g = subPara[3].substring(7,subPara[3].length);
							g_List.add(n, v, cs, g);
						}
					}
				}

			}
		}
		else if (paraStyl[p][0] == "i") {

			var subPara = paraStyl[p].split("\n");

			if (/^i_name=/.test(subPara[0])) { 
				var n = subPara[0].substring(7,subPara[0].length);

				if (/^i_isValid=/.test(subPara[1])) {
					var v = subPara[1].substring(10,subPara[1].length);
					v = (v == "true") ? true : false;

					if (/^i_appliedChStyle=/.test(subPara[2])) {
						var cs = subPara[2].substring(17,subPara[2].length);

						if (/^i_delimiter=/.test(subPara[3])) {
							var d = subPara[3].substring(12,subPara[3].length);

							if (/^i_inclusive=/.test(subPara[4])) {
							var inc = subPara[4].substring(12,subPara[4].length);
								inc = (inc == "true") ? true : false;

								if (/^i_repetition=/.test(subPara[5])) {
									var r = parseInt(subPara[5].substring(13,subPara[5].length));

									i_List.add(n, v, cs, d, inc, r);
								}
							}
						}
					}
				}

			}
		}
		else if (paraStyl[p][0] == "l") {
			var subPara = paraStyl[p].split("\n");

			if (/^l_name=/.test(subPara[0])) {
				var n = subPara[0].substring(7,subPara[0].length);

				if (/^l_isValid=/.test(subPara[1])) {
					var v = subPara[1].substring(10,subPara[1].length);
					v = (v == "true") ? true : false;

					if (/^l_appliedChStyle=/.test(subPara[2])) {
						var cs = subPara[2].substring(17,subPara[2].length);

						if (/^l_nbLines=/.test(subPara[3])) {
							var nb = parseInt(subPara[3].substring(10,subPara[3].length));

							if (/^l_repetition=/.test(subPara[4])) {
								var r = parseInt(subPara[4].substring(13,subPara[4].length));

								l_List.add(n, v, cs, nb, r);
							}
						}
					}
				}
			}
		} // para l
	} // for
}

// delete from lists
//*********************************
if (del_List[0].length > 0) {
	for (var i = 0; i < del_List[0].length; i++) {
		g_List.l_remove(del_List[0][i]);
	}
	saveStyles = 1;
}
if (del_List[1].length > 0) {
	for (var i = 0; i < del_List[1].length; i++) {
		i_List.l_remove(del_List[1][i]);
	}
	saveStyles = 1;
}
if (del_List[2].length > 0) {
	for (var i = 0; i < del_List[2].length; i++) {
		l_List.l_remove(del_List[2][i]);
	}
	saveStyles = 1;
}


// write to text file 
//*********************************


var ecriture = "", testTX = "";
if (g_List.listSize > 0) testTX = exportList2Txt(g_List.l);
if (testTX) ecriture += testTX; testTX = "";
if (i_List.listSize > 0) testTX = exportList2Txt(i_List.l);
if (testTX) ecriture += testTX; testTX = "";
if (l_List.listSize > 0) testTX = exportList2Txt(l_List.l);
if (testTX) ecriture += testTX;
// 1 = ok, 2 cancel
if (saveStyles == 1 && ecriture !== "") writeToFile(txtList, ecriture, true); // rewriteAll

alert( ((saveStyles) ? "Styles are saved.\n" : "") + ((sel.length != undefined) ? sel.length + " transfer(s) done." : "No style transfer done."));
