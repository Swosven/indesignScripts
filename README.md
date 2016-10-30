# indesignScripts

- #### addConditions_numbers_to_characters.jsx

  Search for numbers and :
  - add condition "numbers" (conditionnal text)
  - add text (as _numbers2text_, this will be replace by value of number to text function) with condition "characters"

  Depends of last GREP search parameters (styles, color...)
  
  Use last GREP expression used or search for any number (need a $1 result)


- #### en_Apply_Object_Styles_Text.jsx

  Apply paragraph styles (and next) from object's style to frames (and linked/threaded frames).

  USE OPTIONS : 
  - Next style from paragraph style  
  - Apply paragraph style from object style 
  - 
    -> Apply next paragraph styles from object style   

  Styles suite = paragraph style (and next if checked) from object style, if options are CHECKED.  

  DEPENDING FROM SELECTION : 
  - MULTI-FRAMES : Apply to each frame its own styles suite.  
  - FRAME SOLO : Apply its own styles suite.  
  - CURSOR : To each frames (if linked frames) apply its own styles suite.  
  - TEXT (words, paras, whole text, etc.) : 1st paragraph style to 1st paragraph, and next styles to next selected paragraphs.  
  - 1 LINE : The styles suite of this line's parent's (frame) object's style, apply to this story.  
  - 1 WORD : If linked frames, the 1st frame's object's style suite apply to the story.  
  - PARAGRAPHS : Apply next paragraph styles from 1st selected paragraph (cf. TEXT). 


- #### en_change_Paragraphs_Styles.jsx

  Replace 2 consecutive paragraph styles with 2 other styles
  
  option for searching in first paragraph style (text or GREP)
  
  and option to delete overrides (character styles, bold, italic...) not include in paragraph styles
  Search in story or selected text


- #### en_copy_Styles_GREP-Nested-Lines.jsx

  Help to select and get back/save GREP styles, nested styles or lines styles in a texte file
  
  Help to copy those saved styles in selected paragraph styles from current document
  
  Saved styles can be deleted from list

  You need to click "Save", "Copy" or "Delete" first, to confirm action
  
  need text file in same folder : en_copy_listStyles.txt
  
- #### en_copy_listStyles.txt

  Use by en_copy_Styles_GREP-Nested-Lines.jsx

===========================================================


- #### fr_Appliquer_Styles_Objet_Texte.jsx

  Applique les styles de paragraphes et suivants

  UTILISE LES OPTIONS :
  - Style suivant du style de paragraphe
  - Appliquer style de paragraphe du style d'objet
    -> Appliquer les styles de paragraphe suivants du style d'objet

  Suite de styles = le style de paragraphe (et suivants si cochés)
          du style d'objet, si les options sont COCHÉES.
  
  7 USAGES SELON LA SÉLECTION :
  - MULTI-BLOCS : Applique à chaque bloc sa propre suite de styles.
  - BLOC SOLO :  Lui applique sa suite de styles.
  - CURSEUR : À chaque bloc (si plusieurs liés) sa suite de styles.
  - TEXTE (mots, paras, tout le texte, etc.) : Style du 1er paragraphe au 1er paragraphe, et les styles suivants (du style de paragraphe) aux autres paragraohes de la sélection.
  - 1 LIGNE : La suite de styles du bloc de cette ligne à l'article complet.
  - 1 MOT : La suite de styles du bloc de départ à l'article complet.
  - PLUSIEURS PARAGRAPHES : Applique les styles suivants du style de paragraphe de tête (cf. TEXTE).


- #### fr_changer_Styles_de_Paragraphe.jsx

  Permet de changer les styles de paragraphes consécutifs
  
  avec l'option de chercher dans le contenu du 1er style (recherche GREP ou texte)
  
  et l'option de supprimer les styles de caractères ou styles (gras, italic...) ne correspondant pas au style de paragraphe.
  
  Permet de chercher dans le texte complet (dans ce cas sélectionne automatiquement les styles (1) et (2))
  
  Ou seulement dans la sélection (choisir manuellement les styles (1) et (2))


- #### fr_copier_Styles_Grep-Imbr-Lignes.jsx

  Permet de sélectionner et récupérer/enregistrer les styles GREP, imbriqués, de ligne dans un fichier texte
  
  Permet de coller les styles enregistrés dans les styles de paragraphes choisis du document ouvert.
  
  Permet de supprimer des styles de la liste pré-enregistrée
   
  Nécessite de valider l'action avant de valider le script (boutons "Enregister" ou "Transférer")
  
  Utilise le fichier texte (dans le même dossier) : fr_copier_listeStyles.txt
  
  
- #### fr_copier_listeStyles.txt

    Utilisé par fr_copier_Styles_Grep-Imbr-Lignes.jsx


- #### addConditions_numbers_to_characters.jsx

  Utilise la dernière recherche GREP pour appliquer une condition (texte conditionnel) "numbers"

  Recherhce des chiffres et :
  - y ajoute la condition "numbers" (conditionnal text)
  - ajoute du texte (avec _numbers2text_, qui remplace les chiffres par leur équivalent en texte) en ajoutant la condition "characters"

  Utilise les derniers paramètres utilisés pour une recherche GREP (styles, couleur...)

  Utilisera la dernière expression GREP utilisée, ou tout nombre (nécessite de remplacer par l'expression $1)
  
  *Exemple :
  Faire une recherche GREP "(?<=Chapitre )(\d+)" en style de paragraphe "Titre", avec remplacement par "$1"
  
  Lancer le script.
  
  Il créera automatiquement 2 conditions :
  - texte conditionnnel "numbers" qui contient les numéros de chapitre en chiffres
  - texte conditionnel "characters" qui contient l'équivalent des chiffres en texte

  Selon le texte conditionnel sélectionné, les titre de chapitre seront affichés en chiffres ou en lettres


  
