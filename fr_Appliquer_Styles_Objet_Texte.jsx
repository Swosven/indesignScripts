/*
sw
May 2015

Applique les styles de para (et suivants) du style d'objet aux blocs (m�me li�s).

Suite de style = style de para d�fini dans le style d'objet, et styles suivants si coch�s
Story : �quivalent d'article, tout le texte des blocs li�s
InsertionPoint : 1 clic, curseur positionn� dans le texte
paragraphe : 4 clics
ligne : 3 clics
mot : 2 clics



Types de s�lection :
====================
	� Multiblocs :
	--------------
	applique � chaque bloc sa suite de styles
	
	� Blocs li�s :
	--------------
		o Un bloc li� : 
		  � ce bloc sa suite de styles
		  
		o insertionPoint (curseur ds le texte) : 
		  � chaque bloc li�, sa suite de styles
		  
		o texte (plusieurs mots, lignes, paras, tout le texte) : 
		  style du para 1, et styles suivants de ce para
		  
		o ligne (3 clics) : 
		  suite du bloc en cours � la story
		  
		o mot (2 clics) : 
		  suite du bloc de d�part � la story




*/



var language = "Fr" ;
// var language = "En" ;

var defaultStyle = "None";
var err_msg = [
				"Oh no, you didn't select any text!",
				"[None]",
				"Select only one frame, please."
			  ];
if (language == "Fr") {
	// No text
	err_msg[0] = "Oh non, aucun texte n'est s�lectionn� !" ;
	err_msg[1] = "[Aucun style]" ;
	err_msg[2] = "Merci de ne s�lectionner qu'un bloc � la fois." ; // plusieurs blocs
	
	defaultStyle = "Sans";
}

if(app.documents.length != 0){
	// cree un "vrai" style "Sans"
	defaultStyle2 = "[" + defaultStyle + "]";
	noneStyle = app.activeDocument.characterStyles.item(defaultStyle2);
	try {
		basedOnNone = app.activeDocument.characterStyles.add({name:defaultStyle, basedOn:noneStyle});
	} catch(e) {
		basedOnNone = app.activeDocument.characterStyles.item(defaultStyle);
	}
	
	applyStyle(err_msg);
}

var myInDesignVersion = Number(String(app.version).split(".")[0]); // 	if (myInDesignVersion > 6) ....
function applyStyle(err_msg) {

	// 
	// Array => text (ln = 1)
	// Array => InsertionPoint (ln = 1)
	// Array => Word (ln = 1)
	// ...
	// Array => textFrame (ln = x)
	
	// objets s�lectionn�s
	var ln = app.selection.length ;
	if (ln == 0) { aide();}
	// alert("s�lection : " + app.selection.constructor.name + "\nlongueur : " + ln); // Array si plusieurs blocs
	
	for (var i = 0 ; i < ln ; i++) {
		// alert("objet " + i + " : " + app.selection[i].constructor.name);
		switch (app.selection[i].constructor.name){
				case "Character":
				case "Word":
				applyObjStyle_Story_bloc(i, err_msg, false); 
			break;
				case "Line":
				applyObjStyle_Story_bloc(i, err_msg, true); 
			break;
				case "Text":
				case "Paragraph":
				case "TextColumn":
				case "TextStyleRange":
				case "Story": // ??? pas �vident
				applyStyles_Suivants(i, err_msg) ;
			break;
				case "InsertionPoint":
				applyObjStyle_Story(i, err_msg) ; 
			break;
				case "TextFrame":
				applyObjStyle_Frame_to_Paras(i, err_msg) ; 
				// applyObjStyle_Frame_to_Story(i, err_msg) ; 
			break;
				case "Rectangle":
				applyObjStyle_Image(i, err_msg) ;
			break;
		}
	}
}



/*
texte s�lectionn� :
=====================
� chaque textframe on applique son propre style Objet 
avec styles de para et suivants si coch�s
*/
function applyObjStyle_Story(idx, err_msg) {

	// selection story
	var placedstory = app.selection[idx].parentTextFrames[0].parentStory;

	// nb de textFrame de la story
	var tln = placedstory.textContainers.length ;
	if (tln > 0) {

		var paraLn = [], para = 0;

		// boucle dans les textframes de la story
		// on compte les paras par textframe
		for (var tf = 0 ; tf < tln ; tf++) {
			paraLn[tf] = placedstory.textContainers[tf].paragraphs.length ;
		}

		// boucle dans les textframes de la story
		for (var tf = 0 ; tf < tln ; tf++) {

			// si le bloc en cours a unstyle d'Object 
			if (placedstory.textContainers[tf].appliedObjectStyle == "[object ObjectStyle]") {

				var objS = placedstory.textContainers[tf].appliedObjectStyle;
				if (objS.enableParagraphStyle && objS.appliedParagraphStyle != null && objS.appliedParagraphStyle.name != err_msg[1]) {

					// boucle ds les paragraphes de chaque textframe
					// on applique � chaque textframe sa suite
					var ln = paraLn[tf] ;
					var maxln = para+ln ;

					if (ln > 0) {

						// applique le style suivant si demand�, ou style idem
						if (objS.applyNextParagraphStyle) {

							var paraStyle = objS.appliedParagraphStyle ;
							// on boucle ts les paras de la story
							for (var i = para ; i < maxln ; i++) {
								placedstory.paragraphs[i].applyCharacterStyle(basedOnNone);
								placedstory.paragraphs[i].clearOverrides();
								
								placedstory.paragraphs[i].appliedParagraphStyle = paraStyle ;
								paraStyle = paraStyle.nextStyle ;
								para = maxln ;
							}
						}
						else {
							for (var i = para ; i < maxln ; i++) {
								placedstory.paragraphs[i].applyCharacterStyle(basedOnNone);
								placedstory.paragraphs[i].clearOverrides();

								placedstory.paragraphs[i].appliedParagraphStyle = objS.appliedParagraphStyle ;
								para = maxln ; 
							}
						}
					}
				}

			}
		}
	}
}

function applyObjStyle_Story_bloc(idx, err_msg, currBloc) {

	// selection story
	var placedstory = app.selection[idx].parentTextFrames[0].parentStory;
	if (currBloc) {
		if (app.selection[idx].parentTextFrames[0].appliedObjectStyle == "[object ObjectStyle]") {
			var objS = app.selection[idx].parentTextFrames[0].appliedObjectStyle;
		}
	}
	else {
		if (placedstory.textContainers[0].appliedObjectStyle == "[object ObjectStyle]") {
			var objS = placedstory.textContainers[0].appliedObjectStyle;
		}
	}

	if (objS && objS.enableParagraphStyle && objS.appliedParagraphStyle != null && objS.appliedParagraphStyle.name != err_msg[1]) {

		var ln = placedstory.paragraphs.length ;
		if (ln > 0) {

			// applique le style suivant si demand�, ou style idem
			if (objS.applyNextParagraphStyle) {

				var paraStyle = objS.appliedParagraphStyle ;
				// on boucle ts les paras de la story
				for (var i = 0 ; i < ln ; i++) {
					placedstory.paragraphs[i].applyCharacterStyle(basedOnNone);
					placedstory.paragraphs[i].clearOverrides();

					placedstory.paragraphs[i].appliedParagraphStyle = paraStyle ;
					paraStyle = paraStyle.nextStyle ;
				}
			}
			else {
				for (var i = 0 ; i < ln ; i++) {
					placedstory.paragraphs[i].applyCharacterStyle(basedOnNone);
					placedstory.paragraphs[i].clearOverrides();

					placedstory.paragraphs[i].appliedParagraphStyle = objS.appliedParagraphStyle ;
				}
			}
		} // if (ln > 0)
	} // if (objS)
}

/*
1 frame s�lectionn�e/pass�e � la fois :
=====================
� cette frame : on applique son propre style Objet 
avec styles de para et suivants si coch�s, � la story
*/
function applyStyles_Suivants(idx, err_msg) {

	try {
		if (app.selection[idx].appliedParagraphStyle !== null) {

			// on v�rifie si un style est appliqu�
			if (app.selection[idx].appliedParagraphStyle == "[object ParagraphStyle]") {
				var paraS = app.selection[idx].appliedParagraphStyle;

				app.selection[idx].applyCharacterStyle(basedOnNone);
				app.selection[idx].clearOverrides();

				if (app.selection[idx].paragraphs.length > 1) {

					// nextStyle	ParagraphStyle 	r/w	The style to apply to new paragraphs that follow paragraphs tagged with this style.
					for (var i = 0; i < app.selection[idx].paragraphs.length; i++) {
						var currPS = app.selection[idx].paragraphs[i].appliedParagraphStyle;
						if (i == 0) {
							app.selection[idx].paragraphs[i].applyParagraphStyle (app.selection[idx].paragraphs[i].appliedParagraphStyle, true);
						} 
						else {
							// OverrideType.ALL
							app.selection[idx].paragraphs[i].applyParagraphStyle (app.selection[idx].paragraphs[i-1].appliedParagraphStyle.nextStyle, true);
						}
					}
				}
				else {
					// 1 seul para, on applique son style
					app.selection[idx].applyParagraphStyle (app.selection[idx].appliedParagraphStyle, true);
				}
			} // fin un style est applique
		} // fin un style est !== null
	}
	catch(ee) { alert( (language == "En") ? "Error : " + ee : "Erreur : " + ee); }
}


/*
startTextFrame (TextFrame)
nextTextFrame
previousTextFrame
endTextFrame
textFrames
*/


/*
1 frame s�lectionn�e/pass�e � la fois :
=====================
� cette frame : on applique son propre style Objet 
avec styles de para et suivants si coch�s, � la story
*/
function applyObjStyle_Frame_to_Story(idx, err_msg) {
	
	if (app.selection[idx].appliedObjectStyle == "[object ObjectStyle]") {

		// select current frame's object style
		// will apply current frame object style's paragraph styles (and next if selected in object style options) to the whole story
		var objS = app.selection[idx].appliedObjectStyle;

		if (objS.enableParagraphStyle && objS.appliedParagraphStyle != null && objS.appliedParagraphStyle.name != err_msg[1]) {

			
			var placedstory = app.selection[idx].parentStory;
			var ln = placedstory.paragraphs.length ;

			if (ln > 0) {
				// avec styles suivants
				if (objS.applyNextParagraphStyle) {

					var paraStyle = objS.appliedParagraphStyle ;

					for (var i = 0 ; i < ln ; i++) {
						placedstory.paragraphs[i].applyCharacterStyle(basedOnNone);
						placedstory.paragraphs[i].clearOverrides();

						placedstory.paragraphs[i].appliedParagraphStyle = paraStyle ;
						paraStyle = paraStyle.nextStyle ;
					}
				}
				// sans styles suivants
				else {
					for (var i = 0 ; i < ln ; i++) {
						placedstory.paragraphs[i].applyCharacterStyle(basedOnNone);
						placedstory.paragraphs[i].clearOverrides();

						placedstory.paragraphs[i].appliedParagraphStyle = objS.appliedParagraphStyle ;
					}
				}
			}
		}
	}
}
/*
1 frame s�lectionn�e/pass�e � la fois :
=====================
� cette frame : on applique son propre style Objet 
avec styles de para et suivants si coch�s, � SES paras
*/
function applyObjStyle_Frame_to_Paras(idx, err_msg) {

	if (app.selection[idx].appliedObjectStyle == "[object ObjectStyle]") {
	
		var objS = app.selection[idx].appliedObjectStyle;

		if (objS.enableParagraphStyle && objS.appliedParagraphStyle != null && objS.appliedParagraphStyle.name != err_msg[1]) {

			var ln = app.selection[idx].paragraphs.length ;
			if (ln > 0) {
				// avec styles suivants
				if (objS.applyNextParagraphStyle) {

					var paraStyle = objS.appliedParagraphStyle ;

					for (var i = 0 ; i < ln ; i++) {
						app.selection[idx].paragraphs[i].applyCharacterStyle(basedOnNone);
						app.selection[idx].paragraphs[i].clearOverrides();

						app.selection[idx].paragraphs[i].appliedParagraphStyle = paraStyle ;
						paraStyle = paraStyle.nextStyle ;
					}
				}
				// sans styles suivants
				else {
					 // ok only with version 10
					//if (myInDesignVersion > 6) placedstory.paragraphs.appliedParagraphStyle = objS.appliedParagraphStyle ;
					//else {
						for (var i = 0 ; i < ln ; i++) {
							app.selection[idx].paragraphs[i].applyCharacterStyle(basedOnNone);
							app.selection[idx].paragraphs[i].clearOverrides();
							app.selection[idx].paragraphs[i].appliedParagraphStyle = objS.appliedParagraphStyle ;
						}
					//}
				}
			}
		}
	}
}


// � faire
function applyObjStyle_Image(idx, err_msg) {
	// alert("Un bloc image");
}
function aide() {
	var help_message = "UTILISE LES OPTIONS :\n==============\n";
		help_message += "� Style suivant du style de paragraphe\n";
		help_message += "� Appliquer style de paragraphe du style d'objet\n";
		help_message += "  -> Appliquer les styles de paragraphe suivants du style d'objet\n\n";
		help_message += "Suite de styles = le style de paragraphe (et suivants si coch�s)\n        du style d'objet, si les options sont COCH�ES.\n\n";
		help_message += "USAGE SELON LA S�LECTION :\n===================\n";
		help_message += "� MULTI-BLOCS :\n   Applique � chaque bloc sa propre suite de styles.\n";
		help_message += "� BLOC SOLO :\n   Lui applique sa suite de styles.\n";
		help_message += "� CURSEUR : \n   � chaque bloc (si plusieurs li�s) sa suite de styles.\n";
		help_message += "� TEXTE (mots, paras, tout le texte, etc.) :\n   Style du 1er paragraphe au 1er paragraphe, et les styles suivants \n   aux autres paragraohes de la s�lection.\n";
		help_message += "� 1 LIGNE : \n   La suite de styles du bloc de cette ligne � l'article complet.\n";
		help_message += "� 1 MOT : \n   La suite de styles du bloc de d�part � l'article complet.\n";
		help_message += "� PLUSIEURS PARAGRAPHES :\n   Applique les styles suivants du style de paragraphe de t�te \n   (cf. TEXTE).\n";
	alert(help_message, "Aide : Appliquer les styles d'Objet");
}