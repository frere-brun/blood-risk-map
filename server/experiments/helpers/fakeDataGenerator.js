    // For debugging
    // =============================

    function generateRandomFloat(min, max) {
        return (Math.random() * (max - min) + min).toFixed(4);
    };

    function generateRandomInt(min, max) {
            return Math.floor( Math.random() * ( 1 + max - min ) ) + min;
    }

    function generateRandomName()
    {
        var text = "";
        var consonnes = "bcdfghjklmnpqrstvwxz";
        var voyelles = "aeiouy";

        for( var i=0; i < 5; i++ ) {
            if (i % 2)
                text += consonnes.charAt(Math.floor(Math.random() * consonnes.length));
            else
                text += voyelles.charAt(Math.floor(Math.random() * voyelles.length));
        }

        text = text.charAt(0).toUpperCase() + text.slice(1);

        return text;
    }
    var fakeData = [];

    for (var i=0; i<500; i++) {
        fakeData.push({
                            "id":i,
                            "name": generateRandomName(),
                            "sector": generateRandomInt(0,7),
                            "position": {
                              "lat": generateRandomFloat(47.500,49.500),
                              "lng": generateRandomFloat(4.100,7.200)
                            },
                            "logoSrc": "../assets/imgs/pngs/scope-logo.png",
                            "backgroundSrc": "../assets/imgs/background.jpg",
                            "info": {
                              "details": "Spécialisée dans le secteur d'activité de la taille, façonnage et finissage de pierres. ",
                              "form": "SCOP exploitée sous forme de SARL",
                              "adress": "55 Rue principale 67140 Saint Pierre France",
                              "siret": "91572151800016",
                              "size": "3 à 5 salariés"
                            },
                            "media": {

                            },
                            "activites": {

                            },
                            "contact": {
                              "website": "www.tfrere.fr",
                              "email": "ecrire@tfrere.fr",
                              "adress": "55 Rue principale 67140 Saint Pierre France",
                              "tel": "0659578609",
                              "open": "Du lundi au vendredi de 13h à 16h"
                            }
                          });
    }

    console.log(JSON.stringify(fakeData));
