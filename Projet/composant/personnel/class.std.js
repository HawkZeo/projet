﻿/* 
 * Définition de la classe Std : Ensemble des fonctions standards
 *
 * Fichier : js/class.std.js
 * Version : 2018.7
 * Auteur : Guy Verghote
 * Date mise à jour : 19/08/2018
 *
 */

// --------------------------------------------
// ajout de méthodes sur la classe String
// --------------------------------------------


/*
 * Contrôle si la valeur du champ respecte le motif accepté par ce champ
 * la fonction est bloquante : si le type n'existe pas la fonction retourne faux ce qui bloque la validation
 * paramètre
 *   unFormat : Format à respecter
*/

String.prototype.respecterLeFormat = function (unFormat) {
    let regex = '';
    let tab = [];
    let correct = false;
    switch (unFormat) {
        case 'email':
            correct = /^[0-9a-zA-Z]([-_\.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_\.]?[0-9a-zA-Z])*[\.][a-zA-Z]{2,4}$/.test(this);
            break;
        case 'entier':
            correct = /^[-+]?[0-9]+$/.test(this);
            break;
        case 'chiffre':
            correct = /^[0-9]+$/.test(this);
            break;
        case 'numero':
            correct = /^[0-9A-Z]+$/.test(this);
            break;
        case 'reel':
            correct = /^[-+]?[0-9]+(\.[0-9]+)?$/.test(this);
            break;
        case 'tel':
            correct = /^([0][1-9]([\.\_\/\-\s]?[0-9]{2}){4})?$/.test(this);
            break;
        case 'dateFr':
            tab = /^(\d{1,2})[-/.](\d{1,2})[-/.](\d{4})$/.exec(this);
            correct = !(tab == null);
            if (correct) {
                correct = Std.dateValide(tab[1], tab[2], tab[3]);
            }
            break;
        case 'dateMysql':
            tab = /^(\d{4})[-/.](\d{1,2})[-/.](\d{1,2})$/.exec(this);
            correct = !(tab == null);
            if (correct) {
                correct = Std.dateValide(tab[3], tab[2], tab[1]);
            }
            break;
        case 'temps' : // [hh]:mm:ss autres séparateurs . ou ,
            correct = /^([0-9]{1,2}[.,:]?)?[0-5][0-9][.,:]?[0-5][0-9]$/.test(this);
            break;
        case 'url':
            // correct = /^http(s)?:\/\/[0-9a-zA-Z\-\_.]+([.0-9a-zA-Z\-\_])?[.][a-zA-Z]{2,4}/.test(this);
            correct = /^((http:\/\/|https:\/\/)?(www.)?(([a-zA-Z0-9-]){2,}\.){1,4}([a-zA-Z]){2,6}(\/([a-zA-Z-_\/\.0-9#:?=&;,]*)?)?)/.test(this);
            break;
        case 'password' :
            correct = /(?=.*[a-z]+)(?=.*[A-Z]+)(?=.*[0-9]+)(?=.*[()=+?!'$.%;:@&*#/\\-]+).{8,}$/.test(this);
        // ?= indique une recherche sans avancer dans la chaine  : on recommence toujours depuis le début
    }
    return correct;
}


// enlever les Accents
//  en normalisant la chaine dans le jeu de caractère unicode, la lettre et son accent sont décomposés en deux codes
//  tous les accents sont codés entre 0300 et 036f, il suffit donc de les remplacer par une chaîne vide
// https://stackoverflow.com/questions/990904/remove-accents-diacritics-in-a-string-in-javascript
String.prototype.enleverAccent = function () {
    return this.normalize('NFD').replace(/[\u0300-\u036f]/g, "");
}

// Sous Windows les caractères suivants ne peuvent être utilisés dans le nom d'un fichier
// < > " / | ? * : \
String.prototype.remplacerCaractereDos = function () {
    return this.replace(/([<>"/|?*\\:]{1})/g, ' ').trim();
}

// enlever les accents remplacer tous les caractères non alphanumériques à l'exception du point
String.prototype.remplacerCaractereNonAlpha = function () {
    // les autres caractères non alphanumériques sont remplacés par un espace
    return this.enleverAccent().replace(/([^.a-z0-9 ]{1})/ig, ' ').trim();
}

// ancienne version
String.prototype.remplacerCaractereNonAlpha2 = function () {
    let lesCaracteresAccentues = [
        /[\300-\306]/g, /[\340-\346]/g, // A, a
        /[\310-\313]/g, /[\350-\353]/g, // E, e
        /[\314-\317]/g, /[\354-\357]/g, // I, i
        /[\322-\330]/g, /[\362-\370]/g, // O, o
        /[\331-\334]/g, /[\371-\374]/g, // U, u
        /[\321]/g, /[\361]/g, // N, n
        /[\307]/g, /[\347]/g, // C, c
    ];
    let lesCaracteresNonAccentues = ['A', 'a', 'E', 'e', 'I', 'i', 'O', 'o', 'U', 'u', 'N', 'n', 'C', 'c'];

    let resultat = this;
    for (let i = 0; i < lesCaracteresAccentues.length; i++) {
        resultat = resultat.replace(lesCaracteresAccentues[i], lesCaracteresNonAccentues[i]);
    }

    // les autres caractères non alphanumériques sont remplacés par un espace
    resultat = resultat.replace(/([^.a-z0-9 ]{1})/ig, ' ');
    return resultat;
}


// --------------------------------------------
// ajout de méthodes sur la classe Date
// --------------------------------------------

// retourne l'objet date sous la forme jj/mm/aaaa
Date.prototype.getDateFr = function () {
    let jour = this.getDate()
    let mois = this.getMonth() + 1
    result = ("0" + jour).slice(-2) + "/" + ("0" + mois).slice(-2) + "/" + this.getFullYear();
    return result;
}

// retourne l'objet date sous la forme aaaa-mm-jj
Date.prototype.getDateMysql = function () {
    let jour = this.getDate()
    let result = "";
    let mois = this.getMonth() + 1
    result = this.getFullYear() + "-" + ("0" + mois).slice(-2) + "-" + ("0" + jour).slice(-2);
    return result;
}


// retourne l'objet date sous la forme jjjj jj/mm/aaaa
Date.prototype.getDateLong = function () {
    let jour = this.getDate()
    let result = "";
    // récupération du numéro de jour dans la semaine (0 à 6)
    indiceJour = uneDate.getDay();
    // récupération du jour
    jour = uneDate.getDate();
    // ajout éventuel du 0 non significatif 08
    jour = ("0" + jour).slice(-2);
    mois = uneDate.getMonth();
    annee = uneDate.getFullYear();
    lesJours = new Array("dimanche", "lundi", "mardi", "mercredi", "jeudi", "vendredi", "samedi");
    lesMois = new Array("janvier", "février", "mars", "avril", "mai", "juin", "juillet", "aout", "septembre", "octobre", "novembre", "décembre");
    return lesJours[indiceJour] + " " + jour + " " + lesMois[mois] + " " + annee;
}

// retourne le jour en lettre
Date.prototype.getJourEnLettre = function () {
    // récupération du numéro de jour dans la semaine (0 à 6)
    let indiceJour = this.getDay();
    let lesJours = ["dimanche", "lundi", "mardi", "mercredi", "jeudi", "vendredi", "samedi"];
    return lesJours[indiceJour];
}


//  retire la partie horaire de l'objet date
Date.prototype.delTime = function () {
    this.setHours(0);
    this.setMilliseconds(0);
    this.setMinutes(0);
    this.setSeconds(0);
}


// --------------------------------------------
// Définition de la classe Std
// --------------------------------------------

class Std {

    /*
     * Afficher un message dans une zone définie de la page
     * paramètre
     * @param {string} idZone valeur de l'attribut id du conteneur dans lequel le message sera affiché
     * @param {string}  message texte du message
     * @param {string}  classe classe bootstrap de mise en forme 'alert alert-success' ..
     * @param {number}  duree : temps d'affichage en seconde
     */
    static afficherMessage(idZone, message, classe, duree) {
        let zone = $('#' + idZone);
        zone.hide();
        let contenu = "<div id='leMessage' class='alert alert-dismissable " + classe + "'>";
        contenu += "<button type='button' class='close' data-dismiss='alert' aria-hidden='true'>&times;</button>";
        contenu += message + "</div>";
        zone.html(contenu);
        zone.slideDown("slow");
        if (duree > 0) {
            zone.delay(duree * 1000).slideUp("slow");
        }
    }


    /*
     * Création d'un cookie servant de signature pour les appels de script php
     * afin d'éviter un appel direct du fichier
     */
    static signerRequete() {
        let dtExpire = new Date();
        dtExpire.setTime(dtExpire.getTime() + 15 * 1000);
        document.cookie = 'ajax=1;expires=' + dtExpire.toGMTString();
    }

    /*
     * Activer le composant bootstrap infobulle
     *
     */
    static activerLesInfobulles() {
        $('.infobulle').tooltip();
        $('.infobulleB').tooltip({placement: 'bottom'});
        $('.infobulleD').tooltip({placement: 'right'});
        $('.infobulleG').tooltip({placement: 'left'});
    }

    /*
     * Activer le composant zebra datePicker class='calendrier'
     *
     */
    static activerLeCalendrier() {
        $(".calendrier").Zebra_DatePicker({
            readonly_element: false,
            show_clear_date: false,
            show_select_today: false,
            format: 'd/m/Y',
            offset: [0, 205],  // positionnement de coin inférieur droit du calendrier relativement au coin supérieur gauche du conteneur
            select_other_months: true,
            show_week_number: false,
            months: ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Aout', 'Septembre', 'Octobre', 'Novembre', 'Décembre'],
            days: ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi']
        });
    }

    /*
     * Activer le composant bootstap popover
     *
     */
    static activerLesPostit() {
        $('.postit').mouseover(function () {
            $(this).popover('show')
        }).mouseout(function () {
            $(this).popover('hide')
        });
        // activation sur les éléments disposant d'un attribut data-toggle ayant la valeur popover
        // le paramètre container permet d'indiquer que la zone d'affichage n'est pas limitée à la taille du conteneur
        $('[data-toggle="popover"]').popover({container: 'body'});
    }

    /*
     * conversion d'un nombre exprimé en octet en ko, Mo ou Go
     * 
     * @param {number} nb nombre représentant un nombre d'octets
     * @param {string} unite : unité souhaitée : Ko Mo ou Go
     * @return {number}  nombre exprimé dans l'unité avec une mise en forme par groupe de 3
     */

    static conversionOctet(nb, unite) {
        let diviseur = 1;
        switch (unite) {
            case "Ko" :
                diviseur = 1024;
                break;
            case "Mo" :
                diviseur = 1024 * 1024;
                break;
            case "Go" :
                diviseur = 1024 * 1024 * 1024;
                break;
            default :
                unite = "o";
                break;
        }
        nb = Math.round(nb / diviseur, 3);
        let str = nb.toString();
        let result = str.slice(-3);
        str = str.substring(0, str.length - 3);  // sans les trois derniers
        while (str.length > 3) {
            let elt = str.slice(-3);
            result = elt.concat(" ", result);
            str = str.substring(0, str.length - 3);
        }
        result = str.concat(" ", result, " ", unite);
        return result;
    }


    /*
        encoder les apostrophes
        https://stackoverflow.com/questions/18251399/why-doesnt-encodeuricomponent-encode-single-quotes-apostrophes
     */

    static encoder(str) {
        return encodeURIComponent(str).replace(/[!'()*]/g, function (c) {
            return '%' + c.charCodeAt(0).toString(16);
        });
    }

    /**
     * fonction de récupération des paramètres GET de la page
     *
     * @return {array} Tableau associatif contenant les paramètres GET
     */
    static getLesParametresUrl() {
        // Search retourne ?nom=valeur&nom=valeur...
        let lesCouplesNonValeur = location.search.substring(1).split('&');
        let lesParametres = [];
        for (let i = 0; i < lesCouplesNonValeur.length; i++) {
            let lesCouples = lesCouplesNonValeur[i].split('=');
            lesParametres[lesCouples[0]] = lesCouples[1];
        }
        return lesParametres;
    }

    /*
    * retourne vrai si année bissextile
    * Paramètre
    *  annee : année à tester
    */

    static estBissextile(annee) {
        return ((annee % 4 === 0) && ((annee % 100 !== 0) || (annee % 400 === 0)));
    }

    /*
     * retourne le nombre de jours d'un mois donné
     */

    static nbjMois(mois, annee) {
        if (mois === 2) return Std.estBissextile(annee) ? 29 : 28;
        if (mois === 4 || mois === 6 || mois === 9 || mois === 11) return 30;
        return 31;
    }

    /*
     * retourne vrai si la date est valide
     */

    static dateValide(unJour, unMois, uneAnnee) {
        let mois = parseInt(unMois, 10);
        let jour = parseInt(unJour, 10);
        let annee = parseInt(uneAnnee, 10);
        return mois >= 1 && mois <= 12 && jour >= 1 && jour <= Std.nbjMois(mois, annee) && annee >= 1900;
    }
}