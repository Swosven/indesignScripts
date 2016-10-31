//DESCRIPTION:Supprime les couleurs en double, selon le nom (" 2", " 3"...)
//DESCRIPTION:Delete duplicated colors, based on name (" 2", " 3"...)


if (app.locale.toString() == "FRENCH_LOCALE") {

	var infos = {
		nodoc:"Aucun document ouvert",
		msg:" couleur(s) supprimée(s)",
		sc:"Supprime les couleurs en doublons"
	};
} else {

	var infos = {
		nodoc:"Open a document, please",
		msg:" color(s) deleted",
		sc:"Delete duplicated colors"
	};
}

// function main() {
Application.prototype.main = function() {
	if (app.documents.length == 0) {
		alert(infos.nodoc);
		exit();
	}
	else {
		var testC = true, c_list = [];
		do {
			testC = suppCouleurs();
		} while (testC);
		 alert(c_list.length + infos.msg + "\n\n" + c_list.join("\n"));
	}


	function suppCouleurs() {
		
		// on compare 
		for(i = 0; i < app.activeDocument.swatches.length; i++) { // couleur 2
			
			// comparaison
			for(c = 0; c < app.activeDocument.swatches.length; c++) { // couleur 1
			
				if ( / [2-9]$/.test(app.activeDocument.swatches[i].name) ) {
				
					// on remplace la couleur 2 par la couleur 1 si correspondance
					if ( app.activeDocument.swatches[i].name ==  app.activeDocument.swatches[c].name + " " 
						+ app.activeDocument.swatches[i].name[app.activeDocument.swatches[i].name.length-1] ) {
						c_list.push(app.activeDocument.swatches[i].name);
						app.activeDocument.swatches[i].remove(app.activeDocument.swatches[c]);
						 return true;
					 }
				}
					// remove ([replacingWith: Swatch])
			}
		}
		return false;
	}

} // main
// app.main();
app.doScript('app.main();',ScriptLanguage.JAVASCRIPT,undefined,UndoModes.ENTIRE_SCRIPT, infos.sc);
