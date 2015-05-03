/*
DESCRIPTION: Convert numbers to text from GREP expression
// need $1
Wosven
May 2015



1. Use the current find GREP expression and add a condition "numbers".
	  	   ----------------------------
	If there's no GREP expression, use by default : 
	(?<=[^\\d])(\\d+)(?=[^\\d])	

		It means : 
		(\\d+) = find any number(s) (= result expression $1)
		(?<=[^\\d]) = preceded by "not a number"
		(?=[^\\d]) = followed by "not a number"

2. Add text (_numbers2text_) and apply a condition "characters".

3. Replace _numbers2text_ by "number to characters" result.

If the 2 character styles exist ("numbers" AND "characters"), the script apply them to conditions "numbers" and "characters".
(useful to test)


IMPORTANT :
	If there's no expression, the script use this one :
		(?<=[^\\d])(\\d+)(?=[^\\d])	
	it will process any number in the document.


TIP:
	Use GREP panel to test expressions, with styles and options, etc. 
	Make sure there's a $1 result
	
EXAMPLE:
	(?<=Chapter )(\d+)(?=[^\d])
	will search any number preceded by "Chapter "
*/

main();
function main(){
	if(app.documents.length > 0){
		var myObject = app.documents.item(0);
		var applyStyles = false;

		// search character styles to use (or don't use them)
		try {
			if (app.activeDocument.characterStyles.itemByName("characters").isValid == true
			 && app.activeDocument.characterStyles.itemByName("numbers").isValid == true) {
				var styleChar = app.activeDocument.characterStyles.itemByName("characters") ;
				var styleNb = app.activeDocument.characterStyles.itemByName("numbers") ;
				applyStyles = true;
			}
		}
		catch(e) {
			alert(e);
		}
		// if you don't want the characters style applied, uncomment this line :
		// applyStyles = false;
		
		
		// search conditions "characters" and "numbers" (or create them)
		try {
			if (app.activeDocument.conditions.itemByName("characters").isValid == false)
				var condChar = app.activeDocument.conditions.add({name:"characters"});
			else
			var condChar = app.activeDocument.conditions.itemByName("characters") ;
			if (app.activeDocument.conditions.itemByName("numbers").isValid == false)
				var condNb = app.activeDocument.conditions.add({name:"numbers"});
			else
			var condNb = app.activeDocument.conditions.itemByName("numbers") ;
		}
		catch(e) {
			alert(e);
		}
		
		app.findTextPreferences = app.changeTextPreferences = null;
		app.findTextPreferences.findWhat = "_numbers2text_";
		
		
		if (app.findGrepPreferences.findWhat == "") {
			app.findGrepPreferences.findWhat = "(?<=[^\\d])(\\d+)(?=[^\\d])";
		}
		app.changeGrepPreferences.changeTo = "$1_numbers2text_";
	
		var GREPresultats = myObject.findGrep();
		var remplacements = [];
		if (GREPresultats.length > 0) {
			// part 1 : apply style numbers
			for (var r = 0, ln = GREPresultats.length; r < ln; r++) {
				if (applyStyles) GREPresultats[r].applyCharacterStyle( styleNb, true );
				GREPresultats[r].applyConditions( condNb );
				remplacements[r] = numberToText (GREPresultats[r].contents);
			}
			myObject.changeGrep();
				
			// part 2 : add characters
			var TXTresultats = myObject.findText();
			if (TXTresultats.length == remplacements.length) {
				for (var t = 0, lt = TXTresultats.length; t < lt; t++) {
					TXTresultats[t].applyConditions ([condChar], true) ;
					if (applyStyles) TXTresultats[t].applyCharacterStyle( styleChar, true );

					TXTresultats[t].contents = remplacements[t];
				}
			}
		}
		else{
			//Nothing was found
			alert("No results.");
		}
	}
	else{
		alert("Please open a document.");
	}
}
	
// function from 
//Convert Page Number Placeholder '#' into Text
// A Jongware Script 11-Dec-2011  
function numberToText (number)  
{  
          var ones = [ "zero", "one", "two", "three", "four", "five",  
                    "six", "seven", "eight", "nine", "ten",  
                    "eleven", "twelve", "thirteen", "fourteen", "fifteen",  
                    "sixteen", "seventeen", "eighteen", "nineteen" ];  
          var tens = [ "zero", "ten", "twenty", "thirty", "fourty", "fifty",  
                    "sixty", "seventy", "eighty", "ninety" ];  
          var result = '';  
  
  
          if (number < 0)  
                    return "ha ha";  
          if (number == 0)  
                    return ones[0];  
  
  
          if (number >= 1000)  
          {  
                    thousand = Math.floor(number/1000);  
                    result = numberToText (thousand) + " thousand";  
                    number = number - 1000*thousand;  
                    if (number > 0)  
                              result = result + " ";  
          }  
          if (number >= 100)  
          {  
                    hundred = Math.floor(number/100);  
                    result = result + ones[hundred]+" hundred";  
                    number = number - 100*hundred;  
                    if (number != 0)  
                              result = result + " and ";  
          }  
          if (number >= 20)  
          {  
                    ten = Math.floor(number/10);  
                    result = result + tens[ten];  
                    number = number - 10*ten;  
                    if (number != 0)  
                              result = result + "-";  
          }  
          if (number != 0)  
                    result = result + ones[number];  
          return result;  
}  