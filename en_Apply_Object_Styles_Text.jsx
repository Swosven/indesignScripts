/*
sw
May 2015

Apply paragraph styles (and next) from object's style to frames (and linked/threaded frames).

Styles suite = paragraph's style defined in object's style, and next styles if option is checked
Story : = article, text of threaded frames
InsertionPoint : 1 clic, cursor in text
paragraph : 4 clics
line : 3 clics
word : 2 clics

USE OPTIONS : 
==============  
• Next style from paragraph style  
• Apply paragraph style from object style  
  -> Apply next paragraph styles from object style   
Styles suite = paragraph style (and next if checked) from object style, if options are CHECKED.  

DEPENDING FROM SELECTION : 
===================  
• MULTI-FRAMES :
  Apply to each frame its own styles suite.  
• FRAME SOLO :
  Apply its own styles suite.  
• CURSOR :
  To each frames (if linked frames) apply its own styles suite.  
• TEXT (words, paras, whole text, etc.) : 
  1st paragraph style to 1st paragraph, and next styles to next selected paragraphs.  
• 1 LINE :
  The styles suite of this line's parent's (frame) object's style, apply to this story.  
• 1 WORD :
  If linked frames, the 1st frame's object's style suite apply to the story.  
• PARAGRAPHS :
  Apply next paragraph styles from 1st selected paragraph (cf. TEXT).  




*/



// var language = "Fr" ;
var language = "En" ;

var defaultStyle = "None";
var err_msg = [
				"Oh no, you didn't select any text!",
				"[None]",
				"Select only one frame, please."
			  ];
if (language == "Fr") {
	defaultStyle = "Sans";
	// No text
	err_msg[0] = "Oh non, aucun texte n'est sélectionné !" ;
	err_msg[1] = "[Aucun style]" ;
	err_msg[2] = "Merci de ne sélectionner qu'un bloc à la fois." ; // plusieurs blocs
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
	
	// objets sélectionnés
	var ln = app.selection.length ;
	if (ln == 0) { aide();}
	// alert("sélection : " + app.selection.constructor.name + "\nlongueur : " + ln); // Array si plusieurs blocs
	
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
				case "Story": // ??? pas évident
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
texte sélectionné :
=====================
à chaque textframe on applique son propre style Objet 
avec styles de para et suivants si cochés
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
					// on applique à chaque textframe sa suite
					var ln = paraLn[tf] ;
					var maxln = para+ln ;

					if (ln > 0) {

						// applique le style suivant si demandé, ou style idem
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

			// applique le style suivant si demandé, ou style idem
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
1 frame sélectionnée/passée à la fois :
=====================
à cette frame : on applique son propre style Objet 
avec styles de para et suivants si cochés, à la story
*/
function applyStyles_Suivants(idx, err_msg) {

	try {
		if (app.selection[idx].appliedParagraphStyle !== null) {

			// on vérifie si un style est appliqué
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
1 frame sélectionnée/passée à la fois :
=====================
à cette frame : on applique son propre style Objet 
avec styles de para et suivants si cochés, à la story
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
1 frame sélectionnée/passée à la fois :
=====================
à cette frame : on applique son propre style Objet 
avec styles de para et suivants si cochés, à SES paras
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


// à faire
function applyObjStyle_Image(idx, err_msg) {
	// alert("Un bloc image");
}
function aide() {
	var help_message = "USE OPTIONS :\n==============\n";
		help_message += "• Next style from paragraph style\n";
		help_message += "• Apply paragraph style from object style\n";
		help_message += "  -> Apply next paragraph styles from object style\n\n";
		help_message += "Styles suite = paragraph style (and next if checked)\n        from object style, if options are CHECKED.\n\n";
		help_message += "DEPENDING FROM SELECTION :\n===================\n";
		help_message += "• MULTI-FRAMES :\n   Apply to each frame its own styles suite.\n";
		help_message += "• FRAME SOLO :\n   Apply its own styles suite.\n";
		help_message += "• CURSOR : \n   To each frames (if linked frames) apply its own styles suite.\n";
		help_message += "• TEXT (words, paras, whole text, etc.) :\n   1st paragraph style to 1st paragraph, and next styles \n   to next selected paragraphs.\n";
		help_message += "• 1 LINE : \n   The styles suite of this line's parent's (frame) object's style, apply to this story.\n";
		help_message += "• 1 WORD : \n   If linked frames, the 1st frame's object's style suite apply to the story.\n";
		help_message += "• PARAGRAPHS :\n   Apply next paragraph styles from 1st selected paragraph \n   (cf. TEXT).\n";
	alert(help_message, "Help : Apply Objet's Styles");
}