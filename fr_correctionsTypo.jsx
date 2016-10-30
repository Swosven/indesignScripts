//DESCRIPTION:Quelques corrections typos de base
//----------------------------------------------------
// Script for InDesign CS3-5.
// sw
// septembre 2014 / octobre 2015
/*

Reprise de la fonction utilisée par autoPages
pour appliquer des corrections typo élémentaires + qqs orthographiques (qqs mots commençants par É...)


v1.0 passage des expresions régulières javascript aux GREP inDesign
v1.1 ajout d'options et de l'affichage des options lorsqu'il n'y a pas de sélection de texte


//----------------------------------------------------
*/
// Globals
const wScriptName = "Corrections typographiques";
const wScriptVersion = "1.1";
var myInDesignVersion = Number(String(app.version).split(".")[0]);

// OPTIONS :
wSet = {};
wSet.heures = false; // 10h30, 10h  en 10 h 30 et 10 h
wSet.suppTabMultiples = false; // +ieurs tabs => 1 tab
wSet.suppTabulations = false; // tab => espace
wSet.convSautsLignesForces = false; // sauts de ligne forcés => sauts de ligne
wSet.suppSautsLignesForces = false; // sauts de ligne forcés => espaces
wSet.suppSautsLignes = false; // sauts de lignes multiples => 1 saut de ligne
wSet.dblesEspaces = false; // doubles espaces => espace
wSet.espacesDebLigne = false; // supp espaces début ligne
wSet.espacesFinLigne = false; // supp espaces fin ligne
wSet.convDegreNumero = false; // n° en no ou numéro(s) suivant le contexte
// devrait se faire avec folio, tercio, etc. mais nécessite GREP-exposant dans styles de para
wSet.convAccolades = false; // (…) => […] plus académique et difficile à taper pour les fainéants

getStored_wSet();

var ln = app.selection.length ;
/*
particularités inDesign
-----------------------
respect de la casse désactivé :
(?i)

respect de la casse activé :
(?-i)

multilignes activé :
(?m)

multilignes désactivé :
(?-m)

ligne par ligne activé :
(?s)

ligne par ligne désactivé :
(?-s)

guillemets anglais (!#@??!)
~"
*/

var rempDegreNumero = [
	[ "(\\d)\\s([Nn])°s", "$1\\x{00a0}$2uméros" ], // 5 n° en 5 + inséc. + numéros 
	[ "(\\d)\\s([Nn])°(?!s)", "$1\\x{00a0}$2uméro" ], // 1 n° en 1 + inséc. + numéro
	
	[ "(\\<[Nn])°\\s(?!\\d)", "$1uméro" ], // n° pas suivi d'un chiffre en numéro
	[ "(\\<[Nn])°\\s?(\\d)", "$1o\\x{2009}$2" ],// n°1  en no + inséc. + 1
	[ "(\\<[Nn])°(\\d)", "$1o\\x{2009}$2" ],// n°1  en no + inséc. + 1
	[ "(\\<[Nn])°s\\s?(\\d)", "$1os\\x{2009}$2" ],// n°s1 et 2  en nos + inséc. + 1
	[ "(\\<[Nn])°s(\\d)", "$1os\\x{2009}$2" ],// n°s1 et 2  en nos + inséc. + 1
	[ "(\\<[Nn]os?)(\\d)", "$1\\x{2009}$2" ],// nos? en nos? + inséc.
	[ "(\\<[Nn]os?)\\s", "$1\\x{2009}" ]// nos? en nos? + inséc.
];
var suppTabMultiples = [
	[ "([\\t]+)", "\\t" ]
];
var remplTabulations = [
	[ "(\\t)", " " ]
];
var remplEspaces = [
	[ "(\\s+(?![\\r\\n])", " " ], // dble esp. utile pr style imbriques
	// soyons précis, sinon il compte les \n \r comme des espaces :S
	[ "([ \\x{00a0}\\x{202f}\\x{2000}\\x{2002}\\x{2003}\\x{2004}\\x{2005}\\x{2006}\\x{2007}\\x{2008}\\x{2009}\\x{200a}][ \\x{00a0}\\x{202f}\\x{2000}\\x{2002}\\x{2003}\\x{2004}\\x{2005}\\x{2006}\\x{2007}\\x{2008}\\x{2009}\\x{200a}]+)", " " ] // dble esp. utile pr style imbriques
];
var suppEspacesDL = [
	[ "^\\s", "" ]
];
var suppEspacesFL = [
	[ "\\s$", "" ]
];
var omissionsTxt = [
	[ "\\(…\\)", "[…]" ]
];
var remplSautsLF_SautsL = [
	// utile pour word, mais change sauts de lignes forcés indesign aussi
	[ "\\n", "\\r"]
];
var remplSautsLignesForces = [
	// utile pour word, mais supprime sauts de lignes forcés indesign aussi
	[ "\\n", " "]
];
var remplSautsLignes = [
	// si texte brut, pas propre en theorie
	//[ "(^[\\n\\r ]+)", "\\r" ],
	[ "([\\n\\r][\\n\\r]+)", "\\n" ],
	[ "( \\n|\\n )", "\\n" ]
	// [ "(\\n+|\\r+| +)$", "\\r" ]

];
var remplacements = [

	// [ "(  )", "<2009> " ], // \u2009 esp. fine + normale
	//		[ "\\x{000d}", ""], // \r
	//		[ "\\x{000a}", ""], // \n
			[ "\\x{200b}", ""], // esp. sans chasse
	//		[ "\\n", ""],
	//		[ "\\n", "\\r"], // utile pour word, mais supprime sauts de lignes forcés indesign aussi
	[ "('')", '"' ], //"
	[ "(’’)", '"' ], //"
	[ "(‘‘)", '"' ], //"
	
	// bug inDesign CC (et CS4 ???) *****
	// incapable de trouver ' "'  (espace + guillemets anglais ou \\s")
	//[ ' "([^"]+)"', " “$1”" ], //"
	//[ ' "([^"]+)"', " “$1”" ], //" // double pour les imbrications
	[ '"([\\u\\l][^"]+)"', "“$1”" ], //"
	[ '"([\\u\\l][^"]+)"', "“$1”" ], //" // double pour les imbrications
	[ '^"([^"]+)"', " “$1”" ], //"
	
	// problemes importation texte
	[ "\\x{009C}", "œ" ],
	[ "\\x{0092}", "’" ],
	[ "\\x{2018}", "‘" ],
	[ "\\x{2019}", "’" ],
	[ "\\x{201C}", "“" ],
	[ "\\x{201D}", "”" ],
	[ "\\x{0096}", "–" ],
	[ "\\x{2020}", "†" ],
	[ "\\x{0095}", "•" ],
	[ "\\x{2022}", "•" ],
	[ "\\x{2026}", "…" ],
	[ "\\.\\.\\.", "\\x{2026}" ], // \u2026 hellip


	[ " ([-]) ", " – " ], //  0151 ET 0150 — –
 	[ " ([,\.]) ", "$1 " ], // supp. espaces avt . et ,
	[ "(?i)([a-z])'([a-zâéèêîÂÉÈÊÎ])", "$1’$2" ], // ' remplacé par ’
	[ "(?i)([§°])\\s([a-z0-9])", "$1\\x{00a0}$2" ], // insec. [0-9§°]




		// correction n° en no a faire
	// esp. ins. : jours chiffre/nombre + mois
	// [ / (1er|[0-9]+)\s?(janvier|février|mars|avril|mai|juin|juillet|août|septembre|octobre|novembre|décembre)/gi, "$1\\x{00a0}$2" ],
	[ "(?i)(1er|[0-9]) (janvier|février|mars|avril|mai|juin|juillet|août|septembre|octobre|novembre|décembre)", "$1\\x{00a0}$2" ],
	// esp. ins. : mois + année
	[ "(?i)(janvier|février|mars|avril|mai|juin|juillet|août|septembre|octobre|novembre|décembre) ([0-9]{4})", "$1\\x{00a0}$2" ],
	[ "(?i)(dimanche|jeudi|lundi|mardi|mercredi|samedi|vendredi) ([0-9])", "$1\\x{00a0}$2" ],
	[ "(?i) ([0-9]+)\\s?(ans)", " $1\\x{00a0}$2" ],  // prob avec ad web ?
 	[ " '([^']*)'", " ‘$1’" ],

	// guillemets fr ouvrants
	[ "([«])( |\\x{00a0}|\\x{202f}|\\s)", "$1\\x{2009}" ], // \u2009   \u202f dans word
	[ "(?i)([«])\\s?([a-zA-ZâéèêîÂÀÉÈÊÎ])", "$1\\x{2009}$2" ], // \u2009
	[ "([«])([a-zA-ZâéèêîÂÀÉÈÊÎ])", "$1\\x{2009}$2" ], // \u2009
	// [ "(?i)([«])\\s?([éÉàÀ])", "$1\\x{2009}$2" ], // A-Za-z \u2009

	// guillemets fr fermants
	[ "( |\\x{00a0}|\\x{202f}|\\s)([:;»])", "\\x{2009}$2" ], // \u2009
	[ "(?i)([A-Za-zâéèêîÀÂÉÈÊÎ:;.!?])\\s?([»])", "$1\\x{2009}$2" ], // \u2009		1/4 u2005 ou de ponctu u2008
	
	// esp fine avt ponctu
	[ "(?i)([A-Za-zâéèêîÀÂÉÈÊÎ])\\s?([!?:;])", "$1\\x{2009}$2" ], // \u2009		esp. fine u2009
	[ "[\\s]+([!?:;])", "\\x{2009}$1" ], // \u2009		esp. fine u2009
	//[ "( |\\x{00a0}|\\s)([!?])", "\\x{202f}$2" ], // insec. etroite  \u202f
	
	// web, site, email
	[ "(https?)( |\\x{00a0}|\\s):", "$1:" ], // web
	[ "https?://(www)", "$1" ], // web

	// euro
	[ "( |\\x{00a0}|\\s)([€%])", "\\x{2009}$2" ], // esp. fine u2009
	[ "([0-9])([€%])", "$1\\x{2009}$2" ], // esp. fine u2009
	
	// telephone
	[ "([0-9]{2})[\\s.]([0-9]{2})[\\s.]([0-9]{2})[\\s.]([0-9]{2})[\\s.]([0-9]{2})", "$1\\x{2009}$2\\x{2009}$3\\x{2009}$4\\x{2009}$5" ], // esp. fine u2009
	[ "([0-9]{2})([0-9]{2})([0-9]{2})([0-9]{2})([0-9]{2})", "$1\\x{2009}$2\\x{2009}$3\\x{2009}$4\\x{2009}$5" ], // esp. fine u2009
	
	// pts de suspention
	[ "\\.\\.\\.", "\\x{2026}" ], // hellip
	
	// tel/fax
	[ "(?i)(T[eéèEÉÈ]l\\.?)\\s?:?(\\d])", "Tél.\\x{202f}h$2" ], // \u2009		Tél. 0
	[ "(?i)(Fax\\.?)\\s?:?(\\d])", "Fax\\x{202f}h$2" ], // \u2009		Fax 0

	//multiplication sign
	["(\\s)x(\\s+)", "$1\\x{00D7}$2"],
	["x([0-9]+)", "\\x{00D7}$1"],

	[ "(E)(cole|dito|diteur|dition|glise|pître|quipe|tablissement|tat|vangile|vêché|veil|vêque)", "É$2" ],
	[ "(Fr|M\.|Mgr|Mlle|Mme|P\\.|Sr) ([A-ZÉÈÊ])", "$1\\x{00a0}$2" ],
	[ "([Pp]\\.|[Pp]ages?) ([0-9])", "$1\\x{00a0}$2" ], // ins. pour page(s) 2 => abrv. p. 2
	[ "(^- )", "\\x{2009}\\x{2013}\\x{202f}" ], // u2009 u2013 u202f   devrait finir par <cmd> u0007 : retrait jusqu'a ce pt ~i (pom' slash)
	//
	[ "^A ", "À " ],
	[ "([.!?] )(A )", "$1À " ]
];
	// heures
var remplacementsH = [
	[ "(?i)0?(\\d)\\s?h\\s?(00)", "$1\\x{2009}h\\x{2009}" ], 	// \u2009 		10h00 => 10h
	[ "(?i)0?(\\d)\\s?h\\s?(\\d)", "$1\\x{2009}h\\x{2009}$2" ], // \u2009 		10h30
	//[ "(?i)0?(\\d)\\s?h([\\s \\n\\r,.?!-])", "$1\\x{2009}h$2" ] 		// \u2009		10h,.?!-
	[ "(?i)0?(\\d)\\s?h(?=[\\s \\n\\r,.?!-])", "$1\\x{2009}h" ] 		// \u2009		10h,.?!-
];


function correctionsTypoInd(datas) {
	var ln = datas.length;
	
	for (var i = 0; i < ln; i++) {
		app.findGrepPreferences = NothingEnum.nothing;
		app.findGrepPreferences.findWhat = datas[i][0];
		app.changeGrepPreferences.changeTo = datas[i][1];
		var results = app.selection[0].findGrep();
		app.selection[0].changeGrep();
	}
}


/*
\u0020 espace
\u00a0 esp. insecable justifiante (nbsp)
\u202f esp. insecable larg. fixe (nbsp narrow)
\u2001 esp. sans alinea (em quad)
\u2002 esp. demi cadratin (en)
\u2003 esp. cadratin (em)
\u2004 esp. 1/3 cadratin (3-per-em)
\u2005 esp. 1/4 cadratin (4-per-em)
\u2006 esp. 1/6 cadratin (6-per-em)
\u2007 esp. nombre/tabulaire (figure space)
\u2008 esp. de ponctuation (punctuation space)
\u2009 esp. fine (thin space)
\u200a esp. ultrafine (hair space)
\u2000 esp. 1/2 cadratin (en quad)
\u200c antiliant sans chasse (0 width non-joiner)
\u200d liant sans chasse (0 width joiner)
\u205f esp. moyenne mathématique (med. math. space)
\u2063 séparateur invisible (invisible separator)
\u2009 <cmd> tab. horizontale (\t)
\u2008 <cmd> espace arrière
\u2007 <cmd> sonnerie
\u2003 <cmd> fin de texte
\u000d <cmd> retour de chariot (\r  : saut de para, colonne, bloc, etc.)
\u000a <cmd> changement de ligne (\n)
\u200b espace sans chasse (0 width space)
---
\u2022 puce (bullet)
\u2026 pts de suspention (hellip)
\u00b6 pied-de-mouche (pilcrow sign)
\u00a7 parag/alinea (section sign)
\u00a9 copyright (copy)
\u00ae marque deposee (reg)
\u2122 marque de commerce (TM)
\u00b0 degre (deg)
\u25cc cercle en pointille ???

\u002d trait d'union (hyphen-minus)
\u2014 tiret cadratin (em dash)
\u2013 tiret 1/2 cadratin (en dash)
\u00ad trait d'union virtuel (soft hyphen)
\u2011 trait d'union insécable (NB hyphen)


\u00ab &laquo;
\u00bb &raquo;
\u201c &ldquo;
\u201d &rdquo;
\u2018 &lsquo;
\u2019 &rsquo;




NB :
<060C>	 pour une recherche inDesign en mode texte
\x{60C}	 pour une recherche inDesign en mode GREP, si notation commence par des zéros, les oter
==========================


<009C>	à remplacer par œ 0156 (e dans l'o)
<0092>	à remplacer par ’ 0146 (rsquo)
	//	<02BB>	à remplacer par * 0699 ? (&#699;) = Turned Comma 	(*pas de caractère, ressemble à ‘ 0145)
		<02BC>	à remplacer par * 0700 ? (&#700;) = apostrophe 		(*pas de caractère, ressemble à ’ 0146)
<2018>	à remplacer par ‘ (U+2018 &#8216;) Left Single Quotation Mark
<2019>	à remplacer par ’ (U+2019 &#8217;) Right Single Quotation Mark
<201B>	à remplacer par "?" (U+201B &#8219;) Single High-Reversed-9 Quotation Mark ('virgule' haute, ressemble a un P)
<201C>	à remplacer par “ (U+201C &#8220;) Left Double Quotation Mark
<201D>	à remplacer par ” (U+201D &#8221;) Right Double Quotation Mark
<0096>	à remplacer par – 0150 (mdash)


Espaces :
<00A0>	à remplacer par " " (U+00A0 &#160;) No-Break Space (~S ^S)
- utilisé dans inDesign comme "espace insécable à largeur fixe" :
<202F>	à remplacer par "?" (U+202F &#8239;) Narrow No-Break Space (~s ^s)

+

<2000>	à remplacer par " " (U+2000 &#8192;) En Quad (1/2 cadratin)
<2001>	à remplacer par " " (U+2001 &#8193;) Em Quad (cadratin) (inD : espace sans alinéa)
<2002>	à remplacer par " " (U+2002 &#8194;) En Space (espace 1/2 cadratin)
<2003>	à remplacer par " " (U+2003 &#8195;) Em Space (espace cadratin)
<2004>	à remplacer par " " (U+2004 &#8196;) Three-Per-Em Space (1/3 cadratin)
<2005>	à remplacer par " " (U+2005 &#8197;) Four-Per-Em Space (1/4 cadratin)
<2006>	à remplacer par " " (U+2006 &#8198;) Six-Per-Em Space (1/6 cadratin)
<2007>	à remplacer par "?" (U+2007 &#8199;) Figure Space (? espace tabulaire, esp. nombre)
<2008>	à remplacer par "?" (U+2008 &#8200;) Punctuation Space
<2009>	à remplacer par "?" (U+2009 &#8201;) Thin Space (espace fine)
<200A>	à remplacer par "?" (U+200A &#8202;) Hair Space (espace ultrafine)
- utilisé dans inDesign comme "saut de ligne conditionnel" :
<200B>	à remplacer par "?" (U+200B &#8203;) Zero Width Space
<200C>	à remplacer par "?" (U+200C &#8204;) Zero Width Non-Joiner (antiliant sans chasse)
<200D>	à remplacer par "?" (U+200D &#8205;) Zero Width Joiner (liant sans chasse)


- utilisé dans inDesign comme "retrait jusqu'à ce point" :
<0007>	à remplacer par · (U+0007 &#7;) Sonnerie / Bell (~i ^i)
<0008>	à remplacer par · (U+0008 &#8;) Backspace, Espace arrière (~y ^y) = tab. de retrait droit
<0009>	à remplacer par 	 (U+0009 &#9;) Horizontal Tabulation (\t)


<00B7>	à remplacer par · (U+00B7 &#183;) Middle Dot


<00AD>	à remplacer par "" (U+00AD &#173;) Soft Hyphen (césure permise si nécessaire)
<2010>	à remplacer par - (U+2010 &#8208;) Hyphen
<2011>	à remplacer par - (U+2011 &#8209;) Non-Breaking Hyphen
<2012>	à remplacer par "?" (U+2012 &#8210;) Figure Dash (?)
<2013>	à remplacer par – (U+2013 &#8211;) En Dash
<2014>	à remplacer par — (U+2014 &#8212;) Em Dash
<2015>	à remplacer par "?" (U+2015 &#8213;) Horizontal Bar (plus grand que emdash)

<2020>	à remplacer par † (U+2020 &#8224;) Dagger
<2022>	à remplacer par • (U+2022 &#8226;) Bullet
<2026>	à remplacer par … (U+2026 &#8230; ? 133) Horizontal Ellipsis

*/

if (ln == 1) {
	switch (app.selection[0].constructor.name){
			case "Character": // Story
			case "Word": // Story
			case "Line": // Story
			case "Paragraph": // Story
			case "Text": // Story
			case "TextColumn":
			case "TextStyleRange": // Story
			case "Story": 
				// Set find grep preferences to find all paragraphs with the first selected paragraph style
				app.findChangeGrepOptions.includeFootnotes = false;
				app.findChangeGrepOptions.includeHiddenLayers = false;
				app.findChangeGrepOptions.includeLockedLayersForFind = false;
				app.findChangeGrepOptions.includeLockedStoriesForFind = false;
				app.findChangeGrepOptions.includeMasterPages = false;
				// corrections de base
				correctionsTypoInd(remplacements);
				// corrections preferences
				if (wSet.heures) correctionsTypoInd(remplacementsH);
				if (wSet.suppTabMultiples) correctionsTypoInd(suppTabMultiples);
				if (wSet.suppTabulations) correctionsTypoInd(remplTabulations);
				if (wSet.convSautsLignesForces) correctionsTypoInd(remplSautsLF_SautsL);
				if (wSet.suppSautsLignesForces) correctionsTypoInd(remplSautsLignesForces);
				if (wSet.suppSautsLignes) correctionsTypoInd(remplSautsLignes);
				if (wSet.dblesEspaces) correctionsTypoInd(remplEspaces);
				if (wSet.espacesDebLigne) correctionsTypoInd(suppEspacesDL);
				if (wSet.espacesFinLigne) correctionsTypoInd(suppEspacesFL);
				if (wSet.convDegreNumero) correctionsTypoInd(rempDegreNumero);
				if (wSet.convAccolades) correctionsTypoInd(omissionsTxt);
		break;
		/*
			case "TextFrame": // Spread
			case "InsertionPoint": // Story
			case "Rectangle":
			// alert(app.selection[0].constructor.name + "\nparent : " + app.selection[0].parent.constructor.name) ;
			// alert("Mauvaise sélection !");
			*/
			default:
				CreateDialog();
		break;
	}
	//	ancienne version :
	// app.selection[0].contents = correctionsTypo(app.selection[0].contents);
}
else {
	CreateDialog();
}

//---------------- VARIABLES/DONNEES -------------------------------------------

function getStored_wSet() {
	wSet = {};
	if (app.extractLabel("CM_" + wScriptName + "_" + wScriptVersion) !== "") {
		wSet = eval(app.extractLabel("CM_" + wScriptName + "_" + wScriptVersion));
	}
}


//-----------------------------------------------------------------------------
function CreateDialog() {
	var win = new Window("dialog", wScriptName + " - " + wScriptVersion);

	with (win) {
		alignment = ["fill", "fill"];
		
		
		// options
		//==================================
		var optionsPanel = add("panel", undefined, "Options :");
		with(optionsPanel){

			alignment = ["fill", "fill"];
			//alignChildren = "left";
			optionsPanel.orientation = "column";

			var groupeN1 = add("group");
			with(groupeN1) {
			
				groupeN1.orientation = "column";
				alignment = ["fill", "fill"];
				alignChildren = "left";
			
				var heuresCheckBox = add ("checkbox", undefined, "Ajouter les espaces aux heures");
					heuresCheckBox.value = (wSet.heures) ? wSet.heures : false;

				var suppTabMultiCheckBox = add ("checkbox", undefined, "Convertir les tabulations multiples en 1 tabulation");
					suppTabMultiCheckBox.value = (wSet.suppTabMultiples) ? wSet.suppTabMultiples : false;

				var suppTabCheckBox = add ("checkbox", undefined, "Convertir les tabulations en espaces");
					suppTabCheckBox.value = (wSet.suppTabulations) ? wSet.suppTabulations : false;

				var sautsLF_LCheckBox = add ("checkbox", undefined, "Convertir les sauts de ligne forcés en sauts de ligne");
					sautsLF_LCheckBox.value = (wSet.convSautsLignesForces) ? wSet.convSautsLignesForces : false;

				var suppSautsLignesForcesCheckBox = add ("checkbox", undefined, "Convertir les sauts de ligne forcés en espaces");
					suppSautsLignesForcesCheckBox.value = (wSet.suppSautsLignesForces) ? wSet.suppSautsLignesForces : false;

				var suppSautsLignesCheckBox = add ("checkbox", undefined, "Supprimer les sauts de lignes multiples");
					suppSautsLignesCheckBox.value = (wSet.suppSautsLignes) ? wSet.suppSautsLignes : false;

				var dblesEspacesCheckBox = add ("checkbox", undefined, "Supprimer les doubles espaces");
					dblesEspacesCheckBox.value = (wSet.dblesEspaces) ? wSet.dblesEspaces : false;

				var suppEspacesDebLigneCheckBox = add ("checkbox", undefined, "Supprimer les espaces en début de ligne");
					suppEspacesDebLigneCheckBox.value = (wSet.espacesDebLigne) ? wSet.espacesDebLigne : false;

				var suppEspacesFinLigneCheckBox = add ("checkbox", undefined, "Supprimer les espaces en fin de ligne");
					suppEspacesFinLigneCheckBox.value = (wSet.espacesFinLigne) ? wSet.espacesFinLigne : false;

				var degreCheckBox = add ("checkbox", undefined, "Remplacer n° (degré) par no si suivi d'un chiffre, numéro si précédé");
					degreCheckBox.value = (wSet.convDegreNumero) ? wSet.convDegreNumero : false;

				var convAccoladesCheckBox = add ("checkbox", undefined, "Convertir les (…) en […]");
					convAccoladesCheckBox.value = (wSet.convAccolades) ? wSet.convAccolades : false;
			}
		} // optionsPanel
		
		
		// boutons
		//==================================
		var okCancelGroup = add("group");
		with(okCancelGroup) {
				orientation = "row";
			var okBtn = add("button", undefined, "Ok", {name:"ok"});
			var cancelBtn = add("button", undefined, "Annuler", {name:"cancel"});
		}
		
		
	} // fin with(win)
	win.layout.layout();
	
	
	var myDialogResult = win.show();
	if (myDialogResult == 1) {
		
		wSet = {};
		// on recup les valeurs cochees
		wSet.heures = 					heuresCheckBox.value;
		wSet.suppTabMultiples = 		suppTabMultiCheckBox.value;
		wSet.suppTabulations = 			suppTabCheckBox.value;
		wSet.convSautsLignesForces = 	sautsLF_LCheckBox.value;
		wSet.suppSautsLignesForces = 	suppSautsLignesForcesCheckBox.value;
		wSet.suppSautsLignes = 			suppSautsLignesCheckBox.value;
		wSet.dblesEspaces = 			dblesEspacesCheckBox.value;
		wSet.espacesDebLigne = 			suppEspacesDebLigneCheckBox.value;
		wSet.espacesFinLigne = 			suppEspacesFinLigneCheckBox.value;
		wSet.convDegreNumero = 			degreCheckBox.value;
		wSet.convAccolades = 			convAccoladesCheckBox.value;
		
		// on les enregistre
		app.insertLabel("CM_" + wScriptName + "_" + wScriptVersion, wSet.toSource());
	}
}
